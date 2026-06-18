import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { buildGraph } from "./graphData";

const COLORS = {
  hub: "#b8b4ff",
  disc: "#9d99ff",
  skill: "#7c78f0",
  hot: "#cfccff",
};
const SIZE = { hub: 0.2, disc: 0.125, skill: 0.066 };

function Node({ node, hovered, setHovered, interactive }) {
  const ref = useRef();
  const isHot = hovered === node.id;
  const target = (SIZE[node.type] || 0.08) * (isHot ? 1.5 : 1);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const s = ref.current.scale.x;
    const ns = s + (target - s) * Math.min(1, dt * 10);
    ref.current.scale.setScalar(ns);
  });

  return (
    <group position={node.pos}>
      <mesh
        ref={ref}
        onPointerOver={interactive ? (e) => { e.stopPropagation(); setHovered(node.id); document.body.style.cursor = "pointer"; } : undefined}
        onPointerOut={interactive ? () => { setHovered(null); document.body.style.cursor = ""; } : undefined}
      >
        <sphereGeometry args={[1, node.type === "skill" ? 16 : 24, node.type === "skill" ? 16 : 24]} />
        <meshBasicMaterial color={isHot ? COLORS.hot : COLORS[node.type]} toneMapped={false} />
      </mesh>

      {(node.type !== "skill" || isHot) && (
        <Html center distanceFactor={9} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div
            className={`flex -translate-y-1/2 select-none flex-col items-center whitespace-nowrap font-mono ${
              node.type === "hub" ? "gap-0.5" : ""
            }`}
            style={{ transform: `translateY(${node.type === "skill" ? "-1.4rem" : node.type === "disc" ? "-1.6rem" : "0"})` }}
          >
            <span
              className={
                node.type === "hub"
                  ? "text-[0.62rem] font-medium uppercase tracking-[0.12em] text-ink"
                  : node.type === "disc"
                  ? "rounded-md border border-brand/30 bg-canvas/80 px-2 py-0.5 text-[0.56rem] uppercase tracking-[0.1em] text-brand-500 backdrop-blur-sm"
                  : "rounded bg-canvas/85 px-1.5 py-0.5 text-[0.55rem] text-ink-700 backdrop-blur-sm"
              }
            >
              {node.label}
            </span>
            {node.type === "hub" && (
              <span className="text-[0.5rem] uppercase tracking-[0.18em] text-ink-400">{node.sub}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function KnowledgeGraph({ interactive = true }) {
  const { nodes, edges } = useMemo(() => buildGraph(), []);
  const [hovered, setHovered] = useState(null);
  const group = useRef();

  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      arr.set([a[0], a[1], a[2], b[0], b[1], b[2]], i * 6);
    });
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [edges]);

  // a slow idle drift so it feels alive even before you grab it
  useFrame((_, dt) => {
    if (group.current && !hovered) group.current.rotation.y += dt * 0.04;
  });

  return (
    <group ref={group} scale={0.82}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#6c68e8" transparent opacity={0.22} toneMapped={false} />
      </lineSegments>
      {nodes.map((n) => (
        <Node key={n.id} node={n} hovered={hovered} setHovered={setHovered} interactive={interactive} />
      ))}
    </group>
  );
}
