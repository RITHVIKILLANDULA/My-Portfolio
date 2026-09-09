'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { EMAIL, GH, LI } from '@/data/portfolio-content'
import { asset } from '@/lib/asset'

/**
 * THE POSTER.
 *
 * One frame, built like a title card rather than a landing page: the surname
 * runs edge to edge behind the figure, the figure stands in front and occludes
 * the middle letters, and everything else (strip, chips, arrows, dot grid) is
 * furniture pinned to the margins. Depth comes from real layering — type
 * BEHIND, contact shadow ON the type, figure IN FRONT, grain and vignette OVER
 * everything — plus a slow parallax that separates those planes on pointer move.
 */
export default function PosterHero({ onJump }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!matchMedia('(pointer: fine)').matches) return

    const p = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      p.x += (p.tx - p.x) * 0.05
      p.y += (p.ty - p.y) * 0.05
      root.style.setProperty('--px', p.x.toFixed(3))
      root.style.setProperty('--py', p.y.toFixed(3))
    }
    const onMove = (e) => {
      p.tx = (e.clientX / window.innerWidth) * 2 - 1
      p.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', onMove) }
  }, [])

  return (
    <section id="top" className="poster" ref={rootRef}>
      {/* the strip */}
      <p className="strip">
        <i>•••</i> DATA, AI &amp; THE SYSTEMS THAT SHIP THEM <i>•••</i>
      </p>

      {/* the wordmark — behind the figure */}
      <h1 className="word" data-word="RITHVIK" aria-label="Rithvik Illandula">RITHVIK</h1>

      {/* the figure — in front, occluding the middle letters */}
      <div className="figure">
        <Image
          src={asset('/assets/portrait-cut.png')}
          alt="Rithvik Illandula"
          width={600}
          height={707}
          priority
          className="cut"
        />
      </div>
      <span className="contact-shadow" aria-hidden="true" />

      {/* furniture */}
      <span className="chip chip-l">• ILLANDULA •</span>
      <span className="chip chip-r">• DATA / AI ENGINEER •</span>

      <span className="arrows arrows-l" aria-hidden="true">{'▶▶▶▶▶'.split('').map((a, i) => <i key={i}>{a}</i>)}</span>
      <span className="arrows arrows-r" aria-hidden="true">{'◀◀◀◀◀'.split('').map((a, i) => <i key={i}>{a}</i>)}</span>

      <span className="dots" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <i key={i} />)}</span>

      <div className="poster-cta">
        <a href="#projects" onClick={onJump?.('projects')} className="btn-ink big">SELECTED WORKS</a>
        <a href={`mailto:${EMAIL}`} className="btn-line">EMAIL ME</a>
        <a href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="soc"><FaGithub /></a>
        <a href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="soc"><FaLinkedinIn /></a>
      </div>

      <p className="meta-l micro">BUFFALO, NY — WORKS ANYWHERE</p>
      <p className="meta-r micro"><i className="live" /> AVAILABLE ’26</p>

      <span className="grain" aria-hidden="true" />
      <span className="vig" aria-hidden="true" />

      <style jsx>{`
        .poster {
          --px: 0; --py: 0;
          position: relative;
          height: 100svh;
          min-height: 620px;
          max-width: none;
          margin: calc(-1 * var(--mast-h, 66px)) 0 0;
          padding: 0;
          overflow: hidden;
          background: #0A0A0B;
          color: var(--paper);
          isolation: isolate;
        }

        /* ── the strip ─────────────────────────────────────────────────── */
        .strip {
          position: absolute; top: clamp(4.2rem, 8vh, 6.5rem); left: 50%;
          transform: translateX(-50%) translate(calc(var(--px) * 5px), calc(var(--py) * 3px));
          margin: 0; white-space: nowrap;
          font-family: var(--sans); font-stretch: 118%; font-weight: 700;
          font-size: clamp(0.62rem, 1.15vw, 0.95rem); letter-spacing: 0.34em;
          color: var(--paper); z-index: 4;
        }
        .strip i { color: var(--live); font-style: normal; letter-spacing: 0.1em; }

        /* ── the wordmark ──────────────────────────────────────────────── */
        .word {
          position: absolute; left: 50%; top: 52%;
          transform: translate(-50%, -50%) translate(calc(var(--px) * -14px), calc(var(--py) * -8px));
          margin: 0; z-index: 1;
          font-family: var(--sans); font-stretch: 125%; font-weight: 900;
          font-size: 20.6vw; line-height: 0.78; letter-spacing: -0.035em;
          white-space: nowrap; color: var(--live);
        }
        /* distressed print texture, clipped to the letterforms */
        .word::after {
          content: attr(data-word);
          position: absolute; inset: 0; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.62'/%3E%3C/svg%3E");
          -webkit-background-clip: text; background-clip: text;
          color: transparent; opacity: 0.42;
          pointer-events: none;
        }

        /* ── the figure ────────────────────────────────────────────────── */
        .figure {
          position: absolute; left: 50%; bottom: 0; z-index: 3;
          transform: translateX(-50%) translate(calc(var(--px) * 9px), calc(var(--py) * 5px));
          height: min(74svh, 700px); aspect-ratio: 600 / 707;
          filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.7));
        }
        .figure :global(.cut) {
          width: 100%; height: 100%; object-fit: contain; object-position: bottom;
          display: block;
        }
        /* he is lit from the page, not the studio: crush the old backdrop light */
        .figure :global(.cut) { filter: contrast(1.12) saturate(0.92) brightness(0.97); }

        .contact-shadow {
          position: absolute; z-index: 2; bottom: -4%; left: 50%;
          transform: translateX(-50%);
          width: min(58vw, 720px); height: 26vh;
          background: radial-gradient(ellipse at 50% 100%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 42%, transparent 72%);
          pointer-events: none;
        }

        /* ── furniture ─────────────────────────────────────────────────── */
        .chip {
          position: absolute; z-index: 4; top: 50%;
          font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.2em;
          color: var(--ink); background: var(--paper);
          padding: 0.42rem 0.7rem; white-space: nowrap;
        }
        .chip-l { left: clamp(0.8rem, 3vw, 2.4rem); transform: translateY(-140%) translate(calc(var(--px) * 7px), calc(var(--py) * 4px)); }
        .chip-r { right: clamp(0.8rem, 3vw, 2.4rem); transform: translateY(-260%) translate(calc(var(--px) * 7px), calc(var(--py) * 4px)); }

        .arrows {
          position: absolute; z-index: 4; top: 50%; display: flex; flex-direction: column; gap: 0.85rem;
          color: var(--paper); font-size: 0.72rem; line-height: 1;
        }
        .arrows i { font-style: normal; opacity: 0.85; animation: nudge 2.6s ease-in-out infinite; }
        .arrows i:nth-child(2) { animation-delay: 0.12s; }
        .arrows i:nth-child(3) { animation-delay: 0.24s; }
        .arrows i:nth-child(4) { animation-delay: 0.36s; }
        .arrows i:nth-child(5) { animation-delay: 0.48s; }
        .arrows-l { left: clamp(0.5rem, 1.6vw, 1.3rem); transform: translateY(-50%); }
        .arrows-r { right: clamp(0.5rem, 1.6vw, 1.3rem); transform: translateY(-50%); }
        @keyframes nudge { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.95; } }

        .dots {
          position: absolute; z-index: 4; right: clamp(1rem, 3vw, 2.6rem); bottom: clamp(1rem, 3vw, 2.2rem);
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 7px;
        }
        .dots i { width: 5px; height: 5px; border-radius: 999px; background: var(--paper); opacity: 0.7; }

        .poster-cta {
          position: absolute; z-index: 5; left: 50%; bottom: clamp(1.1rem, 4vh, 2.6rem);
          transform: translateX(-50%);
          display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; justify-content: center;
        }

        .meta-l, .meta-r {
          position: absolute; z-index: 4; bottom: clamp(1.2rem, 3vw, 2.3rem); margin: 0;
          color: rgba(252, 252, 252, 0.6);
        }
        .meta-l { left: clamp(1rem, 3vw, 2.6rem); }
        .meta-r { right: clamp(1rem, 3vw, 2.6rem); display: none; }
        .live {
          display: inline-block; width: 6px; height: 6px; border-radius: 999px;
          background: var(--live); margin-right: 0.45rem; vertical-align: 1px;
          animation: pulse 2.4s ease-in-out infinite;
        }
        @keyframes pulse { 50% { opacity: 0.35; } }

        /* ── film layer ────────────────────────────────────────────────── */
        .grain {
          position: absolute; inset: 0; z-index: 6; pointer-events: none; opacity: 0.06;
          background-repeat: repeat;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E");
          animation: grain 7s steps(5) infinite;
        }
        @keyframes grain {
          0%, 100% { background-position: 0 0; }
          20% { background-position: -40px 30px; }
          40% { background-position: 30px -40px; }
          60% { background-position: -30px -25px; }
          80% { background-position: 40px 15px; }
        }
        .vig {
          position: absolute; inset: 0; z-index: 6; pointer-events: none;
          background: radial-gradient(120% 92% at 50% 46%, transparent 32%, rgba(0,0,0,0.62) 100%);
        }

        /* ── narrow ────────────────────────────────────────────────────── */
        @media (max-width: 900px) {
          .word { font-size: 25vw; top: 40%; }
          .figure { height: min(62svh, 520px); }
          .arrows, .dots { display: none; }
          .chip-l { top: auto; bottom: 30%; transform: none; }
          .chip-r { display: none; }
          .strip { font-size: 0.55rem; letter-spacing: 0.24em; }
        }
        @media (prefers-reduced-motion: reduce) {
          .grain, .arrows i, .live { animation: none; }
        }
      `}</style>
    </section>
  )
}
