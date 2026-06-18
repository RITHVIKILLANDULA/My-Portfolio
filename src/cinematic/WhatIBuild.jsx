import Reveal from "./Reveal";
import { EXPERTISE } from "../constants";

/**
 * "What I build" as a sequence of big, roomy capability statements that glide
 * in on scroll — one discipline per row, generous air, scannable in a glance.
 */
export default function WhatIBuild() {
  return (
    <section id="work" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-12 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500 sm:mb-16">
            what I build
          </p>
        </Reveal>

        <div className="divide-y divide-line">
          {EXPERTISE.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.06}>
              <div className="grid gap-4 py-10 sm:grid-cols-[1fr_1.1fr] sm:gap-12 sm:py-14">
                <div className="flex items-start gap-5">
                  <span className="mt-2 font-mono text-sm tabular-nums text-ink-300">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-semibold leading-[1.05] tracking-[-0.02em] text-ink text-[clamp(1.6rem,4vw,2.6rem)]">
                    {e.title}
                  </h3>
                </div>
                <div className="sm:pt-2">
                  <p className="max-w-[42ch] text-[1.02rem] leading-[1.65] text-ink-700">
                    {e.blurb}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {e.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line px-3 py-1 font-mono text-[0.7rem] text-ink-500"
                      >
                        {s}
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
