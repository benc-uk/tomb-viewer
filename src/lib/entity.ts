import { tr_entity, tr_version } from './types'

/**
 * Entity categories
 */
export enum Category {
  PICKUP = 0,
  ENEMY = 1,
  TRAP = 2,
  DOOR = 3,
  MOVABLE = 4,
  SWITCH = 5,
  SCENERY = 6,
  LARA = 7,
  OTHER = 8,
}

// Internal entity struct used for DB entries
type Entity = {
  entityId: number
  name: string
  category: Category
}

// Entity database for each game version and every entity
export const EntityDB: { [key in tr_version]?: Entity[] } = {
  [tr_version.TR1]: [
    { entityId: 0, name: 'Lara', category: Category.LARA },
    { entityId: 7, name: 'Wolf', category: Category.ENEMY },
    { entityId: 8, name: 'Bear', category: Category.ENEMY },
    { entityId: 9, name: 'Bat', category: Category.ENEMY },
    { entityId: 10, name: 'Crocodile Land', category: Category.ENEMY },
    { entityId: 11, name: 'Crocodile Water', category: Category.ENEMY },
    { entityId: 12, name: 'Lion Male', category: Category.ENEMY },
    { entityId: 13, name: 'Lion Female', category: Category.ENEMY },
    { entityId: 84, name: 'Pistols', category: Category.PICKUP },
    { entityId: 85, name: 'Shotgun', category: Category.PICKUP },
    { entityId: 86, name: 'Magnums', category: Category.PICKUP },
    { entityId: 87, name: 'Uzis', category: Category.PICKUP },
    { entityId: 88, name: 'Ammo Pistols', category: Category.PICKUP },
    { entityId: 89, name: 'Ammo Shotgun', category: Category.PICKUP },
    { entityId: 90, name: 'Ammo Magnums', category: Category.PICKUP },
    { entityId: 91, name: 'Ammo Uzis', category: Category.PICKUP },
    { entityId: 93, name: 'Small Medi Pack', category: Category.PICKUP },
    { entityId: 94, name: 'Large Medi Pack', category: Category.PICKUP },
  ],
}

/**
 * Check if an entity is in a specific category
 * @param entity tr_entity to check
 * @param category Category of the entity to check for
 * @param version Version of the game
 */
export function isEntityInCategory(entity: tr_entity, category: Category, version: tr_version): boolean {
  const dbEntity = EntityDB[version]?.find((e) => e.entityId === entity.type)
  return dbEntity?.category === category
}

/**
 * Maps entity IDs to fixed/well-known sprite IDs only used for pickups
 */
export const PickupSpriteLookup: { [key in tr_version]?: Map<number, number> } = {
  [tr_version.TR1]: new Map([
    [84, 0],
    [85, 1],
    [86, 2],
    [87, 3],
    [89, 4],
    [90, 5],
    [91, 6],
    [93, 7],
    [94, 8],
  ]),
}
