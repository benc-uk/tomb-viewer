// =============================================================================
// Project: WebGL Tomb Raider
// Version specific lookups & things that have to be hardcoded
// =============================================================================

import { Material, Node, TextureCache, Context, Instance } from 'gsots3d'
import { entity, level, version } from './types'
import { isEntityInCategory } from './entity'
import { stringToImageBuffer } from './textures'

// Currently only particles
export function entityEffects(entity: entity, level: level, entityPos: [number, number, number], roomNodes: Map<number, Node>, ctx: Context) {
  if (!isEntityInCategory(entity, 'Particles', level.version)) {
    return false
  }

  const particleTex = TextureCache.instance.getCreate('effects/particle.png')
  const { particleSystem: particles, instance: inst } = ctx.createParticleSystem(50, 500)
  inst.position = entityPos
  particles.texture = particleTex!

  particles.maxSize = 0.5
  particles.gravity = [0, 0, 0]
  particles.ageColour = [0.0, 2.0, 3.0, 1.0]
  roomNodes.get(entity.room)?.addChild(inst)

  // Flames
  if (entity.type === 179 || entity.type === 253) {
    particles.emitRate = 40
    particles.minLifetime = 1.3
    particles.maxLifetime = 2.0
    particles.minPower = 200
    particles.maxPower = 800
  }

  // Lava particles/bubbles
  if (entity.type === 177 || entity.type === 251) {
    particles.emitRate = 30
    particles.minSize = 0.4
    particles.maxSize = 0.5
    particles.minLifetime = 1.3
    particles.maxLifetime = 6.0
    particles.minPower = 400
    particles.maxPower = 1300
    particles.gravity = [0, -300, 0]
    particles.direction1 = [-0.2, 1, 0.2]
    particles.direction2 = [0.2, 1, -0.2]

    // Hack for green bubbles in one level the TR2 Diving-Area
    if (level.levelName.includes('Diving-Area')) {
      particles.ageColour = [2.0, 0.0, 3.0, 1.0]
    }

    // Hack for water bubbles in one level the TR2 Barkhang-Monastery
    if (level.levelName.includes('Barkhang')) {
      particles.ageColour = [2.0, 1.0, 0.0, 1.0]
    }
  }

  roomNodes.get(entity.room)?.addChild(inst)

  return true
}

/**
 * There's a bug in the position of the vine sprites
 * - that hang from the ceiling in the first few TR1 levels
 */
export function fixVines(spriteInst: Instance, levelName: string, spriteId: number) {
  if (levelName === 'TR1/01-Caves.PHD' && (spriteId === 147 || spriteId === 148)) {
    spriteInst.position[1] -= 2200
  }
  if (levelName === 'TR1/02-City-of-Vilcabamba.PHD' && (spriteId === 155 || spriteId === 156)) {
    spriteInst.position[1] -= 2200
  }
  if (levelName === 'TR1/03-The-Lost-Valley.PHD' && (spriteId === 143 || spriteId === 144)) {
    spriteInst.position[1] -= 2200
  }
}

/**
 * Maps entity IDs to fixed/well-known sprite IDs only used for pickups
 */
export const pickupSpriteLookup: { [key in version]?: Map<number, number> } = {
  [version.TR1]: new Map([
    // Weapons & ammo
    [84, 0],
    [85, 1],
    [86, 2],
    [87, 3],
    [89, 4],
    [90, 5],
    [91, 6],
    [93, 7],
    [94, 8],
    [110, 9],
    // Puzzle items
    [111, 10],
    [112, 11],
    [113, 12],
    // Keys
    [129, 13],
    [130, 13],
    [131, 13],
    [132, 13],
  ]),

  // This is not correct for every TR2 level, go figure!
  // TODO: Make this better
  [version.TR2]: new Map([
    [135, 8],
    [136, 9],
    [137, 10],
    [138, 11],
    [139, 12],
    [140, 13],
    [141, 14],
    // 142 is pistol ammo never used
    [143, 15],
    [144, 16],
    [145, 17],
    [146, 18],
    [147, 19],
    [148, 20],
    [149, 21],
    [150, 22],
    [151, 23],
    // Secrets
    [190, 25],
    [191, 26],
    [192, 27],
  ]),
}

/** For debugging only */
export function entityLabel(entity: entity, entityPos: [number, number, number], roomNodes: Map<number, Node>, ctx: Context) {
  const entLabImg = stringToImageBuffer(entity.type.toString())
  const entLabMat = Material.createBasicTexture(entLabImg, true, false, { width: 256, height: 128, wrap: 0x812f })
  entLabMat.alphaCutoff = 0.5
  entLabMat.emissive = [1, 1, 1]
  const entLabInst = ctx.createBillboardInstance(entLabMat, 256)
  entLabInst.scale = [2, 1, 1]
  entLabInst.position = entityPos
  entLabInst.position[0] += Math.random() * 200
  entLabInst.position[1] += Math.random() * 200
  entLabInst.position[2] += Math.random() * 200
  roomNodes.get(entity.room)?.addChild(entLabInst)
}
