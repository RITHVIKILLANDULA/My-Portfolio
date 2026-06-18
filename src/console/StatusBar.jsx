import { useEffect, useState } from "react";

/**
 * The persistent top chrome. On boot its fields resolve one-by-one (the only
 * "typed-looking" motion on the whole site, played once) into a single mono
 * status line: the service is named, located, healthy, and has been running
 * for years. After boot it just sits there, quietly authoritative.
 */
const FIELDS = [
  { k: "service", v: "rithvik-illandula" },
  { k: "region", v: "Buffalo, NY" },
  { k: "status", v: "operational", dot: true },
  { k: "uptime", v: "4y+" },
];

export default function StatusBar() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(FIELDS.length);
      return;
    }
    const id = setInterval(
      () => setShown((n) => (n >= FIELDS.length ? (clearInterval(id), n) : n + 1)),
      260
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-6xl items-center gap-x-5 gap-y-1 overflow-hidden px-4 font-mono text-[0.66rem] sm:px-6">
        {FIELDS.map((f, i) => (
          <span
            key={f.k}
            className="flex items-center gap-1.5 whitespace-nowrap transition-all duration-500"
            style={{
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "none" : "translateY(3px)",
            }}
          >
            <span className="text-ink-400">{f.k}</span>
            <span className="text-ink-300">:</span>
            {f.dot && (
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-emerald-400/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            )}
            <span className={f.dot ? "text-emerald-400" : "text-ink-700"}>{f.v}</span>
            {i < FIELDS.length - 1 && <span className="ml-3 text-ink-300">·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
