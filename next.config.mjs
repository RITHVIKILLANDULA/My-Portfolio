/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-native (SSR + edge API routes). No static export / basePath.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
