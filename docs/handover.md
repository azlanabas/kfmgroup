# Handover — running, building, deploying

*Status: as-built for local operation, verified 2026-09-22. The deploy section is **target
state** — nothing has been deployed anywhere.*

## 1. What runs where

| | Frontend | Backend |
|---|---|---|
| Folder | `frontend/` | `backend/` |
| Stack | Next.js 16.3.5, React 19.2.8, Tailwind 4.3.3 | Express 5.2.1, `node:sqlite` |
| Port | 3000 | 4000 (loopback by default) |
| Needs the other? | **yes** — `/`, `/sectors`, `/people` throw if the API is down | no |
| State | none | `data/kfm.db` |

Node **v26.5.0** is required — `node:sqlite` is a built-in, so there is no fallback driver.

## 2. First run, from a fresh clone

```bash
cd PROJECTS/kfmgroup

# backend
cd backend
npm install
npm run migrate        # creates ../data/kfm.db, applies 001_init.sql
npm run seed           # 7 contracts, 8 people
npm run dev            # :4000

# frontend, in a second terminal
cd ../frontend
npm install
npm run dev            # predev mirrors ../media → public/media, then :3000
```

Open http://localhost:3000. If the API is not running, the three dynamic routes show an error
page naming the URL they tried — that is deliberate, not a bug.

## 3. Production build

```bash
cd backend  && npm run build && npm start     # tsc → dist/, then node dist/server.js
cd frontend && npm run build && npm start     # prebuild mirrors media, then next build/start
```

Both were run clean on 2026-09-22: 8 routes (5 static, 3 dynamic), backend `tsc` exit 0.

## 4. Day-to-day

### Editing content

There is **no admin UI and no login** — see [`user_guide.md`](user_guide.md) for the full
walk-through. In short:

| To change | Edit | Then |
|---|---|---|
| a contract or a person | `backend/src/seed-data.ts` | `cd backend && npm run seed` |
| a photograph | drop the file into `media/` | restart `npm run dev`, or `npm run sync:media` |
| headline / body copy | the component under `frontend/src/` | rebuild |
| company details, feature flags | `frontend/src/lib/siteConfig.ts` | rebuild |

`npm run seed` is **safe on a live database** — it rebuilds `contracts` and `people` only and
never touches `contact_submissions`.

### Reading contact enquiries

Nothing surfaces them. Query the file directly:

```bash
cd PROJECTS/kfmgroup
node -e "
const {DatabaseSync}=require('node:sqlite');
const db=new DatabaseSync('data/kfm.db',{readOnly:true});
console.table(db.prepare('SELECT id,name,email,company,message,created_at,ip FROM contact_submissions ORDER BY id DESC').all());
"
```

⚠️ `created_at` is **UTC**, not GMT+8.

### Hiding contract values, or the Careers page

`frontend/src/lib/siteConfig.ts` → `showContractValues` / `showCareers`, then rebuild. These were
the artifact's editor props. `showCareers: false` removes the nav link **and** makes `/careers`
return 404.

## 5. Health checks

```bash
curl -s localhost:4000/api/health      # {"ok":true,"db":"…/data/kfm.db","contracts":7,…}
curl -s localhost:4000/api/contracts | head -c 200
curl -s localhost:3000/ -o /dev/null -w '%{http_code}\n'
```

`/api/health` runs a real query, so a 200 proves the database is reachable, not just that the
process is alive.

⚠️ **`curl` is not sufficient to verify this site.** Two faults in this build returned HTTP 200
while the page was visibly wrong — the scroll-reveal never firing, and the hero photograph hidden
by a CSS selector. Check in a browser.

## 6. Configuration

### backend

| Variable | Default | Notes |
|---|---|---|
| `PORT` | `4000` | |
| `HOST` | `127.0.0.1` | loopback — not reachable off-box until changed |
| `DB_PATH` | `<project>/data/kfm.db` | |
| `CORS_ORIGIN` | unset | comma-separated; CORS off when unset |

### frontend

| Variable | Default | Notes |
|---|---|---|
| `API_BASE` | `http://127.0.0.1:4000` | server-side only; never reaches the browser |

**No secrets anywhere in this project.** Nothing authenticates, and nothing belongs in
`.secrets/`.

## 7. Rebuilding the database from scratch

```bash
cd backend
rm ../data/kfm.db ../data/kfm.db-wal ../data/kfm.db-shm   # ⚠️ destroys contact_submissions
npm run migrate && npm run seed
```

⚠️ This is the **only** destructive operation in the project. `contact_submissions` cannot be
rebuilt from anything. Take a copy of `kfm.db` first.

## 8. Deploy — ⏳ TARGET STATE, not executed

No repo, no domain, no host has been chosen ([`README.md` §3](README.md#3-pending--️-not-decisions-just-open-items)).
Written against the fleet standard so the shape is agreed before anyone starts:

1. **Repo** — `github.com/azlanabas/<name>` per the workspace default for new projects.
   Name ⏳ undecided.
2. **Host** — ⏳ undecided. Both halves are Node, so any fleet server with Node 26 works;
   `hostinger-kerry` is the usual home for app work. **Verify Node 26 on the target before
   committing** — `node:sqlite` will not exist on Node 20 or 22.
3. **Processes** — PM2, one app per half. The backend stays on `127.0.0.1:4000`.
4. **nginx** — proxy `/` to `:3000`. **Do not expose `:4000`.** `/media/…` and `/fonts/…` are
   served by Next out of `public/`.
5. **TLS** — Certbot.
6. **Media** — commit `media/`; `prebuild` regenerates the `public/media` mirror on the server.
   Do not commit the mirror.
7. **Database** — `data/kfm.db` must live on a **persisted** path and must not be inside a
   directory the deploy wipes. Run `npm run migrate` on deploy; run `npm run seed` only when
   content changed.
8. **Backup** — ⏳ **required before launch.** A scheduled copy of `kfm.db`. It is the only
   record of contact enquiries and currently has no backup of any kind.
9. **CI/CD** — GitHub Actions + poller, per the fleet standard.

## 9. Gotchas

1. **Node 26 or the backend will not start.** `node:sqlite` is built in; there is no fallback.
2. **`media/` is at the project root, not in `public/`.** `frontend/scripts/sync-media.mjs`
   mirrors it on `predev` / `prebuild`. The mirror is gitignored; editing it directly is lost work.
3. **`agentRules: false` is load-bearing.** Next 16 writes `CLAUDE.md` and `AGENTS.md` into
   `frontend/` on every dev start otherwise, which breaks the one-root-CLAUDE.md rule.
4. **`api.ts` carries `import "server-only"`.** Importing it from a client component is a build
   error, by design.
5. **`.cmyk`'s sizer rules are scoped with `>`.** Making them descendant selectors again will
   hide every photograph inside a `.print` wrapper.
6. **`data-armed` is a CSS hook only.** Using it as an "already observed" flag breaks the reveal
   under StrictMode — see [`design_doc_frontend.md` §4](design_doc_frontend.md#4-shell).
7. **The two halves are on different TypeScript majors** (5.9.3 / 7.0.2). Both compile; pin before
   adding CI.
8. **`docs/references/KFMGroup.html` is the reference original.** Never edit it. Open it side by
   side when checking a visual detail. It was at the project root as `KFM Group.html` during the
   build and moved on 2026-09-22.
