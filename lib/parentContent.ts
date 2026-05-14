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

// ---- Media library index (from raw/media.json) — for ALT + width/height lookup ----
type MediaItem = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, { width: number; height: number; source_url: string }>;
  };
};
type MediaInfo = { alt?: string; width?: number; height?: number };
const rawMedia: MediaItem[] = (() => {
  try { return load<MediaItem[]>("raw/media.json"); } catch { return []; }
})();
const mediaIndex = new Map<string, MediaInfo>();
for (const m of rawMedia) {
  const info: MediaInfo = {
    alt: m.alt_text || undefined,
    width: m.media_details?.width,
    height: m.media_details?.height
  };
  if (m.source_url) mediaIndex.set(m.source_url, info);
  if (m.media_details?.sizes) {
    for (const s of Object.values(m.media_details.sizes)) {
      if (s?.source_url) {
        mediaIndex.set(s.source_url, { alt: m.alt_text || undefined, width: s.width, height: s.height });
      }
    }
  }
}

/** Look up a media URL (full URL or path) and return alt/width/height from media.json. */
export function lookupMedia(src: string): MediaInfo {
  if (!src) return {};
  const candidates = new Set<string>([src]);
  // Try with/without protocol+host variants
  if (src.startsWith("/")) {
    candidates.add(`https://babulashotsrd.com${src}`);
    candidates.add(`https://www.babulashotsrd.com${src}`);
  } else {
    const path = src.replace(/^https?:\/\/[^/]+/, "");
    if (path) candidates.add(path);
  }
  for (const c of candidates) {
    const hit = mediaIndex.get(c);
    if (hit) return hit;
  }
  return {};
}

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

// ---- JSON-LD 1:1 from raw/jsonld.json (AIO SEO inline blocks scraped from old pages) ----
type JsonLdBlock = Record<string, unknown>;
const jsonLdMap: Record<string, JsonLdBlock[]> = (() => {
  try { return load<Record<string, JsonLdBlock[]>>("raw/jsonld.json"); } catch { return {}; }
})();

/** Look up the original AIO SEO JSON-LD blocks scraped from the legacy WP page. */
export function getJsonLd(url: string): JsonLdBlock[] {
  if (!url.endsWith("/")) url = `${url}/`;
  return jsonLdMap[url] || jsonLdMap[url.replace(/\/$/, "")] || [];
}

// ---- Topical internal links (distribute authority from legacy parent pages
// to the specialised subdomain hubs that now own the topic) ----
export type TopicLink = { label: string; href: string; tag: string };
export type TopicLang = "es" | "en";

const ESTUDIO_SUB = "https://estudio.babulashotsrd.com";
const BODA_SUB = "https://boda.babulashotsrd.com";
const DRON_SUB = "https://dron.babulashotsrd.com";
const INMO_SUB = "https://inmobiliaria.babulashotsrd.com";

// Each topic is a slug substring → target hub (label + URL).
// Matched in declaration order so more specific topics win over generic ones.
// Per-language label table — `linksEs` and `linksEn` parallel arrays.
type Rule = { match: RegExp; linksEs: TopicLink[]; linksEn: TopicLink[] };
const TOPIC_RULES: Rule[] = [
  { match: /embaraz|pregnancy|maternity/i,
    linksEs: [{ tag: "Estudio", label: "Sesión de fotos embarazo", href: `${ESTUDIO_SUB}/sesion-de-fotos-embarazo/` }],
    linksEn: [{ tag: "Studio", label: "Maternity photo session", href: `${ESTUDIO_SUB}/en/sesion-de-fotos-embarazo/` }]
  },
  { match: /quincea/i,
    linksEs: [{ tag: "Estudio", label: "Sesión de quinceañera", href: `${ESTUDIO_SUB}/sesion-de-fotos-quinceanera/` }],
    linksEn: [{ tag: "Studio", label: "Sweet sixteen / Quinceañera session", href: `${ESTUDIO_SUB}/en/sesion-de-fotos-quinceanera/` }]
  },
  { match: /cumple|birthday/i,
    linksEs: [{ tag: "Estudio", label: "Sesión de cumpleaños", href: `${ESTUDIO_SUB}/sesion-de-fotos-cumpleanos/` }],
    linksEn: [{ tag: "Studio", label: "Birthday photo session", href: `${ESTUDIO_SUB}/en/sesion-de-fotos-cumpleanos/` }]
  },
  { match: /headshot|retrato-corporativ|corporativ|empresa|negocio|fashion|moda/i,
    linksEs: [
      { tag: "Estudio", label: "Sesiones corporativas y headshots", href: `${ESTUDIO_SUB}/sesion-de-fotos-corporativas/` },
      { tag: "Estudio", label: "Headshots profesionales", href: `${ESTUDIO_SUB}/headshots-profesionales-santo-domingo/` }
    ],
    linksEn: [
      { tag: "Studio", label: "Corporate sessions & headshots", href: `${ESTUDIO_SUB}/en/sesion-de-fotos-corporativas/` },
      { tag: "Studio", label: "Professional headshots", href: `${ESTUDIO_SUB}/en/headshots-profesionales-santo-domingo/` }
    ]
  },
  { match: /boda|matrimonio|novio|pre-boda|wedding|ceremonia|anniversary|aniversary|casa-de-campo|juan-dolio|paris/i,
    linksEs: [
      { tag: "Bodas", label: "Fotógrafo de bodas en RD", href: `${BODA_SUB}/` },
      { tag: "Bodas", label: "Servicios y precios de boda", href: `${BODA_SUB}/servicios/` }
    ],
    linksEn: [
      { tag: "Weddings", label: "Wedding photographer in DR", href: `${BODA_SUB}/en/` },
      { tag: "Weddings", label: "Wedding services & pricing", href: `${BODA_SUB}/en/` }
    ]
  },
  { match: /dron|drone|aerial|aereo/i,
    linksEs: [{ tag: "Drone", label: "Servicios de drone aéreo", href: `${DRON_SUB}/` }],
    linksEn: [{ tag: "Drone", label: "Aerial drone services", href: `${DRON_SUB}/en/` }]
  },
  { match: /real-estate|inmobiliari|propiedad|apartamento|villa/i,
    linksEs: [{ tag: "Inmobiliaria", label: "Fotografía inmobiliaria", href: `${INMO_SUB}/` }],
    linksEn: [{ tag: "Real estate", label: "Real estate photography", href: `${INMO_SUB}/en/` }]
  },
  { match: /baseball|beisbol/i,
    linksEs: [{ tag: "Deporte", label: "Fotógrafo de baseball (master)", href: "/fotografo-baseball-santo-domingo/" }],
    linksEn: [{ tag: "Sports", label: "Baseball photographer (master)", href: "/en/baseball-photographer-santo-domingo/" }]
  },
  { match: /kite|surf|cabarete|las-terrenas/i,
    linksEs: [{ tag: "Deporte", label: "Fotografía de kitesurf en Cabarete", href: "/servicio-de-fotografia-profesional-de-kitesurfing-cabarete/" }],
    linksEn: [{ tag: "Sports", label: "Kitesurf photography in Cabarete", href: "/en/professional-kitesurfing-photography-cabarete/" }]
  },
  { match: /comida|gastronomi|alimentos|bebida|food/i,
    linksEs: [{ tag: "Estudio", label: "Fotografía gastronómica y producto", href: `${ESTUDIO_SUB}/` }],
    linksEn: [{ tag: "Studio", label: "Food & product photography", href: `${ESTUDIO_SUB}/en/` }]
  },
  { match: /punta-cana|tortuga-bay|saona/i,
    linksEs: [
      { tag: "Bodas", label: "Bodas y destinos en Punta Cana", href: `${BODA_SUB}/` },
      { tag: "Estudio", label: "Sesiones de estudio en RD", href: `${ESTUDIO_SUB}/` }
    ],
    linksEn: [
      { tag: "Weddings", label: "Weddings & destinations in Punta Cana", href: `${BODA_SUB}/en/` },
      { tag: "Studio", label: "Studio sessions in the Dominican Republic", href: `${ESTUDIO_SUB}/en/` }
    ]
  },
  { match: /zona-colonial/i,
    linksEs: [
      { tag: "Estudio", label: "Sesiones en Zona Colonial", href: `${ESTUDIO_SUB}/sesion-de-fotos/` },
      { tag: "Bodas", label: "Bodas en Zona Colonial", href: `${BODA_SUB}/` }
    ],
    linksEn: [
      { tag: "Studio", label: "Sessions in Zona Colonial", href: `${ESTUDIO_SUB}/en/sesion-de-fotos/` },
      { tag: "Weddings", label: "Weddings in Zona Colonial", href: `${BODA_SUB}/en/` }
    ]
  },
  { match: /estudio|studio|retrato|portrait/i,
    linksEs: [{ tag: "Estudio", label: "Sesiones en estudio fotográfico", href: `${ESTUDIO_SUB}/sesion-de-fotos/` }],
    linksEn: [{ tag: "Studio", label: "Studio photography sessions", href: `${ESTUDIO_SUB}/en/sesion-de-fotos/` }]
  },
  { match: /evento|event/i,
    linksEs: [{ tag: "Estudio", label: "Eventos corporativos y comerciales", href: `${ESTUDIO_SUB}/sesion-de-fotos-corporativas/` }],
    linksEn: [{ tag: "Studio", label: "Corporate and commercial events", href: `${ESTUDIO_SUB}/en/sesion-de-fotos-corporativas/` }]
  },
  { match: /videograf|video|reel/i,
    linksEs: [{ tag: "Estudio", label: "Video y contenido en estudio", href: `${ESTUDIO_SUB}/` }],
    linksEn: [{ tag: "Studio", label: "Video & content in studio", href: `${ESTUDIO_SUB}/en/` }]
  }
];

/** Pick up to 3 contextual subdomain links for a given page slug. Deduplicated by href. */
export function topicalLinks(slug: string, link?: string, lang: TopicLang = "es"): TopicLink[] {
  const key = `${slug} ${link ?? ""}`;
  const out: TopicLink[] = [];
  const seen = new Set<string>();
  for (const rule of TOPIC_RULES) {
    if (!rule.match.test(key)) continue;
    const links = lang === "en" ? rule.linksEn : rule.linksEs;
    for (const l of links) {
      if (seen.has(l.href)) continue;
      seen.add(l.href);
      out.push(l);
      if (out.length >= 3) return out;
    }
  }
  // Always end with the network hub as a fallback so every page emits at least one.
  if (out.length === 0) {
    out.push(
      lang === "en"
        ? { tag: "Babula Shots", label: "Services & pricing", href: "/en/photographer/" }
        : { tag: "Red Babula Shots", label: "Servicios y precios", href: "/fotografo/" }
    );
  }
  return out;
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

  // FooGallery (and other lazy-load plugins) emit:
  //   <img src="data:image/svg+xml,..." data-src-fg="https://babulashotsrd.com/wp-content/uploads/cache/..." ...>
  // The placeholder src is meant to be swapped by client JS — which the WP
  // plugin runs, but our static export does not include. Inline the real URL
  // into `src=` at build time so images render without JS, and drop the
  // lazy-load attributes that no longer have any effect.
  out = out.replace(
    /<img\b[^>]*?>/gi,
    (tag) => {
      const fg = tag.match(/\s(?:data-src-fg|data-src|data-lazy-src)=["']([^"']+)["']/i);
      if (!fg) return tag;
      let realSrc = fg[1].replace(ORIGIN, "");
      // Always strip the lazy-load attributes (they're now redundant).
      let next = tag.replace(/\s(?:data-src-fg|data-src|data-lazy-src|data-thumb-src|data-srcset-fg|data-srcset|data-lazy-srcset|data-thumb-srcset|data-loaded)=["'][^"']*["']/gi, "");
      // Replace SVG placeholder src=. If there's no src=, prepend one.
      if (/\ssrc=["']data:image[^"']*["']/i.test(next)) {
        next = next.replace(/\ssrc=["']data:image[^"']*["']/i, ` src="${realSrc}"`);
      } else if (/\ssrc=["'][^"']*["']/i.test(next)) {
        next = next.replace(/\ssrc=["'][^"']*["']/i, ` src="${realSrc}"`);
      } else {
        next = next.replace(/<img/i, `<img src="${realSrc}"`);
      }
      // Remove `skip-lazy` / `fg-image` / `lazyload` classes that styled the placeholder
      next = next.replace(/\sclass=["']([^"']*)["']/i, (m, cls) => {
        const cleaned = cls
          .split(/\s+/)
          .filter((c: string) => !/^(skip-lazy|fg-image|lazyload|fg-img-load|fg-photo|fg-item|lazyloaded)$/i.test(c))
          .join(" ")
          .trim();
        return cleaned ? ` class="${cleaned}"` : "";
      });
      return next;
    }
  );
  // Strip any inline reference to a `.mov` source. The legacy WP site hosted
  // raw QuickTime files which exceed CF Pages' 25MB-per-file limit. We can't
  // mirror them, so we drop the broken <video>/<source>/<a> wrappers cleanly.
  out = out.replace(/<(video|source)[^>]*\.mov[^>]*>/gi, "");
  out = out.replace(/<\/video>/gi, "");
  out = out.replace(/<a [^>]*\.mov"[^>]*>(.*?)<\/a>/gi, "$1");

  // Heading-level discipline. The page renders its own <h1> in the article
  // header, so any <h1> that appears in WP content is demoted to <h2> to keep
  // a single h1 per page (Lighthouse SEO + a11y).
  out = out.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
  // Find the highest heading level used in WP content. We want WP content to
  // start at h2 (since the page's h1 lives outside this fragment). If content
  // starts at h3+, shift everything up so headings start at h2.
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

  // Smart-gallery: rewrap WP `wp-block-gallery` blocks (and consecutive image
  // figures) into a `<div class="smart-gallery sg-<orient> sg-<count>">` so the
  // CSS can lay them out by count + orientation:
  //   1 wide  → centred, big but not full width
  //   2 wide  → 50 / 50 row, no gaps
  //   4 wide  → 2 × 2, no gaps
  //   N tall  → equal-width row, full width
  //   mobile  → single column, full bleed
  // Each image gets inline `aspect-ratio:W/H` so heights match without any
  // cropping (no `object-fit: cover`).
  out = rewriteGalleries(out);

  return out;
}

function buildSmartGallery(inner: string): string | null {
  // Extract each inner <img> tag — flatten regardless of nesting
  const imgTags = inner.match(/<img\b[^>]*>/gi) ?? [];
  if (imgTags.length === 0) return null;
  const photos = imgTags.map((tag) => {
    const w = parseInt(tag.match(/\swidth=["'](\d+)["']/i)?.[1] || "0", 10);
    const h = parseInt(tag.match(/\sheight=["'](\d+)["']/i)?.[1] || "0", 10);
    const isWide = w >= h;
    return { tag, w, h, isWide };
  });
  const allWide = photos.every((p) => p.isWide);
  const allTall = photos.every((p) => !p.isWide);
  const orient = allWide ? "sg-wide" : allTall ? "sg-tall" : "sg-mixed";
  const count = photos.length;
  const countCls = `sg-${count > 6 ? "many" : count}`;
  const items = photos.map((p) => {
    let tag = p.tag;
    if (p.w && p.h) {
      const style = `aspect-ratio:${p.w}/${p.h}`;
      if (/\sstyle=["']([^"']*)["']/i.test(tag)) {
        tag = tag.replace(/\sstyle=["']([^"']*)["']/i, (_m, s) => ` style="${s};${style}"`);
      } else {
        tag = tag.replace(/<img\b/i, `<img style="${style}"`);
      }
    }
    if (!/\sloading=/i.test(tag)) tag = tag.replace(/<img\b/i, "<img loading=\"lazy\"");
    if (!/\sdecoding=/i.test(tag)) tag = tag.replace(/<img\b/i, "<img decoding=\"async\"");
    return `<figure class="sg-item">${tag}</figure>`;
  }).join("");
  return `<div class="smart-gallery ${orient} ${countCls}">${items}</div>`;
}

// Replace the first balanced `<tag>...</tag>` block matching `openRe` with the
// result of `transform(inner)`. Walks once through `html` with depth counting,
// so it works for tags that contain nested same-name tags (foogallery's nested
// divs). Iterates until no more matches.
function replaceBalancedBlocks(
  html: string,
  tagName: string,
  openRe: RegExp,
  transform: (inner: string, fullBlock: string) => string
): string {
  let out = "";
  let pos = 0;
  const openTagPattern = new RegExp(`<${tagName}\\b`, "gi");
  const closeTag = `</${tagName}>`;
  // Start the search fresh each iteration so we don't get tripped up by
  // mutations of `out`.
  while (true) {
    openRe.lastIndex = pos;
    const m = openRe.exec(html);
    if (!m) break;
    const start = m.index;
    const tagEnd = openRe.lastIndex;
    let depth = 1;
    let i = tagEnd;
    while (i < html.length && depth > 0) {
      openTagPattern.lastIndex = i;
      const openMatch = openTagPattern.exec(html);
      const closeIdx = html.indexOf(closeTag, i);
      if (closeIdx === -1) { i = html.length; break; }
      if (openMatch && openMatch.index < closeIdx) {
        depth++;
        const gt = html.indexOf(">", openMatch.index);
        i = gt + 1;
      } else {
        depth--;
        i = closeIdx + closeTag.length;
      }
    }
    const fullBlock = html.substring(start, i);
    const inner = html.substring(tagEnd, i - closeTag.length);
    const replaced = transform(inner, fullBlock);
    out += html.substring(pos, start) + replaced;
    pos = i;
  }
  out += html.substring(pos);
  return out;
}

function rewriteGalleries(html: string): string {
  // 1) WP block galleries (figure-wrapped)
  let out = replaceBalancedBlocks(
    html,
    "figure",
    /<figure\b[^>]*\bclass="[^"]*\bwp-block-gallery\b[^"]*"[^>]*>/gi,
    (inner, full) => buildSmartGallery(inner) ?? full
  );
  // 2) FooGallery containers (div-wrapped, often deeply nested)
  out = replaceBalancedBlocks(
    out,
    "div",
    /<div\b[^>]*\bclass="[^"]*\bfoogallery\b[^"]*"[^>]*>/gi,
    (inner, full) => buildSmartGallery(inner) ?? full
  );
  return out;
}

function pickSmallerSize(fm: NonNullable<WpPost["_embedded"]>["wp:featuredmedia"]) {
  if (!fm || !fm[0]) return null;
  const sizes = fm[0].media_details?.sizes;
  const fullUrl = fm[0].source_url;
  if (!sizes) return fullUrl;
  // Pick the LARGEST variant whose width is still <=1200px. This keeps heroes
  // crisp on retina (~600px slot × 2dpr) without serving multi-megabyte
  // originals. The previous version picked the first match in a fixed priority
  // order and ended up serving "medium" (300px) for any image whose -medium_large
  // / -large variants WP hadn't generated — visibly blurry on Retina.
  // Include the original `full` size in the pool so small originals (e.g. 675px)
  // win over their own tiny -medium thumbnails.
  type Candidate = { src: string; width: number };
  const candidates: Candidate[] = [];
  for (const s of Object.values(sizes)) {
    if (s?.source_url && s.width) candidates.push({ src: s.source_url, width: s.width });
  }
  const fullW = fm[0].media_details?.width;
  if (fullUrl && fullW) candidates.push({ src: fullUrl, width: fullW });
  const usable = candidates.filter((c) => c.width <= 1200);
  if (usable.length === 0) return fullUrl;
  usable.sort((a, b) => b.width - a.width);
  return usable[0].src;
}

export function featuredImage(p: WpPost): { src: string; alt: string; width?: number; height?: number } | null {
  const fm = p._embedded?.["wp:featuredmedia"];
  if (fm && fm[0]) {
    const url = pickSmallerSize(fm) ?? fm[0].source_url;
    if (url) {
      const sized = Object.values(fm[0].media_details?.sizes ?? {}).find((s) => s.source_url === url);
      const local = url.replace(ORIGIN, "");
      // Fallback to media.json for missing dimensions or alt text
      const mediaInfo = lookupMedia(url);
      return {
        src: local,
        alt: fm[0].alt_text || mediaInfo.alt || plainTitle(p),
        width: sized?.width ?? fm[0].media_details?.width ?? mediaInfo.width,
        height: sized?.height ?? fm[0].media_details?.height ?? mediaInfo.height
      };
    }
  }
  return null;
}

export function extractFirstImage(p: WpPost): { src: string; alt: string; width?: number; height?: number } | null {
  const fi = featuredImage(p);
  if (fi) return fi;
  // Find the first <img> that has a real source (not a foogallery / lazyload
  // SVG placeholder). If the only `src=` is `data:image/svg+xml...`, fall
  // back to `data-src-fg=` / `data-src=` / `data-lazy-src=` which is the URL
  // the placeholder is supposed to be swapped to at runtime.
  const html = p.content?.rendered ?? "";
  const imgMatches = html.match(/<img[^>]*>/gi) ?? [];
  let tag: string | null = null;
  for (const m of imgMatches) {
    if (/\ssrc=["']data:image/i.test(m)) {
      // Skip placeholder unless we can resolve it via data-src-fg
      const fg = m.match(/\s(?:data-src-fg|data-src|data-lazy-src)=["']([^"']+)["']/i);
      if (fg) {
        // Synthesise a clean tag with the real src
        tag = m.replace(/\ssrc=["'][^"']*["']/i, ` src="${fg[1]}"`);
        break;
      }
      continue;
    }
    tag = m;
    break;
  }
  if (!tag) return null;
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
      const mediaInfo = lookupMedia(target.url);
      return { src, alt: alt || mediaInfo.alt || alt, width: target.width, height: mediaInfo.height };
    }
  }
  const srcMatch = tag.match(/\ssrc=["']([^"']+)["']/i);
  if (srcMatch) {
    const rawSrc = srcMatch[1];
    if (rawSrc.startsWith("data:image")) return null;
    const src = rawSrc.startsWith(ORIGIN) ? rawSrc.slice(ORIGIN.length) : rawSrc;
    const mediaInfo = lookupMedia(rawSrc);
    return { src, alt: alt || mediaInfo.alt || alt, width: mediaInfo.width, height: mediaInfo.height };
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
