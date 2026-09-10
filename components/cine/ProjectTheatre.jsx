'use client'

import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '@/data/portfolio-content'
import { track } from '@/lib/telemetry'

/**
 * THE THEATRE.
 *
 * Thirteen projects stood on a carousel in real perspective. The visitor does
 * not click through a grid — they sweep the room: moving the pointer across the
 * stage rotates the ring, and whichever project arrives at centre steps into
 * the light, gains its metrics and becomes the one you can open. Drag, arrow
 * keys and the rail all drive the same angle, so every input tells one story.
 *
 * CSS 3D rather than WebGL: thirteen transformed nodes cost nothing, keep the
 * titles as real selectable text for search and screen readers, and degrade to
 * an ordinary scrollable row when transforms or motion are unavailable.
 */
export default function ProjectTheatre({ onOpen }) {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const [front, setFront] = useState(0)

  const N = PROJECTS.length
  const STEP = 360 / N

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    if (!stage || !ring) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // one angle, many inputs
    const st = { angle: 0, target: 0, drag: null }
    let raf = 0
    let lastFront = -1

    const norm = (a) => ((a % 360) + 360) % 360

    const loop = () => {
      raf = requestAnimationFrame(loop)
      st.angle += (st.target - st.angle) * 0.085
      ring.style.setProperty('--ring-y', `${st.angle.toFixed(2)}deg`)

      // which card is facing the audience
      const idx = Math.round(norm(-st.angle) / STEP) % N
      if (idx !== lastFront) { lastFront = idx; setFront(idx) }
    }

    // pointer sweep — the room turns as you move across it
    const onMove = (e) => {
      if (st.drag !== null) return
      const r = stage.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width          // 0..1
      st.target = (x - 0.5) * -2 * (STEP * (N / 2.6))   // sweep most of the ring
    }
    // drag for people who want to grab it
    const onDown = (e) => { st.drag = { x: e.clientX, a: st.target }; stage.setPointerCapture?.(e.pointerId) }
    const onDrag = (e) => { if (st.drag) st.target = st.drag.a - (e.clientX - st.drag.x) * 0.45 }
    const onUp = () => { st.drag = null }
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { st.target -= STEP; e.preventDefault() }
      if (e.key === 'ArrowLeft') { st.target += STEP; e.preventDefault() }
    }

    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerdown', onDown)
    stage.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', onUp)
    stage.addEventListener('keydown', onKey)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerdown', onDown)
      stage.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      stage.removeEventListener('keydown', onKey)
    }
  }, [N, STEP])

  const p = PROJECTS[front] || PROJECTS[0]

  return (
    <div className="theatre">
      <div
        className="stage"
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-label="Project theatre — sweep the pointer or use arrow keys to turn the ring"
      >
        <span className="spot" aria-hidden="true" />
        <div className="ring" ref={ringRef}>
          {PROJECTS.map((proj, i) => {
            const a = i * STEP
            const isFront = i === front
            return (
              <button
                key={proj.t}
                type="button"
                className={`card ${isFront ? 'on' : ''}`}
                style={{ '--a': `${a}deg` }}
                onClick={() => { track('theatre_open', proj.t); onOpen?.(proj) }}
                tabIndex={isFront ? 0 : -1}
                aria-hidden={!isFront}
              >
                <span className="c-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="c-tag">{proj.tag}</span>
                <span className="c-title">{proj.t}</span>
                <span className="c-open">OPEN →</span>
              </button>
            )
          })}
        </div>
        <span className="floor" aria-hidden="true" />
      </div>

      {/* the placard — the project currently in the light */}
      <div className="placard">
        <p className="p-idx">{String(front + 1).padStart(2, '0')} <i>/ {String(N).padStart(2, '0')}</i></p>
        <div className="p-body">
          <h3>{p.t}</h3>
          <p className="p-d">{p.d}</p>
          <div className="p-metrics">
            {p.cs?.metrics?.slice(0, 3).map(([v, l]) => (
              <span key={l}><b>{v}</b> {l}</span>
            ))}
          </div>
        </div>
        <div className="p-cta">
          <button type="button" className="btn-ink" onClick={() => { track('theatre_open', p.t); onOpen?.(p) }}>
            READ THE CASE
          </button>
          {p.demo && <a className="btn-line" href={p.demo} target="_blank" rel="noopener noreferrer">LIVE DEMO ↗</a>}
        </div>
      </div>

      <p className="hint">SWEEP THE STAGE · DRAG · ← → KEYS</p>

      <style jsx>{`
        .theatre { --r: 520px; }
        @media (max-width: 1100px) { .theatre { --r: 400px; } }

        .stage {
          position: relative;
          height: clamp(240px, 34vh, 340px);
          perspective: 1200px;
          perspective-origin: 50% 45%;
          outline: none;
          cursor: ew-resize;
          touch-action: pan-y;
        }
        .stage:focus-visible { outline: 1px solid var(--live); outline-offset: 6px; }

        .spot {
          position: absolute; left: 50%; top: -12%; transform: translateX(-50%);
          width: min(70%, 620px); height: 130%;
          background: radial-gradient(ellipse at 50% 22%, rgba(252,252,252,0.10), transparent 62%);
          pointer-events: none;
        }

        .ring {
          position: absolute; inset: 0;
          transform-style: preserve-3d;
          transform: rotateY(var(--ring-y, 0deg));
        }

        .card {
          position: absolute; left: 50%; top: 50%;
          width: 210px; height: 132px; margin: -66px 0 0 -105px;
          transform: rotateY(var(--a)) translateZ(var(--r));
          transform-style: preserve-3d;
          backface-visibility: hidden;
          display: flex; flex-direction: column; align-items: flex-start; gap: 0.3rem;
          padding: 0.85rem 0.9rem;
          background: rgba(252,252,252,0.04);
          border: 1px solid rgba(252,252,252,0.22);
          color: var(--paper); text-align: left; cursor: pointer;
          transition: background .3s, border-color .3s, opacity .3s, filter .3s;
          opacity: 0.34; filter: brightness(0.72);
        }
        .card.on {
          opacity: 1; filter: none;
          background: rgba(252,252,252,0.08);
          border-color: var(--live);
          box-shadow: 0 0 0 1px rgba(228,87,46,0.35), 0 22px 60px -30px rgba(228,87,46,0.8);
        }
        .c-num { font-family: var(--mono); font-size: 0.56rem; color: var(--live); letter-spacing: 0.18em; }
        .c-tag { font-family: var(--mono); font-size: 0.52rem; letter-spacing: 0.14em; color: rgba(252,252,252,0.5); }
        .c-title { font-family: var(--sans); font-stretch: 112%; font-weight: 640; font-size: 0.9rem;
          line-height: 1.15; letter-spacing: -0.01em; }
        .c-open { margin-top: auto; font-family: var(--mono); font-size: 0.52rem; letter-spacing: 0.16em;
          color: rgba(252,252,252,0); transition: color .3s; }
        .card.on .c-open { color: var(--live); }

        .floor {
          position: absolute; left: 50%; bottom: -6%; transform: translateX(-50%);
          width: min(88%, 900px); height: 1px;
          background: linear-gradient(90deg, transparent, rgba(252,252,252,0.28), transparent);
          pointer-events: none;
        }

        /* ── the placard ── */
        .placard {
          display: grid; grid-template-columns: auto 1fr auto; gap: clamp(1rem, 3vw, 2.4rem);
          align-items: start; margin-top: 1.6rem; padding-top: 1.3rem;
          border-top: 1px solid rgba(252,252,252,0.16);
        }
        @media (max-width: 860px) { .placard { grid-template-columns: 1fr; gap: 1rem; } }
        .p-idx { margin: 0; font-family: var(--sans); font-stretch: 116%; font-weight: 640;
          font-size: clamp(1.6rem, 3.4vw, 2.6rem); line-height: 1; font-variant-numeric: tabular-nums; }
        .p-idx i { font-style: normal; font-size: 0.42em; color: rgba(252,252,252,0.4); }
        .p-body h3 { font-family: var(--sans); font-stretch: 116%; font-weight: 640; font-size: clamp(1.05rem, 2.2vw, 1.5rem);
          letter-spacing: -0.01em; margin: 0 0 0.4rem; }
        .p-d { margin: 0; font-family: var(--sans); font-size: 0.88rem; line-height: 1.6;
          color: rgba(252,252,252,0.6); max-width: 62ch; }
        .p-metrics { display: flex; flex-wrap: wrap; gap: 0.4rem 1.4rem; margin-top: 0.7rem;
          font-family: var(--mono); font-size: 0.62rem; color: rgba(252,252,252,0.5); }
        .p-metrics b { color: var(--live); font-weight: 500; }
        .p-cta { display: flex; flex-direction: column; gap: 0.5rem; }
        @media (max-width: 860px) { .p-cta { flex-direction: row; } }

        .hint { margin: 1.1rem 0 0; text-align: center; font-family: var(--mono);
          font-size: 0.54rem; letter-spacing: 0.22em; color: rgba(252,252,252,0.32); }

        /* no 3D / no motion: a plain readable row */
        @media (prefers-reduced-motion: reduce) {
          .stage { height: auto; perspective: none; overflow-x: auto; }
          .ring { position: static; transform: none; display: flex; gap: 0.8rem; padding-bottom: 0.6rem; }
          .card { position: static; margin: 0; transform: none; opacity: 1; filter: none; flex: 0 0 210px; }
          .card .c-open { color: var(--live); }
          .spot, .floor, .hint { display: none; }
        }
      `}</style>
    </div>
  )
}
