import { FiArrowRight, FiArrowDown, FiDownload } from "react-icons/fi";
import ParticleField from "./ParticleField";
import { RESUME_URL } from "../constants";
import heroPortrait from "../assets/Hero-portrait.jpg";

const HERO_IMG = heroPortrait;

/**
 * Forge-style cinematic hero: a dark industrial base, a warm forged-metal glow,
 * ambient embers, huge molten typography on the left, and a warm-graded portrait
 * on the right that fades into the dark. Degrades to type-only if no photo yet.
 */
export default function ForgeHero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden" style={{ background: "#08070a" }}>
      {/* portrait — right side, warm-graded, fading into the dark */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})`, filter: "saturate(0.85) contrast(1.05) brightness(0.92)" }}
        />
        {/* amber forge grade */}
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(180deg, rgba(255,122,47,0.25), rgba(255,122,47,0.05))" }} />
        {/* readability scrims: dark from left + bottom + top */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #08070a 8%, rgba(8,7,10,0.7) 32%, rgba(8,7,10,0.15) 70%, rgba(8,7,10,0.55) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(0deg, #08070a, transparent)" }} />
        <div className="absolute inset-x-0 top-0 h-28" style={{ background: "linear-gradient(180deg, #08070a, transparent)" }} />
      </div>

      {/* forged-metal warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(110% 80% at 78% 108%, rgba(255,122,47,0.22) 0%, transparent 52%), radial-gradient(70% 55% at 10% -8%, rgba(255,176,97,0.08) 0%, transparent 50%)" }}
      />
      <ParticleField />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-10">
        <p className="mb-7 flex items-center gap-2.5 font-mono text-[0.7rem] uppercase tracking-[0.28em]" style={{ color: "#caa98a" }}>
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute h-2 w-2 animate-ping rounded-full" style={{ background: "rgba(255,122,47,0.5)" }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#ff7a2f" }} />
          </span>
          data · AI · software engineer — available
        </p>

        <h1
          className="font-display font-semibold uppercase leading-[0.86] tracking-[-0.03em]"
          style={{
            fontSize: "clamp(3rem, 12.5vw, 9.5rem)",
            backgroundImage: "linear-gradient(180deg, #fff6ec 0%, #ffd9a8 55%, #ff944d 130%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Rithvik
          <br />
          Illandula
        </h1>

        <p className="mt-8 max-w-[26ch] text-[clamp(1.05rem,2vw,1.5rem)] leading-[1.5]" style={{ color: "#e2d4c6" }}>
          I forge data &amp; AI systems that actually ship — pipelines, models,
          and the software around them.
        </p>

        <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "#a08f7e" }}>
          <span>Deloitte</span><span style={{ color: "#5a4c40" }}>/</span>
          <span>University at Buffalo</span><span style={{ color: "#5a4c40" }}>/</span>
          <span>3 CS degrees</span><span style={{ color: "#5a4c40" }}>/</span>
          <span>4+ yrs</span>
        </p>

        <div className="mt-11 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-black transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: "linear-gradient(180deg, #ffb061, #ff7a2f)", boxShadow: "0 12px 40px -12px rgba(255,122,47,0.6)" }}
          >
            View the work
            <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-colors"
            style={{ borderColor: "rgba(255,176,97,0.3)", color: "#e8d9c9" }}
          >
            <FiDownload className="text-sm" /> Résumé
          </a>
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2" style={{ color: "#a08f7e" }}>
        <FiArrowDown className="scrollcue text-lg" />
      </div>
    </section>
  );
}
