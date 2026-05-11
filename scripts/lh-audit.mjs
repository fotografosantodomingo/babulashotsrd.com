#!/usr/bin/env node
// Heuristic Lighthouse-style audit for statically-exported Next.js sites.
// Reads built HTML from `out/` directories and scores Performance / A11y / BP / SEO.
// Output: JSON to stdout, also writes per-page detail.

import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const PAGES = [
  // 8 representative URLs across all 5 sites (mix of homepage / article / gallery / locale / service)
  { id: "parent-home",        url: "https://babulashotsrd.com/",                                       file: "/Users/subdomainsbabulashots/Documents/parent/out/index.html",                                  site: "parent" },
  { id: "parent-en-home",     url: "https://babulashotsrd.com/en/",                                    file: "/Users/subdomainsbabulashots/Documents/parent/out/en/index.html",                               site: "parent" },
  { id: "parent-gallery",     url: "https://babulashotsrd.com/galeria-de-fotos/",                      file: "/Users/subdomainsbabulashots/Documents/parent/out/galeria-de-fotos/index.html",                 site: "parent" },
  { id: "parent-article",     url: "https://babulashotsrd.com/fotografo-de-bodas-en-republica-dominicana/", file: "/Users/subdomainsbabulashots/Documents/parent/out/fotografo-de-bodas-en-republica-dominicana/index.html", site: "parent" },
  { id: "estudio-home",       url: "https://estudio.babulashotsrd.com/",                               file: "/Users/subdomainsbabulashots/Documents/estudio/out/index.html",                                 site: "estudio" },
  { id: "boda-home",          url: "https://boda.babulashotsrd.com/",                                  file: "/Users/subdomainsbabulashots/Documents/boda/out/index.html",                                    site: "boda" },
  { id: "inmobiliaria-home",  url: "https://inmobiliaria.babulashotsrd.com/",                          file: "/Users/subdomainsbabulashots/Documents/inmobiliaria/out/index.html",                            site: "inmobiliaria" },
  { id: "drone-home",         url: "https://dron.babulashotsrd.com/",                                  file: "/Users/subdomainsbabulashots/Documents/drone/out/index.html",                                   site: "drone" },
  // Bonus context pages (not part of the 8 but counted toward systemic-issue detection)
  { id: "parent-blog",        url: "https://babulashotsrd.com/blog/",                                  file: "/Users/subdomainsbabulashots/Documents/parent/out/blog/index.html",                              site: "parent" },
  { id: "parent-fotografo",   url: "https://babulashotsrd.com/fotografo/",                             file: "/Users/subdomainsbabulashots/Documents/parent/out/fotografo/index.html",                         site: "parent" },
  { id: "estudio-en",         url: "https://estudio.babulashotsrd.com/en/",                            file: "/Users/subdomainsbabulashots/Documents/estudio/out/en/index.html",                              site: "estudio" },
  { id: "estudio-sesion",     url: "https://estudio.babulashotsrd.com/sesion-de-fotos/",               file: "/Users/subdomainsbabulashots/Documents/estudio/out/sesion-de-fotos/index.html",                  site: "estudio" },
  { id: "boda-en",            url: "https://boda.babulashotsrd.com/en/",                               file: "/Users/subdomainsbabulashots/Documents/boda/out/en/index.html",                                 site: "boda" },
  { id: "boda-servicios",     url: "https://boda.babulashotsrd.com/servicios/",                        file: "/Users/subdomainsbabulashots/Documents/boda/out/servicios/index.html",                          site: "boda" },
  { id: "inmobiliaria-en",    url: "https://inmobiliaria.babulashotsrd.com/en/",                       file: "/Users/subdomainsbabulashots/Documents/inmobiliaria/out/en/index.html",                         site: "inmobiliaria" },
  { id: "inmobiliaria-serv",  url: "https://inmobiliaria.babulashotsrd.com/servicios/",                file: "/Users/subdomainsbabulashots/Documents/inmobiliaria/out/servicios/index.html",                   site: "inmobiliaria" },
  { id: "drone-en",           url: "https://dron.babulashotsrd.com/en/",                               file: "/Users/subdomainsbabulashots/Documents/drone/out/en/index.html",                                 site: "drone" },
];

// --- Helpers ---------------------------------------------------------------
function attr(tagHtml, name) {
  const m = tagHtml.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? null;
}
function findAll(html, regex) {
  const out = []; let m;
  const r = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  while ((m = r.exec(html)) !== null) out.push(m);
  return out;
}

// --- Per-page audit --------------------------------------------------------
function audit(file, url) {
  const html = fs.readFileSync(file, "utf8");
  const bytes = Buffer.byteLength(html);
  const gzipBytes = zlib.gzipSync(html).length;

  const r = { url, file, bytes, gzipBytes, issues: [], details: {} };

  // ---- HEAD parsing ----
  const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
  const head = headMatch ? headMatch[1] : "";
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const lang = attr(htmlTag, "lang");
  r.details.lang = lang;
  if (!lang) r.issues.push({ cat: "seo", id: "html-has-lang", sev: "high", msg: "<html> missing lang attribute" });
  else {
    const expectEn = /\/en(\/|$)/.test(url) || /^https?:\/\/[^/]+\/en/.test(url);
    if (expectEn && !/^en/i.test(lang))
      r.issues.push({ cat: "seo", id: "lang-mismatch", sev: "high", msg: `EN page declares lang="${lang}" (should be "en")` });
    if (!expectEn && !/^(es|en)/i.test(lang))
      r.issues.push({ cat: "seo", id: "lang-mismatch", sev: "med", msg: `Unexpected lang="${lang}"` });
  }

  // Title
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  r.details.title = title;
  r.details.titleLen = title.length;
  if (!title) r.issues.push({ cat: "seo", id: "document-title", sev: "high", msg: "Missing <title>" });
  else if (title.length < 15) r.issues.push({ cat: "seo", id: "title-short", sev: "med", msg: `Title too short (${title.length} chars)` });
  else if (title.length > 70) r.issues.push({ cat: "seo", id: "title-long", sev: "low", msg: `Title may truncate (${title.length} chars)` });

  // Meta description
  const descTag = head.match(/<meta[^>]*\bname=["']description["'][^>]*>/i)?.[0] ?? "";
  const desc = descTag ? attr(descTag, "content") : null;
  r.details.descLen = desc ? desc.length : 0;
  if (!desc) r.issues.push({ cat: "seo", id: "meta-description", sev: "high", msg: "Missing <meta name=\"description\">" });
  else if (desc.length < 50) r.issues.push({ cat: "seo", id: "meta-desc-short", sev: "med", msg: `Description short (${desc.length} chars)` });
  else if (desc.length > 165) r.issues.push({ cat: "seo", id: "meta-desc-long", sev: "low", msg: `Description may truncate (${desc.length} chars)` });

  // Viewport
  const viewport = head.match(/<meta[^>]*\bname=["']viewport["'][^>]*>/i)?.[0];
  if (!viewport) r.issues.push({ cat: "seo", id: "viewport", sev: "high", msg: "Missing viewport meta" });
  else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\D|$)/i.test(viewport))
    r.issues.push({ cat: "a11y", id: "user-scalable", sev: "med", msg: "viewport blocks pinch-zoom" });

  // Theme color
  if (!/<meta[^>]*\bname=["']theme-color["']/i.test(head))
    r.issues.push({ cat: "bp", id: "theme-color", sev: "low", msg: "Missing <meta name=\"theme-color\">" });

  // Canonical
  if (!/<link[^>]*\brel=["']canonical["']/i.test(head))
    r.issues.push({ cat: "seo", id: "canonical", sev: "med", msg: "Missing canonical link" });

  // Hreflang
  const hreflangs = findAll(head, /<link[^>]*\brel=["']alternate["'][^>]*\bhreflang=["']([^"']+)["'][^>]*>/gi);
  r.details.hreflangs = hreflangs.map(m => m[1]);
  if (hreflangs.length === 0) r.issues.push({ cat: "seo", id: "hreflang-missing", sev: "med", msg: "No hreflang alternates" });
  else {
    const langs = new Set(hreflangs.map(m => m[1].toLowerCase()));
    if (!langs.has("x-default")) r.issues.push({ cat: "seo", id: "hreflang-no-xdefault", sev: "low", msg: "Missing hreflang=\"x-default\"" });
    if (!langs.has("es") && !langs.has("es-do")) r.issues.push({ cat: "seo", id: "hreflang-no-es", sev: "low", msg: "Missing hreflang=es" });
    if (!langs.has("en") && !langs.has("en-us")) r.issues.push({ cat: "seo", id: "hreflang-no-en", sev: "low", msg: "Missing hreflang=en" });
  }

  // Charset
  if (!/<meta[^>]*charset=/i.test(head)) r.issues.push({ cat: "bp", id: "charset", sev: "low", msg: "Missing <meta charset>" });

  // ---- Inline CSS ----
  const styles = findAll(html, /<style\b([^>]*)>([\s\S]*?)<\/style>/gi);
  const inlineCss = styles.map(m => m[2]).join("");
  const inlineCssBytes = Buffer.byteLength(inlineCss);
  r.details.inlineCssBytes = inlineCssBytes;
  r.details.inlineStyleBlocks = styles.length;
  const dataInlined = styles.filter(m => /data-inlined/i.test(m[1])).length;
  r.details.dataInlinedBlocks = dataInlined;
  if (inlineCssBytes > 50 * 1024) r.issues.push({ cat: "perf", id: "inline-css-large", sev: "med", msg: `Inline CSS ${(inlineCssBytes/1024).toFixed(1)}KB (>50KB hurts FCP on mobile)` });
  if (styles.length > 1) r.issues.push({ cat: "perf", id: "inline-css-fragmented", sev: "low", msg: `${styles.length} <style> blocks (post-build inlining should produce one)` });

  // font-display
  if (/@font-face/i.test(inlineCss) || /@import.*fonts/i.test(inlineCss)) {
    const ff = (inlineCss.match(/@font-face\s*{[^}]*}/gi) ?? []);
    const missingSwap = ff.filter(b => !/font-display\s*:\s*(swap|optional|fallback)/i.test(b));
    if (missingSwap.length) r.issues.push({ cat: "perf", id: "font-display", sev: "med", msg: `${missingSwap.length} @font-face without font-display:swap` });
  }
  // External font preconnect/preload
  const fontLinks = findAll(head, /<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/gi);
  if (fontLinks.length) {
    const hasPreconnect = fontLinks.some(m => /rel=["']preconnect["']/i.test(m[0]));
    if (!hasPreconnect) r.issues.push({ cat: "perf", id: "font-preconnect", sev: "low", msg: "Google Fonts referenced without preconnect" });
    const blocking = fontLinks.filter(m => /rel=["']stylesheet["']/i.test(m[0]) && !/media=["']print["']/i.test(m[0]));
    if (blocking.length) r.issues.push({ cat: "perf", id: "render-blocking-font-css", sev: "med", msg: "Google Fonts stylesheet is render-blocking" });
  }

  // Render-blocking external stylesheets
  const extCss = findAll(head, /<link[^>]*\brel=["']stylesheet["'][^>]*>/gi);
  const blockingCss = extCss.filter(m => !/media=["']print["']/i.test(m[0]) && !/disabled/i.test(m[0]));
  r.details.externalStylesheets = extCss.length;
  if (blockingCss.length > 0) r.issues.push({ cat: "perf", id: "render-blocking-css", sev: "med", msg: `${blockingCss.length} external render-blocking stylesheet(s)` });

  // Render-blocking scripts in head (no async/defer/module)
  const headScripts = findAll(head, /<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  const blockingJs = headScripts.filter(m => {
    const t = m[1];
    if (!/src\s*=/i.test(t)) return false; // inline scripts execute in order but typically small
    return !/\b(async|defer|type=["']module["'])/i.test(t);
  });
  if (blockingJs.length) r.issues.push({ cat: "perf", id: "render-blocking-js", sev: "high", msg: `${blockingJs.length} render-blocking external <script> in <head>` });

  // ---- JSON-LD ----
  const ldBlocks = findAll(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  r.details.jsonLdCount = ldBlocks.length;
  const ldTypes = [];
  let ldErrors = 0;
  for (const m of ldBlocks) {
    try {
      const j = JSON.parse(m[1]);
      const items = Array.isArray(j) ? j : [j];
      for (const it of items) {
        if (it && it["@graph"]) for (const g of it["@graph"]) ldTypes.push(g["@type"] ?? "?");
        else if (it) ldTypes.push(it["@type"] ?? "?");
      }
    } catch { ldErrors++; }
  }
  r.details.jsonLdTypes = ldTypes;
  if (ldErrors) r.issues.push({ cat: "seo", id: "jsonld-parse", sev: "high", msg: `${ldErrors} JSON-LD block(s) failed to parse` });
  if (!ldBlocks.length) r.issues.push({ cat: "seo", id: "jsonld-missing", sev: "med", msg: "No JSON-LD structured data" });

  // ---- Images ----
  const imgs = findAll(html, /<img\b([^>]*)>/gi);
  const imgStats = { total: imgs.length, missingAlt: 0, emptyAlt: 0, missingDims: 0, missingLoading: 0, missingDecoding: 0, eagerCount: 0, lazyCount: 0, fetchpriorityHigh: 0 };
  const imgIssueSamples = [];
  imgs.forEach((m, i) => {
    const t = m[1];
    const alt = attr(`<img ${t}>`, "alt");
    const w = attr(`<img ${t}>`, "width");
    const h = attr(`<img ${t}>`, "height");
    const loading = attr(`<img ${t}>`, "loading");
    const decoding = attr(`<img ${t}>`, "decoding");
    const fp = attr(`<img ${t}>`, "fetchpriority");
    const src = attr(`<img ${t}>`, "src") ?? attr(`<img ${t}>`, "data-src") ?? "(?)";
    if (alt === null) { imgStats.missingAlt++; if (imgIssueSamples.length < 3) imgIssueSamples.push({ k: "no-alt", src }); }
    else if (alt.trim() === "") imgStats.emptyAlt++;
    if (!w || !h) { imgStats.missingDims++; if (imgIssueSamples.length < 6) imgIssueSamples.push({ k: "no-dims", src }); }
    if (!loading) imgStats.missingLoading++;
    if (loading === "eager") imgStats.eagerCount++;
    if (loading === "lazy") imgStats.lazyCount++;
    if (!decoding) imgStats.missingDecoding++;
    if (fp === "high") imgStats.fetchpriorityHigh++;
  });
  r.details.images = imgStats;
  r.details.imgIssueSamples = imgIssueSamples;
  if (imgStats.missingAlt > 0) r.issues.push({ cat: "a11y", id: "image-alt", sev: "high", msg: `${imgStats.missingAlt}/${imgStats.total} <img> missing alt attribute` });
  if (imgStats.missingDims > 0) r.issues.push({ cat: "perf", id: "image-dims", sev: "high", msg: `${imgStats.missingDims}/${imgStats.total} <img> missing width/height (CLS risk)` });
  if (imgStats.total > 0 && imgStats.fetchpriorityHigh === 0) r.issues.push({ cat: "perf", id: "lcp-fetchpriority", sev: "med", msg: "No <img> has fetchpriority=\"high\" — LCP image not prioritised" });
  if (imgStats.total > 4 && imgStats.lazyCount === 0) r.issues.push({ cat: "perf", id: "image-lazy", sev: "low", msg: "No below-the-fold images use loading=\"lazy\"" });
  if (imgStats.missingDecoding > imgStats.total * 0.5) r.issues.push({ cat: "perf", id: "image-decoding", sev: "low", msg: "Most <img> missing decoding=\"async\"" });

  // ---- Headings ----
  const h1s = findAll(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  r.details.h1Count = h1s.length;
  if (h1s.length === 0) r.issues.push({ cat: "seo", id: "heading-h1", sev: "high", msg: "No <h1> on page" });
  else if (h1s.length > 1) r.issues.push({ cat: "a11y", id: "heading-multi-h1", sev: "low", msg: `${h1s.length} <h1> tags` });
  // Heading skip detection
  const headings = findAll(html, /<h([1-6])\b[^>]*>/gi).map(m => parseInt(m[1], 10));
  let skipped = false;
  for (let i = 1; i < headings.length; i++) if (headings[i] > headings[i-1] + 1) skipped = true;
  if (skipped) r.issues.push({ cat: "a11y", id: "heading-skip", sev: "low", msg: "Heading levels skipped (e.g. h2 -> h4)" });

  // ---- Links ----
  const links = findAll(html, /<a\b([^>]*)>([\s\S]*?)<\/a>/gi);
  let emptyLinks = 0, externalNoRel = 0;
  for (const m of links) {
    const attrs = m[1], body = m[2].replace(/<[^>]+>/g, "").trim();
    const aria = attr(`<a ${attrs}>`, "aria-label");
    const title = attr(`<a ${attrs}>`, "title");
    const href = attr(`<a ${attrs}>`, "href") ?? "";
    // image-only link: body has <img>, original had img with alt
    const hasImg = /<img\b/i.test(m[2]);
    const imgAlts = findAll(m[2], /<img\b[^>]*\balt=["']([^"']*)["']/gi);
    const imgHasAlt = imgAlts.some(x => x[1].trim().length > 0);
    if (!body && !aria && !title && !imgHasAlt && hasImg) emptyLinks++;
    if (!body && !aria && !title && !hasImg) emptyLinks++;
    if (/^https?:\/\//i.test(href) && /target=["']_blank["']/i.test(attrs) && !/rel=["'][^"']*noopener/i.test(attrs)) externalNoRel++;
  }
  if (emptyLinks > 0) r.issues.push({ cat: "a11y", id: "link-name", sev: "high", msg: `${emptyLinks} link(s) have no discernible name` });
  if (externalNoRel > 0) r.issues.push({ cat: "bp", id: "external-anchors-rel", sev: "low", msg: `${externalNoRel} external _blank link(s) without rel=noopener` });

  // ---- Buttons ----
  const buttons = findAll(html, /<button\b([^>]*)>([\s\S]*?)<\/button>/gi);
  let emptyBtns = 0;
  for (const m of buttons) {
    const body = m[2].replace(/<[^>]+>/g, "").trim();
    const aria = attr(`<button ${m[1]}>`, "aria-label");
    if (!body && !aria) emptyBtns++;
  }
  if (emptyBtns > 0) r.issues.push({ cat: "a11y", id: "button-name", sev: "high", msg: `${emptyBtns} <button> without accessible name` });

  // ---- Forms / inputs ----
  const inputs = findAll(html, /<(input|textarea|select)\b([^>]*)>/gi);
  let inputsNoLabel = 0;
  for (const m of inputs) {
    const a = m[2];
    if (/\btype=["'](hidden|submit|button|reset)["']/i.test(a)) continue;
    if (/aria-label/i.test(a) || /aria-labelledby/i.test(a)) continue;
    const id = attr(`<x ${a}>`, "id");
    if (id && new RegExp(`<label[^>]*\\bfor=["']${id}["']`, "i").test(html)) continue;
    inputsNoLabel++;
  }
  if (inputsNoLabel > 0) r.issues.push({ cat: "a11y", id: "label", sev: "high", msg: `${inputsNoLabel} form control(s) without label` });

  // ---- Color contrast heuristic ----
  // We can't compute real contrast without rendering, but we can flag known low-contrast tokens.
  // Look for --muted, color: gray, opacity below 0.6 on text, etc.
  const lowOpacityHits = (inlineCss.match(/\bopacity\s*:\s*0\.[0-4]\d*/g) ?? []).length;
  if (lowOpacityHits > 5) r.issues.push({ cat: "a11y", id: "color-contrast-opacity", sev: "low", msg: `${lowOpacityHits} CSS rules with opacity<0.5 (potential contrast)` });

  // ---- Misc best-practice ----
  if (!/https:\/\//.test(url)) r.issues.push({ cat: "bp", id: "is-on-https", sev: "high", msg: "Not HTTPS" });
  if (/<script\b[^>]*>[\s\S]*document\.write/i.test(html)) r.issues.push({ cat: "bp", id: "document-write", sev: "med", msg: "document.write() detected" });

  // ---- Score categories (heuristic 0-100) ----
  function score(cat, weights) {
    let penalty = 0;
    for (const it of r.issues.filter(i => i.cat === cat)) {
      penalty += weights[it.sev] ?? 0;
    }
    return Math.max(0, Math.min(100, 100 - penalty));
  }
  const perfWeights = { high: 12, med: 6, low: 2 };
  const a11yWeights = { high: 10, med: 5, low: 2 };
  const bpWeights = { high: 15, med: 8, low: 3 };
  const seoWeights = { high: 10, med: 5, low: 2 };

  const mobilePerfPenaltyExtra = (() => {
    let p = 0;
    if (r.details.inlineCssBytes > 30 * 1024) p += 3;
    if (r.details.inlineCssBytes > 60 * 1024) p += 4;
    if (imgStats.total > 25) p += 3;
    if (bytes > 100 * 1024) p += 3;
    return p;
  })();

  const desktopPerfPenaltyExtra = (() => {
    let p = 0;
    if (r.details.inlineCssBytes > 60 * 1024) p += 2;
    if (imgStats.total > 40) p += 2;
    return p;
  })();

  r.scores = {
    mobile: {
      performance: Math.max(0, score("perf", perfWeights) - mobilePerfPenaltyExtra),
      accessibility: score("a11y", a11yWeights),
      bestPractices: score("bp", bpWeights),
      seo: score("seo", seoWeights),
    },
    desktop: {
      performance: Math.max(0, score("perf", perfWeights) - desktopPerfPenaltyExtra + 2),
      accessibility: score("a11y", a11yWeights),
      bestPractices: score("bp", bpWeights),
      seo: score("seo", seoWeights),
    },
  };

  return r;
}

// --- Run -------------------------------------------------------------------
const results = [];
for (const p of PAGES) {
  try {
    const r = audit(p.file, p.url);
    r.id = p.id; r.site = p.site;
    results.push(r);
  } catch (e) {
    results.push({ id: p.id, url: p.url, site: p.site, error: String(e) });
  }
}

// --- Aggregate -------------------------------------------------------------
const issueIndex = {};
for (const r of results) {
  for (const it of r.issues ?? []) {
    const k = it.id;
    if (!issueIndex[k]) issueIndex[k] = { id: k, cat: it.cat, sev: it.sev, pages: [], examples: [] };
    issueIndex[k].pages.push(r.id);
    if (issueIndex[k].examples.length < 3) issueIndex[k].examples.push({ page: r.id, msg: it.msg });
  }
}
const systemicIssues = Object.values(issueIndex).sort((a, b) => b.pages.length - a.pages.length);

const siteAvg = {};
for (const r of results) {
  if (!r.scores) continue;
  if (!siteAvg[r.site]) siteAvg[r.site] = { pages: 0, sum: { mP:0,mA:0,mB:0,mS:0, dP:0,dA:0,dB:0,dS:0 } };
  const s = siteAvg[r.site]; s.pages++;
  s.sum.mP += r.scores.mobile.performance; s.sum.mA += r.scores.mobile.accessibility; s.sum.mB += r.scores.mobile.bestPractices; s.sum.mS += r.scores.mobile.seo;
  s.sum.dP += r.scores.desktop.performance; s.sum.dA += r.scores.desktop.accessibility; s.sum.dB += r.scores.desktop.bestPractices; s.sum.dS += r.scores.desktop.seo;
}
const siteAverages = {};
for (const [site, v] of Object.entries(siteAvg)) {
  const n = v.pages;
  siteAverages[site] = {
    pages: n,
    mobile:  { performance: +(v.sum.mP/n).toFixed(1), accessibility: +(v.sum.mA/n).toFixed(1), bestPractices: +(v.sum.mB/n).toFixed(1), seo: +(v.sum.mS/n).toFixed(1) },
    desktop: { performance: +(v.sum.dP/n).toFixed(1), accessibility: +(v.sum.dA/n).toFixed(1), bestPractices: +(v.sum.dB/n).toFixed(1), seo: +(v.sum.dS/n).toFixed(1) },
  };
}

const out = { generatedAt: new Date().toISOString(), pages: results, systemicIssues, siteAverages };
process.stdout.write(JSON.stringify(out, null, 2));
