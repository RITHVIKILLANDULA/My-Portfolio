import { FiArrowRight, FiDownload, FiMessageSquare } from "react-icons/fi";
import {
  HERO_NAME,
  HERO_TAGLINE,
  HERO_CONTENT,
  STATS,
  RESUME_URL,
  RUNTIME_SERIES,
} from "../../constants";
import RoleCycler from "../ui/RoleCycler";
import Counter from "../ui/Counter";
import HeroScene3D from "./HeroScene3D";

function spark(series, w, h, pad = 6) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HeroWorld() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* WebGL data universe */}
      <div className="absolute inset-0 z-0">
        <HeroScene3D />
      </div>

      {/* readability scrim + glow */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-canvas/85 via-canvas/35 to-canvas/95 md:bg-gradient-to-r md:from-canvas md:via-canvas/65 md:to-transparent" />
      <div className="pointer-events-none absolute right-[12%] top-[22%] z-[1] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(124,120,240,0.16),transparent_70%)] blur-2xl" />

      {/* floating metric cards (over the universe) */}
      <div className="pointer-events-none absolute inset-0 z-[2] hidden md:block">
        <GlassCard className="right-[5%] top-[16%]">
          <p className="kicker mb-1 !text-[0.55rem]">churn model</p>
          <p className="nums font-display text-3xl font-semibold text-ink">97<span className="text-xl text-ink-400">%</span></p>
          <p className="font-mono text-[0.55rem] text-ink-400">logistic · client-side</p>
        </GlassCard>
        <GlassCard className="right-[6%] bottom-[16%]">
          <p className="kicker mb-1.5 !text-[0.55rem]">nightly runtime</p>
          <svg viewBox="0 0 150 40" className="h-10 w-40">
            <path d={`${spark(RUNTIME_SERIES, 150, 40)} L144 34 L6 34 Z`} fill="rgba(124,120,240,0.16)" />
            <path d={spark(RUNTIME_SERIES, 150, 40)} fill="none" stroke="#9d99ff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-mono text-[0.55rem] text-ink-400">2h → <span className="text-brand-500">35m</span></p>
        </GlassCard>
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-5 py-32 sm:px-8">
        <p className="kicker mb-6">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle shadow-[0_0_8px_#34d399]" />
          Welcome to my data &amp; AI world
        </p>

        <h1 className="font-display text-display text-ink">{HERO_NAME}</h1>

        <p className="mt-4 font-display text-2xl font-medium text-brand-500 sm:text-3xl">
          <RoleCycler />
        </p>

        <p className="mt-5 max-w-[44ch] font-display text-lg font-medium leading-snug text-ink sm:text-xl">
          {HERO_TAGLINE}
        </p>

        <p className="mt-5 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-ink-700">
          {HERO_CONTENT}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#ai-lab"
            onClick={() => window.dispatchEvent(new CustomEvent("rai:ask"))}
            className="btn-primary group"
          >
            <FiMessageSquare /> Ask my AI about me
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a href="#projects" className="btn-ghost">Explore the work</a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost">
            <FiDownload /> Résumé
          </a>
        </div>

        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-y-7 sm:grid-cols-4 sm:[&>div:not(:first-child)]:border-l sm:[&>div:not(:first-child)]:border-line sm:[&>div:not(:first-child)]:pl-6">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="nums font-display text-stat text-ink">
                <Counter value={s.value} decimals={s.decimals} />
                {s.suffix}
              </dt>
              <dd className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="floaty rounded-2xl border border-line bg-paper/70 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
        {children}
      </div>
    </div>
  );
}
