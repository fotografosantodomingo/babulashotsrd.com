import type { Metadata } from "next";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { canonicalUrl, email, organizationSchema, phoneDisplay, phoneE164, siteUrl } from "@/lib/seo";

const PAGE_PATH = "/bautizos/";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const EN_MIRROR = canonicalUrl("/en/baptism/");

const FSD_GALLERY_URL = "https://www.fotografosantodomingo.com/es/eventos/fotografo-bautizo-santo-domingo";
const FSD_BOOK_URL = "https://www.fotografosantodomingo.com/es/book?service=birthday-event-photography__baptism";

const title = "Bautizos con Babula Shots · Fotografía en Santo Domingo desde RD$16,000";
const description =
  "Fotografía de bautizo en las iglesias de la Zona Colonial de Santo Domingo. Sesión de 2 horas, desde RD$16,000, entrega en galería privada. Reserva a través de Fotógrafo Santo Domingo.";

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
        url: "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/v1787789561/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_12_ic8dk0.webp",
        width: 1200,
        height: 800,
        alt: "Bautizo en una iglesia de la Zona Colonial, Santo Domingo — Babula Shots"
      }
    ]
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Babula Shots", item: `${siteUrl}/` },
    { "@type": "ListItem", position: 2, name: "Bautizos", item: PAGE_URL }
  ]
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Fotografía de bautizo en Santo Domingo",
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
    alt: "Sacerdote derramando agua sobre la cabeza de la bebé en la pila bautismal, en brazos de la madrina, con padres y padrinos alrededor"
  },
  {
    src: "v1787789561/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_12_ic8dk0.webp",
    alt: "Padre y su hija llegando juntos a la puerta de piedra de la iglesia antes del bautizo"
  },
  {
    src: "v1787789563/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_13_mvmbzf.webp",
    alt: "Madre caminando de la mano de su hija hacia la entrada de la iglesia"
  },
  {
    src: "v1787789560/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_11_oby1pm.webp",
    alt: "Bebé vestido de blanco para el bautizo frente al altar"
  },
  {
    src: "v1787789554/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_2_hliana.webp",
    alt: "Vista amplia de la nave de la iglesia durante la ceremonia completa de bautizo"
  },
  {
    src: "v1787789558/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_7_a9djog.webp",
    alt: "Sacerdote bendiciendo a la familia frente al altar dorado"
  },
  {
    src: "v1787789560/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_10_ntmbpu.webp",
    alt: "Retrato familiar frente al altar dorado, grupo pequeño"
  },
  {
    src: "v1787789564/Fotografo_Bautismo_Santo_Domingo_Republiica_Dominicana_Babula_Shots_14_hs1rlx.webp",
    alt: "Retrato de familia extendida frente al altar dorado, grupo grande"
  }
];

const CLOUDINARY_BASE = "https://res.cloudinary.com/dwewurxla/image/upload/f_auto,q_auto/";

export default function BautizosPage() {
  return (
    <main>
      <SeoJsonLd data={[organizationSchema, serviceSchema, breadcrumbSchema] as Record<string, unknown>[]} />

      <section className="section">
        <div className="wrap" style={{ maxWidth: "780px" }}>
          <p className="eyebrow">Fotografía de bautizo</p>
          <h1>Fotógrafo de Bautizo en Santo Domingo y República Dominicana</h1>

          <p>
            En Babula Shots cubrimos bautizos dentro de las iglesias de piedra de la Zona Colonial de
            Santo Domingo — altares barrocos dorados, vitrales, paredes con siglos de historia encima.
            No armamos poses ni interrumpimos la misa: nos movemos entre los bancos, buscamos la luz
            que entra por las ventanas altas y esperamos el momento real, sea el bebé mirando al
            sacerdote, la abuela llorando o el padrino sosteniendo la vela con cuidado. La sesión dura
            2 horas: llegada, ceremonia completa y el grupo familiar frente al altar al terminar. En
            Santo Domingo el paquete cuesta <strong>RD$16,000</strong>; si el bautizo es en otra ciudad
            del país cobramos <strong>RD$20,000 fijo</strong>, viáticos incluidos, sin sorpresas en la
            factura después. Para reservar la fecha pedimos <strong>50% de depósito</strong>, y el
            resto se paga el mismo día. Las fotos editadas llegan en una galería privada en línea, en
            alta resolución, lista para descargar e imprimir.
          </p>

          <p>
            No trabajamos solo en Santo Domingo: cubrimos bautizos en Punta Cana, Bávaro, Cap Cana, La
            Romana, Casa de Campo, Santiago, Puerto Plata, Samaná, Las Terrenas, Jarabacoa y el resto
            del país, siempre bajo la tarifa plana de RD$20,000 fuera de Santo Domingo. La entrega es
            digital, a través de la galería privada en línea; si además quieres álbum impreso o fotos
            enmarcadas, lo coordinamos como servicio adicional opcional.
          </p>

          <div className="uncropped-photo-stack">
            {photos.map((photo) => (
              <img key={photo.src} src={`${CLOUDINARY_BASE}${photo.src}`} alt={photo.alt} loading="lazy" />
            ))}
          </div>

          <p style={{ fontSize: "0.95rem", color: "var(--muted)" }}>
            Desde RD$16,000 en Santo Domingo · RD$20,000 fijo en el resto del país · sesión de 2 horas
            · depósito del 50% para reservar.
          </p>
        </div>
      </section>

      <section className="section booking-cta">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Reserva tu bautizo</p>
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
