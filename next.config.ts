import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/personal-blog-portfolio",
  assetPrefix: "/personal-blog-portfolio/",
  images: { unoptimized: true },
};

export default nextConfig;
