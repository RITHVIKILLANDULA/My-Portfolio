import { useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import RuntimeRidgeline from "./RuntimeRidgeline";

const BASE_Y = 2.1;
/** Damped mouse-parallax tilt of the (orthographic) camera. No idle motion. */
function Parallax({ enabled }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (!enabled) return;
    const tx = state.pointer.x * 0.8;
    const ty = BASE_Y + state.pointer.y * 0.45;
    camera.position.x += (tx - camera.position.x) * 0.06;
    camera.position.y += (ty - camera.position.y) * 0.06;
    camera.lookAt(0, 0.45, 0);
  });
  return null;
}

/**
 * The Runtime Ridgeline canvas: a contained, orthographic, low-poly indigo
 * terrain carved from his real runtime data. No postprocessing (it cannot
 * flash), renders only on demand.
 */
export default function RidgelineCanvas({ progress, forced, interactive = true }) {
  const camera = useMemo(
    () => ({ position: [0, BASE_Y, 5.4], zoom: 104, near: -50, far: 100 }),
    []
  );
  return (
    <Canvas
      orthographic
      camera={camera}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop="always"
      onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)}
    >
      <RuntimeRidgeline progress={progress} forced={forced} />
      <Parallax enabled={interactive} />
    </Canvas>
  );
}
