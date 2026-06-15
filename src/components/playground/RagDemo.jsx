import { useState } from "react";
import { FiSearch, FiZap } from "react-icons/fi";
import { semanticQuery, keywordQuery } from "./rag";

const SUGGESTIONS = [
  "What did he do at Deloitte?",
  "Does he know LangChain and RAG?",
  "Tell me about his ML projects",
  "How do I reach him?",
];

export default function RagDemo() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("idle"); // idle|loading|thinking|done|error
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [ready, setReady] = useState(false);

  const onProgress = (p) => {
    if (p?.status === "progress" && typeof p.progress === "number") {
      setProgress(Math.min(99, Math.round(p.progress)));
    }
  };

  const ask = async (text) => {
    const query = (text ?? q).trim();
    if (!query || status === "loading" || status === "thinking") return;
    setQ(query);
    setResults([]);
    setFallback(false);
    setStatus(ready ? "thinking" : "loading");
    try {
      const top = await semanticQuery(query, 3, (p) => {
        onProgress(p);
        // once the model is in hand, downloading is over → "thinking"
        if (p?.status === "ready" || p?.status === "done") setStatus("thinking");
      });
      setResults(top);
      setReady(true);
      setStatus("done");
    } catch {
      // model unavailable (offline / blocked CDN / no WASM) → graceful fallback
      setResults(keywordQuery(query, 3));
      setFallback(true);
      setStatus("done");
    }
  };

  const busy = status === "loading" || status === "thinking";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-sm font-medium text-white">Ask My Background</p>
        <span className="mono-label text-[0.55rem] text-neutral-500">
          all-MiniLM-L6-v2 embeddings · cosine retrieval · 100% in your browser
          {ready && <span className="ml-1.5 text-emerald-400">● model loaded</span>}
        </span>
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
        className="flex items-center gap-2 rounded-xl border border-data-indigo/30 bg-[#070b16]/70 p-2 pl-3.5"
      >
        <FiSearch className="shrink-0 text-data-cyan" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask anything about my background…"
          className="flex-1 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-r from-data-cyan to-data-indigo text-void-950 disabled:opacity-50"
          aria-label="Search"
        >
          <FiZap className="text-sm" />
        </button>
      </form>

      {/* suggestions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            disabled={busy}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[0.62rem] text-neutral-300 transition-colors hover:border-data-cyan/50 hover:text-data-cyan disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      {/* loading */}
      {busy && (
        <div className="rounded-xl border border-white/8 bg-void-900/40 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="mono-label text-[0.6rem] text-neutral-400">
              {status === "loading"
                ? "downloading model — one time, ~25 MB"
                : "embedding your question & retrieving"}
            </span>
            {status === "loading" && (
              <span className="font-mono text-[0.6rem] text-data-cyan">{progress}%</span>
            )}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-void-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-data-cyan to-data-indigo transition-all duration-300"
              style={{ width: status === "loading" ? `${progress}%` : "100%" }}
            />
          </div>
        </div>
      )}

      {/* results */}
      {status === "done" && results.length > 0 && (
        <div className="space-y-4">
          {/* the answer = the top-ranked passage */}
          <div className="rounded-xl border border-data-cyan/25 bg-data-cyan/[0.05] p-4">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="mono-label text-[0.55rem] text-data-cyan">answer</span>
              <span className="mono-label text-[0.55rem] text-neutral-500">
                {results[0].source}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-neutral-100">
              {results[0].text}
            </p>
          </div>

          {/* the retrieval, shown honestly */}
          <div>
            <p className="mono-label mb-2 text-[0.55rem] text-neutral-500">
              retrieved context · ranked by similarity
            </p>
            <div className="space-y-2">
              {results.map((r) => {
                const rel = Math.round((r.score / (results[0].score || 1)) * 100);
                return (
                  <div
                    key={r.source}
                    className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2"
                  >
                    <span className="flex-1 truncate text-[0.72rem] text-neutral-400">
                      {r.source}
                    </span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-void-700">
                      <div
                        className="h-full rounded-full bg-data-indigo"
                        style={{ width: `${Math.max(6, rel)}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right font-mono text-[0.62rem] text-data-violet">
                      {rel}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[0.7rem] leading-relaxed text-neutral-500">
            {fallback
              ? "Model couldn't load here, so this used a keyword fallback over the same facts — the live site runs the real embeddings."
              : "Your question was embedded with MiniLM-L6-v2 and matched against my background by cosine similarity — the same retrieval step behind a production RAG system, running entirely on your device."}
          </p>
        </div>
      )}
    </div>
  );
}
