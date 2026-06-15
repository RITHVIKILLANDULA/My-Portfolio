import { useEffect, useState } from "react";
import { HERO_ROLES } from "../../constants";

/**
 * Typewriter that cycles through Rithvik's role titles under his name —
 * types a role, holds, deletes, moves to the next. setTimeout-driven so it
 * keeps running smoothly (rAF is throttled in some embeds).
 */
export default function RoleCycler() {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = HERO_ROLES[i % HERO_ROLES.length];
    let t;
    if (!deleting) {
      if (text.length < full.length) {
        t = setTimeout(() => setText(full.slice(0, text.length + 1)), 60);
      } else {
        t = setTimeout(() => setDeleting(true), 1600); // hold the full title
      }
    } else if (text.length > 0) {
      t = setTimeout(() => setText(full.slice(0, text.length - 1)), 28);
    } else {
      setDeleting(false);
      setI((x) => (x + 1) % HERO_ROLES.length);
    }
    return () => clearTimeout(t);
  }, [text, deleting, i]);

  return (
    <span>
      {text || " "}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-brand align-middle" style={{ height: "1em" }} />
    </span>
  );
}
