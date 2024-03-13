#version 300 es
precision highp float;

const int MAX_LIGHTS = 6;

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
out float v_light;

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
  float intensity;
  float maxDist;
};

uniform Light u_lights[MAX_LIGHTS];
uniform int u_numLights;

void main() {
  v_texCoord = texcoord;
  v_light = u_mat.ambient.r;

  vec3 N = normalize((u_worldInverseTranspose * vec4(normal, 0)).xyz);
  vec4 vertposition = u_world * position;

  // Basic distance lambert shading not attenuated
  for(int i = 0; i < u_numLights; i++) {
    vec3 L = normalize(u_lights[i].pos - vertposition.xyz);
    float lambertTerm = dot(N, L);
    lambertTerm = max(lambertTerm, 0.0);
    v_light += lambertTerm * ((u_lights[i].intensity) / float(u_numLights));
  }

  gl_Position = u_worldViewProjection * position;
}
