'use client'

import { useEffect, useRef } from 'react'

/**
 * THE PLATE — the poster's background and wordmark, drawn rather than styled.
 *
 * CSS gave us flat colour and a static noise overlay, which is exactly the
 * "screen off" read a cinematic frame has to avoid. This draws the frame the
 * way a compositor would:
 *
 *   1  plate       near-black with a low-amplitude mottle, never a flat fill
 *   2  ember       a slow warm glow sitting behind the type
 *   3  wordmark    painted through two octaves of screen-space wear, revealed
 *                  by a directional dissolve — the letters emerge in flecks
 *                  from the baseline upward instead of fading uniformly
 *   4  edge light  a hair of lift along the top of each stroke
 *   5  vignette + grain, the grain re-jittered every frame
 *
 * The dissolve is done with canvas filters rather than per-pixel work: a
 * threshold map (wear + height) is pushed through brightness/contrast to make a
 * moving binary mask, which costs a few composites a frame instead of half a
 * million pixel writes.
 */

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const span = (t, a, b) => clamp((t - a) / (b - a), 0, 1)
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

export default function PosterPlate({ word = 'RITHVIK', ink = '#E4572E' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0, H = 0, raf = 0, t0 = 0, ready = false

    // layers we composite each frame
    const wear = document.createElement('canvas')      // distressed sheet
    const map = document.createElement('canvas')       // dissolve threshold field
    const mask = document.createElement('canvas')      // binarised map
    const layer = document.createElement('canvas')     // the painted wordmark
    const grain = document.createElement('canvas')     // fine film grain, tiled
    const glyph = document.createElement('canvas')     // letterform coverage
    const clip = document.createElement('canvas')      // glyph ∩ revealed

    let metrics = { size: 0, x: 0, y: 0, top: 0, bottom: 0 }

    // ── one-time textures ────────────────────────────────────────────────
    function buildWear(w, h) {
      wear.width = w; wear.height = h
      const g = wear.getContext('2d')
      const img = g.createImageData(w, h)
      const d = img.data
      // value noise at two scales: coarse blotching, fine scratches
      const coarse = 17, fine = 5
      const grid = (cell) => {
        const cols = Math.ceil(w / cell) + 2, rows = Math.ceil(h / cell) + 2
        const a = new Float32Array(cols * rows)
        for (let i = 0; i < a.length; i++) a[i] = Math.random()
        return { a, cols, cell }
      }
      const gc = grid(coarse), gf = grid(fine)
      const at = (g0, x, y) => {
        const cx = x / g0.cell, cy = y / g0.cell
        const x0 = Math.floor(cx), y0 = Math.floor(cy)
        const fx = cx - x0, fy = cy - y0
        const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
        const v = (ix, iy) => g0.a[iy * g0.cols + ix] ?? 0.5
        const a = v(x0, y0), b = v(x0 + 1, y0), c = v(x0, y0 + 1), e = v(x0 + 1, y0 + 1)
        return (a + (b - a) * sx) + ((c + (e - c) * sx) - (a + (b - a) * sx)) * sy
      }
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const v = at(gc, x, y) * 0.58 + at(gf, x, y) * 0.42
          const s = clamp((v - 0.5) * 1.15 + 0.5, 0, 1)   // wearGain
          const i = (y * w + x) * 4
          d[i] = d[i + 1] = d[i + 2] = s * 255
          d[i + 3] = 255
        }
      }
      g.putImageData(img, 0, 0)
    }

    // fine per-pixel grain, tiled — this is the film layer, not the paint wear
    function buildGrain(n = 256) {
      grain.width = n; grain.height = n
      const g = grain.getContext('2d')
      const img = g.createImageData(n, n)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const v = 118 + Math.random() * 74
        d[i] = d[i + 1] = d[i + 2] = v
        d[i + 3] = 255
      }
      g.putImageData(img, 0, 0)
    }

    function fontStack() {
      const v = getComputedStyle(document.body).getPropertyValue('--sans')
      return v && v.trim() ? v.trim() : 'Archivo, Helvetica, Arial, sans-serif'
    }

    function layout() {
      const size = clamp(W * 0.206, 48, 260)
      ctx.font = `900 ${size}px ${fontStack()}`
      const m = ctx.measureText(word)
      const asc = m.actualBoundingBoxAscent || size * 0.72
      const desc = m.actualBoundingBoxDescent || size * 0.02
      metrics = {
        size,
        x: W / 2,
        y: H * 0.52 + asc / 2,
        top: H * 0.52 - asc / 2,
        bottom: H * 0.52 + asc / 2 + desc,
      }
    }

    // white-on-transparent coverage for the word; every paint pass gets clipped
    // back to this, because blend modes like multiply are NOT clipped to what is
    // already drawn and would otherwise wash the whole frame
    function buildGlyph() {
      const g = glyph.getContext('2d')
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, W, H)
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.font = `900 ${metrics.size}px ${fontStack()}`
      g.fillStyle = '#fff'
      g.fillText(word, metrics.x, metrics.y)
    }

    // the field that decides which flecks of the letter appear first:
    // low values surface first, so the paint builds from the baseline up
    function buildMap() {
      map.width = W; map.height = H
      const g = map.getContext('2d')
      g.clearRect(0, 0, W, H)
      g.drawImage(wear, 0, 0, W, H)
      g.globalCompositeOperation = 'source-over'
      const grad = g.createLinearGradient(0, metrics.top, 0, metrics.bottom)
      grad.addColorStop(0, 'rgba(255,255,255,0.45)')   // top of the stroke last
      grad.addColorStop(1, 'rgba(0,0,0,0.45)')         // baseline first
      g.fillStyle = grad
      g.fillRect(0, 0, W, H)
      g.globalCompositeOperation = 'source-over'
    }

    function resize() {
      W = canvas.clientWidth || 0
      H = canvas.clientHeight || 0
      if (W < 2 || H < 2) return false
      canvas.width = W * dpr; canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ;[mask, layer, glyph, clip].forEach((c) => { c.width = W; c.height = H })
      buildWear(Math.max(320, Math.round(W / 2)), Math.max(200, Math.round(H / 2)))
      buildGrain()
      layout()
      buildGlyph()
      buildMap()
      ready = true
      return true
    }

    // ── the painted wordmark ─────────────────────────────────────────────
    function paintWord(reveal) {
      const g = layer.getContext('2d')
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, W, H)
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.font = `900 ${metrics.size}px ${fontStack()}`

      // base paint
      g.fillStyle = ink
      g.fillText(word, metrics.x, metrics.y)

      // two octaves of wear, sampled across the whole word in screen space so it
      // reads as one distressed sheet rather than per-letter texture. Overlay,
      // not multiply: it modulates the paint's lightness and leaves the hue.
      g.globalCompositeOperation = 'overlay'
      g.globalAlpha = 0.34
      g.drawImage(wear, 0, 0, W, H)                              // coarse blotching
      g.globalAlpha = 0.2
      g.drawImage(wear, -W * 0.31, -H * 0.17, W * 3.1, H * 3.1)  // fine scratches
      g.globalAlpha = 1

      // the deepest scratches pull toward a dried oxblood
      g.globalCompositeOperation = 'source-atop'
      g.globalAlpha = 0.16
      g.fillStyle = '#6B2416'
      g.fillRect(0, 0, W, H)
      g.globalAlpha = 1

      // a hair of lift along the top of each stroke, as if lit from above
      g.globalCompositeOperation = 'source-atop'
      const lift = g.createLinearGradient(0, metrics.top, 0, metrics.top + metrics.size * 0.24)
      lift.addColorStop(0, 'rgba(255,236,225,0.30)')
      lift.addColorStop(1, 'rgba(255,236,225,0)')
      g.fillStyle = lift
      g.fillRect(0, 0, W, H)
      g.globalCompositeOperation = 'source-over'

      // build the clip: the letterforms, minus whatever has not surfaced yet
      const cg = clip.getContext('2d')
      cg.setTransform(1, 0, 0, 1, 0, 0)
      cg.clearRect(0, 0, W, H)
      cg.drawImage(glyph, 0, 0)

      if (reveal < 1) {
        // dissolve: binarise the threshold field so the paint emerges in flecks
        // (brightness slides the threshold, contrast makes it a hard edge)
        const mg = mask.getContext('2d')
        mg.setTransform(1, 0, 0, 1, 0, 0)
        mg.clearRect(0, 0, W, H)
        mg.filter = `brightness(${(0.35 + reveal * 1.65).toFixed(3)}) contrast(1400%)`
        mg.drawImage(map, 0, 0)
        mg.filter = 'none'

        cg.globalCompositeOperation = 'destination-in'
        cg.drawImage(mask, 0, 0)
        cg.globalCompositeOperation = 'source-over'
      }

      g.globalCompositeOperation = 'destination-in'
      g.drawImage(clip, 0, 0)
      g.globalCompositeOperation = 'source-over'
    }

    // ── frame ────────────────────────────────────────────────────────────
    function draw(t) {
      const reveal = reduced ? 1 : easeOutExpo(span(t, 0.15, 1.85))
      const emberAmt = reduced ? 1 : span(t, 0.1, 1.6)

      // 1 — the plate: mottled, never a flat fill
      ctx.fillStyle = '#08080A'
      ctx.fillRect(0, 0, W, H)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'   // additive, like the shader
      ctx.globalAlpha = 0.045
      const pat = ctx.createPattern(grain, 'repeat')
      if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, W, H) }
      ctx.restore()

      // 2 — ember behind the type
      const breathe = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.55)
      const er = Math.max(W, H) * 0.52
      const eg = ctx.createRadialGradient(W / 2, H * 0.52, 0, W / 2, H * 0.52, er)
      const a = (0.16 + breathe * 0.05) * emberAmt
      eg.addColorStop(0, `rgba(228,87,46,${a.toFixed(3)})`)
      eg.addColorStop(0.45, `rgba(228,87,46,${(a * 0.28).toFixed(3)})`)
      eg.addColorStop(1, 'rgba(228,87,46,0)')
      ctx.fillStyle = eg
      ctx.fillRect(0, 0, W, H)

      // 3/4 — the wordmark, worn and lit
      paintWord(reveal)
      ctx.drawImage(layer, 0, 0)

      // 5 — vignette, then grain re-jittered so it never sits still
      const v = ctx.createRadialGradient(W / 2, H * 0.46, Math.min(W, H) * 0.3, W / 2, H * 0.46, Math.max(W, H) * 0.78)
      v.addColorStop(0, 'rgba(0,0,0,0)')
      v.addColorStop(1, 'rgba(0,0,0,0.66)')
      ctx.fillStyle = v
      ctx.fillRect(0, 0, W, H)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.05
      const gp = ctx.createPattern(grain, 'repeat')
      if (gp) {
        // re-jitter every frame so the grain never sits still
        ctx.translate((Math.random() * 256) | 0, (Math.random() * 256) | 0)
        ctx.fillStyle = gp
        ctx.fillRect(-256, -256, W + 512, H + 512)
      }
      ctx.restore()

      return reveal
    }

    let settled = false
    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (!ready) return
      if (!t0) t0 = now
      const t = (now - t0) / 1000
      const r = draw(t)
      // once the paint has fully surfaced the mask work stops; the loop stays
      // only to keep the ember breathing and the grain alive
      if (r >= 1) settled = true
    }

    if (!resize()) {
      let tries = 0
      const wait = () => {
        if (resize() || ++tries > 60) start()
        else requestAnimationFrame(wait)
      }
      requestAnimationFrame(wait)
    } else start()

    function start() {
      if (ready) draw(reduced ? 9 : 0)   // first frame is never owed to rAF
      if (reduced) return
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => { if (resize() && reduced) draw(9) }
    window.addEventListener('resize', onResize)

    const io = new IntersectionObserver(([e]) => {
      if (reduced) return
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(frame)
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0 }
    }, { threshold: 0.01 })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [word, ink])

  return <canvas ref={ref} className="plate-canvas" aria-hidden="true" />
}
