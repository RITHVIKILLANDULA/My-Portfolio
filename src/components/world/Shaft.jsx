import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { PALETTE } from "../../constants/world";

const TOP = 4;
const BOTTOM = -56;

/**
 * The shaft: structural gantry rings stacked the length of the descent + six
 * vertical light-rails. Gives the world a body and depth so falling reads as
 * falling, not a pan through a void. All instanced — a handful of draw calls.
 */
export default function Shaft() {
  const rings = useMemo(() => {
    const out = [];
    for (let y = TOP; y >= BOTTOM; y -= 2.1) {
      const depth = (TOP - y) / (TOP - BOTTOM); // 0..1
      out.push({
        y,
        rot: depth * Math.PI * 1.2, // slow helix twist
        scale: 1 - depth * 0.18,
        bright: y > -2 ? 1 : 0.55,
      });
    }
    return out;
  }, []);

  const railRef = useRef();
  useFrame((_, dt) => {
    if (railRef.current) railRef.current.rotation.y += dt * 0.05;
  });

  const railPos = useMemo(() => {
    const r = 3.15;
    return new Array(6).fill(0).map((_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return [Math.cos(a) * r, Math.sin(a) * r];
    });
  }, []);

  return (
    <group>
      {/* gantry rings */}
      <Instances limit={rings.length} range={rings.length}>
        <torusGeometry args={[3, 0.035, 6, 40]} />
        <meshStandardMaterial
          color={PALETTE.indigo}
          emissive={PALETTE.indigo}
          emissiveIntensity={1.4}
          roughness={0.4}
          metalness={0.6}
          toneMapped={false}
        />
        {rings.map((r, i) => (
          <Instance
            key={i}
            position={[0, r.y, 0]}
            rotation={[Math.PI / 2, 0, r.rot]}
            scale={r.scale}
          />
        ))}
      </Instances>

      {/* hub nodes on every few rings for a "machined" read */}
      <Instances limit={rings.length * 6} range={rings.length * 6}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial
          color="#aeb8ff"
          emissive={PALETTE.indigo}
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.8}
          toneMapped={false}
        />
        {rings.map((r, i) =>
          railPos.map(([x, z], j) => (
            <Instance
              key={`${i}-${j}`}
              position={[x * r.scale, r.y, z * r.scale]}
            />
          ))
        )}
      </Instances>

      {/* six vertical light rails (slowly rotating) */}
      <group ref={railRef}>
        {railPos.map(([x, z], i) => (
          <mesh key={i} position={[x, (TOP + BOTTOM) / 2, z]}>
            <cylinderGeometry args={[0.03, 0.03, TOP - BOTTOM, 6]} />
            <meshStandardMaterial
              color={PALETTE.indigoDeep}
              emissive={PALETTE.indigo}
              emissiveIntensity={0.7}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
