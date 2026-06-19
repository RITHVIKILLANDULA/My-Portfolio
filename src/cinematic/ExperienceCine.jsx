import Reveal from "./Reveal";
import { EXPERIENCES } from "../constants";

/**
 * Experience as a clean, roomy timeline that glides in role by role. Year on the
 * left, the work on the right, real outcome metrics as pills. Scannable.
 */
export default function ExperienceCine() {
  return (
    <section id="experience" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">
            experience
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2 className="max-w-[22ch] font-display text-h2 text-ink">
            Where the work shipped.
          </h2>
        </Reveal>

        <div className="mt-14">
          {EXPERIENCES.map((e, i) => (
            <Reveal key={e.company} kind="item" delay={i * 0.04}>
              <div className="grid gap-3 border-t border-line py-10 sm:grid-cols-[10rem_1fr] sm:gap-10 sm:py-12">
                <div>
                  <p className="font-mono text-[0.72rem] tabular-nums text-ink-400">{e.year}</p>
                  {i === 0 && (
                    <span className="mt-2 inline-block rounded-full bg-forge-soft px-2.5 py-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-forge-500">
                      current
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
                    {e.role}
                  </h3>
                  <p className="mt-1 text-base font-medium text-ink-700">{e.company}</p>
                  <p className="mt-4 max-w-[60ch] text-[0.95rem] leading-[1.7] text-ink-500">
                    {e.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {e.metrics.map((m) => (
                      <span
                        key={m}
                        className="rounded-md bg-forge-soft px-2.5 py-1 font-mono text-[0.66rem] text-forge-500"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
