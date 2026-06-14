import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PALETTE } from "../../constants/world";
import { scroll } from "../../state/scroll";

const COUNT = 520;
const TOP = 4;
const BOTTOM = -57;

/**
 * Raw-data motes: amber points that fall through the shaft, faster + brighter
 * the harder you fling the scroll (carry your velocity), wrapping top↔bottom.
 */
export default function Motes() {
  const ref = useRef();
  const matRef = useRef();

  const { geom, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const rand = (i, s) => {
      const x = Math.sin(i * 7.13 + s * 41.7) * 9731.1;
      return x - Math.floor(x);
    };
    for (let i = 0; i < COUNT; i++) {
      const a = rand(i, 1) * Math.PI * 2;
      const r = 0.4 + rand(i, 2) * 2.7;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = TOP - rand(i, 3) * (TOP - BOTTOM);
      positions[i * 3 + 2] = Math.sin(a) * r;
      speeds[i] = 0.4 + rand(i, 4) * 1.2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geom: g, speeds };
  }, []);

  useFrame((_, dt) => {
    const arr = geom.attributes.position.array;
    const boost = 1 + scroll.velocity * 9;
    for (let i = 0; i < COUNT; i++) {
      let y = arr[i * 3 + 1] - dt * speeds[i] * boost;
      if (y < BOTTOM) y = TOP;
      arr[i * 3 + 1] = y;
    }
    geom.attributes.position.needsUpdate = true;
    if (matRef.current)
      matRef.current.opacity = 0.55 + scroll.velocity * 0.4;
  });

  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial
        ref={matRef}
        color={PALETTE.amber}
        size={0.07}
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
