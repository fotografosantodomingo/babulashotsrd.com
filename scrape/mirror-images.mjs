import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)));
const ORIGIN = "https://babulashotsrd.com";
const OUT_ROOT = resolve(root, "..", "public");
const UA = "babula-parent-migrator/1.0 (+rebuild)";
const CONCURRENCY = 8;

async function main() {
  const inv = JSON.parse(await readFile(`${root}/raw/image-inventory.json`, "utf8"));
  console.log(`Total images to download: ${inv.length}`);
  let i = 0, ok = 0, skipped = 0, failed = 0;

  async function fetchOne(url) {
    try {
      const u = new URL(url);
      if (!u.hostname.includes("babulashotsrd.com")) return "skip";
      const path = u.pathname; // /wp-content/uploads/...
      const dest = join(OUT_ROOT, path);
      const dir = dirname(dest);
      if (!existsSync(dir)) await mkdir(dir, { recursive: true });
      if (existsSync(dest)) return "skip";
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) return "fail";
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);
      return "ok";
    } catch (e) {
      return "fail";
    }
  }

  // Concurrency limited
  let cursor = 0;
  async function worker() {
    while (cursor < inv.length) {
      const idx = cursor++;
      const url = inv[idx];
      const r = await fetchOne(url);
      if (r === "ok") ok++;
      else if (r === "skip") skipped++;
      else failed++;
      i++;
      if (i % 100 === 0) console.log(`  ${i}/${inv.length} (ok=${ok} skip=${skipped} fail=${failed})`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\nDone. ok=${ok}  skipped=${skipped}  failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
