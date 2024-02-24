import * as t from './types'
import { saveTextileAsPNG } from './utils'

/**
 * Parses a Tomb Raider level file
 * @param dataArray Uint8Array of the raw level data
 */
export function parseLevel(dataArray: Uint8Array): t.tr1_level {
  // Need a DataView to help us read the file
  const data = new DataView(dataArray.buffer)

  console.log('Parsing level, bytes: ' + dataArray.length)

  const verMagic = data.getUint32(0, true)

  switch (verMagic) {
    case t.tr_version.TR1:
      return parseTR1Level(data)
    default:
      throw new Error('Unknown version ' + verMagic + ', this file is not a valid TR level file.')
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

  console.log('Number of tex-tiles: ' + level.numTextiles)

  level.textiles = Array<t.tr_textile8>(level.numTextiles)

  for (let i = 0; i < level.numTextiles; i++) {
    level.textiles[i] = t.NewTextile8(data, offset)
    offset += t.tr_textile8_size
  }

  // Skip unused data
  offset += 4

  // Parse Rooms
  const numRooms = data.getUint16(offset, true)
  offset += 2
  console.log('Number of rooms: ' + numRooms)
  for (let i = 0; i < numRooms; i++) {
    const room = {} as t.tr_room
    room.info = {
      x: data.getUint32(offset, true),
      z: data.getUint32(offset + 4, true),
      yBottom: data.getUint32(offset + 8, true),
      yTop: data.getUint32(offset + 12, true),
    }
    offset += 16

    room.numDataWords = data.getUint32(offset, true)
    offset += 4
    offset += 2 * room.numDataWords // Skipped data

    room.numPortals = data.getUint16(offset, true)
    offset += 2
    offset += room.numPortals * 32 // Skipped data

    room.numZSectors = data.getUint16(offset, true)
    offset += 2
    room.numXSectors = data.getUint16(offset, true)
    offset += 2
    offset += room.numZSectors * room.numXSectors * 8

    room.ambientIntensity = data.getUint16(offset, true)
    offset += 2

    room.numLights = data.getUint16(offset, true)
    offset += 2
    offset += room.numLights * 18 // Skipped data

    room.numStaticMeshes = data.getUint16(offset, true)
    offset += 2
    offset += room.numStaticMeshes * 18 // Skipped data

    room.alternateRoom = data.getUint16(offset, true)
    offset += 2
    room.flags = data.getUint16(offset, true)
    offset += 2
  }

  const numFloorData = data.getUint32(offset, true)
  offset += 4
  offset += numFloorData * 2 // Skipped data

  // Parse mesh data, not this is the only place where a read ahead is needed
  // For numMeshPointers is needed if we wanted to parse the mesh data
  const numMeshData = data.getUint32(offset, true)
  offset += 4
  // UNUSED: const meshDataOffset = offset;
  offset += numMeshData * 2 // Skipped data

  // Parse mesh pointers
  const numMeshPointers = data.getUint32(offset, true)
  offset += 4
  offset += numMeshPointers * 4 // Skipped data

  // Would read mesh data here from meshDataOffset, using numMeshPointers count

  const numAnimations = data.getUint32(offset, true)
  offset += 4
  offset += numAnimations * 32 // Skipped data

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

  const numFrames = data.getUint32(offset, true)
  offset += 4
  offset += numFrames * 2 // Skipped data

  const numModels = data.getUint32(offset, true)
  offset += 4
  offset += numModels * 18 // Skipped data

  const numStaticMeshes = data.getUint32(offset, true)
  offset += 4
  offset += numStaticMeshes * 32 // Skipped data

  const numObjectTextures = data.getUint32(offset, true)
  offset += 4
  offset += numObjectTextures * 20 // Skipped data

  const numSpriteTextures = data.getUint32(offset, true)
  offset += 4
  offset += numSpriteTextures * 16 // Skipped data

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

  const numEntities = data.getUint32(offset, true)
  offset += 4
  offset += numEntities * 22 // Skipped data

  offset += 8192 // Skipped data

  // Parse and read the palette
  level.palette = t.NewPalette(data, offset)

  // HACK: Dump the textures as PNGs
  for (let t = 0; t < level.numTextiles; t++) {
    saveTextileAsPNG(level.textiles[t], level.palette)
  }

  return level
}
