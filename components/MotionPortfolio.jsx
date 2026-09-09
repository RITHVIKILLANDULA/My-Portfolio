'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import profile from '@/data/profile.json'
import { RESUME, GH, LI, EMAIL, EXP, SKILLGROUPS, PROJECTS, CATEGORIES, IMPACT, NAV } from '@/data/portfolio-content'
import CommandPalette from '@/components/CommandPalette'
import PosterHero from '@/components/cine/PosterHero'
import ThreadSpine from '@/components/pipeline/DagRail'
import Warehouse from '@/components/pipeline/Warehouse'
import { start as telemetryStart, sectionEnter, sectionExit, track, onEvent, getSessionId } from '@/lib/telemetry'

/* ── Cinematic monochrome (cappen-language) ────────────────────────────────
   Near-white ground, charcoal bands, huge grotesque statements with serif
   italic contrast words, Martian Mono microlabels, scroll theatre.
   Concept mechanics stay: telemetry, ledger, warehouse, agent.            */

// live visitor ledger — minimal mono block
function Ledger() {
  const [rows, setRows] = useState(null)
  const [, force] = useState(0)
  useEffect(() => {
    let visits = 1
    try {
      visits = parseInt(localStorage.getItem('ri07_reads') || '0', 10) + 1
      localStorage.setItem('ri07_reads', String(visits))
    } catch {}
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const device = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
    setRows({ visits, tz, device })
    const iv = setInterval(() => force((t) => t + 1), 1000)
    return () => clearInterval(iv)
  }, [])
  const [events, setEvents] = useState(0)
  const [depth, setDepth] = useState(0)
  useEffect(() => onEvent((row) => {
    setEvents((e) => e + 1)
    if (row.event === 'scroll_depth') setDepth(row.value || 0)
  }), [])
  if (!rows) return <div className="ledger" aria-hidden="true"><p className="ledger-head">VISITOR LEDGER</p></div>
  const secs = Math.floor(performance.now() / 1000)
  const LINES = [
    ['reader', `Nº ${String(rows.visits).padStart(3, '0')}`],
    ['session', getSessionId()],
    ['device', rows.device],
    ['timezone', rows.tz],
    ['time_on_page', `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`],
    ['scroll_depth', `${depth}%`],
    ['events', String(events)],
  ]
  return (
    <div className="ledger" aria-label="Your live visitor ledger">
      <p className="ledger-head">VISITOR LEDGER <span className="ledger-live"><i />LIVE</span></p>
      {LINES.map(([k, v]) => (
        <p className="ledger-row" key={k}><span className="lk">{k}</span><span className="ldots" aria-hidden="true" /><span className="lv">{v}</span></p>
      ))}
      <p className="ledger-note">you are being ingested — query yourself at the warehouse ↓</p>
    </div>
  )
}

function CountUp({ value }) {
  const m = String(value).match(/^(\d+)(.*)$/)
  const target = m ? parseInt(m[1], 10) : 0
  const suffix = m ? m[2] : String(value)
  const [n, setN] = useState(m ? 0 : null)
  const ref = useRef(null)
  useEffect(() => {
    if (!m) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(target); return }
    const el = ref.current
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const dur = 1100, start = performance.now()
      const iv = setInterval(() => {
        const p = Math.min(1, (performance.now() - start) / dur)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p >= 1) clearInterval(iv)
      }, 24)
    }, { threshold: 0.5 })
    if (el) io.observe(el)
    return () => io.disconnect()
  }, []) // eslint-disable-line
  return <span ref={ref}>{n === null ? value : `${n}${suffix}`}</span>
}

export default function MotionPortfolio() {
  const [active, setActive] = useState(null)
  const [cat, setCat] = useState('agentic')
  const rootRef = useRef(null)
  const modalRef = useRef(null)

  // modal: Esc, Lenis pause, focus trap
  useEffect(() => {
    if (!active) return
    const prevFocus = document.activeElement
    window.__lenis?.stop()
    const card = modalRef.current
    card?.querySelector('.cs-x')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { setActive(null); return }
      if (e.key !== 'Tab' || !card) return
      const f = card.querySelectorAll('button, a[href]')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.__lenis?.start()
      if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
  }, [active])

  // reveals: rise + clip
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('set'); io.unobserve(e.target) } })
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    document.querySelectorAll('.rise').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // telemetry
  useEffect(() => {
    telemetryStart()
    const ids = ['top', 'about', 'experience', 'projects', 'skills', 'warehouse', 'contact']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { e.isIntersecting ? sectionEnter(e.target.id) : sectionExit(e.target.id) })
    }, { rootMargin: '-30% 0px -45% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // scroll theatre — the cappen feel: parallax layers, sheet curtains,
  // velocity skew, scroll-scrubbed exits. All gated on motion preference.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const lenis = window.__lenis
    const sync = () => ScrollTrigger.update()
    if (lenis) lenis.on('scroll', sync)

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // hero statement drifts apart + sinks as you leave (opposing lanes)
        gsap.to('.st-mask:first-child .st-line', {
          xPercent: -5, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 0.7 },
        })
        gsap.to('.st-mask:last-child .st-line', {
          xPercent: 4, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: 0.7 },
        })
        gsap.to('.hero-low, .hero-meta', {
          yPercent: -14, opacity: 0.3, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: 0.7 },
        })

        // charcoal bands slide over like sheets
        gsap.utils.toArray('.band').forEach((band) => {
          gsap.fromTo(band, { yPercent: 5, scale: 0.985 }, {
            yPercent: 0, scale: 1, ease: 'none',
            scrollTrigger: { trigger: band, start: 'top 96%', end: 'top 42%', scrub: 0.6 },
          })
          const inner = band.querySelector('.band-inner')
          if (inner) gsap.fromTo(inner, { yPercent: 7 }, {
            yPercent: 0, ease: 'none',
            scrollTrigger: { trigger: band, start: 'top 96%', end: 'top 30%', scrub: 0.6 },
          })
        })

        // portrait parallax inside the about band
        gsap.fromTo('.band-fig', { yPercent: 10 }, {
          yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: '.band-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        })

        // giant LET'S talk sets itself as it arrives
        gsap.fromTo('.talk', { yPercent: 24, scale: 0.94 }, {
          yPercent: 0, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.sec.last', start: 'top 90%', end: 'top 30%', scrub: 0.6 },
        })

        // velocity skew — type leans with scroll momentum (the silk tell)
        const skewTargets = ['.statement', '.work-t', '.talk', '.sec-title', '.band-state']
        const setters = skewTargets.map((s) => gsap.quickTo(s, 'skewY', { duration: 0.4, ease: 'power2.out' }))
        let unsub = null
        if (lenis) {
          const onVel = () => {
            const v = gsap.utils.clamp(-6, 6, (lenis.velocity || 0) * 0.5)
            setters.forEach((set) => set(v * 0.14))
          }
          lenis.on('scroll', onVel)
          unsub = () => lenis.off('scroll', onVel)
        }
        return () => { if (unsub) unsub() }
      })
    }, rootRef)

    const t = setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => { clearTimeout(t); if (lenis) lenis.off('scroll', sync); ctx.revert() }
  }, [])

  // the masthead sits over the poster: transparent + light there, solid after
  const [onPoster, setOnPoster] = useState(true)
  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return setOnPoster(false)
    const io = new IntersectionObserver(([e]) => setOnPoster(e.intersectionRatio > 0.25), {
      threshold: [0, 0.25, 1],
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  // the poster must run to the very top edge; the sticky masthead otherwise
  // reserves flow space above it and the page ground shows through
  useEffect(() => {
    const mast = rootRef.current?.querySelector('.mast')
    if (!mast) return
    const apply = () => rootRef.current?.style.setProperty('--mast-h', `${mast.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(mast)
    return () => ro.disconnect()
  }, [])

  const jump = (id) => (e) => {
    e.preventDefault()
    const el = document.getElementById(id); if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -8, duration: 1.1 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="site" ref={rootRef}>
      <ThreadSpine />

      {/* MASTHEAD */}
      <header className={`mast ${onPoster ? "on-poster" : ""}`}>
        <a href="#top" className="wordmark" onClick={jump('top')}>RITHVIK ILLANDULA<span className="wm-sub">DATA & AI ENGINEER</span></a>
        <nav className="menu">
          {NAV.map(([l, id]) => <a key={id} href={`#${id}`} onClick={jump(id)}>{l}</a>)}
        </nav>
        <div className="mast-cta">
          <CommandPalette />
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn-ink">RÉSUMÉ</a>
        </div>
      </header>

      {/* HERO — the poster */}
      <PosterHero onJump={jump} />

      {/* ABOUT — charcoal statement band */}
      <section id="about" className="band">
        <div className="band-inner">
          <p className="micro gray rise">01 — WHO</p>
          <h2 className="band-state rise">Four years turning <em>messy, heavy, real-world data</em> into
            systems people trust — at Deloitte scale and startup speed<em className="pd">.</em></h2>
          <div className="band-grid">
            <div className="rise band-fig">
              <Ledger />
              <p className="micro gray band-fig-cap">YOUR SESSION — CAPTURED IN YOUR BROWSER, NEVER SENT ANYWHERE</p>
            </div>
            <div className="band-copy rise">
              <p>{profile.bio}</p>
              <p className="gray">Certified: Google Cloud Professional Data Engineer · Microsoft PL-300 &amp; DP-700 · Tableau Desktop.
                Currently finishing an M.S. in Computer Science at the University at Buffalo — the third CS degree.</p>
              <div className="band-stats">
                {IMPACT.slice(0, 3).map(([v, l]) => (
                  <div key={l}><b><CountUp value={v} /></b><span className="micro gray">{l.toUpperCase()}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="sec">
        <div className="sec-head">
          <p className="micro rise">02 — EXPERIENCE</p>
          <h2 className="sec-title rise">Where it <em>shipped</em></h2>
        </div>
        {EXP.map((e, i) => (
          <article className="xp rise" key={e.co}>
            <span className="xp-n">{String(i + 1).padStart(2, '0')}</span>
            <div className="xp-main">
              <h3>{e.co} <em>— {e.role}</em></h3>
              <p className="micro gray">{e.period} · {e.loc}</p>
              <ul>{e.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
              <p className="micro stack">{e.tech.join(' / ').toUpperCase()}</p>
            </div>
            <p className="xp-star"><em>{e.star}</em></p>
          </article>
        ))}
      </section>

      {/* WORKS — cinematic rows */}
      <section id="projects" className="sec">
        <div className="sec-head">
          <p className="micro rise">03 — SELECTED WORKS ({PROJECTS.length})</p>
          <h2 className="sec-title rise">Built, measured, <em>shipped</em></h2>
        </div>
        <div className="cats rise" role="tablist" aria-label="Project categories">
          {CATEGORIES.map((c) => {
            const n = PROJECTS.filter((p) => p.cat === c.key).length
            return (
              <button key={c.key} type="button" role="tab" aria-selected={cat === c.key}
                className={`catpill ${cat === c.key ? 'on' : ''}`}
                onClick={() => { setCat(c.key); track('project_filter', c.key) }}>
                {c.label}<span className="catn">{n}</span>
              </button>
            )
          })}
        </div>
        <p className="cat-blurb rise">{CATEGORIES.find((c) => c.key === cat)?.blurb}</p>
        <div className="works">
          {PROJECTS.filter((p) => p.cat === cat).map((p, i) => (
            <button key={p.t} type="button" className="work" onClick={() => { track('case_study_open', p.t); setActive(p) }} aria-label={`Open case study: ${p.t}`}>
              <span className="work-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-t">{p.t}</span>
              <span className="work-tag"><em>{p.tag}</em></span>
              <span className="work-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="skills" className="sec">
        <div className="sec-head">
          <p className="micro rise">04 — CAPABILITIES</p>
          <h2 className="sec-title rise">The <em>toolkit</em></h2>
        </div>
        <div className="caps">
          {SKILLGROUPS.map((g) => (
            <div className="cap rise" key={g.label}>
              <p className="micro gray">{g.label.toUpperCase()}</p>
              <p className="cap-list">
                {g.items.map(([n, s]) => <span key={n} className={s ? 'core' : 'aux'}>{n}</span>)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WAREHOUSE — ink band */}
      <section id="warehouse" className="band deep">
        <div className="band-inner">
          <p className="micro gray rise">05 — THE WAREHOUSE</p>
          <h2 className="band-state rise">You scrolled. We logged. <em>Now query yourself</em><em className="pd">.</em></h2>
          <p className="wh-lead rise">Your whole visit lives in <code className="wh-code">visit.events</code> — next to my career tables.
            Real SQL in your browser, or flip to AGENT and ask in plain English.</p>
          <div className="rise"><Warehouse /></div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="sec last">
        <p className="micro rise">06 — CONTACT</p>
        <h2 className="talk rise">
          <span className="st-line">LET&apos;S</span>
          <span className="st-line"><em>talk</em><em className="pd">.</em></span>
        </h2>
        <div className="hero-ctas rise">
          <a href={`mailto:${EMAIL}`} className="btn-ink big">{EMAIL}</a>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn-line">RÉSUMÉ (PDF)</a>
          <a href={GH} target="_blank" rel="noopener noreferrer" className="btn-line">GITHUB</a>
          <a href={LI} target="_blank" rel="noopener noreferrer" className="btn-line">LINKEDIN</a>
        </div>
        <footer className="foot micro gray">
          <span>© 2026 RITHVIK ILLANDULA</span>
          <span>SET IN ARCHIVO · INSTRUMENT SERIF · MARTIAN MONO</span>
          <span>YOUR DATA NEVER LEFT THIS PAGE</span>
        </footer>
      </section>

      {/* CASE STUDY */}
      {active && (
        <div className="cs-wrap" role="dialog" aria-modal="true" aria-label={active.t} onClick={() => setActive(null)}>
          <div className="cs-card" ref={modalRef} data-lenis-prevent onClick={(e) => e.stopPropagation()}>
            <button className="cs-x" onClick={() => setActive(null)} aria-label="Close case study">✕</button>
            <p className="micro">CASE STUDY — {active.tag.toUpperCase()}</p>
            <h3 className="cs-title">{active.t}</h3>
            <p className="cs-problem"><em>{active.cs.problem}</em></p>
            <p className="micro gray cs-h">WHAT WAS BUILT</p>
            <ul className="cs-build">{active.cs.build.map((b, i) => <li key={i}>{b}</li>)}</ul>
            <div className="cs-metrics">
              {active.cs.metrics.map(([v, l]) => <p key={l}><span>{l}</span><span className="ldots" aria-hidden="true" /><b>{v}</b></p>)}
            </div>
            <p className="micro gray">{active.tech.join(' / ').toUpperCase()}</p>
            <div className="cs-cta">
              <a href={active.link} target="_blank" rel="noopener noreferrer" className="btn-line">GITHUB ↗</a>
              {active.demo && <a href={active.demo} target="_blank" rel="noopener noreferrer" className="btn-line" onClick={() => track('open_demo', active.t)}>LIVE DEMO ↗</a>}
              <button type="button" className="btn-ink" onClick={() => { const t = active.t; setActive(null); track('ask_agent', t); window.dispatchEvent(new CustomEvent('journey-ask', { detail: `Tell me more about the ${t} project` })) }}>ASK THE AGENT</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .site { background: var(--paper); color: var(--ink); }
        em { font-family: var(--serif); font-style: italic; font-weight: 400; letter-spacing: 0; }
        .micro { font-family: var(--mono); font-size: 0.6rem; font-weight: 400; letter-spacing: 0.18em; }
        .gray { color: var(--graphite); }
        .pd { font-style: normal; }

        /* masthead */
        .mast { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
          gap: 1rem; padding: 0.9rem clamp(1rem, 4vw, 3.5rem); background: rgba(252,252,252,0.92); border-bottom: 1px solid var(--rule);
          transition: background .45s ease, border-color .45s ease, color .45s ease; }
        .mast.on-poster { background: transparent; border-bottom-color: transparent; color: var(--paper); }
        .mast.on-poster .wm-sub { color: rgba(252,252,252,0.55); }
        .mast.on-poster .menu a { color: rgba(252,252,252,0.72); }
        .mast.on-poster .menu a:hover { color: var(--paper); }
        .mast.on-poster :global(.btn-ink) { background: var(--paper); color: var(--ink); border-color: var(--paper); }
        .mast.on-poster :global(.btn-ink:hover) { background: transparent; color: var(--paper); }
        .mast.on-poster :global(.cmdk-trigger) { border-color: rgba(252,252,252,0.4); color: rgba(252,252,252,0.8); }
        .mast.on-poster :global(.cmdk-trigger:hover) { border-color: var(--paper); background: rgba(252,252,252,0.08); }
        .wordmark { display: flex; flex-direction: column; font-family: var(--sans); font-stretch: 116%; font-weight: 700;
          font-size: 0.78rem; letter-spacing: 0.08em; line-height: 1.2; }
        .wm-sub { font-family: var(--mono); font-weight: 300; font-size: 0.5rem; letter-spacing: 0.24em; color: var(--graphite); }
        .menu { display: flex; gap: 1.6rem; }
        .menu a { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--graphite);
          transition: color .18s; }
        .menu a:hover { color: var(--ink); }
        .mast-cta { display: flex; align-items: center; gap: 0.6rem; }
        @media (max-width: 820px) { .menu { display: none; } }

        .btn-ink { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--ink); color: var(--paper);
          font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.16em; padding: 0.65rem 1.15rem; border: 1px solid var(--ink);
          border-radius: 999px; cursor: pointer; transition: all .2s; }
        .btn-ink:hover { background: transparent; color: var(--ink); }
        .btn-ink.big { font-size: 0.66rem; padding: 0.85rem 1.5rem; }
        .btn-line { display: inline-flex; align-items: center; gap: 0.4rem; background: transparent; color: var(--ink);
          font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.16em; padding: 0.65rem 1.15rem;
          border: 1px solid var(--ink); border-radius: 999px; cursor: pointer; transition: all .2s; }
        .btn-line:hover { background: var(--ink); color: var(--paper); }
        .soc { font-size: 1rem; color: var(--graphite); padding: 0.4rem; }
        .soc:hover { color: var(--ink); }

        /* hero */
        .hero { min-height: calc(100svh - 57px); display: flex; flex-direction: column; justify-content: space-between;
          max-width: 1500px; margin: 0 auto; padding: clamp(1.2rem, 3vw, 2.4rem) clamp(1rem, 4vw, 3.5rem) 1.4rem; }
        .hero-meta { display: flex; justify-content: space-between; gap: 1rem; color: var(--graphite); }
        .dot { display: inline-block; width: 7px; height: 7px; border-radius: 999px; background: var(--live); margin-right: 0.4rem;
          animation: pulse 2.4s ease-in-out infinite; vertical-align: 1px; }
        @keyframes pulse { 50% { opacity: 0.35; } }
        .statement { font-family: var(--sans); font-stretch: 124%; font-weight: 640; text-transform: uppercase;
          font-size: clamp(2.9rem, 10.8vw, 10.4rem); line-height: 0.94; letter-spacing: -0.022em; margin: 1.6rem 0; }
        .st-mask { display: block; overflow: hidden; padding-bottom: 0.06em; margin-bottom: -0.06em; }
        .st-line { display: block; }
        .st-in { transform: translateY(112%); animation: st-up 1.15s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .st-mask:last-child .st-in { animation-delay: 0.12s; }
        @keyframes st-up { to { transform: translateY(0); } }
        .statement em, .talk em { font-family: var(--serif); font-style: italic; font-weight: 400; text-transform: lowercase;
          font-size: 1.04em; letter-spacing: -0.01em; }
        .hero-low { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(280px, 1fr); gap: clamp(1.5rem, 4vw, 4rem); align-items: end; }
        @media (max-width: 900px) { .hero-low { grid-template-columns: 1fr; } }
        .lead { font-family: var(--sans); font-size: clamp(0.98rem, 1.4vw, 1.18rem); line-height: 1.6; max-width: 52ch; }
        .lead em { font-size: 1.05em; }
        .hero-ctas { display: flex; flex-wrap: wrap; align-items: center; gap: 0.7rem; margin-top: 1.6rem; }
        .cue { text-align: center; color: var(--graphite); margin-top: 1.6rem; animation: cue 2.6s ease-in-out infinite; }
        @keyframes cue { 50% { opacity: 0.35; } }

        /* charcoal bands — sheets that slide over the page */
        .band { background: var(--ink); color: var(--paper); border-radius: 22px 22px 0 0; overflow: hidden;
          will-change: transform; }
        .band.deep { background: #0D0E10; }
        .band-inner { max-width: 1500px; margin: 0 auto; padding: clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 3.5rem); }
        .band-state { font-family: var(--sans); font-stretch: 112%; font-weight: 560; font-size: clamp(1.6rem, 3.6vw, 3.2rem);
          line-height: 1.14; letter-spacing: -0.015em; max-width: 26ch; margin: 1.2rem 0 2.6rem; }
        .band-state em { color: var(--signal-soft); }
        .band-grid { display: grid; grid-template-columns: minmax(220px, 300px) 1fr; gap: clamp(1.5rem, 4vw, 4rem); align-items: start; }
        @media (max-width: 820px) { .band-grid { grid-template-columns: 1fr; } .band-fig { max-width: 260px; } }
        .band-fig { margin: 0; }
        .band-fig :global(.portrait) { width: 100%; height: auto; display: block; filter: grayscale(1) contrast(1.1); }
        .band-fig figcaption, .band-fig .band-fig-cap { margin-top: 0.6rem; line-height: 1.6; }
        .band-copy p { font-family: var(--sans); font-size: 0.98rem; line-height: 1.7; max-width: 60ch; margin-bottom: 1rem; color: rgba(252,252,252,0.88); }
        .band-copy p.gray { color: var(--graphite); font-size: 0.88rem; }
        .band-stats { display: flex; flex-wrap: wrap; gap: 2rem 3rem; margin-top: 1.8rem; }
        .band-stats b { display: block; font-family: var(--sans); font-stretch: 116%; font-weight: 620; font-size: clamp(1.8rem, 3.4vw, 2.8rem); line-height: 1; }
        .band-stats span { display: block; margin-top: 0.3rem; }

        /* sections */
        .sec { max-width: 1500px; margin: 0 auto; padding: clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 3.5rem) clamp(2rem, 4vw, 3.5rem); }
        .sec-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--ink);
          padding-bottom: 1rem; margin-bottom: 0; flex-wrap: wrap; }
        .sec-title { font-family: var(--sans); font-stretch: 120%; font-weight: 620; text-transform: uppercase;
          font-size: clamp(1.5rem, 3.4vw, 2.7rem); letter-spacing: -0.01em; }
        .sec-title em { text-transform: lowercase; }

        /* experience */
        .xp { display: grid; grid-template-columns: 60px 1fr 220px; gap: 1.6rem; padding: 2rem 0; border-bottom: 1px solid var(--rule); }
        @media (max-width: 820px) { .xp { grid-template-columns: 40px 1fr; } .xp-star { grid-column: 2; } }
        .xp-n { font-family: var(--mono); font-size: 0.66rem; color: var(--graphite); padding-top: 0.4rem; }
        .xp-main h3 { font-family: var(--sans); font-stretch: 116%; font-weight: 640; text-transform: uppercase; font-size: 1.15rem; letter-spacing: 0.01em; }
        .xp-main h3 em { text-transform: none; font-size: 1.15em; }
        .xp-main .micro { margin: 0.3rem 0 0.9rem; }
        .xp-main ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.45rem; }
        .xp-main li { font-family: var(--sans); font-size: 0.92rem; line-height: 1.6; max-width: 68ch; padding-left: 1rem; position: relative; }
        .xp-main li::before { content: '—'; position: absolute; left: 0; color: var(--graphite); }
        .stack { margin-top: 0.9rem; color: var(--graphite); }
        .xp-star { font-family: var(--serif); font-style: italic; font-size: 1.35rem; line-height: 1.3; text-align: right; }
        @media (max-width: 820px) { .xp-star { text-align: left; font-size: 1.15rem; } }

        /* works rows */
        .works { display: flex; flex-direction: column; }
        .works :global(.work) { display: grid; grid-template-columns: 70px 1fr auto 50px; align-items: center; gap: 1rem;
          width: 100%; text-align: left; padding: 1.6rem 0.4rem; background: transparent; border: 0; border-bottom: 1px solid var(--rule);
          cursor: pointer; color: var(--ink); transition: background .2s, padding .25s; }
        .works :global(.work:hover) { background: var(--ink); color: var(--paper); padding-left: 1.2rem; }
        .work-n { font-family: var(--mono); font-size: 0.66rem; color: var(--graphite); }
        .work-t { font-family: var(--sans); font-stretch: 120%; font-weight: 620; text-transform: uppercase;
          font-size: clamp(1.25rem, 3.2vw, 2.5rem); letter-spacing: -0.01em; line-height: 1.05; }
        .work-tag { font-family: var(--serif); font-style: italic; font-size: 1.05rem; color: var(--graphite); white-space: nowrap; }
        .works :global(.work:hover) .work-tag { color: var(--signal-soft); }
        .work-arrow { font-size: 1.3rem; justify-self: end; transition: transform .25s; }
        .works :global(.work:hover) .work-arrow { transform: translateX(6px); }
        @media (max-width: 680px) { .works :global(.work) { grid-template-columns: 40px 1fr 30px; } .work-tag { display: none; } }

        /* classification pills */
        .cats { display: flex; flex-wrap: wrap; gap: 0.55rem; margin: 1.7rem 0 0.2rem; }
        .cats :global(.catpill) { display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--sans);
          font-size: 0.72rem; font-weight: 640; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink);
          background: transparent; border: 1px solid var(--ink); border-radius: 999px; padding: 0.5rem 0.95rem;
          cursor: pointer; transition: background .2s, color .2s, transform .2s; }
        .cats :global(.catpill:hover) { transform: translateY(-1px); }
        .cats :global(.catpill.on) { background: var(--ink); color: var(--paper); }
        .catn { font-family: var(--mono); font-size: 0.62rem; opacity: 0.65; }
        .cats :global(.catpill.on) .catn { color: var(--paper); opacity: 0.8; }
        .cat-blurb { font-family: var(--serif); font-style: italic; font-size: clamp(1.05rem, 2vw, 1.3rem);
          color: var(--graphite); margin: 0.7rem 0 0.2rem; max-width: 64ch; }

        /* capabilities */
        .caps { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; border-bottom: 1px solid var(--rule); }
        @media (max-width: 720px) { .caps { grid-template-columns: 1fr; } }
        .cap { padding: 1.6rem 0.4rem; border-top: 1px solid var(--rule); }
        .cap:nth-child(-n+2) { border-top: 0; }
        .cap .micro { margin-bottom: 0.8rem; }
        .cap-list { display: flex; flex-wrap: wrap; gap: 0.4rem 1.3rem; }
        .cap-list .core { font-family: var(--sans); font-stretch: 116%; font-weight: 640; text-transform: uppercase; font-size: 1.05rem; }
        .cap-list .aux { font-family: var(--serif); font-style: italic; font-size: 1.05rem; color: var(--graphite); }

        /* warehouse band extras */
        .wh-lead { font-family: var(--sans); font-size: 0.96rem; color: rgba(252,252,252,0.7); line-height: 1.7; max-width: 60ch; margin: -1.2rem 0 2rem; }

        /* contact */
        .sec.last { padding-bottom: 3rem; }
        .talk { font-family: var(--sans); font-stretch: 124%; font-weight: 640; text-transform: uppercase;
          font-size: clamp(3.4rem, 13vw, 12rem); line-height: 0.92; letter-spacing: -0.02em; margin: 1.4rem 0 2rem; }
        .foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.8rem; margin-top: 4rem;
          border-top: 1px solid var(--ink); padding-top: 1rem; }

        /* case study */
        .cs-wrap { position: fixed; inset: 0; z-index: 110; display: grid; place-items: center; padding: 1.5rem; }
        .cs-wrap::before { content: ''; position: absolute; inset: 0; background: rgba(17, 18, 20, 0.6); }
        .cs-card { position: relative; width: min(640px, 100%); max-height: 86vh; overflow-y: auto; background: var(--paper);
          border: 1px solid var(--ink); padding: 2.2rem; animation: csr .28s cubic-bezier(.16,1,.3,1) both; }
        @keyframes csr { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        .cs-x { position: absolute; top: 1rem; right: 1rem; background: transparent; border: 1px solid var(--ink);
          width: 32px; height: 32px; border-radius: 999px; color: var(--ink); font-size: 0.85rem; cursor: pointer; }
        .cs-x:hover { background: var(--ink); color: var(--paper); }
        .cs-title { font-family: var(--sans); font-stretch: 120%; font-weight: 640; text-transform: uppercase;
          font-size: clamp(1.5rem, 3.4vw, 2.2rem); letter-spacing: -0.01em; margin: 0.6rem 0 0.9rem; }
        .cs-problem { font-family: var(--serif); font-size: 1.15rem; line-height: 1.55; }
        .cs-h { margin: 1.5rem 0 0.7rem; }
        .cs-build { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .cs-build li { font-family: var(--sans); font-size: 0.92rem; line-height: 1.6; padding-left: 1rem; position: relative; }
        .cs-build li::before { content: '—'; position: absolute; left: 0; color: var(--graphite); }
        .cs-metrics { margin: 1.3rem 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 0.7rem 0; }
        .cs-metrics p { display: flex; align-items: baseline; gap: 0.5rem; font-family: var(--mono); font-size: 0.72rem; padding: 0.2rem 0; }
        .cs-cta { display: flex; gap: 0.7rem; flex-wrap: wrap; margin-top: 1.4rem; }

        /* motion */
        .rise { opacity: 0; transform: translateY(26px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .rise.set { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .rise { opacity: 1; transform: none; transition: none; }
          .dot, .cue { animation: none; }
          .st-in { transform: none; animation: none; }
          .band { border-radius: 0; }
        }
      `}</style>
    </div>
  )
}
