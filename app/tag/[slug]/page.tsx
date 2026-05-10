import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import {
  decodeEntities,
  extractFirstImage,
  findTagBySlug,
  getSeo,
  plainExcerpt,
  plainTitle,
  postsForTag,
  tags
} from "@/lib/parentContent";
import { canonicalUrl, organizationSchema, siteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tags.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) return {};
  const path = `/tag/${slug}/`;
  const seo = getSeo(`${siteUrl}${path}`);
  const title = seo?.title ?? `${decodeEntities(tag.name)} | Babula Shots Estudio`;
  const baseDescription = (seo?.description?.trim() || tag.description?.trim() || `Contenido etiquetado como ${tag.name}.`);
  const description =
    seo?.description?.trim() && seo.description.trim().length < 140
      ? `${seo.description.trim()} Cotiza por WhatsApp.`
      : baseDescription;
  const ogDescription =
    seo?.ogDescription?.trim() && seo.ogDescription.trim().length < 140
      ? `${seo.ogDescription.trim()} Cotiza por WhatsApp.`
      : (seo?.ogDescription?.trim() || description);
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(path) },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: ogDescription,
      url: canonicalUrl(path),
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
}

export default async function TagArchive({ params }: PageProps) {
  const { slug } = await params;
  const tag = findTagBySlug(slug);
  if (!tag) notFound();
  const list = postsForTag(tag.id);
  const path = `/tag/${slug}/`;
  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: decodeEntities(tag.name),
      url: canonicalUrl(path),
      hasPart: list.map((p) => ({
        "@type": "BlogPosting",
        headline: plainTitle(p),
        url: canonicalUrl(`/${p.slug}/`)
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: canonicalUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl("/blog/") },
        { "@type": "ListItem", position: 3, name: decodeEntities(tag.name), item: canonicalUrl(path) }
      ]
    }
  ];
  return (
    <main>
      <SeoJsonLd data={schema} />
      <section className="plain-hero">
        <p className="eyebrow">Etiqueta</p>
        <h1>{decodeEntities(tag.name)}</h1>
        {tag.description ? <p>{decodeEntities(tag.description)}</p> : null}
      </section>
      <section className="section">
        <div className="wrap">
          <h2 className="section-heading-h2">Articulos con la etiqueta {decodeEntities(tag.name)}</h2>
          {list.length ? (
            <div className="card-grid">
              {list.map((p) => {
                const img = extractFirstImage(p);
                return (
                  <Link key={p.slug} className="card" href={`/${p.slug}/`}>
                    {img ? <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" /> : null}
                    <span>Articulo</span>
                    <h3>{plainTitle(p)}</h3>
                    <p>{plainExcerpt(p, 160)}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>No hay articulos con esta etiqueta por ahora.</p>
          )}
        </div>
      </section>
    </main>
  );
}
