#include <common>

uniform sampler2D texturePosition;

varying float vFog;
varying vec2 vUv;

const vec3 colorFog = vec3(0.2, 0.7, 0.8);
const float baseOpacity = 0.8;

void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if (f > 0.5) discard;

  vec3 pos = texture2D(texturePosition, vUv).xyz;

  float mask = whiteCompliment((pos.y - 10.0) * 0.5) * saturate(1.0 - length(pos.xz) * 0.15);
  float fog = saturate(dot(pos.xz, normalize(cameraPosition.xz)) * 0.33 + 1.0);
  vec3 color = mix(colorFog, vec3(1), fog);
  gl_FragColor = vec4(color, baseOpacity * mask);
}
