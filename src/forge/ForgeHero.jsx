import { FiArrowRight, FiArrowDown, FiDownload } from "react-icons/fi";
import ParticleField from "./ParticleField";
import { RESUME_URL } from "../constants";

/**
 * Forge-style cinematic hero: a dark industrial base, a warm forged-metal glow,
 * ambient embers, and huge bold typography. Settled on load. Warm amber accent
 * on near-black — the "exploring a real digital workshop" register.
 */
export default function ForgeHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: "#08070a" }}
    >
      {/* forged-metal warm glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 70% 110%, rgba(255,122,47,0.28) 0%, rgba(255,122,47,0.08) 28%, transparent 55%), radial-gradient(80% 60% at 12% -10%, rgba(255,176,97,0.10) 0%, transparent 50%)",
        }}
      />
      {/* brushed-metal sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.5) 100%)",
        }}
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

        <p className="mt-8 max-w-[30ch] text-[clamp(1.05rem,2vw,1.5rem)] leading-[1.5]" style={{ color: "#d8c9bb" }}>
          I forge data &amp; AI systems that actually ship — pipelines, models,
          and the software around them.
        </p>

        <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.18em]" style={{ color: "#8c7a6a" }}>
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

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2" style={{ color: "#8c7a6a" }}>
        <FiArrowDown className="scrollcue text-lg" />
      </div>
    </section>
  );
}
