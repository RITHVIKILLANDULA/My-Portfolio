/** @type {import('next').NextConfig} */
// Dual-mode:
//   • Vercel (default): SSR + edge /api/chat live agent. NEXT_PUBLIC_BASE_PATH unset.
//   • GitHub Pages: set NEXT_PUBLIC_BASE_PATH=/My-Portfolio → static export under that basePath
//     (agent falls back to in-browser keyword retrieval; no server route).
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  ...(base ? { output: 'export', basePath: base, trailingSlash: true } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
