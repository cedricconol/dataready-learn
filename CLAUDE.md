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
│   ├── python/
│   │   ├── index.mdx            # Section overview page (slug: /python)
│   │   ├── intro-to-python.mdx  # Lesson
│   │   └── python-exam-*.mdx    # Checked exercises via <PythonExercise>
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
│   │   ├── YouTubeEmbed.tsx     # Reusable YouTube iframe component
│   │   ├── PythonPlayground.tsx # Free-form Python editor (auto-injected on lessons)
│   │   ├── PythonExercise.tsx   # Checked Python exercise (used in exams)
│   │   ├── pythonRuntime.ts     # Shared Pyodide loader
│   │   ├── pythonSeed.ts        # Python that seeds data and defines the run/check entry points
│   │   └── pythonData.ts        # Sample CSVs and the column reference panel
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

## The Python Track

The Python track runs real pandas 3.0 in the browser via [Pyodide](https://pyodide.org/), loaded from a CDN and shared across every editor on a page.

### How it fits together

| File | Role |
|------|------|
| `src/components/pythonData.ts` | The sample CSVs (`customers`, `products`, `orders`) and the column list shown in the "Data" panel |
| `src/components/pythonSeed.ts` | Python that runs once after pandas loads: writes the CSVs to Pyodide's filesystem, builds the DataFrames, and defines `_dr_run(code)` and `_dr_check(code, solution, ordered)` |
| `src/components/pythonRuntime.ts` | Loads Pyodide once per session and exposes `run` / `check` |
| `src/components/usePythonRuntime.ts` | Hook that starts the (large) download only when the editor scrolls into view |
| `src/components/PythonPlayground.tsx` | Free-form editor, auto-injected below every Python lesson by the `DocItem/Paginator` swizzle |
| `src/components/PythonExercise.tsx` | Checked exercise used in the exams |
| `src/components/PythonResult.tsx` | Renders a DataFrame, Series, or scalar, plus anything printed |

Pinned Pyodide version lives in `PYODIDE_VERSION` in `pythonRuntime.ts`. Changing it changes the pandas version, so re-check any lesson output that depends on pandas behavior.

### Writing exam questions

`PythonExercise` compares the learner's final expression against the value a hidden reference solution produces, so any correct approach passes:

```mdx
<PythonExercise
  frames={["orders"]}
  ordered            {/* only for questions where row order is the answer */}
  solution={`orders.groupby("status")["total_amount"].sum()`}
/>
```

The comparison ignores row order unless `ordered` is set, ignores an incidental Series name, and accepts a one-column DataFrame where a Series is expected. It does enforce requested column names. Avoid questions whose answer depends on breaking a tie (several orders are worth exactly 999).

### How Python code samples are written

The readers are beginners, and a line that runs off the right edge of the code block is unreadable on a laptop and worse on a phone. Every Python sample obeys these rules.

**Keep every line inside a `python` fence to 60 characters.** This includes the exam `solution` strings, which learners see when they open the answer (`PythonExercise` renders them). Check with:

````bash
awk '/^```python/{f=1;next} /^```/{f=0;next} f && length($0)>60 {print FILENAME":"FNR": "length($0)}' docs/python/*.mdx
````

**When a line gets long, break it into steps with named intermediate variables.** Do not just wrap the arguments. Give each step a name that says what it holds:

```python
# Not this:
orders.assign(change=(orders["total_amount"] - orders["total_amount"].shift()).round(2)).head(5)[["order_id", "total_amount", "change"]]

# This:
amount = orders["total_amount"]
change = (amount - amount.shift()).round(2)

with_change = orders.assign(change=change)
with_change.head(5)[["order_id", "total_amount", "change"]]
```

Recurring helper names: `by_customer` / `by_status` for a `groupby`, `cols` for a long column list (put the list on its own lines when it does not fit), and a mask named for what it selects (`is_big`, `has_status`).

**A multi-line chain is also a correct answer** and is preferred in the chaining and `pipe` lessons, where the chain itself is the subject. Put one step per line inside outer parentheses and comment the steps.

**Every Practice answer and every exam solution needs inline comments** explaining what each step does and why. The *question* block (code the learner is asked to run or convert) stays uncommented. One deliberate exception exists: the "one long line is worse" counterexample in `pandas-method-chaining.mdx` stays long, because its unreadability is the point.

### Every run starts fresh

Each run builds a new namespace with fresh copies of the DataFrames, so nothing leaks between runs or between exercises on a page. Lessons state this explicitly, so keep it true.

### Keeping lesson output honest

Every `**Result:**` table in the Python lessons was generated by running the snippet against the real data. If you change `pythonData.ts` or a code sample, re-verify rather than hand-editing the tables.

---

## Styling Notes

This site uses the warm "byconol" identity (modeled on `byconol.com`), which is **intentionally different** from the dark blue/cyan DataReady system used by `dataready-web`. Do not "resync" it back to blue/dark.

- Primary accent: persimmon `#E0512F` (hover/strong `#C2431F`; lifted `#F0633F` in dark mode)
- Surfaces: warm cream paper `#F3EDE1` (light) / warm near-black `#1B1712` (dark)
- Text/ink: `#211C16` on light, `#F3EDE1` on dark
- Light mode is the signature look; dark mode is a warm-dark variant of the same palette (toggle still works)
- Display/heading font: **Bricolage Grotesque**; body: Geist; mono: Geist Mono
- Signature button: dark-ink pill with a persimmon glow that slides on hover (`.btnPrimary` in `index.module.css`); `.btnOnDark` is the paper-pill variant for dark bands
- Code/playground previews stay dark on purpose (they mirror the real in-browser SQL editor); success states stay green
- CSS variables live in `src/css/custom.css` (global `--dr-*` + Infima tokens); homepage-scoped `--home-*` vars live in `src/pages/index.module.css`
- Do not add inline styles for things that should be in `custom.css`

---

## Docusaurus Notes

- Blog is **disabled** (`blog: false` in config) — this is a docs-only site
- Docs are served at the root path (`routeBasePath: "/"`) — there is no `/docs` prefix
- The `DocItem/Layout` swizzle in `src/theme/` is **unsafe** (wraps a private theme component) — test after Docusaurus upgrades
