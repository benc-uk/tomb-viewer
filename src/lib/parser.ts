// =============================================================================
// Project: WebGL Tomb Raider
// Main level parser, this is the entry point for parsing a TR level file
// =============================================================================

import * as TR1 from './tr1'
import * as TR2 from './tr2'
import * as tr from './types'

/**
 * Parses a Tomb Raider level file
 * @param dataArray Uint8Array of the raw level data
 */
export function parseLevel(dataArray: Uint8Array): tr.level {
  // Need a DataView to help us read the file
  const data = new DataView(dataArray.buffer)

  console.log(`📜 Parsing level, bytes: ${dataArray.length}`)

  const verMagic = data.getUint32(0, true)

  // Check the version magic is even valid
  if (!Object.values(tr.version).includes(verMagic)) {
    throw new Error('Unknown version ' + verMagic + ', this file is not a valid TR level file.')
  }

  // Parse the level based on the version
  switch (verMagic) {
    case tr.version.TR1:
      return TR1.parseLevel(data)
    case tr.version.TR2:
      return TR2.parseLevel(data)
    default:
      throw new Error('This version of Tomb Raider is not supported yet :(')
  }
}

/**
 * Parses a mesh from the level file
 * @param data DataView of the level file
 * @param offset Offset into the mesh data block
 */
export function parseMesh(data: DataView, offset: number): tr.mesh {
  const mesh = {} as tr.mesh

  mesh.centre = tr.ParseVertex(data, offset)
  offset += tr.vertex_size

  mesh.collRadius = data.getInt32(offset, true)
  offset += 4

  mesh.numVertices = data.getInt16(offset, true)
  offset += 2
  mesh.vertices = new Array<tr.vertex>()
  for (let j = 0; j < mesh.numVertices; j++) {
    mesh.vertices.push(tr.ParseVertex(data, offset))
    offset += tr.vertex_size
  }

  mesh.numNormals = data.getInt16(offset, true)
  offset += 2
  // Weirdness see https://opentomb.github.io/TRosettaStone3/trosettastone.html#_meshes
  if (mesh.numNormals > 0) {
    mesh.normals = new Array<tr.vertex>()
    for (let j = 0; j < mesh.numNormals; j++) {
      mesh.normals.push(tr.ParseVertex(data, offset))
      offset += tr.vertex_size
    }
  } else {
    mesh.lights = new Array<tr.int16_t>()
    for (let j = 0; j < Math.abs(mesh.numNormals); j++) {
      mesh.lights.push(data.getInt16(offset, true))
      offset += 2
    }
  }

  mesh.numTexturedRectangles = data.getInt16(offset, true)
  offset += 2
  mesh.texturedRectangles = new Array<tr.face4>()
  for (let j = 0; j < mesh.numTexturedRectangles; j++) {
    mesh.texturedRectangles[j] = tr.ParseFace4(data, offset)
    offset += tr.face4_size
  }

  mesh.numTexturedTriangles = data.getInt16(offset, true)
  offset += 2
  mesh.texturedTriangles = new Array<tr.face3>()
  for (let j = 0; j < mesh.numTexturedTriangles; j++) {
    mesh.texturedTriangles[j] = tr.ParseFace3(data, offset)
    offset += tr.face3_size
  }

  mesh.numColouredRectangles = data.getInt16(offset, true)
  offset += 2
  mesh.colouredRectangles = new Array<tr.face4>()
  for (let j = 0; j < mesh.numColouredRectangles; j++) {
    mesh.colouredRectangles[j] = tr.ParseFace4(data, offset)
    offset += tr.face4_size
  }

  mesh.numColouredTriangles = data.getInt16(offset, true)
  offset += 2
  mesh.colouredTriangles = new Array<tr.face3>()
  for (let j = 0; j < mesh.numColouredTriangles; j++) {
    mesh.colouredTriangles[j] = tr.ParseFace3(data, offset)
    offset += tr.face3_size
  }

  return mesh
}
