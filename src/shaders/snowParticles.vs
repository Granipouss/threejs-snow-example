uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;

uniform float cameraConstant;

const float radius = 0.02;

varying float vFog;
varying vec2 vUv;

void main() {
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;

  float distanceToCamera = distance(pos, cameraPosition);
  float distanceToBase = distance(vec3(0), cameraPosition);

  vFog = distanceToCamera - distanceToBase;
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = - radius * cameraConstant / mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}
