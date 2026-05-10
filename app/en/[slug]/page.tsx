import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EnglishArticle } from "@/components/EnglishArticle";
import { EN_CONTENT, getEnContentByEnSlug } from "@/lib/enContent";
import { canonicalUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

// EN slugs that already have a dedicated route file under app/en/<slug>/page.tsx
const RESERVED = new Set(["photogallery"]);

export function generateStaticParams() {
  return Object.values(EN_CONTENT)
    .filter((c) => !RESERVED.has(c.enSlug))
    .map((c) => ({ slug: c.enSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = getEnContentByEnSlug(slug);
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: canonicalUrl(content.enPath),
      languages: {
        en: canonicalUrl(content.enPath),
        "es-DO": canonicalUrl(content.esPath),
        es: canonicalUrl(content.esPath),
        "x-default": canonicalUrl(content.esPath)
      }
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonicalUrl(content.enPath),
      type: "website",
      locale: "en"
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const content = getEnContentByEnSlug(slug);
  if (!content) notFound();
  return <EnglishArticle content={content} />;
}
