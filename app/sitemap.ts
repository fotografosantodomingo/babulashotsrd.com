import type { MetadataRoute } from "next";
import { categories, pages, posts, tags } from "@/lib/parentContent";
import { canonicalUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: canonicalUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: canonicalUrl("/blog/"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: canonicalUrl("/en/"), lastModified: now, changeFrequency: "weekly", priority: 0.9 }
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
