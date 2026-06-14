/**
 * A UNIQUE animated visual per project — each one illustrates what that
 * specific project does. Pure SVG + SMIL (self-contained, no global keyframes),
 * so every card is crisp, distinct and lightweight.
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
          background: `radial-gradient(circle at 28% 18%, ${accent}26, transparent 60%), radial-gradient(circle at 82% 92%, ${accent}14, transparent 55%)`,
        }}
      />
      <div className="data-floor absolute inset-0 opacity-25" />
      <svg viewBox="0 0 120 70" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {children}
      </svg>
    </div>
  );
}

/* 1 — BI dashboard: bars + donut + ticking line */
function Dashboard({ a }) {
  return (
    <Frame accent={a}>
      <rect x="10" y="10" width="44" height="22" rx="2" fill="none" stroke={a} strokeWidth="0.5" strokeOpacity="0.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={14 + i * 8} y={28} width="5" height="2" rx="1" fill={a}>
          <animate attributeName="height" values="2;16;5;14;2" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="y" values="28;14;25;16;28" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <circle cx="78" cy="21" r="10" fill="none" stroke={`${a}33`} strokeWidth="3" />
      <circle cx="78" cy="21" r="10" fill="none" stroke={a} strokeWidth="3" strokeDasharray="63" strokeDashoffset="20" strokeLinecap="round" transform="rotate(-90 78 21)">
        <animate attributeName="stroke-dashoffset" values="63;15;40;15" dur="4s" repeatCount="indefinite" />
      </circle>
      <polyline points="10,52 28,46 46,50 64,40 82,44 104,34" fill="none" stroke="#e879f9" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="120">
        <animate attributeName="stroke-dashoffset" values="120;0" dur="2.5s" repeatCount="indefinite" />
      </polyline>
    </Frame>
  );
}

/* 2 — anomaly detection: steady stream with one red spike + scan line */
function Anomaly({ a }) {
  return (
    <Frame accent={a}>
      <line x1="8" y1="35" x2="112" y2="35" stroke={`${a}40`} strokeWidth="0.4" />
      <polyline points="8,38 22,34 36,40 50,33 64,52 78,36 92,38 112,35" fill="none" stroke={a} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160">
        <animate attributeName="stroke-dashoffset" values="160;0" dur="2.4s" repeatCount="indefinite" />
      </polyline>
      <circle cx="64" cy="52" r="3" fill="#ff5c6c">
        <animate attributeName="r" values="2.5;5;2.5" dur="1.1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.4;1" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <text x="68" y="60" fill="#ff5c6c" fontSize="5" fontFamily="monospace">!anomaly</text>
      <rect x="8" y="8" width="1" height="54" fill={a} opacity="0.5">
        <animate attributeName="x" values="8;112;8" dur="3.4s" repeatCount="indefinite" />
      </rect>
    </Frame>
  );
}

/* 3 — BigQuery pipeline: cloud feeding staged nodes, packets flowing */
function CloudPipeline({ a }) {
  return (
    <Frame accent={a}>
      <path d="M16 20 q-5 0 -5 5 q-5 0 -5 5 q0 5 5 5 h18 q5 0 5 -5 q0 -5 -6 -5 q-1 -6 -7 -6 q-4 0 -5 6 z" fill={`${a}22`} stroke={a} strokeWidth="0.7" transform="translate(2 6)" />
      <line x1="34" y1="38" x2="104" y2="38" stroke={`${a}55`} strokeWidth="1" />
      {[44, 64, 84, 102].map((x, i) => (
        <rect key={i} x={x - 5} y="33" width="10" height="10" rx="2" fill={`${a}22`} stroke={a} strokeWidth="0.8">
          <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {[0, 1].map((i) => (
        <circle key={i} r="2" fill="#67e8f9">
          <animateMotion dur="2.6s" begin={`${i * 1.3}s`} repeatCount="indefinite" path="M34,38 H104" />
        </circle>
      ))}
    </Frame>
  );
}

/* 4 — churn: customers splitting stay/churn + retention gauge */
function Churn({ a }) {
  return (
    <Frame accent={a}>
      {[18, 26, 34, 42].map((y, i) => (
        <circle key={i} cx="20" cy={y} r="2.2" fill={a}>
          <animate attributeName="cx" values="20;58" dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${y};${i < 2 ? 22 : 50}`} dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="fill" values={`${a};${i < 2 ? "#34d399" : "#ff5c6c"}`} dur="2.6s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="64" y="24" fill="#34d399" fontSize="5" fontFamily="monospace">stay</text>
      <text x="64" y="52" fill="#ff5c6c" fontSize="5" fontFamily="monospace">churn</text>
      <path d="M90 50 a14 14 0 0 1 24 0" fill="none" stroke={`${a}33`} strokeWidth="2.5" />
      <path d="M90 50 a14 14 0 0 1 24 0" fill="none" stroke={a} strokeWidth="2.5" strokeDasharray="44" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="44;10;30;10" dur="3s" repeatCount="indefinite" />
      </path>
    </Frame>
  );
}

/* 5 — demand forecast: hourly bars + rising prediction line + moving dot */
function Demand({ a }) {
  const bars = [16, 24, 20, 34, 40, 30, 46];
  return (
    <Frame accent={a}>
      <line x1="10" y1="56" x2="110" y2="56" stroke={`${a}50`} strokeWidth="0.5" />
      {bars.map((h, i) => (
        <rect key={i} x={14 + i * 12} y={56 - h} width="7" height={h} rx="1" fill={`${a}99`}>
          <animate attributeName="height" values={`2;${h};${h - 6};${h}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`54;${56 - h};${56 - h + 6};${56 - h}`} dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <polyline points="17,42 29,36 41,40 53,26 65,22 77,30 89,18" fill="none" stroke="#e879f9" strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round" />
      <circle r="2.4" fill="#67e8f9">
        <animateMotion dur="3s" repeatCount="indefinite" path="M17,42 L29,36 L41,40 L53,26 L65,22 L77,30 L89,18" />
      </circle>
    </Frame>
  );
}

/* 6 — RAG: PDF -> chunks -> vectors -> answer */
function Rag({ a }) {
  return (
    <Frame accent={a}>
      <rect x="10" y="22" width="18" height="24" rx="1.5" fill={`${a}18`} stroke={a} strokeWidth="0.7" />
      {[27, 31, 35, 39].map((y, i) => (
        <line key={i} x1="13" y1={y} x2="25" y2={y} stroke={a} strokeWidth="0.8" strokeOpacity="0.6" />
      ))}
      {[28, 34, 40].map((y, i) => (
        <circle key={i} cx="48" cy={y} r="2" fill={a}>
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.6s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g opacity="0.85">
        {[24, 30, 36, 42, 48].map((y, i) => (
          <rect key={i} x="64" y={y - 1.4} width="3" height="3" rx="0.6" fill="#a5f3fc">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" begin={`${i * 0.15}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <path d="M80 34 h22" stroke={a} strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="86" y="24" width="26" height="20" rx="3" fill={`${a}22`} stroke={a} strokeWidth="0.7" />
      <text x="99" y="36" fill="#fff" fontSize="5" fontFamily="monospace" textAnchor="middle">A</text>
      <circle r="1.6" fill="#67e8f9">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M30,34 H86" />
      </circle>
    </Frame>
  );
}

/* 7 — EDA: scatter cloud + regression sweep + sparkle insight */
function Eda({ a }) {
  const pts = [[20, 48], [30, 40], [38, 44], [46, 34], [54, 38], [62, 28], [70, 32], [80, 22], [90, 26]];
  return (
    <Frame accent={a}>
      <line x1="14" y1="56" x2="108" y2="56" stroke={`${a}50`} strokeWidth="0.5" />
      <line x1="14" y1="56" x2="14" y2="12" stroke={`${a}50`} strokeWidth="0.5" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={a}>
          <animate attributeName="opacity" values="0.2;1;0.5" dur={`${1.4 + i * 0.1}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <line x1="16" y1="50" x2="96" y2="22" stroke="#e879f9" strokeWidth="1.1" strokeDasharray="90" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="90;0" dur="2.6s" repeatCount="indefinite" />
      </line>
      <g transform="translate(98 14)">
        <path d="M0,-4 L1,-1 L4,0 L1,1 L0,4 L-1,1 L-4,0 L-1,-1 Z" fill="#fff">
          <animateTransform attributeName="transform" type="scale" values="0.5;1.2;0.5" dur="1.8s" repeatCount="indefinite" additive="sum" />
        </path>
      </g>
    </Frame>
  );
}

/* 8 — NLP tokens highlighting in sequence */
function Nlp({ a }) {
  const tok = [10, 24, 40, 52, 68, 82, 96];
  const w = [12, 14, 10, 14, 12, 12, 14];
  return (
    <Frame accent={a}>
      {[20, 38].map((y, r) =>
        tok.map((x, i) => (
          <rect key={`${r}-${i}`} x={x} y={y} width={w[i]} height="8" rx="2" fill={`${a}33`} stroke={a} strokeWidth="0.4">
            <animate attributeName="fill" values={`${a}22;${a}cc;${a}22`} dur="3.4s" begin={`${(r * 7 + i) * 0.18}s`} repeatCount="indefinite" />
          </rect>
        ))
      )}
      <line x1="10" y1="56" x2="64" y2="56" stroke={a} strokeWidth="1.4" strokeLinecap="round" strokeDasharray="54">
        <animate attributeName="stroke-dashoffset" values="54;0" dur="2.4s" repeatCount="indefinite" />
      </line>
    </Frame>
  );
}

/* 9 — weather: sun, cloud, rain + temp line */
function Weather({ a }) {
  return (
    <Frame accent={a}>
      <circle cx="30" cy="24" r="7" fill="#fbbf24" opacity="0.9">
        <animate attributeName="r" values="7;8;7" dur="2.5s" repeatCount="indefinite" />
      </circle>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <line key={d} x1="30" y1="24" x2={30 + 12 * Math.cos((d * Math.PI) / 180)} y2={24 + 12 * Math.sin((d * Math.PI) / 180)} stroke="#fbbf24" strokeWidth="0.7" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
        </line>
      ))}
      <ellipse cx="64" cy="30" rx="16" ry="8" fill={`${a}cc`} />
      <ellipse cx="54" cy="28" rx="8" ry="6" fill={`${a}cc`} />
      {[54, 62, 70, 78].map((x, i) => (
        <line key={i} x1={x} y1="38" x2={x - 2} y2="48" stroke="#67e8f9" strokeWidth="1" strokeLinecap="round">
          <animate attributeName="opacity" values="0;1;0" dur="1.1s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </line>
      ))}
      <polyline points="10,60 30,56 50,58 70,52 90,54 110,48" fill="none" stroke="#e879f9" strokeWidth="1" strokeDasharray="2 2" />
    </Frame>
  );
}

/* 10 — fake news: article flips TRUE/FALSE */
function FakeNews({ a }) {
  return (
    <Frame accent={a}>
      <rect x="12" y="16" width="40" height="38" rx="2" fill={`${a}15`} stroke={a} strokeWidth="0.7" />
      {[22, 27, 32, 37, 42, 47].map((y, i) => (
        <line key={i} x1="16" y1={y} x2={i % 2 ? 44 : 48} y2={y} stroke={a} strokeWidth="0.8" strokeOpacity="0.55" />
      ))}
      <path d="M56 35 h14" stroke={a} strokeWidth="0.8" strokeDasharray="2 2" />
      <g>
        <rect x="74" y="22" width="36" height="11" rx="2" fill="#34d39922" stroke="#34d399" strokeWidth="0.7">
          <animate attributeName="opacity" values="1;0.15;1" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="92" y="30" fill="#34d399" fontSize="6" fontFamily="monospace" textAnchor="middle">TRUE</text>
        <rect x="74" y="37" width="36" height="11" rx="2" fill="#ff5c6c22" stroke="#ff5c6c" strokeWidth="0.7">
          <animate attributeName="opacity" values="0.15;1;0.15" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="92" y="45" fill="#ff5c6c" fontSize="6" fontFamily="monospace" textAnchor="middle">FAKE</text>
      </g>
    </Frame>
  );
}

/* 11 — diabetes risk gauge sweeping + model bars */
function RiskGauge({ a }) {
  return (
    <Frame accent={a}>
      <path d="M20 50 A24 24 0 0 1 68 50" fill="none" stroke={`${a}30`} strokeWidth="4" />
      <path d="M20 50 A24 24 0 0 1 68 50" fill="none" stroke={a} strokeWidth="4" strokeLinecap="round" strokeDasharray="75">
        <animate attributeName="stroke-dashoffset" values="75;22;55;22" dur="3.4s" repeatCount="indefinite" />
      </path>
      <line x1="44" y1="50" x2="44" y2="32" stroke="#e879f9" strokeWidth="1.4" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" values="-60 44 50;55 44 50;-20 44 50;55 44 50" dur="3.4s" repeatCount="indefinite" />
      </line>
      <circle cx="44" cy="50" r="2" fill="#e879f9" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={84} y={20 + i * 8} width="2" height="5" rx="1" fill={a}>
          <animate attributeName="width" values={`2;${10 + i * 4};2`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </rect>
      ))}
    </Frame>
  );
}

/* 12 — RL grid world: agent navigates to goal */
function GridWorld({ a }) {
  return (
    <Frame accent={a}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={36 + i * 12} y1="12" x2={36 + i * 12} y2="60" stroke={`${a}30`} strokeWidth="0.4" />
          <line x1="36" y1={12 + i * 12} x2="84" y2={12 + i * 12} stroke={`${a}30`} strokeWidth="0.4" />
        </g>
      ))}
      <rect x="73" y="13" width="10" height="10" fill="#34d39955" stroke="#34d399" strokeWidth="0.6" />
      <text x="78" y="20" fill="#34d399" fontSize="5" textAnchor="middle">★</text>
      <rect x="49" y="37" width="10" height="10" fill="#ff5c6c33" stroke="#ff5c6c" strokeWidth="0.5" />
      <circle r="3" fill="#67e8f9" filter="url(#none)">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M42,54 L42,42 L54,42 L54,30 L66,30 L66,18 L78,18" calcMode="discrete" keyTimes="0;0.16;0.32;0.48;0.64;0.8;1" />
      </circle>
    </Frame>
  );
}

/* 13 — Imagify: prompt -> pixels assemble into an image */
function Imagify({ a }) {
  return (
    <Frame accent={a}>
      <rect x="10" y="30" width="38" height="10" rx="2" fill={`${a}18`} stroke={a} strokeWidth="0.6" />
      <line x1="14" y1="35" x2="40" y2="35" stroke={a} strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="26">
        <animate attributeName="stroke-dashoffset" values="26;0" dur="2s" repeatCount="indefinite" />
      </line>
      <path d="M52 35 h10" stroke={a} strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x="68" y="16" width="40" height="38" rx="3" fill="none" stroke={a} strokeWidth="0.7" />
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <rect key={`${r}-${c}`} x={70 + c * 7.4} y={18 + r * 7} width="6.4" height="6" rx="0.8" fill={["#a78bfa", "#22d3ee", "#34d399", "#e879f9"][(r + c) % 4]}>
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin={`${(r * 5 + c) * 0.08}s`} fill="freeze" repeatCount="1" />
            <animate attributeName="opacity" values="1;0;1" dur="4s" begin="2.5s" repeatCount="indefinite" />
          </rect>
        ))
      )}
    </Frame>
  );
}

/* 14 — portfolio: drifting data constellation */
function Constellation({ a }) {
  const nodes = [[22, 20], [44, 32], [30, 48], [62, 18], [70, 40], [54, 54], [92, 28], [100, 50], [84, 14]];
  const edges = [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [6, 7], [3, 8]];
  return (
    <Frame accent={a}>
      {edges.map(([i, j], k) => (
        <line key={k} x1={nodes[i][0]} y1={nodes[i][1]} x2={nodes[j][0]} y2={nodes[j][1]} stroke={a} strokeWidth="0.4" strokeOpacity="0.4" />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={a} style={{ filter: `drop-shadow(0 0 3px ${a})` }}>
          <animate attributeName="r" values="1.4;2.6;1.4" dur={`${2 + (i % 5) * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </Frame>
  );
}

// title → unique animation
const REGISTRY = {
  "Audience & Client Insights Dashboard": Dashboard,
  "Data Quality & Anomaly Detection Pipeline": Anomaly,
  "BigQuery ML Customer Analytics Pipeline": CloudPipeline,
  "Telco Customer Churn Prediction": Churn,
  "Citi Bike Trip Demand Prediction": Demand,
  "PDF-Insight · RAG Q&A Assistant": Rag,
  "EDA with LangChain + LLMs": Eda,
  "NLP Toolkit": Nlp,
  "WeatherWise": Weather,
  "Fake News Prediction": FakeNews,
  "Diabetes Risk Prediction": RiskGauge,
  "Reinforcement Learning · Grid World": GridWorld,
  "Imagify · Text-to-Image SaaS": Imagify,
  "Personal Portfolio · Data World": Constellation,
};

export default function ProjectAnim({ title, category }) {
  const a = ACCENTS[category] || "#22d3ee";
  const Comp = REGISTRY[title] || Constellation;
  return <Comp a={a} />;
}
