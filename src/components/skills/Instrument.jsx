/**
 * Mission Control instruments — each skill category rendered as the system it
 * actually is, not a progress bar. One shared visual language (Observatory
 * palette, JetBrains Mono labels, cyan only where it's "computing"). Animations
 * are CSS keyframes so they keep running smoothly and degrade to a sensible
 * static frame under reduced-motion.
 */

const STRUCT = "#2a3354";
const IDLE = "#6366f1";
const COMPUTE = "#22d3ee";
const TEXT = "#a6aec6";
const DIM = "#5e6783";

const KIND = {
  "AI & LLMs": "rag",
  "Machine Learning": "scope",
  "Languages & Query": "query",
  "Cloud & Data Eng": "dag",
  "Viz & BI": "dashboard",
};

const css = `
@keyframes mc-pulse { 0%{offset-distance:0%;opacity:0} 8%{opacity:1} 92%{opacity:1} 100%{offset-distance:100%;opacity:0} }
@keyframes mc-dash { to { stroke-dashoffset: -36; } }
@keyframes mc-scan { 0%,100%{transform:translateX(0)} 50%{transform:translateX(360px)} }
@keyframes mc-blip { 0%,55%{r:0;opacity:0} 65%{r:7;opacity:1} 100%{r:5;opacity:.9} }
@keyframes mc-rise { from{transform:scaleY(0)} to{transform:scaleY(1)} }
@keyframes mc-type { from{width:0} to{width:100%} }
@keyframes mc-cursor { 50%{opacity:0} }
@keyframes mc-draw { to { stroke-dashoffset: 0; } }
@keyframes mc-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@media (prefers-reduced-motion: reduce){ .mc-anim *{animation:none!important} }
`;

function Node({ x, y, r = 13, label, sub, on }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#0a1024" stroke={on ? COMPUTE : IDLE} strokeWidth="1.5" />
      <circle cx={x} cy={y} r={r} fill={on ? COMPUTE : IDLE} opacity={on ? 0.16 : 0.08} />
      <text x={x} y={y + r + 14} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill={TEXT}>
        {label}
      </text>
      {sub && (
        <text x={x} y={y + r + 25} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill={DIM}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Rag() {
  const xs = [46, 150, 250, 350, 432];
  const y = 110;
  const path = `M ${xs[0]} ${y} L ${xs[4]} ${y}`;
  return (
    <>
      <line x1={xs[0]} y1={y} x2={xs[4]} y2={y} stroke={STRUCT} strokeWidth="1.4" />
      <line x1={xs[2]} y1={y} x2={xs[3]} y2={y} stroke={COMPUTE} strokeWidth="1.6"
        strokeDasharray="4 5" style={{ animation: "mc-dash 1s linear infinite" }} />
      {/* vector cluster near FAISS */}
      {[[238, 78], [262, 84], [250, 70], [270, 96], [232, 96]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill={COMPUTE} opacity="0.7"
          style={{ animation: `mc-float ${1.6 + i * 0.2}s ease-in-out infinite` }} />
      ))}
      <Node x={xs[0]} y={y} label="query" />
      <Node x={xs[1]} y={y} label="embed" on />
      <Node x={xs[2]} y={y} r={15} label="FAISS" sub="vectors" on />
      <Node x={xs[3]} y={y} label="retrieve" on />
      <Node x={xs[4]} y={y} label="answer" />
      <circle r="3.5" fill={COMPUTE}
        style={{ offsetPath: `path('${path}')`, animation: "mc-pulse 2.4s ease-in-out infinite" }} />
    </>
  );
}

function Scope() {
  const pts = "20,120 60,96 100,108 140,72 180,116 220,60 260,150 300,92 340,104 380,80 430,110";
  return (
    <>
      {[60, 110, 160].map((y) => (
        <line key={y} x1="20" y1={y} x2="440" y2={y} stroke={STRUCT} strokeWidth="0.6" opacity="0.5" />
      ))}
      {/* confidence band */}
      <polyline points="20,80 430,90" fill="none" stroke={IDLE} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.45" />
      <polyline points="20,150 430,150" fill="none" stroke={IDLE} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.45" />
      <polyline points={pts} fill="none" stroke={COMPUTE} strokeWidth="2"
        strokeDasharray="900" strokeDashoffset="900" style={{ animation: "mc-draw 1.8s ease-out forwards" }} />
      {/* flagged anomaly */}
      <circle cx="260" cy="150" r="0" fill="none" stroke="#f0456b" strokeWidth="1.6"
        style={{ animation: "mc-blip 2.6s ease-out infinite" }} />
      <text x="260" y="178" textAnchor="middle" fontSize="9" fontFamily="JetBrains Mono, monospace" fill="#f0456b">
        ⚠ anomaly
      </text>
      <g className="mc-scan" style={{ animation: "mc-scan 4s ease-in-out infinite" }}>
        <line x1="20" y1="44" x2="20" y2="170" stroke={COMPUTE} strokeWidth="1" opacity="0.4" />
      </g>
    </>
  );
}

function Query() {
  const lines = [
    ["SELECT", " channel, COUNT(*) AS events"],
    ["FROM", " media.audience_daily"],
    ["WHERE", " event_date >= '2024-01-01'"],
    ["GROUP BY", " channel  -- partitioned scan"],
  ];
  return (
    <>
      <rect x="20" y="34" width="420" height="150" rx="10" fill="#070b16" stroke={STRUCT} strokeWidth="1" />
      {lines.map((l, i) => (
        <text key={i} x="38" y={64 + i * 24} fontSize="12.5" fontFamily="JetBrains Mono, monospace">
          <tspan fill={IDLE}>{l[0]}</tspan>
          <tspan fill={TEXT}>{l[1]}</tspan>
        </text>
      ))}
      <rect x="262" y="150" width="8" height="15" fill={COMPUTE} style={{ animation: "mc-cursor 1s step-end infinite" }} />
      <line x1="20" y1="156" x2="440" y2="156" stroke={STRUCT} strokeWidth="1" />
      <text x="38" y="176" fontSize="11.5" fontFamily="JetBrains Mono, monospace" fill={COMPUTE}>
        ✓ 1,000,000 rows
      </text>
      <text x="300" y="176" fontSize="11.5" fontFamily="JetBrains Mono, monospace" fill={DIM}>
        · 35&nbsp;ms
      </text>
    </>
  );
}

function Dag() {
  const xs = [54, 178, 302, 420];
  const y = 104;
  const labels = ["extract", "validate", "partition", "load"];
  return (
    <>
      {xs.slice(0, 3).map((x, i) => {
        const path = `M ${x + 30} ${y} L ${xs[i + 1] - 30} ${y}`;
        return (
          <g key={i}>
            <line x1={x + 30} y1={y} x2={xs[i + 1] - 30} y2={y} stroke={STRUCT} strokeWidth="1.4" />
            <circle r="3.5" fill={COMPUTE}
              style={{ offsetPath: `path('${path}')`, animation: `mc-pulse 1.8s ${i * 0.5}s ease-in-out infinite` }} />
          </g>
        );
      })}
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y={y - 18} width="60" height="36" rx="8" fill="#0a1024"
            stroke={i === 0 ? COMPUTE : IDLE} strokeWidth="1.5" />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill={TEXT}>
            {labels[i]}
          </text>
        </g>
      ))}
      <g style={{ animation: "mc-float 3s ease-in-out infinite" }}>
        <rect x="178" y="158" width="118" height="26" rx="13" fill="rgba(34,211,238,0.1)" stroke={COMPUTE} strokeWidth="1" />
        <text x="237" y="175" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill={COMPUTE}>
          2h → 35m nightly
        </text>
      </g>
      <text x="54" y="56" textAnchor="middle" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill={DIM}>
        ↑ Airflow
      </text>
    </>
  );
}

function Dashboard() {
  const bars = [54, 80, 62, 96, 72, 88];
  return (
    <>
      {/* KPI tiles */}
      {[
        ["15+", "dashboards", 30],
        ["6", "sources", 162],
      ].map(([n, l, x]) => (
        <g key={l}>
          <rect x={x} y="36" width="118" height="52" rx="9" fill="#0a1024" stroke={STRUCT} strokeWidth="1" />
          <text x={x + 14} y="64" fontSize="20" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fill="#f3f5fb">{n}</text>
          <text x={x + 14} y="79" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill={DIM}>{l}</text>
        </g>
      ))}
      {/* sparkline tile */}
      <rect x="294" y="36" width="146" height="52" rx="9" fill="#0a1024" stroke={STRUCT} strokeWidth="1" />
      <polyline points="306,76 326,64 346,70 366,52 386,60 406,46 428,54" fill="none" stroke={COMPUTE} strokeWidth="1.8"
        strokeDasharray="200" strokeDashoffset="200" style={{ animation: "mc-draw 1.6s ease-out forwards" }} />
      {/* bar chart */}
      <rect x="30" y="104" width="410" height="86" rx="9" fill="#070b16" stroke={STRUCT} strokeWidth="1" />
      {bars.map((h, i) => (
        <rect key={i} x={60 + i * 62} y={176 - h} width="34" height={h} rx="3"
          fill={i % 2 ? IDLE : COMPUTE} opacity="0.85"
          style={{ transformOrigin: `${77 + i * 62}px 176px`, animation: `mc-rise 0.9s ${i * 0.08}s ease-out backwards` }} />
      ))}
    </>
  );
}

const RENDER = { rag: Rag, scope: Scope, query: Query, dag: Dag, dashboard: Dashboard };

export default function Instrument({ category }) {
  const kind = KIND[category.name] || "rag";
  const Body = RENDER[kind];
  return (
    <svg viewBox="0 0 460 210" className="mc-anim h-full w-full" role="img" aria-label={`${category.name} instrument`}>
      <style>{css}</style>
      <Body />
    </svg>
  );
}
