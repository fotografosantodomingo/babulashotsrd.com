import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd(), "scrape");
const ORIGIN = "https://babulashotsrd.com";

const QUOTE_SLUGS = new Set(["cotizacion-98-2024", "cotizacion-99-2024", "quotations-cart"]);

type WpRendered = { rendered: string };

type WpPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  type: "post" | "page" | string;
  link: string;
  title: WpRendered;
  content: WpRendered;
  excerpt: WpRendered;
  author: number;
  featured_media: number;
  categories?: number[];
  tags?: number[];
  parent?: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: { width: number; height: number; sizes?: Record<string, { source_url: string; width: number; height: number }> };
    }>;
    "wp:term"?: Array<Array<{ id: number; slug: string; name: string; taxonomy: string }>>;
  };
};

type WpTerm = {
  id: number;
  count: number;
  slug: string;
  name: string;
  description: string;
  link: string;
  taxonomy: "category" | "post_tag";
};

type Seo = {
  status?: number;
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: string | null;
  locale?: string | null;
  h1?: string | null;
};

function load<T>(file: string): T {
  return JSON.parse(readFileSync(resolve(ROOT, file), "utf8"));
}

const rawPosts = load<WpPost[]>("raw/posts.json");
const rawPages = load<WpPost[]>("raw/pages.json");
const rawCategories = load<WpTerm[]>("raw/categories.json");
const rawTags = load<WpTerm[]>("raw/tags.json");
const seoMap = load<Record<string, Seo>>("seo/seo.json");

// URL map decides which pages/posts actually render on parent. Everything else
// is 301'd to subdomains via public/_redirects (CF Pages reads it).
type UrlMap = {
  drop: string[];
  crossDomain: Record<string, string>;
  sameOrigin301: Record<string, string>;
  keep: string[];
};
const urlMap = load<UrlMap>("raw/url-map.json");
const KEEP_PATHS = new Set(urlMap.keep);

function pathOf(p: WpPost): string {
  try { return new URL(p.link).pathname; } catch { return `/${p.slug}/`; }
}

export const posts = rawPosts.filter((p) => KEEP_PATHS.has(pathOf(p)));
export const pages = rawPages
  .filter((p) => !QUOTE_SLUGS.has(p.slug))
  .filter((p) => KEEP_PATHS.has(pathOf(p)));
export const categories = rawCategories;
export const tags = rawTags;

export type PageOrPost = WpPost;
export type Term = WpTerm;
export type SeoData = Seo;

const slugIndex = new Map<string, WpPost>();
for (const p of [...pages, ...posts]) slugIndex.set(p.slug, p);
const tagSlugIndex = new Map(tags.map((t) => [t.slug, t]));
const categorySlugIndex = new Map(categories.map((c) => [c.slug, c]));

export function findBySlug(slug: string) {
  return slugIndex.get(slug);
}
export function findTagBySlug(slug: string) {
  return tagSlugIndex.get(slug);
}
export function findCategoryBySlug(slug: string) {
  return categorySlugIndex.get(slug);
}

export function postsForCategory(catId: number) {
  return posts.filter((p) => p.categories?.includes(catId));
}

export function postsForTag(tagId: number) {
  return posts.filter((p) => p.tags?.includes(tagId));
}

export function isPost(p: WpPost) {
  return p.type === "post";
}

export function getSeo(url: string): Seo | undefined {
  if (!url.endsWith("/")) url = `${url}/`;
  return seoMap[url] || seoMap[url.replace(/\/$/, "")];
}

export function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "-")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&hellip;/g, "...")
    .replace(/&nbsp;/g, " ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

export function plainTitle(p: WpPost) {
  return decodeEntities(p.title.rendered.replace(/<[^>]+>/g, "").trim());
}

export function rewriteContentLinks(html: string): string {
  if (!html) return "";
  let out = html
    .replace(new RegExp(`href=["']${ORIGIN.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/`, "g"), 'href="/')
    .replace(new RegExp(`src=["']${ORIGIN.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}/`, "g"), 'src="/');
  // Promote heading levels so the page's h1 -> WP h2 -> WP h3 sequence is intact.
  // First find the highest heading level used in WP content, demote so it starts at h2.
  let topLevel = 7;
  for (const lv of [2, 3, 4, 5, 6]) {
    if (new RegExp(`<h${lv}[\\s>]`, "i").test(out)) {
      topLevel = lv;
      break;
    }
  }
  if (topLevel > 2 && topLevel < 7) {
    const shift = topLevel - 2;
    for (let lv = 6; lv >= topLevel; lv--) {
      const target = lv - shift;
      out = out.replace(
        new RegExp(`<(\\/?)h${lv}([\\s>])`, "gi"),
        `<$1h${target}$2`
      );
    }
  }
  // Collapse h4/h5/h6 to h3 so authors who skip levels (h2 -> h4) don't fail
  // Lighthouse heading-order audits.
  out = out.replace(/<(\/?)h[456]([\s>])/gi, "<$1h3$2");
  return out;
}

function pickSmallerSize(fm: NonNullable<WpPost["_embedded"]>["wp:featuredmedia"]) {
  if (!fm || !fm[0]) return null;
  const sizes = fm[0].media_details?.sizes;
  if (!sizes) return fm[0].source_url;
  const candidates = [
    "medium_large",
    "large",
    "1536x1536",
    "2048x2048",
    "medium",
    "thumbnail",
    "full"
  ];
  for (const k of candidates) {
    const s = sizes[k];
    if (s?.source_url && s.width <= 1200) return s.source_url;
  }
  for (const s of Object.values(sizes)) {
    if (s.source_url && s.width <= 1200) return s.source_url;
  }
  return fm[0].source_url;
}

export function featuredImage(p: WpPost): { src: string; alt: string; width?: number; height?: number } | null {
  const fm = p._embedded?.["wp:featuredmedia"];
  if (fm && fm[0]) {
    const url = pickSmallerSize(fm) ?? fm[0].source_url;
    if (url) {
      const sized = Object.values(fm[0].media_details?.sizes ?? {}).find((s) => s.source_url === url);
      const local = url.replace(ORIGIN, "");
      return {
        src: local,
        alt: fm[0].alt_text || plainTitle(p),
        width: sized?.width ?? fm[0].media_details?.width,
        height: sized?.height ?? fm[0].media_details?.height
      };
    }
  }
  return null;
}

export function extractFirstImage(p: WpPost): { src: string; alt: string; width?: number; height?: number } | null {
  const fi = featuredImage(p);
  if (fi) return fi;
  const tagMatch = p.content?.rendered?.match(/<img[^>]*>/i);
  if (!tagMatch) return null;
  const tag = tagMatch[0];
  const altMatch = tag.match(/alt=["']([^"']*)["']/i);
  const alt = altMatch?.[1] || plainTitle(p);
  // Prefer a small size from srcset if present
  const srcsetMatch = tag.match(/srcset=["']([^"']+)["']/i);
  if (srcsetMatch) {
    const candidates = srcsetMatch[1]
      .split(",")
      .map((s) => s.trim())
      .map((s) => {
        const [u, w] = s.split(" ");
        return { url: u, width: parseInt(w?.replace("w", "") || "0", 10) };
      })
      .filter((c) => c.url && c.width > 0)
      .sort((a, b) => a.width - b.width);
    const target = candidates.find((c) => c.width >= 600 && c.width <= 1024) ?? candidates[0];
    if (target) {
      const src = target.url.startsWith(ORIGIN) ? target.url.slice(ORIGIN.length) : target.url;
      return { src, alt, width: target.width };
    }
  }
  const srcMatch = tag.match(/\ssrc=["']([^"']+)["']/i);
  if (srcMatch) {
    const src = srcMatch[1].startsWith(ORIGIN) ? srcMatch[1].slice(ORIGIN.length) : srcMatch[1];
    return { src, alt };
  }
  return null;
}

export function relatedPosts(current: WpPost, limit = 3): WpPost[] {
  return posts.filter((p) => p.id !== current.id).slice(0, limit);
}

export function plainExcerpt(p: WpPost, maxLen = 220): string {
  const raw = p.excerpt?.rendered || p.content?.rendered || "";
  const text = decodeEntities(raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}...` : text;
}

export function allRoutes() {
  const routes = ["/"];
  for (const p of [...pages, ...posts]) routes.push(`/${p.slug}/`);
  for (const c of categories) routes.push(`/category/${c.slug}/`);
  for (const t of tags) routes.push(`/tag/${t.slug}/`);
  routes.push("/blog/");
  return routes;
}

export const QUOTE_SLUG_LIST = [...QUOTE_SLUGS];
