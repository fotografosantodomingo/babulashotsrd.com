/**
 * Build full redirect map for parent rebuild.
 *
 * Each parent URL is classified into one of:
 *   - drop          → 410 Gone / sitemap exclude (no value, e.g. WooCommerce)
 *   - cross-estudio → 301 to estudio.babulashotsrd.com (studio-themed pages)
 *   - cross-bodas   → 301 to boda.babulashotsrd.com (wedding-themed)
 *   - cross-drone   → 301 to dron.babulashotsrd.com (drone-themed)
 *   - cross-inmo    → 301 to inmobiliaria.babulashotsrd.com (real-estate-themed)
 *   - same-keep     → migrate to new Next.js parent at same slug
 *   - same-301      → 301 to another parent URL (internal cannibalization fix)
 *
 * Strategy:
 *   • Posts (type=post, blog articles) default to same-keep (unique content).
 *   • Pages (type=page) get aggressive classification — most are landing pages
 *     that compete with subdomain content, so they redirect cross-domain.
 *   • Internal-cannibalization clusters get a designated master + 301 the rest.
 */
import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)));

const ESTUDIO = "https://estudio.babulashotsrd.com";
const BODA = "https://boda.babulashotsrd.com";
const DRON = "https://dron.babulashotsrd.com";
const INMO = "https://inmobiliaria.babulashotsrd.com";

const DROP = [
  "/cart/", "/checkout/", "/my-account/", "/shop/", "/reserva/"
];

// Hardcoded cross-domain redirects (the original 8 + new ones).
// Pattern: parent URL → target (full URL on a subdomain).
const CROSS_DOMAIN = {
  // ---- ESTUDIO (studio-themed) ----
  "/sesion-de-fotos/":                                                        `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-de-cumpleanos-en-santo-domingo-con-fotografo-profesional/":`${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/sesion-de-fotos-exterior-en-santo-domingo-rd/":                           `${ESTUDIO}/sesion-de-fotos/`,
  "/session-de-fotos-santo-domingo-estudio/":                                  `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografo-en-estudio-santo-domingo/":                                      `${ESTUDIO}/sesion-de-fotos/`,
  "/estudio/":                                                                 `${ESTUDIO}/`,
  "/shop/sesion-de-fotos-santo-domingo-estudio/":                              `${ESTUDIO}/sesion-de-fotos/`,
  "/shop/sesion-de-fotos-estudio-en-santo-domingo-rd/":                        `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografo-estudio/":                                                       `${ESTUDIO}/`,
  "/estudio-fotografico-de-moda-en-santo-domingo/":                            `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/sesion-de-fotos-estudio-fotografico-santo-domingo/":                       `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografo-retratos-profesional-en-estudio/":                               `${ESTUDIO}/headshots-profesionales-santo-domingo/`,
  "/retratos-corporativos-santo-domingo/":                                     `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/retratos-sesion-de-fotos-en-santo-domingo-republica-dominicana/":         `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-creativos-en-republica-dominicana/":                       `${ESTUDIO}/sesion-de-fotos/`,
  "/photo-session-in-studio-photography-in-dominican-republic/":               `${ESTUDIO}/en/`,
  "/galeria-sesion-de-foto-en-santo-domingo/":                                 `${ESTUDIO}/sesion-de-fotos/`,
  "/galeria-de-fotos-en-estudio-fotografico-en-santo-domingo-rd/":            `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-en-estudio-galeria-con-modelo-sunny/":                     `${ESTUDIO}/sesion-de-fotos/`,
  "/set-navideno-sesion-de-fotos-estudio-santo-domingo/":                      `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografia-personal-profesional-en-estudio-en-santo-domingo-y-punta-cana/":`${ESTUDIO}/sesion-de-fotos/`,
  "/fashion-photographer/":                                                    `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/fashion-photographer-gallery/":                                            `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografo-de-moda/":                                                       `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/fotografo-de-moda-en-santo-domingo/":                                      `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/fotografia-de-moda-en-republica-dominicana/":                              `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/servicio-de-fotografia-de-moda-pasarela-en-santo-domingo/":                `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/sesion-de-foto-luz-creativo-snoot-optico/":                                `${ESTUDIO}/sesion-de-fotos/`,
  "/fotos-en-estudio-santo-domingo-con-bailarina/":                            `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-fotos-embarazada-en-estudio-santo-domingo/":                        `${ESTUDIO}/sesion-de-fotos-embarazo/`,
  "/sesion-de-fotos-embarazada-en-estudio-santo-domingo/":                     `${ESTUDIO}/sesion-de-fotos-embarazo/`,
  "/fotografia-profesional-para-quinceaneras/":                                `${ESTUDIO}/sesion-de-fotos-quinceanera/`,
  "/quinceanera-en-jarabacoa/":                                                `${ESTUDIO}/sesion-de-fotos-quinceanera/`,
  "/fotografo-de-cumpleanos-en-santo-domingo/":                                `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/fotografo-de-cumpleanos-santo-domingo/":                                   `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/fotografo-cumpleanos-1-ano-santo-domingo-republica-dominicana/":           `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/galeria-de-fotos-cumpleanos-fotografo-santo-domingo/":                     `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/cumpleanos-santo-domingo-fotografo-screem-land-agora-mall/":               `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/donde-celebrar-cumpleanos-de-ninos-en-santo-domingo/":                     `${ESTUDIO}/sesion-de-fotos-cumpleanos/`,
  "/sesion-de-fotos-2/":                                                       `${ESTUDIO}/sesion-de-fotos/`,
  "/precios-y-paquetes-sesion-de-fotos-en/":                                   `${ESTUDIO}/precios/`,
  "/fotografia-gastronomica-republica-dominicana/":                            `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografia-gastronomica-y-comercial/":                                     `${ESTUDIO}/sesion-de-fotos/`,
  "/fotos-de-alimentos-y-bebidas/":                                            `${ESTUDIO}/sesion-de-fotos/`,
  "/servicio-de-fotografia-profesional-para-corporativos/":                    `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/fotografo-para-eventos-corporativos-en-santo-domingo/":                    `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/fotografo-eventos-comerciales/":                                           `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/servicio-fotografo-de-eventos/":                                           `${ESTUDIO}/`,
  "/fotografia-para-empresas-y-negocios-en-santo-domingo/":                    `${ESTUDIO}/sesion-de-fotos-corporativas/`,
  "/family-portrait-photo-sessions-in-santo-domingo-dominican-republic/":      `${ESTUDIO}/en/`,
  "/professional-photographer-in-zona-colonial-santo-domingo/":                `${ESTUDIO}/en/`,
  "/zona-colonial-fotografo-session-de-fotos/":                                `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-zona-colonial-santo-domingo/":                             `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-en-zona-colonial-santo-domingo/":                          `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-zona-colonial-santo-domingo-rd/":                          `${ESTUDIO}/sesion-de-fotos/`,
  "/sesiones-de-fotos-en-zona-colonial-republica-dominicana/":                 `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografia-de-sesiones-zona-colonial/":                                    `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografo-en-zona-colonial/":                                              `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-saona-island/":                                            `${ESTUDIO}/sesion-de-fotos/`,
  "/photo-session-in-punta-cana-and-saona-island/":                            `${ESTUDIO}/en/`,
  "/punta-cana-photographer-in-studio/":                                       `${ESTUDIO}/en/`,
  "/retrato-profesional-en-punta-cana/":                                       `${ESTUDIO}/sesion-de-fotos/`,
  "/sesiones-de-fotos-unicas-en-la-naturaleza-de-la-republica-dominicana-con-tu-fotografo-en-santo-domingo/": `${ESTUDIO}/sesion-de-fotos/`,
  "/sesiones-de-fotos-punta-cana/":                                            `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-en-la-playa-santo-domingo-republica-dominicana/":          `${ESTUDIO}/sesion-de-fotos/`,
  "/sesion-de-fotos-en-la-playa/":                                             `${ESTUDIO}/sesion-de-fotos/`,
  "/fotografia-exterior-luz-mejor-de-dia-hora-de-oro/":                        `${ESTUDIO}/sesion-de-fotos/`,
  "/hora-de-oro-en-fashion/":                                                  `${ESTUDIO}/sesion-de-fotos/`,
  "/retratos-exterior-sesion-de-fotos-en-rd/":                                 `${ESTUDIO}/sesion-de-fotos/`,
  "/galeria-de-fotos/":                                                        `${ESTUDIO}/`,
  "/angela/":                                                                  `${ESTUDIO}/sesion-de-fotos/`,
  "/punta-cana-photographer/":                                                 `${ESTUDIO}/en/`,
  "/photographer-in-punta-cana-babula-shots-rd/":                              `${ESTUDIO}/en/`,
  "/photographer-in-punta-cana-dominican-republic/":                           `${ESTUDIO}/en/`,
  "/photography-services-in-the-dominican-republic/":                          `${ESTUDIO}/en/`,
  "/sesion-de-fotos-creativos-en-republica-dominicana-2/":                     `${ESTUDIO}/sesion-de-fotos/`,

  // ---- BODAS (wedding-themed) ----
  "/fotografo-de-bodas-en-republica-dominicana/":                              `${BODA}/`,
  "/fotografo-de-bodas-santo-domingo/":                                        `${BODA}/`,
  "/fotografo-bodas-playa-republica-dominicana-sesion-de-fotos/":              `${BODA}/`,
  "/fotografo-novios-propuesta-de-matrimonio-en-rd/":                          `${BODA}/`,
  "/propuesta-de-matrimonio-en-rd/":                                           `${BODA}/`,
  "/fotografo-propuesta-playa-republica-dominicana/":                          `${BODA}/`,
  "/fotos-pre-boda-en-santo-domingo-punta-cana/":                              `${BODA}/`,
  "/sesion-de-fotos-en-zona-colonial-pre-boda/":                               `${BODA}/`,
  "/pre-wedding-photo-session-in-domincan-republic/":                          `${BODA}/en/`,
  "/capturing-love-wedding-ceremony-photography-in-zona-colonial-santo-domingo/":`${BODA}/en/`,
  "/capturando-amor-eterno-conviertete-en-una-novia-radiante-con-un-fotografo-de-bodas-excepcional/":`${BODA}/`,
  "/ceremonia-de-matrimonio-en-la-playa-como-preparar/":                       `${BODA}/`,
  "/photographer-in-marriage-proposal-in-dominican-republic/":                 `${BODA}/en/`,
  "/aniversary-photo-session-on-the-beach-in-punta-cana/":                     `${BODA}/en/`,
  "/top-dominican-republic-anniversary-photo-spots-professional-photographer/":`${BODA}/en/`,
  "/el-primer-baile-en-la-fiesta-de-bodas/":                                   `${BODA}/`,
  "/ella-dijo-que-si-paris-torre-eiffel/":                                     `${BODA}/`,
  "/propuesta-de-compromiso-matrimonial-en-paris/":                            `${BODA}/`,
  "/sesion-de-fotos-familiar-en-casa-de-campo/":                               `${BODA}/`,
  "/fotografo-casa-de-campo-la-romana/":                                       `${BODA}/`,
  "/juan-dolio/":                                                              `${BODA}/`,

  // ---- DRONE ----
  "/fotografia-y-video-con-dron-en-republica-dominicana/":                     `${DRON}/`,
  "/servicio-foto-y-video-con-drone-en-republica-dominicana/":                 `${DRON}/`,
  "/drone-republica-dominicana/":                                              `${DRON}/`,
  "/drone-photographer-punta-cana/":                                           `${DRON}/en/`,
  "/piloto-de-dron-en-republica-dominicana/":                                  `${DRON}/`,

  // ---- INMOBILIARIA ----
  "/real-estate-fotografo-pro/":                                               `${INMO}/`,
  "/servicios-profesionales-de-drone-para-inmobiliarias-en-republica-dominicana-fotografia-videos-aereos/": `${INMO}/`,
  "/grabando-profesional-videos-con-real-estate-en-punta-cana/":               `${INMO}/`,

  // ---- WooCommerce / dropped pages with internal landing alternatives ----
  // (already covered by drop list)
};

// Internal-cannibalization clusters: pick a master, redirect rest to it on parent.
const SAME_DOMAIN_REDIRECTS = {
  // Baseball cluster — keep /fotografo-baseball-santo-domingo/ as master
  "/fotografo-baseball/":            "/fotografo-baseball-santo-domingo/",
  "/fotografo-de-baseball/":         "/fotografo-baseball-santo-domingo/",
  "/buscas-fotografo-de-baseball/":  "/fotografo-baseball-santo-domingo/",
  // Cumpleanos handled via cross-domain (all → estudio)
  // Eventos
  "/fotografo-eventos-santo-domingo-republica-dominicana/": "/fotografo-eventos-santo-domingo-republica-dominicana/", // master keep
  // Generic photographer master
  "/fotografo-en-santo-domingo-republica-dominicana/": "/fotografo-en-santo-domingo-republica-dominicana/", // master keep
  // Drone landing on parent — keep as info hub
  // Pricing
  "/cuanto-cuesta-servicio-de-fotografo-en-santo-domingo/": "/cuanto-cuesta-servicio-de-fotografo-en-santo-domingo/" // master
};

// Posts (blog) we KEEP on parent (unique content, blog value).
// Pages we explicitly KEEP as landing on parent (general fotografo intent).
const KEEP_ON_PARENT = new Set([
  "/",
  "/blog/",
  "/contacto/",
  "/contractar-babula-shots/",
  "/terminos-y-condiciones-del-servicio-de-fotografia-de-babula-shots/",
  "/politica-de-privacidad/",
  "/fotografo/",                                              // pos 6 vol 720 — defend
  "/fotografo-santo-domingo/",                                // important
  "/fotografo-en-santo-domingo-republica-dominicana/",        // important
  "/fotografo-eventos-santo-domingo-republica-dominicana/",   // ranks for eventos
  "/cuanto-cuesta-servicio-de-fotografo-en-santo-domingo/",   // pricing question hub
  "/videografo/",
  "/videografo-profesional/",
  "/video-tipo-reel/",
  "/fotografo-baseball-santo-domingo/",                       // baseball master
  "/retratos-deportivos-creativos-en-santo-domingo/",
  "/videografo-y-creador-de-contenido-en-el-beisbol/",
  "/fotos-y-videos-profesional/",
  "/fotografo-de-baseball/",                                  // hmm overlap; kill via redirect — handled above
  "/fotografo-republica-dominicana-cabarete-kite/",
  "/servicio-de-fotografia-profesional-de-kitesurfing-cabarete/",
  "/galeria-de-fotoslas-terrenas-kite-surf/",
  "/creando-contenido-para-redes-sociales-foto-video/",
  "/creando-contenido-para-desenadora-en-santo-domingo/",     // post — keep
  "/fotografo-en-tortuga-bay-punta-cana-republica-dominicana/" // destination article
]);

async function main() {
  const pages = JSON.parse(await readFile(`${root}/raw/pages.json`, "utf8"));
  const posts = JSON.parse(await readFile(`${root}/raw/posts.json`, "utf8"));
  const all = [...pages, ...posts];

  const map = {
    drop: [...DROP],
    crossDomain: { ...CROSS_DOMAIN },
    sameOrigin301: { ...SAME_DOMAIN_REDIRECTS },
    keep: []
  };

  // Walk every URL and bucket it.
  const unclassified = [];
  for (const p of all) {
    const path = new URL(p.link).pathname;
    if (DROP.includes(path)) continue;
    if (path in map.crossDomain) continue;
    if (path in map.sameOrigin301 && map.sameOrigin301[path] !== path) continue;
    if (KEEP_ON_PARENT.has(path)) {
      map.keep.push(path);
      continue;
    }
    if (p.type === "post") {
      // Blog posts default to keep
      map.keep.push(path);
      continue;
    }
    // Page that didn't match any rule
    unclassified.push({ slug: p.slug, path, title: (p.title?.rendered ?? "").replace(/<[^>]*>/g, "") });
  }

  await writeFile(`${root}/raw/url-map.json`, JSON.stringify(map, null, 2));
  await writeFile(`${root}/raw/unclassified.json`, JSON.stringify(unclassified, null, 2));

  // Generate Cloudflare Pages _redirects file.
  // Format: <source> <target> <status>
  // 410 for drops, 301 for the rest.
  const lines = [
    "# Babula Shots parent — _redirects (auto-generated by scrape/build-redirects.mjs)",
    "# Cloudflare Pages reads this from out/_redirects after build.",
    "",
    "# --- DROPS (Gone) — WooCommerce + cancelled paths"
  ];
  for (const p of map.drop) lines.push(`${p}* /410.html 410`);
  lines.push("", "# --- CROSS-DOMAIN 301 (parent → subdomains)");
  for (const [from, to] of Object.entries(map.crossDomain).sort()) {
    lines.push(`${from} ${to} 301`);
  }
  lines.push("", "# --- SAME-ORIGIN 301 (internal cannibalization fix)");
  for (const [from, to] of Object.entries(map.sameOrigin301).sort()) {
    if (from !== to) lines.push(`${from} ${to} 301`);
  }
  lines.push("");
  await writeFile(`${root}/_redirects`, lines.join("\n"));

  console.log(`drop:           ${map.drop.length}`);
  console.log(`crossDomain:    ${Object.keys(map.crossDomain).length}`);
  console.log(`sameOrigin301:  ${Object.keys(map.sameOrigin301).filter(k => k !== map.sameOrigin301[k]).length}`);
  console.log(`keep:           ${map.keep.length}`);
  console.log(`unclassified:   ${unclassified.length}`);
  console.log(`\n_redirects file: ${root}/_redirects (${lines.length} lines)`);
  if (unclassified.length) {
    console.log("\nUnclassified pages (need manual decision):");
    for (const u of unclassified.slice(0, 30)) {
      console.log(`  /${u.slug}/  ${u.title.slice(0, 60)}`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
