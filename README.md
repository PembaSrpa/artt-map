# artt-map

A documentation site for explaining how your personal projects work — architecture,
file-by-file breakdowns, and how everything connects. Built with Next.js (App Router),
Tailwind CSS, and MDX.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Adding a project

1. Create a folder under `content/your-project-slug/`
2. Add a `meta.json`:
   ```json
   { "label": "Your Project", "description": "One-line description.", "order": 1 }
   ```
3. Add `.mdx` files, prefixed with a number for ordering (`01-overview.mdx`, `02-architecture.mdx`, ...)
   with frontmatter:
   ```md
   ---
   title: Overview
   order: 1
   ---
   Your content here, using regular Markdown + fenced code blocks.
   ```

The sidebar, "on this page" outline, and home page all update automatically — no
routing or nav code to touch.

## Structure

| Path | Purpose |
| --- | --- |
| `content/` | All documentation content (MDX + project metadata) |
| `lib/content.ts` | Reads `content/` into project + page data |
| `lib/toc.ts` | Extracts `##` headings for the "on this page" rail |
| `components/` | Sidebar, top bar, TOC rail, MDX styling |
| `app/docs/[project]/[slug]/page.tsx` | Renders a single doc page |
| `app/page.tsx` | Home page listing all projects |

## Design tokens

Colors are restricted to four neutral shades (`n-800/700/300/200` in `globals.css`).
Fonts are Fira Code (headings, nav, code) and Inter (body text), self-hosted via
`@fontsource` so no external font requests are made at build time.
