import { useEffect, useState } from "react";

const STEPS = [
  "Initializing data world…",
  "Loading models · GPT · LangChain · MiniLM…",
  "Connecting pipelines & cloud…",
  "Compiling experience…",
  "Ready.",
];

export default function Loader() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setGone(true);
      return;
    }
    const stepT = setInterval(
      () => setStep((s) => Math.min(STEPS.length - 1, s + 1)),
      440
    );
    const progT = setInterval(
      () => setProgress((p) => Math.min(100, p + 3)),
      62
    );
    const fadeT = setTimeout(() => setFade(true), 2350);
    const goneT = setTimeout(() => setGone(true), 2850);
    return () => {
      clearInterval(stepT);
      clearInterval(progT);
      clearTimeout(fadeT);
      clearTimeout(goneT);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] grid place-items-center bg-canvas transition-opacity duration-500 ${
        fade ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative flex flex-col items-center">
        {/* spinning data core */}
        <div className="relative mb-8 h-24 w-24">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.25),transparent_64%)] [animation:corepulse_2.4s_ease-in-out_infinite]" />
          <svg className="spin-slow absolute inset-0 h-full w-full" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="40" stroke="#c7c1f3" strokeWidth="1" strokeDasharray="2 7" />
          </svg>
          <svg className="spin-rev absolute inset-0 h-full w-full" viewBox="0 0 96 96" fill="none">
            <circle cx="48" cy="48" r="28" stroke="#4b47d6" strokeWidth="1.5" strokeDasharray="22 10" />
            <circle cx="48" cy="20" r="2.5" fill="#6c68e8" />
            <circle cx="76" cy="48" r="2" fill="#38bdf8" />
            <circle cx="48" cy="76" r="2.5" fill="#2dd4bf" />
          </svg>
          <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand shadow-[0_12px_36px_-10px_rgba(75,71,214,0.6)]">
            <span className="-rotate-45 font-mono text-[0.5rem] font-bold tracking-widest text-white">RI</span>
          </div>
        </div>

        <p className="h-4 font-mono text-xs text-ink-500">{STEPS[step]}</p>

        <div className="mt-4 h-1 w-56 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
