import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { canonicalUrl, email, localBusinessSchema, organizationSchema, phoneDisplay, phoneE164, siteUrl } from "@/lib/seo";

const PAGE_PATH = "/en/family-zona-colonial/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const ES_MIRROR = canonicalUrl("/familia-zona-colonial/");

const FSD_GALLERY_URL = "https://www.fotografosantodomingo.com/en/family/zona-colonial-santo-domingo";
const FSD_BOOK_URL = "https://www.fotografosantodomingo.com/en/book?service=family-beach-photography__essential";

const title = "Family Photos in the Zona Colonial · Babula Shots · from $370 USD";
const description =
  "Family photo session in Santo Domingo's Zona Colonial. $370 USD, up to 5 people, 1 hour, 20 edited photos. Bilingual direction. Book through Fotógrafo Santo Domingo.";

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
    type: "website",
    locale: "en_US",
    siteName: "Babula Shots",
    images: [
      {
        url: "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_1_a69rq4.webp",
        width: 1200,
        height: 1600,
        alt: "Family in front of a stone archway with an iron gate in the Zona Colonial, Santo Domingo — Babula Shots"
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/en/` },
    { "@type": "ListItem", position: 2, name: "Family Photos Zona Colonial", item: PAGE_URL }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Family Photography — Zona Colonial",
  serviceType: "Family photography",
  description,
  provider: { "@id": `${siteUrl}#organization` },
  areaServed: { "@type": "City", name: "Santo Domingo" },
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "370",
    url: FSD_BOOK_URL,
    availability: "https://schema.org/InStock"
  }
};

const CLOUDINARY_BASE = "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/";

const verticalPhoto = {
  src: "v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_1_a69rq4.webp",
  alt: "Family of four posing in front of a colonial stone archway with a wrought-iron gate"
};

const horizontalPhotos = [
  {
    src: "v1788218695/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_3_fknonb.webp",
    alt: "Two siblings sitting on a stone ledge against a colonial brick wall"
  },
  {
    src: "v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_5_azyfeg.webp",
    alt: "Two siblings running hand in hand in front of a colonial archway"
  },
  {
    src: "v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_8_vjqwlm.webp",
    alt: "Candid moment of a young boy on the stone steps of the Zona Colonial"
  }
];

export default function FamilyZonaColonialPage() {
  return (
    <main lang="en">
      <SeoJsonLd data={[organizationSchema, localBusinessSchema, serviceSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "70ch" }}>
            <p className="eyebrow">Family photography</p>
            <h1>Family Photos in the Zona Colonial</h1>

            <p>
              Family sessions in Santo Domingo&rsquo;s Zona Colonial run <strong>$370 USD</strong> for
              up to <strong>5 people</strong>, one hour, and <strong>20 edited</strong> high-resolution
              photos delivered in a private gallery — no beach trip required for a good backdrop.
              Direction is bilingual (English and Spanish), which matters when you&rsquo;ve got young
              kids who respond better in one language, or grandparents visiting who only speak
              English. The walk covers a stone archway with an iron gate, a colonial-era colonnade
              corridor, and granite steps — real streets and real buildings, not a studio backdrop.
              Golden hour here runs <strong>5:30 to 6:10 PM</strong>, when the stone and brick actually
              pick up color instead of going flat under midday sun. Bigger families or multigenerational
              groups get a custom quote rather than a guessed number. A <strong>50% deposit</strong>{" "}
              holds the date, and the gallery lands within <strong>7 days</strong> of the session.
            </p>
          </div>

          <div className="uncropped-photo-stack">
            <img src={`${CLOUDINARY_BASE}${verticalPhoto.src}`} alt={verticalPhoto.alt} loading="lazy" />
            <div className="photo-pair-grid">
              {horizontalPhotos.map((photo) => (
                <img key={photo.src} src={`${CLOUDINARY_BASE}${photo.src}`} alt={photo.alt} loading="lazy" />
              ))}
            </div>
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
            $370 USD · up to 5 people · 1-hour session · 20 edited photos · 50% deposit to book.
          </p>
        </div>
      </section>

      <section className="section booking-cta">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Book your family session</p>
              <h2>See the full gallery and book your date</h2>
              <p>
                The full gallery, availability calendar, and date booking are handled on Fotógrafo
                Santo Domingo, the team&rsquo;s main booking site.
              </p>
            </div>
            <div className="booking-cta-actions">
              <a className="button button-light" href={FSD_GALLERY_URL} rel="noopener">
                See full gallery
              </a>
              <a className="button button-ghost" href={FSD_BOOK_URL} rel="noopener">
                Book now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p style={{ color: "var(--muted)" }}>
            Direct contact: <a href={`tel:${phoneE164}`}>{phoneDisplay}</a> ·{" "}
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
