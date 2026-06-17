import { useEffect, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";
import { NAV_LINKS, CONTACT, RESUME_URL } from "../../constants";

export default function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a href="#home" className="flex items-center gap-2.5 font-semibold text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white shadow-glow">
            RI
          </span>
          <span className="hidden text-[0.95rem] sm:block">Rithvik Illandula</span>
        </a>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              aria-current={active === l.id ? "page" : undefined}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active === l.id ? "font-medium text-brand" : "text-ink-500 hover:text-ink"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hidden text-ink-400 transition-colors hover:text-ink sm:block">
            <FaLinkedin />
          </a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hidden text-ink-400 transition-colors hover:text-ink sm:block">
            <FaGithub />
          </a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-primary hidden !px-4 !py-2 !text-xs sm:inline-flex">
            Résumé
          </a>
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-9 w-9 place-items-center text-ink md:hidden">
            <HiOutlineMenuAlt4 className="text-xl" />
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col gap-1 border-l border-line bg-paper p-6 pt-5">
            <button onClick={() => setOpen(false)} aria-label="Close" className="mb-4 self-end text-2xl text-ink-500">
              <HiX />
            </button>
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm ${active === l.id ? "bg-brand-soft font-medium text-brand" : "text-ink-700"}`}
              >
                {l.label}
              </a>
            ))}
            <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-primary mt-4">
              Résumé
            </a>
            <div className="mt-auto flex gap-4 pt-6 text-lg text-ink-400">
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer"><FaLinkedin /></a>
              <a href={CONTACT.github} target="_blank" rel="noreferrer"><FaGithub /></a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
