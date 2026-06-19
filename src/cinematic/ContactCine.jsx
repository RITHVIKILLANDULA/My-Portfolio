import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import Reveal from "./Reveal";
import { CONTACT, RESUME_URL } from "../constants";

/**
 * The closing moment: a big invitation and the ways to reach out. Oversized
 * email, plain links, no gimmicks — the last thing a recruiter sees should be
 * effortless to act on.
 */
export default function ContactCine() {
  return (
    <section id="contact" className="border-t border-line py-24 sm:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-forge-500">
            contact
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2 className="max-w-[20ch] font-display font-semibold leading-[1.02] tracking-[-0.03em] text-ink text-[clamp(2.4rem,7vw,5rem)]">
            Let&apos;s build something.
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-8 inline-flex items-center gap-3 font-display font-semibold tracking-[-0.02em] text-ink-700 transition-colors hover:text-forge-500 text-[clamp(1.3rem,4.5vw,2.4rem)]"
          >
            {CONTACT.email}
            <FiArrowUpRight className="shrink-0" />
          </a>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forge px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-forge-600"
            >
              <FiDownload className="text-sm" /> Résumé
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
            >
              LinkedIn <FiArrowUpRight />
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:border-ink-400 hover:text-ink"
            >
              GitHub <FiArrowUpRight />
            </a>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-8 font-mono text-[0.68rem] text-ink-400">
          <span>Rithvik Illandula — {CONTACT.address}</span>
          <a href="#top" className="transition-colors hover:text-ink">back to top ↑</a>
        </div>
      </div>
    </section>
  );
}
