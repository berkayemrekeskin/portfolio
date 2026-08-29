import type { NextConfig } from "next";

// Set at build time (see the `build:pages` script). GitHub Pages serves this
// repo from /portfolio, so every emitted URL needs that prefix; left empty for
// local dev.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // The scene is pixel art. Next's optimiser resamples, which softens hard edges.
  images: { unoptimized: true },
};

export default nextConfig;
