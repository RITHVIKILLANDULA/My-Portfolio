// Single source of truth for the descent. Lenis writes here on real scroll;
// every world component reads it inside useFrame. No React state, no re-renders.
// `window.__p` is a dev override so the scroll-blocked preview harness can be
// driven to any depth for verification (ignored in production unless set).
export const scroll = {
  progress: 0, // 0 (surface) → 1 (core)
  velocity: 0, // normalized scroll speed, for the robot's gait + mote comet
  raw: 0,
};

export function readProgress() {
  if (typeof window !== "undefined" && typeof window.__p === "number") {
    return window.__p;
  }
  return scroll.progress;
}
