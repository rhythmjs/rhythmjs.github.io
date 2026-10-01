import { getCollection, type CollectionEntry } from "astro:content";
import { sections, type NavGroup, type NavItem, type NavSection } from "../data/nav";
import { urlFor } from "../data/redirects";
import { site } from "../data/site";

export type DocEntry = CollectionEntry<"docs">;

export interface PageLink {
  id: string;
  url: string;
  label: string;
  group: string;
}

export interface Crumb {
  label: string;
  href?: string;
}

export interface PageContext {
  section: NavSection;
  group: NavGroup;
  item: NavItem;
  prev?: PageLink;
  next?: PageLink;
  crumbs: Crumb[];
  repo: string;
  documentTitle: string;
  editUrl: string;
}

interface Located {
  section: NavSection;
  group: NavGroup;
  item: NavItem;
}

const locations = new Map<string, Located>();
for (const section of sections) {
  for (const group of section.groups) {
    for (const item of group.items) locations.set(item.id, { section, group, item });
  }
}

let cached: Promise<Map<string, DocEntry>> | undefined;

export function getDocs(): Promise<Map<string, DocEntry>> {
  cached ??= (async () => {
    const entries = await getCollection("docs");
    const byId = new Map(entries.map((entry) => [entry.id, entry]));
    const orphans = [...byId.keys()].filter((id) => !locations.has(id));
    const ghosts = [...locations.keys()].filter((id) => !byId.has(id));
    if (orphans.length || ghosts.length) {
      throw new Error(
        `Navigation out of sync with content. Not in src/data/nav.ts: [${orphans.join(", ")}]. No content file: [${ghosts.join(", ")}].`,
      );
    }
    return byId;
  })();
  return cached;
}

const overview: PageLink = { id: "index", url: "/", label: "Overview", group: "Home" };

function linkTo(id: string): PageLink {
  const { item, group } = locations.get(id)!;
  return { id, url: urlFor(id), label: item.label, group: group.label };
}

export function getPageContext(id: string, title: string): PageContext {
  const location = locations.get(id);
  if (!location) throw new Error(`Unknown page: ${id}`);
  const { section, group, item } = location;

  const order = section.id === "packages" ? group.items : section.groups.flatMap((entry) => entry.items);
  const index = order.findIndex((entry) => entry.id === id);
  const prevItem = order[index - 1];
  let nextItem: NavItem | undefined = order[index + 1];
  if (!nextItem && section.id === "tutorial") nextItem = sections.find((s) => s.id === "packages")?.groups[0]?.items[0];
  const prev = prevItem ? linkTo(prevItem.id) : section.id === "tutorial" ? overview : undefined;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: section.label, href: urlFor(section.groups[0]!.items[0]!.id) },
  ];
  if (group.label !== section.label && group.items.length > 1)
    crumbs.push({ label: group.label, href: urlFor(group.items[0]!.id) });
  crumbs.push({ label: item.label });

  return {
    section,
    group,
    item,
    prev,
    next: nextItem && linkTo(nextItem.id),
    crumbs,
    repo: item.repo ?? group.repo,
    documentTitle: `${title} · ${group.pkg ?? site.name}`,
    editUrl: `${site.docsRepo}/edit/${site.docsBranch}/src/content/docs/${id}.mdx`,
  };
}

export function slugFor(id: string): string {
  return id.endsWith("/index") ? id.slice(0, -"/index".length) : id;
}
