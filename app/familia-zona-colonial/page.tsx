import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { canonicalUrl, email, localBusinessSchema, organizationSchema, phoneDisplay, phoneE164, siteUrl } from "@/lib/seo";

const PAGE_PATH = "/familia-zona-colonial/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const EN_MIRROR = canonicalUrl("/en/family-zona-colonial/");

const FSD_GALLERY_URL = "https://www.fotografosantodomingo.com/es/familia/zona-colonial-santo-domingo";
const FSD_BOOK_URL = "https://www.fotografosantodomingo.com/es/book?service=family-beach-photography__essential";

const title = "Fotos Familiares en la Zona Colonial · Babula Shots · desde $370 USD";
const description =
  "Sesión de fotos familiar en la Zona Colonial de Santo Domingo. $370 USD, hasta 5 personas, 1 hora, 20 fotos editadas. Dirección bilingüe. Reserva a través de Fotógrafo Santo Domingo.";

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
        url: "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_1_a69rq4.webp",
        width: 1200,
        height: 1600,
        alt: "Familia frente a un arco de piedra con reja de hierro en la Zona Colonial, Santo Domingo — Babula Shots"
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Fotos Familiares Zona Colonial", item: PAGE_URL }
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
  alt: "Familia de cuatro posando frente a un arco de piedra colonial con reja de hierro forjado"
};

const horizontalPhotos = [
  {
    src: "v1788218695/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_3_fknonb.webp",
    alt: "Dos hermanos sentados en un murete de piedra contra una pared de ladrillo colonial"
  },
  {
    src: "v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_5_azyfeg.webp",
    alt: "Dos hermanos corriendo tomados de la mano frente a un arco colonial"
  },
  {
    src: "v1788218696/Fotografo_Zona_Colonial_Santo_Domingo_Republica_Dominicana_babula_SHots_8_vjqwlm.webp",
    alt: "Niño en un momento espontáneo sobre los escalones de piedra de la Zona Colonial"
  }
];

export default function FamiliaZonaColonialPage() {
  return (
    <main>
      <SeoJsonLd data={[organizationSchema, localBusinessSchema, serviceSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap">
          <div style={{ maxWidth: "70ch" }}>
            <p className="eyebrow">Fotografía familiar</p>
            <h1>Fotos Familiares en la Zona Colonial</h1>

            <p>
              ¿Cuánto cuesta una sesión familiar en la Zona Colonial de Santo Domingo? El paquete de
              Babula Shots cuesta <strong>$370 USD</strong> para hasta <strong>5 personas</strong>,
              dura <strong>1 hora</strong> y entrega <strong>20 fotos editadas</strong> en alta
              resolución — sin tener que ir hasta la playa para conseguir un buen fondo. Trabajamos
              con dirección bilingüe (inglés y español), algo que ayuda bastante cuando hay niños
              pequeños que responden mejor en un idioma, o abuelos de visita que solo hablan inglés.
              El recorrido pasa por un arco de piedra con reja de hierro, un corredor de columnas de
              la época colonial y escalones de granito — calles y edificios reales, no un set armado.
              La hora dorada aquí es de <strong>5:30 a 6:10 PM</strong>, cuando la piedra y el ladrillo
              realmente toman color en vez de verse planos bajo el sol del mediodía. Familias más
              grandes o con varias generaciones reciben cotización aparte según el grupo. El{" "}
              <strong>50% de depósito</strong> reserva la fecha, y la galería llega dentro de los{" "}
              <strong>7 días</strong> siguientes a la sesión.
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
            $370 USD · hasta 5 personas · sesión de 1 hora · 20 fotos editadas · depósito del 50% para
            reservar.
          </p>
        </div>
      </section>

      <section className="section booking-cta">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Reserva tu sesión familiar</p>
              <h2>Ve la galería completa y reserva la fecha</h2>
              <p>
                La galería completa, el calendario de disponibilidad y la reserva de fecha se manejan
                en Fotógrafo Santo Domingo, el sitio principal de reservas del equipo.
              </p>
            </div>
            <div className="booking-cta-actions">
              <a className="button button-light" href={FSD_GALLERY_URL} rel="noopener">
                Ver galería completa
              </a>
              <a className="button button-ghost" href={FSD_BOOK_URL} rel="noopener">
                Reservar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p style={{ color: "var(--muted)" }}>
            Contacto directo: <a href={`tel:${phoneE164}`}>{phoneDisplay}</a> ·{" "}
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
