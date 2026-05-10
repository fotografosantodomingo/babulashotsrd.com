"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeLanguageControls } from "@/components/ThemeLanguageControls";

const BRAND_LOGO = "/wp-content/uploads/2023/05/cropped-cropped-babulashotslogo-1-270x270.png";
const BRAND_NAME = "Babula Shots RD";
const BRAND_STRONG = "Babula";
const BRAND_LIGHT = "Shots RD";

type Lang = "es" | "en";

const NAV = (lang: Lang): Array<{ label: string; href: string; external?: boolean }> => lang === "en"
  ? [
      { label: "Home", href: "/en/" },
      { label: "Studio", href: "https://estudio.babulashotsrd.com/en/", external: true },
      { label: "Weddings", href: "https://boda.babulashotsrd.com/en/", external: true },
      { label: "Real estate", href: "https://inmobiliaria.babulashotsrd.com/en/", external: true },
      { label: "Drone", href: "https://dron.babulashotsrd.com/en/", external: true },
      { label: "Blog", href: "/en/blog/" },
      { label: "Contact", href: "#contacto" }
    ]
  : [
      { label: "Inicio", href: "/" },
      { label: "Estudio", href: "https://estudio.babulashotsrd.com/", external: true },
      { label: "Bodas", href: "https://boda.babulashotsrd.com/", external: true },
      { label: "Inmobiliaria", href: "https://inmobiliaria.babulashotsrd.com/", external: true },
      { label: "Drone", href: "https://dron.babulashotsrd.com/", external: true },
      { label: "Blog", href: "/blog/" },
      { label: "Contacto", href: "#contacto" }
    ];

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const lang: Lang = pathname.startsWith("/en") ? "en" : "es";
  const navItems = NAV(lang);
  const openMenuLabel = lang === "en" ? "Open menu" : "Abrir menú";
  const closeMenuLabel = lang === "en" ? "Close menu" : "Cerrar menú";
  const drawerNavLabel = lang === "en" ? "Site navigation" : "Navegación del sitio";
  const tagline = lang === "en" ? "Premium photography network" : "Red de fotografía premium";

  return (
    <header className="site-header" data-drawer-host>
      <div className="header-row">
        <ThemeLanguageControls />
        <Link className="brand" href={lang === "en" ? "/en/" : "/"} aria-label={BRAND_NAME}>
          <img className="brand-logo" src={BRAND_LOGO} alt={BRAND_NAME} width={40} height={40} loading="eager" decoding="async" fetchPriority="high" />
          <span className="brand-niche">
            <span className="brand-strong">{BRAND_STRONG}</span>
            <span className="brand-light"> {BRAND_LIGHT}</span>
          </span>
        </Link>
        <button
          type="button"
          className="hamburger"
          aria-label={openMenuLabel}
          aria-controls="site-drawer"
          aria-expanded="false"
          data-drawer-toggle
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <nav className="site-nav" aria-label={drawerNavLabel}>
        {navItems.map((item) => (
          <a
            key={item.label}
            className="site-nav-link"
            href={item.href}
            {...(item.external ? { rel: "noopener" } : {})}
          >
            {item.label}
          </a>
        ))}
      </nav>
      <div className="site-drawer" id="site-drawer" data-drawer hidden>
        <div className="site-drawer-backdrop" data-drawer-close aria-hidden="true" />
        <aside className="site-drawer-panel" role="dialog" aria-modal="true" aria-label={lang === "en" ? "Menu" : "Menú"}>
          <div className="site-drawer-header">
            <span className="brand">
              <img className="brand-logo" src={BRAND_LOGO} alt={BRAND_NAME} width={36} height={36} />
              <span className="brand-niche">
                <span className="brand-strong">{BRAND_STRONG}</span>
                <span className="brand-light"> {BRAND_LIGHT}</span>
              </span>
            </span>
            <button type="button" className="drawer-close" aria-label={closeMenuLabel} data-drawer-close>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <nav className="site-drawer-nav" aria-label={drawerNavLabel}>
            {navItems.map((item) => (
              <a
                key={item.label}
                className="site-drawer-link"
                href={item.href}
                {...(item.external ? { rel: "noopener" } : {})}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="site-drawer-footer">
            <p className="brand-tag">{tagline}</p>
            <a className="drawer-secondary" href="https://www.fotografosantodomingo.com" rel="noopener">
              fotografosantodomingo.com
            </a>
          </div>
        </aside>
      </div>
    </header>
  );
}
