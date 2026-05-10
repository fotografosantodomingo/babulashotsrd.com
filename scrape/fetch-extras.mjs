/**
 * Babula parent — uzupełniający scraper.
 * Pobiera to czego brakowało w fetch-wp.mjs:
 *   - foogallery custom post type (8 galerii)
 *   - media library z REST (z alt text + wymiarami + EXIF)
 *   - JSON-LD z każdej publicznej strony (AIO SEO emituje inline w <head>)
 *   - URL mapping artifact (old → new)
 *
 * Wymagane wtyczki: NONE. AIO SEO JSON-LD jest publiczny w HTML, foogallery
 * eksponuje swoje posty przez standardowy /wp/v2/foogallery, a media zawsze
 * jest publiczne.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://babulashotsrd.com";
const NEW_ORIGIN = "https://babulashotsrd.com"; // same domain, just rebuilt
const UA = "babula-parent-migrator/1.0 (+rebuild)";

// Subdomains to redirect to (when old URL is studio-themed)
const ESTUDIO_REDIRECTS = {
  "/sesion-de-fotos/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/sesion-de-fotos-de-cumpleanos-en-santo-domingo-con-fotografo-profesional/": "https://estudio.babulashotsrd.com/sesion-de-fotos-cumpleanos/",
  "/sesion-de-fotos-exterior-en-santo-domingo-rd/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/session-de-fotos-santo-domingo-estudio/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/fotografo-en-estudio-santo-domingo/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/estudio/": "https://estudio.babulashotsrd.com/",
  "/shop/sesion-de-fotos-santo-domingo-estudio/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/shop/sesion-de-fotos-estudio-en-santo-domingo-rd/": "https://estudio.babulashotsrd.com/sesion-de-fotos/"
};

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function fetchAll(endpoint, perPage = 100) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${ORIGIN}/wp-json/wp/v2/${endpoint}?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.status === 400 || res.status === 404) break;
    if (!res.ok) {
      console.error(`  ${endpoint} page ${page} HTTP ${res.status}`);
      break;
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    const total = parseInt(res.headers.get("x-wp-totalpages") || "1", 10);
    if (page >= total) break;
    page++;
  }
  return all;
}

async function fetchPublicHtml(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractJsonLd(html) {
  // AIO SEO + WordPress emit application/ld+json blocks in <head>.
  if (!html) return [];
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    try {
      blocks.push(JSON.parse(raw));
    } catch {
      // ignore malformed
    }
  }
  return blocks;
}

async function main() {
  await ensureDir(`${root}/raw`);

  // ---- Custom post types: foogallery ----
  console.log("Pulling foogallery custom post type...");
  const galleries = await fetchAll("foogallery");
  console.log(`  ${galleries.length} galleries`);
  await writeFile(`${root}/raw/foogalleries.json`, JSON.stringify(galleries, null, 2));

  // ---- Media library (full, with metadata) ----
  console.log("\nPulling media library (full metadata, alt text, dimensions)...");
  const media = await fetchAll("media", 100);
  console.log(`  ${media.length} media items`);
  // Slim down — we don't need _links and html-rendered descriptions for migration
  const slim = media.map((m) => ({
    id: m.id,
    date: m.date,
    slug: m.slug,
    title: m.title?.rendered,
    alt_text: m.alt_text,
    media_type: m.media_type,
    mime_type: m.mime_type,
    source_url: m.source_url,
    media_details: {
      width: m.media_details?.width,
      height: m.media_details?.height,
      file: m.media_details?.file,
      sizes: m.media_details?.sizes ? Object.fromEntries(
        Object.entries(m.media_details.sizes).map(([k, v]) => [k, {
          width: v.width, height: v.height, source_url: v.source_url, mime_type: v.mime_type
        }])
      ) : undefined,
      image_meta: m.media_details?.image_meta ? {
        camera: m.media_details.image_meta.camera,
        created_timestamp: m.media_details.image_meta.created_timestamp,
        title: m.media_details.image_meta.title,
        caption: m.media_details.image_meta.caption,
        focal_length: m.media_details.image_meta.focal_length,
        iso: m.media_details.image_meta.iso,
        shutter_speed: m.media_details.image_meta.shutter_speed,
        aperture: m.media_details.image_meta.aperture
      } : undefined
    }
  }));
  await writeFile(`${root}/raw/media.json`, JSON.stringify(slim, null, 2));
  console.log(`  saved media.json (${slim.length} items)`);

  // ---- JSON-LD per public URL ----
  console.log("\nExtracting JSON-LD from each public URL (AIO SEO emits inline)...");
  const pages = JSON.parse(await readFile(`${root}/raw/pages.json`, "utf8"));
  const posts = JSON.parse(await readFile(`${root}/raw/posts.json`, "utf8"));
  const allUrls = [
    ORIGIN + "/",
    ...pages.map((p) => p.link),
    ...posts.map((p) => p.link)
  ];
  const ldMap = {};
  for (let i = 0; i < allUrls.length; i++) {
    if (i % 20 === 0) console.log(`  ${i}/${allUrls.length}`);
    const html = await fetchPublicHtml(allUrls[i]);
    const blocks = extractJsonLd(html);
    if (blocks.length > 0) ldMap[allUrls[i]] = blocks;
  }
  await writeFile(`${root}/raw/jsonld.json`, JSON.stringify(ldMap, null, 2));
  console.log(`  JSON-LD saved for ${Object.keys(ldMap).length} URLs`);

  // ---- URL map: old WP URL → new URL (or 301 target) ----
  console.log("\nBuilding URL mapping artifact...");
  const urlMap = {
    sameOrigin: {},      // /old-slug/ → /new-slug/  (when slug stays the same, just rebuild)
    crossDomain: {},     // /old-slug/ → https://estudio.babulashotsrd.com/new/
    drop: []             // dropped without redirect (probably 404 or noindex)
  };
  for (const p of [...pages, ...posts]) {
    const oldPath = new URL(p.link).pathname;
    if (ESTUDIO_REDIRECTS[oldPath]) {
      urlMap.crossDomain[oldPath] = ESTUDIO_REDIRECTS[oldPath];
    } else {
      // Slug stays same on rebuild
      urlMap.sameOrigin[oldPath] = oldPath;
    }
  }
  // Add the kill-list redirects (these were filtered out of pages.json)
  for (const [from, to] of Object.entries(ESTUDIO_REDIRECTS)) {
    urlMap.crossDomain[from] = to;
  }
  // WooCommerce shop URLs we drop completely (no real sales)
  urlMap.drop = ["/cart/", "/checkout/", "/my-account/"];
  await writeFile(`${root}/raw/url-map.json`, JSON.stringify(urlMap, null, 2));
  console.log(`  sameOrigin: ${Object.keys(urlMap.sameOrigin).length}  crossDomain: ${Object.keys(urlMap.crossDomain).length}  drop: ${urlMap.drop.length}`);

  // ---- Final summary ----
  const summary = {
    extrasScrapedAt: new Date().toISOString(),
    galleries: galleries.length,
    media: slim.length,
    jsonldUrls: Object.keys(ldMap).length,
    urlMap: {
      sameOrigin: Object.keys(urlMap.sameOrigin).length,
      crossDomain: Object.keys(urlMap.crossDomain).length,
      drop: urlMap.drop.length
    }
  };
  console.log("\n" + JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
