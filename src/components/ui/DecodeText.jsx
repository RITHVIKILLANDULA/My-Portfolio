import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&<>/\\=+*";

/**
 * "Decodes" text from scrambled glyphs into the target string — the signature
 * data-world reveal. Time-based so it always converges, with a hard fallback so
 * it can never get stuck mid-scramble. Pass `start` to trigger; respects
 * reduced motion. Uses effect-local state (no shared ref) to stay correct under
 * React StrictMode's double-invoked effects.
 */
export default function DecodeText({
  text,
  start = true,
  className = "",
  speed = 1.4,
  as: Tag = "span",
}) {
  const [output, setOutput] = useState(start ? "" : text);
  const [done, setDone] = useState(!start);

  useEffect(() => {
    if (!start) {
      setOutput(text);
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) {
      setOutput(text);
      setDone(true);
      return;
    }

    setDone(false);
    const stepMs = speed * 16.7; // delay between characters starting
    const queue = text.split("").map((ch, i) => ({
      ch,
      startT: i * stepMs,
      endT: i * stepMs + (120 + Math.random() * 320),
    }));
    const maxT = queue[queue.length - 1].endT + 200;

    let alive = true;
    let rafId = 0;
    const t0 = performance.now();

    const tick = (now) => {
      if (!alive) return;
      const e = now - t0;
      let out = "";
      let completed = 0;
      for (const item of queue) {
        if (e >= item.endT) {
          out += item.ch;
          completed++;
        } else if (e >= item.startT) {
          out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
      }
      if (completed >= queue.length || e >= maxT) {
        setOutput(text);
        setDone(true);
        return;
      }
      setOutput(out);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // safety net: force the final text even if frames are starved
    const fallback = setTimeout(() => {
      if (alive) {
        setOutput(text);
        setDone(true);
      }
    }, maxT + 400);

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      clearTimeout(fallback);
    };
  }, [text, start, speed]);

  return (
    <Tag className={`${className} ${done ? "" : "decoding"}`}>{output}</Tag>
  );
}
