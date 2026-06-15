export default function SectionHeading({ kicker, title, intro, center }) {
  return (
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 leading-relaxed text-ink-500">{intro}</p>}
    </div>
  );
}
