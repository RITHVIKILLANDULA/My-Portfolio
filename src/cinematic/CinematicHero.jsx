import { FiArrowRight, FiArrowDown } from "react-icons/fi";
import RoleCycler from "../components/ui/RoleCycler";
import { HERO_NAME, RESUME_URL } from "../constants";

/**
 * Apple-style cinematic hero: full viewport, big type, soft ambient depth, and
 * the role crossfade. Settled on load (no sliding text — the loader covers the
 * entrance); the cinematic motion lives in the scroll reveals below.
 */
export default function CinematicHero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* soft ambient depth — premium, not particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="drift-a absolute -left-[10%] top-[8%] h-[55vh] w-[55vh] rounded-full bg-[radial-gradient(circle,rgba(124,120,240,0.18),transparent_68%)] blur-2xl" />
        <div className="drift-b absolute -right-[8%] bottom-[2%] h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.14),transparent_70%)] blur-2xl" />
        <div className="dotgrid absolute inset-0 opacity-[0.35]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10">
        <p className="mb-6 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          available for data · AI · software roles
        </p>

        <h1 className="font-display font-semibold leading-[0.92] tracking-[-0.04em] text-ink text-[clamp(2.9rem,9.5vw,7rem)]">
          Rithvik
          <br />
          Illandula
        </h1>

        <p className="mt-7 max-w-[34ch] font-display leading-[1.15] tracking-[-0.02em] text-ink-700 text-[clamp(1.35rem,3.6vw,2.4rem)]">
          I build data &amp; AI systems
          <br className="hidden sm:block" /> that actually ship.
        </p>

        <p className="mt-5 font-mono text-sm text-ink-500 sm:text-base">
          <span className="text-ink-400">&gt;</span>{" "}
          <span className="font-medium text-brand-500">
            <RoleCycler />
          </span>
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            View the work
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
          >
            Résumé
          </a>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#work"
        aria-label="Scroll to work"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-ink-400 transition-colors hover:text-ink"
      >
        <FiArrowDown className="scrollcue text-lg" />
      </a>
    </section>
  );
}
