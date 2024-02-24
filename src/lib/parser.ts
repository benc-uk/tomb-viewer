import * as t from "./types";
import { saveTextileAsPNG } from "./utils";

export function parseTR1Level(data: Uint8Array) {
  const levelDat = new DataView(data.buffer);

  console.log("Parsing level, size: " + data.length);
  let offset = 0;

  const level = {} as t.tr1_level;
  level.version = levelDat.getUint32(offset, true);
  offset += 4;

  // This will throw an error if the file is recognized as a TR level file
  level.versionStr = detectVersion(level.version);

  // log the version as a padded hex string
  console.log("Detected Tomb Raider version: " + level.versionStr);

  // Parse Textiles
  const numTextiles = levelDat.getUint32(offset, true);
  offset += 4;

  level.numTextiles = numTextiles;
  console.log("Number of Textiles: " + numTextiles);

  level.textiles = Array<t.tr_textile8>(numTextiles);

  for (let i = 0; i < numTextiles; i++) {
    const textile = t.NewTextile8(levelDat, offset);

    level.textiles[i] = textile;
    offset += t.tr_textile8_size;
  }

  // Skip unused data
  offset += 4;

  // Parse Rooms
  const numRooms = levelDat.getUint16(offset, true);
  offset += 2;
  console.log("Number of Rooms: " + numRooms);
  for (let i = 0; i < numRooms; i++) {
    const room = {} as t.tr_room;
    room.info = {
      x: levelDat.getUint32(offset, true),
      z: levelDat.getUint32(offset + 4, true),
      yBottom: levelDat.getUint32(offset + 8, true),
      yTop: levelDat.getUint32(offset + 12, true),
    };
    offset += 16;

    room.numDataWords = levelDat.getUint32(offset, true);
    offset += 4;
    offset += 2 * room.numDataWords; // room data skipped!!

    room.numPortals = levelDat.getUint16(offset, true);
    offset += 2;
    offset += room.numPortals * 32; // portal data skipped!!

    room.numZSectors = levelDat.getUint16(offset, true);
    offset += 2;
    room.numXSectors = levelDat.getUint16(offset, true);
    offset += 2;
    offset += room.numZSectors * room.numXSectors * 8;

    room.ambientIntensity = levelDat.getUint16(offset, true);
    offset += 2;

    room.numLights = levelDat.getUint16(offset, true);
    offset += 2;
    offset += room.numLights * 18; // light data skipped!!

    room.numStaticMeshes = levelDat.getUint16(offset, true);
    offset += 2;
    offset += room.numStaticMeshes * 18; // static mesh data skipped!!

    room.alternateRoom = levelDat.getUint16(offset, true);
    offset += 2; // alternate room
    room.flags = levelDat.getUint16(offset, true);
    offset += 2; // flags
  }

  const numFloorData = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numFloorData * 2; // floor data skipped!!

  // Parse mesh data, not this is the only place where a read ahead is needed
  // For numMeshPointers is needed if we wanted to parse the mesh data
  const numMeshData = levelDat.getUint32(offset, true);
  offset += 4;
  //const meshDataOffset = offset;
  offset += numMeshData * 2; // ALL mesh data skipped!!

  // Parse mesh pointers
  const numMeshPointers = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numMeshPointers * 4; // mesh pointers skipped!!
  console.log("Number of meshes: " + numMeshPointers);

  // Would read mesh data here from meshDataOffset, using numMeshPointers count

  const numAnimations = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numAnimations * 32; // animation data skipped!!

  const numStateChanges = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numStateChanges * 6; // state changes skipped!!

  const numAnimDispatches = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numAnimDispatches * 8; // anim dispatches skipped!!

  const numAnimCommands = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numAnimCommands * 2; // anim commands skipped!!

  const numMeshTrees = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numMeshTrees * 4; // mesh trees skipped!!

  const numFrames = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numFrames * 2; // frames skipped!!

  const numModels = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numModels * 18; // models skipped!!

  const numStaticMeshes = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numStaticMeshes * 32; // static meshes skipped!!

  const numObjectTextures = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numObjectTextures * 20; // object textures skipped!!

  const numSpriteTextures = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numSpriteTextures * 16; // sprite textures skipped!!

  const numSpriteSequences = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numSpriteSequences * 8; // sprite sequences skipped!!

  const numCameras = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numCameras * 16; // cameras skipped!!

  const numSoundSources = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numSoundSources * 16; // sound sources skipped!!

  const numBoxes = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numBoxes * 20; // boxes skipped!!

  const numOverlaps = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numOverlaps * 2; // overlaps skipped!!

  offset += 2 * numBoxes; // GroundZone
  offset += 2 * numBoxes; // GroundZone2
  offset += 2 * numBoxes; // FlyZone
  offset += 2 * numBoxes; // GroundZoneAlt
  offset += 2 * numBoxes; // GroundZoneAlt2
  offset += 2 * numBoxes; // FlyZoneAlt

  const numAnimatedTextures = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numAnimatedTextures * 2; // animated textures skipped!!

  const numEntities = levelDat.getUint32(offset, true);
  offset += 4;
  offset += numEntities * 22; // entities skipped!!
  console.log("Number of entities: " + numEntities);

  offset += 8192; // lightmap data skipped!!

  // Parse and read the palette
  const palette = new Array<t.tr_colour>(256);
  for (let i = 0; i < 256; i++) {
    palette[i] = {
      r: levelDat.getUint8(offset),
      g: levelDat.getUint8(offset + 1),
      b: levelDat.getUint8(offset + 2),
    };
    offset += t.tr_colour_size;
  }

  // Dump the textures as PNGs
  for (let t = 0; t < numTextiles; t++) {
    saveTextileAsPNG(level.textiles[t], palette);
  }
}

/**
 * Detects the version of the TR level file
 * @param verBytes
 * @returns The version as a string or throws an error if the version is unknown
 */
function detectVersion(verBytes: t.tr_version): string {
  switch (verBytes) {
    case t.tr_version.TR1:
      return "TR1";
    case t.tr_version.TR2:
      return "TR2";
    case t.tr_version.TR3:
      return "TR3";
    case t.tr_version.TR4:
      return "TR4";
    case t.tr_version.TR5:
      return "TR5";
    case t.tr_version.TR4_DEMO:
      return "TR4_Demo";
    case t.tr_version.TR5_DEMO:
      return "TR5_Demo";
    default:
      throw new Error("Unknown version " + verBytes + ", this file is not a valid TR level file.");
  }
}
