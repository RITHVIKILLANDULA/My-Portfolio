import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { camCurve, lookCurve } from "../../constants/world";
import { readProgress } from "../../state/scroll";

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

/**
 * The descent. Camera position + lookAt are pure functions of scroll progress,
 * eased against real frame dt — so if the harness stalls rAF the camera simply
 * holds its last pose (never blanks), and there is no programmatic scroll.
 */
export default function CameraRig() {
  const t = useRef(0);
  const look = useRef(new THREE.Vector3(0, -3, 0));
  const ptr = useRef(new THREE.Vector2());

  useFrame((state, dt) => {
    const p = readProgress();
    easing.damp(t, "current", p, 0.16, dt);
    const tt = THREE.MathUtils.clamp(t.current, 0, 1);

    camCurve.getPointAt(tt, _pos);
    // subtle pointer parallax on the camera (never follows cursor as a target)
    easing.damp2(ptr.current, [state.pointer.x, state.pointer.y], 0.4, dt);
    _pos.x += ptr.current.x * 0.6;
    _pos.y += ptr.current.y * 0.35;
    state.camera.position.copy(_pos);

    lookCurve.getPointAt(tt, _look);
    easing.damp3(look.current, _look, 0.12, dt);
    state.camera.lookAt(look.current);
  });

  return null;
}
