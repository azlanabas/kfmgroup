# Database schema

*Status: as-built. Applied by `backend/migrations/001_init.sql` and verified against
`data/kfm.db` on 2026-09-22 (7 contracts, 8 people, 2 test submissions).*

**Engine:** SQLite via Node's built-in `node:sqlite` (`DatabaseSync`), Node v26.5.0.
**File:** `data/kfm.db` at the project root — decision #15 in [`README.md` §2](README.md#2-decisions-log).
**Pragmas set on every connection** (`backend/src/db.ts`): `journal_mode = WAL`,
`foreign_keys = ON`.

## Logical model

There are no foreign keys between these tables — nothing references anything else. They are
three independent lists.

```
contracts              people                 contact_submissions
(seeded, read-only     (seeded, read-only     (written at runtime;
 at runtime)            at runtime)            NEVER seeded or cleared)
```

## contracts

7 rows. Seeded from `backend/src/seed-data.ts`; replaced wholesale by `npm run seed`.

| Column | Type | Null | Notes |
|---|---|:-:|---|
| `id` | INTEGER PK AUTOINCREMENT | no | |
| `title` | TEXT | no | Contract name as printed |
| `client` | TEXT | no | As the artifact worded it — "A federal health ministry", not the actual agency |
| `term_start` | TEXT | **yes** | ISO date; null where no start was stated |
| `term_end` | TEXT | **yes** | ISO date |
| `term_label` | TEXT | no | Human phrasing shown on the page, e.g. `1 Nov 2017 — 31 Dec 2018`, or `—` |
| `value_label` | TEXT | no | `RM 36,051,575.20`, `RM 127,500 per month`, or `—` |
| `status` | TEXT | no | `CHECK (status IN ('live','completed'))` |
| `sector` | TEXT | **yes** | Heading a live row sits under; null on completed rows |
| `summary` | TEXT | **yes** | Long copy for the Sectors block |
| `card_note` | TEXT | **yes** | Short line under the Home card heading |
| `image_url` | TEXT | **yes** | `/media/photos/…` |
| `image_alt` | TEXT | **yes** | |
| `sort_order` | INTEGER | no | default 0; live rows 10–30, completed 40–70 |

`term_start` and `term_end` are stored alongside `term_label` rather than formatted from it,
because three rows have no usable dates (`Ongoing`, `—`) and the page prints the label verbatim.

**Why more columns than the plan named.** The plan specified
`(id, title, client, term_start, term_end, term_label, value_label, sort_order)`, which fits the
4 *completed* rows exactly. Decision #16 put all 7 contracts in the database so nothing about a
contract is hardcoded in a component; the 3 live rows carry a photograph, a sector heading and
two lengths of copy, which is what the extra six columns hold.

### Current rows

| id | status | sector | term_label | value_label |
|---:|---|---|---|---|
| 1 | live | Healthcare | 1 September 2022 — 31 August 2027, ongoing | RM 36,051,575.20 |
| 2 | live | Transport terminals | Ongoing | RM 50,414,328.00 |
| 3 | live | Government & royal buildings | 17 August 2026 — 16 August 2029 | RM 30,240,000.00 |
| 4 | completed | — | 1 Nov 2017 — 31 Dec 2018 | RM 127,500 per month |
| 5 | completed | — | 1 Nov 2017 — 31 Dec 2018 | RM 52,500 per month |
| 6 | completed | — | 1 Feb 2021 — 31 Jan 2022 | — |
| 7 | completed | — | — | — |

## people

8 rows.

| Column | Type | Null | Notes |
|---|---|:-:|---|
| `id` | INTEGER PK AUTOINCREMENT | no | |
| `name` | TEXT | no | |
| `role` | TEXT | no | Printed in uppercase accent-700 |
| `bio` | TEXT | no | Paragraphs joined by a **blank line**; `PeopleGroups.tsx` splits on `/\n{2,}/` |
| `group_label` | TEXT | no | `Directors and shareholders` \| `Management` |
| `photo_url` | TEXT | **yes** | `/media/portraits/…`; **null for Azlan Abas**, who has no portrait in the artifact |
| `sort_order` | INTEGER | no | 10–30 directors, 40–80 management |

`group_label` is a plain string rather than a lookup table or a CHECK constraint: there are two
values, the page filters on them literally, and a third group would be a content decision, not a
schema one.

## contact_submissions

The only table the running app writes to. 2 rows at time of writing, both from this session's
verification (⏳ see [`README.md` §3](README.md#3-pending--️-not-decisions-just-open-items)).

| Column | Type | Null | Notes |
|---|---|:-:|---|
| `id` | INTEGER PK AUTOINCREMENT | no | |
| `name` | TEXT | no | trimmed, ≤200 |
| `email` | TEXT | no | trimmed, ≤320, shape-checked only |
| `company` | TEXT | **yes** | trimmed, ≤200; null when left blank |
| `message` | TEXT | no | trimmed, ≤5000, ≥10 |
| `created_at` | TEXT | no | `DEFAULT (datetime('now'))` — ⚠️ **UTC** |
| `ip` | TEXT | **yes** | `req.ip`, with `trust proxy` enabled |

⚠️ **`created_at` is UTC.** The row written at 00:32 local on 22 September reads
`2026-09-21 16:32:31`. Anyone reading these timestamps as local time will be 8 hours out.

⚠️ **This table is never seeded and never cleared.** `seed.ts` deletes and rebuilds `contracts`
and `people` only. It holds the only record of an enquiry, and `data/kfm.db` has no backup.

## Indexes

| Index | On | Why |
|---|---|---|
| `idx_contracts_status` | `contracts (status, sort_order)` | every contracts read filters or orders by these |
| `idx_people_group` | `people (group_label, sort_order)` | the People page splits on `group_label` |
| `idx_contact_created` | `contact_submissions (created_at DESC)` | for reading enquiries newest-first |

At 7 and 8 rows these indexes do nothing measurable. They are there so the access pattern is
recorded in the schema.

## Migrations

`backend/src/migrate.ts` runs every `.sql` file in `backend/migrations/` in name order, each in
its own transaction, and records the filename in `schema_migrations (filename, applied_at)`. A
second run is a no-op. There is deliberately **no down-migration**: the content is seeded from a
file and can be rebuilt, so the recovery path is delete-and-rerun, not roll-back — except for
`contact_submissions`, which no migration or seed touches.
