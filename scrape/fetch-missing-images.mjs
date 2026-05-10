/**
 * Backfill specific /wp-content/uploads/ images flagged by verify-all.py as
 * missing from the deployed CDN. Reads a list of paths from this file and
 * downloads each from legacy babulashotsrd.com into public/wp-content/uploads.
 *
 * Re-run anytime more paths are flagged — idempotent (skips existing files).
 */
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = `${root}/public`;
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)";

// Paths flagged by VERIFICATION-REPORT.md as 404 on parent. Each is also
// downloaded in its commonly-referenced sized variants.
const MISSING = [
  "/wp-content/uploads/2026/04/tortuga-bay-fotografo-republica-dominicana-768x432.webp",
  "/wp-content/uploads/2026/04/tortuga-bay-fotografo-republica-dominicana.webp",
  "/wp-content/uploads/2025/03/Sesion-de-fotos-en-Zona-Colonial-Santo-Doming-768x512.webp",
  "/wp-content/uploads/2025/03/Sesion-de-fotos-en-Zona-Colonial-Santo-Doming.webp",
  "/wp-content/uploads/2025/02/Sesion-de-fotos-en-Estudio11-768x432.jpg",
  "/wp-content/uploads/2025/02/Sesion-de-fotos-en-Estudio11.jpg"
];

async function fetchOne(pathOnly) {
  const dest = `${PUBLIC}${pathOnly}`;
  if (existsSync(dest)) {
    const s = await stat(dest);
    if (s.size > 0) return { skipped: true };
  }
  await mkdir(dirname(dest), { recursive: true });
  const url = `https://babulashotsrd.com${pathOnly}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return { ok: false, status: res.status };
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return { ok: true, size: buf.length };
}

async function main() {
  let ok = 0, skip = 0, fail = 0, bytes = 0;
  for (const p of MISSING) {
    const r = await fetchOne(p);
    if (r.skipped) { skip++; continue; }
    if (r.ok) { ok++; bytes += r.size; console.log(`  fetched ${p} (${(r.size/1024).toFixed(1)}KB)`); }
    else { fail++; console.error(`  FAIL ${r.status} ${p}`); }
  }
  console.log(`Done. ok=${ok} skipped=${skip} fail=${fail} bytes=${(bytes/1e6).toFixed(2)}MB`);
}

main().catch((e) => { console.error(e); process.exit(1); });
