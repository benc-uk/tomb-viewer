virtual struct tr_mesh // (variable length)
{
  tr_vertex Centre;
  int32_t CollRadius;

  int16_t NumVertices;           // Number of vertices in this mesh
  tr_vertex Vertices[NumVertices]; // List of vertices (relative coordinates)

  int16_t NumNormals;

  if(NumNormals > 0)
    tr_vertex Normals[NumNormals];
  else
    int16_t Lights[abs(NumNormals)];

  int16_t NumTexturedRectangles; // number of textured rectangles in this mesh
  tr_face4 TexturedRectangles[NumTexturedRectangles]; // list of textured rectangles

  int16_t NumTexturedTriangles;  // number of textured triangles in this mesh
  tr_face3 TexturedTriangles[NumTexturedTriangles]; // list of textured triangles

  int16_t NumColouredRectangles; // number of coloured rectangles in this mesh
  tr_face4 ColouredRectangles[NumColouredRectangles]; // list of coloured rectangles

  int16_t NumColouredTriangles; // number of coloured triangles in this mesh
  tr_face3 ColouredTriangles[NumColouredTriangles]; // list of coloured triangles
};