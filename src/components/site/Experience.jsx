import { EXPERIENCES } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading index="06" kicker="Experience" title="Where the work has shipped" />

        <Reveal className="relative border-t border-line">
          {/* the career spine (desktop) */}
          <div className="absolute bottom-8 left-[7.75rem] top-10 hidden w-px bg-gradient-to-b from-brand/30 via-line to-transparent sm:block" />

          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className="relative grid gap-2 border-b border-line py-9 sm:grid-cols-[6.5rem_1fr] sm:gap-10"
            >
              <div className="font-mono text-xs tabular-nums leading-relaxed text-ink-400">
                {exp.year}
              </div>

              {/* node bead on the spine, in the gap (clear of the dates) */}
              <span className="absolute left-[7.75rem] top-[2.6rem] hidden -translate-x-1/2 sm:block">
                <span
                  className={`grid place-items-center rounded-full bg-canvas ${
                    i === 0 ? "h-4 w-4 ring-2 ring-brand/30" : "h-3 w-3 ring-1 ring-line"
                  }`}
                >
                  <span className={`rounded-full bg-brand ${i === 0 ? "h-2 w-2" : "h-1.5 w-1.5"}`} />
                </span>
              </span>

              <div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-semibold text-ink">{exp.role}</h3>
                  {i === 0 && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-brand">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-ink-500">{exp.company}</p>

                <p className="mt-3 max-w-[64ch] text-sm leading-[1.7] text-ink-500">
                  {exp.description}
                </p>

                {exp.metrics?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-brand-soft px-2.5 py-1 font-mono text-[0.68rem] font-medium text-brand"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
