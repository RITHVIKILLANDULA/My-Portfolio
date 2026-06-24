'use client'

import { useEffect, useRef, useState } from 'react'
import DataField from '@/components/visual/DataField'
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa'

/* ── animated count-up ──────────────────────────────── */
function CountUp({ to, unit = '', dur = 1100 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    let raf, start
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min(1, (t - start) / dur)
      setV(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const safety = setTimeout(() => setV(to), dur + 400)  // guarantee final value if rAF is throttled
    return () => { cancelAnimationFrame(raf); clearTimeout(safety) }
  }, [to, dur])
  return <span>{Math.round(v)}{unit}</span>
}

const IMPACT = [
  { n: 1,  unit: 'M+', label: 'records modeled',     pct: 100 },
  { n: 25, unit: '+',  label: 'datasets validated',  pct: 78 },
  { n: 6,  unit: '',   label: 'source systems',      pct: 55 },
  { n: 15, unit: '+',  label: 'dashboards shipped',  pct: 72 },
  { n: 80, unit: '%',  label: 'less manual review',  pct: 80 },
  { n: 71, unit: '%',  label: 'faster pipeline',     pct: 71 },
]
const COMPANIES = [
  { name: 'WAFU',     role: 'Data Analyst',        yr: "'20–'21" },
  { name: 'Deloitte', role: 'Analytics Engineer',  yr: "'22–'24" },
  { name: 'UB',       role: 'AI Data Analyst',     yr: "'25–'26" },
]
const CERTS = ['Google Cloud · PDE', 'Microsoft PL-300', 'Microsoft DP-700', 'Tableau']
const PROJECTS = ['Telco Churn · 500K+ records', 'Citi Bike Demand · 1M+ trips', 'PDF-Insight · RAG assistant']

export default function TourStage({ idx }) {
  return (
    <div className="stage">
      <div className="stage-bg"><DataField density={0.55} /></div>
      <div className="stage-grad" />

      <div className="scene" key={idx}>
        {idx === 0 && (
          <div className="hello">
            <div className="core"><span className="core-dot" /></div>
            <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
            <p className="hello-kicker">INITIALIZING</p>
            <p className="hello-name">Rithvik Illandula</p>
            <p className="hello-sub">Data · AI · Software Engineer</p>
          </div>
        )}

        {idx === 1 && (
          <div className="exp">
            <span className="exp-line" />
            {COMPANIES.map((c, i) => (
              <div className="exp-node" style={{ animationDelay: `${i * 0.18}s` }} key={c.name}>
                <span className="exp-dot" />
                <p className="exp-name">{c.name}</p>
                <p className="exp-role">{c.role}</p>
                <p className="exp-yr">{c.yr}</p>
              </div>
            ))}
          </div>
        )}

        {idx === 2 && (
          <div className="proj">
            <svg className="proj-chart" viewBox="0 0 320 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
                  <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                </linearGradient>
              </defs>
              <polygon className="proj-area" points="0,120 0,86 46,72 92,78 138,52 184,58 230,32 276,40 320,18 320,120" fill="url(#pg)" />
              <polyline className="proj-path" points="0,86 46,72 92,78 138,52 184,58 230,32 276,40 320,18" fill="none" stroke="#6366f1" strokeWidth="2.5" />
            </svg>
            <div className="proj-chips">
              {PROJECTS.map((p, i) => (
                <span className="proj-chip" style={{ animationDelay: `${0.4 + i * 0.2}s` }} key={p}>{p}</span>
              ))}
            </div>
          </div>
        )}

        {idx === 3 && (
          <div className="impact">
            {IMPACT.map((s, i) => (
              <div className="imp-tile" style={{ animationDelay: `${i * 0.08}s` }} key={s.label}>
                <p className="imp-val"><CountUp to={s.n} unit={s.unit} /></p>
                <p className="imp-label">{s.label}</p>
                <span className="imp-bar"><i style={{ width: `${s.pct}%`, animationDelay: `${0.2 + i * 0.08}s` }} /></span>
              </div>
            ))}
          </div>
        )}

        {idx === 4 && (
          <div className="edu">
            <div className="edu-cap">
              <svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true">
                <path d="M32 14 L60 26 L32 38 L4 26 Z" fill="#818cf8" />
                <path d="M16 31 L16 44 Q32 52 48 44 L48 31" fill="none" stroke="#6366f1" strokeWidth="3" />
                <line x1="60" y1="26" x2="60" y2="40" stroke="#818cf8" strokeWidth="2.5" />
                <circle cx="60" cy="42" r="3" fill="#6366f1" />
              </svg>
            </div>
            <p className="edu-deg">M.S. Computer Science · University at Buffalo</p>
            <p className="edu-note">3 CS degrees · ML, Deep Learning, Data-Intensive Computing</p>
            <div className="edu-certs">
              {CERTS.map((c, i) => (
                <span className="edu-cert" style={{ animationDelay: `${0.3 + i * 0.13}s` }} key={c}>{c}</span>
              ))}
            </div>
          </div>
        )}

        {idx === 5 && (
          <div className="talk">
            <a className="talk-node" href="mailto:rithvik.illandula@gmail.com" style={{ animationDelay: '0s' }}><FaEnvelope /><span>Email</span></a>
            <a className="talk-node" href="https://linkedin.com/in/rithvik-illandula" target="_blank" rel="noopener noreferrer" style={{ animationDelay: '0.15s' }}><FaLinkedinIn /><span>LinkedIn</span></a>
            <a className="talk-node" href="https://github.com/RITHVIKILLANDULA" target="_blank" rel="noopener noreferrer" style={{ animationDelay: '0.3s' }}><FaGithub /><span>GitHub</span></a>
          </div>
        )}
      </div>

      <style jsx>{`
        .stage { position: relative; height: 232px; border-radius: 0.9rem; overflow: hidden;
          background: radial-gradient(120% 120% at 50% 0%, #131316, #09090B 70%); border: 1px solid rgba(255,255,255,0.06); }
        .stage-bg { position: absolute; inset: 0; opacity: 0.7; }
        .stage-grad { position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(90% 80% at 50% 30%, transparent 40%, rgba(9,9,11,0.7) 100%); }
        .scene { position: absolute; inset: 0; display: grid; place-content: center; place-items: center; text-align: center; padding: 1rem 1.2rem; }

        /* Hello */
        .hello { position: relative; }
        .core { width: 18px; height: 18px; margin: 0 auto 0.7rem; border-radius: 9999px;
          background: radial-gradient(circle, #a5b0fb, #6366f1); box-shadow: 0 0 24px rgba(99,102,241,0.8);
          animation: pop 0.6s cubic-bezier(0.2,1.4,0.4,1) both; }
        .core-dot { display: block; width: 100%; height: 100%; border-radius: inherit; animation: pulse 1.6s ease-in-out infinite; }
        .ring { position: absolute; left: 50%; top: 9px; border-radius: 9999px; border: 1px solid rgba(99,102,241,0.5);
          transform: translate(-50%,-50%); animation: ripple 2.6s ease-out infinite; }
        .ring.r1 { width: 60px; height: 60px; } .ring.r2 { width: 60px; height: 60px; animation-delay: 0.9s; } .ring.r3 { width: 60px; height: 60px; animation-delay: 1.8s; }
        .hello-kicker { font-size: 0.55rem; letter-spacing: 0.3em; color: #818cf8; animation: rise 0.5s both 0.2s; }
        .hello-name { font-size: 1.5rem; font-weight: 800; color: #fff; margin-top: 0.2rem; animation: rise 0.6s both 0.35s; }
        .hello-sub { font-size: 0.72rem; color: rgba(237,237,237,0.6); letter-spacing: 0.12em; margin-top: 0.25rem; animation: rise 0.6s both 0.5s; }

        /* Experience */
        .exp { position: relative; display: flex; gap: 0.6rem; align-items: stretch; width: 100%; max-width: 460px; }
        .exp-line { position: absolute; top: 12px; left: 8%; right: 8%; height: 2px; transform-origin: left;
          background: linear-gradient(90deg, rgba(99,102,241,0.2), #6366f1, rgba(124,120,240,0.6)); animation: draw 0.8s ease both; }
        .exp-node { flex: 1; animation: rise 0.6s both; }
        .exp-dot { display: block; width: 11px; height: 11px; border-radius: 9999px; margin: 7px auto 0.6rem;
          background: #6366f1; box-shadow: 0 0 12px rgba(99,102,241,0.9); }
        .exp-name { font-size: 0.95rem; font-weight: 800; color: #fff; }
        .exp-role { font-size: 0.62rem; color: rgba(237,237,237,0.65); margin-top: 0.1rem; }
        .exp-yr { font-size: 0.6rem; color: #818cf8; margin-top: 0.15rem; font-variant-numeric: tabular-nums; }

        /* Projects */
        .proj { width: 100%; max-width: 420px; }
        .proj-chart { width: 100%; height: 96px; }
        .proj-path { stroke-dasharray: 600; stroke-dashoffset: 600; animation: dash 1.3s ease forwards; filter: drop-shadow(0 0 6px rgba(99,102,241,0.6)); }
        .proj-area { opacity: 0; animation: fade 0.8s ease forwards 0.8s; }
        .proj-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-top: 0.6rem; }
        .proj-chip { font-size: 0.64rem; color: #ededed; background: rgba(255,255,255,0.06); border: 1px solid rgba(99,102,241,0.3);
          border-radius: 9999px; padding: 0.3rem 0.65rem; animation: rise 0.5s both; }

        /* Impact */
        .impact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.55rem 0.9rem; width: 100%; max-width: 480px; }
        .imp-tile { animation: rise 0.5s both; text-align: left; }
        .imp-val { font-size: 1.35rem; font-weight: 800; color: #fff; line-height: 1; font-variant-numeric: tabular-nums; }
        .imp-label { font-size: 0.56rem; color: rgba(237,237,237,0.6); margin-top: 0.15rem; }
        .imp-bar { display: block; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.1); margin-top: 0.3rem; }
        .imp-bar i { display: block; height: 100%; border-radius: 2px; transform: scaleX(0); transform-origin: left;
          background: linear-gradient(90deg, #6366f1, #818cf8); animation: growx 0.9s cubic-bezier(0.2,0.8,0.2,1) both; }

        /* Education */
        .edu { max-width: 460px; }
        .edu-cap { animation: pop 0.6s cubic-bezier(0.2,1.4,0.4,1) both; filter: drop-shadow(0 0 10px rgba(99,102,241,0.5)); }
        .edu-deg { font-size: 0.92rem; font-weight: 700; color: #fff; margin-top: 0.5rem; animation: rise 0.5s both 0.2s; }
        .edu-note { font-size: 0.64rem; color: rgba(237,237,237,0.6); margin-top: 0.2rem; animation: rise 0.5s both 0.32s; }
        .edu-certs { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-top: 0.6rem; }
        .edu-cert { font-size: 0.6rem; color: #818cf8; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3);
          border-radius: 9999px; padding: 0.28rem 0.6rem; animation: rise 0.5s both; }

        /* Let's talk */
        .talk { display: flex; gap: 1.4rem; }
        .talk-node { display: grid; place-items: center; gap: 0.45rem; color: #ededed; text-decoration: none; animation: pop 0.6s cubic-bezier(0.2,1.4,0.4,1) both; }
        .talk-node :global(svg) { width: 22px; height: 22px; padding: 14px; border-radius: 9999px;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.4); color: #818cf8; box-sizing: content-box;
          transition: all 0.2s; }
        .talk-node:hover :global(svg) { background: rgba(99,102,241,0.25); transform: translateY(-3px); }
        .talk-node span { font-size: 0.62rem; color: rgba(237,237,237,0.7); }

        @keyframes rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes pop { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes fade { to { opacity: 1; } }
        @keyframes draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes growx { to { transform: scaleX(1); } }
        @keyframes ripple { 0% { width: 24px; height: 24px; opacity: 0.7; } 100% { width: 150px; height: 150px; opacity: 0; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.25); } }

        @media (max-width: 520px) {
          .stage { height: 200px; }
          .impact { gap: 0.4rem 0.6rem; }
          .imp-val { font-size: 1.1rem; }
          .hello-name { font-size: 1.2rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .core-dot, .ring { animation: none !important; }
          .ring { display: none; }
        }
      `}</style>
    </div>
  )
}
