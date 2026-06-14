import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Trail } from "@react-three/drei";
import { easing } from "maath";
import { robotCurve, PALETTE } from "../../constants/world";
import { readProgress, scroll } from "../../state/scroll";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);

const CLIP = {
  idle: "RobotArmature|Robot_Idle",
  wave: "RobotArmature|Robot_Wave",
  walk: "RobotArmature|Robot_Walking",
  yes: "RobotArmature|Robot_Yes",
};

const _p = new THREE.Vector3();

export default function Companion() {
  const rig = useRef();
  const inner = useRef();
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions } = useAnimations(animations, rig);
  const current = useRef("");

  // auto-fit to ~2u, feet at the rig origin (proven approach)
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) scene.scale.multiplyScalar(2.0 / size.y);
    scene.updateWorldMatrix(true, true);
    const b2 = new THREE.Box3().setFromObject(scene);
    scene.position.x -= (b2.max.x + b2.min.x) / 2;
    scene.position.z -= (b2.max.z + b2.min.z) / 2;
    scene.position.y -= b2.min.y;
  }, [scene]);

  const play = (name) => {
    if (current.current === name) return;
    const next = actions[CLIP[name]] || actions[CLIP.idle];
    const prev = actions[CLIP[current.current]];
    if (next) next.reset().fadeIn(0.3).play();
    if (prev && prev !== next) prev.fadeOut(0.3);
    current.current = name;
  };

  useEffect(() => {
    play("wave");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  const t = useRef(0);
  useFrame((state, dt) => {
    const p = readProgress();
    easing.damp(t, "current", Math.max(0, p - 0.02), 0.16, dt);
    const tt = THREE.MathUtils.clamp(t.current, 0, 1);
    if (!rig.current) return;

    robotCurve.getPointAt(tt, _p);
    easing.damp3(rig.current.position, _p, 0.18, dt);

    // turn to look back up at the camera (yaw only, stays upright)
    const dx = state.camera.position.x - rig.current.position.x;
    const dz = state.camera.position.z - rig.current.position.z;
    const yaw = Math.atan2(dx, dz);
    easing.dampAngle(rig.current.rotation, "y", yaw, 0.2, dt);

    // gait / gesture selection
    if (tt < 0.06 || tt > 0.9) play("wave");
    else if (scroll.velocity > 0.05) play("walk");
    else play("idle");
  });

  return (
    <group ref={rig}>
      <Trail
        width={1.2}
        length={4}
        color={PALETTE.indigo}
        attenuation={(w) => w * w}
      >
        <group ref={inner}>
          <primitive object={scene} />
        </group>
      </Trail>
      {/* the robot's own soft key light so it never silhouettes to black */}
      <pointLight position={[0, 1.6, 1.2]} intensity={2} distance={6} color="#cdd6ff" />
    </group>
  );
}
