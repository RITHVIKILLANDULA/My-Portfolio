import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, Line } from "@react-three/drei";
import { PALETTE } from "../../constants/world";

const rand = (i, s) => {
  const x = Math.sin(i * 21.3 + s * 7.1) * 4571.7;
  return x - Math.floor(x);
};

// a glowing animated bar chart
function Bars({ seed = 0 }) {
  const refs = useRef([]);
  const n = 7;
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < n; i++) {
      const m = refs.current[i];
      if (!m) continue;
      const h = 0.4 + (Math.sin(t * 1.6 + i * 0.7 + seed) * 0.5 + 0.5) * 1.6;
      m.scale.y = h;
      m.position.y = h / 2;
    }
  });
  return (
    <group>
      {new Array(n).fill(0).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={[(i - n / 2) * 0.34, 0.5, 0]}
        >
          <boxGeometry args={[0.22, 1, 0.22]} />
          <meshStandardMaterial
            color={PALETTE.cyan}
            emissive={PALETTE.cyan}
            emissiveIntensity={0.9}
            toneMapped={false}
          />
        </mesh>
      ))}
      <Line
        points={[
          [-1.4, 0, 0],
          [1.4, 0, 0],
        ]}
        color={PALETTE.indigo}
        lineWidth={1}
        transparent
        opacity={0.5}
      />
    </group>
  );
}

// a glowing 3D scatter cluster
function Scatter({ seed = 0 }) {
  const pts = useMemo(
    () =>
      new Array(46)
        .fill(0)
        .map((_, i) => [
          (rand(i + seed, 1) - 0.5) * 2.4,
          (rand(i + seed, 2) - 0.5) * 2.4,
          (rand(i + seed, 3) - 0.5) * 1.4,
        ]),
    [seed]
  );
  const g = useRef();
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.15;
  });
  return (
    <group ref={g}>
      <Instances limit={pts.length} range={pts.length}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={PALETTE.ice}
          emissive={PALETTE.cyan}
          emissiveIntensity={1.1}
          toneMapped={false}
        />
        {pts.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>
    </group>
  );
}

// a glowing line graph
function LineGraph({ seed = 0 }) {
  const points = useMemo(() => {
    const out = [];
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * 3 - 1.5;
      const y =
        Math.sin(i * 0.5 + seed) * 0.4 + (rand(i + seed, 4) - 0.5) * 0.3;
      out.push([x, y, 0]);
    }
    return out;
  }, [seed]);
  return (
    <group>
      <Line points={points} color={PALETTE.cyan} lineWidth={2} toneMapped={false} />
      <Line
        points={[
          [-1.6, -0.9, 0],
          [-1.6, 0.9, 0],
        ]}
        color={PALETTE.indigo}
        lineWidth={1}
        transparent
        opacity={0.4}
      />
    </group>
  );
}

function Widget({ position, rotation, scale = 1, children }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current)
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.25;
  });
  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      {children}
    </group>
  );
}

// scattered through the network so data viz drifts by as you fly
export default function DataViz() {
  return (
    <>
      <Widget position={[8.5, 2, -8]} rotation={[0, -0.5, 0.1]} scale={1.1}>
        <Bars seed={1} />
      </Widget>
      <Widget position={[-9, -2, -20]} rotation={[0, 0.5, -0.1]}>
        <Scatter seed={2} />
      </Widget>
      <Widget position={[9.5, 3, -33]} rotation={[0, -0.6, 0]}>
        <LineGraph seed={3} />
      </Widget>
      <Widget position={[-9.5, 2.5, -46]} rotation={[0, 0.6, 0.1]} scale={1.1}>
        <Bars seed={4} />
      </Widget>
      <Widget position={[9, -2.5, -59]} rotation={[0, -0.5, 0]}>
        <Scatter seed={5} />
      </Widget>
      <Widget position={[-8, 3, -70]} rotation={[0, 0.6, 0]}>
        <LineGraph seed={6} />
      </Widget>
    </>
  );
}
