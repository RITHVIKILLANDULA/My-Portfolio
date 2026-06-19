import { useMemo, useRef, useState, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "./Reveal";
import Counter from "../components/ui/Counter";
import { RUNTIME_SERIES } from "../constants";

const RidgelineCanvas = lazy(() => import("../three/RidgelineCanvas"));

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function webglOK() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

// 2D fallback geometry (reduced-motion / no-WebGL) — the curve he already liked
const W = 760;
const H = 150;
const PAD = 16;
const min = Math.min(...RUNTIME_SERIES);
const max = Math.max(...RUNTIME_SERIES);
const span = max - min || 1;
const pts = RUNTIME_SERIES.map((v, i) => [
  PAD + (i / (RUNTIME_SERIES.length - 1)) * (W - PAD * 2),
  PAD + (1 - (v - min) / span) * (H - PAD * 2),
]);
const LINE = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
const AREA = `${LINE} L${pts[pts.length - 1][0].toFixed(1)} ${H - PAD} L${pts[0][0].toFixed(1)} ${H - PAD} Z`;
const END = pts[pts.length - 1];

function SvgCurve({ drawn, dotOpacity }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" preserveAspectRatio="none" aria-hidden>
      <motion.path d={AREA} fill="rgba(124,120,240,0.10)" style={{ opacity: reduced ? 1 : drawn }} />
      <motion.path
        d={LINE}
        stroke="#7c78f0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength: reduced ? 1 : drawn }}
        initial={{ pathLength: reduced ? 1 : 0 }}
      />
      <motion.circle cx={END[0]} cy={END[1]} r="4" fill="#9d99ff" style={{ opacity: reduced ? 1 : dotOpacity }} />
    </svg>
  );
}

const FIGURES = [
  { value: 1, suffix: "M+", label: "records modeled" },
  { value: 80, suffix: "%", label: "less manual review" },
  { value: 12, suffix: "+", label: "projects shipped" },
];

export default function StatementBand() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.5"] });
  const drawn = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const dotOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);

  const [forced, setForced] = useState(null);
  const use3D = useMemo(() => !reduced && webglOK(), []);
  const coarse = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
    []
  );

  const TOGGLE = [
    { label: "before", v: 0 },
    { label: "live", v: null },
    { label: "after", v: 1 },
  ];

  return (
    <section className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">the work</p>
        </Reveal>
        <Reveal kind="statement">
          <h2 className="max-w-[24ch] font-display font-semibold text-statement text-ink">
            Four years building data pipelines, AI systems, and the software that ships them.
          </h2>
        </Reveal>

        {/* signature: the real nightly-runtime, as a ridgeline that compresses on scroll */}
        <div ref={ref} className="mt-16">
          <Reveal kind="body">
            <div className="rounded-2xl border border-line bg-paper/70 p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">
                    nightly pipeline runtime
                  </p>
                  <p className="mt-1.5 font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold tracking-[-0.02em] text-ink">
                    2h <span className="text-forge-500">→</span> 35m
                    <span className="ml-3 align-middle font-mono text-[0.7rem] font-normal text-forge-500">−71%</span>
                  </p>
                </div>
                {use3D && (
                  <div className="flex overflow-hidden rounded-lg border border-line">
                    {TOGGLE.map((t) => (
                      <button
                        key={t.label}
                        onClick={() => setForced(t.v)}
                        className={`px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-wide transition-colors ${
                          forced === t.v ? "bg-forge-soft text-forge-500" : "text-ink-400 hover:text-ink-700"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* the exhibit */}
              <div className="relative h-[40vh] min-h-[240px] w-full sm:h-[46vh]">
                {use3D ? (
                  <Suspense fallback={<SvgCurve drawn={drawn} dotOpacity={dotOpacity} />}>
                    <RidgelineCanvas progress={scrollYProgress} forced={forced} interactive={!coarse} />
                  </Suspense>
                ) : (
                  <SvgCurve drawn={drawn} dotOpacity={dotOpacity} />
                )}
              </div>

              <div className="mt-3 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ink-400">
                <span>120m · 6 sources</span>
                <span className="hidden sm:inline">ingest · validate · transform · model · load</span>
                <span className="text-forge-500">35m · merged</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* supporting figures, counting up on enter */}
        <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-8">
          {FIGURES.map((f, i) => (
            <Reveal key={f.label} kind="item" delay={i * 0.07}>
              <p className="font-display text-stat font-semibold text-ink">
                <Counter value={f.value} className="tabular-nums" />
                <span className="text-forge-500">{f.suffix}</span>
              </p>
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-400">{f.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
