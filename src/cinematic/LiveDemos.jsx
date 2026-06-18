import { FiCpu, FiMessageSquare } from "react-icons/fi";
import Reveal from "./Reveal";
import { ChurnDemo } from "../components/playground/Playground";
import RagDemo from "../components/playground/RagDemo";

/**
 * The proof: two models that run in the visitor's browser, both visible by
 * scrolling (no tabs hiding content). Nothing loads on page open — the churn
 * model is instant client-side math, and the RAG model only downloads when
 * someone actually asks.
 */
export default function LiveDemos() {
  return (
    <section id="live" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal kind="kicker">
          <p className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500">
            see it run
          </p>
        </Reveal>
        <Reveal kind="heading">
          <h2 className="max-w-[24ch] font-display text-h2 text-ink">
            Two models, running in your browser.
          </h2>
        </Reveal>
        <Reveal kind="body">
          <p className="mt-5 max-w-[56ch] text-[1.02rem] leading-[1.65] text-ink-700">
            Not screenshots. A live churn predictor and a real retrieval model
            over my background — no server, no API key. The model only downloads
            if you ask.
          </p>
        </Reveal>

        <div className="mt-12 space-y-6">
          <Reveal kind="body">
            <div className="rounded-2xl border border-line bg-paper/70 p-6 sm:p-8">
              <p className="mb-6 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">
                <FiCpu className="text-brand-500" /> model 01 · churn-logreg · client-side
              </p>
              <ChurnDemo />
            </div>
          </Reveal>

          <Reveal kind="body">
            <div className="min-h-[280px] rounded-2xl border border-line bg-paper/70 p-6 sm:p-8">
              <p className="mb-6 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">
                <FiMessageSquare className="text-brand-500" /> model 02 · MiniLM retrieval · on-device
              </p>
              <RagDemo />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
