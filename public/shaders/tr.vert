#version 300 es
precision highp float;

// ============================================================================
// Custom Tomb Raider fragment shader
// Ben Coleman, 2023
// ============================================================================

// Input attributes from buffers
in vec4 position;
in vec3 normal;
in vec2 texcoord;
in float light;

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 u_world;
uniform mat4 u_shadowMatrix;

// Output varying's to pass to fragment shader
out vec2 v_texCoord;
out vec3 v_normal;
out vec4 v_position;
out vec4 v_shadowCoord;
out float v_light;

void main() {
  v_texCoord = texcoord;
  v_normal = (u_worldInverseTranspose * vec4(normal, 0)).xyz;
  v_position = u_world * position;
  v_shadowCoord = u_shadowMatrix * v_position;
  v_light = light;

  gl_Position = u_worldViewProjection * position;
}
