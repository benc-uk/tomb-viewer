#version 300 es
precision highp float;

// ============================================================================
// Custom Tomb Raider fragment shader
// Ben Coleman, 2023
// ============================================================================

// Inputs from vertex shader
in vec2 v_texCoord;
in float v_light;

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  vec3 emissive;
  float shininess;
  float opacity;
  float reflectivity;
  sampler2D diffuseTex;
  sampler2D specularTex;
  sampler2D normalTex;
  bool hasNormalTex;
  bool unshaded;
  float alphaCutoff;
};

uniform Material u_mat;
uniform float brightness;

// Output colour of this pixel/fragment
out vec4 outColour;

void main() {
  // So parts of textures can be transparent
  vec4 texel = texture(u_mat.diffuseTex, v_texCoord);
  if (texel.a < u_mat.alphaCutoff) {
    discard;
  }

  vec3 diffuseCol = vec3(texel) * u_mat.diffuse;
  
  // Main room geometry is shaded using the vertex light value 
  diffuseCol *= v_light;
  
  // Other meshes are unshaded using emissive property
  if (u_mat.emissive.r + u_mat.emissive.g + u_mat.emissive.b > 0.0) {
    diffuseCol = texel.rgb * u_mat.emissive;
  }

  outColour = vec4(diffuseCol.rgb, 1.0) ;
}