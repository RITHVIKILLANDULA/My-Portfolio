import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { PALETTE } from "../../constants/world";
import CameraRig from "./CameraRig";
import Shaft from "./Shaft";
import DataCore from "./DataCore";
import Organs from "./Organs";
import Motes from "./Motes";
import Companion from "./Companion";

export default function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      style={{ position: "fixed", inset: 0 }}
      frameloop="always"
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 3, 9], fov: 58, near: 0.1, far: 220 }}
      onCreated={(state) => {
        state.scene.fog = new THREE.FogExp2(PALETTE.bg, 0.03);
        state.gl.setClearColor(PALETTE.bg, 1);
      }}
    >
      <CameraRig />
      <hemisphereLight args={["#2a2f55", "#05060b", 0.55]} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.8}
        color={PALETTE.amber}
      />
      <Suspense fallback={null}>
        <Shaft />
        <Organs />
        <Motes />
        <DataCore />
        <Companion />
      </Suspense>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          luminanceThreshold={1.0}
          luminanceSmoothing={0.3}
          intensity={0.55}
          mipmapBlur
          radius={0.5}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
        <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.035} />
      </EffectComposer>
      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
