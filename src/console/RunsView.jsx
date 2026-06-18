import { useMemo, useState } from "react";
import { FiChevronRight, FiArrowUpRight } from "react-icons/fi";
import { PROJECTS, PROJECT_FILTERS } from "../constants";

/**
 * Projects as a run log. Each project is a row in the console's job table —
 * status, name, category, stack — and clicking it expands the run detail. The
 * filter row reads like a `WHERE category = …` clause. Featured projects are
 * marked `✓ passed`; the rest `● shipped`. Honest framing: they all shipped, so
 * no invented runtimes.
 */
export default function RunsView() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);

  const rows = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">
        // runs · {PROJECTS.length} projects
      </p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-500">
        Every project as a completed run. Filter the table, open a row for detail.
      </p>

      {/* WHERE clause filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[0.68rem]">
        <span className="text-ink-400">where category =</span>
        {PROJECT_FILTERS.map((f) => {
          const on = filter === f;
          const n = f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
          return (
            <button
              key={f}
              onClick={() => { setFilter(f); setOpen(null); }}
              className={`rounded-md border px-2.5 py-1 transition-colors ${
                on ? "border-brand/50 bg-brand-soft text-brand-500" : "border-line text-ink-500 hover:border-ink-400"
              }`}
            >
              {f === "All" ? "*" : f}
              <span className="ml-1.5 text-ink-400">{n}</span>
            </button>
          );
        })}
      </div>

      {/* table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-line">
        <div className="hidden grid-cols-[5.5rem_1fr_8rem_2rem] gap-3 border-b border-line bg-mist/60 px-4 py-2.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-400 sm:grid">
          <span>status</span><span>run</span><span>category</span><span />
        </div>

        <ul>
          {rows.map((p, i) => {
            const isOpen = open === p.title;
            const passed = p.featured;
            return (
              <li key={p.title} className={`border-b border-line last:border-0 ${isOpen ? "bg-paper/50" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : p.title)}
                  className="grid w-full grid-cols-[5.5rem_1fr_2rem] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper/40 sm:grid-cols-[5.5rem_1fr_8rem_2rem]"
                >
                  <span className={`flex items-center gap-1.5 font-mono text-[0.62rem] ${passed ? "text-emerald-400" : "text-ink-500"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${passed ? "bg-emerald-400" : "bg-brand-500"}`} />
                    {passed ? "passed" : "shipped"}
                  </span>
                  <span className="min-w-0 truncate font-mono text-[0.8rem] text-ink">{p.title}</span>
                  <span className="hidden truncate font-mono text-[0.66rem] text-ink-400 sm:block">{p.category}</span>
                  <FiChevronRight className={`justify-self-end text-ink-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pl-[5.9rem] pr-8">
                    <p className="max-w-[64ch] text-[0.82rem] leading-relaxed text-ink-500">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <span key={t} className="rounded border border-line bg-mist px-2 py-0.5 font-mono text-[0.6rem] text-ink-700">{t}</span>
                      ))}
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-brand-500 hover:underline">
                        open live demo <FiArrowUpRight />
                      </a>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
