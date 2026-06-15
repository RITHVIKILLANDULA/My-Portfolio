import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { CONTACT } from "../../constants";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-ink-400">
          © 2026 Rithvik Illandula · Built with React &amp; Tailwind
        </p>
        <div className="flex items-center gap-5 text-ink-400">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-ink">
            <FaLinkedin />
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-ink">
            <FaGithub />
          </a>
          <a href="#home" className="inline-flex items-center gap-1 text-sm transition-colors hover:text-ink">
            Top <FiArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
