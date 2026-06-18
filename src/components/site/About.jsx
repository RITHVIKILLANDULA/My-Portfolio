import { HiOutlineAcademicCap, HiOutlineCheckBadge } from "react-icons/hi2";
import { ABOUT_TEXT, IMPACT, EDUCATION, CERTIFICATIONS } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function About() {
  return (
    <section id="about" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading index="01" kicker="About" title="The analyst behind the dashboards" />

        <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:gap-10 lg:gap-12">
          {/* bio + impact ledger */}
          <Reveal>
            <div className="max-w-[60ch] space-y-4">
              {ABOUT_TEXT.split("\n\n").map((p, i) => (
                <p key={i} className="leading-[1.7] text-ink-700">{p}</p>
              ))}
            </div>

            <div className="mt-8 border-t border-line">
              {IMPACT.map((m) => (
                <div key={m.k} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                  <span className="text-sm text-ink-500">{m.v}</span>
                  <span className="nums font-mono text-sm font-medium text-ink">{m.k}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* education (3 degrees) + certs */}
          <Reveal delay={0.1} className="space-y-4">
            <p className="kicker">Education · three CS degrees</p>
            {EDUCATION.map((e) => (
              <div key={e.title} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <HiOutlineAcademicCap className="text-lg" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold leading-tight text-ink">{e.title}</p>
                    <p className="text-sm text-ink-500">{e.school}</p>
                    <p className="mt-0.5 font-mono text-[0.7rem] text-ink-400">{e.year} · {e.detail}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
                  {e.coursework.slice(0, 5).map((c) => (
                    <span key={c} className="chip">{c}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className="card p-5">
              <p className="kicker mb-3">Certifications</p>
              <ul className="space-y-2.5">
                {CERTIFICATIONS.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-ink-700">
                    <HiOutlineCheckBadge className="mt-0.5 shrink-0 text-brand" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
