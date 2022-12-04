varying vec2 vUv;

// uniform sampler2D img;
uniform sampler2D color;

void main() {
  gl_FragColor = texture2D(color, vUv);
  // gl_FragColor = vec4(1., 1., 1., 1.);
}
