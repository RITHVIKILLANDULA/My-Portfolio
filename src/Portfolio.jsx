import useScrollSpy from "./hooks/useScrollSpy";

import Atmosphere from "./components/site/Atmosphere";
import Navbar from "./components/site/Navbar";
import HeroWorld from "./components/site/HeroWorld";
import About from "./components/site/About";
import Expertise from "./components/site/Expertise";
import Skills from "./components/site/Skills";
import Projects from "./components/site/Projects";
import Playground from "./components/playground/Playground";
import Experience from "./components/site/Experience";
import RecruiterMode from "./components/site/RecruiterMode";
import Contact from "./components/site/Contact";
import Footer from "./components/site/Footer";
import Guide from "./components/site/Guide";

const SECTION_IDS = [
  "home",
  "about",
  "expertise",
  "skills",
  "projects",
  "ai-lab",
  "experience",
  "recruiter",
  "contact",
];

export default function Portfolio() {
  const active = useScrollSpy(SECTION_IDS);

  return (
    <div className="min-h-screen text-ink">
      <a href="#main" className="skip-link">Skip to content</a>
      <Atmosphere />
      <Navbar active={active} />
      <main id="main">
        <HeroWorld />
        <About />
        <Expertise />
        <Skills />
        <Projects />
        <Playground />
        <Experience />
        <RecruiterMode />
        <Contact />
      </main>
      <Footer />
      <Guide active={active} />
    </div>
  );
}
