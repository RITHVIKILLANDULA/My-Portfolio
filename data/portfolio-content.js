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
    link: 'https://github.com/RITHVIKILLANDULA/financial-reconciliation-framework', demo: asset('/demos/foundry/'), cat: 'data', num: '01',
    d: 'Cross-system reconciliation over GL, bank, and AR sub-ledger — classifies every break (duplicate, timing, fee, FX, mismatch), tracks source-to-report lineage, and ships audit-ready logs before close.',
    tech: ['Python', 'SQL', 'dbt', 'SQLite'],
    cs: { problem: 'Three systems that should agree never quite do, and the breaks surface after close instead of before.',
      build: ['Pivot GL, bank, and sub-ledger onto one business key and classify every break with a documented rule cascade, with materiality kept in one Config.', 'Run the same logic two ways — a standard-library Python engine and warehouse SQL / dbt models — and prove they return identical results.', 'Emit a source-to-report lineage graph, an append-only audit log, and an HTML dashboard sorted by financial impact.'],
      metrics: [['25', 'breaks caught'], ['7', 'exception types'], ['100%', 'break recall']] } },
  { t: 'Dynamic Modeling & Scenario Toolkit', tag: 'Finance · FP&A', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/forecasting-scenario-toolkit', demo: asset('/demos/forecast/'), cat: 'data', num: '02',
    d: 'Driver-based 12-month P&L with Base / Bull / Bear scenarios, Monte Carlo P10/P50/P90, and forecast-vs-actual variance — one engine feeding a live Excel model, a Power BI star schema, and a dashboard.',
    tech: ['Python', 'SQL', 'Excel', 'Power BI'],
    cs: { problem: 'A forecast built on a flat growth rate cannot answer what-if — change one assumption and nothing downstream moves.',
      build: ['Model the P&L bottom-up from 10 named drivers so changing any single one reprices the whole 12-month plan.', 'Add a scenario library, an ad-hoc what-if CLI, and a 5,000-trial Monte Carlo for a P10 / P50 / P90 band.', 'Feed four surfaces from one engine: a live-formula Excel workbook, a Power BI star schema, a SQLite store, and a forecast-vs-actual dashboard.'],
      metrics: [['10', 'drivers'], ['5,000', 'MC trials'], ['4', 'output surfaces']] } },
  { t: 'NetSuite AI Connector — Governed MCP Bridge', tag: 'AI · ERP Governance', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/netsuite-ai-connector', demo: asset('/demos/netsuite/'), cat: 'agentic', num: '03',
    d: 'An MCP bridge that lets AI clients query live ERP data through governed tools — SuiteQL, saved searches, records — where every call inherits the permissions of the connected role and is audit-logged.',
    tech: ['Python', 'MCP', 'SQLite', 'SuiteQL'],
    cs: { problem: 'An agent answers from whatever data you give it, so it will confidently answer from data it should not touch, or at the wrong grain.',
      build: ['Ship CFO / Controller / AR / AP roles; the AI connects as a role and inherits its permissions on every call.', 'Enforce table allowlists, column masking, read-only access, and row-level scope at the database engine, so governance holds no matter what SuiteQL the AI writes.', 'Expose SuiteQL, pre-vetted saved searches, and record lookups over MCP, and log every call — allowed or denied — to an append-only audit trail.'],
      metrics: [['4', 'governed roles'], ['MCP', 'over stdio'], ['every call', 'audit-logged']] } },
  { t: 'Customer Churn Prediction', tag: 'Machine Learning', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/customer-churn-prediction', demo: asset('/demos/churn/'), cat: 'ml', num: '04',
    d: 'Telco churn scored with logistic regression I wrote from scratch — standardized features, batch gradient descent, ROC/AUC, and lift — ranking a 4,000-customer base by risk and explaining the drivers.',
    tech: ['Python', 'Logistic Regression', 'ROC/AUC', 'From scratch'],
    cs: { problem: 'Telcos bleed revenue to silent churn, and the business needs to know who will leave and why, early enough to act.',
      build: ['Generated 4,000 deterministic synthetic customers with a hand-written churn logit over tenure, contract, payment, support calls, and demographics.', 'Trained logistic regression from scratch: per-column standardization plus full-batch gradient descent, so the coefficients double as honest driver importances.', 'Computed ROC/AUC, a confusion matrix, precision/recall/F1, and lift by decile, then rendered a 9-panel dashboard where every number comes from one live run.'],
      metrics: [['0.825', 'test AUC'], ['2.75×', 'top-decile lift'], ['4,000', 'customers scored']] } },
  { t: 'PDF-Insight — RAG Assistant', tag: 'RAG · Retrieval', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/pdf-insight-rag-assistant', demo: asset('/demos/pdf-insight/'), cat: 'rag', num: '05',
    d: 'A retrieval-augmented Q&A engine over a document corpus, built on a TF-IDF and cosine index I wrote by hand — it finds the right passage and answers with a cited sentence.',
    tech: ['Python', 'TF-IDF', 'Cosine retrieval', 'RAG'],
    cs: { problem: 'Answering a question over a document set needs a retrieval layer that finds the right passage and cites it, and I wanted to show how classic RAG retrieval works end to end without an embeddings API.',
      build: ['Built a TF-IDF index from scratch: tokenization with stopwords, smoothed IDF, tf-idf weights, and L2 normalization so cosine similarity is a plain dot product.', 'Chunked the documents by paragraph and ranked 18 chunks per query, then extracted the most on-topic sentence from the top chunk and cited it back to its source.', 'Rendered a dashboard from the real run: top-k retrieval bars, a query-by-document similarity heatmap, top-1 vs runner-up margins, and a question-to-answer table.'],
      metrics: [['TF-IDF', 'from scratch'], ['18', 'chunks · 6 docs'], ['cited', 'answers']] } },
  { t: 'Citi Bike Demand Forecasting', tag: 'Forecasting', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/citibike-demand-forecasting', demo: asset('/demos/citibike/'), cat: 'ml', num: '06',
    d: 'Hourly bike-share demand forecast with ridge regression I wrote from scratch — cyclical and weather features, closed-form normal equations, backtested on 14 held-out days against a seasonal-naive baseline.',
    tech: ['Python', 'Ridge regression', 'Time-series', 'Backtesting'],
    cs: { problem: 'Bike-share operators need hourly demand forecasts to rebalance bikes, but demand tangles commute peaks, weekday and weekend splits, weather, and trend.',
      build: ['Generated 120 days of deterministic hourly demand (2,880 hours, 1.24M trips) from a known process: trend, commute peaks, weekly seasonality, temperature, and rain.', 'Engineered cyclical hour and day-of-week features plus weather and lags, then fit ridge regression from scratch with standardization and a hand-written solver.', 'Backtested the final 14 days against a weekly seasonal-naive baseline and rendered forecast-vs-actual, residuals, an error heatmap, and feature importances.'],
      metrics: [['0.941', 'R² holdout'], ['−10%', 'MAE vs naive'], ['1.24M', 'trips modeled']] } },
  { t: 'Data Quality & Anomaly Pipeline', tag: 'Data Engineering', star: 0,
    link: 'https://github.com/RITHVIKILLANDULA/data-quality-anomaly-pipeline', demo: asset('/demos/data-quality/'), cat: 'data', num: '07',
    d: 'A pre-reporting gate that scores five daily feeds on completeness, uniqueness, validity, freshness, and z-score volume anomalies, then grades every break by severity before the numbers reach a report.',
    tech: ['Python', 'Anomaly detection', 'Statistics', 'Data quality'],
    cs: { problem: 'Bad data reaches a dashboard the same quiet way good data does, so teams need an automated gate that catches it before anything downstream trusts the numbers.',
      build: ['Built five seeded feeds over a 30-day window with injected issues: volume spikes, null bursts, duplicates, schema drift, and late files.', 'Ran five checks per feed — completeness, uniqueness, validity, freshness, and a rolling-mean z-score volume detector — all hand-rolled with no numpy or pandas.', 'Rolled the results into a dataset-by-check matrix and a severity-graded anomaly register, rendered as a seven-panel dashboard from computed values.'],
      metrics: [['76%', 'pass rate'], ['22', 'anomalies graded'], ['641K', 'rows profiled']] } },
  { t: 'BigQuery ML Customer Analytics', tag: 'Cloud · MLOps', star: 0,
    link: 'https://github.com/RITHVIKILLANDULA/bigquery-ml-customer-analytics', demo: asset('/demos/bqml/'), cat: 'data', num: '08',
    d: 'A customer-analytics pipeline — RFM, k-means, cohorts, and CLV — reproduced offline on SQLite so the logic is reviewable, with the BigQuery ML SQL and an Airflow DAG shipped as the cloud path.',
    tech: ['Python', 'SQLite', 'BigQuery ML', 'Airflow'],
    cs: { problem: 'Segmentation, CLV, and cohort retention usually need a BigQuery ML stack plus numpy and pandas, which makes the logic hard to run and review.',
      build: ['Generated deterministic synthetic transactions for about 1,500 customers over a year and computed RFM, then segmented with k-means (k=4) I wrote from scratch on standardized features.', 'Estimated CLV and built monthly acquisition cohorts with retention curves, all in the standard library on SQLite.', 'Shipped the cloud-native artifacts too: a CREATE MODEL BigQuery ML SQL script and an Airflow DAG, so the same logic maps onto the warehouse.'],
      metrics: [['4', 'RFM segments'], ['$673K', 'FY revenue'], ['k-means', 'from scratch']] } },
  { t: 'GenAI & NLP Toolkit', tag: 'NLP', star: 0,
    link: 'https://github.com/RITHVIKILLANDULA/genai-nlp-toolkit', demo: asset('/demos/nlp-toolkit/'), cat: 'rag', num: '09',
    d: 'A toolkit of classic NLP utilities written from scratch — a TextRank summarizer, a lexicon sentiment scorer, and a TF-IDF plus logistic-regression clickbait classifier — each running on sample inputs.',
    tech: ['Python', 'TF-IDF', 'Logistic Regression', 'TextRank'],
    cs: { problem: 'I wanted a compact set of NLP utilities that run end to end and show the mechanics, rather than importing a model and calling predict.',
      build: ['Built an extractive summarizer using TextRank-style sentence centrality and a lexicon-based sentiment scorer over a polarity lexicon.', 'Trained a clickbait and fake-headline classifier from scratch: TF-IDF features plus logistic regression, reporting accuracy, ROC/AUC, and a confusion matrix.', 'Added TF-IDF keyword extraction and rendered a dashboard with the ROC curve, confusion matrix, sentiment distribution, and top keywords.'],
      metrics: [['93.4%', 'classifier acc'], ['0.96', 'ROC-AUC'], ['4', 'NLP tools']] } },
  { t: 'Agentic Data Analyst', tag: 'Agentic AI', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/agentic-data-analyst', demo: asset('/demos/agentic-analyst/'), cat: 'agentic', num: '10',
    d: 'An agent that answers analytical questions over a SQLite warehouse through a plan, act, observe, reflect loop — a deterministic planner picks an intent, a guarded sql_tool runs a parameterized SELECT, and a self-check can retry.',
    tech: ['Python', 'Agent loop', 'SQL tool-use', 'Guardrails'],
    cs: { problem: 'Most agent demos hide the machinery behind a model, so you cannot see how planning, tool use, and guardrails actually fit together.',
      build: ['Wrote a plan / act / observe / reflect loop over a seeded 2,000-order warehouse: a rule-based planner maps each question to one of five intents, the sql_tool builds a parameterized SELECT, and a self-check fires one refined retry on an empty slice.', 'Put a read-only guardrail in front of every query — SELECT-only, table allowlist, single statement, no comment tokens, enforced LIMIT — and tested it with adversarial probes like stacked DROP, bare DELETE, and a sqlite_master read.', 'Rendered the full step-by-step agent trace, tool-call and intent donuts, steps-per-question bars, a success-rate gauge, and a guardrail-events table, every value from the run.'],
      metrics: [['90.9%', 'task success'], ['6 / 7', 'attacks blocked'], ['5.1', 'avg steps']] } },
  { t: 'Hybrid RAG with Reranking', tag: 'RAG · Retrieval', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/hybrid-rag-reranker', demo: asset('/demos/hybrid-rag/'), cat: 'rag', num: '11',
    d: 'Three retrievers I wrote from scratch — BM25, TF-IDF, and a reciprocal-rank-fusion hybrid — plus a proximity reranker, benchmarked on a labeled eval set with recall@k, MRR, and nDCG.',
    tech: ['Python', 'BM25', 'Hybrid retrieval', 'nDCG / MRR eval'],
    cs: { problem: 'A RAG system is only as good as its retriever, yet teams ship them without measuring recall, MRR, or nDCG, or checking whether reranking actually helps.',
      build: ['Implemented BM25, TF-IDF cosine, and a reciprocal-rank-fusion hybrid from scratch, plus a reranker that re-scores the top-k by IDF-weighted term coverage and window proximity.', 'Built a 15-document corpus with five near-neighbor topic pairs and a 53-query eval set labeled by answer phrases, then computed recall@k, MRR, and nDCG@5 for every strategy by hand.', 'Rendered recall@k curves, ranking-quality and rerank before/after bars, a sparse-vs-dense fusion illustration, per-strategy latency, and a per-query results table.'],
      metrics: [['0.872', 'best nDCG@5'], ['+0.018', 'MRR rerank lift'], ['53', 'eval queries']] } },
  { t: 'Gradient Boosting — Fraud Detection', tag: 'Machine Learning', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/gradient-boosting-fraud', demo: asset('/demos/fraud-gbm/'), cat: 'ml', num: '12',
    d: 'Gradient-boosted decision trees I wrote from scratch to rank rare fraudulent transactions, judged on precision-recall rather than accuracy — because a model that never flags fraud still scores 96%.',
    tech: ['Python', 'Gradient boosting', 'Decision trees', 'Imbalanced classification'],
    cs: { problem: 'Fraud is about 4% of transactions, so accuracy is a trap. The real problem is ranking rare positives well enough that a fixed review budget catches the most fraud.',
      build: ['Implemented regression decision trees (greedy MSE-reduction splits, bounded depth) and first-order gradient boosting on the logistic-loss gradient, all in the standard library.', 'Generated deterministic synthetic card transactions from a hand-built log-odds model with a 4% fraud rate, seeded so every run reproduces.', 'Wrote AUPRC, ROC/AUC, precision@k, split-gain importance, partial dependence, and SHAP-style per-transaction attributions, then rendered a 9-panel dashboard from the engine.'],
      metrics: [['0.905', 'ROC-AUC'], ['0.43', 'precision@100'], ['4%', 'fraud base rate']] } },
  { t: 'LLM Evaluation & Guardrails Harness', tag: 'LLMOps · Eval', star: 1,
    link: 'https://github.com/RITHVIKILLANDULA/llm-eval-guardrails', demo: asset('/demos/llm-eval/'), cat: 'agentic', num: '13',
    d: 'An offline harness that scores LLM outputs on five dimensions, enforces PII, injection, and toxicity guardrails, and proves a new model version did not regress — all with deterministic heuristics and no API calls.',
    tech: ['Python', 'LLM eval', 'Guardrails', 'TF-IDF'],
    cs: { problem: 'Before paying for an LLM-as-judge, teams need a cheap, reproducible way to gate releases: score faithfulness and relevance, enforce safety guardrails, and catch regressions between versions.',
      build: ['Implemented five deterministic evaluators from scratch: sentence-overlap entailment for faithfulness, TF-IDF cosine for relevance, keypoint coverage for completeness, JSON parsing for format, and a safety layer with PII regex, injection patterns, a toxicity lexicon, and refusal detection.', 'Built a fixture set of 40 cases with responses for three simulated model versions, scored each zero to one per dimension, and rolled them into a scorecard per version with regression detection.', 'Rendered a scorecard by dimension per version, a pass-rate gauge, guardrail incidents by type, a version trend, and a failing-cases table with the triggered rule.'],
      metrics: [['36→85%', 'pass rate v1→v3'], ['16', 'guardrail incidents'], ['40', 'eval cases']] } },
]

// Project classifications — the projects section filters by these so it reads
// as a few focused boxes instead of one long list.
export const CATEGORIES = [
  { key: 'agentic', label: 'Agentic AI', blurb: 'Agents and LLM systems built for production — planning, tool use, governance, and evaluation.' },
  { key: 'rag', label: 'RAG & LLMs', blurb: 'Retrieval, grounding, and language systems, measured on real metrics.' },
  { key: 'ml', label: 'Machine Learning', blurb: 'Models built from first principles and measured honestly.' },
  { key: 'data', label: 'Data & Finance Eng', blurb: 'Pipelines, reconciliation, and the governed data layer underneath the models.' },
]

export const IMPACT = [
  ['2h → 35m', 'nightly runtime'], ['1M+', 'records modeled'], ['80%', 'less manual review'],
  ['25+', 'datasets validated'], ['6', 'source systems'], ['40+', 'source→target maps'],
]

export const NAV = [['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'], ['Skills', 'skills'], ['Warehouse', 'warehouse'], ['Contact', 'contact']]
