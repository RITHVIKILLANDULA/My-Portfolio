import { useState } from "react";
import { FiCopy, FiCheck, FiArrowUpRight, FiDownload } from "react-icons/fi";
import { CONTACT, RESUME_URL, ROLE_FIT } from "../constants";

/**
 * Contact as a console `endpoints` panel — email / LinkedIn / GitHub as mono
 * service endpoints with copy buttons, a `GET /resume.pdf`, and a routing table
 * (ROLE_FIT) so a recruiter can self-route a target role to the proof runs and
 * skills that back it. No "contact portal" language.
 */
function Endpoint({ method, path, value, href, copy }) {
  const [done, setDone] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(copy).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1400);
    });
  };
  return (
    <div className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
      <span className="w-10 shrink-0 font-mono text-[0.6rem] uppercase text-emerald-400">{method}</span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.6rem] text-ink-400">{path}</p>
        <a href={href} target="_blank" rel="noreferrer" className="truncate font-mono text-[0.8rem] text-ink transition-colors hover:text-brand-500">
          {value}
        </a>
      </div>
      <a href={href} target="_blank" rel="noreferrer" aria-label={`open ${path}`} className="shrink-0 text-ink-400 transition-colors hover:text-brand-500">
        <FiArrowUpRight />
      </a>
      <button onClick={onCopy} aria-label={`copy ${path}`} className="shrink-0 text-ink-400 transition-colors hover:text-brand-500">
        {done ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
      </button>
    </div>
  );
}

export default function ReachView() {
  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">// reach · endpoints</p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-500">
        Have a dataset, a model, or a role in mind? Every endpoint is live —
        usually replies within a day.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* endpoints */}
        <div className="overflow-hidden rounded-2xl border border-line bg-paper/60">
          <div className="flex items-center justify-between border-b border-line bg-mist/50 px-4 py-2.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-400">
            <span>endpoints</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />open</span>
          </div>
          <Endpoint method="mail" path="/email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} copy={CONTACT.email} />
          <Endpoint method="in" path="/linkedin" value="in/rithvik-illandula" href={CONTACT.linkedin} copy={CONTACT.linkedin} />
          <Endpoint method="git" path="/github" value="RITHVIKILLANDULA" href={CONTACT.github} copy={CONTACT.github} />
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="w-10 shrink-0 font-mono text-[0.6rem] uppercase text-brand-500">get</span>
            <span className="flex-1 font-mono text-[0.6rem] text-ink-400">/resume.pdf</span>
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 font-mono text-[0.66rem] text-white transition-colors hover:bg-brand-600">
              <FiDownload className="text-xs" /> résumé
            </a>
          </div>
          <div className="border-t border-line px-4 py-2.5 font-mono text-[0.62rem] text-ink-400">
            region · {CONTACT.address}
          </div>
        </div>

        {/* routing table */}
        <div className="overflow-hidden rounded-2xl border border-line bg-paper/60">
          <div className="border-b border-line bg-mist/50 px-4 py-2.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-400">
            routing table · target role → proof
          </div>
          <ul>
            {ROLE_FIT.map((r) => (
              <li key={r.role} className="border-b border-line px-4 py-3 last:border-0">
                <p className="font-mono text-[0.76rem] text-ink">
                  <span className="text-brand-500">→</span> {r.role}
                </p>
                <p className="mt-1.5 font-mono text-[0.62rem] text-ink-500">
                  <span className="text-ink-400">runs:</span> {r.projects.join(" · ")}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {r.skills.map((s) => (
                    <span key={s} className="rounded border border-line bg-mist px-2 py-0.5 font-mono text-[0.58rem] text-ink-700">{s}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
