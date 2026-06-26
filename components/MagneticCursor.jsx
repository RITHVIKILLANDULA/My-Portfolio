'use client'

import { useEffect, useRef } from 'react'

/**
 * One tasteful craft signal: a small custom cursor (dot + ring) that magnetically
 * snaps toward interactive targets. Desktop + fine-pointer only; disabled for
 * touch and prefers-reduced-motion. Targets = anything with [data-mag] plus
 * native a / button.
 */
export default function MagneticCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const dot = dotRef.current, ring = ringRef.current
    let mx = innerWidth / 2, my = innerHeight / 2
    let rx = mx, ry = my, raf = 0
    let hot = null

    function isTarget(el) { return el && (el.closest('[data-mag], a, button')) }

    function onMove(e) {
      mx = e.clientX; my = e.clientY
      const t = isTarget(e.target)
      if (t !== hot) {
        hot = t
        ring.classList.toggle('hot', !!t)
      }
    }
    function frame() {
      raf = requestAnimationFrame(frame)
      // dot tracks instantly, ring eases (with a pull toward a hovered target's center)
      let tx = mx, ty = my
      if (hot) { const r = hot.getBoundingClientRect(); tx = mx + (r.left + r.width / 2 - mx) * 0.35; ty = my + (r.top + r.height / 2 - my) * 0.35 }
      rx += (tx - rx) * 0.2; ry += (ty - ry) * 0.2
      dot.style.transform = `translate(${mx}px, ${my}px)`
      ring.style.transform = `translate(${rx}px, ${ry}px)`
    }
    function onLeave() { dot.style.opacity = '0'; ring.style.opacity = '0' }
    function onEnter() { dot.style.opacity = '1'; ring.style.opacity = '1' }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.documentElement.classList.add('mag-on')
    frame()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.documentElement.classList.remove('mag-on')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="mag-dot" aria-hidden="true" />
      <div ref={ringRef} className="mag-ring" aria-hidden="true" />
      <style jsx global>{`
        @media (pointer: fine) { html.mag-on, html.mag-on * { cursor: none !important; } }
        .mag-dot, .mag-ring { position: fixed; top: 0; left: 0; z-index: 200; pointer-events: none; border-radius: 9999px;
          margin-left: -3px; margin-top: -3px; will-change: transform; }
        .mag-dot { width: 6px; height: 6px; background: #818CF8; }
        .mag-ring { width: 30px; height: 30px; margin-left: -15px; margin-top: -15px; border: 1px solid rgba(129,140,248,0.55);
          transition: width .2s, height .2s, margin .2s, border-color .2s, background .2s; }
        .mag-ring.hot { width: 54px; height: 54px; margin-left: -27px; margin-top: -27px; border-color: #6366F1; background: rgba(99,102,241,0.08); }
        @media (pointer: coarse) { .mag-dot, .mag-ring { display: none; } }
      `}</style>
    </>
  )
}
