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

  // Basic lambert shading with attenuation
  for(int i = 0; i < u_numLights; i++) {
    Light light = u_lights[i];
    vec3 L = normalize(light.pos - worldpos.xyz);
    float diffuse = dot(N, L);
    diffuse = max(diffuse, 0.0);
    
    float dist = length(light.pos - worldpos.xyz);
    
    if (dist > light.maxDist) {
      diffuse = 0.0;
    }

    v_light += diffuse * light.intensity;
  }

  if(u_mat.emissive.x > 0.0) {
    v_light = u_mat.emissive;
  }

  gl_Position = u_worldViewProjection * position;
}
