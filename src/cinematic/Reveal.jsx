import useReveal from "../hooks/useReveal";

/**
 * Cinematic glide-in with motion differentiated by element MASS — big headings
 * travel further and slower, small labels arrive first. Same easing everywhere
 * for cohesion; willChange is released once settled. Respects reduced-motion.
 */
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PRESET = {
  heading: { y: 46, scale: 0.986, dur: 0.9 },
  statement: { y: 40, scale: 0.988, dur: 0.85 },
  body: { y: 22, scale: 1, dur: 0.7 },
  item: { y: 24, scale: 1, dur: 0.62 },
  kicker: { y: 12, scale: 1, dur: 0.55 },
};

export default function Reveal({
  children,
  kind = "body",
  delay = 0,
  className = "",
  as: Tag = "div",
}) {
  const [ref, shown] = useReveal();
  const p = PRESET[kind] || PRESET.body;
  const on = reduced || shown;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : `translateY(${p.y}px) scale(${p.scale})`,
        transition: reduced
          ? "none"
          : `opacity ${p.dur}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${p.dur}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: on ? "auto" : "transform",
      }}
    >
      {children}
    </Tag>
  );
}
