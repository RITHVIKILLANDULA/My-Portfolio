'use client'

import { useEffect, useRef, useState } from 'react'
import { runQuery, looksLikeSql, SqlError } from '@/lib/minisql'
import { buildTables, SUGGESTED } from '@/data/warehouseTables'
import { getEvents, getSessionId, track } from '@/lib/telemetry'
import { agentUrl } from '@/lib/agentUrl'

/**
 * THE signature of "YOU ARE THE DATA": a real SQL console at the end of the
 * pipeline. `visit.events` is the visitor's OWN session, captured live —
 * they query themselves. SQL runs in-browser (lib/minisql); anything that
 * isn't SQL falls through to the live LLM agent and streams back in-console.
 */
export default function Warehouse() {
  const [history, setHistory] = useState([])   // {kind:'q'|'rows'|'err'|'agent'|'info', ...}
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [agentMode, setAgentMode] = useState(false) // Braun switch: SQL ↔ AGENT
  const scrollRef = useRef(null)
  const bootRef = useRef(false)

  // auto-run the reveal query the first time the console scrolls into view
  const rootRef = useRef(null)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !bootRef.current) {
        bootRef.current = true
        io.disconnect()
        setTimeout(() => exec('SELECT * FROM visit.events ORDER BY seq DESC LIMIT 8', true, true), 700)
      }
    }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, []) // eslint-disable-line

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history])

  function push(entry) { setHistory((h) => [...h.slice(-40), entry]) }
  // update a streaming entry by id — never by position (chips can append mid-stream)
  function patch(id, entry) { setHistory((h) => h.map((e) => (e.id === id ? { ...e, ...entry } : e))) }

  async function exec(raw, isBoot = false, forceSql = false) {
    const q = raw.trim()
    if (!q) return
    push({ kind: 'q', text: q, boot: isBoot })
    if (!isBoot) track('warehouse_query', q.slice(0, 80))

    // SQL mode: SQL runs locally, plain English falls through to the agent.
    // AGENT mode: everything goes to the agent.
    if ((forceSql || !agentMode) && looksLikeSql(q)) {
      try {
        const tables = buildTables(getEvents())
        const res = runQuery(q, tables)
        push({ kind: 'rows', columns: res.columns, rows: res.rows.slice(0, 40), total: res.rows.length, boot: isBoot })
      } catch (e) {
        if (e instanceof SqlError) push({ kind: 'err', text: e.message, hint: e.hint })
        else push({ kind: 'err', text: 'query failed', hint: String(e.message || e).slice(0, 120) })
      }
      return
    }

    // natural language → the live agent
    const id = 'a' + Math.random().toString(36).slice(2, 9)
    setBusy(true)
    push({ id, kind: 'agent', text: '', streaming: true })
    try {
      const res = await fetch(agentUrl(), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: q }] }),
      })
      const ct = res.headers.get('content-type') || ''
      if (ct.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader(); const dec = new TextDecoder()
        let acc = '', buf = ''
        for (;;) {
          const { done, value } = await reader.read(); if (done) break
          buf += dec.decode(value, { stream: true })
          const lines = buf.split('\n'); buf = lines.pop()
          for (const line of lines) {
            const s = line.trim()
            if (!s.startsWith('data:')) continue
            const data = s.slice(5).trim()
            if (!data || data === '[DONE]') continue
            try {
              const d = JSON.parse(data).choices?.[0]?.delta?.content
              if (d) { acc += d; patch(id, { text: acc, streaming: true }) }
            } catch {}
          }
        }
        patch(id, { text: acc || '…', streaming: false })
      } else {
        patch(id, { text: 'Agent offline here — try a SQL query, or email rithvik.illandula@gmail.com.', streaming: false })
      }
    } catch {
      patch(id, { text: 'Agent unreachable — try a SQL query instead.', streaming: false })
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(e) {
    e.preventDefault()
    if (busy) return
    const q = input
    setInput('')
    exec(q)
  }

  const tables = buildTables(getEvents())

  return (
    <div className="wh" ref={rootRef}>
      <div className="wh-schema" aria-label="Warehouse schema">
        <p className="wh-schema-h">schema</p>
        {Object.entries(tables).map(([name, t]) => (
          <button key={name} type="button" className="wh-table" disabled={busy} onClick={() => exec(`SELECT * FROM ${name} LIMIT 10`, false, true)}>
            <span className="wh-table-name">{name}</span>
            <span className="wh-table-note">{t.note}</span>
          </button>
        ))}
      </div>

      <div className="wh-term">
        <div className="wh-bar">
          <span className="wh-title">warehouse — {typeof window !== 'undefined' ? getSessionId() : 'visitor'}@rithvik.pipeline</span>
          <span className="wh-mode">
            <span className={`wh-mode-label ${!agentMode ? 'on' : ''}`}>SQL</span>
            <button type="button" className="wh-switch" data-on={agentMode ? '1' : '0'} role="switch" aria-checked={agentMode}
              aria-label="Route input to the AI agent instead of the SQL engine" onClick={() => setAgentMode((m) => !m)}><i /></button>
            <span className={`wh-mode-label ${agentMode ? 'on' : ''}`}>AGENT</span>
          </span>
        </div>

        <div className="wh-scroll" ref={scrollRef} data-lenis-prevent role="log" aria-live="polite" aria-label="Query results" tabIndex={0}>
          <p className="wh-motd">
            -- You just travelled my pipeline. Everything you did on the way is now data.
            <br />-- Query <b>yourself</b>: your session is in <code>visit.events</code>. Or ask in plain English — my agent answers.
          </p>
          {history.map((h, i) => {
            if (h.kind === 'q') return <p key={i} className="wh-q"><span className="wh-prompt">{'>'}</span> {h.text}</p>
            if (h.kind === 'err') return <div key={i} className="wh-err"><p>ERROR: {h.text}</p>{h.hint && <p className="wh-hint">{h.hint}</p>}</div>
            if (h.kind === 'agent') return <p key={i} className={`wh-agent ${h.streaming ? 'streaming' : ''}`}><span className="wh-agent-tag">agent</span> {h.text}{h.streaming && <span className="wh-caret" />}</p>
            if (h.kind === 'rows') {
              return (
                <div key={i} className="wh-result">
                  <table>
                    <thead><tr>{h.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                    <tbody>
                      {h.rows.map((r, ri) => (
                        <tr key={ri} style={{ animationDelay: `${Math.min(ri * 45, 500)}ms` }}>
                          {h.columns.map((c) => <td key={c}>{r[c] === null || r[c] === undefined ? '∅' : String(r[c])}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="wh-rowcount">{h.total} row{h.total === 1 ? '' : 's'}{h.total > 40 ? ' (showing 40)' : ''}</p>
                </div>
              )
            }
            return null
          })}
        </div>

        <form className="wh-input" onSubmit={onSubmit}>
          <span className="wh-prompt">{'>'}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={agentMode ? "Ask my agent anything about Rithvik…" : "SELECT * FROM visit.events — or ask in plain English"}
            aria-label="SQL query or question"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" disabled={busy}>run</button>
        </form>

        <div className="wh-chips">
          {SUGGESTED.map((s) => (
            <button key={s.label} type="button" disabled={busy} onClick={() => exec(s.sql, false, true)}>{s.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
