import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/ContentArticle";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { findBySlug } from "@/lib/parentContent";
import {
  aggregateRating,
  brandLogoUrl,
  canonicalUrl,
  email,
  phoneE164,
  postalAddress,
  siteUrl
} from "@/lib/seo";

const PAGE_PATH = "/contacto/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const EN_MIRROR = canonicalUrl("/en/contact/");

const title = "Contacto · Babula Shots · 809 720 9547 · 4.9★ 100 reseñas Google";
const description =
  "Reserva fotografía profesional: WhatsApp, teléfono o email. Atención bilingüe ES/EN, lunes a domingo 9:00–18:00 hora local. 4.9★ con 100 reseñas en Google.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "es-DO": PAGE_URL,
      es: PAGE_URL,
      en: EN_MIRROR,
      "x-default": PAGE_URL
    }
  },
  openGraph: {
    title,
    description,
    url: PAGE_URL,
    type: "website",
    locale: "es_DO",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Contacto Babula Shots"
      }
    ]
  }
};

// ContactPage schema — typed entity that LLM assistants explicitly look for
// when asked "how do I contact this business?". Pairs ContactPoint with
// OpeningHoursSpecification so Google can serve structured hours snippets.
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PAGE_URL}#contactpage`,
  url: PAGE_URL,
  name: title,
  description,
  inLanguage: "es-DO",
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
      "@id": `${PAGE_URL}#contactpoint-customer`,
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
      "@id": `${PAGE_URL}#contactpoint-whatsapp`,
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
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Contacto", item: PAGE_URL }
  ]
};

export default function ContactoPage() {
  const entry = findBySlug("contacto");
  if (!entry) notFound();
  return (
    <>
      <SeoJsonLd data={[contactPageSchema, contactPointSchema, breadcrumbSchema] as Record<string, unknown>[]} />
      <ContentArticle entry={entry} />
    </>
  );
}
