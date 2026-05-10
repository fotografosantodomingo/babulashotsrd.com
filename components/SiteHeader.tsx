import Link from "next/link";
import { ThemeLanguageControls } from "@/components/ThemeLanguageControls";
import { niche } from "@/lib/seo";

const navItems: Array<{ label: string; href: string; external?: boolean }> = [
  { label: "Inicio", href: "/" },
  { label: "Estudio", href: "https://estudio.babulashotsrd.com/", external: true },
  { label: "Bodas", href: "https://boda.babulashotsrd.com/", external: true },
  { label: "Inmobiliaria", href: "https://inmobiliaria.babulashotsrd.com/", external: true },
  { label: "Drone", href: "https://dron.babulashotsrd.com/", external: true },
  { label: "Blog", href: "/blog/" },
  { label: "Contacto", href: "#contacto" }
];

export function SiteHeader() {
  return (
    <header className="site-header" data-drawer-host>
      <div className="header-row">
        <ThemeLanguageControls />
        <Link className="brand" href="/">
          <span className="brand-niche">{niche.label}</span>
          <span className="brand-tag">By Babula Shots</span>
        </Link>
        <button
          type="button"
          className="hamburger"
          aria-label="Abrir menu"
          aria-controls="site-drawer"
          aria-expanded="false"
          data-drawer-toggle
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
      <nav className="site-nav" aria-label="Main navigation">
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
        <aside className="site-drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="site-drawer-header">
            <span className="brand">
              <span className="brand-niche">{niche.label}</span>
              <span className="brand-tag">By Babula Shots</span>
            </span>
            <button type="button" className="drawer-close" aria-label="Cerrar menu" data-drawer-close>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <nav className="site-drawer-nav" aria-label="Site navigation">
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
            <p className="brand-tag">Premium photography agency</p>
            <a className="drawer-secondary" href="https://www.fotografosantodomingo.com" rel="noopener">
              fotografosantodomingo.com
            </a>
          </div>
        </aside>
      </div>
    </header>
  );
}
