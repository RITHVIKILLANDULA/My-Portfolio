import { useEffect, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { HERO_NAME, HERO_ROLES, HERO_CONTENT, STATS } from "../constants";
import DecodeText from "./ui/DecodeText";
import Counter from "./ui/Counter";
import Magnetic from "./ui/Magnetic";

export default function Hero({ booted, onOpenResume }) {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    if (!booted) return;
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % HERO_ROLES.length),
      2600
    );
    return () => clearInterval(id);
  }, [booted]);

  // CSS reveal gated on boot (framer-independent, reliable everywhere)
  const reveal = (delay, y = 20) => ({
    opacity: booted ? 1 : 0,
    transform: booted ? "none" : `translateY(${y}px)`,
    transition: `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}s, transform .7s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center pt-28">
      <div className="w-full">
        {/* status chip */}
        <div
          style={reveal(0.1, 16)}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-data-cyan/30 bg-data-cyan/5 px-4 py-1.5"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="mono-label text-[0.6rem] text-neutral-300">
            Open to Data Analyst roles · Buffalo, NY
          </span>
        </div>

        {/* name */}
        <h1 className="max-w-4xl text-5xl font-extralight leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-8xl">
          <DecodeText text={HERO_NAME} start={booted} speed={1.1} className="block" />
        </h1>

        {/* rotating role */}
        <div className="mt-5 flex h-10 items-center gap-3 sm:h-12">
          <span className="h-px w-10 bg-gradient-to-r from-data-cyan to-transparent" />
          <DecodeText
            key={roleIdx}
            text={HERO_ROLES[roleIdx]}
            start={booted}
            speed={0.8}
            className="gradient-text font-mono text-xl font-medium sm:text-3xl"
          />
        </div>

        {/* intro */}
        <p
          style={reveal(0.5)}
          className="mt-7 max-w-xl text-base font-light leading-relaxed text-neutral-300"
        >
          {HERO_CONTENT}
        </p>

        {/* CTAs */}
        <div style={reveal(0.65)} className="mt-9 flex flex-wrap items-center gap-4">
          <Magnetic strength={0.25}>
            <a
              href="#projects"
              data-cursor
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-6 py-3 text-sm font-semibold text-void-950 shadow-glow transition-shadow hover:shadow-glow-lg"
            >
              <HiOutlineSparkles className="text-base" />
              Explore the Work
              <FiArrowDownRight className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic strength={0.25}>
            <button
              onClick={onOpenResume}
              data-cursor
              className="group inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-200 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
            >
              ▶ Résumé Reel
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </Magnetic>
        </div>

        {/* stat counters */}
        <div
          style={reveal(0.85, 24)}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-void-700 bg-void-700/40 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="group bg-void-900/60 p-5 transition-colors hover:bg-void-850/80"
            >
              <div className="font-mono text-3xl font-bold text-white">
                <Counter value={s.value} decimals={s.decimals} />
                <span className="gradient-text">{s.suffix}</span>
              </div>
              <div className="mono-label mt-2 text-[0.55rem] leading-tight text-neutral-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <a
        href="#about"
        data-cursor
        style={{
          opacity: booted ? 1 : 0,
          transition: "opacity .7s ease 1.2s",
        }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-neutral-500 lg:flex"
        aria-label="Scroll down"
      >
        <span className="mono-label text-[0.55rem]">scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-neutral-700 p-1">
          <span className="h-1.5 w-1 animate-bounce rounded-full bg-data-cyan" />
        </span>
      </a>
    </section>
  );
}
