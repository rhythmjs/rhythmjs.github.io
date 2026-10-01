import type { APIRoute } from "astro";
import { site } from "../data/site";

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap-index.xml", site.url)}\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
