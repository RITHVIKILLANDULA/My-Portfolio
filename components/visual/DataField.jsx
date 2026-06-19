'use client'

import { useEffect, useRef } from 'react'

/**
 * A living data / AI network: drifting nodes, proximity edges, and bright data
 * pulses that travel along the edges — the "modern data & AI world" backdrop.
 * Canvas 2D for performance; pauses when off-screen; honours reduced motion.
 */
export default function DataField({ className = '', density = 1 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes = [], pulses = [], raf = 0, running = true
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight
      canvas.width = Math.max(1, Math.floor(W * dpr))
      canvas.height = Math.max(1, Math.floor(H * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
    }

    function build() {
      const count = Math.min(82, Math.max(26, Math.floor((W * H) / 19000) * density))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.6 + 0.8,
        hub: Math.random() < 0.14,           // a few brighter "hub" nodes
      }))
      pulses = []
    }

    const LINK = 132                          // edge distance threshold
    function spawnPulse() {
      // pick a node and a nearby neighbour, send a pulse along the edge
      const a = nodes[(Math.random() * nodes.length) | 0]
      if (!a) return
      let best = null, bd = LINK
      for (const b of nodes) {
        if (b === a) continue
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < bd && Math.random() < 0.5) { best = b; bd = d }
      }
      if (best) pulses.push({ a, b: best, t: 0, sp: 0.018 + Math.random() * 0.02 })
    }

    function frame() {
      if (!running) return
      raf = requestAnimationFrame(frame)
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      const px = (mouse.x - 0.5) * 26, py = (mouse.y - 0.5) * 26

      ctx.clearRect(0, 0, W, H)

      // drift
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20
      }

      // edges
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            const o = (1 - d / LINK) * 0.4
            ctx.strokeStyle = `rgba(150,150,180,${o * 0.5})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x + px * 0.4, a.y + py * 0.4)
            ctx.lineTo(b.x + px * 0.4, b.y + py * 0.4)
            ctx.stroke()
          }
        }
      }

      // nodes
      for (const n of nodes) {
        const x = n.x + px * (n.hub ? 0.7 : 0.4)
        const y = n.y + py * (n.hub ? 0.7 : 0.4)
        if (n.hub) {
          ctx.fillStyle = 'rgba(124,120,240,0.9)'
          ctx.shadowColor = 'rgba(124,120,240,0.8)'; ctx.shadowBlur = 10
        } else {
          ctx.fillStyle = 'rgba(220,220,235,0.55)'
          ctx.shadowBlur = 0
        }
        ctx.beginPath(); ctx.arc(x, y, n.r, 0, Math.PI * 2); ctx.fill()
      }
      ctx.shadowBlur = 0

      // pulses (amber data travelling the network)
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        p.t += p.sp
        if (p.t >= 1) { pulses.splice(i, 1); continue }
        const x = p.a.x + (p.b.x - p.a.x) * p.t + px * 0.4
        const y = p.a.y + (p.b.y - p.a.y) * p.t + py * 0.4
        ctx.fillStyle = 'rgba(255,140,60,0.95)'
        ctx.shadowColor = 'rgba(255,122,47,0.9)'; ctx.shadowBlur = 12
        ctx.beginPath(); ctx.arc(x, y, 2.1, 0, Math.PI * 2); ctx.fill()
        ctx.shadowBlur = 0
      }

      if (pulses.length < 14 && Math.random() < 0.14) spawnPulse()
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.tx = (e.clientX - r.left) / r.width
      mouse.ty = (e.clientY - r.top) / r.height
    }

    resize()
    if (reduced) {
      // draw one static frame, no animation
      running = false
      const tmp = running; running = true; frame(); running = tmp
    } else {
      frame()
      window.addEventListener('pointermove', onMove, { passive: true })
    }
    window.addEventListener('resize', resize)

    const io = new IntersectionObserver(([e]) => {
      if (reduced) return
      if (e.isIntersecting && !running) { running = true; frame() }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf) }
    }, { threshold: 0.01 })
    io.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
