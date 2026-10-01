import * as pagefind from "pagefind";
import { readdirSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const ids = readdirSync(`${root}src/content/docs`, { recursive: true })
  .map(String)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.slice(0, -".mdx".length));

const urlFor = (id: string) => (id.endsWith("/index") ? `/${id.slice(0, -"index".length)}` : `/${id}/`);
const urls = ["/", ...ids.map(urlFor)];

const { index, errors: createErrors } = await pagefind.createIndex({});
if (!index) throw new Error(`Could not create the search index: ${createErrors.join(", ")}`);

for (const url of urls) {
  const content = await Bun.file(`${root}dist${url}index.html`).text();
  const { errors } = await index.addHTMLFile({ url, content });
  if (errors.length) throw new Error(`Could not index ${url}:\n${errors.join("\n")}`);
}

const { outputPath, errors } = await index.writeFiles({ outputPath: `${root}dist/pagefind` });
if (errors.length) throw new Error(`Could not write the search index:\n${errors.join("\n")}`);
await pagefind.close();
console.log(`search: indexed ${urls.length} pages -> ${outputPath}`);
