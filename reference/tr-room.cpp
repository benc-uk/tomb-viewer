virtual struct tr_room  // (variable length)
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
    tr_room_light Lights[NumLights];    // List of lights

    uint16_t NumStaticMeshes;                            // Number of static meshes
    tr2_room_staticmesh StaticMeshes[NumStaticMeshes];   // List of static meshes

    int16_t AlternateRoom;
    int16_t Flags;
};