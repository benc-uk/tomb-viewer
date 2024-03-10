#version 300 es
precision highp float;

const int MAX_LIGHTS = 24;

// ============================================================================
// Custom Tomb Raider fragment shader
// Ben Coleman, 2023
// ============================================================================

// Input attributes from buffers
in vec4 position;
in vec2 texcoord;
in float light;

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;

// Output varying's to pass to fragment shader
out vec2 v_texCoord;
out float v_light;

void main() {
  v_texCoord = texcoord;
  v_light = light;

  gl_Position = u_worldViewProjection * position;
}
