import { tr_version } from './types'

export const enum TR1EntityIds {
  // zero is lara
  LARA = 0,
  PISTOLS = 84,
  SHOTGUN = 85,
  MAGNUMS = 86,
  UZIS = 87,
  AMMO_PISTOLS = 88,
  AMMO_SHOTGUN = 89,
  AMMO_MAGNUMS = 90,
  AMMO_UZIS = 91,

  MEDI_PACK_SMALL = 93,
  MEDI_PACK_BIG = 94,
}

export const enum TR1FixedSpriteIds {
  PISTOLS = 0,
  SHOTGUN = 1,
  MAGNUMS = 2,
  UZIS = 3,
  AMMO_SHOTGUN = 4,
  AMMO_MAGNUMS = 5,
  AMMO_UZIS = 6,
  MEDI_PACK_SMALL = 7,
  MEDI_PACK_BIG = 8,
}

export function isPickup(entityId: number, version: tr_version): boolean {
  if (version === tr_version.TR1) {
    return entityId >= 84 && entityId <= 94
  }

  return false
}

export function isLara(entityId: number): boolean {
  return entityId === 0
}

export function mapPickupToSpriteId(entityId: number, version: tr_version): number {
  if (version === tr_version.TR1) {
    switch (entityId) {
      case TR1EntityIds.PISTOLS:
        return TR1FixedSpriteIds.PISTOLS
      case TR1EntityIds.SHOTGUN:
        return TR1FixedSpriteIds.SHOTGUN
      case TR1EntityIds.MAGNUMS:
        return TR1FixedSpriteIds.MAGNUMS
      case TR1EntityIds.UZIS:
        return TR1FixedSpriteIds.UZIS
      case TR1EntityIds.AMMO_SHOTGUN:
        return TR1FixedSpriteIds.AMMO_SHOTGUN
      case TR1EntityIds.AMMO_MAGNUMS:
        return TR1FixedSpriteIds.AMMO_MAGNUMS
      case TR1EntityIds.AMMO_UZIS:
        return TR1FixedSpriteIds.AMMO_UZIS
      case TR1EntityIds.MEDI_PACK_SMALL:
        return TR1FixedSpriteIds.MEDI_PACK_SMALL
      case TR1EntityIds.MEDI_PACK_BIG:
        return TR1FixedSpriteIds.MEDI_PACK_BIG
    }
  }

  return 0
}
