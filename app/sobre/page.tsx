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

const PAGE_PATH = "/sobre/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const EN_MIRROR = canonicalUrl("/en/about-michal-babula/");

const title = "Sobre Michal Nikodem Babula · Fotógrafo Babula Shots · 4.9★ 98 reseñas";
const description =
  "Fotógrafo profesional en Santo Domingo. Polaco-dominicano, fundador de Babula Shots. Bodas, estudio, inmobiliaria y drone certificado IDAC desde 2020.";

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
    type: "profile",
    locale: "es_DO",
    siteName: "Babula Shots",
    images: [
      {
        url: "/images/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Michal Nikodem Babula — Fotógrafo Babula Shots"
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

const personId = `${PAGE_URL}#person`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: "Michal Nikodem Babula",
  givenName: "Michal",
  additionalName: "Nikodem",
  familyName: "Babula",
  jobTitle: "Fotógrafo profesional",
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
  // Topical signals for LLM topic clustering — when an assistant is asked
  // "who is an expert in X" for any of these areas, this Person matches.
  knowsAbout: [
    "Wedding photography",
    "Studio photography",
    "Portrait photography",
    "Real estate photography",
    "Drone photography",
    "Aerial videography",
    "Commercial photography",
    "Fashion photography",
    "Food photography",
    "Dominican Republic photography"
  ],
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
  inLanguage: "es-DO",
  mainEntity: { "@id": personId },
  about: { "@id": personId },
  isPartOf: { "@id": `${siteUrl}/#website` }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Sobre Michal Nikodem Babula", item: PAGE_URL }
  ]
};

export default function SobrePage() {
  return (
    <main>
      <SeoJsonLd data={[organizationSchema, personSchema, profilePageSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p className="eyebrow">Sobre el fotógrafo</p>
          <h1>Michal Nikodem Babula — Fotógrafo profesional en Santo Domingo</h1>

          <p>
            Michal Nikodem Babula es el fotógrafo al frente de <strong>Babula Shots</strong>, la red de
            fotografía, video y drone con sede en Santo Domingo, República Dominicana. De origen polaco
            y residente en República Dominicana desde 2020, Michal ha documentado más de 100 bodas,
            miles de retratos, sesiones corporativas, contenido inmobiliario y proyectos comerciales
            con drone en toda la isla.
          </p>

          <p>
            Trabaja en <strong>español, inglés y polaco</strong>, y coordina personalmente cada proyecto
            con el equipo Babula Shots. Calificación actual: <strong>{aggregateRating.ratingValue} estrellas
            con {aggregateRating.reviewCount} reseñas en Google</strong>.
          </p>

          <h2>Especialidades</h2>
          <ul style={{ lineHeight: 1.9 }}>
            <li>
              <a href={estudioUrl} rel="noopener">Estudio fotográfico en Santo Domingo</a>
              {" "}— retratos, headshots corporativos, fotografía gastronómica, moda, producto.
              Iluminación profesional Profoto.
            </li>
            <li>
              <a href={bodaUrl} rel="noopener">Fotografía de bodas en República Dominicana</a>
              {" "}— bodas destino en Punta Cana, Casa de Campo, Samaná, Las Terrenas y Zona Colonial.
              Cobertura completa, video y reels opcionales.
            </li>
            <li>
              <a href={inmobiliariaUrl} rel="noopener">Fotografía inmobiliaria</a>
              {" "}— listados MLS, Airbnb, villas, hoteles y proyectos en construcción. Entrega en 48–72 horas.
            </li>
            <li>
              <a href={droneUrl} rel="noopener">Servicios drone</a>
              {" "}— piloto certificado IDAC con DJI Mavic 3 Pro. Inmobiliaria, construcción, turismo,
              inspecciones y mapeo.
            </li>
          </ul>

          <h2>Cobertura</h2>
          <p>
            Toda la República Dominicana — Santo Domingo, Punta Cana, Bávaro, Cap Cana, La Romana,
            Casa de Campo, Santiago, Samaná, Las Terrenas, Puerto Plata, Bayahíbe, Juan Dolio,
            Jarabacoa, Miches. El equipo se traslada para bodas destino, sesiones en resort y
            proyectos comerciales con planificación previa.
          </p>

          <h2>Contacto directo</h2>
          <p>
            WhatsApp y teléfono: <a href={`tel:${phoneE164}`}>{phoneDisplay}</a>
            {" "}· Email: <a href={`mailto:${email}`}>{email}</a>
            {" "}· <a href={whatsappUrl("Hola Michal, me gustaria informacion sobre Babula Shots.")}
                     target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a>.
          </p>

          <p style={{ marginTop: "2rem" }}>
            <Link href="/contacto/">→ Página de contacto completa</Link>
            {" · "}
            <Link href="/galeria-de-fotos/">→ Galería de fotos</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
