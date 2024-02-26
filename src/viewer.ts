import { Context, Material, TextureCache } from 'gsots3d'
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

    let objFile = ``

    // Get room 0
    const room = level.rooms[0]

    for (let vert of room.roomData.vertices) {
      objFile += `v ${vert.vertex.x} ${vert.vertex.y} ${vert.vertex.z}\n`
    }

    objFile += `vn 0 0 -1\ng room\n`

    let count = 0
    for (let rect of room.roomData.rectangles) {
      const vert1i = rect.vertices[0]
      const vert2i = rect.vertices[1]
      const vert3i = rect.vertices[2]
      const vert4i = rect.vertices[3]

      // calculate normal
      const v1 = room.roomData.vertices[vert1i].vertex
      const v2 = room.roomData.vertices[vert2i].vertex
      const v3 = room.roomData.vertices[vert3i].vertex

      const n = [
        (v2.z - v1.z) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.z - v1.z),
        (v2.x - v1.x) * (v3.z - v1.z) - (v2.z - v1.z) * (v3.x - v1.x),
        (v2.y - v1.y) * (v3.x - v1.x) - (v2.x - v1.x) * (v3.y - v1.y),
      ]

      // Normalize
      const len = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2])
      n[0] /= len
      n[1] /= len
      n[2] /= len

      objFile += `vn ${n[1]} ${n[0]} ${n[2]}\n`

      // Rects need two triangles
      objFile += `f ${vert1i + 1}//${count} ${vert2i + 1}//${count} ${vert3i + 1}//${count}\n`
      objFile += `f ${vert3i + 1}//${count} ${vert4i + 1}//${count} ${vert1i + 1}//${count}\n`
      count++
    }

    //console.log(objFile)

    try {
      await ctx.loadModel('./hack', 'level.obj')
    } catch (e) {
      console.error(e)
    }
    const model = ctx.createModelInstance('level')
    model.scale = [0.5, 0.5, 0.5]
    model.material = materials[0] //Material.createSolidColour(0.8, 0.3, 0.1)
    model.material.unshaded = true
  } catch (e) {
    console.error('Error parsing level! Going to give up!')
    console.error(e)
  }
}
