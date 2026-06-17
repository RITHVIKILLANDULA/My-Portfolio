/**
 * Small always-animating diagrams for the Expertise pillars — each one shows,
 * literally, what that discipline does. Pure SVG + the shared .dashflow /
 * .floaty motion, bright and on-brand.
 */
const VIO = "#6c68e8";
const SKY = "#38bdf8";
const TEAL = "#2dd4bf";
const BRAND = "#4b47d6";
const FAINT = "#c7c1f3";

function Pipeline() {
  const xs = [26, 78, 130, 178];
  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" fill="none">
      <line x1="26" y1="40" x2="178" y2="40" stroke={FAINT} strokeWidth="1.5" />
      <line x1="26" y1="40" x2="178" y2="40" stroke={BRAND} strokeWidth="1.5" className="dashflow" opacity="0.6" />
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="40" r="8" fill="#13151c" stroke={i === 3 ? BRAND : VIO} strokeWidth="1.6" />
          {i === 3 && <circle cx={x} cy="40" r="3" fill={BRAND} />}
        </g>
      ))}
      <circle r="3" fill={SKY}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M26 40 L178 40" />
      </circle>
    </svg>
  );
}

function Neural() {
  const sat = [[40, 24], [44, 60], [160, 22], [156, 58]];
  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" fill="none">
      {sat.map(([x, y], i) => (
        <line key={i} x1="100" y1="40" x2={x} y2={y} stroke={FAINT} strokeWidth="1.4" className="dashflow" opacity="0.7" />
      ))}
      {sat.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#13151c" stroke={[VIO, TEAL, SKY, VIO][i]} strokeWidth="1.6" className="floaty" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <circle cx="100" cy="40" r="13" fill={BRAND} opacity="0.12" />
      <circle cx="100" cy="40" r="9" fill="#13151c" stroke={BRAND} strokeWidth="1.8" />
      <circle cx="100" cy="40" r="3.5" fill={BRAND}>
        <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Architecture() {
  const boxes = [
    { x: 18, label: "API" },
    { x: 80, label: "Service" },
    { x: 150, label: "DB" },
  ];
  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" fill="none">
      <line x1="50" y1="40" x2="80" y2="40" stroke={BRAND} strokeWidth="1.5" className="dashflow" />
      <line x1="128" y1="40" x2="150" y2="40" stroke={BRAND} strokeWidth="1.5" className="dashflow" />
      {boxes.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y="28" width={i === 1 ? 48 : 32} height="24" rx="6" fill="#13151c" stroke={VIO} strokeWidth="1.5" />
          <text x={b.x + (i === 1 ? 24 : 16)} y="43.5" textAnchor="middle" fontSize="8.5" fontFamily="Geist Mono, monospace" fill={BRAND}>{b.label}</text>
        </g>
      ))}
    </svg>
  );
}

function Cloud() {
  const dots = [[60, 64], [100, 70], [140, 64]];
  return (
    <svg viewBox="0 0 200 80" className="h-full w-full" fill="none">
      <path d="M64 36 a18 18 0 0 1 34 -6 a14 14 0 0 1 26 6 a14 14 0 0 1 -2 28 H66 a15 15 0 0 1 -2 -28 Z" fill="#1a1930" stroke={VIO} strokeWidth="1.6" className="floaty" />
      {dots.map(([x, y], i) => (
        <g key={i}>
          <line x1="100" y1="50" x2={x} y2={y} stroke={FAINT} strokeWidth="1.3" className="dashflow" opacity="0.7" />
          <circle cx={x} cy={y} r="4.5" fill="#13151c" stroke={[SKY, TEAL, BRAND][i]} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

const MAP = { pipeline: Pipeline, ai: Neural, code: Architecture, cloud: Cloud };

export default function PillarViz({ kind }) {
  const V = MAP[kind] || Pipeline;
  return (
    <div className="mb-4 h-20 overflow-hidden rounded-xl border border-line bg-mist/50">
      <V />
    </div>
  );
}
