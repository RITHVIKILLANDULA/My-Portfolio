'use client'

import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiCornerDownLeft } from 'react-icons/fi'

const GH = 'https://github.com/RITHVIKILLANDULA'
const LI = 'https://www.linkedin.com/in/rithvik-illandula'
const EMAIL = 'rithvik.illandula@gmail.com'
const RESUME = '/Rithvik_Illandula_Resume.pdf'

function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

const ACTIONS = [
  { id: 'ask', label: 'Ask my AI a question', hint: 'agent', group: 'AI', run: () => window.dispatchEvent(new CustomEvent('journey-ask', { detail: "What's the hardest system Rithvik shipped?" })) },
  { id: 'tour', label: 'Play the audio résumé', hint: 'voice', group: 'AI', run: () => window.dispatchEvent(new CustomEvent('start-audio-tour')) },
  { id: 'about', label: 'Go to About', group: 'Navigate', run: () => scrollTo('about') },
  { id: 'exp', label: 'Go to Experience', group: 'Navigate', run: () => scrollTo('experience') },
  { id: 'proj', label: 'Go to Projects', group: 'Navigate', run: () => scrollTo('projects') },
  { id: 'skills', label: 'Go to Skills', group: 'Navigate', run: () => scrollTo('skills') },
  { id: 'contact', label: 'Go to Contact', group: 'Navigate', run: () => scrollTo('contact') },
  { id: 'resume', label: 'Download résumé (PDF)', group: 'Links', run: () => window.open(RESUME, '_blank') },
  { id: 'gh', label: 'Open GitHub', group: 'Links', run: () => window.open(GH, '_blank') },
  { id: 'li', label: 'Open LinkedIn', group: 'Links', run: () => window.open(LI, '_blank') },
  { id: 'email', label: 'Copy email address', hint: EMAIL, group: 'Links', run: () => { try { navigator.clipboard.writeText(EMAIL) } catch {} } },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef(null)
  const lastFocus = useRef(null)

  const results = ACTIONS.filter((a) => (a.label + ' ' + (a.hint || '')).toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o) }
      else if (e.key === '/' && !open && !/input|textarea/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) { lastFocus.current = document.activeElement; setQ(''); setSel(0); setTimeout(() => inputRef.current?.focus(), 30) }
    else if (lastFocus.current?.focus) lastFocus.current.focus()
  }, [open])

  useEffect(() => { setSel(0) }, [q])

  function run(a) { setOpen(false); setTimeout(() => a.run(), 60) }

  function onInputKey(e) {
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter' && results[sel]) { e.preventDefault(); run(results[sel]) }
  }

  return (
    <>
      <button className="cmdk-trigger" onClick={() => setOpen(true)} aria-label="Open command palette">
        <FiSearch size={13} /> <span>Search</span> <kbd>⌘K</kbd>
      </button>

      {open && (
        <div className="cmdk-wrap" role="dialog" aria-modal="true" aria-label="Command palette">
          <div className="cmdk-scrim" onClick={() => setOpen(false)} />
          <div className="cmdk">
            <div className="cmdk-input">
              <FiSearch size={16} />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onInputKey}
                placeholder="Type a command or search…" aria-label="Command search" />
              <kbd>esc</kbd>
            </div>
            <div className="cmdk-list">
              {results.length === 0 && <p className="cmdk-empty">No matches.</p>}
              {results.map((a, i) => (
                <button key={a.id} className={`cmdk-item ${i === sel ? 'on' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => run(a)}>
                  <span className="cmdk-label">{a.label}</span>
                  {a.hint && <span className="cmdk-hint">{a.hint}</span>}
                  <span className="cmdk-group">{a.group}</span>
                  {i === sel && <FiCornerDownLeft size={13} className="cmdk-enter" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cmdk-trigger { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.4rem 0.7rem; border-radius: 8px;
          background: #131316; border: 1px solid #27272A; color: #A1A1AA; font-size: 0.8rem; cursor: pointer; transition: all .2s; }
        .cmdk-trigger:hover { border-color: #6366F1; color: #EDEDED; }
        .cmdk-trigger kbd { font-family: ui-monospace, monospace; font-size: 0.7rem; color: #71717A; border: 1px solid #27272A; border-radius: 4px; padding: 0 0.3rem; }

        .cmdk-wrap { position: fixed; inset: 0; z-index: 100; display: grid; place-items: start center; padding-top: 14vh; }
        .cmdk-scrim { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(3px); animation: cf .18s ease both; }
        @keyframes cf { from { opacity: 0 } to { opacity: 1 } }
        .cmdk { position: relative; width: min(560px, 92vw); background: #131316; border: 1px solid #27272A; border-radius: 14px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.6); overflow: hidden; animation: cr .22s cubic-bezier(.16,1,.3,1) both; }
        @keyframes cr { from { opacity: 0; transform: translateY(-8px) scale(.99) } to { opacity: 1; transform: none } }
        .cmdk-input { display: flex; align-items: center; gap: 0.6rem; padding: 0.85rem 1rem; border-bottom: 1px solid #1F1F23; color: #71717A; }
        .cmdk-input input { flex: 1; background: transparent; border: 0; outline: none; color: #EDEDED; font-size: 0.95rem; }
        .cmdk-input input::placeholder { color: #52525B; }
        .cmdk-input kbd { font-family: ui-monospace, monospace; font-size: 0.66rem; color: #52525B; border: 1px solid #27272A; border-radius: 4px; padding: 0.05rem 0.35rem; }
        .cmdk-list { max-height: 50vh; overflow-y: auto; padding: 0.4rem; }
        .cmdk-empty { color: #71717A; font-size: 0.85rem; padding: 1rem; }
        .cmdk-item { width: 100%; display: flex; align-items: center; gap: 0.7rem; padding: 0.6rem 0.7rem; border-radius: 8px;
          background: transparent; border: 0; cursor: pointer; text-align: left; color: #A1A1AA; }
        .cmdk-item.on { background: rgba(99,102,241,0.12); color: #EDEDED; }
        .cmdk-label { font-size: 0.9rem; flex: 0 0 auto; }
        .cmdk-hint { font-size: 0.74rem; color: #71717A; font-family: ui-monospace, monospace; }
        .cmdk-group { margin-left: auto; font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.08em; color: #52525B; }
        .cmdk-enter { color: #818CF8; }

        @media (max-width: 720px) { .cmdk-trigger span { display: none; } }
      `}</style>
    </>
  )
}
