import type { APIRoute } from "astro";
import { site } from "../data/site";
import { iconUrl } from "../lib/seo";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: site.title,
        short_name: site.name,
        description: site.description,
        start_url: "/",
        scope: "/",
        display: "browser",
        background_color: "#141a1a",
        theme_color: "#141a1a",
        icons: [
          { src: iconUrl(192), sizes: "192x192", type: "image/png", purpose: "any" },
          { src: iconUrl(512), sizes: "512x512", type: "image/png", purpose: "any" },
          { src: iconUrl(512), sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      null,
      2,
    ),
    { headers: { "content-type": "application/manifest+json" } },
  );
