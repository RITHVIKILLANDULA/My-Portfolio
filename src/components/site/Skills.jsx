import { SKILL_CATEGORIES } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          kicker="Skills"
          title="The toolkit"
          intro="From raw SQL and pipelines to forecasting models and LLM-powered tools."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.name} delay={(i % 3) * 0.06}>
              <div className="card card-hover h-full p-5">
                <h3 className="mb-4 text-sm font-semibold text-ink">{cat.name}</h3>
                <div className="space-y-3">
                  {cat.skills.map((s) => (
                    <div key={s.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[0.82rem] text-ink-700">{s.name}</span>
                        <span className="font-mono text-[0.62rem] text-ink-400">{s.level}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-line">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${s.level}%` }}
                        />
                      </div>
                    </div>
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
