import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* an abstract data/AI universe — a glowing point cloud + wireframe core,
   slow rotation, cursor parallax, restrained bloom. One indigo accent. */
function Universe({ count, paused }) {
  const grp = useRef();
  const inner = useRef();

  const positions = useMemo(() => {
    const N = count;
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
  }, [count]);

  useFrame((state, dt) => {
    if (paused) return;
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
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#8d89f6"
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <mesh ref={inner}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshBasicMaterial color="#7c78f0" wireframe transparent opacity={0.22} toneMapped={false} />
      </mesh>

      {[
        [0, 2.4, 0],
        [2.3, -0.6, 0.4],
        [-1.9, 0.9, -1.2],
      ].map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#9d99ff" toneMapped={false} />
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
  const wrap = useRef(null);
  const [inView, setInView] = useState(true);

  const { reduced, lite } = useMemo(() => {
    if (typeof window === "undefined") return { reduced: false, lite: false };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lite = coarse || (navigator.hardwareConcurrency || 8) <= 4;
    return { reduced, lite };
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = wrap.current;
    if (!el) return;
    let onScreen = true;
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        setInView(onScreen && !document.hidden);
      },
      { threshold: 0.02 }
    );
    io.observe(el);
    const onVis = () => setInView(onScreen && !document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  const active = inView && !reduced;

  return (
    <div ref={wrap} className="h-full w-full">
      <Boundary>
        <Canvas
          frameloop={active ? "always" : "never"}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 6.4], fov: 42 }}
        >
          <Suspense fallback={null}>
            <Universe count={lite ? 1300 : 2800} paused={!active} />
            {!lite && (
              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.3} intensity={0.7} mipmapBlur radius={0.6} />
              </EffectComposer>
            )}
          </Suspense>
        </Canvas>
      </Boundary>
    </div>
  );
}
