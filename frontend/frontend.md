---
title: website / frontend — Next.js App Router
folder: KFM_GROUP/website/frontend
type: folder-index
client: KFM Group
kind: nextjs-app-router
language: TypeScript
status: deployed — PM2 kfmgroup-frontend :3240
tags:
  - client/kfm-group
  - website
  - nextjs
  - react
  - tailwind
updated: 2026-09-24
---

# website / frontend — Next.js App Router

> **Next 16.3.5 · React 19.2.8 · Tailwind 4 (CSS-first `@theme`) · TypeScript 5.**
> A real Next project, **not a static unpack** — the source artifact was a client-side router
> over 8 views, so there was nothing to "split", only to port (decision #1).

**Parent:** [[KFM_GROUP/website/website|website]]
**Dev port** 3000 · **production on kerry** PM2 `kfmgroup-frontend` :3240

---

## The 8 routes

| Route | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/about` | `src/app/about/page.tsx` |
| `/careers` | `src/app/careers/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` + `actions.ts` (server action) |
| `/people` | `src/app/people/page.tsx` |
| `/sectors` | `src/app/sectors/page.tsx` — ⚠️ **the completed-contracts table lives here**, not on Work/About as the original plan said |
| `/tech` | `src/app/tech/page.tsx` |
| `/work` | `src/app/work/page.tsx` |

Plus machine-facing routes: `robots.ts`, `sitemap.ts`, and **`llms.txt/route.ts`** — an
LLM-readable site summary, which is an AEO/GEO measure rather than a classic SEO one.

Shell: `layout.tsx` · `globals.css` · `fonts.css` · `favicon.ico`.

## Components

| Path | What it is |
|---|---|
| `components/PrintPlates.tsx` + `pressDriver.ts` | **The CMYK print-plate system** — the port of the artifact's `print-plates.js`. Built from pseudo-elements, blend modes and a JS-published `--press-nx`. ⚠️ **Decision #18: the 14 print-plate component classes stay as CSS in `@layer components`** — utilities cannot express them. Only the 427 inline styles became Tailwind utilities. |
| `components/SiteNav.tsx`, `SiteFooter.tsx` | Shell chrome. |
| `components/Reveal.tsx` + `useReveal.ts` | Scroll-reveal behaviour. |
| `components/BackToTop.tsx` | |
| `components/Figures.tsx` | Figure/image presentation. |
| `components/JsonLd.tsx` | Structured data — pairs with `lib/schema.ts`. |
| `components/sections/home/` (6) | `Hero`, `CoreBusiness`, `OnContract`, `TechSplit`, `FactRule`, `QuoteAndCta`. |
| `components/sections/about/` (2) | `AboutIntro`, `AboutDetail`. |
| `components/sections/sectors/` (2) | `SectorBlocks`, **`CompletedContracts`**. |
| `components/sections/contact/` (2) | `ContactForm`, `Registrations`. |
| `components/sections/people/` (1) | `PeopleGroups`. |
| `components/sections/work/` (1) | `ServiceElements`. |

## `src/lib/`

| File | What it is |
|---|---|
| `api.ts` | The backend client — every read goes through here. |
| `types.ts` | Shared types. |
| `routes.ts` | Route constants. |
| `schema.ts` | JSON-LD structured data. |
| `siteConfig.ts` | Site-wide config. |

## `public/` — generated in part

| Path | Files | Note |
|---|---|---|
| `public/fonts/` | **12** | Source Serif 4 — **6 roman `.woff2` + 6 italic `.woff`** subsets (latin, latin-ext, greek, cyrillic, cyrillic-ext, vietnamese). ⚠️ **Decision #17: `@font-face` is hand-written against `/fonts/`, not `next/font/local`** — that API has no `unicode-range` field and cannot express these 6 per-script subsets. The artifact's 18 `@font-face` rules reference these 12 files, each declared at weight 400 and 600. |
| `public/media/` | 22 | 🔴 **GENERATED MIRROR — wiped and rebuilt on every `dev` and `build`.** Gitignored. **Add images to `../media/` at the project root, never here.** |

`scripts/sync-media.mjs` does the mirroring, wired to `predev` / `prebuild`, and is also
available on its own as `npm run sync:media`.

## Config

| File | Note |
|---|---|
| `next.config.ts` | Sets **`agentRules: false`** — decision #10. Next 16 regenerates a `CLAUDE.md`/`AGENTS.md` inside `frontend/` on every dev start, and the workspace rule is **exactly one root `CLAUDE.md`**. |
| `postcss.config.mjs` | `@tailwindcss/postcss`. |
| `tsconfig.json`, `next-env.d.ts` | TypeScript. |

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | Next on **:3000** (`predev` mirrors media first) |
| `npm run build` | production build (`prebuild` mirrors media first) |
| `npm start` | serves the build |
| `npm run sync:media` | re-mirrors `../media` → `public/media` on its own |

## ⚠️ Two things that will bite

1. **Node must be 22.5+** for the backend; start the backend **before** the frontend — `/`,
   `/sectors` and `/people` render an error page without it.
2. **Never put an image in `public/media/`.** It is a mirror and will be deleted.

## Related notes

- [[KFM_GROUP/website/website|website]] — the full decisions log (#1–#18) and the plan corrections
- [[KFM_GROUP/website/media/media|media]] — the master image library
- [[KFM_GROUP/website/backend/backend|backend]] — the API every page reads from
- [[KFM_GROUP/website/docs/docs|docs]] — ⚠️ **read `design_doc_frontend.md` before touching any CSS**
- Memory: `lesson-helios-global-csp-blocks-cdn` — CSP can kill a CDN-script app and **curl cannot see it**

*Route list, component list, font count and config flags were read off the source tree on
2026-09-24; dependency versions from `frontend/package.json`. Decisions #1/#10/#17/#18 are
quoted from the parent README (2026-09-22). **The app was not built or started.***
