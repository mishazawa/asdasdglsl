attribute int ptnum;

uniform int width;

uniform sampler2D color;
uniform sampler2D P;

varying vec2 vUv;

vec4 mvMat (vec3 pos) {
  return modelViewMatrix * vec4(pos, 1.0);
}

vec4 projMat (vec4 pos) {
  return projectionMatrix * pos;
}

void main() {
  int idx = ptnum;
  int yi = idx / int(width);
  int xi = idx - yi*int(width);
  float u = (float(xi)+0.5)/float(width);
  float v = (float(yi)+0.5);
  vec2 uvt = vec2(u, v);

  vec4 pixel = texture2D(P, uvt);

  vec4 mvPosition = mvMat(pixel.rgb);

  gl_Position =  projMat(mvPosition);
  gl_PointSize = 10.0 / -mvPosition.z;

  vUv = uvt;
}
