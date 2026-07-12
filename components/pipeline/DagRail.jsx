'use client'

import { useEffect, useState } from 'react'
import { onEvent } from '@/lib/telemetry'

/**
 * THE SIGNAL THREAD — INK & SIGNAL's continuous dataflow object.
 * A fixed left spine: 1px ink line, whose travelled portion fills 3px
 * aerospace orange with scroll; printers' registration marks stamp orange as
 * each pipeline stage passes; a tiny mono ticker prints the visitor's own
 * telemetry as marginalia. Desktop ≥1240px; mobile gets the top rule instead.
 */
const STAGES = [
  { id: 'top', n: '00' },
  { id: 'about', n: '01' },
  { id: 'experience', n: '02' },
  { id: 'projects', n: '03' },
  { id: 'skills', n: '04' },
  { id: 'warehouse', n: '05' },
  { id: 'contact', n: '06' },
]

export default function ThreadSpine() {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)
  const [tick, setTick] = useState(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const els = STAGES.map((s) => document.getElementById(s.id)).filter(Boolean)
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return
        const idx = STAGES.findIndex((s) => s.id === e.target.id)
        if (idx >= 0) setActive(idx)
      })
    }, { rootMargin: '-38% 0px -52% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => onEvent((row) => setTick(row)), [])

  return (
    <aside className="spine" aria-hidden="true">
      <div className="spine-track">
        <i className="spine-fill" style={{ transform: `scaleY(${progress})` }} />
        {STAGES.map((s, i) => (
          <span key={s.id} className={`spine-node ${i <= active ? 'on' : ''}`} style={{ top: `${(i / (STAGES.length - 1)) * 100}%` }}>
            <svg viewBox="0 0 12 12" width="12" height="12">
              <circle cx="6" cy="6" r="4.4" fill="none" strokeWidth="1" />
              <line x1="6" y1="0" x2="6" y2="12" strokeWidth="1" />
              <line x1="0" y1="6" x2="12" y2="6" strokeWidth="1" />
            </svg>
            <b className="spine-n">{s.n}</b>
          </span>
        ))}
      </div>
      {tick && (
        <p className="spine-tick" key={tick.seq}>{tick.event}{tick.detail ? ` · ${tick.detail}` : ''}</p>
      )}

      <style jsx>{`
        .spine { position: fixed; left: clamp(0.4rem, 1.4vw, 1.4rem); top: 96px; bottom: 24px; z-index: 40;
          width: 44px; pointer-events: none; }
        @media (max-width: 1239px) { .spine { display: none; } }
        .spine-track { position: absolute; left: 20px; top: 0; bottom: 3.4rem; width: 1px; background: var(--rule); }
        .spine-fill { position: absolute; left: -1px; top: 0; width: 3px; height: 100%; background: var(--signal);
          transform-origin: top; transform: scaleY(0); }
        .spine-node { position: absolute; left: -5.5px; transform: translateY(-6px); }
        .spine-node svg { display: block; }
        .spine-node svg circle, .spine-node svg line { stroke: var(--rule); }
        .spine-node svg circle { fill: var(--paper); }
        .spine-node.on svg circle, .spine-node.on svg line { stroke: var(--signal); }
        .spine-n { position: absolute; left: 18px; top: -1px; font-family: var(--mono); font-size: 0.56rem;
          font-weight: 500; color: var(--rule); letter-spacing: 0.06em; }
        .spine-node.on .spine-n { color: var(--signal); }
        .spine-tick { position: absolute; bottom: 0; left: 0; width: 200px; transform-origin: 0 0; transform: rotate(-90deg) translateX(8px);
          font-family: var(--mono); font-size: 0.56rem; color: var(--graphite); letter-spacing: 0.04em; margin: 0;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; animation: tick-in 0.3s ease both; }
        @keyframes tick-in { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .spine-tick { animation: none; } }
      `}</style>
    </aside>
  )
}
