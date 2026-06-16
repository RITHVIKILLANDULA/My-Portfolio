import { useEffect, useMemo, useState } from "react";
import { FiCpu, FiMessageSquare } from "react-icons/fi";
import SectionHeading from "../site/SectionHeading";
import Reveal from "../ui/Reveal";
import RagDemo from "./RagDemo";

const sigmoid = (z) => 1 / (1 + Math.exp(-z));
const CONTRACTS = ["Month-to-month", "One year", "Two year"];
const NETS = ["Fiber", "DSL", "None"];

const TABS = [
  { id: "churn", label: "Churn Model", icon: <FiCpu /> },
  { id: "rag", label: "Ask My Background", icon: <FiMessageSquare /> },
];

export default function Playground() {
  const [tab, setTab] = useState("churn");

  // let the hero's "Ask my AI" hook open straight into the RAG demo
  useEffect(() => {
    const open = () => setTab("rag");
    window.addEventListener("rai:ask", open);
    if (window.location.hash === "#ask") setTab("rag");
    return () => window.removeEventListener("rai:ask", open);
  }, []);

  return (
    <section id="playground" className="section">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          kicker="Playground"
          title="Two real models, in your browser"
          intro="No server, no API key — both of these run entirely on your device."
        />

        <div className="mb-4 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                tab === t.id
                  ? "border-brand bg-brand-soft font-medium text-brand"
                  : "border-line bg-paper text-ink-500 hover:border-ink-400 hover:text-ink"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <Reveal>
          <div className="card p-6 sm:p-8">
            {tab === "churn" ? <ChurnDemo /> : <RagDemo />}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ChurnDemo() {
  const [tenure, setTenure] = useState(8);
  const [monthly, setMonthly] = useState(85);
  const [contract, setContract] = useState(0);
  const [support, setSupport] = useState(false);
  const [net, setNet] = useState(0);

  const { prob, drivers } = useMemo(() => {
    const terms = [
      { label: "baseline", v: 0.3 },
      { label: "tenure", v: -0.05 * (tenure - 12) },
      { label: "monthly charges", v: 0.022 * (monthly - 65) },
      { label: "contract", v: [1.5, -0.3, -1.7][contract] },
      { label: "tech support", v: support ? -0.5 : 0.55 },
      { label: "internet", v: [0.65, 0, -0.6][net] },
    ];
    const z = terms.reduce((s, t) => s + t.v, 0);
    return {
      prob: sigmoid(z),
      drivers: terms
        .filter((t) => t.label !== "baseline")
        .sort((a, b) => Math.abs(b.v) - Math.abs(a.v)),
    };
  }, [tenure, monthly, contract, support, net]);

  const pct = Math.round(prob * 100);
  const risk = pct >= 66 ? "High" : pct >= 33 ? "Medium" : "Low";
  const riskColor = pct >= 66 ? "#dc2626" : pct >= 33 ? "#d97706" : "#059669";

  return (
    <div>
      <div className="mb-6 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-soft text-brand">
          <FiCpu className="text-sm" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Customer Churn Predictor</p>
          <p className="font-mono text-[0.6rem] text-ink-400">
            logistic regression · client-side · from my Telco Churn project
          </p>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-[1.1fr_1fr]">
        {/* controls */}
        <div className="space-y-5">
          <Slider label="Tenure" value={tenure} min={0} max={72} suffix=" mo" onChange={setTenure} />
          <Slider label="Monthly charges" value={monthly} min={20} max={120} prefix="$" onChange={setMonthly} />
          <Choice label="Contract" options={CONTRACTS} value={contract} onChange={setContract} />
          <Choice label="Internet" options={NETS} value={net} onChange={setNet} />
          <Toggle label="Tech support" value={support} onChange={setSupport} />
        </div>

        {/* result */}
        <div className="flex flex-col sm:border-l sm:border-line sm:pl-8">
          <p className="font-mono text-[0.6rem] uppercase tracking-wide text-ink-400">churn probability</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="font-display text-5xl font-bold tabular-nums" style={{ color: riskColor }}>
              {pct}%
            </span>
            <span className="mb-1.5 rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold" style={{ background: `${riskColor}18`, color: riskColor }}>
              {risk} risk
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: riskColor }} />
          </div>

          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-wide text-ink-400">what's driving it</p>
          <div className="mt-3 space-y-2.5">
            {drivers.map((d) => {
              const up = d.v >= 0;
              const w = Math.min(50, Math.abs(d.v) * 26);
              return (
                <div key={d.label} className="flex items-center gap-2 text-[0.72rem]">
                  <span className="w-28 shrink-0 text-ink-500">{d.label}</span>
                  <div className="relative flex h-3 flex-1 items-center">
                    <span className="absolute left-1/2 h-full w-px bg-line" />
                    <span
                      className="absolute h-1.5 rounded-full"
                      style={{ left: up ? "50%" : `calc(50% - ${w}%)`, width: `${w}%`, background: up ? "#dc2626" : "#059669" }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono" style={{ color: up ? "#dc2626" : "#059669" }}>
                    {up ? "+" : ""}{d.v.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-auto pt-5 text-[0.72rem] leading-relaxed text-ink-400">
            ← lowers churn · raises it →. The model weighs each signal, sums
            them, and squashes to a probability — what ran over 500k customers
            in the real project.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, onChange, prefix = "", suffix = "" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-ink-700">{label}</span>
        <span className="font-mono text-xs text-brand">{prefix}{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range w-full"
      />
    </div>
  );
}

function Choice({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-sm text-ink-700">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o, i) => (
          <button
            key={o}
            onClick={() => onChange(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
              value === i ? "border-brand bg-brand-soft text-brand" : "border-line text-ink-500 hover:border-ink-400"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-700">{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-brand" : "bg-line"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
