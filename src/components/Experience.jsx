import { EXPERIENCES } from "../constants";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import useReveal from "../hooks/useReveal";

export default function Experience() {
  const [railRef, railShown] = useReveal({ amount: 0.05 });

  return (
    <section id="experience" className="scroll-mt-24 py-24">
      <SectionHeading
        index="03"
        kicker="career_log"
        title="Experience"
        subtitle="Where the data work has shipped real outcomes."
      />

      <div className="relative mx-auto max-w-4xl pl-8 sm:pl-12">
        {/* timeline rail */}
        <div className="absolute left-2 top-2 h-full w-px sm:left-4">
          <div
            ref={railRef}
            style={{
              transform: railShown ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "top",
              transition: "transform 1.4s ease-in-out",
            }}
            className="h-full w-full bg-gradient-to-b from-data-cyan via-data-indigo to-transparent"
          />
        </div>

        {EXPERIENCES.map((exp, index) => (
          <Reveal
            as="div"
            from="up"
            delay={index * 0.1}
            key={index}
            className="relative mb-12 last:mb-0"
          >
            {/* node */}
            <span className="absolute -left-[1.65rem] top-2 grid h-4 w-4 place-items-center sm:-left-[2.15rem]">
              <span className="absolute h-4 w-4 animate-ping rounded-full bg-data-cyan/40" />
              <span className="h-3 w-3 rounded-full border-2 border-void-950 bg-data-cyan shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" />
            </span>

            <div className="glass glass-hover group rounded-2xl p-5 sm:p-7">
              <div className="mb-4 flex flex-wrap items-center gap-4">
                {exp.logo && (
                  <img
                    src={exp.logo}
                    alt={`${exp.company} logo`}
                    className="h-12 w-12 rounded-lg bg-white object-contain p-1.5"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-neutral-100">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-data-violet">{exp.company}</p>
                </div>
                <span className="mono-label rounded-full border border-data-cyan/25 bg-data-cyan/5 px-3 py-1 text-[0.55rem] text-data-cyan">
                  {exp.year}
                </span>
              </div>

              <p className="mb-5 text-sm font-light leading-relaxed text-neutral-400">
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
