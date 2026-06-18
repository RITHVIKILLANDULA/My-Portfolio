import useReveal from "../hooks/useReveal";

/**
 * Cinematic glide-in. Children sit 1 frame below their resting spot and ease up
 * into place the moment they scroll into view — once, smoothly. Respects
 * prefers-reduced-motion (renders settled, no transition).
 */
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Reveal({ children, delay = 0, y = 32, className = "", as: Tag = "div" }) {
  const [ref, shown] = useReveal();
  const on = reduced || shown;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : `translateY(${y}px)`,
        transition: reduced
          ? "none"
          : `opacity 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
