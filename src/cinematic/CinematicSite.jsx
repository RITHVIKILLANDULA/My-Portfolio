import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import useLenis from "../hooks/useLenis";
import Loader from "../components/site/Loader";
import ForgeHero from "../forge/ForgeHero";
import RecruiterQuickview from "./RecruiterQuickview";
import StatementBand from "./StatementBand";
import AboutForge from "../forge/AboutForge";
import WhatIBuild from "./WhatIBuild";
import SelectedWork from "./SelectedWork";
import LiveDemos from "./LiveDemos";
import ExperienceCine from "./ExperienceCine";
import ForgeFooter from "../forge/ForgeFooter";
import ForgeAvatar from "../forge/ForgeAvatar";
import { RESUME_URL } from "../constants";

/**
 * The cinematic single-page portfolio: one smooth (Lenis) scroll, top to bottom,
 * big type, sections gliding in as you go. Everything visible without a click.
 */
const LINKS = [
  { id: "about", label: "about" },
  { id: "work", label: "build" },
  { id: "projects", label: "work" },
  { id: "live", label: "demos" },
  { id: "experience", label: "experience" },
  { id: "contact", label: "contact" },
];

function Nav() {
  const [solid, setSolid] = useState(false);
  const { scrollYProgress } = useScroll();
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
        <a href="#top" className="flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight text-ink">
          <ForgeAvatar size={32} online={false} />
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
            className="rounded-full border border-forge/40 bg-forge-soft px-3.5 py-1.5 text-forge-500 transition-colors hover:border-forge/70"
          >
            résumé
          </a>
        </nav>
      </div>
      {/* scroll progress */}
      <motion.div
        className="h-px origin-left bg-forge"
        style={{ scaleX: scrollYProgress, opacity: solid ? 1 : 0 }}
      />
    </header>
  );
}

export default function CinematicSite() {
  useLenis();
  return (
    <div className="relative bg-canvas text-ink">
      <a href="#work" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <ForgeHero />
        <RecruiterQuickview />
        <StatementBand />
        <AboutForge />
        <WhatIBuild />
        <SelectedWork />
        <LiveDemos />
        <ExperienceCine />
        <ForgeFooter />
      </main>
      <Loader />
    </div>
  );
}
