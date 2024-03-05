// =============================================================================
// Project: WebGL Tomb Raider
// Builds the 3D world from a Tomb Raider level file
// =============================================================================

import { BuilderPart, Context, Instance, Material, ModelBuilder, Stats, TextureCache, XYZ } from 'gsots3d'
import { getLevelFile } from './lib/file'
import { parseLevel } from './lib/parser'
import { getRegionFromBuffer, textile8ToBuffer } from './lib/textures'
import { entityAngleToDeg, isWaterRoom, trVertToXZY, tr_mesh, tr_sprite_texture, ufixed16ToFloat, tr1_level } from './lib/types'
import { config } from './config'
import { Category, isEntityInCategory, PickupSpriteLookup } from './lib/entity'

export async function buildWorld(ctx: Context, levelName: string) {
  ctx.removeAllInstances()

  const data = await getLevelFile(levelName)
  console.log('💽 Loading file: ' + levelName)

  // Kinda important! Parse the level data into a TR level data structure
  const level = parseLevel(data)

  // Clear the world, lights and texture cache for when we load a new level
  ctx.removeAllInstances()
  ctx.lights = []
  TextureCache.clear()

  const lightMat = Material.createSolidColour(1, 1, 1)
  lightMat.emissive = [1, 1, 1]

  console.log(`✨ Loaded level OK, ${level.numRooms} rooms, ${level.numEntities} entities`)

  // Create all materials one for each tex-tile
  const materials = new Array<Material>()
  const buffers = new Array<Uint8Array>() // We keep buffer versions too, for turning into sprites
  const spriteMaterials = new Array<Material>()

  for (const textile of level.textiles) {
    const buffer = textile8ToBuffer(textile, level.palette)
    const mat = Material.createBasicTexture(buffer, config.textureFilter, false)
    mat.alphaCutoff = 0.5 // Makes transparent textures work
    materials.push(mat)
    buffers.push(buffer)
  }

  // Create all sprite materials

  for (const sprite of level.spriteTextures) {
    const w = Math.round(sprite.width / 256)
    const h = Math.round(sprite.height / 256)

    const buffer = getRegionFromBuffer(buffers[sprite.tile], sprite.x, sprite.y, w, h, 256)
    const mat = Material.createBasicTexture(buffer, config.textureFilter, false, { width: w, height: h, wrap: 0x812f })
    // HACK: Make the sprite emissive to ignore lighting
    // - As they are only shaded in GSOTS by directional light which is disabled
    mat.emissive = [1, 1, 1]
    mat.alphaCutoff = 0.5
    spriteMaterials.push(mat)
  }

  // Create all GSOTS models for meshes
  for (const [meshId, mesh] of level.meshes) {
    buildMesh(mesh, meshId, level, ctx, materials)
  }

  // Needed to track alternate room pairs
  const altRoomPairs: Array<[number, number]> = []

  // Map of room number to instance for easy retrieval
  const roomInstances = new Map<number, Instance>()

  // Core loop - build all room geometry
  for (let roomNum = 0; roomNum < level.rooms.length; roomNum++) {
    const room = level.rooms[roomNum]

    // Find the alternate room pairs
    if (room.alternateRoom !== -1) {
      altRoomPairs.push([roomNum, room.alternateRoom])
    }

    const builder = new ModelBuilder()

    // Add a part to the room, one for each textile
    // This is part of the trick to get the right texture on the right part
    for (let i = 0; i < materials.length; i++) {
      builder.newPart('roompart_' + i, materials[i])
    }

    // All room rectangles
    for (const rect of room.roomData.rectangles) {
      const v1 = trVertToXZY(room.roomData.vertices[rect.vertices[0]].vertex)
      const v2 = trVertToXZY(room.roomData.vertices[rect.vertices[1]].vertex)
      const v3 = trVertToXZY(room.roomData.vertices[rect.vertices[2]].vertex)
      const v4 = trVertToXZY(room.roomData.vertices[rect.vertices[3]].vertex)

      // Texture coordinates are in the bizarrely named objectTextures
      const objTexture = level.objectTextures[rect.texture]

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

      // This trick gets the rectangle  added to the right part with the matching textile
      const part = builder.parts.get('roompart_' + texTileIndex)
      if (part) {
        // Add the rectangle to the builder
        part.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])
      }
    }

    // Now room triangles
    for (const tri of room.roomData.triangles) {
      const v1 = trVertToXZY(room.roomData.vertices[tri.vertices[0]].vertex)
      const v2 = trVertToXZY(room.roomData.vertices[tri.vertices[1]].vertex)
      const v3 = trVertToXZY(room.roomData.vertices[tri.vertices[2]].vertex)

      // Texture coordinates logic same as rectangles
      const objTexture = level.objectTextures[tri.texture]
      const texTileIndex = objTexture.tileAndFlag & 0x3fff

      // Get the UV of the four corners in objTexture.vertices
      const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
      const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
      const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
      const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
      const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
      const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256

      const part = builder.parts.get('roompart_' + texTileIndex)
      if (part) {
        part.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
      }
    }

    // Build the room and add it to the world
    try {
      ctx.buildCustomModel(builder, `room_${roomNum}`)
      const roomInstance = ctx.createModelInstance(`room_${roomNum}`)
      roomInstances.set(roomNum, roomInstance)

      // Water rooms are blue/green, use uniformOverrides to do this
      if (isWaterRoom(room)) {
        roomInstance.uniformOverrides = { 'u_mat.diffuse': [0, 0.9, 0.8] }
      }

      // Room info struct hold room offsets into the world
      roomInstance.position = [room.info.x, 0, -room.info.z]
      roomInstance.enabled = false
      // const roomAmb = room.ambientIntensity / 13000
      // roomInstance.uniformOverrides = { 'u_mat.ambient': [roomAmb, roomAmb, roomAmb] }
    } catch (e) {
      console.error(`💥 Error building room geometry! ${roomNum - 1}`)
      console.error(e)
    }

    // Add room lights
    for (const light of room.lights) {
      const lightPos = [light.x, -light.y, -light.z] as XYZ

      let intense = light.intensity / 0x1fff // 0x1FFF is the max intensity
      const fade = light.fade / 0x7fff

      intense *= config.lightBright
      // intense *= room.ambientIntensity / 30000

      const roomLight = ctx.createPointLight(lightPos, [intense, intense, intense])
      roomLight.constant = config.lightConst * fade
      roomLight.quad = config.lightQuad * fade
      roomLight.linear = 0
    }

    // Now sprites
    for (const roomSprite of room.roomData.sprites) {
      // World position of the sprite
      const vert = trVertToXZY(room.roomData.vertices[roomSprite.vertex].vertex)
      vert[0] += room.info.x
      vert[2] -= room.info.z
      createSpriteInst(vert, roomSprite.texture, level.spriteTextures, spriteMaterials, ctx, levelName)
    }

    // Add room static meshes
    for (const roomStaticMesh of room.staticMeshes) {
      const center = [roomStaticMesh.x, -roomStaticMesh.y, -roomStaticMesh.z] as XYZ

      // Find the staticMesh, *weird* we have to do a search here, normally IDs are array indexes
      const staticMesh = level.staticMeshes.find((m) => m.id === roomStaticMesh.meshId)
      if (!staticMesh) {
        console.warn(`🤔 Room static mesh not found: ${roomStaticMesh.meshId}`)
        continue
      }

      // Now hop to the mesh via the meshPointers and the staticMesh.mesh index
      const meshPointer = level.meshPointers[staticMesh.mesh]

      const instance = ctx.createModelInstance(`mesh_${meshPointer}`)
      instance.position = center
      instance.rotateY(entityAngleToDeg(roomStaticMesh.rotation) * (Math.PI / 180))
    }
  }

  // END: Room loop

  // Hide one half of alternate room pairs, doesn't matter which
  for (const pairs of altRoomPairs) {
    roomInstances.get(pairs[0])!.metadata.flipped = false
    roomInstances.get(pairs[1])!.metadata.flipped = true
  }

  // Add entities to the world
  for (const entity of level.entities) {
    const vert = [entity.x, -entity.y, -entity.z] as XYZ

    // Pickups are sprites, special case
    if (isEntityInCategory(entity, Category.PICKUP, level.version)) {
      const spriteId = PickupSpriteLookup[level.version]?.get(entity.type) || 0
      createSpriteInst(vert, spriteId, level.spriteTextures, spriteMaterials, ctx)
      continue
    }

    // if (isEntityInCategory(entity, Category.ENEMY, level.version)) continue

    // // Other entities are models, so we find the model
    // const modelId = entity.type
    // const model = level.models.find((m) => m.id === modelId)
    // if (!model) {
    //   console.warn(`💥 Model not found: ${modelId}`)
    //   continue
    // }

    // // Models are made up of multiple meshes, so we create an instance for each
    // for (let m = 0; m < model.numMeshes; m++) {
    //   const meshId = level.meshPointers[model.startingMesh + m]
    //   const instance = ctx.createModelInstance(`mesh_${meshId}`)
    //   instance.position = vert
    //   instance.rotateY(entityAngleToDeg(entity.angle) * (Math.PI / 180))
    // }
  }

  // Find the entity with ID type 0 this is Lara and the start point
  const lara = level.entities.find((e) => isEntityInCategory(e, Category.LARA, level.version))
  if (lara) {
    ctx.camera.position = [lara.x, -lara.y + 768, -lara.z] as XYZ

    const camAngle = entityAngleToDeg(lara.angle) * (Math.PI / 180)
    ctx.camera.enableFPControls(camAngle, -0.2, 0.002, config.speed, true)
  }

  // Allow the config to override the start position
  if (config.startPos) {
    ctx.camera.position = config.startPos
  }

  window.addEventListener('keydown', (e) => {
    // Swap toggle between all the alternate rooms
    if (e.key === '1') {
      for (const pairs of altRoomPairs) {
        const room1 = roomInstances.get(pairs[0])!
        const room2 = roomInstances.get(pairs[1])!
        room1.metadata.flipped = !room1.metadata.flipped
        room2.metadata.flipped = !room2.metadata.flipped
      }
    }
  })

  ctx.update = () => {
    if (Stats.frameCount % 30 === 0) {
      // Find the rooms closest to the camera
      const camPos = ctx.camera.position
      const distThreshold = config.distanceThreshold
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, room] of roomInstances) {
        const dist = Math.abs(room.position[0] - camPos[0]) + Math.abs(room.position[2] - camPos[2])
        if (dist < distThreshold) {
          room.enabled = true
        } else {
          room.enabled = false
        }

        if (room.metadata.flipped) {
          room.enabled = false
        }
      }
    }
  }
}

function createSpriteInst(
  vert: XYZ,
  spriteId: number,
  spriteTextures: tr_sprite_texture[],
  spriteMaterials: Material[],
  ctx: Context,
  levelName?: string
) {
  const spriteTex = spriteTextures[spriteId]
  const spriteWorldW = Math.abs(spriteTex.rightSide - spriteTex.leftSide)
  const spriteWorldH = Math.abs(spriteTex.topSide - spriteTex.bottomSide)
  const aspect = spriteWorldH / spriteWorldW
  let size = spriteWorldH * 0.58

  if (aspect < 1.0) {
    size = spriteWorldW
  }

  const spriteInst = ctx.createBillboardInstance(spriteMaterials[spriteId], size)
  spriteInst.scale = [1, aspect, 1]
  spriteInst.position = [vert[0], vert[1], vert[2]] as XYZ

  // TODO: Hacks to fix vines and other sprites that hang from the ceiling
  if (levelName === 'TR1/01-Caves.PHD' && spriteId === 175) {
    spriteInst.position[1] -= 3056
  }
}

function buildMesh(mesh: tr_mesh, meshId: number, level: tr1_level, ctx: Context, materials: Material[]) {
  const builder = new ModelBuilder()
  const parts: Map<number, BuilderPart> = new Map()

  // First pass is creating the parts for each textile contained in the mesh
  for (const rect of mesh.texturedRectangles) {
    const objTexture = level.objectTextures[rect.texture]
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    if (!parts.get(texTileIndex)) {
      parts.set(texTileIndex, builder.newPart('part_' + texTileIndex, materials[texTileIndex]))
    }
  }

  for (const tri of mesh.texturedTriangles) {
    const objTexture = level.objectTextures[tri.texture]
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    if (!parts.get(texTileIndex)) {
      parts.set(texTileIndex, builder.newPart('part_' + texTileIndex, materials[texTileIndex]))
    }
  }

  for (const rect of mesh.texturedRectangles) {
    const v1 = trVertToXZY(mesh.vertices[rect.vertices[0]])
    const v2 = trVertToXZY(mesh.vertices[rect.vertices[1]])
    const v3 = trVertToXZY(mesh.vertices[rect.vertices[2]])
    const v4 = trVertToXZY(mesh.vertices[rect.vertices[3]])

    const objTexture = level.objectTextures[rect.texture]
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

    const part = parts.get(texTileIndex)
    part!.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])
  }

  for (const tri of mesh.texturedTriangles) {
    const v1 = trVertToXZY(mesh.vertices[tri.vertices[0]])
    const v2 = trVertToXZY(mesh.vertices[tri.vertices[1]])
    const v3 = trVertToXZY(mesh.vertices[tri.vertices[2]])

    const objTexture = level.objectTextures[tri.texture]
    const texTileIndex = objTexture.tileAndFlag & 0x3fff

    // Get texture UV from objTexture.vertices
    const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
    const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
    const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
    const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
    const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
    const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256

    const part = parts.get(texTileIndex)
    part!.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
  }

  ctx.buildCustomModel(builder, `mesh_${meshId}`)
}
