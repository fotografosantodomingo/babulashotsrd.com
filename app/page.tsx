import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { getSeo } from "@/lib/parentContent";
import { canonicalUrl } from "@/lib/seo";

const seo = getSeo("https://estudio.babulashotsrd.com/");

const scrapedDescription = seo?.description ?? "";
const extendedDescription =
  scrapedDescription && scrapedDescription.length < 140
    ? `${scrapedDescription} Cotiza por WhatsApp.`
    : scrapedDescription ||
      "Estudio fotografico en Santo Domingo: retratos, fotos de comida y bebida, exteriores y campanas para empresas.";

const scrapedOgDescription = seo?.ogDescription ?? "";
const extendedOgDescription =
  scrapedOgDescription && scrapedOgDescription.length < 140
    ? `${scrapedOgDescription} Cotiza por WhatsApp.`
    : scrapedOgDescription || extendedDescription;

export const metadata: Metadata = {
  title: seo?.title ?? "Estudio fotografico en Santo Domingo | Babula Shots",
  description: extendedDescription,
  alternates: {
    canonical: canonicalUrl("/"),
    languages: { "es-DO": canonicalUrl("/"), "x-default": canonicalUrl("/") }
  },
  openGraph: {
    title: seo?.ogTitle ?? seo?.title ?? "Estudio fotografico en Santo Domingo",
    description: extendedOgDescription,
    url: canonicalUrl("/"),
    type: "website",
    locale: "es_DO",
    siteName: "Babula Shots Estudio",
    images: seo?.ogImage
      ? [{ url: seo.ogImage }]
      : [
          {
            url: "/wp-content/uploads/2024/06/social-card-1200x630.webp",
            width: 1200,
            height: 630,
            alt: "Babula Shots Estudio"
          }
        ]
  }
};

export default function Page() {
  return <HomePage />;
}
