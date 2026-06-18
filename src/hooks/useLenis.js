import { useEffect } from "react";
import Lenis from "lenis";
import { frame, cancelFrame } from "framer-motion";

/**
 * The single smooth-scroll engine. Lenis adds the momentum/inertia that makes an
 * Apple-style scroll feel buttery, driven off framer-motion's frame loop so any
 * scroll-linked transforms stay in lockstep. Bails entirely under
 * prefers-reduced-motion and never touches touch scrolling (syncTouch:false), so
 * mobile keeps its native feel. Also routes in-page anchor clicks through Lenis.
 */
export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
    });
    window.lenis = lenis;

    const update = (data) => lenis.raf(data.timestamp);
    frame.update(update, true);

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: 0 });
        }
      } else if (id === "#top") {
        e.preventDefault();
        lenis.scrollTo(0);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelFrame(update);
      document.removeEventListener("click", onClick);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);
}
