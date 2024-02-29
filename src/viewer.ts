import { Context, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelData } from './lib/file'
import { parseLevel } from './lib/parser'
import { textile8ToBuffer } from './lib/textures'
import { ufixed16ToFloat } from './lib/types'

export async function renderLevel(ctx: Context, levelName: string) {
  ctx.removeAllInstances()

  const data = await getLevelData(levelName)
  console.log('Loading file: ' + levelName)

  try {
    const level = parseLevel(data)

    ctx.removeAllInstances()
    TextureCache.clear()
    console.log('Loaded level: ' + levelName)

    const materials = new Array<Material>()
    for (const textile of level.textiles) {
      const buffer = textile8ToBuffer(textile, level.palette)
      materials.push(Material.createBasicTexture(buffer, false, false))
    }

    // Build all rooms
    const roomNum = 0
    for (const room of level.rooms) {
      const builder = new RenderableBuilder()

      for (let i = 0; i < materials.length; i++) {
        builder.newPart('tex' + i, materials[i])
      }

      for (const rect of room.roomData.rectangles) {
        const vert1i = rect.vertices[0]
        const vert2i = rect.vertices[1]
        const vert3i = rect.vertices[2]
        const vert4i = rect.vertices[3]

        const v1 = [
          room.roomData.vertices[vert1i].vertex.x,
          room.roomData.vertices[vert1i].vertex.y,
          room.roomData.vertices[vert1i].vertex.z,
        ] as XYZ
        const v2 = [
          room.roomData.vertices[vert2i].vertex.x,
          room.roomData.vertices[vert2i].vertex.y,
          room.roomData.vertices[vert2i].vertex.z,
        ] as XYZ
        const v3 = [
          room.roomData.vertices[vert3i].vertex.x,
          room.roomData.vertices[vert3i].vertex.y,
          room.roomData.vertices[vert3i].vertex.z,
        ] as XYZ
        const v4 = [
          room.roomData.vertices[vert4i].vertex.x,
          room.roomData.vertices[vert4i].vertex.y,
          room.roomData.vertices[vert4i].vertex.z,
        ] as XYZ

        // Texture coordinates
        const objTexture = level.objectTextures[rect.texture]

        // First 14 bits (little endian) of tileAndFlag is the index into the textile array
        const texTileIndex = objTexture.tileAndFlag & 0x3fff

        // Get the UV of the four corners in objTexture.vertices
        const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
        const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
        const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
        const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
        const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
        const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256
        const texU4 = ufixed16ToFloat(objTexture.vertices[3].x) / 256
        const texV4 = ufixed16ToFloat(objTexture.vertices[3].y) / 256

        // Add the rectangle to the builder
        const part = builder.getPart('tex' + texTileIndex)
        if (part) {
          part.addQuad(v1, v4, v3, v2, [texU1, texV1], [texU4, texV4], [texU3, texV3], [texU2, texV2])
        }
      }

      for (const tri of room.roomData.triangles) {
        const vert1i = tri.vertices[0]
        const vert2i = tri.vertices[1]
        const vert3i = tri.vertices[2]

        const v1 = [
          room.roomData.vertices[vert1i].vertex.x,
          room.roomData.vertices[vert1i].vertex.y,
          room.roomData.vertices[vert1i].vertex.z,
        ] as XYZ
        const v2 = [
          room.roomData.vertices[vert2i].vertex.x,
          room.roomData.vertices[vert2i].vertex.y,
          room.roomData.vertices[vert2i].vertex.z,
        ] as XYZ
        const v3 = [
          room.roomData.vertices[vert3i].vertex.x,
          room.roomData.vertices[vert3i].vertex.y,
          room.roomData.vertices[vert3i].vertex.z,
        ] as XYZ

        // Texture coordinates
        const objTexture = level.objectTextures[tri.texture]

        // First 14 bits (little endian) of tileAndFlag is the index into the textile array
        const texTileIndex = objTexture.tileAndFlag & 0x3fff

        const part = builder.getPart('tex' + texTileIndex)
        if (part) {
          part.addTriangle(v1, v3, v2)
        }
      }

      try {
        const roomInstance = ctx.createCustomInstance(builder)
        roomInstance.position = [room.info.x, 0, -room.info.z]
      } catch (e) {
        console.error('Error creating room:', roomNum)
        console.error(e)
      }
    }

    ctx.camera.position = [level.rooms[0].info.x, 0, -level.rooms[0].info.z]
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
}
