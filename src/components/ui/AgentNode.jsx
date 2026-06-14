/**
 * A small animated "AI agent" node — a blinking bot inside pulsing rings.
 * Replaces org logos / monograms with an on-theme, animated motif.
 */
export default function AgentNode({ className = "", accent = "#22d3ee" }) {
  return (
    <span
      className={`relative grid shrink-0 place-items-center ${className}`}
      aria-hidden="true"
    >
      <span
        className="absolute inset-0 animate-ping rounded-full border"
        style={{ borderColor: `${accent}40` }}
      />
      <span
        className="absolute inset-[14%] rounded-full border"
        style={{ borderColor: "rgba(99,102,241,0.4)" }}
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-3/5 w-3/5"
        style={{ color: accent, filter: `drop-shadow(0 0 6px ${accent}b0)` }}
      >
        <line
          x1="12"
          y1="4.5"
          x2="12"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="4" r="1.3" fill="currentColor" />
        <rect
          x="5"
          y="8"
          width="14"
          height="10"
          rx="3"
          fill={`${accent}14`}
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle className="agent-eye" cx="9.5" cy="13" r="1.5" fill="currentColor" />
        <circle
          className="agent-eye"
          cx="14.5"
          cy="13"
          r="1.5"
          fill="currentColor"
          style={{ animationDelay: "0.15s" }}
        />
      </svg>
    </span>
  );
}
