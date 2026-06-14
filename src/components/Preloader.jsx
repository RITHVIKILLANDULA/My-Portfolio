import { useEffect, useState } from "react";

const BOOT_LINES = [
  "> establishing connection to data world",
  "> loading 1,000,000 records",
  "> spinning up neural lattice",
  "> calibrating dashboards",
  "> render complete",
];

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [fading, setFading] = useState(false); // start CSS fade-out
  const [removed, setRemoved] = useState(false); // fully unmount

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const total = reduced ? 400 : 1900;
    const t0 = performance.now();
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      onDone?.();
      setFading(true);
      // Guaranteed unmount — never depends on an animation callback firing.
      setTimeout(() => setRemoved(true), 650);
    };

    const tick = (now) => {
      const p = Math.min((now - t0) / total, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setProgress(Math.round(eased * 100));
      setLine(
        Math.min(BOOT_LINES.length - 1, Math.floor(eased * BOOT_LINES.length))
      );
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 260);
    };
    raf = requestAnimationFrame(tick);

    // Hard safety net: no matter what, tear the preloader down.
    const guard = setTimeout(finish, total + 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(guard);
    };
  }, [onDone]);

  if (removed) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void-950"
      style={{
        opacity: fading ? 0 : 1,
        filter: fading ? "blur(8px)" : "none",
        pointerEvents: fading ? "none" : "auto",
        transition: "opacity .6s ease-in-out, filter .6s ease-in-out",
      }}
    >
      <div className="absolute inset-0 data-floor opacity-30" />

      {/* spinning rings */}
      <div className="relative mb-10 h-28 w-28">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-data-cyan/40 border-t-data-cyan" />
        <div className="absolute inset-3 animate-spin-slower rounded-full border border-data-indigo/30 border-b-data-indigo" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-2xl font-bold text-data-cyan tabular-nums">
            {progress}
          </span>
        </div>
        <div className="absolute inset-[42%] animate-pulseGlow rounded-full bg-data-cyan blur-[6px]" />
      </div>

      <div className="mono-label mb-6 text-xs text-neutral-300">
        R · I — DATA WORLD
      </div>

      <div className="h-4 font-mono text-[0.7rem] text-data-cyan/80">
        {BOOT_LINES[line]}
      </div>

      {/* progress bar */}
      <div className="mt-6 h-px w-64 overflow-hidden bg-void-700">
        <div
          className="h-full bg-gradient-to-r from-data-cyan via-data-sky to-data-violet"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
