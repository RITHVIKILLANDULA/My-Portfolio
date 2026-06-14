import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES } from "../../constants";
import SectionHeading from "../ui/SectionHeading";
import Reveal from "../ui/Reveal";
import Instrument from "./Instrument";

const BLURB = {
  "AI & LLMs": "Retrieval-augmented generation — a question in, a grounded answer out.",
  "Machine Learning": "Models that forecast demand and flag what shouldn't be there.",
  "Languages & Query": "Where the data actually gets shaped — at a million rows a breath.",
  "Cloud & Data Eng": "Pipelines that validate, partition, and run themselves on schedule.",
  "Viz & BI": "Numbers people trust enough to act on.",
};

const BADGE = {
  "AI & LLMs": "LangChain · FAISS · Vertex AI",
  "Machine Learning": "1M+ trips · 20+ MLflow runs",
  "Languages & Query": "1M+ records modeled",
  "Cloud & Data Eng": "2h → 35m nightly runtime",
  "Viz & BI": "15+ dashboards · 6 sources unified",
};

const avg = (cat) =>
  Math.round(cat.skills.reduce((s, k) => s + k.level, 0) / cat.skills.length);

export default function MissionControl() {
  const [active, setActive] = useState(0);
  const cat = SKILL_CATEGORIES[active];

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <SectionHeading
        index="02"
        kicker="capability_matrix"
        title="Mission Control"
        subtitle="Five systems I run — not a list of tools."
      />

      <Reveal className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* rail — the five systems */}
        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2.5 lg:overflow-visible lg:pb-0">
          {SKILL_CATEGORIES.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                data-cursor
                className={`group flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all lg:shrink ${
                  on
                    ? "border-data-cyan/50 bg-data-cyan/[0.06]"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      on ? "bg-data-cyan shadow-[0_0_8px_#22d3ee]" : "bg-neutral-600"
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap text-sm font-medium ${
                      on ? "text-white" : "text-neutral-300"
                    }`}
                  >
                    {c.name}
                  </span>
                </div>
                <span className="mono-label hidden text-[0.6rem] text-neutral-500 lg:block">
                  {avg(c)}
                </span>
              </button>
            );
          })}
        </div>

        {/* stage — the active instrument */}
        <div className="glass min-h-[440px] rounded-2xl border border-white/10 p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 max-w-md text-sm text-neutral-400">
                    {BLURB[cat.name]}
                  </p>
                </div>
                <span className="mono-label shrink-0 rounded-lg border border-data-cyan/25 bg-data-cyan/[0.06] px-2.5 py-1 text-[0.55rem] text-data-cyan">
                  {BADGE[cat.name]}
                </span>
              </div>

              {/* the instrument */}
              <div className="mt-4 rounded-xl border border-white/8 bg-[#070b16]/60 p-2">
                <Instrument category={cat} />
              </div>

              {/* calibrated readouts — the six skills as instrument state */}
              <div className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {cat.skills.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[0.8rem] text-neutral-300">{s.name}</span>
                      <span className="font-mono text-[0.65rem] text-neutral-500">
                        {s.level}
                      </span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-void-700">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${s.level}%`,
                          background: `linear-gradient(90deg, ${cat.accent}, #22d3ee)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </section>
  );
}
