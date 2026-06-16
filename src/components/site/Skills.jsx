import { SKILL_CATEGORIES } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          kicker="Skills"
          title="The full stack"
          intro="Languages, data, AI, cloud, and software-engineering fundamentals — the tools I reach for."
        />

        <Reveal className="border-t border-line">
          {SKILL_CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="grid gap-3 border-b border-line py-6 sm:grid-cols-[180px_1fr] sm:gap-10"
            >
              <h3 className="font-medium text-ink">{cat.name}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <span key={s.name} className="chip">{s.name}</span>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
