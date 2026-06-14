import useReveal from "../../hooks/useReveal";

/** Consistent data-world section header: index tag + title + subtitle. */
export default function SectionHeading({ index, kicker, title, subtitle }) {
  const [ref, shown] = useReveal();
  const base = (d) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? "none" : "translateY(20px)",
    transition: `opacity .6s cubic-bezier(.22,1,.36,1) ${d}s, transform .6s cubic-bezier(.22,1,.36,1) ${d}s`,
  });

  return (
    <div ref={ref} className="mb-14 flex flex-col items-center text-center">
      <div
        style={base(0)}
        className="mono-label mb-4 flex items-center gap-3 text-[0.65rem] text-data-cyan/80"
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-data-cyan/60" />
        <span>
          {index} · {kicker}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-data-cyan/60" />
      </div>
      <h2
        style={base(0.05)}
        className="text-4xl font-light tracking-tight text-neutral-100 sm:text-5xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={base(0.12)}
          className="mt-4 max-w-xl text-sm font-light text-neutral-400"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
