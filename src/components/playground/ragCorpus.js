// Knowledge base the RAG demo retrieves over — concise, self-contained facts
// drawn from Rithvik's real background. Each chunk is one coherent passage so a
// retrieved result reads as a complete answer.
export const CORPUS = [
  {
    source: "About",
    text: "Rithvik Illandula is an AI Data Analyst based in Buffalo, New York, open to AI and data roles. He has 4+ years turning messy, multi-source data into decisions across Deloitte, WAFU Technologies, and the University at Buffalo.",
  },
  {
    source: "Experience · University at Buffalo",
    text: "At the University at Buffalo (2025 to 2026) as an AI Data Analyst, Rithvik built Python, SQL, Airflow, and BigQuery workflows to collect, cleanse, validate, and prepare 25+ datasets, and cut nightly processing from 2 hours to 35 minutes.",
  },
  {
    source: "Experience · Deloitte",
    text: "At Deloitte (2022 to 2024) as a Data Analytics Engineer, Rithvik analyzed TV and media data from 6 source systems using Python, SQL, Spark, and Databricks. He shipped 15+ Tableau and Power BI dashboards, documented 40+ source-to-target mappings, and cut manual review effort by 80%.",
  },
  {
    source: "Experience · WAFU Technologies",
    text: "At WAFU Technologies (2020 to 2021) as a Data Analyst, Rithvik analyzed adtech, campaign, and customer-transaction data across 4 client applications using SQL, Python, and NoSQL, and modeled 6+ reporting tables.",
  },
  {
    source: "Skills · Languages & Cloud",
    text: "Rithvik's strongest skills are Python and SQL. For cloud and data engineering he works with BigQuery, BigQuery ML, GCP, Airflow, Spark and PySpark, Databricks, and Snowflake.",
  },
  {
    source: "Skills · AI & LLMs",
    text: "On the AI and large-language-model side, Rithvik works with OpenAI and GPT, LangChain, retrieval-augmented generation (RAG) pipelines, vector databases like FAISS, prompt engineering, and Vertex AI.",
  },
  {
    source: "Skills · Machine Learning",
    text: "Rithvik's machine learning toolkit includes scikit-learn, XGBoost, LightGBM, time-series forecasting, anomaly detection, and MLflow for experiment tracking.",
  },
  {
    source: "Skills · Visualization & BI",
    text: "For visualization and business intelligence, Rithvik builds Tableau and Power BI dashboards with DAX, KPI reporting, and dimensional data modeling.",
  },
  {
    source: "Project · Telco Churn Prediction",
    text: "Telco Customer Churn Prediction: Rithvik built churn models with Logistic Regression, XGBoost, and Random Forest over 500,000+ customer records to surface the behavioral drivers of churn, and shipped a web app exposing churn-risk insights for targeted retention.",
  },
  {
    source: "Project · Citi Bike Demand",
    text: "Citi Bike Trip Demand Prediction: an end-to-end ML pipeline forecasting hourly demand with Python, Pandas, and LightGBM over 1M+ historical trips, with 20+ MLflow experiments, a 12 to 15 percent MAE improvement, and Streamlit dashboards.",
  },
  {
    source: "Project · PDF-Insight RAG Assistant",
    text: "PDF-Insight is a RAG question-answering assistant: users upload multiple PDFs and ask questions; the text is embedded with OpenAI embeddings, stored in FAISS, and answered by Gemini-Pro, orchestrated end to end with LangChain.",
  },
  {
    source: "Project · Data Quality Pipeline",
    text: "Data Quality and Anomaly Detection Pipeline: profiling rules, statistical thresholds, and anomaly detection flag missing values, duplicates, volume spikes, and abnormal time-series patterns before they ever reach reporting.",
  },
  {
    source: "Project · BigQuery ML Analytics",
    text: "BigQuery ML Customer Analytics Pipeline: a GCP analytics pipeline that profiles customer behavioral data and prepares reporting-ready insights using BigQuery ML and Vertex AI, orchestrated with Airflow and PySpark.",
  },
  {
    source: "Projects · GenAI & NLP",
    text: "Rithvik also built an NLP Toolkit with Hugging Face Transformers for summarization and sentiment analysis, a Fake News classifier using NLTK and TF-IDF, and WeatherWise, which combines the OpenWeatherMap API with the OpenAI API for human-like forecasts.",
  },
  {
    source: "Education",
    text: "Rithvik is finishing an M.S. in Computer Science at the University at Buffalo (2025 to 2026), with coursework in Machine Learning, Deep Learning, Data Intensive Computing, and Analysis of Algorithms.",
  },
  {
    source: "Certifications",
    text: "Rithvik holds certifications including Microsoft PL-300 Power BI Data Analyst, Google Cloud Professional Data Engineer, Microsoft DP-700 Fabric Data Engineer, and Tableau Desktop Foundations.",
  },
  {
    source: "Impact",
    text: "By the numbers: 1M+ records modeled, 25+ datasets profiled and validated, 6 source systems unified, 40+ source-to-target mappings documented, nightly runtime cut from 2 hours to 35 minutes, and manual review reduced by 80 percent.",
  },
  {
    source: "Contact",
    text: "You can reach Rithvik by email at rithvik.illandula@gmail.com, on LinkedIn at in/rithvik-illandula, or on GitHub at RITHVIKILLANDULA. He is based in Buffalo, New York and open to AI and data roles.",
  },
];
