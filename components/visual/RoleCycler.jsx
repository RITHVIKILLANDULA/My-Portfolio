'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

const ROLES = [
  'Data Engineer',
  'AI / ML Engineer',
  'Software Engineer',
  'Applied AI Engineer',
  'RAG & LLM Engineer',
]

/**
 * Cycles through Rithvik's roles with a clean slide-up + de-blur. Pure GSAP
 * (no framer-motion). Settles on the first role under reduced motion.
 */
export default function RoleCycler({ className = '', style = {} }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced.current) return
    const id = setInterval(() => setI((x) => (x + 1) % ROLES.length), 2600)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (reduced.current || !ref.current) return
    gsap.fromTo(
      ref.current,
      { yPercent: 55, opacity: 0, filter: 'blur(8px)' },
      { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' },
    )
  }, [i])

  return (
    <span
      className={className}
      aria-label="Data, AI, Software, and Applied AI Engineer"
      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', ...style }}
    >
      <span ref={ref} aria-hidden="true" style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}>
        {ROLES[i]}
      </span>
    </span>
  )
}
