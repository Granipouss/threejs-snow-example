varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying vec3 vSeenAngle;

const float largeNoiseScale = 1.0;
const float largeNoiseAmount = 0.0;

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>

	vNormal = normalize( transformedNormal );

	#include <begin_vertex>

  float displacement = largeNoiseAmount * cnoise(largeNoiseScale * position.xyz);
  transformed += normalize(objectNormal) * displacement;

  #include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>

  vWorldPosition = worldPosition.xyz;

  vSeenAngle = normalize(transformed + cameraPosition);

}
