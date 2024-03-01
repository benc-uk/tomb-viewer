import { Context, Material, RenderableBuilder, TextureCache, XYZ } from 'gsots3d'
import { getLevelData } from './lib/file'
import { parseLevel } from './lib/parser'
import { textile8ToBuffer } from './lib/textures'
import { trVertToXZY, ufixed16ToFloat } from './lib/types'
import { config } from './config'

export async function renderLevel(ctx: Context, levelName: string) {
  ctx.removeAllInstances()

  const data = await getLevelData(levelName)
  console.log('Loading file: ' + levelName)

  try {
    // Kinda important!
    const level = parseLevel(data)

    ctx.removeAllInstances()
    TextureCache.clear()

    console.log('Loaded level: ' + levelName)

    // Create all materials one for each textile
    const materials = new Array<Material>()
    for (const textile of level.textiles) {
      const buffer = textile8ToBuffer(textile, level.palette)
      materials.push(Material.createBasicTexture(buffer, config.textureFilter))
    }

    // Build all rooms
    const roomNum = 0
    for (const room of level.rooms) {
      const builder = new RenderableBuilder()

      // Add a part to the room, one for each textile
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
        const texU1 = ufixed16ToFloat(objTexture.vertices[0].x) / 256
        const texV1 = ufixed16ToFloat(objTexture.vertices[0].y) / 256
        const texU2 = ufixed16ToFloat(objTexture.vertices[1].x) / 256
        const texV2 = ufixed16ToFloat(objTexture.vertices[1].y) / 256
        const texU3 = ufixed16ToFloat(objTexture.vertices[2].x) / 256
        const texV3 = ufixed16ToFloat(objTexture.vertices[2].y) / 256
        const texU4 = ufixed16ToFloat(objTexture.vertices[3].x) / 256
        const texV4 = ufixed16ToFloat(objTexture.vertices[3].y) / 256

        // This trick gets the rectangle  added to the right part with the matching textile
        const part = builder.getPart('textile' + texTileIndex)
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

        const part = builder.getPart('textile' + texTileIndex)
        if (part) {
          part.addTriangle(v1, v3, v2, [texU1, texV1], [texU3, texV3], [texU2, texV2])
        }
      }

      // Build the room! and add it to the world!
      try {
        const roomInstance = ctx.createCustomInstance(builder)

        // Room info struct hold room offsets into the world
        roomInstance.position = [room.info.x, 0, -room.info.z]
      } catch (e) {
        console.error('Error creating room:', roomNum)
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

      ctx.camera.enableFPControls(camAngle, -0.2, 0.002, 70)
    }
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
}
