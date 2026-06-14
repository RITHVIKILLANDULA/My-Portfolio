import {
  Suspense,
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  Environment,
  Lightformer,
  ContactShadows,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { easing } from "maath";
import { FiSend, FiArrowDownRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HERO_NAME } from "../../constants";
import useMediaQuery from "../../hooks/useMediaQuery";
import { answerFor, SUGGESTIONS, GREETING } from "./knowledge";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);
const CYAN = "#22d3ee";
const INDIGO = "#6366f1";
const CLIP = {
  idle: "RobotArmature|Robot_Idle",
  wave: "RobotArmature|Robot_Wave",
  yes: "RobotArmature|Robot_Yes",
  thumbsUp: "RobotArmature|Robot_ThumbsUp",
  no: "RobotArmature|Robot_No",
  walk: "RobotArmature|Robot_Walking",
};

/* -------- the robot: auto-fit + metal reskin + walk/wander + gesture -------- */
function RobotModel({ gesture, gKey }) {
  const outer = useRef(); // walk position
  const inner = useRef(); // facing yaw
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions } = useAnimations(animations, outer);
  const clip = useRef("idle");
  const talking = useRef(false);
  const targetX = useRef(0);
  const targetZ = useRef(0);
  const nextWander = useRef(3);
  const tt = useRef(0);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) scene.scale.multiplyScalar(2.4 / size.y);
    scene.updateWorldMatrix(true, true);
    const b2 = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    b2.getCenter(c);
    scene.position.set(-c.x, -b2.min.y, -c.z);
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const m = o.material;
      m.metalness = 0.92;
      m.roughness = 0.26;
      m.envMapIntensity = 1.6;
      if (/Head/i.test(o.name)) {
        m.emissive = new THREE.Color(CYAN);
        m.emissiveIntensity = 0.95;
      } else {
        m.color = new THREE.Color("#aeb6d6").lerp(m.color, 0.35);
        m.emissive = new THREE.Color(INDIGO);
        m.emissiveIntensity = 0.12;
      }
    });
  }, [scene]);

  const play = (name) => {
    if (clip.current === name) return;
    const next = actions[CLIP[name]] || actions[CLIP.idle];
    const prev = actions[CLIP[clip.current]];
    next?.reset().fadeIn(0.25).play();
    if (prev && prev !== next) prev.fadeOut(0.25);
    clip.current = name;
  };

  // greet on mount + react whenever a new answer comes in
  useEffect(() => {
    talking.current = true;
    play(gesture || "wave");
    const id = setTimeout(() => {
      talking.current = false;
    }, 2400);
    return () => clearTimeout(id);
  }, [gKey]); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame((state, dt) => {
    tt.current += dt;
    const o = outer.current;
    const inn = inner.current;
    if (!o || !inn) return;

    if (talking.current) {
      // stop, face the visitor (slight cursor lean)
      easing.dampAngle(inn.rotation, "y", state.pointer.x * 0.35, 0.3, dt);
      easing.damp3(o.position, [o.position.x, 0, o.position.z], 0.4, dt);
      return;
    }

    // wander the stage
    if (tt.current > nextWander.current) {
      targetX.current = (Math.random() * 2 - 1) * 1.8;
      targetZ.current = (Math.random() * 2 - 1) * 0.8;
      nextWander.current = tt.current + 4 + Math.random() * 4;
    }
    const dx = targetX.current - o.position.x;
    const dz = targetZ.current - o.position.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.12) {
      play("walk");
      o.position.x += (dx / dist) * dt * 0.9;
      o.position.z += (dz / dist) * dt * 0.9;
      // face direction of travel, but clamped so it never fully turns away
      const yaw = THREE.MathUtils.clamp(Math.atan2(dx, dz + 4), -0.7, 0.7);
      easing.dampAngle(inn.rotation, "y", yaw, 0.25, dt);
    } else {
      play("idle");
      easing.dampAngle(inn.rotation, "y", state.pointer.x * 0.3, 0.3, dt);
    }
  });

  return (
    <group ref={outer}>
      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.3}>
        <group ref={inner}>
          <primitive object={scene} />
        </group>
      </Float>
    </group>
  );
}

function OrbitRings() {
  const g = useRef();
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.35;
    g.current.rotation.x += dt * 0.12;
  });
  const rings = [
    [3.0, [Math.PI / 2.3, 0, 0]],
    [3.4, [Math.PI / 1.7, 0, 0.6]],
    [3.8, [Math.PI / 2, 0.5, 0]],
  ];
  return (
    <group ref={g} position={[0, 0.3, 0]}>
      {rings.map(([r, rot], i) => (
        <mesh key={i} rotation={rot}>
          <torusGeometry args={[r, 0.01, 8, 120]} />
          <meshStandardMaterial color={i % 2 ? INDIGO : CYAN} emissive={i % 2 ? INDIGO : CYAN} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Floor() {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.material.transparent = true;
      ref.current.material.opacity = 0.32;
    }
  }, []);
  return <gridHelper ref={ref} args={[80, 80, CYAN, "#1b2550"]} position={[0, -1.2, 0]} />;
}

function Aura() {
  const ref = useRef();
  const geom = useMemo(() => {
    const N = 700;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.2 + Math.random() * 4;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.25) * 5;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.18;
  });
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial color={CYAN} size={0.035} sizeAttenuation transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </points>
  );
}

function Platform() {
  const rings = useRef();
  useFrame((_, dt) => {
    if (rings.current) rings.current.rotation.y += dt * 0.4;
  });
  return (
    <group position={[0, -1.22, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.8, 3.0, 0.12, 64]} />
        <meshStandardMaterial color="#0c1024" metalness={0.85} roughness={0.4} />
      </mesh>
      <group ref={rings}>
        {[1.8, 2.3, 2.7].map((r, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08 + i * 0.004, 0]}>
            <torusGeometry args={[r, 0.014, 8, 90]} />
            <meshStandardMaterial color={i === 1 ? INDIGO : CYAN} emissive={i === 1 ? INDIGO : CYAN} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0.6, 0]} intensity={3} distance={7} color={CYAN} />
    </group>
  );
}

function Scene({ gesture, gKey }) {
  return (
    <>
      <color attach="background" args={["#04050c"]} />
      <fog attach="fog" args={["#04050c", 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={2} color="#eaf0ff" />
      <directionalLight position={[-6, 3, -4]} intensity={1.4} color={CYAN} />
      <spotLight position={[0, 8, 3]} angle={0.5} penumbra={1} intensity={3} color={INDIGO} />
      <Suspense fallback={null}>
        <RobotModel gesture={gesture} gKey={gKey} />
        <OrbitRings />
        <Platform />
        <Floor />
        <Aura />
        <Environment resolution={256}>
          <Lightformer intensity={3} position={[0, 3, 4]} scale={[7, 7, 1]} color="#aebfff" />
          <Lightformer intensity={2} position={[-4, 1, 2]} scale={[3, 5, 1]} color={CYAN} />
          <Lightformer intensity={1.5} position={[4, 2, -2]} scale={[3, 3, 1]} color={INDIGO} />
        </Environment>
      </Suspense>
      <ContactShadows position={[0, -1.18, 0]} opacity={0.5} scale={9} blur={2.6} far={4} color="#020308" />
    </>
  );
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { f: false }; }
  static getDerivedStateFromError() { return { f: true }; }
  render() { return this.state.f ? this.props.fallback : this.props.children; }
}

function useTyped(text) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text]);
  return out;
}

/* --------------------------------- WORLD --------------------------------- */
export default function RobotWorld({ onOpenResume }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [reply, setReply] = useState({ ...GREETING, key: 0 });
  const [input, setInput] = useState("");
  const typed = useTyped(reply.answer);

  const ask = (q) => {
    const text = (q || "").trim();
    if (!text) return;
    const { answer, gesture } = answerFor(text);
    setReply((r) => ({ answer, gesture, key: r.key + 1 }));
    setInput("");
  };

  return (
    <section id="home" className="relative h-[100svh] w-full overflow-hidden">
      {/* full-bleed 3D world */}
      {isDesktop && !reduced && (
        <div className="absolute inset-0 z-0">
          <Boundary fallback={null}>
            <Canvas
              shadows
              frameloop="always"
              dpr={[1, 2]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              camera={{ position: [0, 0.4, 9], fov: 38 }}
            >
              <Scene gesture={reply.gesture} gKey={reply.key} />
              <EffectComposer multisampling={4} disableNormalPass>
                <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.3} intensity={0.85} mipmapBlur radius={0.6} />
                <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0005, 0.0005]} />
                <Vignette eskil={false} offset={0.28} darkness={0.82} />
              </EffectComposer>
            </Canvas>
          </Boundary>
        </div>
      )}

      {/* readability veils */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#04050c]/85 via-transparent to-[#04050c]/95" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[#04050c] to-transparent" />

      {/* identity — top-left */}
      <div className="absolute left-5 top-28 z-10 max-w-md sm:left-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-data-cyan/30 bg-data-cyan/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="mono-label text-[0.6rem] text-neutral-300">Open to AI / Data roles · Buffalo, NY</span>
        </div>
        <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl">
          {HERO_NAME}
        </h1>
        <p className="gradient-text mt-3 font-mono text-xl font-medium sm:text-2xl">AI Data Analyst</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#projects" data-cursor className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-5 py-2.5 text-sm font-semibold text-void-950 shadow-glow">
            <HiOutlineSparkles /> Explore the Work
          </a>
          <button onClick={onOpenResume} data-cursor className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-200 hover:border-data-cyan/60">
            ▶ Résumé Reel
          </button>
        </div>
      </div>

      {/* robot speech bubble — upper right near the robot */}
      <div className="absolute right-5 top-28 z-10 hidden max-w-xs lg:block xl:right-16">
        <div className="rounded-2xl border border-data-indigo/30 bg-[#0a0d1c]/80 p-4 backdrop-blur-md">
          <span className="mono-label text-[0.5rem] text-data-indigo/80">
            <span className="text-emerald-400">● </span>ai guide
          </span>
          <p className="mt-1.5 min-h-[4.5em] text-sm leading-snug text-neutral-100">{typed}</p>
        </div>
      </div>

      {/* ASK interface — bottom center */}
      <div className="absolute inset-x-0 bottom-7 z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-3 px-5">
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => ask(s.q)}
              data-cursor
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[0.65rem] text-neutral-300 transition-colors hover:border-data-cyan/50 hover:text-data-cyan"
            >
              {s.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex w-full items-center gap-2 rounded-2xl border border-data-indigo/30 bg-[#0a0d1c]/80 p-2 pl-4 backdrop-blur-md"
        >
          <span className="text-data-cyan">✦</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask my AI anything about me…"
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          <button type="submit" aria-label="Ask" className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo text-void-950">
            <FiSend className="text-sm" />
          </button>
        </form>
      </div>

      {/* scroll cue */}
      <a href="#about" className="absolute bottom-2 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1 text-[0.55rem] text-neutral-600 lg:flex">
        <FiArrowDownRight /> scroll for the full story
      </a>
    </section>
  );
}
