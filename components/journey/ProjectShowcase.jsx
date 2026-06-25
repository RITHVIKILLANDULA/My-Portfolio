'use client'

import { useState } from 'react'
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'

const A = '#6366f1', I = '#4a4a72'

const PROJECTS = [
  { title: 'Telco Customer Churn', type: 'Machine Learning', metric: '500K+', metricLabel: 'records',
    desc: 'Churn models with Logistic Regression, XGBoost, and Random Forest over 500,000+ customer records — surfacing behavioral drivers and shipping a web app for churn-risk insights.',
    tech: ['Python', 'XGBoost', 'Random Forest', 'scikit-learn'], link: 'https://github.com/RITHVIKILLANDULA', accent: A, star: 1 },
  { title: 'Citi Bike Demand', type: 'Forecasting', metric: '1M+', metricLabel: 'trips',
    desc: 'End-to-end ML pipeline forecasting hourly demand with LightGBM over a million-plus trips — 20+ MLflow experiments, a 12–15% MAE improvement, and Streamlit dashboards.',
    tech: ['LightGBM', 'Pandas', 'MLflow', 'Streamlit'], link: 'https://github.com/RITHVIKILLANDULA', accent: I },
  { title: 'PDF-Insight RAG', type: 'GenAI · LLM', metric: 'RAG', metricLabel: 'assistant',
    desc: 'Retrieval-augmented Q&A assistant: upload PDFs and ask — text embedded with OpenAI embeddings, stored in FAISS, answered by Gemini-Pro, orchestrated end to end with LangChain.',
    tech: ['LangChain', 'FAISS', 'OpenAI', 'Gemini'], link: 'https://github.com/RITHVIKILLANDULA', accent: A, star: 1 },
  { title: 'Data Quality Pipeline', type: 'Data Engineering', metric: '6+', metricLabel: 'checks',
    desc: 'Profiling rules, statistical thresholds, and anomaly detection flag missing values, duplicates, volume spikes, and abnormal time-series patterns before they ever reach reporting.',
    tech: ['Python', 'SQL', 'Anomaly Detection'], link: 'https://github.com/RITHVIKILLANDULA', accent: I },
  { title: 'BigQuery ML Analytics', type: 'Cloud · MLOps', metric: 'GCP', metricLabel: 'pipeline',
    desc: 'A GCP analytics pipeline profiling customer behavior and preparing reporting-ready insights with BigQuery ML and Vertex AI — orchestrated with Airflow and PySpark.',
    tech: ['BigQuery ML', 'Vertex AI', 'Airflow', 'PySpark'], link: 'https://github.com/RITHVIKILLANDULA', accent: A },
  { title: 'GenAI & NLP Toolkit', type: 'NLP', metric: 'NLP', metricLabel: 'toolkit',
    desc: 'Summarization & sentiment with Hugging Face Transformers, a Fake-News classifier (NLTK · TF-IDF), and WeatherWise — human-like forecasts via the OpenWeather + OpenAI APIs.',
    tech: ['Transformers', 'NLTK', 'TF-IDF', 'OpenAI'], link: 'https://github.com/RITHVIKILLANDULA', accent: I },
]

export default function ProjectShowcase() {
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const n = PROJECTS.length
  const p = PROJECTS[idx]

  const go = (d) => { setDir(d); setIdx((x) => (x + d + n) % n) }
  const jump = (i) => { setDir(i > idx ? 1 : -1); setIdx(i) }

  return (
    <div className="ps">
      <div className="ps-head">
        <span className="ps-count"><b style={{ color: p.accent }}>{String(idx + 1).padStart(2, '0')}</b> / {String(n).padStart(2, '0')}</span>
        <span className="ps-title-label">Selected Projects</span>
      </div>

      <div className="ps-stage">
        <article className="ps-card" key={idx} style={{ '--accent': p.accent, '--enter': dir > 0 ? '70px' : '-70px' }}>
          <div className="ps-visual">
            <span className="ps-type" style={{ color: p.accent, borderColor: p.accent }}>{p.star ? '★ ' : ''}{p.type}</span>
            <p className="ps-metric">{p.metric}<small>{p.metricLabel}</small></p>
            <div className="ps-bars">{[0, 1, 2, 3].map(b => <i key={b} style={{ animationDelay: `${0.25 + b * 0.09}s`, background: b % 2 ? I : p.accent }} />)}</div>
            <span className="ps-watermark" aria-hidden>{String(idx + 1).padStart(2, '0')}</span>
          </div>

          <div className="ps-body">
            <h3 className="ps-name">{p.title}</h3>
            <p className="ps-desc">{p.desc}</p>
            <div className="ps-tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div>
            <div className="ps-actions">
              <button className="ps-btn jr-mag" onClick={() => window.dispatchEvent(new CustomEvent('journey-ask', { detail: `Tell me about the ${p.title} project` }))}>Ask my AI ✦</button>
              <a className="ps-btn ghost jr-mag" href={p.link} target="_blank" rel="noopener noreferrer">Visit <FiArrowUpRight /></a>
            </div>
          </div>
        </article>
      </div>

      <div className="ps-nav">
        <button className="ps-arrow jr-mag" onClick={() => go(-1)} aria-label="Previous project"><FiArrowLeft /></button>
        <div className="ps-dots">{PROJECTS.map((_, i) => <button key={i} className={`ps-dot ${i === idx ? 'on' : ''}`} onClick={() => jump(i)} aria-label={`Project ${i + 1}`} />)}</div>
        <button className="ps-arrow jr-mag" onClick={() => go(1)} aria-label="Next project"><FiArrowRight /></button>
      </div>

      <style jsx>{`
        .ps { width: min(680px, 86vw); }
        .ps-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.8rem; }
        .ps-count { font-size: 0.9rem; font-variant-numeric: tabular-nums; color: rgba(237,237,237,0.6); letter-spacing: 0.1em; }
        .ps-count b { font-size: 1.1rem; }
        .ps-title-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(237,237,237,0.4); }

        .ps-stage { position: relative; }
        .ps-card { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 1.4rem; align-items: stretch;
          background: rgba(10,9,14,0.66); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 1.1rem; padding: 1.4rem; animation: psIn 0.62s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes psIn { from { opacity: 0; transform: translateX(var(--enter)) scale(0.965); } to { opacity: 1; transform: none; } }

        .ps-visual { position: relative; overflow: hidden; border-radius: 0.8rem; padding: 1.1rem;
          background: radial-gradient(120% 120% at 20% 0%, rgba(99,102,241,0.10), transparent 60%), rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; justify-content: center; gap: 0.7rem; }
        .ps-type { align-self: flex-start; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
          border: 1px solid; border-radius: 9999px; padding: 0.25rem 0.6rem; opacity: 0.9; }
        .ps-metric { font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 800; color: #fff; line-height: 0.95; }
        .ps-metric small { display: block; font-size: 0.66rem; font-weight: 500; letter-spacing: 0.06em; color: rgba(237,237,237,0.55); margin-top: 0.3rem; text-transform: uppercase; }
        .ps-bars { display: flex; align-items: flex-end; gap: 5px; height: 34px; }
        .ps-bars i { width: 8px; height: 8px; border-radius: 2px; transform-origin: bottom; animation: psBar 0.8s cubic-bezier(0.2,0.8,0.2,1) both; }
        .ps-bars i:nth-child(1) { height: 30px; } .ps-bars i:nth-child(2) { height: 18px; } .ps-bars i:nth-child(3) { height: 34px; } .ps-bars i:nth-child(4) { height: 22px; }
        @keyframes psBar { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .ps-watermark { position: absolute; right: -0.3rem; bottom: -1.4rem; font-size: 7rem; font-weight: 800; line-height: 1;
          color: rgba(255,255,255,0.04); pointer-events: none; }

        .ps-body { display: flex; flex-direction: column; }
        .ps-name { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; color: #fff; line-height: 1.05; }
        .ps-desc { font-size: 0.9rem; line-height: 1.55; color: rgba(237,237,237,0.74); margin-top: 0.6rem; flex: 1; }
        .ps-tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.9rem; }
        .ps-tech span { font-size: 0.66rem; padding: 0.28rem 0.6rem; border-radius: 9999px; color: rgba(237,237,237,0.85);
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
        .ps-actions { display: flex; gap: 0.6rem; margin-top: 1.1rem; flex-wrap: wrap; }
        .ps-btn { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.55rem 1.1rem; border-radius: 9999px;
          font-weight: 700; font-size: 0.78rem; cursor: pointer; border: 0; text-decoration: none;
          background: var(--accent); color: #ffffff; transition: transform .2s; }
        .ps-btn:hover { transform: translateY(-2px); }
        .ps-btn.ghost { background: transparent; border: 1px solid rgba(255,255,255,0.18); color: #ededed; }

        .ps-nav { display: flex; align-items: center; justify-content: center; gap: 1.2rem; margin-top: 1rem; }
        .ps-arrow { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 9999px; cursor: pointer;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); color: #ededed; transition: all .2s; }
        .ps-arrow:hover { background: var(--accent, #6366f1); color: #ffffff; border-color: transparent; transform: scale(1.06); }
        .ps-dots { display: flex; gap: 0.5rem; }
        .ps-dot { width: 8px; height: 8px; border-radius: 9999px; border: 0; background: rgba(255,255,255,0.18); cursor: pointer; transition: all .25s; }
        .ps-dot.on { width: 22px; border-radius: 9999px; background: #6366f1; }

        @media (max-width: 680px) {
          .ps-card { grid-template-columns: 1fr; gap: 1rem; padding: 1.1rem; }
          .ps-visual { flex-direction: row; align-items: center; justify-content: space-between; }
          .ps-watermark { display: none; }
        }
      `}</style>
    </div>
  )
}
