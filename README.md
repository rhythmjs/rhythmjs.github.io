# RhythmJS documentation

Twenty-four standalone HTML pages organized by package. No framework, no build step. The only script is `assets/highlight.js`, a small hand-written syntax highlighter for the code blocks; pages render fine without it. Headings and prose use the system sans-serif stack; code uses JetBrains Mono, loaded from Google Fonts with local fallbacks. Neutral surfaces, teal and mint accents, and colorful syntax keep the reference focused and readable in both color schemes. The site degrades gracefully offline.

Open [index.html](index.html) directly, or publish this directory on a static host.

## Getting started

- [Introduction](index.html)
- [Quick start](getting-started.html)
- [Philosophy](philosophy.html)
- [Starter template](template.html)

## @rhythmjs/rhythm

- [Overview](rhythm/index.html)
- [Middleware and context](rhythm/middleware.html)
- [Providers and lifecycle](rhythm/providers.html)
- [Encapsulated modules](rhythm/modules.html)
- [API reference](rhythm/api.html)

## @rhythmjs/router

- [Overview and routing](router/index.html)
- [Bun, Node, and Deno adapters](router/adapters.html)
- [API reference](router/api.html)

## @rhythmjs/cli

- [Overview and commands](cli/index.html)
- [Interactive prompts](cli/prompts.html)
- [Bun, Node, and Deno adapters](cli/adapters.html)
- [API reference](cli/api.html)

## @rhythmjs/middleware

- [Overview: validate, intercept, filter](middleware/index.html)
- [API reference](middleware/api.html)

## @rhythmjs/http

- [Overview: cookies, session, etag, timeout, body limit](http/index.html)
- [API reference](http/api.html)

## @rhythmjs/security

- [Overview: CORS, CSRF, secure headers](security/index.html)
- [API reference](security/api.html)

## @rhythmjs/observability

- [Overview: log, request id, timing](observability/index.html)
- [API reference](observability/api.html)

## Maintenance

Edit the HTML files and shared `assets/style.css` directly. The site has two navigation universes: guide pages (at the repository root) show only the Guide group in the sidebar, and package pages (in subdirectories) show only the package groups. The header next to the logo carries Guide and Packages links to switch between the two, with `aria-current` marking the active side. The sidebar, mobile navigation, and header links are generated: when adding or renaming a page, add it to the nav model in [`navgen.mjs`](navgen.mjs), then run `node navgen.mjs` followed by `npx prettier --write "**/*.html"` to regenerate and reformat every page. Each package page's own group renders expanded; the others stay collapsed. Previous/next navigation stays within each group; the guide chain runs Introduction, Quick start, Philosophy, Starter template.

Each page includes its own title, description, social metadata, and semantic content. Mobile navigation uses native HTML; dark mode follows the system preference, with its own tuned palette in `assets/style.css` rather than an inverted one. Once the public domain is known, add absolute canonical URLs and a static sitemap using that domain.
