export default function SectionHeading({ index, kicker, title, intro, center }) {
  if (center) {
    return (
      <div className="mb-12 text-center sm:mb-14">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-line" />
          <span className="kicker">
            {index && <span className="mr-2 text-ink-300">{index}</span>}
            {kicker}
          </span>
          <span className="h-px w-8 bg-line" />
        </div>
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        {intro && <p className="mx-auto mt-3 max-w-xl leading-relaxed text-ink-500">{intro}</p>}
      </div>
    );
  }

  return (
    <div className="mb-12 sm:mb-14">
      {/* numbered data-line ledger row */}
      <div className="mb-6 flex items-center gap-3">
        <span className="relative grid h-5 w-5 shrink-0 place-items-center">
          <span className="absolute inset-0 rounded-full border border-brand/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        </span>
        <span className="font-mono text-[0.7rem] tabular-nums text-ink-400">{index}</span>
        <span className="kicker">{kicker}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-line to-transparent" />
      </div>
      <h2 className="max-w-2xl font-display text-h2 text-ink">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl leading-relaxed text-ink-500">{intro}</p>}
    </div>
  );
}
