import { useMemo, useState } from "react";
import { FiCpu, FiMessageSquare } from "react-icons/fi";
import SectionHeading from "../ui/SectionHeading";
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

  return (
    <section id="playground" className="scroll-mt-24 py-24">
      <SectionHeading
        index="06"
        kicker="live_models"
        title="AI Playground"
        subtitle="Two real models, running in your browser — no server, no API key."
      />

      <Reveal className="mx-auto max-w-4xl">
        {/* tab switcher */}
        <div className="mb-4 flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                tab === t.id
                  ? "border-data-cyan/50 bg-data-cyan/[0.07] text-data-cyan"
                  : "border-white/8 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="glass rounded-3xl border border-white/10 p-6 sm:p-8">
          {tab === "churn" ? <ChurnDemo /> : <RagDemo />}
        </div>
      </Reveal>
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
  const riskColor = pct >= 66 ? "#f0456b" : pct >= 33 ? "#f5a524" : "#34d399";

  return (
    <div>
      <div className="mb-5 flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-data-cyan/30 bg-data-cyan/10 text-data-cyan">
          <FiCpu className="text-sm" />
        </span>
        <div>
          <p className="text-sm font-medium text-white">Customer Churn Predictor</p>
          <p className="mono-label text-[0.55rem] text-neutral-500">
            logistic regression · client-side · from my Telco Churn project
          </p>
        </div>
      </div>

      <div className="grid gap-7 sm:grid-cols-[1.1fr_1fr]">
        {/* controls */}
        <div className="space-y-5">
          <Slider label="Tenure" value={tenure} min={0} max={72} suffix=" mo" onChange={setTenure} />
          <Slider label="Monthly charges" value={monthly} min={20} max={120} prefix="$" onChange={setMonthly} />
          <Choice label="Contract" options={CONTRACTS} value={contract} onChange={setContract} />
          <Choice label="Internet" options={NETS} value={net} onChange={setNet} />
          <Toggle label="Tech support" value={support} onChange={setSupport} />
        </div>

        {/* result */}
        <div className="flex flex-col sm:border-l sm:border-white/8 sm:pl-7">
          <p className="mono-label text-[0.55rem] text-neutral-500">churn probability</p>
          <div className="mt-2 flex items-end gap-3">
            <span className="font-display text-5xl font-bold tabular-nums transition-colors" style={{ color: riskColor }}>
              {pct}%
            </span>
            <span className="mb-1.5 rounded-full px-2.5 py-0.5 text-[0.6rem] font-semibold" style={{ background: `${riskColor}22`, color: riskColor }}>
              {risk} risk
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-void-700">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: riskColor, boxShadow: `0 0 12px ${riskColor}` }} />
          </div>

          <p className="mono-label mt-6 text-[0.55rem] text-neutral-500">what's driving it</p>
          <div className="mt-3 space-y-2.5">
            {drivers.map((d) => {
              const up = d.v >= 0;
              const w = Math.min(50, Math.abs(d.v) * 26);
              return (
                <div key={d.label} className="flex items-center gap-2 text-[0.7rem]">
                  <span className="w-28 shrink-0 text-neutral-400">{d.label}</span>
                  <div className="relative flex h-3 flex-1 items-center">
                    <span className="absolute left-1/2 h-full w-px bg-white/10" />
                    <span
                      className="absolute h-1.5 rounded-full"
                      style={{
                        left: up ? "50%" : `calc(50% - ${w}%)`,
                        width: `${w}%`,
                        background: up ? "#f0456b" : "#34d399",
                      }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono" style={{ color: up ? "#f0456b" : "#34d399" }}>
                    {up ? "+" : ""}
                    {d.v.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-auto pt-5 text-[0.7rem] leading-relaxed text-neutral-500">
            ← drives churn down · drives it up →. The model weighs each signal,
            sums them, and squashes to a probability — exactly what ran over 500k
            customers in the real project.
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
        <span className="text-sm text-neutral-300">{label}</span>
        <span className="font-mono text-xs text-data-cyan">
          {prefix}
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mc-range w-full"
      />
    </div>
  );
}

function Choice({ label, options, value, onChange }) {
  return (
    <div>
      <span className="mb-2 block text-sm text-neutral-300">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o, i) => (
          <button
            key={o}
            onClick={() => onChange(i)}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-all ${
              value === i
                ? "border-data-cyan/50 bg-data-cyan/10 text-data-cyan"
                : "border-white/8 text-neutral-400 hover:border-white/20"
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
      <span className="text-sm text-neutral-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          value ? "bg-data-cyan/70" : "bg-void-700"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
