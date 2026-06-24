'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import profile from '@/data/profile.json'
import HeroNarration from '@/components/agent/HeroNarration'
import ProjectShowcase from '@/components/journey/ProjectShowcase'

const AMBER  = new THREE.Color('#ff7a2f')
const AMBER2 = new THREE.Color('#ffb061')
const INDIGO = new THREE.Color('#7c78f0')

const ZONES = ['Intro', 'About', 'Skills', 'Work', 'Impact', 'Contact']

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
function wrap(ctx, text, x, y, maxW, lh) {
  const words = text.split(' '); let line = '', yy = y
  for (const w of words) {
    if (ctx.measureText(line + w).width > maxW && line) { ctx.fillText(line, x, yy); line = w + ' '; yy += lh }
    else line += w + ' '
  }
  ctx.fillText(line, x, yy)
}

export default function Journey3D() {
  const mountRef    = useRef(null)
  const scrollRef   = useRef(null)
  const overlayRefs = useRef([])
  const curRef      = useRef(null)
  const curRingRef  = useRef(null)
  const curLabelRef = useRef(null)
  const railRefs    = useRef([])

  useEffect(() => {
    const mount = mountRef.current, scroller = scrollRef.current
    if (!mount || !scroller) return
    const W = () => mount.clientWidth || window.innerWidth
    const H = () => mount.clientHeight || window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(dpr); renderer.setSize(W(), H())
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x06060c, 18, 150)
    const camera = new THREE.PerspectiveCamera(64, W() / H(), 0.1, 600)
    const sprite = glowTexture()
    const disp = []
    const GROUND = -4
    const interactive = []   // raycast targets (project monitors)

    /* floor */
    const floor = new THREE.GridHelper(600, 300, 0x6a4424, 0x241a33)
    floor.position.y = GROUND; floor.material.transparent = true; floor.material.opacity = 0.55
    scene.add(floor); disp.push(floor.geometry, floor.material)
    const floor2 = new THREE.GridHelper(160, 160, 0x3a2a18, 0x1a1426)
    floor2.position.y = GROUND + 0.02; floor2.material.transparent = true; floor2.material.opacity = 0.4
    scene.add(floor2); disp.push(floor2.geometry, floor2.material)
    function horizonGlow(x, z, color, s) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }))
      sp.position.set(x, GROUND + 6, z); sp.scale.set(s, s * 0.5, 1); scene.add(sp)
    }
    horizonGlow(-20, -120, AMBER, 120); horizonGlow(30, -200, INDIGO, 140)

    scene.add(new THREE.AmbientLight(0x505074, 1.3))
    const key = new THREE.PointLight(0xff7a2f, 2.2, 160); key.position.set(8, 16, -90); scene.add(key)
    const fill = new THREE.PointLight(0x7c78f0, 1.6, 160); fill.position.set(-18, 12, -150); scene.add(fill)

    /* gateway */
    function gateway(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const arch = new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.08, 14, 80), new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.8 }))
      arch.position.set(0, GROUND + 5.5, -16); g.add(arch); disp.push(arch.geometry, arch.material)
      const arch2 = new THREE.Mesh(new THREE.TorusGeometry(4, 0.05, 12, 70), new THREE.MeshBasicMaterial({ color: INDIGO, transparent: true, opacity: 0.6 }))
      arch2.position.set(0, GROUND + 5, -22); g.add(arch2); disp.push(arch2.geometry)
      const nodes = [], lpos = []
      for (let i = 0; i < 70; i++) { const a = Math.random() * Math.PI * 2, r = 2 + Math.random() * 7; nodes.push(new THREE.Vector3(Math.cos(a) * r, GROUND + 1 + Math.random() * 9, -16 + (Math.random() - 0.5) * 8)) }
      const np = new Float32Array(nodes.length * 3), nc = new Float32Array(nodes.length * 3)
      nodes.forEach((v, i) => { np.set([v.x, v.y, v.z], i * 3); const c = Math.random() < 0.3 ? INDIGO : AMBER2; nc.set([c.r, c.g, c.b], i * 3) })
      const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.BufferAttribute(np, 3)); ng.setAttribute('color', new THREE.BufferAttribute(nc, 3))
      g.add(new THREE.Points(ng, new THREE.PointsMaterial({ size: 0.35, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))); disp.push(ng)
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (nodes[i].distanceTo(nodes[j]) < 3.2) lpos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lpos), 3))
      g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x7c78f0, transparent: true, opacity: 0.22 }))); disp.push(lg)
      g.userData.arches = [arch, arch2]; scene.add(g); disp.push(g); return g
    }
    /* rivers */
    function rivers(zc) {
      const g = new THREE.Group(); g.position.z = zc; const streams = []
      for (let s = 0; s < 11; s++) {
        const pts = [], bx = (Math.random() - 0.5) * 26
        for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(new THREE.Vector3(bx + Math.sin(t * 5 + s) * 3, GROUND + 0.4 + Math.abs(Math.sin(t * 3 + s)) * 3, -22 + t * 44)) }
        const curve = new THREE.CatmullRomCurve3(pts)
        const tube = new THREE.TubeGeometry(curve, 60, 0.035, 6, false)
        const m = new THREE.MeshBasicMaterial({ color: s % 2 ? INDIGO : AMBER, transparent: true, opacity: 0.3 })
        g.add(new THREE.Mesh(tube, m)); disp.push(tube, m)
        const pulse = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: s % 2 ? AMBER2 : INDIGO, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }))
        pulse.scale.setScalar(0.95); g.add(pulse); streams.push({ curve, pulse, off: Math.random(), sp: 0.05 + Math.random() * 0.09 })
      }
      g.userData.streams = streams; scene.add(g); disp.push(g); return g
    }
    /* city */
    function city(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const geo = new THREE.BoxGeometry(2.4, 1, 2.4)
      const mat = new THREE.MeshStandardMaterial({ color: 0x0e0e1a, emissive: 0x231640, emissiveIntensity: 1.1, metalness: 0.7, roughness: 0.3 })
      const rows = 14, inst = new THREE.InstancedMesh(geo, mat, rows * 2), d = new THREE.Object3D(), tops = []
      let k = 0
      for (let r = 0; r < rows; r++) for (const side of [-1, 1]) {
        const h = 4 + Math.random() * 16, x = side * (6 + Math.random() * 12), z = -r * 6 - 4
        d.position.set(x, GROUND + h / 2, z); d.scale.set(1, h, 1); d.updateMatrix(); inst.setMatrixAt(k, d.matrix); inst.setColorAt(k, Math.random() < 0.5 ? AMBER : INDIGO); tops.push([x, GROUND + h, z]); k++
      }
      g.add(inst); disp.push(geo, mat)
      tops.forEach(([x, y, z]) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: Math.random() < 0.5 ? AMBER2 : INDIGO, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 })); sp.position.set(x, y, z); sp.scale.setScalar(1.4); g.add(sp) })
      scene.add(g); disp.push(g); return g
    }
    /* monitors — INTERACTIVE (hover + click → ask AI) */
    function monitors(zc) {
      const g = new THREE.Group(); g.position.z = zc
      const projs = (profile.projects || []).slice(0, 5)
      const labels = projs.length ? projs.map(p => p.title || p.name || 'Project') : ['Telco Churn', 'Citi Bike Demand', 'PDF-Insight RAG', 'Data Quality', 'BigQuery ML']
      labels.forEach((label, i) => {
        const side = i % 2 ? 1 : -1, px = side * (5 + (i % 3)), py = GROUND + 5 + (i % 2) * 3, pz = -6 - i * 7
        const cv = document.createElement('canvas'); cv.width = 512; cv.height = 320
        const cx = cv.getContext('2d')
        cx.fillStyle = '#0c0a14'; cx.fillRect(0, 0, 512, 320)
        cx.strokeStyle = 'rgba(255,122,47,0.7)'; cx.lineWidth = 5; cx.strokeRect(7, 7, 498, 306)
        cx.fillStyle = '#ffb061'; cx.font = 'bold 28px Inter, sans-serif'; cx.fillText('PROJECT · CLICK TO ASK', 28, 56)
        cx.fillStyle = '#fff'; cx.font = 'bold 42px Inter, sans-serif'; wrap(cx, String(label), 28, 122, 456, 48)
        cx.strokeStyle = '#ff7a2f'; cx.lineWidth = 3; cx.beginPath()
        for (let s = 0; s <= 10; s++) cx.lineTo(28 + s * 45, 272 - Math.sin(s + i) * 30 - s * 3); cx.stroke()
        const tex = new THREE.CanvasTexture(cv)
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }))
        pl.position.set(px, py, pz); pl.rotation.y = -side * 0.4; pl.userData = { label: String(label), base: 1 }
        g.add(pl); interactive.push(pl); disp.push(pl.geometry, pl.material)
      })
      scene.add(g); disp.push(g); return g
    }
    /* monoliths */
    function monoliths(zc) {
      const g = new THREE.Group(); g.position.z = zc; const vals = ['1M+', '80%', '71%', '25+', '6', '15+']
      vals.forEach((v, i) => {
        const h = 9 + (i % 3) * 4, x = (i - vals.length / 2) * 5 + 2, z = -8 - (i % 2) * 6, col = i % 2 ? INDIGO : AMBER
        const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, h, 1.4), new THREE.MeshStandardMaterial({ color: 0x0e0e1a, emissive: col, emissiveIntensity: 0.8, metalness: 0.6, roughness: 0.3 }))
        m.position.set(x, GROUND + h / 2, z); g.add(m); disp.push(m.geometry, m.material)
        const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128
        const cx = cv.getContext('2d'); cx.fillStyle = i % 2 ? '#ffb061' : '#ff944d'; cx.font = 'bold 86px Inter, sans-serif'; cx.textAlign = 'center'; cx.fillText(v, 128, 96)
        const lp = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, side: THREE.DoubleSide }))
        lp.position.set(x, GROUND + h + 1.4, z); g.add(lp); disp.push(lp.geometry, lp.material)
        const cap = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: i % 2 ? INDIGO : AMBER2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); cap.position.set(x, GROUND + h, z); cap.scale.setScalar(2.2); g.add(cap)
      })
      scene.add(g); disp.push(g); return g
    }
    /* dock */
    function dock(zc) {
      const g = new THREE.Group(); g.position.z = zc; const rings = []
      for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(5 - i * 1.4, 0.05, 14, 80), new THREE.MeshBasicMaterial({ color: i % 2 ? INDIGO : AMBER, transparent: true, opacity: 0.7 })); r.position.set(0, GROUND + 0.1, -16); r.rotation.x = Math.PI / 2; g.add(r); rings.push(r); disp.push(r.geometry, r.material) }
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: AMBER2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); core.position.set(0, GROUND + 1.5, -16); core.scale.setScalar(3.5); g.add(core)
      g.userData.rings = rings; scene.add(g); disp.push(g); return g
    }

    const zGate = gateway(0), zRiver = rivers(-44), zCity = city(-78), zMon = monitors(-150), zMono = monoliths(-186), zDock = dock(-220)

    /* camera path */
    const WAY = [
      new THREE.Vector3(0, GROUND + 6, 16), new THREE.Vector3(-4, GROUND + 5, -26), new THREE.Vector3(5, GROUND + 6, -64),
      new THREE.Vector3(-3, GROUND + 5, -118), new THREE.Vector3(3, GROUND + 7, -160), new THREE.Vector3(0, GROUND + 5, -204), new THREE.Vector3(0, GROUND + 5, -224),
    ]
    const LOOK = [
      new THREE.Vector3(0, GROUND + 4, -10), new THREE.Vector3(-1, GROUND + 4, -56), new THREE.Vector3(2, GROUND + 4, -96),
      new THREE.Vector3(-1, GROUND + 4, -150), new THREE.Vector3(1, GROUND + 5, -192), new THREE.Vector3(0, GROUND + 4, -222), new THREE.Vector3(0, GROUND + 4, -240),
    ]
    const path = new THREE.CatmullRomCurve3(WAY, false, 'catmullrom', 0.4)
    const lookCurve = new THREE.CatmullRomCurve3(LOOK, false, 'catmullrom', 0.4)
    const clamp01 = (x) => Math.max(0, Math.min(1, x))

    /* ── interactivity state ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }       // parallax (−1..1)
    const ndc = new THREE.Vector2()
    const ray = new THREE.Raycaster()
    let hovered = null
    let prog = 0, target = 0

    function onScroll() {
      const max = scroller.scrollHeight - scroller.clientHeight
      target = max > 0 ? scroller.scrollTop / max : 0
      updateOverlays(); if (reduced) render()
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })

    function updateOverlays() {
      const n = overlayRefs.current.length
      overlayRefs.current.forEach((el, i) => {
        if (!el) return
        const center = i / (n - 1), d = Math.abs(target - center), span = 0.5 / (n - 1)
        el.style.opacity = Math.max(0, 1 - d / span).toFixed(3)
        el.style.transform = `translateY(${(target - center) * 60}px)`
      })
      const zi = Math.round(target * (ZONES.length - 1))
      railRefs.current.forEach((el, i) => el && el.setAttribute('data-active', i === zi ? '1' : '0'))
    }

    function onPointerMove(e) {
      const r = renderer.domElement.getBoundingClientRect()
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      mouse.ty = ((e.clientY - r.top) / r.height) * 2 - 1
      ndc.set(mouse.tx, -mouse.ty)
      if (curRef.current) { curRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; curRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)` }
    }
    function raycast() {
      ray.setFromCamera(ndc, camera)
      const hit = ray.intersectObjects(interactive, false)[0]
      const obj = hit ? hit.object : null
      if (obj !== hovered) {
        if (hovered) hovered.userData.base = 1
        hovered = obj
        document.body.style.cursor = obj ? 'none' : 'none'
        const ring = curRingRef.current, lab = curLabelRef.current
        if (obj && ring) { ring.classList.add('hot'); if (lab) { lab.textContent = 'Ask: ' + obj.userData.label; lab.style.opacity = '1' } }
        else if (ring) { ring.classList.remove('hot'); if (lab) lab.style.opacity = '0' }
      }
    }
    function onClick() {
      if (hovered) window.dispatchEvent(new CustomEvent('journey-ask', { detail: `Tell me about the ${hovered.userData.label} project` }))
    }
    if (!coarse) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      renderer.domElement.addEventListener('click', onClick)
      scroller.addEventListener('click', onClick)
    }

    function onKey(e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); jump(1) }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); jump(-1) }
    }
    function jump(dir) {
      const zi = Math.round(target * (ZONES.length - 1))
      gotoFrac(clamp01((zi + dir) / (ZONES.length - 1)))
    }
    function gotoFrac(f) { scroller.scrollTo({ top: f * (scroller.scrollHeight - scroller.clientHeight), behavior: 'smooth' }) }
    window.addEventListener('keydown', onKey)
    window.__journeyGoto = gotoFrac

    const clock = new THREE.Clock()
    const _look = new THREE.Vector3()
    function setCam(p) {
      camera.position.copy(path.getPointAt(clamp01(p)))
      camera.position.x += mouse.x * 1.6
      camera.position.y += -mouse.y * 0.9
      _look.copy(lookCurve.getPointAt(clamp01(p)))
      _look.x += mouse.x * 4
      _look.y += -mouse.y * 3
      camera.lookAt(_look)
    }
    function render() { renderer.render(scene, camera) }

    let raf = 0
    function frame() {
      raf = requestAnimationFrame(frame)
      prog += (target - prog) * 0.06
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      setCam(prog)
      if (!coarse) raycast()
      const t = clock.getElapsedTime()
      for (const a of zGate.userData.arches || []) a.rotation.z = t * 0.15
      for (const s of zRiver.userData.streams || []) { s.off = (s.off + s.sp * 0.016) % 1; s.pulse.position.copy(s.curve.getPointAt(s.off)) }
      for (const r of zDock.userData.rings || []) r.rotation.z = t * 0.3
      for (const m of interactive) { const tgt = m === hovered ? 1.12 : 1; m.scale.x += (tgt - m.scale.x) * 0.18; m.scale.y = m.scale.x }
      render()
    }
    setCam(0); updateOverlays(); render()
    if (!reduced) frame()

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); render() }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('keydown', onKey)
      renderer.domElement.removeEventListener('click', onClick)
      scroller.removeEventListener('click', onClick)
      disp.forEach(o => { try { o.dispose && o.dispose() } catch {} })
      renderer.dispose()
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    function goto(e) { window.__journeyGoto && window.__journeyGoto(e.detail) }
    window.addEventListener('journey-goto', goto)
    return () => window.removeEventListener('journey-goto', goto)
  }, [])

  const SK = ['Python', 'SQL', 'BigQuery', 'Airflow', 'Spark', 'Databricks', 'LangChain', 'RAG', 'scikit-learn', 'XGBoost', 'Tableau', 'Power BI']
  const set = (i) => (el) => { overlayRefs.current[i] = el }
  const setRail = (i) => (el) => { railRefs.current[i] = el }

  return (
    <>
      <div ref={mountRef} className="jr-canvas" />

      {/* custom cursor */}
      <div ref={curRef} className="jr-cur" />
      <div ref={curRingRef} className="jr-cur-ring"><span ref={curLabelRef} className="jr-cur-label" /></div>

      {/* waypoint rail */}
      <nav className="jr-rail" aria-label="Sections">
        {ZONES.map((z, i) => (
          <button key={z} ref={setRail(i)} data-active="0" className="jr-rail-dot"
            onClick={() => window.dispatchEvent(new CustomEvent('journey-goto', { detail: i / (ZONES.length - 1) }))}>
            <span className="jr-rail-label">{z}</span>
          </button>
        ))}
      </nav>

      <div className="jr-overlays">
        <section ref={set(0)} className="jr-sec">
          <p className="jr-kicker"><span className="jr-dot" /> Open to work · relocating across the U.S.</p>
          <h1 className="jr-title">Rithvik<br />Illandula</h1>
          <p className="jr-lead">Data · AI · Software Engineer — building reliable, measurable systems across data pipelines, ML, and the services that ship them.</p>
          <HeroNarration />
          <p className="jr-scrollcue">scroll to enter the data world · move to look around ↓</p>
        </section>

        <section ref={set(1)} className="jr-sec">
          <p className="jr-kicker">01 — About</p>
          <h2 className="jr-h2">4+ years turning messy data into decisions.</h2>
          <p className="jr-lead">Across Deloitte, WAFU Technologies, and the University at Buffalo. Three CS degrees. I work the whole stack — SQL &amp; pipelines underneath, ML &amp; LLM systems on top.</p>
        </section>

        <section ref={set(2)} className="jr-sec">
          <p className="jr-kicker">02 — Skills</p>
          <h2 className="jr-h2">The stack I build with.</h2>
          <div className="jr-chips">{SK.map(s => <span key={s} className="jr-chip">{s}</span>)}</div>
        </section>

        <section ref={set(3)} className="jr-sec jr-sec-work">
          <p className="jr-kicker">03 — Work</p>
          <ProjectShowcase />
        </section>

        <section ref={set(4)} className="jr-sec">
          <p className="jr-kicker">04 — Impact</p>
          <h2 className="jr-h2">By the numbers.</h2>
          <div className="jr-stats">
            <div><span>1M+</span>records</div><div><span>80%</span>less review</div>
            <div><span>71%</span>faster pipeline</div><div><span>25+</span>datasets</div>
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

      <div ref={scrollRef} className="jr-scroller"><div style={{ height: '700vh' }} /></div>

      <style jsx>{`
        .jr-canvas { position: fixed; inset: 0; z-index: 0; background:
          linear-gradient(180deg, #0a0812 0%, #0b0810 42%, #14100c 78%, #1c130a 100%); }
        .jr-scroller { position: fixed; inset: 0; z-index: 1; overflow-y: scroll; overscroll-behavior: none; cursor: none; }
        .jr-overlays { position: fixed; inset: 0; z-index: 2; pointer-events: none; }
        .jr-overlays a, .jr-overlays button { pointer-events: auto; }

        /* custom cursor */
        .jr-cur, .jr-cur-ring { position: fixed; top: 0; left: 0; z-index: 60; pointer-events: none; will-change: transform; }
        .jr-cur { width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 9999px; background: #ff7a2f; }
        .jr-cur-ring { width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 9999px;
          border: 1px solid rgba(255,176,97,0.6); transition: width .2s, height .2s, margin .2s, border-color .2s; }
        .jr-cur-ring.hot { width: 76px; height: 76px; margin: -38px 0 0 -38px; border-color: #ff7a2f; background: rgba(255,122,47,0.08); }
        .jr-cur-label { position: absolute; left: 50%; top: calc(100% + 6px); transform: translateX(-50%); white-space: nowrap;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.04em; color: #ffb061; opacity: 0; transition: opacity .2s; }
        @media (pointer: coarse) { .jr-cur, .jr-cur-ring { display: none; } .jr-scroller { cursor: auto; } }

        /* waypoint rail */
        .jr-rail { position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%); z-index: 40;
          display: flex; flex-direction: column; gap: 0.9rem; }
        .jr-rail-dot { position: relative; width: 11px; height: 11px; border-radius: 9999px; border: 1px solid rgba(255,176,97,0.5);
          background: transparent; cursor: pointer; padding: 0; transition: all .25s; }
        .jr-rail-dot[data-active="1"] { background: #ff7a2f; border-color: #ff7a2f; box-shadow: 0 0 12px rgba(255,122,47,0.8); transform: scale(1.25); }
        .jr-rail-label { position: absolute; right: calc(100% + 0.7rem); top: 50%; transform: translateY(-50%); white-space: nowrap;
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(244,239,233,0.55); opacity: 0; transition: opacity .2s; }
        .jr-rail-dot:hover .jr-rail-label, .jr-rail-dot[data-active="1"] .jr-rail-label { opacity: 1; color: #ffb061; }
        @media (max-width: 640px) { .jr-rail { right: 0.7rem; gap: 0.7rem; } .jr-rail-label { display: none; } }

        .jr-sec { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
          padding: 0 8vw; max-width: 760px; color: #f4efe9; opacity: 0; will-change: opacity, transform; }
        .jr-kicker { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: #ffb061; font-weight: 700; margin-bottom: 1.2rem; }
        .jr-dot { width: 7px; height: 7px; border-radius: 9999px; background: #36d399; box-shadow: 0 0 8px #36d399; }
        .jr-title { font-size: clamp(3rem, 9vw, 7rem); font-weight: 800; line-height: 0.92; letter-spacing: -0.02em;
          background: linear-gradient(180deg, #fff6ec, #ffd9a8 55%, #ff944d 130%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .jr-h2 { font-size: clamp(1.8rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.01em; margin-bottom: 1rem; }
        .jr-lead { font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.6; color: rgba(244,239,233,0.8); max-width: 32rem; }
        .jr-hint { font-size: 0.8rem; color: #ffb061; margin-bottom: 1rem; }
        .jr-scrollcue { margin-top: 2rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(244,239,233,0.5); }
        .jr-chips { display: flex; flex-wrap: wrap; gap: 0.55rem; max-width: 34rem; }
        .jr-chip { font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 9999px; color: #f4efe9; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,122,47,0.32); transition: all .2s; }
        .jr-chip:hover { border-color: #ff7a2f; color: #ffb061; transform: translateY(-2px); }
        .jr-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; font-size: 1.05rem; }
        .jr-list li { padding-left: 1.1rem; position: relative; color: rgba(244,239,233,0.85); }
        .jr-list li::before { content: '▹'; position: absolute; left: 0; color: #ff7a2f; }
        .jr-list b { color: #fff; }
        .jr-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem 2.6rem; max-width: 28rem; }
        .jr-stats div { display: flex; flex-direction: column; font-size: 0.8rem; color: rgba(244,239,233,0.6); }
        .jr-stats span { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; color: #fff; line-height: 1; }
        .jr-cta { display: flex; gap: 0.8rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .jr-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.4rem; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; border: 0; text-decoration: none; background: linear-gradient(180deg, #ff7a2f, #e85f1a); color: #160b03; transition: transform .2s; }
        .jr-btn:hover { transform: translateY(-2px); }
        .jr-btn.ghost { background: transparent; border: 1px solid rgba(255,122,47,0.5); color: #ffb061; }
        @media (max-width: 640px) { .jr-sec { padding: 0 7vw; } .jr-stats { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </>
  )
}
