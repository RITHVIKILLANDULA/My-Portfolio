import { useEffect, useRef, useState } from "react";

/**
 * The site's signature: one honest sparkline of real data that draws itself
 * once on scroll-in, then sits perfectly still. No axes, no tooltips, no loop —
 * information, not decoration.
 */
export default function Sparkline({
  data,
  width = 560,
  height = 150,
  endLabel,
  pad = 14,
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * innerW;
    const y = pad + (1 - (v - min) / span) * innerH;
    return [x, y];
  });
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${height - pad} L${pts[0][0].toFixed(1)} ${height - pad} Z`;
  const [ex, ey] = pts[pts.length - 1];

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Nightly pipeline runtime, declining from 120 to 35 minutes"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4b47d6" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#4b47d6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline */}
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#ece9e4" strokeWidth="1" />

      {/* area fill */}
      <path d={area} fill="url(#spark-fill)" className={shown ? "animate-fade-up" : "opacity-0"} />

      {/* the line, drawn once */}
      <path
        d={line}
        fill="none"
        stroke="#4b47d6"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1 }}
        className={shown ? "animate-draw" : ""}
      />

      {/* end dot + label */}
      <circle cx={ex} cy={ey} r="3.5" fill="#4b47d6" stroke="#ffffff" strokeWidth="2" className={shown ? "animate-fade-up" : "opacity-0"} />
      {endLabel && (
        <text x={ex - 6} y={ey - 10} textAnchor="end" fontSize="11" fontFamily="Geist Mono, monospace" fill="#6b645b" className={shown ? "animate-fade-up" : "opacity-0"}>
          {endLabel}
        </text>
      )}
    </svg>
  );
}
