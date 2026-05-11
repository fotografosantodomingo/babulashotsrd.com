import Link from "next/link";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { WpContent } from "@/components/WpContent";
import type { EnContent } from "@/lib/enContent";
import {
  extractFirstImage,
  featuredImage,
  findBySlug,
  isPost,
  plainTitle,
  topicalLinks,
  type PageOrPost
} from "@/lib/parentContent";
import {
  canonicalUrl,
  organizationRef,
  organizationSchema,
  phoneDisplay,
  phoneE164,
  publisherRef,
  siteUrl,
  whatsappUrl
} from "@/lib/seo";

const RELATED_LINKS_EN = [
  { tag: "Studio", label: "Studio photography sessions", href: "https://estudio.babulashotsrd.com/en/" },
  { tag: "Weddings", label: "Wedding photographer in DR", href: "https://boda.babulashotsrd.com/en/" },
  { tag: "Real estate", label: "Real estate photography", href: "https://inmobiliaria.babulashotsrd.com/en/" },
  { tag: "Drone", label: "Aerial drone services", href: "https://dron.babulashotsrd.com/en/" }
];

export function EnglishArticle({ content }: { content: EnContent }) {
  const esEntry: PageOrPost | undefined = findBySlug(content.esPath.replace(/^\/|\/$/g, ""));
  const featured = esEntry ? featuredImage(esEntry) : null;
  const heroImg = featured ?? (esEntry ? extractFirstImage(esEntry) : null);

  const url = canonicalUrl(content.enPath);
  const esUrl = canonicalUrl(content.esPath);

  // Topical EN links — translate the ES topical links by re-using the topic
  // detection. The lib helper already understands wedding/boda/drone/etc, so
  // we just override the labels with EN copy via the static table above.
  const topics = esEntry ? topicalLinks(esEntry.slug, esEntry.link, "en") : [];

  const isPostType = !!esEntry && isPost(esEntry);

  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": isPostType ? "Article" : "WebPage",
      headline: content.h1,
      name: content.h1,
      description: content.description,
      mainEntityOfPage: url,
      url,
      inLanguage: "en",
      author: organizationRef,
      publisher: publisherRef,
      ...(heroImg ? { image: `${siteUrl}${heroImg.src}` } : {})
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/en/") },
        { "@type": "ListItem", position: 2, name: content.h1, item: url }
      ]
    }
  ];

  return (
    <main>
      <SeoJsonLd data={schema as Record<string, unknown>[]} />
      <article className="article">
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href="/en/">Home</Link>
          <span>/</span>
          <span>{content.h1}</span>
        </nav>
        <header className="article-header">
          <h1>{content.h1}</h1>
          <p style={{ maxWidth: "62ch", margin: ".5rem 0 0", color: "var(--muted)" }}>{content.intro}</p>
          <p style={{ margin: ".75rem 0 0" }}>
            <a href={content.esPath} hrefLang="es-DO" className="inline-link">
              Ver en español →
            </a>
          </p>
          {heroImg ? (
            <figure className="article-hero">
              <img
                src={heroImg.src}
                alt={heroImg.alt || content.h1}
                width={heroImg.width}
                height={heroImg.height}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </figure>
          ) : null}
        </header>

        <WpContent html={content.bodyHtml} />

        {topics.length ? (
          <aside className="topical-links" aria-label="Related services">
            <p className="section-tag">Keep exploring</p>
            <h2>Related services in the Babula Shots network</h2>
            <p>Each sub-site is a specialised studio with its own catalogue, pricing and FAQ.</p>
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

        <aside className="article-cta" aria-label="Book your session">
          <div className="article-cta-text">
            <p className="section-tag">Book your session</p>
            <h2>Ready for your session with Babula Shots?</h2>
            <p>
              WhatsApp us with your date and the type of session. We confirm availability and prepare a detailed quote within 24 hours.
            </p>
          </div>
          <div className="article-cta-actions">
            <a
              className="button button-light"
              href={whatsappUrl(`Hi, I saw the page "${content.h1}" and would like to check availability for a session.`)}
              rel="noopener"
            >
              WhatsApp {phoneDisplay}
            </a>
            <a className="button button-outline" href={`tel:${phoneE164}`}>
              Call {phoneDisplay}
            </a>
            <Link className="button button-ghost" href="/en/">
              Back to home
            </Link>
          </div>
        </aside>
      </article>
      <CrossSiteCta locale="en" />
    </main>
  );
}
