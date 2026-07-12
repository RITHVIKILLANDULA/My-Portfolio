'use client'

import { useEffect, useState } from 'react'

/**
 * Cinematic preloader: mono counter 000→100 + wordmark, then the ink curtain
 * lifts. Runs once per session; skipped entirely under reduced motion.
 */
export default function Preloader() {
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(true) // SSR/default: not shown
  const [lift, setLift] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    try { if (sessionStorage.getItem('ri_seen')) return } catch {}
    setGone(false)
    document.documentElement.style.overflow = 'hidden'
    const t0 = performance.now()
    const DUR = 1150
    const iv = setInterval(() => {
      const p = Math.min(1, (performance.now() - t0) / DUR)
      setN(Math.round(100 * (1 - Math.pow(1 - p, 2))))
      if (p >= 1) {
        clearInterval(iv)
        setLift(true)
        setTimeout(() => {
          setGone(true)
          document.documentElement.style.overflow = ''
          try { sessionStorage.setItem('ri_seen', '1') } catch {}
        }, 750)
      }
    }, 24)
    return () => { clearInterval(iv); document.documentElement.style.overflow = '' }
  }, [])

  if (gone) return null
  return (
    <div className={`pre ${lift ? 'lift' : ''}`} aria-hidden="true">
      <p className="pre-mark">RITHVIK ILLANDULA — PORTFOLIO ’26</p>
      <p className="pre-n">{String(n).padStart(3, '0')}</p>
      <style jsx>{`
        .pre { position: fixed; inset: 0; z-index: 200; background: var(--ink); color: var(--paper);
          display: flex; flex-direction: column; justify-content: space-between; padding: 1.4rem 1.6rem;
          transition: transform 0.75s cubic-bezier(0.76, 0, 0.24, 1); }
        .pre.lift { transform: translateY(-100%); }
        .pre-mark { font-family: var(--mono); font-size: 0.6rem; font-weight: 300; letter-spacing: 0.22em; }
        .pre-n { font-family: var(--sans); font-stretch: 116%; font-weight: 600; font-size: clamp(4rem, 14vw, 11rem);
          line-height: 0.85; align-self: flex-end; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  )
}
