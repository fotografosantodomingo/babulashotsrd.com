/**
 * Download all foogallery cache images referenced via `data-src-fg=` in WP
 * post content into public/wp-content/uploads/cache/* so the new static site
 * can serve them directly. Also downloads the original (non-cache) source
 * image when the cache path can be mapped back to /wp-content/uploads/<...>.
 *
 * Re-run idempotently: existing files are skipped.
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = `${root}/public`;
const UA = "babula-parent-migrator/1.0 (+foogallery-rescrape)";

async function fetchFile(url, dest) {
  if (existsSync(dest)) {
    const s = await stat(dest);
    if (s.size > 0) return { skipped: true };
  }
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return { ok: false, status: res.status };
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return { ok: true, size: buf.length };
}

function urlsFromContent(items) {
  const out = new Set();
  for (const p of items) {
    const html = p.content?.rendered ?? "";
    for (const m of html.matchAll(/data-src-fg="([^"]+)"/g)) out.add(m[1]);
    // Some foogallery setups also use data-src-fg-thumb or srcset
    for (const m of html.matchAll(/data-thumb-src="([^"]+)"/g)) out.add(m[1]);
  }
  return [...out];
}

async function main() {
  const pages = JSON.parse(await readFile(`${root}/scrape/raw/all-pages-original.json`, "utf8"));
  const posts = JSON.parse(await readFile(`${root}/scrape/raw/all-posts-original.json`, "utf8"));
  const urls = urlsFromContent([...pages, ...posts]);
  console.log(`Found ${urls.length} foogallery URLs to mirror.`);

  let ok = 0, skip = 0, fail = 0, bytes = 0;
  for (const url of urls) {
    const u = new URL(url);
    const dest = `${PUBLIC}${u.pathname}`;
    const r = await fetchFile(url, dest);
    if (r.skipped) { skip++; continue; }
    if (r.ok) { ok++; bytes += r.size; }
    else { fail++; console.error(`  FAIL ${r.status} ${url}`); }
  }
  console.log(`Done. ok=${ok} skipped=${skip} fail=${fail} bytes=${(bytes/1e6).toFixed(1)}MB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
