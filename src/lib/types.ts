// =============================================================================
// Project: WebGL Tomb Raider
// Core of the project, types and low level parsing functions for TR levels
// Based ENTIRELY on the TRosettaStone3 documentation by OpenTomb
// https://opentomb.github.io/TRosettaStone3/trosettastone.html
// =============================================================================

import { XYZ } from 'gsots3d'

// =============================================================================
// Basic core types & conversion functions
// =============================================================================

export type uint8_t = number
export type uint16_t = number
export type uint32_t = number
export type int8_t = number
export type int16_t = number
export type int32_t = number
export type float = number
export type ufixed16 = number
export type fixed = number

// Mysterious floating number format invented by TR devs
// See https://opentomb.github.io/TRosettaStone3/trosettastone.html#_fixed_point_data_types
export function ufixed16ToFloat(ufixed: ufixed16) {
  // Two bytes little endian whole and fractional parts
  const whole = ufixed >> 8
  const fraction = ufixed & 0xff

  return whole + fraction / 256
}

export function entityAngleToDeg(angle: int16_t) {
  return (angle / 16384) * -90
}

export type vertex = {
  x: int16_t
  y: int16_t
  z: int16_t
}

export function ParseVertex(data: DataView, offset: number) {
  return {
    x: data.getInt16(offset, true),
    y: -data.getInt16(offset + 2, true),
    z: -data.getInt16(offset + 4, true),
  } as vertex
}

export function trVertToXZY(v: vertex) {
  return [v.x, v.y, v.z] as XYZ
}

export const vertex_size = 6

export type face3 = {
  vertices: uint16_t[] // LEN:3, these are indexes into the vertex data, not actual vertices
  texture: uint16_t
}

export const face3_size = 8

export function ParseFace3(data: DataView, offset: number): face3 {
  return {
    vertices: [data.getUint16(offset, true), data.getUint16(offset + 2, true), data.getUint16(offset + 4, true)],
    texture: data.getUint16(offset + 6, true),
  } as face3
}

export type face4 = {
  vertices: uint16_t[] // LEN:4, these are indexes into the vertex data, not actual vertices
  texture: uint16_t
}

export const face4_size = 10

export function ParseFace4(data: DataView, offset: number): face4 {
  return {
    vertices: [data.getUint16(offset, true), data.getUint16(offset + 2, true), data.getUint16(offset + 4, true), data.getUint16(offset + 6, true)],
    texture: data.getUint16(offset + 8, true),
  } as face4
}

export type bounding_box = {
  minX: int16_t
  minY: int16_t
  minZ: int16_t
  maxX: int16_t
  maxY: int16_t
  maxZ: int16_t
}

export const bounding_box_size = 12

export function ParseBoundingBox(data: DataView, offset: number): bounding_box {
  return {
    minX: data.getInt16(offset, true),
    minY: data.getInt16(offset + 2, true),
    minZ: data.getInt16(offset + 4, true),
    maxX: data.getInt16(offset + 6, true),
    maxY: data.getInt16(offset + 8, true),
    maxZ: data.getInt16(offset + 10, true),
  } as bounding_box
}

export enum version {
  TR1 = 0x00000020,
  TR2 = 0x0000002d,
  TR3 = 0xff180038,
  TR4 = 0x00345254,
  TR5 = 0x00345254,
}

export type version_string = 'Tomb Raider 1' | 'Tomb Raider 2' | 'Tomb Raider 3'

export type tuple = [number, number, number]

// =============================================================================
// The core and main level struct
// This is a unified set of data that represents any TR 1-3 level
// =============================================================================

export type level = {
  version: version
  verString: version_string
  levelName: string

  numTextiles: uint32_t
  textiles: textile8[]
  textiles16: textile16[]

  numRooms: uint16_t
  rooms: room[]

  numObjectTextures: uint32_t
  objectTextures: object_texture[]

  numEntities: uint32_t
  entities: entity[]

  numSpriteTextures: uint32_t
  spriteTextures: sprite_texture[]

  numMeshPointers: uint32_t
  meshPointers: uint32_t[]
  meshes: Map<number, mesh>

  numStaticMeshes: uint32_t
  staticMeshes: Map<number, staticmesh>

  numModels: uint32_t
  models: Map<number, model>

  numFloorData: uint32_t
  floorData: uint16_t[]

  numAnimations: uint32_t
  animations: animation[]

  numAnimatedTextures: uint16_t
  animatedTextures: animated_texture[]

  palette: colour[]
  palette16: colour4[] // Note this is NOT used to lookup textiles16 colours!
}

// =============================================================================
// Colours
// =============================================================================

export type colour = {
  r: uint8_t
  g: uint8_t
  b: uint8_t
}

export const colour_size = 3

export function ParseColour(data: DataView, offset: number): colour {
  return {
    r: data.getUint8(offset),
    g: data.getUint8(offset + 1),
    b: data.getUint8(offset + 2),
  } as colour
}

export const palette_size = 256 * colour_size

export function ParsePalette(data: DataView, offset: number): colour[] {
  const palette = new Array<colour>(256)

  for (let i = 0; i < 256; i++) {
    palette[i] = ParseColour(data, offset + i * colour_size)
  }

  return palette
}

export type colour4 = {
  r: uint8_t
  g: uint8_t
  b: uint8_t
  unused: uint8_t
}

export function ParseColour4(data: DataView, offset: number): colour4 {
  return {
    r: data.getUint8(offset),
    g: data.getUint8(offset + 1),
    b: data.getUint8(offset + 2),
    unused: data.getUint8(offset + 3),
  } as colour4
}

export const colour4_size = 4

export const palette16_size = 256 * colour4_size

export function ParsePalette16(data: DataView, offset: number): colour4[] {
  const palette = new Array<colour4>(256)

  for (let i = 0; i < 256; i++) {
    palette[i] = ParseColour4(data, offset + i * colour4_size)
  }

  return palette
}

/** Convert 15 bit colour to a 0-1 RGB tuple */
export function colour15ToRGB(colour?: uint16_t): tuple {
  if (!colour) return [0, 0, 0]

  let red = (colour & 0x7c00) >> 10
  let green = (colour & 0x3e0) >> 5
  let blue = colour & 0x1f

  red = Math.min(1, Math.max(0, red / 31))
  green = Math.min(1, Math.max(0, green / 31))
  blue = Math.min(1, Math.max(0, blue / 31))

  return [red, green, blue]
}

// =============================================================================
// Textures
// =============================================================================

export type textile8 = Uint8Array // 256 * 256
export type textile16 = Uint16Array // 256 * 256

export function ParseTextile8(data: DataView, offset: number): textile8 {
  const textile = new Uint8Array(textile8_size)

  for (let j = 0; j < textile8_size; j++) {
    textile[j] = data.getUint8(offset + j)
  }

  return textile
}

export function ParseTextile16(data: DataView, offset: number): textile16 {
  const textile = new Uint16Array(textile16_size)

  for (let j = 0; j < textile16_size; j++) {
    textile[j] = data.getUint16(offset + j * 2, true)
  }

  return textile
}

export const textile8_size = 256 * 256
export const textile16_size = 256 * 256 * 2

export type object_texture = {
  attribute: uint16_t
  tileAndFlag: uint16_t
  vertices: object_texture_vert[] // NUM: 4
}

export const object_texture_size = 20

export function ParseObjectTexture(data: DataView, offset: number): object_texture {
  return {
    attribute: data.getUint16(offset, true),
    tileAndFlag: data.getUint16(offset + 2, true),
    vertices: [
      ParseObjectTextureVert(data, offset + 4),
      ParseObjectTextureVert(data, offset + 8),
      ParseObjectTextureVert(data, offset + 12),
      ParseObjectTextureVert(data, offset + 16),
    ],
  } as object_texture
}

export type object_texture_vert = {
  x: ufixed16
  y: ufixed16
}

export const object_texture_vert_size = 4

export function ParseObjectTextureVert(data: DataView, offset: number): object_texture_vert {
  return {
    x: data.getUint16(offset, true),
    y: data.getUint16(offset + 2, true),
  } as object_texture_vert
}

// =============================================================================
// Rooms
// =============================================================================

export type room = {
  info: room_info

  numDataWords: uint32_t // Size of room_data
  roomData: room_data

  numPortals: uint16_t

  numZSectors: uint16_t
  numXSectors: uint16_t
  sectorList: room_sector[]

  ambientIntensity: uint16_t
  numLights: uint16_t
  lights: room_light[]

  numStaticMeshes: uint16_t
  staticMeshes: room_staticmesh[]

  alternateRoom: int16_t
  flags: int16_t
}

export type room_info = {
  x: int32_t
  z: int32_t
  yBottom: int32_t
  yTop: int32_t
}

export const room_info_size = 4 * 4

export function ParseRoomInfo(data: DataView, offset: number): room_info {
  return {
    x: data.getInt32(offset, true),
    z: data.getInt32(offset + 4, true),
    yBottom: data.getInt32(offset + 8, true),
    yTop: data.getInt32(offset + 12, true),
  } as room_info
}

export type room_data = {
  numVertices: uint16_t
  vertices: room_vertex[]

  numRectangles: uint16_t
  rectangles: face4[]

  numTriangles: uint16_t
  triangles: face3[]

  numSprites: uint16_t
  sprites: room_sprite[]
}

export function NewRoomData(): room_data {
  const roomData = {} as room_data
  roomData.vertices = new Array<room_vertex>()
  roomData.rectangles = new Array<face4>()
  roomData.triangles = new Array<face3>()
  roomData.sprites = new Array<room_sprite>()

  return roomData
}

export type room_vertex = {
  vertex: vertex
  lighting: int16_t
  colour?: int16_t // Only present in TR3
}

export const room_vertex_size = 8
export const room_vertex_size_tr2 = 12

/**
 * Parses both TR1 & TR2 room vertexes, the extra parts in tr2_room_vertex are ignored
 */
export function ParseRoomVertex(data: DataView, offset: number): room_vertex {
  return {
    vertex: ParseVertex(data, offset),
    lighting: data.getInt16(offset + 6, true),
    // In TR2 Attributes and Lighting2 are here but we don't use them
  } as room_vertex
}

/**
 * Only used by TR3
 */
export function ParseRoomVertexTR3(data: DataView, offset: number): room_vertex {
  return {
    vertex: ParseVertex(data, offset),
    lighting: data.getInt16(offset + 6, true),
    colour: data.getInt16(offset + 10, true),
  } as room_vertex
}

export type room_sprite = {
  vertex: int16_t
  texture: int16_t
}

export const room_sprite_size = 4

export function ParseRoomSprite(data: DataView, offset: number): room_sprite {
  return {
    vertex: data.getInt16(offset, true),
    texture: data.getInt16(offset + 2, true),
  } as room_sprite
}

export function isWaterRoom(room: room): boolean {
  return (room.flags & 0x1) === 1
}

export type room_staticmesh = {
  x: int32_t
  y: int32_t
  z: int32_t
  rotation: uint16_t
  intensity: uint16_t
  meshId: uint16_t
}

export const room_staticmesh_size = 18
export const room_staticmesh_size_tr2 = 20

export function ParseRoomStaticMesh(data: DataView, offset: number): room_staticmesh {
  return {
    x: data.getInt32(offset, true),
    y: data.getInt32(offset + 4, true),
    z: data.getInt32(offset + 8, true),
    rotation: data.getUint16(offset + 12, true),
    intensity: data.getUint16(offset + 14, true),
    meshId: data.getUint16(offset + 16, true),
  } as room_staticmesh
}

export function ParseRoomStaticMeshTR2(data: DataView, offset: number): room_staticmesh {
  return {
    x: data.getInt32(offset, true),
    y: data.getInt32(offset + 4, true),
    z: data.getInt32(offset + 8, true),
    rotation: data.getUint16(offset + 12, true),
    // Note in TR3 we treat intensity as 15 bit RGB color, but we parse it the same
    intensity: data.getUint16(offset + 14, true),
    // Skip intensity2 uint16_t isn't used anyhow!
    meshId: data.getUint16(offset + 18, true),
  } as room_staticmesh
}

export function PrintRoom(r: room) {
  console.log('Info:', r.info)
  console.log(`Data: v:${r.roomData.numVertices} r:${r.roomData.numRectangles}, t:${r.roomData.numTriangles}, s:${r.roomData.numSprites}`)
  console.log('Port/SecZ/SecX:', r.numPortals, r.numZSectors, r.numXSectors)
  console.log('Amb/NumL:', r.ambientIntensity, r.numLights)
  console.log('Num SMesh:', r.numStaticMeshes)
  console.log('AltRoom:', r.alternateRoom)
  console.log('Flags:', r.flags)
}

// =============================================================================
// Meshes
// =============================================================================

export type mesh = {
  centre: vertex
  collRadius: int32_t

  numVertices: int16_t
  vertices: vertex[]

  numNormals: int16_t
  normals: vertex[]
  lights: int16_t[]

  numTexturedRectangles: int16_t
  texturedRectangles: face4[]

  numTexturedTriangles: int16_t
  texturedTriangles: face3[]

  numColouredRectangles: int16_t
  colouredRectangles: face4[]

  numColouredTriangles: int16_t
  colouredTriangles: face3[]
}

export type staticmesh = {
  id: uint32_t
  mesh: uint16_t // Index into the mesh pointers
  visibilityBox: bounding_box
  collisionBox: bounding_box
  flags: uint16_t
}

export const staticmesh_size = 32

export function ParseStaticMesh(data: DataView, offset: number): staticmesh {
  return {
    id: data.getUint32(offset, true),
    mesh: data.getUint16(offset + 4, true),
    visibilityBox: ParseBoundingBox(data, offset + 6),
    collisionBox: ParseBoundingBox(data, offset + 18),
    flags: data.getUint16(offset + 30, true),
  } as staticmesh
}

export type model = {
  id: uint32_t
  numMeshes: uint16_t
  startingMesh: uint16_t
  meshTree: uint32_t
  frameOffset: uint32_t
  animation: uint16_t
}

export const model_size = 18

export function ParseModel(data: DataView, offset: number): model {
  return {
    id: data.getUint32(offset, true),
    numMeshes: data.getUint16(offset + 4, true),
    startingMesh: data.getUint16(offset + 6, true),
    meshTree: data.getUint32(offset + 8, true),
    frameOffset: data.getUint32(offset + 12, true),
    animation: data.getUint16(offset + 16, true),
  } as model
}

// =============================================================================
// Entities
// =============================================================================

export type entity = {
  type: uint16_t // Also known as the entity id
  room: uint16_t
  x: int32_t
  y: int32_t
  z: int32_t
  angle: int16_t
  intensity: int16_t
  flags: uint16_t
}

export const entity_size = 22
export const entity_size_tr2 = 24

export function ParseEntity(data: DataView, offset: number): entity {
  return {
    type: data.getInt16(offset, true),
    room: data.getInt16(offset + 2, true),
    x: data.getInt32(offset + 4, true),
    y: data.getInt32(offset + 8, true),
    z: data.getInt32(offset + 12, true),
    angle: data.getInt16(offset + 16, true),
    intensity: data.getInt16(offset + 18, true),
    flags: data.getInt16(offset + 20, true),
  } as entity
}

export function ParseEntityTR2(data: DataView, offset: number): entity {
  return {
    type: data.getInt16(offset, true),
    room: data.getInt16(offset + 2, true),
    x: data.getInt32(offset + 4, true),
    y: data.getInt32(offset + 8, true),
    z: data.getInt32(offset + 12, true),
    angle: data.getInt16(offset + 16, true),
    intensity: data.getInt16(offset + 18, true),
    flags: data.getInt16(offset + 22, true),
  } as entity
}

// =============================================================================
// Sprites
// =============================================================================

export type sprite_texture = {
  tile: uint16_t
  x: uint8_t
  y: uint8_t
  width: uint16_t
  height: uint16_t
  leftSide: int16_t
  topSide: int16_t
  rightSide: int16_t
  bottomSide: int16_t
}

export const sprite_texture_size = 16

export function ParseSpriteTexture(data: DataView, offset: number): sprite_texture {
  return {
    tile: data.getUint16(offset, true),
    x: data.getUint8(offset + 2),
    y: data.getUint8(offset + 3),
    width: data.getUint16(offset + 4, true),
    height: data.getUint16(offset + 6, true),
    leftSide: data.getInt16(offset + 8, true),
    topSide: data.getInt16(offset + 10, true),
    rightSide: data.getInt16(offset + 12, true),
    bottomSide: data.getInt16(offset + 14, true),
  } as sprite_texture
}

// =============================================================================
// Lighting
// =============================================================================

export type room_light = {
  x: int32_t
  y: int32_t
  z: int32_t
  intensity: uint16_t
  fade: uint32_t
  colour?: colour // Only in TR3
}

export const room_light_size = 18
export const room_light_size_tr2 = room_light_size + 4 + 2

export function ParseRoomLight(data: DataView, offset: number): room_light {
  return {
    x: data.getInt32(offset, true),
    y: data.getInt32(offset + 4, true),
    z: data.getInt32(offset + 8, true),
    intensity: data.getUint16(offset + 12, true),
    fade: data.getUint32(offset + 14, true),
  } as room_light
}

export function ParseRoomLightTR2(data: DataView, offset: number): room_light {
  return {
    x: data.getInt32(offset, true),
    y: data.getInt32(offset + 4, true),
    z: data.getInt32(offset + 8, true),
    intensity: data.getUint16(offset + 12, true),
    // Skip intensity2 uint16_t was never used in real game
    fade: data.getUint32(offset + 16, true),
    // Skip fade2 uint32_t was never used in real game
  } as room_light
}

export function ParseRoomLightTR3(data: DataView, offset: number): room_light | undefined {
  // TR3 introduced two light types, we only use type 0 which is point
  // Note the TRosettaStone3 documentation is wrong about the light types!
  const type = data.getUint8(offset + 15)

  // These are directional sun lights, we ignore them
  if (type === 1) {
    return undefined
  }

  return {
    x: data.getInt32(offset, true),
    y: data.getInt32(offset + 4, true),
    z: data.getInt32(offset + 8, true),
    colour: ParseColour(data, offset + 12),
    intensity: data.getInt32(offset + 16, true),
    fade: data.getInt32(offset + 20, true),
  } as room_light
}

// =============================================================================
// Sector Data
// =============================================================================

export type room_sector = {
  fdIndex: uint16_t
  boxIndex: uint16_t
  roomBelow: uint8_t
  floor: int8_t
  roomAbove: uint8_t
  ceiling: int8_t
}

export const room_sector_size = 8

export function ParseRoomSector(data: DataView, offset: number): room_sector {
  return {
    fdIndex: data.getUint16(offset, true),
    boxIndex: data.getUint16(offset + 2, true),
    roomBelow: data.getUint8(offset + 4),
    floor: data.getInt8(offset + 5),
    roomAbove: data.getUint8(offset + 6),
    ceiling: data.getInt8(offset + 7),
  } as room_sector
}

// =============================================================================
// Animations
// =============================================================================

export type animation = {
  frameOffset: uint32_t
  frameRate: uint8_t
  frameSize: uint8_t
  stateID: uint16_t
  speed: fixed // 4 bytes
  accel: fixed // 4 bytes
  frameStart: uint16_t
  frameEnd: uint16_t
  nextAnimation: uint16_t
  nextFrame: uint16_t
  numStateChanges: uint16_t
  stateChangeOffset: uint16_t
  numAnimCommands: uint16_t
  animCommand: uint16_t

  // This is extra that is not in the original TRosettaStone3 documentation or part of this struct
  frames: anim_frame[]
  frameCount: number
}

export const animation_size = 32

export function ParseAnimation(data: DataView, offset: number): animation {
  const anim = {
    frameOffset: data.getUint32(offset, true),
    frameRate: data.getUint8(offset + 4),
    frameSize: data.getUint8(offset + 5),
    stateID: data.getUint16(offset + 6, true),
    speed: data.getFloat32(offset + 8, true),
    accel: data.getFloat32(offset + 12, true),
    frameStart: data.getUint16(offset + 16, true),
    frameEnd: data.getUint16(offset + 18, true),
    nextAnimation: data.getUint16(offset + 20, true),
    nextFrame: data.getUint16(offset + 22, true),
    numStateChanges: data.getUint16(offset + 24, true),
    stateChangeOffset: data.getUint16(offset + 26, true),
    numAnimCommands: data.getUint16(offset + 28, true),
    animCommand: data.getUint16(offset + 30, true),
  } as animation

  anim.frameCount = anim.frameEnd - anim.frameStart + 1
  anim.frames = new Array<anim_frame>()

  return anim
}

export type anim_frame = {
  box: bounding_box
  offsetX: int16_t
  offsetY: int16_t
  offsetZ: int16_t
  numValues: uint16_t
  angleSets: pair[]
  bytes: number
}

type pair = [number, number]

export function ParseAnimFrame(data: DataView, offset: number): anim_frame {
  // FIXME: Angle sets are broken! BUt we don't use them for now

  // Angle sets are pairs of words, there are numValues of pairs of 16 bit words
  const numValues = data.getUint16(offset + 18, true)
  const angleSets = new Array<pair>(numValues)
  // for (let i = 0; i < numValues; i++) {
  //   const data1 = data.getUint16(offset + 20 + i * 2, true)
  //   const data2 = data.getUint16(offset + 20 + i * 2 + 2, true)
  //   angleSets[i] = [data1, data2]
  // }

  return {
    box: ParseBoundingBox(data, offset),
    offsetX: data.getInt16(offset + 12, true),
    offsetY: data.getInt16(offset + 14, true),
    offsetZ: data.getInt16(offset + 16, true),
    numValues: 0,
    angleSets: angleSets,
    bytes: bounding_box_size + 8 + numValues * 2,
  } as anim_frame
}

export type animated_texture = {
  size: uint16_t // always 3 which actually means 4!
  objTexIds: uint16_t[]
}
