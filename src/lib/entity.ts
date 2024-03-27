// =============================================================================
// Project: WebGL Tomb Raider
// Entity database for mapping entity types (aka IDs) to names and categories
// =============================================================================

import { entity, version } from './types'

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
  | 'Particles'

type Entity = {
  id: number
  name: string
  categories?: Category[]
}

// Copied from trview.app/Resources/Files/type_names.txt
// Small modifications have been made to categories
// https://github.com/chreden/trview
// Used under the MIT license
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
    categories: ['Trap', 'Particles'],
  },
  {
    id: 178,
    name: 'Flame',
    categories: ['Trap'],
  },
  {
    id: 179,
    name: 'Flame Emitter',
    categories: ['Trap', 'Particles'],
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

const tr2Data = [
  {
    id: 0,
    name: 'Lara',
    categories: ['Lara'],
  },
  {
    id: 1,
    name: 'LaraPistolsAnim',
  },
  {
    id: 2,
    name: 'LaraPonytail',
  },
  {
    id: 3,
    name: 'LaraShotgunAnim',
  },
  {
    id: 4,
    name: 'LaraAutopistolsAnim',
  },
  {
    id: 5,
    name: 'LaraUzisAnim',
  },
  {
    id: 6,
    name: 'LaraM16Anim',
  },
  {
    id: 7,
    name: 'LaraGrenadeLauncherAnim',
  },
  {
    id: 8,
    name: 'LaraHarpoonGunAnim',
  },
  {
    id: 9,
    name: 'LaraFlareAnim',
  },
  {
    id: 10,
    name: 'LaraSnowmobileAnim',
  },
  {
    id: 11,
    name: 'LaraBoatAnim',
  },
  {
    id: 12,
    name: 'AlternativeLara',
  },
  {
    id: 13,
    name: 'Skidoo',
    categories: ['Vehicle'],
  },
  {
    id: 14,
    name: 'Boat',
    categories: ['Vehicle'],
  },
  {
    id: 15,
    name: 'Dog',
    categories: ['Entity'],
  },
  {
    id: 16,
    name: 'Masked Goon 1',
    categories: ['Entity'],
  },
  {
    id: 17,
    name: 'Masked Goon 2',
    categories: ['Entity'],
  },
  {
    id: 18,
    name: 'Masked Goon 3',
    categories: ['Entity'],
  },
  {
    id: 19,
    name: 'Knife thrower',
    categories: ['Entity'],
  },
  {
    id: 20,
    name: 'Shotgun Goon',
    categories: ['Entity'],
  },
  {
    id: 21,
    name: 'Rat',
    categories: ['Entity'],
  },
  {
    id: 22,
    name: 'DragonFront',
    categories: ['Entity'],
  },
  {
    id: 23,
    name: 'DragonBack',
    categories: ['Entity'],
  },
  {
    id: 24,
    name: 'Gondola',
    categories: ['Scenery'],
  },
  {
    id: 25,
    name: 'Shark',
    categories: ['Entity'],
  },
  {
    id: 26,
    name: 'Yellow Eel',
    categories: ['Entity'],
  },
  {
    id: 27,
    name: 'Black Eel',
    categories: ['Entity'],
  },
  {
    id: 28,
    name: 'Barracuda',
    categories: ['Entity'],
  },
  {
    id: 29,
    name: 'Scuba Diver',
    categories: ['Entity'],
  },
  {
    id: 30,
    name: 'Shotgun Goon',
    categories: ['Entity'],
  },
  {
    id: 31,
    name: 'Rifle Goon',
    categories: ['Entity'],
  },
  {
    id: 32,
    name: 'Stick Goon 1',
    categories: ['Entity'],
  },
  {
    id: 33,
    name: 'Stick Goon 2',
    categories: ['Entity'],
  },
  {
    id: 34,
    name: 'Flamethrower',
    categories: ['Entity'],
  },
  {
    id: 36,
    name: 'Spider',
    categories: ['Entity'],
  },
  {
    id: 37,
    name: 'Giant Spider',
    categories: ['Entity'],
  },
  {
    id: 38,
    name: 'Crow',
    categories: ['Entity'],
  },
  {
    id: 39,
    name: 'Tiger/Leopard',
    categories: ['Entity'],
  },
  {
    id: 40,
    name: 'Bartoli',
    categories: ['Entity'],
  },
  {
    id: 41,
    name: 'Guard (Spear)',
    categories: ['Entity'],
  },
  {
    id: 42,
    name: 'XianGuardSpearStatue',
    categories: ['Entity'],
  },
  {
    id: 43,
    name: 'Guard (Sword)',
    categories: ['Entity'],
  },
  {
    id: 44,
    name: 'XianGuardSwordStatue',
    categories: ['Entity'],
  },
  {
    id: 45,
    name: 'Yeti',
    categories: ['Entity'],
  },
  {
    id: 46,
    name: 'Guardian',
    categories: ['Entity'],
  },
  {
    id: 47,
    name: 'Eagle',
    categories: ['Entity'],
  },
  {
    id: 48,
    name: 'Mercenary 1',
    categories: ['Entity'],
  },
  {
    id: 49,
    name: 'Mercenary 2',
    categories: ['Entity'],
  },
  {
    id: 50,
    name: 'Mercenary 3',
    categories: ['Entity'],
  },
  {
    id: 51,
    name: 'Black Skidoo',
    categories: ['Entity'],
  },
  {
    id: 52,
    name: 'Skidoo Driver',
    categories: ['Entity'],
  },
  {
    id: 53,
    name: 'Monk 1',
    categories: ['Entity'],
  },
  {
    id: 54,
    name: 'Monk 2',
    categories: ['Entity'],
  },
  {
    id: 55,
    name: 'Breakable Tile',
    categories: ['Trap'],
  },
  {
    id: 57,
    name: 'Loose Boards',
    categories: ['Trap'],
  },
  {
    id: 58,
    name: 'Swinging Sandbag',
    categories: ['Trap'],
  },
  {
    id: 59,
    name: 'Spikes',
    categories: ['Trap'],
  },
  {
    id: 60,
    name: 'Boulder',
    categories: ['Trap'],
  },
  {
    id: 61,
    name: 'Dart',
    categories: ['Trap'],
  },
  {
    id: 62,
    name: 'Dart Emitter',
    categories: ['Trap'],
  },
  {
    id: 63,
    name: 'Drawbridge',
    categories: ['Trapdoor', 'Door'],
  },
  {
    id: 64,
    name: 'Slamming Doors',
    categories: ['Trap'],
  },
  {
    id: 65,
    name: 'Elevator',
    categories: ['Movable'],
  },
  {
    id: 66,
    name: 'Minisub',
    categories: ['Scenery'],
  },
  {
    id: 67,
    name: 'Pushable Block 1',
    categories: ['Movable'],
  },
  {
    id: 68,
    name: 'Pushable Block 2',
    categories: ['Movable'],
  },
  {
    id: 69,
    name: 'Pushable Block 3',
    categories: ['Movable'],
  },
  {
    id: 70,
    name: 'Pushable Block 4',
    categories: ['Movable'],
  },
  {
    id: 71,
    name: 'Lava bowl',
    categories: ['Scenery'],
  },
  {
    id: 72,
    name: 'Breakable Window',
    categories: ['Scenery'],
  },
  {
    id: 73,
    name: 'Breakable Window',
    categories: ['Scenery'],
  },
  {
    id: 76,
    name: 'Propeller',
    categories: ['Trap'],
  },
  {
    id: 77,
    name: 'PowerSaw',
    categories: ['Trap'],
  },
  {
    id: 78,
    name: 'Hook',
    categories: ['Trap'],
  },
  {
    id: 79,
    name: 'Falling Ceiling',
    categories: ['Trap'],
  },
  {
    id: 80,
    name: 'Rolling Spindle',
    categories: ['Trap'],
  },
  {
    id: 81,
    name: 'Wall Blade',
    categories: ['Trap'],
  },
  {
    id: 82,
    name: 'Statue Blade',
    categories: ['Trap'],
  },
  {
    id: 83,
    name: 'Boulders',
    categories: ['Trap'],
  },
  {
    id: 84,
    name: 'Icicles',
    categories: ['Trap'],
  },
  {
    id: 85,
    name: 'Spike Wall',
    categories: ['Trap'],
  },
  {
    id: 86,
    name: 'Springboard',
    categories: ['Trap'],
  },
  {
    id: 87,
    name: 'Spike Ceiling',
    categories: ['Trap'],
  },
  {
    id: 88,
    name: 'Bell',
    categories: ['Scenery'],
  },
  {
    id: 89,
    name: 'BoatWake',
  },
  {
    id: 90,
    name: 'SnowmobileWake',
  },
  {
    id: 91,
    name: 'SnowmobileBelt',
  },
  {
    id: 92,
    name: 'Wheel Door',
    categories: ['Door'],
  },
  {
    id: 93,
    name: 'Small Switch',
    categories: ['Switch'],
  },
  {
    id: 94,
    name: 'Underwater Fan',
    categories: ['Trap'],
  },
  {
    id: 95,
    name: 'Fan',
    categories: ['Trap'],
  },
  {
    id: 96,
    name: 'Swinging Box',
    categories: ['Trap'],
  },
  {
    id: 97,
    name: 'CutsceneActor1',
    categories: ['Entity'],
  },
  {
    id: 98,
    name: 'CutsceneActor2',
    categories: ['Entity'],
  },
  {
    id: 99,
    name: 'CutsceneActor3',
    categories: ['Entity'],
  },
  {
    id: 100,
    name: 'UIFrame',
  },
  {
    id: 101,
    name: 'Rolling Barrels',
    categories: ['Trap'],
  },
  {
    id: 102,
    name: 'Zipline',
    categories: ['Vehicle'],
  },
  {
    id: 103,
    name: 'Button',
    categories: ['Switch'],
  },
  {
    id: 104,
    name: 'Wall Switch',
    categories: ['Switch'],
  },
  {
    id: 105,
    name: 'Underwater Lever',
    categories: ['Switch'],
  },
  {
    id: 106,
    name: 'Door 1',
    categories: ['Door'],
  },
  {
    id: 107,
    name: 'Door 2',
    categories: ['Door'],
  },
  {
    id: 108,
    name: 'Door 3',
    categories: ['Door'],
  },
  {
    id: 109,
    name: 'Door 4',
    categories: ['Door'],
  },
  {
    id: 110,
    name: 'Door 5',
    categories: ['Door'],
  },
  {
    id: 111,
    name: 'Door 6',
    categories: ['Door'],
  },
  {
    id: 112,
    name: 'Door 7',
    categories: ['Door'],
  },
  {
    id: 113,
    name: 'Door 8',
    categories: ['Door'],
  },
  {
    id: 114,
    name: 'Trapdoor 1',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 115,
    name: 'Trapdoor 2',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 116,
    name: 'Trapdoor 3',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 117,
    name: 'Bridge (Flat)',
    categories: ['Scenery'],
  },
  {
    id: 118,
    name: 'Bridge (Tilt 1)',
    categories: ['Scenery'],
  },
  {
    id: 119,
    name: 'Bridge (Tilt 2)',
    categories: ['Scenery'],
  },
  {
    id: 120,
    name: 'PassportOpening',
  },
  {
    id: 121,
    name: 'Compass',
  },
  {
    id: 122,
    name: 'LarasHomePolaroid',
  },
  {
    id: 123,
    name: 'CutsceneActor4',
    categories: ['Entity'],
  },
  {
    id: 124,
    name: 'CutsceneActor5',
    categories: ['Entity'],
  },
  {
    id: 125,
    name: 'CutsceneActor6',
    categories: ['Entity'],
  },
  {
    id: 126,
    name: 'CutsceneActor7',
    categories: ['Entity'],
  },
  {
    id: 127,
    name: 'CutsceneActor8',
    categories: ['Entity'],
  },
  {
    id: 128,
    name: 'CutsceneActor9',
    categories: ['Entity'],
  },
  {
    id: 129,
    name: 'CutsceneActor10',
    categories: ['Entity'],
  },
  {
    id: 130,
    name: 'CutsceneActor11',
    categories: ['Entity'],
  },
  {
    id: 133,
    name: 'PassportClosed',
    categories: ['Entity'],
  },
  {
    id: 134,
    name: 'Map',
  },
  {
    id: 135,
    name: 'Pistols',
    categories: ['Pickup'],
  },
  {
    id: 136,
    name: 'Shotgun',
    categories: ['Pickup'],
  },
  {
    id: 137,
    name: 'Auto pistols',
    categories: ['Pickup'],
  },
  {
    id: 138,
    name: 'Uzis',
    categories: ['Pickup'],
  },
  {
    id: 139,
    name: 'Harpoon Gun',
    categories: ['Pickup'],
  },
  {
    id: 140,
    name: 'M16',
    categories: ['Pickup'],
  },
  {
    id: 141,
    name: 'Grenade launcher',
    categories: ['Pickup'],
  },
  {
    id: 142,
    name: 'PistolAmmoSprite',
    categories: ['Pickup'],
  },
  {
    id: 143,
    name: 'Shotgun shells',
    categories: ['Pickup'],
  },
  {
    id: 144,
    name: 'Auto pistol ammo',
    categories: ['Pickup'],
  },
  {
    id: 145,
    name: 'Uzi ammo',
    categories: ['Pickup'],
  },
  {
    id: 146,
    name: 'Harpoons',
    categories: ['Pickup'],
  },
  {
    id: 147,
    name: 'M16 ammo',
    categories: ['Pickup'],
  },
  {
    id: 148,
    name: 'Grenades',
    categories: ['Pickup'],
  },
  {
    id: 149,
    name: 'Small medipack',
    categories: ['Pickup'],
  },
  {
    id: 150,
    name: 'Large medipack',
    categories: ['Pickup'],
  },
  {
    id: 151,
    name: 'Flares',
    categories: ['Pickup'],
  },
  {
    id: 152,
    name: 'Flare',
    categories: ['Pickup'],
  },
  {
    id: 153,
    name: 'Sunglasses',
  },
  {
    id: 154,
    name: 'CassettePlayer',
  },
  {
    id: 155,
    name: 'DirectionKeys',
  },
  {
    id: 157,
    name: 'Pistols',
  },
  {
    id: 158,
    name: 'Shotgun',
  },
  {
    id: 159,
    name: 'Autopistols',
  },
  {
    id: 160,
    name: 'Uzis',
  },
  {
    id: 161,
    name: 'HarpoonGun',
  },
  {
    id: 162,
    name: 'M16',
  },
  {
    id: 163,
    name: 'GrenadeLauncher',
  },
  {
    id: 164,
    name: 'PistolAmmo',
  },
  {
    id: 165,
    name: 'ShotgunAmmo',
  },
  {
    id: 166,
    name: 'AutopistolAmmo',
  },
  {
    id: 167,
    name: 'UziAmmo',
  },
  {
    id: 168,
    name: 'HarpoonGunAmmo',
  },
  {
    id: 169,
    name: 'M16Ammo',
  },
  {
    id: 170,
    name: 'GrenadeLauncherAmmo',
  },
  {
    id: 171,
    name: 'SmallMedipack',
  },
  {
    id: 172,
    name: 'LargeMedipack',
  },
  {
    id: 173,
    name: 'Flares',
    categories: ['Pickup'],
  },
  {
    id: 174,
    name: 'Puzzle 1',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 175,
    name: 'Puzzle 2',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 176,
    name: 'Puzzle 3',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 177,
    name: 'Puzzle 4',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 178,
    name: 'Puzzle 1',
  },
  {
    id: 179,
    name: 'Puzzle 2',
  },
  {
    id: 180,
    name: 'Puzzle 3',
  },
  {
    id: 181,
    name: 'Puzzle 4',
  },
  {
    id: 182,
    name: 'Slot 1',
    categories: ['Slot'],
  },
  {
    id: 183,
    name: 'Slot 2',
    categories: ['Slot'],
  },
  {
    id: 184,
    name: 'Slot 3',
    categories: ['Slot'],
  },
  {
    id: 185,
    name: 'Slot 4',
    categories: ['Slot'],
  },
  {
    id: 186,
    name: 'Slot 1 Done',
    categories: ['Slot'],
  },
  {
    id: 187,
    name: 'Slot 2 Done',
    categories: ['Slot'],
  },
  {
    id: 188,
    name: 'Slot 3 Done',
    categories: ['Slot'],
  },
  {
    id: 189,
    name: 'Slot 4 Done',
    categories: ['Slot'],
  },
  {
    id: 190,
    name: 'Secret (Gold)',
    categories: ['Pickup'],
  },
  {
    id: 191,
    name: 'Secret (Jade)',
    categories: ['Pickup'],
  },
  {
    id: 192,
    name: 'Secret (Stone)',
    categories: ['Pickup'],
  },
  {
    id: 193,
    name: 'Key 1',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 194,
    name: 'Key 2',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 195,
    name: 'Key 3',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 196,
    name: 'Key 4',
    categories: ['Pickup', 'Key'],
  },
  {
    id: 197,
    name: 'Key 1',
  },
  {
    id: 198,
    name: 'Key 2',
  },
  {
    id: 199,
    name: 'Key 3',
  },
  {
    id: 200,
    name: 'Key 4',
  },
  {
    id: 201,
    name: 'Keyhole 1',
    categories: ['Keyhole'],
  },
  {
    id: 202,
    name: 'Keyhole 2',
    categories: ['Keyhole'],
  },
  {
    id: 203,
    name: 'Keyhole 3',
    categories: ['Keyhole'],
  },
  {
    id: 204,
    name: 'Keyhole 4',
    categories: ['Keyhole'],
  },
  {
    id: 205,
    name: 'Quest Item 1',
    categories: ['Pickup'],
  },
  {
    id: 206,
    name: 'The Talion',
    categories: ['Pickup'],
  },
  {
    id: 207,
    name: 'QuestItem1',
    categories: ['Pickup'],
  },
  {
    id: 208,
    name: 'QuestItem2',
    categories: ['Pickup'],
  },
  {
    id: 209,
    name: 'DragonExplosionEffect',
  },
  {
    id: 210,
    name: 'DragonExplosionEffect2',
  },
  {
    id: 211,
    name: 'DragonExplosionEffect3',
  },
  {
    id: 212,
    name: 'Alarm',
    categories: ['Effect'],
  },
  {
    id: 213,
    name: 'Dripping Water',
    categories: ['Effect'],
  },
  {
    id: 214,
    name: 'T-Rex',
    categories: ['Entity'],
  },
  {
    id: 215,
    name: 'Singing Birds',
    categories: ['Effect'],
  },
  {
    id: 216,
    name: 'BartoliHideoutClock',
    categories: ['Effect'],
  },
  {
    id: 217,
    name: 'Placeholder',
  },
  {
    id: 218,
    name: 'DragonBonesFront',
  },
  {
    id: 219,
    name: 'DragonBonesBack',
  },
  {
    id: 220,
    name: 'ExtraFire',
  },
  {
    id: 222,
    name: 'Mine',
    categories: ['Trap'],
  },
  {
    id: 223,
    name: 'MenuBackground',
  },
  {
    id: 224,
    name: 'GrayDisk',
    categories: ['Trap'],
  },
  {
    id: 225,
    name: 'GongStick',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 226,
    name: 'Gong',
    categories: ['Slot'],
  },
  {
    id: 227,
    name: 'Detonator',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 228,
    name: 'Helicopter',
    categories: ['Scenery'],
  },
  {
    id: 229,
    name: 'Explosion',
  },
  {
    id: 230,
    name: 'Splash',
  },
  {
    id: 231,
    name: 'Bubbles',
  },
  {
    id: 233,
    name: 'Blood',
  },
  {
    id: 235,
    name: 'FlareSparkles',
  },
  {
    id: 236,
    name: 'Glow',
  },
  {
    id: 238,
    name: 'Ricochet',
  },
  {
    id: 240,
    name: 'Gunflare',
  },
  {
    id: 241,
    name: 'M16Gunflare',
  },
  {
    id: 243,
    name: 'Camera Target',
    categories: ['Effect'],
  },
  {
    id: 244,
    name: 'Waterfall Mist',
    categories: ['Effect'],
  },
  {
    id: 245,
    name: 'Harpoon',
  },
  {
    id: 247,
    name: 'Placeholder',
  },
  {
    id: 248,
    name: 'GrenadeSingle',
  },
  {
    id: 249,
    name: 'HarpoonFlying',
  },
  {
    id: 250,
    name: 'LavaParticles',
  },
  {
    id: 251,
    name: 'Lava Emitter',
    categories: ['Trap', 'Particles'],
  },
  {
    id: 252,
    name: 'Flame',
  },
  {
    id: 253,
    name: 'Flame Emitter',
    categories: ['Fire', 'Particles'],
  },
  {
    id: 254,
    name: 'Skybox',
  },
  {
    id: 255,
    name: 'FontGraphics',
  },
  {
    id: 256,
    name: 'Monk',
    categories: ['Entity'],
  },
  {
    id: 257,
    name: 'Doorbell',
    categories: ['Effect'],
  },
  {
    id: 258,
    name: 'AlarmBell',
    categories: ['Effect'],
  },
  {
    id: 259,
    name: 'Helicopter',
    categories: ['Entity'],
  },
  {
    id: 260,
    name: 'Winston',
    categories: ['Entity'],
  },
  {
    id: 262,
    name: 'LaraCutscenePlacement',
    categories: ['Scenery'],
  },
  {
    id: 263,
    name: 'ShotgunAnimation',
    categories: ['Scenery'],
  },
  {
    id: 264,
    name: 'Dragon (Emitter)',
    categories: ['Entity'],
  },
] as Entity[]

const tr3Data = [
  {
    id: 0,
    name: 'Lara',
    categories: ['Entity', 'Lara'],
  },
  {
    id: 1,
    name: 'LaraPistolsAnim',
  },
  {
    id: 2,
    name: 'LaraPonytail',
  },
  {
    id: 3,
    name: 'LaraShotgunAnim',
  },
  {
    id: 4,
    name: 'LaraDesertEagleAnim',
  },
  {
    id: 5,
    name: 'LaraUzisAnim',
  },
  {
    id: 6,
    name: 'LaraMP5Anim',
  },
  {
    id: 7,
    name: 'LaraRocketLauncherAnim',
  },
  {
    id: 8,
    name: 'LaraGrenadeLauncherAnim',
  },
  {
    id: 9,
    name: 'LaraHarpoonGunAnim',
  },
  {
    id: 10,
    name: 'LaraFlareAnim',
  },
  {
    id: 11,
    name: 'LaraUPVAnim',
  },
  {
    id: 12,
    name: 'UPV',
    categories: ['Vehicle'],
  },
  {
    id: 14,
    name: 'Kayak',
    categories: ['Vehicle'],
  },
  {
    id: 15,
    name: 'Inflatable Boat',
    categories: ['Vehicle'],
  },
  {
    id: 16,
    name: 'Quadbike',
    categories: ['Vehicle'],
  },
  {
    id: 17,
    name: 'Minecart',
    categories: ['Vehicle'],
  },
  {
    id: 18,
    name: 'Turret',
    categories: ['Entity'],
  },
  {
    id: 19,
    name: 'UPV',
    categories: ['Vehicle'],
  },
  {
    id: 20,
    name: 'Tribesman (Axe)',
    categories: ['Entity'],
  },
  {
    id: 21,
    name: 'Tribesman (Dart)',
    categories: ['Entity'],
  },
  {
    id: 22,
    name: 'Dog',
    categories: ['Entity'],
  },
  {
    id: 23,
    name: 'Rat',
    categories: ['Entity'],
  },
  {
    id: 24,
    name: 'Kill All Triggers',
  },
  {
    id: 25,
    name: 'Killer Whale',
    categories: ['Entity'],
  },
  {
    id: 26,
    name: 'Scuba Diver',
    categories: ['Entity'],
  },
  {
    id: 27,
    name: 'Crow',
    categories: ['Entity'],
  },
  {
    id: 28,
    name: 'Tiger',
    categories: ['Entity'],
  },
  {
    id: 29,
    name: 'Vulture',
    categories: ['Entity'],
  },
  {
    id: 30,
    name: 'Target',
    categories: ['Entity'],
  },
  {
    id: 31,
    name: 'Crawler Mutant',
    categories: ['Entity'],
  },
  {
    id: 32,
    name: 'Crocodile',
    categories: ['Entity'],
  },
  {
    id: 34,
    name: 'Compsognathus',
    categories: ['Entity'],
  },
  {
    id: 35,
    name: 'Lizard',
    categories: ['Entity'],
  },
  {
    id: 36,
    name: 'Puna',
    categories: ['Entity'],
  },
  {
    id: 37,
    name: 'Mercenary',
    categories: ['Entity'],
  },
  {
    id: 38,
    name: 'Hanging Raptor',
    categories: ['Entity', 'Scenery'],
  },
  {
    id: 39,
    name: 'RX-Tech Guy (Red)',
    categories: ['Entity'],
  },
  {
    id: 40,
    name: 'RX-Tech Guy (White)',
    categories: ['Entity'],
  },
  {
    id: 41,
    name: 'Dog',
    categories: ['Entity'],
  },
  {
    id: 42,
    name: 'Crawler Mutant',
    categories: ['Entity'],
  },
  {
    id: 44,
    name: 'Wasp',
    categories: ['Entity'],
  },
  {
    id: 45,
    name: 'Monster',
    categories: ['Entity'],
  },
  {
    id: 46,
    name: 'Monster (Claw)',
    categories: ['Entity'],
  },
  {
    id: 47,
    name: 'Wasp Spawn',
    categories: ['Entity'],
  },
  {
    id: 48,
    name: 'Raptor Spawn',
    categories: ['Entity'],
  },
  {
    id: 49,
    name: 'Willard',
    categories: ['Entity'],
  },
  {
    id: 50,
    name: 'Flamethrower Guy',
    categories: ['Entity'],
  },
  {
    id: 51,
    name: 'Guard (MP5)',
    categories: ['Entity'],
  },
  {
    id: 53,
    name: 'Punk',
    categories: ['Entity'],
  },
  {
    id: 56,
    name: 'Guard (Handgun)',
    categories: ['Entity'],
  },
  {
    id: 57,
    name: 'Sophia Leigh',
    categories: ['Entity'],
  },
  {
    id: 58,
    name: 'Cleaner Robot',
    categories: ['Entity'],
  },
  {
    id: 60,
    name: 'MP (Baton)',
    categories: ['Entity'],
  },
  {
    id: 61,
    name: 'MP (Handgun)',
    categories: ['Entity'],
  },
  {
    id: 62,
    name: 'Prisoner',
    categories: ['Entity'],
  },
  {
    id: 63,
    name: 'MP (MP5)',
    categories: ['Entity'],
  },
  {
    id: 64,
    name: 'Gun Turret',
    categories: ['Entity'],
  },
  {
    id: 65,
    name: 'Dam Guard',
    categories: ['Entity'],
  },
  {
    id: 66,
    name: 'Tripwire',
  },
  {
    id: 67,
    name: 'Electrified Wire',
  },
  {
    id: 68,
    name: 'Killer Tripwire',
    categories: ['Trap'],
  },
  {
    id: 69,
    name: 'Cobra',
    categories: ['Entity'],
  },
  {
    id: 70,
    name: 'Shiva',
    categories: ['Entity'],
  },
  {
    id: 71,
    name: 'Monkey',
    categories: ['Entity'],
  },
  {
    id: 73,
    name: 'Tony',
    categories: ['Entity'],
  },
  {
    id: 74,
    name: 'AI Guard',
    categories: ['AI'],
  },
  {
    id: 75,
    name: 'AI Ambush',
    categories: ['AI'],
  },
  {
    id: 76,
    name: 'AI Patrol 1',
    categories: ['AI'],
  },
  {
    id: 77,
    name: 'AI Modify',
    categories: ['AI'],
  },
  {
    id: 78,
    name: 'AI Follow',
    categories: ['AI'],
  },
  {
    id: 79,
    name: 'AI Patrol 2',
    categories: ['AI'],
  },
  {
    id: 80,
    name: 'AI Path',
    categories: ['AI'],
  },
  {
    id: 81,
    name: 'AI Check',
    categories: ['AI'],
  },
  {
    id: 82,
    name: 'Unknown',
  },
  {
    id: 83,
    name: 'Breakable tile',
    categories: ['Trap'],
  },
  {
    id: 86,
    name: 'Swinging Thing',
    categories: ['Trap'],
  },
  {
    id: 87,
    name: 'Spikes',
    categories: ['Trap'],
  },
  {
    id: 88,
    name: 'Boulder',
    categories: ['Trap'],
  },
  {
    id: 89,
    name: 'Giant Boulder',
    categories: ['Trap'],
  },
  {
    id: 90,
    name: 'Dart',
    categories: ['Trap'],
  },
  {
    id: 91,
    name: 'Dart Emitter',
    categories: ['Trap'],
  },
  {
    id: 94,
    name: 'Skeleton Trap',
    categories: ['Trap'],
  },
  {
    id: 97,
    name: 'Pushable Block 1',
    categories: ['Movable'],
  },
  {
    id: 98,
    name: 'Pushable Block 2',
    categories: ['Movable'],
  },
  {
    id: 101,
    name: 'Breakable Window',
    categories: ['Scenery'],
  },
  {
    id: 102,
    name: 'Breakable Window',
    categories: ['Scenery'],
  },
  {
    id: 106,
    name: 'Hook',
    categories: ['Trap'],
  },
  {
    id: 107,
    name: 'Falling Ceiling',
    categories: ['Trap'],
  },
  {
    id: 108,
    name: 'Rolling Spindle',
    categories: ['Trap'],
  },
  {
    id: 110,
    name: 'Train',
    categories: ['Trap'],
  },
  {
    id: 111,
    name: 'Wall Blade',
    categories: ['Trap'],
  },
  {
    id: 113,
    name: 'Icicles',
    categories: ['Trap'],
  },
  {
    id: 114,
    name: 'Spike Wall',
    categories: ['Trap'],
  },
  {
    id: 116,
    name: 'Spike Wall (Vertical)',
    categories: ['Trap'],
  },
  {
    id: 117,
    name: 'Wheel Door',
    categories: ['Door'],
  },
  {
    id: 118,
    name: 'Small Switch',
    categories: ['Switch'],
  },
  {
    id: 119,
    name: 'Propeller/Diver/Meteor',
    categories: ['Trap'],
  },
  {
    id: 120,
    name: 'Fan',
    categories: ['Trap'],
  },
  {
    id: 121,
    name: 'Stamper/Drum/Blades',
    categories: ['Trap'],
  },
  {
    id: 122,
    name: 'Shiva',
    categories: ['Entity'],
  },
  {
    id: 123,
    name: 'MonkeyMedipackMeshswap',
  },
  {
    id: 124,
    name: 'MonkeyKeyMeshswap',
  },
  {
    id: 125,
    name: 'UIFrame',
  },
  {
    id: 127,
    name: 'Zipline',
    categories: ['Vehicle'],
  },
  {
    id: 128,
    name: 'Button',
    categories: ['Switch'],
  },
  {
    id: 129,
    name: 'Wall Switch',
    categories: ['Switch'],
  },
  {
    id: 130,
    name: 'Underwater Lever',
    categories: ['Switch'],
  },
  {
    id: 131,
    name: 'Door 1',
    categories: ['Door'],
  },
  {
    id: 132,
    name: 'Door 2',
    categories: ['Door'],
  },
  {
    id: 133,
    name: 'Door 3',
    categories: ['Door'],
  },
  {
    id: 134,
    name: 'Door 4',
    categories: ['Door'],
  },
  {
    id: 135,
    name: 'Door 5',
    categories: ['Door'],
  },
  {
    id: 136,
    name: 'Door 6',
    categories: ['Door'],
  },
  {
    id: 137,
    name: 'Door 7',
    categories: ['Door'],
  },
  {
    id: 138,
    name: 'Door 8',
    categories: ['Door'],
  },
  {
    id: 139,
    name: 'Trapdoor 1',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 140,
    name: 'Trapdoor 2',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 141,
    name: 'Trapdoor 3',
    categories: ['Door', 'Trapdoor'],
  },
  {
    id: 142,
    name: 'Bridge (Flat)',
    categories: ['Scenery'],
  },
  {
    id: 143,
    name: 'Bridge (Tilt 1)',
    categories: ['Scenery'],
  },
  {
    id: 144,
    name: 'Bridge (Tilt 2)',
    categories: ['Scenery'],
  },
  {
    id: 145,
    name: 'PassportOpening',
  },
  {
    id: 146,
    name: 'Compass',
  },
  {
    id: 147,
    name: 'LarasHomePolaroid',
  },
  {
    id: 148,
    name: 'CutsceneActor1',
  },
  {
    id: 149,
    name: 'CutsceneActor2',
  },
  {
    id: 150,
    name: 'CutsceneActor3',
  },
  {
    id: 151,
    name: 'CutsceneActor4',
  },
  {
    id: 152,
    name: 'CutsceneActor5',
  },
  {
    id: 153,
    name: 'CutsceneActor6',
  },
  {
    id: 154,
    name: 'CutsceneActor7',
  },
  {
    id: 155,
    name: 'CutsceneActor8',
  },
  {
    id: 156,
    name: 'CutsceneActor9',
  },
  {
    id: 158,
    name: 'PassportClosed',
  },
  {
    id: 159,
    name: 'Map',
  },
  {
    id: 160,
    name: 'Pistols',
    categories: ['Pickup'],
  },
  {
    id: 161,
    name: 'Shotgun',
    categories: ['Pickup'],
  },
  {
    id: 162,
    name: 'Desert Eagle',
    categories: ['Pickup'],
  },
  {
    id: 163,
    name: 'Uzis',
    categories: ['Pickup'],
  },
  {
    id: 164,
    name: 'Harpoon Gun',
    categories: ['Pickup'],
  },
  {
    id: 165,
    name: 'MP5',
    categories: ['Pickup'],
  },
  {
    id: 166,
    name: 'Rocket Launcher',
    categories: ['Pickup'],
  },
  {
    id: 167,
    name: 'Grenade Launcher',
    categories: ['Pickup'],
  },
  {
    id: 168,
    name: 'PistolAmmoOnGround',
    categories: ['Pickup'],
  },
  {
    id: 169,
    name: 'Shotgun shells',
    categories: ['Pickup'],
  },
  {
    id: 170,
    name: 'Desert Eagle ammo',
    categories: ['Pickup'],
  },
  {
    id: 171,
    name: 'Uzi ammo',
    categories: ['Pickup'],
  },
  {
    id: 172,
    name: 'Harpoons',
    categories: ['Pickup'],
  },
  {
    id: 173,
    name: 'MP5 ammo',
    categories: ['Pickup'],
  },
  {
    id: 174,
    name: 'Rocket',
    categories: ['Pickup'],
  },
  {
    id: 175,
    name: 'Grenades',
    categories: ['Pickup'],
  },
  {
    id: 176,
    name: 'Small Medipack',
    categories: ['Pickup'],
  },
  {
    id: 177,
    name: 'Large Medipack',
    categories: ['Pickup'],
  },
  {
    id: 178,
    name: 'Flares',
    categories: ['Pickup'],
  },
  {
    id: 179,
    name: 'Flare',
    categories: ['Pickup'],
  },
  {
    id: 180,
    name: 'Savegame Crystal',
    categories: ['Pickup'],
  },
  {
    id: 181,
    name: 'Sunglasses',
  },
  {
    id: 182,
    name: 'CassettePlayer',
  },
  {
    id: 183,
    name: 'DirectionKeys',
  },
  {
    id: 184,
    name: 'Globe',
  },
  {
    id: 185,
    name: 'Pistols',
  },
  {
    id: 186,
    name: 'Shotgun',
  },
  {
    id: 187,
    name: 'Desert Eagle',
  },
  {
    id: 188,
    name: 'Uzis',
  },
  {
    id: 189,
    name: 'Harpoon Gun',
  },
  {
    id: 190,
    name: 'MP5',
  },
  {
    id: 191,
    name: 'Rocket Launcher',
  },
  {
    id: 192,
    name: 'Grenade Launcher',
  },
  {
    id: 193,
    name: 'PistolAmmo',
  },
  {
    id: 194,
    name: 'ShotgunAmmo',
  },
  {
    id: 195,
    name: 'DesertEagleAmmo',
  },
  {
    id: 196,
    name: 'UziAmmo',
  },
  {
    id: 197,
    name: 'HarpoonGunAmmo',
  },
  {
    id: 198,
    name: 'MP5Ammo',
  },
  {
    id: 199,
    name: 'RocketLauncherAmmo',
  },
  {
    id: 200,
    name: 'GrenadeLauncherAmmo',
  },
  {
    id: 201,
    name: 'SmallMedipack',
  },
  {
    id: 202,
    name: 'LargeMedipack',
  },
  {
    id: 203,
    name: 'Flares',
  },
  {
    id: 204,
    name: 'SavegameCrystalInventory',
  },
  {
    id: 205,
    name: 'Puzzle 1',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 206,
    name: 'Puzzle 2',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 207,
    name: 'Puzzle 3',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 208,
    name: 'Puzzle 4',
    categories: ['Pickup', 'Puzzle'],
  },
  {
    id: 209,
    name: 'Puzzle 1',
  },
  {
    id: 210,
    name: 'Puzzle 2',
  },
  {
    id: 211,
    name: 'Puzzle 3',
  },
  {
    id: 212,
    name: 'Puzzle 4',
  },
  {
    id: 213,
    name: 'Slot 1',
    categories: ['Slot'],
  },
  {
    id: 214,
    name: 'Slot 2',
    categories: ['Slot'],
  },
  {
    id: 215,
    name: 'Slot 3',
    categories: ['Slot'],
  },
  {
    id: 216,
    name: 'Slot 4',
    categories: ['Slot'],
  },
  {
    id: 217,
    name: 'Slot 1 Done',
  },
  {
    id: 218,
    name: 'Slot 2 Done',
  },
  {
    id: 219,
    name: 'Slot 3 Done',
  },
  {
    id: 220,
    name: 'Slot 4 Done',
  },
  {
    id: 224,
    name: 'Key 1',
    categories: ['Key'],
  },
  {
    id: 225,
    name: 'Key 2',
    categories: ['Key'],
  },
  {
    id: 226,
    name: 'Key 3',
    categories: ['Key'],
  },
  {
    id: 227,
    name: 'Key 4',
    categories: ['Key'],
  },
  {
    id: 228,
    name: 'Key 1',
  },
  {
    id: 229,
    name: 'Key 2',
  },
  {
    id: 230,
    name: 'Key 3',
  },
  {
    id: 231,
    name: 'Key 4',
  },
  {
    id: 232,
    name: 'Keyhole 1',
    categories: ['Keyhole'],
  },
  {
    id: 233,
    name: 'Keyhole 2',
    categories: ['Keyhole'],
  },
  {
    id: 234,
    name: 'Keyhole 3',
    categories: ['Keyhole'],
  },
  {
    id: 235,
    name: 'Keyhole 4',
    categories: ['Keyhole'],
  },
  {
    id: 236,
    name: 'Quest Item 1',
    categories: ['Pickup'],
  },
  {
    id: 237,
    name: 'Quest Item 2',
    categories: ['Pickup'],
  },
  {
    id: 238,
    name: 'QuestItem1',
  },
  {
    id: 239,
    name: 'QuestItem2',
  },
  {
    id: 240,
    name: 'Infada Stone',
    categories: ['Pickup'],
  },
  {
    id: 241,
    name: 'Element 115',
    categories: ['Pickup'],
  },
  {
    id: 242,
    name: 'Eye Of Isis',
    categories: ['Pickup'],
  },
  {
    id: 243,
    name: 'Ora Dagger',
    categories: ['Pickup'],
  },
  {
    id: 244,
    name: 'InfadaStone',
  },
  {
    id: 245,
    name: 'Element115',
  },
  {
    id: 246,
    name: 'EyeOfIsis',
  },
  {
    id: 247,
    name: 'OraDagger',
  },
  {
    id: 272,
    name: 'KeysSprite1',
  },
  {
    id: 273,
    name: 'KeysSprite2',
  },
  {
    id: 276,
    name: 'Infada Stone',
  },
  {
    id: 277,
    name: 'Element 115',
  },
  {
    id: 278,
    name: 'Eye Of Isis',
  },
  {
    id: 279,
    name: 'Ora Dagger',
  },
  {
    id: 282,
    name: 'FireBreathingDragonStatue',
    categories: ['Trap'],
  },
  {
    id: 285,
    name: 'UnknownVisible285',
  },
  {
    id: 287,
    name: 'T-Rex',
    categories: ['Entity'],
  },
  {
    id: 288,
    name: 'Raptor',
    categories: ['Entity'],
  },
  {
    id: 291,
    name: 'Moving Lasers',
    categories: ['Trap'],
  },
  {
    id: 292,
    name: 'Electrified Field',
    categories: ['Trap'],
  },
  {
    id: 294,
    name: 'Shadow Sprite',
  },
  {
    id: 295,
    name: 'Detonator',
    categories: ['Keyhole'],
  },
  {
    id: 296,
    name: 'Misc Sprites',
  },
  {
    id: 297,
    name: 'Bubble',
  },
  {
    id: 299,
    name: 'Glow',
  },
  {
    id: 300,
    name: 'Gunflare',
  },
  {
    id: 301,
    name: 'MP5Gunflare',
  },
  {
    id: 304,
    name: 'Camera Target',
    categories: ['Effect'],
  },
  {
    id: 305,
    name: 'Waterfall Mist',
    categories: ['Effect'],
  },
  {
    id: 306,
    name: 'HarpoonFlying2',
  },
  {
    id: 309,
    name: 'RocketSingle',
  },
  {
    id: 310,
    name: 'HarpoonFlying',
  },
  {
    id: 311,
    name: 'GrenadeSingle',
  },
  {
    id: 312,
    name: 'Missile',
    categories: ['Effect', 'Scenery'],
  },
  {
    id: 313,
    name: 'Smoke',
    categories: ['Effect'],
  },
  {
    id: 314,
    name: 'Movable Boom',
    categories: ['Trap'],
  },
  {
    id: 315,
    name: 'LaraSkin',
  },
  {
    id: 316,
    name: 'Glow 2',
  },
  {
    id: 317,
    name: 'UnknownVisible317',
  },
  {
    id: 318,
    name: 'Alarm Light',
    categories: ['Effect'],
  },
  {
    id: 319,
    name: 'Light',
    categories: ['Effect'],
  },
  {
    id: 321,
    name: 'Light 2',
    categories: ['Effect'],
  },
  {
    id: 322,
    name: 'Pulsating Light',
    categories: ['Effect'],
  },
  {
    id: 324,
    name: 'Red Light',
    categories: ['Effect'],
  },
  {
    id: 325,
    name: 'Green Light',
    categories: ['Effect'],
  },
  {
    id: 326,
    name: 'Blue Light',
    categories: ['Effect'],
  },
  {
    id: 327,
    name: 'Light 3',
    categories: ['Effect'],
  },
  {
    id: 328,
    name: 'Light 4',
    categories: ['Effect'],
  },
  {
    id: 330,
    name: 'Fire',
    categories: ['Trap'],
  },
  {
    id: 331,
    name: 'Alternate Fire',
    categories: ['Scenery', 'Trap'],
  },
  {
    id: 332,
    name: 'Alternate Fire 2',
    categories: ['Scenery', 'Trap'],
  },
  {
    id: 333,
    name: 'Fire 2',
    categories: ['Trap'],
  },
  {
    id: 334,
    name: 'Smoke 2',
    categories: ['Scenery'],
  },
  {
    id: 335,
    name: 'Smoke 3',
    categories: ['Scenery'],
  },
  {
    id: 336,
    name: 'Smoke 4',
    categories: ['Scenery'],
  },
  {
    id: 337,
    name: 'Greenish Smoke',
    categories: ['Effect'],
  },
  {
    id: 338,
    name: 'Piranhas',
    categories: ['Trap'],
  },
  {
    id: 339,
    name: 'Fish',
    categories: ['Scenery'],
  },
  {
    id: 347,
    name: 'Bat Swarm',
    categories: ['Scenery'],
  },
  {
    id: 349,
    name: 'Animating 1',
    categories: ['Scenery'],
  },
  {
    id: 350,
    name: 'Animating 2',
    categories: ['Scenery'],
  },
  {
    id: 351,
    name: 'Animating 3',
    categories: ['Scenery'],
  },
  {
    id: 352,
    name: 'Animating 4',
    categories: ['Scenery'],
  },
  {
    id: 353,
    name: 'Animating 5',
    categories: ['Scenery'],
  },
  {
    id: 354,
    name: 'Animating 6',
    categories: ['Scenery'],
  },
  {
    id: 355,
    name: 'Skybox',
  },
  {
    id: 356,
    name: 'FontGraphics',
  },
  {
    id: 357,
    name: 'Doorbell',
    categories: ['Effect'],
  },
  {
    id: 358,
    name: 'UnknownID358',
  },
  {
    id: 360,
    name: 'Winston',
    categories: ['Entity'],
  },
  {
    id: 361,
    name: 'Winston (Camo)',
    categories: ['Entity'],
  },
  {
    id: 362,
    name: 'TimerFontGraphics',
  },
  {
    id: 365,
    name: 'Earthquake',
    categories: ['Effect'],
  },
  {
    id: 366,
    name: 'YellowShellCasing',
  },
  {
    id: 367,
    name: 'RedShellCasing',
  },
  {
    id: 370,
    name: 'Light Shaft',
    categories: ['Effect'],
  },
  {
    id: 373,
    name: 'Electrical Switch Box',
    categories: ['Effect', 'Scenery'],
  },
] as Entity[]

// Entity database for each game version and every entity
export const EntityDB: { [key in version]?: Entity[] } = {
  [version.TR1]: tr1Data,
  [version.TR2]: tr2Data,
  [version.TR3]: tr3Data,
}

/**
 * Check if an entity is in a specific category
 * @param entity tr_entity to check
 * @param category Category of the entity to check for
 * @param version Version of the game
 */
export function isEntityInCategory(entity: entity, category: Category, version: version): boolean {
  const dbEntity = EntityDB[version]?.find((e) => e.id === entity.type)
  return dbEntity?.categories?.includes(category) ?? false
}
