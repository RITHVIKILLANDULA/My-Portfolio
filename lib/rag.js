import { CORPUS } from '@/data/aboutCorpus'

export { CORPUS }

/**
 * Retrieval over the about-me corpus, fully in the browser.
 *
 * semanticQuery() lazily loads a quantized all-MiniLM-L6-v2 (transformers.js)
 * and ranks chunks by cosine similarity. If the model package isn't installed
 * or can't load (offline / blocked CDN / no WASM), it throws and callers fall
 * back to keywordQuery() over the very same facts — so the agent always answers.
 */

let modelPromise = null
let corpusVecs = null

const dot = (a, b) => {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s // vectors are L2-normalized → dot product == cosine similarity
}

function ensureModel(onProgress) {
  if (!modelPromise) {
    modelPromise = (async () => {
      // dynamic + variable specifier so the bundler never hard-requires it
      const mod = '@xenova/transformers'
      const { pipeline, env } = await import(/* webpackIgnore: true */ mod)
      env.allowLocalModels = false
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true,
        progress_callback: onProgress,
      })
      const embed = async (text) => {
        const out = await extractor(text, { pooling: 'mean', normalize: true })
        return out.data
      }
      corpusVecs = []
      for (const c of CORPUS) corpusVecs.push(await embed(c.text))
      return { embed }
    })().catch((e) => { modelPromise = null; throw e })
  }
  return modelPromise
}

export async function warmModel(onProgress) {
  await ensureModel(onProgress)
}

export async function semanticQuery(q, k = 3, onProgress) {
  const { embed } = await ensureModel(onProgress)
  const qv = await embed(q)
  return CORPUS.map((c, i) => ({ ...c, score: dot(qv, corpusVecs[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

// model-free fallback: intent-tag-weighted term overlap over the same corpus.
// Intent tags (per chunk) dominate so "reach"->Contact, "deloitte"->Deloitte,
// "biggest impact"->Impact reliably surface the right passage on a single word.
const STOP = new Set([
  'do', 'is', 'at', 'an', 'of', 'to', 'me', 'my', 'he', 'it', 'in', 'on', 'so', 'or',
  'as', 'if', 'be', 'by', 'we', 'us', 'am', 'the', 'and', 'for', 'his', 'her', 'him',
  'you', 'are', 'was', 'did', 'does', 'can', 'with', 'that', 'this', 'what', 'how',
  'who', 'why', 'tell', 'give', 'know', 'about?',
])
export function keywordQuery(q, k = 3) {
  const ql = q.toLowerCase()
  const terms = ql.split(/\W+/).filter((w) => w.length >= 2 && !STOP.has(w))
  if (!terms.length) return CORPUS.slice(0, k).map((c) => ({ ...c, score: 0 }))
  return CORPUS.map((c) => {
    const text = c.text.toLowerCase()
    const src  = c.source.toLowerCase()
    const tags = (c.tags || []).map((t) => t.toLowerCase())
    let hits = 0
    for (const t of tags) if (t.includes(' ') && ql.includes(t)) hits += 4   // multi-word intent phrase
    for (const w of terms) {
      if (tags.includes(w)) hits += 4                       // exact intent-tag hit dominates
      else if (tags.some((t) => t.includes(w))) hits += 2
      if (src.includes(w))  hits += 2
      if (text.includes(w)) hits += 1
    }
    return { ...c, score: hits }
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

// Single entry point: try the real embeddings, fall back to keywords.
// Returns { results, mode } where mode is 'semantic' | 'keyword'.
export async function ask(q, k = 3, onProgress) {
  try {
    const results = await semanticQuery(q, k, onProgress)
    return { results, mode: 'semantic' }
  } catch {
    return { results: keywordQuery(q, k), mode: 'keyword' }
  }
}
