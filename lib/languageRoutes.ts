type LanguagePaths = { es: string; en: string };

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  return clean.endsWith("/") ? clean : `${clean}/`;
};

// Only fully bilingual pages get an EN counterpart. WP-imported Spanish slugs
// stay Spanish-only and the EN switcher hides on them (no 404s).
// EN-canonical slugs are English (/en/services/, /en/locations/, /en/prices/).
// /en/servicios/, /en/ubicaciones/, /en/precios/ also exist as aliases that
// render the same English content but point canonical to the EN slug.
const routePairs: LanguagePaths[] = [
  { es: "/", en: "/en/" },
  { es: "/servicios/", en: "/en/services/" },
  { es: "/ubicaciones/", en: "/en/locations/" },
  { es: "/precios/", en: "/en/prices/" },
  { es: "/faq/", en: "/en/faq/" }
].map((pair) => ({ es: normalizePath(pair.es), en: normalizePath(pair.en) }));

export function languagePathsFor(pathname: string): LanguagePaths {
  const current = normalizePath(pathname);
  const match = routePairs.find((pair) => pair.es === current || pair.en === current);
  if (match) return match;
  // No EN counterpart for WP slugs — the EN switcher hides on these pages.
  return { es: current, en: "" };
}

export function allLanguageRoutePairs() {
  return routePairs;
}
