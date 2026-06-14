import { useEffect, useRef, useState } from "react";

/**
 * A persistent AI agent that "walks around" the page with the visitor — it
 * trails the cursor with a soft spring, its eyes track where you point, it
 * blinks and bobs, and it pops a short contextual line for each section.
 * Pointer-events-none so it never blocks the UI. Parks in a corner on touch.
 */

const LINES = {
  home: "Hey — I'm Rithvik's data agent. Scroll, I'll walk you through it 👋",
  about: "Here's the human. He makes messy data behave.",
  skills: "His toolkit — SQL to LLMs. Try dragging the sphere ↻",
  agents: "Meet the agents he builds. We're a friendly bunch.",
  experience: "This is where he's shipped real impact →",
  projects: "His best work — filter by what you care about.",
  contact: "Like what you see? Let's talk 📬",
};

export default function AgentCompanion({ active }) {
  const wrapRef = useRef(null);
  const lp = useRef(null);
  const rp = useRef(null);
  const [line, setLine] = useState(LINES.home);
  const [show, setShow] = useState(true);

  // section-aware speech bubble
  useEffect(() => {
    if (active && LINES[active]) {
      setLine(LINES[active]);
      setShow(true);
      const t = setTimeout(() => setShow(false), 5200);
      return () => clearTimeout(t);
    }
  }, [active]);

  // follow + look
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let cx = window.innerWidth - 130;
    let cy = window.innerHeight - 130;
    let x = cx;
    let y = cy;
    let raf = 0;

    const onMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
    };
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
    } else {
      cx = 84;
      cy = window.innerHeight - 110;
    }

    const loop = () => {
      // trail to the lower-right of the cursor
      const tx = cx + 30;
      const ty = cy + 34;
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      if (wrapRef.current)
        wrapRef.current.style.transform = `translate(${x - 38}px, ${y - 38}px)`;
      // pupils look back toward the cursor
      const dx = cx - x;
      const dy = cy - y;
      const d = Math.hypot(dx, dy) || 1;
      const px = (dx / d) * 1.8;
      const py = (dy / d) * 1.8;
      if (lp.current) lp.current.setAttribute("transform", `translate(${px} ${py})`);
      if (rp.current) rp.current.setAttribute("transform", `translate(${px} ${py})`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden sm:block"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      <div className="relative" style={{ animation: "holoFloat 4s ease-in-out infinite" }}>
        {/* speech bubble */}
        <div
          className="glass absolute bottom-[70px] left-1/2 w-max max-w-[230px] -translate-x-1/2 rounded-2xl px-3.5 py-2 text-center text-[0.72rem] font-light leading-snug text-neutral-100"
          style={{
            opacity: show ? 1 : 0,
            transform: `translateX(-50%) translateY(${show ? 0 : 6}px) scale(${show ? 1 : 0.92})`,
            transition: "opacity .4s ease, transform .4s ease",
          }}
        >
          {line}
          <span className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-[#1a1530] ring-1 ring-white/10" />
        </div>

        {/* glow */}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-data-violet/40 blur-2xl" />

        {/* bot */}
        <svg width="76" height="76" viewBox="0 0 76 76" className="relative">
          <defs>
            <linearGradient id="agentBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7c3aed" />
              <stop offset="0.5" stopColor="#6366f1" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {/* antenna */}
          <line x1="38" y1="10" x2="38" y2="20" stroke="#a5f3fc" strokeWidth="2" />
          <circle cx="38" cy="8" r="3" fill="#a5f3fc">
            <animate attributeName="r" values="2;3.4;2" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* head */}
          <rect x="14" y="20" width="48" height="40" rx="14" fill="url(#agentBody)" />
          <rect x="14" y="20" width="48" height="40" rx="14" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.2" />
          {/* visor */}
          <rect x="20" y="28" width="36" height="22" rx="9" fill="#0b0820" fillOpacity="0.85" />
          {/* eyes */}
          <g className="agent-eye">
            <circle cx="30" cy="39" r="4.4" fill="#a5f3fc" />
            <circle ref={lp} cx="30" cy="39" r="2" fill="#0b0820" />
          </g>
          <g className="agent-eye" style={{ animationDelay: "0.12s" }}>
            <circle cx="46" cy="39" r="4.4" fill="#a5f3fc" />
            <circle ref={rp} cx="46" cy="39" r="2" fill="#0b0820" />
          </g>
          {/* smile */}
          <path d="M31 53 q7 5 14 0" stroke="#a5f3fc" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
          {/* hover light */}
          <ellipse cx="38" cy="66" rx="13" ry="3" fill="#06b6d4" fillOpacity="0.5">
            <animate attributeName="rx" values="11;15;11" dur="2s" repeatCount="indefinite" />
          </ellipse>
        </svg>
      </div>
    </div>
  );
}
