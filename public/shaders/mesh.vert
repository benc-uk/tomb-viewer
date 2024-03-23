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

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform mat4 u_world;

// Output varying's to pass to fragment shader
out vec2 v_texCoord;
out vec3 v_light;

struct Material {
  vec3 ambient;
  vec3 diffuse;
  vec3 specular;
  vec3 emissive;
  sampler2D diffuseTex;
};

uniform Material u_mat;

struct Light {
  vec3 pos;
  vec3 intensity; // Is a RGB tuple for coloured lights
  float maxDist;
};

uniform Light u_lights[MAX_LIGHTS];
uniform int u_numLights;

void main() {
  v_texCoord = texcoord;
  v_light = u_mat.ambient;

  vec3 N = normalize((u_worldInverseTranspose * vec4(normal, 0)).xyz);
  vec4 worldpos = u_world * position;

  // Basic distance lambert shading not attenuated
  for(int i = 0; i < u_numLights; i++) {
    vec3 L = normalize(u_lights[i].pos - worldpos.xyz);
    float lambertTerm = dot(N, L);
    lambertTerm = max(lambertTerm, 0.0);
    v_light += lambertTerm * (u_lights[i].intensity / float(u_numLights));
  }

  v_light = clamp(v_light, 0.0, 1.0);

  gl_Position = u_worldViewProjection * position;
}
