import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiArrowDown, FiDownload } from "react-icons/fi";
import RoleCycler from "../components/ui/RoleCycler";
import GraphHero from "../three/GraphHero";
import { RESUME_URL } from "../constants";

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Hero: big type on the left, an interactive 3D knowledge graph of his work on
 * the right (drag to spin, hover a node). Settled on load (the loader covers
 * entry — no sliding text); a gentle parallax exit as you scroll past.
 */
export default function CinematicHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        {/* left — identity */}
        <motion.div className="relative z-10 pt-24 lg:pt-0" style={reduced ? undefined : { y, opacity }}>
          <p className="mb-6 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ink-400">
            <span className="relative grid h-2 w-2 place-items-center">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-brand-500/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            available for data · AI · software roles
          </p>

          <h1 className="font-display text-hero text-ink">
            Rithvik
            <br />
            Illandula
          </h1>

          <p className="mt-7 max-w-[24ch] font-display leading-[1.12] tracking-[-0.02em] text-ink-700 text-[clamp(1.35rem,3.4vw,2.2rem)]">
            I build data &amp; AI systems that actually ship.
          </p>

          <p className="mt-7 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-400">
            <span>Deloitte</span>
            <span className="text-ink-300">/</span>
            <span>University at Buffalo</span>
            <span className="text-ink-300">/</span>
            <span>3 CS degrees</span>
            <span className="text-ink-300">/</span>
            <span>4+ yrs</span>
          </p>

          <p className="mt-5 font-mono text-sm text-ink-500 sm:text-base">
            <span className="text-ink-400">&gt;</span>{" "}
            <span className="font-medium text-brand-500">
              <RoleCycler />
            </span>
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white shadow-brand transition-[transform,background-color] duration-200 hover:bg-brand-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              View the work
              <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
            >
              <FiDownload className="text-sm" /> Résumé
            </a>
          </div>
        </motion.div>

        {/* right — interactive knowledge graph */}
        <div className="relative h-[52vh] w-full lg:h-[78vh]">
          <div className="absolute inset-0">
            <GraphHero />
          </div>
          <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400">
            <span className="hidden lg:inline">drag to explore · hover a node</span>
            <span className="lg:hidden">my work, mapped</span>
          </p>
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#projects"
        aria-label="Scroll to work"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 text-ink-400 transition-colors hover:text-ink lg:block"
      >
        <FiArrowDown className="scrollcue text-lg" />
      </a>
    </section>
  );
}
