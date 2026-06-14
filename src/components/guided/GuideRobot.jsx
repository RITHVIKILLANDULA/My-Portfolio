import {
  Suspense,
  Component,
  useEffect,
  useRef,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows, Float } from "@react-three/drei";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);

const CLIP = {
  idle: "RobotArmature|Robot_Idle",
  wave: "RobotArmature|Robot_Wave",
  yes: "RobotArmature|Robot_Yes",
  thumbsUp: "RobotArmature|Robot_ThumbsUp",
  no: "RobotArmature|Robot_No",
  dance: "RobotArmature|Robot_Dance",
};

function RobotModel({ gesture }) {
  const group = useRef();
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions } = useAnimations(animations, group);
  const current = useRef("");

  // auto-fit to a known height, centred
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) scene.scale.multiplyScalar(2.2 / size.y);
    scene.updateWorldMatrix(true, true);
    const b2 = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    b2.getCenter(c);
    scene.position.x -= c.x;
    scene.position.y -= c.y;
    scene.position.z -= c.z;
  }, [scene]);

  // crossfade to the requested gesture, settle to idle for one-shots
  useEffect(() => {
    const name = gesture || "idle";
    if (current.current === name) return;
    const next = actions[CLIP[name]] || actions[CLIP.idle];
    const prev = actions[CLIP[current.current]];
    if (next) next.reset().fadeIn(0.3).play();
    if (prev && prev !== next) prev.fadeOut(0.3);
    current.current = name;

    if (name !== "idle" && name !== "dance") {
      const idle = actions[CLIP.idle];
      const t = setTimeout(() => {
        if (idle) idle.reset().fadeIn(0.4).play();
        next?.fadeOut(0.4);
        current.current = "idle";
      }, 1900);
      return () => clearTimeout(t);
    }
  }, [gesture, actions]);

  // gentle look toward the viewer
  useFrame((state, dt) => {
    if (!group.current) return;
    const yaw = state.pointer.x * 0.25;
    group.current.rotation.y += (yaw - group.current.rotation.y) * Math.min(1, dt * 2);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

class Boundary extends Component {
  constructor(p) {
    super(p);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Fallback() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="robot-fallback" aria-hidden="true">
        <span className="robot-fallback__eye" />
        <span className="robot-fallback__eye" />
      </div>
    </div>
  );
}

export default function GuideRobot({ gesture = "idle", reduced = false }) {
  if (reduced) return <Fallback />;
  return (
    <Boundary fallback={<Fallback />}>
      <Canvas
        frameloop="always"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.1, 5.4], fov: 30 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#c7d2fe", "#1e1b4b", 0.8]} />
        <directionalLight position={[3, 6, 5]} intensity={2.2} color="#eef2ff" />
        <directionalLight position={[-5, 2, -1]} intensity={1.1} color="#22d3ee" />
        <pointLight position={[0, 1.6, 3]} intensity={1.5} color="#818cf8" />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.12} floatIntensity={0.5}>
            <RobotModel gesture={gesture} />
          </Float>
        </Suspense>
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.4}
          scale={5}
          blur={2.6}
          far={3}
          color="#4338ca"
        />
      </Canvas>
    </Boundary>
  );
}
