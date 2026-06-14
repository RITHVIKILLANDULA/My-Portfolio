import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { buildNetwork, PALETTE, SECTIONS } from "../../constants/world";
import { readProgress } from "../../state/scroll";

function activation(p, sec) {
  if (!sec) return 0;
  const mid = (sec.start + sec.end) / 2;
  const half = (sec.end - sec.start) / 2 + 0.06;
  return Math.max(0, Math.min(1, 1 - Math.abs(p - mid) / half));
}

function Layer({ nodes, section }) {
  const matRef = useRef();
  const t = useRef(0);
  useFrame((state) => {
    if (!matRef.current) return;
    const act = activation(readProgress(), section);
    const idle = 0.45 + 0.2 * Math.sin(state.clock.elapsedTime * 1.5 + (section?.layer || 0));
    matRef.current.emissiveIntensity = idle + act * 3.2;
  });
  return (
    <Instances limit={nodes.length} range={nodes.length}>
      <icosahedronGeometry args={[0.17, 1]} />
      <meshStandardMaterial
        ref={matRef}
        color="#aab4ff"
        emissive={PALETTE.indigo}
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.5}
        toneMapped={false}
      />
      {nodes.map((p, i) => (
        <Instance key={i} position={p} />
      ))}
    </Instances>
  );
}

export default function NeuralNet() {
  const { layers, edges, pulseEdges } = useMemo(() => buildNetwork(), []);

  const edgeGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(edges, 3));
    return g;
  }, [edges]);

  // travelling data pulses along a subset of edges
  const pulse = useMemo(() => {
    const n = pulseEdges.length;
    const pos = new Float32Array(n * 3);
    const off = new Float32Array(n);
    const spd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      off[i] = (Math.sin(i * 9.7) * 0.5 + 0.5);
      spd[i] = 0.18 + (Math.sin(i * 4.1) * 0.5 + 0.5) * 0.22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geom: g, pos, off, spd, n };
  }, [pulseEdges]);

  const edgeMat = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const { pos, off, spd, n } = pulse;
    for (let i = 0; i < n; i++) {
      const e = pulseEdges[i];
      let f = (time * spd[i] + off[i]) % 1;
      pos[i * 3] = e.ax + (e.bx - e.ax) * f;
      pos[i * 3 + 1] = e.ay + (e.by - e.ay) * f;
      pos[i * 3 + 2] = e.az + (e.bz - e.az) * f;
    }
    pulse.geom.attributes.position.needsUpdate = true;
    if (edgeMat.current)
      edgeMat.current.opacity = 0.1 + 0.05 * Math.sin(time * 2);
  });

  return (
    <group>
      {/* connections */}
      <lineSegments geometry={edgeGeom}>
        <lineBasicMaterial
          ref={edgeMat}
          color={PALETTE.indigo}
          transparent
          opacity={0.12}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* nodes per layer */}
      {layers.map((layer, i) => (
        <Layer key={i} nodes={layer.nodes} section={SECTIONS[i]} />
      ))}

      {/* travelling data pulses (signal / data flowing) */}
      <points geometry={pulse.geom}>
        <pointsMaterial
          color={PALETTE.cyan}
          size={0.18}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
