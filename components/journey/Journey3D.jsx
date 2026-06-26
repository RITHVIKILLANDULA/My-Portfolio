'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Lenis from 'lenis'
import profile from '@/data/profile.json'
import HeroNarration from '@/components/agent/HeroNarration'
import ProjectShowcase from '@/components/journey/ProjectShowcase'
import RoleCycler from '@/components/visual/RoleCycler'

const AMBER  = new THREE.Color('#6366f1')
const AMBER2 = new THREE.Color('#818cf8')
const INDIGO = new THREE.Color('#4a4a72')
const CYAN   = new THREE.Color('#6366f1')   // Tron data accent

const ZONES = ['Intro', 'About', 'Experience', 'Skills', 'Work', 'Impact', 'Contact']

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
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(dpr); renderer.setSize(W(), H())
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x09090b, 18, 150)
    const camera = new THREE.PerspectiveCamera(64, W() / H(), 0.1, 600)
    const sprite = glowTexture()
    const disp = []
    const GROUND = -4
    const interactive = []   // raycast targets (project monitors)

    /* ── one elegant signature: an undulating indigo DATA-WAVE the camera glides over ── */
    const WX = 150, WZ = 280, WGAP = 1.8
    const wpos = new Float32Array(WX * WZ * 3)
    let wp = 0
    for (let ix = 0; ix < WX; ix++) for (let iz = 0; iz < WZ; iz++) {
      wpos[wp++] = (ix - WX / 2) * WGAP
      wpos[wp++] = GROUND
      wpos[wp++] = 24 - iz * WGAP
    }
    const wgeo = new THREE.BufferGeometry(); wgeo.setAttribute('position', new THREE.BufferAttribute(wpos, 3))
    const wmat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uA: { value: new THREE.Color('#5b60e0') }, uB: { value: new THREE.Color('#a5b0fb') },
        uFog: { value: new THREE.Color('#09090b') }, uNear: { value: 12 }, uFar: { value: 185 },
      },
      vertexShader: `
        uniform float uTime; varying float vH; varying float vF;
        void main(){
          vec3 p = position;
          float h = sin(p.x*0.10 + uTime*0.5)*1.5 + cos(p.z*0.07 + uTime*0.38)*1.5 + sin((p.x+p.z)*0.045 - uTime*0.28)*0.8;
          p.y += h;
          vH = h;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vF = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = 2.4 * (330.0 / max(1.0, -mv.z));
        }`,
      fragmentShader: `
        varying float vH; varying float vF;
        uniform vec3 uA, uB, uFog; uniform float uNear, uFar;
        void main(){
          vec2 c = gl_PointCoord - 0.5; float d = dot(c, c); if (d > 0.25) discard;
          float a = smoothstep(0.25, 0.02, d);
          vec3 col = mix(uA, uB, clamp(vH*0.4 + 0.5, 0.0, 1.0));
          float f = clamp((vF - uNear) / (uFar - uNear), 0.0, 1.0);
          col = mix(col, uFog, f);
          gl_FragColor = vec4(col, a * (1.0 - f) * 0.85);
        }`,
    })
    const wave = new THREE.Points(wgeo, wmat); scene.add(wave); disp.push(wgeo, wmat)

    // soft horizon glow + sparse upper drift (premium, minimal)
    const hgm = new THREE.SpriteMaterial({ map: sprite, color: new THREE.Color('#6366f1'), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    const hg = new THREE.Sprite(hgm); hg.position.set(0, GROUND + 16, -150); hg.scale.set(240, 100, 1); scene.add(hg); disp.push(hgm)
    const dcount = 260, dpos = new Float32Array(dcount * 3)
    for (let i = 0; i < dcount; i++) { dpos[i * 3] = (Math.random() - 0.5) * 190; dpos[i * 3 + 1] = GROUND + 6 + Math.random() * 42; dpos[i * 3 + 2] = 26 - Math.random() * 270 }
    const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
    const dmat = new THREE.PointsMaterial({ size: 0.5, map: sprite, color: new THREE.Color('#a5b0fb'), transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending })
    const drift = new THREE.Points(dgeo, dmat); scene.add(drift); disp.push(dgeo, dmat)

    scene.add(new THREE.AmbientLight(0x2a2a3e, 1.0))
    const trails = [], segs = []   // (legacy refs kept empty)

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
      g.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4a4a72, transparent: true, opacity: 0.22 }))); disp.push(lg)
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
        const m = new THREE.MeshBasicMaterial({ color: s % 3 === 0 ? CYAN : (s % 2 ? INDIGO : AMBER), transparent: true, opacity: 0.32 })
        g.add(new THREE.Mesh(tube, m)); disp.push(tube, m)
        const pm = new THREE.SpriteMaterial({ map: sprite, color: s % 3 === 0 ? CYAN : (s % 2 ? AMBER2 : INDIGO), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }); disp.push(pm)
        const pulse = new THREE.Sprite(pm)
        pulse.scale.setScalar(0.95); g.add(pulse); streams.push({ curve, pulse, off: Math.random(), sp: 0.05 + Math.random() * 0.09 })
      }
      g.userData.streams = streams; scene.add(g); disp.push(g); return g
    }
    /* city */
    function city(zc) {
      const g = new THREE.Group(); g.position.z = zc
      // LOW server-rack blades both sides — reads as a compute cluster, not buildings
      const bg = new THREE.BoxGeometry(3.4, 0.16, 1.9)
      const bm = new THREE.MeshStandardMaterial({ color: 0x131316, emissive: 0x1a1a2e, emissiveIntensity: 0.7, metalness: 0.85, roughness: 0.28 })
      const racks = 13, inst = new THREE.InstancedMesh(bg, bm, racks * 2 * 9), d = new THREE.Object3D(), leds = []
      let k = 0
      for (let r = 0; r < racks; r++) for (const side of [-1, 1]) {
        const x = side * (5.5 + Math.random() * 3.5), z = -r * 5 - 4, stack = 5 + Math.floor(Math.random() * 4)
        for (let b = 0; b < stack; b++) {
          d.position.set(x, GROUND + 0.5 + b * 0.4, z); d.rotation.set(0, side < 0 ? 0.14 : -0.14, 0); d.updateMatrix(); inst.setMatrixAt(k, d.matrix)
          leds.push([x + side * 1.5, GROUND + 0.5 + b * 0.4, z]); k++
        }
      }
      inst.count = k; g.add(inst); disp.push(bg, bm)
      const lp = new Float32Array(leds.length * 3), lc = new Float32Array(leds.length * 3)
      leds.forEach((p, i) => { lp.set(p, i * 3); const r = Math.random(); const c = r < 0.45 ? CYAN : r < 0.72 ? INDIGO : AMBER2; lc.set([c.r, c.g, c.b], i * 3) })
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.BufferAttribute(lp, 3)); lg.setAttribute('color', new THREE.BufferAttribute(lc, 3))
      g.add(new THREE.Points(lg, new THREE.PointsMaterial({ size: 0.17, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))); disp.push(lg)
      // neural lattice floating above the racks
      const nodes = []; for (let i = 0; i < 44; i++) nodes.push(new THREE.Vector3((Math.random() - 0.5) * 9, GROUND + 3 + Math.random() * 8, -14 - Math.random() * 34))
      const npos = new Float32Array(nodes.length * 3); nodes.forEach((v, i) => npos.set([v.x, v.y, v.z], i * 3))
      const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.BufferAttribute(npos, 3))
      g.add(new THREE.Points(ng, new THREE.PointsMaterial({ size: 0.32, map: sprite, color: AMBER2, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))); disp.push(ng)
      const epos = []; for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) if (nodes[i].distanceTo(nodes[j]) < 5.5) epos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
      const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(epos), 3))
      g.add(new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x4a4a72, transparent: true, opacity: 0.26 }))); disp.push(eg)
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
        cx.fillStyle = '#0c0c10'; cx.fillRect(0, 0, 512, 320)
        cx.strokeStyle = 'rgba(99,102,241,0.7)'; cx.lineWidth = 5; cx.strokeRect(7, 7, 498, 306)
        cx.fillStyle = '#818cf8'; cx.font = 'bold 28px Inter, sans-serif'; cx.fillText('PROJECT · CLICK TO ASK', 28, 56)
        cx.fillStyle = '#fff'; cx.font = 'bold 42px Inter, sans-serif'; wrap(cx, String(label), 28, 122, 456, 48)
        cx.strokeStyle = '#6366f1'; cx.lineWidth = 3; cx.beginPath()
        for (let s = 0; s <= 10; s++) cx.lineTo(28 + s * 45, 272 - Math.sin(s + i) * 30 - s * 3); cx.stroke()
        const tex = new THREE.CanvasTexture(cv)
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 4.1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }))
        pl.position.set(px, py, pz); pl.rotation.y = -side * 0.4; pl.userData = { label: String(label), base: 1 }
        g.add(pl); interactive.push(pl); disp.push(pl.geometry, pl.material)
      })
      scene.add(g); disp.push(g); return g
    }
    /* holographic floating stat panels (not obelisks) */
    function monoliths(zc) {
      const g = new THREE.Group(); g.position.z = zc; const rings = []
      const stats = [['1M+', 'records'], ['80%', 'review ↓'], ['71%', 'faster'], ['25+', 'datasets'], ['6', 'sources'], ['15+', 'dashboards']]
      stats.forEach((s, i) => {
        const ang = (i / stats.length) * Math.PI * 2, x = Math.cos(ang) * 8.5, y = GROUND + 4.5 + Math.sin(i * 1.6) * 3, z = -14 - Math.sin(ang) * 7, col = i % 2 ? INDIGO : AMBER
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.035, 12, 50), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.75 }))
        ring.position.set(x, y, z); g.add(ring); rings.push(ring); disp.push(ring.geometry, ring.material)
        const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const cx = cv.getContext('2d')
        cx.textAlign = 'center'; cx.fillStyle = i % 2 ? '#818cf8' : '#818cf8'; cx.font = 'bold 74px Inter, sans-serif'; cx.fillText(s[0], 128, 78)
        cx.fillStyle = 'rgba(237,237,237,0.72)'; cx.font = '600 24px Inter, sans-serif'; cx.fillText(s[1], 128, 120)
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 1.7), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, side: THREE.DoubleSide }))
        pl.position.set(x, y, z); g.add(pl); disp.push(pl.geometry, pl.material)
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: col, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })); glow.position.set(x, y, z); glow.scale.setScalar(3.6); g.add(glow)
      })
      g.userData.rings = rings; scene.add(g); disp.push(g); return g
    }
    /* dock */
    function dock(zc) {
      const g = new THREE.Group(); g.position.z = zc; const rings = []
      for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(5 - i * 1.4, 0.05, 14, 80), new THREE.MeshBasicMaterial({ color: i % 2 ? INDIGO : AMBER, transparent: true, opacity: 0.7 })); r.position.set(0, GROUND + 0.1, -16); r.rotation.x = Math.PI / 2; g.add(r); rings.push(r); disp.push(r.geometry, r.material) }
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: sprite, color: AMBER2, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); core.position.set(0, GROUND + 1.5, -16); core.scale.setScalar(3.5); g.add(core)
      g.userData.rings = rings; scene.add(g); disp.push(g); return g
    }

    /* matrix data-rain columns (background, all zones) */
    function matrixRain() {
      const g = new THREE.Group()
      const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512; const cx = cv.getContext('2d')
      cx.font = '18px monospace'
      for (let c = 0; c < 6; c++) for (let r = 0; r < 26; r++) { cx.fillStyle = `rgba(99,102,241,${Math.random() * 0.8 + 0.1})`; cx.fillText(Math.random() < 0.5 ? '0' : '1', c * 22 + 4, r * 20 + 16) }
      const base = new THREE.CanvasTexture(cv); disp.push(base)
      const spots = [[-28, GROUND + 9, -70], [30, GROUND + 11, -120], [-32, GROUND + 8, -160], [27, GROUND + 10, -34], [-24, GROUND + 9, -210]]
      spots.forEach((p) => {
        const tex = base.clone(); tex.needsUpdate = true; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 3)
        const m = new THREE.Mesh(new THREE.PlaneGeometry(10, 22), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))
        m.position.set(p[0], p[1], p[2]); m.userData.tex = tex; g.add(m); disp.push(m.geometry, m.material)
      })
      g.userData.cols = g.children
      scene.add(g); disp.push(g); return g
    }
    /* floating holographic UI panels (charts/grids) */
    function holoPanels() {
      const g = new THREE.Group()
      const spots = [[-9, GROUND + 6, -88], [10, GROUND + 8, -132], [-7, GROUND + 7, -56], [9, GROUND + 5.5, -200], [-10, GROUND + 9, -176]]
      spots.forEach((p, i) => {
        const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const cx = cv.getContext('2d')
        cx.strokeStyle = 'rgba(99,102,241,0.85)'; cx.lineWidth = 3; cx.strokeRect(4, 4, 248, 152)
        cx.strokeStyle = 'rgba(255,255,255,0.1)'; cx.lineWidth = 1
        for (let x = 24; x < 248; x += 26) { cx.beginPath(); cx.moveTo(x, 8); cx.lineTo(x, 152); cx.stroke() }
        for (let y = 26; y < 152; y += 26) { cx.beginPath(); cx.moveTo(8, y); cx.lineTo(248, y); cx.stroke() }
        cx.strokeStyle = i % 2 ? '#4a4a72' : '#818cf8'; cx.lineWidth = 2.5; cx.beginPath()
        for (let s = 0; s <= 10; s++) cx.lineTo(20 + s * 22, 120 - Math.sin(s + i) * 30 - s * 3); cx.stroke()
        const m = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 2.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }))
        m.position.set(p[0], p[1], p[2]); m.rotation.y = p[0] < 0 ? 0.42 : -0.42; m.userData.baseY = p[1]; m.userData.ph = i * 1.3
        g.add(m); disp.push(m.geometry, m.material)
      })
      g.userData.panels = g.children
      scene.add(g); disp.push(g); return g
    }

    // (zone builders removed — the data-wave is the whole scene now)

    /* camera path */
    const WAY = [
      new THREE.Vector3(0, GROUND + 6, 16), new THREE.Vector3(-4, GROUND + 5, -22), new THREE.Vector3(5, GROUND + 5, -52),
      new THREE.Vector3(-3, GROUND + 6, -88), new THREE.Vector3(4, GROUND + 5, -128), new THREE.Vector3(-3, GROUND + 7, -168),
      new THREE.Vector3(2, GROUND + 5, -206), new THREE.Vector3(0, GROUND + 5, -226),
    ]
    const LOOK = [
      new THREE.Vector3(0, GROUND + 4, -10), new THREE.Vector3(-1, GROUND + 4, -50), new THREE.Vector3(2, GROUND + 4, -82),
      new THREE.Vector3(-1, GROUND + 4, -118), new THREE.Vector3(2, GROUND + 4, -158), new THREE.Vector3(-1, GROUND + 5, -198),
      new THREE.Vector3(1, GROUND + 4, -224), new THREE.Vector3(0, GROUND + 4, -240),
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
      if (lenis) return                      // lenis drives target when active
      const max = scroller.scrollHeight - scroller.clientHeight
      target = max > 0 ? scroller.scrollTop / max : 0
      updateOverlays(); if (reduced) render()
    }
    scroller.addEventListener('scroll', onScroll, { passive: true })

    // buttery smooth scroll → drives the camera + overlays
    let lenis = null
    if (!reduced) {
      try {
        lenis = new Lenis({ wrapper: scroller, content: scroller.firstElementChild, lerp: 0.085, smoothWheel: true })
        lenis.on('scroll', (e) => { target = (typeof e.progress === 'number' ? e.progress : 0); updateOverlays() })
      } catch { lenis = null }
    }

    function updateOverlays() {
      const n = overlayRefs.current.length
      overlayRefs.current.forEach((el, i) => {
        if (!el) return
        const center = i / (n - 1), d = Math.abs(target - center), span = 0.5 / (n - 1)
        const o = Math.max(0, 1 - d / span)
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translateY(${(target - center) * 60}px)`
        el.setAttribute('data-active', o > 0.55 ? '1' : '0')
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
      // magnetic buttons
      document.querySelectorAll('.jr-mag').forEach((b) => {
        const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2
        const dx = e.clientX - cx, dy = e.clientY - cy, dist = Math.hypot(dx, dy)
        b.style.transform = dist < 90 ? `translate(${dx * 0.3}px, ${dy * 0.4}px)` : ''
      })
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
    function gotoFrac(f) {
      const top = f * (scroller.scrollHeight - scroller.clientHeight)
      if (lenis) lenis.scrollTo(top, { duration: 1.4 })
      else scroller.scrollTo({ top, behavior: 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    window.__journeyGoto = gotoFrac

    const clock = new THREE.Clock()
    const _look = new THREE.Vector3(), _cp = new THREE.Vector3(), _riv = new THREE.Vector3()
    let rcCount = 0
    function setCam(p) {
      const c = clamp01(p)
      path.getPointAt(c, _cp); camera.position.copy(_cp)
      camera.position.x += mouse.x * 1.6
      camera.position.y += -mouse.y * 0.9
      lookCurve.getPointAt(c, _look)
      _look.x += mouse.x * 4
      _look.y += -mouse.y * 3
      camera.lookAt(_look)
    }
    function render() { renderer.render(scene, camera) }

    let raf = 0
    function frame(now) {
      raf = requestAnimationFrame(frame)
      if (lenis) lenis.raf(now || performance.now())
      const t = clock.getElapsedTime()
      prog += (target - prog) * 0.045
      mouse.x += (mouse.tx - mouse.x) * 0.06
      mouse.y += (mouse.ty - mouse.y) * 0.06
      setCam(prog)
      camera.position.y += Math.sin(t * 0.6) * 0.16
      camera.rotateZ(Math.sin(t * 0.35) * 0.0035)
      wmat.uniforms.uTime.value = t
      drift.rotation.y = t * 0.01
      render()
    }
    setCam(0); updateOverlays(); render()
    if (!reduced) frame()

    function onResize() { camera.aspect = W() / H(); camera.updateProjectionMatrix(); renderer.setSize(W(), H()); render() }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      if (lenis) lenis.destroy()
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('keydown', onKey)
      renderer.domElement.removeEventListener('click', onClick)
      scroller.removeEventListener('click', onClick)
      scene.traverse((o) => {
        if (o.geometry && o.geometry.dispose) o.geometry.dispose()
        const m = o.material
        if (Array.isArray(m)) m.forEach((x) => { x && x.map && x.map.dispose && x.map.dispose(); x && x.dispose && x.dispose() })
        else if (m) { m.map && m.map.dispose && m.map.dispose(); m.dispose && m.dispose() }
      })
      try { sprite.dispose() } catch {}
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

  // ★ = strongest / role-defining; rest are supporting (rendered quieter)
  const SKILLGROUPS = [
    { label: 'Languages & Core', items: [['Python', 1], ['SQL', 1], ['Java / C++', 0], ['Airflow', 1], ['BigQuery', 1]] },
    { label: 'Data Engineering', items: [['Spark / PySpark', 1], ['Databricks', 0], ['BigQuery ML', 0], ['GCP', 1], ['Data Quality', 1]] },
    { label: 'AI & LLMs', items: [['LangChain', 1], ['RAG', 1], ['Vector DBs / FAISS', 0], ['Vertex AI', 0]] },
    { label: 'ML & BI', items: [['scikit-learn', 0], ['XGBoost', 1], ['MLflow', 0], ['Tableau / Power BI', 0]] },
  ]
  const EXP = [
    { role: 'AI Data Analyst', co: 'University at Buffalo', loc: 'Buffalo, NY', period: 'Feb 2025 — May 2026', star: '2h → 35m nightly runtime',
      bullets: ['Built Python / SQL / Airflow / BigQuery pipelines over 25+ datasets — collect, cleanse, validate, prepare.', 'Defined 5 recurring data-quality controls: completeness, duplicates, schema drift, late files, exceptions.', 'Partitioned BigQuery + tuned SQL — cut nightly processing 2h → 35m with full audit & recovery.'] },
    { role: 'Data Analytics Engineer', co: 'Deloitte', loc: 'India', period: 'Jan 2022 — Dec 2024', star: '80% less manual review',
      bullets: ['Engineered TV/media data from 6 source systems with Python, SQL, Spark, Databricks, Airflow.', 'Shipped 15+ Tableau & Power BI dashboards — audience segments, campaign KPIs, data completeness.', 'Documented 40+ source-to-target mappings + reconciliation rules — 80% less manual review.'] },
    { role: 'Data Analyst', co: 'WAFU Technologies', loc: 'India', period: 'Dec 2020 — Aug 2021', star: '4 client apps',
      bullets: ['Analyzed adtech event / campaign / transaction data across 4 client applications (SQL, Python, NoSQL).', 'Built monitoring over 5 exception categories: mismatches, order issues, rejects, inventory gaps, failures.', 'Modeled 6+ reporting tables + optimized MySQL for agency & campaign reporting.'] },
  ]
  const PROJECTS = [
    { t: 'Customer Churn Prediction', tag: 'Machine Learning', star: 1, d: 'Churn models (Logistic Regression, XGBoost, Random Forest) over 500K+ customer records — surfaced behavioral drivers and shipped a web app exposing churn-risk insights.', tech: 'Python · XGBoost · Random Forest · scikit-learn' },
    { t: 'PDF-Insight RAG Assistant', tag: 'GenAI · LLM', star: 1, d: 'Retrieval-augmented Q&A: PDFs vectorized with OpenAI embeddings into FAISS, answered by Gemini-Pro, orchestrated end-to-end with LangChain.', tech: 'LangChain · FAISS · Gemini · RAG' },
    { t: 'Citi Bike Demand Forecasting', tag: 'Forecasting', star: 0, d: 'End-to-end pipeline forecasting hourly demand with LightGBM over 1M+ trips — 20+ MLflow experiments, 12–15% MAE improvement.', tech: 'LightGBM · MLflow · Pandas' },
    { t: 'Data Quality & Anomaly Pipeline', tag: 'Data Engineering', star: 0, d: 'Profiling rules, statistical thresholds, and anomaly detection flag missing values, duplicates, volume spikes, and abnormal time-series before reporting.', tech: 'Python · SQL · Anomaly Detection' },
    { t: 'BigQuery ML Customer Analytics', tag: 'Cloud · MLOps', star: 0, d: 'GCP analytics pipeline profiling customer behavior with BigQuery ML and Vertex AI, orchestrated with Airflow and PySpark.', tech: 'BigQuery ML · Vertex AI · Airflow' },
  ]
  const IMPACT = [
    ['2h → 35m', 'nightly runtime', 1], ['1M+', 'records modeled', 1], ['80%', 'less manual review', 1],
    ['25+', 'datasets validated', 0], ['6', 'source systems', 0], ['40+', 'source→target maps', 0],
    ['15+', 'dashboards shipped', 0], ['12+', 'projects shipped', 0],
  ]
  const set = (i) => (el) => { overlayRefs.current[i] = el }
  const setRail = (i) => (el) => { railRefs.current[i] = el }

  return (
    <>
      <div ref={mountRef} className="jr-canvas" />
      <div className="jr-grade" aria-hidden="true" />

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
        {/* 0 INTRO */}
        <section ref={set(0)} data-active="0" className="jr-sec">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">★</span> Data · AI · Software Engineer</p>
          <h1 className="jr-title">
            <span className="jr-line" style={{ '--i': 1 }}><i>Rithvik</i></span>
            <span className="jr-line" style={{ '--i': 1.5 }}><i>Illandula</i></span>
          </h1>
          <p className="jr-role" data-r style={{ '--i': 2 }}><RoleCycler /></p>
          <p className="jr-lead" data-r style={{ '--i': 3 }}>I build across the whole stack of modern data &amp; AI — the SQL and pipelines underneath, the ML and LLM systems on top, and the services that ship them.</p>
          <div data-r style={{ '--i': 4 }}><HeroNarration /></div>
          <p className="jr-scrollcue" data-r style={{ '--i': 5 }}>scroll to enter · move to look around ↓</p>
        </section>

        {/* 1 ABOUT */}
        <section ref={set(1)} data-active="0" className="jr-sec">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">01</span> About</p>
          <h2 className="jr-h2"><span className="jr-line" style={{ '--i': 1 }}><i>The whole stack of data &amp; AI.</i></span></h2>
          <p className="jr-lead" data-r style={{ '--i': 2 }}>{profile.bio}</p>
          <div className="jr-facts">
            {profile.stats.map((s, i) => (
              <div key={s.label} className="jr-fact" data-r style={{ '--i': 3 + i }}><b>{s.value}</b><span>{s.label}</span></div>
            ))}
          </div>
        </section>

        {/* 2 EXPERIENCE */}
        <section ref={set(2)} data-active="0" className="jr-sec jr-sec-wide">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">02</span> Experience</p>
          <h2 className="jr-h2"><span className="jr-line" style={{ '--i': 1 }}><i>Where I&apos;ve shipped.</i></span></h2>
          <div className="jr-exp">
            {EXP.map((e, i) => (
              <div key={e.co} className="jr-exp-item" data-r style={{ '--i': 2 + i * 0.6 }}>
                <div className="jr-exp-head">
                  <b>{e.role}</b><span className="jr-exp-co">{e.co}</span>
                  <span className="jr-exp-meta">{e.period} · {e.loc}</span>
                </div>
                <span className="jr-star">★ {e.star}</span>
                <ul>{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        {/* 3 SKILLS */}
        <section ref={set(3)} data-active="0" className="jr-sec">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">03</span> Skills</p>
          <h2 className="jr-h2"><span className="jr-line" style={{ '--i': 1 }}><i>What I build with.</i></span></h2>
          <p className="jr-note" data-r style={{ '--i': 1.6 }}>★ core strengths</p>
          <div className="jr-skills">
            {SKILLGROUPS.map((g, i) => (
              <div key={g.label} className="jr-skill-group" data-r style={{ '--i': 2 + i * 0.5 }}>
                <p className="jr-skill-label"><span className="jr-skill-bar" /> {g.label}</p>
                <p className="jr-skill-items">
                  {g.items.map(([n, st]) => <span key={n} className={st ? 'sk star' : 'sk'}>{st ? '★ ' : ''}{n}</span>)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4 WORK */}
        <section ref={set(4)} data-active="0" className="jr-sec jr-sec-work">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">04</span> Work</p>
          <div data-r style={{ '--i': 1 }}><ProjectShowcase /></div>
        </section>

        {/* 5 IMPACT */}
        <section ref={set(5)} data-active="0" className="jr-sec jr-sec-wide">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">05</span> Impact</p>
          <h2 className="jr-h2"><span className="jr-line" style={{ '--i': 1 }}><i>Measured, not claimed.</i></span></h2>
          <div className="jr-stats">
            {IMPACT.map(([v, l, st], i) => (
              <div key={l} className={st ? 'star' : ''} data-r style={{ '--i': 2 + i * 0.4 }}><span>{v}</span>{l}</div>
            ))}
          </div>
        </section>

        {/* 6 CONTACT */}
        <section ref={set(6)} data-active="0" className="jr-sec">
          <p className="jr-kicker" data-r style={{ '--i': 0 }}><span className="jr-idx">06</span> Contact</p>
          <h2 className="jr-h2"><span className="jr-line" style={{ '--i': 1 }}><i>Let&apos;s build something.</i></span></h2>
          <p className="jr-avail" data-r style={{ '--i': 2 }}><span className="jr-dot" /> Open to work · open to relocation across the U.S.</p>
          <p className="jr-lead" data-r style={{ '--i': 2.4 }}>{profile.email}</p>
          <div className="jr-cta" data-r style={{ '--i': 3 }}>
            <a href={`mailto:${profile.email}`} className="jr-btn jr-mag">Email me</a>
            <button className="jr-btn ghost jr-mag" onClick={() => window.dispatchEvent(new CustomEvent('start-audio-tour'))}>▶ Audio résumé</button>
            <a href="https://github.com/RITHVIKILLANDULA" target="_blank" rel="noopener noreferrer" className="jr-btn ghost jr-mag">GitHub ↗</a>
          </div>
        </section>
      </div>

      <div ref={scrollRef} className="jr-scroller"><div style={{ height: '840vh' }} /></div>

      <style jsx>{`
        .jr-canvas { position: fixed; inset: 0; z-index: 0; background:
          linear-gradient(180deg, #0B0B0F 0%, #09090B 50%, #070709 100%); }
        .jr-scroller { position: fixed; inset: 0; z-index: 1; overflow-y: scroll; overscroll-behavior: none; cursor: none; }
        .jr-overlays { position: fixed; inset: 0; z-index: 2; pointer-events: none; }
        .jr-overlays a, .jr-overlays button { pointer-events: auto; }

        /* custom cursor */
        .jr-cur, .jr-cur-ring { position: fixed; top: 0; left: 0; z-index: 60; pointer-events: none; will-change: transform; }
        .jr-cur { width: 6px; height: 6px; margin: -3px 0 0 -3px; border-radius: 9999px; background: #6366f1; }
        .jr-cur-ring { width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 9999px;
          border: 1px solid rgba(129,140,248,0.6); transition: width .2s, height .2s, margin .2s, border-color .2s; }
        .jr-cur-ring.hot { width: 76px; height: 76px; margin: -38px 0 0 -38px; border-color: #6366f1; background: rgba(99,102,241,0.08); }
        .jr-cur-label { position: absolute; left: 50%; top: calc(100% + 6px); transform: translateX(-50%); white-space: nowrap;
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.04em; color: #818cf8; opacity: 0; transition: opacity .2s; }
        @media (pointer: coarse) { .jr-cur, .jr-cur-ring { display: none; } .jr-scroller { cursor: auto; } }

        /* waypoint rail */
        .jr-rail { position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%); z-index: 40;
          display: flex; flex-direction: column; gap: 0.9rem; }
        .jr-rail-dot { position: relative; width: 11px; height: 11px; border-radius: 9999px; border: 1px solid rgba(129,140,248,0.5);
          background: transparent; cursor: pointer; padding: 0; transition: all .25s; }
        .jr-rail-dot[data-active="1"] { background: #6366f1; border-color: #6366f1; box-shadow: 0 0 12px rgba(99,102,241,0.8); transform: scale(1.25); }
        .jr-rail-label { position: absolute; right: calc(100% + 0.7rem); top: 50%; transform: translateY(-50%); white-space: nowrap;
          font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,237,237,0.55); opacity: 0; transition: opacity .2s; }
        .jr-rail-dot:hover .jr-rail-label, .jr-rail-dot[data-active="1"] .jr-rail-label { opacity: 1; color: #818cf8; }
        @media (max-width: 640px) { .jr-rail { right: 0.7rem; gap: 0.7rem; } .jr-rail-label { display: none; } }

        .jr-sec { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center;
          padding: 0 8vw; max-width: 760px; color: #ededed; opacity: 0; will-change: opacity, transform; }
        .jr-kicker { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.72rem; letter-spacing: 0.18em;
          text-transform: uppercase; color: #818cf8; font-weight: 700; margin-bottom: 1.2rem; }
        .jr-dot { width: 7px; height: 7px; border-radius: 9999px; background: #36d399; box-shadow: 0 0 8px #36d399; }
        .jr-title { font-size: clamp(3rem, 9vw, 7rem); font-weight: 640; line-height: 0.9; letter-spacing: -0.03em;
          color: #EDEDED; text-shadow: 0 2px 40px rgba(0,0,0,0.6); }
        .jr-h2 { font-size: clamp(1.8rem, 4.5vw, 3.4rem); font-weight: 800; line-height: 1.04; letter-spacing: -0.01em; margin-bottom: 1rem; }
        .jr-lead { font-size: clamp(1rem, 1.6vw, 1.2rem); line-height: 1.6; color: rgba(237,237,237,0.8); max-width: 32rem; }
        .jr-role { font-size: clamp(1.2rem, 2.8vw, 1.9rem); font-weight: 700; color: #818cf8; letter-spacing: -0.01em; margin: 0.4rem 0 1rem; min-height: 1.4em; }
        .jr-avail { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; letter-spacing: 0.06em; color: rgba(237,237,237,0.75); margin-bottom: 0.8rem; }
        .jr-hint { font-size: 0.8rem; color: #818cf8; margin-bottom: 1rem; }
        .jr-scrollcue { margin-top: 2rem; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(237,237,237,0.5); }
        .jr-chips { display: flex; flex-wrap: wrap; gap: 0.55rem; max-width: 34rem; }
        .jr-chip { font-size: 0.82rem; padding: 0.45rem 0.9rem; border-radius: 9999px; color: #ededed; background: rgba(255,255,255,0.05); border: 1px solid rgba(99,102,241,0.32); transition: all .2s; }
        .jr-chip:hover { border-color: #6366f1; color: #818cf8; transform: translateY(-2px); }
        .jr-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; font-size: 1.05rem; }
        .jr-list li { padding-left: 1.1rem; position: relative; color: rgba(237,237,237,0.85); }
        .jr-list li::before { content: '▹'; position: absolute; left: 0; color: #6366f1; }
        .jr-list b { color: #fff; }
        .jr-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.4rem 2.6rem; max-width: 28rem; }
        .jr-stats { grid-template-columns: repeat(2, 1fr); max-width: 34rem; }
        .jr-stats div { display: flex; flex-direction: column; font-size: 0.74rem; color: #71717A; }
        .jr-stats span { font-size: clamp(1.7rem, 4vw, 2.7rem); font-weight: 700; color: #A1A1AA; line-height: 1; letter-spacing: -0.02em; }
        .jr-stats .star span { color: #EDEDED; }
        .jr-stats .star::before { content: '★'; color: #818cf8; font-size: 0.7rem; position: absolute; margin-top: -0.6rem; margin-left: -0.9rem; }
        .jr-stats .star { position: relative; }
        .jr-cta { display: flex; gap: 0.8rem; margin-top: 1.6rem; flex-wrap: wrap; }
        .jr-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.7rem 1.4rem; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; border: 0; text-decoration: none; background: linear-gradient(180deg, #6366f1, #4f46e5); color: #ffffff; transition: transform .2s; }
        .jr-btn:hover { transform: translateY(-2px); }
        .jr-btn.ghost { background: transparent; border: 1px solid rgba(99,102,241,0.5); color: #818cf8; }

        /* staged reveal (Scout-style) */
        .jr-sec [data-r] { opacity: 0; transform: translateY(26px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--i,0) * .085s); }
        .jr-sec[data-active="1"] [data-r] { opacity: 1; transform: none; }

        /* numbered section index */
        .jr-idx { font-family: ui-monospace, "SFMono-Regular", monospace; color: #6366f1; margin-right: 0.7rem; position: relative; padding-right: 1.7rem; }
        .jr-idx::after { content: ''; position: absolute; right: 0; top: 50%; width: 1.1rem; height: 1px; background: rgba(99,102,241,0.55); }

        /* about timeline */
        .jr-tl { display: flex; gap: 1.8rem; margin-top: 1.8rem; flex-wrap: wrap; }
        .jr-tl-node { display: flex; flex-direction: column; gap: 0.15rem; position: relative; padding-left: 1.1rem; }
        .jr-tl-dot { position: absolute; left: 0; top: 0.5rem; width: 8px; height: 8px; border-radius: 9999px; background: #6366f1; box-shadow: 0 0 9px rgba(99,102,241,0.9); }
        .jr-tl-node b { color: #fff; font-size: 1.05rem; font-weight: 800; }
        .jr-tl-node span { color: rgba(237,237,237,0.7); font-size: 0.8rem; }
        .jr-tl-node em { color: #818cf8; font-size: 0.72rem; font-style: normal; font-variant-numeric: tabular-nums; letter-spacing: 0.04em; }

        /* skills groups */
        .jr-skills { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem 2.6rem; max-width: 42rem; margin-top: 1.5rem; }
        .jr-skill-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.13em; color: #818cf8; font-weight: 700; margin-bottom: 0.45rem; }
        .jr-skill-bar { width: 16px; height: 2px; background: #6366f1; }
        .jr-skill-items { font-size: 0.92rem; color: #71717A; line-height: 1.9; }
        .jr-skill-items .sk { display: inline-block; margin-right: 0.95rem; }
        .jr-skill-items .sk.star { color: #EDEDED; font-weight: 600; }

        .jr-sec-wide { max-width: 880px; }
        .jr-note { font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: #818cf8; margin: 0.2rem 0 0.9rem; }

        .jr-facts { display: flex; gap: 2.6rem; margin-top: 1.7rem; }
        .jr-fact { display: flex; flex-direction: column; }
        .jr-fact b { font-size: clamp(1.6rem, 3.5vw, 2.4rem); font-weight: 700; color: #EDEDED; line-height: 1; }
        .jr-fact span { font-size: 0.72rem; color: #71717A; margin-top: 0.35rem; letter-spacing: 0.04em; }

        .jr-exp { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; max-width: 60ch; }
        .jr-exp-item { padding-left: 1rem; border-left: 1px solid #27272A; }
        .jr-exp-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem; }
        .jr-exp-head b { color: #EDEDED; font-size: 1.05rem; font-weight: 650; }
        .jr-exp-co { color: #818cf8; font-size: 0.9rem; font-weight: 600; }
        .jr-exp-meta { color: #71717A; font-size: 0.72rem; font-variant-numeric: tabular-nums; margin-left: auto; }
        .jr-star { display: inline-block; margin: 0.45rem 0 0.55rem; font-size: 0.72rem; font-weight: 700; color: #818cf8;
          background: rgba(99,102,241,0.10); border: 1px solid rgba(99,102,241,0.32); border-radius: 9999px; padding: 0.2rem 0.65rem; }
        .jr-exp-item ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.35rem; }
        .jr-exp-item li { color: #A1A1AA; font-size: 0.85rem; line-height: 1.5; padding-left: 0.95rem; position: relative; }
        .jr-exp-item li::before { content: '—'; position: absolute; left: 0; color: #52525B; }

        .jr-sec p, .jr-sec li, .jr-sec b, .jr-skill-items { text-shadow: 0 1px 18px rgba(0,0,0,0.55); }

        /* line-mask title reveal (Scout/editorial signature) */
        .jr-line { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .jr-line i { display: block; font-style: normal; transform: translateY(112%);
          transition: transform .95s cubic-bezier(.16,1,.3,1); transition-delay: calc(var(--i,0) * .09s); }
        .jr-sec[data-active="1"] .jr-line i { transform: none; }

        /* filmic grade: vignette + grain */
        .jr-grade { position: fixed; inset: 0; z-index: 1; pointer-events: none;
          background:
            repeating-linear-gradient(0deg, rgba(99,102,241,0.022) 0 1px, transparent 1px 3px),
            radial-gradient(120% 100% at 50% 32%, transparent 50%, rgba(4,3,8,0.62) 100%);
          animation: jrFlicker 6s steps(50) infinite; }
        @keyframes jrFlicker { 0%,100% { opacity: 1; } 48% { opacity: 0.97; } 50% { opacity: 0.93; } 52% { opacity: 0.99; } }
        @media (prefers-reduced-motion: reduce) { .jr-grade { animation: none; } }
        .jr-grade::after { content: ''; position: absolute; inset: 0; opacity: 0.05; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        @media (max-width: 640px) { .jr-sec { padding: 0 7vw; } .jr-stats { grid-template-columns: 1fr 1fr; } .jr-skills { grid-template-columns: 1fr; gap: 1.1rem; } .jr-tl { gap: 1.1rem; } }
        @media (prefers-reduced-motion: reduce) { .jr-sec [data-r] { transition: none; opacity: 1; transform: none; } }
      `}</style>
    </>
  )
}
