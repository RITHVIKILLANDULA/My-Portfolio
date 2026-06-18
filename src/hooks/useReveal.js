import { useEffect, useRef, useState } from "react";

/**
 * Reliable scroll-into-view trigger. An IntersectionObserver does the work; a
 * single delayed in-view check covers already-visible / deep-linked content.
 * No persistent scroll/resize listeners (those thrash layout under smooth
 * scroll). Reveals once, then disconnects.
 */
export default function useReveal({ threshold = 0.14, margin = 0.92 } = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    let io = null;
    let t = 0;
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      if (io) io.disconnect();
      clearTimeout(t);
    };

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) reveal();
        },
        { threshold, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    // catch content already in view on load / deep-link (one check, no listener)
    t = setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * margin && r.bottom > 0) reveal();
    }, 160);

    return () => {
      if (io) io.disconnect();
      clearTimeout(t);
    };
  }, [threshold, margin]);

  return [ref, shown];
}
