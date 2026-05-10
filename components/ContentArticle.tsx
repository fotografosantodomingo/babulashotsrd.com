import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { WpContent } from "@/components/WpContent";
import {
  decodeEntities,
  extractFirstImage,
  featuredImage,
  getJsonLd,
  isPost,
  plainExcerpt,
  plainTitle,
  posts,
  relatedPosts,
  topicalLinks,
  type PageOrPost
} from "@/lib/parentContent";
import { canonicalUrl, organizationSchema, phoneDisplay, phoneE164, siteUrl, whatsappUrl } from "@/lib/seo";

export function ContentArticle({ entry }: { entry: PageOrPost }) {
  const title = plainTitle(entry);
  const path = `/${entry.slug}/`;
  const url = canonicalUrl(path);
  const featured = featuredImage(entry);
  const post = isPost(entry);
  const excerpt = plainExcerpt(entry);
  const tagTerms = entry._embedded?.["wp:term"]?.flat().filter((t) => t?.taxonomy === "post_tag") ?? [];
  const catTerms = entry._embedded?.["wp:term"]?.flat().filter((t) => t?.taxonomy === "category") ?? [];
  const related = post ? relatedPosts(entry, 3) : posts.slice(0, 3);
  const topics = topicalLinks(entry.slug, entry.link);
  const isGallery = /^(galeria|fashion-photographer-gallery)/i.test(entry.slug);

  // Prefer the original AIO SEO JSON-LD blocks scraped from the legacy page (1:1 migration).
  // Fall back to a generated schema only when the legacy capture is missing.
  const originalLd = getJsonLd(entry.link);
  const schema = originalLd.length > 0 ? originalLd : [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": post ? "Article" : "WebPage",
      headline: title,
      name: title,
      description: excerpt,
      mainEntityOfPage: url,
      url,
      datePublished: entry.date,
      dateModified: entry.modified,
      author: { "@type": "Organization", name: "Babula Shots" },
      publisher: { "@type": "Organization", name: "Babula Shots" },
      ...(featured ? { image: `${siteUrl}${featured.src}` } : {}),
      inLanguage: "es-DO"
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: canonicalUrl("/") },
        ...(post ? [{ "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl("/blog/") }] : []),
        { "@type": "ListItem", position: post ? 3 : 2, name: title, item: url }
      ]
    }
  ];

  return (
    <main>
      <SeoJsonLd data={schema} />
      <article className={isGallery ? "article article-gallery" : "article"}>
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href="/">Inicio</Link>
          {post ? (
            <>
              <span>/</span>
              <Link href="/blog/">Blog</Link>
            </>
          ) : null}
          <span>/</span>
          <span>{title}</span>
        </nav>
        <header className="article-header">
          <h1>{title}</h1>
          {featured ? (
            <figure className="article-hero">
              <img src={featured.src} alt={featured.alt} width={featured.width} height={featured.height} loading="eager" decoding="async" fetchPriority="high" />
            </figure>
          ) : null}
        </header>
        <WpContent html={entry.content?.rendered ?? ""} />
        {topics.length ? (
          <aside className="topical-links" aria-label="Explora nuestros estudios especializados">
            <p className="section-tag">Sigue explorando</p>
            <h2>Servicios relacionados en la red Babula Shots</h2>
            <p>Cada subdominio es un estudio especializado con su propio catálogo, precios y FAQ.</p>
            <ul>
              {topics.map((t) => (
                <li key={t.href}>
                  <a href={t.href} rel={t.href.startsWith("http") ? "noopener" : undefined}>
                    <span className="topical-tag">{t.tag}</span>
                    <span className="topical-label">{t.label}</span>
                    <span className="topical-arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
        <aside className="article-cta" aria-label="Reserva tu sesion">
          <div className="article-cta-text">
            <p className="section-tag">Reserva tu sesion</p>
            <h2>Listo para tu sesion en estudio?</h2>
            <p>
              Escribenos por WhatsApp con tu fecha tentativa y tipo de sesion. Te respondemos con disponibilidad y cotizacion detallada en menos de 24 horas. Reserva con 50% de deposito.
            </p>
          </div>
          <div className="article-cta-actions">
            <a className="button button-light" href={whatsappUrl(`Hola, vi el articulo ${title.slice(0, 60)} y quiero consultar disponibilidad para una sesion.`)} rel="noopener">
              WhatsApp {phoneDisplay}
            </a>
            <a className="button button-outline" href={`tel:${phoneE164}`}>
              Llamar {phoneDisplay}
            </a>
            <Link className="button button-ghost" href="/precios/">
              Ver precios
            </Link>
          </div>
        </aside>
        {tagTerms.length || catTerms.length ? (
          <footer className="article-meta">
            {catTerms.length ? (
              <p>
                <span className="meta-label">Categoria:</span>
                {catTerms.map((c) => (
                  <Link key={c.slug} href={`/category/${c.slug}/`}>
                    {decodeEntities(c.name)}
                  </Link>
                ))}
              </p>
            ) : null}
            {tagTerms.length ? (
              <p>
                <span className="meta-label">Etiquetas:</span>
                {tagTerms.map((t) => (
                  <Link key={t.slug} href={`/tag/${t.slug}/`}>
                    {decodeEntities(t.name)}
                  </Link>
                ))}
              </p>
            ) : null}
          </footer>
        ) : null}
      </article>
      {related.length ? (
        <section className="section alt-section" aria-labelledby="related-h2">
          <div className="wrap">
            <p className="section-tag">{post ? "Sigue leyendo" : "Articulos relacionados"}</p>
            <h2 id="related-h2">Otras lecturas del estudio</h2>
            <div className="card-grid">
              {related.map((r) => {
                const img = extractFirstImage(r);
                return (
                  <Link key={r.slug} className="card" href={`/${r.slug}/`}>
                    {img ? <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" /> : null}
                    <span>Articulo</span>
                    <h3>{plainTitle(r)}</h3>
                    <p>{plainExcerpt(r, 160)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
      <CrossSiteCta locale="es" />
    </main>
  );
}
