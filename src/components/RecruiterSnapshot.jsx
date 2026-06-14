import { FiArrowUpRight, FiMail, FiDownload } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import {
  STATS,
  PROJECTS,
  CONTACT,
  RESUME_URL,
  RESUME_SUMMARY,
} from "../constants";
import Counter from "./ui/Counter";
import Reveal from "./ui/Reveal";

const FEATURED = PROJECTS.filter((p) => p.featured).slice(0, 3);
const COMPANIES = ["Deloitte", "WAFU Technologies", "University at Buffalo"];

/**
 * The 60-second brief — a single-screen summary for recruiters who don't
 * want the full tour. Everything that matters: pitch, numbers, signature
 * work, and one click to the résumé or inbox.
 */
export default function RecruiterSnapshot({ onOpenResume }) {
  return (
    <section id="snapshot" className="scroll-mt-24 py-24 sm:py-28">
      <Reveal className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono-label text-[0.6rem] tracking-[0.28em] text-data-cyan/80">
            ● the 60-second brief
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            Short on time? The whole story, one screen.
          </h2>
        </div>
        <button
          onClick={onOpenResume}
          data-cursor
          className="group inline-flex items-center gap-1.5 rounded-xl border border-data-indigo/40 bg-data-indigo/10 px-4 py-2.5 text-xs font-medium text-data-violet transition-all hover:border-data-cyan/60 hover:text-data-cyan"
        >
          Play the résumé reel
          <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </Reveal>

      <Reveal
        delay={0.05}
        className="glass grid gap-px overflow-hidden rounded-3xl border border-white/10 lg:grid-cols-[1.15fr_1fr]"
      >
        {/* left — pitch, numbers, contact */}
        <div className="bg-void-900/40 p-7 sm:p-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="mono-label text-[0.55rem] text-neutral-300">
              Open to AI / Data roles · Buffalo, NY
            </span>
          </div>

          <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">
            Rithvik Illandula
          </h3>
          <p className="font-mono text-sm text-data-cyan">
            AI Data Analyst · Data Analytics Engineer
          </p>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300">
            {RESUME_SUMMARY}
          </p>

          {/* numbers */}
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                  <Counter value={s.value} decimals={s.decimals} />
                  {s.suffix}
                </div>
                <div className="mono-label mt-1 text-[0.5rem] leading-tight text-neutral-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* companies */}
          <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
            <span className="mono-label text-[0.5rem] text-neutral-500">
              experience
            </span>
            {COMPANIES.map((c, i) => (
              <span key={c} className="text-neutral-300">
                {c}
                {i < COMPANIES.length - 1 && (
                  <span className="px-2 text-neutral-600">·</span>
                )}
              </span>
            ))}
          </div>

          {/* actions */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-4 py-2.5 text-xs font-semibold text-void-950"
            >
              <FiDownload /> Résumé (PDF)
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              data-cursor
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-4 py-2.5 text-xs font-medium text-neutral-200 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
            >
              <FiMail /> Email me
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              data-cursor
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
            >
              <FaLinkedin />
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              data-cursor
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/12 text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        {/* right — signature work */}
        <div className="bg-void-850/50 p-7 sm:p-9">
          <p className="mono-label text-[0.55rem] tracking-[0.22em] text-data-indigo/80">
            signature work
          </p>
          <div className="mt-4 space-y-3">
            {FEATURED.map((p, i) => (
              <a
                key={p.title}
                href="#projects"
                data-cursor
                className="group block rounded-2xl border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-data-cyan/40 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-white group-hover:text-data-cyan">
                    {p.title}
                  </h4>
                  <span className="mono-label shrink-0 text-[0.5rem] text-neutral-500">
                    0{i + 1}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                  {p.description}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[0.55rem] text-neutral-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <a
            href="#projects"
            data-cursor
            className="mono-label mt-4 inline-flex items-center gap-1 text-[0.6rem] text-neutral-400 transition-colors hover:text-data-cyan"
          >
            see all {PROJECTS.length} projects
            <FiArrowUpRight />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
