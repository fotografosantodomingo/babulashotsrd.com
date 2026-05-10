import type { Metadata } from "next";
import { GalleryPage } from "@/components/GalleryPage";
import { galleryMetaEs } from "@/lib/galleryData";
import { canonicalUrl } from "@/lib/seo";

const PATH = "/galeria-de-fotos/";
const EN_PATH = "/en/photogallery/";

export const metadata: Metadata = {
  title: galleryMetaEs.title,
  description: galleryMetaEs.description,
  alternates: {
    canonical: canonicalUrl(PATH),
    languages: {
      "es-DO": canonicalUrl(PATH),
      es: canonicalUrl(PATH),
      en: canonicalUrl(EN_PATH),
      "x-default": canonicalUrl(PATH)
    }
  },
  openGraph: {
    title: galleryMetaEs.title,
    description: galleryMetaEs.description,
    url: canonicalUrl(PATH),
    type: "website",
    locale: "es_DO"
  }
};

export default function Page() {
  return (
    <GalleryPage
      lang="es"
      path={PATH}
      altPath={EN_PATH}
      h1={galleryMetaEs.h1}
      intro={galleryMetaEs.intro}
      description={galleryMetaEs.description}
    />
  );
}
