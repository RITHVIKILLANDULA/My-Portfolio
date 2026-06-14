import { Suspense, Component, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Float,
  Environment,
  Lightformer,
  ContactShadows,
  Html,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { easing } from "maath";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);
const CYAN = "#22d3ee";
const INDIGO = "#6366f1";

/* ---- the robot: auto-fit, metallic re-skin, glowing core, mouse-track ---- */
function RobotModel() {
  const group = useRef();
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions, names } = useAnimations(animations, group);

  // play the idle loop
  useEffect(() => {
    const idle = actions["RobotArmature|Robot_Idle"] || actions[names[0]];
    idle?.reset().fadeIn(0.4).play();
    return () => idle?.fadeOut(0.3);
  }, [actions, names]);

  // auto-fit + premium re-skin (brushed metal body, glowing cyan accents)
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) scene.scale.multiplyScalar(2.4 / size.y);
    scene.updateWorldMatrix(true, true);
    const b2 = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    b2.getCenter(c);
    scene.position.set(-c.x, -b2.min.y, -c.z); // feet on the platform

    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      o.castShadow = true;
      const m = o.material;
      m.metalness = 0.92;
      m.roughness = 0.26;
      m.envMapIntensity = 1.6;
      // light parts -> chrome; eyes/visor -> emissive cyan
      const isFace = /Head/i.test(o.name);
      if (isFace) {
        m.emissive = new THREE.Color(CYAN);
        m.emissiveIntensity = 0.9;
      } else {
        m.color = new THREE.Color("#aeb6d6").lerp(m.color, 0.35);
        m.emissive = new THREE.Color(INDIGO);
        m.emissiveIntensity = 0.12;
      }
    });
  }, [scene]);

  useFrame((state, dt) => {
    if (!group.current) return;
    // subtle head/body turn toward the cursor (never a hard follow)
    const ty = state.pointer.x * 0.5;
    const tx = -state.pointer.y * 0.15;
    easing.dampE(group.current.rotation, [tx, ty, 0], 0.4, dt);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

/* ---- holographic platform: disc + rotating scan rings + grid glow ---- */
function Platform() {
  const rings = useRef();
  useFrame((_, dt) => {
    if (rings.current) rings.current.rotation.y += dt * 0.4;
  });
  return (
    <group position={[0, -1.22, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.4, 2.6, 0.12, 64]} />
        <meshStandardMaterial color="#0c1024" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[1.0, 2.3, 64]} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <group ref={rings}>
        {[1.5, 1.9, 2.25].map((r, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08 + i * 0.005, 0]}>
            <torusGeometry args={[r, 0.012, 8, 80]} />
            <meshStandardMaterial color={i === 1 ? INDIGO : CYAN} emissive={i === 1 ? INDIGO : CYAN} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0.5, 0]} intensity={3} distance={6} color={CYAN} />
    </group>
  );
}

/* ---- swirling data-aura particles ---- */
function Aura() {
  const ref = useRef();
  const geom = useMemo(() => {
    const N = 360;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() * 1.6;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.3) * 3.4;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.25;
  });
  return (
    <points ref={ref} geometry={geom} position={[0, 0, 0]}>
      <pointsMaterial color={CYAN} size={0.035} sizeAttenuation transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

/* ---- floating holographic status chips ---- */
function HoloChip({ position, label, value }) {
  return (
    <Html position={position} center distanceFactor={8} transform sprite>
      <div className="select-none whitespace-nowrap rounded-md border border-cyan-300/30 bg-[#06101f]/70 px-2 py-1 font-mono text-[7px] text-cyan-200 backdrop-blur-sm">
        <span className="text-cyan-400">{label}</span> {value}
      </div>
    </Html>
  );
}

function Scene() {
  const rig = useRef();
  useFrame((state, dt) => {
    if (rig.current)
      easing.damp3(
        rig.current.position,
        [state.pointer.x * 0.3, -0.45 + state.pointer.y * 0.15, 0],
        0.5,
        dt
      );
  });
  return (
    <>
      <color attach="background" args={["#04050c"]} />
      <fog attach="fog" args={["#04050c", 7, 18]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#eaf0ff" castShadow />
      <directionalLight position={[-6, 3, -4]} intensity={1.4} color={CYAN} />
      <spotLight position={[0, 7, 3]} angle={0.5} penumbra={1} intensity={3} color={INDIGO} />

      <group ref={rig}>
        <Suspense fallback={null}>
          <Float speed={1.3} rotationIntensity={0.15} floatIntensity={0.5}>
            <RobotModel />
            <HoloChip position={[-1.95, 1.15, 0.3]} label="AI" value="online" />
            <HoloChip position={[1.7, 0.35, 0.3]} label="sys" value="100%" />
            <HoloChip position={[-1.7, -0.55, 0.4]} label="data" value="1M+" />
          </Float>
          <Platform />
          <Aura />
          <Environment resolution={256}>
            <Lightformer intensity={3} position={[0, 3, 4]} scale={[6, 6, 1]} color="#aebfff" />
            <Lightformer intensity={2} position={[-4, 1, 2]} scale={[3, 4, 1]} color={CYAN} />
            <Lightformer intensity={1.5} position={[4, 2, -2]} scale={[3, 3, 1]} color={INDIGO} />
          </Environment>
        </Suspense>
      </group>

      <ContactShadows position={[0, -1.18, 0]} opacity={0.5} scale={8} blur={2.6} far={4} color="#020308" />
    </>
  );
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { f: false }; }
  static getDerivedStateFromError() { return { f: true }; }
  render() { return this.state.f ? this.props.fallback : this.props.children; }
}

export default function RobotHero({ reduced }) {
  if (reduced) return null;
  return (
    <Boundary fallback={null}>
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ position: [0.4, 0.7, 8.4], fov: 40 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
        <EffectComposer multisampling={4} disableNormalPass>
          <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.3} intensity={0.9} mipmapBlur radius={0.6} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0006, 0.0006]} />
          <Vignette eskil={false} offset={0.3} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </Boundary>
  );
}
