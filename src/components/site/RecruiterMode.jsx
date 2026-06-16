import { FiDownload, FiMail, FiArrowUpRight } from "react-icons/fi";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { TARGET_ROLES, ROLE_FIT, CONTACT, RESUME_URL } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

export default function RecruiterMode() {
  return (
    <section id="recruiter" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="07"
          kicker="Recruiter Mode"
          title="The 30-second fit check"
          intro="Everything a hiring manager needs — roles I'm targeting, what I've proven, and where to reach me."
        />

        {/* target roles */}
        <Reveal className="mb-5">
          <div className="card p-6">
            <p className="kicker mb-3">Target roles</p>
            <div className="flex flex-wrap gap-2">
              {TARGET_ROLES.map((r) => (
                <span key={r} className="rounded-lg border border-brand/25 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* role-fit matrix */}
        <Reveal delay={0.06} className="mb-5">
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="hidden grid-cols-[1.1fr_2fr_1.6fr] gap-4 border-b border-line bg-mist px-5 py-3 sm:grid">
              <span className="kicker">Role</span>
              <span className="kicker">Proof projects</span>
              <span className="kicker">Skills shown</span>
            </div>
            {ROLE_FIT.map((row) => (
              <div
                key={row.role}
                className="grid gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[1.1fr_2fr_1.6fr] sm:items-center sm:gap-4"
              >
                <span className="font-semibold text-ink">{row.role}</span>
                <div className="flex flex-wrap gap-1.5">
                  {row.projects.map((p) => (
                    <span key={p} className="rounded-md bg-mist px-2 py-0.5 text-[0.72rem] text-ink-700">{p}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {row.skills.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={0.12}>
          <div className="flex flex-wrap gap-3">
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-primary">
              <FiDownload /> Download résumé
            </a>
            <a href={`mailto:${CONTACT.email}`} className="btn-ghost">
              <FiMail /> Email me
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
              <FaLinkedin /> LinkedIn
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <FaGithub /> GitHub <FiArrowUpRight />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
