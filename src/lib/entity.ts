import { tr_entity, tr_version } from './types'

export type Category =
  | 'Lara'
  | 'Entity'
  | 'Animation'
  | 'Trap'
  | 'Door'
  | 'Trapdoor'
  | 'Scenery'
  | 'Pickup'
  | 'Puzzle'
  | 'Slot'
  | 'Key'
  | 'Keyhole'
  | 'Effect'

type Entity = {
  id: number
  name: string
  categories?: Category[]
}

// Copied from trview.app/Resources/Files/type_names.txt
const tr1Data = [
  {
    id: 0,
    name: 'Lara',
    categories: ['Lara'],
  },
  {
    id: 1,
    name: 'LaraPistolsAnim',
    categories: ['Animation'],
  },
  {
    id: 2,
    name: 'LaraShotgunAnim',
    categories: ['Animation'],
  },
  {
    id: 3,
    name: 'LaraMagnumsAnim',
    categories: ['Animation'],
  },
  {
    id: 4,
    name: 'LaraUzisAnim',
    categories: ['Animation'],
  },
  {
    id: 5,
    name: 'AlternativeLara',
  },
  {
    id: 6,
    name: 'Doppelganger',
    categories: ['Entity'],
  },
  {
    id: 7,
    name: 'Wolf',
    categories: ['Entity'],
  },
  {
    id: 8,
    name: 'Bear',
    categories: ['Entity'],
  },
  {
    id: 9,
    name: 'Bat',
    categories: ['Entity'],
  },
  {
    id: 10,
    name: 'Crocodile',
    categories: ['Entity'],
  },
  {
    id: 11,
    name: 'Crocodile',
    categories: ['Entity'],
  },
  {
    id: 12,
    name: 'Lion (Male)',
    categories: ['Entity'],
  },
  {
    id: 13,
    name: 'Lion (Female)',
    categories: ['Entity'],
  },
  {
    id: 14,
    name: 'Panther',
    categories: ['Entity'],
  },
  {
    id: 15,
    name: 'Gorilla',
    categories: ['Entity'],
  },
  {
    id: 16,
    name: 'Rat',
    categories: ['Entity'],
  },
  {
    id: 17,
    name: 'Rat',
    categories: ['Entity'],
  },
  {
    id: 18,
    name: 'T-Rex',
    categories: ['Entity'],
  },
  {
    id: 19,
    name: 'Raptor',
    categories: ['Entity'],
  },
  {
    id: 20,
    name: 'Mutant (Winged)',
    categories: ['Entity'],
  },
  {
    id: 21,
    name: 'Mutant (Shooter)',
    categories: ['Entity'],
  },
  {
    id: 22,
    name: 'Mutant',
    categories: ['Entity'],
  },
  {
    id: 23,
    name: 'Centaur',
    categories: ['Entity'],
  },
  {
    id: 24,
    name: 'Mummy',
    categories: ['Entity'],
  },
  {
    id: 25,
    name: 'DinoWarrior',
    categories: ['Entity'],
  },
  {
    id: 26,
    name: 'Fish',
    categories: ['Entity'],
  },
  {
    id: 27,
    name: 'Larson',
    categories: ['Entity'],
  },
  {
    id: 28,
    name: 'Pierre',
    categories: ['Entity'],
  },
  {
    id: 29,
    name: 'Skateboard',
    categories: ['Entity'],
  },
  {
    id: 30,
    name: 'Skater Boy',
    categories: ['Entity'],
  },
  {
    id: 31,
    name: 'Cowboy',
    categories: ['Entity'],
  },
  {
    id: 32,
    name: 'Kold',
    categories: ['Entity'],
  },
  {
    id: 33,
    name: 'WingedNatla',
    categories: ['Entity'],
  },
  {
    id: 34,
    name: 'TorsoBoss',
    categories: ['Entity'],
  },
  {
    id: 35,
    name: 'Breakable Tile',
    categories: ['Trap'],
  },
  {
    id: 36,
    name: 'Swinging Blade',
    categories: ['Trap'],
  },
  {
    id: 37,
    name: 'Spikes',
    categories: ['Trap'],
  },
  {
    id: 38,
    name: 'Boulder',
    categories: ['Trap'],
  },
  {
    id: 39,
    name: 'Dart',
    categories: ['Trap'],
  },
  {
    id: 40,
    name: 'Dart Emitter',
    categories: ['Trap'],
  },
  {
    id: 41,
    name: 'LiftingDoor',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 42,
    name: 'Slamming Doors',
    categories: ['Trap'],
  },
  {
    id: 43,
    name: 'Sword',
    categories: ['Trap'],
  },
  {
    id: 44,
    name: 'Hammer Handle',
    categories: ['Trap'],
  },
  {
    id: 45,
    name: 'Hammer Block',
    categories: ['Trap'],
  },
  {
    id: 46,
    name: 'Lightning Ball',
    categories: ['Trap'],
  },
  {
    id: 47,
    name: 'Barricade',
    categories: ['Scenery'],
  },
  {
    id: 48,
    name: 'Pushable Block 1',
    categories: ['Movable'],
  },
  {
    id: 49,
    name: 'Pushable Block 2',
    categories: ['Movable'],
  },
  {
    id: 50,
    name: 'Pushable Block 3',
    categories: ['Movable'],
  },
  {
    id: 51,
    name: 'Pushable Block 4',
    categories: ['Movable'],
  },
  {
    id: 52,
    name: 'Moving Block',
    categories: ['Movable'],
  },
  {
    id: 53,
    name: 'Falling Ceiling',
    categories: ['Trap'],
  },
  {
    id: 54,
    name: 'Sword 2',
    categories: ['Trap'],
  },
  {
    id: 55,
    name: 'Wall Switch',
    categories: ['Switch'],
  },
  {
    id: 56,
    name: 'Underwater Lever',
    categories: ['Switch'],
  },
  {
    id: 57,
    name: 'Door 1',
    categories: ['Door'],
  },
  {
    id: 58,
    name: 'Door 2',
    categories: ['Door'],
  },
  {
    id: 59,
    name: 'Door 3',
    categories: ['Door'],
  },
  {
    id: 60,
    name: 'Door 4',
    categories: ['Door'],
  },
  {
    id: 61,
    name: 'Door 5',
    categories: ['Door'],
  },
  {
    id: 62,
    name: 'Door 6',
    categories: ['Door'],
  },
  {
    id: 63,
    name: 'Door 7',
    categories: ['Door'],
  },
  {
    id: 64,
    name: 'Door 8',
    categories: ['Door'],
  },
  {
    id: 65,
    name: 'Trapdoor 1',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 66,
    name: 'Trapdoor 2',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 68,
    name: 'Bridge (Flat)',
    categories: ['Scenery'],
  },
  {
    id: 69,
    name: 'Bridge (Tilt 1)',
    categories: ['Scenery'],
  },
  {
    id: 70,
    name: 'Bridge (Tilt 2)',
    categories: ['Scenery'],
  },
  {
    id: 71,
    name: 'PassportOpening',
  },
  {
    id: 72,
    name: 'Compass',
  },
  {
    id: 73,
    name: 'LarasHomePolaroid',
  },
  {
    id: 74,
    name: 'Animating 1',
    categories: ['Scenery'],
  },
  {
    id: 75,
    name: 'Animating 2',
    categories: ['Scenery'],
  },
  {
    id: 76,
    name: 'Animating 3',
    categories: ['Scenery'],
  },
  {
    id: 77,
    name: 'CutsceneActor1',
    categories: ['Entity'],
  },
  {
    id: 78,
    name: 'CutsceneActor2',
    categories: ['Entity'],
  },
  {
    id: 79,
    name: 'CutsceneActor3',
    categories: ['Entity'],
  },
  {
    id: 80,
    name: 'CutsceneActor4',
    categories: ['Entity'],
  },
  {
    id: 81,
    name: 'PassportClosed',
  },
  {
    id: 82,
    name: 'Map',
  },
  {
    id: 83,
    name: 'Savegame Crystal',
    categories: ['Special'],
  },
  {
    id: 84,
    name: 'Pistols',
    categories: ['Pickup'],
  },
  {
    id: 85,
    name: 'Shotgun',
    categories: ['Pickup'],
  },
  {
    id: 86,
    name: 'Magnums',
    categories: ['Pickup'],
  },
  {
    id: 87,
    name: 'Uzis',
    categories: ['Pickup'],
  },
  {
    id: 88,
    name: 'Pistol ammo',
    categories: ['Pickup'],
  },
  {
    id: 89,
    name: 'Shotgun ammo',
    categories: ['Pickup'],
  },
  {
    id: 90,
    name: 'Magnum ammo',
    categories: ['Pickup'],
  },
  {
    id: 91,
    name: 'Uzi ammo',
    categories: ['Pickup'],
  },
  {
    id: 92,
    name: 'ExplosiveSprite',
  },
  {
    id: 93,
    name: 'Small medipack',
    categories: ['Pickup'],
  },
  {
    id: 94,
    name: 'Large medipack',
    categories: ['Pickup'],
  },
  {
    id: 95,
    name: 'Sunglasses',
  },
  {
    id: 96,
    name: 'CassettePlayer',
  },
  {
    id: 97,
    name: 'DirectionKeys',
  },
  {
    id: 98,
    name: 'Flashlight',
  },
  {
    id: 99,
    name: 'Pistols',
  },
  {
    id: 100,
    name: 'Shotgun',
  },
  {
    id: 101,
    name: 'Magnums',
  },
  {
    id: 102,
    name: 'Uzis',
  },
  {
    id: 103,
    name: 'PistolAmmo',
  },
  {
    id: 104,
    name: 'ShotgunAmmo',
  },
  {
    id: 105,
    name: 'MagnumAmmo',
  },
  {
    id: 106,
    name: 'UziAmmo',
  },
  {
    id: 107,
    name: 'Explosive',
  },
  {
    id: 108,
    name: 'Small medipack',
  },
  {
    id: 109,
    name: 'Large medipack',
  },
  {
    id: 110,
    name: 'Puzzle 1',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 111,
    name: 'Puzzle 2',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 112,
    name: 'Puzzle 3',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 113,
    name: 'Puzzle 4',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 114,
    name: 'Puzzle 1',
  },
  {
    id: 115,
    name: 'Puzzle 2',
  },
  {
    id: 116,
    name: 'Puzzle 3',
  },
  {
    id: 117,
    name: 'Puzzle 4',
  },
  {
    id: 118,
    name: 'Slot 1',
    categories: ['Slot'],
  },
  {
    id: 119,
    name: 'Slot 2',
    categories: ['Slot'],
  },
  {
    id: 120,
    name: 'Slot 3',
    categories: ['Slot'],
  },
  {
    id: 121,
    name: 'Slot 4',
    categories: ['Slot'],
  },
  {
    id: 122,
    name: 'Slot 1 Done',
    categories: ['Slot'],
  },
  {
    id: 123,
    name: 'Slot 2 Done',
    categories: ['Slot'],
  },
  {
    id: 124,
    name: 'Slot 3 Done',
    categories: ['Slot'],
  },
  {
    id: 125,
    name: 'Slot 4 Done',
    categories: ['Slot'],
  },
  {
    id: 126,
    name: 'Lead Bar',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 127,
    name: 'Lead Bar',
  },
  {
    id: 128,
    name: 'Midas Hand',
    categories: ['Slot'],
  },
  {
    id: 129,
    name: 'Key 1',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 130,
    name: 'Key 2',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 131,
    name: 'Key 3',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 132,
    name: 'Key 4',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 133,
    name: 'Key 1',
  },
  {
    id: 134,
    name: 'Key 2',
  },
  {
    id: 135,
    name: 'Key 3',
  },
  {
    id: 136,
    name: 'Key 4',
  },
  {
    id: 137,
    name: 'Keyhole 1',
    categories: ['Keyhole'],
  },
  {
    id: 138,
    name: 'Keyhole 2',
    categories: ['Keyhole'],
  },
  {
    id: 139,
    name: 'Keyhole 3',
    categories: ['Keyhole'],
  },
  {
    id: 140,
    name: 'Keyhole 4',
    categories: ['Keyhole'],
  },
  {
    id: 141,
    name: 'Quest 1',
    categories: ['Pickup'],
  },
  {
    id: 142,
    name: 'Quest 2',
    categories: ['Pickup'],
  },
  {
    id: 143,
    name: 'Scion Piece',
    categories: ['Pickup'],
  },
  {
    id: 144,
    name: 'Scion Piece',
    categories: ['Pickup'],
  },
  {
    id: 145,
    name: 'Scion',
    categories: ['Entity'],
  },
  {
    id: 146,
    name: 'Scion',
    categories: ['Entity'],
  },
  {
    id: 147,
    name: 'Scion Holder',
    categories: ['Scenery'],
  },
  {
    id: 148,
    name: 'Quest 1',
  },
  {
    id: 149,
    name: 'Quest 2',
  },
  {
    id: 150,
    name: 'ScionPiece2',
  },
  {
    id: 151,
    name: 'Explosion',
  },
  {
    id: 153,
    name: 'Splash',
  },
  {
    id: 155,
    name: 'Bubbles',
  },
  {
    id: 158,
    name: 'Blood',
  },
  {
    id: 160,
    name: 'Smoke',
  },
  {
    id: 161,
    name: 'Centaur',
    categories: ['Entity'],
  },
  {
    id: 162,
    name: 'Suspended Shack',
    categories: ['Scenery'],
  },
  {
    id: 163,
    name: 'Mutant Egg (Big)',
    categories: ['Entity'],
  },
  {
    id: 164,
    name: 'Ricochet',
  },
  {
    id: 165,
    name: 'Sparkles',
  },
  {
    id: 166,
    name: 'Gunflare',
  },
  {
    id: 169,
    name: 'Camera Target',
    categories: ['Effect'],
  },
  {
    id: 170,
    name: 'Waterfall Mist',
    categories: ['Effect', 'Scenery'],
  },
  {
    id: 172,
    name: 'MutantBullet',
  },
  {
    id: 173,
    name: 'MutantGrenade',
  },
  {
    id: 176,
    name: 'LavaParticles',
    categories: ['Trap'],
  },
  {
    id: 177,
    name: 'Lava Emitter',
    categories: ['Trap'],
  },
  {
    id: 178,
    name: 'Flame',
    categories: ['Trap'],
  },
  {
    id: 179,
    name: 'Flame Emitter',
    categories: ['Trap'],
  },
  {
    id: 180,
    name: 'Lava Flow',
    categories: ['Trap'],
  },
  {
    id: 181,
    name: 'MutantEggBig',
    categories: ['Entity'],
  },
  {
    id: 182,
    name: 'Motorboat',
    categories: ['Scenery'],
  },
  {
    id: 183,
    name: 'Earthquake',
    categories: ['Effect'],
  },
  {
    id: 189,
    name: 'LaraPonytail',
  },
  {
    id: 190,
    name: 'FontGraphics',
  },
  {
    id: 191,
    name: 'Plant1',
    categories: ['Scenery'],
  },
  {
    id: 192,
    name: 'Plant2',
    categories: ['Scenery'],
  },
  {
    id: 193,
    name: 'Plant3',
    categories: ['Scenery'],
  },
  {
    id: 194,
    name: 'Plant4',
    categories: ['Scenery'],
  },
  {
    id: 195,
    name: 'Plant5',
    categories: ['Scenery'],
  },
  {
    id: 200,
    name: 'Bag1',
    categories: ['Scenery'],
  },
  {
    id: 204,
    name: 'Bag2',
    categories: ['Scenery'],
  },
  {
    id: 212,
    name: 'Rock1',
    categories: ['Scenery'],
  },
  {
    id: 213,
    name: 'Rock2',
    categories: ['Scenery'],
  },
  {
    id: 214,
    name: 'Rock3',
    categories: ['Scenery'],
  },
  {
    id: 215,
    name: 'Bag3',
    categories: ['Scenery'],
  },
  {
    id: 216,
    name: 'Pottery1',
    categories: ['Scenery'],
  },
  {
    id: 217,
    name: 'Pottery2',
    categories: ['Scenery'],
  },
  {
    id: 231,
    name: 'PaintedPot',
    categories: ['Scenery'],
  },
  {
    id: 233,
    name: 'IncaMummy',
    categories: ['Scenery'],
  },
  {
    id: 236,
    name: 'Pottery3',
    categories: ['Scenery'],
  },
  {
    id: 237,
    name: 'Pottery4',
    categories: ['Scenery'],
  },
  {
    id: 238,
    name: 'Pottery5',
    categories: ['Scenery'],
  },
  {
    id: 239,
    name: 'Pottery6',
    categories: ['Scenery'],
  },
] as Entity[]

// Entity database for each game version and every entity
export const EntityDB: { [key in tr_version]?: Entity[] } = {
  [tr_version.TR1]: tr1Data,
}

/**
 * Check if an entity is in a specific category
 * @param entity tr_entity to check
 * @param category Category of the entity to check for
 * @param version Version of the game
 */
export function isEntityInCategory(entity: tr_entity, category: Category, version: tr_version): boolean {
  const dbEntity = EntityDB[version]?.find((e) => e.id === entity.type)
  return dbEntity?.categories?.includes(category) ?? false
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
