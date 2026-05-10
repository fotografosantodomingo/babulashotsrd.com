// Curated photo-gallery dataset rendered on both /galeria-de-fotos/ (ES)
// and /en/photogallery/ (EN). Each entry pairs:
//   - A photo (with native dimensions for CLS)
//   - ES + EN title, alt text and caption (no machine translation)
//   - An hrefEs pointing to the legacy sub-gallery page that the WP version
//     of /galeria-de-fotos/ linked to via "Ver Galería ↗". The EN page
//     auto-resolves the equivalent /en/<slug>/ from lib/langMirrors.

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  titleEs: string;
  titleEn: string;
  altEs: string;
  altEn: string;
  captionEs: string;
  captionEn: string;
  hrefEs: string;   // path on parent — sub-gallery page
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    src: "/wp-content/uploads/2025/02/fotografo-sesion-de-fotos-exterior-santo-domingo-republica-dominicana8-5000x3335.webp",
    width: 1600, height: 1068,
    titleEs: "Sesión de fotos exterior", titleEn: "Outdoor photo session",
    altEs: "Sesión de fotos exterior en Santo Domingo al atardecer",
    altEn: "Outdoor photo session at golden hour in Santo Domingo",
    captionEs: "Retratos exteriores en Santo Domingo, RD — luz natural y atardecer.",
    captionEn: "Outdoor portrait session in Santo Domingo — natural light and golden hour.",
    hrefEs: "/sesion-de-fotos-exterior-en-santo-domingo-rd/"
  },
  {
    src: "/wp-content/uploads/2026/01/Mejor-Fotografo-deportes-baseball-republica-Dominicana-8-scaled.webp",
    width: 1600, height: 1200,
    titleEs: "Fotógrafo de baseball", titleEn: "Baseball photographer",
    altEs: "Fotografía deportiva de baseball en República Dominicana",
    altEn: "Sports photography — baseball action in the Dominican Republic",
    captionEs: "Cobertura deportiva de baseball — entrenamientos, escogido y juegos en RD.",
    captionEn: "Baseball coverage — training, showcase and game-day photography in DR.",
    hrefEs: "/fotografo-de-baseball/"
  },
  {
    src: "/wp-content/uploads/2024/10/Fotografo-Profesional-en-estudio-Santo-Domingo-Republica-Domincana_-46.jpg",
    width: 1600, height: 1067,
    titleEs: "Galería Kitesurf Las Terrenas", titleEn: "Kitesurf gallery — Las Terrenas",
    altEs: "Fotografía profesional de kitesurf en Las Terrenas",
    altEn: "Professional kitesurf photography in Las Terrenas",
    captionEs: "Galería completa de la sesión de kitesurf en Las Terrenas.",
    captionEn: "Full kitesurf session gallery in Las Terrenas.",
    hrefEs: "/galeria-de-fotoslas-terrenas-kite-surf/"
  },
  {
    src: "/wp-content/uploads/2025/01/Babula-Shots-RD-78.png",
    width: 1600, height: 1066,
    titleEs: "Sesión de fotos en la playa", titleEn: "Beach photo session",
    altEs: "Sesión de fotos en la playa al atardecer en Santo Domingo",
    altEn: "Beach photo session at sunset in Santo Domingo",
    captionEs: "Sesión en playa al atardecer — campañas editoriales y retratos.",
    captionEn: "Sunset beach session — editorial campaigns and portraits.",
    hrefEs: "/sesion-de-fotos-en-la-playa/"
  },
  {
    src: "/wp-content/uploads/2025/01/fotos-navidenos-set-estudio-43.webp",
    width: 1075, height: 826,
    titleEs: "Set Navideño en Estudio", titleEn: "Christmas studio set",
    altEs: "Sesión de fotos navideña en set de estudio en Santo Domingo",
    altEn: "Christmas-themed studio set photo session in Santo Domingo",
    captionEs: "Sesión de fotos en set navideño en estudio Babula Shots.",
    captionEn: "Christmas-themed studio set photo session at Babula Shots.",
    hrefEs: "/set-navideno-sesion-de-fotos-estudio-santo-domingo/"
  },
  {
    src: "/wp-content/uploads/2025/02/Sesion-de-fotos-en-Estudio11.jpg",
    width: 1600, height: 900,
    titleEs: "Galería de estudio", titleEn: "Studio session gallery",
    altEs: "Sesión de fotos en estudio fotográfico con iluminación Profoto",
    altEn: "Indoor studio photo session with Profoto lighting",
    captionEs: "Galería completa de sesión en estudio con iluminación Profoto.",
    captionEn: "Full studio session gallery with Profoto lighting.",
    hrefEs: "/sesion-de-fotos-en-estudio-galeria-con-modelo-sunny/"
  },
  {
    src: "/wp-content/uploads/2025/02/sesion-de-fotos-en-zona-colonial-santo-domingo-rd28.webp",
    width: 1600, height: 1067,
    titleEs: "Pre-Boda Zona Colonial", titleEn: "Engagement — Zona Colonial",
    altEs: "Sesión de fotos pre-boda en Zona Colonial, Santo Domingo",
    altEn: "Pre-wedding engagement session in Zona Colonial, Santo Domingo",
    captionEs: "Pre-boda en Zona Colonial — paredes coloniales y luz natural.",
    captionEn: "Engagement shoot in Zona Colonial — colonial walls and natural light.",
    hrefEs: "/sesion-de-fotos-en-zona-colonial-pre-boda/"
  },
  {
    src: "/wp-content/uploads/2025/02/Cubpleanos-QUINCEANERA-fotografo-santo-domingo-sesion-de-fotos-2.webp",
    width: 1600, height: 931,
    titleEs: "Quinceañera / 15 años", titleEn: "Sweet sixteen / Quinceañera",
    altEs: "Sesión de fotos de quinceañera con concepto creativo en estudio",
    altEn: "Sweet sixteen / Quinceañera themed photo session in studio",
    captionEs: "Fotografía profesional para quinceañeras — sesiones temáticas.",
    captionEn: "Professional sweet-sixteen photography — themed sessions.",
    hrefEs: "/fotografia-profesional-para-quinceaneras/"
  },
  {
    src: "/wp-content/uploads/2024/08/Punta-Cana-Sesion-De-Fotos-scaled.webp",
    width: 1024, height: 1280,
    titleEs: "Estudio — Galería Angela", titleEn: "Studio — Angela gallery",
    altEs: "Galería de fotos en estudio — sesión con Angela en Santo Domingo",
    altEn: "Studio photo gallery — Angela session in Santo Domingo",
    captionEs: "Galería completa de la sesión de estudio con Angela.",
    captionEn: "Full studio gallery from the Angela session.",
    hrefEs: "/angela/"
  },
  {
    src: "/wp-content/uploads/2025/02/Sesion-De-Fotos-Zona-Colonial-Fotografo-Santo-Domingo-4.webp",
    width: 1600, height: 1067,
    titleEs: "Sesión Zona Colonial", titleEn: "Photo session — Zona Colonial",
    altEs: "Sesión de fotos en Zona Colonial Santo Domingo",
    altEn: "Photo session in Zona Colonial Santo Domingo",
    captionEs: "Sesiones en Zona Colonial — arquitectura histórica y luz natural.",
    captionEn: "Sessions in Zona Colonial — historic architecture and natural light.",
    hrefEs: "/sesion-de-fotos-zona-colonial-santo-domingo/"
  },
  {
    src: "/wp-content/uploads/2025/02/fotografo-de-bodas-republica-dominicana-17.webp",
    width: 1600, height: 1067,
    titleEs: "Fotógrafo de bodas RD", titleEn: "Wedding photographer DR",
    altEs: "Fotógrafo de bodas en República Dominicana",
    altEn: "Wedding photographer in the Dominican Republic",
    captionEs: "Bodas en RD — ceremonias en iglesia, civiles, playa y destinos.",
    captionEn: "Weddings in DR — church, civil, beach and destination ceremonies.",
    hrefEs: "/fotografo-de-bodas-en-republica-dominicana/"
  },
  {
    src: "/wp-content/uploads/2024/09/Fotografo-Profesional-en-estudio-Santo-Domingo-Republica-Domincana_-43-scaled.webp",
    width: 1600, height: 1067,
    titleEs: "Fotografía corporativa", titleEn: "Corporate photography",
    altEs: "Servicio de fotografía profesional para corporativos en Santo Domingo",
    altEn: "Professional corporate photography service in Santo Domingo",
    captionEs: "Servicio de fotografía profesional para corporativos.",
    captionEn: "Professional corporate photography service.",
    hrefEs: "/servicio-de-fotografia-profesional-para-corporativos/"
  },
  {
    src: "/wp-content/uploads/2025/02/Sesion-de-Fotos-Estudio-en-Santo-Domingo-scaled.jpg",
    width: 1024, height: 1280,
    titleEs: "Galería estudio fotográfico", titleEn: "Studio photo gallery",
    altEs: "Galería de fotos en estudio fotográfico en Santo Domingo RD",
    altEn: "Studio photography gallery in Santo Domingo DR",
    captionEs: "Galería completa de fotos en estudio fotográfico en Santo Domingo.",
    captionEn: "Full gallery of studio photography in Santo Domingo.",
    hrefEs: "/galeria-de-fotos-en-estudio-fotografico-en-santo-domingo-rd/"
  },
  {
    src: "/wp-content/uploads/2025/02/estudio-fotografico-sesion-de-fotos-santo-domingo-2-scaled.webp",
    width: 1024, height: 1280,
    titleEs: "Galería sesión de fotos", titleEn: "Photo session gallery",
    altEs: "Galería sesión de fotos en Santo Domingo",
    altEn: "Photo session gallery in Santo Domingo",
    captionEs: "Galería de sesión de fotos en Santo Domingo.",
    captionEn: "Photo session gallery from Santo Domingo.",
    hrefEs: "/galeria-sesion-de-foto-en-santo-domingo/"
  },
  {
    src: "/wp-content/uploads/2025/03/Fotografia-de-Eventos-que-Da-Vida-a-Tu-Empresa-Santo-Domingo-Fotografo-scaled.webp",
    width: 1600, height: 884,
    titleEs: "Eventos corporativos", titleEn: "Corporate events",
    altEs: "Fotógrafo de eventos corporativos en Santo Domingo",
    altEn: "Corporate event photographer in Santo Domingo",
    captionEs: "Cobertura de eventos corporativos — empresas y branding.",
    captionEn: "Corporate event coverage — companies and branding.",
    hrefEs: "/fotografo-para-eventos-corporativos-en-santo-domingo/"
  },
  {
    src: "/wp-content/uploads/2025/03/Momentos-inolvidables-Santo-Domingo-scaled.webp",
    width: 1024, height: 1536,
    titleEs: "Propuesta de matrimonio", titleEn: "Marriage proposal",
    altEs: "Fotógrafo de propuesta de matrimonio en Santo Domingo",
    altEn: "Marriage proposal photographer in Santo Domingo",
    captionEs: "Fotógrafo de propuestas de matrimonio — momentos íntimos en exterior.",
    captionEn: "Marriage proposal photographer — intimate outdoor moments.",
    hrefEs: "/fotografo-novios-propuesta-de-matrimonio-en-rd/"
  },
  {
    src: "/wp-content/uploads/2026/04/Fotografo-en-Santo-Domingo-Para-Embarazadas-en-Estudioo-Fotografico-scaled.webp",
    width: 1707, height: 2560,
    titleEs: "Maternidad en estudio", titleEn: "Maternity studio session",
    altEs: "Sesión de fotos de maternidad en estudio fotográfico en Santo Domingo",
    altEn: "Maternity photo session in studio in Santo Domingo",
    captionEs: "Sesión de fotos para embarazadas en estudio fotográfico.",
    captionEn: "Maternity studio photo session for expecting mothers.",
    hrefEs: "/sesion-fotos-embarazada-en-estudio-santo-domingo/"
  }
];

export const galleryMetaEs = {
  title: "Galería de fotos | Babula Shots — Fotógrafo en República Dominicana",
  description:
    "Galería de fotografía profesional de Babula Shots en República Dominicana: bodas, estudio, retratos corporativos, embarazo, quinceañera, deportes, drone y destinos.",
  h1: "Galería de fotos",
  intro:
    "Una selección del trabajo de Babula Shots — sesiones de estudio, bodas, sesiones destino, deporte y eventos corporativos en República Dominicana. Haz clic en cada foto para ver la galería completa de esa sesión."
};

export const galleryMetaEn = {
  title: "Photo gallery | Babula Shots — Photographer in the Dominican Republic",
  description:
    "Professional photography portfolio by Babula Shots in the Dominican Republic: weddings, studio, corporate portraits, maternity, quinceañera, sports, drone and destination shoots.",
  h1: "Photo gallery",
  intro:
    "A selection of work by Babula Shots — studio sessions, weddings, destination shoots, sports and corporate events across the Dominican Republic. Click any photo to see the full gallery for that session."
};
