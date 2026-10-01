import { readdirSync } from "node:fs";

const root = new URL("../", import.meta.url).pathname;
const segment = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const route = /^\[\.\.\.[a-z0-9]+(-[a-z0-9]+)*\]$/;
const exceptions = new Set(["public/CNAME"]);

const problems: string[] = [];
let checked = 0;

for (const dir of ["src", "scripts", "public"]) {
  for (const entry of readdirSync(`${root}${dir}`, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const path = `${entry.parentPath.slice(root.length)}/${entry.name}`;
    if (exceptions.has(path) || entry.name.startsWith(".")) continue;
    checked++;
    const stem = entry.name.replace(/\.[a-z0-9]+$/, "");
    if (!route.test(stem) && !stem.split(".").every((part) => segment.test(part))) problems.push(path);
  }
}

if (problems.length > 0) {
  console.error(`File names must be kebab-case:\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`names: ${checked} files, all kebab-case.`);
