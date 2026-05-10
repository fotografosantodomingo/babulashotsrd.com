import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { galleryPhotos } from "@/lib/galleryData";
import { getEnMirror } from "@/lib/langMirrors";
import {
  canonicalUrl,
  organizationSchema,
  phoneDisplay,
  phoneE164,
  siteUrl,
  whatsappUrl
} from "@/lib/seo";

type Lang = "es" | "en";

type GalleryPageProps = {
  lang: Lang;
  path: string;
  h1: string;
  intro: string;
  description: string;
  altPath: string;
};

const STRINGS = {
  es: {
    breadcrumbHome: "Inicio",
    breadcrumbCurrent: "Galería de fotos",
    ctaTag: "Reserva tu sesión",
    ctaHeading: "¿Listo para tu sesión con Babula Shots?",
    ctaBody:
      "Escríbenos por WhatsApp con tu fecha tentativa y tipo de sesión. Te respondemos con disponibilidad y cotización detallada en menos de 24 horas.",
    whatsapp: "WhatsApp",
    call: "Llamar",
    pricing: "Ver precios",
    pricingHref: "/fotografo/",
    relatedTag: "Sigue explorando",
    relatedHeading: "Servicios relacionados",
    altLangLabel: "View in English",
    whatsappContext: "Hola, vi la galería de fotos de Babula Shots y quiero consultar disponibilidad."
  },
  en: {
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Photo gallery",
    ctaTag: "Book your session",
    ctaHeading: "Ready for your session with Babula Shots?",
    ctaBody:
      "Send us a WhatsApp message with your tentative date and the type of session. You'll get availability and a detailed quote in less than 24 hours.",
    whatsapp: "WhatsApp",
    call: "Call",
    pricing: "View pricing",
    pricingHref: "/en/",
    relatedTag: "Keep exploring",
    relatedHeading: "Related services",
    altLangLabel: "Ver en español",
    whatsappContext: "Hi, I saw the Babula Shots photo gallery and would like to check availability."
  }
} as const;

const RELATED_LINKS: Record<Lang, Array<{ label: string; href: string; tag: string }>> = {
  es: [
    { tag: "Estudio", label: "Sesiones en estudio fotográfico", href: "https://estudio.babulashotsrd.com/sesion-de-fotos/" },
    { tag: "Bodas", label: "Fotógrafo de bodas en RD", href: "https://boda.babulashotsrd.com/" },
    { tag: "Inmobiliaria", label: "Fotografía inmobiliaria", href: "https://inmobiliaria.babulashotsrd.com/" },
    { tag: "Drone", label: "Servicios de drone aéreo", href: "https://dron.babulashotsrd.com/" }
  ],
  en: [
    { tag: "Studio", label: "Studio photography sessions", href: "https://estudio.babulashotsrd.com/en/" },
    { tag: "Weddings", label: "Wedding photographer in DR", href: "https://boda.babulashotsrd.com/en/" },
    { tag: "Real estate", label: "Real estate photography", href: "https://inmobiliaria.babulashotsrd.com/en/" },
    { tag: "Drone", label: "Aerial drone services", href: "https://dron.babulashotsrd.com/en/" }
  ]
};

export function GalleryPage({ lang, path, h1, intro, description, altPath }: GalleryPageProps) {
  const t = STRINGS[lang];
  const url = canonicalUrl(path);
  const altUrl = canonicalUrl(altPath);
  const related = RELATED_LINKS[lang];

  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      name: h1,
      description,
      url,
      inLanguage: lang === "en" ? "en" : "es-DO",
      isPartOf: { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Babula Shots" },
      image: galleryPhotos.map((p) => {
        const target = lang === "en" ? getEnMirror(p.hrefEs) : p.hrefEs;
        return {
          "@type": "ImageObject",
          contentUrl: `${siteUrl}${p.src}`,
          url: `${siteUrl}${p.src}`,
          width: p.width,
          height: p.height,
          name: lang === "en" ? p.titleEn : p.titleEs,
          caption: lang === "en" ? p.captionEn : p.captionEs,
          description: lang === "en" ? p.captionEn : p.captionEs,
          inLanguage: lang === "en" ? "en" : "es-DO",
          isPartOf: `${siteUrl}${target}`,
          creator: { "@type": "Organization", name: "Babula Shots" },
          copyrightHolder: { "@type": "Organization", name: "Babula Shots" },
          creditText: "Babula Shots",
          license: `${siteUrl}/terminos-y-condiciones-del-servicio-de-fotografia-de-babula-shots/`,
          acquireLicensePage: `${siteUrl}/contacto/`
        };
      })
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: lang === "en" ? canonicalUrl("/en/") : canonicalUrl("/") },
        { "@type": "ListItem", position: 2, name: t.breadcrumbCurrent, item: url }
      ]
    }
  ];

  return (
    <main>
      <SeoJsonLd data={schema as Record<string, unknown>[]} />
      <article className="article article-gallery">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href={lang === "en" ? "/en/" : "/"}>{t.breadcrumbHome}</Link>
          <span>/</span>
          <span>{t.breadcrumbCurrent}</span>
        </nav>
        <header className="article-header">
          <h1>{h1}</h1>
          <p style={{ maxWidth: "62ch", margin: ".5rem 0 0", color: "var(--muted)" }}>{intro}</p>
          <p style={{ margin: ".75rem 0 0" }}>
            <a href={altPath} hrefLang={lang === "en" ? "es-DO" : "en"} className="inline-link">
              {t.altLangLabel} →
            </a>
          </p>
        </header>

        {(() => {
          const wideCount = galleryPhotos.filter((p) => p.width >= p.height).length;
          const tallCount = galleryPhotos.length - wideCount;
          const orient = wideCount === galleryPhotos.length
            ? "sg-wide"
            : tallCount === galleryPhotos.length
              ? "sg-tall"
              : "sg-mixed";
          const count = galleryPhotos.length;
          const countCls = `sg-${count > 6 ? "many" : count}`;
          return (
            <div className={`smart-gallery ${orient} ${countCls}`}>
              {galleryPhotos.map((p, i) => {
                const title = lang === "en" ? p.titleEn : p.titleEs;
                const caption = lang === "en" ? p.captionEn : p.captionEs;
                const target = lang === "en" ? getEnMirror(p.hrefEs) : p.hrefEs;
                const ctaLabel = lang === "en" ? "View gallery" : "Ver galería";
                return (
                  <figure key={p.src} className="sg-item">
                    <a href={target} className="gallery-link" aria-label={`${ctaLabel}: ${title}`}>
                      <img
                        src={p.src}
                        alt={lang === "en" ? p.altEn : p.altEs}
                        width={p.width}
                        height={p.height}
                        loading={i < 3 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "auto"}
                        style={{ aspectRatio: `${p.width}/${p.height}` }}
                      />
                      <figcaption>
                        <strong className="gallery-title">{title}</strong>
                        <span className="gallery-caption-text">{caption}</span>
                      </figcaption>
                    </a>
                  </figure>
                );
              })}
            </div>
          );
        })()}

        <aside className="topical-links" aria-label={t.relatedHeading}>
          <p className="section-tag">{t.relatedTag}</p>
          <h2>{t.relatedHeading}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.href}>
                <a href={r.href} rel="noopener">
                  <span className="topical-tag">{r.tag}</span>
                  <span className="topical-label">{r.label}</span>
                  <span className="topical-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <aside className="article-cta" aria-label={t.ctaHeading}>
          <div className="article-cta-text">
            <p className="section-tag">{t.ctaTag}</p>
            <h2>{t.ctaHeading}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <div className="article-cta-actions">
            <a
              className="button button-light"
              href={whatsappUrl(t.whatsappContext)}
              rel="noopener"
            >
              {t.whatsapp} {phoneDisplay}
            </a>
            <a className="button button-outline" href={`tel:${phoneE164}`}>
              {t.call} {phoneDisplay}
            </a>
            <Link className="button button-ghost" href={t.pricingHref}>
              {t.pricing}
            </Link>
          </div>
        </aside>
      </article>
      <CrossSiteCta locale={lang} />
    </main>
  );
}
