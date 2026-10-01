import { urlFor } from "../data/redirects";
import { site } from "../data/site";
import type { Crumb } from "./docs";

const absolute = (path: string) => new URL(path, site.url).toString();

export const twitterHandle = `@${site.x.split("/").pop()}`;

export const homeImage = absolute("/og/home.png");

export const imageFor = (slug: string) => absolute(`/og/${slug}.png`);

export const iconUrl = (size: 180 | 192 | 512) => `/icons/${size}.png`;

const organization = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: absolute(iconUrl(512)),
  sameAs: [site.github, site.x],
};

const website = {
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.title,
  description: site.description,
  inLanguage: "en",
  publisher: { "@id": organization["@id"] },
};

export const siteJsonLd = { "@context": "https://schema.org", "@graph": [organization, website] };

export function pageJsonLd(page: { id: string; title: string; description: string; image: string; crumbs: Crumb[] }) {
  const url = absolute(urlFor(page.id));
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      website,
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: page.title,
        description: page.description,
        url,
        mainEntityOfPage: url,
        image: page.image,
        inLanguage: "en",
        isPartOf: { "@id": website["@id"] },
        author: { "@id": organization["@id"] },
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: page.crumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.label,
          item: crumb.href ? absolute(crumb.href) : url,
        })),
      },
    ],
  };
}

export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
