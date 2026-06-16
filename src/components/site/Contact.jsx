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
    <section id="contact" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="06"
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
