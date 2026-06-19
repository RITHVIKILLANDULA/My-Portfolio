import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Reveal from "./Reveal";
import { PROJECTS, PROJECT_FILTERS, CONTACT } from "../constants";

const EASE = [0.16, 1, 0.3, 1];

/**
 * Selected work as a roomy, scannable grid that glides in on scroll. Featured
 * projects lead; the filter animates the set in/out instead of jump-cutting;
 * cards lift on hover. Big enough to skim, detailed enough to be credible.
 */
export default function SelectedWork() {
  const [filter, setFilter] = useState("All");

  const visible = useMemo(() => {
    const list = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }, [filter]);

  return (
    <section id="projects" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">
            selected work
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2 className="max-w-[26ch] font-display text-h2 text-ink">
            Things I&apos;ve built end to end.
          </h2>
        </Reveal>

        <Reveal kind="body">
          <div className="mt-10 flex flex-wrap gap-2">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[0.72rem] transition-[transform,color,border-color,background-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:translate-y-0 ${
                  filter === f
                    ? "border-forge bg-forge text-white"
                    : "border-line text-ink-500 hover:border-ink-400 hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal kind="body">
          <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p) => (
                <motion.article
                  key={p.title}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  whileHover={{ y: -4 }}
                  className={`group flex h-full flex-col rounded-2xl border bg-paper/70 p-6 transition-[border-color,box-shadow] duration-300 hover:border-ink-300 hover:shadow-card-hover sm:p-7 ${
                    p.featured ? "border-ink-300/70" : "border-line"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-forge-500">
                        <span className="h-1 w-1 rounded-full bg-forge-500" /> featured
                      </span>
                    )}
                  </div>

                  <h3 className="flex items-start gap-2 font-display text-xl font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.4rem]">
                    {p.title}
                    {p.link && (
                      <FiArrowUpRight className="mt-1 shrink-0 text-ink-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forge-500" />
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
                      className="mt-5 inline-flex items-center gap-1.5 border-t border-line pt-4 font-mono text-[0.72rem] text-forge-500"
                    >
                      live demo <FiArrowUpRight />
                    </a>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </Reveal>

        <Reveal kind="body">
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
