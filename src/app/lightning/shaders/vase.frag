varying vec2 vUv;
varying vec3 vNorm;


struct DirectionalLight {
  vec3 direction;
  vec3 color;
};


// uniform sampler2D img;
uniform sampler2D color;
uniform vec3 timeBasedColor;
uniform vec3 ambientLightColor;
uniform DirectionalLight[1] directionalLights;

vec3 applyAmbientLight(vec3 c) {
  return c * ambientLightColor * AMBIENT_INTENSITY;
}

vec3 applyDirectionalLight (vec3 c, DirectionalLight dl) {
  float diffuseFactor = clamp(dot(vNorm, dl.direction), 0., 10.);
  return c * dl.color * diffuseFactor;
}

void main() {
  // gl_FragColor = texture2D(color, vUv);


  vec3 color = timeBasedColor;

  // color =
  color = applyDirectionalLight(color, directionalLights[0]) + applyAmbientLight(color);

  gl_FragColor = vec4(color, 1.);
}
