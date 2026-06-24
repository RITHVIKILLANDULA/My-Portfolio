'use client'

import { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause } from 'react-icons/fi'
import useVoice from '@/lib/useVoice'

const INTRO =
  "Hi, I'm Rithvik — a data, AI, and software engineer. I build reliable, measurable systems across data pipelines, machine learning, and the services that ship them. Take a look around."

export default function HeroNarration() {
  const [unlocked, setUnlocked] = useState(false)
  const [playing, setPlaying]   = useState(false)
  const [spoken, setSpoken]     = useState(0)
  const [active, setActive]     = useState(false)  // caption visible while/after narrating
  const played = useRef(false)
  const rootRef = useRef(null)
  const voice = useVoice()

  // START (user gesture) unlocks audio for the session
  useEffect(() => {
    function onUnlock() { setUnlocked(true) }
    window.addEventListener('loader-dismissed', onUnlock)
    return () => window.removeEventListener('loader-dismissed', onUnlock)
  }, [])

  function play() {
    if (!voice.supportsTTS) return
    setActive(true)
    setSpoken(0)
    setPlaying(true)
    played.current = true
    voice.speak(INTRO, {
      onWord: (c) => setSpoken(c),
      onPreempt: () => setPlaying(false),                     // another voice took over
      onEnd:  () => { setPlaying(false); setSpoken(INTRO.length) },  // genuine completion fills caption
    })
  }

  function pause() { voice.stopSpeak(); setPlaying(false) }   // gen-guarded: no caption snap

  // auto-play once when the hero is in view and audio is unlocked; stop on scroll-away
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const reduce = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer = null
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (played.current || !unlocked || !voice.supportsTTS || reduce) return
        if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) return
        timer = setTimeout(play, 700)                          // small beat after the hero settles
      } else {
        if (timer) { clearTimeout(timer); timer = null }
        if (playing) { voice.stopSpeak(); setPlaying(false) }  // scrolled away → stop the voice
      }
    }, { threshold: 0.55 })
    io.observe(el)
    return () => { io.disconnect(); if (timer) clearTimeout(timer) }
  }, [unlocked, playing]) // eslint-disable-line

  const lit  = INTRO.slice(0, spoken)
  const rest = INTRO.slice(spoken)

  return (
    <div className="hn" ref={rootRef}>
      <button className="hn-btn" onClick={playing ? pause : play} aria-label={playing ? 'Pause intro narration' : 'Hear my intro'}>
        <span className={`hn-eq ${playing ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
        {playing ? <FiPause size={13} /> : <FiPlay size={13} />}
        <span className="hn-label">{playing ? 'Narrating…' : (played.current ? 'Replay intro' : 'Hear my intro')}</span>
      </button>

      {active && (
        <p className="hn-caption" aria-live="polite">
          <span className="lit">{lit}</span><span className="rest">{rest}</span>
        </p>
      )}

      <style jsx>{`
        .hn { margin-top: 1.1rem; max-width: 30rem; }
        .hn-btn {
          display: inline-flex; align-items: center; gap: 0.55rem;
          background: rgba(99,102,241,0.10); border: 1px solid rgba(99,102,241,0.4);
          color: #818cf8; border-radius: 9999px; padding: 0.45rem 0.95rem;
          font-size: 0.74rem; font-weight: 600; letter-spacing: 0.01em; cursor: pointer;
          transition: all 0.2s; backdrop-filter: blur(6px);
        }
        .hn-btn:hover { background: rgba(99,102,241,0.18); border-color: rgba(99,102,241,0.7); color: #a5b0fb; }
        .hn-btn:focus-visible { outline: 2px solid #6366f1; outline-offset: 3px; }
        .hn-label { white-space: nowrap; }
        .hn-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 13px; }
        .hn-eq i { width: 2.5px; height: 4px; background: currentColor; border-radius: 2px; opacity: 0.85; }
        .hn-eq.on i { animation: hn-eq 0.85s ease-in-out infinite; }
        .hn-eq.on i:nth-child(2) { animation-delay: 0.18s; }
        .hn-eq.on i:nth-child(3) { animation-delay: 0.36s; }
        .hn-eq.on i:nth-child(4) { animation-delay: 0.1s; }
        @keyframes hn-eq { 0%,100% { height: 3px; } 50% { height: 12px; } }

        .hn-caption { margin-top: 0.8rem; font-size: 0.92rem; line-height: 1.6; }
        .hn-caption .lit { color: #ededed; }
        .hn-caption .rest { color: rgba(237,237,237,0.4); }

        @media (max-width: 767px) { .hn { display: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hn-eq.on i { animation: none !important; height: 9px; }
        }
      `}</style>
    </div>
  )
}
