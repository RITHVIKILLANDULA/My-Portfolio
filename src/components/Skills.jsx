import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SKILL_CATEGORIES } from "../constants";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import SkillSphere from "./SkillSphere";

function Bar({ name, level, accent, delay }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-light text-neutral-200">{name}</span>
        <span className="font-mono text-xs text-neutral-500">{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-void-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, #a78bfa)`,
            boxShadow: `0 0 12px -2px ${accent}`,
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [tab, setTab] = useState(0);
  const cat = SKILL_CATEGORIES[tab];

  return (
    <section id="skills" className="scroll-mt-24 py-24">
      <SectionHeading
        index="02"
        kicker="capability_matrix"
        title="Skills & Stack"
        subtitle="The toolkit I reach for — from raw SQL to LLM-powered pipelines."
      />

      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* 3D skill sphere */}
        <Reveal from="left">
          <SkillSphere />
        </Reveal>

        {/* tabbed proficiency matrix */}
        <Reveal from="right">
          <div className="glass rounded-2xl p-5 sm:p-7">
            {/* tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
              {SKILL_CATEGORIES.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setTab(i)}
                  data-cursor
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all duration-200 ${
                    tab === i
                      ? "text-void-950"
                      : "border border-void-700 text-neutral-400 hover:text-neutral-200"
                  }`}
                  style={
                    tab === i
                      ? {
                          background: `linear-gradient(90deg, ${c.accent}, #818cf8)`,
                          boxShadow: `0 0 18px -4px ${c.accent}`,
                        }
                      : {}
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* bars */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                {cat.skills.map((s, i) => (
                  <Bar
                    key={s.name}
                    name={s.name}
                    level={s.level}
                    accent={cat.accent}
                    delay={i * 0.06}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mono-label mt-6 flex items-center justify-between border-t border-void-700 pt-4 text-[0.55rem] text-neutral-500">
              <span>
                category {String(tab + 1).padStart(2, "0")}/
                {String(SKILL_CATEGORIES.length).padStart(2, "0")}
              </span>
              <span className="text-data-cyan">{cat.name}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
