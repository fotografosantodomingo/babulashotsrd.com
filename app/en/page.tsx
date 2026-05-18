import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";
import { canonicalUrl } from "@/lib/seo";

const path = "/en/";
const title = "Professional photographer in the Dominican Republic | Babula Shots";
const description =
  "Professional photography network in the Dominican Republic — wedding, real estate, drone and studio coverage in Santo Domingo and Punta Cana. Bilingual ES/EN.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl(path),
    languages: {
      en: canonicalUrl(path),
      "es-DO": canonicalUrl("/"),
      es: canonicalUrl("/"),
      "x-default": canonicalUrl("/")
    }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl(path),
    type: "website",
    locale: "en",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots — professional photography network in the Dominican Republic"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/social-card-1200x630.webp"]
  }
};

export default function Page() {
  return <HomePage lang="en" />;
}
