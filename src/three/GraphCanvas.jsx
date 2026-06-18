import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import KnowledgeGraph from "./KnowledgeGraph";
import useTier from "./useTier";

/**
 * The interactive 3D knowledge graph. Drag to orbit (desktop); wheel still
 * scrolls the page (zoom disabled); a gentle idle auto-rotate keeps it alive.
 * Bloom only haloes the bright nodes — steady glow, no flashing.
 */
export default function GraphCanvas() {
  const { reduced, composer, dpr } = useTier();
  const coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const interactive = !reduced && !coarse;

  return (
    <Canvas
      camera={{ position: [0, 0.3, 8.6], fov: 42 }}
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <KnowledgeGraph interactive={interactive} />
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        enableRotate={interactive}
        autoRotate={!reduced}
        autoRotateSpeed={0.45}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
      />
      {composer && !reduced && (
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom luminanceThreshold={0.55} intensity={0.4} mipmapBlur radius={0.4} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
