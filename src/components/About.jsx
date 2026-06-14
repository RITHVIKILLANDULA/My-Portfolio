import { HiAcademicCap, HiCheckBadge } from "react-icons/hi2";
import heroImg from "../assets/Hero-portrait.jpg";
import {
  ABOUT_TEXT,
  IMPACT,
  EDUCATION,
  COURSEWORK,
  CERTIFICATIONS,
} from "../constants";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24">
      <SectionHeading
        index="01"
        kicker="who_am_i"
        title="About Me"
        subtitle="A quick read on the human behind the dashboards."
      />

      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* framed portrait — AI agent scanning the subject */}
        <Reveal from="left" className="relative mx-auto max-w-sm">
          <div className="group relative overflow-hidden rounded-2xl border border-data-indigo/25 bg-void-850 p-2 shadow-glow-lg">
            <img
              src={heroImg}
              alt="Rithvik Illandula"
              className="aspect-[4/5] w-full rounded-xl object-cover transition-all duration-700 group-hover:scale-[1.03]"
            />
            {/* tint + analyzing grid */}
            <div className="pointer-events-none absolute inset-2 z-10 rounded-xl bg-[radial-gradient(circle_at_30%_0%,rgba(34,211,238,0.16),transparent_55%)] mix-blend-screen" />
            <div className="data-floor pointer-events-none absolute inset-2 z-10 rounded-xl opacity-25" />
            {/* scan line */}
            <div className="pointer-events-none absolute inset-2 z-10 overflow-hidden rounded-xl">
              <div className="absolute inset-x-0 h-16 animate-scan bg-gradient-to-b from-transparent via-data-cyan/25 to-transparent" />
            </div>
            {/* HUD: status chips */}
            <div className="mono-label absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded bg-void-950/70 px-2 py-1 text-[0.5rem] text-data-cyan">
              <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-emerald-400" />
              agent · scanning
            </div>
            <div className="mono-label absolute right-3 top-3 z-20 rounded bg-void-950/70 px-2 py-1 text-[0.5rem] text-data-violet">
              conf 0.98
            </div>
            {/* targeting reticle */}
            <span className="absolute left-3 bottom-12 z-20 h-5 w-5 animate-pulseGlow border-l-2 border-t-2 border-data-cyan/80" />
            <span className="absolute right-3 bottom-12 z-20 h-5 w-5 animate-pulseGlow border-r-2 border-t-2 border-data-cyan/80" />
            {/* readout strip */}
            <div className="mono-label absolute inset-x-2 bottom-2 z-20 flex items-center justify-between rounded bg-void-950/75 px-2.5 py-1.5 text-[0.5rem] text-neutral-300 backdrop-blur-sm">
              <span className="text-data-cyan">subject: rithvik.illandula</span>
              <span className="text-emerald-400">status: building ▸</span>
            </div>
          </div>
        </Reveal>

        {/* text + console */}
        <div>
          <Reveal from="right">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
                <span className="mono-label ml-2 text-[0.55rem] text-neutral-500">
                  ~/about/rithvik.md
                </span>
              </div>
              {ABOUT_TEXT.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="mb-4 text-sm font-light leading-relaxed text-neutral-300 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* education */}
          {EDUCATION.map((e) => (
            <Reveal key={e.title} from="up" delay={0.1}>
              <div className="mt-5 rounded-xl border border-void-700 bg-void-900/50 p-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-data-violet/40 bg-data-violet/10 text-data-violet">
                    <HiAcademicCap className="text-xl" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-100">
                      {e.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {e.school} · {e.detail}
                    </p>
                  </div>
                  <span className="mono-label hidden text-[0.55rem] text-neutral-500 sm:block">
                    {e.year}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-void-700 pt-3">
                  {COURSEWORK.map((c) => (
                    <span
                      key={c}
                      className="rounded border border-void-700 bg-void-900/60 px-1.5 py-0.5 font-mono text-[0.58rem] text-neutral-400"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          {/* certifications */}
          <Reveal from="up" delay={0.15}>
            <div className="mt-5 rounded-xl border border-void-700 bg-void-900/50 p-4">
              <p className="mono-label mb-3 text-[0.55rem] text-data-cyan/80">
                certifications
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {CERTIFICATIONS.map((c) => (
                  <div key={c} className="flex items-start gap-2">
                    <HiCheckBadge className="mt-0.5 shrink-0 text-data-cyan" />
                    <span className="text-xs leading-tight text-neutral-300">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* impact metrics */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {IMPACT.map((m, i) => (
              <Reveal
                as="div"
                from="up"
                delay={i * 0.08}
                duration={0.5}
                key={m.k}
                className="rounded-xl border border-void-700 bg-void-900/40 p-3 text-center"
              >
                <div className="gradient-text font-mono text-xl font-bold">
                  {m.k}
                </div>
                <div className="mt-1 text-[0.62rem] leading-tight text-neutral-400">
                  {m.v}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
