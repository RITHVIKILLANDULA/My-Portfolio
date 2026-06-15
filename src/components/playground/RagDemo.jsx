import { useState } from "react";
import { FiSearch, FiZap, FiMessageSquare } from "react-icons/fi";
import { semanticQuery, keywordQuery } from "./rag";

const SUGGESTIONS = [
  "What did he do at Deloitte?",
  "Does he know LangChain and RAG?",
  "Tell me about his ML projects",
  "How do I reach him?",
];

export default function RagDemo() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  const ask = async (text) => {
    const query = (text ?? q).trim();
    if (!query || status === "loading" || status === "thinking") return;
    setQ(query);
    setResults([]);
    setFallback(false);
    setStatus(ready ? "thinking" : "loading");
    try {
      const top = await semanticQuery(query, 3, (p) => {
        if (p?.status === "progress" && typeof p.progress === "number") {
          setProgress(Math.min(99, Math.round(p.progress)));
        }
        if (p?.status === "ready" || p?.status === "done") setStatus("thinking");
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

  const busy = status === "loading" || status === "thinking";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
          <FiMessageSquare className="text-sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            Ask My Background
            {ready && <span className="ml-2 text-[0.6rem] font-medium text-emerald-600">● model loaded</span>}
          </p>
          <p className="font-mono text-[0.6rem] text-ink-400">
            all-MiniLM-L6-v2 embeddings · cosine retrieval · 100% in your browser
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="flex items-center gap-2 rounded-xl border border-line bg-mist p-2 pl-3.5"
      >
        <FiSearch className="shrink-0 text-ink-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask anything about my background…"
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-400 focus:outline-none"
        />
        <button type="submit" disabled={busy} className="btn-primary !px-3 !py-2 disabled:opacity-50" aria-label="Search">
          <FiZap className="text-sm" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            disabled={busy}
            className="rounded-full border border-line bg-paper px-3 py-1.5 text-[0.7rem] text-ink-500 transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      {busy && (
        <div className="rounded-xl border border-line bg-mist p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[0.62rem] text-ink-500">
              {status === "loading" ? "downloading model — one time, ~25 MB" : "embedding & retrieving"}
            </span>
            {status === "loading" && <span className="font-mono text-[0.62rem] text-brand">{progress}%</span>}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: status === "loading" ? `${progress}%` : "100%" }} />
          </div>
        </div>
      )}

      {status === "done" && results.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-brand/20 bg-brand-soft p-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[0.58rem] uppercase tracking-wide text-brand">answer</span>
              <span className="font-mono text-[0.58rem] text-ink-400">{results[0].source}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-700">{results[0].text}</p>
          </div>

          <div>
            <p className="mb-2 font-mono text-[0.58rem] uppercase tracking-wide text-ink-400">
              retrieved context · ranked by similarity
            </p>
            <div className="space-y-2">
              {results.map((r) => {
                const rel = Math.round((r.score / (results[0].score || 1)) * 100);
                return (
                  <div key={r.source} className="flex items-center gap-3 rounded-lg border border-line bg-paper px-3 py-2">
                    <span className="flex-1 truncate text-[0.74rem] text-ink-500">{r.source}</span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${Math.max(6, rel)}%` }} />
                    </div>
                    <span className="w-9 shrink-0 text-right font-mono text-[0.64rem] text-ink-500">{rel}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[0.72rem] leading-relaxed text-ink-400">
            {fallback
              ? "The model couldn't load here, so this used a keyword fallback over the same facts — the live site runs the real embeddings."
              : "Your question was embedded with MiniLM-L6-v2 and matched against my background by cosine similarity — the same retrieval step behind a production RAG system, on your device."}
          </p>
        </div>
      )}
    </div>
  );
}
