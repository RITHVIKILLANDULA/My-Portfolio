import RoleCycler from "../components/ui/RoleCycler";
import Counter from "../components/ui/Counter";
import { HERO_NAME, ABOUT_TEXT, RUNTIME_SERIES } from "../constants";
import useCountdown from "./useCountdown";

/** Polyline path for a sparkline over `series` in a w×h box. */
function spark(series, w, h, pad = 6) {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  return series
    .map((v, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function Tile({ label, children, caption }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-line bg-paper/60 p-4">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ink-400">{label}</p>
      <div className="mt-3">{children}</div>
      {caption && <p className="mt-2 font-mono text-[0.58rem] text-ink-400">{caption}</p>}
    </div>
  );
}

export default function OverviewView() {
  const eta = useCountdown(2);

  return (
    <div className="grid items-start gap-x-12 gap-y-10 md:grid-cols-[1.05fr_1fr]">
      {/* identity + service readme */}
      <div>
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ink-400">
          // overview
        </p>
        <h1 className="mt-3 font-display text-display leading-[0.95] tracking-[-0.035em] text-ink">
          {HERO_NAME}
        </h1>

        <p className="mt-4 font-mono text-sm text-ink-500">
          <span className="text-ink-400">role</span>
          <span className="mx-1.5 text-brand-500">:=</span>
          <span className="font-medium text-brand-500">
            <RoleCycler />
          </span>
        </p>
        <p className="mt-1.5 font-mono text-[0.72rem] text-ink-400">
          # multi-track engineer · data · ai · software
        </p>

        <p className="mt-6 max-w-[48ch] leading-[1.7] text-ink-700">
          {ABOUT_TEXT.split("\n\n")[0]}
        </p>

        <p className="mt-5 font-mono text-[0.66rem] text-ink-400">
          <span className="text-ink-300">build:</span> Diploma{" "}
          <span className="text-brand-500">→</span> B.Tech CSE · LPU{" "}
          <span className="text-brand-500">→</span> M.S. CS · Buffalo{" "}
          <span className="text-ink-300">· 3 CS degrees</span>
        </p>
      </div>

      {/* live metric tiles */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          <Tile label="records modeled" caption="across pipelines & models">
            <span className="font-display text-stat font-semibold tabular-nums text-ink">
              <Counter value={1} decimals={0} />
              <span className="text-brand-500">M+</span>
            </span>
          </Tile>

          <Tile label="nightly runtime" caption="nightly_pipeline · 14 runs">
            <div className="flex items-end justify-between gap-2">
              <span className="whitespace-nowrap font-display text-[1.7rem] font-semibold tabular-nums leading-none text-ink">
                2h <span className="text-brand-500">→</span> 35m
              </span>
              <svg viewBox="0 0 150 40" className="h-9 w-[88px] shrink-0" fill="none" aria-hidden>
                <path d={`${spark(RUNTIME_SERIES, 150, 40)} L144 34 L6 34 Z`} fill="rgba(124,120,240,0.16)" />
                <path
                  className="cl-draw"
                  d={spark(RUNTIME_SERIES, 150, 40)}
                  fill="none"
                  stroke="#9d99ff"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Tile>

          <Tile label="manual review" caption="via quality controls">
            <span className="font-display text-stat font-semibold tabular-nums text-ink">
              <Counter value={80} decimals={0} />
              <span className="text-brand-500">%↓</span>
            </span>
          </Tile>

          <Tile label="projects shipped" caption="end to end">
            <span className="font-display text-stat font-semibold tabular-nums text-ink">
              <Counter value={12} decimals={0} />
              <span className="text-brand-500">+</span>
            </span>
          </Tile>
        </div>

        {/* always-running readout */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-paper/60 px-4 py-3 font-mono text-[0.7rem]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-ink-700">nightly_pipeline</span>
          </span>
          <span className="text-emerald-400">healthy</span>
          <span className="text-ink-300">·</span>
          <span className="text-ink-400">last run 35m 04s</span>
          <span className="text-ink-300">·</span>
          <span className="text-ink-400">next in</span>
          <span className="tabular-nums text-brand-500">{eta}</span>
        </div>
      </div>
    </div>
  );
}
