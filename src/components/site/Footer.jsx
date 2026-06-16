import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { CONTACT } from "../../constants";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 px-5 py-10 font-mono text-[0.7rem] text-ink-400 sm:flex-row sm:items-center sm:px-8">
        <p className="uppercase tracking-[0.14em]">
          Rithvik Illandula — Buffalo, NY · 2026
        </p>
        <div className="flex items-center gap-5">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-base transition-colors hover:text-ink">
            <FaLinkedin />
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-base transition-colors hover:text-ink">
            <FaGithub />
          </a>
          <a href="#home" className="inline-flex items-center gap-1 uppercase tracking-[0.14em] transition-colors hover:text-ink">
            Top <FiArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
