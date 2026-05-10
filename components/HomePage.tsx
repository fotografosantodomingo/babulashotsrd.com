import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import {
  extractFirstImage,
  plainExcerpt,
  plainTitle,
  posts
} from "@/lib/parentContent";
import { getEnContent } from "@/lib/enContent";
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

type Lang = "es" | "en";

const COPY = {
  es: {
    path: "/",
    eyebrow: "Babula Shots — Red de fotografía profesional",
    h1: "Fotógrafo profesional en República Dominicana",
    intro:
      "Cuatro estudios especializados bajo la misma red: bodas, fotografía inmobiliaria, drone aéreo y estudio profesional para retratos, comida y campañas. Cobertura en Santo Domingo, Punta Cana, Santiago, La Romana, Casa de Campo, Bávaro, Las Terrenas y toda República Dominicana.",
    networkTag: "La red Babula Shots",
    networkH2: "Cuatro estudios especializados",
    networkLead:
      "Cada subdominio es un sitio independiente con catálogo, precios y FAQ específicos al servicio. Toda la red comparte el mismo equipo, la misma calidad de entrega, y el mismo número de contacto.",
    featuredTag: "Trabajos destacados",
    featuredH2: "Galerías y locaciones",
    featuredLead: "Una muestra del trabajo reciente — sesiones, galerías de bodas, estudio y destinos en República Dominicana.",
    howTag: "Cómo funciona",
    howH2: "Del primer mensaje a la galería final",
    step1Tag: "1 — Cotización",
    step1H3: "Escríbenos por WhatsApp",
    step1P: "Cuéntanos el tipo de servicio, fecha y locación. Respuesta con disponibilidad y propuesta detallada en menos de 24 horas. Sin formularios largos, sin esperas.",
    step2Tag: "2 — Reserva",
    step2H3: "Confirma con 50% de depósito",
    step2P: "Recibes acuerdo simple, agenda confirmada y guía de preparación específica al tipo de sesión. Saldo se paga el día del servicio.",
    step3Tag: "3 — Entrega",
    step3H3: "Galería online + archivos en alta",
    step3P: "Tiempos por servicio: inmobiliaria 48-72h, retratos 5-7 días, bodas 4-6 semanas con sneak-peek en 7 días. Galería privada compartible.",
    blogTag: "Blog",
    blogH2: "Últimos artículos",
    blogLead: "Guías, locaciones, precios y consejos de fotografía profesional en República Dominicana.",
    blogCardLabel: "Artículo",
    blogAll: "Ver todo el blog",
    contactTag: "Contacto",
    contactH2: "Habla con el equipo Babula Shots",
    contactLead: "Atención bilingüe (ES/EN). Respondemos en menos de 24 horas. Reserva con 50% de depósito; aceptamos transferencia local, tarjeta, Wise y Zelle para clientes internacionales.",
    callBtn: "Llamar",
    subdomainsLink: "Visitar",
    blogHref: "/blog/"
  },
  en: {
    path: "/en/",
    eyebrow: "Babula Shots — Professional photography network",
    h1: "Professional photographer in the Dominican Republic",
    intro:
      "Four specialised studios under one network: weddings, real estate photography, aerial drone services and a professional studio for portraits, food and editorial campaigns. Coverage in Santo Domingo, Punta Cana, Santiago, La Romana, Casa de Campo, Bávaro, Las Terrenas and across the Dominican Republic.",
    networkTag: "The Babula Shots network",
    networkH2: "Four specialised studios",
    networkLead:
      "Each sub-site is an independent studio with its own catalogue, pricing and FAQ. The whole network shares the same team, the same delivery standards and the same contact number.",
    featuredTag: "Featured work",
    featuredH2: "Galleries and locations",
    featuredLead: "A sample of recent work — sessions, wedding galleries, studio and destination shoots in the Dominican Republic.",
    howTag: "How it works",
    howH2: "From the first message to the final gallery",
    step1Tag: "1 — Quote",
    step1H3: "Send us a WhatsApp message",
    step1P: "Tell us the type of service, date and location. We respond with availability and a detailed proposal in under 24 hours. No long forms, no waiting.",
    step2Tag: "2 — Booking",
    step2H3: "Confirm with a 50% deposit",
    step2P: "You'll get a simple agreement, a confirmed date and a preparation guide for your specific session type. Balance is due on the session day.",
    step3Tag: "3 — Delivery",
    step3H3: "Online gallery + high-resolution files",
    step3P: "Turnaround by service: real estate 48-72h, portraits 5-7 days, weddings 4-6 weeks with a sneak-peek in 7 days. Private shareable gallery.",
    blogTag: "Blog",
    blogH2: "Latest articles",
    blogLead: "Guides, locations, pricing and tips on professional photography in the Dominican Republic.",
    blogCardLabel: "Article",
    blogAll: "View the full blog",
    contactTag: "Contact",
    contactH2: "Talk to the Babula Shots team",
    contactLead: "Bilingual support (ES/EN). We reply within 24 hours. Book with a 50% deposit; we accept local bank transfer, credit card, Wise and Zelle for international clients.",
    callBtn: "Call",
    subdomainsLink: "Visit",
    blogHref: "/blog/"
  }
} as const;

const SUBDOMAINS = (lang: Lang) => [
  {
    label: lang === "en" ? "Photo studio" : "Estudio fotográfico",
    url: estudioUrl,
    tag: lang === "en" ? "Studio sessions" : "Sesiones en estudio",
    desc: lang === "en"
      ? "Portraits, corporate headshots, food and product, maternity, sweet-sixteen and editorial sessions. Private Santo Domingo studio with Profoto lighting."
      : "Retratos, corporativo, comida y producto, embarazo, quinceañera, headshots profesionales. Estudio propio en Santo Domingo con iluminación Profoto.",
    image: {
      src: "/wp-content/uploads/2025/02/Sesion-de-fotos-en-Estudio6-1-768x512.webp",
      alt: lang === "en"
        ? "Professional photo session in studio in Santo Domingo"
        : "Sesión de fotos profesional en estudio fotográfico en Santo Domingo",
      width: 768,
      height: 512
    }
  },
  {
    label: lang === "en" ? "Weddings" : "Bodas",
    url: bodaUrl,
    tag: lang === "en" ? "Wedding photography" : "Fotografía de bodas",
    desc: lang === "en"
      ? "Church weddings, civil ceremonies, beach weddings, destination and resort coverage. Full-day coverage with optional aerial drone. Fixed pricing."
      : "Bodas en iglesia, civiles, ceremonias en la playa, bodas destino y resorts. Cobertura completa con drone aéreo opcional. Precios fijos.",
    image: {
      src: "/wp-content/uploads/2025/02/fotografo-de-bodas-republica-dominicana-5-768x512.webp",
      alt: lang === "en"
        ? "Wedding photographer in the Dominican Republic covering a ceremony"
        : "Fotógrafo de bodas en República Dominicana cubriendo ceremonia",
      width: 768,
      height: 512
    }
  },
  {
    label: lang === "en" ? "Real estate" : "Inmobiliaria",
    url: inmobiliariaUrl,
    tag: lang === "en" ? "Real estate photography" : "Fotografía inmobiliaria",
    desc: lang === "en"
      ? "Photography of apartments, houses, villas and developments for portals and MLS. 48-72 hour delivery. Optional aerial drone and walkthrough video."
      : "Fotografía de apartamentos, casas, villas y proyectos para portales y MLS. Entrega en 48-72 horas. Drone aéreo y video walkthrough opcional.",
    image: {
      src: "/wp-content/uploads/2024/07/mejor-fotografo-de-inmobiliaria-RD-Santo-Domingo-Punta-Cana-768x867.png",
      alt: lang === "en"
        ? "Professional real estate photography in the Dominican Republic"
        : "Fotografía inmobiliaria profesional en República Dominicana",
      width: 768,
      height: 867
    }
  },
  {
    label: "Drone",
    url: droneUrl,
    tag: lang === "en" ? "Aerial drone services" : "Servicios aéreos con drone",
    desc: lang === "en"
      ? "IDAC-certified flights with DJI Mavic 3 Pro. Real estate, construction, tourism, events. Coverage across the whole Dominican Republic."
      : "Vuelos certificados IDAC con DJI Mavic 3 Pro. Inmobiliaria, construcción, turismo, eventos. Cobertura en toda República Dominicana.",
    image: {
      src: "/wp-content/uploads/2026/04/santo-domingo-piloto-drone-servicio-profesional-768x512.webp",
      alt: lang === "en"
        ? "Professional IDAC-certified drone pilot in Santo Domingo"
        : "Piloto de drone profesional certificado IDAC en Santo Domingo",
      width: 768,
      height: 512
    }
  }
];

const FEATURED_GALLERY = (lang: Lang) => [
  {
    hrefEs: "/galeria-de-fotos/",
    hrefEn: "/en/photogallery/",
    src: "/wp-content/uploads/2026/03/sesion-fotos-pareja-zona-colonial-santo-domingo-768x1151.webp",
    altEs: "Galería de fotos — sesión de pareja Zona Colonial Santo Domingo",
    altEn: "Photo gallery — couple session in Zona Colonial Santo Domingo",
    width: 768,
    height: 1151,
    labelEs: "Galería de fotos",
    labelEn: "Photo gallery"
  },
  {
    hrefEs: "/fashion-photographer-gallery/",
    hrefEn: "/en/fashion-photographer-gallery/",
    src: "/wp-content/uploads/2025/03/Fashion-week-2025-768x512.webp",
    altEs: "Galería de moda — Fashion Week Republica Dominicana",
    altEn: "Fashion gallery — Fashion Week Dominican Republic",
    width: 768,
    height: 512,
    labelEs: "Galería de moda",
    labelEn: "Fashion gallery"
  },
  {
    hrefEs: "/galeria-de-fotoslas-terrenas-kite-surf/",
    hrefEn: "/en/kitesurf-photo-gallery-las-terrenas/",
    src: "/wp-content/uploads/2026/04/Babula-Shots-Rd-10-768x432.webp",
    altEs: "Galería de fotos kitesurf en Las Terrenas",
    altEn: "Kitesurf photo gallery in Las Terrenas",
    width: 768,
    height: 432,
    labelEs: "Kitesurf Las Terrenas",
    labelEn: "Kitesurf Las Terrenas"
  },
  {
    hrefEs: "/fotografo-en-tortuga-bay-punta-cana-republica-dominicana/",
    hrefEn: "/en/tortuga-bay-photographer-punta-cana/",
    src: "/wp-content/uploads/2026/04/tortuga-bay-fotografo-republica-dominicana-768x432.webp",
    altEs: "Sesión de fotos en Tortuga Bay Punta Cana República Dominicana",
    altEn: "Photo session in Tortuga Bay Punta Cana Dominican Republic",
    width: 768,
    height: 432,
    labelEs: "Tortuga Bay Punta Cana",
    labelEn: "Tortuga Bay Punta Cana"
  }
];

export function HomePage({ lang = "es" as Lang }: { lang?: Lang } = {}) {
  const t = COPY[lang];
  const recent = posts.slice(0, 3);
  const subdomains = SUBDOMAINS(lang);
  const featuredGallery = FEATURED_GALLERY(lang);

  const url = canonicalUrl(t.path);
  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Babula Shots",
      url,
      inLanguage: lang === "en" ? "en" : "es-DO",
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

  const heroImage = {
    src: "/wp-content/uploads/2026/05/babula-shots-volleyball-hero.webp",
    alt: lang === "en"
      ? "Editorial sports portrait by Babula Shots — Dominican Republic national volleyball player on court"
      : "Retrato editorial deportivo de Babula Shots — jugadora de voleibol del equipo nacional en cancha",
    width: 2457,
    height: 1536
  };

  const coverAlt = lang === "en"
    ? "Editorial portrait by Babula Shots — golden hour fashion session in the Dominican Republic"
    : "Retrato editorial Babula Shots — sesión de moda al atardecer en República Dominicana";

  return (
    <main>
      <SeoJsonLd data={schema as Record<string, unknown>[]} />

      <section className="cover-parallax" aria-label={coverAlt}>
        <div
          className="cover-parallax-bg"
          role="img"
          aria-label={coverAlt}
          style={{ backgroundImage: `url("/wp-content/uploads/2026/05/babula-shots-corn-field-cover.webp")` }}
        />
      </section>

      <section className="hero hero-with-image" id="hero">
        <div className="hero-content">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.h1}</h1>
          <p>{t.intro}</p>
        </div>
        <figure className="hero-media">
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            width={heroImage.width}
            height={heroImage.height}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-heading">
            <p className="section-tag">{t.networkTag}</p>
            <h2>{t.networkH2}</h2>
            <p>{t.networkLead}</p>
          </div>
          <div className="card-grid card-grid-4">
            {subdomains.map((s) => (
              <a key={s.url} className="card card-with-image" href={s.url} rel="noopener">
                <img
                  src={s.image.src}
                  alt={s.image.alt}
                  width={s.image.width}
                  height={s.image.height}
                  loading="lazy"
                  decoding="async"
                />
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
            <p className="section-tag">{t.featuredTag}</p>
            <h2>{t.featuredH2}</h2>
            <p>{t.featuredLead}</p>
          </div>
          <div className="featured-grid">
            {featuredGallery.map((g) => {
              const href = lang === "en" ? g.hrefEn : g.hrefEs;
              const alt = lang === "en" ? g.altEn : g.altEs;
              const label = lang === "en" ? g.labelEn : g.labelEs;
              return (
                <Link key={href} href={href} className="featured-card">
                  <img
                    src={g.src}
                    alt={alt}
                    width={g.width}
                    height={g.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="featured-label">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section alt-section">
        <div className="wrap">
          <div className="section-heading">
            <p className="section-tag">{t.howTag}</p>
            <h2>{t.howH2}</h2>
          </div>
          <div className="card-grid">
            <article className="card">
              <span>{t.step1Tag}</span>
              <h3>{t.step1H3}</h3>
              <p>{t.step1P}</p>
            </article>
            <article className="card">
              <span>{t.step2Tag}</span>
              <h3>{t.step2H3}</h3>
              <p>{t.step2P}</p>
            </article>
            <article className="card">
              <span>{t.step3Tag}</span>
              <h3>{t.step3H3}</h3>
              <p>{t.step3P}</p>
            </article>
          </div>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-heading">
              <p className="section-tag">{t.blogTag}</p>
              <h2>{t.blogH2}</h2>
              <p>{t.blogLead}</p>
            </div>
            <div className="card-grid">
              {recent.map((p) => {
                const img = extractFirstImage(p);
                const esPath = `/${p.slug}/`;
                const enContent = lang === "en" ? getEnContent(esPath) : undefined;
                const href = enContent?.enPath ?? esPath;
                const title = enContent?.h1 ?? plainTitle(p);
                const desc = enContent?.description ?? plainExcerpt(p, 160);
                return (
                  <Link key={p.slug} className="card" href={href}>
                    {img ? <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" /> : null}
                    <span>{t.blogCardLabel}</span>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </Link>
                );
              })}
            </div>
            <p style={{ marginTop: "1.5rem" }}>
              <Link href={t.blogHref} className="inline-link">{t.blogAll}</Link>
            </p>
          </div>
        </section>
      )}

      <section className="section booking-cta" id="contacto">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">{t.contactTag}</p>
              <h2>{t.contactH2}</h2>
              <p>{t.contactLead}</p>
            </div>
            <div className="booking-cta-actions">
              <a className="button button-whatsapp" href={whatsappUrl(niche.whatsappContext)} rel="noopener" aria-label={`WhatsApp ${phoneDisplay}`}>
                <svg className="button-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                  <path fill="currentColor" d="M16.003 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.594 4.46 1.722 6.39L3.2 28.8l6.55-1.715a12.74 12.74 0 0 0 6.252 1.595h.005c7.069 0 12.798-5.73 12.798-12.8 0-3.42-1.331-6.633-3.747-9.05A12.713 12.713 0 0 0 16.003 3.2zm0 23.36h-.004a10.62 10.62 0 0 1-5.42-1.484l-.388-.231-3.886 1.018 1.039-3.79-.253-.39a10.598 10.598 0 0 1-1.617-5.683c0-5.873 4.778-10.65 10.654-10.65 2.846 0 5.521 1.108 7.531 3.121a10.561 10.561 0 0 1 3.119 7.535c0 5.873-4.778 10.654-10.775 10.554zm5.834-7.973c-.32-.16-1.892-.933-2.184-1.04-.293-.107-.506-.16-.72.16-.213.32-.826 1.04-1.013 1.252-.187.213-.373.24-.693.08-.32-.16-1.351-.498-2.574-1.587-.951-.85-1.594-1.9-1.781-2.22-.187-.32-.02-.493.14-.652.143-.143.32-.374.48-.561.16-.187.213-.32.32-.534.107-.213.053-.4-.027-.561-.08-.16-.72-1.733-.987-2.373-.26-.624-.524-.539-.72-.55l-.613-.011a1.179 1.179 0 0 0-.853.4c-.293.32-1.12 1.094-1.12 2.667 0 1.573 1.146 3.094 1.306 3.307.16.213 2.255 3.443 5.464 4.83 2.547 1.092 3.067.875 3.622.823.555-.053 1.892-.773 2.158-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z" />
                </svg>
                <span>WhatsApp {phoneDisplay}</span>
              </a>
              <a className="button button-ghost" href={`tel:${phoneE164}`}>
                {t.callBtn} {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CrossSiteCta locale={lang} />
    </main>
  );
}
