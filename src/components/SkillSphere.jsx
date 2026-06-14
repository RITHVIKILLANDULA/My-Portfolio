import { useEffect, useRef } from "react";
import { SKILL_TAGS } from "../constants";

/**
 * A 3D rotating tag-cloud sphere. Positions are rotated in JS each frame and
 * projected to 2D, so labels always face the viewer and gain depth via scale +
 * opacity. Auto-rotates; the pointer steers it; drag to fling.
 */
export default function SkillSphere() {
  const containerRef = useRef(null);
  const tagRefs = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const N = SKILL_TAGS.length;
    const R = Math.min(container.clientWidth, 360) * 0.42;

    // Fibonacci sphere distribution
    const base = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      base.push([Math.cos(theta) * radius, y, Math.sin(theta) * radius]);
    }

    let ax = 0.2;
    let ay = 0;
    let vx = 0.0018;
    let vy = 0.0032;
    let raf;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const project = () => {
      const cosX = Math.cos(ax),
        sinX = Math.sin(ax);
      const cosY = Math.cos(ay),
        sinY = Math.sin(ay);
      for (let i = 0; i < N; i++) {
        const el = tagRefs.current[i];
        if (!el) continue;
        let [x, y, z] = base[i];
        // rotate Y
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;
        // rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 (back) → 1 (front)
        const scale = 0.55 + depth * 0.65;
        el.style.transform = `translate(-50%, -50%) translate3d(${(
          x1 * R
        ).toFixed(1)}px, ${(y2 * R).toFixed(1)}px, 0) scale(${scale.toFixed(
          3
        )})`;
        el.style.opacity = (0.28 + depth * 0.72).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.45 ? "blur(0.6px)" : "none";
      }
    };

    const loop = () => {
      if (!dragging) {
        ax += vx;
        ay += vy;
        // ease velocity back toward gentle idle
        vx += (0.0018 - vx) * 0.02;
        vy += (0.0032 - vy) * 0.02;
      }
      project();
      raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {};
    const onMove = (e) => {
      const r = container.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const ny = (e.clientY - (r.top + r.height / 2)) / r.height;
      if (!dragging) {
        vy = 0.0032 + nx * 0.02;
        vx = 0.0018 - ny * 0.02;
      }
    };
    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onDrag = (e) => {
      if (!dragging) return;
      ay += (e.clientX - lastX) * 0.006;
      ax -= (e.clientY - lastY) * 0.006;
      vy = (e.clientX - lastX) * 0.006;
      vx = -(e.clientY - lastY) * 0.006;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    project();
    if (!reduced) {
      raf = requestAnimationFrame(loop);
      container.addEventListener("pointerenter", onEnter);
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onDrag);
      window.addEventListener("pointerup", onUp);
    }

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onDrag);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      <div
        ref={containerRef}
        data-cursor
        className="relative aspect-square w-full max-w-[380px] touch-none select-none"
        style={{ perspective: "900px" }}
      >
        {/* glow core */}
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-data-indigo/20 blur-2xl" />
        {SKILL_TAGS.map((tag, i) => (
          <span
            key={tag}
            ref={(el) => (tagRefs.current[i] = el)}
            className="absolute left-1/2 top-1/2 cursor-default whitespace-nowrap rounded-md border border-data-indigo/20 bg-void-900/70 px-2.5 py-1 font-mono text-xs text-data-violet backdrop-blur-sm transition-colors hover:border-data-cyan/70 hover:text-data-cyan"
            style={{ willChange: "transform, opacity" }}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mono-label mt-4 text-[0.55rem] text-neutral-500">
        drag to spin · {SKILL_TAGS.length} technologies
      </p>
    </div>
  );
}
