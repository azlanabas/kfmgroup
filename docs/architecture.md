# Architecture

*Status: as-built, verified 2026-09-22 by running both processes on this Mac.*
Decisions cited here live in [`README.md` §2](README.md#2-decisions-log).

## 1. Current state — verified

Two Node processes, two ports, one SQLite file.

```
                     ┌─────────────────────────────────────────┐
  browser  ────────► │  frontend/   Next.js 16.3.5 (App Router) │
                     │  :3000       React 19.2.8 · Tailwind 4.3 │
                     └───────────────┬─────────────────────────┘
                                     │  fetch() from Server Components
                                     │  and one Server Action.
                                     │  API_BASE never reaches the browser.
                                     ▼
                     ┌─────────────────────────────────────────┐
                     │  backend/    Express 5.2.1 · TS          │
                     │  :4000       node:sqlite (built-in)      │
                     └───────────────┬─────────────────────────┘
                                     │
                                     ▼
                              data/kfm.db   (WAL)
```

### Versions — measured, not assumed

| Component | Version | How verified |
|---|---|---|
| Node | v26.5.0 | `node -v`, 2026-09-21 |
| Next.js | 16.3.5 | `npm ls next` |
| React / ReactDOM | 19.2.8 | `npm ls react` |
| Tailwind CSS | 4.3.3 | `npm ls tailwindcss` |
| TypeScript (frontend) | 5.9.3 | `npm ls typescript` |
| TypeScript (backend) | 7.0.2 | `npm ls typescript` in `backend/` |
| Express | 5.2.1 | `npm ls express` |
| SQLite driver | `node:sqlite` (built-in) | `DatabaseSync` round-trip run 2026-09-21 |

⚠️ The two halves are on **different TypeScript majors** (5.9.3 / 7.0.2) because each installed
its own latest. They are separate packages and both compile clean, but this is worth pinning
before the project gains a CI step.

### Why `node:sqlite`

Built into Node 26 — no native dependency, no compile step, nothing to rebuild when Node
upgrades. `better-sqlite3` was not needed. Verified working with a real insert/select before any
code was written against it.

## 2. Request paths

### Reads — Server Components only, ISR

`/`, `/sectors`, `/people` and `/llms.txt` read from the API through
`frontend/src/lib/api.ts`, which carries `import "server-only"` — importing it from a client
component is a build error, which is what keeps `API_BASE` off the browser.

Those fetches are **cached and revalidated hourly** (`next: { revalidate: 3600, tags:
['kfm-content'] }`), so the pages are ISR, not per-request — owner decision 2026-09-22. All 14
routes now prerender; none is dynamic.

⚠️ **Two consequences.** First, `npm run build` now requires the API to be running, because the
pages are rendered at build time. Second, a `npm run seed` does not appear on the site until the
next revalidation or deploy; call `revalidateTag('kfm-content')` to publish sooner.

A read that cannot reach the backend **throws** with the URL it tried. It does not fall back to
an empty list: a dead API surfaces as an error page rather than as a page that quietly renders no
contracts.

`/about`, `/work`, `/tech`, `/careers` and `/contact` touch no data and are prerendered static.

### The single write path

```
browser form  ──►  Server Action (src/app/contact/actions.ts)
                        └──►  postContact()  ──►  POST :4000/api/contact
                                                       └──►  INSERT INTO contact_submissions
```

The browser posts to Next, and Next posts to Express. CORS on the API is **closed by default**
and only opens if `CORS_ORIGIN` is set, because nothing in this design needs a browser to call
the API directly.

## 3. What replaced the artifact's runtime

The source was a self-extracting Claude Artifact bundle: a 112 KB template in a custom
templating language, driven by `class Component extends DCLogic` through a generated 67 KB
`dc-runtime`. None of that survives.

| Artifact mechanism | Replacement | File |
|---|---|---|
| `state = { page }` client-side router over 8 views | 8 real App Router routes | `src/app/*/page.tsx` |
| `state = { menu }` + `openWork` / `openSectors` | `useState` in a client component | `SiteNav.tsx` |
| `state = { scrolled }`, threshold 600px | `useState` + scroll listener | `BackToTop.tsx` |
| `IntersectionObserver` in `componentDidMount`, re-scanned every 500 ms | `useReveal()` — IO + MutationObserver | `useReveal.ts` |
| `print-plates.js` injecting SVG defs, plus the press driver | SVG defs rendered by React; driver unchanged | `PrintPlates.tsx`, `pressDriver.ts` |
| `showContractValues` / `showCareers` / `motion` editor props | Build-time flags | `src/lib/siteConfig.ts` |
| 16 gzip+base64 manifest assets | 12 font files in `public/fonts/` | `src/app/fonts.css` |
| 22 remote `kfmgroup.my` image URLs | Local files under `media/` | see §4 |

Two of these needed care and are documented where they live:

- **`useReveal.ts`** — the layout's effect runs when the *shell* commits, but the API-backed
  pages stream their content in afterwards. A `pathname` dependency never sees that, so the first
  implementation armed 0 of 19 elements. A MutationObserver re-arms whatever arrives.
- **`useReveal.ts`, second fault** — `data-armed` was doing double duty as a CSS hook *and* a
  record of "already observed". Under StrictMode's double-invoke the second observer ended up
  with zero targets. `data-armed` is now a CSS hook only.

## 4. Media pipeline

```
media/              ← source of truth, committed
  brand/ photos/ portraits/
     │
     │  frontend/scripts/sync-media.mjs  (npm predev / prebuild)
     ▼
frontend/public/media/   ← generated mirror, gitignored
     │
     ▼
served at /media/...
```

The owner placed `media/` at the project root so both halves can reach it. Next only serves
`public/`, so the mirror step exists to bridge that; it runs on every `dev` and `build`, so
adding a photograph to `media/` is enough.

## 5. Target state — not yet built

| Concern | Current | Target |
|---|---|---|
| Hosting | nothing deployed | [OWNER INPUT REQUIRED] — no host or domain chosen |
| Process management | `npm run dev` / `npm start` by hand | PM2 per the fleet standard, one app per half |
| Reverse proxy | none | nginx, frontend on `/`, API not exposed publicly |
| TLS | none | Certbot |
| Backups | none — `data/kfm.db` exists only on this Mac | scheduled copy of `kfm.db`; it holds the only record of contact submissions |
| CI/CD | none | GitHub Actions + poller, per the fleet standard |

⚠️ **`data/kfm.db` has no backup of any kind.** It is the only place contact submissions land.
