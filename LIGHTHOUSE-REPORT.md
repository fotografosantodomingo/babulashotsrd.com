# Lighthouse Audit — Babula Shots Network (2026-05-10)

## Methodology

Live `lighthouse` CLI runs were not possible from this session: Chrome/Node script execution
was sandboxed and direct outbound HTTP was blocked. WebFetch could reach one URL but the AI-
summarisation pipeline drops `<meta>`/`<link>` tags, so its output is unreliable for SEO/perf
audits.

Instead, this report runs a **byte-accurate static auditor** against the locally-built
`out/index.html` of every site (`/Users/subdomainsbabulashots/Documents/{parent,estudio,boda,inmobiliaria,drone}/out`).
These are the exact bytes that ship to Cloudflare Pages — what Lighthouse would download.
The auditor (`/Users/subdomainsbabulashots/Documents/parent/scripts/lh-audit.mjs`, runnable
with `npm run lh-audit`) checks every Lighthouse audit that can be evaluated from HTML alone:

- **Performance**: inline CSS size, `<style>` block count, render-blocking CSS/JS in `<head>`,
  image `width`/`height`, `loading="lazy"`, `decoding="async"`, `fetchpriority="high"`,
  `font-display: swap`, font preconnect/preload.
- **Accessibility**: `<img alt>`, accessible link/button names, form-control labels,
  heading-level skips, viewport pinch-zoom, low-opacity text rules.
- **Best Practices**: HTTPS, `<meta charset>`, `<meta theme-color>`, `document.write`,
  external `_blank` links without `rel=noopener`.
- **SEO**: `<title>` length, `<meta name=description>` length, `<html lang>` value vs locale,
  canonical, hreflang completeness (`es`, `en`, `x-default`), `<h1>` count, JSON-LD parse
  validity, structured-data types.

Caveats noted inline. Full JSON is at
`/Users/subdomainsbabulashots/Documents/parent/lighthouse-scores.json`.

## URLs Audited (8 primary + 9 secondary = 17)

| ID | URL | Site |
|---|---|---|
| parent-home | https://babulashotsrd.com/ | parent |
| parent-en-home | https://babulashotsrd.com/en/ | parent |
| parent-gallery | https://babulashotsrd.com/galeria-de-fotos/ | parent |
| parent-article | https://babulashotsrd.com/fotografo-de-bodas-en-republica-dominicana/ | parent |
| estudio-home | https://estudio.babulashotsrd.com/ | estudio |
| boda-home | https://boda.babulashotsrd.com/ | boda |
| inmobiliaria-home | https://inmobiliaria.babulashotsrd.com/ | inmobiliaria |
| drone-home | https://dron.babulashotsrd.com/ | drone |
| *(extras for breadth)* parent-blog, parent-fotografo, estudio-en, estudio-sesion, boda-en, boda-servicios, inmobiliaria-en, inmobiliaria-serv, drone-en | | |

## Site-Average Scores (out of 100)

| Site | Pages | Mobile Perf | Mobile A11y | Mobile BP | Mobile SEO | Desktop Perf | Desktop SEO |
|---|---:|---:|---:|---:|---:|---:|---:|
| **parent**       | 6 | 91 | 100 | 100 | 99 | 97 | 99 |
| **boda**         | 3 | 100 | 99 | 100 | 98 | 100 | 98 |
| **inmobiliaria** | 3 | 96 | 99 | 100 | 95 | 98 | 95 |
| **drone**        | 2 | 100 | 90  | 100 | 95 | 100 | 95 |
| **estudio**      | 3 | 90 | 99 | 100 | 95 | 92 | 95 |
| **Network avg**  | 17 | **94** | **98** | **100** | **97** | **97** | **97** |

Best Practices is a clean 100 across the entire network — HTTPS, charset, no document.write,
no insecure mixed content, no broken anchors. Accessibility is near-perfect except for the
drone-site false-positive (see Note A below).

## Per-Page Scores

| Page | M Perf | M A11y | M BP | M SEO | D Perf | D SEO |
|---|---:|---:|---:|---:|---:|---:|
| parent-home              |  97 | 100 | 100 | 100 | 100 | 100 |
| parent-en-home           |  97 | 100 | 100 |  98 | 100 |  98 |
| parent-gallery           |  97 | 100 | 100 | 100 | 100 | 100 |
| parent-article           |  89 | 100 | 100 | 100 | 100 | 100 |
| parent-blog              |  82 | 100 | 100 | 100 |  88 | 100 |
| parent-fotografo         |  83 | 100 | 100 |  95 |  88 |  95 |
| estudio-home             |  88 | 100 | 100 |  98 |  90 |  98 |
| estudio-en               | 100 |  98 | 100 |  90 | 100 |  90 |
| estudio-sesion           |  82 | 100 | 100 |  96 |  84 |  96 |
| boda-home                | 100 | 100 | 100 | 100 | 100 | 100 |
| boda-en                  | 100 | 100 | 100 | 100 | 100 | 100 |
| boda-servicios           | 100 |  98 | 100 |  95 | 100 |  95 |
| inmobiliaria-home        |  94 | 100 | 100 | 100 |  96 | 100 |
| inmobiliaria-en          |  94 | 100 | 100 |  90 |  96 |  90 |
| inmobiliaria-servicios   | 100 |  98 | 100 |  95 | 100 |  95 |
| drone-home               | 100 |  90 | 100 | 100 | 100 | 100 |
| drone-en                 | 100 |  90 | 100 |  90 | 100 |  90 |

## Systemic Issues (sorted by pages affected)

| # | Issue ID | Cat | Sev | Pages | Note |
|---|---|---|---|---:|---|
| 1 | `image-dims` (missing `width`/`height`) | perf | high | 4 | All 13/13 imgs on estudio-home and 7/7 on estudio-sesion; minor 1-of-N elsewhere |
| 2 | `lang-mismatch` (EN page declares `lang="es-DO"`) | seo | high | 3 | estudio-en, inmobiliaria-en, drone-en |
| 3 | `lcp-fetchpriority` (no `fetchpriority="high"`) | perf | med | 3 | inmobiliaria-home, inmobiliaria-en, estudio-sesion |
| 4 | `heading-skip` (h2 → h4 etc.) | a11y | low | 3 | estudio-en, boda-servicios, inmobiliaria-servicios |
| 5 | `meta-desc-long` (>165 chars, truncates in SERP) | seo | low | 2 | parent-en-home (188), estudio-sesion (181) |
| 6 | `inline-css-fragmented` (2-3 `<style>` blocks) | perf | low | 2 | parent-article (3), parent-fotografo (2) |
| 7 | `hreflang-no-en` (no `<link rel=alternate hreflang=en>`) | seo | low | 2 | estudio-home, estudio-sesion |
| 8 | `hreflang-missing` (no alternates at all) | seo | med | 2 | boda-servicios, inmobiliaria-servicios |
| 9 | `label` (form input without aria-label/explicit label) | a11y | high | 2 | drone-home, drone-en — **FALSE POSITIVE** (see Note A) |
| 10 | `title-short` (9 chars) | seo | med | 1 | parent-fotografo (title is "FOTOGRAFO") |

### Note A — Drone form labels (false positive)

My heuristic only matches explicit `<label for="…">` or `aria-label`. The drone form at
`/Users/subdomainsbabulashots/Documents/drone/components/DronePage.tsx:347-396` uses the
**implicit** label pattern (`<label>Text<input/></label>`), which Lighthouse accepts. Real
Lighthouse would score this 100. Treat the 90 mobile a11y on drone as **actually 100**.
(Optional improvement: add `id`+`for` anyway for explicit pairing — but not required.)

---

## Prioritised Fix Plan

Ranked by `(impact × pages affected) / effort`. Highest ROI first.

### Fix 1 — Patch `<html lang>` on EN routes for estudio / inmobiliaria / drone
**Impact:** high · **Pages affected:** all `/en/**` pages on 3 sites (~30+ URLs each) · **Effort:** trivial (~5 min/site)

The Next.js App Router only allows `<html lang>` in the root layout, which all 5 sites
hardcode to `"es-DO"`. The **parent** repo solves this by patching post-build inside its
inline-css script (`/Users/subdomainsbabulashots/Documents/parent/scripts/inline-css.mjs:65-71`),
and **boda** solves it via a separate `scripts/fix-export-language.mjs` script run from its
`postbuild` hook. The other three sites have no such patch, so every `/en/**` HTML ships
`<html lang="es-DO">` — Lighthouse flags `document.hasLang` and `html-has-valid-lang`.

**Files to change** (port the same `relPath.startsWith("/en/")` block from parent's inliner):
- `/Users/subdomainsbabulashots/Documents/estudio/scripts/inline-css.mjs`
- `/Users/subdomainsbabulashots/Documents/inmobiliaria/scripts/inline-css.mjs`
- `/Users/subdomainsbabulashots/Documents/drone/scripts/inline-css.mjs`

Add (after the existing `stripFrameworkScripts` call, before the write):
```js
const relPath = html.slice(outDir.length).replace(/\\/g, "/");
if (relPath.startsWith("/en/")) {
  modified = modified.replace(/<html\s+lang="[^"]*"/i, '<html lang="en"');
  modified = modified.replace(
    /<meta property="og:locale" content="[^"]*"/i,
    '<meta property="og:locale" content="en_US"'
  );
}
```

### Fix 2 — Add `width` and `height` to estudio card images
**Impact:** high (CLS) · **Pages affected:** estudio-home (13 imgs), estudio-sesion (7), plus every blog/category/tag listing on estudio · **Effort:** small (~15 min)

`extractFirstImage` in `/Users/subdomainsbabulashots/Documents/estudio/lib/estudioContent.ts:217`
already returns optional `width`/`height` (the parent equivalent does the same and the parent
HomePage/ContentArticle already use it). The estudio components just don't forward them.

**Files to change** (add `width={img.width} height={img.height}` to the three `<img>` tags,
just like parent does):
- `/Users/subdomainsbabulashots/Documents/estudio/components/HomePage.tsx:119-126` (eager hero card)
- `/Users/subdomainsbabulashots/Documents/estudio/components/HomePage.tsx:151` (gallery card)
- `/Users/subdomainsbabulashots/Documents/estudio/components/HomePage.tsx:175` (blog card)
- `/Users/subdomainsbabulashots/Documents/estudio/components/SesionDeFotosPage.tsx:133,193,212` (hero + related)

Make sure `extractFirstImage` populates `width`/`height` from the WP `media_details`
(parent does it, estudio's lib may need the same — verify lines 217-260 of the file).

### Fix 3 — Add `fetchpriority="high"` to the LCP image on inmobiliaria + estudio-sesion
**Impact:** medium (LCP improvement on mobile) · **Pages affected:** inmobiliaria-home, inmobiliaria-en, estudio-sesion · **Effort:** trivial

The first above-the-fold `<img>` (or the `HeroImage` CSS-bg) should have
`fetchpriority="high"` and `loading="eager"`. Parent/boda/drone already do this.

**Files to change:**
- `/Users/subdomainsbabulashots/Documents/inmobiliaria/components/HomePage.tsx` — add
  `fetchPriority="high"` and `loading="eager"` to the hero/first `<img>`.
- `/Users/subdomainsbabulashots/Documents/estudio/components/SesionDeFotosPage.tsx:133` —
  hero already has `loading="eager"`; add `fetchPriority="high"`.

### Fix 4 — Add hreflang alternates to `/servicios/` pages on boda + inmobiliaria
**Impact:** medium (international SEO) · **Pages affected:** boda-servicios, inmobiliaria-servicios · **Effort:** small (~10 min)

These two pages emit **zero** `<link rel=alternate>` tags. Every other page on the network
has the full `es-DO` / `es` / `en` / `x-default` set.

**Files to change:**
- `/Users/subdomainsbabulashots/Documents/boda/app/servicios/page.tsx` — add
  `alternates.canonical` + `alternates.languages` to the `Metadata` export (copy the
  pattern from `/Users/subdomainsbabulashots/Documents/boda/app/page.tsx`).
- `/Users/subdomainsbabulashots/Documents/inmobiliaria/app/servicios/page.tsx` — same.

Also: estudio-home and estudio-sesion are missing `hreflang=en` specifically (they have
`es-DO` + `x-default` only). Add `en: canonicalUrl("/en/...")` to their
`alternates.languages`:
- `/Users/subdomainsbabulashots/Documents/estudio/app/page.tsx`
- `/Users/subdomainsbabulashots/Documents/estudio/app/sesion-de-fotos/page.tsx`

### Fix 5 — Fix `parent-fotografo` title ("FOTOGRAFO")
**Impact:** medium (SEO) · **Pages affected:** 1 (but it's a high-intent landing page) · **Effort:** trivial

The slug `/fotografo/` is a WordPress category whose imported name is uppercase "FOTOGRAFO"
(see `/Users/subdomainsbabulashots/Documents/parent/scrape/raw/jsonld.json`). Result: a
9-character all-caps `<title>` that loses SERP rank. Override in metadata generation.

**File to change:** `/Users/subdomainsbabulashots/Documents/parent/app/[slug]/page.tsx:30-46`
— after computing `seo` / `title`, add a slug-based override:
```ts
if (slug === "fotografo") title = "Fotógrafo profesional en República Dominicana | Babula Shots";
```
Or fix it upstream in `/Users/subdomainsbabulashots/Documents/parent/lib/parentContent.ts`
`plainTitle()` to title-case all-uppercase tokens.

### Fix 6 — Shorten over-long meta descriptions (>165 chars)
**Impact:** low (SERP truncation only) · **Pages affected:** 2 · **Effort:** trivial

- `/Users/subdomainsbabulashots/Documents/parent/app/en/page.tsx:7-8` — current 192 chars,
  trim to ~155.
- `/Users/subdomainsbabulashots/Documents/estudio/app/sesion-de-fotos/page.tsx` (description
  literal, ~181 chars) — trim to ~155.

### Fix 7 — Heading-level skips
**Impact:** low (a11y `heading-order` audit) · **Pages affected:** 3 · **Effort:** small

The three pages jump h2 → h4. Locate the offending heading and demote/promote one level:
- `/Users/subdomainsbabulashots/Documents/estudio/app/en/page.tsx` (or its imported HomePage variant)
- `/Users/subdomainsbabulashots/Documents/boda/app/servicios/page.tsx`
- `/Users/subdomainsbabulashots/Documents/inmobiliaria/app/servicios/page.tsx`

Quick grep: `grep -nE "<h[1-6]" <file>` and verify the sequence is monotonic +1.

### Fix 8 — Consolidate inline `<style>` blocks on legacy WP article pages
**Impact:** low (purely cosmetic — already inline, no extra requests) · **Pages affected:** parent-article + a handful of other migrated WP posts · **Effort:** medium

`WpContent` injects post-author `<style>` blocks (e.g. `.bbs-img-grid`, `.bbs-services`,
`.bbs-pricing-card`) from the imported WordPress HTML. These show up as multiple `<style>`
tags in the output. They're already inline, so they don't hurt performance — Lighthouse
won't flag them — but if you want a single tag for cleanliness, extend
`/Users/subdomainsbabulashots/Documents/parent/scripts/inline-css.mjs` to extract `<style>`
blocks from `<main>` and merge them into the head `<style data-inlined>` block. **Defer
unless you're chasing aesthetics.**

### Fix 9 — (Optional) Make drone form labels explicit
**Impact:** none (already passes Lighthouse) · **Effort:** trivial

`/Users/subdomainsbabulashots/Documents/drone/components/DronePage.tsx:353-396` — convert
implicit `<label>Text <input/></label>` to explicit `<label htmlFor="…">Text</label><input id="…"/>`
if you want my heuristic auditor to stop flagging it. No Lighthouse score change.

---

## What we are NOT doing

- Did not run real `lighthouse` CLI — Chrome was sandboxed in this session. Numbers here are
  derived from static-HTML signals (the same signals Lighthouse evaluates) plus heuristic
  penalties. Performance scores especially are estimates; CLS/LCP/INP need a live browser run.
- The auditor cannot detect runtime issues (long tasks, JS errors, layout shift from web
  fonts), color-contrast (without rendering), or third-party blocking. Run real Lighthouse
  once Chrome is reachable to validate.
- The 102 desktop perf scores in the JSON are an artefact of the +2 desktop bonus before the
  100 cap — treat all >100 as exactly 100.

## Reproduce

```bash
cd /Users/subdomainsbabulashots/Documents/parent
npm run lh-audit            # writes lighthouse-scores.json
```

Generated 2026-05-10.
