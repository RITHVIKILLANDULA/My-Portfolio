import heroPortrait from "../assets/Hero-portrait.jpg";

/**
 * A cool, techie avatar built from the real headshot: warm-graded portrait in a
 * glowing forged ring with a slow-rotating dashed tech bezel, faint scanlines,
 * and an "online" status pulse. Recognizably him, but reads engineer-sharp.
 */
export default function ForgeAvatar({ size = 220, online = true, className = "" }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* rotating dashed tech bezel */}
      <svg className="spin-slow absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="48.5" stroke="#ff7a2f" strokeOpacity="0.55" strokeWidth="0.6" strokeDasharray="1.5 4" />
      </svg>
      <svg className="spin-rev absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="45" stroke="#ffb061" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="14 9" />
      </svg>

      {/* portrait disc */}
      <div className="avatar-glow absolute inset-[7%] overflow-hidden rounded-full border border-forge/30">
        <img
          src={heroPortrait}
          alt="Rithvik Illandula"
          className="h-full w-full object-cover"
          style={{ filter: "grayscale(0.45) sepia(0.5) saturate(1.5) hue-rotate(-12deg) contrast(1.08) brightness(0.95)" }}
        />
        {/* forge tint + vignette */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(120% 120% at 50% 18%, transparent 45%, rgba(8,7,10,0.7) 100%)" }} />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(180deg, rgba(255,122,47,0.3), rgba(255,122,47,0))" }} />
        {/* static scanlines */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 3px)" }}
        />
        {/* sweeping scan */}
        <div className="scanmove absolute inset-x-0 h-1/3" style={{ background: "linear-gradient(180deg, transparent, rgba(255,176,97,0.12), transparent)" }} />
      </div>

      {/* online status */}
      {online && (
        <span className="absolute bottom-[10%] right-[10%] grid h-[12%] w-[12%] min-h-3 min-w-3 place-items-center rounded-full border-2" style={{ background: "#08070a", borderColor: "#08070a" }}>
          <span className="relative grid h-full w-full place-items-center">
            <span className="absolute h-full w-full animate-ping rounded-full" style={{ background: "rgba(52,211,153,0.5)" }} />
            <span className="h-2/3 w-2/3 rounded-full" style={{ background: "#34d399" }} />
          </span>
        </span>
      )}
    </div>
  );
}
