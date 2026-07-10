import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { canonicalUrl } from "@/lib/seo";

// CTR-tuned apex homepage. Per 2026-05-10 GSC: apex ranks for "fotografo en
// santo domingo" (pos 3.4, 125 imp, 9 clicks) + "fotografo" + "photographer
// near me" — general photographer queries, NOT studio queries. The previous
// metadata pulled from estudio's scraped SEO data by mistake and was mis-
// targeted at "estudio fotografico". Per CANNIBALIZATION-FIX.md Step 3 the
// apex needs to read as the NETWORK HUB, leaving studio queries to the
// estudio subdomain.
//
// 2026-07: the 2026-05-22 "network hub" retarget (cd6a556) dropped "Santo
// Domingo" from the H1/description while leaving it in the title, which
// diluted relevance for that query and cost clicks. Title/H1/description are
// now kept in sync: Santo Domingo stays the flagship city, framed inside the
// national-network coverage story rather than replaced by it. Domain split:
// fotografosantodomingo.com owns hyper-local Santo Domingo intent; the apex
// leads with Santo Domingo but is the one authority page for the national
// network (Punta Cana, Cap Cana, Bayahíbe, La Romana, Samaná, Las Terrenas,
// Puerto Plata, Jarabacoa, etc.) via its four subdomains.
const homepageTitle = "Fotógrafo en Santo Domingo · Babula Shots · 4.9★ 100 reseñas";
const homepageDescription =
  "Fotógrafo en Santo Domingo con cobertura en toda República Dominicana: bodas, estudio, drone, inmobiliaria. Reserva 809 720 9547 · 4.9★ 100 reseñas Google.";

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: canonicalUrl("/"),
    languages: {
      "es-DO": canonicalUrl("/"),
      es: canonicalUrl("/"),
      en: canonicalUrl("/en/"),
      "x-default": canonicalUrl("/")
    }
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: canonicalUrl("/"),
    type: "website",
    locale: "es_DO",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots — Fotógrafo en Santo Domingo y República Dominicana"
      }
    ]
  }
};

export default function Page() {
  return <HomePage />;
}
