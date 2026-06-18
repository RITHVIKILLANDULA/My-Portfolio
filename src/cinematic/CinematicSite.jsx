import { useEffect, useState } from "react";
import Loader from "../components/site/Loader";
import CinematicHero from "./CinematicHero";
import StatementBand from "./StatementBand";
import WhatIBuild from "./WhatIBuild";
import SelectedWork from "./SelectedWork";
import LiveDemos from "./LiveDemos";
import ExperienceCine from "./ExperienceCine";
import ContactCine from "./ContactCine";
import { RESUME_URL } from "../constants";

/**
 * The cinematic single-page portfolio: one smooth scroll, top to bottom, big
 * type, sections gliding in as you go. Everything visible without a click.
 */
const LINKS = [
  { id: "work", label: "build" },
  { id: "projects", label: "work" },
  { id: "live", label: "demos" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-canvas/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-10">
        <a href="#top" className="font-display text-sm font-semibold tracking-tight text-ink">
          Rithvik Illandula
        </a>
        <nav className="flex items-center gap-5 font-mono text-[0.72rem] text-ink-500 sm:gap-6">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="hidden transition-colors hover:text-ink md:block">
              {l.label}
            </a>
          ))}
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-line px-3.5 py-1.5 text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
          >
            résumé
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function CinematicSite() {
  return (
    <div className="relative bg-canvas text-ink">
      <a href="#work" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <CinematicHero />
        <StatementBand />
        <WhatIBuild />
        <SelectedWork />
        <LiveDemos />
        <ExperienceCine />
        <ContactCine />
      </main>
      <Loader />
    </div>
  );
}
