import { Component, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* an abstract data/AI universe — a glowing point cloud + wireframe core,
   slow rotation, cursor parallax, bloom. No character, just atmosphere. */
function Universe() {
  const grp = useRef();
  const inner = useRef();

  const positions = useMemo(() => {
    const N = 2800;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * 2.399963;
      const rad = 2.35 + (Math.random() - 0.5) * 0.6;
      pos[i * 3] = Math.cos(theta) * r * rad;
      pos[i * 3 + 1] = y * rad;
      pos[i * 3 + 2] = Math.sin(theta) * r * rad;
    }
    return pos;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (grp.current) {
      grp.current.rotation.y += dt * 0.05 + state.pointer.x * dt * 0.4;
      grp.current.rotation.x = THREE.MathUtils.lerp(
        grp.current.rotation.x,
        -state.pointer.y * 0.25 + Math.sin(t * 0.1) * 0.06,
        0.04
      );
    }
    if (inner.current) inner.current.rotation.y -= dt * 0.12;
  });

  return (
    <group ref={grp}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#9d99ff"
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <mesh ref={inner}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#7c78f0" wireframe transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {/* accent nodes */}
      {[
        [0, 2.4, 0, "#38bdf8"],
        [2.3, -0.6, 0.4, "#2dd4bf"],
        [-1.9, 0.9, -1.2, "#9d99ff"],
      ].map(([x, y, z, c], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

class Boundary extends Component {
  constructor(p) {
    super(p);
    this.state = { f: false };
  }
  static getDerivedStateFromError() {
    return { f: true };
  }
  render() {
    return this.state.f ? null : this.props.children;
  }
}

export default function HeroScene3D() {
  return (
    <Boundary>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.4], fov: 42 }}
      >
        <Suspense fallback={null}>
          <Universe />
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.08} luminanceSmoothing={0.3} intensity={1.0} mipmapBlur radius={0.62} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </Boundary>
  );
}
