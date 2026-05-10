type Props = { es: string; en: string };

export function ThemeLanguageControls({ es = "/", en = "/en/" }: Partial<Props> = {}) {
  return (
    <div className="header-controls" aria-label="Site preferences">
      <div className="lang-toggle" role="group" aria-label="Idioma">
        <a className="lang-link" data-lang-link="es" href={es} hrefLang="es-DO" aria-label="Cambiar a espanol">
          ES
        </a>
        <span aria-hidden="true" className="lang-sep">/</span>
        <a className="lang-link" data-lang-link="en" href={en} hrefLang="en" aria-label="Switch to English">
          EN
        </a>
      </div>
      <button
        type="button"
        className="theme-toggle"
        aria-label="Cambiar tema"
        title="Cambiar tema"
        data-theme-toggle
      >
        <svg className="icon-sun" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 11a4 4 0 100-8 4 4 0 000 8zm6-4a1 1 0 011 1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-12 0a1 1 0 011 1H5a1 1 0 01-1-1zm10.36-5.36a1 1 0 011.41 0l.71.71a1 1 0 11-1.42 1.41l-.7-.7a1 1 0 010-1.42zM4.22 14.36l.71-.71a1 1 0 111.42 1.42l-.71.7a1 1 0 11-1.42-1.41zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm5.78-1.64a1 1 0 011.42 1.42l-.71.71a1 1 0 11-1.42-1.42zM4.22 5.64l-.71-.71A1 1 0 014.93 3.5l.7.7A1 1 0 014.22 5.64z"
          />
        </svg>
        <svg className="icon-moon" viewBox="0 0 20 20" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
          />
        </svg>
      </button>
    </div>
  );
}
