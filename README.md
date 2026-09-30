# RhythmJS documentation

Standalone HTML pages organized by package, every package with its own topical subpages. No framework, no build step. The only script is `assets/highlight.js`, a small hand-written syntax highlighter for the code blocks; pages render fine without it. Headings and prose use the system sans-serif stack; code uses JetBrains Mono, loaded from Google Fonts with local fallbacks. Neutral surfaces, teal and mint accents, and colorful syntax keep the reference focused and readable in both color schemes. The site degrades gracefully offline.

The ecosystem it documents is coupled to [Bun](https://bun.com) on purpose — no runtime adapters, Bun's native APIs end to end.

Open [index.html](index.html) directly, or publish this directory on a static host.

## Guide

- [Introduction](index.html)
- [Quick start](getting-started.html) — install, first pipeline, serving HTTP, validation, and the Nest-style starter template
- [Philosophy](philosophy.html)

## Packages

Each package group has one page per topic plus an API reference; there are no generic overview pages.

- **@rhythmjs/rhythm (Core)** — [Overview](rhythm/index.html) · [Middleware & context](rhythm/middleware.html) · [Providers & lifecycle](rhythm/providers.html) · [Encapsulated modules](rhythm/modules.html) · [API](rhythm/api.html)
- **@rhythmjs/router** — [Routing](router/index.html) · [Serving files](router/static.html) · [API](router/api.html)
- **@rhythmjs/ws (WebSockets)** — [Connection routing](ws/index.html) · [Serving & pub/sub](ws/serving.html) · [API](ws/api.html)
- **@rhythmjs/middleware** — [Validate](middleware/index.html) · [Intercept](middleware/intercept.html) · [Filter](middleware/filter.html) · [API](middleware/api.html)
- **@rhythmjs/http** — [Cookies & sessions](http/index.html) · [Bodies & uploads](http/bodies.html) · [Caching & compression](http/caching.html) · [Streaming & timeouts](http/streaming.html) · [Proxy & i18n](http/proxy.html) · [API](http/api.html)
- **@rhythmjs/security** — [Authentication & authorization](security/index.html) · [CORS & CSRF](security/protection.html) · [Rate limiting & headers](security/hardening.html) · [API](security/api.html)
- **@rhythmjs/observability** — [Logging & timing](observability/index.html) · [Health & shutdown](observability/health.html) · [API](observability/api.html)
- **@rhythmjs/cli** — [Commands](cli/index.html) · [Interactive prompts](cli/prompts.html) · [Running on Bun](cli/run.html) · [API](cli/api.html)
- **@rhythmjs/config** — [Defining configuration](config/index.html) · [The config service](config/service.html) · [API](config/api.html)
- **@rhythmjs/openapi** — [Describing routes](openapi/index.html) · [Documents & UIs](openapi/document.html) · [API](openapi/api.html)
- **@rhythmjs/events** — [Subscribing](events/index.html) · [Emitting & errors](events/emitting.html) · [API](events/api.html)
- **@rhythmjs/schedule** — [Jobs & scheduling](schedule/index.html) · [The cron engine](schedule/cron.html) · [API](schedule/api.html)
- **@rhythmjs/queue** — [Producing & processing](queue/index.html) · [Engines & repeats](queue/engines.html) · [API](queue/api.html)
- **@rhythmjs/bullmq** — [The BullMQ module](bullmq/index.html) · [Schedulers & queue access](bullmq/schedulers.html) · [API](bullmq/api.html)
- **@rhythmjs/testing** — [Kernel & modules](testing/index.html) · [The router client](testing/router.html) · [The CLI runner](testing/cli.html) · [The WebSocket harness](testing/ws.html) · [API](testing/api.html)

## Maintenance

Edit the HTML files and shared `assets/style.css` directly. The site has two navigation universes: guide pages (at the repository root) show only the Guide group in the sidebar, and package pages (in subdirectories) show only the package groups. The header next to the logo carries Guide and Packages links to switch between the two, with `aria-current` marking the active side. The sidebar, mobile navigation, and header links are generated: when adding or renaming a page, add it to the nav model in [`navgen.mjs`](navgen.mjs), then run `node navgen.mjs` followed by `npx prettier --write "**/*.html"` to regenerate and reformat every page. Each package page's own group renders expanded; the others stay collapsed. Previous/next navigation and the on-page table of contents are hand-maintained per page; keep them in sync with a group's page list when it changes. The guide chain runs Introduction, Quick start, Philosophy. Each group's `index.html` is its first topic page, so directory URLs keep working.

The documentation's source of truth is the package source code in the sibling repositories (`rhythm/`, `ws/`, `tasks/`, and the standalone middleware repositories) — when the docs and the code disagree, fix the docs against the code. Each page includes its own title, description, social metadata, and semantic content. Mobile navigation uses native HTML; dark mode follows the system preference, with its own tuned palette in `assets/style.css` rather than an inverted one. Once the public domain is known, add absolute canonical URLs and a static sitemap using that domain.
