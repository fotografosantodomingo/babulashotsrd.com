import type { MetadataRoute } from "next";
import { EN_CONTENT } from "@/lib/enContent";
import { allLanguageRoutePairs } from "@/lib/languageRoutes";
import { categories, pages, posts, tags } from "@/lib/parentContent";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── 1. Static bilingual route pairs (from languageRoutes.ts) ────────────
  // Covers /, /servicios/, /ubicaciones/, /precios/, /faq/ plus their /en/ mirrors.
  const pairs = allLanguageRoutePairs();
  const pairedEsPaths = new Set(pairs.map((p) => p.es));

  for (const { es, en } of pairs) {
    entries.push({
      url: canonicalUrl(es),
      lastModified: now,
      changeFrequency: "weekly",
      priority: es === "/" ? 1 : 0.8,
      alternates: {
        languages: {
          "es-DO": canonicalUrl(es),
          "es": canonicalUrl(es),
          "en": canonicalUrl(en),
          "x-default": canonicalUrl(es)
        }
      }
    });
    entries.push({
      url: canonicalUrl(en),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          "es-DO": canonicalUrl(es),
          "es": canonicalUrl(es),
          "en": canonicalUrl(en),
          "x-default": canonicalUrl(es)
        }
      }
    });
  }

  // ── 2. About page pair (not in languageRoutes routePairs) ────────────────
  entries.push({
    url: canonicalUrl("/sobre/"),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
    alternates: {
      languages: {
        "es-DO": canonicalUrl("/sobre/"),
        "es": canonicalUrl("/sobre/"),
        "en": canonicalUrl("/en/about-michal-babula/"),
        "x-default": canonicalUrl("/sobre/")
      }
    }
  });
  entries.push({
    url: canonicalUrl("/en/about-michal-babula/"),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
    alternates: {
      languages: {
        "es-DO": canonicalUrl("/sobre/"),
        "es": canonicalUrl("/sobre/"),
        "en": canonicalUrl("/en/about-michal-babula/"),
        "x-default": canonicalUrl("/sobre/")
      }
    }
  });

  // ── 3. WP-scraped pages (Spanish-only, unless covered by EN_CONTENT) ─────
  // Pages in EN_CONTENT get their hreflang handled in step 4 below.
  const RESERVED = new Set(["blog", "category", "tag", "en"]);
  const enContentKeys = new Set(Object.keys(EN_CONTENT));

  for (const p of pages) {
    if (RESERVED.has(p.slug)) continue;
    const esPath = `/${p.slug}/`;
    if (pairedEsPaths.has(esPath)) continue; // covered by pairs
    if (enContentKeys.has(esPath)) continue; // covered by EN_CONTENT loop below
    entries.push({
      url: canonicalUrl(esPath),
      lastModified: new Date(p.modified),
      changeFrequency: "monthly",
      priority: 0.7
    });
  }

  // ── 4. WP-scraped posts (Spanish-only, unless covered by EN_CONTENT) ─────
  for (const p of posts) {
    const esPath = `/${p.slug}/`;
    if (pairedEsPaths.has(esPath)) continue;
    if (enContentKeys.has(esPath)) continue; // covered below
    entries.push({
      url: canonicalUrl(esPath),
      lastModified: new Date(p.modified),
      changeFrequency: "weekly",
      priority: 0.7
    });
  }

  // ── 5. Category + tag archives (Spanish-only) ───────────────────────────
  for (const c of categories) {
    entries.push({
      url: canonicalUrl(`/category/${c.slug}/`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5
    });
  }
  for (const t of tags) {
    entries.push({
      url: canonicalUrl(`/tag/${t.slug}/`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4
    });
  }

  // ── 6. EN_CONTENT bilingual pairs ────────────────────────────────────────
  // Each EN_CONTENT entry pairs a WP-scraped ES slug with a generated EN page.
  // Emit both URLs with xhtml:link alternates so Google indexes the pair.
  for (const en of Object.values(EN_CONTENT)) {
    entries.push({
      url: canonicalUrl(en.esPath),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "es-DO": canonicalUrl(en.esPath),
          "es": canonicalUrl(en.esPath),
          "en": canonicalUrl(en.enPath),
          "x-default": canonicalUrl(en.esPath)
        }
      }
    });
    entries.push({
      url: canonicalUrl(en.enPath),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          "es-DO": canonicalUrl(en.esPath),
          "es": canonicalUrl(en.esPath),
          "en": canonicalUrl(en.enPath),
          "x-default": canonicalUrl(en.esPath)
        }
      }
    });
  }

  // ── 7. Blog index (Spanish-only for now) ─────────────────────────────────
  entries.push({
    url: canonicalUrl("/blog/"),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  });

  return entries;
}
