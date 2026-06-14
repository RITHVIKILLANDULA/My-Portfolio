import { useState, useEffect, useRef, useCallback } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { HERO_NAME, HERO_ROLES, HERO_CONTENT, STATS } from "./constants";
import GuideBackdrop from "./components/guided/GuideBackdrop";
import GuideRobot from "./components/guided/GuideRobot";
import AISystemBoot from "./components/world/AISystemBoot";
import Counter from "./components/ui/Counter";
import DecodeText from "./components/ui/DecodeText";

import About from "./components/About";
import Skills from "./components/Skills";
import AgentBots from "./components/AgentBots";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";

/* ---- intro / hero step ------------------------------------------------- */
function HeroStep({ onOpenResume }) {
  const [role, setRole] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % HERO_ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="flex min-h-full flex-col justify-center py-16">
      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-data-cyan/30 bg-data-cyan/5 px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="mono-label text-[0.6rem] text-neutral-300">
          Open to AI / Data roles · Buffalo, NY
        </span>
      </div>
      <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl">
        <DecodeText text={HERO_NAME} start speed={1.1} />
      </h1>
      <div className="mt-5 flex h-10 items-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-data-cyan to-transparent" />
        <DecodeText key={role} text={HERO_ROLES[role]} start speed={0.8}
          className="gradient-text font-mono text-xl font-medium sm:text-3xl" />
      </div>
      <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-neutral-300">
        {HERO_CONTENT}
      </p>
      <div className="mt-10 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-void-700 bg-void-700/40 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="bg-void-900/60 p-5">
            <div className="font-mono text-3xl font-bold text-white">
              <Counter value={s.value} decimals={s.decimals} />
              <span className="gradient-text">{s.suffix}</span>
            </div>
            <div className="mono-label mt-2 text-[0.55rem] leading-tight text-neutral-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- the tour script --------------------------------------------------- */
const STEPS = [
  { id: "intro", label: "Intro", gesture: "wave", line: "Hi — I'm Rithvik's AI guide. Let me walk you through his world. Hit Next →", render: (p) => <HeroStep {...p} /> },
  { id: "about", label: "About", gesture: "yes", line: "First — who he is, and why teams call him when the data won't behave.", render: () => <About /> },
  { id: "skills", label: "Skills", gesture: "thumbsUp", line: "His toolkit — from raw SQL to LLM pipelines. Tap the categories to explore.", render: () => <Skills /> },
  { id: "agents", label: "AI Agents", gesture: "thumbsUp", line: "The AI agents he builds — fetch, analyze, tailor, review. Watch them light up.", render: () => <AgentBots /> },
  { id: "experience", label: "Experience", gesture: "yes", line: "Where he's done it — Deloitte, WAFU, and the University at Buffalo.", render: () => <Experience /> },
  { id: "projects", label: "Projects", gesture: "thumbsUp", line: "And what he's shipped — dashboards, pipelines and AI tools.", render: () => <Projects /> },
  { id: "contact", label: "Contact", gesture: "wave", line: "That's the tour! Reach out right here — he replies fast.", render: () => <Contact /> },
];

function useTypewriter(text) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
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

export default function GuidedExperience() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [step, setStep] = useState(0);
  const mainRef = useRef(null);
  const s = STEPS[step];
  const typed = useTypewriter(s.line);

  const go = useCallback(
    (n) => {
      setStep((cur) => Math.max(0, Math.min(STEPS.length - 1, n)));
      if (mainRef.current) mainRef.current.scrollTop = 0;
    },
    []
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") go(step + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") go(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, go]);

  return (
    <div className="fixed inset-0 flex text-neutral-300 antialiased">
      <GuideBackdrop />

      {/* GUIDE — the robot presenter */}
      <aside className="relative z-10 flex w-[300px] shrink-0 flex-col border-r border-white/[0.06] bg-black/20 backdrop-blur-sm lg:w-[340px]">
        <div className="flex items-center gap-2 px-6 pt-6">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-data-indigo/40 bg-data-indigo/10 font-display text-sm font-bold text-data-indigo">
            RI
          </span>
          <span className="mono-label text-[0.55rem] text-neutral-400">
            ai guide · live
          </span>
        </div>

        <div className="relative flex-1">
          <GuideRobot gesture={s.gesture} reduced={reduced} />
        </div>

        {/* speech bubble */}
        <div className="mx-5 mb-3 rounded-2xl border border-data-indigo/25 bg-[#0b0d1c]/80 p-4">
          <span className="mono-label text-[0.5rem] text-data-indigo/80">
            <span className="text-emerald-400">● </span>guide
          </span>
          <p className="mt-1.5 min-h-[3.2em] text-[0.82rem] leading-snug text-neutral-100">
            {typed}
          </p>
        </div>

        {/* nav */}
        <div className="flex items-center justify-between gap-2 px-5 pb-6">
          <button
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-neutral-300 transition-colors hover:border-data-cyan/50 disabled:opacity-30"
            aria-label="Previous"
          >
            <FiArrowLeft />
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((st, i) => (
              <button
                key={st.id}
                onClick={() => go(i)}
                aria-label={st.label}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-5 bg-data-cyan" : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => go(step + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-data-cyan to-data-indigo px-3.5 py-2 text-xs font-semibold text-void-950"
            >
              Next <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={() => go(0)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-neutral-200 hover:border-data-cyan/50"
            >
              ↻ Restart
            </button>
          )}
        </div>
      </aside>

      {/* CONTENT — the active animated section */}
      <main
        ref={mainRef}
        className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden"
      >
        <div className="mx-auto min-h-full max-w-5xl px-6 sm:px-10">
          <div key={step} className="guided-enter">
            <div className="mb-6 flex items-center gap-3 pt-8">
              <span className="mono-label text-[0.6rem] text-data-indigo/80">
                {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-data-indigo/40 to-transparent" />
              <span className="mono-label text-[0.6rem] text-neutral-500">
                {s.label}
              </span>
            </div>
            {s.render({})}
          </div>
        </div>
      </main>

      <AISystemBoot />
    </div>
  );
}
