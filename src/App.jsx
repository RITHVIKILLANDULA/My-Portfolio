import { useState } from "react";
import { NAV_LINKS } from "./constants";
import useScrollSpy from "./hooks/useScrollSpy";

import Preloader from "./components/Preloader";
import HoloBackground from "./components/HoloBackground";
import AgentCompanion from "./components/AgentCompanion";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import SoundToggle from "./components/SoundToggle";
import ResumeExperience from "./components/ResumeExperience";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import AgentBots from "./components/AgentBots";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export default function App() {
  const [booted, setBooted] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  const openResume = () => setResumeOpen(true);

  return (
    <div className="relative min-h-screen text-neutral-300 antialiased">
      <Preloader onDone={() => setBooted(true)} />
      <HoloBackground />
      <AgentCompanion active={active} />
      <CustomCursor />
      <ScrollProgress active={active} />
      <SoundToggle />
      <ResumeExperience open={resumeOpen} onClose={() => setResumeOpen(false)} />

      <Navbar active={active} onOpenResume={openResume} />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <Hero booted={booted} onOpenResume={openResume} />
        <About />
        <Skills />
        <AgentBots />
        <Experience />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
