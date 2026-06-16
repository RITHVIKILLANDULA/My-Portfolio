import { FiArrowRight, FiArrowDown, FiDownload } from "react-icons/fi";
import { HERO_NAME, HERO_CONTENT, STATS, RESUME_URL, RUNTIME_SERIES } from "../../constants";
import RoleCycler from "../ui/RoleCycler";
import Sparkline from "../ui/Sparkline";
import Counter from "../ui/Counter";

const TRUST = ["Deloitte", "M.S. CS · University at Buffalo", "GCP Professional Data Engineer"];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
        <div className="animate-fade-up">
          <p className="kicker mb-6">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
            Open to AI / Data roles · Buffalo, NY
          </p>

          <h1 className="font-display text-display text-ink">{HERO_NAME}</h1>

          <p className="mt-4 font-display text-2xl font-medium text-brand sm:text-3xl">
            <RoleCycler />
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.78rem] text-ink-400">
            {TRUST.map((t, i) => (
              <span key={t} className="flex items-center gap-3">
                {i > 0 && <span className="text-ink-300">/</span>}
                {t}
              </span>
            ))}
          </div>

          <p className="mt-7 max-w-[60ch] text-[1.0625rem] leading-[1.7] text-ink-700">
            {HERO_CONTENT}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-primary group">
              <FiDownload /> Résumé
            </a>
            <a href="#projects" className="btn-ghost group">
              View the work
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a href="#contact" className="btn-ghost">Get in touch</a>
          </div>
        </div>

        {/* signature: the real runtime arc */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <dl className="grid grid-cols-2 gap-y-7 sm:grid-cols-4 sm:[&>div:not(:first-child)]:border-l sm:[&>div:not(:first-child)]:border-line sm:[&>div:not(:first-child)]:pl-6">
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

          <div className="w-full lg:w-[420px]">
            <p className="kicker mb-2">Nightly pipeline runtime · 14 runs</p>
            <Sparkline data={RUNTIME_SERIES} width={420} height={120} endLabel="35m" />
          </div>
        </div>

        <a href="#about" className="mt-16 inline-flex items-center gap-1.5 font-mono text-xs text-ink-400 transition-colors hover:text-ink">
          <FiArrowDown /> Scroll
        </a>
      </div>
    </section>
  );
}
