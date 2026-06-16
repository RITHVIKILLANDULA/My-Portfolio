import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiArrowRight, FiDownload, FiMessageSquare } from "react-icons/fi";
import { HERO_NAME, HERO_CONTENT, RESUME_URL, RUNTIME_SERIES } from "../../constants";
import RoleCycler from "../ui/RoleCycler";

const ease = [0.16, 1, 0.3, 1];

function spark(series, w, h, pad = 6) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function HeroWorld() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  // depth layers
  const farX = useTransform(sx, (v) => v * -18);
  const farY = useTransform(sy, (v) => v * -18);
  const midX = useTransform(sx, (v) => v * -34);
  const midY = useTransform(sy, (v) => v * -34);
  const nearX = useTransform(sx, (v) => v * -55);
  const nearY = useTransform(sy, (v) => v * -55);

  return (
    <section
      id="home"
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* ---------- bright atmosphere ---------- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_8%,#eef0ff_0%,#fbfaf9_46%,#fbfaf9_100%)]" />
        <div className="absolute -right-20 top-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.20),transparent_68%)] blur-2xl" />
        <div className="absolute right-1/3 top-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_70%)] blur-2xl" />
        <div className="dotgrid absolute inset-0 opacity-50" />
        {/* perspective horizon */}
        <svg className="absolute bottom-0 left-0 h-1/2 w-full opacity-[0.35]" viewBox="0 0 1000 360" preserveAspectRatio="none">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="360" x2={500 + (i * 100 - 500) * 0.18} y2="60" stroke="#cfc9f5" strokeWidth="1" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={360 - i * i * 11} x2="1000" y2={360 - i * i * 11} stroke="#d8d3f2" strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* ---------- the data world (right) ---------- */}
      <motion.div
        style={{ x: midX, y: midY }}
        className="pointer-events-none absolute right-[-6%] top-1/2 hidden h-[640px] w-[640px] -translate-y-1/2 lg:block"
      >
        {/* connectors */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 640" fill="none">
          <path d="M320 320 C 230 250, 160 180, 150 130" stroke="#a9a3ee" strokeWidth="1.5" className="dashflow" />
          <path d="M320 320 C 430 300, 500 240, 540 180" stroke="#86d8f0" strokeWidth="1.5" className="dashflow" />
          <path d="M320 320 C 420 380, 470 460, 470 520" stroke="#a9a3ee" strokeWidth="1.5" className="dashflow" />
          <path d="M320 320 C 220 360, 150 420, 130 480" stroke="#9fe6d2" strokeWidth="1.5" className="dashflow" />
        </svg>

        {/* data core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-72 w-72">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(108,104,232,0.28),transparent_64%)] [animation:corepulse_5s_ease-in-out_infinite]" />
            <svg className="spin-slow absolute inset-0 h-full w-full" viewBox="0 0 288 288" fill="none">
              <circle cx="144" cy="144" r="120" stroke="#c7c1f3" strokeWidth="1" strokeDasharray="2 7" />
              <circle cx="144" cy="144" r="92" stroke="#b3abee" strokeWidth="1.25" />
            </svg>
            <svg className="spin-rev absolute inset-0 h-full w-full" viewBox="0 0 288 288" fill="none">
              <circle cx="144" cy="144" r="64" stroke="#4b47d6" strokeWidth="1.5" strokeDasharray="40 14" />
              <circle cx="144" cy="60" r="4" fill="#6c68e8" />
              <circle cx="228" cy="144" r="3" fill="#38bdf8" />
              <circle cx="144" cy="228" r="3.5" fill="#2dd4bf" />
            </svg>
            {/* crystal */}
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 rotate-45 place-items-center rounded-[1.6rem] bg-gradient-to-br from-brand-500 to-brand shadow-[0_18px_50px_-12px_rgba(75,71,214,0.6)]">
              <span className="-rotate-45 font-mono text-[0.6rem] font-medium tracking-widest text-white/90">DATA</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------- floating data cards ---------- */}
      <motion.div style={{ x: nearX, y: nearY }} className="pointer-events-none absolute inset-0 hidden lg:block">
        <FloatCard className="right-[8%] top-[18%]" delay={0.5}>
          <p className="kicker mb-2 !text-[0.55rem]">nightly runtime</p>
          <svg viewBox="0 0 150 44" className="h-11 w-full">
            <path d={`${spark(RUNTIME_SERIES, 150, 44)} L144 38 L6 38 Z`} fill="rgba(75,71,214,0.10)" />
            <path d={spark(RUNTIME_SERIES, 150, 44)} fill="none" stroke="#4b47d6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-1 font-mono text-[0.6rem] text-ink-400">2h → <span className="text-brand">35m</span></p>
        </FloatCard>

        <FloatCard className="right-[30%] top-[8%]" delay={0.7}>
          <p className="kicker mb-1 !text-[0.55rem]">churn model</p>
          <p className="nums font-display text-3xl font-semibold text-ink">97<span className="text-xl text-ink-400">%</span></p>
          <p className="font-mono text-[0.55rem] text-ink-400">logistic · client-side</p>
        </FloatCard>

        <FloatCard className="right-[6%] bottom-[20%]" delay={0.9}>
          <p className="kicker mb-1.5 !text-[0.55rem]">records modeled</p>
          <p className="nums font-display text-3xl font-semibold text-brand">1M+</p>
        </FloatCard>

        <FloatCard className="right-[34%] bottom-[16%]" delay={1.1}>
          <p className="kicker mb-1 !text-[0.55rem]">rag · in-browser</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            <span className="font-mono text-[0.62rem] text-ink-700">MiniLM embeddings</span>
          </div>
        </FloatCard>
      </motion.div>

      {/* ---------- foreground copy ---------- */}
      <motion.div
        style={{ x: farX, y: farY }}
        className="relative z-10 mx-auto w-full max-w-5xl px-5 sm:px-8"
      >
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="kicker mb-6">
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          Welcome to my data &amp; AI world
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease }} className="font-display text-display text-ink">
          {HERO_NAME}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16, ease }} className="mt-4 font-display text-2xl font-medium text-brand sm:text-3xl">
          <RoleCycler />
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24, ease }} className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink-700">
          {HERO_CONTENT}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32, ease }} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#playground"
            onClick={() => window.dispatchEvent(new CustomEvent("rai:ask"))}
            className="btn-primary group"
          >
            <FiMessageSquare /> Ask my AI about me
            <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
          <a href="#projects" className="btn-ghost">Explore the work</a>
          <a href={RESUME_URL} target="_blank" rel="noreferrer" className="btn-ghost">
            <FiDownload /> Résumé
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FloatCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease }}
      className={`absolute ${className}`}
    >
      <div className="floaty rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(26,23,20,0.28)] backdrop-blur-md" style={{ animationDelay: `${delay}s` }}>
        {children}
      </div>
    </motion.div>
  );
}
