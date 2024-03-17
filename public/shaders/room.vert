#version 300 es
precision highp float;

const int MAX_LIGHTS = 8;

// ============================================================================
// Custom Tomb Raider fragment shader
// Ben Coleman, 2023
// ============================================================================

// Input attributes from buffers
in vec4 position;
in vec2 texcoord;
in vec3 normal;
in float light;  // Per vertex light value

uniform mat4 u_worldViewProjection;
uniform mat4 u_world;
uniform float u_time;
uniform bool u_water;

// Output varying's to pass to fragment shader
out vec2 v_texCoord;
out float v_light;

void main() {
  vec4 worldpos = u_world * position;
  v_texCoord = texcoord;
  v_light = light;

  // Create fake water caustics effect, modulate with time the vertex light
  if(u_water) {
    float wave = sin((position.x + position.z * 0.6 + position.y * 0.2) * 8.8 + u_time * 2.0);
    v_light = v_light * (0.8 + wave) + 0.2;
  }

  gl_Position = u_worldViewProjection * position;
}
