export const siteOrigin = "https://babulashotsrd.com";
export const siteUrl = siteOrigin;
export const mainBrandUrl = siteUrl;
export const bodaUrl = "https://boda.babulashotsrd.com";
export const inmobiliariaUrl = "https://inmobiliaria.babulashotsrd.com";
export const droneUrl = "https://dron.babulashotsrd.com";
export const estudioUrl = "https://estudio.babulashotsrd.com";
export const santoDomingoHubUrl = "https://www.fotografosantodomingo.com";
export const phoneDisplay = "809 720 95 47";
export const phoneE164 = "+18097209547";
export const email = "info@babulashotsrd.com";
export const whatsappNumber = "18097209547";
export const portfolioUrl = "https://babulashots.pic-time.com/client";

export const niche = {
  label: "Babula Shots",
  enLabel: "Babula Shots",
  whatsappContext: "Hola, vengo de la web de Babula Shots."
};

export function canonicalUrl(path: string) {
  if (!path || path === "/") return `${siteUrl}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${clean.endsWith("/") ? clean : `${clean}/`}`;
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function assetPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Schema standards — see ~/.claude/.../memory/schema_standards.md
// The parent IS the Babula Shots Organization. Subdomains are sub-brands.
// ──────────────────────────────────────────────────────────────────────────

// Canonical brand logo. The previous /2024/06/...webp path didn't exist; this PNG does.
export const brandLogoUrl = `${siteUrl}/wp-content/uploads/2023/05/cropped-babulashotslogo-1.png`;

// ISO 8601 datetime helper. Dominican Republic = UTC-4 year-round (no DST).
// Use for datePublished/dateModified — bare "YYYY-MM-DD" fails Rich Results
// validator with "Invalid datetime / Missing timezone" warnings.
export function isoAst(dateString: string, time = "12:00:00"): string {
  if (!dateString) return `2026-01-01T${time}-04:00`;
  // Already a full ISO string? Pass through.
  if (dateString.includes("T") && /[+-]\d{2}:?\d{2}|Z$/.test(dateString)) return dateString;
  // WP gives us strings like "2024-03-12T18:23:55" without timezone — append -04:00.
  if (dateString.includes("T")) return `${dateString}-04:00`;
  // Bare date → noon AST.
  const d = dateString.length === 10 ? dateString : dateString.slice(0, 10);
  return `${d}T${time}-04:00`;
}

// Canonical address (no streetAddress/postalCode until user provides it).
export const postalAddress = {
  "@type": "PostalAddress" as const,
  addressLocality: "Santo Domingo",
  addressRegion: "Distrito Nacional",
  addressCountry: "DO"
};

// Brand-wide aggregate rating (4.9/5 from 91 Google reviews).
export const aggregateRating = {
  "@type": "AggregateRating" as const,
  ratingValue: "4.9",
  bestRating: "5",
  worstRating: "1",
  ratingCount: "91",
  reviewCount: "91"
};

// Santo Domingo center fallback. TODO: replace with actual studio coordinates.
export const geoCoordinates = {
  "@type": "GeoCoordinates" as const,
  latitude: 18.4861,
  longitude: -69.9312
};

// Cities the network serves — used in areaServed on LocalBusiness.
export const networkAreasServed = [
  { "@type": "City" as const, name: "Santo Domingo" },
  { "@type": "City" as const, name: "Punta Cana" },
  { "@type": "City" as const, name: "La Romana" },
  { "@type": "City" as const, name: "Las Terrenas" },
  { "@type": "City" as const, name: "Bávaro" },
  { "@type": "City" as const, name: "Cap Cana" },
  { "@type": "Country" as const, name: "Dominican Republic" }
];

// The Organization entity. Distinct @id from LocalBusiness so GSC doesn't merge
// them (which would surface "duplicate url" warnings).
// Uses subOrganization (NOT parentOrganization) — the apex IS the parent brand.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}#organization`,
  name: "Babula Shots",
  alternateName: "Babula Shots Photography Network",
  url: siteUrl,
  image: brandLogoUrl,
  logo: brandLogoUrl,
  telephone: phoneE164,
  email,
  address: postalAddress,
  areaServed: networkAreasServed,
  subOrganization: [
    { "@type": "Organization", name: "Babula Shots Estudio", url: estudioUrl, "@id": `${estudioUrl}#organization` },
    { "@type": "Organization", name: "Babula Shots Bodas", url: bodaUrl, "@id": `${bodaUrl}#organization` },
    { "@type": "Organization", name: "Babula Shots Inmobiliaria", url: inmobiliariaUrl, "@id": `${inmobiliariaUrl}#organization` },
    { "@type": "Organization", name: "Babula Shots Drone", url: droneUrl, "@id": `${droneUrl}#organization` }
  ],
  sameAs: [
    estudioUrl, bodaUrl, inmobiliariaUrl, droneUrl, santoDomingoHubUrl,
    "https://www.instagram.com/babulashotsrd/"
  ]
};

// LocalBusiness entity — distinct @id from Organization so they're separate entities.
// Use "LocalBusiness" (NOT "Photographer") per schema_standards.md rule 2c —
// Google's Review Snippet validator only accepts LocalBusiness, not Photographer.
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteUrl}#localbusiness`,
  name: "Babula Shots",
  url: siteUrl,
  image: brandLogoUrl,
  telephone: phoneE164,
  email,
  priceRange: "RD$5,960-RD$35,760",
  address: postalAddress,
  geo: geoCoordinates,
  areaServed: networkAreasServed,
  aggregateRating,
  sameAs: [
    estudioUrl, bodaUrl, inmobiliariaUrl, droneUrl, santoDomingoHubUrl,
    "https://www.instagram.com/babulashotsrd/"
  ]
};

// Author/publisher reference helper — use this inside Article/BlogPosting schemas
// so they reference the Organization entity by @id instead of redefining inline.
export const organizationRef = {
  "@type": "Organization",
  name: "Babula Shots",
  "@id": `${siteUrl}#organization`
};

export const publisherRef = {
  "@type": "Organization",
  name: "Babula Shots",
  logo: { "@type": "ImageObject", url: brandLogoUrl }
};
