import { useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { PROJECTS, PROJECT_FILTERS } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const visible = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="04"
          kicker="Projects"
          title="Selected work"
          intro="Models, pipelines, and apps — built end to end."
        />

        <div className="mb-8 flex flex-wrap gap-2">
          {PROJECT_FILTERS.map((f) => {
            const on = filter === f;
            const count = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  on ? "border-brand bg-brand text-white" : "border-line bg-paper text-ink-500 hover:border-ink-300 hover:text-ink"
                }`}
              >
                {f}
                <span className="ml-1.5 nums opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal
              as="article"
              key={p.title}
              delay={(i % 3) * 0.05}
              className={`card card-hover group flex h-full flex-col p-5 ${
                p.featured ? "border-l-2 border-l-brand" : ""
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-400">
                  {p.category}
                </span>
                {p.featured && (
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-brand">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="flex items-start gap-1.5 font-display text-base font-semibold leading-snug text-ink">
                {p.title}
                {p.link && <FiArrowUpRight className="mt-0.5 shrink-0 text-ink-400 transition-colors group-hover:text-brand" />}
              </h3>

              <p className="mb-4 mt-2 flex-1 text-[0.82rem] leading-relaxed text-ink-500">
                {p.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {p.technologies.slice(0, 5).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>

              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3 text-xs font-medium text-brand"
                >
                  Live demo <FiArrowUpRight className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
