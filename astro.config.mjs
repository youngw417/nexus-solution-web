// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.nexus-ai-sol.com",
  trailingSlash: "ignore",
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/brochure") })],
  vite: {
    plugins: [tailwindcss()],
    // 로컬 개발: /api 요청을 Azure Functions(`cd api && func start`, 7071 포트)로 넘깁니다
    server: { proxy: { "/api": "http://localhost:7071" } },
  },
});
