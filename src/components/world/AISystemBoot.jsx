import { useEffect, useState } from "react";

const BOOT = [
  "$ init neural_core --profile=rithvik",
  "loading models … GPT · LangChain · Vertex AI            [ok]",
  "connecting data streams … BigQuery · Spark · Airflow    [ok]",
  "calibrating 1,000,000+ records … anomaly scan           [ok]",
  "propagating weights … 7 layers online                   [ok]",
  "rendering interface …                                    [ok]",
];

export default function AISystemBoot() {
  const [step, setStep] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timers = [];
    BOOT.forEach((_, i) =>
      timers.push(setTimeout(() => setStep(i + 1), 400 + i * 420))
    );
    timers.push(setTimeout(() => setReveal(true), 400 + BOOT.length * 420));
    timers.push(setTimeout(() => setGone(true), 1100 + BOOT.length * 420));
    return () => timers.forEach(clearTimeout);
  }, []);

  const pct = Math.round((step / BOOT.length) * 100);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#04050c] transition-opacity duration-[900ms] ${
        gone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* faint data grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.08) 1px,transparent 1px)",
          backgroundSize: "46px 46px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%,#000 30%,transparent 80%)",
        }}
      />

      {/* name reveal */}
      <div
        className="pointer-events-none absolute inset-0 grid place-items-center transition-all duration-700"
        style={{
          opacity: reveal ? 1 : 0,
          transform: reveal ? "scale(1)" : "scale(0.94)",
        }}
      >
        <div className="text-center">
          <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Rithvik Illandula
          </h1>
          <p className="gradient-text mt-3 font-mono text-lg sm:text-2xl">
            AI Data Analyst
          </p>
        </div>
      </div>

      {/* terminal */}
      <div
        className="relative w-[min(92vw,640px)] rounded-2xl border border-data-indigo/25 bg-black/40 p-6 font-mono text-[0.72rem] leading-relaxed text-neutral-300 backdrop-blur-md transition-all duration-500"
        style={{
          opacity: reveal ? 0 : 1,
          transform: reveal ? "translateY(-16px)" : "translateY(0)",
        }}
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-data-cyan/70" />
          <span className="mono-label text-[0.5rem] text-neutral-500">
            neural_core · boot
          </span>
        </div>
        {BOOT.slice(0, step).map((l, i) => (
          <div key={i} className="flex">
            <span className="mr-2 text-data-indigo">›</span>
            <span
              className={
                l.includes("[ok]") ? "text-neutral-300" : "text-data-cyan"
              }
            >
              {l.replace("[ok]", "")}
              {l.includes("[ok]") && (
                <span className="text-emerald-400">[ok]</span>
              )}
            </span>
          </div>
        ))}
        {step < BOOT.length && (
          <span className="ml-4 inline-block animate-pulse text-data-cyan">▌</span>
        )}

        {/* progress */}
        <div className="mt-5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-data-indigo to-data-cyan transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[0.6rem] text-neutral-500">{pct}%</span>
        </div>
      </div>

      <button
        onClick={() => setGone(true)}
        className="absolute bottom-6 right-6 font-mono text-[0.6rem] text-neutral-500 transition-colors hover:text-data-cyan"
      >
        skip intro →
      </button>
    </div>
  );
}
