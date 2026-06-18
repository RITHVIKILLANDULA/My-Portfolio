import { useState } from "react";
import { FiCpu, FiMessageSquare } from "react-icons/fi";
import Reveal from "./Reveal";
import { ChurnDemo } from "../components/playground/Playground";
import RagDemo from "../components/playground/RagDemo";

/**
 * The proof: two models that run in the visitor's browser. Nothing loads on
 * page open — the churn model is instant client-side math, and the RAG model
 * only downloads when someone actually asks. Tabbed so the section stays calm.
 */
const TABS = [
  { id: "churn", label: "Churn model", icon: <FiCpu /> },
  { id: "rag", label: "Ask my background", icon: <FiMessageSquare /> },
];

export default function LiveDemos() {
  const [tab, setTab] = useState("churn");

  return (
    <section id="live" className="border-t border-line py-24 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <Reveal>
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-brand-500">
            see it run
          </p>
          <h2 className="max-w-[20ch] font-display font-semibold leading-[1.05] tracking-[-0.03em] text-ink text-[clamp(2rem,5.5vw,3.4rem)]">
            Two models, running in your browser.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-[1.65] text-ink-700">
            Not screenshots. A live churn predictor and a real retrieval model
            over my background — no server, no API key. The model only downloads
            if you ask.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mt-10 flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors ${
                  tab === t.id
                    ? "border-brand bg-brand-soft font-medium text-brand-500"
                    : "border-line text-ink-500 hover:border-ink-400 hover:text-ink"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-paper/40 p-6 sm:p-8">
            {tab === "churn" ? <ChurnDemo /> : <RagDemo />}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
