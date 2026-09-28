---
title: website / data — the SQLite database
folder: KFM_GROUP/website/data
type: folder-index
client: KFM Group
kind: sqlite
status: live local copy — gitignored
classification: contains real contact-form submissions
tags:
  - client/kfm-group
  - website
  - sqlite
  - database
updated: 2026-09-24
---

# website / data — the SQLite database

> **One file: `kfm.db`, 48 KB.** It sits at the **project root**, not inside `backend/` —
> **owner decision #15: "the database belongs to the app, not to the service that opens it."**

**Parent:** [[KFM_GROUP/website/website|website]]

---

## 🔒 Gitignored, and for a reason

The project's own `.gitignore` says it plainly:

```
# ── the database ─────────────────────────────────────────────
# data/kfm.db holds real contact submissions and is never committed
data/*.db
data/*.db-wal
data/*.db-shm
data/*.sqlite
data/*.sqlite3
```

**This copy is not the production database.** The deployed app on `hostinger-kerry` has its own
`data/kfm.db`. Do not treat this file as the live record, and do not copy it over the server's.

## Contents

`sqlite3` on 2026-09-24 reports five tables:

| Table | What it holds |
|---|---|
| `contracts` | **7 rows** seeded. Columns extended beyond the original plan (decision #16): `status`, `sector`, `summary`, `card_note`, `image_url`, `image_alt`. |
| `people` | **8 rows** seeded, incl. `photo_url`. |
| `contact_submissions` | Live form submissions. ⚠️ **Never re-seeded** — `npm run seed` rebuilds `contracts` and `people` only. |
| `schema_migrations` | Applied-migration record, written by `npm run migrate`. |
| `sqlite_sequence` | SQLite's own autoincrement bookkeeping. |

*Row counts for `contracts`/`people` are quoted from the parent README's seed description; the
table list was read from this file's `sqlite_master` on 2026-09-24. **No row was counted or
read** — `contact_submissions` was deliberately not queried.*

## ⚠️ Two open items the parent README records

1. **Two test rows sit in `contact_submissions`** (ids 1 and 2, from the 2026-09-22
   verification). **Left in place — deleting rows is the owner's call.**
2. **`created_at` is stored in UTC** (`datetime('now')`). Row 2 reads `2026-09-21 16:32:31` for
   a submission made at **00:32 local (GMT+8)**. Decide whether to store local time or render
   the offset **before anyone reads these timestamps as local.**

## Rebuilding from scratch

```bash
cd ../backend
npm run migrate   # creates ../data/kfm.db and applies 001_init.sql
npm run seed      # loads 7 contracts and 8 people
```

Both are **safe to re-run**: `migrate` skips anything already applied; `seed` rebuilds
`contracts` and `people` only.

## No backup

There is **no automated backup of this file** and none of the server's copy recorded anywhere
in this project. ⚠️ Flagged — the only durable content here is `contact_submissions`, and it is
the one table `seed` cannot restore.

## Related notes

- [[KFM_GROUP/website/backend/backend|backend]] — the only process that opens this file
- [[KFM_GROUP/website/website|website]] — decisions #15/#16 and the open items above
- [[KFM_GROUP/website/docs/docs|docs]] — `db_schema.md` has the column-level detail
- [[PROJECTS/schoolcatering/CRON/schoolcatering-CRON|schoolcatering / CRON]] — how the other live app's database backup was fixed, and what it cost to leave it unwatched

*Table list read from `kfm.db` with `sqlite3` on 2026-09-24; the `.gitignore` block quoted
verbatim. The open items are carried forward from the parent README (2026-09-22) and **were not
re-verified against this file.***
