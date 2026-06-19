import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * - `output: "export"` emits a fully static site into `out/`.
 * - `basePath` is injected by the Pages workflow (e.g. "/mahadev-apf") so that
 *   assets and links resolve under the project-pages subpath. Locally it is
 *   empty, so `npm run dev` / `npm run build` work at the root.
 * - `images.unoptimized` is required because the Next image optimizer needs a
 *   server, which Pages does not provide.
 */
const basePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
