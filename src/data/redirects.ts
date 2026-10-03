import { sections } from "./nav";

const ids = sections.flatMap((section) => section.groups.flatMap((group) => group.items.map((item) => item.id)));

export const urlFor = (id: string): string => (id.endsWith("/index") ? `/${id.slice(0, -"index".length)}` : `/${id}/`);

export const legacyRedirects: Record<string, string> = {
  ...Object.fromEntries(ids.filter((id) => !id.endsWith("/index")).map((id) => [`/${id}.html`, urlFor(id)])),
  "/philosophy.html": "/#philosophy",
  "/rhythm/providers/": "/rhythm/context/",
  "/rhythm/providers.html": "/rhythm/context/",
};
