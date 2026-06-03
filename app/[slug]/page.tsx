import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/ContentArticle";
import { findBySlug, getSeo, pages, plainExcerpt, plainTitle, posts } from "@/lib/parentContent";
import { getEnContent } from "@/lib/enContent";
import { canonicalUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

const RESERVED = new Set([
  "blog", "category", "tag", "en", "servicios", "ubicaciones", "precios", "faq",
  // Custom-rendered routes (have their own app/<slug>/page.tsx)
  "galeria-de-fotos", "contacto", "sobre",
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
  const seo = getSeo(`https://babulashotsrd.com${path}`) ?? getSeo(entry.link);
  let title = seo?.title ?? plainTitle(entry);
  // The WP slug `/fotografo/` was imported with title "FOTOGRAFO" (9 chars,
  // all-caps) — useless for SERPs. Override with a proper full title.
  if (slug === "fotografo") {
    title = "Fotógrafo profesional en República Dominicana | Babula Shots";
  }
  // Per GSC 2026-06: this page ranked pos 5.8 for the bare head term "sesión de
  // fotos" (0 clicks) — out-competing the estudio subdomain that should own that
  // generic studio term. Re-angle the title to the outdoor/location intent this
  // page can actually own, so the network stops cannibalizing itself.
  if (slug === "sesion-de-fotos-exterior-en-santo-domingo-rd") {
    title = "Sesión de Fotos en Exteriores en Santo Domingo | Locaciones al Aire Libre — Babula Shots";
  }
  const titleText = plainTitle(entry);
  const description =
    seo?.description ||
    plainExcerpt(entry, 160) ||
    `${titleText} — fotografía profesional Babula Shots en República Dominicana.`;
  const en = getEnContent(path);
  const languages: Record<string, string> = {
    "es-DO": canonicalUrl(path),
    es: canonicalUrl(path),
    "x-default": canonicalUrl(path)
  };
  if (en) languages.en = canonicalUrl(en.enPath);
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(path), languages },
    openGraph: {
      title: seo?.ogTitle ?? title,
      description: seo?.ogDescription ?? description,
      url: canonicalUrl(path),
      type: entry.type === "post" ? "article" : "website",
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : [
            {
              url: "/images/social-card-1200x630.webp",
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
