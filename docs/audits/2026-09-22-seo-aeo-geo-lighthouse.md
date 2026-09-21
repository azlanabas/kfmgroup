# Audit — SEO / AEO / GEO + Lighthouse — 2026-09-22

*Status: measured. Every score below came from Lighthouse 13.4.1 driving headless Chrome against
the **production build** (`npm run build && npm start`) on this Mac, with Lighthouse's default
mobile throttling. Not estimated.*

Scope requested: serve WebP, all Lighthouse categories above 90, no horizontal scroll on mobile,
add sitemap / robots / llms.txt, and audit for SEO, AEO and GEO.

---

## 1. Lighthouse — all 8 routes, all 4 categories

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---|---|---|
| `/` | 91 | 95 | 100 | 100 | 3.5 s | 0.001 | 0 ms |
| `/about` | 93 | 96 | 100 | 100 | 3.2 s | 0.027 | 0 ms |
| `/work` | 92 | 95 | 100 | 100 | 3.4 s | 0 | 0 ms |
| `/tech` | 98 | 95 | 100 | 100 | 2.3 s | 0.047 | 0 ms |
| `/sectors` | 97 | 96 | 100 | 100 | 2.6 s | 0 | 0 ms |
| `/people` | 93 | 95 | 100 | 100 | 3.2 s | 0 | 0 ms |
| `/careers` | 98 | **96** | 100 | 100 | 2.3 s | 0.001 | 0 ms |
| `/contact` | 98 | 96 | 100 | 100 | 2.3 s | 0 | 0 ms |

✅ **32 of 32 scores are ≥ 90.** Lowest: `/` Performance 91.

`/careers` Accessibility was 92 on the first pass and is 96 after the `link-in-text-block` fix
below; the other seven were re-measured before that change and are unaffected by it.

**Total Blocking Time is 0 ms on every route** and CLS is at or near zero — the layout is
prerendered and the fonts are subset and locally served, so nothing shifts.

## 2. What was changed to get there

| Change | File | Effect |
|---|---|---|
| `<img>` → `next/image` throughout | `Figures.tsx`, `SiteNav.tsx` | AVIF/WebP negotiation, `srcset`, lazy-loading below the fold |
| `priority` on the three above-the-fold lead figures | `Hero`, `AboutIntro`, `work/page` | LCP image is no longer lazy |
| `formats: ['image/avif','image/webp']` | `next.config.ts` | AVIF preferred, WebP fallback |
| `minimumCacheTTL: 31536000` + immutable font headers | `next.config.ts` | repeat visits skip re-optimisation |
| `force-dynamic` → `revalidate = 3600` on 3 routes | `page.tsx` ×3, `lib/api.ts` | the API left the critical path; **all 14 routes now prerender** |
| inline links underlined | `globals.css` | fixes `link-in-text-block` |
| skip-to-content link, `id="main"` | `layout.tsx`, all 8 pages | keyboard navigation |
| `maximumScale: 5` | `layout.tsx` | page stays pinch-zoomable |

### WebP is confirmed served, not assumed

Measured with the `Accept` header a real browser sends:

```
/_next/image?url=%2Fmedia%2Fphotos%2Fhero-technicians.jpeg&w=640&q=75
  Accept: image/avif,image/webp,…  →  Content-Type: image/webp   47,356 bytes
  Accept: */*                      →  Content-Type: image/jpeg   56,947 bytes
  original file on disk                                         121,748 bytes
```

⚠️ A `fetch()` from page JavaScript sends `Accept: */*` and therefore returns JPEG. That is the
optimizer behaving correctly, not a failure — an early check here reported "WebP not working"
for exactly that reason.

## 3. Mobile — no horizontal scrolling

8 routes × 3 widths (360, 390, 414 px) = **24 combinations, 0 with page-level horizontal
overflow.** Verified twice: once on `scrollWidth`, and again on element geometry, because
`html { overflow-x: hidden }` in `globals.css` clamps `scrollWidth` and can hide a real overflow.

One element legitimately exceeds the viewport:

| Route | Element | Behaviour |
|---|---|---|
| `/sectors` | `table.table.min-w-[600px]` | Contained by a `div.overflow-x-auto` — wrapper clientWidth 320, scrollWidth 600. The **table** scrolls inside its own box; the **page** does not. |

That is the artifact's own markup and the standard accessible pattern for a 4-column data table
on a phone. ⏳ If you would rather it reflowed into stacked cards below 820 px, that is a design
change and needs a decision.

## 4. SEO

All 8 routes score **100**. In place:

- Per-page `<title>` via a `%s — KFM Group Sdn Bhd` template, and a per-page description.
- **Canonical URL on every route**, absolute, from `siteConfig.url` (`https://kfmgroup.my`).
- `metadataBase` so every relative OG/canonical URL resolves absolutely.
- Open Graph + Twitter card metadata.
- `lang="en-MY"`.
- `robots` directives incl. `max-image-preview: large` and `max-snippet: -1`.
- `/sitemap.xml` — 8 URLs with `changefreq` and `priority`, generated from `src/lib/routes.ts`.
- `/robots.txt` — allows all, disallows `/api/`, declares the sitemap and host.
- Descriptive `alt` text on all 22 images.

`src/lib/routes.ts` is the single source for the nav, the sitemap and llms.txt, so **a new page
cannot be added and forgotten by the sitemap**.

## 5. AEO / GEO — being citable by answer engines

This is the part that is not measured by Lighthouse.

### Crawler access

`/robots.txt` **explicitly allows** GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User,
Claude-SearchBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended,
meta-externalagent and CCBot. Blocking these is the single most common reason a site never
appears in an AI answer. ⏳ **This is a client decision** — flip any to `disallow` if KFM would
rather not be used as citation or training material.

### `/llms.txt`

Follows the llmstxt.org convention. A plain-text brief carrying the facts most likely to be
asked, as flat quotable lines rather than buried in prose: legal name, former name, SSM
registration, incorporation date, CIDB grade, certifications, offices, contact, the four service
lines, every live and completed contract with client and term, the leadership list, and a page
index. Generated from the live database, so it cannot drift from the site.

It obeys `showContractValues` — turning that flag off removes the figures here too, so the flag
cannot be bypassed by reading this file.

### Structured data

One `@graph` per page, server-rendered into the HTML (several AI crawlers do not execute
JavaScript, so client-side injection would be invisible to them):

| Node | Where | Purpose |
|---|---|---|
| `Organization` | every page | The canonical entity, `@id` = `https://kfmgroup.my/#organization`. Carries logo, contact, founding date, all three addresses, `areaServed`, `knowsAbout`, SSM registration and CIDB grade as `identifier`, and an `OfferCatalog` of the four service lines |
| `WebSite` | every page | Site as an entity, `publisher` → the Organization |
| `WebPage` + `BreadcrumbList` | every page | Page identity and position |
| `Person` ×8 | `/people` | Each director/manager, `worksFor` → the Organization |
| `Project` ×3 | `/sectors` | Live contracts with `startDate`/`endDate`, `agent` → the Organization, `customer` → the client |

Every node references the one `ORG_ID`, so "who manages Terminal Bersepadu Gombak" resolves to
the **company entity** rather than to a page that happens to mention it. Nothing is asserted in
structured data that is not also visible on the page.

⚠️ Contract **values are deliberately omitted** from the `Project` nodes. The figures are on the
page and in llms.txt when the flag is on, but publishing them as machine-readable `price` would
invite an answer engine to state KFM's contract values as a fact about the company.

## 6. Open items — ⏳

1. ⏳ **`.btn-primary` fails WCAG AA.** Measured **3.65:1** (`#f3f2f2` on `--color-accent`
   `#0088b0`) against the 4.5:1 requirement for its 14 px text. `--color-accent-700` (`#006786`)
   would give **5.72:1** and is already in the palette. **Not changed** — it darkens the primary
   CTA on every page, which is a brand decision. This is the only reason Accessibility is 95–96
   rather than 100.
2. **The yellow plate measures 1.61:1** and is reported by the same audit. This is inherent to
   the CMYK system: `.plate-y` is an `aria-hidden` colour separation that is never read alone —
   it multiplies with the C and M plates to produce the dark composite. Not a defect; do not
   "fix" it by changing the plate ink.
3. ⏳ **`siteConfig.url` is `https://kfmgroup.my`** (owner decision, 2026-09-22) — the client's
   existing live WordPress site. Every canonical, sitemap entry and JSON-LD `@id` points there.
   **If this app is deployed anywhere else first, set `NEXT_PUBLIC_SITE_URL`** or the canonicals
   will point search engines at the old site.
4. ⏳ **LCP is 3.2–3.5 s on the four image-led routes.** Under Lighthouse's simulated mobile
   throttling against a local server; a real CDN would improve it. The remaining cost is the
   hero photograph itself, and the CMYK filter chain that has to composite before paint.
5. ⏳ No Open Graph *image* beyond the logo — a social share shows a 902×236 logo, not a
   photograph. A purpose-made 1200×630 OG image would improve link previews.
6. ⏳ No `FAQPage` schema. The strongest remaining AEO lever: answer engines cite FAQ markup
   heavily, and this site has no question-shaped content to attach it to. Would need new copy.
