import { useEffect, useRef, useState } from "react";
import { FiX } from "react-icons/fi";
import { semanticQuery, keywordQuery } from "../components/playground/rag";

/**
 * The console's signature: a command line pinned to the bottom of the viewport
 * from the first second. It is a REAL retrieval interface — type a question (or
 * tap a chip, or fire a `console:ask` event from anywhere) and the on-device
 * MiniLM embeds it and retrieves grounded context. The answer rises in a panel
 * above the input with ranked similarity bars. On boot it auto-runs one query
 * so a non-typing visitor still sees it work.
 */
const CHIPS = [
  "what did he do at Deloitte?",
  "can he actually build ML?",
  "how fast did he make that pipeline?",
];

export default function CommandLine({ autoRun = "who is rithvik?" }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | thinking | done
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState("");
  const didAuto = useRef(false);
  const inputRef = useRef(null);

  const ask = async (text) => {
    const query = (text ?? q).trim();
    if (!query || status === "loading" || status === "thinking") return;
    setQ("");
    setAsked(query);
    setOpen(true);
    setResults([]);
    setFallback(false);
    setStatus(ready ? "thinking" : "loading");
    try {
      const top = await semanticQuery(query, 3, (p) => {
        if (p?.status === "progress" && typeof p.progress === "number")
          setProgress(Math.min(99, Math.round(p.progress)));
      });
      setResults(top);
      setReady(true);
      setStatus("done");
    } catch {
      setResults(keywordQuery(query, 3));
      setFallback(true);
      setStatus("done");
    }
  };

  // let any view fire a query at the shared console (Models card, hero CTA…)
  useEffect(() => {
    const onAsk = (e) => ask(typeof e.detail === "string" ? e.detail : undefined);
    window.addEventListener("console:ask", onAsk);
    return () => window.removeEventListener("console:ask", onAsk);
  });

  // boot auto-run: show it working without anyone typing
  useEffect(() => {
    if (didAuto.current || !autoRun) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    didAuto.current = true;
    const id = setTimeout(() => ask(autoRun), 1600);
    return () => clearTimeout(id);
  }, []);

  const busy = status === "loading" || status === "thinking";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* results panel rises above the input */}
        {open && (
          <div className="pointer-events-auto mb-2 overflow-hidden rounded-2xl border border-line bg-paper/95 shadow-card-hover backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="truncate font-mono text-[0.68rem] text-ink-500">
                <span className="text-brand-500">❯</span> {asked || "query"}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close results"
                className="text-ink-400 transition-colors hover:text-ink"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            <div className="max-h-[46vh] overflow-y-auto p-4">
              {busy && (
                <div>
                  <div className="mb-2 flex items-center justify-between font-mono text-[0.62rem]">
                    <span className="text-ink-500">
                      {status === "loading"
                        ? "downloading model — one time, ~25 MB"
                        : "embedding & retrieving"}
                    </span>
                    {status === "loading" && <span className="text-brand-500">{progress}%</span>}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand transition-all duration-300"
                      style={{ width: status === "loading" ? `${progress}%` : "100%" }}
                    />
                  </div>
                </div>
              )}

              {status === "done" && results.length > 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-brand/20 bg-brand-soft p-4">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[0.56rem] uppercase tracking-wide">
                      <span className="text-brand-500">answer</span>
                      <span className="text-ink-400">{results[0].source}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink-700">{results[0].text}</p>
                  </div>

                  <div>
                    <p className="mb-2 font-mono text-[0.56rem] uppercase tracking-wide text-ink-400">
                      retrieved context · ranked by similarity
                    </p>
                    <div className="space-y-2">
                      {results.map((r) => {
                        const rel = Math.round((r.score / (results[0].score || 1)) * 100);
                        return (
                          <div
                            key={r.source}
                            className="flex items-center gap-3 rounded-lg border border-line bg-canvas px-3 py-2"
                          >
                            <span className="flex-1 truncate font-mono text-[0.7rem] text-ink-500">
                              {r.source}
                            </span>
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line sm:w-28">
                              <div
                                className="h-full rounded-full bg-brand"
                                style={{ width: `${Math.max(6, rel)}%` }}
                              />
                            </div>
                            <span className="w-9 shrink-0 text-right font-mono text-[0.62rem] text-ink-500">
                              {rel}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <p className="font-mono text-[0.62rem] leading-relaxed text-ink-400">
                    {fallback
                      ? "// model blocked here — keyword fallback over the same facts; the live site runs the real embeddings"
                      : "// embedded with all-MiniLM-L6-v2 · cosine retrieval · 100% in your browser"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* the pinned command input */}
        <div className="pointer-events-auto mb-3 rounded-2xl border border-line bg-canvas/90 px-3 py-2.5 shadow-card backdrop-blur-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex items-center gap-2.5"
          >
            <span className="font-mono text-sm text-brand-500">❯</span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ask this console about Rithvik…"
              aria-label="Ask the console about Rithvik"
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-ink caret-brand placeholder:text-ink-400 focus:outline-none"
            />
            {!q && !busy && <span className="cl-caret h-4 w-px bg-brand-500" />}
            <div className="hidden shrink-0 gap-1.5 sm:flex">
              {CHIPS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  disabled={busy}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] text-ink-400 transition-colors hover:border-brand/40 hover:text-brand-500 disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={busy}
              className="shrink-0 rounded-lg bg-brand px-3 py-1.5 font-mono text-[0.66rem] text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
            >
              run
            </button>
          </form>
          {/* mobile chips */}
          <div className="mt-2 flex gap-1.5 overflow-x-auto sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CHIPS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                disabled={busy}
                className="shrink-0 whitespace-nowrap rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] text-ink-400 disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
