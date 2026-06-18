import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";

/**
 * A small, bright, friendly AI guide — docked in the corner, dismissible, and
 * deliberately NOT a cursor-follower or a heavy 3D character. It surfaces one
 * contextual tip per section, then gets out of the way.
 */
const TIPS = {
  home: "Welcome — I'll show you around Rithvik's data & AI world.",
  about: "Three CS degrees and 4+ years across data, AI, and software.",
  expertise: "Four disciplines he builds across — open a card for the stack.",
  skills: "The full toolkit: languages, data, AI, cloud, and SWE.",
  projects: "Recruiters usually start here. Hover a card for depth.",
  "ai-lab": "Real models running live in your browser — try them.",
  experience: "His career as a data pipeline: Deloitte, WAFU, UB.",
  recruiter: "Hiring? This is the 30-second fit check + résumé.",
  contact: "Reach out — résumé, email, GitHub, or LinkedIn.",
};

function Bot({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <line x1="24" y1="6" x2="24" y2="11" stroke="#7c78f0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="5" r="2.5" fill="#6c68e8" />
      <rect x="9" y="11" width="30" height="26" rx="9" fill="#171a23" stroke="#7c78f0" strokeWidth="2" />
      <rect x="14" y="17" width="20" height="13" rx="6" fill="#1a1930" />
      <g className="blink">
        <circle cx="20" cy="23.5" r="2.4" fill="#7c78f0" />
        <circle cx="28" cy="23.5" r="2.4" fill="#7c78f0" />
      </g>
      <path d="M21 33 q3 2 6 0" stroke="#9094a3" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Guide({ active }) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(true);
  const seen = useRef(false);

  // re-open the bubble briefly whenever the section changes (then it's calm)
  useEffect(() => {
    if (dismissed) return;
    if (!seen.current) {
      seen.current = true;
      return;
    }
    setOpen(true);
  }, [active, dismissed]);

  if (dismissed) return null;
  const tip = TIPS[active] || TIPS.home;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-2.5 sm:bottom-6 sm:right-6">
      {open && (
        <div className="floaty hidden max-w-[230px] rounded-2xl rounded-br-sm border border-line bg-paper/90 px-3.5 py-2.5 shadow-card-hover backdrop-blur-md sm:block">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="kicker !text-[0.5rem]">
              <span className="mr-1.5 text-emerald-400">●</span>AI Guide
            </span>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss guide"
              className="text-ink-400 transition-colors hover:text-ink"
            >
              <FiX className="text-xs" />
            </button>
          </div>
          <p className="text-[0.78rem] leading-snug text-ink-700">{tip}</p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Hide guide message" : "Show guide message"}
        className="floaty grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-line bg-paper shadow-card-hover transition-transform hover:scale-105"
      >
        <Bot />
      </button>
    </div>
  );
}
