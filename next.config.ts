import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export — no server runtime. Cloudflare Pages serves /out directly.
  output: "export",
  // Allow testing the dev server from phones on the local network.
  allowedDevOrigins: ["192.168.68.65"],
  // Required for export: no on-the-fly image optimization server.
  images: { unoptimized: true },
  // Cleaner URLs on static hosts (/about/ -> index.html in each folder).
  trailingSlash: true,
  // Tailwind v4 via Turbopack (set up by create-next-app).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
