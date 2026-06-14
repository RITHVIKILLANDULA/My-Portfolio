import { useMemo } from "react";

// A calm animated AI backdrop: indigo/cyan light pools, a drifting data grid,
// and a faint pulsing node-network. Pure CSS/SVG — sits behind the content.
export default function GuideBackdrop() {
  const net = useMemo(() => {
    const rand = (i, s) => {
      const x = Math.sin(i * 12.9 + s * 7.7) * 4375.1;
      return x - Math.floor(x);
    };
    const nodes = new Array(26).fill(0).map((_, i) => ({
      x: rand(i, 1) * 100,
      y: rand(i, 2) * 100,
      r: 1 + rand(i, 3) * 1.6,
      d: 2 + rand(i, 4) * 4,
    }));
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < 22) edges.push([nodes[i], nodes[j]]);
      }
    }
    return { nodes, edges };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#04050c]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_30%_-10%,rgba(67,56,202,0.28),transparent_60%)]" />
      <div
        className="absolute -left-[10%] top-[10%] h-[55vw] w-[55vw] rounded-full opacity-40 blur-[130px]"
        style={{ background: "radial-gradient(circle,#4338ca,transparent 66%)", animation: "blobA 26s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-[12%] bottom-[5%] h-[48vw] w-[48vw] rounded-full opacity-25 blur-[130px]"
        style={{ background: "radial-gradient(circle,#0891b2,transparent 68%)", animation: "blobB 32s ease-in-out infinite" }}
      />

      {/* faint pulsing node-network */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.5]" preserveAspectRatio="none" viewBox="0 0 100 100">
        {net.edges.map(([a, b], i) => (
          <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6366f1" strokeWidth="0.06" opacity="0.25" />
        ))}
        {net.nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r * 0.18} fill="#818cf8">
            <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${n.d}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* drifting data grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(129,140,248,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(129,140,248,0.05) 1px,transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 30%,transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,#000 30%,transparent 85%)",
          animation: "gridDrift 28s linear infinite",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_120%_at_50%_50%,transparent_45%,rgba(4,5,12,0.9))]" />
    </div>
  );
}
