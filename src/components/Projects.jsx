import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import { PROJECTS, PROJECT_FILTERS } from "../constants";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import ProjectVisual from "./ui/ProjectVisual";

export default function Projects() {
  const [filter, setFilter] = useState("All");

  const visible = useMemo(
    () =>
      filter === "All"
        ? PROJECTS
        : PROJECTS.filter((p) => p.category === filter),
    [filter]
  );

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <SectionHeading
        index="05"
        kicker="datasets_shipped"
        title="Projects"
        subtitle="Models, pipelines, and apps — built end to end."
      />

      {/* filter chips */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {PROJECT_FILTERS.map((f) => {
          const on = filter === f;
          const count =
            f === "All"
              ? PROJECTS.length
              : PROJECTS.filter((p) => p.category === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              data-cursor
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-200 ${
                on
                  ? "border border-data-cyan/60 bg-data-cyan/10 text-data-cyan shadow-glow"
                  : "border border-void-700 text-neutral-400 hover:border-data-indigo/50 hover:text-neutral-200"
              }`}
            >
              {f}
              <span className="ml-1.5 text-[0.6rem] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* grid */}
      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <motion.div
              layout
              key={project.title}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
            >
              <TiltCard className="group h-full">
                <article className="glass relative flex h-full flex-col overflow-hidden rounded-2xl border-data-indigo/15">
                  {/* glare */}
                  <div
                    className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(34,211,238,0.12), transparent 45%)",
                    }}
                  />
                  {/* generated animated visual */}
                  <div className="relative h-40 overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                      <ProjectVisual category={project.category} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/30 to-transparent" />
                    {project.featured && (
                      <span className="mono-label absolute left-3 top-3 rounded-full border border-data-cyan/40 bg-void-950/70 px-2 py-0.5 text-[0.5rem] text-data-cyan">
                        ★ featured
                      </span>
                    )}
                    <span className="mono-label absolute bottom-3 left-3 text-[0.55rem] text-neutral-300">
                      {project.category}
                    </span>
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-base font-medium leading-snug text-neutral-100">
                        {project.title}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor
                          aria-label={`Open ${project.title}`}
                          className="mt-0.5 shrink-0 text-neutral-500 transition-colors hover:text-data-cyan"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                    <p className="mb-4 line-clamp-4 flex-1 text-xs font-light leading-relaxed text-neutral-400">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="rounded border border-void-700 bg-void-900/60 px-1.5 py-0.5 font-mono text-[0.6rem] text-data-violet/90"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mono-label flex items-center justify-center gap-1.5 border-t border-void-700 py-3 text-[0.6rem] text-data-cyan transition-colors hover:bg-data-cyan/5"
                    >
                      live demo <FiArrowUpRight />
                    </a>
                  )}
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
