// Knowledge base the AI agent retrieves over — concise, self-contained, and
// drawn from Rithvik's real background. Each chunk is one coherent passage so a
// retrieved result reads as a complete answer. `tags` are intent keywords that
// steer the model-free keyword fallback to the right passage. Facts only.
export const CORPUS = [
  {
    source: 'About',
    tags: ['who', 'about', 'summary', 'overview', 'background', 'yourself', 'introduce', 'rithvik', 'engineer'],
    text: "Rithvik Illandula is a Data, AI, and Software Engineer based in Buffalo, New York, open to data and AI roles. He has 4+ years turning messy, multi-source data into decisions across Deloitte, WAFU Technologies, and the University at Buffalo — and works across the whole stack, from the SQL and pipelines underneath to the ML and LLM systems on top.",
  },
  {
    source: 'Experience · University at Buffalo',
    tags: ['buffalo', 'university', 'ub', 'current', 'now', 'latest', 'recent', 'airflow', 'bigquery', 'runtime', 'nightly', 'pipeline', 'datasets'],
    text: 'At the University at Buffalo (2025 to 2026) as an AI Data Analyst, Rithvik built Python, SQL, Airflow, and BigQuery workflows to collect, cleanse, validate, and prepare 25+ datasets, and cut nightly processing from 2 hours to 35 minutes — a 71 percent runtime reduction.',
  },
  {
    source: 'Experience · Deloitte',
    tags: ['deloitte', 'dashboards', 'tableau', 'power bi', 'spark', 'databricks', 'media', 'consulting', 'experience', 'job', 'work'],
    text: 'At Deloitte (2022 to 2024) as a Data Analytics Engineer, Rithvik analyzed TV and media data from 6 source systems using Python, SQL, Spark, and Databricks. He shipped 15+ Tableau and Power BI dashboards, documented 40+ source-to-target mappings, and cut manual review effort by 80 percent.',
  },
  {
    source: 'Experience · WAFU Technologies',
    tags: ['wafu', 'adtech', 'campaign', 'startup', 'nosql', 'transaction', 'experience', 'first', 'job'],
    text: 'At WAFU Technologies (2020 to 2021) as a Data Analyst, Rithvik analyzed adtech, campaign, and customer-transaction data across 4 client applications using SQL, Python, and NoSQL, and modeled 6+ reporting tables.',
  },
  {
    source: 'Skills · Languages & Cloud',
    tags: ['skills', 'python', 'sql', 'cloud', 'bigquery', 'gcp', 'spark', 'pyspark', 'databricks', 'snowflake', 'airflow', 'language', 'languages', 'stack', 'tools', 'tech', 'know'],
    text: "Rithvik's strongest skills are Python and SQL. For cloud and data engineering he works with BigQuery, BigQuery ML, GCP, Airflow, Spark and PySpark, Databricks, and Snowflake.",
  },
  {
    source: 'Skills · AI & LLMs',
    tags: ['ai', 'llm', 'llms', 'langchain', 'rag', 'openai', 'gpt', 'vector', 'faiss', 'prompt', 'vertex', 'genai', 'gen ai', 'generative', 'embeddings'],
    text: 'On the AI and large-language-model side, Rithvik works with OpenAI and GPT, LangChain, retrieval-augmented generation (RAG) pipelines, vector databases like FAISS, prompt engineering, and Vertex AI.',
  },
  {
    source: 'Skills · Machine Learning',
    tags: ['machine learning', 'ml', 'scikit', 'sklearn', 'xgboost', 'lightgbm', 'forecasting', 'anomaly', 'mlflow', 'model', 'models', 'modeling'],
    text: "Rithvik's machine learning toolkit includes scikit-learn, XGBoost, LightGBM, time-series forecasting, anomaly detection, and MLflow for experiment tracking.",
  },
  {
    source: 'Skills · Visualization & BI',
    tags: ['visualization', 'viz', 'bi', 'tableau', 'power bi', 'dashboard', 'dashboards', 'dax', 'kpi', 'reporting', 'charts'],
    text: 'For visualization and business intelligence, Rithvik builds Tableau and Power BI dashboards with DAX, KPI reporting, and dimensional data modeling.',
  },
  {
    source: 'Project · Telco Churn Prediction',
    tags: ['project', 'projects', 'churn', 'telco', 'classification', 'xgboost', 'random forest', 'retention', 'customer', 'prediction', 'ml'],
    text: 'Customer Churn Prediction: Rithvik built a Telco churn scorer in pure Python, implementing logistic regression from scratch with standardized features and batch gradient descent over 4,000 synthetic customers. It reaches about 0.825 test AUC, ranks customers by churn risk with a 2.75x top-decile lift, and explains the drivers through the model coefficients. It has a live dashboard.',
  },
  {
    source: 'Project · Citi Bike Demand',
    tags: ['project', 'projects', 'citi bike', 'bike', 'demand', 'forecast', 'forecasting', 'lightgbm', 'streamlit', 'time series', 'mlflow'],
    text: 'Citi Bike Demand Forecasting: Rithvik forecasts hourly bike-share demand with ridge regression written from scratch, using standardized features and closed-form normal equations. Over 120 days and 1.24M trips it reaches R-squared 0.941 on a 14-day backtest and beats a seasonal-naive baseline by about 10 percent on MAE.',
  },
  {
    source: 'Project · PDF-Insight RAG Assistant',
    tags: ['project', 'projects', 'pdf', 'rag', 'assistant', 'langchain', 'faiss', 'gemini', 'document', 'question answering', 'chatbot', 'llm'],
    text: 'PDF-Insight is a retrieval-augmented Q&A engine. Rithvik built a TF-IDF and cosine-similarity index from scratch over a document corpus, retrieves the most relevant passage for a question, and answers with a cited sentence. It shows how classic RAG retrieval works end to end without an embeddings API.',
  },
  {
    source: 'Project · Data Quality Pipeline',
    tags: ['project', 'projects', 'quality', 'anomaly', 'profiling', 'validation', 'data quality', 'monitoring'],
    text: 'Data Quality and Anomaly Pipeline: a pre-reporting gate Rithvik built that scores five daily feeds on completeness, uniqueness, validity, freshness, and z-score volume anomalies, then grades each break by severity. In a deterministic run it profiled 641,000 rows and flagged 22 anomalies, all in the Python standard library.',
  },
  {
    source: 'Project · BigQuery ML Analytics',
    tags: ['project', 'projects', 'bigquery', 'bigquery ml', 'gcp', 'vertex', 'analytics', 'pipeline'],
    text: 'BigQuery ML Customer Analytics: Rithvik reproduced a cloud customer-analytics pipeline offline on SQLite, with RFM segmentation, k-means clustering written from scratch, monthly cohorts and retention, and CLV. He also ships the cloud-native artifacts, a CREATE MODEL BigQuery ML SQL script and an Airflow DAG, so the same logic maps onto the warehouse.',
  },
  {
    source: 'Projects · GenAI & NLP',
    tags: ['project', 'projects', 'nlp', 'huggingface', 'transformers', 'summarization', 'sentiment', 'fake news', 'weather', 'genai', 'text'],
    text: 'GenAI and NLP Toolkit: Rithvik built a set of classic NLP tools from scratch, including a TextRank extractive summarizer, a lexicon-based sentiment scorer, and a clickbait and fake-headline classifier using TF-IDF features with logistic regression that reaches about 93 percent accuracy and 0.96 ROC-AUC.',
  },
  {
    source: 'Project · Agentic Data Analyst',
    tags: ['project', 'projects', 'agent', 'agentic', 'agentic ai', 'tool use', 'tool-use', 'plan', 'reflect', 'sql agent', 'guardrails', 'llm', 'orchestration'],
    text: 'Agentic Data Analyst: Rithvik built an agent that answers analytical questions over a SQLite warehouse through a plan, act, observe, reflect loop. A deterministic planner maps each question to an intent, a guarded sql_tool runs a parameterized SELECT, and a self-check can fire a refined retry. Every query passes a read-only guardrail (SELECT-only, table allowlist, single statement, enforced LIMIT); across 11 questions it reaches 90.9 percent task success and blocks 6 of 7 adversarial SQL probes. It shows the agent architecture and tool boundary rather than hiding them behind a model.',
  },
  {
    source: 'Project · Hybrid RAG with Reranking',
    tags: ['project', 'projects', 'rag', 'retrieval', 'bm25', 'tf-idf', 'reranking', 'rerank', 'hybrid', 'ndcg', 'mrr', 'recall', 'evaluation', 'search'],
    text: 'Hybrid RAG with Reranking: Rithvik implemented three retrievers from scratch, BM25, TF-IDF cosine, and a reciprocal-rank-fusion hybrid, plus a reranker that re-scores the top candidates by IDF-weighted term coverage and proximity. He benchmarked them on a 15-document corpus and a 53-query labeled eval set with recall@k, MRR, and nDCG@5. The hybrid plus reranker is the best strategy at 0.872 nDCG@5, and the writeup is honest that this is lexical and statistical retrieval, not neural embeddings.',
  },
  {
    source: 'Project · Gradient Boosting Fraud Detection',
    tags: ['project', 'projects', 'fraud', 'gradient boosting', 'boosting', 'gbm', 'decision trees', 'imbalanced', 'auprc', 'precision recall', 'ml', 'from scratch', 'shap'],
    text: 'Gradient Boosting Fraud Detection: Rithvik implemented gradient-boosted decision trees from scratch in pure Python to rank rare fraudulent transactions. Because fraud is about 4 percent of transactions, he judges the model on precision-recall rather than accuracy, and computes AUPRC, ROC-AUC of 0.905, precision@k, split-gain feature importance, partial dependence, and SHAP-style per-transaction attributions.',
  },
  {
    source: 'Project · LLM Evaluation and Guardrails Harness',
    tags: ['project', 'projects', 'llm', 'eval', 'evaluation', 'guardrails', 'llmops', 'faithfulness', 'safety', 'pii', 'injection', 'toxicity', 'regression', 'ai engineering'],
    text: 'LLM Evaluation and Guardrails Harness: Rithvik built an offline harness that scores LLM outputs on five dimensions (faithfulness, relevance, completeness, format, and safety) with deterministic heuristics and no API calls. It enforces PII, prompt-injection, and toxicity guardrails, aggregates a scorecard per model version, and detects regressions; across a 40-case fixture set the overall pass rate improves from 36 to 85 percent between simulated versions.',
  },
  {
    source: 'Project · Financial Reconciliation Framework (Foundry)',
    tags: ['project', 'projects', 'finance', 'reconciliation', 'reconcile', 'audit', 'audit trail', 'lineage', 'gl', 'general ledger', 'bank', 'sub-ledger', 'ar', 'close', 'exception', 'dbt', 'controller', 'sql'],
    text: 'Foundry is a Python and SQL financial reconciliation framework Rithvik built. It takes three disagreeing extracts (general ledger, bank statement, and AR sub-ledger), pivots them onto one business key, and classifies every break with a documented rule cascade: duplicate payments, timing differences, missing entries, bank fees, FX rounding, and material amount mismatches. It tracks source-to-report lineage, writes an append-only audit log, and ships an HTML dashboard sorted by financial impact. The same logic runs two ways, a standard-library Python engine and warehouse SQL and dbt models, and the tests prove both catch 100 percent of the seeded breaks. The point is to expose reconciliation gaps before the close cycle locks.',
  },
  {
    source: 'Project · Forecasting & Scenario Toolkit (Forecast)',
    tags: ['project', 'projects', 'finance', 'fp&a', 'fpa', 'forecast', 'forecasting', 'scenario', 'what-if', 'monte carlo', 'driver', 'p&l', 'ebitda', 'excel', 'power bi', 'variance', 'actuals', 'planning', 'model'],
    text: 'Forecast is a Python and Excel toolkit for FP&A that Rithvik built. It models a subscription P&L bottom-up from 10 named drivers, so changing any one assumption reprices the whole 12-month plan. It includes a scenario library (Base, Bull, Bear, Downside), an ad-hoc what-if command line, and a 5,000-trial Monte Carlo that produces a P10/P50/P90 band. One calculation engine feeds four surfaces: a live-formula Excel workbook, a Power BI star schema, a SQLite analytics store, and a forecast-vs-actual dashboard with variance analysis.',
  },
  {
    source: 'Project · NetSuite AI Connector (governed MCP ERP bridge)',
    tags: ['project', 'projects', 'netsuite', 'erp', 'mcp', 'ai connector', 'suiteql', 'saved search', 'governance', 'governed', 'permissions', 'role', 'audit', 'agent', 'oracle', 'security', 'rbac', 'llm'],
    text: 'The NetSuite AI Connector is a governed MCP bridge Rithvik built, modeling the pattern behind Oracle NetSuite AI Connector Service. It lets an AI client (Claude or ChatGPT) query live ERP data through governed tools: SuiteQL, saved searches, and record lookups. The AI connects as a finance role (CFO, Controller, AR, or AP) and inherits that role permissions on every call. Enforcement runs at the database engine, a SQLite authorizer bound to the role, with table allowlists, column masking, read-only access, and row-level scope, so it holds no matter what SuiteQL the AI writes. Every call, allowed or denied, is audit-logged. The idea he wanted to prove: an agent answers from whatever data layer you give it, so a reconciled, governed finance data layer is what makes the answers trustworthy.',
  },
  {
    source: 'Education',
    tags: ['education', 'degree', 'degrees', 'masters', 'master', 'ms', 'university', 'study', 'studied', 'school', 'college', 'coursework', 'gpa', 'academic'],
    text: 'Rithvik is finishing an M.S. in Computer Science at the University at Buffalo (2025 to 2026), with coursework in Machine Learning, Deep Learning, Data Intensive Computing, and Analysis of Algorithms. He holds three computer science degrees in total.',
  },
  {
    source: 'Certifications',
    tags: ['certification', 'certifications', 'certified', 'certs', 'pl-300', 'dp-700', 'google cloud', 'azure', 'microsoft', 'fabric', 'credentials', 'qualified'],
    text: 'Rithvik holds certifications including Microsoft PL-300 Power BI Data Analyst, Google Cloud Professional Data Engineer, Microsoft DP-700 Fabric Data Engineer, and Tableau Desktop Foundations.',
  },
  {
    source: 'Impact',
    tags: ['impact', 'results', 'numbers', 'metrics', 'achievements', 'biggest', 'outcomes', 'accomplishments', 'value', 'records'],
    text: 'By the numbers: 1M+ records modeled, 25+ datasets profiled and validated, 6 source systems unified, 40+ source-to-target mappings documented, 15+ dashboards shipped, nightly runtime cut from 2 hours to 35 minutes, and manual review reduced by 80 percent.',
  },
  {
    source: 'Contact',
    tags: ['contact', 'reach', 'reach out', 'email', 'connect', 'hire', 'hiring', 'linkedin', 'github', 'touch', 'get in touch', 'message', 'available', 'recruit', 'talk'],
    text: 'You can reach Rithvik by email at rithvik.illandula@gmail.com, on LinkedIn at in/rithvik-illandula, or on GitHub at RITHVIKILLANDULA. He is based in Buffalo, New York and open to data and AI roles.',
  },
]
