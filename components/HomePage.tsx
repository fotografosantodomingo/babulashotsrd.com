import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import {
  extractFirstImage,
  pages,
  plainExcerpt,
  plainTitle,
  posts
} from "@/lib/parentContent";
import {
  bodaUrl,
  canonicalUrl,
  droneUrl,
  estudioUrl,
  inmobiliariaUrl,
  niche,
  organizationSchema,
  phoneDisplay,
  phoneE164,
  siteUrl,
  whatsappUrl
} from "@/lib/seo";

export function HomePage() {
  const recent = posts.slice(0, 3);

  const url = canonicalUrl("/");
  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Babula Shots",
      url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?s={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Babula Shots", item: url }
      ]
    }
  ];

  const subdomains = [
    {
      label: "Estudio fotográfico",
      url: estudioUrl,
      tag: "Sesiones en estudio",
      desc: "Retratos, corporativo, comida y producto, embarazo, quinceañera, headshots profesionales. Estudio propio en Santo Domingo con iluminación Profoto."
    },
    {
      label: "Bodas",
      url: bodaUrl,
      tag: "Wedding photography",
      desc: "Bodas en iglesia, civiles, ceremonias en la playa, bodas destino y resorts. Cobertura completa con drone aéreo opcional. Precios fijos."
    },
    {
      label: "Inmobiliaria",
      url: inmobiliariaUrl,
      tag: "Real estate photography",
      desc: "Fotografía de apartamentos, casas, villas y proyectos para portales y MLS. Entrega en 48-72 horas. Drone aéreo y video walkthrough opcional."
    },
    {
      label: "Drone",
      url: droneUrl,
      tag: "Aerial drone services",
      desc: "Vuelos certificados IDAC con DJI Mavic 3 Pro. Inmobiliaria, construcción, turismo, eventos. Cobertura en toda República Dominicana."
    }
  ];

  return (
    <main>
      <SeoJsonLd data={schema as Record<string, unknown>[]} />

      <section className="hero" id="hero">
        <div className="hero-content">
          <p className="eyebrow">Babula Shots — Red de fotografía profesional</p>
          <h1>Fotógrafo profesional en República Dominicana</h1>
          <p>
            Cuatro estudios especializados bajo la misma red: bodas, fotografía inmobiliaria, drone aéreo y estudio profesional para retratos, comida y campañas. Cobertura en Santo Domingo, Punta Cana, Santiago, La Romana, Casa de Campo, Bávaro, Las Terrenas y toda República Dominicana.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href={whatsappUrl(niche.whatsappContext)} rel="noopener">
              WhatsApp {phoneDisplay}
            </a>
            <a className="button button-ghost" href={`tel:${phoneE164}`}>
              {phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <p className="section-tag">La red Babula Shots</p>
            <h2>Cuatro estudios especializados</h2>
            <p>
              Cada subdominio es un sitio independiente con catálogo, precios y FAQ específicos al servicio. Toda la red comparte el mismo equipo, la misma calidad de entrega, y el mismo número de contacto.
            </p>
          </div>
          <div className="card-grid">
            {subdomains.map((s) => (
              <a key={s.url} className="card" href={s.url} rel="noopener">
                <span>{s.tag}</span>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
                <p style={{ marginTop: ".5rem", color: "var(--accent)" }}>
                  {s.url.replace("https://", "")} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="wrap">
          <div className="section-heading">
            <p className="section-tag">Cómo funciona</p>
            <h2>Del primer mensaje a la galería final</h2>
          </div>
          <div className="card-grid">
            <article className="card">
              <span>1 — Cotización</span>
              <h3>Escríbenos por WhatsApp</h3>
              <p>Cuéntanos el tipo de servicio, fecha y locación. Respuesta con disponibilidad y propuesta detallada en menos de 24 horas. Sin formularios largos, sin esperas.</p>
            </article>
            <article className="card">
              <span>2 — Reserva</span>
              <h3>Confirma con 50% de depósito</h3>
              <p>Recibes acuerdo simple, agenda confirmada y guía de preparación específica al tipo de sesión. Saldo se paga el día del servicio.</p>
            </article>
            <article className="card">
              <span>3 — Entrega</span>
              <h3>Galería online + archivos en alta</h3>
              <p>Tiempos por servicio: inmobiliaria 48-72h, retratos 5-7 días, bodas 4-6 semanas con sneak-peek en 7 días. Galería privada compartible.</p>
            </article>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-tag">Blog</p>
              <h2>Últimos artículos</h2>
              <p>Guías, locaciones, precios y consejos de fotografía profesional en República Dominicana.</p>
            </div>
            <div className="card-grid">
              {recent.map((p) => {
                const img = extractFirstImage(p);
                return (
                  <Link key={p.slug} className="card" href={`/${p.slug}/`}>
                    {img ? <img src={img.src} alt={img.alt} loading="lazy" decoding="async" /> : null}
                    <span>Artículo</span>
                    <h3>{plainTitle(p)}</h3>
                    <p>{plainExcerpt(p, 160)}</p>
                  </Link>
                );
              })}
            </div>
            <p style={{ marginTop: "1.5rem" }}>
              <Link href="/blog/" className="inline-link">Ver todo el blog</Link>
            </p>
          </div>
        </section>
      )}

      <section className="section booking-cta" id="contacto">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Contacto</p>
              <h2>Habla con el equipo Babula Shots</h2>
              <p>
                Atención bilingüe (ES/EN). Respondemos en menos de 24 horas. Reserva con 50% de depósito; aceptamos transferencia local, tarjeta, Wise y Zelle para clientes internacionales.
              </p>
            </div>
            <div className="booking-cta-actions">
              <a className="button button-light" href={whatsappUrl(niche.whatsappContext)} rel="noopener">
                WhatsApp {phoneDisplay}
              </a>
              <a className="button button-ghost" href={`tel:${phoneE164}`}>
                Llamar {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CrossSiteCta locale="es" />
    </main>
  );
}
