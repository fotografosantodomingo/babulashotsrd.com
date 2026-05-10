import type { Metadata } from "next";
import Link from "next/link";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { CrossSiteCta } from "@/components/CrossSiteCta";
import { canonicalUrl, organizationSchema, phoneDisplay, phoneE164, siteUrl, whatsappUrl } from "@/lib/seo";

const path = "/en/";
const title = "Photo studio in Santo Domingo | Babula Shots";
const description =
  "Babula Shots Studio in Santo Domingo. Professional portraits, food and beverage, products, maternity and editorial sessions. Quote on WhatsApp +1 809 720 9547.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: canonicalUrl(path),
    languages: { "es-DO": canonicalUrl("/"), en: canonicalUrl(path), "x-default": canonicalUrl("/") }
  },
  openGraph: {
    title,
    description,
    url: canonicalUrl(path),
    type: "website",
    locale: "en_US",
    siteName: "Babula Shots Estudio",
    images: [
      {
        url: "/wp-content/uploads/2024/06/social-card-1200x630.webp",
        width: 1200,
        height: 630,
        alt: "Babula Shots Studio"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/wp-content/uploads/2024/06/social-card-1200x630.webp"]
  }
};

export default function EnglishHome() {
  const url = canonicalUrl(path);
  const schema = [
    organizationSchema,
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Babula Shots Studio",
      url,
      telephone: phoneE164,
      email: "info@babulashotsrd.com",
      address: { "@type": "PostalAddress", addressLocality: "Santo Domingo", addressCountry: "DO" },
      areaServed: { "@type": "Country", name: "Dominican Republic" },
      priceRange: "$$",
      sameAs: ["https://www.instagram.com/babulashotsrd/"]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/en/") }
      ]
    }
  ];

  return (
    <main>
      <SeoJsonLd data={schema} />
      <section className="plain-hero">
        <p className="eyebrow">Babula Shots Studio</p>
        <h1>Photo studio in Santo Domingo</h1>
        <p>
          Professional photography studio in Santo Domingo, Dominican Republic. Portraits, corporate
          headshots, food and beverage, product, maternity, newborn and fashion editorial sessions.
          Bilingual team (ES/EN), 48-72 hour delivery and a private online gallery for every client.
        </p>
        <div className="hero-actions">
          <a className="button button-light" href={whatsappUrl("Hello, I'd like to check availability for a studio session.")} rel="noopener">
            WhatsApp {phoneDisplay}
          </a>
          <Link className="button button-ghost" href="/en/prices/">
            See prices
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="value-strip">
            <div className="value-strip-head">
              <p className="section-tag">What we shoot</p>
              <h3>Studio sessions for people, food, products and brands</h3>
            </div>
            <ul className="value-list">
              <li><strong>Portraits</strong> headshots, LinkedIn, actor and model books</li>
              <li><strong>Corporate</strong> executive teams, multiple looks, commercial usage</li>
              <li><strong>Food + Beverage</strong> restaurants, menus, brand campaigns</li>
              <li><strong>Maternity + Newborn</strong> private studio, climate-controlled</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-divider">
        <div className="wrap">
          <h2 className="section-heading-h2">Where to start</h2>
          <div className="card-grid">
            <Link className="card" href="/en/services/">
              <span>Services</span>
              <h3>All studio services</h3>
              <p>Portraits, corporate, food, product, maternity, fashion editorial. Each service ships with deliverables, turnaround time and licensing terms.</p>
            </Link>
            <Link className="card" href="/en/locations/">
              <span>Coverage</span>
              <h3>Cities we cover</h3>
              <p>Santo Domingo studio plus on-location sessions in Punta Cana, Santiago, Casa de Campo, Bavaro, Las Terrenas and 18 other DR cities.</p>
            </Link>
            <Link className="card" href="/en/prices/">
              <span>Prices</span>
              <h3>Network rate card</h3>
              <p>Starting prices in Dominican pesos with US dollar equivalent. From RD$5,960 portraits to fashion editorial production packages.</p>
            </Link>
            <Link className="card" href="/en/faq/">
              <span>FAQ</span>
              <h3>Common questions</h3>
              <p>Session duration, outfit changes, makeup add-ons, delivery formats, payment methods, deposit policy and travel fees by zone.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section booking-cta" id="contacto">
        <div className="wrap">
          <div className="booking-cta-grid">
            <div>
              <p className="section-tag">Ready to book</p>
              <h2>Reserve your studio session</h2>
              <p>
                Message us on WhatsApp with your tentative date and session type. We reply with availability
                and a detailed quote in under 24 hours. Booking confirms with a 50% deposit.
              </p>
            </div>
            <div className="booking-cta-actions">
              <a className="button button-light" href={whatsappUrl("Hello, I'd like to check availability for a studio session.")} rel="noopener">
                WhatsApp {phoneDisplay}
              </a>
              <a className="button button-ghost" href={`tel:${phoneE164}`}>
                Call {phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <CrossSiteCta locale="en" />
    </main>
  );
}
