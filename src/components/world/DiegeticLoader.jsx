import { useEffect, useState } from "react";

const STAGES = [
  "Initializing the refinery",
  "Threading the data shaft",
  "Bringing the guide online",
];

export default function DiegeticLoader() {
  const [stage, setStage] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 750);
    const t2 = setTimeout(() => setStage(2), 1500);
    const t3 = setTimeout(() => setGone(true), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-[#05060d] transition-opacity duration-700 ${
        gone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <span className="mono-label mb-6 text-[0.6rem] text-data-indigo/80">
          the deep stack
        </span>
        <span className="relative mb-6 h-12 w-12">
          <span className="absolute inset-0 rounded-full border-2 border-data-indigo/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-data-cyan" />
        </span>
        <span className="font-mono text-xs text-neutral-400">
          {STAGES[stage]}
          <span className="animate-pulse">…</span>
        </span>
      </div>
    </div>
  );
}
