import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "./Reveal";
import { PROJECTS, PROJECT_FILTERS, CONTACT } from "../constants";

/**
 * Selected work as a roomy, scannable grid that glides in on scroll. Featured
 * projects lead; a simple filter narrows the set. Big enough to skim, detailed
 * enough to be credible.
 */
export default function SelectedWork() {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500">
            selected work
          </p>
          <h2 className="max-w-[18ch] font-display font-semibold leading-[1.05] tracking-[-0.03em] text-ink text-[clamp(2rem,5.5vw,3.4rem)]">
            Things I&apos;ve built end to end.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-wrap gap-2">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.72rem] transition-colors ${
                  filter === f
                    ? "border-brand bg-brand text-white"
                    : "border-line text-ink-500 hover:border-ink-400 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {visible.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.06}>
              <article className="group flex h-full flex-col rounded-2xl border border-line bg-paper/40 p-6 transition-colors hover:border-ink-400 sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-brand-500">
                      featured
                    </span>
                  )}
                </div>

                <h3 className="flex items-start gap-2 font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.4rem]">
                  {p.title}
                  {p.link && (
                    <FiArrowUpRight className="mt-1 shrink-0 text-ink-400 transition-colors group-hover:text-brand-500" />
                  )}
                </h3>

                <p className="mt-3 flex-1 text-[0.95rem] leading-[1.6] text-ink-500">
                  {p.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.technologies.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.64rem] text-ink-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 font-mono text-[0.72rem] text-brand-500"
                  >
                    live demo <FiArrowUpRight />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
            >
              More on GitHub <FiArrowUpRight />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
