'use client'

import { useRef } from 'react'

// media-query lists constructed once, not per pointermove
let FINE = null, REDUCE = null
function motionAllowed() {
  if (typeof window === 'undefined') return false
  FINE ??= window.matchMedia('(pointer: fine)')
  REDUCE ??= window.matchMedia('(prefers-reduced-motion: reduce)')
  return FINE.matches && !REDUCE.matches
}

/**
 * 3D perspective tilt + moving glare for cards. Pointer-fine only, ±7° clamp,
 * springs back on leave. Rect cached on pointerenter (no per-move reflow).
 */
export default function TiltCard({ children, className = '', onClick, 'aria-label': ariaLabel }) {
  const ref = useRef(null)
  const glare = useRef(null)
  const raf = useRef(0)
  const rect = useRef(null)

  function onEnter() {
    if (!motionAllowed()) return
    rect.current = ref.current?.getBoundingClientRect() || null
  }
  function onMove(e) {
    const el = ref.current, r = rect.current
    if (!el || !r || !motionAllowed()) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 7}deg) translateZ(0)`
      if (glare.current) {
        glare.current.style.opacity = '1'
        glare.current.style.background = `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgba(129,140,248,0.14), transparent 60%)`
      }
    })
  }
  function onLeave() {
    const el = ref.current
    rect.current = null
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    if (glare.current) glare.current.style.opacity = '0'
  }

  return (
    <button
      type="button"
      ref={ref}
      className={`tilt ${className}`}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onClick}
      aria-label={ariaLabel}
      data-mag
    >
      {children}
      <span ref={glare} className="tilt-glare" aria-hidden="true" />
      <style jsx>{`
        .tilt { position: relative; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1); transform-style: preserve-3d; }
        .tilt-glare { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
      `}</style>
    </button>
  )
}
