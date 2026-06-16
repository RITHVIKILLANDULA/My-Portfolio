import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_ROLES } from "../../constants";

/**
 * Rotates through the role titles with a clean crossfade — no typewriter, no
 * blinking caret. Subtle and modern; the word swaps, nothing types.
 */
export default function RoleCycler() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % HERO_ROLES.length), 3000);
    return () => clearInterval(id);
  }, []);

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
          {HERO_ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
