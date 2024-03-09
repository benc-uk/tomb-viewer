// =============================================================================
// Project: WebGL Tomb Raider
// Parser for Tomb Raider 2 level files
// =============================================================================

// import { parseMesh } from './parser'
import * as tr from './types'

export function parseLevel(data: DataView): tr.level {
  const level = {} as tr.level
  level.version = tr.version.TR2
  level.verString = 'Tomb Raider 2'

  // Offset into the file, skip the version in the first 4 bytes
  let offset = 4

  // Parse and read the palette
  level.palette = tr.ParsePalette(data, offset)
  offset += tr.palette_size

  // Parse and read the palette16
  level.palette16 = tr.ParsePalette16(data, offset)
  offset += tr.palette16_size

  // Parse and read the textures
  level.numTextiles = data.getUint32(offset, true)
  offset += 4
  level.textiles = Array<tr.textile8>()
  for (let i = 0; i < level.numTextiles; i++) {
    level.textiles.push(tr.ParseTextile8(data, offset))
    offset += tr.textile8_size
  }
  // These appear to be unused!
  level.textiles16 = Array<tr.textile16>()
  for (let i = 0; i < level.numTextiles; i++) {
    level.textiles16.push(tr.ParseTextile16(data, offset))
    offset += tr.textile16_size
  }

  offset += 4 // 4 bytes of unused nothingness

  level.numRooms = data.getUint16(offset, true)
  console.log('numRooms', level.numRooms)

  offset += 2
  level.rooms = new Array<tr.room>(level.numRooms)
  for (let roomNum = 0; roomNum < level.numRooms; roomNum++) {
    console.log('--------roomNum', roomNum, 'offset', offset)

    const room = {} as tr.room

    // First block is the info struct
    room.info = tr.ParseRoomInfo(data, offset)
    offset += tr.room_info_size

    // This confusingly named variable is actually the size of just the tr_room_data
    // Which has no purpose unless we want skip the tr_room_data
    //const numDataWords = data.getUint32(offset, true)
    offset += 4

    // Room data is all the room geometry vertexes etc
    room.roomData = tr.NewRoomData()

    // Parse tr_room_data.vertices
    room.roomData.numVertices = data.getUint16(offset, true)
    offset += 2
    console.log('numVertices', room.roomData.numVertices)
    for (let j = 0; j < room.roomData.numVertices; j++) {
      const room_vertex = tr.ParseRoomVertex(data, offset)
      room.roomData.vertices.push(room_vertex)
      offset += tr.room_vertex_size_tr2 // Note length of vertex struct is larger in TR2
    }

    // Parse tr_room_data.rectangles
    room.roomData.numRectangles = data.getUint16(offset, true)
    offset += 2
    console.log('numRectangles', room.roomData.numRectangles)
    for (let j = 0; j < room.roomData.numRectangles; j++) {
      const face4 = tr.ParseFace4(data, offset)
      room.roomData.rectangles.push(face4)
      offset += tr.face4_size
    }

    // Parse tr_room_data.triangles
    room.roomData.numTriangles = data.getUint16(offset, true)
    offset += 2
    console.log('numTriangles', room.roomData.numTriangles)
    for (let j = 0; j < room.roomData.numTriangles; j++) {
      const face3 = tr.ParseFace3(data, offset)
      room.roomData.triangles.push(face3)
      offset += tr.face3_size
    }

    // Parse tr_room_data.sprites
    room.roomData.numSprites = data.getUint16(offset, true)
    offset += 2
    console.log('numSprites', room.roomData.numSprites)
    for (let j = 0; j < room.roomData.numSprites; j++) {
      const room_sprite = tr.ParseRoomSprite(data, offset)
      room.roomData.sprites.push(room_sprite)
      offset += tr.room_sprite_size
    }

    room.numPortals = data.getUint16(offset, true)
    console.log('numPortals', room.numPortals)

    offset += 2
    offset += room.numPortals * 32 // Skipped data

    room.numZSectors = data.getUint16(offset, true)
    offset += 2
    room.numXSectors = data.getUint16(offset, true)
    offset += 2
    console.log('numZSectors', room.numZSectors, 'numXSectors', room.numXSectors)

    room.sectorList = new Array<tr.room_sector>()
    for (let j = 0; j < room.numZSectors * room.numXSectors; j++) {
      room.sectorList.push(tr.ParseRoomSector(data, offset))
      offset += tr.room_sector_size
    }

    room.ambientIntensity = data.getInt16(offset, true)
    console.log('ambientIntensity', room.ambientIntensity)

    offset += 2

    room.numLights = data.getUint16(offset, true)
    offset += 2
    console.log('numLights', room.numLights)
    room.lights = new Array<tr.room_light>()
    for (let j = 0; j < room.numLights; j++) {
      room.lights.push(tr.ParseRoomLightTR2(data, offset))
      offset += tr.room_light_size_tr2
    }

    room.numStaticMeshes = data.getUint16(offset, true)
    offset += 2
    console.log('numStaticMeshes', room.numStaticMeshes)
    room.staticMeshes = new Array<tr.room_staticmesh>()
    for (let j = 0; j < room.numStaticMeshes; j++) {
      room.staticMeshes.push(tr.ParseRoomStaticMeshTR2(data, offset))
      offset += tr.room_staticmesh_size_tr2
    }

    room.alternateRoom = data.getInt16(offset, true)
    console.log('alternateRoom', room.alternateRoom)
    offset += 2
    room.flags = data.getInt16(offset, true)
    console.log('flags', room.flags)
    offset += 2

    level.rooms[roomNum] = room
  }

  return level
}
