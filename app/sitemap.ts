import type { MetadataRoute } from "next";
import { categories, pages, posts, tags } from "@/lib/parentContent";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: canonicalUrl("/blog/"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: canonicalUrl("/en/"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    // Static routes that don't have a WP-scrape counterpart — must be listed
    // explicitly or they're invisible to search engines despite being live.
    // (/galeria-de-fotos/ and /contacto/ are also static-overridden but the
    // WP scrape already contains pages with those slugs, so the loop below
    // emits them — no explicit entry needed.)
    { url: canonicalUrl("/sobre/"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: canonicalUrl("/en/about-michal-babula/"), lastModified: now, changeFrequency: "yearly", priority: 0.6 }
  ];
  const RESERVED = new Set(["blog", "category", "tag", "en"]);
  for (const p of pages) {
    if (RESERVED.has(p.slug)) continue;
    entries.push({
      url: canonicalUrl(`/${p.slug}/`),
      lastModified: new Date(p.modified),
      changeFrequency: "monthly",
      priority: 0.7
    });
  }
  for (const p of posts) {
    entries.push({
      url: canonicalUrl(`/${p.slug}/`),
      lastModified: new Date(p.modified),
      changeFrequency: "weekly",
      priority: 0.7
    });
  }
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
  return entries;
}
