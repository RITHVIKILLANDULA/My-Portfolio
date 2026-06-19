import Reveal from "./Reveal";
import { ROLE_FIT } from "../constants";

/**
 * A "for recruiters" band: maps the role you're hiring for to the proof — the
 * projects that back it and the core stack — so he can be forwarded in 30
 * seconds. Always open, no gating. Cloud collapses to a footer chip.
 */
const PRIMARY = ROLE_FIT.slice(0, 3);
const CLOUD = ROLE_FIT[3];

export default function RecruiterQuickview() {
  return (
    <section id="fit" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500">
            for recruiters
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2 className="max-w-[26ch] font-display text-h2 text-ink">
            Whichever role you&apos;re hiring for — here&apos;s the proof.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRIMARY.map((r, i) => (
            <Reveal key={r.role} kind="item" delay={i * 0.06}>
              <a
                href="#projects"
                className="group flex h-full flex-col rounded-2xl border border-line bg-paper/60 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-ink-300"
              >
                <p className="font-display text-lg font-semibold tracking-[-0.01em] text-ink">
                  <span className="text-brand-500">→</span> {r.role}
                </p>
                <div className="mt-4 flex-1">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-400">proof</p>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink-500">
                    {r.projects.join(" · ")}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {r.skills.map((s) => (
                    <span key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.64rem] text-ink-500">
                      {s}
                    </span>
                  ))}
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {CLOUD && (
          <Reveal kind="body">
            <p className="mt-6 font-mono text-[0.72rem] text-ink-400">
              <span className="text-ink-300">also:</span>{" "}
              <span className="text-ink-500">{CLOUD.role}</span> — {CLOUD.skills.join(" · ")}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
