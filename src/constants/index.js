import project1 from "../assets/projects/project-1.jpg";
import project2 from "../assets/projects/project-2.jpg";
import project3 from "../assets/projects/project-3.jpg";
import project4 from "../assets/projects/project-4.jpg";
import project5 from "../assets/projects/project-5.jpeg";
import project6 from "../assets/projects/project-6.jpeg";
import project7 from "../assets/projects/project-7.jpeg";
import project8 from "../assets/projects/project-8.jpeg";
import project9 from "../assets/projects/project-9.jpeg";
import project10 from "../assets/projects/project-10.jpeg";
import project12 from "../assets/projects/project-12.jpeg";

// Company logos
import busynessLogo from "../assets/busyness-logo.jpeg";
import wafuLogo from "../assets/wafu-logo.jpeg";

export const RESUME_URL = import.meta.env.BASE_URL + "Rithvik_Illandula_Resume.pdf";

export const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const HERO_NAME = "Rithvik Illandula";
export const HERO_ROLES = [
  "Business Data Analyst",
  "Machine Learning Engineer",
  "Data Storyteller",
  "BI & Dashboard Architect",
];

export const HERO_CONTENT = `I turn complex operational data into decisions. 3+ years building end-to-end data solutions — SQL, Python, Power BI, AWS, and machine learning that cut costs, lift efficiency, and make the numbers speak.`;

export const ABOUT_TEXT = `I am a Business Data Analyst with 3+ years of hands-on experience at Busyness.app and WAFU Technologies, where I've built scalable data solutions that directly impact business outcomes. Currently pursuing a Master's degree in Computer Science at SUNY Buffalo, with a focus on advanced analytics and machine learning.

My expertise spans full-stack data analytics: from ETL pipeline development and data warehousing with Snowflake and AWS Glue, to building 10+ interactive Power BI and Tableau dashboards serving 15+ stakeholders. I've optimized SQL queries processing 1M+ transactional records and shipped machine learning models for churn prediction and demand forecasting.

I'm driven by real-world impact — identifying inefficiencies that improved output consistency by ~10%, or building AI tools that cut analysis time by 40%. I live at the intersection of technical depth and business impact, translating complex analyses into insight anyone can act on.`;

// Animated headline counters
export const STATS = [
  { value: 3, suffix: "+", label: "Years in Data", decimals: 0 },
  { value: 1, suffix: "M+", label: "Records Processed", decimals: 0 },
  { value: 10, suffix: "+", label: "Dashboards Shipped", decimals: 0 },
  { value: 40, suffix: "%", label: "Analysis Time Cut", decimals: 0 },
];

// Secondary impact metrics (shown in About)
export const IMPACT = [
  { k: "500K+", v: "Customer records modeled for churn" },
  { k: "15+", v: "Stakeholders served with live BI" },
  { k: "6+", v: "Operational systems unified" },
  { k: "12–15%", v: "MAE improvement on forecasts" },
];

// Skill categories with proficiency for the animated visualization
export const SKILL_CATEGORIES = [
  {
    name: "Languages & Query",
    accent: "#22d3ee",
    skills: [
      { name: "Python", level: 95 },
      { name: "SQL", level: 95 },
      { name: "T-SQL", level: 88 },
      { name: "R", level: 70 },
      { name: "JavaScript", level: 64 },
    ],
  },
  {
    name: "Data & BI",
    accent: "#38bdf8",
    skills: [
      { name: "Power BI", level: 92 },
      { name: "DAX", level: 88 },
      { name: "Tableau", level: 85 },
      { name: "Excel", level: 90 },
      { name: "Snowflake", level: 82 },
      { name: "ETL / AWS Glue", level: 80 },
    ],
  },
  {
    name: "Machine Learning",
    accent: "#6366f1",
    skills: [
      { name: "Scikit-learn", level: 90 },
      { name: "Random Forest", level: 88 },
      { name: "XGBoost", level: 85 },
      { name: "LightGBM", level: 82 },
      { name: "MLflow", level: 78 },
      { name: "Time Series", level: 80 },
    ],
  },
  {
    name: "AI & LLMs",
    accent: "#a78bfa",
    skills: [
      { name: "LangChain", level: 85 },
      { name: "OpenAI API", level: 88 },
      { name: "NLP", level: 84 },
      { name: "HuggingFace", level: 80 },
      { name: "RAG / FAISS", level: 78 },
      { name: "OpenCV", level: 72 },
    ],
  },
];

// Flat tag list for the 3D rotating skill-sphere
export const SKILL_TAGS = [
  "Python", "SQL", "Power BI", "Tableau", "Snowflake", "AWS", "Pandas",
  "NumPy", "Scikit-learn", "XGBoost", "LightGBM", "MLflow", "LangChain",
  "OpenAI", "NLP", "HuggingFace", "FAISS", "Streamlit", "DAX", "ETL",
  "T-SQL", "Git", "Random Forest", "OpenCV", "PCA", "Time Series",
  "RAG", "Excel",
];

export const EXPERIENCES = [
  {
    year: "2022 JAN — 2024 DEC",
    role: "Business Data Analyst II",
    company: "Busyness.app",
    logo: busynessLogo,
    description: `Analyzed warehouse and fulfillment data across 6+ operational systems, translating operational metrics into insights used in weekly and monthly performance reviews. Designed and maintained 10+ end-to-end Power BI solutions with complex data models and DAX measures monitoring productivity, throughput, labor utilization, and SLA adherence. Optimized SQL queries to extract, clean, and transform 1M+ transactional records, improving data reliability for downstream reporting. Identified recurring inefficiencies through historical trend analysis, contributing to process changes that improved daily output consistency by ~10%. Integrated warehouse-management, timekeeping, and inventory data into unified datasets, sharpening visibility into operational performance.`,
    technologies: ["SQL", "T-SQL", "Power BI", "DAX", "Python", "AWS", "ETL", "Business Intelligence"],
  },
  {
    year: "2020 MAY — 2021 MAY",
    role: "Data Analyst",
    company: "WAFU Technologies",
    logo: wafuLogo,
    description: `Transformed raw application and operational data into analysis-ready datasets through extraction, schema normalization, and data-cleaning workflows. Unified data from multiple relational sources using SQL transformations, enabling consistent reporting and cross-team analysis. Produced and maintained 8+ Excel and Power BI reports tracking system usage patterns, operational trends, and recurring issues. Investigated data inconsistencies with targeted SQL queries, resolving discrepancies surfaced during reporting. Responded to 10+ ad-hoc analytical requests from operations and support teams, delivering timely insight for decisions.`,
    technologies: ["SQL", "Python", "Power BI", "Excel", "Data Engineering", "Database Management"],
  },
];

export const EDUCATION = [
  {
    year: "2024 — 2026",
    title: "M.S. Computer Science",
    school: "University at Buffalo, SUNY",
    detail: "Focus: advanced analytics & machine learning",
  },
];

export const PROJECTS = [
  {
    title: "Telco Customer Churn Prediction",
    image: project1,
    category: "Machine Learning",
    featured: true,
    description:
      "Built churn prediction models using Logistic Regression, XGBoost, and Random Forest, analyzing 500,000+ customer records to surface the behavioral drivers of churn. Shipped a web app to expose churn-risk insights through an intuitive UI, supporting targeted retention. Demonstrates classification modeling, feature engineering, and deploying ML for real business impact.",
    technologies: ["Python", "Scikit-learn", "XGBoost", "Random Forest", "Logistic Regression", "ML"],
  },
  {
    title: "Citi Bike Trip Demand Prediction",
    image: project3,
    category: "Machine Learning",
    featured: true,
    description:
      "Designed an end-to-end ML pipeline forecasting hourly Citi Bike demand with Python, Pandas, and LightGBM over 1M+ historical trips. Built baseline and advanced models with lag features and PCA reduction, ran 20+ experiments in MLflow, and achieved a 12–15% MAE improvement. Deployed Streamlit dashboards to visualize hourly predictions for resource allocation.",
    technologies: ["Python", "LightGBM", "PCA", "MLflow", "Streamlit", "Time Series"],
  },
  {
    title: "PDF-Insight · RAG Q&A Assistant",
    image: project9,
    category: "GenAI / LLM",
    featured: true,
    description:
      "A Streamlit app that lets users upload multiple PDFs and ask detailed questions about their content. Extracted text is vectorized with OpenAI Embeddings and stored in FAISS for fast retrieval; Google Gemini-Pro generates context-aware answers, orchestrated end-to-end by LangChain. Built for document analysis over research papers, legal docs, and manuals.",
    technologies: ["Python", "LangChain", "Gemini-Pro", "FAISS", "OpenAI Embeddings", "RAG"],
  },
  {
    title: "EDA with LangChain + LLMs",
    image: project2,
    category: "GenAI / LLM",
    description:
      "Exploratory data analysis on 14,000+ data-science job listings, surfacing trends in salary, seniority, and remote adoption. Used LangChain and OpenAI APIs to generate natural-language insight, cutting manual EDA time by ~40%. Showcases integrating LLMs into data-analysis workflows for accelerated insight.",
    technologies: ["Python", "LangChain", "OpenAI API", "Pandas", "NLP", "EDA"],
  },
  {
    title: "NLP Toolkit",
    image: project8,
    category: "GenAI / LLM",
    description:
      "A customizable NLP tool powered by Hugging Face Transformers for code summarization, text summarization, sentiment analysis, rephrasing, and humanizing text. Built with Streamlit for an easy, interactive interface that returns concise summaries, sentiment with confidence scores, and clearer rewrites of technical language.",
    technologies: ["Python", "Streamlit", "HuggingFace", "BART", "GenAI"],
  },
  {
    title: "WeatherWise",
    image: project7,
    category: "GenAI / LLM",
    description:
      "An interactive weather app delivering real-time updates and a 5-day forecast for any city, with AI-generated, human-like descriptions of the weather. Combines the OpenWeatherMap API for accurate data and the OpenAI API to turn raw metrics into engaging, personalized summaries — temperature, humidity, pressure, wind, and a weekly outlook.",
    technologies: ["Python", "Streamlit", "OpenAI", "OpenWeatherMap"],
  },
  {
    title: "Fake News Prediction",
    image: project4,
    category: "Machine Learning",
    description:
      "An ML + NLP system that classifies news articles as real or fake. Processed text with NLTK (stopword removal, stemming, TF-IDF), trained a Logistic Regression classifier on a labeled Kaggle dataset with an 80/20 split, and shipped a Streamlit app for real-time predictions. Demonstrates applied NLP against misinformation.",
    technologies: ["Python", "NLTK", "Scikit-learn", "TF-IDF", "Streamlit", "NLP"],
  },
  {
    title: "Diabetes Risk Prediction",
    image: project4,
    category: "Machine Learning",
    description:
      "Built for Data Intensive Computing at the University at Buffalo on a Kaggle diabetes dataset. Performed EDA and preprocessing, then benchmarked Logistic Regression, Random Forest, SVM, Neural Networks, and K-NN. A tuned Random Forest delivered the best risk-prediction performance — applied ML on real-world healthcare data.",
    technologies: ["Python", "Scikit-learn", "Random Forest", "SVM", "Neural Network", "K-NN"],
  },
  {
    title: "Reinforcement Learning · Grid World",
    image: project10,
    category: "Machine Learning",
    description:
      "Explored SARSA and Double Q-Learning in a custom 5×5 grid-world with traps, rewards, and termination states. Implemented epsilon-greedy action selection, analyzed how learning rate, discount factor, and epsilon decay shape performance, and visualized the learned policy — building intuition for exploration vs. exploitation.",
    technologies: ["Python", "Gym", "NumPy", "SARSA", "Q-Learning", "RL"],
  },
  {
    title: "Personal AI Trainer",
    image: project12,
    category: "Computer Vision",
    description:
      "A contactless, hands-free training assistant built during COVID-19 using MediaPipe and OpenCV. Tracks body pose to enable touch-free device control and personalized workout guidance, making interaction intuitive and responsive to movement — a hygienic, real-time computer-vision experience.",
    technologies: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
  },
  {
    title: "Imagify · Text-to-Image SaaS",
    image: project6,
    category: "Web App",
    link: "https://frontend-verse2vision.onrender.com/",
    description:
      "A full-stack MERN application turning text prompts into images via the Clipdrop API. Features secure authentication with account management, a credit-based generation system, and planned payment-gateway integration (Razorpay / Stripe). Users describe an image and generate it instantly, with credits deducted per render.",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Clipdrop API"],
  },
  {
    title: "Personal Portfolio · Data World",
    image: project5,
    category: "Web App",
    description:
      "This site — an immersive, interactive portfolio built as a 3D 'data world.' A live WebGL particle constellation, a rotating data-core, decode-text animations, an interactive skill-sphere, and animated data visualizations bring the work to life. Built with React, Vite, Three.js, Tailwind, and Framer Motion.",
    technologies: ["React", "Three.js", "Framer Motion", "Tailwind", "Vite"],
  },
];

export const PROJECT_FILTERS = [
  "All",
  "Machine Learning",
  "GenAI / LLM",
  "Computer Vision",
  "Web App",
];

export const CONTACT = {
  address: "Buffalo, New York",
  phoneNo: "+1-971-264-8878",
  email: "rithvik.illandula@gmail.com",
  linkedin: "https://www.linkedin.com/in/rithvik-illandula/",
  github: "https://github.com/RITHVIKILLANDULA",
};
