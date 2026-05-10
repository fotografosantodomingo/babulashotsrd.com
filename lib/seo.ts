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

// The parent IS the Babula Shots Organization. Subdomains are sub-brands.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Babula Shots",
  alternateName: "Babula Shots Photography Network",
  url: siteUrl,
  logo: `${siteUrl}/wp-content/uploads/2024/06/Babula-Shots-Logo.webp`,
  telephone: phoneE164,
  email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santo Domingo",
    addressRegion: "Distrito Nacional",
    addressCountry: "DO"
  },
  areaServed: { "@type": "Country", name: "Dominican Republic" },
  subOrganization: [
    { "@type": "Organization", name: "Babula Shots Estudio", url: estudioUrl },
    { "@type": "Organization", name: "Babula Shots Bodas", url: bodaUrl },
    { "@type": "Organization", name: "Babula Shots Inmobiliaria", url: inmobiliariaUrl },
    { "@type": "Organization", name: "Babula Shots Drone", url: droneUrl }
  ],
  sameAs: [
    estudioUrl, bodaUrl, inmobiliariaUrl, droneUrl, santoDomingoHubUrl,
    "https://www.instagram.com/babulashotsrd/"
  ]
};
