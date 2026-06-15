import { CORPUS } from "./ragCorpus";

export { CORPUS };

/**
 * Real retrieval-augmented search, fully in the browser. Lazily loads a
 * quantized all-MiniLM-L6-v2 (transformers.js), embeds the corpus once, and
 * ranks chunks against the query by cosine similarity. If the model can't load
 * (offline, blocked CDN, no WASM), callers fall back to keywordQuery().
 */

let modelPromise = null;
let corpusVecs = null;

const dot = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s; // vectors are L2-normalized, so dot product == cosine similarity
};

// load the model + embed the corpus exactly once (memoized)
function ensureModel(onProgress) {
  if (!modelPromise) {
    modelPromise = (async () => {
      const { pipeline, env } = await import("@xenova/transformers");
      env.allowLocalModels = false; // pull the model from the HF hub
      const extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2",
        { quantized: true, progress_callback: onProgress }
      );
      const embed = async (text) => {
        const out = await extractor(text, { pooling: "mean", normalize: true });
        return out.data;
      };
      corpusVecs = [];
      for (const c of CORPUS) corpusVecs.push(await embed(c.text));
      return { embed };
    })().catch((e) => {
      modelPromise = null; // allow a retry on next attempt
      throw e;
    });
  }
  return modelPromise;
}

export async function warmModel(onProgress) {
  await ensureModel(onProgress);
}

export async function semanticQuery(q, k = 3, onProgress) {
  const { embed } = await ensureModel(onProgress);
  const qv = await embed(q);
  return CORPUS.map((c, i) => ({ ...c, score: dot(qv, corpusVecs[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

// model-free fallback: simple term-overlap scoring over the same corpus
export function keywordQuery(q, k = 3) {
  const terms = q
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  return CORPUS.map((c) => {
    const t = c.text.toLowerCase();
    const hits = terms.reduce((s, w) => s + (t.includes(w) ? 1 : 0), 0);
    return { ...c, score: terms.length ? hits / terms.length : 0 };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
