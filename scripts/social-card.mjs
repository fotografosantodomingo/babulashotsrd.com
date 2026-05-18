import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, "../public/wp-content/uploads/2026/05/babula-shots-volleyball-hero.webp");
// Output to /public/images/ (NOT wp-content/uploads — that path is gitignored
// and could be wiped by a WP scrape sync).
const dst = path.resolve(__dirname, "../public/images/social-card-1200x630.webp");

await sharp(src)
  .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
  .webp({ quality: 78 })
  .toFile(dst);

const meta = await sharp(dst).metadata();
console.log(`OK ${dst} ${meta.width}x${meta.height} ${meta.size ?? "?"} bytes`);
