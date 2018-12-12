#define delta (1.0 / 60.0)

uniform vec3 wind;
uniform float gravity;
uniform float friction;

void main ()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 vel = texture2D(textureVelocity, uv).xyz;
  float mass = texture2D(textureVelocity, uv).w;

  vec3 acceleration = vec3(0);

  acceleration += gravity * vec3(0, -1, 0);
  acceleration += wind;
  acceleration += - friction * vel;

  vel += delta * acceleration;

  gl_FragColor = vec4(vel, mass);
}
