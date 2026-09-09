'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * SCENE 01 — "THE NAME IS ASSEMBLED FROM DATA"
 *
 * A title sequence in the grammar of a film: ONE master clock, beats that
 * deliberately OVERLAP (the letters are still resolving when the rule draws
 * and the meta strip drops), true black held until everything is ready, and a
 * settle into ambient life + pointer parallax.
 *
 * The difference from a filmed title sequence: nothing here is footage. The
 * name is assembled by ~4,000 data points that stream in from the dark and
 * land on glyph positions sampled from the actual rendered type — the visitor
 * literally watches a pipeline resolve into an identity. Canvas 2D, so it
 * works everywhere and degrades to static type when it can't.
 */

// ── the beat sheet (seconds) — overlap is the whole point ────────────────
const T = {
  fieldIn: 0.30,        // data points condense out of the dark
  fieldDur: 1.60,
  name: 1.55,           // glyphs begin to resolve, centre outward
  letterStagger: 0.115,
  letterDur: 1.45,
  rule: 2.55,           // the accent rule draws under the name
  role: 2.80,           // role line rises
  meta: 3.10,           // corner meta ticks into place
  settled: 4.40,        // ambient life + parallax take over
}

const NAME_LINES = ['RITHVIK', 'ILLANDULA']
const MIN_BLACK = 620   // the darkness must be felt, even on a fast line

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const span = (t, a, b) => clamp((t - a) / (b - a), 0, 1)
const easeOutQuint = (p) => 1 - Math.pow(1 - p, 5)
const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3)
const smoothstep = (a, b, x) => { const p = clamp((x - a) / (b - a), 0, 1); return p * p * (3 - 2 * p) }

export default function OpeningSequence({ onSettled }) {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const [phase, setPhase] = useState('black')   // black → running → done
  const doneRef = useRef(false)

  useEffect(() => {
    // NB: declared before any early return — finish() closes over these and is
    // called on the skip paths below, which would otherwise hit the TDZ.
    let raf = 0
    let watchdog = 0
    let tries = 0

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    let seen = false
    try { seen = !!sessionStorage.getItem('ri_opening_seen') } catch {}

    // returning visitors and reduced-motion users go straight to the page
    if (seen || reduced) { finish(true); return }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) { finish(true); return }

    document.documentElement.style.overflow = 'hidden'
    setPhase('running')

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, t0 = 0
    let points = []
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    // ── build the glyph targets by sampling the real rendered type ────────
    function buildPoints() {
      W = window.innerWidth || document.documentElement.clientWidth || 0
      H = window.innerHeight || document.documentElement.clientHeight || 0
      if (W < 2 || H < 2) return false   // no viewport yet — caller retries
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const off = document.createElement('canvas')
      const octx = off.getContext('2d', { willReadFrequently: true })
      off.width = W; off.height = H

      // type metrics matched to the page's statement scale
      const size = clamp(W * 0.115, 46, 190)
      const lineH = size * 0.92
      const family = getComputedStyle(document.body).getPropertyValue('--sans') || 'Archivo, Helvetica, sans-serif'
      octx.fillStyle = '#fff'
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.font = `640 ${size}px ${family}`

      const cx = W / 2
      const cy = H / 2
      NAME_LINES.forEach((line, i) => {
        octx.fillText(line, cx, cy + (i - (NAME_LINES.length - 1) / 2) * lineH)
      })

      const img = octx.getImageData(0, 0, W, H).data
      const step = W < 640 ? 5 : 4
      const found = []
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (img[(y * W + x) * 4 + 3] > 128) found.push({ x, y })
        }
      }

      // reveal rank: centre outward, so the name grows from the middle.
      // NB: loop, not Math.max(...spread) — `found` is tens of thousands of
      // points and spreading it overflows the call stack.
      let maxD = 1
      for (let i = 0; i < found.length; i++) {
        const d = Math.abs(found[i].x - cx)
        if (d > maxD) maxD = d
      }
      points = found.map((p) => {
        const rank = Math.abs(p.x - cx) / maxD                 // 0 centre → 1 edges
        const a = Math.random() * Math.PI * 2
        const r = Math.max(W, H) * (0.42 + Math.random() * 0.5)
        return {
          tx: p.x, ty: p.y,
          sx: cx + Math.cos(a) * r,                            // streams in from the dark
          sy: cy + Math.sin(a) * r * 0.65,
          rank,
          jx: (Math.random() - 0.5) * 1.6,                     // resting jitter — the field breathes
          jy: (Math.random() - 0.5) * 1.6,
          ph: Math.random() * Math.PI * 2,
          sz: Math.random() < 0.10 ? 2.4 : 1.35,               // a few brighter carriers
        }
      })
      return points.length > 0
    }

    // ── the frame ─────────────────────────────────────────────────────────
    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (!t0) t0 = now
      const t = (now - t0) / 1000

      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06

      ctx.clearRect(0, 0, W, H)

      const fieldP = span(t, T.fieldIn, T.fieldIn + T.fieldDur)
      const settle = span(t, T.settled - 0.6, T.settled + 1.2)
      const breathe = Math.sin(t * 0.9) * 0.5 + 0.5

      // parallax only once things have settled — before that the camera is locked
      const px = pointer.x * 14 * settle
      const py = pointer.y * 9 * settle

      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        // each point resolves on its own clock: centre first, edges last
        const start = T.name + p.rank * (T.letterDur * 0.55) + p.rank * T.letterStagger
        const lp = span(t, start, start + T.letterDur)
        const e = easeOutQuint(lp)

        // before it resolves it is still part of the incoming field
        const fx = p.sx + (p.tx - p.sx) * e
        const fy = p.sy + (p.ty - p.sy) * e

        // resting life: a slow drift so the type never looks like a dead PNG
        const rest = e * settle
        const dx = fx + p.jx * Math.sin(t * 0.7 + p.ph) * rest + px * (0.6 + p.rank * 0.8)
        const dy = fy + p.jy * Math.cos(t * 0.6 + p.ph) * rest + py * (0.6 + p.rank * 0.8)

        // brightness: dim while travelling, full when landed, a touch of shimmer
        const arrive = smoothstep(0, 1, lp)
        const alpha = (0.14 + 0.86 * arrive) * (0.3 + 0.7 * fieldP)
        const shimmer = 1 - 0.12 * Math.sin(t * 2.1 + p.ph) * rest

        ctx.fillStyle = `rgba(252,252,252,${clamp(alpha * shimmer, 0, 1)})`
        ctx.fillRect(dx, dy, p.sz, p.sz)
      }

      // the accent rule draws itself under the name
      const rp = easeOutCubic(span(t, T.rule, T.rule + 0.9))
      if (rp > 0) {
        const w = Math.min(W * 0.34, 460) * rp
        const y = H / 2 + clamp(W * 0.115, 46, 190) * 0.92 + 22
        ctx.fillStyle = 'rgba(228,87,46,0.95)'
        ctx.fillRect(W / 2 - w / 2 + px * 0.4, y, w, 2)
      }

      // grain + vignette — the film layer
      if (fieldP > 0) drawFilm(t)

      if (!doneRef.current && t > T.settled + 1.35) finish(false)
    }

    // cheap film grain: a few hundred sparks per frame beats a noise texture
    function drawFilm(t) {
      const n = 220
      ctx.fillStyle = 'rgba(255,255,255,0.022)'
      for (let i = 0; i < n; i++) {
        ctx.fillRect((Math.random() * W) | 0, (Math.random() * H) | 0, 1, 1)
      }
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.22, W / 2, H / 2, Math.max(W, H) * 0.72)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,0.58)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }

    function onMove(e) {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    function onResize() { try { buildPoints() } catch {} }
    function onSkip() { finish(false) }

    // hold true black until the type is measurable, then run
    const startAt = performance.now()
    // the viewport can still be 0x0 on the first tick (and in headless shells),
    // and sampling a zero-width canvas throws — so wait for a real box first
    const begin = () => {
      let ok = false
      try {
        ok = buildPoints()
      } catch (err) {
        console.error('opening sequence failed to build', err)
        finish(true)
        return
      }
      if (!ok) {
        if (++tries > 60) { finish(true); return }   // ~1s of trying, then just show the page
        requestAnimationFrame(begin)
        return
      }
      const wait = Math.max(0, MIN_BLACK - (performance.now() - startAt))
      setTimeout(() => { raf = requestAnimationFrame(frame) }, wait)
      // watchdog: rAF is throttled to zero in background tabs (and some
      // embedded shells). The sequence must never hold the page hostage —
      // if wall-clock time passes without the loop finishing, let them in.
      watchdog = setTimeout(() => finish(false), wait + (T.settled + 2.6) * 1000)
    }
    if (document.fonts?.ready) document.fonts.ready.then(begin).catch(begin)
    else begin()

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('wheel', onSkip, { passive: true, once: true })
    window.addEventListener('keydown', onSkip, { once: true })
    window.addEventListener('touchstart', onSkip, { passive: true, once: true })

    function finish(instant) {
      if (doneRef.current) return
      doneRef.current = true
      cancelAnimationFrame(raf)
      clearTimeout(watchdog)
      try { sessionStorage.setItem('ri_opening_seen', '1') } catch {}
      document.documentElement.style.overflow = ''
      setPhase(instant ? 'done' : 'lift')
      onSettled?.()
      if (!instant) setTimeout(() => setPhase('done'), 900)
    }

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(watchdog)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('wheel', onSkip)
      window.removeEventListener('keydown', onSkip)
      window.removeEventListener('touchstart', onSkip)
      document.documentElement.style.overflow = ''
    }
  }, []) // eslint-disable-line

  if (phase === 'done') return null

  return (
    <div className={`cine ${phase}`} ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} className="cine-canvas" />
      {/* furniture — drops in over the assembling name, overlapping the beats */}
      <div className="cine-furniture">
        <p className="cine-tl">RITHVIK ILLANDULA — PORTFOLIO ’26</p>
        <p className="cine-tr">BUFFALO, NY</p>
        <p className="cine-role">DATA &amp; AI ENGINEER</p>
        <p className="cine-bl">ASSEMBLING 4,000 POINTS…</p>
        <p className="cine-br">SCROLL TO SKIP</p>
      </div>
      <style jsx>{`
        .cine { position: fixed; inset: 0; z-index: 300; background: #000;
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); }
        .cine.lift { opacity: 0; transform: scale(1.06); pointer-events: none; }
        .cine-canvas { position: absolute; inset: 0; display: block; }
        .cine-furniture { position: absolute; inset: 0; pointer-events: none;
          font-family: var(--mono, ui-monospace, monospace); font-size: 0.58rem; letter-spacing: 0.2em;
          color: rgba(252,252,252,0.62); }
        .cine-furniture p { position: absolute; margin: 0; opacity: 0; animation: cine-in .9s cubic-bezier(.16,1,.3,1) both; }
        .cine-tl { top: 1.4rem; left: 1.5rem; animation-delay: 3.1s !important; }
        .cine-tr { top: 1.4rem; right: 1.5rem; animation-delay: 3.25s !important; }
        .cine-bl { bottom: 1.4rem; left: 1.5rem; animation-delay: 3.4s !important; }
        .cine-br { bottom: 1.4rem; right: 1.5rem; animation-delay: 3.55s !important; color: rgba(252,252,252,0.38); }
        .cine-role { left: 50%; top: calc(50% + clamp(46px, 11.5vw, 190px) * 0.92 + 46px); transform: translateX(-50%);
          font-size: 0.66rem; letter-spacing: 0.42em; color: rgba(252,252,252,0.86); white-space: nowrap;
          animation-delay: 2.85s !important; }
        @keyframes cine-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .cine-role { animation-name: cine-in-c; }
        @keyframes cine-in-c { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%); } }
        @media (max-width: 640px) { .cine-tr, .cine-bl { display: none; } }
      `}</style>
    </div>
  )
}
