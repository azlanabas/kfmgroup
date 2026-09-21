# Frontend design

*Status: as-built, verified in a real browser on 2026-09-22.*
Decisions cited here live in [`README.md` §2](README.md#2-decisions-log).

**Read §3 before touching any CSS.** Most of this design system cannot be expressed as Tailwind
utilities, and the reason is structural, not stylistic.

## 1. The port, by the numbers

Counted on the decoded artifact template, then converted:

| Construct | Count | Became |
|---|---|---|
| `style="…"` inline | 427 | Tailwind utilities |
| `class="…"` | 99 (14 distinct) | the same 14 classes, kept as CSS |
| `<sc-if value="{{ x }}">` | 19 | `{x && (…)}` |
| `sc-camel-on-click` / `-mouse-enter` / `-mouse-leave` | 31 | `onClick` / `onMouseEnter` / `onMouseLeave` |
| `{{ expr }}` | 70 | `{expr}` — 19 were editor hints (`{{ true }}` / `{{ false }}`), dropped |
| `<sc-raw-table\|tr\|td\|th\|thead\|tbody>` | 28 | plain `table` / `tr` / `td` / … |
| `data-reveal` | 70 | one `useReveal()` hook |
| `hint-placeholder-val="…"` | 19 | dropped — editor-only |

Verified complete: `grep -rn "sc-if\|sc-camel\|hint-placeholder\|sc-raw" frontend/src` returns
nothing but one comment mentioning `<sc-raw-table>` by name.

## 2. Tokens — Tailwind v4 `@theme`

`src/app/globals.css`. Roughly 50 custom properties from the artifact's Broadsheet system lift
almost verbatim, which is why v4's CSS-first `@theme` suits this port: each one becomes a
utility automatically.

| Namespace | Tokens | Utilities generated |
|---|---|---|
| `--color-*` | `bg` `surface` `text` `accent` `accent-2` `divider` `process-yellow`, plus 9-step `neutral` / `accent` / `accent-2` ramps | `bg-bg`, `text-accent-700`, `border-divider`, … |
| `--font-*` | `heading` `body` — both *Source Serif 4* | `font-heading`, `font-body` |
| `--radius-*` | `sm 1px` `md 2px` `lg 4px` | `rounded-sm/md/lg` |
| `--shadow-*` | `sm` `md` `lg`, ink-tinted | `shadow-sm/md/lg` |
| `--animate-*` | `kfm-rise` `kfm-press` `kfm-draw` + their keyframes | `animate-kfm-rise`, … |

Deliberately **not** in `@theme`, kept in `:root`:

- `--edge: clamp(20px,5vw,72px)` — the page gutter, used as `px-[var(--edge)]`.
- `--space-1…8` — referenced by the component classes. Putting them in Tailwind's `--spacing`
  namespace would have collided with its numeric scale, which the 427 converted inline styles
  rely on.
- `--font-heading-weight: 600`.

**Opacity modifiers replace `color-mix`.** The artifact wrote
`color-mix(in srgb, var(--color-text) 82%, transparent)` 40-odd times; that is `text-text/82`
here. Same result, far shorter.

Verified in the compiled CSS: `text-accent-700`, `.bg-bg`, `text-text\/82`, `animate-kfm-press`,
`cmyk-head`, the font URLs and `--press-nx` are all present in
`.next/static/chunks/*.css`.

## 3. The 14 component classes — why they are NOT utilities

`.plate` ×33 · `.plate-c/-m/-y` ×11 each · `.halftone` ×17 · `.paper` ×11 · `.cmyk*` · `.btn*` ·
`.print` · `.nav*` · `.table`.

This is a **CMYK print-plate design system**: layered colour separations built from
pseudo-elements, `mix-blend-mode: multiply`, SVG `filter: url(#…)` references, and a
JS-published `--press-nx` / `--press-ny`. Pseudo-elements alone put it out of reach of utility
classes. They stay in `@layer components` in `globals.css` — decision #18.

### `.halftone`

Desaturates and boosts contrast, then multiplies a 3px radial-gradient dot screen over the image
through `::after`. Used for every photograph that is not a separation.

### `.cmyk` + `.print` — the four-colour separation

```html
<figure class="cmyk">
  <div class="print"><img src="/media/photos/…"></div>
</figure>
```

`.print` carries `filter: url(#sep-all)`, the compound filter in `PrintPlates.tsx`. It extracts
four plates from the source, clips each to the source's own silhouette
(`feComposite operator="in"` against `SourceAlpha`), offsets them by the registered
misregistration (C 0,0 / M 5,3 / Y −5,−3 / K 3,6) and multiplies them together.

⚠️ **The two sizer rules are scoped to direct children** — `.cmyk > img:first-child` and
`.cmyk > img + img`. The artifact wrote them as descendant selectors because its single-image
path used a custom `<image-slot>` element, so a nested `<img>` could never match. Our
`PrintFigure` nests a real `<img>` inside `.print`; unscoped, `.cmyk img:first-child { opacity: 0 }`
hid the photograph outright. Caught in the browser, 2026-09-22 — a `curl` check cannot see it.

### `.cmyk-num` and `.cmyk-head` — the text plates

Both use the same construction: a `.paper` span carrying the real text (and painting the white of
the sheet behind, via offset `text-shadow` copies), then three `aria-hidden` `.plate` repeats in
C, M and Y at `mix-blend-mode: multiply`. **There is no black plate** — the dark core is the
C×M×Y overlap, and the fringes are the registration drift.

`.cmyk-head` runs at **half** `.cmyk-num`'s offsets: the serif's display hairlines are thinner
than the numeral strokes the spread was measured on, and full offsets swallow them.

The C plate holds still; M and Y lean toward the pointer:

```css
translate: calc(0.018em + 0.009em * var(--press-nx, 0))
           calc(0.0125em + 0.006em * var(--press-ny, 0));
```

With the driver absent the variables are unset, `var(…, 0)` supplies 0, and the plates sit at
their resting offsets. Nothing breaks.

Both are wrapped as `<PlateNumeral>` / `<PlateHeadline>` in `PlateText.tsx` so no page repeats
the four-span markup.

### The press driver

`pressDriver.ts`, ported from the artifact's `print-plates.js` — which the plan believed was
missing and is not (see [`README.md` §2](README.md#2-decisions-log), corrections table).

Hovering a `.cmyk .print` eases the plates into register over 450 ms **while** lerping each
`feColorMatrix` from its brand separation (INK) to the pure-process factorization (TRUE), chosen
because those four plates multiply back to `SourceGraphic` exactly:
`(R,1,1)·(1,G,1)·(1,1,B)·(1,1,1) = (R,G,B)`. So the converged merge *is* the photograph, by
algebra — nothing is swapped in at the end, and there is no brightness pop.

Pointer position is published on `:root` as `--press-nx` / `--press-ny` (−1..1) for the text
plates. Every write is guarded on its **computed output**, not its inputs: an equal-value
`setAttribute` still dirties an SVG filter, and at full register the offsets are `0.00` whatever
the lean.

The driver stands down entirely under `prefers-reduced-motion: reduce` or without
`(hover: hover) and (pointer: fine)`; `globals.css` carries the matching media-gated
`:hover { filter: none }` fallback.

Verified 2026-09-22: `--press-nx` went from unset to `0.405` on a synthetic `pointermove`.

## 4. Shell

`src/app/layout.tsx` renders `SiteNav` · `{children}` · `BackToTop` · `SiteFooter`, then
`<Reveal />` and `<PrintPlates />` outside that tree so a route change cannot strand the filter
references.

`data-still` is set on the wrapper when `siteConfig.motion === "Restrained"`; the CSS reads it to
hold every reveal visible. That is the artifact's `motion` editor prop.

### `useReveal()` — two faults worth remembering

Both were found in the browser, both were invisible to `curl`:

1. **Streaming.** The hook lives in the layout, so its effect runs when the *shell* commits. The
   `force-dynamic` pages stream their content in afterwards, and a `pathname` dependency never
   sees that — the first implementation armed **0 of 19** elements. A `MutationObserver` on
   `document.body`, coalesced to one pass per frame, re-arms whatever arrives.
2. **StrictMode.** `data-armed` was doing double duty as a CSS hook *and* a record of "already
   observed". Run 1 armed 19 elements and its cleanup disconnected that observer; run 2 then
   skipped all 19 as already-armed, leaving the **live** observer with zero targets and nothing
   ever revealing. `data-armed` is now a CSS hook only; `arm()` re-observes anything without
   `data-in`, and cleanup clears `data-armed` so a genuine unmount cannot strand content at
   `opacity: 0`.

The artifact's 1.5 s failsafe is kept verbatim: if nothing has revealed by then, show everything.

Verified: reveal count went 1 → 10 → 15 → 19 as the page was scrolled, ending with 0 elements at
`opacity: 0`.

## 5. Typography

*Source Serif 4* for both heading and body — one family, weight 600 for headings, 400 for text.

18 `@font-face` rules in `src/app/fonts.css`, generated from the artifact so the
`unicode-range` values are exact, pointing at 12 files in `public/fonts/`: 6 woff2 subsets
(roman, declared at both 400 and 600) and 6 woff (italic 400). Subsets: latin, latin-ext,
cyrillic, cyrillic-ext, greek, vietnamese.

**Why not `next/font/local`** (decision #17): it has no `unicode-range` field, so it cannot
express the per-script subsets, and it would serve from `/_next/static/media/` rather than
`/fonts/`. Verified: all faces reach `status: "loaded"` in the browser.

## 6. Responsive behaviour

The artifact reflowed by matching on inline style attributes
(`main [style*="repeat(4"]`) — impossible now those are utilities. The breakpoints are expressed
on the elements instead, at the artifact's own values rather than Tailwind's defaults:

| Pattern | Utilities |
|---|---|
| 4-up grid | `grid-cols-1 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-4` |
| 3-up grid | `grid-cols-1 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3` |
| 2-up / asymmetric split | `grid-cols-1 min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]` |

Three rules still need CSS, because they target the component classes rather than a grid:
nav gap and font-size under 1000px, `.nav-brand` under 560px, and `main figure { max-width: 560px }`
under 820px. `figure.cmyk` switches from `overflow: hidden` to `visible` at 821px so the plate
overhang reads on desktop without widening the document on a phone.

## 7. Component inventory

| Component | Kind | Purpose |
|---|---|---|
| `SiteNav` | client | masthead, active link, two hover panels |
| `SiteFooter` | server | statement + three-column colophon |
| `BackToTop` | client | appears past 600 px, smooth scroll |
| `Reveal` | client | hosts `useReveal()`, renders null |
| `PrintPlates` | client | the 5 SVG filters + starts the press driver |
| `PlateNumeral` / `PlateHeadline` | server | the text-plate constructions |
| `PrintFigure` / `HalftoneFigure` | server | the two photographic treatments |
| `Kicker` | server | uppercase section label, muted or accent |

Plain `<img>` throughout, not `next/image`: the images are local and already sized for their
slots, and the CMYK filter chain operates on the element itself.

Sections live under `src/components/sections/<page>/` so no page file approaches the 500-line
limit — the largest component is 184 lines. See [`fileStructure.md`](fileStructure.md).
