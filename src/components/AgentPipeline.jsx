const STAGES = [
  { key: "fetch", label: "Fetch", sub: "ingest + profile", x: 90 },
  { key: "analyze", label: "Analyze", sub: "validate + score", x: 330 },
  { key: "tailor", label: "Tailor", sub: "model + reason", x: 570 },
  { key: "review", label: "Review", sub: "reconcile + ship", x: 810 },
];

const Y = 110;
const WIRE = `M${STAGES[0].x},${Y} H${STAGES[STAGES.length - 1].x}`;
const SPAN = 3.4; // seconds for one packet to traverse the wire

/**
 * The living pipeline: the wire draws itself, nodes breathe, and glowing data
 * packets stream Fetch → Analyze → Tailor → Review on a loop. Pure SVG + SMIL +
 * CSS — no JS render loop, so it runs at 60fps everywhere and on mobile.
 */
export default function AgentPipeline() {
  return (
    <svg
      viewBox="0 0 900 220"
      className="pl-svg w-full"
      role="img"
      aria-label="Autonomous data pipeline: Fetch, Analyze, Tailor, Review"
    >
      <defs>
        <linearGradient id="plWire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <filter id="plGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* connecting wire — draws itself in */}
      <path
        id="plWirePath"
        className="pl-wire"
        d={WIRE}
        fill="none"
        stroke="url(#plWire)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* travelling data packets (SMIL — native, no rAF) */}
      {[
        { c: "#22d3ee", b: "0s" },
        { c: "#818cf8", b: `${(SPAN / 3).toFixed(2)}s` },
        { c: "#a5f3fc", b: `${((SPAN * 2) / 3).toFixed(2)}s` },
      ].map((p, i) => (
        <circle key={i} r="5" fill={p.c} filter="url(#plGlow)">
          <animateMotion dur={`${SPAN}s`} begin={p.b} repeatCount="indefinite">
            <mpath href="#plWirePath" />
          </animateMotion>
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.12;0.85;1"
            dur={`${SPAN}s`}
            begin={p.b}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* nodes */}
      {STAGES.map((s, i) => (
        <g key={s.key} transform={`translate(${s.x}, ${Y})`}>
          <circle
            className="pl-core"
            r="14"
            fill="#6366f1"
            filter="url(#plGlow)"
            style={{ animationDelay: `${i * 0.45}s` }}
          />
          <circle r="26" fill="#0a0d1a" stroke="url(#plWire)" strokeWidth="2" />
          <circle r="26" fill="none" stroke="#6366f1" strokeWidth="6" opacity="0.08" />
          <text
            textAnchor="middle"
            dy="5"
            fill="#c7d2fe"
            fontSize="13"
            fontFamily="'JetBrains Mono', monospace"
          >
            0{i + 1}
          </text>
          <text
            textAnchor="middle"
            dy="58"
            fill="#f1f5f9"
            fontSize="17"
            fontWeight="600"
            fontFamily="'Space Grotesk', sans-serif"
          >
            {s.label}
          </text>
          <text
            textAnchor="middle"
            dy="78"
            fill="#7c83a3"
            fontSize="12"
            fontFamily="'JetBrains Mono', monospace"
          >
            {s.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
