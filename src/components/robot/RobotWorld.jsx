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
import { FiSend, FiArrowDownRight, FiMic, FiVolume2, FiVolumeX } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HERO_NAME } from "../../constants";
import useMediaQuery from "../../hooks/useMediaQuery";
import { answerFor, SUGGESTIONS, GREETING } from "./knowledge";
import useVoice from "./useVoice";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);
const CYAN = "#22d3ee";
const INDIGO = "#6366f1";
const BG = "#06080f"; // Observatory void
const CLIP = {
  idle: "Idle",
  wave: "Wave",
  yes: "Yes",
  thumbsUp: "ThumbsUp",
  no: "No",
  walk: "Walking",
  run: "Running",
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
// shared scroll signal: gait velocity, page progress (0..1) and dock state —
// lets the robot WALK DOWN the page with you through the text-free whitespace
// (never over content), instead of sitting in a fixed corner box.
const scrollSig = { vel: 0, progress: 0, docked: false };
// width of the centered content column (max-w-6xl) in px — the robot stays in
// the whitespace OUTSIDE this column so it can never overlap readable text.
const CONTENT_W = 1152;

/* -------- the robot: auto-fit + metal reskin + walk/wander + gesture -------- */
function RobotModel({ gesture, gKey, speaking }) {
  const outer = useRef(); // walk position
  const inner = useRef(); // facing yaw
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions } = useAnimations(animations, outer);
  const clip = useRef("idle");
  const talking = useRef(false);
  const entrance = useRef(0); // 0→1 cinematic descent on arrival
  const tt = useRef(0);
  const headMats = useRef([]);
  const bodyMats = useRef([]); // body materials — self-glow boosted while walking
  const robotW = useRef(1.1); // natural world-width (measured) for gutter fit
  const disc = useRef(); // glow disc that travels under the feet while walking

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) scene.scale.multiplyScalar(2.45 / size.y);
    scene.updateWorldMatrix(true, true);
    const b2 = new THREE.Box3().setFromObject(scene);
    const c = new THREE.Vector3();
    b2.getCenter(c);
    const s2 = new THREE.Vector3();
    b2.getSize(s2);
    robotW.current = Math.max(0.5, s2.x); // natural width for gutter-fit scaling
    // centre the robot on the origin so the camera (which looks at 0,0,0)
    // frames the whole body, head included
    scene.position.set(-c.x, -c.y, -c.z);
    scene.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      o.castShadow = true;
      const m = o.material;
      // keep its friendly colours, add a premium metallic sheen + reflections
      m.metalness = 0.55;
      m.roughness = 0.42;
      m.envMapIntensity = 1.35;
      m.emissive = new THREE.Color(INDIGO);
      m.emissiveIntensity = 0.07;
      if (/Head/i.test(o.name)) {
        // the face glows softly and lights up when the robot talks
        m.emissive = new THREE.Color(CYAN);
        m.emissiveIntensity = 0.25;
        headMats.current.push(m);
      } else {
        bodyMats.current.push(m);
      }
    });
  }, [scene]);

  // start high so the robot descends into frame on arrival
  useEffect(() => {
    if (outer.current) outer.current.position.set(0, 6, -1.6);
  }, []);

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
    // eyes flicker while the robot is speaking
    const glow = speaking
      ? 0.35 + Math.abs(Math.sin(state.clock.elapsedTime * 17)) * 1.0
      : 0.25;
    for (const m of headMats.current) m.emissiveIntensity = glow;
    // body self-illuminates while walking so it reads as a lively companion
    // even when small/at the page edge; near-matte in the lit hero
    const bodyGlow = scrollSig.docked ? 0.3 : 0.07;
    const k = Math.min(1, dt * 4);
    for (const m of bodyMats.current)
      m.emissiveIntensity += (bodyGlow - m.emissiveIntensity) * k;

    const o = outer.current;
    const inn = inner.current;
    if (!o || !inn) return;

    // cinematic arrival: descend from above, ease to a soft landing.
    // skipped if the page opens (or scrolls) into the docked walk state.
    if (scrollSig.docked) entrance.current = 1;
    if (entrance.current < 1) {
      entrance.current = Math.min(1, entrance.current + dt / 1.5);
      const e = 1 - Math.pow(1 - entrance.current, 3); // easeOutCubic
      o.position.set(0, 6 * (1 - e), -1.6 * (1 - e));
      easing.dampAngle(inn.rotation, "y", state.pointer.x * 0.3, 0.3, dt);
      return;
    }

    // decay scroll velocity (drives gait in both modes)
    scrollSig.vel *= Math.max(0, 1 - dt * 3.5);
    const v = scrollSig.vel;

    if (scrollSig.docked) {
      /* WALK MODE — descend the page through the side whitespace, never over
         text. Scaled to FIT the gutter beside the centered content column, so
         overlap is structurally impossible at any width. */
      const vp = state.viewport; // world units across the canvas at z=0
      const pxPerWorld = state.size.width / Math.max(0.001, vp.width);
      const vpHalfW = vp.width / 2;
      const contentHalfW = CONTENT_W / 2 / pxPerWorld; // half the text column
      const gutterW = Math.max(0, vpHalfW - contentHalfW); // one side's gap
      const natW = robotW.current;
      const fit = clamp((gutterW * 0.9) / natW, 0.16, 0.72);
      easing.damp(o.scale, "x", fit, 0.4, dt);
      easing.damp(o.scale, "y", fit, 0.4, dt);
      easing.damp(o.scale, "z", fit, 0.4, dt);

      // park hard against the right whitespace, just clear of the text column
      const halfBody = (natW * fit) / 2;
      const parkX = vpHalfW - halfBody - 0.05;
      // descend in lockstep with scroll — the robot literally comes down with you
      const vpHalfH = vp.height / 2;
      const padY = (2.45 * fit) / 2 + 0.25;
      const topY = vpHalfH - padY;
      const botY = -vpHalfH + padY;
      const targetY = topY + (botY - topY) * clamp(scrollSig.progress, 0, 1);
      const bob = Math.sin(tt.current * 7) * 0.05 * clamp(v * 4, 0, 1);
      easing.damp3(o.position, [parkX, targetY + bob, 0], 0.3, dt);
      // face slightly inward (toward the content it's narrating), not the cursor
      easing.dampAngle(inn.rotation, "y", -0.4, 0.4, dt);
      easing.dampAngle(inn.rotation, "x", 0.05 * clamp(v * 3, 0, 1), 0.4, dt);
      // glow disc travels under the feet; fades up only while docked
      if (disc.current)
        easing.damp(disc.current.material, "opacity", gutterW < 0.2 ? 0 : 0.42, 0.4, dt);

      if (!talking.current) {
        if (v > 1.6) play("run");
        else if (v > 0.16) play("walk");
        else play("idle");
      }
      return;
    }

    // HERO MODE — grounded at the origin, full size, gently facing you
    easing.damp(o.scale, "x", 1, 0.4, dt);
    easing.damp(o.scale, "y", 1, 0.4, dt);
    easing.damp(o.scale, "z", 1, 0.4, dt);
    easing.damp3(o.position, [0, 0, 0], 0.5, dt);
    easing.dampAngle(inn.rotation, "y", state.pointer.x * 0.3, 0.3, dt);
    easing.dampAngle(inn.rotation, "x", 0, 0.3, dt);
    if (disc.current) easing.damp(disc.current.material, "opacity", 0, 0.4, dt);

    if (talking.current) return;
    if (v > 1.6) play("run");
    else if (v > 0.16) play("walk");
    else play("idle");
  });

  return (
    <group ref={outer}>
      {/* glow disc under the feet — travels with the robot while it walks */}
      <mesh ref={disc} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.24, 0]}>
        <circleGeometry args={[1.0, 44]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
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

// distant AI-city skyline fading into the night — gives the world a "place"
function CityArrival() {
  const grp = useRef();
  const towers = useMemo(() => {
    const arr = [];
    const N = 52;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.06;
      const r = 14 + Math.random() * 9;
      arr.push({
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h: 1 + Math.random() * 4.5,
        w: 0.42 + Math.random() * 0.7,
        lit: Math.random() > 0.5,
      });
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    if (grp.current) grp.current.rotation.y += dt * 0.01;
  });
  return (
    <group ref={grp} position={[0, -1.2, 0]}>
      {towers.map((t, i) => (
        <group key={i} position={[t.x, t.h / 2, t.z]}>
          <mesh>
            <boxGeometry args={[t.w, t.h, t.w]} />
            <meshStandardMaterial
              color="#0a1024"
              metalness={0.6}
              roughness={0.55}
              emissive={t.lit ? INDIGO : CYAN}
              emissiveIntensity={0.14}
            />
          </mesh>
          {/* beacon cap — a lit data centre on the skyline */}
          <mesh position={[0, t.h / 2 + 0.03, 0]}>
            <boxGeometry args={[t.w * 0.45, 0.06, t.w * 0.45]} />
            <meshBasicMaterial color={t.lit ? CYAN : INDIGO} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// thin columns of data rising from the city into the night sky
function DataStreams() {
  const N = 260;
  const geom = useMemo(() => {
    const pos = new Float32Array(N * 3);
    const spd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 13;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -1.2 + Math.random() * 9;
      pos[i * 3 + 2] = Math.sin(a) * r;
      spd[i] = 0.6 + Math.random() * 1.7;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.userData.spd = spd;
    return g;
  }, []);
  useFrame((_, dt) => {
    const p = geom.attributes.position.array;
    const spd = geom.userData.spd;
    for (let i = 0; i < N; i++) {
      p[i * 3 + 1] += spd[i] * dt;
      if (p[i * 3 + 1] > 8) p[i * 3 + 1] = -1.2;
    }
    geom.attributes.position.needsUpdate = true;
  });
  return (
    <points geometry={geom}>
      <pointsMaterial
        color={CYAN}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
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

function CameraDolly() {
  // static frontal framing — the robot's own world-Y does the on-screen travel
  // (a corner camera move would make it "walk in place" / read as a box).
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, [0, 0.4, 9], 0.5, dt);
    easing.damp3(look.current, [0, 0, 0], 0.5, dt);
    state.camera.lookAt(look.current);
  });
  return null;
}

function Scene({ gesture, gKey, speaking, scrolled }) {
  return (
    <>
      {/* transparent canvas — the robot lives over the page, not in a box */}
      {!scrolled && <fog attach="fog" args={[BG, 11, 30]} />}
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 8, 5]} intensity={2.1} color="#eaf0ff" castShadow />
      <directionalLight position={[-6, 3, -4]} intensity={1.4} color={CYAN} />
      <spotLight position={[0, 8, 3]} angle={0.5} penumbra={1} intensity={3} color={INDIGO} />
      <CameraDolly />
      <Suspense fallback={null}>
        <RobotModel gesture={gesture} gKey={gKey} speaking={speaking} />
        {!scrolled && <CityArrival />}
        {!scrolled && <DataStreams />}
        {!scrolled && <OrbitRings />}
        {!scrolled && <Platform />}
        {!scrolled && <Floor />}
        {!scrolled && <Aura />}
        <Environment resolution={256}>
          <Lightformer intensity={3} position={[0, 3, 4]} scale={[7, 7, 1]} color="#aebfff" />
          <Lightformer intensity={2} position={[-4, 1, 2]} scale={[3, 5, 1]} color={CYAN} />
          <Lightformer intensity={1.5} position={[4, 2, -2]} scale={[3, 3, 1]} color={INDIGO} />
        </Environment>
      </Suspense>
      {!scrolled && (
        <ContactShadows position={[0, -1.18, 0]} opacity={0.5} scale={9} blur={2.6} far={4} color="#020308" />
      )}
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
  const voice = useVoice();
  const [docked, setDocked] = useState(false);
  const [heroFade, setHeroFade] = useState(1);
  const show3D = isDesktop && !reduced;

  // scroll → dock the robot into the corner + fade the hero copy
  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY || 0;
    let lastT = performance.now();
    const update = () => {
      const y = window.scrollY || 0;
      const vh = window.innerHeight || 1;
      const docH = document.documentElement.scrollHeight || vh;
      const now = performance.now();
      scrollSig.vel = Math.min(6, Math.abs(y - lastY) / Math.max(1, now - lastT));
      lastY = y;
      lastT = now;
      // dock only AFTER the hero has scrolled past, so the full-bleed arrival
      // canvas never sits over the first section
      const isDocked = y > vh * 0.85;
      scrollSig.docked = isDocked;
      scrollSig.progress = clamp(y / Math.max(1, docH - vh), 0, 1);
      setDocked(isDocked);
      setHeroFade(Math.max(0, Math.min(1, 1 - y / (vh * 0.55))));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const ask = (q) => {
    const text = (q || "").trim();
    if (!text) return;
    const { answer, gesture } = answerFor(text);
    setReply((r) => ({ answer, gesture, key: r.key + 1 }));
    setInput("");
    voice.speak(answer);
  };

  return (
    <>
      {/* PERSISTENT robot — a real companion living over the page (no box) */}
      {show3D && (
        <div className="pointer-events-none fixed inset-0 z-[12]">
          <Boundary fallback={null}>
            <Canvas
              shadows
              frameloop="always"
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              camera={{ position: [0, 0.4, 9], fov: 38 }}
            >
              <Scene
                gesture={reply.gesture}
                gKey={reply.key}
                speaking={voice.speaking}
                scrolled={docked}
              />
              {!docked && (
                <EffectComposer multisampling={4} disableNormalPass>
                  <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.3} intensity={0.7} mipmapBlur radius={0.55} />
                </EffectComposer>
              )}
            </Canvas>
          </Boundary>
        </div>
      )}

      {/* hero readability veil (fades out as you scroll) */}
      {show3D && (
        <div
          className="pointer-events-none fixed inset-0 z-[15] bg-gradient-to-b from-[#06080f]/55 via-transparent to-[#06080f]/80"
          style={{ opacity: heroFade }}
        />
      )}

      {/* hero copy — in flow, fades + scrolls away */}
      <section id="home" className="relative h-[100svh] w-full">
        <div
          style={{ opacity: heroFade }}
          className={`absolute left-5 top-28 z-20 max-w-md transition-opacity duration-300 sm:left-10 ${
            heroFade < 0.05 ? "pointer-events-none" : ""
          }`}
        >
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
        <a
          href="#snapshot"
          data-cursor
          className="mono-label mt-5 inline-flex items-center gap-1.5 text-[0.6rem] text-neutral-400 transition-colors hover:text-data-cyan"
        >
          <FiArrowDownRight /> recruiter? skip to the 60-second brief
        </a>
      </div>

      {/* scroll cue */}
        <a
          href="#about"
          style={{ opacity: heroFade }}
          className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-1 text-[0.55rem] text-neutral-600 lg:flex"
        >
          <FiArrowDownRight /> scroll — the robot comes with you
        </a>
      </section>

      {/* speech bubble — hero only (right side); when docked the narration
          folds into the bottom pill so nothing floats over body text */}
      <div
        className={`fixed z-30 transition-all duration-500 ${
          docked ? "hidden" : "right-5 top-28 hidden max-w-xs lg:block xl:right-16"
        }`}
      >
        <div className="rounded-2xl border border-data-indigo/30 bg-[#0a0d1c]/85 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="mono-label text-[0.5rem] text-data-indigo/80">
              <span className="text-emerald-400">● </span>ai guide
            </span>
            <div className="flex items-center gap-2">
              {voice.speaking && (
                <span className="flex h-3 items-end gap-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="w-0.5 rounded-full bg-data-cyan"
                      style={{
                        height: "12px",
                        transformOrigin: "bottom",
                        animation: `soundbar .5s ease-in-out ${i * 0.1}s infinite`,
                      }}
                    />
                  ))}
                </span>
              )}
              {voice.supportsTTS && (
                <button
                  onClick={voice.toggleMute}
                  aria-label={voice.muted ? "Unmute" : "Mute"}
                  className="text-neutral-400 transition-colors hover:text-data-cyan"
                >
                  {voice.muted ? <FiVolumeX className="text-xs" /> : <FiVolume2 className="text-xs" />}
                </button>
              )}
            </div>
          </div>
          <p className="mt-1.5 min-h-[4.5em] text-sm leading-snug text-neutral-100">{typed}</p>
        </div>
      </div>

      {/* ask — full bar in hero; bottom-centred pill once docked (always
          reachable, never beside body text) */}
      <div
        className={`fixed z-30 transition-all duration-500 ${
          docked
            ? "bottom-6 left-1/2 -translate-x-1/2 w-[min(440px,92vw)]"
            : "inset-x-0 bottom-7 mx-auto w-full max-w-2xl px-5"
        }`}
      >
        {docked && (
          <div className="mb-2 rounded-2xl border border-data-indigo/30 bg-[#0a0d1c]/85 px-4 py-2.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="mono-label text-[0.5rem] text-data-indigo/80">
                <span className="text-emerald-400">● </span>ai guide
              </span>
              {voice.supportsTTS && (
                <button
                  onClick={voice.toggleMute}
                  aria-label={voice.muted ? "Unmute" : "Mute"}
                  className="text-neutral-400 transition-colors hover:text-data-cyan"
                >
                  {voice.muted ? <FiVolumeX className="text-xs" /> : <FiVolume2 className="text-xs" />}
                </button>
              )}
            </div>
            <p className="mt-1 line-clamp-2 text-[0.8rem] leading-snug text-neutral-100">
              {typed}
            </p>
          </div>
        )}
        {!docked && (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
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
        )}
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
            placeholder={voice.listening ? "Listening…" : "Ask my AI anything about me…"}
            className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
          />
          {voice.supportsSTT && (
            <button
              type="button"
              onClick={() => voice.listen((t) => ask(t))}
              aria-label="Speak to the robot"
              className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
                voice.listening
                  ? "animate-pulse border-data-cyan bg-data-cyan/20 text-data-cyan"
                  : "border-white/10 text-neutral-300 hover:border-data-cyan/50 hover:text-data-cyan"
              }`}
            >
              <FiMic className="text-sm" />
            </button>
          )}
          <button type="submit" aria-label="Ask" className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo text-void-950">
            <FiSend className="text-sm" />
          </button>
        </form>
      </div>
    </>
  );
}
