import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { execSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "out");

const cssPaths = execSync(`find ${outDir}/_next -name '*.css'`).toString().trim().split("\n").filter(Boolean);
const cssByFile = new Map();
for (const p of cssPaths) {
  cssByFile.set(p, (await readFile(p, "utf8")).trim());
}

const htmlPaths = execSync(`find ${outDir} -name '*.html'`).toString().trim().split("\n").filter(Boolean);
const txtPaths = execSync(`find ${outDir} -name '*.txt'`).toString().trim().split("\n").filter(Boolean);

function stripRscStylesheetDirectives(html) {
  let out = html;
  out = out.replace(/(\\n)?:HL\[\\"[^"\\]+\.css\\",\\"style\\"\](\\n)?/g, (_m, before) => before || "");
  out = out.replace(/\[\\"\$\\",\\"link\\",\\"0\\",\{\\"rel\\":\\"stylesheet\\"[^}]*\}\],?/g, "");
  return out;
}

function stripFrameworkScripts(html) {
  let out = html;
  // External Next.js chunk scripts
  out = out.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, "");
  out = out.replace(/<script[^>]*src="\/_next\/[^"]*"[^>]*\/>/g, "");
  // Framework inline scripts: __next_f.push, __next_set_public_path__, etc
  out = out.replace(/<script[^>]*>\s*\(self\.__next_f\s*=\s*self\.__next_f\s*\|\|\s*\[\]\)[\s\S]*?<\/script>/g, "");
  out = out.replace(/<script[^>]*>self\.__next_f\.push\([\s\S]*?\)<\/script>/g, "");
  // Sometimes: __next_set_inline_chunks__ or similar
  out = out.replace(/<script[^>]*>\s*\(\(\)\s*=>\s*\{\s*var\s+[a-z]\s*=[\s\S]*?\}\)\(\)\s*<\/script>/g, "");
  return out;
}

function stripRscStylesheetFromTxt(txt) {
  let out = txt;
  out = out.replace(/^:HL\["[^"]+\.css","style"\]\n?/gm, "");
  out = out.replace(/\["\$","link","0",\{"rel":"stylesheet"[^}]*\}\],?/g, "");
  return out;
}

let touched = 0;
for (const html of htmlPaths) {
  const original = await readFile(html, "utf8");
  let modified = original;
  modified = modified.replace(
    /<link rel="stylesheet" href="([^"]+\.css)"[^>]*\/?>(?:<\/link>)?/g,
    (match, href) => {
      const cssFile = join(outDir, href);
      const css = cssByFile.get(cssFile);
      if (!css) return match;
      return `<style data-inlined>${css}</style>`;
    }
  );
  modified = modified.replace(/<link rel="preload"[^>]*as="style"[^>]*\/?>/g, "");
  modified = modified.replace(/<link rel="preload"[^>]*as="script"[^>]*\/?>/g, "");
  modified = stripRscStylesheetDirectives(modified);
  modified = stripFrameworkScripts(modified);
  if (modified !== original) {
    await writeFile(html, modified);
    touched++;
  }
}

console.log(`Inlined CSS into ${touched} HTML files (${cssPaths.length} stylesheet(s)).`);

let txtTouched = 0;
for (const txt of txtPaths) {
  const original = await readFile(txt, "utf8");
  const modified = stripRscStylesheetFromTxt(original);
  if (modified !== original) {
    await writeFile(txt, modified);
    txtTouched++;
  }
}
console.log(`Stripped CSS hints from ${txtTouched} RSC text files.`);
