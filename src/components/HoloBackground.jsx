import { useEffect, useRef } from "react";

/**
 * Holographic-chrome backdrop: drifting iridescent gradient blobs, a slowly
 * rotating chrome-shimmer layer, a cursor-following glow, fine grain + grid.
 * Pure CSS/transform — GPU-friendly, reliable, no WebGL.
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
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
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
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060611]">
      {/* drifting iridescent blobs */}
      <div
        className="absolute -left-[10%] -top-[15%] h-[60vw] w-[60vw] rounded-full opacity-50 blur-[110px]"
        style={{
          background: "radial-gradient(circle, #7c3aed, transparent 65%)",
          animation: "blobA 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-[12%] top-[5%] h-[55vw] w-[55vw] rounded-full opacity-45 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #2563eb, transparent 65%)",
          animation: "blobB 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[20%] h-[55vw] w-[55vw] rounded-full opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #06b6d4, transparent 65%)",
          animation: "blobC 26s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[5%] right-[8%] h-[42vw] w-[42vw] rounded-full opacity-40 blur-[110px]"
        style={{
          background: "radial-gradient(circle, #db2777, transparent 65%)",
          animation: "blobA 24s ease-in-out infinite reverse",
        }}
      />

      {/* rotating chrome shimmer */}
      <div
        className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.12] blur-[90px] mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 0deg, #7c3aed, #2563eb, #06b6d4, #db2777, #7c3aed)",
          animation: "holoSpin 40s linear infinite",
        }}
      />

      {/* cursor-following glow */}
      <div
        ref={followRef}
        className="pointer-events-none absolute left-0 top-0 h-[40vw] w-[40vw] rounded-full opacity-30 blur-[100px]"
        style={{
          background: "radial-gradient(circle, #c4b5fd, transparent 60%)",
        }}
      />

      {/* fine grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* grid + vignette */}
      <div className="data-floor absolute bottom-0 left-0 right-0 h-[55vh] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_45%,rgba(6,6,17,0.85))]" />
    </div>
  );
}
