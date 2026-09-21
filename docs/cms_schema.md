# CMS schema — **N/A**

*Status: as-built. This file exists so the docs corpus is complete; there is nothing to
document.*

**This project has no CMS.** There is no Payload, no WordPress, no admin UI and no login of any
kind — decision #6 in [`README.md` §2](README.md#2-decisions-log).

## Where content actually lives

| Content | Where | How to change it |
|---|---|---|
| 7 contracts | `backend/src/seed-data.ts` → `contracts` table | edit the file, `npm run seed`, redeploy |
| 8 people | `backend/src/seed-data.ts` → `people` table | edit the file, `npm run seed`, redeploy |
| Headline and body copy | the page and section components under `frontend/src/` | edit the component, redeploy |
| Company facts, contact details | `frontend/src/lib/siteConfig.ts` | edit the file, redeploy |
| Feature flags | `frontend/src/lib/siteConfig.ts` | `showContractValues`, `showCareers`, `motion` |
| Photographs and portraits | `media/` at the project root | drop the file in, references it by `/media/…` path |

[`user_guide.md`](user_guide.md) is the practical walk-through for each of these.

## Consequences worth knowing

1. **Every content change is a code change and a deploy.** There is no way for a
   non-developer to edit this site.
2. **The standard fleet admin credential does not apply here.** The docs corpus standard says to
   record `web@gaiada.com` in `user_guide.md` for any username/password admin login. This project
   has no such login, so there is no credential to record and none has been seeded.
3. **`contact_submissions` has no reader.** Enquiries land in SQLite and nothing surfaces them —
   no email, no notification, no admin list. Reading them today means querying `data/kfm.db` by
   hand; the query is in [`handover.md`](handover.md).

## If a CMS is ever added

This file becomes the collection schema. The natural first candidates are the two seeded tables,
which already have stable shapes — see [`db_schema.md`](db_schema.md). That would be a new
decision and belongs in [`README.md` §2](README.md#2-decisions-log) before any work starts.
