'use client'

import { useEffect, useRef, useState } from 'react'

const QUERY = [
  { t: 'SELECT', c: 'kw' }, { t: ' metric, value, delta', c: 'id' },
  { t: '\nFROM', c: 'kw' }, { t: ' career.impact', c: 'id' },
  { t: '\nWHERE', c: 'kw' }, { t: ' engineer = ', c: 'id' }, { t: "'rithvik_illandula'", c: 'str' },
  { t: '\nORDER BY', c: 'kw' }, { t: ' significance ', c: 'id' }, { t: 'DESC', c: 'kw' }, { t: ';', c: 'id' },
]

const ROWS = [
  ['nightly_runtime', '2h → 35m', '−71%'],
  ['manual_review_effort', '40+ mappings', '−80%'],
  ['records_modeled', '1M+', 'LightGBM'],
  ['datasets_validated', '25+', '5 QC rules'],
  ['dashboards_shipped', '15+', 'Tableau · PBI'],
  ['interview_conversions', '22', 'analyst roles'],
]

/**
 * The signature hero object: a terminal card that types a SQL query, "runs"
 * it, and streams his real impact metrics in as result rows. Loops on replay.
 * Types once when scrolled into view; reduced motion = fully rendered.
 */
export default function SqlConsole() {
  const [chars, setChars] = useState(0)          // typed characters
  const [rows, setRows] = useState(0)            // revealed rows
  const [ran, setRan] = useState(false)
  const ref = useRef(null)
  const timers = useRef([])
  const started = useRef(false)

  const FULL = QUERY.map((s) => s.t).join('')
  const TOTAL = FULL.length

  function play() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setChars(0); setRows(0); setRan(false)
    let i = 0
    const typeNext = () => {
      i += 1 + (i % 3 === 0 ? 1 : 0)
      if (i >= TOTAL) {
        setChars(TOTAL)
        timers.current.push(setTimeout(() => {
          setRan(true)
          ROWS.forEach((_, k) => {
            timers.current.push(setTimeout(() => setRows(k + 1), 160 + k * 190))
          })
        }, 420))
        return
      }
      setChars(i)
      timers.current.push(setTimeout(typeNext, 26))
    }
    timers.current.push(setTimeout(typeNext, 300))
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(TOTAL); setRan(true); setRows(ROWS.length)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) { started.current = true; play(); io.disconnect() }
    }, { threshold: 0.35 })
    io.observe(el)
    const ts = timers.current
    return () => { io.disconnect(); ts.forEach(clearTimeout) }
  }, []) // eslint-disable-line

  // rebuild colored segments from the typed char count
  let used = 0
  const segs = QUERY.map((s, k) => {
    const take = Math.max(0, Math.min(s.t.length, chars - used))
    used += s.t.length
    return take > 0 ? <span key={k} className={`sq-${s.c}`}>{s.t.slice(0, take)}</span> : null
  })
  const typing = chars < TOTAL

  return (
    <div className="sqlc" ref={ref} aria-label="Career impact, as a SQL result set">
      <div className="sqlc-bar">
        <span className="sqlc-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="sqlc-title">impact_warehouse — psql</span>
        <button type="button" className="sqlc-replay" onClick={play} aria-label="Replay query">↻ run</button>
      </div>
      <pre className="sqlc-q" aria-hidden="true">{segs}{typing && <span className="sqlc-caret" />}</pre>
      <div className="sqlc-out" data-ran={ran ? '1' : '0'}>
        <div className="sqlc-row sqlc-head" aria-hidden="true">
          <span>metric</span><span>value</span><span>delta</span>
        </div>
        {ROWS.slice(0, rows).map(([m, v, d]) => (
          <div className="sqlc-row" key={m}>
            <span className="sqlc-m">{m}</span>
            <span className="sqlc-v">{v}</span>
            <span className="sqlc-d">{d}</span>
          </div>
        ))}
        {ran && rows >= ROWS.length && (
          <p className="sqlc-foot">{ROWS.length} rows · 0.042s <span className="sqlc-real">— all numbers real, ask the AI for sources</span></p>
        )}
      </div>
    </div>
  )
}
