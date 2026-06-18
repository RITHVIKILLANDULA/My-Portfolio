import { Component, lazy, Suspense } from "react";
import CanvasFallback from "./CanvasFallback";

const DataWorld = lazy(() => import("./DataWorld"));

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

class Boundary extends Component {
  constructor(p) {
    super(p);
    this.state = { fail: false };
  }
  static getDerivedStateFromError() {
    return { fail: true };
  }
  componentDidCatch() {}
  render() {
    return this.state.fail ? <CanvasFallback /> : this.props.children;
  }
}

/**
 * The immersive 3D layer with graceful degradation: a static fallback if WebGL
 * is missing or the Canvas throws; the 3D chunk lazy-loads so it never blocks
 * first paint of the content.
 */
export default function World() {
  if (typeof window === "undefined" || !supportsWebGL()) return <CanvasFallback />;
  return (
    <Boundary>
      <Suspense fallback={<CanvasFallback />}>
        <DataWorld />
      </Suspense>
    </Boundary>
  );
}
