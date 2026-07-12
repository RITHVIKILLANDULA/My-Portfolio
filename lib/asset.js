// Prefixes public-asset paths + internal file links with the basePath so they
// resolve on GitHub Pages (served under /My-Portfolio). On Vercel the env is
// unset → '' → paths stay at root. next/image with unoptimized does NOT
// auto-prefix basePath, so asset refs and raw file links must use this.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const asset = (p) => `${BASE_PATH}${p}`
