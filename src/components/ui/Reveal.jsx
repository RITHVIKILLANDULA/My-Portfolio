import useReveal from "../../hooks/useReveal";

const offset = {
  up: "translateY(40px)",
  down: "translateY(-40px)",
  left: "translateX(40px)",
  right: "translateX(-40px)",
};

/** Scroll-into-view reveal using a reliable IntersectionObserver + CSS. */
export default function Reveal({
  children,
  from = "up",
  delay = 0,
  duration = 0.7,
  className = "",
  as: Tag = "div",
}) {
  const [ref, shown] = useReveal();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offset[from] || offset.up,
        transition: `opacity ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s, transform ${duration}s cubic-bezier(.22,1,.36,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
