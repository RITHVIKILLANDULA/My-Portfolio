import * as THREE from "three";

// ---------------------------------------------------------------------------
// THE NEURAL NET — an AI/data world you fly forward through.
// Seven glowing node-layers stacked along -Z (input → hidden → output), wired
// by connections that fire data pulses. The camera flies through the layers as
// you scroll; each section activates a layer. A data-core resolves at the end.
// ---------------------------------------------------------------------------

export const PALETTE = {
  indigo: "#6366f1", // structure / weights
  indigoDeep: "#3a2fb0",
  cyan: "#22d3ee", // data / signal
  ice: "#a5f3fc",
  red: "#ff5c6c", // a single detected anomaly
  bg: "#04050c",
};

// z of each layer; one per section.
export const LAYER_Z = [0, -13, -26, -39, -52, -65, -78];
export const CORE_POS = new THREE.Vector3(0, 0, LAYER_Z[6]);

// Camera flies forward through the stack with a gentle cinematic wander.
const CAM_POINTS = [
  [0, 1.5, 16], // 0.00 — in front of the whole net
  [3.5, 2, 4],
  [-4, -1.5, -9],
  [4, 1.5, -22],
  [-3, 2, -35],
  [3.5, -1.5, -48],
  [-2, 1.2, -61],
  [0, 0.4, -72],
  [0, 0, -86], // fly through the output core, out the back
];

// Always look forward, down the spine of the network.
const LOOK_POINTS = LAYER_Z.map((z) => [0, 0, z - 6]);
LOOK_POINTS.unshift([0, 0, 4]);
LOOK_POINTS.push([0, 0, -96]);

export const camCurve = new THREE.CatmullRomCurve3(
  CAM_POINTS.map((p) => new THREE.Vector3(...p)),
  false,
  "catmullrom",
  0.5
);
export const lookCurve = new THREE.CatmullRomCurve3(
  LOOK_POINTS.map((p) => new THREE.Vector3(...p)),
  false,
  "catmullrom",
  0.5
);

// Each section owns a slice of the 0→1 fly-through + the layer it activates.
export const SECTIONS = [
  { id: "input", label: "input", start: 0.0, end: 0.12, layer: 0 },
  { id: "about", label: "about", start: 0.12, end: 0.27, layer: 1 },
  { id: "skills", label: "skills", start: 0.27, end: 0.42, layer: 2 },
  { id: "agents", label: "agents", start: 0.42, end: 0.56, layer: 3 },
  { id: "experience", label: "experience", start: 0.56, end: 0.7, layer: 4 },
  { id: "projects", label: "projects", start: 0.7, end: 0.84, layer: 5 },
  { id: "core", label: "decision core", start: 0.84, end: 1.0, layer: 6 },
];

export function sectionT(progress, start, end) {
  return THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
}

// deterministic pseudo-random (stable across reloads — no Math.random)
const rand = (i, s) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------------------
// Build the network: nodes per layer (phyllotaxis disk) + wiring + pulse edges.
// ---------------------------------------------------------------------------
export function buildNetwork() {
  const counts = [7, 16, 22, 22, 16, 9, 1]; // narrows to a single output node
  const radii = [3.2, 5.4, 6.6, 6.6, 5.4, 3.6, 0];
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));

  const layers = LAYER_Z.map((z, li) => {
    const n = counts[li];
    const R = radii[li];
    const nodes = [];
    for (let i = 0; i < n; i++) {
      if (n === 1) {
        nodes.push([0, 0, z]);
        continue;
      }
      const r = R * Math.sqrt((i + 0.5) / n);
      const a = i * GOLDEN + li * 1.3;
      nodes.push([Math.cos(a) * r, Math.sin(a) * r, z]);
    }
    return { z, nodes };
  });

  // edges: wire each node to ~3 nodes in the next layer
  const edgePts = []; // flat [x,y,z, x,y,z, ...]
  const pulseEdges = []; // [{ax,ay,az,bx,by,bz}] sampled for travelling pulses
  for (let li = 0; li < layers.length - 1; li++) {
    const a = layers[li].nodes;
    const b = layers[li + 1].nodes;
    for (let i = 0; i < a.length; i++) {
      const links = b.length === 1 ? 1 : 3;
      for (let k = 0; k < links; k++) {
        const j = Math.floor(rand(li * 50 + i * 7 + k, k + 1) * b.length) % b.length;
        edgePts.push(a[i][0], a[i][1], a[i][2], b[j][0], b[j][1], b[j][2]);
        if (rand(li + i + k, 3) > 0.55)
          pulseEdges.push({
            ax: a[i][0], ay: a[i][1], az: a[i][2],
            bx: b[j][0], by: b[j][1], bz: b[j][2],
          });
      }
    }
  }
  return { layers, edges: new Float32Array(edgePts), pulseEdges };
}

// ---------------------------------------------------------------------------
// Inner point layouts for the output Decision Core (scatter → grid → classes).
// ---------------------------------------------------------------------------
export function buildCoreLayouts(count = 950) {
  const cloud = new Float32Array(count * 3);
  const lattice = new Float32Array(count * 3);
  const classifier = new Float32Array(count * 3);
  const cls = new Float32Array(count);
  const side = Math.ceil(Math.cbrt(count));
  const R = 1.6;

  for (let i = 0; i < count; i++) {
    const r = Math.pow(rand(i, 1), 0.3333) * R;
    const theta = rand(i, 2) * Math.PI * 2;
    const phi = Math.acos(2 * rand(i, 3) - 1);
    cloud[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    cloud[i * 3 + 1] = r * Math.cos(phi);
    cloud[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side));
    const step = (2 * R) / (side - 1 || 1);
    lattice[i * 3] = -R + gx * step;
    lattice[i * 3 + 1] = -R + gy * step;
    lattice[i * 3 + 2] = -R + gz * step;

    const c = rand(i, 4) > 0.5 ? 1 : 0;
    cls[i] = c;
    classifier[i * 3] = (c ? 0.6 : -0.6) + (rand(i, 5) - 0.5) * 0.5;
    classifier[i * 3 + 1] = (rand(i, 6) - 0.5) * 1.5;
    classifier[i * 3 + 2] = (rand(i, 7) - 0.5) * 1.5;
  }
  return { count, cloud, lattice, classifier, cls };
}
