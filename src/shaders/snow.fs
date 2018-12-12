#include <common>
#include <packing>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vSeenAngle;

const float smallNoiseAmount = 0.1;
const float smallNoiseScale = 20.0;

const float translucency = 0.8;

float dNoise1D (vec3 pos, vec3 dPos) {
  return (cnoise(pos + dPos) - cnoise(pos)) / length(dPos);
}

vec3 dNoise3D (vec3 pos, vec3 nPos) {
  float dPos = length(nPos);
  vec3 dPos1 = dPos * normalize(cross(nPos, vec3(1)));
  vec3 dPos2 = dPos * normalize(cross(dPos1, nPos));
  return dPos1 * dNoise1D(pos, dPos1) + dPos2 * dNoise1D(pos, dPos2);
}

vec3 simpleTranslucencyIrradiance (DirectionalLight directionalLight, vec3 normal) {
  return 0.2 * (1.0 - saturate(-dot(normal, directionalLight.direction))) * directionalLight.color;
}

vec3 translucencyIrradiance (DirectionalLight directionalLight, vec3 normal) {
  float pseudothickness = pow2(whiteCompliment(normal.z));
  float lightAlignment = whiteCompliment(-dot(vSeenAngle, directionalLight.direction));
  vec3 color = mix(vec3(0.0, 0.85, 1.0), directionalLight.color, pseudothickness);
  return 0.2 * pseudothickness * lightAlignment * color;
}

vec3 directIrridiance (DirectionalLight directionalLight, vec3 normal, sampler2D shadowMap, vec4 coord) {
  float shadowMask = 1.0;
  #ifdef USE_SHADOWMAP
  shadowMask *= getShadow(shadowMap, directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, coord);
  #endif

	return saturate(dot(normal, directionalLight.direction)) * shadowMask * directionalLight.color;
}

void main () {
  vec3 baseColor = vec3(1.0, 1.0, 1.0);
  vec3 color = vec3(0.0);

  float noise = cnoise(smallNoiseScale * vWorldPosition.xyz);

  vec3 dNoise = dNoise3D(smallNoiseScale * vWorldPosition.xyz, vNormal);
  vec3 normal = normalize(vNormal + smallNoiseAmount * dNoise);

  color += getAmbientLightIrradiance(ambientLightColor) * baseColor;

  vec3 irradiance;
  DirectionalLight directionalLight;
  #pragma unroll_loop
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
    irradiance = vec3(0);

    irradiance += translucencyIrradiance(directionalLight, normal);
    irradiance += simpleTranslucencyIrradiance(directionalLight, normal);
    irradiance += directIrridiance(directionalLight, normal, directionalShadowMap[ i ], vDirectionalShadowCoord[ i ]);

    irradiance *= (noise > 0.65) ? 1.3 : 1.0;
    color += irradiance * baseColor;
	}

  gl_FragColor = vec4(color, 1.0);
}
