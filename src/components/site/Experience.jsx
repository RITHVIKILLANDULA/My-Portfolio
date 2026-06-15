import { EXPERIENCES } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section bg-mist">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          kicker="Experience"
          title="Where the work has shipped"
        />

        <div className="relative ml-2 border-l border-line pl-8 sm:pl-10">
          {EXPERIENCES.map((exp, i) => (
            <Reveal as="div" key={i} delay={i * 0.08} className="relative mb-10 last:mb-0">
              <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-brand sm:-left-[2.85rem]" />

              <div className="card p-6">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{exp.role}</h3>
                    <p className="text-sm font-medium text-brand">{exp.company}</p>
                  </div>
                  <span className="font-mono text-xs text-ink-400">{exp.year}</span>
                </div>

                <p className="text-sm leading-relaxed text-ink-500">{exp.description}</p>

                {exp.metrics?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-brand-soft px-2.5 py-1 text-[0.7rem] font-medium text-brand"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {exp.technologies.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
