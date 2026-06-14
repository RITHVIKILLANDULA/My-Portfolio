import { useEffect, useRef, useState } from "react";

/**
 * Reliable scroll-into-view trigger. Primary mechanism is a native
 * IntersectionObserver; a passive scroll/resize listener + an initial timeout
 * act as fallbacks so content reveals even where IO is throttled, on deep-links,
 * fast flings, or programmatic scrolls. Reveals once, then removes all listeners.
 */
export default function useReveal({ threshold = 0.12, margin = 0.92 } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    let io = null;
    let t = 0;

    const cleanup = () => {
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(t);
    };
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      cleanup();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * margin && r.bottom > 0) reveal();
    };

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) reveal();
        },
        { threshold, rootMargin: "0px 0px -6% 0px" }
      );
      io.observe(el);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    t = setTimeout(onScroll, 120); // catch already-in-view / deep-link

    return cleanup;
  }, [threshold, margin]);

  return [ref, shown];
}
