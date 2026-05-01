# CLAUDE.md — DataReady Learn

Instructions and context for Claude Code sessions working in this repository.

---

## Project Overview

**DataReady Learn** is an open-source data analytics curriculum hosted at [learndataready.byconol.com](https://learndataready.byconol.com). It is built with [Docusaurus v3](https://docusaurus.io/) (TypeScript, React) and deployed as a static site.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Site framework | Docusaurus v3 (TypeScript) |
| Package manager | npm |
| Styling | Infima (Docusaurus default) + custom CSS variables |
| Content | Markdown / MDX in `docs/` |
| Hosting | learndataready.byconol.com |
| Source | github.com/cedricconol/dataready-learn |

---

## Project Structure

```
dataready-learn/
├── docs/                        # All curriculum content
│   ├── sql/
│   │   ├── index.md             # Section overview page (slug: /sql)
│   │   └── intro-to-sql.md      # Lesson
│   ├── dbt/
│   │   ├── index.md             # Section overview page (slug: /dbt)
│   │   └── intro-to-dbt.md
│   ├── data-warehouse/
│   │   ├── index.md             # Section overview page (slug: /data-warehouse)
│   │   └── intro-to-data-warehouse.md
│   └── bi-tools/
│       ├── index.md             # Section overview page (slug: /bi-tools)
│       └── intro-to-bi-tools.md
├── src/
│   ├── components/
│   │   └── YouTubeEmbed.tsx     # Reusable YouTube iframe component
│   ├── pages/
│   │   ├── index.tsx            # Homepage
│   │   └── index.module.css
│   ├── theme/
│   │   └── DocItem/
│   │       └── Layout/
│   │           └── index.tsx    # Swizzled layout — injects YouTube embed from frontmatter
│   └── css/
│       └── custom.css           # Global styles, colour palette, YouTube embed wrapper
├── static/
│   └── img/                     # Favicon, logo, social card
├── docusaurus.config.ts         # Site config, navbar, footer
├── sidebars.ts                  # Sidebar definitions (one per section)
├── CLAUDE.md                    # This file
├── CONTRIBUTING.md
└── README.md
```

---

## Common Commands

```bash
npm start          # Start dev server at http://localhost:3000
npm run build      # Production build into build/
npm run serve      # Serve the production build locally
npm run typecheck  # TypeScript check (npx tsc --noEmit)
```

---

## Adding a New Lesson

1. Create a new `.md` file inside the appropriate `docs/<section>/` folder.
2. Add the required frontmatter (see template below).
3. Add the new file's `id` to `sidebars.ts` under the correct sidebar's `items` array.
4. Run `npm start` to verify it renders correctly.

### Lesson frontmatter template

```markdown
---
id: your-lesson-id
title: Your Lesson Title
sidebar_label: Short Label
sidebar_position: 3
youtube_url: ""
---
```

- `id` — must match the filename without extension, prefixed by the folder (e.g. `sql/your-lesson-id`)
- `sidebar_position` — controls ordering within the section (integer, lower = higher up)
- `youtube_url` — see the section below

---

## Adding a YouTube Video to a Lesson

Every lesson markdown file has a `youtube_url` frontmatter field. When populated, Docusaurus automatically renders a responsive embedded YouTube player **above** the lesson content. When left empty (`""`), nothing is shown.

### How it works

The swizzled `src/theme/DocItem/Layout/index.tsx` reads `frontMatter.youtube_url` via the `useDoc()` hook on every doc page and passes it to `src/components/YouTubeEmbed.tsx`, which renders an `<iframe>` inside a 16:9 aspect-ratio wrapper.

### Finding the YouTube video ID

The **video ID** is the 11-character code in a YouTube URL:

| URL format | Video ID location |
|------------|------------------|
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `dQw4w9WgXcQ` (the `v=` parameter) |
| `https://youtu.be/dQw4w9WgXcQ` | everything after `youtu.be/` |
| `https://www.youtube.com/embed/dQw4w9WgXcQ` | everything after `/embed/` |

### Populating the field

You can use either the full URL or just the bare video ID — the embed component handles both:

```markdown
---
youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
---
```

or equivalently:

```markdown
---
youtube_url: "dQw4w9WgXcQ"
---
```

To remove the video, set the field back to an empty string:

```markdown
---
youtube_url: ""
---
```

---

## Adding a New Curriculum Section

1. Create a new folder under `docs/` (e.g. `docs/python/`).
2. Add an `index.md` with a `slug` matching the folder name (e.g. `slug: /python`).
3. Add at least one lesson `.md` file.
4. Add a new sidebar entry in `sidebars.ts`.
5. Add a navbar item in `docusaurus.config.ts` under `themeConfig.navbar.items`.
6. Add a card to the `MODULES` array in `src/pages/index.tsx`.

---

## Styling Notes

- Primary accent color: `#3B82F6` (Tailwind blue-500)
- Dark mode is the default; light mode is available via the toggle
- Dark background: `#0f172a` (Tailwind slate-900)
- CSS variables live in `src/css/custom.css`
- Do not add inline styles for things that should be in `custom.css`

---

## Docusaurus Notes

- Blog is **disabled** (`blog: false` in config) — this is a docs-only site
- Docs are served at the root path (`routeBasePath: "/"`) — there is no `/docs` prefix
- The `DocItem/Layout` swizzle in `src/theme/` is **unsafe** (wraps a private theme component) — test after Docusaurus upgrades
