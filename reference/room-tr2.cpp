virtual struct tr2_room  // (variable length)
{
  tr_room_info info;           // Where the room exists, in world coordinates

  uint32_t NumDataWords;       // Number of data words (uint16_t's)
  uint16_t Data[NumDataWords]; // The raw data from which the rest of this is derived

  tr_room_data RoomData;       // The room mesh

  uint16_t NumPortals;                 // Number of visibility portals to other rooms
  tr_room_portal Portals[NumPortals];  // List of visibility portals

  uint16_t NumZsectors;                                  // ``Width'' of sector list
  uint16_t NumXsectors;                                  // ``Height'' of sector list
  tr_room_sector SectorList[NumXsectors * NumZsectors];  // List of sectors in this room

  int16_t AmbientIntensity;

  uint16_t NumLights;                 // Number of lights in this room
  tr2_room_light Lights[NumLights];    // List of lights

  uint16_t NumStaticMeshes;                            // Number of static meshes
  tr2_room_staticmesh StaticMeshes[NumStaticMeshes];   // List of static meshes

  int16_t AlternateRoom;
  int16_t Flags;
};

virtual struct tr_room_data    // (variable length)
{
  int16_t NumVertices;                   // Number of vertices in the following list
  tr_room_vertex Vertices[NumVertices]; // List of vertices (relative coordinates)

  int16_t NumRectangles;                 // Number of textured rectangles
  tr_face4 Rectangles[NumRectangles];    // List of textured rectangles

  int16_t NumTriangles;                  // Number of textured triangles
  tr_face3 Triangles[NumTriangles];      // List of textured triangles

  int16_t NumSprites;                    // Number of sprites
  tr_room_sprite Sprites[NumSprites];    // List of sprites
};

struct tr_room_portal        // 32 bytes
{
  uint16_t  AdjoiningRoom;   // Which room this portal leads to
  tr_vertex Normal;
  tr_vertex Vertices[4];
};

struct tr_room_sector  // 8 bytes
{
  uint16_t FDindex;    // Index into FloorData[]
  uint16_t BoxIndex;   // Index into Boxes[] (-1 if none)
  uint8_t  RoomBelow;  // 255 is none
  int8_t   Floor;      // Absolute height of floor
  uint8_t  RoomAbove;  // 255 if none
  int8_t   Ceiling;    // Absolute height of ceiling
};

struct tr_room_light   // 18 bytes
{
  int32_t x, y, z;     // Position of light, in world coordinates
  uint16_t Intensity1; // Light intensity
  uint32_t Fade1;      // Falloff value
};

struct tr_room_info    // 16 bytes
{
  int32_t x;           // X-offset of room (world coordinates)
  int32_t z;           // Z-offset of room (world coordinates)
  int32_t yBottom;
  int32_t yTop;
};