"use client";
import { usePathname } from "next/navigation";
import { CallbackForm } from "@/components/CallbackForm";
import { phoneDisplay, phoneE164, email, whatsappUrl, aggregateRating } from "@/lib/seo";

const GOOGLE_REVIEW_URL = "https://g.page/r/Cfzh-OCc5eftEAE/review";
const GOOGLE_PROFILE_URL = "https://share.google/aJphPsrVL2VXH9EWH";
const TRUSTPILOT_URL = "https://www.trustpilot.com/review/fotografosantodomingo.com";

export function ContactSection() {
  const pathname = usePathname() || "/";
  const lang: "es" | "en" = pathname.startsWith("/en") ? "en" : "es";
  const isEn = lang === "en";

  const t = isEn
    ? {
        tag: "Contact",
        h2: "Get in touch",
        lead: "Send the form and we'll call you back within 24 hours. Prefer chat? Use WhatsApp or email — we reply fast.",
        whatsapp: "WhatsApp",
        call: "Call",
        emailLabel: "Email",
        ratedOn: "rated on Google",
        reviews: "reviews",
        leaveReview: "Leave a review",
        seeProfile: "See Google profile",
        trustpilot: "See our Trustpilot reviews",
      }
    : {
        tag: "Contacto",
        h2: "Hablamos contigo",
        lead: "Envía el formulario y te llamamos en menos de 24 horas. ¿Prefieres chat? Escríbenos por WhatsApp o email — respondemos rápido.",
        whatsapp: "WhatsApp",
        call: "Llamar",
        emailLabel: "Correo",
        ratedOn: "calificado en Google",
        reviews: "reseñas",
        leaveReview: "Dejar reseña",
        seeProfile: "Ver perfil de Google",
        trustpilot: "Ver nuestras reseñas en Trustpilot",
      };

  const rating = aggregateRating.ratingValue;
  const count = aggregateRating.reviewCount;

  return (
    <section className="section contact-section" id="contacto" aria-label={t.h2}>
      <div className="wrap contact-wrap">
        <div className="contact-copy">
          <p className="section-tag">{t.tag}</p>
          <h2>{t.h2}</h2>
          <p>{t.lead}</p>
          <a className="reviews-badge" href={GOOGLE_PROFILE_URL} rel="noopener" aria-label={`${rating} ${t.ratedOn} — ${count} ${t.reviews}`}>
            <span className="reviews-badge-stars" aria-hidden="true">★★★★★</span>
            <span className="reviews-badge-meta">
              <strong data-g-rating>{rating}</strong> {t.ratedOn} · <strong data-g-count>{count}</strong> {t.reviews}
            </span>
            <span className="reviews-badge-arrow" aria-hidden="true">→</span>
          </a>
          <ul className="contact-list">
            <li>
              <a
                href={whatsappUrl(
                  isEn
                    ? "Hello, I'd like to know more about your services."
                    : "Hola, quiero saber mas sobre sus servicios."
                )}
                rel="noopener"
              >
                {t.whatsapp} {phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:${phoneE164}`}>
                {t.call} {phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`}>{t.emailLabel}: {email}</a>
            </li>
            <li>
              <a href={GOOGLE_REVIEW_URL} rel="noopener">{t.leaveReview} ★</a>
            </li>
            <li>
              <a href={TRUSTPILOT_URL} rel="noopener" target="_blank">{t.trustpilot} ★</a>
            </li>
          </ul>
        </div>
        <div className="contact-form">
          <CallbackForm locale={lang} />
        </div>
      </div>
    </section>
  );
}
