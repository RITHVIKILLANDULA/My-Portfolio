import { useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiCopy, FiCheck, FiArrowUpRight } from "react-icons/fi";
import { CONTACT, RESUME_URL } from "../../constants";
import SectionHeading from "./SectionHeading";
import Reveal from "../ui/Reveal";

const MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent("Let's talk — AI / Data role")}`;

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id="contact" className="section relative overflow-hidden">
      {/* exit portal — pipelines converging to a send point */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 translate-x-1/4 lg:block">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.14),transparent_66%)] [animation:corepulse_6s_ease-in-out_infinite]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 520" fill="none">
          <path d="M40 90 C 200 160, 230 230, 260 260" stroke="#a9a3ee" strokeWidth="1.5" className="dashflow" />
          <path d="M30 430 C 200 360, 230 300, 260 260" stroke="#86d8f0" strokeWidth="1.5" className="dashflow" />
          <path d="M120 30 C 230 150, 250 230, 260 260" stroke="#9fe6d2" strokeWidth="1.5" className="dashflow" />
          <circle cx="260" cy="260" r="130" stroke="#c7c1f3" strokeWidth="1" strokeDasharray="2 8" className="spin-slow" style={{ transformOrigin: "260px 260px" }} />
          <circle cx="260" cy="260" r="92" stroke="#4b47d6" strokeWidth="1.5" strokeDasharray="44 16" opacity="0.7" className="spin-rev" style={{ transformOrigin: "260px 260px" }} />
        </svg>
        <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand shadow-[0_16px_44px_-12px_rgba(75,71,214,0.6)]">
          <FiArrowUpRight className="-rotate-45 text-xl text-white" />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="08"
          kicker="Contact"
          title="Let's talk"
          intro="Have a dataset, a dashboard, or a role in mind? I'd love to hear from you."
        />

        <Reveal>
          <a
            href={MAILTO}
            className="group inline-block font-display text-3xl font-semibold tracking-tight text-ink transition-colors hover:text-brand sm:text-5xl"
          >
            {CONTACT.email}
            <FiArrowUpRight className="ml-1 inline-block align-top text-2xl text-ink-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand sm:text-3xl" />
          </a>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-primary">
              View résumé
            </a>
            <button onClick={copy} className="btn-ghost">
              {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy />}
              {copied ? "Copied" : "Copy email"}
            </button>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-400 transition-colors hover:border-ink-300 hover:text-brand">
              <FaLinkedin />
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-400 transition-colors hover:border-ink-300 hover:text-brand">
              <FaGithub />
            </a>
          </div>

          <p className="mt-8 font-mono text-xs text-ink-400">
            {CONTACT.address} · usually replies within a day
          </p>
        </Reveal>
      </div>
    </section>
  );
}
