import { FiArrowUpRight, FiDownload, FiArrowUp } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import Reveal from "../cinematic/Reveal";
import { CONTACT, RESUME_URL } from "../constants";
import heroPortrait from "../assets/Hero-portrait.jpg";

/**
 * Reference-style closing footer: a large warm-graded portrait fading into the
 * forge dark, an oversized "let's build something" CTA, the email, socials, and
 * a colophon. The last cinematic beat.
 */
export default function ForgeFooter() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line" style={{ background: "#08070a" }}>
      {/* portrait — right, fading into the metal */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroPortrait})`, filter: "saturate(0.85) contrast(1.05) brightness(0.85)" }}
        />
        <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(180deg, rgba(255,122,47,0.2), rgba(255,122,47,0.03))" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, #08070a 6%, rgba(8,7,10,0.6) 38%, rgba(8,7,10,0.2) 100%)" }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: "linear-gradient(0deg, #08070a, transparent)" }} />
        <div className="absolute inset-x-0 top-0 h-24" style={{ background: "linear-gradient(180deg, #08070a, transparent)" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:px-10 sm:py-40">
        <Reveal kind="kicker">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">
            available for data · AI · software roles
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2
            className="max-w-[14ch] font-display font-semibold uppercase leading-[0.9] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(2.6rem, 8vw, 6.5rem)",
              backgroundImage: "linear-gradient(180deg, #fff6ec, #ffd9a8 60%, #ff944d 130%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Let&apos;s build something.
          </h2>
        </Reveal>

        <Reveal kind="body">
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-8 inline-flex items-center gap-3 font-mono text-[clamp(1rem,3vw,1.6rem)] text-ink-700 transition-colors hover:text-forge-500"
          >
            {CONTACT.email}
            <FiArrowUpRight className="shrink-0" />
          </a>
        </Reveal>

        <Reveal kind="body">
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5"
              style={{ background: "linear-gradient(180deg, #ffb061, #ff7a2f)" }}
            >
              <FiDownload className="text-sm" /> Résumé
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:border-forge/50 hover:text-forge-500">
              <FaLinkedinIn />
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:border-forge/50 hover:text-forge-500">
              <FaGithub />
            </a>
          </div>
        </Reveal>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-8 font-mono text-[0.68rem] text-ink-400">
          <span>Rithvik Illandula — {CONTACT.address} · 2026</span>
          <a href="#top" className="inline-flex items-center gap-1.5 transition-colors hover:text-forge-500">
            back to top <FiArrowUp />
          </a>
        </div>
      </div>
    </section>
  );
}
