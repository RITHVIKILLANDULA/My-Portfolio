import { FiDatabase, FiCpu, FiCode, FiCloud } from "react-icons/fi";
import { EXPERTISE } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";
import Tilt from "../ui/Tilt";
import PillarViz from "../ui/PillarViz";

const ICONS = {
  pipeline: FiDatabase,
  ai: FiCpu,
  code: FiCode,
  cloud: FiCloud,
};

export default function Expertise() {
  return (
    <section id="expertise" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          kicker="Expertise"
          title="What I build"
          intro="Four disciplines I work across — from the pipelines underneath to the AI on top to the software that ships it."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {EXPERTISE.map((p, i) => {
            const Icon = ICONS[p.icon] || FiCode;
            return (
              <Reveal key={p.title} delay={(i % 2) * 0.08} className="h-full">
                <Tilt className="card group flex h-full flex-col p-6 hover:border-ink-300 hover:shadow-card-hover">
                  <PillarViz kind={p.icon} />
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon className="text-xl" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink">{p.title}</h3>
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-500">{p.blurb}</p>

                  <div className="flex flex-wrap gap-1.5 border-t border-line pt-4">
                    {p.stack.map((t) => (
                      <span key={t} className="chip">{t}</span>
                    ))}
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
