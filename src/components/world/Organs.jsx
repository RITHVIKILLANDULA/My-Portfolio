import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { ORGANS, PALETTE, SECTIONS, sectionT } from "../../constants/world";
import { readProgress } from "../../state/scroll";

const indigoMat = {
  color: PALETTE.indigo,
  emissive: PALETTE.indigo,
  emissiveIntensity: 1.3,
  roughness: 0.35,
  metalness: 0.7,
  toneMapped: false,
};

// scale a group in as its section becomes active
function useReveal(start, end) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    const p = readProgress();
    const active = p > start - 0.1 && p < end + 0.08;
    const target = active ? 1 : 0.0001;
    ref.current.scale.x += (target - ref.current.scale.x) * Math.min(1, dt * 3);
    ref.current.scale.y = ref.current.scale.z = ref.current.scale.x;
    ref.current.visible = ref.current.scale.x > 0.02;
  });
  return ref;
}

function Funnel() {
  const ref = useReveal(0.12, 0.27);
  return (
    <group ref={ref} position={ORGANS.ingestion}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.4, 2.6, 5, 1, true]} />
        <meshStandardMaterial {...indigoMat} side={THREE.DoubleSide} wireframe />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[2.4, 0.04, 8, 5]} />
        <meshStandardMaterial {...indigoMat} />
      </mesh>
    </group>
  );
}

function Loom() {
  const ref = useReveal(0.27, 0.42);
  const rails = [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5];
  return (
    <group ref={ref} position={ORGANS.loom}>
      {rails.map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[6, 0.05, 0.05]} />
          <meshStandardMaterial {...indigoMat} />
        </mesh>
      ))}
    </group>
  );
}

function Pipeline() {
  const ref = useReveal(0.42, 0.56);
  const nodes = [-3, -1, 1, 3];
  return (
    <group ref={ref} position={ORGANS.pipeline}>
      <mesh>
        <boxGeometry args={[6, 0.03, 0.03]} />
        <meshStandardMaterial {...indigoMat} />
      </mesh>
      {nodes.map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <icosahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial {...indigoMat} />
        </mesh>
      ))}
    </group>
  );
}

function Warehouse() {
  const ref = useReveal(0.56, 0.7);
  const matRef = useRef();
  const cells = useMemo(() => {
    const out = [];
    const cols = 14;
    const rows = 6;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        out.push([(c - cols / 2) * 0.5, (r - rows / 2) * 0.5, 0]);
    return out;
  }, []);
  useFrame((state) => {
    if (!matRef.current) return;
    // scan-line shimmer across the slab
    const t = state.clock.elapsedTime;
    matRef.current.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.4;
  });
  return (
    <group ref={ref} position={ORGANS.warehouse}>
      <Instances limit={cells.length} range={cells.length}>
        <boxGeometry args={[0.4, 0.4, 0.12]} />
        <meshStandardMaterial
          ref={matRef}
          color={PALETTE.indigoDeep}
          emissive={PALETTE.indigo}
          emissiveIntensity={1}
          roughness={0.4}
          metalness={0.6}
          toneMapped={false}
        />
        {cells.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

function Lattice() {
  const ref = useReveal(0.7, 0.86);
  const nodes = useMemo(() => {
    const rand = (i, s) => {
      const x = Math.sin(i * 33.7 + s * 9.1) * 4375.5;
      return x - Math.floor(x);
    };
    return new Array(14)
      .fill(0)
      .map((_, i) => [
        (rand(i, 1) - 0.5) * 4,
        (rand(i, 2) - 0.5) * 3,
        (rand(i, 3) - 0.5) * 3,
      ]);
  }, []);
  const anomaly = useRef();
  useFrame((state) => {
    if (anomaly.current)
      anomaly.current.emissiveIntensity =
        1.5 + Math.sin(state.clock.elapsedTime * 5) * 1;
  });
  return (
    <group ref={ref} position={ORGANS.lattice}>
      <Instances limit={nodes.length} range={nodes.length}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial {...indigoMat} />
        {nodes.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
      {/* the single quarantined anomaly */}
      <mesh position={[1.8, 1.2, 0.4]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          ref={anomaly}
          color={PALETTE.red}
          emissive={PALETTE.red}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Organs() {
  return (
    <>
      <Funnel />
      <Loom />
      <Pipeline />
      <Warehouse />
      <Lattice />
    </>
  );
}
