
export const RESUME_URL = import.meta.env.BASE_URL + "Rithvik_Illandula_Resume.pdf";

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "agents", label: "Agents" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const HERO_NAME = "Rithvik Illandula";
export const HERO_ROLES = [
  "AI Data Analyst",
  "Data Analytics Engineer",
  "BI & Dashboard Developer",
  "Data Quality Specialist",
];

export const HERO_CONTENT = `I turn data into decisions — and increasingly, into agents. 4+ years building analytics and applied-AI systems across Deloitte, WAFU, and UB: 1M+ records modeled, 15+ dashboards shipped, manual review cut 80%. SQL and BigQuery to LLMs, RAG, and autonomous pipelines.`;

export const ABOUT_TEXT = `I'm a data analyst who builds — equal parts SQL, statistics, and increasingly, AI agents. Over 4+ years at Deloitte, WAFU, and the University at Buffalo, I've turned six source systems of messy TV/media and adtech data into reporting layers, data-quality controls, and decisions leaders actually trust.

My range is the point. I profile and validate data with Python, R, and SQL; orchestrate pipelines with Airflow, Spark, and BigQuery; ship 15+ Tableau and Power BI dashboards; and wire LLMs into the loop with LangChain, RAG, and Vertex AI. I care about the unglamorous parts — reconciliation, anomaly detection, lineage — because that's what makes the impressive parts true.

The results compound: 1M+ records modeled, nightly runtimes cut from 2 hours to 35 minutes, manual review down 80%, 40+ source-to-target mappings documented. I'm finishing an M.S. in Computer Science and building toward systems that don't just report the past — they reason about it.`;

// Animated headline counters
export const STATS = [
  { value: 4, suffix: "+", label: "Years in Data", decimals: 0 },
  { value: 15, suffix: "+", label: "Dashboards Shipped", decimals: 0 },
  { value: 40, suffix: "+", label: "Source Mappings", decimals: 0 },
  { value: 80, suffix: "%", label: "Manual Review Cut", decimals: 0 },
];

// Secondary impact metrics (shown in About)
export const IMPACT = [
  { k: "25+", v: "Datasets profiled & validated" },
  { k: "6", v: "Source systems unified" },
  { k: "2h → 35m", v: "Nightly runtime cut" },
  { k: "80%", v: "Manual review reduced" },
];

// Skill categories with proficiency for the animated visualization
export const SKILL_CATEGORIES = [
  {
    name: "Programming & Analysis",
    accent: "#22d3ee",
    skills: [
      { name: "Python", level: 95 },
      { name: "SQL", level: 95 },
      { name: "R", level: 80 },
      { name: "Pandas", level: 92 },
      { name: "NumPy", level: 90 },
      { name: "scikit-learn", level: 84 },
    ],
  },
  {
    name: "Analytics Methods",
    accent: "#38bdf8",
    skills: [
      { name: "Data Profiling", level: 92 },
      { name: "Data Validation", level: 90 },
      { name: "Anomaly Detection", level: 85 },
      { name: "Trend & Correlation", level: 90 },
      { name: "Segmentation", level: 84 },
      { name: "Reconciliation", level: 88 },
    ],
  },
  {
    name: "Cloud & Data",
    accent: "#6366f1",
    skills: [
      { name: "BigQuery", level: 90 },
      { name: "GCP", level: 85 },
      { name: "BigQuery ML", level: 82 },
      { name: "Vertex AI", level: 74 },
      { name: "Databricks", level: 84 },
      { name: "PostgreSQL", level: 86 },
    ],
  },
  {
    name: "Viz & Reporting",
    accent: "#a78bfa",
    skills: [
      { name: "Tableau", level: 92 },
      { name: "Power BI", level: 92 },
      { name: "DAX", level: 86 },
      { name: "KPI Reporting", level: 90 },
      { name: "Dashboards", level: 93 },
      { name: "Data Models", level: 85 },
    ],
  },
  {
    name: "Workflows & Tools",
    accent: "#e879f9",
    skills: [
      { name: "Airflow", level: 88 },
      { name: "Spark / PySpark", level: 84 },
      { name: "ETL / ELT", level: 88 },
      { name: "Git", level: 85 },
      { name: "Docker", level: 75 },
      { name: "Jira", level: 82 },
    ],
  },
];

// Flat tag list for the 3D rotating skill-sphere
export const SKILL_TAGS = [
  "Python", "SQL", "R", "Pandas", "NumPy", "scikit-learn", "BigQuery", "GCP",
  "BigQuery ML", "Vertex AI", "Databricks", "PostgreSQL", "MySQL", "Tableau",
  "Power BI", "DAX", "Airflow", "Spark", "PySpark", "ETL", "Docker", "Git",
  "Jira", "Data Profiling", "Anomaly Detection", "Reconciliation",
  "KPI Reporting", "EDA",
];

export const EXPERIENCES = [
  {
    year: "2025 FEB — 2026 MAY",
    role: "AI Data Analyst",
    company: "University at Buffalo",
    description: `Built Python, SQL, Airflow, and BigQuery workflows that collect, cleanse, validate, and prepare 25+ operational and research datasets for reporting and exploratory analysis. Defined data-collection standards and quality procedures with faculty and SMEs across 5 recurring controls — completeness, duplicates, schema drift, late files, and exception trends. Profiled datasets with Python, R, SQL, Pandas, and NumPy to surface outliers, compare baselines, and evaluate correlations for stakeholder review. Optimized recurring SQL jobs and partitioned BigQuery tables, cutting nightly processing from 2 hours to 35 minutes while preserving audit logs and recovery steps.`,
    technologies: ["Python", "SQL", "Airflow", "BigQuery", "R", "Pandas", "Data Quality"],
    metrics: ["25+ datasets prepared", "2h → 35m nightly runtime", "5 recurring quality controls"],
  },
  {
    year: "2022 JAN — 2024 DEC",
    role: "Data Analytics Engineer",
    company: "Deloitte",
    description: `Analyzed TV/media datasets for entertainment and news clients — audience, campaign, customer, transaction, and reference data from 6 source systems — using Python, SQL, Spark, Databricks, and Airflow for client reporting and KPI analysis. Built 15+ Tableau and Power BI dashboards tracking audience-segment trends, campaign KPI movement, delayed events, and data completeness. Partnered with SMEs, engineers, client teams, and agency reporting teams to clarify requirements and document 40+ source-to-target mappings. Implemented reconciliation, cleansing, and data-quality rules for volume shifts, missing/duplicate events, and threshold breaches — cutting manual review effort by 80% — and translated audience, campaign, and transaction trends into client-ready insight summaries.`,
    technologies: ["Python", "SQL", "Spark", "Databricks", "Airflow", "Tableau", "Power BI", "Reconciliation"],
    metrics: ["15+ dashboards shipped", "6 source systems unified", "80% less manual review", "40+ source-to-target mappings"],
  },
  {
    year: "2020 DEC — 2021 AUG",
    role: "Data Analyst",
    company: "WAFU Technologies",
    description: `Analyzed adtech event, campaign, customer-transaction, order, inventory, and payment-workflow data across 4 client applications using SQL, Python, and NoSQL to surface reporting gaps, failed events, and operational exceptions. Built monitoring queries covering 5 categories of operational and ad-event exceptions — event mismatches, order issues, rejected records, inventory gaps, and recurring process failures. Modeled 6+ reporting tables and optimized MySQL queries for agency reporting, campaign visibility, customer-transaction analysis, and operational performance monitoring.`,
    technologies: ["SQL", "Python", "NoSQL", "MySQL", "Adtech", "Monitoring"],
    metrics: ["4 client applications", "5 exception categories", "6+ reporting tables modeled"],
  },
];

export const RESUME_SUMMARY = `Data analyst & applied-AI builder. 4+ years turning TV/media, adtech, and operational data into dashboards, data-quality systems, and LLM-powered tools — measured in records modeled, hours saved, and decisions changed.`;

export const EDUCATION = [
  {
    year: "2025 JAN — 2026 MAY",
    title: "M.S. Computer Science",
    school: "University at Buffalo, SUNY",
    detail: "Focus: data, analytics & machine learning",
  },
];

export const COURSEWORK = [
  "Machine Learning",
  "Deep Learning",
  "Data Intensive Computing",
  "Analysis of Algorithms",
  "Computer Networks",
  "Computer Security",
  "Operating Systems",
  "Computer Architecture",
  "Project Management",
];

export const CERTIFICATIONS = [
  "Microsoft PL-300 (Power BI Data Analyst)",
  "Google Cloud Professional Data Engineer",
  "Microsoft DP-700 (Fabric Data Engineer)",
  "Tableau Desktop Foundations",
];

export const PROJECTS = [
  {
    title: "Audience & Client Insights Dashboard",
    category: "Analytics & BI",
    featured: true,
    description:
      "Designed dashboards to analyze audience engagement, KPI movement, segment comparisons, exception counts, and client reporting patterns across business views — turning multi-source media data into a single, client-ready reporting layer.",
    technologies: ["SQL", "Python", "Tableau", "Power BI", "DAX"],
  },
  {
    title: "Data Quality & Anomaly Detection Pipeline",
    category: "Data Engineering",
    featured: true,
    description:
      "Built a data-quality workflow using profiling rules, statistical thresholds, and anomaly detection to flag missing values, duplicates, volume spikes, and abnormal time-series patterns before they ever reach reporting.",
    technologies: ["Python", "R", "Pandas", "scikit-learn", "SQL"],
  },
  {
    title: "BigQuery ML Customer Analytics Pipeline",
    category: "Data Engineering",
    featured: true,
    description:
      "Designed a GCP analytics pipeline to profile customer behavioral data, compare segments, identify trend patterns, and prepare reporting-ready insights using BigQuery ML and Vertex AI, orchestrated with Airflow and PySpark.",
    technologies: ["GCP", "BigQuery", "BigQuery ML", "Vertex AI", "Airflow", "PySpark"],
  },
  {
    title: "Telco Customer Churn Prediction",
    category: "Machine Learning",
    description:
      "Built churn prediction models using Logistic Regression, XGBoost, and Random Forest, analyzing 500,000+ customer records to surface the behavioral drivers of churn. Shipped a web app to expose churn-risk insights through an intuitive UI, supporting targeted retention.",
    technologies: ["Python", "Scikit-learn", "XGBoost", "Random Forest", "ML"],
  },
  {
    title: "Citi Bike Trip Demand Prediction",
    category: "Machine Learning",
    description:
      "Designed an end-to-end ML pipeline forecasting hourly Citi Bike demand with Python, Pandas, and LightGBM over 1M+ historical trips. Ran 20+ experiments in MLflow, achieved a 12–15% MAE improvement, and deployed Streamlit dashboards to visualize hourly predictions.",
    technologies: ["Python", "LightGBM", "PCA", "MLflow", "Streamlit", "Time Series"],
  },
  {
    title: "PDF-Insight · RAG Q&A Assistant",
    category: "GenAI / LLM",
    description:
      "A Streamlit app that lets users upload multiple PDFs and ask detailed questions about their content. Text is vectorized with OpenAI Embeddings and stored in FAISS; Gemini-Pro generates context-aware answers, orchestrated end-to-end by LangChain.",
    technologies: ["Python", "LangChain", "Gemini-Pro", "FAISS", "RAG"],
  },
  {
    title: "EDA with LangChain + LLMs",
    category: "GenAI / LLM",
    description:
      "Exploratory data analysis on 14,000+ data-science job listings, surfacing trends in salary, seniority, and remote adoption. Used LangChain and OpenAI APIs to generate natural-language insight, cutting manual EDA time by ~40%.",
    technologies: ["Python", "LangChain", "OpenAI API", "Pandas", "EDA"],
  },
  {
    title: "NLP Toolkit",
    category: "GenAI / LLM",
    description:
      "A customizable NLP tool powered by Hugging Face Transformers for code summarization, text summarization, sentiment analysis, rephrasing, and humanizing text — wrapped in an interactive Streamlit interface.",
    technologies: ["Python", "Streamlit", "HuggingFace", "BART", "GenAI"],
  },
  {
    title: "WeatherWise",
    category: "GenAI / LLM",
    description:
      "An interactive weather app delivering real-time updates and a 5-day forecast for any city, with AI-generated, human-like descriptions of the weather — combining the OpenWeatherMap API with the OpenAI API for engaging, personalized summaries.",
    technologies: ["Python", "Streamlit", "OpenAI", "OpenWeatherMap"],
  },
  {
    title: "Fake News Prediction",
    category: "Machine Learning",
    description:
      "An ML + NLP system that classifies news articles as real or fake. Processed text with NLTK (stopword removal, stemming, TF-IDF), trained a Logistic Regression classifier on a labeled Kaggle dataset, and shipped a Streamlit app for real-time predictions.",
    technologies: ["Python", "NLTK", "Scikit-learn", "TF-IDF", "NLP"],
  },
  {
    title: "Diabetes Risk Prediction",
    category: "Machine Learning",
    description:
      "Built for Data Intensive Computing at the University at Buffalo. Performed EDA and preprocessing, then benchmarked Logistic Regression, Random Forest, SVM, Neural Networks, and K-NN — a tuned Random Forest delivered the best risk-prediction performance.",
    technologies: ["Python", "Scikit-learn", "Random Forest", "SVM", "K-NN"],
  },
  {
    title: "Reinforcement Learning · Grid World",
    category: "Machine Learning",
    description:
      "Explored SARSA and Double Q-Learning in a custom 5×5 grid-world with traps, rewards, and termination states. Implemented epsilon-greedy action selection, analyzed hyperparameter effects, and visualized the learned policy.",
    technologies: ["Python", "Gym", "NumPy", "SARSA", "Q-Learning", "RL"],
  },
  {
    title: "Imagify · Text-to-Image SaaS",
    category: "Web App",
    link: "https://frontend-verse2vision.onrender.com/",
    description:
      "A full-stack MERN application turning text prompts into images via the Clipdrop API. Features secure authentication, a credit-based generation system, and planned payment-gateway integration. Users describe an image and generate it instantly.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Clipdrop API"],
  },
  {
    title: "Personal Portfolio · Data World",
    category: "Web App",
    description:
      "This site — an immersive, interactive 3D 'data world.' A live WebGL particle constellation, a rotating data-core, decode-text animations, an interactive skill-sphere, and animated data visualizations bring the work to life.",
    technologies: ["React", "Three.js", "Framer Motion", "Tailwind", "Vite"],
  },
];

export const PROJECT_FILTERS = [
  "All",
  "Analytics & BI",
  "Data Engineering",
  "Machine Learning",
  "GenAI / LLM",
  "Web App",
];

export const CONTACT = {
  address: "Buffalo, New York",
  phoneNo: "+1-971-264-8878",
  email: "rithvik.illandula@gmail.com",
  linkedin: "https://www.linkedin.com/in/rithvik-illandula/",
  github: "https://github.com/RITHVIKILLANDULA",
};
