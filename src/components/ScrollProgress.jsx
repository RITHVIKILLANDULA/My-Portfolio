import { motion, useScroll, useSpring } from "framer-motion";
import { NAV_LINKS } from "../constants";

/** Top data-stream progress bar + right-edge section node rail. */
export default function ScrollProgress({ active }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-data-cyan via-data-sky to-data-violet shadow-[0_0_12px_rgba(34,211,238,0.8)]"
      />

      {/* section node rail (desktop) */}
      <div className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {NAV_LINKS.map((l) => {
          const on = active === l.id;
          return (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-cursor
              className="group relative flex items-center"
              aria-label={l.label}
            >
              <span
                className={`mono-label absolute right-6 whitespace-nowrap text-[0.6rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                  on ? "text-data-cyan" : "text-neutral-400"
                }`}
              >
                {l.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  on
                    ? "h-2.5 w-2.5 bg-data-cyan shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                    : "h-1.5 w-1.5 bg-neutral-600 group-hover:bg-data-indigo"
                }`}
              />
            </a>
          );
        })}
      </div>
    </>
  );
}
