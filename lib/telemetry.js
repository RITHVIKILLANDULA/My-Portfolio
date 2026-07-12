// Session telemetry — the beating heart of "YOU ARE THE DATA".
// Every visit is genuinely captured as an in-memory event stream; the
// Warehouse exposes it as the `visit.events` SQL table so a visitor can
// query their own session. Nothing leaves the browser — it is theirs.

const state = {
  events: [],
  subs: new Set(),
  sessionId: null,
  t0: 0,
  seq: 0,
  sectionEnterTs: {},
  started: false,
}

function now() { return Math.round(performance.now() - state.t0) }

export function track(event, detail = '', value = null) {
  if (typeof window === 'undefined') return
  if (!state.started) start()
  const row = {
    seq: ++state.seq,
    t_ms: now(),
    event,
    detail: String(detail).slice(0, 120),
    value: value === null ? null : Math.round(value * 100) / 100,
  }
  state.events.push(row)
  if (state.events.length > 1200) state.events.splice(0, 200) // cap memory
  state.subs.forEach((fn) => { try { fn(row) } catch {} })
}

export function getEvents() { return state.events }
export function getSessionId() { return state.sessionId || 'visitor' }
export function onEvent(fn) { state.subs.add(fn); return () => state.subs.delete(fn) }

export function sectionEnter(name) {
  if (state.sectionEnterTs[name] == null) track('section_enter', name)
  state.sectionEnterTs[name] = now()
}
export function sectionExit(name) {
  const t = state.sectionEnterTs[name]
  if (t != null) {
    const dwell = now() - t
    if (dwell > 400) track('section_dwell', name, Math.round(dwell / 100) / 10) // seconds
    state.sectionEnterTs[name] = null
  }
}

export function start() {
  if (state.started || typeof window === 'undefined') return
  state.started = true
  state.t0 = performance.now()
  state.sessionId = 'visitor_' + Math.random().toString(36).slice(2, 8)

  const ua = navigator.userAgent
  const device = /Mobi|Android/i.test(ua) ? 'mobile' : 'desktop'
  track('session_start', `${device} · ${window.innerWidth}x${window.innerHeight}`)
  track('referrer', document.referrer ? new URL(document.referrer).hostname : 'direct')

  // scroll-depth milestones
  const seen = new Set()
  let ticking = false
  window.addEventListener('scroll', () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h <= 0) return
      const pct = Math.round((window.scrollY / h) * 100)
      for (const m of [10, 25, 50, 75, 90, 100]) {
        if (pct >= m && !seen.has(m)) { seen.add(m); track('scroll_depth', `${m}%`, m) }
      }
    })
  }, { passive: true })

  document.addEventListener('visibilitychange', () => {
    track(document.hidden ? 'tab_blur' : 'tab_focus')
    if (document.hidden) {
      // flush open dwells so hidden-tab time doesn't count as reading time
      for (const name of Object.keys(state.sectionEnterTs)) sectionExit(name)
    }
  })
  window.addEventListener('pagehide', () => {
    for (const name of Object.keys(state.sectionEnterTs)) sectionExit(name)
  })
}
