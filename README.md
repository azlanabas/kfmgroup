# KFM Group — Next.js + Express + SQLite — As-built

> **Status: BUILDING — the port is complete and verified locally; nothing is deployed.**
> Ported from the Claude Artifact `KFM Group.html` on 2026-09-21/22.

**Location / source of truth:** `~/Documents/Claude/PROJECTS/kfmgroup` on this Mac.
⚠️ **Not yet in git and not on any server** — no repo, no remote, no host. See §3.
**Owners:** Azlan Abas. **Target URL:** [OWNER INPUT REQUIRED] — no domain decided.
**Compiled:** 2026-09-22 · **Decisions finalised:** 2026-09-22.

---

## 0. Quick start

### Requirements

| | Version | Why it is not optional |
|---|---|---|
| **Node.js** | **26.x** (built on v26.5.0) | The backend uses `node:sqlite`, a Node 26 built-in. There is **no fallback driver** — on Node 20 or 22 the API will not start |
| npm | 11.x (built on 11.17.0) | ships with Node 26 |

```bash
node -v      # must print v26.x
```

Nothing else is needed. No database server to install, no native modules to compile — SQLite is
a file, and its driver is inside Node.

### Install

Two packages, installed separately. Replace `~/Documents/Claude/PROJECTS/kfmgroup` with wherever
the project lives.

```bash
# 1. backend  — Express + node:sqlite
cd ~/Documents/Claude/PROJECTS/kfmgroup/backend
npm install
npm run migrate          # creates ../data/kfm.db and applies 001_init.sql
npm run seed             # loads 7 contracts and 8 people

# 2. frontend — Next.js + Tailwind
cd ~/Documents/Claude/PROJECTS/kfmgroup/frontend
npm install
```

`migrate` and `seed` are both safe to re-run: `migrate` skips anything already applied, and
`seed` rebuilds `contracts` and `people` only — it never touches `contact_submissions`.

### Run — development

Two terminals. **Start the backend first**: `/`, `/sectors` and `/people` read from the API and
will show an error page if it is down.

```bash
# terminal 1
cd ~/Documents/Claude/PROJECTS/kfmgroup/backend && npm run dev     # → 127.0.0.1:4000
```
```bash
# terminal 2
cd ~/Documents/Claude/PROJECTS/kfmgroup/frontend && npm run dev    # → localhost:3000
```

Open **http://localhost:3000**.

### Run — production

```bash
# terminal 1
cd ~/Documents/Claude/PROJECTS/kfmgroup/backend && npm run build && npm start
```
```bash
# terminal 2
cd ~/Documents/Claude/PROJECTS/kfmgroup/frontend && npm run build && npm start
```

⚠️ Use absolute paths, or `cd` from the project root each time. `cd backend && … && cd frontend`
in one line fails — after the first `cd` you are no longer at the root.

### Check it is up

```bash
curl -s localhost:4000/api/health
# {"ok":true,"db":".../data/kfm.db","contracts":7,"uptime":…}
```

`/api/health` runs a real query, so a 200 proves the **database** is reachable, not just that
the process started.

### Scripts

| Folder | Script | Does |
|---|---|---|
| `backend/` | `npm run dev` | Express on :4000, `--watch`, TypeScript stripped at runtime |
| | `npm run build` | `tsc` → `dist/` |
| | `npm start` | `node dist/server.js` |
| | `npm run migrate` | applies `migrations/*.sql`, records them in `schema_migrations` |
| | `npm run seed` | reloads contracts + people from `src/seed-data.ts` |
| `frontend/` | `npm run dev` | Next on :3000 (`predev` mirrors media first) |
| | `npm run build` | production build (`prebuild` mirrors media first) |
| | `npm start` | serves the build |
| | `npm run sync:media` | re-mirrors `../media` → `public/media` on its own |

### Two things that will bite

1. **Node must be 26.** `node:sqlite` has no fallback.
2. **Add images to `media/` at the project root — never `frontend/public/media/`.** That folder
   is a generated mirror, wiped and rebuilt on every `dev` and `build`.

Environment variables are all optional and listed in [`docs/handover.md`](docs/handover.md) §6.
There are **no secrets** in this project.

---

## 0b. Then read

1. This file — what was decided and why (§2), and what is still open (§3).
2. [`docs/architecture.md`](docs/architecture.md) — the two processes and how they talk.
3. [`docs/design_doc_frontend.md`](docs/design_doc_frontend.md) — the CMYK print-plate system;
   read before touching any CSS, because most of it **cannot** be expressed as Tailwind
   utilities.
4. [`docs/handover.md`](docs/handover.md) — day-to-day operation and deployment.
5. [`docs/user_guide.md`](docs/user_guide.md) — editing content, given there is no admin UI.

The original artifact is kept untouched as the reference at
[`docs/references/KFMGroup.html`](docs/references/KFMGroup.html) — open it side by side when
checking a visual detail. The owner's corporate profile sits beside it as
`docs/references/KFM Profile latest as of Sept'26.pdf`. Both were moved there on 2026-09-22; the
artifact was `KFM Group.html` at the project root while the port was being done, so older notes
may name that path.

## 1. Document map

| Concern | Document | Status |
|---|---|---|
| Install, run, decisions, open items | `README.md` (this file) | as-built |
| Stack, processes, data flow | [`docs/architecture.md`](docs/architecture.md) | as-built |
| Every file and what it is for | [`docs/fileStructure.md`](docs/fileStructure.md) | as-built |
| 8 routes + 4 API endpoints | [`docs/sitemap.md`](docs/sitemap.md) | as-built |
| 3 tables, columns, indexes | [`docs/db_schema.md`](docs/db_schema.md) | as-built |
| CMS collections | [`docs/cms_schema.md`](docs/cms_schema.md) | **N/A — no CMS** |
| Tokens, component classes, per-page specs | [`docs/design_doc_frontend.md`](docs/design_doc_frontend.md) | as-built |
| Express, routes, SQLite, seeding | [`docs/design_doc_backend.md`](docs/design_doc_backend.md) | as-built |
| The CMYK palette and ramps | [`docs/color-scheme.md`](docs/color-scheme.md) | as-built |
| Phased build roadmap | [`docs/todo.md`](docs/todo.md) | as-built |
| Run, build, deploy | [`docs/handover.md`](docs/handover.md) | as-built |
| Editing content without an admin UI | [`docs/user_guide.md`](docs/user_guide.md) | as-built |
| Audit reports | `docs/audits/` | ⚠️ **removed 2026-09-22** — the corpus standard expects it; recreate before the first audit |

Layout note: this hub sat at `docs/README.md` when the corpus was written and was moved to the
project root on 2026-09-22. The other twelve documents still link to each other as siblings
inside `docs/`, which is correct; only this file needed repointing.

## 2. Decisions Log

The single place decisions live. Other documents cite this table; they do not re-decide.

### Taken before the build (owner, 2026-09-21)

| # | Decision | Rationale |
|---|---|---|
| 1 | Real Next.js project, **App Router** — not a static unpack | The artifact is a client-side router over 8 views in a custom templating language; there is nothing to "split", only to port |
| 2 | Keep **`frontend/` + `backend/`** | Two halves, two responsibilities |
| 3 | `backend/` is a **separate Express API service**, not a data folder | Real service boundary; two processes, two ports |
| 4 | **Full Tailwind conversion**, **Tailwind v4** (CSS-first `@theme`) | ~50 design tokens lift almost verbatim into `@theme` |
| 5 | SQLite holds **contracts + people + contact form submissions** | |
| 6 | **No admin UI** — data seeded and edited in code | See [`docs/user_guide.md`](docs/user_guide.md) |
| 7 | **TypeScript** across both halves | |
| 8 | Full **`docs/` corpus + README.md** | Per `.claude/skills/design_guide/design/docs-corpus-standard.md` |

### Taken during the build (owner, 2026-09-22)

| # | Decision | Rationale |
|---|---|---|
| 9 | **Next 16.3.5**, not the Next 15 the plan named | `create-next-app@latest` now ships 16; App Router API is unchanged for this port. React 19.2.8, Tailwind 4.3.3, TS 5.9.3 |
| 10 | Delete the `CLAUDE.md` / `AGENTS.md` that `create-next-app` writes into `frontend/` | Workspace rule: exactly one root `CLAUDE.md`. Next 16 regenerates them on every dev start, so `agentRules: false` is set in `next.config.ts` |
| 11 | Reversed #2 briefly, then restored it | The app was flattened to the project root and moved back on the owner's instruction the same session. Final shape is `frontend/` + `backend/`, as #2 |
| 12 | `frontend/package.json` name is **`frontend`**; `backend/` is **`backend`** | Owner instruction — plain names, no invented prefixes |
| 13 | **The app is self-contained** — all 22 images pulled off `kfmgroup.my` into the repo | Nothing is fetched from the live WordPress site at runtime |
| 14 | Media library lives at **`media/`, the project root** — not inside `frontend/` | Owner call. Next can only serve `public/`, so `frontend/scripts/sync-media.mjs` mirrors it to `frontend/public/media` on `predev`/`prebuild`; the mirror is gitignored |
| 15 | SQLite file at **`data/kfm.db`, the project root** — not `backend/data/` | Owner call: the database belongs to the app, not to the service that opens it |
| 16 | **All 7 contracts and all 8 people in SQLite** (schema extended beyond the plan's columns) | Follows from #13. `contracts` gained `status`, `sector`, `summary`, `card_note`, `image_url`, `image_alt`; `people` gained `photo_url`. Nothing about a contract or a person is hardcoded in a component |
| 17 | `@font-face` written by hand against `/fonts/`, **not** `next/font/local` | `next/font/local` has no `unicode-range` field and so cannot express the 6 per-script subsets the artifact ships. The plan's own verification criterion ("fonts loading from `/fonts/`") requires this too |
| 18 | The 14 print-plate component classes stay as CSS in `@layer components` | They are built from pseudo-elements, blend modes and a JS-published `--press-nx`. Utilities cannot express them. Only the 427 inline styles became utilities |

### Corrections to the plan, found by inspecting the artifact (2026-09-21)

| Plan said | Evidence found | Consequence |
|---|---|---|
| `print-plates.js` is **absent** from the manifest, so the CMYK pointer-lean is "already broken in the source" | It **is** present — manifest uuid `6df0c695-bd7c-4234-a6ce-3c102a9974ba`, whose `@ds-bundle` header names `print-plates.js` in `sourceHashes` | Not broken. The press driver was ported in full to `pressDriver.ts` + `PrintPlates.tsx` |
| **18 `@font-face` rules but only 12 font files** — "some faces reference assets that were not bundled" | 18 rules reference **12 distinct** uuids, all 12 present. The 6 woff2 subsets are each declared twice, at weight 400 and 600 | Nothing is missing; all 18 rules ported verbatim |
| The contracts table is on "the Work/About page" | It is on **Sectors**, under "Completed contracts" | Table built on `/sectors` |

## 3. Pending — ⏳ not decisions, just open items

1. ⏳ **No git repo.** Nothing is committed. Per the workspace rule, new projects default to
   `github.com/azlanabas`, but no repo has been created or named.
2. ⏳ **No target domain and no host.** Nothing is deployed; `handover.md` §Deploy is written
   against the fleet standard but has not been executed anywhere.
3. ⏳ **Two test rows sit in `contact_submissions`** (ids 1 and 2, from this session's
   verification). Left in place — deleting rows is the owner's call.
4. ⏳ **`created_at` is stored in UTC** (`datetime('now')`). Row 2 reads `2026-09-21 16:32:31`
   for a submission made at 00:32 local (GMT+8). Decide whether to store local time or render
   the offset before anyone reads these timestamps as local.
5. ⏳ **`docs/references/KFM Profile latest as of Sept'26.pdf`** (6.5 MB) appeared in the
   project folder mid-session and has not been opened. It may hold content that should correct the
   seed data, which was transcribed from the artifact only.
6. ⏳ **No tests.** Neither half has a test suite; verification to date is the manual sweep
   recorded in `todo.md` Phase 9.
