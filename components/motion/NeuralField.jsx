'use client'

import { useEffect, useRef } from 'react'

/**
 * Living neural constellation: drifting luminous nodes, proximity links,
 * cursor attracts + brightens nearby nodes with a soft glow. Sits over the
 * aurora light field — reads "AI", not "oscilloscope". 2D canvas, DPR-aware,
 * IO-paused, static frame under reduced motion.
 */
export default function NeuralField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, raf = 0, running = true
    let nodes = []
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    const LINK = 130

    function resize() {
      W = canvas.clientWidth || 1; H = canvas.clientHeight || 1
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(78, Math.floor((W * H) / 16000))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.5 + 0.7,
        hue: i % 5 === 0 ? 'v' : 'i',                       // few violet nodes among indigo
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      mouse.x += (mouse.tx - mouse.x) * 0.07
      mouse.y += (mouse.ty - mouse.y) * 0.07

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20
        if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20
      }
      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const t = 1 - Math.sqrt(d2) / LINK
            ctx.strokeStyle = `rgba(129,140,248,${t * 0.16})`
            ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      // nodes + cursor halo
      for (const n of nodes) {
        const dm = Math.hypot(n.x - mouse.x, n.y - mouse.y)
        const near = dm < 170 ? 1 - dm / 170 : 0
        if (near > 0.05) {
          ctx.strokeStyle = `rgba(165,180,252,${near * 0.3})`
          ctx.lineWidth = 0.7
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        }
        const base = n.hue === 'v' ? '167,139,250' : '129,140,248'
        // soft glow halo (two-pass fake bloom — cheap)
        ctx.beginPath()
        ctx.fillStyle = `rgba(${base},${0.08 + near * 0.18})`
        ctx.arc(n.x, n.y, n.r * 3.4 + near * 4, 0, Math.PI * 2); ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = `rgba(${base},${0.55 + near * 0.45})`
        ctx.arc(n.x, n.y, n.r + near * 1.2, 0, Math.PI * 2); ctx.fill()
      }
    }

    function frame() {
      if (!running) return
      raf = requestAnimationFrame(frame)
      draw()
    }
    function onMove(e) {
      const r = canvas.getBoundingClientRect()
      mouse.tx = e.clientX - r.left; mouse.ty = e.clientY - r.top
    }
    function onOut() { mouse.tx = -9999; mouse.ty = -9999 }

    resize()
    draw()
    const onResize = () => { resize(); if (!running) draw() }
    window.addEventListener('resize', onResize)
    if (!reduce) {
      frame()
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerout', onOut)
    } else {
      running = false
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
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerout', onOut)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
        maskImage: 'linear-gradient(180deg, #000 0%, #000 72%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 72%, transparent 100%)',
      }}
    />
  )
}
