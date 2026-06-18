import { useEffect, useState } from "react";

/**
 * The console's one perpetual motion: a calm HH:MM:SS countdown to the next
 * nightly run (the local `targetHour`). Visibility-aware (no wasted ticks when
 * the tab is hidden — it recomputes from the clock on resume), and frozen to a
 * static readout under prefers-reduced-motion.
 */
export default function useCountdown(targetHour = 2) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const compute = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(targetHour, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const s = Math.max(0, Math.floor((next - now) / 1000));
    const p = (n) => String(n).padStart(2, "0");
    return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
  };

  const [t, setT] = useState(compute);

  useEffect(() => {
    if (reduced) return;
    let id;
    const start = () => {
      stop();
      setT(compute());
      id = setInterval(() => setT(compute()), 1000);
    };
    const stop = () => id && clearInterval(id);
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  return reduced ? "06:00:00" : t;
}
