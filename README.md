# RhythmJS documentation

Fourteen standalone HTML pages organized by package. No framework, no build step. The only script is `assets/highlight.js`, a small hand-written syntax highlighter for the code blocks; pages render fine without it. Headings and prose use the system sans-serif stack; code uses JetBrains Mono, loaded from Google Fonts with local fallbacks. Neutral grays, muted blue links, and simple code panels keep the reference focused and readable in both color schemes. The site degrades gracefully offline.

Open [index.html](index.html) directly, or publish this directory on a static host.

## Shared guides

- [Introduction](index.html)
- [Quick start](getting-started.html)

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

Edit the HTML files and shared `assets/style.css` directly. Keep desktop/mobile navigation and relative links consistent when adding pages. Previous/next navigation stays within each package.

Each page includes its own title, description, social metadata, and semantic content. Mobile navigation uses native HTML; dark mode follows the system preference, with its own tuned palette in `assets/style.css` rather than an inverted one. Once the public domain is known, add absolute canonical URLs and a static sitemap using that domain.
