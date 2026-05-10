/**
 * Babula Shots Network — shared Worker.
 *
 * Bound to route: *://*.babulashotsrd.com/*
 * Requires: zone `babulashotsrd.com` on this Cloudflare account.
 *
 * Responsibilities:
 *   1. Theme cookie API     POST /api/theme   { theme: "dark"|"light" }
 *                           GET  /api/theme   → { theme }
 *      Sets cookie on `.babulashotsrd.com` so toggling on one subdomain
 *      reflects on all (estudio, boda, inmobiliaria, dron, root).
 *
 *   2. URL redirects fallback — Pages already runs _redirects. If a request
 *      reaches the Worker without matching a Pages rule, we re-check our
 *      master url-map.json (embedded). Belt + suspenders.
 *
 *   3. Hreflang resolver    GET /api/hreflang?path=/x/
 *      Returns { es, en, "x-default" } for a path on the current host.
 *
 *   4. Pass everything else to the underlying Pages project (env.ASSETS).
 */

const COOKIE_NAME = "babula_theme";
const COOKIE_DOMAIN = ".babulashotsrd.com";
const ALLOWED_ORIGINS = new Set([
  "https://babulashotsrd.com",
  "https://www.babulashotsrd.com",
  "https://boda.babulashotsrd.com",
  "https://estudio.babulashotsrd.com",
  "https://inmobiliaria.babulashotsrd.com",
  "https://dron.babulashotsrd.com"
]);

// Edge-level cross-domain redirects (mirror of /public/_redirects, kept here as
// fallback in case Pages routing misses).
const CROSS_DOMAIN_PARENT_REDIRECTS = {
  // Studio-themed
  "/sesion-de-fotos/":       "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  "/estudio/":               "https://estudio.babulashotsrd.com/",
  "/fotografo-en-estudio-santo-domingo/": "https://estudio.babulashotsrd.com/sesion-de-fotos/",
  // Wedding-themed
  "/fotografo-de-bodas-santo-domingo/":   "https://boda.babulashotsrd.com/",
  "/fotografo-de-bodas-en-republica-dominicana/": "https://boda.babulashotsrd.com/",
  // Drone-themed
  "/drone-republica-dominicana/":         "https://dron.babulashotsrd.com/",
  // Real estate
  "/real-estate-fotografo-pro/":          "https://inmobiliaria.babulashotsrd.com/"
  // (Full list — 105 rules — lives in /public/_redirects)
};

function corsHeaders(origin) {
  const h = { "Vary": "Origin" };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Credentials"] = "true";
    h["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    h["Access-Control-Allow-Headers"] = "Content-Type";
  }
  return h;
}

function readCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function handleTheme(request) {
  const origin = request.headers.get("Origin");
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (request.method === "GET") {
    const theme = readCookie(request, COOKIE_NAME);
    return new Response(JSON.stringify({ theme: theme || null }), {
      headers: { "Content-Type": "application/json", ...corsHeaders(origin) }
    });
  }
  if (request.method === "POST") {
    let body = {};
    try { body = await request.json(); } catch {}
    const theme = body?.theme === "dark" ? "dark" : body?.theme === "light" ? "light" : null;
    if (!theme) return new Response("invalid theme", { status: 400, headers: corsHeaders(origin) });
    return new Response(JSON.stringify({ ok: true, theme }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `${COOKIE_NAME}=${theme}; Path=/; Domain=${COOKIE_DOMAIN}; Max-Age=31536000; SameSite=Lax; Secure`,
        ...corsHeaders(origin)
      }
    });
  }
  return new Response("method not allowed", { status: 405, headers: corsHeaders(origin) });
}

function handleHreflang(request, url) {
  const path = url.searchParams.get("path") || "/";
  const host = url.hostname;
  // Map path between language buckets per our convention
  // Spanish default + /en/ override per subdomain
  let es = path;
  let en = path;
  if (path.startsWith("/en/")) {
    en = path;
    es = path.replace(/^\/en/, "") || "/";
  } else {
    es = path;
    en = `/en${path}`;
  }
  return new Response(JSON.stringify({
    host,
    es: `https://${host}${es}`,
    en:  `https://${host}${en}`,
    "x-default": `https://${host}${es}`
  }), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request.headers.get("Origin"))
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const host = url.hostname;

    // 1) Theme API
    if (path === "/api/theme") return handleTheme(request);

    // 2) Hreflang resolver
    if (path === "/api/hreflang") return handleHreflang(request, url);

    // 3) Edge redirect fallback (only on root domain — subdomain redirects live in their own _redirects)
    if (host === "babulashotsrd.com" || host === "www.babulashotsrd.com") {
      const target = CROSS_DOMAIN_PARENT_REDIRECTS[path];
      if (target) return Response.redirect(target, 301);
    }

    // 4) Pass through to Pages project — Worker is bound on routes that include
    // the Pages project, so env.ASSETS is the underlying static files.
    if (env?.ASSETS) {
      const res = await env.ASSETS.fetch(request);

      // 5) Inject theme cookie into the response IF it's HTML and the user
      //    has a theme cookie set — let the browser's hydration script use it.
      //    (Optional: most subdomains read cookie client-side already.)
      return res;
    }

    // No ASSETS binding — fallback fetch
    return fetch(request);
  }
};
