"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { bodaUrl, droneUrl, email, inmobiliariaUrl, mainBrandUrl, phoneDisplay, santoDomingoHubUrl } from "@/lib/seo";
import { categories, tags } from "@/lib/staticTaxonomy";

type Lang = "es" | "en";

const NETWORK = (lang: Lang) => [
  {
    label: lang === "en" ? "Wedding photography" : "Fotografía de bodas",
    href: bodaUrl,
    description: lang === "en"
      ? "Weddings in Punta Cana, Santo Domingo and destinations across the Dominican Republic"
      : "Bodas en Punta Cana, Santo Domingo y destinos en Rep. Dominicana"
  },
  {
    label: lang === "en" ? "Real estate photography" : "Fotografía inmobiliaria",
    href: inmobiliariaUrl,
    description: lang === "en"
      ? "Photo, video and drone for properties, agents and developers"
      : "Foto, video y drone para propiedades, agentes y desarrolladores"
  },
  {
    label: lang === "en" ? "Aerial drone services" : "Tomas aéreas con drone",
    href: droneUrl,
    description: lang === "en"
      ? "Drone for real estate, construction, events and weddings"
      : "Drone para inmobiliaria, construcción, eventos y bodas"
  }
];

const ALSO_AT = (lang: Lang) => [
  {
    label: "babulashotsrd.com",
    href: mainBrandUrl,
    primary: lang === "en" ? "Main brand" : "Marca principal",
    description: lang === "en"
      ? "Premium photo and video agency in the Dominican Republic. Hub of the Babula Shots network."
      : "Agencia premium de foto y video en República Dominicana. Centro de la red Babula Shots."
  },
  {
    label: "fotografosantodomingo.com",
    href: santoDomingoHubUrl,
    primary: lang === "en" ? "Same photographer — newer site" : "El mismo fotógrafo — nueva web",
    description: lang === "en"
      ? "Page by Babula Shots with all services: weddings, portraits, commercial, events."
      : "Página por Babula Shots con todos los servicios disponibles: bodas, retratos, comercial, eventos."
  }
];

const COPY = {
  es: {
    brandTag: "Red de fotografía profesional",
    brandSnippet:
      "Red Babula Shots — fotografía profesional en Santo Domingo: bodas, estudio, inmobiliaria, drone y video. Cobertura en toda la República Dominicana.",
    sectionNetwork: "Red Babula Shots",
    sectionContact: "Contacto",
    sectionAlso: "También en",
    sectionCats: "Categorías",
    sectionTags: "Etiquetas",
    linkBlog: "Blog",
    linkGallery: "Galería",
    linkGalleryHref: "/galeria-de-fotos/",
    linkPrices: "Precios",
    linkPricesHref: "/precios-y-paquetes-sesion-de-fotos-en/",
    linkBooking: "Reserva tu sesión",
    linkBookingHref: "/contacto/",
    copyright: "Todos los derechos reservados."
  },
  en: {
    brandTag: "Professional photography network",
    brandSnippet:
      "Babula Shots network — professional photography in Santo Domingo: weddings, studio, real estate, drone and video. Coverage across the Dominican Republic.",
    sectionNetwork: "Babula Shots network",
    sectionContact: "Contact",
    sectionAlso: "Also at",
    sectionCats: "Categories",
    sectionTags: "Tags",
    linkBlog: "Blog",
    linkGallery: "Gallery",
    linkGalleryHref: "/en/photogallery/",
    linkPrices: "Pricing",
    linkPricesHref: "/en/prices-and-photo-session-packages/",
    linkBooking: "Book a session",
    linkBookingHref: "/en/contact/",
    copyright: "All rights reserved."
  }
} as const;

export function SiteFooter() {
  const pathname = usePathname() || "/";
  const lang: Lang = pathname.startsWith("/en") ? "en" : "es";
  const t = COPY[lang];
  const networkLinks = NETWORK(lang);
  const alsoAtLinks = ALSO_AT(lang);
  const catPrefix = lang === "en" ? "/en/category/" : "/category/";
  const tagPrefix = lang === "en" ? "/en/tag/" : "/tag/";
  const blogHref = lang === "en" ? "/en/blog/" : "/blog/";

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-brand-name">Babula Shots RD</p>
          <p className="footer-brand-tag">{t.brandTag}</p>
          <p className="footer-brand-snippet">{t.brandSnippet}</p>
        </div>
        <div className="footer-network" aria-label={t.sectionNetwork}>
          <p className="footer-section-title">{t.sectionNetwork}</p>
          <ul>
            {networkLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} rel="noopener">
                  <span className="net-label">{link.label}</span>
                  <span className="net-desc">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-contact">
          <p className="footer-section-title">{t.sectionContact}</p>
          <p>
            <a href={`tel:${phoneDisplay.replace(/\s/g, "")}`}>{phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
      </div>
      <div className="footer-also" aria-label={t.sectionAlso}>
        <p className="footer-section-title">
          <span aria-hidden="true">{"\u{1F310}"}</span> {t.sectionAlso}
        </p>
        <ul>
          {alsoAtLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener">
                <span className="also-label">
                  {link.label}
                  <span aria-hidden="true" className="also-arrow">{"→"}</span>
                </span>
                <span className="also-primary">{link.primary}</span>
                <span className="also-desc">{link.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer-areas" aria-label={t.sectionCats}>
        <p className="footer-section-title">{t.sectionCats}</p>
        <div>
          {categories.map((c) => (
            <Link key={c.slug} href={`${catPrefix}${c.slug}/`}>
              {lang === "en" ? c.nameEn ?? c.name : c.name}
            </Link>
          ))}
          <Link href={blogHref}>{t.linkBlog}</Link>
          <Link href={t.linkGalleryHref}>{t.linkGallery}</Link>
          <Link href={t.linkPricesHref}>{t.linkPrices}</Link>
          <Link href={t.linkBookingHref}>{t.linkBooking}</Link>
        </div>
      </div>
      <div className="footer-areas" aria-label={t.sectionTags}>
        <p className="footer-section-title">{t.sectionTags}</p>
        <div>
          {tags.slice(0, 18).map((tg) => (
            <Link key={tg.slug} href={`${tagPrefix}${tg.slug}/`}>
              {lang === "en" ? tg.nameEn ?? tg.name : tg.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>(c) {new Date().getFullYear()} Babula Shots RD. {t.copyright}</p>
      </div>
    </footer>
  );
}
