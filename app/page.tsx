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
const homepageTitle = "Fotógrafo en Santo Domingo · Babula Shots · 4.9★ 98 reseñas";
const homepageDescription =
  "Red de fotografía profesional en República Dominicana: bodas, estudio, drone, inmobiliaria. Reserva 809 720 9547 · 4.9★ 98 reseñas Google.";

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
        alt: "Babula Shots — Fotógrafo en República Dominicana"
      }
    ]
  }
};

export default function Page() {
  return <HomePage />;
}
