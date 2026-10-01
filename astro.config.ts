import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { legacyRedirects } from "./src/data/redirects";
import { site } from "./src/data/site";

export default defineConfig({
  site: site.url,
  trailingSlash: "always",
  build: { format: "directory" },
  redirects: legacyRedirects,
  vite: { plugins: [tailwindcss()] },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [react(), mdx(), sitemap({ filter: (page) => !page.endsWith(".html/") })],
  markdown: {
    processor: satteri({ features: { smartPunctuation: false } }),
    shikiConfig: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      defaultColor: false,
    },
  },
});
