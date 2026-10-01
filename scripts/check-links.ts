import { readdirSync, statSync } from "node:fs";
import { posix } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

interface Page {
  file: string;
  url: string;
  ids: Set<string>;
  links: string[];
}

async function parse(file: string): Promise<Page> {
  const ids = new Set<string>();
  const links: string[] = [];
  const html = await Bun.file(file).text();
  await new HTMLRewriter()
    .on("[id]", { element: (el) => void ids.add(el.getAttribute("id")!) })
    .on("a[href]", { element: (el) => void links.push(el.getAttribute("href")!) })
    .transform(new Response(html))
    .text();
  const url = "/" + file.slice(dist.length).replace(/index\.html$/, "");
  return { file, url, ids, links };
}

const isFile = (path: string) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

const files = (readdirSync(dist, { recursive: true }) as string[])
  .filter((entry) => entry.endsWith(".html"))
  .map((entry) => dist + entry)
  .filter(isFile);

const pages = new Map<string, Page>();
for (const file of files) {
  const page = await parse(file);
  pages.set(page.url, page);
}

function resolveFile(pathname: string): string | undefined {
  const candidates = pathname.endsWith("/")
    ? [`${dist}${pathname.slice(1)}index.html`]
    : [`${dist}${pathname.slice(1)}`, `${dist}${pathname.slice(1)}/index.html`, `${dist}${pathname.slice(1)}.html`];
  return candidates.find(isFile);
}

const problems: string[] = [];
let checked = 0;

for (const page of pages.values()) {
  for (const href of page.links) {
    if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) continue;
    checked++;
    const [target, fragment] = href.split("#") as [string, string | undefined];
    const pathname = target === "" ? page.url : posix.resolve(posix.dirname(page.url + "x"), target.split("?")[0]!);
    const normalized = target.endsWith("/") && !pathname.endsWith("/") ? `${pathname}/` : pathname;
    const file = resolveFile(normalized);
    if (!file) {
      problems.push(`${page.url}: broken link ${href}`);
      continue;
    }
    if (fragment) {
      const targetPage = [...pages.values()].find((candidate) => candidate.file === file);
      if (targetPage && !targetPage.ids.has(decodeURIComponent(fragment))) {
        problems.push(`${page.url}: missing anchor ${href}`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  console.error(`\n${problems.length} broken link(s) across ${pages.size} pages.`);
  process.exit(1);
}
console.log(`links: ${checked} internal links across ${pages.size} pages, all resolve.`);
