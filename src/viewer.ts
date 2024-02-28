import { Context, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelData } from './lib/file'
import { parseLevel } from './lib/parser'
import { textile8ToBuffer } from './lib/textures'

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
      materials.push(Material.createBasicTexture(buffer, true, false))
    }

    const mat = materials[1]

    // Build all rooms
    let roomNum = 0
    for (const room of level.rooms) {
      const builder = new RenderableBuilder()

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

        // Reverse winding order
        builder.addQuad(v1, v4, v3, v2, [0, 0], [1 / 4, 0], [1 / 4, 1 / 4], [0, 1 / 4])
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

        // Reverse winding order
        builder.addTriangle(v1, v3, v2)
      }

      try {
        // Build the room geometry and add to the world
        const roomInstance = ctx.createCustomInstance(builder, mat)

        // Offset the room to its position
        roomInstance.position = [room.info.x, 0, -room.info.z]
      } catch (e) {
        console.error('Error creating room:', roomNum)
        console.error(e)
      }

      roomNum++
    }

    ctx.camera.position = [level.rooms[0].info.x, 0, -level.rooms[0].info.z]
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
}
