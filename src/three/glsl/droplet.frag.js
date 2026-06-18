// Indigo-only faux-PBR for the droplet. A dark base with crests catching indigo,
// a bright fresnel rim tracing the silhouette, and faux-iridescence faked purely
// via LIGHTNESS (hue stays indigo) so the strict one-accent rule holds. uFacet
// quantizes the surface into crystalline facets for the "what I build" beat.
export const DROPLET_FRAG = /* glsl */ `
precision highp float;

uniform float uFacet;
uniform float uOpacity;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vDisp;

const vec3 DEEP   = vec3(0.424, 0.408, 0.910); // #6c68e8
const vec3 BRAND  = vec3(0.486, 0.471, 0.941); // #7c78f0
const vec3 BRIGHT = vec3(0.616, 0.600, 1.000); // #9d99ff
const vec3 VOIDC  = vec3(0.043, 0.047, 0.086); // near #08090e

void main(){
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(vViewDir);

  vec3 base = mix(VOIDC, DEEP, smoothstep(-0.12, 0.26, vDisp));
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.5);
  vec3 rim = fres * BRIGHT;
  vec3 irid = mix(BRAND, BRIGHT, fres) * 0.4;

  vec3 color = base + rim + irid * smoothstep(0.2, 0.9, fres);

  // crystalline facet quantize (eased in during the build beat)
  color = mix(color, floor(color * 7.0) / 7.0, uFacet);

  gl_FragColor = vec4(color, uOpacity);
}
`;
