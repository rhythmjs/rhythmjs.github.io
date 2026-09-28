import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { posix as path } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname;

const guides = [
  ["index.html", "Introduction"],
  ["getting-started.html", "Quick start"],
  ["philosophy.html", "Philosophy"],
  ["template.html", "Starter template"],
];

const groups = [
  ["Core", [
    ["rhythm/index.html", "Overview"],
    ["rhythm/middleware.html", "Middleware &amp; context"],
    ["rhythm/providers.html", "Providers &amp; lifecycle"],
    ["rhythm/modules.html", "Encapsulated modules"],
    ["rhythm/api.html", "API reference"],
  ]],
  ["Router", [
    ["router/index.html", "Overview"],
    ["router/adapters.html", "Runtime adapters"],
    ["router/api.html", "API reference"],
  ]],
  ["CLI", [
    ["cli/index.html", "Overview"],
    ["cli/prompts.html", "Interactive prompts"],
    ["cli/adapters.html", "Runtime adapters"],
    ["cli/api.html", "API reference"],
  ]],
  ["Middleware", [
    ["middleware/index.html", "Overview"],
    ["middleware/api.html", "API reference"],
  ]],
  ["HTTP", [
    ["http/index.html", "Overview"],
    ["http/api.html", "API reference"],
  ]],
  ["Security", [
    ["security/index.html", "Overview"],
    ["security/api.html", "API reference"],
  ]],
  ["Observability", [
    ["observability/index.html", "Overview"],
    ["observability/api.html", "API reference"],
  ]],
];

const pages = [...guides.map(([p]) => p), ...groups.flatMap(([, links]) => links.map(([p]) => p))];

const rel = (from, to) => path.relative(path.dirname(from), to) || ".";

const isGuidePage = (page) => guides.some(([target]) => target === page);

function navFor(page) {
  const link = ([target, label]) =>
    `<a href="${rel(page, target)}"${target === page ? ' aria-current="page"' : ""}>${label}</a>`;
  let out = "";
  if (isGuidePage(page)) {
    out = `<div class="nav-group">\n<p>Guide</p>\n${guides.map(link).join("\n")}\n</div>\n`;
  } else {
    for (const [name, links] of groups) {
      const open = links.some(([target]) => target === page);
      out += `<details class="nav-group package-group"${open ? " open" : ""}>\n<summary>${name}</summary>\n${links.map(link).join("\n")}\n</details>\n`;
    }
  }
  return `<nav aria-label="Documentation">\n${out}</nav>`;
}

function headerFor(page) {
  const guide = isGuidePage(page);
  return (
    `<nav class="header-tabs" aria-label="Site">\n` +
    `<a href="${rel(page, "index.html")}"${guide ? ' aria-current="true"' : ""}>Guide</a\n` +
    `><a href="${rel(page, "rhythm/index.html")}"${guide ? "" : ' aria-current="true"'}>Packages</a>\n` +
    `</nav>\n` +
    `<nav class="header-links" aria-label="External">\n` +
    `<a href="https://github.com/rhythmjs">GitHub</a>\n` +
    `</nav>`
  );
}

const HEADER_NAV_PATTERN =
  /<nav class="header-tabs"[\s\S]*?<\/nav>\s*<nav class="header-links"[\s\S]*?<\/nav>|<nav class="header-links"[\s\S]*?<\/nav>/;

let failures = 0;
for (const page of pages) {
  const file = path.join(ROOT, page);
  if (!existsSync(file)) {
    console.error(`MISSING: ${page}`);
    failures++;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const matches = html.match(/<nav aria-label="Documentation">[\s\S]*?<\/nav>/g) ?? [];
  if (matches.length !== 2) {
    console.error(`EXPECTED 2 nav blocks, found ${matches.length}: ${page}`);
    failures++;
    continue;
  }
  if (!HEADER_NAV_PATTERN.test(html)) {
    console.error(`NO HEADER NAV FOUND: ${page}`);
    failures++;
    continue;
  }
  writeFileSync(
    file,
    html
      .replace(/<nav aria-label="Documentation">[\s\S]*?<\/nav>/g, navFor(page))
      .replace(HEADER_NAV_PATTERN, headerFor(page)),
  );
  console.log(`ok: ${page}`);
}
process.exit(failures ? 1 : 0);
