import { useEffect, useState } from "react";
import { FiArrowDown, FiExternalLink, FiMail } from "react-icons/fi";
import {
  HERO_NAME,
  HERO_CONTENT,
  ABOUT_TEXT,
  SKILL_CATEGORIES,
  EXPERIENCES,
  PROJECTS,
  CONTACT,
  RESUME_URL,
} from "../../constants";
import { readProgress } from "../../state/scroll";

// reactive scroll progress for the DOM layer (rAF in prod; resize hook for tests)
function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = -1;
    const loop = () => {
      const v = readProgress();
      if (Math.abs(v - last) > 0.0015) {
        last = v;
        setP(v);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => setP(readProgress());
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return p;
}

// bell-shaped visibility around a section's [start,end] window
function vis(p, start, end) {
  const mid = (start + end) / 2;
  const half = (end - start) / 2 + 0.05;
  return Math.max(0, Math.min(1, 1 - Math.abs(p - mid) / half));
}

function Panel({ p, start, end, side = "left", children }) {
  const v = vis(p, start, end);
  const align =
    side === "left"
      ? "left-[6vw] items-start text-left"
      : side === "right"
        ? "right-[6vw] items-end text-right"
        : "left-1/2 -translate-x-1/2 items-center text-center";
  return (
    <div
      className={`pointer-events-none fixed top-1/2 z-20 flex max-w-[min(92vw,440px)] -translate-y-1/2 flex-col gap-3 ${align}`}
      style={{
        opacity: v,
        transform: `translateY(calc(-50% + ${(1 - v) * 40}px))`,
        filter: v < 0.05 ? "blur(6px)" : "none",
        transition: "filter .3s",
      }}
      aria-hidden={v < 0.5}
    >
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

const kicker = "mono-label text-[0.6rem] text-data-indigo/80";

export default function SectionOverlays() {
  const p = useProgress();
  const topSkills = SKILL_CATEGORIES.slice(0, 4);

  return (
    <>
      {/* SURFACE — hero */}
      <Panel p={p} start={0} end={0.12} side="left">
        <span className={kicker}>// layer_00 · input</span>
        <h1 className="mt-2 font-display text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-7xl">
          {HERO_NAME}
        </h1>
        <p className="gradient-text mt-3 font-mono text-xl font-medium sm:text-2xl">
          AI Data Analyst
        </p>
        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-neutral-300">
          {HERO_CONTENT}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-neutral-400">
          <FiArrowDown className="animate-bounce" />
          scroll to enter the network
        </div>
      </Panel>

      {/* INGESTION — about */}
      <Panel p={p} start={0.12} end={0.27} side="right">
        <span className={kicker}>// layer_01 · about</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white">
          The analyst they call when the data won't behave.
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-neutral-300">
          {ABOUT_TEXT.split("\n\n")[0]}
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {["1,000,000+ records", "6 source systems", "2h → 35m runtime"].map(
            (s) => (
              <span
                key={s}
                className="rounded-full border border-data-indigo/30 bg-data-indigo/10 px-3 py-1 font-mono text-[0.62rem] text-data-violet"
              >
                {s}
              </span>
            )
          )}
        </div>
      </Panel>

      {/* LOOM — skills */}
      <Panel p={p} start={0.27} end={0.42} side="left">
        <span className={kicker}>// layer_02 · skills</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white">
          The stack, weighted and learned.
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {topSkills.map((c) => (
            <div
              key={c.name}
              className="rounded-xl border border-void-700 bg-void-900/50 p-3"
            >
              <p className="mb-1 font-mono text-[0.6rem] uppercase tracking-wider text-data-indigo">
                {c.name}
              </p>
              <p className="text-xs leading-snug text-neutral-300">
                {c.skills
                  .slice(0, 3)
                  .map((s) => s.name)
                  .join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* PIPELINE — agents */}
      <Panel p={p} start={0.42} end={0.56} side="right">
        <span className={kicker}>// layer_03 · agents</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white">
          Autonomous, end to end.
        </h2>
        <p className="mt-3 text-sm font-light leading-relaxed text-neutral-300">
          A pipeline of AI agents that fetch, analyze, tailor and review — built
          with LangChain, RAG, Vertex AI and a lot of guardrails.
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          {["Fetch", "Analyze", "Tailor", "Review"].map((s, i) => (
            <span
              key={s}
              className="rounded-md border border-data-cyan/30 bg-data-cyan/5 px-2.5 py-1 font-mono text-[0.62rem] text-data-cyan"
            >
              {String(i + 1).padStart(2, "0")} {s}
            </span>
          ))}
        </div>
      </Panel>

      {/* WAREHOUSE — experience */}
      <Panel p={p} start={0.56} end={0.7} side="left">
        <span className={kicker}>// layer_04 · experience</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white">
          The track record.
        </h2>
        <div className="mt-4 space-y-3">
          {EXPERIENCES.map((e) => (
            <div
              key={e.company}
              className="rounded-xl border border-void-700 bg-void-900/50 p-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-neutral-100">{e.role}</p>
                <span className="mono-label text-[0.5rem] text-neutral-500">
                  {e.year.split("—")[0].trim()}
                </span>
              </div>
              <p className="text-xs text-data-indigo">{e.company}</p>
              <p className="mt-1 font-mono text-[0.62rem] text-neutral-400">
                {e.metrics[0]}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* LATTICE — projects */}
      <Panel p={p} start={0.7} end={0.84} side="right">
        <span className={kicker}>// layer_05 · projects</span>
        <h2 className="mt-2 font-display text-3xl font-semibold text-white">
          What ships out the other end.
        </h2>
        <div className="mt-4 space-y-2.5">
          {PROJECTS.filter((p) => p.featured).map((proj) => (
            <div
              key={proj.title}
              className="rounded-xl border border-void-700 bg-void-900/50 p-3"
            >
              <p className="text-sm font-medium text-neutral-100">
                {proj.title}
              </p>
              <p className="mt-0.5 font-mono text-[0.6rem] text-data-cyan">
                {proj.technologies.slice(0, 4).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* CORE — contact */}
      <Panel p={p} start={0.86} end={1.0} side="center">
        <span className={kicker}>// layer_06 · decision core</span>
        <h2 className="mt-2 font-display text-4xl font-semibold text-white">
          Let's build something that reasons.
        </h2>
        <p className="mt-3 text-sm font-light text-neutral-300">
          Open to AI / data analyst & engineering roles · {CONTACT.address}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-5 py-2.5 text-sm font-semibold text-void-950"
          >
            <FiMail /> Email me
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-2.5 text-sm text-neutral-200 hover:border-data-cyan/60"
          >
            LinkedIn <FiExternalLink />
          </a>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-700 px-5 py-2.5 text-sm text-neutral-200 hover:border-data-cyan/60"
          >
            Résumé <FiExternalLink />
          </a>
        </div>
      </Panel>

      {/* fixed corner chrome */}
      <div className="pointer-events-none fixed left-6 top-6 z-30 flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg border border-data-indigo/40 bg-data-indigo/10 font-display text-sm font-bold text-data-indigo">
          RI
        </span>
        <span className="mono-label text-[0.55rem] text-neutral-400">
          data world
        </span>
      </div>

      {/* progress rail */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 h-0.5 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-data-cyan to-data-indigo"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </>
  );
}
