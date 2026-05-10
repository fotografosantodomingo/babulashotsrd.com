import type { Metadata } from "next";
import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { extractFirstImage, getSeo, plainExcerpt, plainTitle, posts } from "@/lib/parentContent";
import { canonicalUrl, organizationSchema, siteUrl } from "@/lib/seo";

const seo = getSeo(`${siteUrl}/blog/`);

const blogScrapedDescription = seo?.description ?? "";
const blogDescription =
  blogScrapedDescription && blogScrapedDescription.length < 140
    ? `${blogScrapedDescription} Cotiza por WhatsApp.`
    : blogScrapedDescription ||
      "Articulos, tecnicas y guias de fotografia de estudio publicados por Babula Shots.";

const blogScrapedOgDescription = seo?.ogDescription ?? "";
const blogOgDescription =
  blogScrapedOgDescription && blogScrapedOgDescription.length < 140
    ? `${blogScrapedOgDescription} Cotiza por WhatsApp.`
    : blogScrapedOgDescription || blogDescription;

export const metadata: Metadata = {
  title: seo?.title ?? "Blog del estudio | Babula Shots",
  description: blogDescription,
  alternates: {
    canonical: canonicalUrl("/blog/"),
    languages: {
      "es-DO": canonicalUrl("/blog/"),
      es: canonicalUrl("/blog/"),
      en: canonicalUrl("/en/blog/"),
      "x-default": canonicalUrl("/blog/")
    }
  },
  openGraph: {
    title: seo?.ogTitle ?? seo?.title ?? "Blog del estudio",
    description: blogOgDescription,
    url: canonicalUrl("/blog/"),
    type: "website",
    images: [
      {
        url: "/wp-content/uploads/2024/06/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots Estudio"
      }
    ]
  }
};

export default function BlogIndex() {
  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Blog del estudio Babula Shots",
      url: canonicalUrl("/blog/"),
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        headline: plainTitle(p),
        url: canonicalUrl(`/${p.slug}/`),
        datePublished: p.date,
        dateModified: p.modified
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: canonicalUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl("/blog/") }
      ]
    }
  ];
  return (
    <main>
      <SeoJsonLd data={schema} />
      <section className="plain-hero">
        <p className="eyebrow">Blog</p>
        <h1>Articulos del estudio</h1>
        <p>Tecnicas, guias y casos de estudio sobre fotografia profesional, retratos y produccion en Santo Domingo.</p>
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="section-heading-h2">Ultimos articulos publicados</h2>
          <div className="card-grid">
            {posts.map((p) => {
              const img = extractFirstImage(p);
              return (
                <Link key={p.slug} className="card" href={`/${p.slug}/`}>
                  {img ? <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" /> : null}
                  <span>Articulo</span>
                  <h3>{plainTitle(p)}</h3>
                  <p>{plainExcerpt(p, 180)}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <CrossSiteCta locale="es" />
    </main>
  );
}
