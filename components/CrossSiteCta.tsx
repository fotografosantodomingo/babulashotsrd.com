import { bodaUrl } from "@/lib/seo";

export function CrossSiteCta({ locale = "es" }: { locale?: "es" | "en" }) {
  const isEnglish = locale === "en";
  return (
    <section className="cross-site-cta" aria-labelledby="cross-site-bodas">
      <div className="wrap">
        <div className="cross-site-grid">
          <div>
            <p className="section-tag">{isEnglish ? "Same team, weddings" : "Mismo equipo, bodas"}</p>
            <h2 id="cross-site-bodas">
              {isEnglish ? "Wedding photography by the same team" : "Fotografia de bodas con el mismo equipo"}
            </h2>
            <p>
              {isEnglish
                ? "Booking a studio session for your engagement, family or boudoir? The same Babula Shots team also covers ceremony, reception and editorial wedding photography across Punta Cana, Santo Domingo and the Dominican Republic."
                : "Reservas una sesion de estudio para preboda, familia o boudoir? El mismo equipo Babula Shots tambien cubre ceremonia, recepcion y fotografia editorial de bodas en Punta Cana, Santo Domingo y toda Republica Dominicana."}
            </p>
          </div>
          <div className="cross-site-actions">
            <a className="button button-dark" href={`${bodaUrl}/${isEnglish ? "en/" : ""}servicios/`} rel="noopener">
              {isEnglish ? "See wedding services" : "Ver servicios de bodas"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
