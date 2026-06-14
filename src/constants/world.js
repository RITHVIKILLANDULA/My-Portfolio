import * as THREE from "three";

// ---------------------------------------------------------------------------
// THE DEEP STACK — geometry of the descent
// One vertical shaft from the surface (y≈2) down to the Decision Core (y≈-58).
// The camera and the robot companion both ride splines built from these points.
// ---------------------------------------------------------------------------

export const PALETTE = {
  indigo: "#5b6cff", // structure / order
  indigoDeep: "#3a2fb0",
  amber: "#ffb257", // raw data in motion
  red: "#ff5c5c", // the single anomaly
  bg: "#05060d",
  graphite: "#11131f",
};

export const CORE_POS = new THREE.Vector3(0, -58, 0);

// Camera waypoints down the shaft (one gentle horizontal "catwalk" breather at Skills).
const CAM_POINTS = [
  [0, 3, 9], // 0.00 surface — hang at the mouth, look down
  [0.6, -5, 7.5], // ingestion
  [5.5, -15, 7], // skills — drift sideways along a catwalk
  [-4, -25, 7], // agents
  [0, -35, 11], // experience — pull back wide
  [3.6, -44, 7.5], // projects — spiral in
  [1.2, -50, 8.5], // arrival — core comes into frame
  [0, -54, 7], // hold — core framed as a crystal
  [0, -59.5, -3.5], // fly THROUGH the core, out the bottom
];

const LOOK_POINTS = [
  [0, -3, 2],
  [0, -9, 0],
  [0, -17, 0],
  [0, -27, 0],
  [0, -38, 0],
  [0, -48, 0],
  [0, -58, 0], // lock onto the core
  [0, -58, 0],
  [0, -61, -2],
];

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

// Robot rides the same descent a fixed half-beat ahead-and-below the camera,
// pulled toward the shaft centre so it's framed climbing down, looking back up.
const ROBOT_POINTS = CAM_POINTS.slice(0, 8).map(([x, y, z]) => [
  x * 0.55 - 1.1,
  y - 3.0,
  z - 3.4,
]);
export const robotCurve = new THREE.CatmullRomCurve3(
  ROBOT_POINTS.map((p) => new THREE.Vector3(...p)),
  false,
  "catmullrom",
  0.5
);

// Each section owns a [start,end] slice of the 0→1 descent.
export const SECTIONS = [
  { id: "surface", label: "Surface", start: 0.0, end: 0.12, y: 0 },
  { id: "ingestion", label: "Ingestion", start: 0.12, end: 0.27, y: -10 },
  { id: "loom", label: "Transformation", start: 0.27, end: 0.42, y: -19 },
  { id: "pipeline", label: "Agents", start: 0.42, end: 0.56, y: -29 },
  { id: "warehouse", label: "Warehouse", start: 0.56, end: 0.7, y: -39 },
  { id: "lattice", label: "Models", start: 0.7, end: 0.84, y: -49 },
  { id: "core", label: "Decision Core", start: 0.84, end: 1.0, y: -58 },
];

// Organ anchor positions down the shaft (where strata geometry + labels sit).
export const ORGANS = {
  ingestion: new THREE.Vector3(0, -10, 0),
  loom: new THREE.Vector3(4.5, -19, 0),
  pipeline: new THREE.Vector3(-3, -29, 0),
  warehouse: new THREE.Vector3(0, -39, 0),
  lattice: new THREE.Vector3(2.5, -49, 0),
};

// smooth 0→1 ramp inside a section window
export function sectionT(progress, start, end) {
  return THREE.MathUtils.clamp((progress - start) / (end - start), 0, 1);
}

// ---------------------------------------------------------------------------
// Three pre-baked point layouts for the Decision Core's inner field.
// cloud (gaussian scatter) → lattice (sorted grid) → classifier (two classes).
// ---------------------------------------------------------------------------
export function buildCoreLayouts(count = 1600) {
  const cloud = new Float32Array(count * 3);
  const lattice = new Float32Array(count * 3);
  const classifier = new Float32Array(count * 3);
  const cls = new Float32Array(count); // 0/1 class for colour

  const side = Math.ceil(Math.cbrt(count));
  const R = 1.6;
  // deterministic pseudo-random (no Math.random — stable across reloads)
  const rand = (i, s) => {
    const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    // uniform-volume scatter (even density, no hot centre)
    const r = Math.pow(rand(i, 1), 0.3333) * R;
    const theta = rand(i, 2) * Math.PI * 2;
    const phi = Math.acos(2 * rand(i, 3) - 1);
    cloud[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    cloud[i * 3 + 1] = r * Math.cos(phi);
    cloud[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    // sorted lattice grid
    const gx = i % side;
    const gy = Math.floor(i / side) % side;
    const gz = Math.floor(i / (side * side));
    const step = (2 * R) / (side - 1 || 1);
    lattice[i * 3] = -R + gx * step;
    lattice[i * 3 + 1] = -R + gy * step;
    lattice[i * 3 + 2] = -R + gz * step;

    // classifier: two clusters separated across X by a margin plane
    const c = rand(i, 4) > 0.5 ? 1 : 0;
    cls[i] = c;
    const cx = c ? 0.55 : -0.55;
    const sr = 0.42;
    classifier[i * 3] =
      cx + (rand(i, 5) - 0.5) * sr + (c ? 0.18 : -0.18);
    classifier[i * 3 + 1] = (rand(i, 6) - 0.5) * 1.4;
    classifier[i * 3 + 2] = (rand(i, 7) - 0.5) * 1.4;
  }
  return { count, cloud, lattice, classifier, cls };
}
