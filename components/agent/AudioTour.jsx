'use client'

import { useEffect, useRef, useState } from 'react'
import { FiX, FiPlay, FiPause, FiSkipForward, FiSkipBack, FiDownload } from 'react-icons/fi'
import useVoice from '@/lib/useVoice'
import TourStage from '@/components/agent/TourStage'

const RESUME_PDF = '/My-Portfolio/Rithvik_Illandula_Resume.pdf'

// First-person audio résumé — warm, truthful, ~30s per stop.
const TOUR = [
  {
    title: 'Hello',
    text: "Hi, I'm Rithvik Illandula — a data, AI, and software engineer based in Buffalo, New York. I work across the whole stack of modern data and AI: from the SQL and pipelines underneath, to the machine-learning and large-language-model systems on top, to the services that ship them. Let me walk you through my background.",
  },
  {
    title: 'Experience',
    text: 'Over four-plus years, I built data systems at Deloitte, WAFU Technologies, and the University at Buffalo. At Deloitte I analyzed media data from six source systems with Python, SQL, Spark, and Databricks, shipped fifteen-plus Tableau and Power BI dashboards, and cut manual review effort by eighty percent. At the University at Buffalo I built Python, SQL, Airflow, and BigQuery workflows over twenty-five-plus datasets, and cut a nightly pipeline from two hours to thirty-five minutes.',
  },
  {
    title: 'Projects',
    text: 'On the project side, I built a telco churn model over five-hundred-thousand-plus customer records, a Citi Bike demand forecaster over a million-plus trips with a twelve-to-fifteen-percent accuracy gain, and PDF-Insight, a retrieval-augmented assistant that answers questions across your documents using LangChain, FAISS, and a large language model — the same kind of retrieval running this very portfolio.',
  },
  {
    title: 'Impact',
    text: 'By the numbers: over a million records modeled, twenty-five-plus datasets profiled and validated, six source systems unified, forty-plus source-to-target mappings documented, nightly runtime cut by seventy-one percent, and manual review reduced by eighty percent. I care about systems that are reliable, measurable, and production-ready.',
  },
  {
    title: 'Education',
    text: "I'm finishing a Master's in Computer Science at the University at Buffalo — my third computer science degree — with coursework in machine learning, deep learning, and data-intensive computing. I also hold certifications including the Google Cloud Professional Data Engineer and Microsoft's Power BI and Fabric data certifications.",
  },
  {
    title: "Let's talk",
    text: "That's me in about two minutes. If you'd like to talk, reach me at rithvik dot illandula at gmail dot com, or find me on LinkedIn and GitHub. Thanks for listening — and feel free to ask my AI assistant anything else about my work.",
  },
]

export default function AudioTour() {
  const [open, setOpen]       = useState(false)
  const [idx, setIdx]         = useState(0)
  const [playing, setPlaying] = useState(false)
  const [spoken, setSpoken]   = useState(0)
  const cardRef    = useRef(null)
  const lastFocus  = useRef(null)
  const idxRef     = useRef(0)
  const voice = useVoice()

  function speakStep(i) {
    idxRef.current = i
    setIdx(i)
    setSpoken(0)
    setPlaying(true)
    if (!voice.supportsTTS) { setPlaying(false); return }
    voice.speak(TOUR[i].text, {
      onWord: (c) => setSpoken(c),
      onPreempt: () => setPlaying(false),     // another voice took over → reset our UI
      onEnd: () => {                          // genuine completion only
        if (i < TOUR.length - 1) speakStep(i + 1)
        else { setPlaying(false); setSpoken(TOUR[i].text.length) }
      },
    })
  }

  // open + start when the Résumé button fires the event (a user gesture → audio allowed)
  useEffect(() => {
    function onStart() {
      lastFocus.current = document.activeElement
      setOpen(true)
      setTimeout(() => { cardRef.current?.focus(); speakStep(0) }, 60)
    }
    window.addEventListener('start-audio-tour', onStart)
    return () => window.removeEventListener('start-audio-tour', onStart)
  }, []) // eslint-disable-line

  // Esc closes the tour while it's open
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open]) // eslint-disable-line

  function pause()  { voice.stopSpeak(); setPlaying(false) }
  function resume() { speakStep(idxRef.current) }
  function go(i)    { if (i < 0 || i >= TOUR.length) return; voice.stopSpeak(); speakStep(i) }
  function close() {
    voice.stopSpeak()
    setPlaying(false)
    setOpen(false)
    window.dispatchEvent(new CustomEvent('audio-tour-closed'))
    if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus()
  }

  if (!open) return null

  const step = TOUR[idx]
  const lit  = step.text.slice(0, spoken)
  const rest = step.text.slice(spoken)

  return (
    <div className="tour-wrap" role="dialog" aria-modal="true" aria-label="Audio résumé tour">
      <div className="tour-scrim" aria-hidden="true" onClick={close} />
      <div className="tour-card" ref={cardRef} tabIndex={-1}>
        <header className="tour-head">
          <div className="tour-id">
            <span className={`tour-eq ${playing ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>
            <div>
              <p className="tour-kicker">Audio Résumé · narrated tour</p>
              <p className="tour-title">{step.title}</p>
            </div>
          </div>
          <button className="tour-x" onClick={close} aria-label="Close tour"><FiX size={18} /></button>
        </header>

        <TourStage idx={idx} />

        <div className="tour-caption" aria-live="polite">
          {voice.supportsTTS ? (
            <p><span className="lit">{lit}</span><span className="rest">{rest}</span></p>
          ) : (
            <p className="transcript">{step.text} <span className="tour-note">(Your browser can&apos;t play voice — here&apos;s the transcript.)</span></p>
          )}
        </div>

        <div className="tour-dots">
          {TOUR.map((t, i) => (
            <button
              key={t.title}
              className={`tour-dot ${i === idx ? 'active' : ''} ${i < idx ? 'done' : ''}`}
              onClick={() => go(i)}
              aria-label={`Go to ${t.title}`}
            />
          ))}
        </div>

        <div className="tour-controls">
          <button onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous section"><FiSkipBack size={16} /></button>
          {playing ? (
            <button className="tour-play" onClick={pause} aria-label="Pause"><FiPause size={20} /></button>
          ) : (
            <button className="tour-play" onClick={resume} aria-label="Play"><FiPlay size={20} /></button>
          )}
          <button onClick={() => go(idx + 1)} disabled={idx === TOUR.length - 1} aria-label="Next section"><FiSkipForward size={16} /></button>
        </div>

        <footer className="tour-foot">
          <span className="tour-step">{idx + 1} / {TOUR.length}</span>
          <a className="tour-pdf" href={RESUME_PDF} target="_blank" rel="noopener noreferrer" onClick={() => voice.stopSpeak()}>
            <FiDownload size={12} /> Prefer the PDF?
          </a>
        </footer>
      </div>

      <style jsx>{`
        .tour-wrap { position: fixed; inset: 0; z-index: 95; display: grid; place-items: center; padding: 1.5rem 1rem; overflow-y: auto; }
        .tour-scrim { position: absolute; inset: 0; background: rgba(4,3,5,0.62); backdrop-filter: blur(4px); animation: tour-in 0.3s ease both; }
        .tour-card {
          position: relative; width: min(720px, 100%); color: #f4efe9; margin: auto;
          background: rgba(12,10,13,0.96); border: 1px solid rgba(255,122,47,0.3);
          border-radius: 1.2rem; padding: 1.2rem 1.3rem 1rem; outline: none;
          box-shadow: 0 30px 90px rgba(0,0,0,0.65); animation: tour-rise 0.35s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        @keyframes tour-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tour-rise { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }

        .tour-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .tour-id { display: flex; align-items: center; gap: 0.7rem; }
        .tour-kicker { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.14em; color: #ffb061; font-weight: 700; }
        .tour-title { font-size: 1.05rem; font-weight: 700; }
        .tour-x { background: transparent; border: 0; color: rgba(244,239,233,0.6); cursor: pointer; padding: 4px; }
        .tour-x:hover { color: #fff; }
        .tour-x:focus-visible { outline: 2px solid #ff7a2f; outline-offset: 2px; border-radius: 4px; }
        .tour-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 22px; }
        .tour-eq i { width: 3px; height: 6px; background: #ff7a2f; border-radius: 2px; }
        .tour-eq.on i { animation: tour-eq 0.9s ease-in-out infinite; }
        .tour-eq.on i:nth-child(2) { animation-delay: 0.2s; }
        .tour-eq.on i:nth-child(3) { animation-delay: 0.4s; }
        .tour-eq.on i:nth-child(4) { animation-delay: 0.1s; }
        @keyframes tour-eq { 0%,100% { height: 5px; } 50% { height: 20px; } }

        .tour-caption { min-height: 5rem; max-height: 22vh; overflow-y: auto; margin: 0.9rem 0; }
        .tour-caption p { font-size: 1.02rem; line-height: 1.65; margin: 0; }
        .tour-caption .lit { color: #fff; }
        .tour-caption .rest { color: rgba(244,239,233,0.4); }
        .tour-caption .transcript { color: rgba(244,239,233,0.88); }
        .tour-note { font-size: 0.8rem; color: rgba(244,239,233,0.6); }

        .tour-dots { display: flex; gap: 0.4rem; justify-content: center; margin-bottom: 0.85rem; }
        .tour-dot { width: 26px; height: 4px; border-radius: 2px; border: 0; background: rgba(255,255,255,0.14); cursor: pointer; transition: background 0.2s; padding: 0; }
        .tour-dot.done { background: rgba(255,122,47,0.55); }
        .tour-dot.active { background: #ff7a2f; }
        .tour-dot:focus-visible { outline: 2px solid #ff7a2f; outline-offset: 3px; }

        .tour-controls { display: flex; align-items: center; justify-content: center; gap: 1.1rem; margin-bottom: 0.7rem; }
        .tour-controls button { display: grid; place-items: center; background: transparent; border: 0; color: rgba(244,239,233,0.75); cursor: pointer; }
        .tour-controls button:disabled { opacity: 0.3; cursor: default; }
        .tour-controls button:hover:not(:disabled) { color: #fff; }
        .tour-controls button:focus-visible { outline: 2px solid #ff7a2f; outline-offset: 3px; border-radius: 6px; }
        .tour-play { width: 52px; height: 52px; border-radius: 9999px !important;
          background: linear-gradient(180deg, #ff7a2f, #e85f1a) !important; color: #160b03 !important;
          box-shadow: 0 10px 26px rgba(232,95,26,0.45); }

        .tour-foot { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.7rem; }
        .tour-step { font-size: 0.7rem; color: rgba(244,239,233,0.45); font-variant-numeric: tabular-nums; }
        .tour-pdf { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; color: rgba(244,239,233,0.6); text-decoration: none; }
        .tour-pdf:hover { color: #ffb061; }

        @media (max-width: 520px) {
          .tour-caption p { font-size: 0.92rem; }
          .tour-card { padding: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tour-eq.on i { animation: none !important; height: 12px; }
          .tour-scrim, .tour-card { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
