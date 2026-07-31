import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  ...(isProd && {
    output: "export",
    basePath: "/personal-blog-portfolio",
    assetPrefix: "/personal-blog-portfolio/",
  }),
  images: { unoptimized: true },
};

export default nextConfig;
