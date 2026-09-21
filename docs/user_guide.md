# User guide

*Status: as-built, 2026-09-22. Written for two audiences — visitors to the site, and whoever
maintains its content.*

---

## Part 1 — For visitors

### The eight pages

| Page | What is on it |
|---|---|
| **Home** | The company in one screen: what KFM does, the headline figures, the four core elements, the technology base, and the three contracts running now |
| **About** | History from 2003, the vision, six value propositions, and the professional credentials held in-house |
| **What we do** | The four service elements in detail, each split into two sub-services |
| **Technology** | CMMS, energy management, BIM and robotics, plus the low-carbon commitment |
| **Sectors** | Healthcare, transport terminals, government and royal buildings, commercial and offices — with the completed-contracts table and the directors' project history |
| **People** | Three directors and shareholders, five management |
| **Careers** | The disciplines KFM hires, and how to send a CV |
| **Contact** | Email, phone, three office addresses, an enquiry form, registrations and company facts |

### Making an enquiry

Contact → fill in the form → **Send enquiry**.

- **Name**, **Email** and **Message** are required; **Organisation** is optional.
- The message must be at least 10 characters.
- A confirmation appears under the button in cyan; a problem appears in magenta with what to fix.

⚠️ **An enquiry is recorded in the database and nothing else happens.** No email is sent, to you
or to KFM, and nobody is notified. Someone has to look. See Part 2.

The page also carries the direct route, which is often faster:
**hq.admin@kfmgroup.my** · **+603 6144 5364**.

### Small things that are deliberate

- **Photographs resolve when you point at them.** Most images are printed as misregistered CMYK
  plates; hovering eases the plates into register and the picture becomes the photograph. Plates
  also lean a little toward your cursor.
- **Content fades up as you scroll.** Both effects switch off automatically if your system is set
  to reduce motion, or if you have no fine pointer (phones, tablets).
- **A "↑ Top" button** appears once you are more than 600 px down.

---

## Part 2 — For whoever maintains the site

### There is no login

**This site has no admin area, no CMS and no username or password.** That was a deliberate
decision ([`README.md` §2](README.md#2-decisions-log), #6): content is edited in code and
published by redeploying.

> ℹ️ The fleet's standard admin credential (`web@gaiada.com`) **does not apply to this project**
> and has not been seeded anywhere. There is no login page to use it on.

Everything below therefore needs a developer, a terminal and a deploy.

### Changing a contract

`backend/src/seed-data.ts` → the `CONTRACTS` array. Each entry:

| Field | What it is |
|---|---|
| `title` | contract name as printed |
| `client` | kept vague on purpose — "A federal health ministry", not the agency's name |
| `term_start` / `term_end` | ISO dates, or `null` |
| `term_label` | what the page actually prints: `1 Nov 2017 — 31 Dec 2018`, `Ongoing`, or `—` |
| `value_label` | `RM 36,051,575.20`, `RM 127,500 per month`, or `—` |
| `status` | `"live"` → Home cards + Sectors blocks · `"completed"` → the Sectors table |
| `sector` | the heading a live contract sits under |
| `summary` | the long paragraph on Sectors |
| `card_note` | the one-line note under the Home card heading |
| `image_url` / `image_alt` | `/media/photos/…` and its description |
| `sort_order` | lower first; live 10–30, completed 40–70 |

Then:

```bash
cd backend && npm run seed
```

This is safe to run on the live site — it rebuilds contracts and people only, and never touches
contact enquiries.

### Changing a person

Same file, the `PEOPLE` array. `group_label` must be exactly `Directors and shareholders` or
`Management` — the page filters on those strings. For a bio with more than one paragraph,
separate paragraphs with a **blank line**. `photo_url` may be `null` (one director has no
portrait). Re-run `npm run seed`.

### Adding or replacing a photograph

1. Put the file in `media/photos/` (or `media/portraits/`, or `media/brand/`).
2. Refer to it as `/media/photos/your-file.jpeg`.
3. Restart the dev server, or run `npm run sync:media` in `frontend/`.

⚠️ Edit `media/` at the project root — **never** `frontend/public/media/`, which is a generated
mirror and is overwritten on every build.

### Changing headline or body copy

That text lives in the page components, not the database:

| Page | File |
|---|---|
| Home | `frontend/src/components/sections/home/` |
| About | `frontend/src/components/sections/about/` |
| What we do | `frontend/src/components/sections/work/ServiceElements.tsx` |
| Technology | `frontend/src/app/tech/page.tsx` |
| Sectors | `frontend/src/app/sectors/page.tsx` (narrative + director projects) |
| Careers | `frontend/src/app/careers/page.tsx` |
| Contact | `frontend/src/components/sections/contact/` |

Company details — name, registration, email, phone, fax, addresses — are in
`frontend/src/lib/siteConfig.ts`, used by the footer, contact page and careers page at once.

### The three switches

`frontend/src/lib/siteConfig.ts`, then rebuild:

| Flag | Effect |
|---|---|
| `showContractValues` | `false` hides **every RM figure** — Home cards, the home fact rule, Sectors blocks and the Value column of the completed table |
| `showCareers` | `false` removes the Careers nav link **and** makes `/careers` return 404 |
| `motion` | `"Restrained"` holds everything visible instead of fading it up on scroll |

### Reading the enquiries

```bash
cd PROJECTS/kfmgroup
node -e "
const {DatabaseSync}=require('node:sqlite');
const db=new DatabaseSync('data/kfm.db',{readOnly:true});
console.table(db.prepare('SELECT id,name,email,company,message,created_at,ip FROM contact_submissions ORDER BY id DESC').all());
"
```

Two things to know:

1. ⚠️ **`created_at` is UTC**, eight hours behind Malaysian time. A row stamped `2026-09-21 16:32`
   was submitted at 00:32 on 22 September.
2. ⚠️ The first two rows are **test submissions** from the build session, not real enquiries.

### What can destroy data

Only one thing: deleting `data/kfm.db`. Contracts and people can be rebuilt from
`seed-data.ts`; **contact enquiries cannot be rebuilt from anything**, and the file currently has
no backup. Copy it before any database work.
