// =============================================================================
// Project: WebGL Tomb Raider
// Builds the 3D world from a Tomb Raider level file
// =============================================================================

import { Context, Instance, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelFile } from './lib/file'
import { parseLevel } from './lib/parser'
import { getRegionFromBuffer, textile8ToBuffer } from './lib/textures'
import { entityAngleToDeg, isWaterRoom, trVertToXZY, tr_sprite_texture, ufixed16ToFloat } from './lib/types'
import { config } from './config'
import { Category, isEntityInCategory, PickupSpriteLookup } from './lib/entity'

import { lightConst, lightQuad } from './main'

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

  console.log(`✨ Loaded level OK, ${level.numRooms} rooms, ${level.numEntities} entities`)

  // Create all materials one for each tex-tile
  const materials = new Array<Material>()
  const buffers = new Array<Uint8Array>() // We keep buffer versions too, for turning into sprites
  for (const textile of level.textiles) {
    const buffer = textile8ToBuffer(textile, level.palette)
    const mat = Material.createBasicTexture(buffer, config.textureFilter, false, { wrap: 0x812f })
    mat.alphaCutoff = 0.5 // Makes transparent textures work
    materials.push(mat)
    buffers.push(buffer)
  }

  // Create all sprite materials
  const spriteMaterials = new Array<Material>()
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

    const builder = new RenderableBuilder()

    // Add a part to the room, one for each textile
    // This is part of the trick to get the right texture on the right part
    for (let i = 0; i < materials.length; i++) {
      builder.newPart('textile' + i, materials[i])
    }

    // All rectangles
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
      const part = builder.parts.get('textile' + texTileIndex)
      if (part) {
        // Add the rectangle to the builder
        part.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])
      }
    }

    // Now triangles
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

      const part = builder.parts.get('textile' + texTileIndex)
      if (part) {
        part.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
      }
    }

    // Now sprites, which requires some voodoo
    for (const roomSprite of room.roomData.sprites) {
      // World position of the sprite
      const vert = trVertToXZY(room.roomData.vertices[roomSprite.vertex].vertex)
      vert[0] += room.info.x
      vert[2] -= room.info.z
      createSpriteInst(vert, roomSprite.texture, level.spriteTextures, spriteMaterials, ctx)
    }

    // Build the room and add it to the world
    try {
      const roomInstance = ctx.createCustomInstance(builder)
      // We hope the order is
      roomInstances.set(roomNum, roomInstance)

      // Water rooms are blue/green, need to clone the material
      if (isWaterRoom(room)) {
        const waterMat = materials[0].clone()
        waterMat.diffuse = [0, 0.9, 0.8] // Make it look bluey-green
        roomInstance.material = waterMat
      }

      // Room info struct hold room offsets into the world
      roomInstance.position = [room.info.x, 0, -room.info.z]
    } catch (e) {
      console.error(`💥 Error building room geometry! ${roomNum - 1}`)
      console.error(e)
    }

    // Add room lights
    for (const light of room.lights) {
      const lightPos = [light.x, light.y, -light.z] as XYZ

      let intense = light.intensity / 0x1fff // 0x1FFF is the max intensity
      const fade = light.fade / 0x7fff

      const roomAmb = room.ambientIntensity / 0x1fff // 0x1FFF is the max intensity
      intense *= roomAmb
      if (intense > 1) intense = 1

      const worldLight = ctx.createPointLight(lightPos, [intense, intense, intense])
      worldLight.metadata.fade = fade

      worldLight.constant = lightConst * fade
      worldLight.quad = lightQuad * fade
      worldLight.linear = 0
    }
  }

  console.log(`🌟 Light count: ${ctx.lights.length}`)

  // Hide one half of alternate room pairs, doesn't matter which
  for (const pairs of altRoomPairs) {
    roomInstances.get(pairs[0])!.enabled = false
  }

  // Add entities to the world, pickups
  for (const entity of level.entities) {
    const vert = [entity.x, entity.y, entity.z] as XYZ

    if (isEntityInCategory(entity, Category.PICKUP, level.version)) {
      const spriteId = PickupSpriteLookup[level.version]?.get(entity.type) || 0
      vert[1] = -vert[1]
      vert[2] = -vert[2]
      createSpriteInst(vert, spriteId, level.spriteTextures, spriteMaterials, ctx)
    }
  }

  // Find the entity with ID type 0 this is Lara and the start point
  const lara = level.entities.find((e) => isEntityInCategory(e, Category.LARA, level.version))
  if (lara) {
    ctx.camera.position = [lara.x, -lara.y + 768, -lara.z] as XYZ

    const camAngle = entityAngleToDeg(lara.angle) * (Math.PI / 180)
    ctx.camera.enableFPControls(camAngle, -0.2, 0.002, config.speed)
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
        room1.enabled = !room1.enabled
        room2.enabled = !room2.enabled
      }
    }
  })
}

function createSpriteInst(vert: XYZ, spriteId: number, spriteTextures: tr_sprite_texture[], spriteMaterials: Material[], ctx: Context) {
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
}
