import { useState } from "react";
import { NAV_LINKS } from "./constants";
import useScrollSpy from "./hooks/useScrollSpy";
import useSmoothScroll from "./hooks/useSmoothScroll";

import AISystemBoot from "./components/world/AISystemBoot";
import GuideBackdrop from "./components/guided/GuideBackdrop";
import ScrollProgress from "./components/ScrollProgress";
import ResumeExperience from "./components/ResumeExperience";

import Navbar from "./components/Navbar";
import RobotWorld from "./components/robot/RobotWorld";
import RecruiterSnapshot from "./components/RecruiterSnapshot";
import About from "./components/About";
import Skills from "./components/Skills";
import AgentBots from "./components/AgentBots";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const SECTION_IDS = NAV_LINKS.map((l) => l.id);

export default function ImmersiveSite({ smooth = true }) {
  const [resumeOpen, setResumeOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS);
  useSmoothScroll(smooth);
  const openResume = () => setResumeOpen(true);

  return (
    <div className="relative min-h-screen text-neutral-300 antialiased">
      <GuideBackdrop />
      <AISystemBoot />
      <ScrollProgress active={active} />
      <ResumeExperience open={resumeOpen} onClose={() => setResumeOpen(false)} />

      <Navbar active={active} onOpenResume={openResume} />

      {/* full-bleed interactive robot world */}
      <RobotWorld onOpenResume={openResume} />

      <main className="mx-auto max-w-6xl px-5 sm:px-8">
        <RecruiterSnapshot onOpenResume={openResume} />
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
