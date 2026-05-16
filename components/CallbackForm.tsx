type CallbackFormProps = {
  locale?: "es" | "en";
};

// FormSubmit forwards form data to this email — no signup, no API key.
// First submission triggers a confirmation email; click the link once to activate.
const FORM_ENDPOINT = "https://formsubmit.co/info@babulashotsrd.com";

export function CallbackForm({ locale = "es" }: CallbackFormProps) {
  const isEnglish = locale === "en";

  const t = isEnglish
    ? {
        legend: "Request a callback",
        name: "Your name",
        phone: "Phone (with country code)",
        phonePlaceholder: "+1 ...",
        email: "Email (optional)",
        day: "Preferred day",
        time: "Preferred time",
        message: "Message (optional)",
        messagePlaceholder: "Tell us about your wedding date, location, etc.",
        submit: "Request callback",
        promise: "We'll call you back within 24h.",
        success: "Thank you, we received your request. We'll call you back within 24 hours.",
        days: [
          { value: "Mon", label: "Mon" },
          { value: "Tue", label: "Tue" },
          { value: "Wed", label: "Wed" },
          { value: "Thu", label: "Thu" },
          { value: "Fri", label: "Fri" },
          { value: "Sat", label: "Sat" },
          { value: "Sun", label: "Sun" }
        ],
        chooseDay: "Choose a day",
        chooseTime: "Choose a time"
      }
    : {
        legend: "Solicita una llamada",
        name: "Tu nombre",
        phone: "Teléfono (con código de país)",
        phonePlaceholder: "+1 ...",
        email: "Correo electrónico (opcional)",
        day: "Día preferido",
        time: "Hora preferida",
        message: "Mensaje (opcional)",
        messagePlaceholder: "Cuéntanos fecha, locación de la boda, etc.",
        submit: "Solicitar llamada",
        promise: "Te llamamos en menos de 24h.",
        success: "Gracias, recibimos tu solicitud. Te llamamos en menos de 24 horas.",
        days: [
          { value: "Lun", label: "Lun" },
          { value: "Mar", label: "Mar" },
          { value: "Mie", label: "Mie" },
          { value: "Jue", label: "Jue" },
          { value: "Vie", label: "Vie" },
          { value: "Sab", label: "Sab" },
          { value: "Dom", label: "Dom" }
        ],
        chooseDay: "Elige un día",
        chooseTime: "Elige una hora"
      };

  const times = [
    { value: "9-11 AM", label: "9-11 AM" },
    { value: "11 AM-1 PM", label: "11 AM-1 PM" },
    { value: "2-4 PM", label: "2-4 PM" },
    { value: "4-6 PM", label: "4-6 PM" }
  ];

  return (
    <div className="callback-wrap">
      <div className="callback-success" data-callback-success role="status" aria-live="polite">
        <p>{t.success}</p>
      </div>
      <form
        className="callback-form"
        action={FORM_ENDPOINT}
        method="POST"
        encType="application/x-www-form-urlencoded"
        data-callback-form
        aria-label={t.legend}
      >
        <input type="hidden" name="_subject" value="Babula Shots — nuevo callback (apex)" />
        <input type="hidden" name="_next" value="https://babulashotsrd.com/?sent=ok" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <fieldset>
          <legend className="callback-legend">{t.legend}</legend>

          <div className="callback-row">
            <label htmlFor="cb-name">{t.name}</label>
            <input
              id="cb-name"
              type="text"
              name="name"
              required
              autoComplete="name"
            />
          </div>

          <div className="callback-row">
            <label htmlFor="cb-phone">{t.phone}</label>
            <input
              id="cb-phone"
              type="tel"
              name="phone"
              required
              placeholder={t.phonePlaceholder}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>

          <div className="callback-row">
            <label htmlFor="cb-email">{t.email}</label>
            <input
              id="cb-email"
              type="email"
              name="email"
              autoComplete="email"
            />
          </div>

          <div className="callback-grid">
            <div className="callback-row">
              <label htmlFor="cb-day">{t.day}</label>
              <select id="cb-day" name="preferredDay" required defaultValue="">
                <option value="" disabled>
                  {t.chooseDay}
                </option>
                {t.days.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="callback-row">
              <label htmlFor="cb-time">{t.time}</label>
              <select id="cb-time" name="preferredTime" required defaultValue="">
                <option value="" disabled>
                  {t.chooseTime}
                </option>
                {times.map((tm) => (
                  <option key={tm.value} value={tm.value}>
                    {tm.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="callback-row">
            <label htmlFor="cb-message">{t.message}</label>
            <textarea
              id="cb-message"
              name="message"
              rows={3}
              placeholder={t.messagePlaceholder}
            />
          </div>

          <input type="hidden" name="niche" value="apex" />
          <input type="hidden" name="locale" value={locale} />
          {/* FormSubmit honeypot: real users don't fill this; bots do — submission silently dropped. */}
          <div className="callback-hp" aria-hidden="true">
            <label htmlFor="cb-website">Website</label>
            <input
              id="cb-website"
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <button type="submit" className="button button-light callback-submit">
            {t.submit}
          </button>

          <p className="callback-promise">{t.promise}</p>
        </fieldset>
      </form>
    </div>
  );
}
