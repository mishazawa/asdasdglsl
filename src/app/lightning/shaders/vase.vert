varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vSurfaceToLight;

struct DirectionalLight {
  vec3 direction;
  vec3 color;
};

uniform DirectionalLight[1] directionalLights;

vec4 mvMat (vec3 pos) {
  return modelViewMatrix * vec4(pos, 1.0);
}

vec4 projMat (vec4 pos) {
  return projectionMatrix * pos;
}

void main() {
  vec4 mvPosition = mvMat(position.rgb);

  gl_Position =  projMat(mvPosition);

  vUv = uv;
  vNorm = normalize(normalMatrix * normal);
}
