import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Rotates through a tight set of target roles with a clean crossfade — no
 * typewriter, no caret. Settles on the first role under reduced-motion.
 */
const ROLES = ["Data Engineer", "AI / ML Engineer", "Software Engineer", "Applied AI Engineer"];
const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function RoleCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((x) => (x + 1) % ROLES.length), 2800);
    return () => clearInterval(id);
  }, []);

  if (reduced) return <span>{ROLES[0]}</span>;

  return (
    <span className="relative inline-flex align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.32em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-0.32em" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
