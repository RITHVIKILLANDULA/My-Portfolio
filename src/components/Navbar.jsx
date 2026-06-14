import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";
import { NAV_LINKS, CONTACT, RESUME_URL } from "../constants";
import Magnetic from "./ui/Magnetic";

export default function Navbar({ active }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <div className="glass absolute inset-0 -z-10 rounded-2xl" />

          {/* logo */}
          <a href="#home" data-cursor className="group flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-data-cyan/40 bg-void-850 font-mono text-sm font-bold text-data-cyan shadow-glow">
              RI
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulseGlow rounded-full bg-data-cyan" />
            </span>
            <span className="mono-label hidden text-[0.6rem] text-neutral-400 sm:block">
              data&nbsp;world
            </span>
          </a>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                data-cursor
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                  active === l.id
                    ? "text-data-cyan"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {active === l.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-data-cyan/10 ring-1 ring-data-cyan/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l.label}
              </a>
            ))}
          </div>

          {/* right cluster */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 text-lg text-neutral-300 sm:flex">
              <Magnetic>
                <a
                  href={CONTACT.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  aria-label="LinkedIn"
                  className="transition-colors hover:text-data-cyan"
                >
                  <FaLinkedin />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={CONTACT.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor
                  aria-label="GitHub"
                  className="transition-colors hover:text-data-cyan"
                >
                  <FaGithub />
                </a>
              </Magnetic>
            </div>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor
              className="group hidden items-center gap-1.5 rounded-lg border border-data-indigo/40 bg-data-indigo/10 px-3 py-2 text-xs font-medium text-data-violet transition-all hover:border-data-cyan/60 hover:text-data-cyan sm:flex"
            >
              Résumé
              <FiArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button
              onClick={() => setOpen(true)}
              data-cursor
              aria-label="Open menu"
              className="grid h-9 w-9 place-items-center rounded-lg text-neutral-200 md:hidden"
            >
              <HiOutlineMenuAlt4 className="text-xl" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] md:hidden"
          >
            <div
              className="absolute inset-0 bg-void-950/80 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="glass absolute right-0 top-0 flex h-full w-72 flex-col gap-2 p-6 pt-8"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="mb-4 self-end text-2xl text-neutral-300"
              >
                <HiX />
              </button>
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`mono-label rounded-lg px-3 py-3 text-sm ${
                    active === l.id
                      ? "bg-data-cyan/10 text-data-cyan"
                      : "text-neutral-300"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} · {l.label}
                </motion.a>
              ))}
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-1.5 rounded-lg border border-data-cyan/40 bg-data-cyan/10 px-3 py-3 text-sm text-data-cyan"
              >
                Download Résumé <FiArrowUpRight />
              </a>
              <div className="mt-auto flex gap-5 pt-6 text-xl text-neutral-300">
                <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                  <FaLinkedin />
                </a>
                <a href={CONTACT.github} target="_blank" rel="noreferrer">
                  <FaGithub />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
