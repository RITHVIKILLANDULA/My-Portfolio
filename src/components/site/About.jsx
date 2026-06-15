import { HiOutlineAcademicCap, HiOutlineCheckBadge } from "react-icons/hi2";
import {
  ABOUT_TEXT,
  IMPACT,
  EDUCATION,
  COURSEWORK,
  CERTIFICATIONS,
} from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function About() {
  return (
    <section id="about" className="section bg-mist">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          kicker="About"
          title="The analyst behind the dashboards"
        />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* bio */}
          <Reveal>
            <div className="space-y-4">
              {ABOUT_TEXT.split("\n\n").map((p, i) => (
                <p key={i} className="leading-relaxed text-ink-700">
                  {p}
                </p>
              ))}
            </div>

            {/* impact */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {IMPACT.map((m) => (
                <div key={m.k} className="card p-4">
                  <div className="font-display text-2xl font-bold text-brand">{m.k}</div>
                  <div className="mt-1 text-[0.72rem] leading-tight text-ink-400">{m.v}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* education + certs */}
          <Reveal delay={0.1} className="space-y-5">
            {EDUCATION.map((e) => (
              <div key={e.title} className="card p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                    <HiOutlineAcademicCap className="text-xl" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{e.title}</p>
                    <p className="text-sm text-ink-500">{e.school}</p>
                    <p className="mt-0.5 text-xs text-ink-400">{e.year} · {e.detail}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                  {COURSEWORK.slice(0, 6).map((c) => (
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
