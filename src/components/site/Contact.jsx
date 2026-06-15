import { useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail, FiCopy, FiCheck, FiArrowUpRight } from "react-icons/fi";
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
    <section id="contact" className="section bg-mist">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          center
          kicker="Contact"
          title="Let's talk"
          intro="Have a dataset, a dashboard, or a role in mind? I'd love to hear from you."
        />

        <Reveal className="mx-auto max-w-xl">
          <div className="card p-7 text-center sm:p-9">
            <button
              onClick={copy}
              className="mx-auto inline-flex items-center gap-2.5 rounded-xl border border-line bg-mist px-4 py-2.5 text-sm transition-colors hover:border-brand/40"
            >
              <FiMail className="text-brand" />
              <span className="font-medium text-ink">{CONTACT.email}</span>
              {copied ? <FiCheck className="text-emerald-500" /> : <FiCopy className="text-ink-400" />}
            </button>
            <p className="mt-2 h-4 text-xs text-emerald-600">{copied ? "Copied to clipboard" : ""}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={MAILTO} className="btn-primary">
                Send a message <FiArrowUpRight />
              </a>
              <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                View résumé
              </a>
            </div>

            <div className="mt-7 flex items-center justify-center gap-5 border-t border-line pt-6 text-xl text-ink-400">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-brand">
                <FaLinkedin />
              </a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-brand">
                <FaGithub />
              </a>
            </div>

            <p className="mt-5 text-xs text-ink-400">
              {CONTACT.address} · usually replies within a day
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
