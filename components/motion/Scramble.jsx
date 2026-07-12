'use client'

import { useEffect, useRef, useState } from 'react'

const GLYPHS = '01<>[]{}#$%&*+=/\\|~^ΔΣπλ'

/**
 * Data-decode text: characters resolve left-to-right out of glyph noise.
 * Fires once when scrolled into view (or immediately with `auto`).
 * Reduced motion → renders the final text straight away.
 * A11y: screen readers get the real text (visually hidden); the churning
 * glyphs are aria-hidden so they never hear the noise.
 */
export default function Scramble({ text, auto = false, delay = 0, speed = 28, className = '', as: Tag = 'span' }) {
  const [out, setOut] = useState(text)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDone(true); return }

    let timer, interval
    function run() {
      if (started.current) return
      started.current = true
      timer = setTimeout(() => {
        let frame = 0
        const total = text.length
        interval = setInterval(() => {
          frame++
          const solved = Math.floor(frame * 0.9)
          let s = ''
          for (let i = 0; i < total; i++) {
            const ch = text[i]
            if (ch === ' ') { s += ' '; continue }
            s += i < solved ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
          setOut(s)
          if (solved >= total) { clearInterval(interval); setOut(text); setDone(true) }
        }, speed)
      }, delay)
    }

    if (auto) {
      run()
      return () => { clearTimeout(timer); clearInterval(interval); started.current = false }
    }

    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); clearTimeout(timer); clearInterval(interval); started.current = false }
  }, [text, auto, delay, speed])

  return (
    <Tag ref={ref} className={className} data-done={done ? '1' : '0'}>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}>{text}</span>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}
