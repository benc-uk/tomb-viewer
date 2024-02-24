// =============================================================================
// Basic types
// =============================================================================

export type uint8_t = number;
export type uint16_t = number;
export type uint32_t = number;
export type int8_t = number;
export type int16_t = number;
export type int32_t = number;
export type float = number;

export type tr_vertex = {
  x: int16_t;
  y: int16_t;
  z: int16_t;
};

export function NewVertex(data: DataView, offset: number) {
  return {
    x: data.getInt16(offset, true),
    y: data.getInt16(offset + 2, true),
    z: data.getInt16(offset + 4, true),
  };
}

export const tr_vertex_size = 6;

export type tr_face3 = {
  vertices: tr_vertex[]; // 3
  texture: uint16_t;
};

export const tr_face3_size = 3 * tr_vertex_size + 2;

export type tr_face4 = {
  vertices: tr_vertex[]; // 4
  texture: uint16_t;
};

export const tr_face4_size = 4 * tr_vertex_size + 2;

// create an enum for the different versions of the TR level format
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
  version: uint32_t;
  versionStr: string;

  numTextiles: uint32_t;
  textiles: tr_textile8[];

  palette: tr_palette;
};

// =============================================================================
// Colours
// =============================================================================

export type tr_colour = {
  r: uint8_t;
  g: uint8_t;
  b: uint8_t;
};

export const tr_colour_size = 3;

export type tr_palette = tr_colour[];

export const tr_palette_size = 256 * tr_colour_size;

export function NewPalette(data: DataView, offset: number): tr_palette {
  const palette = new Array<tr_colour>(256);

  for (let i = 0; i < 256; i++) {
    palette[i] = NewColour(data, offset + i * tr_colour_size);
  }

  return palette as tr_palette;
}

export function NewColour(data: DataView, offset: number): tr_colour {
  return {
    r: data.getUint8(offset),
    g: data.getUint8(offset + 1),
    b: data.getUint8(offset + 2),
  } as tr_colour;
}

// =============================================================================
// Textures
// =============================================================================

export type tr_textile8 = Uint8Array;

export function NewTextile8(data: DataView, offset: number): tr_textile8 {
  const textile = new Uint8Array(tr_textile8_size);

  for (let j = 0; j < tr_textile8_size; j++) {
    textile[j] = data.getUint8(offset + j);
  }

  return textile;
}

export const tr_textile8_size = 256 * 256;

// =============================================================================
// Rooms
// =============================================================================

export type tr_room_info = {
  x: int32_t;
  z: int32_t;
  yBottom: int32_t;
  yTop: int32_t;
};

export type tr_room = {
  info: tr_room_info;
  numDataWords: uint32_t;
  data: uint16_t[];

  numPortals: uint16_t;
  numZSectors: uint16_t;
  numXSectors: uint16_t;
  ambientIntensity: uint16_t;
  numLights: uint16_t;
  numStaticMeshes: uint16_t;
  alternateRoom: uint16_t;
  flags: uint16_t;
};

// =============================================================================
// Meshes
// =============================================================================

export type tr_mesh = {
  centre: tr_vertex;
  collRadius: uint32_t;

  numVertices: uint16_t;
  vertices: tr_vertex[];

  numNormals: uint16_t;
  normals: tr_vertex[];
  lights: uint16_t[];

  numTexturedRectangles: uint16_t;
  texturedRectangles: tr_face4[];

  numTexturedTriangles: uint16_t;
  texturedTriangles: tr_face3[];

  numColouredRectangles: uint16_t;
  colouredRectangles: tr_face4[];

  numColouredTriangles: uint16_t;
  colouredTriangles: tr_face3[];
};
