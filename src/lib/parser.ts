// =============================================================================
// Project: WebGL Tomb Raider
// Main level parser, currently only supports TR1 levels
// =============================================================================

import * as t from './types'

/**
 * Parses a Tomb Raider level file
 * @param dataArray Uint8Array of the raw level data
 */
export function parseLevel(dataArray: Uint8Array): t.tr1_level {
  // Need a DataView to help us read the file
  const data = new DataView(dataArray.buffer)

  console.log(`📜 Parsing level, bytes: ${dataArray.length}`)

  const verMagic = data.getUint32(0, true)

  // Check the version magic is even valid
  if (!Object.values(t.tr_version).includes(verMagic)) {
    throw new Error('Unknown version ' + verMagic + ', this file is not a valid TR level file.')
  }

  // Parse the level based on the version
  switch (verMagic) {
    case t.tr_version.TR1:
      return parseTR1Level(data)
    default:
      throw new Error('This version of Tomb Raider is not supported yet :(')
  }
}

/**
 * Parses a Tomb Raider 1 level file
 * @param data DataView of the raw level data
 */
function parseTR1Level(data: DataView): t.tr1_level {
  const level = {} as t.tr1_level
  level.version = t.tr_version.TR1

  // Offset into the file, skip the version in the first 4 bytes
  let offset = 4

  // Parse textiles
  level.numTextiles = data.getUint32(offset, true)
  offset += 4

  level.textiles = Array<t.tr_textile8>(level.numTextiles)
  for (let i = 0; i < level.numTextiles; i++) {
    level.textiles[i] = t.ParseTextile8(data, offset)
    offset += t.tr_textile8_size
  }

  // Skip unused data
  offset += 4

  // Parse Rooms
  level.numRooms = data.getUint16(offset, true)
  offset += 2

  level.rooms = new Array<t.tr_room>(level.numRooms)
  for (let i = 0; i < level.numRooms; i++) {
    const room = {} as t.tr_room
    room.info = t.ParseRoomInfo(data, offset)
    offset += t.tr_room_info_size

    // This confusingly named variable is actually the size of just the tr_room_data
    // Which has no purpose unless we want skip the tr_room_data
    room.numDataWords = data.getUint32(offset, true)
    offset += 4

    room.roomData = t.NewRoomData()

    // Parse tr_room_data.vertices
    room.roomData.numVertices = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numVertices; j++) {
      const room_vertex = t.ParseRoomVertex(data, offset)
      room.roomData.vertices.push(room_vertex)
      offset += t.tr_room_vertex_size
    }

    // Parse tr_room_data.rectangles
    room.roomData.numRectangles = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numRectangles; j++) {
      const face4 = t.ParseFace4(data, offset)
      room.roomData.rectangles.push(face4)
      offset += t.tr_face4_size
    }

    // Parse tr_room_data.triangles
    room.roomData.numTriangles = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numTriangles; j++) {
      const face3 = t.ParseFace3(data, offset)
      room.roomData.triangles.push(face3)
      offset += t.tr_face3_size
    }

    // Parse tr_room_data.sprites
    room.roomData.numSprites = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numSprites; j++) {
      const room_sprite = t.ParseRoomSprite(data, offset)
      room.roomData.sprites.push(room_sprite)
      offset += t.tr_room_sprite_size
    }

    room.numPortals = data.getUint16(offset, true)
    offset += 2
    offset += room.numPortals * 32 // Skipped data

    room.numZSectors = data.getUint16(offset, true)
    offset += 2
    room.numXSectors = data.getUint16(offset, true)
    offset += 2
    room.sectorList = new Array<t.tr_room_sector>()
    for (let j = 0; j < room.numZSectors * room.numXSectors; j++) {
      room.sectorList.push(t.ParseRoomSector(data, offset))
      offset += t.tr_room_sector_size
    }

    room.ambientIntensity = data.getInt16(offset, true)
    offset += 2

    room.numLights = data.getUint16(offset, true)
    offset += 2
    room.lights = new Array<t.tr_room_light>()
    for (let j = 0; j < room.numLights; j++) {
      room.lights.push(t.ParseRoomLight(data, offset))
      offset += t.tr_room_light_size
    }

    room.numStaticMeshes = data.getUint16(offset, true)
    offset += 2
    room.staticMeshes = new Array<t.tr_room_staticmesh>()
    for (let j = 0; j < room.numStaticMeshes; j++) {
      room.staticMeshes.push(t.ParseRoomStaticMesh(data, offset))
      offset += t.tr_room_staticmesh_size
    }

    room.alternateRoom = data.getInt16(offset, true)
    offset += 2
    room.flags = data.getInt16(offset, true)
    offset += 2

    level.rooms[i] = room
  }

  level.numFloorData = data.getUint32(offset, true)
  offset += 4
  level.floorData = new Array<t.uint16_t>()
  for (let i = 0; i < level.numFloorData; i++) {
    level.floorData.push(data.getUint16(offset, true))
    offset += 2
  }

  // WARNING! Parsing meshes is *different*, they are not 'packed' like the other data
  // Extra comments here to help anyone that finds this code in the future!

  // First get the total size of the mesh data block
  const meshDataSize = data.getUint32(offset, true)
  offset += 4

  // Remember the start of the mesh data block, and skip over it
  const meshOffsetStart = offset
  offset += meshDataSize * 2

  // Get number of meshPointers we need to do this first to know how many meshes there are
  level.numMeshPointers = data.getUint32(offset, true)
  offset += 4

  // Now we can parse the meshPointers array and the meshes
  level.meshPointers = new Array<t.uint32_t>()
  level.meshes = new Map<number, t.tr_mesh>()
  for (let i = 0; i < level.numMeshPointers; i++) {
    const meshPointer = data.getUint32(offset, true)
    offset += 4
    level.meshPointers.push(meshPointer)

    // The value of the mesh pointer is actually the offset into the mesh data block!
    const mesh = parseMesh(data, meshOffsetStart + meshPointer)

    // Store the meshes in a map for easy access, indexed by the pointer
    level.meshes.set(meshPointer, mesh)
  }

  level.numAnimations = data.getUint32(offset, true)
  offset += 4
  level.animations = new Array<t.tr_animation>()
  for (let i = 0; i < level.numAnimations; i++) {
    level.animations.push(t.ParseAnimation(data, offset))
    offset += t.tr_animation_size
  }

  const numStateChanges = data.getUint32(offset, true)
  offset += 4
  offset += numStateChanges * 6 // Skipped data

  const numAnimDispatches = data.getUint32(offset, true)
  offset += 4
  offset += numAnimDispatches * 8 // Skipped data

  const numAnimCommands = data.getUint32(offset, true)
  offset += 4
  offset += numAnimCommands * 2 // Skipped data

  const numMeshTrees = data.getUint32(offset, true)
  offset += 4
  offset += numMeshTrees * 4 // Skipped data

  const frameDataSize = data.getUint32(offset, true)
  offset += 4
  for (const anim of level.animations) {
    // We parse a single frame for now
    anim.frames[0] = t.ParseAnimFrame(data, offset + anim.frameOffset)
  }

  level.frames = new DataView(data.buffer, offset, frameDataSize * 2)
  offset += frameDataSize * 2

  level.numModels = data.getUint32(offset, true)
  offset += 4
  level.models = new Map<number, t.tr_model>()
  for (let i = 0; i < level.numModels; i++) {
    const model = t.ParseModel(data, offset)
    level.models.set(model.id, model)
    offset += t.tr_model_size
  }

  level.numStaticMeshes = data.getUint32(offset, true)
  offset += 4
  level.staticMeshes = new Map<number, t.tr_staticmesh>()
  for (let i = 0; i < level.numStaticMeshes; i++) {
    const staticMesh = t.ParseStaticMesh(data, offset)
    level.staticMeshes.set(staticMesh.id, staticMesh)
    offset += t.tr_staticmesh_size
  }

  level.numObjectTextures = data.getUint32(offset, true)
  offset += 4
  // Parse object textures
  level.objectTextures = new Array<t.tr_object_texture>(level.numObjectTextures)
  for (let i = 0; i < level.numObjectTextures; i++) {
    level.objectTextures[i] = t.ParseObjectTexture(data, offset)
    offset += t.tr_object_texture_size
  }

  level.numSpriteTextures = data.getUint32(offset, true)
  offset += 4
  level.spriteTextures = new Array<t.tr_sprite_texture>(level.numSpriteTextures)
  for (let i = 0; i < level.numSpriteTextures; i++) {
    level.spriteTextures[i] = t.ParseSpriteTexture(data, offset)
    offset += t.tr_sprite_texture_size
  }

  const numSpriteSequences = data.getUint32(offset, true)
  offset += 4
  offset += numSpriteSequences * 8 // Skipped data

  const numCameras = data.getUint32(offset, true)
  offset += 4
  offset += numCameras * 16 // Skipped data

  const numSoundSources = data.getUint32(offset, true)
  offset += 4
  offset += numSoundSources * 16 // Skipped data

  const numBoxes = data.getUint32(offset, true)
  offset += 4
  offset += numBoxes * 20 // Skipped data

  const numOverlaps = data.getUint32(offset, true)
  offset += 4
  offset += numOverlaps * 2 // Skipped data

  offset += 12 * numBoxes // Skipped zone data

  const numAnimatedTextures = data.getUint32(offset, true)
  offset += 4
  offset += numAnimatedTextures * 2 // Skipped data

  level.numEntities = data.getUint32(offset, true)
  offset += 4
  // Parse entities
  level.entities = new Array<t.tr_entity>(level.numEntities)
  for (let i = 0; i < level.numEntities; i++) {
    level.entities[i] = t.ParseEntity(data, offset)
    offset += t.tr_entity_size
  }

  offset += 8192 // Light map - skipped data

  // Parse and read the palette
  level.palette = t.ParsePalette(data, offset)

  return level
}

/**
 * Parses a mesh from the level file
 * @param data DataView of the level file
 * @param offset Offset into the mesh data block
 */
function parseMesh(data: DataView, offset: number): t.tr_mesh {
  const mesh = {} as t.tr_mesh

  mesh.centre = t.ParseVertex(data, offset)
  offset += t.tr_vertex_size

  mesh.collRadius = data.getInt32(offset, true)
  offset += 4

  mesh.numVertices = data.getInt16(offset, true)
  offset += 2
  mesh.vertices = new Array<t.tr_vertex>()
  for (let j = 0; j < mesh.numVertices; j++) {
    mesh.vertices.push(t.ParseVertex(data, offset))
    offset += t.tr_vertex_size
  }

  mesh.numNormals = data.getInt16(offset, true)
  offset += 2
  // Weirdness see https://opentomb.github.io/TRosettaStone3/trosettastone.html#_meshes
  if (mesh.numNormals > 0) {
    mesh.normals = new Array<t.tr_vertex>()
    for (let j = 0; j < mesh.numNormals; j++) {
      mesh.normals.push(t.ParseVertex(data, offset))
      offset += t.tr_vertex_size
    }
  } else {
    mesh.lights = new Array<t.int16_t>()
    for (let j = 0; j < Math.abs(mesh.numNormals); j++) {
      mesh.lights.push(data.getInt16(offset, true))
      offset += 2
    }
  }

  mesh.numTexturedRectangles = data.getInt16(offset, true)
  offset += 2
  mesh.texturedRectangles = new Array<t.tr_face4>()
  for (let j = 0; j < mesh.numTexturedRectangles; j++) {
    mesh.texturedRectangles[j] = t.ParseFace4(data, offset)
    offset += t.tr_face4_size
  }

  mesh.numTexturedTriangles = data.getInt16(offset, true)
  offset += 2
  mesh.texturedTriangles = new Array<t.tr_face3>()
  for (let j = 0; j < mesh.numTexturedTriangles; j++) {
    mesh.texturedTriangles[j] = t.ParseFace3(data, offset)
    offset += t.tr_face3_size
  }

  mesh.numColouredRectangles = data.getInt16(offset, true)
  offset += 2
  mesh.colouredRectangles = new Array<t.tr_face4>()
  for (let j = 0; j < mesh.numColouredRectangles; j++) {
    mesh.colouredRectangles[j] = t.ParseFace4(data, offset)
    offset += t.tr_face4_size
  }

  mesh.numColouredTriangles = data.getInt16(offset, true)
  offset += 2
  mesh.colouredTriangles = new Array<t.tr_face3>()
  for (let j = 0; j < mesh.numColouredTriangles; j++) {
    mesh.colouredTriangles[j] = t.ParseFace3(data, offset)
    offset += t.tr_face3_size
  }

  return mesh
}
