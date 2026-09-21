# Backend design

*Status: as-built. Every endpoint below was exercised with curl or a real browser submission on
2026-09-22.* Decisions cited here live in [`README.md` §2](README.md#2-decisions-log).

## 1. Shape

A small Express 5 service whose only job is to hand JSON to the Next server and to record
contact enquiries. It is not public: the browser never calls it (decision #3, and
[`architecture.md` §2](architecture.md#2-request-paths)).

```
backend/src/
├── server.ts     app, middleware, 4 routes, graceful shutdown
├── db.ts         the single DatabaseSync handle + pragmas
├── migrate.ts    migrations/*.sql, in order, recorded
├── seed.ts       replaces contracts + people
├── seed-data.ts  ← the content itself
└── routes/       contracts.ts · people.ts · contact.ts
```

## 2. The database handle

`db.ts` opens one `DatabaseSync` for the process lifetime and sets `journal_mode = WAL` (keeps
the site's reads off the writer's back) and `foreign_keys = ON` (off by default in SQLite, and
per-connection).

Path resolution: `DB_PATH` env var, else `../../data/kfm.db` relative to the source file — the
project root, decision #15. The parent directory is created if missing, so a fresh clone can run
`npm run migrate` immediately.

**`node:sqlite`, not `better-sqlite3`** — built into Node 26, so there is no native dependency,
no compile step, and nothing to rebuild on a Node upgrade. Verified with a real insert/select
round-trip on v26.5.0 before any code was written against it.

Statements are prepared **once at module scope**, not per request. With `DatabaseSync` this is
both faster and simpler; there is no connection pool because there is one connection.

## 3. Middleware

| Middleware | Setting | Why |
|---|---|---|
| `x-powered-by` | disabled | don't advertise the stack |
| `trust proxy` | `true` | so `req.ip` is the caller, not the proxy, once nginx is in front |
| `express.json` | `limit: "64kb"` | the only body is a contact form |
| `cors` | **only if `CORS_ORIGIN` is set** | nothing needs browser access; closed by default |

## 4. Routes

### `GET /api/health`

Runs `SELECT COUNT(*) FROM contracts` so it proves the **database** is reachable, not merely that
the process is up. Returns `{ok, db, contracts, uptime}`; 500 with the error string if the query
throws.

### `GET /api/contracts[?status=live|completed]`

Two prepared statements — all rows, or filtered by status — both ordered `sort_order, id`. An
unrecognised `status` is a `400` rather than an empty list, so a typo in a caller is loud.

### `GET /api/people`

All 8 rows, ordered `sort_order, id`, which puts directors before management. The page filters
by `group_label` rather than the API doing it, because both groups are always rendered together.

### `POST /api/contact`

The only write path.

```
trim + cap  →  name non-empty
            →  email matches /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            →  message ≥ 10 chars
            →  INSERT, returning 201 {ok:true, id}
```

Caps: name 200, email 320, company 200, message 5000 — applied by truncation before validation,
so an oversized field is clipped rather than rejected. Empty `company` is stored as `NULL`, not
`""`.

Email validation is deliberately **shape-only**. A stricter regex rejects valid addresses; the
address is not used for authentication, only for replying.

Errors return `{ok: false, error}` with a sentence written for the person filling in the form.
An insert failure logs the real error server-side and returns a generic message.

### Fallthrough

Anything unmatched returns `404 {error: "Not found"}` as JSON, so a caller expecting JSON never
receives Express's HTML error page.

## 5. Content and seeding

**`seed-data.ts` is the editable source of the site's content** — 7 contracts and 8 people,
transcribed from `KFM Group.html` on 2026-09-22. It is typed (`ContractSeed`, `PersonSeed`), so a
missing field is a compile error rather than a null column.

`seed.ts` runs in one transaction:

```
BEGIN
  DELETE FROM contracts
  DELETE FROM people
  DELETE FROM sqlite_sequence WHERE name IN ('contracts','people')   ← ids restart at 1
  INSERT … × 15
COMMIT          (ROLLBACK + exit 1 on any failure)
```

⚠️ **`contact_submissions` is never touched** by the seed — not deleted, not reset. It holds real
enquiries. Re-seeding is the supported way to publish a content edit and must stay safe to run on
a live database.

Client names are kept as the artifact worded them ("A federal health ministry", "A corporate
real-estate client"), not resolved to the actual agency. That was the artifact's choice and the
port preserves it.

## 6. Migrations

`migrate.ts` reads `backend/migrations/*.sql`, sorts by filename, and applies any not already in
`schema_migrations (filename, applied_at)` — each in its own transaction, rolling back and
exiting 1 on failure. Re-running is a no-op.

No down-migrations, deliberately: seeded content can be rebuilt, so the recovery path is
delete-and-rerun. The exception that makes this a real constraint is `contact_submissions`, which
cannot be rebuilt from anything — so a future migration that touches it needs a backup taken
first.

## 7. Lifecycle

`SIGINT` and `SIGTERM` close the HTTP server, then the database handle, then exit 0. That matters
with WAL: a clean close checkpoints the `-wal` file back into `kfm.db`.

## 8. Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | |
| `HOST` | `127.0.0.1` | loopback by default — not reachable off-box until changed |
| `DB_PATH` | `<project>/data/kfm.db` | |
| `CORS_ORIGIN` | unset | comma-separated origins; CORS stays off when unset |

No secrets. Nothing in this service authenticates, and nothing here belongs in `.secrets/`.

## 9. Known gaps — ⏳

1. ⏳ **No rate limiting on `POST /api/contact`.** Fine while the API is loopback-only and reached
   through a Server Action; it needs attention before the API is ever exposed.
2. ⏳ **No notification.** Submissions land in SQLite and nothing reads them — no email, no alert.
3. ⏳ **No backup of `data/kfm.db`.**
4. ⏳ **`created_at` is UTC** — see [`db_schema.md`](db_schema.md).
5. ⏳ **No tests.**
