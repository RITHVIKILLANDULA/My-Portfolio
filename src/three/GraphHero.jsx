import { Component, lazy, Suspense } from "react";

const GraphCanvas = lazy(() => import("./GraphCanvas"));

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

/** Static SVG node cluster — shown if WebGL is missing, errors, or while loading. */
function GraphFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <svg viewBox="0 0 200 200" className="h-3/4 w-3/4 max-w-[420px] opacity-80" aria-hidden>
        <g stroke="#6c68e8" strokeOpacity="0.3" strokeWidth="0.6">
          <line x1="100" y1="100" x2="55" y2="55" /><line x1="100" y1="100" x2="150" y2="60" />
          <line x1="100" y1="100" x2="60" y2="150" /><line x1="100" y1="100" x2="148" y2="145" />
        </g>
        <g fill="#7c78f0">
          <circle cx="55" cy="55" r="4" /><circle cx="150" cy="60" r="4" />
          <circle cx="60" cy="150" r="4" /><circle cx="148" cy="145" r="4" />
        </g>
        <circle cx="100" cy="100" r="7" fill="#9d99ff" />
      </svg>
    </div>
  );
}

class Boundary extends Component {
  constructor(p) { super(p); this.state = { fail: false }; }
  static getDerivedStateFromError() { return { fail: true }; }
  componentDidCatch() {}
  render() { return this.state.fail ? <GraphFallback /> : this.props.children; }
}

/**
 * The interactive knowledge graph centerpiece with graceful degradation: a
 * static node cluster if WebGL is missing or the Canvas throws; lazy-loaded so
 * it never blocks the hero text.
 */
export default function GraphHero() {
  if (typeof window === "undefined" || !supportsWebGL()) return <GraphFallback />;
  return (
    <Boundary>
      <Suspense fallback={<GraphFallback />}>
        <GraphCanvas />
      </Suspense>
    </Boundary>
  );
}
