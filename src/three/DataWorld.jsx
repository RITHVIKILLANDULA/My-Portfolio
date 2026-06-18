import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import DistillationField from "./DistillationField";
import useTier from "./useTier";

/**
 * The fixed full-viewport WebGL world behind the whole document. One living
 * droplet, tasteful bloom into the dark void, gated by tier. Transparent canvas
 * so the page #08090e shows through and the DOM legibility scrims work.
 */
export default function DataWorld() {
  const { reduced, detail, composer, dpr, interactive } = useTier();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 38 }}
        dpr={dpr}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance", stencil: false, depth: true }}
        frameloop={reduced ? "demand" : "always"}
      >
        <DistillationField detail={detail} reduced={reduced} interactive={interactive} />
        {composer && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom luminanceThreshold={0.62} intensity={0.55} mipmapBlur radius={0.6} />
            <Vignette offset={0.3} darkness={0.5} />
            <Noise opacity={0.022} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
