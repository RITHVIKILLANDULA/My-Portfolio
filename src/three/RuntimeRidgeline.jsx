import { useMemo, useRef } from "react";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RUNTIME_SERIES } from "../constants";

const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const clamp = THREE.MathUtils.clamp;

const W = 6.6;
const D = 2.0;
const NX = 95;
const NY = 6;
const COLS = NX + 1; // 96
const ROWS = NY + 1; // 7

// resample the 14 real runtime points to 96 columns — the surface IS the data
function resample(arr, n) {
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (arr.length - 1);
    const a = Math.floor(t);
    const b = Math.min(arr.length - 1, a + 1);
    out[i] = arr[a] * (1 - (t - a)) + arr[b] * (t - a);
  }
  return out;
}
const smooth = (a) =>
  a.map((v, i) => (a[Math.max(0, i - 1)] + v + a[Math.min(a.length - 1, i + 1)]) / 3);

const RidgelineMaterial = shaderMaterial(
  { uMorph: 0, uLightDir: new THREE.Vector3(0.3, 0.7, 0.65) },
  /* glsl */ `
    attribute float aHeightOld;
    attribute float aHeightNew;
    attribute vec3 aNormalOld;
    attribute vec3 aNormalNew;
    uniform float uMorph;
    varying vec3 vNormal;
    varying float vH;
    varying float vX;
    void main(){
      float h = mix(aHeightOld, aHeightNew, uMorph);
      vec3 transformed = position;
      transformed.z += h;
      vec3 nrm = normalize(mix(aNormalOld, aNormalNew, uMorph));
      vNormal = normalize(normalMatrix * nrm);
      vH = h;
      vX = position.x;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
  `,
  /* glsl */ `
    precision highp float;
    uniform float uMorph;
    uniform vec3 uLightDir;
    varying vec3 vNormal;
    varying float vH;
    varying float vX;
    const vec3 DEEP   = vec3(0.255, 0.243, 0.560);
    const vec3 BRAND  = vec3(0.486, 0.471, 0.941);
    const vec3 BRIGHT = vec3(0.690, 0.670, 1.000);
    void main(){
      float light = clamp(dot(normalize(vNormal), normalize(uLightDir)), 0.0, 1.0);
      float shade = 0.42 + 0.58 * light;            // strong ambient floor — always reads indigo
      vec3 col = mix(DEEP, BRIGHT, shade);
      col += BRIGHT * smoothstep(0.55, 1.7, vH) * 0.22;   // peaks glow brighter
      // hairline isolines along height — the "data" gridline read
      float iso = smoothstep(0.88, 0.99, fract(vH * 7.0));
      col = mix(col, BRIGHT, iso * 0.25);
      // playhead band sweeps left->right as the run resolves
      float headX = mix(-3.3, 3.3, uMorph);
      float head = smoothstep(0.28, 0.0, abs(vX - headX));
      col += BRIGHT * head * 0.4;
      gl_FragColor = vec4(col, 1.0);
    }
  `
);
extend({ RidgelineMaterial });

export default function RuntimeRidgeline({ progress, forced }) {
  const mat = useRef();
  const cur = useRef(0);
  const { invalidate } = useThree();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(W, D, NX, NY);
    // 14 distinct peaks — one per nightly run — heights = real runtimes, so the
    // range visibly shrinks left (120m) -> right (35m).
    const S = RUNTIME_SERIES;
    const H = (v) => 0.1 + (v / 121) * 1.95;
    const oldFront = new Array(COLS);
    for (let i = 0; i < COLS; i++) {
      const t = (i / (COLS - 1)) * S.length; // 0..14
      const pk = Math.min(S.length - 1, Math.floor(t));
      const frac = t - pk; // within-peak 0..1
      const bell = Math.pow(Math.sin(Math.PI * frac), 1.4); // distinct peaks, valleys ~0
      oldFront[i] = 0.06 + H(S[pk]) * bell;
    }
    const newFront = oldFront.map((v) => 0.06 + (v - 0.06) * 0.3); // compress ~30% (-71%)

    const hOld = new Float32Array(COLS * ROWS);
    const hNew = new Float32Array(COLS * ROWS);
    for (let j = 0; j < ROWS; j++) {
      const frontF = j / (ROWS - 1); // 0 back -> 1 front
      const depth = 0.5 + 0.5 * frontF; // back tributaries lower, converging to front
      for (let i = 0; i < COLS; i++) {
        const idx = j * COLS + i;
        hOld[idx] = oldFront[i] * depth;
        hNew[idx] = newFront[i] * depth;
      }
    }

    const normals = (Hf) => {
      const N = new Float32Array(COLS * ROWS * 3);
      const dx = W / NX;
      const dy = D / NY;
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS; i++) {
          const idx = j * COLS + i;
          const hl = Hf[j * COLS + Math.max(0, i - 1)];
          const hr = Hf[j * COLS + Math.min(COLS - 1, i + 1)];
          const hd = Hf[Math.max(0, j - 1) * COLS + i];
          const hu = Hf[Math.min(ROWS - 1, j + 1) * COLS + i];
          let nx = -(hr - hl) / (2 * dx);
          let ny = -(hu - hd) / (2 * dy);
          let nz = 1;
          const l = Math.hypot(nx, ny, nz) || 1;
          N[idx * 3] = nx / l;
          N[idx * 3 + 1] = ny / l;
          N[idx * 3 + 2] = nz / l;
        }
      }
      return N;
    };

    geo.setAttribute("aHeightOld", new THREE.BufferAttribute(hOld, 1));
    geo.setAttribute("aHeightNew", new THREE.BufferAttribute(hNew, 1));
    geo.setAttribute("aNormalOld", new THREE.BufferAttribute(normals(hOld), 3));
    geo.setAttribute("aNormalNew", new THREE.BufferAttribute(normals(hNew), 3));
    return geo;
  }, []);

  useFrame((_, dt) => {
    const m = mat.current;
    if (!m) return;
    const d = Math.min(dt, 0.05);
    const target = forced != null ? forced : clamp(progress?.get?.() ?? 0, 0, 1);
    cur.current = damp(cur.current, target, 6, d);
    m.uMorph = cur.current;
  });

  return (
    <group rotation={[-Math.PI * 0.5, 0, 0]}>
      <mesh geometry={geometry}>
        <ridgelineMaterial ref={mat} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
