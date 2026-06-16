import { EXPERIENCES } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading index="03" kicker="Experience" title="Where the work has shipped" />

        <Reveal className="border-t border-line">
          {EXPERIENCES.map((exp, i) => (
            <div
              key={i}
              className="grid gap-2 border-b border-line py-8 sm:grid-cols-[7rem_1fr] sm:gap-8"
            >
              <div className="pt-1 font-mono text-xs tabular-nums leading-relaxed text-ink-400">
                {exp.year}
              </div>

              <div className={i === 0 ? "border-l-2 border-brand pl-6" : "pl-6"}>
                <h3 className="text-lg font-semibold text-ink">{exp.role}</h3>
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
