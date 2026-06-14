import { useRef } from "react";

/**
 * Animated, 3D holographic portrait — mouse-tilt parallax, iridescent frame,
 * a light sweep, holographic tint, cursor glare, scan line and floating motion.
 * Used in About and the résumé reel so the photo feels alive, not a flat 2D.
 */
export default function HoloPortrait({ src, alt = "", className = "", float = true }) {
  const cardRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 14}deg) rotateY(${
      (px - 0.5) * 14
    }deg)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const reset = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className={`relative ${className}`}
      style={float ? { animation: "holoFloat 6s ease-in-out infinite" } : undefined}
    >
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={reset}
        data-cursor
        className="group relative overflow-hidden rounded-[1.4rem] shadow-[0_30px_80px_-30px_rgba(124,58,237,0.6)] transition-transform duration-200 ease-out [transform-style:preserve-3d]"
        style={{ transform: "perspective(900px)" }}
      >
        {/* iridescent frame */}
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[1.4rem]"
          style={{
            padding: "1.5px",
            background: "linear-gradient(135deg,#7c3aed,#2563eb,#06b6d4,#db2777)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <img
          src={src}
          alt={alt}
          className="block aspect-[4/5] w-full object-cover"
        />

        {/* holographic tint */}
        <div
          className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
          style={{
            background:
              "linear-gradient(140deg, rgba(124,58,237,.55), rgba(6,182,212,.3), rgba(219,39,119,.45))",
          }}
        />
        {/* cursor glare */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(320px circle at var(--mx,50%) var(--my,30%), rgba(255,255,255,.22), transparent 50%)",
          }}
        />
        {/* light sweep */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div
            className="absolute -inset-y-6 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            style={{ animation: "holoSweep 5s ease-in-out infinite" }}
          />
        </div>
        {/* scan line */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div className="absolute inset-x-0 h-14 animate-scan bg-gradient-to-b from-transparent via-holo-ice/25 to-transparent" />
        </div>

        {/* HUD chips (parallax depth) */}
        <div
          className="mono-label absolute left-3 top-3 z-30 flex items-center gap-1.5 rounded bg-black/40 px-2 py-1 text-[0.5rem] text-holo-ice backdrop-blur-sm"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-emerald-400" />
          live · agent
        </div>
        <div
          className="mono-label absolute inset-x-3 bottom-3 z-30 flex items-center justify-between rounded bg-black/45 px-2.5 py-1.5 text-[0.5rem] text-neutral-200 backdrop-blur-sm"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="gradient-text">rithvik.illandula</span>
          <span className="text-emerald-400">online ▸</span>
        </div>
      </div>
    </div>
  );
}
