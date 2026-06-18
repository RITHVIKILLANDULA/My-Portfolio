import Reveal from "./Reveal";

/**
 * The first scroll moment: a big editorial statement, then a row of real
 * headline numbers that glide in one after another. Apple-style — one idea,
 * lots of air, big type.
 */
const FIGURES = [
  { v: "1M+", l: "records modeled" },
  { v: "2h → 35m", l: "nightly runtime cut" },
  { v: "80%", l: "less manual review" },
  { v: "12+", l: "projects shipped" },
];

export default function StatementBand() {
  return (
    <section className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500">
            the work
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="max-w-[20ch] font-display font-semibold leading-[1.05] tracking-[-0.03em] text-ink text-[clamp(2rem,6vw,4rem)]">
            Four years turning messy data into decisions.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4">
          {FIGURES.map((f, i) => (
            <Reveal key={f.l} delay={0.1 + i * 0.08}>
              <p className="font-display font-semibold tabular-nums tracking-[-0.03em] text-ink text-[clamp(1.8rem,4.5vw,3rem)]">
                {f.v}
              </p>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-400">
                {f.l}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
