import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnglishArticle } from "@/components/EnglishArticle";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { getEnContentByEnSlug } from "@/lib/enContent";
import {
  aggregateRating,
  brandLogoUrl,
  canonicalUrl,
  email,
  phoneE164,
  postalAddress,
  siteUrl
} from "@/lib/seo";

const PAGE_PATH = "/en/contact/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const ES_MIRROR = canonicalUrl("/contacto/");

const title = "Contact · Babula Shots · +1 809 720 9547 · 4.9★ 98 Google Reviews";
const description =
  "Book professional photography: WhatsApp, phone or email. Bilingual support (ES/EN), Monday–Sunday 9:00–18:00 local time. 4.9★ from 98 Google reviews.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: PAGE_URL,
      "es-DO": ES_MIRROR,
      es: ES_MIRROR,
      "x-default": ES_MIRROR
    }
  },
  openGraph: {
    title,
    description,
    url: PAGE_URL,
    type: "website",
    locale: "en_US",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Contact Babula Shots"
      }
    ]
  }
};

// Mirrors the Spanish /contacto/ ContactPage entity — same Organization and
// ContactPoint @ids so the schema graph resolves a single business with
// translated ContactPage variants per language.
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PAGE_URL}#contactpage`,
  url: PAGE_URL,
  name: title,
  description,
  inLanguage: "en",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#organization` }
};

const contactPointSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Babula Shots",
  url: `${siteUrl}/`,
  image: brandLogoUrl,
  logo: brandLogoUrl,
  address: postalAddress,
  aggregateRating,
  sameAs: [
    "https://babulashotsrd.com/",
    "https://boda.babulashotsrd.com/",
    "https://estudio.babulashotsrd.com/",
    "https://dron.babulashotsrd.com/",
    "https://inmobiliaria.babulashotsrd.com/",
    "https://www.instagram.com/babulashotsrd/",
    "https://www.wikidata.org/wiki/Q139892828"
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      "@id": `${ES_MIRROR}#contactpoint-customer`,
      contactType: "customer service",
      telephone: phoneE164,
      email,
      availableLanguage: ["Spanish", "English", "Polish"],
      areaServed: "DO",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "18:00"
      }
    },
    {
      "@type": "ContactPoint",
      "@id": `${ES_MIRROR}#contactpoint-whatsapp`,
      contactType: "sales",
      telephone: phoneE164,
      contactOption: "TollFree",
      availableLanguage: ["Spanish", "English"],
      areaServed: "DO"
    }
  ]
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/en/` },
    { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL }
  ]
};

export default function ContactEnPage() {
  // EN_CONTENT maps /contacto/ → /en/contact/ — pull the EN article body that
  // would otherwise have been served by the dynamic en/[slug] route.
  const enContent = getEnContentByEnSlug("contact");
  if (!enContent) notFound();
  return (
    <>
      <SeoJsonLd data={[contactPageSchema, contactPointSchema, breadcrumbSchema] as Record<string, unknown>[]} />
      <EnglishArticle content={enContent} />
    </>
  );
}
