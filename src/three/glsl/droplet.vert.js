// Vertex displacement for the Distillation Field droplet. Divergence-free curl
// flow (a current under the skin, never per-vertex "popcorn"), a slow breath,
// cursor swell, live-demo agitation, and a one-shot RAG ripple. uResolve drives
// chaos (1) -> calm (0) across scroll. Normals are perturbed via two extra noise
// taps so lighting/fresnel track the deformation (liquid metal, not plastic).
// Prepend SNOISE + CURL before this string.
export const DROPLET_VERT = /* glsl */ `
uniform float uTime;
uniform float uResolve;
uniform float uAmp;
uniform float uFreq;
uniform float uFlowSpeed;
uniform vec3  uMouseDir;
uniform float uMouseStrength;
uniform float uChurn;
uniform float uPulse;
uniform float uPulseT;

varying vec3 vNormalW;
varying vec3 vViewDir;
varying float vDisp;

float fieldDisp(vec3 pos, vec3 nrm){
  float t = uTime * uFlowSpeed;
  vec3 flow = curl(pos * uFreq + t) * 0.5
            + curl(pos * uFreq * 2.1 + vec3(t * 1.4)) * 0.25
            + curl(pos * uFreq * 4.3 + vec3(t * 1.9)) * 0.125;
  float d = dot(flow, nrm);
  float m = smoothstep(0.6, 0.0, distance(pos, uMouseDir)) * uMouseStrength;
  float churn = uChurn * 0.04 * snoise(pos * 3.0 + vec3(t * 2.0));
  float pulse = uPulse * 0.12 * sin(12.0 * pos.y - uPulseT * 9.0);
  return d * uAmp * uResolve + m * 0.18 + churn + pulse;
}

void main(){
  vec3 n = normalize(normal);
  float disp = fieldDisp(position, n);

  vec3 displaced = position + n * disp;
  displaced *= 1.0 + 0.03 * sin(uTime * 1.05);

  // perturbed normal: two tangent taps of the displacement field
  vec3 ref = abs(n.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(n, ref));
  vec3 bitangent = normalize(cross(n, tangent));
  float eps = 0.06;
  float da = fieldDisp(position + tangent * eps, n);
  float db = fieldDisp(position + bitangent * eps, n);
  vec3 pc = position + n * disp;
  vec3 pa = (position + tangent * eps) + n * da;
  vec3 pb = (position + bitangent * eps) + n * db;
  vec3 perturbed = normalize(cross(pa - pc, pb - pc));
  if (dot(perturbed, n) < 0.0) perturbed = -perturbed;

  vNormalW = normalize(mat3(modelMatrix) * perturbed);
  vec3 worldPos = (modelMatrix * vec4(displaced, 1.0)).xyz;
  vViewDir = normalize(cameraPosition - worldPos);
  vDisp = disp;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
`;
