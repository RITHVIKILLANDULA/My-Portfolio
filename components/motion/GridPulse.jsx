'use client'

import { useEffect, useRef } from 'react'

/**
 * Analyst-grade hero backdrop: engineering graph-paper grid with '+' cross
 * markers, two slow live sparkline traces, and a scatter of data points that
 * brighten near the cursor. Monochrome indigo on near-black — reads
 * "instrument panel", not spectacle. 2D canvas, DPR-aware, IO-paused,
 * static under reduced motion.
 */
export default function GridPulse() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, raf = 0, running = true, t = 0
    const mouse = { x: -9999, y: -9999 }
    let pts = []

    const CELL = 56

    function resize() {
      W = canvas.clientWidth || 1; H = canvas.clientHeight || 1
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // scatter: one candidate per cell, sparse
      pts = []
      for (let gx = CELL; gx < W; gx += CELL) {
        for (let gy = CELL; gy < H; gy += CELL) {
          if (((gx * 7 + gy * 13) % 97) < 14) {
            pts.push({ x: gx + ((gx * 31 + gy * 17) % 23) - 11, y: gy + ((gx * 13 + gy * 7) % 19) - 9, s: ((gx + gy) % 3) * 0.4 + 0.8 })
          }
        }
      }
    }

    function trace(seed, amp, yBase, speed, alpha) {
      ctx.beginPath()
      for (let x = 0; x <= W; x += 6) {
        const p = x / W
        const y = yBase
          + Math.sin(p * 5.1 + seed + t * speed) * amp * 0.55
          + Math.sin(p * 11.7 + seed * 2.3 + t * speed * 1.6) * amp * 0.3
          + Math.sin(p * 23.3 + seed * 4.1 + t * speed * 0.7) * amp * 0.15
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(99,102,241,${alpha})`
      ctx.lineWidth = 1.1
      ctx.stroke()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // grid
      ctx.strokeStyle = 'rgba(99,102,241,0.055)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = CELL; x < W; x += CELL) { ctx.moveTo(x, 0); ctx.lineTo(x, H) }
      for (let y = CELL; y < H; y += CELL) { ctx.moveTo(0, y); ctx.lineTo(W, y) }
      ctx.stroke()

      // '+' markers at intersections (blueprint cue)
      ctx.strokeStyle = 'rgba(129,140,248,0.14)'
      for (let x = CELL; x < W; x += CELL * 2) {
        for (let y = CELL; y < H; y += CELL * 2) {
          ctx.beginPath()
          ctx.moveTo(x - 3.5, y); ctx.lineTo(x + 3.5, y)
          ctx.moveTo(x, y - 3.5); ctx.lineTo(x, y + 3.5)
          ctx.stroke()
        }
      }

      // sparkline traces
      trace(1.3, H * 0.06, H * 0.30, 0.5, 0.20)
      trace(4.7, H * 0.05, H * 0.62, 0.34, 0.13)

      // data scatter (brighter near cursor)
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        const near = d < 160 ? 1 - d / 160 : 0
        ctx.beginPath()
        ctx.fillStyle = `rgba(129,140,248,${0.16 + near * 0.55})`
        ctx.arc(p.x, p.y, p.s + near * 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function frame() {
      if (!running) return
      raf = requestAnimationFrame(frame)
      t += 0.016
      draw()
    }
    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top
    }

    resize()
    draw() // always present a frame (covers reduced motion + first paint)
    window.addEventListener('resize', () => { resize(); if (!running) draw() })
    if (!reduce) {
      frame()
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    const io = new IntersectionObserver(([e]) => {
      if (reduce) return
      if (e.isIntersecting && !running) { running = true; frame() }
      else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
    }, { threshold: 0.01 })
    io.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
        maskImage: 'linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)',
      }}
    />
  )
}
