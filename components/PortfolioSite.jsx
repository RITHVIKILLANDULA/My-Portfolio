'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { FaGithub, FaLinkedinIn, FaEnvelope } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload, FiHeadphones } from 'react-icons/fi'
import profile from '@/data/profile.json'

const RESUME = '/Rithvik_Illandula_Resume.pdf'
const GH = 'https://github.com/RITHVIKILLANDULA'
const LI = 'https://www.linkedin.com/in/rithvik-illandula'

const EXP = [
  {
    role: 'AI Data Analyst', co: 'University at Buffalo', loc: 'Buffalo, NY', period: 'Feb 2025 — May 2026',
    star: '2h → 35m nightly runtime',
    bullets: [
      'Built Python / SQL / Airflow / BigQuery pipelines over 25+ operational & research datasets — collect, cleanse, validate, prepare.',
      'Defined 5 recurring data-quality controls: completeness, duplicates, schema drift, late files, exception trends.',
      'Partitioned BigQuery tables + tuned recurring SQL — cut nightly processing 2h → 35m with full audit & recovery.',
    ],
    tech: ['Python', 'SQL', 'Airflow', 'BigQuery', 'R', 'Pandas'],
  },
  {
    role: 'Data Analytics Engineer', co: 'Deloitte', loc: 'India', period: 'Jan 2022 — Dec 2024',
    star: '80% less manual review',
    bullets: [
      'Engineered TV / media data from 6 source systems with Python, SQL, Spark, Databricks, and Airflow for client reporting.',
      'Shipped 15+ Tableau & Power BI dashboards — audience segments, campaign KPIs, delayed events, data completeness.',
      'Documented 40+ source-to-target mappings + reconciliation & data-quality rules — cut manual review effort by 80%.',
    ],
    tech: ['Python', 'SQL', 'Spark', 'Databricks', 'Tableau', 'Power BI'],
  },
  {
    role: 'Data Analyst', co: 'WAFU Technologies', loc: 'India', period: 'Dec 2020 — Aug 2021',
    star: '4 client applications',
    bullets: [
      'Analyzed adtech event, campaign, transaction, order & inventory data across 4 client applications (SQL, Python, NoSQL).',
      'Built monitoring over 5 exception categories: event mismatches, order issues, rejects, inventory gaps, recurring failures.',
      'Modeled 6+ reporting tables + optimized MySQL for agency reporting and campaign visibility.',
    ],
    tech: ['SQL', 'Python', 'NoSQL', 'MySQL'],
  },
]

const SKILLGROUPS = [
  { label: 'Languages & Core', items: [['Python', 1], ['SQL', 1], ['Java / C++', 0], ['R', 0]] },
  { label: 'Data Engineering', items: [['Airflow', 1], ['BigQuery', 1], ['Spark / PySpark', 1], ['Databricks', 0], ['GCP', 1], ['Snowflake', 0]] },
  { label: 'AI & LLMs', items: [['LangChain', 1], ['RAG', 1], ['Vector DBs / FAISS', 0], ['Vertex AI', 0], ['OpenAI / GPT', 0]] },
  { label: 'ML & BI', items: [['scikit-learn', 0], ['XGBoost', 1], ['LightGBM', 0], ['MLflow', 0], ['Tableau / Power BI', 0]] },
]

const PROJECTS = [
  { t: 'Customer Churn Prediction', tag: 'Machine Learning', star: 1, link: GH,
    d: 'Churn models (Logistic Regression, XGBoost, Random Forest) over 500K+ customer records — surfaced behavioral drivers and shipped a web app exposing churn-risk insights.',
    tech: ['Python', 'XGBoost', 'Random Forest', 'scikit-learn'] },
  { t: 'PDF-Insight — RAG Assistant', tag: 'GenAI · LLM', star: 1, link: GH,
    d: 'Retrieval-augmented Q&A: PDFs vectorized with OpenAI embeddings into FAISS, answered by Gemini-Pro, orchestrated end-to-end with LangChain.',
    tech: ['LangChain', 'FAISS', 'OpenAI', 'Gemini'] },
  { t: 'Citi Bike Demand Forecasting', tag: 'Forecasting', star: 0, link: GH,
    d: 'End-to-end pipeline forecasting hourly demand with LightGBM over 1M+ trips — 20+ MLflow experiments, 12–15% MAE improvement, Streamlit dashboards.',
    tech: ['LightGBM', 'MLflow', 'Pandas', 'Streamlit'] },
  { t: 'Data Quality & Anomaly Pipeline', tag: 'Data Engineering', star: 0, link: GH,
    d: 'Profiling rules, statistical thresholds, and anomaly detection flag missing values, duplicates, volume spikes, and abnormal time-series before they reach reporting.',
    tech: ['Python', 'SQL', 'Anomaly Detection'] },
  { t: 'BigQuery ML Customer Analytics', tag: 'Cloud · MLOps', star: 0, link: GH,
    d: 'GCP analytics pipeline profiling customer behavior with BigQuery ML and Vertex AI, orchestrated with Airflow and PySpark.',
    tech: ['BigQuery ML', 'Vertex AI', 'Airflow', 'PySpark'] },
  { t: 'GenAI & NLP Toolkit', tag: 'NLP', star: 0, link: GH,
    d: 'Summarization & sentiment with Hugging Face Transformers, a Fake-News classifier (NLTK · TF-IDF), and WeatherWise — OpenWeather + OpenAI for human-like forecasts.',
    tech: ['Transformers', 'NLTK', 'TF-IDF', 'OpenAI'] },
]

const IMPACT = [
  ['2h → 35m', 'nightly runtime'], ['1M+', 'records modeled'], ['80%', 'less manual review'],
  ['25+', 'datasets validated'], ['6', 'source systems'], ['40+', 'source→target maps'],
]

const NAV = [['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'], ['Skills', 'skills'], ['Contact', 'contact']]

export default function PortfolioSite() {
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const jump = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }

  return (
    <div className="site">
      {/* NAV */}
      <header className="nav">
        <a href="#top" className="brand" onClick={jump('top')}>Rithvik Illandula</a>
        <nav className="nav-links">
          {NAV.map(([l, id]) => <a key={id} href={`#${id}`} onClick={jump(id)}>{l}</a>)}
        </nav>
        <div className="nav-cta">
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn sm"><FiDownload size={13} /> Résumé</a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="hero">
        <p className="kicker reveal"><span className="dot" /> Open to work · open to relocation across the U.S.</p>
        <h1 className="reveal">Rithvik<br />Illandula</h1>
        <p className="role reveal">Data Engineer&nbsp;·&nbsp;AI / ML Engineer&nbsp;·&nbsp;Software Engineer</p>
        <p className="lead reveal">{profile.bio.split('Three CS degrees')[0].trim()}</p>

        <form className="ask reveal" onSubmit={(e) => { e.preventDefault(); const v = e.currentTarget.q.value.trim(); if (v) { window.dispatchEvent(new CustomEvent('journey-ask', { detail: v })); e.currentTarget.reset() } }}>
          <span className="ask-spark">✦</span>
          <input name="q" placeholder="Ask my AI anything about my work…" aria-label="Ask the AI assistant about Rithvik" autoComplete="off" />
          <button type="submit">Ask</button>
        </form>
        <div className="ask-chips reveal">
          {["What's the hardest system he shipped?", 'Does he know RAG & LLMs?', "What's his biggest measurable impact?"].map((c) => (
            <button key={c} onClick={() => window.dispatchEvent(new CustomEvent('journey-ask', { detail: c }))}>{c}</button>
          ))}
        </div>

        <div className="hero-cta reveal">
          <a href={`mailto:${profile.email}`} className="btn">Email me</a>
          <a href={RESUME} target="_blank" rel="noopener noreferrer" className="btn ghost"><FiDownload size={14} /> Download résumé</a>
          <button className="btn ghost" onClick={() => window.dispatchEvent(new CustomEvent('start-audio-tour'))}><FiHeadphones size={14} /> Audio tour</button>
        </div>
        <div className="hero-stats reveal">
          {profile.stats.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
        </div>
        <div className="hero-socials reveal">
          <a href={GH} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href={LI} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
          <a href={`mailto:${profile.email}`} aria-label="Email"><FaEnvelope /></a>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="block">
        <p className="sec-idx reveal">01 — About</p>
        <div className="about-grid">
          <div className="about-photo reveal">
            <Image src="/assets/portrait.png" alt="Rithvik Illandula" width={420} height={520} className="photo" />
          </div>
          <div className="about-body">
            <h2 className="reveal">I build across the whole stack of data &amp; AI.</h2>
            <p className="reveal">{profile.bio}</p>
            <p className="reveal muted">Currently finishing an M.S. in Computer Science at the University at Buffalo — my third CS degree. Certified: Google Cloud Professional Data Engineer, Microsoft PL-300 (Power BI) and DP-700 (Fabric), Tableau Desktop.</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="block">
        <p className="sec-idx reveal">02 — Experience</p>
        <h2 className="sec-h reveal">Where I&apos;ve shipped.</h2>
        <div className="exp">
          {EXP.map((e) => (
            <article key={e.co} className="exp-item reveal">
              <div className="exp-l">
                <p className="exp-period">{e.period}</p>
                <p className="exp-loc">{e.loc}</p>
              </div>
              <div className="exp-r">
                <h3>{e.role} <span className="exp-co">· {e.co}</span></h3>
                <span className="star">★ {e.star}</span>
                <ul>{e.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                <div className="tags">{e.tech.map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="block">
        <p className="sec-idx reveal">03 — Projects</p>
        <h2 className="sec-h reveal">Selected work.</h2>
        <div className="proj-grid">
          {PROJECTS.map((p) => (
            <a key={p.t} href={p.link} target="_blank" rel="noopener noreferrer" className={`proj-card reveal ${p.star ? 'star' : ''}`}>
              <div className="proj-top">
                <span className="proj-tag">{p.star ? '★ ' : ''}{p.tag}</span>
                <FiArrowUpRight className="proj-arrow" />
              </div>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
              <div className="tags">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="block">
        <p className="sec-idx reveal">04 — Skills</p>
        <h2 className="sec-h reveal">What I build with. <span className="note">★ core strengths</span></h2>
        <div className="skills">
          {SKILLGROUPS.map((g) => (
            <div key={g.label} className="skill-group reveal">
              <p className="skill-label">{g.label}</p>
              <div className="skill-chips">
                {g.items.map(([n, s]) => <span key={n} className={s ? 'chip star' : 'chip'}>{s ? '★ ' : ''}{n}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div className="impact reveal">
          {IMPACT.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="block contact">
        <p className="sec-idx reveal">05 — Contact</p>
        <h2 className="big reveal">Let&apos;s build something.</h2>
        <p className="lead reveal">Open to Data, AI / ML, and Software Engineering roles — Buffalo or relocating across the U.S.</p>
        <div className="hero-cta reveal">
          <a href={`mailto:${profile.email}`} className="btn">{profile.email}</a>
          <a href={GH} target="_blank" rel="noopener noreferrer" className="btn ghost"><FaGithub size={14} /> GitHub</a>
          <a href={LI} target="_blank" rel="noopener noreferrer" className="btn ghost"><FaLinkedinIn size={14} /> LinkedIn</a>
        </div>
        <footer className="foot">© {new Date().getFullYear()} Rithvik Illandula · Built with Next.js</footer>
      </section>

      <style jsx>{`
        .site { background: #09090B; color: #EDEDED; font-feature-settings: 'ss01'; }
        :global(html) { scroll-behavior: smooth; }
        a { color: inherit; text-decoration: none; }

        .nav { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem clamp(1.2rem, 5vw, 4rem); background: rgba(9,9,11,0.72); backdrop-filter: blur(12px); border-bottom: 1px solid #18181B; }
        .brand { font-weight: 650; letter-spacing: -0.01em; }
        .nav-links { display: flex; gap: 1.6rem; }
        .nav-links a { font-size: 0.85rem; color: #A1A1AA; transition: color .2s; }
        .nav-links a:hover { color: #EDEDED; }
        @media (max-width: 720px) { .nav-links { display: none; } }

        .btn { display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.6rem 1.1rem; border-radius: 8px;
          font-size: 0.85rem; font-weight: 600; background: #6366F1; color: #fff; border: 0; cursor: pointer; transition: all .2s; }
        .btn:hover { background: #4F46E5; transform: translateY(-1px); }
        .btn.ghost { background: transparent; border: 1px solid #27272A; color: #EDEDED; }
        .btn.ghost:hover { border-color: #6366F1; color: #A5B0FB; background: rgba(99,102,241,0.06); }
        .btn.sm { padding: 0.42rem 0.85rem; font-size: 0.8rem; }

        section { max-width: 1100px; margin: 0 auto; padding: 0 clamp(1.2rem, 5vw, 4rem); }
        .hero { min-height: 92vh; display: flex; flex-direction: column; justify-content: center; padding-top: 4rem; padding-bottom: 3rem; }
        .kicker { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #A1A1AA; margin-bottom: 1.4rem; }
        .dot { width: 7px; height: 7px; border-radius: 9999px; background: #34D399; box-shadow: 0 0 8px #34D399; }
        .hero h1 { font-size: clamp(3rem, 9vw, 6.5rem); font-weight: 640; line-height: 0.92; letter-spacing: -0.035em; color: #fff; }
        .role { font-size: clamp(1.05rem, 2.4vw, 1.5rem); color: #818CF8; font-weight: 600; margin-top: 1.1rem; letter-spacing: -0.01em; }
        .lead { font-size: clamp(1rem, 1.5vw, 1.18rem); color: #A1A1AA; line-height: 1.65; max-width: 60ch; margin-top: 1.2rem; }
        .ask { display: flex; align-items: center; gap: 0.6rem; max-width: 540px; margin-top: 1.9rem;
          background: #131316; border: 1px solid #27272A; border-radius: 12px; padding: 0.5rem 0.55rem 0.5rem 0.95rem; transition: border-color .2s, box-shadow .2s; }
        .ask:focus-within { border-color: #6366F1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .ask-spark { color: #818CF8; }
        .ask input { flex: 1; background: transparent; border: 0; outline: none; color: #EDEDED; font-size: 0.95rem; }
        .ask input::placeholder { color: #71717A; }
        .ask button { background: #6366F1; color: #fff; border: 0; border-radius: 8px; padding: 0.5rem 1.1rem; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: background .2s; }
        .ask button:hover { background: #4F46E5; }
        .ask-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.85rem; }
        .ask-chips button { background: transparent; border: 1px solid #27272A; color: #A1A1AA; border-radius: 9999px; padding: 0.35rem 0.85rem; font-size: 0.78rem; cursor: pointer; transition: all .2s; }
        .ask-chips button:hover { border-color: #6366F1; color: #A5B0FB; }
        .hero-cta { display: flex; flex-wrap: wrap; gap: 0.7rem; margin-top: 1.8rem; }
        .hero-stats { display: flex; gap: 2.8rem; margin-top: 2.4rem; }
        .hero-stats b { font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 700; color: #fff; display: block; line-height: 1; }
        .hero-stats span { font-size: 0.74rem; color: #71717A; }
        .hero-socials { display: flex; gap: 1.1rem; margin-top: 2rem; font-size: 1.15rem; color: #71717A; }
        .hero-socials a:hover { color: #818CF8; }

        .block { padding-top: clamp(4rem, 10vw, 7rem); padding-bottom: clamp(2rem, 5vw, 4rem); }
        .sec-idx { font-family: ui-monospace, monospace; font-size: 0.8rem; color: #6366F1; margin-bottom: 1rem; letter-spacing: 0.04em; }
        .sec-h { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 650; letter-spacing: -0.02em; color: #fff; margin-bottom: 2.2rem; }
        .sec-h .note { font-size: 0.7rem; color: #818CF8; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; margin-left: 0.6rem; vertical-align: middle; }
        h2 { font-size: clamp(1.6rem, 3.4vw, 2.2rem); font-weight: 650; letter-spacing: -0.02em; color: #fff; }

        .about-grid { display: grid; grid-template-columns: 320px 1fr; gap: 3rem; align-items: start; }
        .about-photo .photo { width: 100%; height: auto; border-radius: 14px; border: 1px solid #27272A; filter: grayscale(0.15) contrast(1.02); }
        .about-body h2 { margin-bottom: 1.1rem; }
        .about-body p { color: #A1A1AA; line-height: 1.75; font-size: 1rem; margin-bottom: 1rem; max-width: 62ch; }
        .about-body p.muted { color: #71717A; font-size: 0.92rem; }
        @media (max-width: 760px) { .about-grid { grid-template-columns: 1fr; gap: 1.6rem; } .about-photo { max-width: 240px; } }

        .exp { display: flex; flex-direction: column; }
        .exp-item { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; padding: 2rem 0; border-top: 1px solid #18181B; }
        .exp-item:first-child { border-top: 0; }
        .exp-period { font-size: 0.82rem; color: #EDEDED; font-variant-numeric: tabular-nums; font-weight: 600; }
        .exp-loc { font-size: 0.78rem; color: #71717A; margin-top: 0.25rem; }
        .exp-r h3 { font-size: 1.15rem; font-weight: 650; color: #fff; }
        .exp-co { color: #818CF8; font-weight: 600; }
        .star { display: inline-block; margin: 0.6rem 0 0.7rem; font-size: 0.74rem; font-weight: 700; color: #818CF8;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.3); border-radius: 9999px; padding: 0.22rem 0.7rem; }
        .exp-r ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .exp-r li { color: #A1A1AA; font-size: 0.92rem; line-height: 1.55; padding-left: 1.1rem; position: relative; }
        .exp-r li::before { content: '—'; position: absolute; left: 0; color: #52525B; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; }
        .tags span { font-size: 0.7rem; color: #A1A1AA; background: #131316; border: 1px solid #27272A; border-radius: 6px; padding: 0.22rem 0.55rem; }
        @media (max-width: 720px) { .exp-item { grid-template-columns: 1fr; gap: 0.8rem; } }

        .proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem; }
        .proj-card { display: flex; flex-direction: column; padding: 1.5rem; border-radius: 14px; background: #0F0F12; border: 1px solid #1C1C21; transition: all .22s; }
        .proj-card:hover { border-color: #34343b; transform: translateY(-3px); background: #131318; }
        .proj-card.star { border-color: rgba(99,102,241,0.4); }
        .proj-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .proj-tag { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #818CF8; font-weight: 700; }
        .proj-arrow { color: #52525B; transition: all .2s; }
        .proj-card:hover .proj-arrow { color: #818CF8; transform: translate(2px,-2px); }
        .proj-card h3 { font-size: 1.1rem; font-weight: 650; color: #fff; margin-bottom: 0.5rem; }
        .proj-card p { font-size: 0.88rem; color: #A1A1AA; line-height: 1.55; flex: 1; }
        @media (max-width: 720px) { .proj-grid { grid-template-columns: 1fr; } }

        .skills { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.6rem 2.6rem; }
        .skill-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: #71717A; font-weight: 700; margin-bottom: 0.7rem; }
        .skill-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .chip { font-size: 0.82rem; color: #A1A1AA; background: #131316; border: 1px solid #27272A; border-radius: 7px; padding: 0.3rem 0.65rem; }
        .chip.star { color: #EDEDED; border-color: rgba(99,102,241,0.45); background: rgba(99,102,241,0.07); font-weight: 600; }
        @media (max-width: 640px) { .skills { grid-template-columns: 1fr; } }

        .impact { display: flex; flex-wrap: wrap; gap: 2.4rem; margin-top: 3rem; padding-top: 2.2rem; border-top: 1px solid #18181B; }
        .impact b { font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 700; color: #fff; display: block; line-height: 1; letter-spacing: -0.02em; }
        .impact span { font-size: 0.74rem; color: #71717A; }

        .contact { text-align: left; padding-bottom: 5rem; }
        .big { font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 650; letter-spacing: -0.03em; color: #fff; margin: 0.6rem 0 1rem; }
        .foot { margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid #18181B; font-size: 0.78rem; color: #52525B; }

        .reveal { opacity: 0; transform: translateY(20px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
        .reveal.in { opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } :global(html) { scroll-behavior: auto; } }
      `}</style>
    </div>
  )
}
