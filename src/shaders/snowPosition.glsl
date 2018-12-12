#define delta (1.0 / 60.0)

uniform float volumeRadius;
uniform float volumeHeight;

void main () {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;

  pos.y = mod(pos.y, volumeHeight);

  vec2 rPos = pos.xz;
  float rDist = length(rPos);
  if (rDist > volumeRadius) {
    pos.xz *= - volumeRadius / rDist;
  }

  // Dynamics
  pos += vel * delta;
  gl_FragColor = vec4(pos, 1.0);
}
