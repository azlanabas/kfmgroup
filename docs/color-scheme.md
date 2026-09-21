# Colour scheme

*Status: as-built. Values lifted verbatim from the Broadsheet design system inside
`KFM Group.html`; the computed colours were read back from the browser on 2026-09-22.*

Active palette: **CMYK press inks on paper**. There is one palette — the artifact shipped no
alternative and no dark theme.

## 1. The idea

This is a print palette, not a screen palette. The three process inks are real: cyan and magenta
are the brand accents, and a muted process yellow completes the set so the plate treatments have
a full four-colour separation to work with. There is no black ink — every dark core on the page
is the C×M×Y multiply overlap.

That is why the accents are used the way they are: **cyan is the interface accent**, magenta and
yellow are almost entirely print-treatment colours.

## 2. Core

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#f3f2f2` | the paper. Page ground, and the white inside the plate constructions |
| `--color-surface` | `#eae9e9` | form fields, cards |
| `--color-text` | `#201e1d` | body ink — a warm near-black, not `#000` |
| `--color-accent` | `#0088b0` | **cyan plate** and the interface accent |
| `--color-accent-2` | `#d6006c` | **magenta plate**; as an interface colour only for link hover and error text |
| `--color-process-yellow` | `#edbb00` | **yellow plate** — print treatment only. Body copy and chrome never take it |
| `--color-divider` | `color-mix(in srgb, #201e1d 16%, transparent)` | hairlines |

Verified in the browser: the three plate spans compute to `rgb(0,136,176)`, `rgb(214,0,108)` and
`rgb(237,187,0)` with `mix-blend-mode: multiply`.

## 3. Ramps

Nine steps each, generated in OKLCH on one shared lightness scale — so step 400 of any ramp
matches step 400 of the others in visual value.

| Step | neutral | accent (cyan) | accent-2 (magenta) |
|---|---|---|---|
| 100 | `#f8f4f4` | `#e9f8ff` | `#fff1f4` |
| 200 | `#eae7e7` | `#cbeeff` | `#ffdee6` |
| 300 | `#d7d3d3` | `#99e0ff` | `#ffc0d0` |
| 400 | `#bab6b6` | `#62c5ee` | `#ff90b1` |
| 500 | `#9b9797` | `#38a6cf` | `#ff458e` |
| 600 | `#7d7979` | `#1186ac` | `#d82071` |
| 700 | `#605d5d` | `#006786` | `#aa0b56` |
| 800 | `#444141` | `#004961` | `#790e3d` |
| 900 | `#2d2b2b` | `#0a303e` | `#4b1528` |

**`--color-accent-700` (`#006786`) does most of the visible work** — every kicker that is not
muted, every role line on the People page, the RM figures, and the default link colour. The raw
`--color-accent` is reserved for the cyan plate, `.btn-primary` and focus rings, where it sits on
a fill rather than on paper.

## 4. Ink opacities

The artifact expressed muted text as `color-mix(in srgb, var(--color-text) N%, transparent)`.
In Tailwind v4 that is the opacity modifier — `text-text/82`. The steps in use:

| Utility | Where |
|---|---|
| `text-text/84` | About page body copy |
| `text-text/82` | standard body copy, sector summaries, footer statement |
| `text-text/80` | secondary body copy |
| `text-text/78` | card and value-proposition bodies |
| `text-text/75` · `/72` · `/70` | card notes, capability bodies, kickers and menu descriptions |
| `text-text/62` | definition-list labels |
| `border-text/14` · `/16` · `/18` | the masthead rule, dividers, footer rule |
| `border-text/45` | the dotted leader on the home fact rule |

## 5. Elevation

Ink-tinted rather than neutral grey, derived from `--color-neutral-900`:

| Token | Value |
|---|---|
| `--shadow-sm` | `0 1px 2px color-mix(in srgb, #2d2b2b 14%, transparent)` |
| `--shadow-md` | `0 3px 10px color-mix(in srgb, #2d2b2b 16%, transparent)` |
| `--shadow-lg` | `0 12px 32px color-mix(in srgb, #2d2b2b 22%, transparent)` |

`--shadow-lg` carries the nav hover panels; `--shadow-md` the back-to-top button.

## 6. Contrast — measured by the system's author, not re-measured here

*Epistemic note: these figures are the Broadsheet system's own comments, carried over. They have
**not** been independently re-measured in this port.*

- `.input::placeholder` at 65% ink on `--color-surface` measures **4.8:1** — the browser default
  grey misses the 4.5:1 small-text bar there. `opacity: 1` is set explicitly to override
  Firefox's default placeholder fade.
- Body text `#201e1d` on `#f3f2f2` is far above 4.5:1.

⏳ The muted steps at `/62` and below on small type have not been checked against WCAG AA in this
port. Worth an audit before launch — see [`audits/`](audits/).

## 7. Changing the palette

Every colour is a `@theme` token in `frontend/src/app/globals.css`. Editing one value there
changes every utility and every component class that derives from it, because nothing hardcodes a
hex outside that block — with one deliberate exception: the **SVG filter matrices** in
`PrintPlates.tsx` and `pressDriver.ts` encode the ink values numerically
(`0.467`, `0.533`, …). Those are a colour *separation*, not a palette, and recolouring the brand
would mean recomputing them. See [`design_doc_frontend.md` §3](design_doc_frontend.md#3-the-14-component-classes--why-they-are-not-utilities).
