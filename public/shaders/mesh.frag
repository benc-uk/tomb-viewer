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
  sampler2D diffuseTex;
};

uniform Material u_mat;

// Output colour of this pixel/fragment
out vec4 outColour;

void main() {
  vec4 texel = texture(u_mat.diffuseTex, v_texCoord);
  
  if (texel.a < 0.4) {
    discard;
  }

  vec3 diffuseCol = vec3(texel) * v_light;
  
  outColour = vec4(diffuseCol.rgb, 1.0) ;
}