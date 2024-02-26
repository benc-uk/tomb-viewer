// =============================================================================
// Basic types
// =============================================================================

export type uint8_t = number
export type uint16_t = number
export type uint32_t = number
export type int8_t = number
export type int16_t = number
export type int32_t = number
export type float = number

export type tr_vertex = {
  x: int16_t
  y: int16_t
  z: int16_t
}

export function ParseVertex(data: DataView, offset: number) {
  return {
    x: data.getInt16(offset, true),
    y: -data.getInt16(offset + 2, true),
    z: -data.getInt16(offset + 4, true),
  } as tr_vertex
}

export const tr_vertex_size = 6

export type tr_face3 = {
  vertices: uint16_t[] // LEN:3, these are indexes into the vertex data, not actual vertices
  texture: uint16_t
}

export const tr_face3_size = 3 * 2 + 2

export function ParseFace3(data: DataView, offset: number): tr_face3 {
  return {
    vertices: [data.getUint16(offset, true), data.getUint16(offset + 2, true), data.getUint16(offset + 4, true)],
    texture: data.getUint16(offset + 6, true),
  } as tr_face3
}

export type tr_face4 = {
  vertices: uint16_t[] // LEN:4, these are indexes into the vertex data, not actual vertices
  texture: uint16_t
}

export const tr_face4_size = 4 * 2 + 2

export function ParseFace4(data: DataView, offset: number): tr_face4 {
  return {
    vertices: [
      data.getUint16(offset, true),
      data.getUint16(offset + 2, true),
      data.getUint16(offset + 4, true),
      data.getUint16(offset + 6, true),
    ],
    texture: data.getUint16(offset + 8, true),
  } as tr_face4
}

export enum tr_version {
  TR1 = 0x00000020,
  TR2 = 0x0000002d,
  TR3 = 0xff080038,
  TR4 = 0x00345254,
  TR5 = 0x00345254,
  TR4_DEMO = 0x63345254,
  TR5_DEMO = 0x63345254,
}

// =============================================================================
// Levels
// =============================================================================

export type tr1_level = {
  version: tr_version

  numTextiles: uint32_t
  textiles: tr_textile8[]

  numRooms: uint16_t
  rooms: tr_room[]

  palette: tr_palette
}

// =============================================================================
// Colours
// =============================================================================

export type tr_colour = {
  r: uint8_t
  g: uint8_t
  b: uint8_t
}

export const tr_colour_size = 3

export type tr_palette = tr_colour[]

export const tr_palette_size = 256 * tr_colour_size

export function ParsePalette(data: DataView, offset: number): tr_palette {
  const palette = new Array<tr_colour>(256)

  for (let i = 0; i < 256; i++) {
    palette[i] = ParseColour(data, offset + i * tr_colour_size)
  }

  return palette as tr_palette
}

export function ParseColour(data: DataView, offset: number): tr_colour {
  return {
    r: data.getUint8(offset),
    g: data.getUint8(offset + 1),
    b: data.getUint8(offset + 2),
  } as tr_colour
}

// =============================================================================
// Textures
// =============================================================================

export type tr_textile8 = Uint8Array

export function ParseTextile8(data: DataView, offset: number): tr_textile8 {
  const textile = new Uint8Array(tr_textile8_size)

  for (let j = 0; j < tr_textile8_size; j++) {
    textile[j] = data.getUint8(offset + j)
  }

  return textile
}

export const tr_textile8_size = 256 * 256

// =============================================================================
// Rooms
// =============================================================================

export type tr_room = {
  info: tr_room_info
  numDataWords: uint32_t // Size of tr_room_data
  roomData: tr_room_data

  numPortals: uint16_t
  numZSectors: uint16_t
  numXSectors: uint16_t
  ambientIntensity: uint16_t
  numLights: uint16_t
  numStaticMeshes: uint16_t
  alternateRoom: uint16_t
  flags: uint16_t
}

export type tr_room_info = {
  x: int32_t
  z: int32_t
  yBottom: int32_t
  yTop: int32_t
}

export const tr_room_info_size = 4 * 4

export function ParseRoomInfo(data: DataView, offset: number): tr_room_info {
  return {
    x: data.getInt32(offset, true),
    z: data.getInt32(offset + 4, true),
    yBottom: data.getInt32(offset + 8, true),
    yTop: data.getInt32(offset + 12, true),
  } as tr_room_info
}

export type tr_room_data = {
  numVertices: uint16_t
  vertices: tr_room_vertex[]

  numRectangles: uint16_t
  rectangles: tr_face4[]

  numTriangles: uint16_t
  triangles: tr_face3[]

  numSprites: uint16_t
  sprites: tr_room_sprite[]
}

export function NewRoomData(): tr_room_data {
  const roomData = {} as tr_room_data
  roomData.vertices = new Array<tr_room_vertex>()
  roomData.rectangles = new Array<tr_face4>()
  roomData.triangles = new Array<tr_face3>()
  roomData.sprites = new Array<tr_room_sprite>()

  return roomData
}

export type tr_room_vertex = {
  vertex: tr_vertex
  lighting: int16_t
}

export const tr_room_vertex_size = tr_vertex_size + 2

export function ParseRoomVertex(data: DataView, offset: number): tr_room_vertex {
  return {
    vertex: ParseVertex(data, offset),
    lighting: data.getInt16(offset + 6, true),
  } as tr_room_vertex
}

export type tr_room_sprite = {
  vertex: int16_t
  texture: int16_t
}

export const tr_room_sprite_size = 4

export function ParseRoomSprite(data: DataView, offset: number): tr_room_sprite {
  return {
    vertex: data.getInt16(offset, true),
    texture: data.getInt16(offset + 2, true),
  } as tr_room_sprite
}

// =============================================================================
// Meshes
// =============================================================================

export type tr_mesh = {
  centre: tr_vertex
  collRadius: uint32_t

  numVertices: uint16_t
  vertices: tr_vertex[]

  numNormals: uint16_t
  normals: tr_vertex[]
  lights: uint16_t[]

  numTexturedRectangles: uint16_t
  texturedRectangles: tr_face4[]

  numTexturedTriangles: uint16_t
  texturedTriangles: tr_face3[]

  numColouredRectangles: uint16_t
  colouredRectangles: tr_face4[]

  numColouredTriangles: uint16_t
  colouredTriangles: tr_face3[]
}
