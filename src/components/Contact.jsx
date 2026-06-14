import { useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiCheck,
  HiOutlineClipboard,
} from "react-icons/hi2";
import { FiArrowUpRight } from "react-icons/fi";
import { CONTACT, RESUME_URL } from "../constants";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Magnetic from "./ui/Magnetic";

const MAILTO = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Let's talk — AI / Data role"
)}&body=${encodeURIComponent(
  "Hi Rithvik,\n\nI came across your portfolio and would love to connect about "
)}`;

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      void e;
    }
  };

  const cards = [
    {
      icon: <HiOutlineMapPin />,
      label: "location",
      value: CONTACT.address,
      href: null,
    },
    {
      icon: <HiOutlinePhone />,
      label: "phone",
      value: CONTACT.phoneNo,
      href: `tel:${CONTACT.phoneNo}`,
    },
  ];

  return (
    <section id="contact" className="scroll-mt-24 py-24">
      <SectionHeading
        index="06"
        kicker="open_a_channel"
        title="Get in Touch"
        subtitle="Have a dataset, a dashboard, or a role in mind? Let's talk."
      />

      <Reveal from="up" className="mx-auto max-w-3xl">
        <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />

          {/* email — primary */}
          <div className="mb-8 text-center">
            <p className="mono-label mb-3 text-[0.6rem] text-neutral-500">
              primary endpoint
            </p>
            <button
              onClick={copyEmail}
              data-cursor
              className="group inline-flex items-center gap-3 rounded-xl border border-data-cyan/25 bg-void-900/50 px-5 py-3 transition-all hover:border-data-cyan/60 hover:shadow-glow"
            >
              <HiOutlineEnvelope className="text-data-cyan" />
              <span className="font-mono text-sm text-neutral-100 sm:text-base">
                {CONTACT.email}
              </span>
              <span className="text-neutral-500 transition-colors group-hover:text-data-cyan">
                {copied ? (
                  <HiCheck className="text-emerald-400" />
                ) : (
                  <HiOutlineClipboard />
                )}
              </span>
            </button>
            <p className="mono-label mt-2 h-3 text-[0.55rem] text-emerald-400">
              {copied ? "copied to clipboard" : ""}
            </p>

            {/* primary actions */}
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              <a
                href={MAILTO}
                data-cursor
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-5 py-2.5 text-sm font-semibold text-void-950"
              >
                Send a message <FiArrowUpRight />
              </a>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/12 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
              >
                View résumé
              </a>
            </div>

            {/* meta-signal — quiet instrument-panel status line */}
            <div className="mono-label mt-5 flex items-center justify-center gap-2 text-[0.55rem] text-neutral-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              online · usually replies within a day · Buffalo, NY (EST)
            </div>
          </div>

          {/* secondary cards */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {cards.map((c) => {
              const inner = (
                <div className="flex items-center gap-3 rounded-xl border border-void-700 bg-void-900/40 p-4 transition-colors hover:border-data-indigo/50">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-data-indigo/30 bg-data-indigo/10 text-data-violet">
                    {c.icon}
                  </span>
                  <div className="text-left">
                    <p className="mono-label text-[0.55rem] text-neutral-500">
                      {c.label}
                    </p>
                    <p className="text-sm text-neutral-200">{c.value}</p>
                  </div>
                </div>
              );
              return c.href ? (
                <a key={c.label} href={c.href} data-cursor>
                  {inner}
                </a>
              ) : (
                <div key={c.label}>{inner}</div>
              );
            })}
          </div>

          {/* socials */}
          <div className="flex items-center justify-center gap-5">
            <Magnetic>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor
                aria-label="LinkedIn"
                className="grid h-12 w-12 place-items-center rounded-xl border border-void-700 text-xl text-neutral-300 transition-all hover:border-data-cyan/60 hover:text-data-cyan"
              >
                <FaLinkedin />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                data-cursor
                aria-label="GitHub"
                className="grid h-12 w-12 place-items-center rounded-xl border border-void-700 text-xl text-neutral-300 transition-all hover:border-data-cyan/60 hover:text-data-cyan"
              >
                <FaGithub />
              </a>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
