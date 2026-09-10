'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { track } from '@/lib/telemetry'

/**
 * THE MACHINE.
 *
 * Not a diagram of a pipeline — a pipeline the visitor runs. Press RUN and rows
 * are emitted, carried down the rails, checked at the quality gate and landed in
 * the warehouse; the counters are the real arithmetic of that run, not a loop of
 * fake numbers. Two controls make it a toy rather than a demo: a throughput dial
 * that changes the emission rate, and a switch that starts poisoning the source
 * so the gate has something to catch.
 *
 * This is the job, made operable: ingest, transform, validate, quarantine, land.
 */

const STAGES = [
  { id: 'ingest', label: 'INGEST', sub: 'source' },
  { id: 'transform', label: 'TRANSFORM', sub: 'clean + join' },
  { id: 'gate', label: 'QUALITY GATE', sub: '5 controls' },
  { id: 'warehouse', label: 'WAREHOUSE', sub: 'landed' },
]

const BAD_REASONS = ['schema drift', 'duplicate key', 'null in required', 'late arrival', 'out of range']

export default function PipelineMachine() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const logRef = useRef(null)

  const [running, setRunning] = useState(false)
  const [rate, setRate] = useState(28)          // rows per second
  const [poison, setPoison] = useState(false)   // inject bad data at the source
  const [stats, setStats] = useState({ emitted: 0, landed: 0, quarantined: 0, p95: 0 })
  const [log, setLog] = useState([])
  const [hot, setHot] = useState(null)          // stage under the pointer

  // live values the animation loop reads without re-subscribing
  const cfg = useRef({ running, rate, poison })
  useEffect(() => { cfg.current = { running, rate, poison } }, [running, rate, poison])

  const pushLog = useCallback((line, kind = 'info') => {
    setLog((l) => [...l.slice(-60), { id: Math.random().toString(36).slice(2), line, kind }])
  }, [])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log])

  // ── the machine itself ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, raf = 0, last = 0, carry = 0
    let rows = []
    const totals = { emitted: 0, landed: 0, quarantined: 0, lat: [] }
    const pulses = STAGES.map(() => 0)
    const pending = []   // log lines buffered out of the frame loop

    const boxes = () => {
      // four stages laid out across the frame, with rails between them
      const pad = Math.max(14, W * 0.035)
      const gap = Math.max(18, W * 0.035)
      const bw = (W - pad * 2 - gap * (STAGES.length - 1)) / STAGES.length
      const bh = Math.min(96, H * 0.34)
      const y = H * 0.5 - bh / 2
      return STAGES.map((s, i) => ({ ...s, x: pad + i * (bw + gap), y, w: bw, h: bh }))
    }

    function resize() {
      W = canvas.clientWidth || 1
      H = canvas.clientHeight || 1
      if (W < 2 || H < 2) return false
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return true
    }

    function emit(n) {
      const bad = cfg.current.poison
      for (let i = 0; i < n; i++) {
        const isBad = bad && Math.random() < 0.22
        rows.push({
          p: 0,                                   // 0..1 across the whole machine
          lane: (Math.random() - 0.5) * 0.62,     // vertical spread inside the rail
          bad: isBad,
          reason: isBad ? BAD_REASONS[(Math.random() * BAD_REASONS.length) | 0] : null,
          held: false,
          born: performance.now(),
          v: 0.62 + Math.random() * 0.22,
        })
        totals.emitted++
      }
    }

    function step(dt) {
      const gateAt = 2 / 3                        // the gate sits at the third box
      for (const r of rows) {
        if (r.held) { r.hold -= dt; if (r.hold <= 0) r.dead = true; continue }
        const before = r.p
        r.p += r.v * dt
        // a bad row is caught the moment it reaches the gate
        if (r.bad && before < gateAt && r.p >= gateAt) {
          r.held = true
          r.hold = 0.55
          r.p = gateAt
          totals.quarantined++
          pulses[2] = 1
          pending.push({ line: `QUARANTINE  row ${totals.emitted}  ·  ${r.reason}`, kind: 'bad' })
        } else if (r.p >= 1) {
          r.dead = true
          totals.landed++
          pulses[3] = 1
          totals.lat.push(performance.now() - r.born)
          if (totals.lat.length > 240) totals.lat.shift()
        }
      }
      rows = rows.filter((r) => !r.dead)
      if (rows.length > 900) rows.splice(0, rows.length - 900)
    }

    function draw(t) {
      const b = boxes()
      ctx.clearRect(0, 0, W, H)

      // rails
      const midY = b[0].y + b[0].h / 2
      ctx.strokeStyle = 'rgba(252,252,252,0.16)'
      ctx.lineWidth = 1
      for (let i = 0; i < b.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(b[i].x + b[i].w, midY)
        ctx.lineTo(b[i + 1].x, midY)
        ctx.stroke()
      }

      // quarantine bin under the gate
      const gate = b[2]
      ctx.setLineDash([3, 4])
      ctx.strokeStyle = 'rgba(228,87,46,0.5)'
      ctx.beginPath()
      ctx.moveTo(gate.x + gate.w / 2, gate.y + gate.h)
      ctx.lineTo(gate.x + gate.w / 2, H - 16)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = 'rgba(228,87,46,0.75)'
      ctx.font = '9px ui-monospace, monospace'
      ctx.textAlign = 'center'
      ctx.fillText('QUARANTINE', gate.x + gate.w / 2, H - 6)

      // stage boxes
      b.forEach((s, i) => {
        const lit = pulses[i]
        ctx.strokeStyle = lit > 0.02 ? `rgba(228,87,46,${0.35 + lit * 0.6})` : 'rgba(252,252,252,0.3)'
        ctx.lineWidth = 1
        ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.w - 1, s.h - 1)
        if (lit > 0.02) {
          ctx.fillStyle = `rgba(228,87,46,${lit * 0.1})`
          ctx.fillRect(s.x, s.y, s.w, s.h)
        }
        ctx.fillStyle = 'rgba(252,252,252,0.92)'
        ctx.font = '600 10px ui-monospace, monospace'
        ctx.textAlign = 'left'
        ctx.fillText(s.label, s.x + 10, s.y + 20)
        ctx.fillStyle = 'rgba(252,252,252,0.42)'
        ctx.font = '9px ui-monospace, monospace'
        ctx.fillText(s.sub, s.x + 10, s.y + 34)
        pulses[i] *= 0.92
      })

      // rows in flight
      const x0 = b[0].x + b[0].w * 0.5
      const x1 = b[b.length - 1].x + b[b.length - 1].w * 0.5
      for (const r of rows) {
        const x = x0 + (x1 - x0) * r.p
        const y = midY + r.lane * (b[0].h * 0.5)
        if (r.held) {
          const drop = 1 - r.hold / 0.55
          ctx.fillStyle = `rgba(228,87,46,${0.9 - drop * 0.5})`
          ctx.fillRect(x - 1.5, y + drop * (H - midY - 26), 3, 3)
        } else {
          ctx.fillStyle = r.bad ? 'rgba(228,87,46,0.95)' : 'rgba(252,252,252,0.82)'
          ctx.fillRect(x - 1.5, y, 3, 2)
        }
      }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now

      if (cfg.current.running) {
        carry += cfg.current.rate * dt
        const n = Math.floor(carry)
        if (n > 0) { carry -= n; emit(n) }
        step(dt)
      }
      draw(now / 1000)
    }

    if (!resize()) {
      // viewport not measurable yet (embedded shells) — try again next frame
      let tries = 0
      const wait = () => {
        if (resize() || ++tries > 60) { last = 0; raf = requestAnimationFrame(frame) }
        else requestAnimationFrame(wait)
      }
      requestAnimationFrame(wait)
    } else if (!reduced) {
      raf = requestAnimationFrame(frame)
    } else {
      draw(0)
    }

    // publish counters at a readable cadence rather than every frame
    const meter = setInterval(() => {
      const lat = totals.lat.slice().sort((a, b) => a - b)
      const p95 = lat.length ? lat[Math.floor(lat.length * 0.95)] : 0
      setStats({ emitted: totals.emitted, landed: totals.landed, quarantined: totals.quarantined, p95: Math.round(p95) })
      if (pending.length) {
        // at high throughput the gate catches many rows a second; show the most
        // recent few rather than re-rendering the log for every single one
        const batch = pending.splice(0, pending.length).slice(-4)
        setLog((l) => [...l, ...batch.map((b) => ({ ...b, id: Math.random().toString(36).slice(2) }))].slice(-60))
      }
    }, 200)

    const ro = new ResizeObserver(() => resize())
    ro.observe(canvas)

    return () => { cancelAnimationFrame(raf); clearInterval(meter); ro.disconnect() }
  }, [pushLog])

  // ── controls ──────────────────────────────────────────────────────────
  const toggleRun = () => {
    setRunning((r) => {
      const next = !r
      pushLog(next ? `RUN     started  ·  ${rate} rows/s` : 'PAUSE   operator halted the run')
      track('pipeline_' + (next ? 'run' : 'pause'), String(rate))
      return next
    })
  }
  const togglePoison = () => {
    setPoison((p) => {
      const next = !p
      pushLog(next ? 'SOURCE  bad data injected — the gate will start catching it' : 'SOURCE  clean again', next ? 'bad' : 'info')
      track('pipeline_poison', String(next))
      return next
    })
  }

  const pct = stats.emitted ? Math.round((stats.quarantined / stats.emitted) * 100) : 0

  return (
    <div className="machine" ref={wrapRef}>
      <div className="m-head">
        <p className="m-title">RUN MY PIPELINE</p>
        <p className="m-note">the one at Buffalo moves 25+ datasets a night — this is the shape of it</p>
      </div>

      <div className="m-stage">
        <canvas ref={canvasRef} className="m-canvas" aria-hidden="true" />
        <p className="sr">
          An interactive diagram of a data pipeline: ingest, transform, quality gate and warehouse.
          {stats.emitted} rows emitted, {stats.landed} landed, {stats.quarantined} quarantined.
        </p>
      </div>

      <div className="m-controls">
        <button type="button" className={`m-run ${running ? 'on' : ''}`} onClick={toggleRun}>
          {running ? '❚❚  PAUSE' : '▶  RUN'}
        </button>

        <label className="m-dial">
          <span>THROUGHPUT</span>
          <input
            type="range" min="4" max="120" value={rate}
            onChange={(e) => setRate(+e.target.value)}
            aria-label="Rows per second"
          />
          <b>{rate}<i>rows/s</i></b>
        </label>

        <button type="button" className={`m-poison ${poison ? 'on' : ''}`} onClick={togglePoison} aria-pressed={poison}>
          <i /> INJECT BAD DATA
        </button>
      </div>

      <div className="m-readout">
        {[
          ['EMITTED', stats.emitted, ''],
          ['LANDED', stats.landed, ''],
          ['QUARANTINED', stats.quarantined, ''],
          ['P95 LATENCY', stats.p95, 'ms'],
        ].map(([k, v, suf]) => (
          <div key={k} className={k === 'QUARANTINED' && stats.quarantined ? 'bad' : ''}>
            <b>{typeof v === 'number' ? v.toLocaleString() : v}<i>{suf}</i></b>
            <span>{k}{k === 'QUARANTINED' && pct ? ` · ${pct}% of source` : ''}</span>
          </div>
        ))}
      </div>

      <div className="m-log" ref={logRef} role="log" aria-live="polite">
        {log.length === 0 && <p className="dim">— press RUN. then flip INJECT BAD DATA and watch the gate earn its keep.</p>}
        {log.map((l) => <p key={l.id} className={l.kind}>{l.line}</p>)}
      </div>

      <style jsx>{`
        .machine { font-family: var(--mono); color: var(--paper); }
        .m-head { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.9rem; }
        .m-title { font-family: var(--sans); font-stretch: 120%; font-weight: 700; font-size: 0.72rem;
          letter-spacing: 0.22em; margin: 0; }
        .m-note { margin: 0; font-size: 0.64rem; color: rgba(252,252,252,0.45); letter-spacing: 0.04em; }

        .m-stage { position: relative; border: 1px solid rgba(252,252,252,0.22); background: rgba(252,252,252,0.02); }
        .m-canvas { display: block; width: 100%; height: clamp(190px, 26vh, 260px); }
        .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

        .m-controls { display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap; margin-top: 0.9rem; }
        .m-run {
          font-family: inherit; font-size: 0.68rem; letter-spacing: 0.16em;
          background: var(--paper); color: var(--ink); border: 1px solid var(--paper);
          padding: 0.6rem 1.2rem; cursor: pointer; transition: all .18s;
        }
        .m-run:hover { background: transparent; color: var(--paper); }
        .m-run.on { background: var(--live); border-color: var(--live); color: #fff; }

        .m-dial { display: inline-flex; align-items: center; gap: 0.6rem; font-size: 0.6rem;
          letter-spacing: 0.16em; color: rgba(252,252,252,0.55); }
        .m-dial input { width: clamp(110px, 18vw, 200px); accent-color: var(--live); cursor: pointer; }
        .m-dial b { color: var(--paper); font-variant-numeric: tabular-nums; font-weight: 500; }
        .m-dial b i { font-style: normal; color: rgba(252,252,252,0.45); margin-left: 0.25rem; }

        .m-poison {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-family: inherit; font-size: 0.62rem; letter-spacing: 0.14em;
          background: transparent; color: rgba(252,252,252,0.7);
          border: 1px solid rgba(252,252,252,0.3); padding: 0.55rem 0.9rem; cursor: pointer; transition: all .18s;
        }
        .m-poison i { width: 8px; height: 8px; border: 1px solid currentColor; display: inline-block; }
        .m-poison.on { color: var(--live); border-color: var(--live); }
        .m-poison.on i { background: var(--live); border-color: var(--live); }

        .m-readout { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.1rem;
          border-top: 1px solid rgba(252,252,252,0.14); padding-top: 0.9rem; }
        .m-readout b { display: block; font-family: var(--sans); font-stretch: 114%; font-weight: 640;
          font-size: clamp(1.1rem, 2.4vw, 1.7rem); line-height: 1; font-variant-numeric: tabular-nums; }
        .m-readout b i { font-style: normal; font-size: 0.5em; color: rgba(252,252,252,0.45); margin-left: 0.2rem; }
        .m-readout span { display: block; margin-top: 0.3rem; font-size: 0.55rem; letter-spacing: 0.16em;
          color: rgba(252,252,252,0.42); }
        .m-readout .bad b { color: var(--live); }
        @media (max-width: 680px) { .m-readout { grid-template-columns: repeat(2, 1fr); } }

        .m-log { height: 108px; overflow-y: auto; margin-top: 1rem; padding: 0.6rem 0.8rem;
          border: 1px solid rgba(252,252,252,0.14); font-size: 0.62rem; line-height: 1.7; }
        .m-log p { margin: 0; color: rgba(252,252,252,0.72); white-space: nowrap; }
        .m-log p.bad { color: var(--live); }
        .m-log p.dim { color: rgba(252,252,252,0.4); white-space: normal; }
      `}</style>
    </div>
  )
}
