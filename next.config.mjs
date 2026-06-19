/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/My-Portfolio",
  assetPrefix: "/My-Portfolio/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
