'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import profile from '@/data/profile.json'
import HeroNarration from '@/components/agent/HeroNarration'

/* ── colors ───────────────────────────────────────── */
const AMBER  = new THREE.Color('#ff7a2f')
const AMBER2 = new THREE.Color('#ffb061')
const INDIGO = new THREE.Color('#7c78f0')
const WHITE  = new THREE.Color('#dfe0ef')

/* round glow sprite */
function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.75)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t
}

export default function Journey3D() {
  const mountRef   = useRef(null)
  const scrollRef  = useRef(null)
  const overlayRefs = useRef([])

  useEffect(() => {
    const mount = mountRef.current
    const scroller = scrollRef.current
    if (!mount || !scroller) return

    const W = () => mount.clientWidth
    const H = () => mount.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(dpr)
    renderer.setSize(W(), H())
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x06060c, 0.018)

    const camera = new THREE.PerspectiveCamera(62, W() / H(), 0.1, 600)

    const sprite = glowTexture()
    const groups = []  // disposables

    /* ── camera path through the 6 zones (−Z corridor, gentle weave) ── */
    const WAY = [
      new THREE.Vector3(0,   2,  14),   // 0 intro  (start, looking into galaxy)
      new THREE.Vector3(-6,  3, -28),   // 1 about  (data streams)
      new THREE.Vector3(7,   6, -74),   // 2 skills (grid city, banking)
      new THREE.Vector3(-5,  4, -120),  // 3 work   (monitors)
      new THREE.Vector3(4,   8, -166),  // 4 impact (constellations, rising)
      new THREE.Vector3(0,   2, -208),  // 5 contact(dock)
      new THREE.Vector3(0,   2, -226),  // tail
    ]
    const path = new THREE.CatmullRomCurve3(WAY, false, 'catmullrom', 0.4)
    const LOOK = [
      new THREE.Vector3(0, 1, -10),
      new THREE.Vector3(-2, 2, -60),
      new THREE.Vector3(2, 3, -100),
      new THREE.Vector3(-2, 3, -150),
      new THREE.Vector3(1, 4, -195),
      new THREE.Vector3(0, 2, -224),
      new THREE.Vector3(0, 2, -240),
    ]
    const lookCurve = new THREE.CatmullRomCurve3(LOOK, false, 'catmullrom', 0.4)

    /* ════ ZONE 1 — neural galaxy ════ */
    function neuralGalaxy(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const N = 1300
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
      const pts = []
      for (let i = 0; i < N; i++) {
        const r = 6 + Math.pow(Math.random(), 0.6) * 16
        const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
        const x = r * Math.sin(ph) * Math.cos(th) * (0.7 + Math.random() * 0.3)
        const y = r * Math.cos(ph) * 0.5
        const z = r * Math.sin(ph) * Math.sin(th)
        pos.set([x, y, z], i * 3)
        const c = Math.random() < 0.12 ? INDIGO : WHITE
        col.set([c.r, c.g, c.b], i * 3)
        if (i < 60) pts.push(new THREE.Vector3(x, y, z))
      }
      const pg = new THREE.BufferGeometry()
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
      const pm = new THREE.PointsMaterial({ size: 0.22, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 })
      g.add(new THREE.Points(pg, pm))

      // faint edges between nearby hub points
      const lpos = []
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++)
          if (pts[i].distanceTo(pts[j]) < 7) lpos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
      const lg = new THREE.BufferGeometry()
      lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lpos), 3))
      g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x7c78f0, transparent: true, opacity: 0.18 })))

      // amber core
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: AMBER, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
      core.scale.setScalar(6); g.add(core)
      g.userData.spin = g.children[0]
      scene.add(g); groups.push(g, pg, pm, lg)
      return g
    }

    /* ════ ZONE 2 — data streams ════ */
    function dataStreams(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const streams = []
      for (let s = 0; s < 9; s++) {
        const pts = []
        const baseY = (Math.random() - 0.5) * 14, baseX = (Math.random() - 0.5) * 22
        for (let i = 0; i <= 40; i++) {
          const t = i / 40
          pts.push(new THREE.Vector3(baseX + Math.sin(t * 6 + s) * 3, baseY + Math.cos(t * 5 + s) * 2.5, -20 + t * 40))
        }
        const curve = new THREE.CatmullRomCurve3(pts)
        const tube = new THREE.TubeGeometry(curve, 60, 0.03, 6, false)
        const m = new THREE.MeshBasicMaterial({ color: s % 2 ? INDIGO : AMBER, transparent: true, opacity: 0.28 })
        g.add(new THREE.Mesh(tube, m))
        // travelling pulse
        const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: s % 2 ? AMBER2 : INDIGO, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
        pulse.scale.setScalar(0.9); g.add(pulse)
        streams.push({ curve, pulse, off: Math.random(), sp: 0.06 + Math.random() * 0.08 })
        groups.push(tube, m)
      }
      g.userData.streams = streams
      scene.add(g); groups.push(g)
      return g
    }

    /* ════ ZONE 3 — server-grid city ════ */
    function gridCity(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const COLS = 11, ROWS = 9, GAP = 3.4
      const geo = new THREE.BoxGeometry(1.5, 1, 1.5)
      const mat = new THREE.MeshStandardMaterial({ color: 0x10101c, emissive: 0x1a1230, emissiveIntensity: 1, metalness: 0.6, roughness: 0.35 })
      const inst = new THREE.InstancedMesh(geo, mat, COLS * ROWS)
      const dummy = new THREE.Object3D(); const cAttr = []
      let k = 0
      for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
        const h = 1 + Math.random() * 9
        dummy.position.set((i - COLS / 2) * GAP, h / 2 - 4, (j - ROWS / 2) * GAP - 10)
        dummy.scale.set(1, h, 1); dummy.updateMatrix()
        inst.setMatrixAt(k, dummy.matrix)
        const c = Math.random() < 0.5 ? AMBER : INDIGO
        inst.setColorAt(k, c); cAttr.push(h); k++
      }
      g.add(inst)
      // glowing top sprites
      k = 0
      for (let i = 0; i < COLS; i++) for (let j = 0; j < ROWS; j++) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: Math.random() < 0.5 ? AMBER2 : INDIGO, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 }))
        sp.position.set((i - COLS / 2) * GAP, cAttr[k] - 4, (j - ROWS / 2) * GAP - 10); sp.scale.setScalar(1.1); g.add(sp); k++
      }
      // grid floor
      const grid = new THREE.GridHelper(80, 40, 0x3a2a4a, 0x241a30)
      grid.position.set(0, -4, -10); g.add(grid)
      scene.add(g); groups.push(g, geo, mat)
      return g
    }

    /* ════ ZONE 4 — floating project monitors ════ */
    function monitors(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const projs = (profile.projects || []).slice(0, 5)
      const labels = projs.length ? projs.map(p => p.title || p.name || 'Project') : ['Churn ML', 'Citi Bike', 'PDF-Insight RAG', 'Data Quality', 'BigQuery ML']
      labels.forEach((label, i) => {
        const ang = (i / labels.length) * Math.PI * 2
        const px = Math.cos(ang) * 9, py = Math.sin(ang) * 5, pz = -10 - (i % 2) * 6
        // screen
        const cv = document.createElement('canvas'); cv.width = 512; cv.height = 320
        const cx = cv.getContext('2d')
        cx.fillStyle = '#0c0a14'; cx.fillRect(0, 0, 512, 320)
        cx.strokeStyle = 'rgba(255,122,47,0.6)'; cx.lineWidth = 4; cx.strokeRect(6, 6, 500, 308)
        cx.fillStyle = '#ffb061'; cx.font = 'bold 30px Inter, sans-serif'
        cx.fillText('PROJECT', 28, 56)
        cx.fillStyle = '#fff'; cx.font = 'bold 40px Inter, sans-serif'
        wrap(cx, String(label), 28, 120, 460, 46)
        // little chart line
        cx.strokeStyle = '#ff7a2f'; cx.lineWidth = 3; cx.beginPath()
        for (let s = 0; s <= 10; s++) cx.lineTo(28 + s * 45, 270 - Math.sin(s + i) * 30 - s * 4)
        cx.stroke()
        const tex = new THREE.CanvasTexture(cv)
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 4), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }))
        pl.position.set(px, py, pz); pl.lookAt(0, 0, pz + 30); g.add(pl)
        groups.push(pl.geometry, pl.material)
      })
      scene.add(g); groups.push(g)
      return g
    }

    /* ════ ZONE 5 — impact constellations ════ */
    function constellations(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const N = 700
      const pos = new Float32Array(N * 3), col = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        pos.set([(Math.random() - 0.5) * 44, (Math.random() - 0.5) * 26, -10 + (Math.random() - 0.5) * 30], i * 3)
        const c = Math.random() < 0.35 ? AMBER2 : WHITE
        col.set([c.r, c.g, c.b], i * 3)
      }
      const pg = new THREE.BufferGeometry()
      pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
      g.add(new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.3, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })))
      scene.add(g); groups.push(g, pg)
      return g
    }

    /* ════ ZONE 6 — dock ════ */
    function dock(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const ring = new THREE.Mesh(new THREE.TorusGeometry(4, 0.06, 16, 80), new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.7 }))
      ring.position.set(0, 1, -16); ring.rotation.x = Math.PI / 2; g.add(ring)
      const ring2 = ring.clone(); ring2.scale.setScalar(0.6); ring2.material = new THREE.MeshBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.6 }); g.add(ring2)
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: AMBER2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
      core.scale.setScalar(3); core.position.set(0, 1, -16); g.add(core)
      g.userData.rings = [ring, ring2]
      scene.add(g); groups.push(g)
      return g
    }

    function wrap(ctx, text, x, y, maxW, lh) {
      const words = text.split(' '); let line = '', yy = y
      for (const w of words) {
        if (ctx.measureText(line + w).width > maxW && line) { ctx.fillText(line, x, yy); line = w + ' '; yy += lh }
        else line += w + ' '
      }
      ctx.fillText(line, x, yy)
    }

    // lights for the grid city
    scene.add(new THREE.AmbientLight(0x404060, 1.2))
    const key = new THREE.PointLight(0xff7a2f, 2, 120); key.position.set(10, 20, -90); scene.add(key)
    const fill = new THREE.PointLight(0x7c78f0, 1.5, 120); fill.position.set(-20, 10, -110); scene.add(fill)

    const zGalaxy = neuralGalaxy(0)
    const zStream = dataStreams(-50)
    const zCity   = gridCity(-100)
    const zMon    = monitors(-150)
    const zStars  = constellations(-188)
    const zDock   = dock(-222)

    /* ── scroll → eased progress → camera ── */
    let target = 0, prog = 0
    function onScroll() {
      const max = scroller.scrollHeight - scroller.clientHeight
      target = max > 0 ? scroller.scrollTop / max : 0
      updateOverlays()
      if (reduced) render()  // ensure repaint when rAF idle
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })

    function updateOverlays() {
      const n = overlayRefs.current.length
      overlayRefs.current.forEach((el, i) => {
        if (!el) return
        const center = i / (n - 1)
        const d = Math.abs(target - center)
        const span = 0.5 / (n - 1)
        const o = Math.max(0, 1 - d / span)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translateY(${(target - center) * 60}px)`
      })
    }

    const clock = new THREE.Clock()
    function setCam(p) {
      const cp = path.getPointAt(clamp01(p))
      camera.position.copy(cp)
      const lp = lookCurve.getPointAt(clamp01(p))
      camera.lookAt(lp)
    }
    function render() { renderer.render(scene, camera) }

    function frame() {
      raf = requestAnimationFrame(frame)
      prog += (target - prog) * 0.06
      setCam(prog)
      const t = clock.getElapsedTime()
      if (zGalaxy.userData.spin) zGalaxy.userData.spin.rotation.y = t * 0.04
      zStars.rotation.y = Math.sin(t * 0.1) * 0.1
      // stream pulses
      for (const s of zStream.userData.streams || []) {
        s.off = (s.off + s.sp * 0.016) % 1
        const pt = s.curve.getPointAt(s.off)
        s.pulse.position.copy(pt)
      }
      for (const r of zDock.userData.rings || []) r.rotation.z = t * 0.3
      render()
    }

    let raf = 0
    setCam(0); updateOverlays(); render()
    if (!reduced) frame()

    function onResize() {
      camera.aspect = W() / H(); camera.updateProjectionMatrix()
      renderer.setSize(W(), H()); render()
    }
    window.addEventListener('resize', onResize)

    function clamp01(x) { return Math.max(0, Math.min(1, x)) }

    return () => {
      cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      groups.forEach(o => { try { o.dispose && o.dispose() } catch {} })
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  /* nav waypoints (scroll fractions) exposed via window event */
  useEffect(() => {
    function goto(e) {
      const s = scrollRef.current; if (!s) return
      const frac = e.detail
      s.scrollTo({ top: frac * (s.scrollHeight - s.clientHeight), behavior: 'smooth' })
    }
    window.addEventListener('journey-goto', goto)
    return () => window.removeEventListener('journey-goto', goto)
  }, [])

  const SK = ['Python', 'SQL', 'BigQuery', 'Airflow', 'Spark', 'Databricks', 'LangChain', 'RAG', 'scikit-learn', 'XGBoost', 'Tableau', 'Power BI']
  const set = (i) => (el) => { overlayRefs.current[i] = el }

  return (
    <>
      {/* fixed 3D canvas */}
      <div ref={mountRef} className="jr-canvas" />

      {/* fixed overlay sections (opacity driven by scroll) */}
      <div className="jr-overlays">
        <section ref={set(0)} className="jr-sec">
          <p className="jr-kicker"><span className="jr-dot" /> Open to work · relocating across the U.S.</p>
          <h1 className="jr-title">Rithvik<br />Illandula</h1>
          <p className="jr-lead">Data · AI · Software Engineer — building reliable, measurable systems across data pipelines, ML, and the services that ship them.</p>
          <HeroNarration />
          <p className="jr-scrollcue">scroll to enter ↓</p>
        </section>

        <section ref={set(1)} className="jr-sec">
          <p className="jr-kicker">01 — About</p>
          <h2 className="jr-h2">4+ years turning messy data into decisions.</h2>
          <p className="jr-lead">Across Deloitte, WAFU Technologies, and the University at Buffalo. Three CS degrees. I work the whole stack — SQL & pipelines underneath, ML & LLM systems on top.</p>
        </section>

        <section ref={set(2)} className="jr-sec">
          <p className="jr-kicker">02 — Skills</p>
          <h2 className="jr-h2">The stack I build with.</h2>
          <div className="jr-chips">{SK.map(s => <span key={s} className="jr-chip">{s}</span>)}</div>
        </section>

        <section ref={set(3)} className="jr-sec">
          <p className="jr-kicker">03 — Work</p>
          <h2 className="jr-h2">Selected projects.</h2>
          <ul className="jr-list">
            <li><b>Telco Churn</b> — XGBoost over 500K+ records</li>
            <li><b>Citi Bike Demand</b> — LightGBM, 1M+ trips, 12–15% MAE gain</li>
            <li><b>PDF-Insight</b> — RAG assistant (LangChain · FAISS)</li>
          </ul>
        </section>

        <section ref={set(4)} className="jr-sec">
          <p className="jr-kicker">04 — Impact</p>
          <h2 className="jr-h2">By the numbers.</h2>
          <div className="jr-stats">
            <div><span>1M+</span>records</div>
            <div><span>80%</span>less review</div>
            <div><span>71%</span>faster pipeline</div>
            <div><span>25+</span>datasets</div>
          </div>
        </section>

        <section ref={set(5)} className="jr-sec">
          <p className="jr-kicker">05 — Contact</p>
          <h2 className="jr-h2">Let&apos;s build something.</h2>
          <p className="jr-lead">{profile.email}</p>
          <div className="jr-cta">
            <a href={`mailto:${profile.email}`} className="jr-btn">Email me</a>
            <button className="jr-btn ghost" onClick={() => window.dispatchEvent(new CustomEvent('start-audio-tour'))}>▶ Audio résumé</button>
          </div>
        </section>
      </div>

      {/* tall scroll driver */}
      <div ref={scrollRef} className="jr-scroller"><div style={{ height: '700vh' }} /></div>

      <style jsx>{`
        .jr-canvas { position: fixed; inset: 0; z-index: 0; background:
          radial-gradient(120% 90% at 70% 10%, #16101e 0%, #08070c 55%, #050409 100%); }
        .jr-scroller { position: fixed; inset: 0; z-index: 1; overflow-y: scroll; overscroll-behavior: none; }
        .jr-overlays { position: fixed; inset: 0; z-index: 2; pointer-events: none; }
        .jr-overlays a, .jr-overlays button { pointer-events: auto; }
        .jr-sec {
          position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
          padding: 0 8vw; max-width: 760px; color: #f4efe9; opacity: 0; will-change: opacity, transform;
        }
        .jr-kicker { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffb061; font-weight: 700; margin-bottom: 1.2rem; }
        .jr-dot { width: 7px; height: 7px; border-radius: 9999px; background: #36d399; box-shadow: 0 0 8px #36d399; }
        .jr-title { font-size: clamp(3rem, 9vw, 7rem); font-weight: 800; line-height: 0.92; letter-spacing: -0.02em;
          background: linear-gradient(180deg, #fff6ec, #ffd9a8 55%, #ff944d 130%); -webkit-background-clip: text;
          background-clip: text; -webkit-text-fill-color: transparent; }
        .jr-h2 { font-size: clamp(1.8rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.01em; margin-bottom: 1rem; }
        .jr-lead { font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.6; color: rgba(244,239,233,0.78); max-width: 32rem; }
        .jr-scrollcue { margin-top: 2rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(244,239,233,0.5); }
        .jr-chips { display: flex; flex-wrap: wrap; gap: 0.55rem; max-width: 34rem; }
        .jr-chip { font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 9999px; color: #f4efe9;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,122,47,0.32); }
        .jr-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; font-size: 1.05rem; }
        .jr-list li { padding-left: 1.1rem; position: relative; color: rgba(244,239,233,0.85); }
        .jr-list li::before { content: '▹'; position: absolute; left: 0; color: #ff7a2f; }
        .jr-list b { color: #fff; }
        .jr-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem 2.6rem; max-width: 28rem; }
        .jr-stats div { display: flex; flex-direction: column; font-size: 0.8rem; color: rgba(244,239,233,0.6); }
        .jr-stats span { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1; }
        .jr-cta { display: flex; gap: 0.8rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .jr-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.4rem; border-radius: 9999px;
          font-weight: 700; font-size: 0.85rem; cursor: pointer; border: 0; text-decoration: none;
          background: linear-gradient(180deg, #ff7a2f, #e85f1a); color: #160b03; }
        .jr-btn.ghost { background: transparent; border: 1px solid rgba(255,122,47,0.5); color: #ffb061; }

        @media (max-width: 640px) { .jr-sec { padding: 0 7vw; } .jr-stats { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </>
  )
}
