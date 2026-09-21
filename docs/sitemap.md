# Sitemap

*Status: as-built. Every route and endpoint below was requested in a real browser or with curl
on 2026-09-22 and returned what is described.*

## 1. Navigation

The masthead is sticky and identical on all 8 routes.

```
KFM logo ─────────────────────────────────────────────►  /
About                                                 ►  /about
What we do            ▼ hover panel, 4 items ─────────►  /work
Technology                                            ►  /tech
Sectors               ▼ hover panel, 4 items ─────────►  /sectors
People                                                ►  /people
Careers               (hidden when showCareers=false) ►  /careers
[Contact us]          primary button                  ►  /contact
```

Both hover panels are absolutely positioned against the `<nav>` and aligned to the page gutter
(`left: var(--edge)`). Every item in either panel links to that panel's own page — the artifact
did the same; they are signposts, not deep links.

**What we do** panel: Facility management set-up & advisory · Contract implementation &
administration · Condition assessment & audits · Integrated FM, project & construction.

**Sectors** panel: Healthcare · Transport terminals · Government & royal · Commercial & offices.

## 2. Page inventory

| Route | Title | Render | Data | Sections |
|---|---|---|---|---|
| `/` | KFM Group Sdn Bhd — Facility & asset management | **dynamic** | `GET /api/contracts` | Hero · FactRule · CoreBusiness · TechSplit · OnContract · Quote · HomeCta |
| `/about` | About — KFM Group Sdn Bhd | static | — | AboutIntro (story, vision) · AboutDetail (sustainability, 6 value propositions, competencies) |
| `/work` | What we do — KFM Group Sdn Bhd | static | — | intro · ServiceElements (4 numbered elements × 2 sub-services) · closing CTA |
| `/tech` | Technology & sustainability — KFM Group Sdn Bhd | static | — | intro · 4 plate-numeral capabilities · wide print figure · low-carbon split |
| `/sectors` | Sectors — KFM Group Sdn Bhd | **dynamic** | `GET /api/contracts` | 3 live sector blocks · Commercial & offices (narrative) · CompletedContracts table · 11 director projects |
| `/people` | Our people — KFM Group Sdn Bhd | **dynamic** | `GET /api/people` | Directors and shareholders (3) · Management (5) |
| `/careers` | Careers — KFM Group Sdn Bhd | static | — | intro · 6 disciplines · applying (mailto) |
| `/contact` | Contact — KFM Group Sdn Bhd | static | `POST` via Server Action | 3 contact columns · ContactForm · 6 registrations · 6 company facts |

`/careers` calls `notFound()` when `siteConfig.showCareers` is false, so turning the flag off
removes both the nav link and the route.

There is no `/404` design of its own — Next's default `not-found` renders inside the shell.

## 3. API endpoints

Base: `http://127.0.0.1:4000` in development (`API_BASE` overrides).

| Method | Route | Query | Returns | Verified |
|---|---|---|---|---|
| GET | `/api/health` | — | `{ok, db, contracts, uptime}` | `{"ok":true,…,"contracts":7}` |
| GET | `/api/contracts` | — | all 7 contracts, `sort_order` then `id` | 7 rows |
| GET | `/api/contracts` | `?status=live` | 3 rows | 3 rows |
| GET | `/api/contracts` | `?status=completed` | 4 rows | 4 rows |
| GET | `/api/contracts` | `?status=<other>` | `400 {error}` | — |
| GET | `/api/people` | — | 8 people, directors then management | 8 rows |
| POST | `/api/contact` | — | `201 {ok:true,id}` / `400 {ok:false,error}` | `{"ok":true,"id":1}`, and `400` on a malformed email |
| any | anything else | — | `404 {error:"Not found"}` | — |

### POST /api/contact

```json
{ "name": "…", "email": "…", "company": "… (optional)", "message": "…" }
```

Validation, in order: `name` non-empty · `email` matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` ·
`message` at least 10 characters. Fields are trimmed and capped (name 200, email 320, company
200, message 5000). The caller's IP is recorded from `req.ip` with `trust proxy` on.

## 4. Data reaching each page

| Page | Table | Rows used |
|---|---|---|
| `/` OnContract | `contracts` | `status = 'live'` — 3 cards with photo, note and RM figure |
| `/sectors` SectorBlocks | `contracts` | `status = 'live'` — 3 blocks, photo side alternating |
| `/sectors` CompletedContracts | `contracts` | `status = 'completed'` — 4 table rows |
| `/people` Directors | `people` | `group_label = 'Directors and shareholders'` — 3 |
| `/people` Management | `people` | `group_label = 'Management'` — 5 |
| `/contact` form | `contact_submissions` | write only |

Content that is **not** in the database and lives in the page components: the Commercial &
offices narrative, the 11 director projects, the 4 core elements, the 6 value propositions, the
6 registrations, the company facts (in `siteConfig.ts`) and all headline copy.
