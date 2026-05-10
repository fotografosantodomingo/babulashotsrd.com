import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/ContentArticle";
import { findBySlug, getSeo, pages, plainTitle, posts } from "@/lib/parentContent";
import { canonicalUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

const RESERVED = new Set([
  "blog", "category", "tag", "en", "servicios", "ubicaciones", "precios", "faq",
  // Sesión de fotos topical authority cluster
  "sesion-de-fotos", "sesion-de-fotos-pareja", "sesion-de-fotos-cumpleanos",
  "sesion-de-fotos-corporativas", "headshots-profesionales-santo-domingo",
  "sesion-de-fotos-embarazo", "sesion-de-fotos-quinceanera"
]);

export function generateStaticParams() {
  return [...pages, ...posts]
    .filter((p) => !RESERVED.has(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = findBySlug(slug);
  if (!entry) return {};
  const path = `/${slug}/`;
  const seo = getSeo(`https://estudio.babulashotsrd.com${path}`) ?? getSeo(entry.link);
  const title = seo?.title ?? plainTitle(entry);
  const description = seo?.description ?? "";
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(path), languages: { "es-DO": canonicalUrl(path) } },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: canonicalUrl(path),
      type: entry.type === "post" ? "article" : "website",
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : [
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

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const entry = findBySlug(slug);
  if (!entry) notFound();
  return <ContentArticle entry={entry} />;
}
