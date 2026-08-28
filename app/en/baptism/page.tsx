import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { canonicalUrl, email, organizationSchema, phoneDisplay, phoneE164, siteUrl } from "@/lib/seo";

const PAGE_PATH = "/en/baptism/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const ES_MIRROR = canonicalUrl("/bautizos/");

const FSD_GALLERY_URL = "https://www.fotografosantodomingo.com/en/events/baptism-photographer-santo-domingo";
const FSD_BOOK_URL = "https://www.fotografosantodomingo.com/en/book?service=birthday-event-photography__baptism";

const title = "Baptism Photography with Babula Shots · Santo Domingo, from RD$16,000";
const description =
  "Baptism photography inside the churches of Santo Domingo's Zona Colonial. 2-hour session, from RD$16,000, delivered in a private gallery. Book through Fotógrafo Santo Domingo.";

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
        url: "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/v1787789561/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_12_ic8dk0.webp",
        width: 1200,
        height: 800,
        alt: "Baptism at a church in the Zona Colonial, Santo Domingo — Babula Shots"
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/en/` },
    { "@type": "ListItem", position: 2, name: "Baptism Photography", item: PAGE_URL }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Baptism photography in Santo Domingo",
  serviceType: "Baptism photography",
  description,
  provider: { "@id": `${siteUrl}#organization` },
  areaServed: [
    { "@type": "City", name: "Santo Domingo" },
    { "@type": "Country", name: "Dominican Republic" }
  ],
  offers: {
    "@type": "Offer",
    priceCurrency: "DOP",
    price: "16000",
    url: FSD_BOOK_URL,
    availability: "https://schema.org/InStock"
  }
};

const photos = [
  {
    src: "v1787789555/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_5_af3w37.webp",
    alt: "Priest pouring water over the baby's head at the baptismal font, held by the godmother, with parents and godfather gathered around"
  },
  {
    src: "v1787789561/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_12_ic8dk0.webp",
    alt: "Father and daughter arriving together at the church's stone doorway before the baptism"
  },
  {
    src: "v1787789563/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_13_mvmbzf.webp",
    alt: "Mother walking her daughter toward the church entrance"
  },
  {
    src: "v1787789560/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_11_oby1pm.webp",
    alt: "Toddler in a white christening outfit standing at the altar"
  },
  {
    src: "v1787789554/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_2_hliana.webp",
    alt: "Wide shot of the church nave during the full baptism ceremony"
  },
  {
    src: "v1787789558/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_7_a9djog.webp",
    alt: "Priest blessing the family in front of the gilded altarpiece"
  },
  {
    src: "v1787789560/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_10_ntmbpu.webp",
    alt: "Small family portrait in front of the gilded altar"
  },
  {
    src: "v1787789564/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_14_hs1rlx.webp",
    alt: "Large extended-family group portrait in front of the gilded altar"
  }
];

const CLOUDINARY_BASE = "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/";

export default function BaptismPage() {
  return (
    <main lang="en">
      <SeoJsonLd data={[organizationSchema, serviceSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p className="eyebrow">Baptism photography</p>
          <h1>Baptism Photography with Babula Shots</h1>

          <p>
            Babula Shots shoots baptisms inside the stone churches of Santo Domingo&rsquo;s Zona
            Colonial — gilded Baroque altarpieces, stained glass, walls that have stood for
            centuries. We don&rsquo;t stage anything or get in the priest&rsquo;s way: we work the
            aisles, chase the light coming through the high windows, and wait for the real moment —
            the baby staring up at the priest, a grandmother tearing up, the godfather holding the
            candle steady. Coverage runs 2 hours, from arrival through the full ceremony to the family
            group shot at the altar once it&rsquo;s over. In Santo Domingo the package is{" "}
            <strong>RD$16,000</strong>; anywhere else in the country it&rsquo;s a flat{" "}
            <strong>RD$20,000</strong>, travel included, no line-item surprises later. A{" "}
            <strong>50% deposit</strong> holds your date, and the rest is due the day of the session.
            Edited, high-resolution photos land in a private online gallery, ready to download and
            print.
          </p>

          <div className="uncropped-photo-stack">
            {photos.map((photo) => (
              <img key={photo.src} src={`${CLOUDINARY_BASE}${photo.src}`} alt={photo.alt} loading="lazy" />
            ))}
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
            From RD$16,000 in Santo Domingo · flat RD$20,000 elsewhere in the country · 2-hour session
            · 50% deposit to book.
          </p>
        </div>
      </section>

      <section className="section booking-cta">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Book your baptism</p>
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
