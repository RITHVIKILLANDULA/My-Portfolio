import {
  Suspense,
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, ContactShadows, Float } from "@react-three/drei";

const ROBOT_URL = `${import.meta.env.BASE_URL}robot.glb`;
useGLTF.preload(ROBOT_URL);

// Real clip names baked into the Quaternius CC0 robot (verified from the GLB).
const CLIP = {
  idle: "RobotArmature|Robot_Idle",
  wave: "RobotArmature|Robot_Wave",
  yes: "RobotArmature|Robot_Yes",
  thumbsUp: "RobotArmature|Robot_ThumbsUp",
  no: "RobotArmature|Robot_No",
  dance: "RobotArmature|Robot_Dance",
};

// The guided tour — ids must match the section anchors in App/sections.
const TOUR = [
  {
    id: "home",
    line: "Hey — I'm Rithvik's AI guide. Every node up here is a live record entering his pipeline.",
    clip: "wave",
  },
  {
    id: "about",
    line: "Four years turning messy, multi-source data into decisions people actually trust.",
    clip: "yes",
  },
  {
    id: "skills",
    line: "Python, SQL, BigQuery and LLMs — this is where he plays. Drag the sphere if you like.",
    clip: "thumbsUp",
  },
  {
    id: "agents",
    line: "Watch the agents light up: Fetch, Analyze, Tailor, Review — autonomous, end to end.",
    clip: "thumbsUp",
  },
  {
    id: "experience",
    line: "Deloitte, WAFU, University at Buffalo — 1M+ records, nightly runs cut to 35 minutes.",
    clip: "yes",
  },
  {
    id: "projects",
    line: "And this is what ships out the other end. Take a look around.",
    clip: "thumbsUp",
  },
  {
    id: "contact",
    line: "That's the tour! Reach out down here — he replies fast. Thanks for stopping by.",
    clip: "wave",
  },
];

const GREETING = "Hi — want a 60-second guided tour of Rithvik's data world?";

/* -------------------------------------------------------------------------- */
/* 3D model                                                                    */
/* -------------------------------------------------------------------------- */
function RobotModel({ clip, yaw }) {
  const group = useRef();
  const { scene, animations } = useGLTF(ROBOT_URL);
  const { actions } = useAnimations(animations, group);

  // Auto-fit: this GLB renders ~4.4u tall via armature-node transforms, so
  // normalize it to a known height and recenter at the origin. Idempotent
  // across remounts because we multiply the *current* scale (no-op once fit).
  useEffect(() => {
    const root = scene;
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    if (size.y > 0.001) root.scale.multiplyScalar(2.0 / size.y);
    root.updateWorldMatrix(true, true);
    const box2 = new THREE.Box3().setFromObject(root);
    const center = new THREE.Vector3();
    box2.getCenter(center);
    root.position.x -= center.x;
    root.position.y -= center.y;
    root.position.z -= center.z;
  }, [scene]);

  // Crossfade to the requested gesture, then settle back into Idle on loop.
  useEffect(() => {
    const target = actions[CLIP[clip]] || actions[CLIP.idle];
    const idle = actions[CLIP.idle];
    if (!target) return;
    target.reset().fadeIn(0.3).play();
    // one-shot gestures fall back to idle so the robot is never frozen
    const oneShot = clip !== "idle" && clip !== "dance";
    if (oneShot && idle) {
      target.setLoop(2200, 1); // LoopOnce
      target.clampWhenFinished = true;
      const t = setTimeout(() => {
        idle.reset().fadeIn(0.4).play();
        target.fadeOut(0.4);
      }, 1700);
      return () => clearTimeout(t);
    }
    return () => target.fadeOut(0.3);
  }, [clip, actions]);

  // Gentle turn toward the section being described (never toward the cursor).
  useFrame((_, dt) => {
    if (!group.current) return;
    const k = Math.min(1, dt * 3);
    group.current.rotation.y += (yaw - group.current.rotation.y) * k;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

function RobotCanvas({ clip, yaw, lit }) {
  return (
    <Canvas
      // never gate the loop on document.hidden — the preview harness reports it true
      frameloop="always"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 30 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* explicit 3-point lighting — no CDN HDR dependency */}
      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#c7d2fe", "#1e1b4b", 0.8]} />
      <directionalLight position={[3, 6, 5]} intensity={2.2} color="#eef2ff" />
      <directionalLight position={[-5, 2, -1]} intensity={1.1} color="#22d3ee" />
      <pointLight position={[0, 1.5, 3]} intensity={1.4} color="#818cf8" />
      <Suspense fallback={null}>
        <Float
          speed={1.4}
          rotationIntensity={0.12}
          floatIntensity={lit ? 0.5 : 0.25}
        >
          <RobotModel clip={clip} yaw={yaw} />
        </Float>
      </Suspense>
      <ContactShadows
        position={[0, -1.02, 0]}
        opacity={0.4}
        scale={5}
        blur={2.6}
        far={3}
        color="#4338ca"
      />
    </Canvas>
  );
}

/* -------------------------------------------------------------------------- */
/* Error boundary → CSS fallback robot so a GPU/asset failure never blanks     */
/* -------------------------------------------------------------------------- */
class CanvasBoundary extends Component {
  constructor(p) {
    super(p);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function FallbackBot() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="robot-fallback" aria-hidden="true">
        <span className="robot-fallback__eye" />
        <span className="robot-fallback__eye" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Typewriter                                                                  */
/* -------------------------------------------------------------------------- */
function useTypewriter(text, on) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!on || !text) {
      setOut(text || "");
      return;
    }
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [text, on]);
  return out;
}

/* -------------------------------------------------------------------------- */
/* Tour guide                                                                  */
/* -------------------------------------------------------------------------- */
export default function RobotGuide() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [phase, setPhase] = useState("greet"); // greet|running|paused|docked|min
  const [step, setStep] = useState(0);
  const [clip, setClip] = useState("wave");
  const [line, setLine] = useState(GREETING);
  const [yaw, setYaw] = useState(0.25);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const advanceRef = useRef(null); // setTimeout id for auto-advance
  const progRef = useRef(false); // true while we are scrolling the page ourselves
  const progClearRef = useRef(null);

  const typed = useTypewriter(line, phase !== "min");

  const clearTimers = () => {
    if (advanceRef.current) {
      clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
    if (progClearRef.current) {
      clearTimeout(progClearRef.current);
      progClearRef.current = null;
    }
  };

  const highlight = (id, on) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("tour-highlight", on);
  };

  // Native smooth-scroll (no GSAP ticker dependency → reliable everywhere).
  const goTo = useCallback(
    (idx) => {
      clearTimers();
      if (idx >= TOUR.length) {
        setPhase("docked");
        setClip("yes");
        setLine("That's the data world. Replay the tour anytime!");
        return;
      }
      const stop = TOUR[idx];
      setStep(idx);
      setClip(stop.clip);
      setLine(stop.line);
      setYaw(idx % 2 ? -0.32 : 0.32);

      const el = document.getElementById(stop.id);
      if (el) {
        const y = Math.max(
          0,
          el.getBoundingClientRect().top + window.scrollY - 72
        );
        progRef.current = true; // mark our own scroll so it doesn't self-pause
        window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
        progClearRef.current = setTimeout(
          () => (progRef.current = false),
          reduced ? 60 : 1200
        );
      }

      highlight(stop.id, true);
      advanceRef.current = setTimeout(() => {
        highlight(stop.id, false);
        if (phaseRef.current === "running") goTo(idx + 1);
      }, Math.max(3800, stop.line.length * 60));
    },
    [reduced]
  );

  const startTour = () => {
    setPhase("running");
    goTo(0);
  };
  const resume = () => {
    setPhase("running");
    goTo(step);
  };
  const next = () => phase === "running" && goTo(step + 1);
  const prev = () => phase === "running" && goTo(Math.max(0, step - 1));
  const pause = () => {
    clearTimers();
    setPhase("paused");
    setClip("idle");
    setLine("Paused — tap ▶ when you want me to keep going.");
  };
  const skip = () => {
    clearTimers();
    TOUR.forEach((t) => highlight(t.id, false));
    setPhase("docked");
    setClip("idle");
    setLine("No problem — tap below if you want the tour later.");
  };
  const relaunch = () => {
    setPhase("greet");
    setClip("wave");
    setLine("Want me to run the tour again?");
  };

  // Pause politely the instant the visitor takes the wheel mid-tour.
  useEffect(() => {
    if (phase !== "running") return;
    const onUser = () => {
      if (!progRef.current) pause();
    };
    const onKey = (e) => {
      if (
        !progRef.current &&
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(e.key)
      )
        pause();
    };
    window.addEventListener("wheel", onUser, { passive: true });
    window.addEventListener("touchmove", onUser, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onUser);
      window.removeEventListener("touchmove", onUser);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase]);

  useEffect(() => () => clearTimers(), []);

  const expanded = phase === "greet" || phase === "running" || phase === "paused";
  const minimized = phase === "min";

  return (
    <div
      className={`robot-pill robot-pill--${phase} ${
        expanded ? "is-expanded" : ""
      }`}
      role="complementary"
      aria-label="AI tour guide"
    >
      {/* speech bubble */}
      {!minimized && line && (
        <div className="robot-bubble" role="status" aria-live="polite">
          <span className="robot-bubble__tag">AI guide</span>
          <p>{typed}</p>

          {phase === "greet" && (
            <div className="robot-bubble__actions">
              <button className="rb-btn rb-btn--primary" onClick={startTour}>
                Take the tour
              </button>
              <button className="rb-btn" onClick={skip}>
                I'll explore
              </button>
            </div>
          )}
          {phase === "running" && (
            <div className="robot-bubble__actions robot-bubble__actions--mini">
              <button className="rb-icon" onClick={prev} aria-label="Previous">
                ‹
              </button>
              <span className="robot-bubble__progress">
                {step + 1}/{TOUR.length}
              </span>
              <button className="rb-icon" onClick={pause} aria-label="Pause">
                ❚❚
              </button>
              <button className="rb-icon" onClick={next} aria-label="Next">
                ›
              </button>
              <button className="rb-icon" onClick={skip} aria-label="Skip tour">
                ✕
              </button>
            </div>
          )}
          {phase === "paused" && (
            <div className="robot-bubble__actions robot-bubble__actions--mini">
              <button className="rb-btn rb-btn--primary" onClick={resume}>
                ▶ Resume
              </button>
              <button className="rb-btn" onClick={skip}>
                End tour
              </button>
            </div>
          )}
          {phase === "docked" && line && (
            <div className="robot-bubble__actions">
              <button className="rb-btn rb-btn--primary" onClick={relaunch}>
                ↻ Replay tour
              </button>
            </div>
          )}
        </div>
      )}

      {/* stage */}
      <div className="robot-stage" data-cursor>
        {!minimized &&
          (!reduced ? (
            <CanvasBoundary fallback={<FallbackBot />}>
              <RobotCanvas clip={clip} yaw={yaw} lit={expanded} />
            </CanvasBoundary>
          ) : (
            <FallbackBot />
          ))}

        {/* dock / minimize affordances */}
        {!minimized ? (
          <button
            className="robot-mini"
            onClick={() => setPhase("min")}
            aria-label="Minimize guide"
            title="Minimize"
          >
            –
          </button>
        ) : (
          <button
            className="robot-restore"
            onClick={() => setPhase(step > 0 ? "docked" : "greet")}
            aria-label="Open guide"
            title="Open guide"
          >
            <span className="robot-restore__dot" />
            Guide
          </button>
        )}
      </div>
    </div>
  );
}
