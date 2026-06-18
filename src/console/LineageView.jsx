import { useState } from "react";
import { EXPERIENCES } from "../constants";

/**
 * Experience as data lineage: raw SOURCES flow down through each role (a
 * transform stage) into the OUTPUTS he shipped. A single vertical spine with
 * node beads (current role pulses), static hairline edges, metric edge-labels,
 * and click-to-expand role detail. Reads cleanly at any width.
 */
const SOURCES = ["TV / media", "adtech events", "operational", "research data", "6 source systems"];
const OUTPUTS = ["15+ dashboards", "self-running pipelines", "1M+ records modeled", "5 quality controls"];

function Stage({ label, items, kind }) {
  return (
    <div className="relative pl-9">
      <span className="absolute left-[0.32rem] top-1.5 h-3 w-3 rounded-sm border border-line bg-canvas" />
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-400">{kind}</p>
      <p className="mt-1 font-mono text-[0.78rem] text-ink-700">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span key={s} className="rounded border border-line bg-mist px-2 py-0.5 font-mono text-[0.6rem] text-ink-500">{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function LineageView() {
  const [open, setOpen] = useState(EXPERIENCES[0].company);

  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">
        // lineage · source → transform → output
      </p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-500">
        Where the data came from, what each role did to it, and what shipped.
      </p>

      {/* the spine */}
      <div className="relative mt-7 max-w-2xl">
        <div className="absolute bottom-3 left-[0.78rem] top-3 w-px bg-gradient-to-b from-line via-line to-transparent" />

        <div className="space-y-7">
          <Stage kind="sources" label="raw, multi-source inputs" items={SOURCES} />

          {EXPERIENCES.map((e, i) => {
            const isOpen = open === e.company;
            const current = i === 0;
            return (
              <div key={e.company} className="relative pl-9">
                {/* node bead */}
                <span className="absolute left-[0.32rem] top-1.5 grid h-3 w-3 place-items-center">
                  {current && <span className="absolute h-3 w-3 animate-ping rounded-full bg-brand/40" />}
                  <span className={`h-3 w-3 rounded-full border-2 ${current ? "border-brand bg-brand/30" : "border-line bg-canvas"}`} />
                </span>

                <button onClick={() => setOpen(isOpen ? null : e.company)} className="block text-left">
                  <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-400">
                    transform · {e.year}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-ink">
                    {e.role}
                    {current && <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 align-middle font-mono text-[0.5rem] uppercase tracking-wide text-brand-500">current</span>}
                  </p>
                  <p className="font-mono text-[0.72rem] text-ink-500">{e.company}</p>
                </button>

                {/* metric edge-labels */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.metrics.map((m) => (
                    <span key={m} className="rounded-md bg-brand-soft px-2 py-0.5 font-mono text-[0.62rem] text-brand-500">{m}</span>
                  ))}
                </div>

                {isOpen && (
                  <p className="mt-3 max-w-[64ch] text-[0.82rem] leading-[1.7] text-ink-500">{e.description}</p>
                )}
              </div>
            );
          })}

          <Stage kind="outputs" label="what shipped" items={OUTPUTS} />
        </div>
      </div>
    </div>
  );
}
