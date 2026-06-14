/**
 * Generated, animated, category-specific project artwork — replaces stock
 * images. Pure SVG + CSS so it's crisp, unique, on-theme, and lightweight.
 */

const ACCENTS = {
  "Machine Learning": "#22d3ee",
  "GenAI / LLM": "#a78bfa",
  "Analytics & BI": "#38bdf8",
  "Data Engineering": "#6366f1",
  "Web App": "#34d399",
};

function Frame({ accent, children }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-void-900">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${accent}22, transparent 60%), radial-gradient(circle at 80% 90%, ${accent}14, transparent 55%)`,
        }}
      />
      <div className="data-floor absolute inset-0 opacity-30" />
      <svg
        viewBox="0 0 120 70"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {children}
      </svg>
    </div>
  );
}

function NeuralNet({ accent }) {
  const layers = [
    [18, 35, 52],
    [14, 30, 46, 62],
    [26, 44],
  ];
  const xs = [25, 60, 95];
  const lines = [];
  layers[0].forEach((y0) =>
    layers[1].forEach((y1) =>
      lines.push([xs[0], y0, xs[1], y1])
    )
  );
  layers[1].forEach((y1) =>
    layers[2].forEach((y2) => lines.push([xs[1], y1, xs[2], y2]))
  );
  return (
    <Frame accent={accent}>
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l[0]}
          y1={l[1]}
          x2={l[2]}
          y2={l[3]}
          stroke={accent}
          strokeWidth="0.5"
          strokeOpacity="0.35"
          strokeDasharray="3 5"
          style={{ animation: `pvFlow 1.${(i % 6) + 2}s linear infinite` }}
        />
      ))}
      {layers.map((layer, li) =>
        layer.map((y, ni) => (
          <circle
            key={`${li}-${ni}`}
            cx={xs[li]}
            cy={y}
            r="3"
            fill={accent}
            style={{
              animation: `pvNode 2.${(li + ni) % 9}s ease-in-out infinite`,
              filter: `drop-shadow(0 0 3px ${accent})`,
            }}
          />
        ))
      )}
    </Frame>
  );
}

function TokenStream({ accent }) {
  const tokens = Array.from({ length: 12 });
  return (
    <Frame accent={accent}>
      <rect
        x="14"
        y="16"
        width="92"
        height="22"
        rx="4"
        fill="none"
        stroke={accent}
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />
      {tokens.map((_, i) => (
        <rect
          key={i}
          x={18 + i * 7.3}
          y="22"
          width="5"
          height="10"
          rx="1.5"
          fill={accent}
          style={{ animation: `pvToken 1.6s ease-in-out ${i * 0.12}s infinite` }}
        />
      ))}
      {/* "generated" output line */}
      <line x1="14" y1="50" x2="70" y2="50" stroke={accent} strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.8"
        strokeDasharray="56" style={{ animation: "pvFlow 2.2s linear infinite" }} />
      <circle cx="74" cy="50" r="2" fill={accent} style={{ animation: "pvNode 1.2s ease-in-out infinite" }} />
    </Frame>
  );
}

function BarChart({ accent }) {
  const bars = [30, 46, 22, 54, 38, 60, 44];
  return (
    <Frame accent={accent}>
      <line x1="12" y1="58" x2="108" y2="58" stroke={accent} strokeWidth="0.6" strokeOpacity="0.5" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={16 + i * 13}
          y={58 - h}
          width="8"
          height={h}
          rx="1.5"
          fill={accent}
          fillOpacity="0.85"
          style={{
            transformOrigin: `center 58px`,
            transformBox: "fill-box",
            animation: `pvBar 2.${i}s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
      <polyline
        points={bars.map((h, i) => `${20 + i * 13},${56 - h}`).join(" ")}
        fill="none"
        stroke="#e879f9"
        strokeWidth="1.2"
        strokeOpacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="120"
        style={{ animation: "pvFlow 3s linear infinite" }}
      />
    </Frame>
  );
}

function Pipeline({ accent }) {
  const stages = [18, 50, 82, 104];
  return (
    <Frame accent={accent}>
      <line x1="14" y1="35" x2="106" y2="35" stroke={accent} strokeWidth="1.4" strokeOpacity="0.4" />
      {stages.map((x, i) => (
        <g key={i}>
          <rect
            x={x - 7}
            y="28"
            width="14"
            height="14"
            rx="3"
            fill={`${accent}22`}
            stroke={accent}
            strokeWidth="1"
            style={{ animation: `pvNode 2.${i + 2}s ease-in-out infinite` }}
          />
          <circle cx={x} cy="35" r="2" fill={accent} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx="20"
          cy="35"
          r="2.2"
          fill="#67e8f9"
          style={{
            animation: `pvPacket 2.4s linear ${i * 0.8}s infinite`,
            filter: "drop-shadow(0 0 3px #67e8f9)",
          }}
        />
      ))}
    </Frame>
  );
}

function WebApp({ accent }) {
  return (
    <Frame accent={accent}>
      <rect x="14" y="10" width="92" height="50" rx="4" fill="none" stroke={accent} strokeWidth="0.8" strokeOpacity="0.5" />
      <line x1="14" y1="20" x2="106" y2="20" stroke={accent} strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="19" cy="15" r="1.4" fill="#f87171" />
      <circle cx="24" cy="15" r="1.4" fill="#fbbf24" />
      <circle cx="29" cy="15" r="1.4" fill="#34d399" />
      <rect x="20" y="26" width="34" height="8" rx="2" fill={accent} fillOpacity="0.7" style={{ animation: "pvNode 2s ease-in-out infinite" }} />
      <rect x="20" y="38" width="50" height="4" rx="2" fill={accent} fillOpacity="0.35" />
      <rect x="20" y="46" width="40" height="4" rx="2" fill={accent} fillOpacity="0.25" />
      <rect x="66" y="26" width="34" height="26" rx="3" fill={`${accent}22`} stroke={accent} strokeWidth="0.6" />
      <line x1="14" y1="22" x2="106" y2="22" stroke={accent} strokeWidth="2" strokeOpacity="0.5" style={{ animation: "pvScan 3s ease-in-out infinite" }} />
    </Frame>
  );
}

export default function ProjectVisual({ category }) {
  const accent = ACCENTS[category] || "#22d3ee";
  switch (category) {
    case "GenAI / LLM":
      return <TokenStream accent={accent} />;
    case "Analytics & BI":
      return <BarChart accent={accent} />;
    case "Data Engineering":
      return <Pipeline accent={accent} />;
    case "Web App":
      return <WebApp accent={accent} />;
    default:
      return <NeuralNet accent={accent} />;
  }
}
