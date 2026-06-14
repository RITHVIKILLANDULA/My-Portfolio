// Decide which experience to mount. The immersive descent is desktop-only; on
// mobile, coarse pointers, reduced-motion, or no-WebGL we fall back to the
// clean readable document so content is never lost and nothing janks.
export function pickExperience() {
  if (typeof window === "undefined") return "classic";
  try {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // ignore a 0/unknown width (some embeds report it pre-layout)
    const narrow = window.innerWidth > 0 && window.innerWidth < 820;
    const c = document.createElement("canvas");
    const webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    if (reduced || coarse || narrow || !webgl) return "classic";
    return "immersive";
  } catch {
    return "classic";
  }
}
