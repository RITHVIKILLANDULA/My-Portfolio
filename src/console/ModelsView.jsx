import { ChurnDemo } from "../components/playground/Playground";

/**
 * The crown jewels, front and center: two models that actually run on the
 * visitor's device, presented as deployed model cards (not a "playground").
 * Card A is the live logistic-regression churn model. Card B is the on-device
 * retrieval model whose interface IS the console command line at the bottom of
 * the screen — asking it anything routes through here.
 */
function ModelCardHeader({ name, meta }) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line pb-4 font-mono text-[0.66rem]">
      <span className="text-ink-400">model</span>
      <span className="text-ink-300">:</span>
      <span className="font-medium text-ink">{name}</span>
      {meta.map((m) => (
        <span key={m} className="flex items-center gap-2 text-ink-400">
          <span className="text-ink-300">·</span>
          {m}
        </span>
      ))}
      <span className="ml-auto flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="text-emerald-400">serving</span>
      </span>
    </div>
  );
}

export default function ModelsView() {
  const ask = (q) =>
    window.dispatchEvent(new CustomEvent("console:ask", { detail: q }));

  return (
    <div>
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">
        // models · running on your device
      </p>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-ink-500">
        Two models, no server and no API key — they download once and run in your
        browser. This is the part most portfolios can only screenshot.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {/* A — live churn model */}
        <div className="rounded-2xl border border-line bg-paper/60 p-5 sm:p-6">
          <ModelCardHeader
            name="churn-logreg"
            meta={["client-side", "logistic regression", "~0 ms"]}
          />
          <ChurnDemo />
        </div>

        {/* B — on-device retrieval, wired to the command line */}
        <div className="rounded-2xl border border-line bg-paper/60 p-5 sm:p-6">
          <ModelCardHeader
            name="bg-retrieval"
            meta={["on-device", "all-MiniLM-L6-v2", "cosine"]}
          />
          <p className="text-sm leading-relaxed text-ink-700">
            A real retrieval-augmented search over my background. Your question is
            embedded with MiniLM and matched by cosine similarity against 18
            source-tagged facts — the retrieval step behind a production RAG, run
            entirely on your device.
          </p>

          <dl className="mt-5 space-y-2.5 border-t border-line pt-4 font-mono text-[0.7rem]">
            {[
              ["input", "natural-language question"],
              ["embeddings", "all-MiniLM-L6-v2 · quantized"],
              ["index", "18 facts · L2-normalized"],
              ["serving", "your browser · no backend"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline gap-3">
                <dt className="w-24 shrink-0 text-ink-400">{k}</dt>
                <dd className="text-ink-700">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">
            interface ↓ the console command line
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              "what did he do at Deloitte?",
              "can he actually build ML?",
              "how do I reach him?",
            ].map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-line bg-mist px-3 py-1.5 font-mono text-[0.68rem] text-ink-500 transition-colors hover:border-brand/40 hover:text-brand-500"
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
