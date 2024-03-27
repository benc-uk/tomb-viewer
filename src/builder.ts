// =============================================================================
// Project: WebGL Tomb Raider
// Builds the 3D world from a Tomb Raider level file
// =============================================================================

import { Context, Instance, Material, ModelBuilder, Stats, TextureCache, XYZ, Node, Model, RGB } from 'gsots3d'

import { entityAngleToDeg, isWaterRoom, trVertToXZY, mesh, ufixed16ToFloat, level, colour15ToRGB, version, tuple } from './lib/types'
import { entityEffects, fixVines, pickupSpriteLookup } from './lib/versions'
import { getRegionFromBuffer, textile16ToBuffer, textile8ToBuffer } from './lib/textures'
import { isEntityInCategory } from './lib/entity'
import { parseLevel } from './lib/parser'
import { getLevelFile, loadingDelay } from './lib/misc'
import { AppConfig } from './config'
import { CUST_PROG_MESH } from './main'

const MAX_LIGHTS = 8

type SimpleLight = {
  pos: XYZ
  intensity: RGB
  maxDist: number
}

type AnimatedTexture = {
  material: Material
  objTexIds: number[]
  textures: WebGLTexture[]
}

let ctx: Context
let config: AppConfig

// Global data structures for the world
let spriteMaterials = new Map<number, Material>()
let tileBuffers = new Array<Uint8Array>()
let materials = new Array<Material>()
let materialsBlend = new Array<Material>()

export async function buildWorld(configIn: AppConfig, ctxIn: Context, levelName: string) {
  // Store the config and context for later
  config = configIn
  ctx = ctxIn

  ctx.removeAllInstances()

  const data = await getLevelFile(levelName)
  console.log('💽 Loading file: ' + levelName)

  // Kinda important! Parse the level data into a TR level data structure
  const level = parseLevel(data)
  level.levelName = levelName

  // Clear the world, lights and texture cache for when we load a new level
  ctx.removeAllInstances()
  ctx.lights = []
  TextureCache.clear()

  console.log(`✨ Level data parsing complete, building world...`)

  // Create all materials one for each tex-tile
  materials = new Array<Material>()
  materialsBlend = new Array<Material>()
  tileBuffers = new Array<Uint8Array>() // We keep buffer versions too, for turning into sprites
  spriteMaterials = new Map<number, Material>()

  // For our own light system, we need to keep track of the lights in each room
  const roomLights = new Map<number, SimpleLight[]>()
  // Animated textures require special handling
  const animTextures = new Array<AnimatedTexture>()

  // Gather all the textiles (texture tiles) into materials and usable texture maps
  if (level.version === version.TR1) {
    for (const textile of level.textiles) {
      const buffer = textile8ToBuffer(textile, level.palette)
      const mat = Material.createBasicTexture(buffer, config.textureFilter, false)
      materials.push(mat)
      tileBuffers.push(buffer)
    }
  } else {
    for (const textile of level.textiles16) {
      const buffer = textile16ToBuffer(textile)
      const mat = Material.createBasicTexture(buffer, config.textureFilter, false)
      materials.push(mat)

      const matBlend = Material.createBasicTexture(buffer, true, false)
      matBlend.additiveBlend = true
      materialsBlend.push(matBlend)

      tileBuffers.push(buffer)
    }
  }

  // Create all animated texture materials
  // TODO: Needs a complete rethink ground up if this is to work with TR3
  console.log(`💃 Creating ${level.animatedTextures.length} animated textures...`)
  for (const animTex of level.animatedTextures) {
    const textures = new Array<WebGLTexture>()
    for (const objTexId of animTex.objTexIds) {
      const objTex = level.objectTextures[objTexId & 0x3fff]
      if (!objTex) {
        console.error(`💥 Error: Missing object texture ${objTexId} in animated texture`)
        continue
      }

      const texTileIndex = objTex.tileAndFlag & 0x3fff

      const u1 = ufixed16ToFloat(objTex.vertices[0].x)
      const v1 = ufixed16ToFloat(objTex.vertices[0].y)
      const u2 = ufixed16ToFloat(objTex.vertices[1].x)
      //const v2 = ufixed16ToFloat(objTex.vertices[1].y)
      //const u3 = ufixed16ToFloat(objTex.vertices[2].x)
      const v3 = ufixed16ToFloat(objTex.vertices[2].y)
      //const u4 = ufixed16ToFloat(objTex.vertices[3].x)
      //const v4 = ufixed16ToFloat(objTex.vertices[3].y)

      const x = Math.round(u1)
      const y = Math.round(v1)
      const width = Math.abs(Math.round(u2 - u1))
      const height = Math.abs(Math.round(v3 - v1))

      // Snip the section, from the larger textile image texture
      try {
        const buffer = getRegionFromBuffer(tileBuffers[texTileIndex], x, y, width, height, 256)
        const tex = TextureCache.instance.getCreate(buffer, config.textureFilter, false, 'anim_text_' + objTexId)
        textures.push(tex!)
      } catch (e) {
        // console.error(`💥 Error: Snipping animated texture failed, ${e}`)
        // console.error(`💥 Error: ${u1},${v1} ${u2},${v2} ${u3},${v3} ${u4},${v4}`)
      }
    }

    const m = new Material()
    m.diffuseTex = textures[0]

    animTextures.push({
      material: m,
      textures,
      objTexIds: animTex.objTexIds,
    })
  }

  // Nodes to hold the rooms + sprites, static meshes
  // Meta data is used to store alternate room info and state
  const roomNodes = new Map<number, Node>()

  // Core loop - build all room geometry
  for (let roomNum = 0; roomNum < level.rooms.length; roomNum++) {
    // for (let roomNum = 7; roomNum < 8; roomNum++) {
    const room = level.rooms[roomNum]
    const roomX = room.info.x
    const roomZ = room.info.z

    const roomNode = new Node()
    roomNodes.set(roomNum, roomNode)
    roomNode.position = [roomX, 0, -roomZ]

    // Find the alternate room pairs
    if (room.alternateRoom !== -1) {
      roomNode.metadata.altRoom = room.alternateRoom
    }

    const builder = new ModelBuilder()

    // Add a part to the room, one for each textile
    // This is part of the trick to get the right texture on the right part
    for (let i = 0; i < materials.length; i++) {
      const part = builder.newPart('roompart_' + i, materials[i])
      part.extraAttributes = {
        colour: { numComponents: 3, data: [] },
      }

      const part2 = builder.newPart('roompart_blend_' + i, materialsBlend[i])
      part2.extraAttributes = {
        colour: { numComponents: 3, data: [] },
      }
    }

    // All room rectangles
    for (const rect of room.roomData.rectangles) {
      const rv1 = room.roomData.vertices[rect.vertices[0]]
      const rv2 = room.roomData.vertices[rect.vertices[1]]
      const rv3 = room.roomData.vertices[rect.vertices[2]]
      const rv4 = room.roomData.vertices[rect.vertices[3]]

      const v1 = trVertToXZY(rv1.vertex)
      const v2 = trVertToXZY(rv2.vertex)
      const v3 = trVertToXZY(rv3.vertex)
      const v4 = trVertToXZY(rv4.vertex)

      // Texture coordinates are in the bizarrely named objectTextures

      // TR3 added dual-sided textures with a bit in 15, so we only use the first 14 bits
      const objTexture = level.objectTextures[rect.texture & 0x3fff]
      if (!objTexture) {
        console.error(`💥 Error: Missing rect texture ${rect.texture} in room ${roomNum}`)
        continue
      }

      // TR3 Only
      // const additiveBlend = objTexture.attribute === 2 ? true : false

      // First 14 bits (little endian) of tileAndFlag is the index into the textile array
      const texTileIndex = objTexture.tileAndFlag & 0x3fff

      // Get the UV of the four corners in objTexture.vertices
      let texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
      let texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
      let texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
      let texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
      let texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
      let texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256
      let texU4 = ufixed16ToFloat(objTexture.vertices[3].x) / 256
      let texV4 = ufixed16ToFloat(objTexture.vertices[3].y) / 256

      // Move the UV outwards from center to avoid texture bleeding
      // This is pretty much a hack, but I spent hours looking for a better way
      const uvPadding = 0.006
      const uvCenterX = (texU1 + texU2 + texU3 + texU4) / 4
      const uvCenterY = (texV1 + texV2 + texV3 + texV4) / 4

      // Mad hack to fix texture bleeding
      if (texU1 > uvCenterX) {
        texU1 -= uvPadding
      }
      if (texU1 < uvCenterX) {
        texU1 += uvPadding
      }
      if (texU2 > uvCenterX) {
        texU2 -= uvPadding
      }
      if (texU2 < uvCenterX) {
        texU2 += uvPadding
      }
      if (texU3 > uvCenterX) {
        texU3 -= uvPadding
      }
      if (texU3 < uvCenterX) {
        texU3 += uvPadding
      }
      if (texU4 > uvCenterX) {
        texU4 -= uvPadding
      }
      if (texU4 < uvCenterX) {
        texU4 += uvPadding
      }
      if (texV1 > uvCenterY) {
        texV1 -= uvPadding
      }
      if (texV1 < uvCenterY) {
        texV1 += uvPadding
      }
      if (texV2 > uvCenterY) {
        texV2 -= uvPadding
      }
      if (texV2 < uvCenterY) {
        texV2 += uvPadding
      }
      if (texV3 > uvCenterY) {
        texV3 -= uvPadding
      }
      if (texV3 < uvCenterY) {
        texV3 += uvPadding
      }
      if (texV4 > uvCenterY) {
        texV4 -= uvPadding
      }
      if (texV4 < uvCenterY) {
        texV4 += uvPadding
      }

      let v1Col: tuple, v2Col: tuple, v3Col: tuple, v4Col: tuple
      if (level.version === version.TR3) {
        v1Col = colour15ToRGB(rv1.colour)
        v2Col = colour15ToRGB(rv2.colour)
        v3Col = colour15ToRGB(rv3.colour)
        v4Col = colour15ToRGB(rv4.colour)
      } else {
        const v1L = lightAdjust(1 - rv1.lighting / 0x1fff)
        const v2L = lightAdjust(1 - rv2.lighting / 0x1fff)
        const v3L = lightAdjust(1 - rv3.lighting / 0x1fff)
        const v4L = lightAdjust(1 - rv4.lighting / 0x1fff)

        v1Col = [v1L, v1L, v1L]
        v2Col = [v2L, v2L, v2L]
        v3Col = [v3L, v3L, v3L]
        v4Col = [v4L, v4L, v4L]
      }

      // This trick gets the rectangle added to the right part with the matching textile
      let part = builder.parts.get('roompart_' + texTileIndex)

      // Special check for animated textures
      // Search all animTextures and the objectTextureIds for a match
      for (const animTex of animTextures) {
        if (animTex.objTexIds.includes(rect.texture & 0x3fff)) {
          if (!builder.parts.has('roompart_anim_' + rect.texture)) {
            const part = builder.newPart('roompart_anim_' + rect.texture, animTex.material)
            part.extraAttributes = {
              colour: { numComponents: 3, data: [] },
            }
          }

          part = builder.parts.get('roompart_anim_' + rect.texture)
          texU1 = 0
          texV1 = 0
          texU2 = 1
          texV2 = 0
          texU3 = 1
          texV3 = 1
          texU4 = 0
          texV4 = 1
          break
        }
      }

      if (part) {
        // Add the rectangle to the builder
        part.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])

        // We need to push light data for each vertex
        // AND we need to have data for both triangles in the rectangle, so 6 vertexes
        part.extraAttributes?.colour?.data.push(...v1Col, ...v4Col, ...v3Col, ...v1Col, ...v3Col, ...v2Col)

        // Added in TR3, the 15th bit means double-sided
        const isDoubleSided = rect.texture & 0x8000 ? true : false
        // isDoubleSided = isWaterRoom(room)
        if (isDoubleSided) {
          part.addQuad(v1, v2, v3, v4, [texU1, texV1], [texU2, texV2], [texU3, texV3], [texU4, texV4])
          part.extraAttributes?.colour?.data.push(...v1Col, ...v4Col, ...v3Col, ...v1Col, ...v3Col, ...v2Col)
        }
      }
    }

    // Now room triangles
    for (const tri of room.roomData.triangles) {
      const rv1 = room.roomData.vertices[tri.vertices[0]]
      const rv2 = room.roomData.vertices[tri.vertices[1]]
      const rv3 = room.roomData.vertices[tri.vertices[2]]

      const v1 = trVertToXZY(rv1.vertex)
      const v2 = trVertToXZY(rv2.vertex)
      const v3 = trVertToXZY(rv3.vertex)

      // Texture coordinates logic same as rectangles, same as before use 14 bits
      const objTexture = level.objectTextures[tri.texture & 0x3fff]
      if (!objTexture) {
        console.error(`💥 Error: Missing triangle texture ${tri.texture} in room ${roomNum}`)
        continue
      }

      const texTileIndex = objTexture.tileAndFlag & 0x3fff

      // Get the UV of the four corners in objTexture.vertices
      const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
      const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
      const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
      const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
      const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
      const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256

      let v1Col: tuple, v2Col: tuple, v3Col: tuple
      if (level.version === version.TR3) {
        v1Col = colour15ToRGB(rv1.colour)
        v2Col = colour15ToRGB(rv2.colour)
        v3Col = colour15ToRGB(rv3.colour)
      } else {
        const v1L = lightAdjust(1 - rv1.lighting / 0x1fff)
        const v2L = lightAdjust(1 - rv2.lighting / 0x1fff)
        const v3L = lightAdjust(1 - rv3.lighting / 0x1fff)

        v1Col = [v1L, v1L, v1L]
        v2Col = [v2L, v2L, v2L]
        v3Col = [v3L, v3L, v3L]
      }

      const part = builder.parts.get('roompart_' + texTileIndex)

      if (part) {
        part.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
        // We need to push light data for each vertex
        part.extraAttributes?.colour?.data.push(...v1Col, ...v3Col, ...v2Col)

        const isDoubleSided = tri.texture & 0x8000 ? true : false
        // isDoubleSided = isWaterRoom(room)
        if (isDoubleSided) {
          // Reverse the triangle to make it double-sided
          part.addTriangle(v1, v2, v3, [texU1, texV1], [texU2, texV2], [texU3, texV3])
          part.extraAttributes?.colour?.data.push(...v1Col, ...v2Col, ...v3Col)
        }
      }
    }

    // Add room lights, we bypass the GSOTS light system and use our own!
    const roomLightArray = []
    let lightCount = 0
    for (const light of room.lights) {
      // TR1 and TR2 have simple lights, we convert to intensity and greyscale RBG
      const intensity = Math.max(Math.min(1 - light.intensity / 0x1fff, 1), 0)
      let intensityRGB = [intensity, intensity, intensity]

      // TR3 has coloured lights! Convert 15-bit colour to RGB
      if (light.colour) {
        intensityRGB = [light.colour.r / 255, light.colour.g / 255, light.colour.b / 255]
      }

      // Add to the room light data array
      if (light.fade < 20000) {
        roomLightArray.push({
          pos: [light.x, -light.y, -light.z],
          intensity: intensityRGB,
          maxDist: light.fade,
        } as SimpleLight)
      }

      if (++lightCount >= MAX_LIGHTS) {
        break
      }
    }

    roomLights.set(roomNum, roomLightArray)

    // Build the room model and add it to the roomNode as a child instance
    try {
      ctx.buildCustomModel(builder, `room_${roomNum}`)
      const roomInstance = ctx.createModelInstance(`room_${roomNum}`)
      roomInstance.enabled = false
      const boundBox = (roomInstance.renderable as Model).boundingBox

      // find center of the room bounds, whcih is 6 values for min and max XYZ
      const center = [(boundBox[0] + boundBox[3]) / 2, (boundBox[1] + boundBox[4]) / 2, (boundBox[2] + boundBox[5]) / 2]

      roomNode.metadata.centerX = center[0] + roomX
      roomNode.metadata.centerY = center[1]
      roomNode.metadata.centerZ = center[2] - roomZ

      // Water rooms are blue/green, use uniformOverrides to do this
      roomInstance.uniformOverrides = {
        u_time: Stats.totalTime,
        u_water: false,
        u_lights: roomLights.get(roomNum) ?? [],
        u_numLights: roomLights.get(roomNum)?.length ?? 0,
      }

      if (isWaterRoom(room)) {
        roomInstance.uniformOverrides = { ...roomInstance.uniformOverrides, u_time: Stats.totalTime, u_water: true }
      }

      roomNode.addChild(roomInstance)

      if (isWaterRoom(room)) {
        roomNode.metadata.water = true
      }
    } catch (e) {
      console.error(`💥 Error building room geometry! ${roomNum - 1}`)
      console.error(e)
    }

    // Static scenic sprites, these are only really used in TR1 and only in a few levels
    for (const roomSprite of room.roomData.sprites) {
      // World position of the sprite
      const vert = trVertToXZY(room.roomData.vertices[roomSprite.vertex].vertex)
      const spriteInst = createSpriteInst(vert, roomSprite.texture, level)
      const bright = room.ambientIntensity / 11000
      spriteInst.uniformOverrides = { 'u_mat.emissive': [bright, bright, bright] }
      fixVines(spriteInst, levelName, roomSprite.texture)
      roomNode.addChild(spriteInst)
    }

    // Add room static meshes
    for (const roomStaticMesh of room.staticMeshes) {
      // Find the staticMesh, which is found by ID not array index
      const staticMesh = level.staticMeshes.get(roomStaticMesh.meshId)
      if (!staticMesh) {
        console.debug(`🤔 Room static mesh not found: ${roomStaticMesh.meshId}`)
        continue
      }

      // Now hop to the mesh via the meshPointers and the staticMesh.mesh index
      const meshPointer = level.meshPointers[staticMesh.mesh]
      buildMesh(level.meshes.get(meshPointer)!, meshPointer, level)
      const meshInst = ctx.createModelInstance(`mesh_${meshPointer}`)
      meshInst.customProgramName = CUST_PROG_MESH

      // For meshes, we override the lighting and add the room lights
      const staticIntens = 1 - roomStaticMesh.intensity / 0x1fff
      let meshAmbient = [staticIntens, staticIntens, staticIntens]
      if (level.version === version.TR3) {
        // In TR3 convert intensity as a 15-bit colour to RGB
        meshAmbient = colour15ToRGB(roomStaticMesh.intensity)
      }

      meshInst.uniformOverrides = {
        // Static mesh intensity is just ambient, we add room lights too
        'u_mat.ambient': meshAmbient,
        u_lights: roomLights.get(roomNum) ?? [],
        u_numLights: roomLights.get(roomNum)?.length ?? 0,
      }

      // We move the mesh to the room position with the *inverse* of the room position
      meshInst.position = [roomStaticMesh.x - roomX, -roomStaticMesh.y, -roomStaticMesh.z + roomZ] as XYZ
      meshInst.rotateY(entityAngleToDeg(roomStaticMesh.rotation) * (Math.PI / 180))
      roomNode.addChild(meshInst)
    }

    roomNode.enabled = false

    // Fake loading delay, to make it look like we're doing something :)
    await loadingDelay(6)
  }

  // END: Room loop, phew!

  // Hide alternate rooms
  for (const [_, roomNode] of roomNodes) {
    if (roomNode.metadata.altRoom) {
      roomNodes.get(roomNode.metadata.altRoom as number)!.metadata.flipped = true
    }
  }

  // Add entities to the world, this is messy!

  for (const entity of level.entities) {
    const room = level.rooms[entity.room]
    // We need to invert the room offsets, as we later add the entity to the room node
    const entityPos = [entity.x - room.info.x, -entity.y, -entity.z + room.info.z] as XYZ

    // Pickups are rendered as sprites, special case
    if (isEntityInCategory(entity, 'Pickup', level.version)) {
      // The sprite ID is the type of the entity, except when it's not!
      const spriteId = pickupSpriteLookup[level.version]?.get(entity.type) || 0

      const spriteInst = createSpriteInst(entityPos, spriteId, level)
      spriteInst.scale = [spriteInst.scale[0] * 1.5, spriteInst.scale[1] * 1.5, spriteInst.scale[2] * 1.5]
      roomNodes.get(entity.room)?.addChild(spriteInst)
      continue
    }

    // Filter out things that are enemies or Lara, and other stuff, TOO HARD!
    if (
      isEntityInCategory(entity, 'Entity', level.version) ||
      isEntityInCategory(entity, 'Effect', level.version) ||
      isEntityInCategory(entity, 'Lara', level.version)
    ) {
      continue
    }

    // Check for special effects for entities like flames & particles
    if (entityEffects(entity, level, entityPos, roomNodes, ctx)) {
      continue
    }

    // All other entities are OK, so we find the model
    // Models are matched 1:1 with entities, so use entity type as the model ID
    const model = level.models.get(entity.type)
    if (!model) {
      continue
    }

    const meshPointer = level.meshPointers[model.startingMesh]
    buildMesh(level.meshes.get(meshPointer)!, meshPointer, level)
    const meshInst = ctx.createModelInstance(`mesh_${meshPointer}`)

    // Intensity1: If not -1, it is a value of constant lighting. -1 means “use mesh lighting”.
    let bright = 1 - entity.intensity / 0x1fff
    if (entity.intensity === -1) {
      // This is a bit of a hack, but it works
      bright = room.ambientIntensity / 11000
    }
    meshInst.customProgramName = CUST_PROG_MESH
    meshInst.uniformOverrides = {
      'u_mat.ambient': [bright, bright, bright],
      u_lights: roomLights.get(entity.room) ?? [],
      u_numLights: roomLights.get(entity.room)?.length ?? 0,
    }

    // We store the mesh inside a node
    // with the offsets from the first frame of the model's animation
    const entityNode = new Node()
    const firstFrame = level.animations[model.animation].frames[0]
    meshInst.position = [firstFrame.offsetX, -firstFrame.offsetY, -firstFrame.offsetZ] as XYZ

    entityNode.position = entityPos
    entityNode.addChild(meshInst)
    // Important! Rotate the *node* to the correct angle, not the model
    entityNode.rotateY(entityAngleToDeg(entity.angle) * (Math.PI / 180))
    roomNodes.get(entity.room)?.addChild(entityNode)
  }

  console.log('🌍 World built OK, level geometry complete')
  console.log(`🌐 Rooms: ${level.numRooms}, Entities ${level.numEntities}, Meshes: ${level.numMeshPointers}, Models: ${level.numModels}`)

  // Find the entity with ID type 0 this is Lara and the start point
  const lara = level.entities.find((e) => isEntityInCategory(e, 'Lara', level.version))
  if (lara) {
    console.log(`👩 Lara entity found at ${lara.x}, ${lara.y}, ${lara.z}`)
    ctx.camera.position = [lara.x, -lara.y + 768, -lara.z] as XYZ

    const camAngle = entityAngleToDeg(lara.angle) * (Math.PI / 180)
    ctx.camera.enableFPControls(camAngle, -0.2, 0.002, config.speed, true)
  } else {
    console.error(`💥 Error: No Lara entity found in level! Falling back to room 0`)
    const room0 = level.rooms[0].info
    ctx.camera.position = [room0.x, 0, -room0.z] as XYZ
    ctx.camera.enableFPControls(0, -0.2, 0.002, config.speed, true)
  }

  // Allow the config to override the start position
  ctx.camera.position = config.startPos ?? ctx.camera.position

  window.addEventListener('keydown', (e) => {
    if (e.key === '1') {
      // Find all the the alternate rooms and flip visibility
      for (const [_, node] of roomNodes) {
        if (node.metadata.altRoom) {
          const altRoom = roomNodes.get(node.metadata.altRoom as number)
          if (!altRoom) {
            return
          }
          altRoom.metadata.flipped = !altRoom.metadata.flipped
          node.metadata.flipped = !node.metadata.flipped
        }
      }
    }
  })

  ctx.update = () => {
    if (Stats.frameCount % 4 === 0) {
      // Find the rooms closest to the camera
      const camPos = ctx.camera.getFrustumCenter(0.3)

      for (const [_, roomNode] of roomNodes) {
        // Update time for water rooms, to create caustics effect
        if (roomNode.metadata.water) {
          // Hardcoded that roomNodes first child is the room model
          const room = roomNode.children[0] as Instance
          if (room.uniformOverrides && room.uniformOverrides?.u_time) {
            room.uniformOverrides.u_time = Stats.totalTime
          }
        }

        // Hide flipped rooms, needed for alternate rooms
        if (roomNode.metadata.flipped) {
          roomNode.enabled = false
          continue
        }

        const roomCenter = [roomNode.metadata.centerX, roomNode.metadata.centerY, roomNode.metadata.centerZ] as XYZ

        const dist = Math.abs(camPos[0] - roomCenter[0]) + Math.abs(camPos[1] - roomCenter[1]) + Math.abs(camPos[2] - roomCenter[2])
        if (dist < config.distanceThreshold) {
          roomNode.enabled = true
        } else {
          roomNode.enabled = false
        }
      }

      // Update animated textures
      // FIXME: Animated textures are not working in TR3 AT ALL!
      // if (level.version != version.TR3) {
      for (const animTex of animTextures) {
        const frame = Math.floor(Stats.frameCount / 12) % animTex.textures.length
        animTex.material.diffuseTex = animTex.textures[frame]
      }
      // }
    }
  }
}

/**
 * Adjust vertex light values to look better and increase contrast
 */
function lightAdjust(val: number) {
  val *= 1.8
  val = Math.pow(val, 1.2)
  val = Math.min(1, Math.max(0, val))
  return val
}

/**
 * Internal function for creating a sprite instance
 */
function createSpriteInst(vert: XYZ, spriteId: number, level: level): Instance {
  const spriteTex = level.spriteTextures[spriteId]
  const spriteWorldW = Math.abs(spriteTex.rightSide - spriteTex.leftSide)
  const spriteWorldH = Math.abs(spriteTex.topSide - spriteTex.bottomSide)
  const aspect = spriteWorldH / spriteWorldW
  let size = spriteWorldH * 0.58

  if (aspect < 1.0) {
    size = spriteWorldW
  }

  // Snip the sprite texture from the textile and create a material for it
  if (!spriteMaterials.has(spriteId)) {
    console.debug(`🎨 Creating sprite material for sprite ${spriteId}`)

    const w = Math.round(spriteTex.width / 256)
    const h = Math.round(spriteTex.height / 256)

    // Snip the sprite section, from the larger textile image texture
    const buffer = getRegionFromBuffer(tileBuffers[spriteTex.tile], spriteTex.x, spriteTex.y, w, h, 256)
    const mat = Material.createBasicTexture(buffer, config.textureFilter, false, { width: w, height: h, wrap: 0x812f })
    mat.alphaCutoff = 0.7

    spriteMaterials.set(spriteId, mat)
  }

  const spriteMat = spriteMaterials.get(spriteId)
  if (spriteMat) {
    const spriteInst = ctx.createBillboardInstance(spriteMat, size)
    spriteInst.scale = [1, aspect, 1]
    spriteInst.position = [vert[0], vert[1], vert[2]] as XYZ

    return spriteInst
  }

  throw new Error('Error finding sprite texture')
}

/**
 * Internal function for creating a GSOTS model from a TR mesh
 */
function buildMesh(mesh: mesh, meshId: number, level: level) {
  const builder = new ModelBuilder()

  // First pass is creating the parts for each textile contained in the mesh
  for (const rect of mesh.texturedRectangles) {
    const objTexture = level.objectTextures[rect.texture]
    if (!objTexture) {
      console.debug(`💥 Error: Missing texture for rect ${rect.texture} in mesh ${meshId}`)
      continue
    }
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    let mat = materials[texTileIndex]
    if (objTexture.attribute === 2) {
      mat = materialsBlend[texTileIndex]
    }

    if (!builder.parts.get('part_' + texTileIndex)) {
      builder.newPart('part_' + texTileIndex, mat)
    }
  }

  for (const tri of mesh.texturedTriangles) {
    const objTexture = level.objectTextures[tri.texture]
    if (!objTexture) {
      console.debug(`💥 Error: Missing texture for tri ${tri.texture} in mesh ${meshId}`)
      continue
    }
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    if (!builder.parts.get('part_' + texTileIndex)) {
      builder.newPart('part_' + texTileIndex, materials[texTileIndex])
    }
  }

  for (const rect of mesh.texturedRectangles) {
    const v1 = trVertToXZY(mesh.vertices[rect.vertices[0]])
    const v2 = trVertToXZY(mesh.vertices[rect.vertices[1]])
    const v3 = trVertToXZY(mesh.vertices[rect.vertices[2]])
    const v4 = trVertToXZY(mesh.vertices[rect.vertices[3]])

    const objTexture = level.objectTextures[rect.texture]
    if (!objTexture) {
      console.debug(`💥 Error: Missing texture for rect ${rect.texture} in mesh ${meshId}`)
      continue
    }
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    // Get texture UV from objTexture.vertices
    const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
    const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
    const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
    const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
    const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
    const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256
    const texU4 = ufixed16ToFloat(objTexture.vertices[3].x) / 256
    const texV4 = ufixed16ToFloat(objTexture.vertices[3].y) / 256

    const part = builder.parts.get('part_' + texTileIndex)
    part!.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])
  }

  for (const tri of mesh.texturedTriangles) {
    const v1 = trVertToXZY(mesh.vertices[tri.vertices[0]])
    const v2 = trVertToXZY(mesh.vertices[tri.vertices[1]])
    const v3 = trVertToXZY(mesh.vertices[tri.vertices[2]])

    const objTexture = level.objectTextures[tri.texture]
    if (!objTexture) {
      console.debug(`💥 Error: Missing texture for rect ${tri.texture} in mesh ${meshId}`)
      continue
    }
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    // Get texture UV from objTexture.vertices
    const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
    const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
    const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
    const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
    const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
    const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256

    const part = builder.parts.get('part_' + texTileIndex)
    part!.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
  }

  ctx.buildCustomModel(builder, `mesh_${meshId}`)
}
