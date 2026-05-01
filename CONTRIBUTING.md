# Contributing to DataReady Learn

Thank you for wanting to make DataReady better! Contributions of all kinds are welcome — from fixing a typo to writing an entire new lesson.

---

## Ways to Contribute

| Type | How |
|------|-----|
| Report an error or inaccuracy | [Open a GitHub Issue](https://github.com/cedricconol/dataready-learn/issues/new) |
| Suggest a new lesson or section | [Open a GitHub Issue](https://github.com/cedricconol/dataready-learn/issues/new) |
| Fix a small error (typo, broken link) | Submit a Pull Request directly |
| Write a new lesson | Open an Issue first to discuss, then submit a PR |
| Improve an existing lesson | Submit a Pull Request |

---

## Opening a GitHub Issue

Before opening an issue, check the [existing issues](https://github.com/cedricconol/dataready-learn/issues) to see if it has already been reported.

### For content errors

Please include:
- The URL or path of the affected page
- A description of what is wrong
- What the correct information should be (with a source if possible)

### For new lesson suggestions

Please include:
- The curriculum section it belongs to (SQL, dbt, Data Warehouse, BI Tools, or a new section)
- A one-paragraph description of what the lesson should cover
- Why it is valuable for data analysts or engineers learning the topic

---

## Submitting a Pull Request

### 1. Fork and clone the repository

```bash
git clone https://github.com/<your-username>/dataready-learn.git
cd dataready-learn
npm install
```

### 2. Create a feature branch

Use a descriptive name:

```bash
git checkout -b add-sql-window-functions-lesson
# or
git checkout -b fix-dbt-ref-typo
```

### 3. Run the dev server

```bash
npm start
```

Visit `http://localhost:3000` to preview your changes.

### 4. Follow the content guidelines

- Write in plain, accessible English — assume the reader is new to the topic
- Use code blocks with the correct language tag (` ```sql `, ` ```bash `, etc.)
- Prefer short paragraphs and tables over dense prose
- Add a `youtube_url` frontmatter field to every lesson (leave it as `""` if no video exists yet)
- New lessons should include a placeholder `:::note Placeholder Lesson` callout until the content is complete

### 5. Frontmatter for new lessons

Every lesson file must include:

```markdown
---
id: your-lesson-id
title: Your Lesson Title
sidebar_label: Short Label
sidebar_position: <integer>
youtube_url: ""
---
```

### 6. Update `sidebars.ts`

Add your new lesson's `id` to the correct sidebar in `sidebars.ts`.

### 7. Commit and push

```bash
git add docs/sql/my-new-lesson.md sidebars.ts
git commit -m "feat(sql): add window functions lesson"
git push origin add-sql-window-functions-lesson
```

### 8. Open a Pull Request

Go to the repository on GitHub and open a PR against the `main` branch. Fill in the PR template with:
- What you changed and why
- A link to the related issue (if applicable)
- Screenshots if you changed any visual styling

---

## Code of Conduct

Be respectful, constructive, and welcoming. This is a community learning resource — everyone is here to grow.

---

## Questions?

Open an issue with the `question` label or start a [GitHub Discussion](https://github.com/cedricconol/dataready-learn/discussions).
