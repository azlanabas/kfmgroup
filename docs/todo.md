# Build roadmap

Legend: `[ ]` not started · `[~]` in progress · `[x]` done · ⏳ pending external action.
Phases 1–8 map 1:1 to the build order in the implementation plan. Phase 9 is the verification
the plan specified; Phase 10 is everything that stands between this and a live site.

---

## Phase 1 — Extract the artifact bundle  `[x]` 2026-09-21

- [x] Decode `__bundler/manifest` — 16 gzip+base64 assets
- [x] Write the 12 font files to `frontend/public/fonts/` with readable names
- [x] Dump the Broadsheet CSS (25 KB) and the 112 KB template for reference
- [x] Decode `__bundler/ext_resources` — React 18.3.1 + ReactDOM UMD (not carried over; the port
      is on React 19)
- [x] Confirm `__bundler/page_order` is empty — single document, not a multi-page bundle
- [x] **Correction:** `print-plates.js` **is** in the manifest (uuid `6df0c695…`), so the CMYK
      press driver was never broken. Ported in full
- [x] **Correction:** 18 `@font-face` rules reference **12 distinct** files, all present. Nothing
      missing
- [x] Delete the temporary scripts — Phase 11

## Phase 2 — Scaffold  `[x]` 2026-09-21

- [x] `create-next-app` — TS, Tailwind, App Router, `src/`, no ESLint
- [x] **Report installed majors before converting anything:** Next **16.3.5**, React 19.2.8,
      Tailwind **4.3.3**, TS 5.9.3 → owner chose to keep 16 (decision #9)
- [x] Remove scaffold boilerplate; set `agentRules: false` so Next stops regenerating
      `CLAUDE.md` / `AGENTS.md` (decision #10)
- [x] `npm init` + Express + TS in `backend/`
- [x] Verify `node:sqlite` on Node v26.5.0 with a real insert/select

## Phase 3 — Tokens  `[x]` 2026-09-22

- [x] ~50 Broadsheet custom properties → `@theme` in `globals.css`
- [x] The 14 component classes → `@layer components` (decision #18)
- [x] 18 `@font-face` rules → `fonts.css` against `/fonts/`, `unicode-range` preserved
      (decision #17)
- [x] Confirm the utilities actually generate — grepped the compiled
      `.next/static/chunks/*.css` for `text-accent-700`, `.bg-bg`, `text-text/82`,
      `animate-kfm-press`, `cmyk-head`, the font URLs and `--press-nx`

## Phase 4 — Shell  `[x]` 2026-09-22

- [x] `layout.tsx` — nav, footer, back-to-top, reveal host, print plates
- [x] `SiteNav` with the two hover panels
- [x] `SiteFooter`, `BackToTop`
- [x] `useReveal()` replacing the DCLogic IntersectionObserver
- [x] `PrintPlates` + `pressDriver` — the SVG defs and the press driver

## Phase 5 — Pages  `[x]` 2026-09-22

- [x] home `/` · [x] about · [x] work · [x] tech · [x] sectors · [x] people · [x] careers ·
      [x] contact
- [x] 427 inline styles → Tailwind utilities
- [x] 19 `sc-if` → `{x && …}`; 31 `sc-camel-on-*` → React handlers; 28 `sc-raw-*` → plain table
      elements; 19 `hint-placeholder-val` dropped

## Phase 6 — Backend  `[x]` 2026-09-22

- [x] `001_init.sql` — 3 tables, 3 indexes
- [x] `migrate.ts` with `schema_migrations`
- [x] `seed-data.ts` — 7 contracts, 8 people transcribed from the artifact
- [x] 4 routes: contracts, people, contact, health
- [x] Migrate + seed run clean → 7 / 8 / 0

## Phase 7 — Wire  `[x]` 2026-09-22

- [x] Home "On contract now" reads `status='live'`
- [x] Sectors blocks read `status='live'`; the completed table reads `status='completed'`
- [x] People reads `/api/people`, split by `group_label`
- [x] Contact form posts through a Server Action → `POST /api/contact`
- [x] `api.ts` marked `server-only` so `API_BASE` cannot reach the browser

## Phase 8 — Docs  `[x]` 2026-09-22

- [x] All 12 corpus files + `README.md` + `audits/`, written to as-built state

## Phase 9 — Verification  `[x]` 2026-09-22

| # | Check | Result |
|---|---|---|
| 1 | `cd frontend && npm run build` | ✅ 8 routes, clean, no TS errors |
| 2 | `cd backend && npm run build && npm start` | ✅ tsc exit 0; server listening |
| 3 | `curl /api/health`, `/api/contracts`, `/api/people` | ✅ 7 contracts, 8 people, health ok |
| 4 | `POST /api/contact` → row in `data/kfm.db` | ✅ id 1 via curl, confirmed by `SELECT` |
| 5 | All 8 routes in a real browser | ✅ every route rendered; content spot-checked per page |
| 6 | Contact form submitted in the browser → SQLite | ✅ id 2, confirmed by `SELECT` |
| 7 | `grep -rn "sc-if\|sc-camel\|{{\|hint-placeholder" frontend/src` | ✅ no artifact constructs (only JSX `style={{…}}` and one comment) |
| 8 | Every file < 500 lines | ✅ largest is 216 |

**Found and fixed during Phase 9 — neither visible to `curl`:**

- `useReveal` armed 0 of 19 elements (streaming + StrictMode). Fixed; reveal now progresses
  1 → 10 → 15 → 19 on scroll.
- `.cmyk img:first-child { opacity: 0 }` hid the hero photograph outright. Scoped to direct
  children.

**Also verified in the browser:** hover panels open with all 4 items and align to the gutter ·
plate inks compute to the right three colours at `mix-blend-mode: multiply` ·
`filter: url(#sep-all)` applies · `--press-nx` publishes on pointer move · all 18 font faces
reach `loaded` · no broken images on any route · back-to-top appears past 600 px.

## Phase 10 — Not done  `[ ]`

- [ ] ⏳ Create the git repo — defaults to `github.com/azlanabas`; **no name chosen**
- [ ] ⏳ Choose a domain and a host — **no target decided**
- [ ] ⏳ nginx vhost + Certbot
- [ ] ⏳ PM2 for both halves; `API_BASE` pointed at the backend
- [ ] ⏳ **Backup for `data/kfm.db`** — it is the only record of contact enquiries and has none
- [ ] ⏳ Decide what happens to a submission: nothing currently reads `contact_submissions`
- [ ] ⏳ Rate-limit `POST /api/contact` before the API is exposed
- [ ] ⏳ Resolve `created_at` UTC vs GMT+8
- [ ] ⏳ Review `docs/references/KFM Profile latest as of Sept'26.pdf` against the seed data
- [ ] ⏳ Decide whether to delete the 2 test rows in `contact_submissions`
- [ ] ⏳ Contrast audit of the muted ink steps at `/62` and below
- [ ] ⏳ Pin TypeScript to one major across both halves (frontend 5.9.3, backend 7.0.2)
- [ ] ⏳ Tests — neither half has any

## Phase 11 — Cleanup  `[x]` 2026-09-22

- [x] Delete `_extract.mjs`, `_fetch-media.mjs` and `_extracted/` (1.2 MB), per the owner's
      instruction and `cleanup-temp-scripts-after-use`. `frontend/` was **not** removed — the
      flatten of decision #11 was reverted, so it is the live app folder
- [x] The artifact and the profile PDF left untouched (both moved into `docs/references/` on
      2026-09-22, byte-for-byte unchanged)
