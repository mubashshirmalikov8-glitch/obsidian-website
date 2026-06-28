import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project. A stray lockfile exists in a parent
  // directory, so Turbopack would otherwise infer the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    // Modern formats for the optimized team portraits (AVIF preferred, WebP fallback).
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Default locale: send the bare root to Uzbek.
      { source: "/", destination: "/uz", permanent: false },
    ];
  },
};

export default nextConfig;
