// =============================================================================
// Project: WebGL Tomb Raider
// Parser for Tomb Raider 3 level files
// =============================================================================

import { parseMesh } from './parser'
import * as tr from './types'

export function parseLevel(data: DataView): tr.level {
  const level = {} as tr.level
  level.version = tr.version.TR3
  level.verString = 'Tomb Raider 3'

  level.spriteTextures = new Array<tr.sprite_texture>()
  level.objectTextures = new Array<tr.object_texture>()
  level.staticMeshes = new Map<number, tr.staticmesh>()
  level.meshes = new Map<number, tr.mesh>()
  level.entities = new Array<tr.entity>()
  level.models = new Map<number, tr.model>()

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

  offset += 2
  level.rooms = new Array<tr.room>(level.numRooms)
  for (let roomNum = 0; roomNum < level.numRooms; roomNum++) {
    const room = {} as tr.room

    // First block is the info struct
    room.info = tr.ParseRoomInfo(data, offset)
    offset += tr.room_info_size

    // This confusingly named variable is actually the size of just the tr_room_data
    // Which has no purpose unless we want skip the tr_room_data
    // const numDataWords = data.getUint32(offset, true)
    offset += 4

    // Room data is all the room geometry vertexes etc
    room.roomData = tr.NewRoomData()

    room.roomData.numVertices = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numVertices; j++) {
      // Slightly different vertex struct in TR3 which has colours
      const room_vertex = tr.ParseRoomVertexTR3(data, offset)
      room.roomData.vertices.push(room_vertex)
      offset += tr.room_vertex_size_tr2 // Note length of vertex struct is larger in TR2 & TR3
    }

    room.roomData.numRectangles = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numRectangles; j++) {
      const face4 = tr.ParseFace4(data, offset)
      room.roomData.rectangles.push(face4)
      offset += tr.face4_size
    }

    room.roomData.numTriangles = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numTriangles; j++) {
      const face3 = tr.ParseFace3(data, offset)
      room.roomData.triangles.push(face3)
      offset += tr.face3_size
    }

    room.roomData.numSprites = data.getUint16(offset, true)
    offset += 2
    for (let j = 0; j < room.roomData.numSprites; j++) {
      const room_sprite = tr.ParseRoomSprite(data, offset)
      room.roomData.sprites.push(room_sprite)
      offset += tr.room_sprite_size
    }

    room.numPortals = data.getUint16(offset, true)

    offset += 2
    offset += room.numPortals * 32 // Skipped data

    room.numZSectors = data.getUint16(offset, true)
    offset += 2
    room.numXSectors = data.getUint16(offset, true)
    offset += 2

    room.sectorList = new Array<tr.room_sector>()
    for (let j = 0; j < room.numZSectors * room.numXSectors; j++) {
      room.sectorList.push(tr.ParseRoomSector(data, offset))
      offset += tr.room_sector_size
    }

    room.ambientIntensity = data.getInt16(offset, true)
    offset += 2

    // !IMPORTANT! Skip TR3 stuff: LightMode, BUT AmbientIntensity2 from TR2 is gone!
    offset += 2

    room.numLights = data.getUint16(offset, true)
    offset += 2
    room.lights = new Array<tr.room_light>()
    for (let j = 0; j < room.numLights; j++) {
      const roomLight = tr.ParseRoomLightTR3(data, offset)
      if (roomLight) {
        room.lights.push(roomLight)
      }
      offset += tr.room_light_size_tr2
    }

    room.numStaticMeshes = data.getUint16(offset, true)
    offset += 2
    room.staticMeshes = new Array<tr.room_staticmesh>()
    for (let j = 0; j < room.numStaticMeshes; j++) {
      room.staticMeshes.push(tr.ParseRoomStaticMeshTR2(data, offset))
      offset += tr.room_staticmesh_size_tr2
    }

    room.alternateRoom = data.getInt16(offset, true)
    offset += 2
    room.flags = data.getInt16(offset, true)
    offset += 2

    level.rooms[roomNum] = room

    // !IMPORTANT! Skip unused data in TR3; WaterScheme, ReverbInfo & Filler
    offset += 3
  }

  level.numFloorData = data.getUint32(offset, true)
  offset += 4
  level.floorData = new Array<tr.uint16_t>()
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
  level.meshPointers = new Array<tr.uint32_t>()
  level.meshes = new Map<number, tr.mesh>()
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
  level.animations = new Array<tr.animation>()
  for (let i = 0; i < level.numAnimations; i++) {
    level.animations.push(tr.ParseAnimation(data, offset))
    offset += tr.animation_size
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
    // We parse a single frame it's all we need
    anim.frames[0] = tr.ParseAnimFrame(data, offset + anim.frameOffset)
  }
  offset += frameDataSize * 2

  level.numModels = data.getUint32(offset, true)
  offset += 4
  for (let i = 0; i < level.numModels; i++) {
    const model = tr.ParseModel(data, offset)
    level.models.set(model.id, model)
    offset += tr.model_size
  }

  level.numStaticMeshes = data.getUint32(offset, true)
  offset += 4
  for (let i = 0; i < level.numStaticMeshes; i++) {
    const staticMesh = tr.ParseStaticMesh(data, offset)
    level.staticMeshes.set(staticMesh.id, staticMesh)
    offset += tr.staticmesh_size
  }

  level.numSpriteTextures = data.getUint32(offset, true)
  offset += 4
  for (let i = 0; i < level.numSpriteTextures; i++) {
    level.spriteTextures.push(tr.ParseSpriteTexture(data, offset))
    offset += tr.sprite_texture_size
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
  offset += numBoxes * 8 // Skipped data

  const numOverlaps = data.getUint32(offset, true)
  offset += 4
  offset += numOverlaps * 2 // Skipped data

  // Ignore zones etc
  offset += 20 * numBoxes // Skipped zone data

  // Next 2 bytes is mis-named in the TRosettaStone in fact the docs for animated textures is all wrong!
  // It's actually the number of 2 byte words NOT number of animated textures
  // const animTextureNumWords = data.getUint32(offset, true)
  offset += 4 // We don't need the value just skip over it

  // This is the real number of animated textures!
  level.numAnimatedTextures = data.getUint16(offset, true)
  offset += 2

  level.animatedTextures = new Array<tr.animated_texture>()
  for (let i = 0; i < level.numAnimatedTextures; i++) {
    // IMPORTANT! ADD ONE HERE! Also it's _always_ four so why bother?
    const textCount = data.getUint16(offset, true) + 1
    offset += 2

    const ids = new Array<number>()
    for (let j = 0; j < textCount; j++) {
      ids.push(data.getInt16(offset + j * 2, true))
    }
    offset += 2 * textCount

    const at = {
      size: textCount,
      objTexIds: ids,
    } as tr.animated_texture

    level.animatedTextures.push(at)
  }

  level.numObjectTextures = data.getUint32(offset, true)
  offset += 4
  for (let i = 0; i < level.numObjectTextures; i++) {
    level.objectTextures.push(tr.ParseObjectTexture(data, offset))
    offset += tr.object_texture_size
  }

  level.numEntities = data.getUint32(offset, true)
  offset += 4
  for (let i = 0; i < level.numEntities; i++) {
    level.entities.push(tr.ParseEntityTR2(data, offset))
    offset += tr.entity_size_tr2
  }

  // Stop here - we don't need any more data from the file!

  return level
}
