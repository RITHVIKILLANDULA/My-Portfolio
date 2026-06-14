import { useEffect } from "react";
import Lenis from "lenis";
import { scroll } from "../state/scroll";

/**
 * Buttery smooth scroll over the tall (700vh) descent spacer. Writes
 * progress (0→1) and a normalized velocity into the `scroll` singleton on
 * every frame; world components read it inside their own useFrame. Real
 * native scroll only — no programmatic scrollTo (which the harness blocks).
 */
export default function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      scroll.raw = lenis.scroll;
      scroll.progress = Number.isFinite(lenis.progress) ? lenis.progress : 0;
      scroll.velocity = Math.min(Math.abs(lenis.velocity) / 30, 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      scroll.progress = 0;
      scroll.velocity = 0;
    };
  }, [enabled]);
}
