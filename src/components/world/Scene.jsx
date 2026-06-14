import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { PALETTE } from "../../constants/world";
import CameraRig from "./CameraRig";
import NeuralNet from "./NeuralNet";
import DataViz from "./DataViz";
import DataCore from "./DataCore";

export default function Scene() {
  return (
    <Canvas
      style={{ position: "fixed", inset: 0 }}
      frameloop="always"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.5, 16], fov: 58, near: 0.1, far: 240 }}
      onCreated={(state) => {
        state.scene.fog = new THREE.FogExp2(PALETTE.bg, 0.016);
        state.gl.setClearColor(PALETTE.bg, 1);
      }}
    >
      <CameraRig />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#2b3470", "#04050b", 0.6]} />
      <pointLight position={[0, 0, 10]} intensity={1.2} color={PALETTE.cyan} distance={40} />
      <Suspense fallback={null}>
        <NeuralNet />
        <DataViz />
        <DataCore />
      </Suspense>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          luminanceThreshold={0.9}
          luminanceSmoothing={0.3}
          intensity={0.7}
          mipmapBlur
          radius={0.55}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.82} />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.03} />
      </EffectComposer>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
