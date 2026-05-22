import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import {
  aggregateRating,
  bodaUrl,
  brandLogoUrl,
  canonicalUrl,
  droneUrl,
  email,
  estudioUrl,
  inmobiliariaUrl,
  organizationSchema,
  phoneDisplay,
  phoneE164,
  siteUrl,
  whatsappUrl
} from "@/lib/seo";

const PAGE_PATH = "/en/about-michal-babula/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const ES_MIRROR = canonicalUrl("/sobre/");

const title = "About Michal Nikodem Babula · Babula Shots Photographer · 4.9★ 98 Google Reviews";
const description =
  "Professional photographer in Santo Domingo, Dominican Republic. Polish-Dominican founder of Babula Shots — weddings, studio, real estate and IDAC-certified drone since 2020.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      "es-DO": ES_MIRROR,
      es: ES_MIRROR,
      en: PAGE_URL,
      "x-default": ES_MIRROR
    }
  },
  openGraph: {
    title,
    description,
    url: PAGE_URL,
    type: "profile",
    locale: "en_US",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Michal Nikodem Babula — Babula Shots photographer"
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

// Re-use the same Person @id as the Spanish /sobre/ page. The schema graph
// resolves a single canonical Person across both language variants, with
// translated Person.description / page-level inLanguage.
const personId = `${ES_MIRROR}#person`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: "Michal Nikodem Babula",
  givenName: "Michal",
  additionalName: "Nikodem",
  familyName: "Babula",
  jobTitle: "Professional photographer",
  description,
  url: PAGE_URL,
  image: brandLogoUrl,
  email,
  telephone: phoneE164,
  nationality: { "@type": "Country", name: "Poland" },
  workLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santo Domingo",
      addressRegion: "Distrito Nacional",
      addressCountry: "DO"
    }
  },
  knowsLanguage: ["es", "en", "pl"],
  worksFor: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
  founder: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
  sameAs: [
    "https://www.wikidata.org/wiki/Q139892966",
    "https://www.instagram.com/babulashotsrd/"
  ]
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${PAGE_URL}#profilepage`,
  url: PAGE_URL,
  name: title,
  description,
  inLanguage: "en",
  mainEntity: { "@id": personId },
  about: { "@id": personId },
  isPartOf: { "@id": `${siteUrl}/#website` }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/en/` },
    { "@type": "ListItem", position: 2, name: "About Michal Nikodem Babula", item: PAGE_URL }
  ]
};

export default function AboutPage() {
  return (
    <main>
      <SeoJsonLd data={[organizationSchema, personSchema, profilePageSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p className="eyebrow">About the photographer</p>
          <h1>Michal Nikodem Babula — Professional photographer in Santo Domingo</h1>

          <p>
            Michal Nikodem Babula is the photographer behind <strong>Babula Shots</strong>, the
            photography, video and drone network based in Santo Domingo, Dominican Republic. Polish
            by origin and based in the Dominican Republic since 2020, Michal has documented more
            than 100 weddings, thousands of portraits, corporate sessions, real estate content and
            commercial drone projects across the country.
          </p>

          <p>
            He works in <strong>Spanish, English and Polish</strong> and personally coordinates every
            project with the Babula Shots team. Current rating: <strong>{aggregateRating.ratingValue} stars
            from {aggregateRating.reviewCount} Google reviews</strong>.
          </p>

          <h2>Specialties</h2>
          <ul style={{ lineHeight: 1.9 }}>
            <li>
              <a href={`${estudioUrl}/en/`} rel="noopener">Photo studio in Santo Domingo</a>
              {" "}— portraits, corporate headshots, food and beverage photography, fashion, product.
              Professional Profoto lighting.
            </li>
            <li>
              <a href={`${bodaUrl}/en/`} rel="noopener">Wedding photography in the Dominican Republic</a>
              {" "}— destination weddings in Punta Cana, Casa de Campo, Samaná, Las Terrenas and
              the Colonial Zone. Full-day coverage, optional video and reels.
            </li>
            <li>
              <a href={`${inmobiliariaUrl}/en/`} rel="noopener">Real estate photography</a>
              {" "}— MLS listings, Airbnb, villas, hotels and construction projects. 48–72 hour delivery.
            </li>
            <li>
              <a href={`${droneUrl}/en/`} rel="noopener">Drone services</a>
              {" "}— IDAC-certified pilot with DJI Mavic 3 Pro. Real estate, construction, tourism,
              inspections and mapping.
            </li>
          </ul>

          <h2>Coverage</h2>
          <p>
            Across the Dominican Republic — Santo Domingo, Punta Cana, Bávaro, Cap Cana, La Romana,
            Casa de Campo, Santiago, Samaná, Las Terrenas, Puerto Plata, Bayahíbe, Juan Dolio,
            Jarabacoa, Miches. The team travels for destination weddings, resort sessions and
            commercial projects with advance planning.
          </p>

          <h2>Direct contact</h2>
          <p>
            WhatsApp & phone: <a href={`tel:${phoneE164}`}>{phoneDisplay}</a>
            {" "}· Email: <a href={`mailto:${email}`}>{email}</a>
            {" "}· <a href={whatsappUrl("Hi Michal, I'd like info about Babula Shots.")}
                     target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>.
          </p>

          <p style={{ marginTop: "2rem" }}>
            <Link href="/en/">→ Babula Shots — main site (English)</Link>
            {" · "}
            <Link href={ES_MIRROR.replace(siteUrl, "")}>→ Sobre Michal (versión en español)</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
