import { useEffect, useRef } from "react";

/**
 * Premium, restrained backdrop — deep near-black with two indigo/blue light
 * pools, a single cool data accent, a fine drifting data-grid, a slow scan
 * beam, and a soft cursor-tracking glow. One accent family (indigo → cyan),
 * no rainbow. Pure CSS/transform — GPU-friendly, no WebGL.
 */
export default function HoloBackground() {
  const followRef = useRef(null);

  useEffect(() => {
    const el = followRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.35;
    let x = tx;
    let y = ty;
    let raf = 0;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      x += (tx - x) * 0.05;
      y += (ty - y) * 0.05;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#05060d]">
      {/* base wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(67,56,202,0.28),transparent_60%)]" />

      {/* indigo light pool (top-left) */}
      <div
        className="absolute -left-[12%] -top-[18%] h-[58vw] w-[58vw] rounded-full opacity-50 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #4338ca, transparent 66%)",
          animation: "blobA 24s ease-in-out infinite",
        }}
      />
      {/* deeper blue pool (right) */}
      <div
        className="absolute -right-[14%] top-[8%] h-[52vw] w-[52vw] rounded-full opacity-40 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #1d4ed8, transparent 66%)",
          animation: "blobB 30s ease-in-out infinite",
        }}
      />
      {/* single cool data accent (low, subtle) */}
      <div
        className="absolute bottom-[-22%] left-[26%] h-[46vw] w-[46vw] rounded-full opacity-25 blur-[130px]"
        style={{
          background: "radial-gradient(circle, #0891b2, transparent 68%)",
          animation: "blobC 34s ease-in-out infinite",
        }}
      />

      {/* cursor-tracking glow */}
      <div
        ref={followRef}
        className="pointer-events-none absolute left-0 top-0 h-[36vw] w-[36vw] rounded-full opacity-20 blur-[110px]"
        style={{
          background: "radial-gradient(circle, #818cf8, transparent 62%)",
        }}
      />

      {/* fine drifting data grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(129,140,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.06) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "radial-gradient(ellipse 75% 70% at 50% 40%, #000 25%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 70% at 50% 40%, #000 25%, transparent 80%)",
          animation: "gridDrift 26s linear infinite",
        }}
      />

      {/* slow vertical scan beam */}
      <div
        className="absolute inset-x-0 top-0 h-[34vh] opacity-[0.07] mix-blend-screen"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(129,140,248,0.9), transparent)",
          animation: "scanBeam 11s ease-in-out infinite",
        }}
      />

      {/* fine grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_42%,rgba(5,6,13,0.92))]" />
    </div>
  );
}
