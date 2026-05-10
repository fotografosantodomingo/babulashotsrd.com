/**
 * Babula Shots — parent (babulashotsrd.com) WP scraper.
 * Pulls pages + posts + categories + tags + AIO SEO meta + image inventory.
 *
 * Filters out:
 *   - WooCommerce products (no real sales — to be dropped)
 *   - The 8 cannibalization URLs (will be 301'd to estudio in the new build)
 */
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://babulashotsrd.com";
const UA = "babula-parent-migrator/1.0 (+rebuild)";

// URLs we will NOT migrate. They get 301'd to estudio in the new build.
const KILL_SLUGS = new Set([
  "sesion-de-fotos",
  "sesion-de-fotos-de-cumpleanos-en-santo-domingo-con-fotografo-profesional",
  "sesion-de-fotos-exterior-en-santo-domingo-rd",
  "session-de-fotos-santo-domingo-estudio",
  "fotografo-en-estudio-santo-domingo",
  "estudio"
]);

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

async function fetchAll(endpoint, perPage = 100) {
  const all = [];
  let page = 1;
  while (true) {
    const url = `${ORIGIN}/wp-json/wp/v2/${endpoint}?per_page=${perPage}&page=${page}&_embed=true`;
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

async function fetchSeoFor(url) {
  // AIO SEO has /wp-json/aioseo/v1/... but most installs gate it. Try the OG meta sniffing on the public page.
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (!res.ok) return null;
    const html = await res.text();
    const pick = (re) => {
      const m = html.match(re);
      return m ? m[1] : null;
    };
    return {
      title: pick(/<title[^>]*>([^<]+)/i),
      description: pick(/<meta\s+name=["']description["']\s+content=["']([^"']+)/i),
      ogTitle: pick(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)/i),
      ogDescription: pick(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)/i),
      ogImage: pick(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)/i),
      canonical: pick(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)
    };
  } catch (e) {
    return null;
  }
}

function extractImageUrls(html) {
  if (!html) return [];
  const out = new Set();
  // src= and srcset= attributes pointing to babulashotsrd.com
  const reSrc = /\bsrc=["']([^"']+)["']/g;
  const reSrcset = /\bsrcset=["']([^"']+)["']/g;
  let m;
  while ((m = reSrc.exec(html))) {
    if (m[1].includes("babulashotsrd.com") || m[1].startsWith("/")) out.add(m[1]);
  }
  while ((m = reSrcset.exec(html))) {
    for (const part of m[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url && (url.includes("babulashotsrd.com") || url.startsWith("/"))) out.add(url);
    }
  }
  return [...out];
}

async function main() {
  await ensureDir(`${root}/raw`);
  await ensureDir(`${root}/seo`);

  console.log("Pulling pages...");
  const pages = await fetchAll("pages");
  console.log(`  ${pages.length} pages`);

  console.log("Pulling posts...");
  const posts = await fetchAll("posts");
  console.log(`  ${posts.length} posts`);

  console.log("Pulling categories...");
  const categories = await fetchAll("categories");
  console.log(`  ${categories.length} categories`);

  console.log("Pulling tags...");
  const tags = await fetchAll("tags");
  console.log(`  ${tags.length} tags (including unused)`);

  // Filter out kill-list slugs
  const pagesKept = pages.filter((p) => !KILL_SLUGS.has(p.slug));
  const postsKept = posts.filter((p) => !KILL_SLUGS.has(p.slug));
  console.log(`  pages after kill-list: ${pagesKept.length} (dropped ${pages.length - pagesKept.length})`);
  console.log(`  posts after kill-list: ${postsKept.length} (dropped ${posts.length - postsKept.length})`);

  // Drop tags with zero posts (cruft)
  const usedTagIds = new Set();
  for (const p of [...pagesKept, ...postsKept]) {
    for (const t of p.tags || []) usedTagIds.add(t);
  }
  const tagsKept = tags.filter((t) => usedTagIds.has(t.id));
  console.log(`  tags after pruning unused: ${tagsKept.length} (dropped ${tags.length - tagsKept.length})`);

  // Drop empty categories
  const usedCatIds = new Set();
  for (const p of [...pagesKept, ...postsKept]) {
    for (const c of p.categories || []) usedCatIds.add(c);
  }
  const categoriesKept = categories.filter((c) => usedCatIds.has(c.id) || c.id === 1); // keep Uncategorized
  console.log(`  categories after pruning: ${categoriesKept.length}`);

  await writeFile(`${root}/raw/pages.json`, JSON.stringify(pagesKept, null, 2));
  await writeFile(`${root}/raw/posts.json`, JSON.stringify(postsKept, null, 2));
  await writeFile(`${root}/raw/categories.json`, JSON.stringify(categoriesKept, null, 2));
  await writeFile(`${root}/raw/tags.json`, JSON.stringify(tagsKept, null, 2));
  await writeFile(`${root}/raw/all-pages-original.json`, JSON.stringify(pages, null, 2));
  await writeFile(`${root}/raw/all-posts-original.json`, JSON.stringify(posts, null, 2));

  // Sniff SEO for each page/post
  console.log("\nSniffing SEO meta...");
  const seoMap = {};
  const all = [...pagesKept, ...postsKept];
  for (let i = 0; i < all.length; i++) {
    const p = all[i];
    if (i % 10 === 0) console.log(`  ${i}/${all.length}`);
    const url = p.link;
    const seo = await fetchSeoFor(url);
    if (seo) seoMap[url] = seo;
  }
  await writeFile(`${root}/seo/seo.json`, JSON.stringify(seoMap, null, 2));
  console.log(`  SEO meta saved for ${Object.keys(seoMap).length} URLs`);

  // Image inventory
  console.log("\nBuilding image inventory...");
  const images = new Set();
  for (const p of all) {
    const html = p.content?.rendered || "";
    for (const url of extractImageUrls(html)) images.add(url);
    // Featured image
    const featured = p._embedded?.["wp:featuredmedia"]?.[0];
    if (featured?.source_url) images.add(featured.source_url);
  }
  // Normalize to absolute URLs + dedupe relative variants
  const inv = [...images].map((u) => {
    if (u.startsWith("/")) return ORIGIN + u;
    return u;
  });
  await writeFile(`${root}/raw/image-inventory.json`, JSON.stringify([...new Set(inv)], null, 2));
  console.log(`  ${[...new Set(inv)].length} unique image URLs`);

  // Summary
  const summary = {
    scrapedAt: new Date().toISOString(),
    origin: ORIGIN,
    pages: { total: pages.length, kept: pagesKept.length },
    posts: { total: posts.length, kept: postsKept.length },
    categories: { total: categories.length, kept: categoriesKept.length },
    tags: { total: tags.length, kept: tagsKept.length },
    images: [...new Set(inv)].length,
    killedSlugs: [...KILL_SLUGS]
  };
  await writeFile(`${root}/raw/summary.json`, JSON.stringify(summary, null, 2));
  console.log(`\n${JSON.stringify(summary, null, 2)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
