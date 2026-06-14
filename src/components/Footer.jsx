import { FiArrowUp } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-void-700/60 py-10">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-data-cyan/40 bg-void-850 font-mono text-xs font-bold text-data-cyan">
            RI
          </span>
          <p className="text-xs text-neutral-500">
            © {2026} Rithvik Illandula · built in the data world
          </p>
        </div>

        <p className="mono-label text-[0.55rem] text-neutral-600">
          react · three.js · framer-motion · tailwind
        </p>

        <a
          href="#home"
          data-cursor
          aria-label="Back to top"
          className="group flex items-center gap-2 rounded-full border border-void-700 px-4 py-2 text-xs text-neutral-400 transition-colors hover:border-data-cyan/60 hover:text-data-cyan"
        >
          top
          <FiArrowUp className="transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
