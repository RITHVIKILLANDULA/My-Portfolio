import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import { PROJECTS, PROJECT_FILTERS } from "../../constants";
import SectionHeading from "../ui/SectionHeading";
import ProjectAnim from "../ui/ProjectAnim";

const CATS = PROJECT_FILTERS.filter((f) => f !== "All");

const ACCENT = {
  "Analytics & BI": "#a78bfa",
  "Data Engineering": "#22d3ee",
  "Machine Learning": "#6366f1",
  "GenAI / LLM": "#c084fc",
  "Web App": "#34d399",
};

// lay the five disciplines out as a pentagon of clusters, each project a
// planet orbiting its cluster core — computed once, deterministic.
const GALAXY = (() => {
  const order = [
    "Analytics & BI",
    "Data Engineering",
    "GenAI / LLM",
    "Machine Learning",
    "Web App",
  ];
  const clusters = order.map((cat, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return {
      cat,
      cx: 50 + 31 * Math.cos(a),
      cy: 47 + 36 * Math.sin(a),
      accent: ACCENT[cat],
    };
  });
  const planets = [];
  clusters.forEach((cl) => {
    const items = PROJECTS.filter((p) => p.category === cl.cat);
    const n = items.length;
    items.forEach((p, j) => {
      let x = cl.cx;
      let y = cl.cy + (n === 1 ? 5 : 0);
      if (n > 1) {
        const a = ((-90 + j * (360 / n)) * Math.PI) / 180;
        const r = 7.5 + Math.min(3, n - 2) * 0.7;
        x = cl.cx + r * Math.cos(a);
        y = cl.cy + (r + 1.5) * Math.sin(a);
      }
      planets.push({ ...p, x, y, accent: cl.accent });
    });
  });
  return { clusters, planets };
})();

function Detail({ project, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-void-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="glass relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/12"
      >
        <div className="relative h-44 overflow-hidden">
          <ProjectAnim title={project.title} category={project.category} />
          <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/20 to-transparent" />
          <span
            className="mono-label absolute left-4 top-4 rounded-full border px-2.5 py-0.5 text-[0.5rem]"
            style={{ borderColor: `${project.accent}66`, color: project.accent }}
          >
            {project.category}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-void-950/60 text-neutral-300 transition-colors hover:text-white"
          >
            <FiX />
          </button>
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-white">
            {project.title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-neutral-300">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[0.6rem] text-neutral-400"
              >
                {t}
              </span>
            ))}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-data-cyan to-data-indigo px-4 py-2.5 text-xs font-semibold text-void-950"
            >
              Live demo <FiArrowUpRight />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectGalaxy() {
  const [sel, setSel] = useState(null);
  const [hover, setHover] = useState(null);
  const { clusters, planets } = GALAXY;
  const dimmed = (p) => hover && hover.cat && p.category !== hover.cat;

  const mobile = useMemo(() => PROJECTS, []);

  return (
    <section id="projects" className="scroll-mt-24 py-24">
      <SectionHeading
        index="05"
        kicker="datasets_shipped"
        title="Project Galaxy"
        subtitle="Fourteen builds across five disciplines — pick a planet to explore."
      />

      {/* legend */}
      <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {clusters.map((c) => (
          <button
            key={c.cat}
            onMouseEnter={() => setHover({ cat: c.cat })}
            onMouseLeave={() => setHover(null)}
            className="flex items-center gap-2 font-mono text-[0.65rem] text-neutral-400 transition-colors hover:text-neutral-100"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: c.accent, boxShadow: `0 0 8px ${c.accent}` }}
            />
            {c.cat}
            <span className="text-neutral-600">
              {PROJECTS.filter((p) => p.category === c.cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* ---- desktop galaxy ---- */}
      <div className="relative mx-auto hidden aspect-[16/10] w-full max-w-5xl rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_50%_45%,rgba(99,102,241,0.08),transparent_70%)] lg:block">
        {/* structure lines */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {clusters.map((c, i) => (
            <line
              key={i}
              x1="50"
              y1="47"
              x2={c.cx}
              y2={c.cy}
              stroke={c.accent}
              strokeWidth="0.12"
              opacity="0.25"
            />
          ))}
          <circle cx="50" cy="47" r="1.1" fill="#22d3ee" opacity="0.9" />
        </svg>

        {/* faint star field */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.r,
                height: s.r,
                opacity: s.o,
              }}
            />
          ))}
        </div>

        {/* cluster cores + labels */}
        {clusters.map((c) => (
          <div
            key={c.cat}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-center transition-opacity duration-300"
            style={{
              left: `${c.cx}%`,
              top: `${c.cy}%`,
              opacity: hover && hover.cat && hover.cat !== c.cat ? 0.3 : 1,
            }}
          >
            <span
              className="mx-auto block h-3 w-3 rounded-full"
              style={{ background: c.accent, boxShadow: `0 0 18px ${c.accent}` }}
            />
            <span className="mono-label mt-1.5 block whitespace-nowrap text-[0.5rem] text-neutral-400">
              {c.cat}
            </span>
          </div>
        ))}

        {/* planets */}
        {planets.map((p, i) => (
          <button
            key={p.title}
            onClick={() => setSel(p)}
            onMouseEnter={() => setHover(p)}
            onMouseLeave={() => setHover(null)}
            data-cursor
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: dimmed(p) ? 0.2 : 1,
              animation: `gx-float ${3 + (i % 5) * 0.6}s ease-in-out ${
                (i % 7) * 0.3
              }s infinite`,
            }}
          >
            <span
              className="block rounded-full transition-transform duration-200 group-hover:scale-150"
              style={{
                width: p.featured ? 17 : 11,
                height: p.featured ? 17 : 11,
                background: `radial-gradient(circle at 35% 30%, #fff, ${p.accent} 60%)`,
                boxShadow: `0 0 ${p.featured ? 20 : 12}px ${p.accent}`,
              }}
            />
            {p.featured && (
              <span
                className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                style={{
                  width: 30,
                  height: 30,
                  borderColor: `${p.accent}55`,
                }}
              />
            )}
            <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-void-950/90 px-2 py-1 text-[0.6rem] text-neutral-100 opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
              {p.title}
            </span>
          </button>
        ))}

        <span className="mono-label pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[0.55rem] text-neutral-600">
          click a planet to open it
        </span>
      </div>

      {/* ---- mobile fallback ---- */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {mobile.map((p) => (
          <button
            key={p.title}
            onClick={() => setSel(p)}
            className="glass overflow-hidden rounded-2xl border border-white/8 text-left"
          >
            <div className="relative h-32 overflow-hidden">
              <ProjectAnim title={p.title} category={p.category} />
              <div className="absolute inset-0 bg-gradient-to-t from-void-900 to-transparent" />
              <span
                className="mono-label absolute bottom-2 left-3 text-[0.5rem]"
                style={{ color: p.accent || "#9aa3bd" }}
              >
                {p.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-neutral-100">{p.title}</h3>
            </div>
          </button>
        ))}
      </div>

      {/* shared detail modal */}
      <AnimatePresence>
        {sel && <Detail project={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </section>
  );
}

// deterministic faint starfield
const STARS = Array.from({ length: 46 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = (i % 9) / 9;
  return {
    x: 50 + Math.cos(a) * (12 + r * 40),
    y: 47 + Math.sin(a) * (12 + r * 44),
    r: 1 + (i % 3) * 0.6,
    o: 0.12 + (i % 4) * 0.08,
  };
});
