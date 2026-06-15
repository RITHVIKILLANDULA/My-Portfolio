import { FiArrowRight, FiArrowDown } from "react-icons/fi";
import { HERO_NAME, HERO_CONTENT, STATS, RESUME_URL } from "../../constants";
import RoleCycler from "../ui/RoleCycler";

export default function Hero() {
  return (
    <section id="home" className="relative mx-auto max-w-5xl px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
      <div className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-mist px-3.5 py-1.5 text-xs text-ink-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Open to AI / Data roles · Buffalo, NY
        </span>

        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-7xl">
          {HERO_NAME}
        </h1>

        <p className="mt-3 font-display text-2xl font-semibold text-brand sm:text-3xl">
          <RoleCycler />
        </p>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500">
          {HERO_CONTENT}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#projects" className="btn-primary">
            View the work <FiArrowRight />
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost">
            Résumé
          </a>
          <a href="#contact" className="btn-ghost">
            Get in touch
          </a>
        </div>

        {/* quick stats */}
        <dl className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl font-bold text-ink">
                {s.value}
                {s.suffix}
              </dt>
              <dd className="mt-1 text-xs leading-tight text-ink-400">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <a href="#about" className="mt-16 inline-flex items-center gap-1.5 text-xs text-ink-400 transition-colors hover:text-ink">
        <FiArrowDown /> Scroll to explore
      </a>
    </section>
  );
}
