// The warehouse schema: his career as queryable tables + the visitor's own
// session (visit.events is injected live from lib/telemetry.js).
import { EXP, PROJECTS, SKILLGROUPS, IMPACT } from '@/data/portfolio-content'

export function buildTables(visitEvents) {
  return {
    'visit.events': {
      columns: ['seq', 't_ms', 'event', 'detail', 'value'],
      rows: visitEvents,
      note: 'YOUR session on this site — captured live, never leaves your browser',
    },
    'career.impact': {
      columns: ['metric', 'value', 'context'],
      rows: [
        { metric: 'nightly_runtime', value: '2h → 35m', context: 'BigQuery partitioning + SQL tuning (−71%)' },
        { metric: 'manual_review_effort', value: '−80%', context: '40+ source→target mappings documented' },
        { metric: 'records_modeled', value: '1M+', context: 'Citi Bike demand · LightGBM · 20+ MLflow runs' },
        { metric: 'churn_records', value: '500K+', context: 'XGBoost / RF churn models + web app' },
        { metric: 'datasets_validated', value: '25+', context: '5 recurring data-quality controls' },
        { metric: 'dashboards_shipped', value: '15+', context: 'Tableau + Power BI, 6 source systems' },
        { metric: 'interview_conversions', value: 22, context: 'analyst / governance roles' },
      ],
      note: 'real production numbers',
    },
    'career.experience': {
      columns: ['role', 'company', 'period', 'headline'],
      rows: EXP.map((e) => ({ role: e.role, company: e.co, period: e.period, headline: e.star })),
      note: '3 roles · 4+ years',
    },
    'career.projects': {
      columns: ['name', 'domain', 'stack', 'starred'],
      rows: PROJECTS.map((p) => ({ name: p.t, domain: p.tag, stack: p.tech.join(' · '), starred: p.star ? 'yes' : 'no' })),
      note: '9 shipped projects',
    },
    'career.skills': {
      columns: ['skill', 'category', 'core'],
      rows: SKILLGROUPS.flatMap((g) => g.items.map(([n, s]) => ({ skill: n, category: g.label, core: s ? 'yes' : 'no' }))),
      note: 'core strengths marked',
    },
  }
}

export const SUGGESTED = [
  { label: 'your own visit', sql: 'SELECT * FROM visit.events ORDER BY seq DESC LIMIT 12' },
  { label: 'his impact', sql: 'SELECT * FROM career.impact' },
  { label: 'core skills', sql: "SELECT skill, category FROM career.skills WHERE core = 'yes'" },
  { label: 'RAG work', sql: "SELECT name, stack FROM career.projects WHERE domain LIKE '%LLM%'" },
  { label: 'finance projects', sql: "SELECT name, stack FROM career.projects WHERE domain LIKE '%Finance%'" },
  { label: 'how long you read', sql: "SELECT detail, value FROM visit.events WHERE event = 'section_dwell'" },
]
