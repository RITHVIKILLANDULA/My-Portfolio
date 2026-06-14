import { useEffect, useRef, useState } from "react";
import {
  HiXMark,
  HiPlay,
  HiPause,
  HiChevronLeft,
  HiChevronRight,
  HiArrowDownTray,
  HiArrowPath,
  HiCheckBadge,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import {
  HERO_NAME,
  RESUME_SUMMARY,
  STATS,
  EXPERIENCES,
  SKILL_CATEGORIES,
  EDUCATION,
  CERTIFICATIONS,
  COURSEWORK,
  CONTACT,
  RESUME_URL,
} from "../constants";
import DecodeText from "./ui/DecodeText";

/* ---------- small CSS-driven helpers (framer-independent) ---------- */

const In = ({ d = 0, className = "", children, style }) => (
  <div
    className={`rx-anim ${className}`}
    style={{ animationDelay: `${d}s`, ...style }}
  >
    {children}
  </div>
);

// count-up driven by setInterval (reliable everywhere, no rAF/IO)
function ReelCounter({ value, decimals = 0, duration = 1200 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setN(value);
      return;
    }
    const steps = 40;
    let i = 0;
    const id = setInterval(() => {
      i++;
      const p = i / steps;
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (i >= steps) {
        setN(value);
        clearInterval(id);
      }
    }, duration / steps);
    return () => clearInterval(id);
  }, [value, duration]);
  return <>{n.toFixed(decimals)}</>;
}

// bar that fills via CSS transition after a delay (setTimeout = reliable)
function ReelBar({ level, accent, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(level), 80 + delay * 1000);
    return () => clearTimeout(t);
  }, [level, delay]);
  return (
    <div className="h-1 overflow-hidden rounded-full bg-void-700">
      <div
        className="h-full rounded-full"
        style={{
          width: `${w}%`,
          transition: "width 0.9s cubic-bezier(.22,1,.36,1)",
          background: `linear-gradient(90deg, ${accent}, #a78bfa)`,
        }}
      />
    </div>
  );
}

function Shell({ accent, children }) {
  return (
    <div
      className="rx-chapter relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-6 text-center"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: `${accent}22` }}
      />
      {children}
    </div>
  );
}

/* ---------- chapters ---------- */

const Intro = () => (
  <Shell accent="#22d3ee">
    <In className="mono-label mb-6 text-[0.7rem] text-data-cyan/80">
      interactive résumé · press play
    </In>
    <In d={0.1}>
      <div className="relative mb-8 h-28 w-28">
        <div className="absolute inset-0 animate-spin-slow rounded-full border border-data-cyan/40 border-t-data-cyan" />
        <div className="absolute inset-3 animate-spin-slower rounded-full border border-data-indigo/30 border-b-data-indigo" />
        <div className="absolute inset-0 grid place-items-center font-mono text-2xl font-bold text-data-cyan">
          RI
        </div>
        <div className="absolute inset-[44%] animate-pulseGlow rounded-full bg-data-cyan blur-[6px]" />
      </div>
    </In>
    <h2 className="rx-anim text-5xl font-extralight tracking-tight text-white sm:text-7xl" style={{ animationDelay: "0.2s" }}>
      <DecodeText text={HERO_NAME} speed={1.1} />
    </h2>
    <In d={0.4} className="gradient-text mt-4 font-mono text-2xl font-medium sm:text-4xl">
      AI Data Analyst
    </In>
  </Shell>
);

const Summary = () => (
  <Shell accent="#38bdf8">
    <In className="mono-label mb-6 text-[0.7rem] text-data-cyan/80">
      01 · the snapshot
    </In>
    <In d={0.1} className="max-w-3xl text-2xl font-light leading-relaxed text-neutral-100 sm:text-3xl">
      {RESUME_SUMMARY}
    </In>
    <div className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
      {STATS.map((s, i) => (
        <In
          key={s.label}
          d={0.4 + i * 0.12}
          className="rounded-2xl border border-void-700 bg-void-900/50 p-4"
        >
          <div className="font-mono text-3xl font-bold text-white sm:text-4xl">
            <ReelCounter value={s.value} decimals={s.decimals} />
            <span className="gradient-text">{s.suffix}</span>
          </div>
          <div className="mono-label mt-2 text-[0.5rem] leading-tight text-neutral-400">
            {s.label}
          </div>
        </In>
      ))}
    </div>
  </Shell>
);

const Experience = () => (
  <Shell accent="#6366f1">
    <In className="mono-label mb-8 text-[0.7rem] text-data-cyan/80">
      02 · the track record
    </In>
    <div className="grid w-full gap-4 lg:grid-cols-3">
      {EXPERIENCES.map((e, i) => (
        <In
          key={e.company}
          d={0.2 + i * 0.18}
          className="glass flex flex-col rounded-2xl p-5 text-left"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-data-cyan/40 bg-void-850 font-mono text-xs font-bold text-data-cyan">
              {e.mono || "•"}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{e.role}</p>
              <p className="text-xs text-data-violet">{e.company}</p>
            </div>
          </div>
          <p className="mono-label mb-3 text-[0.5rem] text-neutral-500">
            {e.year}
          </p>
          <div className="flex-1 space-y-1.5">
            {e.metrics?.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 text-xs text-neutral-300"
              >
                <span className="h-1 w-1 rounded-full bg-data-cyan" />
                {m}
              </div>
            ))}
          </div>
        </In>
      ))}
    </div>
  </Shell>
);

const Skills = () => (
  <Shell accent="#a78bfa">
    <In className="mono-label mb-8 text-[0.7rem] text-data-cyan/80">
      03 · the toolkit
    </In>
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {SKILL_CATEGORIES.map((c, ci) => (
        <In key={c.name} d={0.2 + ci * 0.1} className="glass rounded-2xl p-4 text-left">
          <p className="mono-label mb-3 text-[0.55rem]" style={{ color: c.accent }}>
            {c.name}
          </p>
          <div className="space-y-2.5">
            {c.skills.slice(0, 3).map((s, si) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-[0.65rem] text-neutral-300">
                  <span>{s.name}</span>
                  <span className="font-mono text-neutral-500">{s.level}%</span>
                </div>
                <ReelBar
                  level={s.level}
                  accent={c.accent}
                  delay={0.35 + ci * 0.1 + si * 0.08}
                />
              </div>
            ))}
          </div>
        </In>
      ))}
    </div>
  </Shell>
);

const Credentials = () => (
  <Shell accent="#e879f9">
    <In className="mono-label mb-8 text-[0.7rem] text-data-cyan/80">
      04 · the credentials
    </In>
    {EDUCATION.map((e) => (
      <In key={e.title} d={0.1} className="glass mb-5 w-full max-w-2xl rounded-2xl p-5 text-left">
        <p className="text-lg font-medium text-white">{e.title}</p>
        <p className="text-sm text-neutral-400">
          {e.school} · {e.year}
        </p>
      </In>
    ))}
    <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
      {CERTIFICATIONS.map((c, i) => (
        <In
          key={c}
          d={0.3 + i * 0.1}
          className="flex items-start gap-2 rounded-xl border border-void-700 bg-void-900/40 p-3 text-left"
        >
          <HiCheckBadge className="mt-0.5 shrink-0 text-data-cyan" />
          <span className="text-xs leading-tight text-neutral-200">{c}</span>
        </In>
      ))}
    </div>
    <In d={0.7} className="mt-5 flex max-w-3xl flex-wrap justify-center gap-1.5">
      {COURSEWORK.map((c) => (
        <span
          key={c}
          className="rounded border border-void-700 bg-void-900/60 px-1.5 py-0.5 font-mono text-[0.55rem] text-neutral-400"
        >
          {c}
        </span>
      ))}
    </In>
  </Shell>
);

const Outro = ({ onReplay, onClose }) => (
  <Shell accent="#22d3ee">
    <In className="text-4xl font-extralight tracking-tight text-white sm:text-6xl">
      Let&apos;s build with <span className="gradient-text">data</span>.
    </In>
    <In d={0.15} className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <a
        href={`mailto:${CONTACT.email}`}
        data-cursor
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-5 py-3 text-sm font-semibold text-void-950 shadow-glow"
      >
        <HiOutlineEnvelope /> {CONTACT.email}
      </a>
      <a
        href={CONTACT.linkedin}
        target="_blank"
        rel="noreferrer"
        data-cursor
        aria-label="LinkedIn"
        className="grid h-12 w-12 place-items-center rounded-xl border border-void-700 text-xl text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
      >
        <FaLinkedin />
      </a>
      <a
        href={CONTACT.github}
        target="_blank"
        rel="noreferrer"
        data-cursor
        aria-label="GitHub"
        className="grid h-12 w-12 place-items-center rounded-xl border border-void-700 text-xl text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
      >
        <FaGithub />
      </a>
    </In>
    <In d={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={onReplay}
        data-cursor
        className="inline-flex items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-data-cyan"
      >
        <HiArrowPath /> Replay
      </button>
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noreferrer"
        data-cursor
        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-data-cyan"
      >
        <HiArrowDownTray /> Download PDF
      </a>
      <button
        onClick={onClose}
        data-cursor
        className="text-sm text-neutral-400 transition-colors hover:text-white"
      >
        Back to site
      </button>
    </In>
  </Shell>
);

/* ---------- the reel ---------- */

const CHAPTERS = [
  { key: "intro", accent: "#22d3ee", dur: 4500, auto: true },
  { key: "summary", accent: "#38bdf8", dur: 7000, auto: true },
  { key: "experience", accent: "#6366f1", dur: 8000, auto: true },
  { key: "skills", accent: "#a78bfa", dur: 7000, auto: true },
  { key: "credentials", accent: "#e879f9", dur: 6500, auto: true },
  { key: "outro", accent: "#22d3ee", dur: 0, auto: false },
];
const LAST = CHAPTERS.length - 1;

export default function ResumeExperience({ open, onClose }) {
  const [render, setRender] = useState(open);
  const [shown, setShown] = useState(false);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const closeTimer = useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // mount / unmount with CSS fade — never depends on an animation callback
  useEffect(() => {
    clearTimeout(closeTimer.current);
    if (open) {
      setRender(true);
      setIndex(0);
      setPlaying(true);
      const t = setTimeout(() => setShown(true), 20);
      return () => clearTimeout(t);
    }
    if (render) {
      setShown(false);
      closeTimer.current = setTimeout(() => setRender(false), 450);
    }
    return () => clearTimeout(closeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // body scroll lock + keyboard controls
  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      else if (e.key === "ArrowRight") setIndex((i) => Math.min(LAST, i + 1));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [render, onClose]);

  if (!render) return null;

  const accent = CHAPTERS[index].accent;
  const advance = () => setIndex((i) => Math.min(LAST, i + 1));
  const replay = () => {
    setIndex(0);
    setPlaying(true);
  };

  let node;
  switch (CHAPTERS[index].key) {
    case "intro":
      node = <Intro />;
      break;
    case "summary":
      node = <Summary />;
      break;
    case "experience":
      node = <Experience />;
      break;
    case "skills":
      node = <Skills />;
      break;
    case "credentials":
      node = <Credentials />;
      break;
    default:
      node = <Outro onReplay={replay} onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 z-[200] overflow-hidden bg-void-950/92 backdrop-blur-2xl"
      style={{ opacity: shown ? 1 : 0, transition: "opacity .45s ease" }}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive résumé"
    >
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-700"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${accent}1f, transparent 60%)`,
        }}
      />
      <div className="data-floor pointer-events-none absolute bottom-0 left-0 right-0 h-[45vh] opacity-40" />

      {/* story progress segments */}
      <div className="absolute left-1/2 top-5 z-30 flex w-[min(90%,900px)] -translate-x-1/2 gap-1.5">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setIndex(i)}
            data-cursor
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"
            aria-label={`Chapter ${i + 1}`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-data-cyan to-data-violet"
              style={
                i < index
                  ? { width: "100%" }
                  : i > index
                  ? { width: "0%" }
                  : c.auto && !reduced
                  ? {
                      width: "0%",
                      animation: `rxfill ${c.dur}ms linear forwards`,
                      animationPlayState: playing ? "running" : "paused",
                    }
                  : { width: "100%" }
              }
              onAnimationEnd={i === index ? advance : undefined}
            />
          </button>
        ))}
      </div>

      {/* top controls */}
      <div className="absolute right-4 top-12 z-30 flex items-center gap-2 sm:right-6 sm:top-5">
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noreferrer"
          data-cursor
          title="Download PDF"
          className="grid h-9 w-9 place-items-center rounded-full border border-void-700 text-neutral-400 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
        >
          <HiArrowDownTray className="text-sm" />
        </a>
        <button
          onClick={onClose}
          data-cursor
          aria-label="Close résumé"
          className="grid h-9 w-9 place-items-center rounded-full border border-void-700 text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
        >
          <HiXMark />
        </button>
      </div>

      {/* chapter (keyed so CSS entrance animations replay) */}
      <div key={index} className="h-full w-full">
        {node}
      </div>

      {/* bottom transport */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-5">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          data-cursor
          aria-label="Previous"
          className="grid h-10 w-10 place-items-center rounded-full border border-void-700 text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan disabled:opacity-30"
        >
          <HiChevronLeft />
        </button>
        {index < LAST ? (
          <button
            onClick={() => setPlaying((p) => !p)}
            data-cursor
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-data-cyan to-data-indigo text-void-950 shadow-glow"
          >
            {playing ? <HiPause /> : <HiPlay className="ml-0.5" />}
          </button>
        ) : (
          <button
            onClick={replay}
            data-cursor
            aria-label="Replay"
            className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r from-data-cyan to-data-indigo text-void-950 shadow-glow"
          >
            <HiArrowPath />
          </button>
        )}
        <button
          onClick={advance}
          disabled={index === LAST}
          data-cursor
          aria-label="Next"
          className="grid h-10 w-10 place-items-center rounded-full border border-void-700 text-neutral-300 transition-colors hover:border-data-cyan/60 hover:text-data-cyan disabled:opacity-30"
        >
          <HiChevronRight />
        </button>
      </div>

      <style>{`@keyframes rxfill { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  );
}
