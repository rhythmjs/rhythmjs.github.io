import type { APIRoute, GetStaticPaths } from "astro";
import { urlFor } from "../../data/redirects";
import { site } from "../../data/site";
import { getDocs, getPageContext, slugFor } from "../../lib/docs";
import { renderCard, type OgCard } from "../../lib/og";

const host = new URL(site.url).host;

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await getDocs();
  const pages = [...docs].map(([id, entry]) => {
    const { section, group } = getPageContext(id, entry.data.title);
    const card: OgCard = {
      eyebrow: group.label === section.label ? section.label : `${section.label} · ${group.label}`,
      title: entry.data.title,
      lead: entry.data.lead,
      ...(group.pkg ? { badge: group.pkg } : {}),
      footer: `${host}${urlFor(id)}`,
    };
    return { params: { slug: slugFor(id) }, props: { card } };
  });
  const home: OgCard = { eyebrow: "Documentation", title: site.tagline, lead: site.description, footer: host };
  return [{ params: { slug: "home" }, props: { card: home } }, ...pages];
};

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props.card as OgCard)), { headers: { "content-type": "image/png" } });
