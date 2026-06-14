import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import AgentPipeline from "./AgentPipeline";

const AGENTS = [
  {
    name: "Profiler",
    accent: "#22d3ee",
    role: "Scans datasets for nulls, dupes & schema drift",
    stack: "Python · Pandas",
  },
  {
    name: "Sentinel",
    accent: "#38bdf8",
    role: "Flags anomalies & threshold breaches",
    stack: "scikit-learn",
  },
  {
    name: "Retriever",
    accent: "#a78bfa",
    role: "RAG over documents with FAISS + LangChain",
    stack: "LangChain · FAISS",
  },
  {
    name: "Oracle",
    accent: "#6366f1",
    role: "Forecasts demand, trends & seasonality",
    stack: "LightGBM · MLflow",
  },
  {
    name: "Synthesizer",
    accent: "#e879f9",
    role: "Turns model output into client-ready insight",
    stack: "OpenAI · Vertex AI",
  },
  {
    name: "Orchestrator",
    accent: "#34d399",
    role: "Schedules & monitors pipelines end-to-end",
    stack: "Airflow · Spark",
  },
];

function Bot({ accent }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-20 w-20"
      style={{
        color: accent,
        filter: `drop-shadow(0 0 10px ${accent}80)`,
        animation: "agentFloat 5s ease-in-out infinite",
      }}
      aria-hidden="true"
    >
      {/* rotating signal ring */}
      <circle cx="32" cy="32" r="21" fill="none" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="3 5">
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="16s" repeatCount="indefinite" />
      </circle>
      {/* hexagonal agent core */}
      <path d="M32 13 L48 22 L48 42 L32 51 L16 42 L16 22 Z" fill={`${accent}1f`} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 21 L41 26 L41 38 L32 43 L23 38 L23 26 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      {/* pulsing inference core */}
      <circle cx="32" cy="32" r="5" fill="currentColor">
        <animate attributeName="r" values="4;7;4" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
      {/* orbiting data nodes */}
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite" />
        <circle cx="32" cy="13" r="2.4" fill="currentColor" />
        <circle cx="49.6" cy="42" r="2.4" fill="currentColor" />
        <circle cx="14.4" cy="42" r="2.4" fill="currentColor" />
      </g>
    </svg>
  );
}

export default function AgentBots() {
  return (
    <section id="agents" className="scroll-mt-24 py-24">
      <SectionHeading
        index="03"
        kicker="agent_swarm"
        title="AI Agents"
        subtitle="How I approach data + AI — composable agents for profiling, detection, retrieval, and forecasting."
      />

      {/* living pipeline illustration */}
      <Reveal from="up">
        <div className="glass mb-10 overflow-hidden rounded-2xl px-4 py-8 sm:px-8 sm:py-10">
          <p className="mono-label mb-6 text-center text-[0.55rem] text-data-indigo/80">
            autonomous_pipeline — runs end to end
          </p>
          <AgentPipeline />
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENTS.map((a, i) => (
          <Reveal key={a.name} from="up" delay={(i % 3) * 0.08}>
            <div
              data-cursor
              className="glass glass-hover group relative h-full overflow-hidden rounded-2xl p-6 text-center"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${a.accent}22, transparent 60%)`,
                }}
              />
              <div className="mb-4 flex justify-center">
                <Bot accent={a.accent} />
              </div>
              <div className="mb-1 flex items-center justify-center gap-2">
                <h3 className="text-lg font-medium text-neutral-100">{a.name}</h3>
                <span className="mono-label flex items-center gap-1 text-[0.5rem] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulseGlow rounded-full bg-emerald-400" />
                  online
                </span>
              </div>
              <p className="mx-auto mb-4 max-w-[16rem] text-xs font-light leading-relaxed text-neutral-400">
                {a.role}
              </p>
              <span
                className="mono-label rounded-full border px-3 py-1 text-[0.55rem]"
                style={{
                  borderColor: `${a.accent}40`,
                  color: a.accent,
                  background: `${a.accent}0f`,
                }}
              >
                {a.stack}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
