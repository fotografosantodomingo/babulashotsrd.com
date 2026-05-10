import Link from "next/link";
import { bodaUrl, droneUrl, email, inmobiliariaUrl, mainBrandUrl, niche, phoneDisplay, santoDomingoHubUrl, siteUrl } from "@/lib/seo";
import { categories, tags } from "@/lib/parentContent";

const networkLinks: Array<{ label: string; href: string; description: string; current?: boolean }> = [
  { label: "Fotografia de Bodas", href: bodaUrl, description: "Bodas en Punta Cana, Santo Domingo y destinos en Rep. Dominicana" },
  { label: "Fotografia Inmobiliaria", href: inmobiliariaUrl, description: "Foto, video y drone para propiedades, agentes y desarrolladores" },
  { label: "Tomas Aereas con Drone", href: droneUrl, description: "Drone para inmobiliaria, construccion, eventos y bodas" },
  { label: "Estudio Fotografico", href: siteUrl, description: "Retratos, fotos de comida, exteriores y empresas en Santo Domingo", current: true }
];

const alsoAtLinks: Array<{ label: string; href: string; primary: string; description: string }> = [
  {
    label: "babulashotsrd.com",
    href: mainBrandUrl,
    primary: "Marca principal",
    description: "Agencia premium de foto y video en Republica Dominicana. Centro de la red Babula Shots."
  },
  {
    label: "fotografosantodomingo.com",
    href: santoDomingoHubUrl,
    primary: "El mismo fotografo - nueva web",
    description: "Pagina por Babula Shots con todos los servicios disponibles: bodas, retratos, comercial, eventos."
  }
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <p className="footer-brand-name">Babula Shots</p>
          <p className="footer-brand-tag">{niche.label} - By Babula Shots</p>
          <p className="footer-brand-snippet">
            Estudio fotografico en Santo Domingo: retratos, sesiones de fotos en estudio, fotografia de comida y bebida,
            exteriores y campanas para empresas. Parte de la red Babula Shots.
          </p>
        </div>
        <div className="footer-network" aria-label="Red Babula Shots">
          <p className="footer-section-title">Red Babula Shots</p>
          <ul>
            {networkLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  rel="noopener"
                  className={link.current ? "is-current" : ""}
                >
                  <span className="net-label">{link.label}</span>
                  <span className="net-desc">{link.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-contact">
          <p className="footer-section-title">Contacto</p>
          <p>
            <a href={`tel:${phoneDisplay.replace(/\s/g, "")}`}>{phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${email}`}>{email}</a>
          </p>
        </div>
      </div>
      <div className="footer-also" aria-label="Tambien en">
        <p className="footer-section-title">
          <span aria-hidden="true">{"\u{1F310}"}</span> Tambien en
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
      <div className="footer-areas" aria-label="Categorias y temas">
        <p className="footer-section-title">Categorias</p>
        <div>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}/`}>{c.name}</Link>
          ))}
          <Link href="/blog/">Blog</Link>
          <Link href="/galeria/">Galeria</Link>
          <Link href="/precios/">Precios</Link>
          <Link href="/reserva-estudio/">Reserva Estudio</Link>
        </div>
      </div>
      <div className="footer-areas" aria-label="Etiquetas populares">
        <p className="footer-section-title">Etiquetas</p>
        <div>
          {tags.slice(0, 18).map((t) => (
            <Link key={t.slug} href={`/tag/${t.slug}/`}>{t.name}</Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>(c) {new Date().getFullYear()} Babula Shots. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
