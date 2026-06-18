import { useMemo } from "react";

/**
 * Pick a performance tier once at mount from device signals. Keeps the living
 * form on every device but scales geometry / postprocessing / interaction so it
 * holds ~60fps — and degrades to a static, composer-free sculpture under
 * reduced-motion.
 */
export default function useTier() {
  return useMemo(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
    const cores = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 8;
    const mem = (typeof navigator !== "undefined" && navigator.deviceMemory) || 8;
    const narrow = typeof window !== "undefined" && window.innerWidth < 1024;

    let detail = 48;
    let composer = true;
    let dpr = [1, 1.75];
    let interactive = true;

    if (coarse || narrow || cores <= 6) {
      detail = 24;
      dpr = [1, 1.5];
      interactive = !coarse;
      composer = cores > 4;
    }
    if (cores <= 4 || mem <= 4) {
      detail = 16;
      composer = false;
    }
    if (reduced) {
      composer = false;
      interactive = false;
    }

    return { reduced, detail, composer, dpr, interactive };
  }, []);
}
