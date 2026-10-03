# RhythmJS documentation

The documentation site for [RhythmJS](https://github.com/rhythmjs), published at <https://rhythm.js.org>. It is built with [Astro](https://astro.build), content in MDX, [Tailwind CSS](https://tailwindcss.com) v4 and [shadcn/ui](https://ui.shadcn.com), with a handful of React islands for the interactive parts. The ecosystem it documents is coupled to [Bun](https://bun.com) on purpose, and so is the tooling here.

## Commands

| Command               | What it does                                                            |
| --------------------- | ----------------------------------------------------------------------- |
| `bun install`         | Install dependencies                                                    |
| `bun run dev`         | Dev server at <http://localhost:4321> (search needs a build, see below) |
| `bun run build`       | Build the site into `dist/`, then build the search index                |
| `bun run preview`     | Serve `dist/` locally                                                   |
| `bun run check`       | Prettier check, oxlint, kebab-case file names and `astro check`         |
| `bun run check:links` | After a build: verify every internal link and `#fragment` in `dist/`    |
| `bun run fmt`         | Format everything with Prettier                                         |

`astro check` does not support TypeScript 7 yet, so this repository pins TypeScript 6. Revisit when Astro ships TypeScript 7 support.

## Layout

```
src/
  content/docs/       one MDX file per docs page, mirroring the URL (rhythm/context.mdx -> /rhythm/context/)
  landing/            MDX parts of the landing page: features, can-do, philosophy, closing
  data/nav.ts         docs navigation: sections, groups, page order and sidebar labels (single source of truth)
  data/site.ts        site name, version, URLs
  data/redirects.ts   URL helper and the legacy .html redirect map
  lib/                page context (breadcrumbs, previous/next), heading helpers, seo.ts (JSON-LD) and og.ts (share images)
  layouts/            base-layout (head, theme script), landing-layout (no sidebar) and docs-layout (sidebar, article, TOC)
  components/ui/      shadcn/ui components (lyra style), owned by this repo and edited in place
  components/         Astro components, including the MDX components below
  components/landing/ hero (centered copy), pipeline (the onion diagram) and section-head for the landing page
  components/react/   React islands: search, theme-toggle, mobile-nav, table-of-contents
  styles/             global.css (Tailwind, theme tokens) plus layout, prose and landing stylesheets
  pages/              the landing page (index.astro), the docs catch-all route, the 404 page and the generated files (see "SEO and social previews")
scripts/              build-search.ts (Pagefind index), check-links.ts and check-filenames.ts
public/               favicon.svg (the one icon source), CNAME
```

The site has three parts:

- **Landing page (`/`)**: no sidebar, centered and plain. The **hero** and the header together fill exactly one screen: the badges, tagline, the opening sentence of the old introduction, the Get started and GitHub buttons and the `bunx rhythmx new my-app` command (`site.installCommand`) sit in the middle and a tick ruler hanging from the header line (a short tick every 0.75rem, a taller one every fifth, fading toward both ends) is the only background pattern (`.hero-ruler` in `landing.css`). Nothing in the hero is animated: the bars are static. Below it come **One request, one pipeline** (a static diagram of the onion: request, logging, auth, validation and handler going in, and the same layers back out; `components/landing/pipeline.astro`), **Small by design** (five features in a plain row), **With Rhythm you can** (eight actions that each link straight to a package, plus "Browse all packages"), **Philosophy** (three short numbered statements) and a closing call to action. There is no code, no card around the hero and no sticky bar; the quick start and the starter template live in the docs.
- **Tutorial**: the quick start page with the full walkthrough, then the 14-step tutorial, with a sidebar.
- **Packages**: one group per package, with a sidebar of collapsible groups.

The header tabs are Tutorial, Packages and Integrations (recipes under `src/content/docs/integrations/`: AI SDK, Better Auth, Nodemailer, Resend, Redis, file upload, Scalar and Swagger UI, one reading path with no overview page). The header carries no version badge; the version appears in the footer and on the landing page. Reading order is derived from `nav.ts`: the tutorial opens from the landing page, runs through the quick start and the 14 steps, and leads into the first package page; package pages chain within their group.

## SEO and social previews

Everything below is generated at build time from `src/data/site.ts`, `src/data/nav.ts`, the page front matter and `public/favicon.svg`, so there are no duplicated values to keep in sync.

- **Head tags** (`layouts/base-layout.astro`): title, description, canonical URL, `robots` (`noindex` on the 404 page, `max-image-preview:large` elsewhere), Open Graph and Twitter `summary_large_image` tags with the image's size and alt text, icons and the manifest link.
- **Share images** (`pages/og/[...slug].png.ts`, `lib/og.ts`): one 1200x630 PNG per docs page plus `/og/home.png` for the landing page, rendered with `satori` (text becomes vector paths, so no system fonts are needed) and rasterized with `sharp`. The card shows the section and group, the page title, the first 120 characters of the lead, the package badge and the URL. It uses the Geist and JetBrains Mono static fonts from `@fontsource/*` (`satori` cannot read the `.woff2` files of the variable packages). Titles over 90 characters and leads over 120 are cut at a word boundary.
- **Structured data** (`lib/seo.ts`): JSON-LD on every page. The landing page carries `Organization` and `WebSite`; each docs page adds a `TechArticle` and a `BreadcrumbList` built from the same breadcrumbs as the page.
- **Icons and manifest**: `pages/icons/[size].png.ts` renders the 180, 192 and 512 px icons from `favicon.svg`, `pages/favicon.ico.ts` wraps a 48 px PNG in an `.ico`, and `pages/site.webmanifest.ts` builds the manifest from `site.ts`.
- **Crawlers**: `pages/robots.txt.ts` (points at the sitemap, whose URL comes from `site.url`), the `@astrojs/sitemap` integration, and `pages/llms.txt.ts`, a Markdown index of every docs page for AI tools.

## File naming

Every file under `src/`, `scripts/` and `public/` is **kebab-case**, components included: `mobile-nav.tsx`, `base-layout.astro`, `def-list.astro`, `use-active-section.ts`. This matches the shadcn components in `components/ui/`. Export and component names stay PascalCase (`import MobileNav from "./mobile-nav"`). The only exceptions are Astro's route syntax (`[...slug].astro`, `[...slug].png.ts`), numeric names (`404.astro`) and `public/CNAME`, which GitHub Pages requires. `bun run check` fails on anything else (`scripts/check-filenames.ts`).

## Writing documentation

The packages' source code is the source of truth. When the docs and the code disagree, fix the docs against the code.

### Edit the landing page

Its content lives in `src/landing/*.mdx` and is assembled in `src/pages/index.astro`; the hero is `components/landing/hero.astro`. Each kind of content has its own component, so do not reach for a card by default: `<CanDo items={[...]} />` for the "you can do this" links into package docs (do not list every package), `<Features>` for the plain feature row and `<Principles>` for the short numbered statements. Keep the philosophy to a few points. The hero must stay exactly one screen tall with the header (`min-height: calc(100dvh - var(--header-h))`); a browser check enforces it. Keep heading ids stable: links such as `/#philosophy` rely on them. Keep code off this page: examples and the starter template belong on the quick start docs page (`/getting-started/`).

### Add a docs page

1. Create `src/content/docs/<group>/<page>.mdx` with frontmatter:

   ```mdx
   ---
   title: Startup context
   lead: Create shared dependencies once, assign them to the context, and close them yourself.
   description: Optional longer text for search engines and social cards; falls back to the lead.
   ---
   ```

2. Add `{ id: "<group>/<page>", label: "Sidebar label" }` to the group's `items` in `src/data/nav.ts`. The build fails if a page and the navigation disagree.
3. Link to other pages with their final URLs: `[Startup context](/rhythm/context/)`. A group's landing page is `<group>/index.mdx` and lives at `/<group>/`.

### Content conventions

- Pages use `##` headings only. The table of contents and the previous/next links are generated.
- **Stable anchors:** append `[#custom-id]` to a heading to pin its anchor, for example `## Types subpath [#types-subpath]`. Without a marker the anchor is derived from the heading text. Many existing headings pin short ids because other pages link to them; do not rename them casually.
- Fenced code blocks need a language (`ts`, `bash`, `json`, `yaml`, `text`). Highlighting is Shiki with a light and a dark theme.
- Components are available in every MDX file without imports:

  ```mdx
  <Callout title="Heads up">Body text, with **markdown**.</Callout>
  <Callout type="warning" title="Careful">
    `type` is `note` (default), `tip` or `warning`.
  </Callout>

  <DefList>
    <Def sig="derive(fn)" id="derive">
      What it does.
    </Def>
  </DefList>
  ```

  Use `sig={"use<TExtra>(middleware)"}` when a signature contains `<`, `>` or braces. `Def` ids are deep-linkable anchors, so keep them unique within a page.

- Smart punctuation is turned off so prose and code keep the exact characters you write, and code ligatures are off so `=>` shows as typed.

## Design system

The look is the shadcn **lyra** preset: square corners, a mono typeface, Base UI primitives and Phosphor icons, with the palette carried over from the original site instead of the shadcn defaults: deep teal ink and one **teal** accent (`#007566`, mint `#5ee9bc` in dark mode) with green-tinted washes and lines, also used in the logo and favicon. Orange and purple are deliberately avoided; the user called orange an overused AI-site colour.

- **Tokens** live in `src/styles/global.css` as shadcn CSS variables (`--background`, `--primary`, `--muted` and friends) with `--radius: 0`. Light and dark share the same names; dark is the `.dark` class on `<html>`.
- **One page background, almost no borders.** The whole page uses a single background colour (`--background`): no tinted section bands on the landing page and no tinted sidebar. `--border` is transparent and the components have their outlines removed, so cards and code blocks are told apart by tone (`muted`, `secondary`) rather than lines. The only visible borders are the two separators: the header's bottom border and the docs sidebar's right border, both in `--line`. Do not add other borders. Cards, tiles and panels are plain rectangles with four square corners; nothing on the site is clipped or chamfered. Keep new components border-free and square.
- **Type:** JetBrains Mono for the interface and headings, Geist for long-form prose and card copy. Both are self-hosted through Fontsource.
- **Components:** shadcn components are copied into `src/components/ui/` and edited in place. Files are kept exactly as shadcn generates them (only whole files nothing imports are removed), so updates stay easy; add more with `bunx shadcn@latest add <name>`. React components take `className`; Astro components take `class`.
- **Theme switching:** a tiny inline script in `<head>` applies the stored or system theme before first paint (no flash). The dropdown stores `light` or `dark` in `localStorage` (`rhythm-theme`), and removes it for `system`.
- **Code:** Shiki `vitesse-light` and `vitesse-dark`, switched by the `.dark` class; every block has a language label and a copy button.
- **Layout:** docs pages have a header, sidebar, article and a sticky on-this-page column on wide screens, and a sheet plus a collapsible contents list on small ones. **One standard width.** `--container` (80rem, in `global.css`) is the content width of the whole site, and `--gutter` sits outside it. The header, the landing page and its hero panel, the footer, and the docs shell (sidebar, article and contents) all use it, through the shared `.site-width` class (or `max-width: var(--container)` inside a section that already has the gutter). Every page therefore has identical left and right edges at every screen size; a browser check enforces this. Do not introduce another page width: use `.site-width` or `var(--container)`. Single-column grids must use `minmax(0, 1fr)`; a bare `grid` lets wide code push the page past the viewport on phones.

## Search

[Pagefind](https://pagefind.app) indexes the built pages (`scripts/build-search.ts`) and the search dialog (a shadcn `Command`, opened with `Cmd/Ctrl+K` or `/`) loads it lazily. The index only exists after a build, so in `bun run dev` the dialog explains that; use `bun run build && bun run preview` to try it. The build fails if the index cannot be created or any page cannot be indexed.

## Old URLs

Every page used to be a standalone `<path>.html` file. Those URLs still work: index pages are built to the same `<dir>/index.html`, and every other page has a redirect stub at `/<path>.html` that forwards to its new clean URL (generated from `nav.ts`). The old philosophy page now lives on the landing page, so `/philosophy.html` redirects to `/#philosophy`; the old introduction became the landing page itself.

## Deployment

`.github/workflows/deploy.yml` installs with Bun, runs `bun run check`, builds, checks links, and publishes `dist/` to GitHub Pages on pushes to `main`. Pull requests run the same checks without deploying. The custom domain comes from `public/CNAME`.
