#!/usr/bin/env python3
"""
Audit script for https://babulashotsrd.pages.dev

Usage: python3 scrape/verify-all.py
Outputs: /Users/subdomainsbabulashots/Documents/parent/VERIFICATION-REPORT.md
"""
import json
import re
import sys
import time
import html as htmlmod
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse, urljoin
from pathlib import Path
from collections import defaultdict

try:
    import requests
    HAVE_REQUESTS = True
except ImportError:
    HAVE_REQUESTS = False
    import urllib.request
    import urllib.error

BASE = "https://babulashotsrd.pages.dev"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
ROOT = Path("/Users/subdomainsbabulashots/Documents/parent")
URL_MAP = ROOT / "scrape/raw/url-map.json"
EN_CONTENT = ROOT / "lib/enContent.ts"
REPORT_PATH = ROOT / "VERIFICATION-REPORT.md"

WORKERS = 10
TIMEOUT = 30

SES_LOCK = None


def make_session():
    if not HAVE_REQUESTS:
        return None
    s = requests.Session()
    s.headers.update({
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    })
    return s


def http_get(session, url, allow_redirects=True, head=False, retries=2):
    """Returns (status, final_url, body_text, headers) or (None, None, None, None) on failure."""
    last_err = None
    for attempt in range(retries + 1):
        try:
            if HAVE_REQUESTS:
                method = session.head if head else session.get
                r = method(url, allow_redirects=allow_redirects, timeout=TIMEOUT)
                body = "" if head else r.text
                return r.status_code, r.url, body, dict(r.headers)
            else:
                req = urllib.request.Request(url, headers={"User-Agent": UA})
                if head:
                    req.get_method = lambda: "HEAD"
                with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                    body = "" if head else resp.read().decode("utf-8", errors="replace")
                    return resp.status, resp.url, body, dict(resp.headers)
        except Exception as e:
            last_err = e
            time.sleep(0.5 * (attempt + 1))
    return None, None, None, {"_error": str(last_err)}


# --- Parsing helpers ---

def find_tag(html, tag):
    """Return the text content of the first <tag>...</tag> match."""
    m = re.search(r"<" + tag + r"[^>]*>(.*?)</" + tag + r">", html, re.S | re.I)
    return m.group(1).strip() if m else None


def find_meta(html, name):
    m = re.search(
        r'<meta[^>]+name=["\']' + re.escape(name) + r'["\'][^>]*content=["\']([^"\']*)["\']',
        html, re.I)
    if m:
        return m.group(1)
    m = re.search(
        r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*name=["\']' + re.escape(name) + r'["\']',
        html, re.I)
    return m.group(1) if m else None


def find_html_lang(html):
    m = re.search(r'<html[^>]*\blang=["\']([^"\']+)["\']', html, re.I)
    return m.group(1) if m else None


def find_h1s(html):
    return re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S | re.I)


def find_hreflang_links(html):
    """Return list of (hreflang, href) tuples."""
    out = []
    for m in re.finditer(r'<link[^>]+rel=["\']alternate["\'][^>]*>', html, re.I):
        tag = m.group(0)
        hl = re.search(r'hreflang=["\']([^"\']+)["\']', tag, re.I)
        hr = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
        if hl and hr:
            out.append((hl.group(1), hr.group(1)))
    return out


def find_jsonld_blocks(html):
    blocks = []
    for m in re.finditer(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                         html, re.S | re.I):
        raw = m.group(1).strip()
        try:
            blocks.append(json.loads(raw))
        except Exception:
            blocks.append({"__parse_error__": True, "__raw__": raw[:200]})
    return blocks


def strip_tags(html):
    # Remove scripts/styles fully
    html = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    html = re.sub(r"<style[\s\S]*?</style>", " ", html, flags=re.I)
    # Remove tags
    text = re.sub(r"<[^>]+>", " ", html)
    text = htmlmod.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def find_body_text(html):
    bm = re.search(r"<body[^>]*>([\s\S]*?)</body>", html, re.I)
    body = bm.group(1) if bm else html
    return strip_tags(body)


def find_gallery_links(html):
    # Look for <a class="gallery-link" ... href="...">
    out = []
    for m in re.finditer(r'<a[^>]+class=["\'][^"\']*gallery-link[^"\']*["\'][^>]*>',
                         html, re.I):
        tag = m.group(0)
        hr = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
        if hr:
            out.append(hr.group(1))
    return out


def find_gallery_items(html):
    return re.findall(r'<figure[^>]+class=["\'][^"\']*gallery-item[^"\']*["\']', html, re.I)


def find_lang_switcher_href(html, target_lang):
    """Find <a class="lang-link" data-lang-link="en|es"> and return href."""
    for m in re.finditer(r'<a[^>]+class=["\'][^"\']*lang-link[^"\']*["\'][^>]*>', html, re.I):
        tag = m.group(0)
        if re.search(r'data-lang-link=["\']' + re.escape(target_lang) + r'["\']', tag, re.I):
            hr = re.search(r'href=["\']([^"\']+)["\']', tag, re.I)
            if hr:
                return hr.group(1)
    return None


# --- Language detection ---

SPANISH_HINTS = re.compile(
    r"\b(fotograf[ií]a|fot[oó]grafo|estudio|servicio|servicios|para|con|nuestra|profesional|sesi[oó]n|reserva|cotizaci[oó]n|galer[ií]a|haz clic|ver m[aá]s|precios|contenido|matrimonio|boda|playa|novios)\b",
    re.I)
ENGLISH_HINTS = re.compile(
    r"\b(photography|photographer|studio|wedding|service|professional|book|gallery|click|see more|our|with|for|prices|content|booking)\b",
    re.I)
EN_GIVEAWAY_IN_ES = re.compile(
    r"\b(Photo gallery|Wedding photographer|How it works|Book your session|From the first message|Book now|Services and prices|Professional content)\b",
    re.I)
# Spanish-only phrases/words that should NEVER appear on an EN page (header/footer/CTA leftovers)
ES_GIVEAWAY_IN_EN = re.compile(
    r"(Reserva\s+(?:tu\s+sesi[oó]n|Estudio|Ahora|ahora|estudio)"
    r"|Galer[ií]a\s+de\s+[Ff]otos"
    r"|Cotizaci[oó]n"
    r"|Haz\s+clic"
    r"|Ver\s+m[aá]s"
    r"|Servicio[s]?\s+(?:profesional|y\s+precios)"
    r"|Contenido\s+Profesional"
    r"|Estudio\s+fotografico"
    r"|fot[oó]graf[oa]\s+profesional"
    r"|Sesi[oó]n\s+de\s+[Ff]otos)",
    re.I)


def detect_lang_problems(expected_lang, title, h1, body_excerpt):
    """Returns list of issues."""
    issues = []
    combined = " ".join([title or "", h1 or "", body_excerpt or ""])

    if expected_lang == "es":
        es_hits = len(SPANISH_HINTS.findall(combined))
        en_giveaway = EN_GIVEAWAY_IN_ES.search(combined)
        if es_hits < 2:
            issues.append(f"ES page has too few Spanish indicators (got {es_hits})")
        if en_giveaway:
            issues.append(f"ES page contains English giveaway phrase: '{en_giveaway.group(0)}'")
    else:  # en
        en_hits = len(ENGLISH_HINTS.findall(combined))
        es_giveaway = ES_GIVEAWAY_IN_EN.search(combined)
        # Also check title doesn't contain Spanish
        if en_hits < 2:
            issues.append(f"EN page has too few English indicators (got {en_hits})")
        if es_giveaway:
            issues.append(f"EN page contains Spanish giveaway phrase: '{es_giveaway.group(0)}'")
        # Title-specific checks
        if title and re.search(r"\b(fotograf[ií]a|fot[oó]grafo|sesi[oó]n|reserva)\b", title, re.I):
            issues.append(f"EN page title contains Spanish: '{title[:80]}'")
        if h1 and re.search(r"\b(fotograf[ií]a|fot[oó]grafo|sesi[oó]n|reserva)\b", h1, re.I):
            issues.append(f"EN page h1 contains Spanish: '{h1[:80]}'")
    return issues


# --- Issue accumulator ---

class IssueLog:
    def __init__(self):
        self.by_category = defaultdict(list)  # cat -> list of (url, issue, fix)
        self.pages_with_issues = set()
        self.pages_checked = set()

    def add(self, url, category, issue, fix):
        self.by_category[category].append((url, issue, fix))
        self.pages_with_issues.add(url)

    def visited(self, url):
        self.pages_checked.add(url)


# --- Per-page check ---

CATEGORIES = [
    "HTTP & basics",
    "Language correctness",
    "Hreflang reciprocity",
    "Brand consistency",
    "Schema correctness",
    "Content presence",
    "Switcher correctness",
    "Gallery special checks",
]


def check_page(session, path, expected_lang, en_mirror_map, es_mirror_map, log):
    url = BASE + path
    log.visited(url)

    status, final_url, body, headers = http_get(session, url)
    if status is None:
        log.add(url, "HTTP & basics", f"Fetch failed: {headers.get('_error') if headers else 'unknown'}",
                "Retry; check deployment availability")
        return None

    if status != 200:
        log.add(url, "HTTP & basics", f"HTTP {status} (final URL: {final_url})",
                "Fix the route or remove from inventory")
        if status >= 400:
            return None
    if body is None or len(body) < 200:
        log.add(url, "HTTP & basics", f"Empty/very short response ({len(body) if body else 0} bytes)",
                "Inspect the build output for this route")
        return None

    # A. HTTP & basics
    html_lang = find_html_lang(body)
    expected_html_lang = "es-DO" if expected_lang == "es" else "en"
    if not html_lang:
        log.add(url, "HTTP & basics", "<html> has no lang attribute",
                f"Add lang=\"{expected_html_lang}\" to <html>")
    elif expected_lang == "es" and not html_lang.lower().startswith("es"):
        log.add(url, "HTTP & basics", f"<html lang=\"{html_lang}\"> on ES page",
                "Set lang to 'es-DO'")
    elif expected_lang == "en" and not html_lang.lower().startswith("en"):
        log.add(url, "HTTP & basics", f"<html lang=\"{html_lang}\"> on EN page",
                "Set lang to 'en'")

    title = find_tag(body, "title")
    if not title:
        log.add(url, "HTTP & basics", "Missing <title>", "Add a <title> tag")
    elif len(title) < 5:
        log.add(url, "HTTP & basics", f"Title too short: '{title}'", "Write a real title")

    desc = find_meta(body, "description")
    if not desc:
        log.add(url, "HTTP & basics", "Missing meta description", "Add <meta name=\"description\">")
    elif len(desc) < 10:
        log.add(url, "HTTP & basics", f"Meta description too short ({len(desc)} chars)",
                "Write a description of 50+ chars")

    h1s = find_h1s(body)
    if len(h1s) == 0:
        log.add(url, "HTTP & basics", "No <h1> found", "Add exactly one <h1>")
    elif len(h1s) > 1:
        log.add(url, "HTTP & basics", f"Multiple <h1> tags ({len(h1s)})", "Keep only one <h1>")

    h1_text = strip_tags(h1s[0]) if h1s else ""

    # B. Language correctness
    body_text = find_body_text(body)
    # Check both early excerpt (header/hero) and full body for giveaway phrases
    body_excerpt = body_text[:1500]
    lang_issues = detect_lang_problems(expected_lang, title or "", h1_text, body_excerpt)
    # Additional pass: scan FULL body text for giveaway phrases (header/footer/CTA leftovers)
    if expected_lang == "en":
        m = ES_GIVEAWAY_IN_EN.search(body_text)
        if m and not any("Spanish giveaway" in li for li in lang_issues):
            lang_issues.append(f"EN page contains Spanish giveaway phrase: '{m.group(0)}'")
    else:
        m = EN_GIVEAWAY_IN_ES.search(body_text)
        if m and not any("English giveaway" in li for li in lang_issues):
            lang_issues.append(f"ES page contains English giveaway phrase: '{m.group(0)}'")
    # Also check OG title/description meta for language mix
    og_title = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', body, re.I)
    og_desc = re.search(r'<meta[^>]+property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\']', body, re.I)
    if expected_lang == "en":
        if og_title and re.search(r"\b(fotograf[ií]a|fot[oó]grafo|sesi[oó]n|reserva|estudio fotografico)\b", og_title.group(1), re.I):
            lang_issues.append(f"EN page og:title contains Spanish: '{og_title.group(1)[:80]}'")
        if og_desc and re.search(r"\b(fotograf[ií]a|fot[oó]grafo|sesi[oó]n|reserva|estudio fotografico)\b", og_desc.group(1), re.I):
            lang_issues.append(f"EN page og:description contains Spanish")
    for li in lang_issues:
        log.add(url, "Language correctness", li,
                "Translate the offending content; check shared header/footer components")

    # C. Hreflang
    hreflangs = find_hreflang_links(body)
    hl_map = {hl.lower(): href for hl, href in hreflangs}
    if expected_lang == "es":
        if "en" not in hl_map:
            log.add(url, "Hreflang reciprocity", "Missing hrefLang=\"en\" alternate",
                    "Add <link rel=\"alternate\" hreflang=\"en\" href=\"...\">")
    else:
        if not any(k in hl_map for k in ("es-do", "es")):
            log.add(url, "Hreflang reciprocity", "Missing hrefLang=\"es-DO\" alternate",
                    "Add <link rel=\"alternate\" hreflang=\"es-DO\" href=\"...\">")

    # D. Brand consistency
    # Look in the header region (first 4000 chars typically contains header)
    header_chunk = body[:6000]
    if "brand-logo" not in header_chunk:
        log.add(url, "Brand consistency", "No img.brand-logo in header",
                "Restore <img class=\"brand-logo\"> in the header component")
    if "Babula Shots RD" not in body:
        log.add(url, "Brand consistency", "Brand text 'Babula Shots RD' missing from page",
                "Ensure header renders 'Babula Shots RD'")
    if re.search(r"By Babula Shots\b(?! RD)", body):
        log.add(url, "Brand consistency", "Leftover 'By Babula Shots' text found",
                "Replace with 'Babula Shots RD'")
    if re.search(r"Estudio fotografico", body, re.I):
        # Only flag if in header area
        if "Estudio fotografico" in header_chunk:
            log.add(url, "Brand consistency", "Leftover 'Estudio fotografico' in header",
                    "Remove legacy 'Estudio fotografico' string from header")

    # E. Schema
    jsonld = find_jsonld_blocks(body)
    if not jsonld:
        log.add(url, "Schema correctness", "No JSON-LD schema block found",
                "Add at least one <script type=\"application/ld+json\"> block")
    else:
        parse_errors = [b for b in jsonld if isinstance(b, dict) and b.get("__parse_error__")]
        if parse_errors:
            log.add(url, "Schema correctness",
                    f"JSON-LD failed to parse ({len(parse_errors)} block(s))",
                    "Fix the JSON syntax in the schema script tag")
        # inLanguage check
        if expected_lang == "en":
            found_en = False
            for b in jsonld:
                if isinstance(b, dict) and b.get("__parse_error__"):
                    continue
                serial = json.dumps(b, ensure_ascii=False)
                if '"inLanguage": "en"' in serial or '"inLanguage":"en"' in serial:
                    found_en = True
                    break
            if not found_en:
                log.add(url, "Schema correctness", "No schema with inLanguage='en'",
                        "Add inLanguage:'en' to the primary schema object")
        else:
            # es-DO ideal
            for b in jsonld:
                if isinstance(b, dict) and b.get("__parse_error__"):
                    continue
                serial = json.dumps(b, ensure_ascii=False)
                if '"inLanguage": "en"' in serial or '"inLanguage":"en"' in serial:
                    log.add(url, "Schema correctness",
                            "ES page schema has inLanguage='en'",
                            "Set inLanguage to 'es-DO' or 'es' on ES pages")
                    break

    # F. Content presence
    if 'data:image/svg+xml' in body:
        log.add(url, "Content presence", "data:image/svg+xml placeholder leaked into HTML",
                "Hydrate foogallery images before build (replace placeholder src)")
    if 'data-src-fg=' in body:
        log.add(url, "Content presence", "data-src-fg= attribute remains",
                "Convert foogallery lazy-load to plain src= before build")

    # G. Switcher correctness
    if expected_lang == "es":
        en_href = find_lang_switcher_href(body, "en")
        expected_en = en_mirror_map.get(path)
        if expected_en:
            if not en_href:
                log.add(url, "Switcher correctness",
                        f"Missing EN language switcher (expected {expected_en})",
                        "Render .lang-link[data-lang-link=en] with the mirror path")
            else:
                # Normalize
                norm = en_href.replace(BASE, "").split("?")[0].split("#")[0]
                if not norm.endswith("/") and "/" in norm:
                    norm = norm + "/"
                if norm != expected_en and en_href != expected_en:
                    # Allow fully qualified URL too
                    if not en_href.endswith(expected_en) and en_href != BASE + expected_en:
                        log.add(url, "Switcher correctness",
                                f"EN switcher href is '{en_href}', expected '{expected_en}'",
                                "Fix the language switcher mapping in shared header")
        else:
            # No mirror; switcher should fall back to /en/
            if en_href and en_href not in ("/en/", BASE + "/en/", BASE + "/en"):
                # That's fine if it points somewhere sensible; only flag if clearly wrong
                pass
    else:  # en page
        es_href = find_lang_switcher_href(body, "es") or find_lang_switcher_href(body, "es-DO")
        expected_es = es_mirror_map.get(path)
        if expected_es:
            if not es_href:
                log.add(url, "Switcher correctness",
                        f"Missing ES language switcher (expected {expected_es})",
                        "Render .lang-link[data-lang-link=es] with the mirror path")
            else:
                norm = es_href.replace(BASE, "").split("?")[0].split("#")[0]
                if norm != expected_es and es_href != expected_es:
                    if not es_href.endswith(expected_es) and es_href != BASE + expected_es:
                        log.add(url, "Switcher correctness",
                                f"ES switcher href is '{es_href}', expected '{expected_es}'",
                                "Fix the language switcher mapping in shared header")

    # Sample wp-content image check (5 per page)
    wp_imgs = re.findall(r'src=["\'](/wp-content/[^"\']+)["\']', body)
    sampled = wp_imgs[:5]
    return {
        "url": url,
        "path": path,
        "expected_lang": expected_lang,
        "hreflangs": hreflangs,
        "wp_imgs": sampled,
        "body_len": len(body),
        "is_gallery": path in ("/galeria-de-fotos/", "/en/photogallery/"),
        "body": body,
    }


def check_gallery(session, page_info, log):
    body = page_info["body"]
    url = page_info["url"]
    expected_lang = page_info["expected_lang"]

    items = find_gallery_items(body)
    if len(items) != 17:
        log.add(url, "Gallery special checks",
                f"Found {len(items)} <figure.gallery-item> tiles (expected 17)",
                "Restore the 17 gallery tiles in the data source")

    links = find_gallery_links(body)
    if len(links) < 17:
        log.add(url, "Gallery special checks",
                f"Only {len(links)} <a.gallery-link> wrappers (expected 17)",
                "Ensure every <figure.gallery-item> is wrapped in <a class=gallery-link>")

    # Validate each link resolves
    for href in links[:17]:
        target = href if href.startswith("http") else BASE + href
        # EN page rule
        if expected_lang == "en":
            if not (href.startswith("/en/") or "estudio.babulashotsrd.com/en/" in href):
                log.add(url, "Gallery special checks",
                        f"EN gallery link points to non-EN URL: {href}",
                        "Point to /en/... or https://estudio.babulashotsrd.com/en/...")
        # HEAD/GET to check 200
        st, fu, _, hdrs = http_get(session, target, allow_redirects=True, head=True)
        if st is None:
            log.add(url, "Gallery special checks",
                    f"Gallery link unreachable: {href} ({hdrs.get('_error') if hdrs else ''})",
                    "Fix or remove the dead gallery link")
        elif st != 200:
            log.add(url, "Gallery special checks",
                    f"Gallery link {href} returns HTTP {st} (final: {fu})",
                    "Update href to the live URL")


# --- Hreflang reciprocity (post-pass) ---

def verify_reciprocity(session, all_results, log):
    # Build map: url -> hreflangs
    page_map = {}
    for r in all_results:
        if r is None:
            continue
        page_map[r["url"]] = {hl.lower(): href for hl, href in r["hreflangs"]}

    for url, hl_map in page_map.items():
        for hl, target in hl_map.items():
            if hl in ("x-default",):
                continue
            target_norm = target.split("#")[0]
            # Only verify reciprocity for targets on this deployment
            if target_norm.startswith(BASE) or target_norm.startswith("/"):
                target_url = target_norm if target_norm.startswith("http") else BASE + target_norm
                # If we already have it in page_map, check there
                if target_url in page_map:
                    target_hl = page_map[target_url]
                    # The target should link back to url with some hreflang
                    back_refs = set(target_hl.values())
                    norm_back_refs = set()
                    for v in back_refs:
                        if v.startswith("/"):
                            norm_back_refs.add(BASE + v.split("#")[0])
                        else:
                            norm_back_refs.add(v.split("#")[0])
                    if url not in norm_back_refs:
                        log.add(url, "Hreflang reciprocity",
                                f"Hreflang '{hl}' points to {target_url} but target doesn't link back",
                                "Make hreflang links bidirectional")


# --- Main ---

def load_inventory():
    data = json.loads(URL_MAP.read_text())
    es_paths = list(data["keep"])
    if "/" not in es_paths:
        es_paths.insert(0, "/")

    en_text = EN_CONTENT.read_text()
    # The TS file has both type defs (enPath: string;) and quoted values ("enPath": "...")
    en_paths = re.findall(r'"enPath":\s*"([^"]+)"', en_text)
    # Also try the other format
    en_paths += re.findall(r'enPath:\s*"([^"]+)"', en_text)
    en_paths = sorted(set(en_paths))

    # Add hardcoded EN-only paths
    extra_en = ["/en/", "/en/photogallery/"]
    extra_es = ["/galeria-de-fotos/"]
    for p in extra_en:
        if p not in en_paths:
            en_paths.append(p)
    for p in extra_es:
        if p not in es_paths:
            es_paths.append(p)

    # Build mirror maps
    es_to_en = {}
    en_to_es = {}
    # Parse pairs from enContent.ts: each object key (es path) -> enPath value
    # Object literal: "ESPATH": { ...enPath: "/en/..."... }
    pair_pattern = re.compile(
        r'"(/[^"]*)":\s*\{[^{}]*?"enPath":\s*"([^"]+)"', re.S)
    for m in pair_pattern.finditer(en_text):
        es_to_en[m.group(1)] = m.group(2)
        en_to_es[m.group(2)] = m.group(1)
    # Also map known specials
    es_to_en.setdefault("/", "/en/")
    en_to_es.setdefault("/en/", "/")
    es_to_en.setdefault("/galeria-de-fotos/", "/en/photogallery/")
    en_to_es.setdefault("/en/photogallery/", "/galeria-de-fotos/")

    return es_paths, en_paths, es_to_en, en_to_es


def main():
    print(f"Auditing deployment: {BASE}")
    es_paths, en_paths, es_to_en, en_to_es = load_inventory()
    print(f"ES paths: {len(es_paths)}  EN paths: {len(en_paths)}")

    log = IssueLog()
    session = make_session()
    results = []

    tasks = [(p, "es") for p in es_paths] + [(p, "en") for p in en_paths]
    print(f"Total pages to check: {len(tasks)}")

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(check_page, session, p, lang, es_to_en, en_to_es, log): (p, lang)
                   for p, lang in tasks}
        done = 0
        for fut in as_completed(futures):
            p, lang = futures[fut]
            try:
                r = fut.result()
                if r:
                    results.append(r)
            except Exception as e:
                log.add(BASE + p, "HTTP & basics", f"Exception during check: {e}",
                        "Investigate the error")
            done += 1
            if done % 25 == 0:
                print(f"  {done}/{len(tasks)} pages checked", flush=True)

    print("Running hreflang reciprocity pass...")
    verify_reciprocity(session, results, log)

    print("Running gallery checks...")
    for r in results:
        if r and r["is_gallery"]:
            check_gallery(session, r, log)

    # Sample wp-content image checks (small subset to keep bounded)
    print("Spot-checking wp-content images...")
    checked_imgs = set()
    img_check_limit = 0
    for r in results:
        if not r:
            continue
        for img in r["wp_imgs"]:
            full = BASE + img
            if full in checked_imgs:
                continue
            checked_imgs.add(full)
            img_check_limit += 1
            if img_check_limit > 150:
                break
            st, fu, _, hdrs = http_get(session, full, head=True)
            if st is None:
                log.add(r["url"], "Content presence",
                        f"Image fetch failed: {img}",
                        "Re-mirror or fix the image path")
            elif st != 200:
                log.add(r["url"], "Content presence",
                        f"Image {img} returns HTTP {st}",
                        "Re-mirror or fix the image path")
        if img_check_limit > 150:
            break

    write_report(log, len(tasks))
    print(f"\nReport written to: {REPORT_PATH}")
    # Print quick summary
    total = len(log.pages_checked)
    with_issues = len(log.pages_with_issues)
    print(f"Pages checked: {total}  Pages with >=1 issue: {with_issues}")
    for cat in CATEGORIES:
        n = len(log.by_category.get(cat, []))
        print(f"  {cat}: {n}")


def write_report(log, total_pages):
    lines = []
    lines.append(f"# Verification Report — {BASE}")
    lines.append("")
    lines.append(f"_Audit date: 2026-05-10_")
    lines.append("")
    total_checked = len(log.pages_checked)
    with_issues = len(log.pages_with_issues)
    clean = total_checked - with_issues
    pct_clean = (100.0 * clean / total_checked) if total_checked else 0.0

    lines.append("## Summary")
    lines.append("")
    lines.append("| Metric | Value |")
    lines.append("|---|---|")
    lines.append(f"| Deployment | {BASE} |")
    lines.append(f"| Total pages checked | {total_checked} |")
    lines.append(f"| Pages with >=1 issue | {with_issues} |")
    lines.append(f"| Clean pages | {clean} ({pct_clean:.1f}%) |")
    lines.append("")
    lines.append("### Issues by category")
    lines.append("")
    lines.append("| Category | Count |")
    lines.append("|---|---|")
    for cat in CATEGORIES:
        n = len(log.by_category.get(cat, []))
        lines.append(f"| {cat} | {n} |")
    lines.append("")

    for cat in CATEGORIES:
        items = log.by_category.get(cat, [])
        lines.append(f"## {cat} ({len(items)})")
        lines.append("")
        if not items:
            lines.append("_No issues found._")
            lines.append("")
            continue
        # Group identical issues by URL to keep it readable
        # But spec says "for each issue, include page URL / issue / fix"
        for url, issue, fix in items:
            lines.append(f"- **{url}**")
            lines.append(f"  - Issue: {issue}")
            lines.append(f"  - Fix: {fix}")
        lines.append("")

    REPORT_PATH.write_text("\n".join(lines))


if __name__ == "__main__":
    main()
