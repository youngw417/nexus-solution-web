// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.nexus-ai-sol.com",
  trailingSlash: "ignore",
  integrations: [react(), sitemap({ filter: (page) => !page.includes("/brochure") })],
  vite: { plugins: [tailwindcss()] },
});
