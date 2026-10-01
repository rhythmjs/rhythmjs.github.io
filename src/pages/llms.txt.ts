import type { APIRoute } from "astro";
import { sections } from "../data/nav";
import { urlFor } from "../data/redirects";
import { site } from "../data/site";
import { getDocs } from "../lib/docs";

export const GET: APIRoute = async () => {
  const docs = await getDocs();
  const lines = [`# ${site.name}`, "", `> ${site.description}`];
  for (const section of sections) {
    lines.push("", `## ${section.label}`, "");
    for (const group of section.groups) {
      for (const item of group.items) {
        const entry = docs.get(item.id)!;
        const url = new URL(urlFor(item.id), site.url);
        lines.push(`- [${entry.data.title}](${url}): ${entry.data.description ?? entry.data.lead}`);
      }
    }
  }
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });
};
