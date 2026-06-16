import useScrollSpy from "./hooks/useScrollSpy";

import Atmosphere from "./components/site/Atmosphere";
import Navbar from "./components/site/Navbar";
import HeroWorld from "./components/site/HeroWorld";
import About from "./components/site/About";
import Skills from "./components/site/Skills";
import Experience from "./components/site/Experience";
import Projects from "./components/site/Projects";
import Playground from "./components/playground/Playground";
import Contact from "./components/site/Contact";
import Footer from "./components/site/Footer";

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "playground",
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
        <Skills />
        <Experience />
        <Projects />
        <Playground />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
