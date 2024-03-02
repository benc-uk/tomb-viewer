// =============================================================================
// Project: WebGL Tomb Raider
// Builds the 3D world from a Tomb Raider level file
// =============================================================================

import { Context, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelData } from './lib/file'
import { parseLevel } from './lib/parser'
import { getRegionFromBuffer, textile8ToBuffer } from './lib/textures'
import { isWaterRoom, trVertToXZY, ufixed16ToFloat } from './lib/types'
import { config } from './config'

export async function buildWorld(ctx: Context, levelName: string) {
  ctx.removeAllInstances()

  const data = await getLevelData(levelName)
  console.log('💽 Loading file: ' + levelName)

  // Kinda important! Parse the level data into a TR level data structure
  const level = parseLevel(data)

  // Clear the world and texture cache for when we load a new level
  ctx.removeAllInstances()
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
    mat.alphaCutoff = 0.5
    spriteMaterials.push(mat)
  }

  // Core loop - build all room geometry
  let roomNum = 0
  for (const room of level.rooms) {
    roomNum++
    // Skip alternate rooms
    // FIXME: This is a bit of a hack, need to figure out how to handle these better
    if (room.alternateRoom !== -1) {
      continue
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

      // Rest of the sprite data is in the spriteTextures array, indexed on roomSprite.texture
      const spriteTex = level.spriteTextures[roomSprite.texture]
      const worldHeight = spriteTex.bottomSide - spriteTex.topSide
      const worldWid = spriteTex.rightSide - spriteTex.leftSide

      // Create instance in the world
      const spriteInst = ctx.createBillboardInstance(spriteMaterials[roomSprite.texture], worldHeight)
      // Scale to match the sprite's aspect ratio
      spriteInst.scale = [1, worldHeight / worldWid, 1]

      // HACK: Figure out what is happening with those damn vines!!
      if (roomSprite.texture === 147) {
        vert[1] -= 2500
      }

      spriteInst.position = [vert[0] + room.info.x, vert[1], (vert[2] -= room.info.z)] as XYZ
    }

    // Build the room and add it to the world
    try {
      const roomInstance = ctx.createCustomInstance(builder)

      // Water rooms are blue/green, need to clone the material
      if (isWaterRoom(room)) {
        const waterMat = materials[0].clone()
        waterMat.diffuse = [0, 0.9, 0.8]
        roomInstance.material = waterMat
      }

      // Room info struct hold room offsets into the world
      roomInstance.position = [room.info.x, 0, -room.info.z]
    } catch (e) {
      console.error(`💥 Error building room geometry! ${roomNum - 1}`)
      console.error(e)
    }
  }

  // Find the entity with ID type 0 this is Lara and the start point
  const laraStart = level.entities.find((e) => e.type === 0)
  if (laraStart) {
    ctx.camera.position = [laraStart.x, -laraStart.y + 512, -laraStart.z] as XYZ

    let camAngle = 0
    const angle = laraStart.angle
    if (angle === 16384) {
      camAngle = -Math.PI / 2
    }
    if (angle === -32768) {
      camAngle = -Math.PI
    }

    ctx.camera.enableFPControls(camAngle, -0.2, 0.002, config.speed)
  }

  // Allow the config to override the start position
  if (config.startPos) {
    ctx.camera.position = config.startPos
  }
}
