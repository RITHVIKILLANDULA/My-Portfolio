// Client-side knowledge base — the robot answers questions about Rithvik with
// no backend (static GitHub Pages). Keyword-matched, friendly, first-person-ish.
import { CONTACT } from "../../constants";

const KB = [
  {
    id: "about",
    keys: ["who", "about", "yourself", "rithvik", "tell me", "intro", "you"],
    gesture: "wave",
    answer:
      "I'm Rithvik's AI guide. He's an AI Data Analyst — 4+ years across Deloitte, WAFU and the University at Buffalo turning messy, multi-source data into decisions. 1M+ records modeled, manual work cut 80%, pipelines that run themselves.",
  },
  {
    id: "skills",
    keys: ["skill", "stack", "tool", "tech", "language", "know", "use"],
    gesture: "thumbsUp",
    answer:
      "His toolkit: Python, SQL, BigQuery, Spark and Airflow on the data side; scikit-learn, XGBoost and LightGBM for ML; and LangChain, RAG, Vertex AI and OpenAI for AI/LLMs — plus Tableau and Power BI for the story.",
  },
  {
    id: "ai",
    keys: ["ai", "llm", "ml", "machine learning", "model", "rag", "agent", "gpt"],
    gesture: "thumbsUp",
    answer:
      "AI is his playground — RAG pipelines, LLM apps with LangChain and Vertex AI, an autonomous agent system (fetch, analyze, tailor, review), plus classic ML: forecasting, anomaly detection and gradient boosting.",
  },
  {
    id: "experience",
    keys: ["experience", "work", "job", "deloitte", "wafu", "buffalo", "career", "where"],
    gesture: "yes",
    answer:
      "AI Data Analyst at the University at Buffalo (2025), Data Analytics Engineer at Deloitte (2022–24), and Data Analyst at WAFU. He's built 15+ dashboards, unified 6 source systems, and cut nightly runtimes from 2 hours to 35 minutes.",
  },
  {
    id: "projects",
    keys: ["project", "built", "build", "ship", "portfolio", "made", "work on"],
    gesture: "thumbsUp",
    answer:
      "He's shipped churn and demand-forecasting models, a RAG PDF Q&A assistant, a BigQuery ML pipeline, anomaly-detection systems and more — each one animated below. Scroll to Projects to explore them.",
  },
  {
    id: "education",
    keys: ["education", "degree", "study", "school", "university", "master", "ms", "graduate"],
    gesture: "yes",
    answer:
      "He's finishing an M.S. in Computer Science at the University at Buffalo, focused on machine learning and data-intensive computing — and holds Google Cloud, Microsoft Power BI and Fabric certifications.",
  },
  {
    id: "contact",
    keys: ["contact", "email", "reach", "hire", "linkedin", "github", "connect", "available", "open"],
    gesture: "wave",
    answer: `Reach him at ${CONTACT.email}, on LinkedIn, or GitHub. He's open to AI / Data Analyst & engineering roles in ${CONTACT.address}.`,
  },
  {
    id: "impact",
    keys: ["impact", "achieve", "result", "metric", "number", "best", "good", "why hire"],
    gesture: "thumbsUp",
    answer:
      "The scoreboard: 1M+ records modeled, 25+ datasets profiled, 6 source systems unified, nightly runtime cut 2h → 35m, and manual review down 80%. He makes the hardest data problem in the room look easy.",
  },
];

export const SUGGESTIONS = [
  { label: "Who is Rithvik?", q: "who are you" },
  { label: "His skills?", q: "skills" },
  { label: "Experience?", q: "experience" },
  { label: "Projects?", q: "projects" },
  { label: "How to contact?", q: "contact" },
];

export const GREETING = {
  answer:
    "Hi — I'm Rithvik's AI guide. Ask me anything about him: his skills, experience, projects, or how to reach him.",
  gesture: "wave",
};

export function answerFor(question) {
  const q = (question || "").toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const item of KB) {
    let score = 0;
    for (const k of item.keys) if (q.includes(k)) score += k.length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  if (best) return { answer: best.answer, gesture: best.gesture };
  return {
    answer:
      "Good question! I know about his skills, AI/ML work, experience, projects, education and how to reach him — try one of the chips, or ask away.",
    gesture: "no",
  };
}
