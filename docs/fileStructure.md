# File structure

*Status: as-built. Tree taken from `find` on 2026-09-22; `node_modules/`, `.next/`,
`backend/dist/` and the generated `frontend/public/media/` mirror are omitted.*

## Project root

```
PROJECTS/kfmgroup/
├── docs/                           this corpus
│   └── references/                 source material — not read by the app
│       ├── KFMGroup.html   586 KB  the original artifact — REFERENCE, never edited
│       └── KFM Profile latest as of Sept'26.pdf   6.5 MB  ⏳ not yet reviewed
├── data/
│   └── kfm.db                      SQLite — the app's only database (+ -wal, -shm)
├── media/                  3.4 MB  image library, source of truth
│   ├── brand/              1 file
│   ├── photos/            14 files
│   └── portraits/          7 files
├── frontend/                       Next.js 16 · App Router · TS · Tailwind v4
└── backend/                        Express 5 · TS · node:sqlite
```

`data/kfm.db-wal` and `-shm` are SQLite's write-ahead log and shared-memory index. They appear
because `db.ts` sets `PRAGMA journal_mode = WAL`; they are not separate databases.

## frontend/

```
frontend/
├── package.json            name "frontend"; predev/prebuild run sync-media
├── next.config.ts          agentRules: false  (stops Next writing CLAUDE.md/AGENTS.md)
├── tsconfig.json · postcss.config.mjs · next-env.d.ts
├── .gitignore              + /public/media  (generated mirror)
├── scripts/
│   └── sync-media.mjs      mirrors ../media → public/media
├── public/
│   └── fonts/              12 subset files: 6 woff (italic) + 6 woff2 (roman)
└── src/
    ├── app/
    │   ├── layout.tsx      shell: SiteNav · children · BackToTop · SiteFooter · Reveal · PrintPlates
    │   ├── globals.css     @theme tokens · @layer base · @layer components (the 14 classes)
    │   ├── fonts.css       the 18 @font-face rules, generated from the artifact
    │   ├── page.tsx                    /          home        (dynamic)
    │   ├── about/page.tsx              /about                 static
    │   ├── work/page.tsx               /work                  static
    │   ├── tech/page.tsx               /tech                  static
    │   ├── sectors/page.tsx            /sectors               (dynamic)
    │   ├── people/page.tsx             /people                (dynamic)
    │   ├── careers/page.tsx            /careers               static
    │   ├── contact/page.tsx            /contact               static
    │   └── contact/actions.ts          "use server" — the only write path
    ├── components/
    │   ├── SiteNav.tsx       masthead + the two hover panels          client
    │   ├── SiteFooter.tsx                                             server
    │   ├── BackToTop.tsx     appears past 600 px of scroll            client
    │   ├── Reveal.tsx        host for useReveal(); renders null       client
    │   ├── useReveal.ts      IntersectionObserver + MutationObserver  client
    │   ├── PrintPlates.tsx   the 5 SVG separation filters             client
    │   ├── pressDriver.ts    hover registration + pointer lean
    │   ├── PlateText.tsx     PlateNumeral · PlateHeadline
    │   ├── Figures.tsx       PrintFigure · HalftoneFigure
    │   ├── Kicker.tsx        the uppercase section label
    │   └── sections/
    │       ├── home/     Hero · FactRule · CoreBusiness · TechSplit · OnContract · QuoteAndCta
    │       ├── about/    AboutIntro · AboutDetail
    │       ├── work/     ServiceElements
    │       ├── sectors/  SectorBlocks · CompletedContracts
    │       ├── people/   PeopleGroups  (Directors · Management)
    │       └── contact/  ContactForm · Registrations
    └── lib/
        ├── api.ts        server-only; getContracts · getPeople · postContact
        ├── types.ts      Contract · Person · ContactPayload · ContactResult
        └── siteConfig.ts showContractValues · showCareers · motion · company facts
```

## backend/

```
backend/
├── package.json            name "backend", type: module
├── tsconfig.json           nodenext, strict, rewriteRelativeImportExtensions
├── .gitignore              node_modules · dist · *.log
├── migrations/
│   └── 001_init.sql        3 tables + 3 indexes
└── src/
    ├── server.ts           Express app, 4 routes, graceful shutdown
    ├── db.ts               the single DatabaseSync handle; DB_PATH → ../../data/kfm.db
    ├── migrate.ts          runs migrations/*.sql in name order, records in schema_migrations
    ├── seed.ts             replaces contracts + people; NEVER touches contact_submissions
    ├── seed-data.ts        ← the editable content: 7 contracts, 8 people
    └── routes/
        ├── contracts.ts    GET /api/contracts[?status=]
        ├── people.ts       GET /api/people
        └── contact.ts      POST /api/contact  (validation + insert)
```

## File sizes — global RULE 5 (max 500 lines per code file)

Measured 2026-09-22, `wc -l` over `frontend/src` and `backend/src`. Largest ten:

| Lines | File |
|---:|---|
| 216 | `backend/src/seed-data.ts` |
| 184 | `frontend/src/components/pressDriver.ts` |
| 159 | `frontend/src/components/SiteNav.tsx` |
| 110 | `frontend/src/components/PrintPlates.tsx` |
| 100 | `frontend/src/components/sections/about/AboutDetail.tsx` |
| 95 | `frontend/src/components/sections/work/ServiceElements.tsx` |
| 94 | `frontend/src/app/sectors/page.tsx` |
| 92 | `frontend/src/app/tech/page.tsx` |
| 86 | `frontend/src/components/sections/people/PeopleGroups.tsx` |
| 74 | `frontend/src/components/useReveal.ts` |

✅ Every file is well under 500 lines. `globals.css` (≈400 lines) is the largest file in the
project; the 18 `@font-face` rules were split into `fonts.css` to keep it that way.

## Temporary files — removed after the build

`_extract.mjs`, `_fetch-media.mjs` and `_extracted/` decoded the artifact bundle and pulled the
images. They were deleted on 2026-09-22 once the port was verified, per the owner's instruction
and the workspace's `cleanup-temp-scripts-after-use` rule. `docs/references/` is **not**
temporary and stays.

⚠️ **The two reference files moved during the build.** `KFM Group.html` and `references/` sat at
the project root while the port was written; on 2026-09-22 they were moved into
`docs/references/` and the artifact was renamed `KFMGroup.html` (space removed). Both are
byte-for-byte unchanged — 600,443 and 6,826,667 bytes. Notes written earlier in the build name
the old paths.
