// The live LLM agent runs only on Vercel. On the static GitHub Pages deploy
// (and any static preview) /api/chat doesn't exist — call Vercel cross-origin
// (the route allowlists these origins for CORS).
const VERCEL_AGENT = 'https://my-portfolio-eight-wine-15.vercel.app/api/chat'

export function agentUrl() {
  if (typeof window === 'undefined') return '/api/chat'
  const h = window.location.hostname
  if (h.endsWith('github.io') || window.location.port === '4321') return VERCEL_AGENT
  return '/api/chat'
}
