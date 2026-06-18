/**
 * Console navigation. The six views of `service: rithvik-illandula`. The active
 * view is marked with a 2px indigo left edge (desktop) or underline (mobile) —
 * a static marker that brightens on change, never an animated dash. Views not
 * yet wired in this build are dimmed and labelled, so the full instrument reads
 * honestly even mid-build.
 */
export const VIEWS = [
  { id: "overview", label: "Overview", ready: true },
  { id: "capabilities", label: "Capabilities", ready: true },
  { id: "runs", label: "Runs", ready: true },
  { id: "lineage", label: "Lineage", ready: true },
  { id: "models", label: "Models", ready: true },
  { id: "reach", label: "Reach", ready: true },
];

export default function ViewRail({ active, onSelect }) {
  return (
    <nav aria-label="Console views">
      {/* desktop: vertical rail */}
      <ul className="hidden gap-0.5 lg:flex lg:flex-col">
        {VIEWS.map((v, i) => {
          const on = active === v.id;
          return (
            <li key={v.id}>
              <button
                onClick={() => v.ready && onSelect(v.id)}
                disabled={!v.ready}
                aria-current={on ? "true" : undefined}
                className={`group flex w-full items-center gap-2.5 border-l-2 py-1.5 pl-3 pr-2 text-left font-mono text-[0.72rem] transition-colors ${
                  on
                    ? "border-brand text-ink"
                    : v.ready
                    ? "border-transparent text-ink-500 hover:border-line hover:text-ink-700"
                    : "border-transparent text-ink-300"
                }`}
              >
                <span className="text-ink-400">{String(i).padStart(2, "0")}</span>
                <span>{v.label}</span>
                {!v.ready && <span className="ml-auto text-[0.55rem] text-ink-300">soon</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {/* mobile: horizontal tab strip */}
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {VIEWS.map((v) => {
          const on = active === v.id;
          return (
            <li key={v.id} className="shrink-0">
              <button
                onClick={() => v.ready && onSelect(v.id)}
                disabled={!v.ready}
                aria-current={on ? "true" : undefined}
                className={`whitespace-nowrap border-b-2 px-3 py-2 font-mono text-[0.72rem] transition-colors ${
                  on
                    ? "border-brand text-ink"
                    : v.ready
                    ? "border-transparent text-ink-500"
                    : "border-transparent text-ink-300"
                }`}
              >
                {v.label}
                {!v.ready && <span className="ml-1 text-[0.55rem] text-ink-300">·soon</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
