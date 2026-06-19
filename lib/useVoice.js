'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Shared Web-Speech voice layer. Multiple components call useVoice(), but they
 * all drive the single global speechSynthesis, so coordination lives at module
 * scope:
 *   • GEN — a generation counter. Every speak()/stopSpeak() bumps it, so the
 *     end/error event of a CANCELLED utterance is recognised as stale and never
 *     fires onEnd or auto-advances anything (fixes the seek/preempt races).
 *   • currentOwner — when one component speaks, the previously-speaking
 *     component's onPreempt() runs so its UI (button label, equalizer) resets.
 * Live captions are driven by onboundary, with a time-based fallback for the
 * browsers/voices (Safari, Chrome remote voices) that never fire boundaries.
 */

let GEN = 0
let currentOwner = null               // { id, onPreempt }
let activeCleanup = null              // clears caption timers of the live utterance

function preemptOwner(nextId) {
  if (currentOwner && currentOwner.id !== nextId) {
    const prev = currentOwner
    currentOwner = null
    try { prev.onPreempt && prev.onPreempt() } catch {}
  }
}
function releaseOwner(id) {
  if (currentOwner && currentOwner.id === id) currentOwner = null
}

// Voice selection happens once, globally (not per instance → no clobbering).
let CHOSEN = null
function pickVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const vs = window.speechSynthesis.getVoices()
  CHOSEN =
    vs.find((v) => /Google US English|Samantha|Microsoft Aria|Microsoft Jenny|Microsoft Guy|Daniel/i.test(v.name)) ||
    vs.find((v) => v.lang && v.lang.startsWith('en')) ||
    vs[0] || null
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  pickVoice()
  try { window.speechSynthesis.addEventListener('voiceschanged', pickVoice) } catch {}
}

let OWNER_SEQ = 0

export default function useVoice() {
  const [speaking, setSpeaking]   = useState(false)
  const [listening, setListening] = useState(false)
  const idRef  = useRef(null)
  const recRef = useRef(null)
  if (idRef.current === null) idRef.current = ++OWNER_SEQ

  const supportsTTS = typeof window !== 'undefined' && 'speechSynthesis' in window
  const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  const supportsSTT = !!SR

  const clearTimers = () => { if (activeCleanup) { activeCleanup(); activeCleanup = null } }

  const stopSpeak = () => {
    GEN++                              // invalidate any in-flight utterance's onEnd
    clearTimers()
    try { window.speechSynthesis.cancel() } catch {}
    releaseOwner(idRef.current)
    setSpeaking(false)
  }

  // speak(text, { onWord, onEnd, onPreempt, rate, pitch }) → generation id
  // onEnd fires ONLY on genuine completion (never on cancel/preempt).
  // onPreempt fires when another component takes over the speaker.
  const speak = (text, opts = {}) => {
    if (!supportsTTS || !text) return -1
    GEN++
    const myGen = GEN
    clearTimers()
    preemptOwner(idRef.current)
    currentOwner = { id: idRef.current, onPreempt: () => { setSpeaking(false); opts.onPreempt && opts.onPreempt() } }

    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      if (CHOSEN) u.voice = CHOSEN
      u.rate  = opts.rate ?? 1.02
      u.pitch = opts.pitch ?? 1.0

      let gotBoundary = false
      let interval = null
      const start = (typeof performance !== 'undefined' ? performance.now() : Date.now())
      const estMs = Math.max(1200, (text.length / (14 * u.rate)) * 1000)

      const stopFallback = () => { if (interval) { clearInterval(interval); interval = null } }
      activeCleanup = stopFallback

      // If onboundary never fires within 350ms, interpolate the caption by time.
      const fallbackKick = setTimeout(() => {
        if (GEN !== myGen || gotBoundary) return
        interval = setInterval(() => {
          if (GEN !== myGen) { stopFallback(); return }
          const now = (typeof performance !== 'undefined' ? performance.now() : Date.now())
          const frac = Math.min(1, (now - start) / estMs)
          opts.onWord && opts.onWord(Math.floor(frac * text.length))
        }, 90)
      }, 350)
      const prevCleanup = activeCleanup
      activeCleanup = () => { clearTimeout(fallbackKick); prevCleanup && prevCleanup() }

      u.onstart = () => setSpeaking(true)
      u.onboundary = (e) => {
        if (GEN !== myGen) return
        gotBoundary = true
        stopFallback()
        opts.onWord && opts.onWord(e.charIndex ?? 0)
      }
      u.onend = () => {
        if (GEN !== myGen) return
        clearTimers()
        releaseOwner(idRef.current)
        setSpeaking(false)
        opts.onEnd && opts.onEnd()
      }
      u.onerror = () => {
        if (GEN !== myGen) return
        clearTimers()
        releaseOwner(idRef.current)
        setSpeaking(false)
        opts.onEnd && opts.onEnd()
      }
      window.speechSynthesis.speak(u)
      return myGen
    } catch { return -1 }
  }

  const listen = (onResult) => {
    if (!supportsSTT || listening) return
    try {
      const rec = new SR()
      recRef.current = rec
      rec.lang = 'en-US'
      rec.interimResults = false
      rec.maxAlternatives = 1
      rec.onresult = (e) => { const t = e.results[0][0].transcript; if (t) onResult(t) }
      rec.onend   = () => setListening(false)
      rec.onerror = () => setListening(false)
      setListening(true)
      rec.start()
    } catch { setListening(false) }
  }
  const stopListen = () => { try { recRef.current?.stop() } catch {}; setListening(false) }

  // stop this instance's speech if it unmounts (without killing another owner's)
  useEffect(() => () => {
    if (currentOwner && currentOwner.id === idRef.current) stopSpeak()
  }, []) // eslint-disable-line

  return { speaking, listening, supportsTTS, supportsSTT, speak, stopSpeak, listen, stopListen }
}
