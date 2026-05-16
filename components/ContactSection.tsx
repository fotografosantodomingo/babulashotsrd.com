"use client";
import { usePathname } from "next/navigation";
import { CallbackForm } from "@/components/CallbackForm";
import { phoneDisplay, phoneE164, email, whatsappUrl } from "@/lib/seo";

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
      }
    : {
        tag: "Contacto",
        h2: "Hablamos contigo",
        lead: "Envía el formulario y te llamamos en menos de 24 horas. ¿Prefieres chat? Escríbenos por WhatsApp o email — respondemos rápido.",
        whatsapp: "WhatsApp",
        call: "Llamar",
        emailLabel: "Correo",
      };

  return (
    <section className="section contact-section" id="contacto" aria-label={t.h2}>
      <div className="wrap contact-wrap">
        <div className="contact-copy">
          <p className="section-tag">{t.tag}</p>
          <h2>{t.h2}</h2>
          <p>{t.lead}</p>
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
          </ul>
        </div>
        <div className="contact-form">
          <CallbackForm locale={lang} />
        </div>
      </div>
    </section>
  );
}
