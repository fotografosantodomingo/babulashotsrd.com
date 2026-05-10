import type { Metadata } from "next";
import { GalleryPage } from "@/components/GalleryPage";
import { galleryMetaEn } from "@/lib/galleryData";
import { canonicalUrl } from "@/lib/seo";

const PATH = "/en/photogallery/";
const ES_PATH = "/galeria-de-fotos/";

export const metadata: Metadata = {
  title: galleryMetaEn.title,
  description: galleryMetaEn.description,
  alternates: {
    canonical: canonicalUrl(PATH),
    languages: {
      en: canonicalUrl(PATH),
      "es-DO": canonicalUrl(ES_PATH),
      es: canonicalUrl(ES_PATH),
      "x-default": canonicalUrl(ES_PATH)
    }
  },
  openGraph: {
    title: galleryMetaEn.title,
    description: galleryMetaEn.description,
    url: canonicalUrl(PATH),
    type: "website",
    locale: "en"
  }
};

export default function Page() {
  return (
    <GalleryPage
      lang="en"
      path={PATH}
      altPath={ES_PATH}
      h1={galleryMetaEn.h1}
      intro={galleryMetaEn.intro}
      description={galleryMetaEn.description}
    />
  );
}
