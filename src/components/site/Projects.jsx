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
          kicker="Projects"
          title="Selected work"
          intro="Models, pipelines, and apps — built end to end."
        />

        {/* filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {PROJECT_FILTERS.map((f) => {
            const on = filter === f;
            const count = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  on
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-paper text-ink-500 hover:border-ink-400 hover:text-ink"
                }`}
              >
                {f}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal as="article" key={p.title} delay={(i % 3) * 0.05} className="card card-hover group flex h-full flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-[0.62rem] uppercase tracking-wide text-ink-400">
                  {p.category}
                </span>
                {p.featured && (
                  <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide text-brand">
                    Featured
                  </span>
                )}
              </div>

              <h3 className="flex items-start gap-1.5 text-base font-semibold leading-snug text-ink">
                {p.title}
                {p.link && (
                  <FiArrowUpRight className="mt-0.5 shrink-0 text-ink-400 transition-colors group-hover:text-brand" />
                )}
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
                  className="mt-4 inline-flex items-center gap-1.5 border-t border-line pt-3 text-xs font-medium text-brand"
                >
                  Live demo <FiArrowUpRight />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
