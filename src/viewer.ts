import { Context, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelData } from './lib/file'
import { parseLevel } from './lib/parser'
import { textile8ToBuffer } from './lib/textures'
import { saveTextileAsPNG } from './lib/utils'

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
    for (let i = 0; i < level.numTextiles; i++) {
      const t = level.textiles[i]
      const buffer = textile8ToBuffer(t, level.palette)
      materials.push(Material.createBasicTexture(buffer, true, false))
      saveTextileAsPNG(t, level.palette)
    }

    const m = Material.createSolidColour(0.25, 0.22, 0.21)

    // Build all rooms
    let roomNum = 0
    for (let room of level.rooms) {
      const builder = new RenderableBuilder()
      const offsetX = room.info.x
      const offsetZ = room.info.z

      for (let rect of room.roomData.rectangles) {
        const vert1i = rect.vertices[0]
        const vert2i = rect.vertices[1]
        const vert3i = rect.vertices[2]
        const vert4i = rect.vertices[3]

        const v1 = [
          room.roomData.vertices[vert1i].vertex.x + offsetX,
          room.roomData.vertices[vert1i].vertex.y,
          room.roomData.vertices[vert1i].vertex.z - offsetZ,
        ] as XYZ
        const v2 = [
          room.roomData.vertices[vert2i].vertex.x + offsetX,
          room.roomData.vertices[vert2i].vertex.y,
          room.roomData.vertices[vert2i].vertex.z - offsetZ,
        ] as XYZ
        const v3 = [
          room.roomData.vertices[vert3i].vertex.x + offsetX,
          room.roomData.vertices[vert3i].vertex.y,
          room.roomData.vertices[vert3i].vertex.z - offsetZ,
        ] as XYZ
        const v4 = [
          room.roomData.vertices[vert4i].vertex.x + offsetX,
          room.roomData.vertices[vert4i].vertex.y,
          room.roomData.vertices[vert4i].vertex.z - offsetZ,
        ] as XYZ

        // reverse winding order
        builder.addQuad(v1, v4, v3, v2)
      }

      for (let tri of room.roomData.triangles) {
        const vert1i = tri.vertices[0]
        const vert2i = tri.vertices[1]
        const vert3i = tri.vertices[2]

        const v1 = [
          room.roomData.vertices[vert1i].vertex.x + offsetX,
          room.roomData.vertices[vert1i].vertex.y,
          room.roomData.vertices[vert1i].vertex.z - offsetZ,
        ] as XYZ
        const v2 = [
          room.roomData.vertices[vert2i].vertex.x + offsetX,
          room.roomData.vertices[vert2i].vertex.y,
          room.roomData.vertices[vert2i].vertex.z - offsetZ,
        ] as XYZ
        const v3 = [
          room.roomData.vertices[vert3i].vertex.x + offsetX,
          room.roomData.vertices[vert3i].vertex.y,
          room.roomData.vertices[vert3i].vertex.z - offsetZ,
        ] as XYZ

        // reverse winding order
        builder.addTriangle(v1, v3, v2)
      }

      try {
        console.log('Creating room: ' + roomNum)

        ctx.createCustomInstance(builder, m)
      } catch (e) {
        console.error('Error creating room!')
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
