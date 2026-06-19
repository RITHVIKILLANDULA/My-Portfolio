'use client'

import { useEffect, useRef, useState } from 'react'
import { FiSend, FiX, FiVolume2, FiVolumeX, FiMic } from 'react-icons/fi'
import { ask } from '@/lib/rag'
import useVoice from '@/lib/useVoice'

const SUGGESTIONS = [
  'What did he do at Deloitte?',
  'Does he know LangChain and RAG?',
  'Tell me about his ML projects',
  "What's his biggest impact?",
  'How do I reach him?',
]

const GREETING =
  "Hi — I'm Rithvik's AI assistant. Ask me anything about his experience, projects, skills, or how to reach him."

export default function AiAgent() {
  const [open, setOpen]       = useState(false)
  const [hidden, setHidden]   = useState(false)   // hidden while the audio tour is open
  const [thinking, setThinking] = useState(false)
  const [msgs, setMsgs]       = useState([{ role: 'agent', text: GREETING }])
  const [q, setQ]             = useState('')
  const [voiceOn, setVoiceOn] = useState(true)
  const [nudge, setNudge]     = useState(false)
  const scrollRef   = useRef(null)
  const launcherRef = useRef(null)
  const inputRef    = useRef(null)
  const wasOpen     = useRef(false)
  const voice = useVoice()

  // hide the agent while the narrated résumé tour is playing (avoids overlap/scrim collision)
  useEffect(() => {
    const hide = () => { setHidden(true); setOpen(false); voice.stopSpeak() }
    const show = () => setHidden(false)
    window.addEventListener('start-audio-tour', hide)
    window.addEventListener('audio-tour-closed', show)
    return () => { window.removeEventListener('start-audio-tour', hide); window.removeEventListener('audio-tour-closed', show) }
  }, []) // eslint-disable-line

  // focus the input on open + Esc to close; return focus to the launcher on close
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      const id = setTimeout(() => inputRef.current?.focus(), 50)
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
      window.addEventListener('keydown', onKey)
      return () => { clearTimeout(id); window.removeEventListener('keydown', onKey) }
    } else if (wasOpen.current) {
      wasOpen.current = false
      launcherRef.current?.focus()
    }
  }, [open])

  // gentle one-time nudge so people notice the agent
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 4200)
    const t2 = setTimeout(() => setNudge(false), 11000)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [msgs, thinking])

  // stop any speech when the panel closes
  useEffect(() => { if (!open) voice.stopSpeak() }, [open]) // eslint-disable-line

  async function submit(text) {
    const query = (text ?? q).trim()
    if (!query || thinking) return
    setNudge(false)
    setQ('')
    setMsgs((m) => [...m, { role: 'user', text: query }])
    setThinking(true)
    try {
      const { results } = await ask(query, 3)
      const top = results[0]
      const answer = top ? top.text : "I don't have that on file, but you can email Rithvik at rithvik.illandula@gmail.com."
      setMsgs((m) => [...m, { role: 'agent', text: answer, source: top?.source }])
      if (voiceOn) voice.speak(answer)
    } catch {
      setMsgs((m) => [...m, { role: 'agent', text: 'Something went wrong — try again, or email rithvik.illandula@gmail.com.' }])
    } finally {
      setThinking(false)
    }
  }

  function toggleVoice() {
    setVoiceOn((v) => { if (v) voice.stopSpeak(); return !v })
  }

  function micAsk() {
    if (!voice.supportsSTT) return
    voice.listen((transcript) => submit(transcript))
  }

  if (hidden) return null

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button ref={launcherRef} className="ai-launch" onClick={() => setOpen(true)} aria-label="Ask Rithvik's AI assistant">
          <span className="ai-orb">
            <span className="ai-spark" />
          </span>
          <span className="ai-ping" />
          {nudge && <span className="ai-nudge">Ask my AI about me ✦</span>}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="ai-panel" role="dialog" aria-label="AI assistant">
          <header className="ai-head">
            <div className="ai-head-id">
              <span className="ai-dot" />
              <div>
                <p className="ai-title">Rithvik&apos;s AI</p>
                <p className="ai-sub">{voice.speaking ? 'speaking…' : 'ask me anything'}</p>
              </div>
            </div>
            <div className="ai-head-actions">
              <button onClick={toggleVoice} aria-label={voiceOn ? 'Mute voice' : 'Unmute voice'} className="ai-icon">
                {voiceOn ? <FiVolume2 size={15} /> : <FiVolumeX size={15} />}
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close" className="ai-icon">
                <FiX size={16} />
              </button>
            </div>
          </header>

          <div className="ai-body" ref={scrollRef} aria-live="polite" aria-atomic="false">
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}>
                {m.source && <span className="ai-src">{m.source}</span>}
                <p>{m.text}</p>
              </div>
            ))}
            {thinking && (
              <div className="ai-msg ai-msg-bot" role="status" aria-label="Assistant is typing">
                <span className="ai-typing" aria-hidden="true"><i /><i /><i /></span>
              </div>
            )}
          </div>

          {msgs.length <= 2 && (
            <div className="ai-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => submit(s)} disabled={thinking}>{s}</button>
              ))}
            </div>
          )}

          <form
            className="ai-input"
            onSubmit={(e) => { e.preventDefault(); submit() }}
          >
            {voice.supportsSTT && (
              <button type="button" onClick={micAsk} aria-label="Ask by voice" className={`ai-mic ${voice.listening ? 'on' : ''}`}>
                <FiMic size={15} />
              </button>
            )}
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask about my background…"
              aria-label="Ask about Rithvik"
            />
            <button type="submit" disabled={thinking || !q.trim()} aria-label="Send" className="ai-send">
              <FiSend size={15} />
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        /* ── Launcher ─────────────────────────────── */
        .ai-launch {
          position: fixed; right: 1.4rem; bottom: 1.4rem; z-index: 70;
          display: flex; align-items: center; gap: 0; background: none; border: 0; cursor: pointer;
        }
        .ai-orb {
          position: relative; display: grid; place-items: center;
          width: 56px; height: 56px; border-radius: 9999px;
          background: radial-gradient(circle at 35% 30%, #ffb061, #ff7a2f 55%, #e85f1a);
          box-shadow: 0 10px 30px rgba(232,95,26,0.45), 0 0 0 1px rgba(255,176,97,0.5) inset;
          transition: transform 0.25s ease;
        }
        .ai-launch:hover .ai-orb { transform: scale(1.06); }
        .ai-spark {
          width: 22px; height: 22px;
          background: #1a0f06;
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z'/%3E%3Ccircle cx='19' cy='19' r='2.2' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z'/%3E%3Ccircle cx='19' cy='19' r='2.2' fill='black'/%3E%3C/svg%3E") center/contain no-repeat;
        }
        .ai-ping {
          position: absolute; right: 4px; bottom: 4px; width: 56px; height: 56px;
          border-radius: 9999px; border: 1.5px solid rgba(255,122,47,0.6);
          animation: ai-ping 2.6s ease-out infinite; pointer-events: none;
        }
        @keyframes ai-ping { 0% { transform: scale(0.8); opacity: 0.7; } 100% { transform: scale(1.5); opacity: 0; } }
        .ai-nudge {
          position: absolute; right: 70px; bottom: 16px; white-space: nowrap;
          background: rgba(19,16,23,0.95); color: #f4efe9; border: 1px solid rgba(255,122,47,0.35);
          padding: 0.5rem 0.8rem; border-radius: 0.7rem; font-size: 0.74rem; font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: ai-fade 0.4s ease both;
        }
        @keyframes ai-fade { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }

        /* ── Panel ────────────────────────────────── */
        .ai-panel {
          position: fixed; right: 1.4rem; bottom: 1.4rem; z-index: 70;
          width: min(360px, calc(100vw - 2rem)); height: min(540px, calc(100vh - 2.5rem));
          display: flex; flex-direction: column; overflow: hidden;
          background: rgba(12,10,13,0.92); backdrop-filter: blur(14px);
          border: 1px solid rgba(255,122,47,0.28); border-radius: 1.1rem;
          box-shadow: 0 30px 80px rgba(0,0,0,0.6); color: #f4efe9;
          animation: ai-rise 0.32s cubic-bezier(0.2,0.8,0.2,1) both;
        }
        @keyframes ai-rise { from { opacity: 0; transform: translateY(18px) scale(0.97); } to { opacity: 1; transform: none; } }
        .ai-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.85rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.07);
          background: linear-gradient(180deg, rgba(255,122,47,0.10), transparent);
        }
        .ai-head-id { display: flex; align-items: center; gap: 0.6rem; }
        .ai-dot { width: 9px; height: 9px; border-radius: 9999px; background: #36d399; box-shadow: 0 0 10px #36d399; flex: none; }
        .ai-title { font-size: 0.86rem; font-weight: 700; letter-spacing: 0.01em; }
        .ai-sub { font-size: 0.66rem; color: rgba(244,239,233,0.5); text-transform: lowercase; }
        .ai-head-actions { display: flex; gap: 0.25rem; }
        .ai-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 0.5rem; background: transparent; border: 0; color: rgba(244,239,233,0.65); cursor: pointer; transition: all 0.18s; }
        .ai-icon:hover { background: rgba(255,255,255,0.07); color: #fff; }

        .ai-body { flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .ai-msg { max-width: 88%; padding: 0.65rem 0.8rem; border-radius: 0.85rem; font-size: 0.82rem; line-height: 1.5; }
        .ai-msg p { margin: 0; }
        .ai-msg-bot { align-self: flex-start; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); border-bottom-left-radius: 0.25rem; }
        .ai-msg-user { align-self: flex-end; background: linear-gradient(180deg, #ff7a2f, #e85f1a); color: #160b03; font-weight: 600; border-bottom-right-radius: 0.25rem; }
        .ai-src { display: block; font-size: 0.58rem; text-transform: uppercase; letter-spacing: 0.08em; color: #ffb061; margin-bottom: 0.25rem; font-weight: 700; }
        .ai-typing { display: inline-flex; gap: 4px; padding: 2px 0; }
        .ai-typing i { width: 6px; height: 6px; border-radius: 9999px; background: rgba(255,176,97,0.8); animation: ai-bounce 1.1s infinite ease-in-out; }
        .ai-typing i:nth-child(2) { animation-delay: 0.15s; }
        .ai-typing i:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ai-bounce { 0%,80%,100% { transform: translateY(0); opacity: 0.5; } 40% { transform: translateY(-5px); opacity: 1; } }

        .ai-suggest { display: flex; flex-wrap: wrap; gap: 0.4rem; padding: 0 1rem 0.6rem; }
        .ai-suggest button {
          font-size: 0.68rem; color: rgba(244,239,233,0.8); background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 9999px; padding: 0.35rem 0.7rem; cursor: pointer; transition: all 0.18s;
        }
        .ai-suggest button:hover { border-color: rgba(255,122,47,0.55); color: #ffb061; }
        .ai-suggest button:disabled { opacity: 0.4; cursor: default; }

        .ai-input { display: flex; align-items: center; gap: 0.4rem; padding: 0.7rem; border-top: 1px solid rgba(255,255,255,0.07); }
        .ai-input input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.7rem; padding: 0.55rem 0.7rem; color: #f4efe9; font-size: 0.8rem; outline: none; }
        .ai-input input:focus { border-color: rgba(255,122,47,0.5); }
        .ai-input input::placeholder { color: rgba(244,239,233,0.4); }
        .ai-mic, .ai-send { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 0.7rem; cursor: pointer; border: 0; }
        .ai-mic { background: rgba(255,255,255,0.06); color: rgba(244,239,233,0.7); }
        .ai-mic.on { background: #ff7a2f; color: #160b03; animation: ai-pulse 1s infinite; }
        @keyframes ai-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,122,47,0.5); } 50% { box-shadow: 0 0 0 6px rgba(255,122,47,0); } }
        .ai-send { background: linear-gradient(180deg, #ff7a2f, #e85f1a); color: #160b03; }
        .ai-send:disabled { opacity: 0.4; cursor: default; }

        .ai-launch:focus-visible .ai-orb,
        .ai-icon:focus-visible,
        .ai-suggest button:focus-visible,
        .ai-send:focus-visible,
        .ai-mic:focus-visible { outline: 2px solid #ffb061; outline-offset: 2px; }
        .ai-input input:focus-visible { outline: none; }

        @media (max-width: 520px) {
          .ai-panel { right: 0.6rem; bottom: 0.6rem; height: min(70vh, 540px); }
          .ai-launch { right: 1rem; bottom: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ai-orb, .ai-ping, .ai-mic.on, .ai-typing i, .ai-panel, .ai-nudge { animation: none !important; }
        }
      `}</style>
    </>
  )
}
