import { EXPERTISE, HERO_NAME } from "../constants";

// Four disciplines spread on a tetrahedron so the graph reads as a real 3D
// structure from any angle; skills ring each discipline facing outward. All
// positions are precomputed + deterministic (no live physics = no jitter).
const DISC_DIRS = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];

const norm = (v) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];

export function buildGraph() {
  const nodes = [];
  const edges = [];

  const hub = { id: "hub", label: HERO_NAME, sub: "Data · AI · Software", type: "hub", pos: [0, 0, 0] };
  nodes.push(hub);

  const DR = 2.7; // discipline radius
  const SR = 1.5; // skill ring radius

  EXPERTISE.slice(0, 4).forEach((disc, i) => {
    const dir = norm(DISC_DIRS[i]);
    const dpos = mul(dir, DR);
    const dId = `disc-${i}`;
    nodes.push({ id: dId, label: disc.title, type: "disc", pos: dpos });
    edges.push([hub.pos, dpos]);

    const up = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    const t1 = norm(cross(dir, up));
    const t2 = norm(cross(dir, t1));
    const skills = disc.stack.slice(0, 5);

    skills.forEach((s, j) => {
      const ang = (j / skills.length) * Math.PI * 2 + i * 0.7;
      const off = add(
        add(mul(t1, Math.cos(ang) * SR), mul(t2, Math.sin(ang) * SR)),
        mul(dir, 0.55)
      );
      const spos = add(dpos, off);
      nodes.push({ id: `${dId}-s${j}`, label: s, type: "skill", pos: spos, disc: dId });
      edges.push([dpos, spos]);
    });
  });

  return { nodes, edges };
}
