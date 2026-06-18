import { useState } from "react";
import { SKILL_CATEGORIES } from "../constants";

/**
 * Capabilities = the six skill categories as selectable SUBSYSTEMS. Pick one and
 * its system renders live (a SQL console returning rows, an Airflow DAG with a
 * moving packet, a RAG path, etc.) plus a readiness meter and the real skills.
 * One indigo accent only — the per-category rainbow accents in constants are
 * deliberately ignored.
 */
const ACCENT = "#9d99ff";
const FAINT = "#474b58";

// a single indigo packet running an edge once per loop (not a marching dash)
function Packet({ path, dur = "2.6s" }) {
  return (
    <circle r="2.4" fill={ACCENT}>
      <animateMotion dur={dur} repeatCount="indefinite" path={path} />
    </circle>
  );
}

function SqlSystem() {
  return (
    <div className="font-mono text-[0.72rem] leading-relaxed">
      <p className="text-ink-500"><span className="text-brand-500">SELECT</span> segment, <span className="text-brand-500">count</span>(*) </p>
      <p className="text-ink-500"><span className="text-brand-500">FROM</span> media.audience_daily</p>
      <p className="text-ink-500"><span className="text-brand-500">GROUP BY</span> segment;</p>
      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>✓ 1,000,000 rows</span><span className="text-ink-300">·</span><span className="text-ink-400">35 ms</span>
      </div>
    </div>
  );
}

function DagSystem() {
  const nodes = [["extract", 16], ["validate", 70], ["partition", 124], ["load", 178]];
  return (
    <svg viewBox="0 0 200 64" className="h-20 w-full" fill="none">
      <line x1="24" y1="32" x2="186" y2="32" stroke={FAINT} strokeWidth="1.4" />
      {nodes.map(([l, x], i) => (
        <g key={l}>
          {i > 0 && <line x1={nodes[i - 1][1] + 8} y1="32" x2={x - 8} y2="32" stroke={ACCENT} strokeWidth="1.3" opacity="0.5" />}
          <circle cx={x} cy="32" r={i === 3 ? 6 : 5} fill="#13151c" stroke={i === 3 ? ACCENT : "#6c68e8"} strokeWidth="1.6" />
          <text x={x} y="52" textAnchor="middle" fontSize="6.5" fontFamily="Geist Mono, monospace" fill="#9094a3">{l}</text>
        </g>
      ))}
      <Packet path="M24 32 L178 32" />
      <text x="100" y="14" textAnchor="middle" fontSize="7.5" fontFamily="Geist Mono, monospace" fill={ACCENT}>2h → 35m</text>
    </svg>
  );
}

function RagSystem() {
  const steps = ["query", "embed", "retrieve", "answer"];
  return (
    <svg viewBox="0 0 200 64" className="h-20 w-full" fill="none">
      <line x1="22" y1="32" x2="188" y2="32" stroke={FAINT} strokeWidth="1.4" />
      {steps.map((s, i) => {
        const x = 22 + i * 55;
        return (
          <g key={s}>
            <rect x={x - 16} y="24" width="32" height="16" rx="4" fill="#13151c" stroke={i === 3 ? ACCENT : "#6c68e8"} strokeWidth="1.4" />
            <text x={x} y="35" textAnchor="middle" fontSize="6" fontFamily="Geist Mono, monospace" fill="#c6cad6">{s}</text>
          </g>
        );
      })}
      <Packet path="M22 32 L188 32" dur="2.8s" />
    </svg>
  );
}

function ScatterSystem() {
  const pts = [[40, 44], [60, 30], [78, 36], [96, 22], [120, 28], [140, 18], [158, 24]];
  return (
    <svg viewBox="0 0 200 64" className="h-20 w-full" fill="none">
      <line x1="24" y1="50" x2="186" y2="50" stroke={FAINT} strokeWidth="1" />
      <line x1="24" y1="50" x2="24" y2="10" stroke={FAINT} strokeWidth="1" />
      <path d="M24 48 L60 38 L96 30 L140 22 L176 16" stroke={ACCENT} strokeWidth="1.4" opacity="0.55" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill={i % 2 ? "#6c68e8" : ACCENT}>
          <animate attributeName="r" values="2.6;3.4;2.6" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="170" y="44" fontSize="6.5" fontFamily="Geist Mono, monospace" fill="#9094a3">fit</text>
    </svg>
  );
}

function DashboardSystem() {
  const bars = [22, 34, 28, 40, 31, 44];
  return (
    <svg viewBox="0 0 200 64" className="h-20 w-full" fill="none">
      <line x1="20" y1="52" x2="186" y2="52" stroke={FAINT} strokeWidth="1" />
      {bars.map((h, i) => (
        <rect key={i} x={28 + i * 26} y={52 - h} width="14" height={h} rx="2" fill={i === 5 ? ACCENT : "#6c68e8"} opacity={i === 5 ? 1 : 0.6}>
          <animate attributeName="height" values={`0;${h}`} dur="0.9s" begin={`${i * 0.08}s`} fill="freeze" />
          <animate attributeName="y" values={`52;${52 - h}`} dur="0.9s" begin={`${i * 0.08}s`} fill="freeze" />
        </rect>
      ))}
    </svg>
  );
}

function ArchSystem() {
  const boxes = [["API", 20], ["Service", 84], ["DB", 152]];
  return (
    <svg viewBox="0 0 200 64" className="h-20 w-full" fill="none">
      {boxes.map(([l, x], i) => (
        <g key={l}>
          {i > 0 && <line x1={boxes[i - 1][1] + (i === 1 ? 40 : 32)} y1="32" x2={x} y2="32" stroke={ACCENT} strokeWidth="1.3" opacity="0.5" />}
          <rect x={x} y="22" width={i === 1 ? 40 : 32} height="20" rx="4" fill="#13151c" stroke="#6c68e8" strokeWidth="1.4" />
          <text x={x + (i === 1 ? 20 : 16)} y="34.5" textAnchor="middle" fontSize="7" fontFamily="Geist Mono, monospace" fill={ACCENT}>{l}</text>
        </g>
      ))}
      <Packet path="M52 32 L152 32" />
    </svg>
  );
}

// map category index → its live system + a one-line readout
const SUB = [
  { id: "ai-llms", System: RagSystem, readout: "retrieval · agents · evals" },
  { id: "machine-learning", System: ScatterSystem, readout: "train · tune · serve" },
  { id: "languages-query", System: SqlSystem, readout: "1M rows · 35 ms" },
  { id: "cloud-data-eng", System: DagSystem, readout: "orchestrated · partitioned" },
  { id: "viz-bi", System: DashboardSystem, readout: "15+ dashboards live" },
  { id: "software-eng", System: ArchSystem, readout: "tested · production-ready" },
];

export default function CapabilitiesView() {
  const [sel, setSel] = useState(0);
  const cat = SKILL_CATEGORIES[sel];
  const sub = SUB[sel];
  const System = sub.System;
  const readiness = Math.round(cat.skills.reduce((s, k) => s + k.level, 0) / cat.skills.length);
  const segs = Math.round(readiness / 10);

  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">// capabilities · 6 subsystems</p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-500">
        Six subsystems I build and operate. Select one to bring it online.
      </p>

      <div className="mt-7 grid gap-5 md:grid-cols-[14rem_1fr]">
        {/* subsystem selector */}
        <ul className="flex flex-col gap-1">
          {SKILL_CATEGORIES.map((c, i) => {
            const on = i === sel;
            return (
              <li key={c.name}>
                <button
                  onClick={() => setSel(i)}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left font-mono text-[0.72rem] transition-colors ${
                    on ? "border-brand/40 bg-brand-soft text-ink" : "border-line text-ink-500 hover:border-ink-400"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-emerald-400" : "bg-ink-300"}`} />
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-ink-400">{String(i).padStart(2, "0")}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* active subsystem */}
        <div className="rounded-2xl border border-line bg-paper/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line pb-4 font-mono text-[0.66rem]">
            <span className="text-ink-400">subsystem</span><span className="text-ink-300">:</span>
            <span className="font-medium text-ink">{sub.id}</span>
            <span className="text-ink-300">·</span><span className="text-ink-400">{sub.readout}</span>
            <span className="ml-auto flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="text-emerald-400">online</span></span>
          </div>

          <div className="mt-5 rounded-xl border border-line bg-canvas p-4">
            <System />
          </div>

          {/* readiness meter */}
          <div className="mt-5 flex items-center gap-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-wide text-ink-400">readiness</span>
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className={`h-2 flex-1 rounded-sm ${i < segs ? "bg-brand" : "bg-line"}`} />
              ))}
            </div>
            <span className="font-mono text-[0.7rem] tabular-nums text-brand-500">{readiness}</span>
          </div>

          {/* skills */}
          <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {cat.skills.map((k) => (
              <span key={k.name} className="rounded-md border border-line bg-mist px-2.5 py-1 font-mono text-[0.66rem] text-ink-700">
                {k.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
