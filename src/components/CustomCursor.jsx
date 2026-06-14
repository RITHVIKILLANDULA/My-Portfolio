import { useEffect, useRef, useState } from "react";

/**
 * A glowing dot with a trailing ring that enlarges over interactive elements.
 * Desktop / fine-pointer only — touch devices keep their native behavior.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.body.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot) dot.style.transform = `translate(${mx}px, ${my}px)`;
    };
    const over = (e) => {
      const t = e.target;
      if (t.closest("a, button, [data-cursor], input, textarea, .chip")) {
        ring?.classList.add("cursor-grow");
      }
    };
    const out = (e) => {
      const t = e.target;
      if (t.closest("a, button, [data-cursor], input, textarea, .chip")) {
        ring?.classList.remove("cursor-grow");
      }
    };
    const down = () => ring?.classList.add("cursor-press");
    const up = () => ring?.classList.remove("cursor-press");

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring) ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.body.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-data-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.9)]"
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998] -ml-4 -mt-4 h-8 w-8 rounded-full border border-data-indigo/70 transition-[width,height,background-color,border-color,opacity] duration-200"
      />
      <style>{`
        .cursor-ring.cursor-grow {
          width: 3.2rem; height: 3.2rem;
          margin-left: -1.6rem; margin-top: -1.6rem;
          border-color: rgba(34,211,238,0.8);
          background: rgba(34,211,238,0.08);
        }
        .cursor-ring.cursor-press { transform-origin: center; opacity: 0.5; }
      `}</style>
    </>
  );
}
