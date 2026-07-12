// Single source of truth for portfolio content (real résumé data).
import { asset } from '@/lib/asset'

export const RESUME = asset('/Rithvik_Illandula_Resume.pdf')
export const GH = 'https://github.com/RITHVIKILLANDULA'
export const LI = 'https://www.linkedin.com/in/rithvik-illandula'
export const EMAIL = 'rithvik.illandula@gmail.com'

export const EXP = [
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

export const SKILLGROUPS = [
  { label: 'Languages & Core', items: [['Python', 1], ['SQL', 1], ['Java / C++', 0], ['R', 0]] },
  { label: 'Data Engineering', items: [['Airflow', 1], ['BigQuery', 1], ['Spark / PySpark', 1], ['Databricks', 0], ['GCP', 1], ['Snowflake', 0]] },
  { label: 'AI & LLMs', items: [['LangChain', 1], ['RAG', 1], ['Vector DBs / FAISS', 0], ['Vertex AI', 0], ['OpenAI / GPT', 0]] },
  { label: 'ML & BI', items: [['scikit-learn', 0], ['XGBoost', 1], ['LightGBM', 0], ['MLflow', 0], ['Tableau / Power BI', 0]] },
]

// flat ticker feed for marquees
export const TICKER = [
  'Python', 'SQL', 'Airflow', 'BigQuery', 'Spark', 'Databricks', 'LangChain', 'RAG',
  'FAISS', 'Vertex AI', 'XGBoost', 'MLflow', 'Tableau', 'Power BI', 'GCP', 'Snowflake',
]

export const PROJECTS = [
  { t: 'Financial Reconciliation & Audit-Trail Framework', tag: 'Finance · Data Eng', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/financial-reconciliation-framework', demo: asset('/demos/foundry/'), num: '01',
    d: 'Cross-system reconciliation over GL, bank, and AR sub-ledger — classifies every break (duplicate, timing, fee, FX, mismatch), tracks source-to-report lineage, and ships audit-ready logs before close.',
    tech: ['Python', 'SQL', 'dbt', 'SQLite'],
    cs: { problem: 'Three systems that should agree never quite do, and the breaks surface after close instead of before.',
      build: ['Pivot GL, bank, and sub-ledger onto one business key and classify every break with a documented rule cascade, with materiality kept in one Config.', 'Run the same logic two ways — a standard-library Python engine and warehouse SQL / dbt models — and prove they return identical results.', 'Emit a source-to-report lineage graph, an append-only audit log, and an HTML dashboard sorted by financial impact.'],
      metrics: [['25', 'breaks caught'], ['7', 'exception types'], ['100%', 'break recall']] } },
  { t: 'Dynamic Modeling & Scenario Toolkit', tag: 'Finance · FP&A', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/forecasting-scenario-toolkit', demo: asset('/demos/forecast/'), num: '02',
    d: 'Driver-based 12-month P&L with Base / Bull / Bear scenarios, Monte Carlo P10/P50/P90, and forecast-vs-actual variance — one engine feeding a live Excel model, a Power BI star schema, and a dashboard.',
    tech: ['Python', 'SQL', 'Excel', 'Power BI'],
    cs: { problem: 'A forecast built on a flat growth rate cannot answer what-if — change one assumption and nothing downstream moves.',
      build: ['Model the P&L bottom-up from 10 named drivers so changing any single one reprices the whole 12-month plan.', 'Add a scenario library, an ad-hoc what-if CLI, and a 5,000-trial Monte Carlo for a P10 / P50 / P90 band.', 'Feed four surfaces from one engine: a live-formula Excel workbook, a Power BI star schema, a SQLite store, and a forecast-vs-actual dashboard.'],
      metrics: [['10', 'drivers'], ['5,000', 'MC trials'], ['4', 'output surfaces']] } },
  { t: 'NetSuite AI Connector — Governed MCP Bridge', tag: 'AI · ERP Governance', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/netsuite-ai-connector', demo: asset('/demos/netsuite/'), num: '03',
    d: 'An MCP bridge that lets AI clients query live ERP data through governed tools — SuiteQL, saved searches, records — where every call inherits the permissions of the connected role and is audit-logged.',
    tech: ['Python', 'MCP', 'SQLite', 'SuiteQL'],
    cs: { problem: 'An agent answers from whatever data you give it, so it will confidently answer from data it should not touch, or at the wrong grain.',
      build: ['Ship CFO / Controller / AR / AP roles; the AI connects as a role and inherits its permissions on every call.', 'Enforce table allowlists, column masking, read-only access, and row-level scope at the database engine, so governance holds no matter what SuiteQL the AI writes.', 'Expose SuiteQL, pre-vetted saved searches, and record lookups over MCP, and log every call — allowed or denied — to an append-only audit trail.'],
      metrics: [['4', 'governed roles'], ['MCP', 'over stdio'], ['every call', 'audit-logged']] } },
  { t: 'Customer Churn Prediction', tag: 'Machine Learning', star: 1, link: GH, num: '04',
    d: 'Churn models (Logistic Regression, XGBoost, Random Forest) over 500K+ customer records — surfaced behavioral drivers and shipped a web app exposing churn-risk insights.',
    tech: ['Python', 'XGBoost', 'Random Forest', 'scikit-learn'],
    cs: { problem: 'Telcos bleed revenue to silent churn — the business needed to know who will leave and why, early enough to act.',
      build: ['Engineered features over 500K+ customer records (tenure, usage, billing, support history).', 'Trained and compared Logistic Regression, Random Forest, and XGBoost; tuned for recall on the churn class.', 'Surfaced the top behavioral drivers and shipped a web app exposing per-customer churn risk for retention teams.'],
      metrics: [['500K+', 'records'], ['3', 'models compared'], ['web app', 'shipped']] } },
  { t: 'PDF-Insight — RAG Assistant', tag: 'GenAI · LLM', star: 1, link: GH, num: '05',
    d: 'Retrieval-augmented Q&A: PDFs vectorized with OpenAI embeddings into FAISS, answered by Gemini-Pro, orchestrated end-to-end with LangChain.',
    tech: ['LangChain', 'FAISS', 'OpenAI', 'Gemini'],
    cs: { problem: 'Hunting one answer across long PDFs is slow — needed grounded Q&A over arbitrary documents.',
      build: ['Chunk + embed PDF text with OpenAI embeddings; index in FAISS for similarity search.', 'Retrieve top-k context and answer with Gemini-Pro, orchestrated end-to-end with LangChain.', 'Ground answers in the retrieved source so responses stay faithful (the same pattern that powers the agent on this site).'],
      metrics: [['RAG', 'pipeline'], ['FAISS', 'vector store'], ['LangChain', 'orchestration']] } },
  { t: 'Citi Bike Demand Forecasting', tag: 'Forecasting', star: 0, link: GH, num: '06',
    d: 'End-to-end pipeline forecasting hourly demand with LightGBM over 1M+ trips — 20+ MLflow experiments, 12–15% MAE improvement, Streamlit dashboards.',
    tech: ['LightGBM', 'MLflow', 'Pandas', 'Streamlit'],
    cs: { problem: 'Bike-share ops need accurate hourly demand forecasts to rebalance stations before they run dry.',
      build: ['Built an end-to-end pipeline over 1M+ historical trips with engineered temporal and weather features.', 'Trained LightGBM and ran 20+ MLflow experiments to tune and track every run.', 'Served forecasts and insights through Streamlit dashboards.'],
      metrics: [['1M+', 'trips'], ['12–15%', 'MAE gain'], ['20+', 'MLflow runs']] } },
  { t: 'Data Quality & Anomaly Pipeline', tag: 'Data Engineering', star: 0, link: GH, num: '07',
    d: 'Profiling rules, statistical thresholds, and anomaly detection flag missing values, duplicates, volume spikes, and abnormal time-series before they reach reporting.',
    tech: ['Python', 'SQL', 'Anomaly Detection'],
    cs: { problem: 'Bad data silently corrupts dashboards — it had to be caught before it reached the reporting layer.',
      build: ['Profiling rules + statistical thresholds over every incoming dataset.', 'Anomaly detection for missing values, duplicates, volume spikes, and abnormal time-series.', 'Flag and quarantine bad batches upstream of reporting.'],
      metrics: [['pre-report', 'gating'], ['anomaly', 'detection']] } },
  { t: 'BigQuery ML Customer Analytics', tag: 'Cloud · MLOps', star: 0, link: GH, num: '08',
    d: 'GCP analytics pipeline profiling customer behavior with BigQuery ML and Vertex AI, orchestrated with Airflow and PySpark.',
    tech: ['BigQuery ML', 'Vertex AI', 'Airflow', 'PySpark'],
    cs: { problem: 'Customer analytics needed to scale without exporting data out of the warehouse.',
      build: ['In-warehouse modeling with BigQuery ML; richer models with Vertex AI.', 'Profiled behavior and prepared reporting-ready insights.', 'Orchestrated the pipeline with Airflow and PySpark.'],
      metrics: [['GCP', 'native'], ['BigQuery ML', '+ Vertex AI']] } },
  { t: 'GenAI & NLP Toolkit', tag: 'NLP', star: 0, link: GH, num: '09',
    d: 'Summarization & sentiment with Hugging Face Transformers, a Fake-News classifier (NLTK · TF-IDF), and WeatherWise — OpenWeather + OpenAI for human-like forecasts.',
    tech: ['Transformers', 'NLTK', 'TF-IDF', 'OpenAI'],
    cs: { problem: 'A practical toolkit of NLP / GenAI utilities, end to end.',
      build: ['Summarization and sentiment with Hugging Face Transformers.', 'Fake-News classifier with NLTK + TF-IDF.', 'WeatherWise — human-like forecasts from the OpenWeather + OpenAI APIs.'],
      metrics: [['3', 'tools'], ['Transformers', '+ classic ML']] } },
]

export const IMPACT = [
  ['2h → 35m', 'nightly runtime'], ['1M+', 'records modeled'], ['80%', 'less manual review'],
  ['25+', 'datasets validated'], ['6', 'source systems'], ['40+', 'source→target maps'],
]

export const NAV = [['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'], ['Skills', 'skills'], ['Warehouse', 'warehouse'], ['Contact', 'contact']]
