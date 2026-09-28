---
title: website / docs — the document corpus
folder: KFM_GROUP/website/docs
type: folder-index
client: KFM Group
status: as-built corpus, 2026-09-22
tags:
  - client/kfm-group
  - website
  - documentation
updated: 2026-09-24
---

# website / docs — the document corpus

> **Twelve documents plus two subfolders**, written to the workspace standard at
> `.claude/skills/design_guide/design/docs-corpus-standard.md` (decision #8). All marked
> **as-built** — written from what exists, not from what was planned.

**Parent:** [[KFM_GROUP/website/website|website]]
⚠️ **The hub is not here.** `README.md` sat at `docs/README.md` when the corpus was written and
was moved to the **project root** on 2026-09-22. The other twelve documents still link to each
other as siblings inside `docs/`, which is correct; only the hub needed repointing.

---

## Reading order

The parent README's own "then read" sequence:

1. **`../README.md`** — what was decided and why (§2), what is still open (§3)
2. **`architecture.md`** — the two processes and how they talk
3. **`design_doc_frontend.md`** — ⚠️ **read before touching any CSS**, because most of the
   print-plate system **cannot** be expressed as Tailwind utilities
4. **`handover.md`** — day-to-day operation and deployment
5. **`user_guide.md`** — editing content, given there is **no admin UI**

## The twelve documents

| Document | Size | Concern |
|---|---|---|
| `architecture.md` | 8 KB | Stack, the two processes, data flow |
| `fileStructure.md` | 8 KB | Every file and what it is for |
| `sitemap.md` | 8 KB | 8 routes + 4 API endpoints |
| `db_schema.md` | 8 KB | 3 tables, columns, indexes |
| `design_doc_frontend.md` | 12 KB | Tokens, the 14 component classes, per-page specs |
| `design_doc_backend.md` | 8 KB | Express, routes, SQLite, seeding |
| `color-scheme.md` | 8 KB | The CMYK palette and its ramps |
| `handover.md` | 12 KB | Run, build, deploy. §6 lists the (all optional) env vars |
| `user_guide.md` | 8 KB | Editing content without an admin UI |
| `todo.md` | 8 KB | Phased build roadmap; Phase 9 is the manual verification sweep |
| `cms_schema.md` | 4 KB | ⚠️ **N/A — there is no CMS.** Kept as a corpus placeholder |

## Subfolders

| Folder | Files | What it holds |
|---|---|---|
| `audits/` | 1 | **`2026-09-22-seo-aeo-geo-lighthouse.md`** (9.0 KB) — SEO / AEO / GEO + Lighthouse audit. ⚠️ **The parent README's §1 says this folder was *"removed 2026-09-22 — recreate before the first audit"*. That row is stale: the folder exists and holds this audit.** Verified on disk 2026-09-24. |
| `references/` | 2 | **`KFMGroup.html`** (600 KB) — the **original Claude Artifact, kept untouched** as the visual reference; open it side by side when checking a detail. And **`KFM Profile latest as of Sept'26.pdf`** (6.8 MB) — the owner's corporate profile. ⚠️ Open item #5: it **has not been opened**, and may hold content that should correct the seed data, which was transcribed from the artifact only. |

⚠️ Both reference files were moved into `docs/references/` on 2026-09-22. The artifact was
`KFM Group.html` at the project root during the port, so older notes may name that path — and
the file on disk is now `KFMGroup.html`, **without the space**.

## What this corpus is for

It is the **handover surface**. The site has **no admin UI** (decision #6) and **no tests**
(open item #6), so these documents are the only description of how to change anything safely —
particularly `design_doc_frontend.md`, because the print-plate CSS looks like something
Tailwind could replace and is not.

## Related notes

- [[KFM_GROUP/website/website|website]] — the hub these twelve link back to
- [[KFM_GROUP/website/frontend/frontend|frontend]] · [[KFM_GROUP/website/backend/backend|backend]] · [[KFM_GROUP/website/data/data|data]] · [[KFM_GROUP/website/media/media|media]]
- [[KFM_GROUP/KFM_GROUP|KFM_GROUP]]
- `.claude/skills/design_guide/` — the standard this corpus was written to

*Document list, sizes and the `audits/`/`references/` contents were read off disk 2026-09-24.
The reading order, the concern column and the open items are carried forward from the parent
README (2026-09-22). **No document in this folder was opened while writing this note** — the
concern column is its §1 table, not a reading of each file.*
