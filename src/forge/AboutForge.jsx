import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Reveal from "../cinematic/Reveal";
import { ABOUT_TEXT, SKILL_TAGS, CONTACT } from "../constants";
import heroPortrait from "../assets/Hero-portrait.jpg";

/**
 * About — reference-style split: a warm-graded framed portrait with a signature
 * first-name and socials on the left; a "Who I Am" skill marquee + bio on the
 * right. Fade-revealed (no typewriter). Forge palette.
 */
const SOCIALS = [
  { Icon: FaGithub, href: CONTACT.github, label: "GitHub" },
  { Icon: FaLinkedinIn, href: CONTACT.linkedin, label: "LinkedIn" },
  { Icon: FiMail, href: `mailto:${CONTACT.email}`, label: "Email" },
];

export default function AboutForge() {
  return (
    <section id="about" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        {/* portrait + signature + socials */}
        <Reveal kind="item">
          <div className="relative">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-line">
              <img
                src={heroPortrait}
                alt="Rithvik Illandula"
                className="h-full w-full object-cover"
                style={{ filter: "saturate(0.88) contrast(1.05) brightness(0.95)" }}
              />
              <div className="absolute inset-0 mix-blend-soft-light" style={{ background: "linear-gradient(180deg, rgba(255,122,47,0.22), rgba(255,122,47,0.04))" }} />
              <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(0deg, rgba(8,7,10,0.85), transparent)" }} />
              <p
                className="absolute bottom-4 left-5 font-display text-3xl font-semibold italic tracking-tight"
                style={{ color: "#ffd9a8" }}
              >
                Rithvik
              </p>
            </div>

            <div className="mt-5 flex max-w-sm gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-500 transition-colors hover:border-forge/50 hover:text-forge-500"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* who I am + marquee + bio */}
        <div>
          <Reveal kind="kicker">
            <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">
              who I am
            </p>
          </Reveal>

          <div className="relative mb-9 overflow-hidden border-y border-line py-3.5">
            <div className="marquee-track flex w-max gap-0 whitespace-nowrap">
              {[...SKILL_TAGS, ...SKILL_TAGS].map((t, i) => (
                <span key={i} className="flex items-center font-mono text-sm text-ink-500">
                  <span className="px-4">{t}</span>
                  <span className="text-forge-500">·</span>
                </span>
              ))}
            </div>
            {/* edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16" style={{ background: "linear-gradient(90deg, #08070a, transparent)" }} />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16" style={{ background: "linear-gradient(270deg, #08070a, transparent)" }} />
          </div>

          <Reveal kind="body">
            <div className="max-w-[58ch] space-y-4">
              {ABOUT_TEXT.split("\n\n").map((p, i) => (
                <p key={i} className="text-[1.02rem] leading-[1.75] text-ink-700">{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
