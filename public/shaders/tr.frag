#version 300 es
precision highp float;

// ============================================================================
// Custom Tomb Raider fragment shader
// Ben Coleman, 2023
// ============================================================================

// Inputs from vertex shader
in vec3 v_normal;
in vec2 v_texCoord;
in vec4 v_position;
in vec4 v_shadowCoord;
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

// Output colour of this pixel/fragment
out vec4 outColour;

void main() {
  // So parts of textures can be transparent
  vec4 texel = texture(u_mat.diffuseTex, v_texCoord);
  if (texel.a < u_mat.alphaCutoff) {
    discard;
  }

  vec3 diffuseCol = vec3(texel) * u_mat.diffuse;
  diffuseCol *= v_light;
  
  float e = u_mat.emissive.r + u_mat.emissive.g + u_mat.emissive.b;
  if (e > 0.0) {
    diffuseCol = texel.rgb * u_mat.emissive;
  }

  outColour = vec4(diffuseCol.rgb, 1.0);
}