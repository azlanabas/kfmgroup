---
title: website / media — the master image library
folder: KFM_GROUP/website/media
type: folder-index
client: KFM Group
status: master copy — edit here
tags:
  - client/kfm-group
  - website
  - media
  - images
updated: 2026-09-24
---

# website / media — the master image library

> ### ✅ THIS IS THE MASTER COPY. Add and edit images **here**.
> `frontend/public/media/` is a **generated mirror** — wiped and rebuilt on every `dev` and
> `build`, and gitignored. Anything you put there will be deleted.

**Parent:** [[KFM_GROUP/website/website|website]]
**22 images in 3 folders.** Lives at the project root by **owner decision #14** — Next can only
serve `public/`, so `frontend/scripts/sync-media.mjs` mirrors this folder on `predev`/`prebuild`.

---

## Why these files are here at all

**Decision #13: the app is self-contained.** All 22 images were pulled off the live
`kfmgroup.my` WordPress site into the repo. **Nothing is fetched from the live site at
runtime.**

## `brand/` — 1 file

| File | |
|---|---|
| `kfm-logo.png` | The company mark. |

## `photos/` — 14 files

Site and operations photography, named by where each is used:

| File | Used on |
|---|---|
| `hero-technicians.jpeg` | home hero |
| `about-team.jpeg`, `about-team-site.jpeg`, `about-contract-operation.jpeg` | `/about` |
| `work-services.jpeg`, `work-site-team.jpeg` | `/work` |
| `tech-technicians.jpeg`, `tech-energy-plant.jpeg` | `/tech` |
| `careers-crew.jpeg` | `/careers` |
| `plant-room.jpeg`, `commercial-building.jpeg` | general facilities |
| **`clinic-penang.jpeg`** | the **Harta PSK** clinics — see [[KFM_GROUP/gap_analysis/gap_analysis\|gap_analysis]] |
| **`istana-melawati.jpeg`** | the **Istana Melawati** contract — see [[KFM_GROUP/im_jkr_template/im_jkr_template\|im_jkr_template]] |
| **`terminal-gombak.jpeg`** | **Terminal Bersepadu Gombak** — see [[KFM_GROUP/tbg-cmms/tbg-cmms\|tbg-cmms]] |

*Route attribution above is inferred from the filenames; it was not traced through the
components. **UNVERIFIED** for any row.* The **last three are not inferred** — they name the
three sites that have their own workstreams in this tree, which is the one place this website
folder touches the rest of `KFM_GROUP/`.

## `portraits/` — 7 files

One per person in the `people` table (**8 rows seeded**, so ⚠️ **one person has no portrait
file here** — which, and whether `photo_url` is null for them, is **UNVERIFIED**):

`aznul-abdullah.png` · `fardan-abdul-majeed.png` · `meor-safuan-aiman.png` ·
`nasharullizam-kharay.jpeg` · `ramli-ishak.png` · `shahridan-sharif.jpeg` ·
`yusro-khamuna.png`

⚠️ Mixed formats — 5 `.png`, 2 `.jpeg`. `photo_url` in the `people` table carries the extension,
so renaming a file breaks a row.

## Adding an image

1. Drop it in the right subfolder **here**.
2. `npm run sync:media` from `frontend/` (or just run `dev`/`build` — `predev`/`prebuild` do it).
3. Reference it as `/media/<folder>/<file>` — the mirror is served from `public/`.
4. If it is a person or a contract, update the **seed data**, not a component (decision #16).

## Related notes

- [[KFM_GROUP/website/frontend/frontend|frontend]] — the mirror and `sync-media.mjs`
- [[KFM_GROUP/website/data/data|data]] — `people.photo_url`, `contracts.image_url`
- [[KFM_GROUP/website/website|website]] — decisions #13 and #14
- [[KFM_GROUP/KFM_GROUP|KFM_GROUP]] — the three sites photographed here each have their own workstream

*File names and counts read off disk 2026-09-24; decisions #13/#14/#16 quoted from the parent
README (2026-09-22). **No image was opened and no component was traced.***
