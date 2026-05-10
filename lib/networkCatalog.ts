// Babula Shots — Shared Network Catalog
// Source of truth for /servicios/, /ubicaciones/, /precios/, /faq/ across:
//   boda.babulashotsrd.com   (bodas)
//   inmobiliaria.babulashotsrd.com (inmobiliaria)
//   dron.babulashotsrd.com   (drone)
//   estudio.babulashotsrd.com (estudio)
//
// Pricing scraped from https://www.fotografosantodomingo.com/es/prices and
// /es/services/real-estate-drone-photography and /es/services/wedding-photography
// on 2026-05-10. Falls back to in-project data where the network hub does not
// publish a price.

export type Niche = "bodas" | "inmobiliaria" | "drone" | "estudio";

export type SharedService = {
  id: string;
  niche: Niche;
  esName: string;
  enName: string;
  esTagline: string;
  enTagline: string;
  esDescription: string;
  enDescription: string;
  deliverables: { es: string[]; en: string[] };
  faq: Array<{ esQ: string; esA: string; enQ: string; enA: string }>;
  url: string;
};

export type SharedLocation = {
  id: string;
  esName: string;
  enName: string;
  province: string;
  geo: { lat: number; lng: number };
  esTagline: string;
  enTagline: string;
  esDescription: string;
  enDescription: string;
  niches: Niche[];
  faq: Array<{ esQ: string; esA: string; enQ: string; enA: string }>;
};

export type SharedPackage = {
  id: string;
  niche: Niche;
  esName: string;
  enName: string;
  priceDop?: number;
  priceDisplay: string;
  includes: { es: string[]; en: string[] };
  bestFor: { es: string; en: string };
  durationMinutes?: number;
  source: "fotografosantodomingo.com" | "inmobiliaria" | "drone" | "boda" | "estudio";
};

export type NetworkFaq = {
  id: string;
  esQ: string;
  esA: string;
  enQ: string;
  enA: string;
  scope: "global" | Niche;
};

export const domains = {
  bodas: "https://boda.babulashotsrd.com",
  inmobiliaria: "https://inmobiliaria.babulashotsrd.com",
  drone: "https://dron.babulashotsrd.com",
  estudio: "https://estudio.babulashotsrd.com",
  hub: "https://www.fotografosantodomingo.com"
} as const;

export const services: SharedService[] = [
  // ============ BODAS (5) ============
  {
    id: "fotografia-ceremonia-boda",
    niche: "bodas",
    esName: "Fotografía de ceremonia de boda",
    enName: "Wedding ceremony photography",
    esTagline: "Cobertura discreta de la ceremonia con foto documental, retratos formales y la galería lista en pocos días.",
    enTagline: "Discreet ceremony coverage with documentary photography, formal portraits and a gallery delivered in days.",
    esDescription: "Cubrimos la ceremonia completa con un enfoque documental: la llegada de la novia, los votos, el primer beso, los abrazos de los padres y los invitados reaccionando en tiempo real. Trabajamos con segundo fotógrafo cuando el venue lo amerita y entregamos una galería privada en alta resolución, lista para imprimir y compartir con la familia. Coordinamos con el wedding planner y la iglesia o resort para no interrumpir el ritmo del día.",
    enDescription: "We cover the full ceremony with a documentary eye: the bride's arrival, the vows, the first kiss, parents hugging, guests reacting in real time. We bring a second shooter when the venue calls for it and deliver a private high-resolution gallery ready to print and share. We coordinate with the wedding planner and the church or resort to avoid disrupting the day.",
    deliverables: {
      es: ["Cobertura completa de la ceremonia", "Retratos formales de familia y novios", "Galería privada en alta resolución", "Selección lista para impresión 30x40", "Entrega en 14 días o menos"],
      en: ["Full ceremony coverage", "Formal family and couple portraits", "Private high-resolution gallery", "Print-ready selection up to 30x40", "Delivery in 14 days or less"]
    },
    faq: [
      { esQ: "Cuántas horas cubre el paquete de ceremonia?", esA: "El paquete base cubre 4 horas continuas, suficiente para preparativos, ceremonia y primeras fotos de recepción. Si la celebración cruza varios horarios, ofrecemos extensión por hora o el paquete de día completo de 8 horas, que ya incluye segundo fotógrafo.", enQ: "How many hours does the ceremony package cover?", enA: "The base package covers 4 continuous hours, enough for prep, ceremony and first reception photos. If your celebration spans more, we offer hourly extensions or the full-day 8-hour package that already includes a second shooter." },
      { esQ: "Trabajan con iglesias católicas y bodas civiles?", esA: "Sí, trabajamos con iglesias católicas, bodas civiles, ceremonias evangélicas y simbólicas en resort. Conocemos las restricciones de flash y movimiento dentro de la iglesia y nos coordinamos con el sacerdote o juez antes de la ceremonia.", enQ: "Do you work with Catholic churches and civil weddings?", enA: "Yes, we cover Catholic churches, civil weddings, evangelical and symbolic resort ceremonies. We know the flash and movement restrictions inside churches and coordinate with the priest or officiant before the ceremony." },
      { esQ: "Qué pasa si llueve el día de la boda?", esA: "Trabajamos con plan A y plan B desde la firma del contrato. Si el venue tiene cobertura interior la usamos sin perder calidad de imagen; si no, llegamos con paraguas transparentes que dan fotos preciosas y protegen el equipo. La lluvia no cancela la cobertura.", enQ: "What happens if it rains on the wedding day?", enA: "We work with plan A and plan B from contract signing. If the venue has indoor coverage we use it without losing image quality; if not, we arrive with clear umbrellas that produce beautiful photos and protect the gear. Rain does not cancel coverage." }
    ],
    url: `${domains.bodas}/servicios/fotografia-ceremonia-boda/`
  },
  {
    id: "fotografia-recepcion-boda",
    niche: "bodas",
    esName: "Fotografía de recepción y fiesta",
    enName: "Reception and party photography",
    esTagline: "Brindis, primer baile, ramo, hora loca y pista llena: documentamos la fiesta sin ser invasivos.",
    enTagline: "Toasts, first dance, bouquet toss, hora loca and a packed dance floor — documented without ever getting in the way.",
    esDescription: "La recepción es donde nace el álbum más emocional de la boda. Cubrimos la entrada de los novios, los discursos, el corte del pastel, el primer baile, el lanzamiento del ramo y toda la hora loca con flash directo cuando la pista lo pide. Trabajamos en silencio, leemos al DJ, anticipamos los momentos y entregamos una galería que mezcla retratos espontáneos con detalles del montaje del salón.",
    enDescription: "The reception is where the most emotional part of the album is born. We cover the couple's entrance, speeches, cake cutting, first dance, bouquet toss and the full hora loca with direct flash when the dance floor calls for it. We work quietly, read the DJ, anticipate the moments and deliver a gallery mixing candid portraits with reception decor details.",
    deliverables: {
      es: ["Entrada de los novios y discursos", "Primer baile y baile con padres", "Corte de pastel y brindis", "Hora loca completa con flash", "Detalles del montaje y centros de mesa"],
      en: ["Couple entrance and speeches", "First dance and parent dances", "Cake cutting and toasts", "Full hora loca with flash", "Reception decor and centerpiece details"]
    },
    faq: [
      { esQ: "Cubren la hora loca completa?", esA: "Sí. La hora loca es el momento más fotogénico de la noche dominicana y la cubrimos completa, desde la primera bengala hasta el último accesorio. Trabajamos con flash off-camera para congelar la energía sin volar las luces de pista del DJ.", enQ: "Do you cover the full hora loca?", enA: "Yes. The hora loca is the most photogenic moment of a Dominican wedding night and we cover it end to end, from the first sparkler to the last prop. We work with off-camera flash to freeze the energy without overpowering the DJ's stage lighting." },
      { esQ: "Hasta qué hora se quedan en la recepción?", esA: "El paquete de recepción cubre 4 horas continuas, normalmente cocktail, cena y baile inicial. Si la fiesta se extiende, cobramos hora adicional acordada antes del evento. Para cobertura hasta el cierre recomendamos el paquete de día completo.", enQ: "How late do you stay at the reception?", enA: "The reception package covers 4 continuous hours, typically cocktail, dinner and the first dance set. If the party runs long we charge a pre-agreed hourly rate. For end-of-night coverage we recommend the full-day package." },
      { esQ: "Pueden hacer foto y video al mismo tiempo?", esA: "Sí, trabajamos con un equipo separado de foto y video que se coordina antes del evento para no chocar en los momentos clave. Tenemos un paquete combinado con descuento si contratas ambos servicios juntos.", enQ: "Can you handle photo and video at the same time?", enA: "Yes. We bring separate photo and video teams that coordinate before the event so they never clash on key moments. We offer a discounted bundle if you book both services together." }
    ],
    url: `${domains.bodas}/servicios/fotografia-recepcion-boda/`
  },
  {
    id: "sesion-preboda-engagement",
    niche: "bodas",
    esName: "Sesión preboda y engagement",
    enName: "Pre-wedding and engagement session",
    esTagline: "Una hora frente a la cámara antes de la boda para que se sientan cómodos y se conozcan con el fotógrafo.",
    enTagline: "An hour in front of the camera before the wedding so you feel relaxed and get to know your photographer.",
    esDescription: "La sesión preboda no es solo fotos bonitas: es el ensayo emocional para que el día de la boda no se sientan rígidos frente a la cámara. Elegimos una locación significativa para la pareja, ya sea la playa donde se conocieron, la Zona Colonial o un cafetal en el Cibao. Damos dirección de poses naturales, salimos en golden hour y entregamos 40 fotos editadas en menos de dos semanas.",
    enDescription: "An engagement session is more than pretty photos — it is emotional rehearsal so you don't feel stiff on the wedding day. We pick a meaningful location, whether it's the beach where you met, the Colonial Zone or a coffee farm in El Cibao. We give natural posing direction, shoot in golden hour and deliver 40 edited photos in under two weeks.",
    deliverables: {
      es: ["Sesión de 1 hora en locación a elegir", "40 fotos editadas en alta resolución", "Galería online privada para compartir", "Dirección de poses incluida", "Entrega en 10 días o menos"],
      en: ["1-hour session at the location of your choice", "40 edited high-resolution photos", "Private online gallery to share", "Posing direction included", "Delivery in 10 days or less"]
    },
    faq: [
      { esQ: "Para qué sirve una sesión preboda si ya van a tener fotos el día de la boda?", esA: "Sirve para que se relajen frente a la cámara, prueben outfits y locaciones, y consigan imágenes para el save the date, la página web de la boda y el video de proyección durante la recepción. Las parejas que la hacen llegan al día de la boda mucho más cómodas.", enQ: "Why book an engagement session if you'll already have wedding-day photos?", enA: "So you can relax in front of the camera, test outfits and locations, and get images for save-the-dates, your wedding website and the projection video during the reception. Couples who do it arrive at the wedding day far more comfortable." },
      { esQ: "Cuántos cambios de outfit puedo hacer?", esA: "En una hora cabemos cómodamente dos outfits, uno casual y uno más formal. Si quieres tres looks recomendamos extender a 90 minutos y elegir una locación con baño cercano para cambiarte sin perder tiempo de luz.", enQ: "How many outfit changes can I do?", enA: "In one hour we comfortably fit two outfits — one casual and one more formal. If you want three looks we recommend extending to 90 minutes and picking a location with a nearby bathroom so you don't lose golden hour to changing." }
    ],
    url: `${domains.bodas}/servicios/sesion-preboda-engagement/`
  },
  {
    id: "boda-destino-republica-dominicana",
    niche: "bodas",
    esName: "Boda destino en República Dominicana",
    enName: "Destination wedding in the Dominican Republic",
    esTagline: "Cobertura para parejas extranjeras que se casan en Punta Cana, Cap Cana, Casa de Campo o Las Terrenas.",
    enTagline: "Coverage for international couples getting married in Punta Cana, Cap Cana, Casa de Campo or Las Terrenas.",
    esDescription: "Trabajamos con parejas que llegan desde Estados Unidos, Canadá y Europa para casarse en resorts y villas privadas del país. Coordinamos con planners locales, entendemos las restricciones de cada hotel y entregamos una galería rápida para que los invitados que viajaron se lleven recuerdos a casa. Hablamos español e inglés y nos movemos sin fricción entre culturas.",
    enDescription: "We work with couples flying in from the US, Canada and Europe to marry at resorts and private villas across the country. We coordinate with local planners, understand each hotel's restrictions and deliver a fast gallery so guests who traveled fly home with memories. We work bilingually in Spanish and English and move smoothly across cultures.",
    deliverables: {
      es: ["Cobertura de día completo (8 horas)", "Sesión de pareja en la playa o resort", "Segundo fotógrafo incluido", "Galería preliminar en 72 horas", "Entrega final en 21 días"],
      en: ["Full-day coverage (8 hours)", "Beach or resort couple session", "Second shooter included", "Preview gallery in 72 hours", "Final delivery in 21 days"]
    },
    faq: [
      { esQ: "Cubren resorts como Hard Rock, Excellence, Iberostar y Casa de Campo?", esA: "Sí. Trabajamos regularmente en los resorts de Punta Cana, Bávaro, Cap Cana, Casa de Campo y Las Terrenas. Conocemos a los planners internos y sabemos qué áreas del hotel dan mejor luz a cada hora del día.", enQ: "Do you cover resorts like Hard Rock, Excellence, Iberostar and Casa de Campo?", enA: "Yes. We regularly shoot at resorts in Punta Cana, Bavaro, Cap Cana, Casa de Campo and Las Terrenas. We know the in-house planners and know which areas of each hotel get the best light at each hour." },
      { esQ: "Cobran honorarios de viaje si la boda es en Punta Cana?", esA: "Para Punta Cana, Bávaro y La Romana incluimos el traslado en el paquete. Para Las Terrenas, Samaná, Puerto Plata o Jarabacoa cobramos un travel fee fijo que cubre transporte, una noche de hospedaje cuando aplica y comida del equipo.", enQ: "Do you charge travel fees for a Punta Cana wedding?", enA: "For Punta Cana, Bavaro and La Romana, travel is included in the package. For Las Terrenas, Samana, Puerto Plata or Jarabacoa we charge a flat travel fee that covers transport, one hotel night when applicable and team meals." },
      { esQ: "Pueden enviar las fotos a Estados Unidos en formato listo para imprimir allá?", esA: "Sí. Entregamos archivos en formato sRGB y AdobeRGB para que cualquier laboratorio en Estados Unidos, Canadá o Europa los imprima sin variación de color. También recomendamos laboratorios específicos en Miami, Toronto y Madrid si nos lo piden.", enQ: "Can you send the photos to the US in print-ready format?", enA: "Yes. We deliver files in both sRGB and AdobeRGB so any lab in the US, Canada or Europe prints them without color shift. We also recommend specific labs in Miami, Toronto and Madrid on request." }
    ],
    url: `${domains.bodas}/servicios/boda-destino-republica-dominicana/`
  },
  {
    id: "album-boda-impreso",
    niche: "bodas",
    esName: "Álbum de boda impreso",
    enName: "Printed wedding album",
    esTagline: "Diseñamos e imprimimos el álbum físico que tus padres y abuelos van a hojear durante años.",
    enTagline: "We design and print the physical album your parents and grandparents will leaf through for years.",
    esDescription: "El álbum impreso es lo que sobrevive a las plataformas digitales. Diseñamos el flow narrativo de la boda en 30 a 60 páginas, imprimimos en papel mate de calidad museo con encuadernación lay-flat y entregamos en una caja de presentación. Hacemos dos rondas de revisión antes de imprimir para que la pareja apruebe cada doble página y el orden de los momentos.",
    enDescription: "The printed album is what outlives every digital platform. We design the narrative flow of your wedding across 30 to 60 pages, print on museum-grade matte paper with lay-flat binding and deliver in a presentation box. We do two rounds of revisions before printing so the couple approves every spread and moment order.",
    deliverables: {
      es: ["Diseño editorial de 30 a 60 páginas", "Papel mate calidad museo", "Encuadernación lay-flat sin costura visible", "Caja de presentación rígida", "Hasta 2 rondas de revisión antes de imprimir"],
      en: ["Editorial design of 30 to 60 pages", "Museum-grade matte paper", "Lay-flat binding with no visible seam", "Rigid presentation box", "Up to 2 revision rounds before printing"]
    },
    faq: [
      { esQ: "Puedo elegir las fotos del álbum o las eligen ustedes?", esA: "Hacemos una preselección de 80 a 100 fotos que cuentan la historia del día y te la enviamos. Tú quitas o agregas lo que quieras y nosotros diseñamos. La mayoría de parejas aprueba la preselección con cambios mínimos porque ya está armada con criterio narrativo.", enQ: "Do I pick the album photos or do you?", enA: "We pre-select 80 to 100 photos that tell the story of the day and send them to you. You add or remove whatever you want and we design. Most couples approve the pre-selection with minimal changes because it already follows a narrative arc." },
      { esQ: "Cuánto tarda en estar listo el álbum?", esA: "Desde que apruebas el diseño tarda entre 4 y 6 semanas en imprimirse y llegar. El diseño en sí toma 2 semanas adicionales después de que entregamos la galería digital. Total: alrededor de 8 semanas desde la boda.", enQ: "How long does the album take?", enA: "Once you approve the design it takes 4 to 6 weeks to print and arrive. The design itself takes another 2 weeks after we deliver the digital gallery. Total: around 8 weeks from the wedding." }
    ],
    url: `${domains.bodas}/servicios/album-boda-impreso/`
  },

  // ============ INMOBILIARIA (4) ============
  {
    id: "fotografia-inmobiliaria-residencial",
    niche: "inmobiliaria",
    esName: "Fotografía inmobiliaria residencial",
    enName: "Residential real estate photography",
    esTagline: "Fotos profesionales para portales, agentes y propietarios.",
    enTagline: "Professional photos for portals, agents and property owners.",
    esDescription: "Sesión de fotografía interior y exterior para listings de venta o alquiler en Santo Domingo, Punta Cana, Casa de Campo y todo RD. Iluminación controlada, verticales rectas, ventanas balanceadas y exteriores con cielo limpio. Entregamos archivos optimizados para Point2Homes, MLS, Inmobilia, Encuentra24 y formatos verticales para WhatsApp y redes sociales.",
    enDescription: "Interior and exterior photography for sale or rental listings in Santo Domingo, Punta Cana, Casa de Campo and across DR. Controlled lighting, straight verticals, balanced windows and clean-sky exteriors. We deliver files formatted for Point2Homes, MLS, Inmobilia, Encuentra24 plus vertical crops for WhatsApp and social media.",
    deliverables: {
      es: ["20-40 fotos editadas", "Interior + exterior", "Formatos para portales y MLS", "Set vertical para WhatsApp", "Galería online compartible"],
      en: ["20-40 edited photos", "Interior + exterior", "Listing portal and MLS formats", "Vertical set for WhatsApp", "Shareable online gallery"]
    },
    faq: [
      { esQ: "En cuánto tiempo entregan las fotos editadas?", esA: "Los archivos editados se entregan en 48-72 horas para sesiones residenciales estándar. Para entregas urgentes (portales con plazo o lanzamientos de proyecto) ofrecemos servicio express de 24 horas con un costo adicional. Las fotos llegan a tu correo y a una galería online compartible con compradores.", enQ: "How long does delivery take?", enA: "Edited files are delivered in 48-72 hours for standard residential sessions. For tight portal deadlines or project launches we offer 24-hour express service for an extra fee. Files arrive in your email plus an online gallery you can share with buyers." },
      { esQ: "Qué necesito preparar antes de la sesión?", esA: "Limpiar y ordenar la propiedad, abrir cortinas, encender todas las luces y guardar objetos personales prominentes (fotos de familia, documentos, artículos de aseo). Confirmar acceso, parqueo y permisos del edificio o comunidad cerrada. Una checklist completa la enviamos al confirmar la reserva.", enQ: "What do I prepare before the shoot?", enA: "Clean and stage the property, open curtains, turn on all lights and put away prominent personal items. Confirm access, parking and any building or gated-community permits. We send a full checklist when we confirm the booking." }
    ],
    url: `${domains.inmobiliaria}/servicios/fotografia-inmobiliaria-residencial/`
  },
  {
    id: "video-recorrido-propiedad",
    niche: "inmobiliaria",
    esName: "Video recorrido de propiedad",
    enName: "Property walkthrough video",
    esTagline: "Video editado tipo tour para venta o renta de propiedades.",
    enTagline: "Edited tour-style video for sale or rental listings.",
    esDescription: "Recorrido fluido por la propiedad con steadycam, transiciones limpias y cortes verticales para WhatsApp y reels. Incluye drone exterior si la zona lo permite, música con licencia comercial y entrega en 4K. Funciona para propiedades premium, proyectos en preventa y Airbnb de alto valor.",
    enDescription: "Smooth walkthrough with steadycam, clean transitions and vertical cuts for WhatsApp and reels. Includes exterior drone if the zone allows, commercially licensed music and 4K delivery. Works for premium homes, pre-construction launches and high-value Airbnb listings.",
    deliverables: {
      es: ["Video horizontal 60-90s en 4K", "Cortes verticales para reels", "Drone exterior según zona", "Música con licencia comercial", "Subtítulos opcionales"],
      en: ["Horizontal 60-90s 4K video", "Vertical cuts for reels", "Exterior drone per zone", "Commercially licensed music", "Optional subtitles"]
    },
    faq: [
      { esQ: "Cuánto dura un video de propiedad estándar?", esA: "El formato horizontal estándar es de 60 a 90 segundos para mantener atención en redes y WhatsApp. Para propiedades premium o proyectos hacemos versiones extendidas de 2-3 minutos. También entregamos cortes verticales de 15-30 segundos optimizados para reels e Instagram Stories.", enQ: "How long is a standard property video?", enA: "Standard horizontal format is 60-90 seconds to keep attention on social and WhatsApp. For premium homes or launches we produce extended 2-3 minute cuts. We also deliver 15-30 second vertical cuts optimized for reels and Instagram Stories." }
    ],
    url: `${domains.inmobiliaria}/servicios/video-recorrido-propiedad/`
  },
  {
    id: "drone-aereo-inmobiliario",
    niche: "inmobiliaria",
    esName: "Drone aéreo para inmobiliaria",
    enName: "Real estate aerial drone",
    esTagline: "Vista aérea para villas, solares, resorts y proyectos.",
    enTagline: "Aerial view for villas, lots, resorts and developments.",
    esDescription: "Tomas aéreas que muestran ubicación, vista, amenidades y entorno. Esencial para villas frente al mar, solares, resorts y proyectos en preventa. Volamos con DJI Mavic 3 Pro y respetamos restricciones de aeropuerto, comunidad y privacidad. Entrega de foto y video en 48 horas, archivos crudos disponibles si necesitas la edición en casa.",
    enDescription: "Aerial shots that show location, view, amenities and surroundings. Essential for beachfront villas, lots, resorts and pre-construction projects. We fly DJI Mavic 3 Pro and respect airport, community and privacy restrictions. Photo and video delivered in 48 hours, raw files available if you handle editing in-house.",
    deliverables: {
      es: ["Foto aérea 20MP", "Video aéreo 4K", "Tomas de ubicación", "Drone con permisos coordinados", "Archivos crudos opcionales"],
      en: ["20MP aerial photo", "4K aerial video", "Location-context shots", "Permitted drone flight", "Optional raw files"]
    },
    faq: [
      { esQ: "Pueden volar drone cerca del aeropuerto de Punta Cana?", esA: "En zonas restringidas cerca del aeropuerto necesitamos solicitar permiso al IDAC y a veces al hotel o comunidad. Confirmamos viabilidad antes de reservar. Si la zona no permite vuelo, ofrecemos alternativas como una toma elevada con trípode telescópico o cambio de locación equivalente cercana.", enQ: "Can you fly drone near Punta Cana airport?", enA: "In restricted zones near the airport we request IDAC clearance and sometimes hotel or community approval. We confirm feasibility before booking. If a zone doesn't allow flight we offer alternatives like a telescoping pole shot or a swap to a nearby comparable location." }
    ],
    url: `${domains.inmobiliaria}/servicios/drone-aereo-inmobiliario/`
  },
  {
    id: "fotografia-airbnb-villas",
    niche: "inmobiliaria",
    esName: "Fotografía para Airbnb y villas turísticas",
    enName: "Airbnb and vacation rental photography",
    esTagline: "Fotos profesionales optimizadas para Airbnb, Booking y Vrbo.",
    enTagline: "Professional photos optimized for Airbnb, Booking and Vrbo.",
    esDescription: "Sesión enfocada en mejorar la conversión de tu listing turístico. Cubrimos hasta 6 espacios principales (sala, cocina, dormitorios, baños, exterior, piscina) con la composición y luz que premian los algoritmos de Airbnb y Booking. Incluye foto de portada de impacto y set de detalles para amenidades.",
    enDescription: "Session focused on lifting conversion of your vacation rental listing. We cover up to 6 main spaces (living room, kitchen, bedrooms, bathrooms, exterior, pool) with the composition and light that Airbnb and Booking algorithms reward. Includes a high-impact cover photo and amenity detail set.",
    deliverables: {
      es: ["25-35 fotos editadas", "Foto de portada de impacto", "Set de detalles y amenidades", "Formatos optimizados para Airbnb", "Galería online"],
      en: ["25-35 edited photos", "High-impact cover photo", "Amenity details set", "Airbnb-optimized formats", "Online gallery"]
    },
    faq: [
      { esQ: "Mi Airbnb es pequeño - vale la pena la sesión?", esA: "Sí. Las propiedades pequeñas se benefician aún más de fotografía profesional porque la luz y la composición correcta hacen que se vean más amplias y deseables. Vemos un aumento promedio de 15-30% en clicks y reservas en los 2-3 meses posteriores a actualizar las fotos del listing.", enQ: "My Airbnb is small - is the session worth it?", enA: "Yes. Small properties benefit even more from professional photography because the right light and composition make them look bigger and more desirable. We typically see a 15-30% lift in clicks and bookings in the 2-3 months after photos are refreshed." }
    ],
    url: `${domains.inmobiliaria}/servicios/fotografia-airbnb-villas/`
  },

  // ============ DRONE (4) ============
  {
    id: "drone-inmobiliario-arquitectura",
    niche: "drone",
    esName: "Drone para inmobiliaria y arquitectura",
    enName: "Drone for real estate and architecture",
    esTagline: "Tomas aéreas para listings, proyectos y arquitectura.",
    enTagline: "Aerial shots for listings, developments and architecture.",
    esDescription: "Servicio especializado para mostrar el contexto y la escala de propiedades, proyectos en preventa, edificios institucionales y obras de arquitectura. Volamos DJI Mavic 3 Pro con sensor 4/3, lo que permite ediciones en posproducción sin perder calidad. Coordinamos permisos cuando la zona los requiere.",
    enDescription: "Specialized service to show context and scale for properties, pre-construction launches, institutional buildings and architecture work. We fly DJI Mavic 3 Pro with a 4/3 sensor, which allows for post-production edits without losing quality. We coordinate permits when the zone requires.",
    deliverables: {
      es: ["Foto aérea 20MP", "Video aéreo 4K", "Múltiples ángulos", "Permisos coordinados con IDAC", "Galería online"],
      en: ["20MP aerial photo", "4K aerial video", "Multiple angles", "IDAC permits coordinated", "Online gallery"]
    },
    faq: [
      { esQ: "Qué distancia máxima cubre el drone?", esA: "El DJI Mavic 3 Pro alcanza hasta 15km de transmisión en zona abierta, pero para fines profesionales mantenemos el dron siempre a la vista del piloto y a una altura máxima de 120 metros según la regulación del IDAC. Esto cubre la gran mayoría de propiedades, proyectos y obras.", enQ: "What's the drone's maximum range?", enA: "The DJI Mavic 3 Pro has a transmission range of up to 15km in open zones, but for professional work we always keep the drone within direct line-of-sight and below the 120m IDAC regulation ceiling. That covers the vast majority of properties, projects and construction sites." }
    ],
    url: `${domains.drone}/servicios/drone-inmobiliario-arquitectura/`
  },
  {
    id: "drone-construccion-obra",
    niche: "drone",
    esName: "Drone para construcción y obra",
    enName: "Drone for construction progress",
    esTagline: "Documentación mensual del avance de obra desde el aire.",
    enTagline: "Monthly aerial documentation of construction progress.",
    esDescription: "Servicio de seguimiento de obra con vuelos periódicos (mensual o quincenal) que documentan el avance desde el aire. Útil para reportes a inversionistas, presentaciones a juntas de condominio, marketing de preventa y ortomosaicos para ingeniería. Mantenemos los puntos de captura para que la comparación entre meses sea consistente.",
    enDescription: "Construction tracking service with periodic flights (monthly or biweekly) documenting progress from the air. Useful for investor reports, condo board presentations, pre-sale marketing and orthomosaics for engineering. We lock the capture points so month-over-month comparisons stay consistent.",
    deliverables: {
      es: ["Vuelo mensual o quincenal", "Foto + video del avance", "Puntos de captura consistentes", "Reporte visual editable", "Ortomosaico opcional"],
      en: ["Monthly or biweekly flight", "Progress photo + video", "Consistent capture points", "Editable visual report", "Optional orthomosaic"]
    },
    faq: [
      { esQ: "Pueden generar ortomosaicos para ingeniería?", esA: "Sí. En proyectos donde se requiere medición precisa volamos en patrón de grilla y procesamos los datos en software de fotogrametría para generar ortomosaicos georreferenciados. La precisión típica es de 2-5cm por píxel. Esto se cotiza aparte del servicio básico de seguimiento visual.", enQ: "Can you generate orthomosaics for engineering?", enA: "Yes. On projects that need precise measurement we fly in a grid pattern and process the data in photogrammetry software to produce georeferenced orthomosaics. Typical accuracy is 2-5cm per pixel. This is quoted separately from the basic visual progress service." }
    ],
    url: `${domains.drone}/servicios/drone-construccion-obra/`
  },
  {
    id: "drone-cinematografico-eventos",
    niche: "drone",
    esName: "Drone cinematográfico para eventos",
    enName: "Cinematic drone for events",
    esTagline: "Drone para bodas, corporativos y eventos al aire libre.",
    enTagline: "Drone for weddings, corporate events and outdoor productions.",
    esDescription: "Tomas aéreas cinematográficas para complementar coberturas de boda, lanzamientos corporativos, conciertos al aire libre y eventos de marca. Volamos en momentos clave (entrada, primer baile, cierre) sin interrumpir el evento. Coordinamos con el equipo de producción principal y entregamos clips listos para edición.",
    enDescription: "Cinematic aerial shots to complement wedding coverage, corporate launches, outdoor concerts and brand events. We fly at key moments (entrance, first dance, finale) without disrupting the event. We coordinate with the main production team and deliver edit-ready clips.",
    deliverables: {
      es: ["Vuelo durante momentos clave", "Clips 4K listos para edición", "Coordinación con equipo de video", "Drone con permisos", "Backup de batería extendido"],
      en: ["Flight during key moments", "Edit-ready 4K clips", "Coordination with video team", "Permitted drone", "Extended battery backup"]
    },
    faq: [
      { esQ: "Pueden trabajar como segundo equipo en una boda?", esA: "Sí. Trabajamos como equipo de drone independiente bajo dirección del fotógrafo o videógrafo principal. Antes del evento revisamos el shot list, los puntos clave y las restricciones del venue. Coordinamos vuelos en intermedios para no interrumpir ceremonia ni recepción.", enQ: "Can you work as a second team at a wedding?", enA: "Yes. We work as an independent drone team under the lead photographer or videographer's direction. Before the event we review the shot list, key moments and venue restrictions. We schedule flights between segments so we never interrupt the ceremony or reception." }
    ],
    url: `${domains.drone}/servicios/drone-cinematografico-eventos/`
  },
  {
    id: "drone-turismo-resorts",
    niche: "drone",
    esName: "Drone para turismo y resorts",
    enName: "Drone for tourism and resorts",
    esTagline: "Material aéreo para hoteles, resorts y campañas turísticas.",
    enTagline: "Aerial assets for hotels, resorts and tourism campaigns.",
    esDescription: "Producción de material aéreo para campañas de hoteles, resorts, restaurantes turísticos y campañas de destino. Cubrimos amenidades, playas, golf courses, piscinas y experiencias desde el aire. Trabajamos con marcas locales e internacionales y entregamos archivos listos para uso comercial multi-canal.",
    enDescription: "Aerial asset production for hotel campaigns, resorts, tourism restaurants and destination marketing. We cover amenities, beaches, golf courses, pools and experiences from above. We work with local and international brands and deliver files ready for multi-channel commercial use.",
    deliverables: {
      es: ["Set de fotos aéreas hi-res", "Video master 4K + cortes redes", "Locuras editoriales", "Licencia comercial multi-canal", "Soporte para campañas"],
      en: ["Hi-res aerial photo set", "4K master video + social cuts", "Editorial pulls", "Multi-channel commercial license", "Campaign support"]
    },
    faq: [
      { esQ: "La licencia incluye uso en campañas pagadas?", esA: "Sí. La licencia comercial estándar cubre uso en campañas pagadas en redes (Meta, TikTok, Google Ads, YouTube), web del cliente, OOH, prensa especializada y materiales B2B. Para usos exclusivos a perpetuidad o cesión total de derechos cotizamos por separado según el alcance.", enQ: "Does the license cover paid ad campaigns?", enA: "Yes. The standard commercial license covers paid social campaigns (Meta, TikTok, Google Ads, YouTube), the client's website, OOH, trade press and B2B materials. Exclusive perpetual use or full rights transfer is quoted separately based on scope." }
    ],
    url: `${domains.drone}/servicios/drone-turismo-resorts/`
  },

  // ============ ESTUDIO (4) ============
  {
    id: "retratos-profesionales-estudio",
    niche: "estudio",
    esName: "Retratos profesionales en estudio",
    enName: "Professional studio portraits",
    esTagline: "Retratos para LinkedIn, actores, modelos y catálogo.",
    enTagline: "Portraits for LinkedIn, actors, models and catalogue.",
    esDescription: "Sesión de retratos en estudio con iluminación controlada, fondos profesionales y dirección de poses. Trabajamos retratos corporativos para LinkedIn, headshots para actores y modelos, books para nuevas caras y portafolios profesionales. Incluye dos cambios de outfit y retoque editorial sutil.",
    enDescription: "Studio portrait session with controlled lighting, professional backdrops and pose direction. We shoot corporate headshots for LinkedIn, actor and model headshots, new-face books and professional portfolios. Includes two outfit changes and subtle editorial retouching.",
    deliverables: {
      es: ["1.5 horas en estudio", "10-15 retratos editados", "2 cambios de outfit", "Retoque editorial sutil", "Galería online"],
      en: ["1.5 hours in studio", "10-15 edited portraits", "2 outfit changes", "Subtle editorial retouching", "Online gallery"]
    },
    faq: [
      { esQ: "Qué debo llevar a la sesión de retrato?", esA: "Recomendamos 2-3 outfits en colores sólidos (evita estampados pequeños que vibran en cámara), maquillaje natural si es retrato corporativo o más marcado si es book de modelo. Llega 15 minutos antes para revisar la luz. Tenemos espejo, vapor de plancha y un área de cambio en el estudio.", enQ: "What should I bring?", enA: "We recommend 2-3 outfits in solid colors (avoid small patterns that shimmer on camera), natural makeup for corporate portraits or more pronounced makeup for model books. Arrive 15 minutes early to review the lighting. The studio has a mirror, garment steamer and a private change area." }
    ],
    url: `${domains.estudio}/servicios/retratos-profesionales-estudio/`
  },
  {
    id: "fotografia-comida-bebida",
    niche: "estudio",
    esName: "Fotografía de comida y bebida",
    enName: "Food and beverage photography",
    esTagline: "Fotografía gastronómica para menú, redes y campañas.",
    enTagline: "Food photography for menu, social and campaigns.",
    esDescription: "Sesión enfocada en fotografía gastronómica para restaurantes, marcas de bebida y catálogos. Trabajamos con stylist o con tu chef ejecutivo. Cubrimos planos cenitales, detalles, ambiente y bodegones editoriales. Entregamos archivos listos para menú impreso, redes, web y campañas.",
    enDescription: "Session focused on food photography for restaurants, beverage brands and catalogues. We work with a food stylist or your executive chef. We cover overhead shots, details, ambience and editorial still life. Files delivered ready for printed menus, social, web and campaigns.",
    deliverables: {
      es: ["20-30 platos editados", "Múltiples ángulos por plato", "Stylist disponible (opcional)", "Archivos para menú y redes", "Galería online"],
      en: ["20-30 edited dishes", "Multiple angles per dish", "Optional food stylist", "Files for menu and social", "Online gallery"]
    },
    faq: [
      { esQ: "Necesito traer un food stylist?", esA: "Para sesiones de catálogo o campaña publicitaria sí recomendamos food stylist; podemos trabajar con uno de la red de Babula Shots o con el que tu marca prefiera. Para sesiones de menú de restaurante el chef ejecutivo y un asistente del kitchen son suficientes en la mayoría de los casos.", enQ: "Do I need a food stylist?", enA: "For catalogue or ad campaign shoots we recommend a food stylist; we can bring one from the Babula Shots network or you can use yours. For restaurant menu shoots the executive chef plus a kitchen assistant is enough in most cases." }
    ],
    url: `${domains.estudio}/servicios/fotografia-comida-bebida/`
  },
  {
    id: "fotografia-producto-catalogo",
    niche: "estudio",
    esName: "Fotografía de producto para catálogo",
    enName: "Product photography for catalogue",
    esTagline: "Producto para e-commerce y catálogo profesional.",
    enTagline: "Product for e-commerce and professional catalogue.",
    esDescription: "Fotografía de producto sobre fondo blanco aislado para e-commerce, plus tomas con ambientación para web y campañas. Trabajamos joyería, ropa, accesorios, electrónica de consumo y productos de cuidado personal. Entrega bilingüe de nombres de archivo organizados por SKU para integrar con tu plataforma.",
    enDescription: "Product photography on isolated white background for e-commerce, plus styled shots with ambience for web and campaigns. We shoot jewelry, apparel, accessories, consumer electronics and personal care products. Bilingual file naming organized by SKU for easy integration with your platform.",
    deliverables: {
      es: ["Foto fondo blanco aislado", "Tomas con ambientación", "Múltiples ángulos por producto", "Archivos por SKU", "Listos para Shopify y MercadoLibre"],
      en: ["Isolated white background", "Styled context shots", "Multiple angles per product", "SKU-organized files", "Ready for Shopify and MercadoLibre"]
    },
    faq: [
      { esQ: "Pueden hacer recorte de fondo blanco perfecto?", esA: "Sí. La sesión sobre fondo blanco se procesa para que el blanco final sea de píxel limpio (255,255,255), listo para subir directamente a marketplaces como Amazon, MercadoLibre o tu Shopify. Si el producto requiere transparencias (cristal, joyería) lo manejamos con técnicas de iluminación específicas.", enQ: "Can you produce perfect white-background cutouts?", enA: "Yes. White-background sessions are processed so the final white is clean pixel (255,255,255), ready to upload directly to marketplaces like Amazon, MercadoLibre or your Shopify. For products needing transparency (glass, jewelry) we use specific lighting techniques." }
    ],
    url: `${domains.estudio}/servicios/fotografia-producto-catalogo/`
  },
  {
    id: "sesion-embarazo-boudoir",
    niche: "estudio",
    esName: "Sesiones de embarazo y boudoir",
    enName: "Maternity and boudoir sessions",
    esTagline: "Sesiones íntimas de embarazo, boudoir y empoderamiento.",
    enTagline: "Intimate maternity, boudoir and empowerment sessions.",
    esDescription: "Sesiones de fotografía femenina con un enfoque editorial cuidadoso. Cubrimos embarazo (idealmente entre las semanas 30-36), boudoir clásico, sesiones tipo regalo de aniversario y empoderamiento. Estudio privado, equipo femenino disponible bajo solicitud, asesoría de wardrobe y maquillaje incluida.",
    enDescription: "Female-focused photography sessions with a careful editorial approach. We cover maternity (ideally weeks 30-36), classic boudoir, anniversary-gift sessions and empowerment shoots. Private studio, female crew available on request, wardrobe and makeup guidance included.",
    deliverables: {
      es: ["1.5-2 horas en estudio privado", "15-25 fotos editadas", "Asesoría de wardrobe", "Equipo femenino opcional", "Galería privada"],
      en: ["1.5-2 hours in private studio", "15-25 edited photos", "Wardrobe guidance", "Optional female-only crew", "Private gallery"]
    },
    faq: [
      { esQ: "El estudio es privado durante la sesión?", esA: "Sí. Para sesiones de boudoir y embarazo cerramos completamente el estudio durante la sesión. Solo el equipo asignado y la persona fotografiada (más un acompañante si lo deseas) pueden entrar. La galería final es privada y solo tú decides quién tiene acceso al link compartible.", enQ: "Is the studio private during the session?", enA: "Yes. For boudoir and maternity sessions we close the studio completely during the shoot. Only the assigned crew and the person being photographed (plus a companion if you want) can be present. The final gallery is private and only you decide who has access to the share link." }
    ],
    url: `${domains.estudio}/servicios/sesion-embarazo-boudoir/`
  }
];

/* ============ LOCATIONS (16) ============ */

export const locations: SharedLocation[] = [
  {
    id: "santo-domingo",
    esName: "Santo Domingo",
    enName: "Santo Domingo",
    province: "Distrito Nacional",
    geo: { lat: 18.4861, lng: -69.9312 },
    esTagline: "Capital y mercado principal para retratos, inmobiliaria, drone y eventos.",
    enTagline: "Capital and primary market for portraits, real estate, drone and events.",
    esDescription: "Santo Domingo concentra la mayor demanda de retratos profesionales, inmobiliaria de alto valor (Naco, Piantini, Bella Vista, Zona Colonial), proyectos en preventa y eventos corporativos. Cubrimos toda la ciudad con tiempos de respuesta cortos y una checklist de logística para edificios cerrados, comunidades privadas y zonas con restricción de drone.",
    enDescription: "Santo Domingo concentrates demand for professional portraits, high-value real estate (Naco, Piantini, Bella Vista, Colonial Zone), pre-construction launches and corporate events. We cover the entire city with quick response times and a logistics checklist for gated buildings, private communities and drone-restricted zones.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: [
      { esQ: "Hay zonas de Santo Domingo donde no se puede volar drone?", esA: "Sí. Las cercanías del Aeropuerto Las Américas, La Isabela y zonas militares están restringidas. La Zona Colonial requiere coordinación con el ministerio de cultura para algunas tomas. En el resto de la ciudad podemos volar respetando alturas, privacidad y comunidades cerradas. Confirmamos viabilidad por zona antes de reservar.", enQ: "Are there Santo Domingo areas where drone flight isn't allowed?", enA: "Yes. Areas near Las Américas airport, La Isabela and military zones are restricted. The Colonial Zone requires culture ministry coordination for some shots. The rest of the city we can fly respecting altitude limits, privacy and gated communities. We confirm viability per zone before booking." }
    ]
  },
  {
    id: "punta-cana",
    esName: "Punta Cana",
    enName: "Punta Cana",
    province: "La Altagracia",
    geo: { lat: 18.5601, lng: -68.3725 },
    esTagline: "Capital turística para resorts, bodas destino, villas y drone.",
    enTagline: "Tourism hub for resorts, destination weddings, villas and drone.",
    esDescription: "Punta Cana es el mercado más activo en bodas destino y propiedades premium. Cubrimos resorts (Hard Rock, Hyatt Ziva, Excellence, Iberostar), villas en Bávaro, Cap Cana y Cana Bay, más proyectos en preventa. Coordinamos permisos de hotel para drone y ofrecemos paquetes con traslado y alojamiento incluidos.",
    enDescription: "Punta Cana is the most active market for destination weddings and premium real estate. We cover resorts (Hard Rock, Hyatt Ziva, Excellence, Iberostar), villas in Bávaro, Cap Cana and Cana Bay, plus pre-construction projects. We coordinate hotel permits for drone and offer packages with travel and lodging included.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: [
      { esQ: "Cuánto cuesta agregar traslado a Punta Cana desde Santo Domingo?", esA: "El traslado redondo Santo Domingo-Punta Cana suma aproximadamente RD$8,000-12,000 a la sesión, dependiendo del paquete y si requiere pernocte. Para bodas destino o sesiones full-day el alojamiento se suma como línea separada. Sesiones que reservan con 30 días de anticipación suelen tener mejores tarifas combinadas.", enQ: "How much is Punta Cana transfer from Santo Domingo?", enA: "Round-trip Santo Domingo-Punta Cana transfer adds roughly RD$8,000-12,000 to the session depending on the package and whether overnight is required. For destination weddings or full-day shoots, lodging is a separate line item. Sessions booked 30+ days out often get better bundled rates." }
    ]
  },
  {
    id: "la-romana",
    esName: "La Romana",
    enName: "La Romana",
    province: "La Romana",
    geo: { lat: 18.4273, lng: -68.9728 },
    esTagline: "Casa de Campo, marinas y propiedades premium del este.",
    enTagline: "Casa de Campo, marinas and premium east-coast properties.",
    esDescription: "La Romana incluye Casa de Campo (uno de los mercados de villas más exclusivos del Caribe), Altos de Chavón, Marina Casa de Campo, Bayahibe y Saona. Trabajamos bodas destino en Casa de Campo, fotografía inmobiliaria de villas multi-millonarias, drone para resorts y proyectos en la zona. Tiempos de traslado desde Santo Domingo: ~1.5 horas.",
    enDescription: "La Romana includes Casa de Campo (one of the most exclusive villa markets in the Caribbean), Altos de Chavón, Marina Casa de Campo, Bayahibe and Saona. We work destination weddings in Casa de Campo, real estate photography of multi-million-dollar villas, drone for resorts and projects in the zone. Transfer time from Santo Domingo: ~1.5 hours.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "casa-de-campo",
    esName: "Casa de Campo",
    enName: "Casa de Campo",
    province: "La Romana",
    geo: { lat: 18.4081, lng: -68.9203 },
    esTagline: "Resort y mercado de villas premium en La Romana.",
    enTagline: "Resort and premium villa market in La Romana.",
    esDescription: "Casa de Campo es el resort y comunidad de villas más premium del Caribe. Trabajamos bodas en Altos de Chavón, fotografía inmobiliaria de villas con tarifas semanales de US$10,000+, drone para presentar propiedades a inversionistas internacionales. Tenemos pase de proveedor confirmado y conocemos las restricciones de la comunidad.",
    enDescription: "Casa de Campo is the most premium resort and villa community in the Caribbean. We work weddings at Altos de Chavón, real estate photography of villas with US$10,000+ weekly rentals, and drone to present properties to international investors. We hold a vendor pass and know the community's restrictions.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "cap-cana",
    esName: "Cap Cana",
    enName: "Cap Cana",
    province: "La Altagracia",
    geo: { lat: 18.4838, lng: -68.3589 },
    esTagline: "Comunidad cerrada premium con Punta Espada y marinas.",
    enTagline: "Premium gated community with Punta Espada and marinas.",
    esDescription: "Cap Cana combina golf premium (Punta Espada, Las Iguanas), villas frente a acantilado, marinas y un mercado fuerte de proyectos en preventa. Cubrimos bodas con drone, fotografía inmobiliaria de propiedades multi-millonarias y producción de campañas para desarrolladores. Tenemos los permisos para acceso de proveedores con anticipación.",
    enDescription: "Cap Cana combines premium golf (Punta Espada, Las Iguanas), cliffside villas, marinas and a strong pre-construction market. We cover weddings with drone, real estate photography of multi-million-dollar properties and campaign production for developers. We arrange vendor access permits in advance.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "bavaro",
    esName: "Bávaro",
    enName: "Bávaro",
    province: "La Altagracia",
    geo: { lat: 18.7056, lng: -68.4519 },
    esTagline: "Hoteles all-inclusive y zona de playa de Punta Cana.",
    enTagline: "All-inclusive hotels and Punta Cana's beach corridor.",
    esDescription: "Bávaro es el corredor de playa con la mayor concentración de hoteles all-inclusive en el Caribe. Trabajamos bodas destino en cadenas como Iberostar, Riu, Meliá, NH y Barceló, más drone para campañas turísticas y fotografía inmobiliaria de condominios y proyectos turísticos. La zona requiere coordinación con cada hotel.",
    enDescription: "Bávaro is the beach corridor with the highest concentration of all-inclusive resorts in the Caribbean. We work destination weddings at chains like Iberostar, Riu, Meliá, NH and Barceló, plus drone for tourism campaigns and real estate photography of condominiums and tourism projects. Requires per-hotel coordination.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "bayahibe",
    esName: "Bayahibe",
    enName: "Bayahibe",
    province: "La Altagracia",
    geo: { lat: 18.3667, lng: -68.8333 },
    esTagline: "Pueblo de pescadores con resorts y acceso a Saona.",
    enTagline: "Fishing village with resorts and access to Saona island.",
    esDescription: "Bayahibe combina pueblo de pescadores auténtico, resorts (Dreams, Be Live, Iberostar) y acceso por mar a Saona y Catalina. Trabajamos bodas en playa, drone para resorts y campañas turísticas, y fotografía editorial para marcas de hospitalidad. Tiempos de traslado desde Punta Cana: ~1 hora.",
    enDescription: "Bayahibe combines an authentic fishing village, resorts (Dreams, Be Live, Iberostar) and sea access to Saona and Catalina. We work beach weddings, drone for resorts and tourism campaigns, and editorial photography for hospitality brands. Transfer time from Punta Cana: ~1 hour.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "samana",
    esName: "Samaná",
    enName: "Samaná",
    province: "Samaná",
    geo: { lat: 19.2049, lng: -69.3367 },
    esTagline: "Península con Las Terrenas, Las Galeras y bodas destino.",
    enTagline: "Peninsula with Las Terrenas, Las Galeras and destination weddings.",
    esDescription: "Samaná es la península del noreste con las playas más dramáticas (Playa Rincón, Cayo Levantado), Las Terrenas para mercado europeo, Las Galeras para sesiones íntimas y avistamiento de ballenas en temporada. Trabajamos bodas destino con drone, fotografía editorial para hoteles boutique y campañas turísticas internacionales.",
    enDescription: "Samaná is the northeast peninsula with the most dramatic beaches (Playa Rincón, Cayo Levantado), Las Terrenas for the European market, Las Galeras for intimate sessions and seasonal whale watching. We work destination weddings with drone, editorial photography for boutique hotels and international tourism campaigns.",
    niches: ["bodas", "drone"],
    faq: []
  },
  {
    id: "las-terrenas",
    esName: "Las Terrenas",
    enName: "Las Terrenas",
    province: "Samaná",
    geo: { lat: 19.3139, lng: -69.5419 },
    esTagline: "Mercado europeo con bodas, real estate y drone.",
    enTagline: "European market with weddings, real estate and drone.",
    esDescription: "Las Terrenas es el destino preferido de la comunidad europea (francés, italiano, alemán) con villas y condominios premium frente al mar. Cubrimos bodas destino en pequeños hoteles boutique como El Mosquito Art Hotel y Eva Luna, fotografía inmobiliaria para el mercado europeo, drone aéreo y producción editorial.",
    enDescription: "Las Terrenas is the preferred destination for the European community (French, Italian, German) with premium beachfront villas and condominiums. We cover destination weddings at boutique hotels like El Mosquito Art Hotel and Eva Luna, real estate photography for the European market, aerial drone and editorial production.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "puerto-plata",
    esName: "Puerto Plata",
    enName: "Puerto Plata",
    province: "Puerto Plata",
    geo: { lat: 19.7935, lng: -70.6884 },
    esTagline: "Costa norte con Cabarete, Sosúa y resorts.",
    enTagline: "North coast with Cabarete, Sosúa and resorts.",
    esDescription: "Puerto Plata es la entrada a la costa norte: Playa Dorada, Cofresí, Maimón, más Cabarete (kitesurf y vida nocturna) y Sosúa (bahía y playa familiar). Trabajamos bodas, drone para resorts y deportes acuáticos, fotografía editorial de hoteles y eventos corporativos.",
    enDescription: "Puerto Plata is the entry to the north coast: Playa Dorada, Cofresí, Maimón, plus Cabarete (kitesurfing and nightlife) and Sosúa (bay and family beach). We work weddings, drone for resorts and water sports, editorial hotel photography and corporate events.",
    niches: ["bodas", "drone", "estudio"],
    faq: []
  },
  {
    id: "santiago",
    esName: "Santiago",
    enName: "Santiago",
    province: "Santiago",
    geo: { lat: 19.4517, lng: -70.6970 },
    esTagline: "Segunda ciudad del país con corporativo, retratos y eventos.",
    enTagline: "Second-largest city with corporate, portraits and events.",
    esDescription: "Santiago es el centro económico del Cibao y la segunda ciudad del país. Trabajamos retratos corporativos para LinkedIn de profesionales y ejecutivos, fotografía inmobiliaria de proyectos en Cerros de Gurabo y zonas premium, eventos corporativos y drone para construcción y zonas industriales.",
    enDescription: "Santiago is the economic center of the Cibao region and the country's second city. We work corporate portraits for LinkedIn of professionals and executives, real estate photography of projects in Cerros de Gurabo and premium zones, corporate events and drone for construction and industrial zones.",
    niches: ["inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "jarabacoa",
    esName: "Jarabacoa",
    enName: "Jarabacoa",
    province: "La Vega",
    geo: { lat: 19.1186, lng: -70.6336 },
    esTagline: "Montaña con bodas en finca, drone y retratos editoriales.",
    enTagline: "Mountain region with finca weddings, drone and editorial portraits.",
    esDescription: "Jarabacoa es la zona montaña más accesible desde Santiago y Santo Domingo. Trabajamos bodas en fincas privadas (Rancho Baiguate, Rancho La Cumbre), drone aéreo para mostrar la montaña y ríos, fotografía inmobiliaria de cabañas y propiedades de descanso, y sesiones editoriales con clima fresco.",
    enDescription: "Jarabacoa is the most accessible mountain region from Santiago and Santo Domingo. We work weddings at private estates (Rancho Baiguate, Rancho La Cumbre), aerial drone of the mountains and rivers, real estate photography of cabins and weekend retreats, and editorial sessions in cool weather.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "cabarete",
    esName: "Cabarete",
    enName: "Cabarete",
    province: "Puerto Plata",
    geo: { lat: 19.7611, lng: -70.4197 },
    esTagline: "Capital del kitesurf con bodas en playa y drone deportivo.",
    enTagline: "Kitesurf capital with beach weddings and sports drone.",
    esDescription: "Cabarete es la capital del kitesurf y windsurf en el Caribe, con una vida nocturna activa, hoteles boutique y un mercado fuerte para sesiones editoriales. Trabajamos bodas en playa, drone para sports y deportes acuáticos, fotografía editorial para marcas de moda y deportes, y campañas turísticas internacionales.",
    enDescription: "Cabarete is the kitesurf and windsurf capital of the Caribbean, with active nightlife, boutique hotels and a strong market for editorial sessions. We work beach weddings, drone for sports and water activities, editorial photography for fashion and sports brands, and international tourism campaigns.",
    niches: ["bodas", "drone"],
    faq: []
  },
  {
    id: "sosua",
    esName: "Sosúa",
    enName: "Sosúa",
    province: "Puerto Plata",
    geo: { lat: 19.7508, lng: -70.5169 },
    esTagline: "Bahía familiar con villas, hoteles boutique y drone.",
    enTagline: "Family bay with villas, boutique hotels and drone.",
    esDescription: "Sosúa tiene una de las bahías más pintorescas del Caribe, con playas de aguas tranquilas ideales para familias. Trabajamos bodas más íntimas, fotografía inmobiliaria de villas frente al mar (mercado fuerte de canadienses y europeos), drone aéreo de la bahía y editorial para hoteles boutique.",
    enDescription: "Sosúa has one of the most picturesque bays in the Caribbean, with calm-water beaches ideal for families. We work more intimate weddings, real estate photography of beachfront villas (strong Canadian and European market), aerial drone of the bay and editorial for boutique hotels.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "higuey",
    esName: "Higüey",
    enName: "Higüey",
    province: "La Altagracia",
    geo: { lat: 18.6173, lng: -68.7065 },
    esTagline: "Centro religioso y comercial cerca de Punta Cana.",
    enTagline: "Religious and commercial hub near Punta Cana.",
    esDescription: "Higüey es el centro religioso y comercial de La Altagracia, conocido por la Basílica de Higüey. Trabajamos bodas religiosas tradicionales en la Basílica, fotografía inmobiliaria de propiedades en la zona, drone para hoteles y proyectos cercanos a Punta Cana, y eventos corporativos del sector turístico.",
    enDescription: "Higüey is the religious and commercial center of La Altagracia, known for the Basílica of Higüey. We work traditional religious weddings at the Basílica, real estate photography in the area, drone for hotels and projects near Punta Cana, and corporate events from the tourism sector.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "boca-chica",
    esName: "Boca Chica",
    enName: "Boca Chica",
    province: "Santo Domingo",
    geo: { lat: 18.4544, lng: -69.6075 },
    esTagline: "Playa familiar cerca del aeropuerto Las Américas.",
    enTagline: "Family beach near Las Américas airport.",
    esDescription: "Boca Chica está a 30 minutos del aeropuerto Las Américas y es la playa más accesible desde Santo Domingo. Trabajamos bodas más accesibles en hoteles como Don Juan Beach Resort, fotografía inmobiliaria de villas frente al mar y condominios, drone con permisos por la cercanía al aeropuerto.",
    enDescription: "Boca Chica is 30 minutes from Las Américas airport and the most accessible beach from Santo Domingo. We work more affordable weddings at hotels like Don Juan Beach Resort, real estate photography of beachfront villas and condominiums, drone with permits due to airport proximity.",
    niches: ["bodas", "inmobiliaria"],
    faq: []
  },
  {
    id: "bonao",
    esName: "Bonao",
    enName: "Bonao",
    province: "Monseñor Nouel",
    geo: { lat: 18.9367, lng: -70.4117 },
    esTagline: "Centro del país con corporativo, retratos y eventos.",
    enTagline: "Country's geographic center with corporate, portraits and events.",
    esDescription: "Bonao es la ciudad central del país, equidistante entre Santo Domingo y Santiago (~1 hora de cada una). Trabajamos retratos corporativos para profesionales del sector minero, agroindustrial y manufactura, fotografía inmobiliaria de proyectos residenciales y eventos corporativos. Cubrimos sesiones en estudio coordinando hospedaje del equipo cuando es necesario.",
    enDescription: "Bonao is the country's central city, equidistant between Santo Domingo and Santiago (~1 hour from each). We work corporate portraits for mining, agribusiness and manufacturing professionals, real estate photography of residential projects and corporate events. We cover studio sessions coordinating team lodging when needed.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "la-vega",
    esName: "La Vega",
    enName: "La Vega",
    province: "La Vega",
    geo: { lat: 19.2236, lng: -70.5269 },
    esTagline: "Ciudad del Carnaval con bodas, eventos y retratos.",
    enTagline: "Carnival city with weddings, events and portraits.",
    esDescription: "La Vega es famosa por el Carnaval Vegano (febrero) y es una ciudad activa en el Cibao. Cubrimos bodas con tradición católica, eventos corporativos del sector ganadero y agroindustrial, retratos profesionales y editoriales relacionados al Carnaval, además de fotografía inmobiliaria de proyectos en Cerros de Gurabo y zonas residenciales premium.",
    enDescription: "La Vega is famous for the Carnaval Vegano (February) and is an active city in the Cibao region. We cover Catholic-tradition weddings, corporate events from livestock and agribusiness sectors, professional and Carnival-related editorial portraits, plus real estate photography in Cerros de Gurabo and premium residential zones.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "moca",
    esName: "Moca",
    enName: "Moca",
    province: "Espaillat",
    geo: { lat: 19.3942, lng: -70.5253 },
    esTagline: "Centro del Cibao con corporativo, fincas y eventos.",
    enTagline: "Cibao region hub with corporate, country estates and events.",
    esDescription: "Moca es el corazón del Cibao y un centro fuerte para sector cafetalero, agroindustrial y residencial premium. Cubrimos retratos corporativos para profesionales y empresarios, eventos corporativos, fotografía de fincas y propiedades de descanso, bodas tradicionales en iglesias del centro histórico y drone aéreo de proyectos.",
    enDescription: "Moca is the heart of the Cibao and a strong hub for coffee, agribusiness and premium residential sectors. We cover corporate portraits for professionals and entrepreneurs, corporate events, photography of country estates and weekend properties, traditional weddings at historic-center churches and aerial drone of projects.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "san-pedro-de-macoris",
    esName: "San Pedro de Macorís",
    enName: "San Pedro de Macorís",
    province: "San Pedro de Macorís",
    geo: { lat: 18.4539, lng: -69.3081 },
    esTagline: "Puerto industrial con corporativo, eventos y bodas.",
    enTagline: "Industrial port with corporate, events and weddings.",
    esDescription: "San Pedro de Macorís es un centro industrial fuerte (zona franca, sector eléctrico, agroindustria) y a 1 hora de Santo Domingo. Trabajamos retratos corporativos para empresas industriales, eventos corporativos, fotografía inmobiliaria, bodas en iglesias del centro y drone para proyectos industriales y residenciales.",
    enDescription: "San Pedro de Macorís is a strong industrial center (free trade zone, electrical sector, agribusiness) and 1 hour from Santo Domingo. We work corporate portraits for industrial companies, corporate events, real estate photography, weddings at downtown churches and drone for industrial and residential projects.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "san-cristobal",
    esName: "San Cristóbal",
    enName: "San Cristóbal",
    province: "San Cristóbal",
    geo: { lat: 18.4172, lng: -70.1075 },
    esTagline: "Provincia cercana a Santo Domingo con bodas y eventos.",
    enTagline: "Province near Santo Domingo with weddings and events.",
    esDescription: "San Cristóbal está a 30 minutos de Santo Domingo y combina mercado urbano con turismo de playa (Najayo, Palenque). Cubrimos bodas en hoteles de playa cercanos, eventos corporativos del sector industrial y de cemento, retratos corporativos para empresas locales y fotografía inmobiliaria de proyectos residenciales en zonas como Hato Damas y Madre Vieja.",
    enDescription: "San Cristóbal is 30 minutes from Santo Domingo and combines urban market with beach tourism (Najayo, Palenque). We cover weddings at nearby beach hotels, corporate events from the industrial and cement sectors, corporate portraits for local businesses and real estate photography of residential projects in zones like Hato Damas and Madre Vieja.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "bani",
    esName: "Baní",
    enName: "Baní",
    province: "Peravia",
    geo: { lat: 18.2806, lng: -70.3306 },
    esTagline: "Ciudad sureña con bodas, agro y retratos.",
    enTagline: "Southern city with weddings, agriculture and portraits.",
    esDescription: "Baní es la capital de Peravia, conocida por su producción de mango y sal de Las Salinas. Trabajamos bodas tradicionales del sur, eventos corporativos del sector agroindustrial, retratos corporativos y profesionales, fotografía inmobiliaria de proyectos residenciales y drone para playa Las Salinas y dunas. A 1 hora de Santo Domingo.",
    enDescription: "Baní is the capital of Peravia province, known for its mango production and Las Salinas salt flats. We work traditional southern weddings, agribusiness corporate events, professional and corporate portraits, real estate photography of residential projects and drone for Las Salinas beach and dunes. 1 hour from Santo Domingo.",
    niches: ["bodas", "inmobiliaria", "drone", "estudio"],
    faq: []
  },
  {
    id: "constanza",
    esName: "Constanza",
    enName: "Constanza",
    province: "La Vega",
    geo: { lat: 18.9117, lng: -70.7458 },
    esTagline: "Valle de montaña con bodas en finca y drone.",
    enTagline: "Mountain valley with farm weddings and aerial drone.",
    esDescription: "Constanza es el valle más alto del Caribe (1,200m de altitud), conocido por su clima fresco, fincas de vegetales y flores, y paisajes montañosos. Trabajamos bodas en fincas privadas, drone aéreo cinematográfico de los valles, fotografía editorial con clima fresco, y campañas turísticas para hoteles de montaña.",
    enDescription: "Constanza is the highest valley in the Caribbean (1,200m elevation), known for its cool climate, vegetable and flower farms, and mountain landscapes. We work weddings at private estates, cinematic aerial drone of the valleys, editorial photography with cool weather, and tourism campaigns for mountain hotels.",
    niches: ["bodas", "drone"],
    faq: []
  }
];

/* ============ PACKAGES (12) - sourced from fotografosantodomingo.com scrape ============ */

export const packages: SharedPackage[] = [
  // BODAS
  { id: "boda-cobertura-completa", niche: "bodas", esName: "Cobertura completa de boda", enName: "Full Wedding Coverage", priceDop: 59600, priceDisplay: "Desde RD$ 59,600 / US$ 1,000", bestFor: { es: "Bodas con ceremonia, sesión de pareja y recepción.", en: "Weddings with ceremony, couple session and reception." }, includes: { es: ["Cobertura completa del día", "Sesión de compromiso incluida", "Álbum profesional + galería online"], en: ["Full-day coverage", "Engagement session included", "Professional album + online gallery"] }, durationMinutes: 240, source: "fotografosantodomingo.com" },
  { id: "boda-engagement", niche: "bodas", esName: "Sesión de compromiso", enName: "Engagement Session", priceDop: 10700, priceDisplay: "Desde RD$ 10,700 / US$ 180", bestFor: { es: "Parejas que quieren una sesión preboda en locación a elección.", en: "Couples who want a pre-wedding session at a chosen location." }, includes: { es: ["Sesión en locación a elección", "40 fotos editadas en alta resolución", "Galería online privada"], en: ["Session at the location of your choice", "40 high-resolution edited photos", "Private online gallery"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "boda-propuesta", niche: "bodas", esName: "Fotografía de propuesta", enName: "Proposal Photography", priceDop: 14900, priceDisplay: "Desde RD$ 14,900 / US$ 250", bestFor: { es: "Pedida de mano sorpresa con fotógrafo oculto.", en: "Surprise proposals with a hidden photographer." }, includes: { es: ["Modo ninja 100% oculto", "Teleobjetivo 400-600 mm", "Galería esa misma noche"], en: ["100% hidden ninja mode", "400-600 mm telephoto lens", "Gallery delivered same night"] }, durationMinutes: 120, source: "fotografosantodomingo.com" },
  // INMOBILIARIA
  { id: "inmo-bienes-raices", niche: "inmobiliaria", esName: "Bienes Raíces", enName: "Real Estate Photography", priceDop: 8940, priceDisplay: "Desde RD$ 8,940 / US$ 150", bestFor: { es: "Apartamentos, casas y propiedades para portales y MLS.", en: "Apartments, homes and properties for portals and MLS." }, includes: { es: ["Interior y exterior", "Hasta 3 propiedades", "Opción con dron disponible"], en: ["Interior and exterior", "Up to 3 properties", "Drone option available"] }, durationMinutes: 120, source: "fotografosantodomingo.com" },
  { id: "inmo-comercial", niche: "inmobiliaria", esName: "Fotografía comercial", enName: "Commercial Photography", priceDop: 14900, priceDisplay: "Desde RD$ 14,900 / US$ 250", bestFor: { es: "Productos, hoteles, restaurantes y marcas con derechos comerciales.", en: "Products, hotels, restaurants and brands with commercial rights." }, includes: { es: ["Productos, hoteles, restaurantes", "Derechos de uso comercial", "Edición profesional"], en: ["Products, hotels, restaurants", "Commercial usage rights", "Professional editing"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "inmo-video-produccion", niche: "inmobiliaria", esName: "Producción de video", enName: "Video Production", priceDop: 47700, priceDisplay: "Desde RD$ 47,700 / US$ 800", bestFor: { es: "Recorridos de propiedad, lanzamientos y campañas de marca.", en: "Property walkthroughs, launches and brand campaigns." }, includes: { es: ["Producción 4K", "Edición profesional", "Música con licencia"], en: ["4K production", "Professional editing", "Licensed music"] }, durationMinutes: 240, source: "fotografosantodomingo.com" },
  // DRONE
  { id: "drone-aereo", niche: "drone", esName: "Dron aéreo", enName: "Aerial Drone", priceDop: 9540, priceDisplay: "Desde RD$ 9,540 / US$ 160", bestFor: { es: "Villas, solares, proyectos, resorts y propiedades con vista.", en: "Villas, lots, developments, resorts and properties with views." }, includes: { es: ["Piloto DJI Mavic 3 Pro certificado", "Foto y video aéreo en 4K", "Tomas de ubicación y contexto", "Entrega en 48h"], en: ["Certified DJI Mavic 3 Pro pilot", "4K aerial photo and video", "Location and context shots", "48h delivery"] }, durationMinutes: 90, source: "fotografosantodomingo.com" },
  // ESTUDIO
  { id: "estudio-retratos", niche: "estudio", esName: "Retratos", enName: "Portraits", priceDop: 5960, priceDisplay: "Desde RD$ 5,960 / US$ 100", bestFor: { es: "Headshots, LinkedIn, books de actor y modelo.", en: "Headshots, LinkedIn, actor and model books." }, includes: { es: ["Sesión en locación o estudio", "15 fotos editadas en alta resolución", "Entrega en 48h"], en: ["Studio or location session", "15 high-resolution edited photos", "48h delivery"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "estudio-corporativo", niche: "estudio", esName: "Retratos corporativos", enName: "Corporate Portraits", priceDop: 10700, priceDisplay: "Desde RD$ 10,700 / US$ 180", bestFor: { es: "Equipos ejecutivos y headshots para empresas.", en: "Executive teams and corporate headshots." }, includes: { es: ["Múltiples looks y fondos", "Uso comercial autorizado", "Entrega en 24-48h"], en: ["Multiple looks and backdrops", "Authorized commercial use", "24-48h delivery"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "estudio-comida", niche: "estudio", esName: "Alimentos y bebidas", enName: "Food and Beverage", priceDop: 14900, priceDisplay: "Desde RD$ 14,900 / US$ 250", bestFor: { es: "Restaurantes, marcas de bebida y catálogos gastronómicos.", en: "Restaurants, beverage brands and food catalogues." }, includes: { es: ["Sesión en estudio o locación", "30 imágenes editadas", "Apta para redes y menús"], en: ["Studio or location session", "30 edited images", "Optimized for social and menus"] }, durationMinutes: 120, source: "fotografosantodomingo.com" },
  { id: "estudio-maternidad", niche: "estudio", esName: "Maternidad", enName: "Maternity", priceDop: 8940, priceDisplay: "Desde RD$ 8,940 / US$ 150", bestFor: { es: "Sesión íntima de embarazo, idealmente semanas 30-36.", en: "Intimate pregnancy session, ideally weeks 30-36." }, includes: { es: ["Sesión íntima en locación", "30 fotos editadas", "Galería privada"], en: ["Intimate location session", "30 edited photos", "Private gallery"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "estudio-boudoir", niche: "estudio", esName: "Sesión boudoir", enName: "Boudoir Session", priceDop: 23800, priceDisplay: "Desde RD$ 23,800 / US$ 400", bestFor: { es: "Sesión empoderamiento femenino o regalo de aniversario.", en: "Female empowerment or anniversary gift session." }, includes: { es: ["Estudio privado o habitación de hotel de lujo", "Iluminación profesional + dirección experta", "Galería privada en 48-72h"], en: ["Private studio or luxury hotel room", "Professional lighting + expert direction", "Private gallery in 48-72h"] }, durationMinutes: 120, source: "fotografosantodomingo.com" },
  { id: "estudio-familia", niche: "estudio", esName: "Sesión familiar", enName: "Family Session", priceDop: 8940, priceDisplay: "Desde RD$ 8,940 / US$ 150", bestFor: { es: "Familias hasta 6 personas con niños o bebés.", en: "Families up to 6 people with kids or babies." }, includes: { es: ["Sesión en estudio o exterior", "20 fotos editadas", "Galería privada online", "Entrega en 5-7 días"], en: ["Studio or outdoor session", "20 edited photos", "Private online gallery", "5-7 day delivery"] }, durationMinutes: 60, source: "fotografosantodomingo.com" },
  { id: "estudio-newborn", niche: "estudio", esName: "Sesión newborn", enName: "Newborn Session", priceDop: 11920, priceDisplay: "Desde RD$ 11,920 / US$ 200", bestFor: { es: "Bebés de 5 a 21 días con setup de estudio especializado.", en: "Babies 5 to 21 days old with specialized studio setup." }, includes: { es: ["Estudio climatizado y privado", "Props y mantas incluidas", "25 fotos editadas suaves", "Galería en 7 días"], en: ["Climate-controlled private studio", "Props and blankets included", "25 softly edited photos", "Gallery in 7 days"] }, durationMinutes: 180, source: "fotografosantodomingo.com" },
  { id: "estudio-headshot-team", niche: "estudio", esName: "Headshots de equipo", enName: "Team Headshots", priceDop: 17880, priceDisplay: "Desde RD$ 17,880 / US$ 300", bestFor: { es: "Equipos de 5-15 personas para LinkedIn y web corporativa.", en: "Teams of 5-15 people for LinkedIn and corporate web." }, includes: { es: ["Setup en oficina o estudio", "Mismo fondo y luz para todos", "3 fotos editadas por persona", "Derechos de uso comercial"], en: ["Office or studio setup", "Same backdrop and light for everyone", "3 edited photos per person", "Commercial usage rights"] }, durationMinutes: 180, source: "fotografosantodomingo.com" },
  { id: "estudio-fashion-editorial", niche: "estudio", esName: "Editorial de moda", enName: "Fashion Editorial", priceDop: 35760, priceDisplay: "Desde RD$ 35,760 / US$ 600", bestFor: { es: "Marcas de moda, agencias de modelos y proyectos editoriales.", en: "Fashion brands, modeling agencies and editorial projects." }, includes: { es: ["Producción completa", "Múltiples looks y fondos", "50+ fotos editadas", "Cesión de derechos para uso editorial y comercial"], en: ["Full production", "Multiple looks and backdrops", "50+ edited photos", "Editorial and commercial usage rights transfer"] }, durationMinutes: 240, source: "fotografosantodomingo.com" },
  // ESTUDIO end
];

/* ============ FAQS (24 = 8 global + 4 per niche) ============ */

export const faqs: NetworkFaq[] = [
  // GLOBAL (8)
  { id: "global-booking", scope: "global", esQ: "Cómo reservo una sesión?", esA: "Escríbenos por WhatsApp al +1 809 720 9547 con la fecha tentativa, ubicación y servicio que necesitas. Te enviamos disponibilidad en menos de 24 horas, propuesta detallada y un acuerdo simple. La reserva se confirma con un depósito del 50% (transferencia local o tarjeta) y el saldo se paga el día del servicio.", enQ: "How do I book a session?", enA: "Message us on WhatsApp at +1 809 720 9547 with the tentative date, location and service you need. We send availability in under 24 hours, a detailed proposal and a simple agreement. Booking is confirmed with a 50% deposit (local transfer or card) and the balance is due on the day of service." },
  { id: "global-payment", scope: "global", esQ: "Qué métodos de pago aceptan?", esA: "Aceptamos transferencia bancaria local (BHD, Banreservas, Popular, Scotiabank), tarjetas de crédito y débito (Visa, Mastercard, AmEx) y para clientes internacionales transferencia Wise o Zelle. Para bodas y proyectos grandes se puede dividir el pago en 2-3 cuotas con cronograma firmado.", enQ: "What payment methods do you accept?", enA: "We accept local bank transfer (BHD, Banreservas, Popular, Scotiabank), credit and debit cards (Visa, Mastercard, AmEx) and for international clients Wise or Zelle. For weddings and larger projects we can split payment into 2-3 installments with a signed schedule." },
  { id: "global-deposit", scope: "global", esQ: "Cuánto depósito se paga al reservar?", esA: "El depósito estándar es del 50% del valor total para bloquear la fecha. El 50% restante se paga el día de la sesión o, en bodas, antes del evento. Para servicios recurrentes (drone mensual de obra, eventos corporativos repetidos) ofrecemos contratos con pago a 30 días contra factura.", enQ: "How much deposit is required?", enA: "Standard deposit is 50% of the total to lock the date. The remaining 50% is due on the session day or, for weddings, before the event. For recurring services (monthly construction drone, repeated corporate events) we offer 30-day net contracts against invoice." },
  { id: "global-cancellation", scope: "global", esQ: "Qué pasa si tengo que cancelar?", esA: "Cancelaciones con más de 14 días de anticipación: reembolso completo del depósito. Entre 14 y 7 días: 50% del depósito reembolsable. Menos de 7 días: el depósito se aplica como crédito hacia una nueva fecha dentro de 6 meses. Para bodas la política es más estricta y se acuerda en el contrato.", enQ: "What if I need to cancel?", enA: "Cancellations more than 14 days out: full deposit refund. Between 14 and 7 days: 50% of the deposit is refundable. Less than 7 days: deposit is applied as credit toward a new date within 6 months. For weddings the policy is stricter and is agreed in the contract." },
  { id: "global-weather", scope: "global", esQ: "Qué pasa si llueve el día de la sesión?", esA: "Para sesiones exteriores monitoreamos el clima 48 horas antes. Si las probabilidades de lluvia exceden el 60% reagendamos sin costo adicional. Para bodas y eventos donde reagendar no es posible, ajustamos plan B (locaciones cubiertas, ventanas de luz) y siempre tenemos equipo backup para clima.", enQ: "What if it rains?", enA: "For outdoor sessions we monitor weather 48 hours ahead. If rain probability exceeds 60% we reschedule at no extra cost. For weddings and events where rescheduling isn't possible we shift to plan B (covered locations, light windows) and always carry backup gear for weather." },
  { id: "global-delivery", scope: "global", esQ: "En cuánto tiempo se entregan las fotos editadas?", esA: "Los tiempos varían por servicio: inmobiliaria 48-72 horas, retratos 5-7 días, eventos corporativos 7-10 días, bodas 4-6 semanas para galería completa con sneak-peek en 7 días. Servicios express con entrega en 24h están disponibles con un costo adicional según el tipo de proyecto.", enQ: "How long does delivery take?", enA: "Times vary by service: real estate 48-72 hours, portraits 5-7 days, corporate events 7-10 days, weddings 4-6 weeks for the full gallery with a sneak-peek in 7 days. 24-hour express delivery is available for an extra fee depending on the project type." },
  { id: "global-team", scope: "global", esQ: "Quién dispara mi sesión?", esA: "Babula Shots opera con un equipo principal de fotógrafos certificados y pilotos de drone con licencia IDAC. Para cada proyecto asignamos al fotógrafo con más experiencia en ese tipo de sesión (bodas, inmobiliaria, retratos, drone). Antes de la sesión conoces el nombre del fotógrafo asignado y puedes ver su portafolio.", enQ: "Who shoots my session?", enA: "Babula Shots operates with a core team of certified photographers and IDAC-licensed drone pilots. For each project we assign the photographer with the most experience in that session type (weddings, real estate, portraits, drone). Before the session you know the assigned photographer's name and can review their portfolio." },
  { id: "global-equipment", scope: "global", esQ: "Qué equipo utilizan?", esA: "Cámaras Sony Alpha (A7 IV, A7R V), lentes Sony G Master fijos y zoom (24-70 f2.8, 70-200 f2.8, 35 f1.4, 85 f1.4), iluminación Profoto y Godox para estudio y eventos, drones DJI Mavic 3 Pro y Mavic 3 Cine, gimbal RS3 Pro para video. Todo el equipo tiene backup en cada sesión para evitar fallos.", enQ: "What equipment do you use?", enA: "Sony Alpha cameras (A7 IV, A7R V), Sony G Master prime and zoom lenses (24-70 f2.8, 70-200 f2.8, 35 f1.4, 85 f1.4), Profoto and Godox lighting for studio and events, DJI Mavic 3 Pro and Mavic 3 Cine drones, RS3 Pro gimbal for video. All gear has backups on every shoot to prevent failures." },

  // BODAS (4)
  { id: "bodas-album-included", scope: "bodas", esQ: "El álbum impreso está incluido en el paquete?", esA: "El álbum impreso es un add-on que se puede sumar a cualquier paquete de boda. El paquete Cobertura Completa lo incluye por defecto en formato 25x25cm. Para upgrades a 30x30cm o ediciones de colección (papel artesanal, encuadernación personalizada) cotizamos al firmar el contrato según el diseño final.", enQ: "Is the printed album included?", enA: "The printed album is an add-on you can add to any wedding package. The Full Coverage package includes it by default in 25x25cm format. Upgrades to 30x30cm or collection editions (handcrafted paper, custom binding) are quoted at contract signing based on the final design." },
  { id: "bodas-second-shooter", scope: "bodas", esQ: "Hay segundo fotógrafo en la cobertura?", esA: "Para bodas con más de 100 invitados o ceremonias en lugares amplios incluimos un segundo fotógrafo sin costo adicional. Para bodas más íntimas se puede agregar como add-on. El segundo fotógrafo cubre ángulos paralelos (reacción del novio mientras la novia llega, mesa de invitados durante el primer baile).", enQ: "Is there a second photographer?", enA: "For weddings with more than 100 guests or large ceremony venues we include a second photographer at no extra cost. For more intimate weddings it can be added as an add-on. The second shooter covers parallel angles (groom's reaction as the bride walks in, guest table during the first dance)." },
  { id: "bodas-coverage-areas", scope: "bodas", esQ: "Qué áreas cubren para bodas?", esA: "Cubrimos toda Republica Dominicana. Sin recargo de traslado para bodas en Santo Domingo y Distrito Nacional. Con tarifa fija para Punta Cana, La Romana, Casa de Campo y Bávaro. Para Las Terrenas, Samana, Cabarete o Jarabacoa cotizamos travel fee que incluye transporte, hospedaje y comida del equipo.", enQ: "What areas do you cover for weddings?", enA: "We cover the entire Dominican Republic. No travel surcharge for weddings in Santo Domingo and Distrito Nacional. Flat travel fee for Punta Cana, La Romana, Casa de Campo and Bávaro. For Las Terrenas, Samana, Cabarete or Jarabacoa we quote a travel fee covering transport, lodging and team meals." },
  { id: "bodas-photo-video-bundle", scope: "bodas", esQ: "Tienen paquete combinado de foto y video?", esA: "Sí. El paquete combinado incluye equipo separado de foto y video que se coordina antes del evento para no chocar en momentos clave. El descuento por reservar ambos servicios juntos es de 15% sobre el precio individual. Cobertura típica: 8 horas con segundo fotógrafo y video editor de 3-5 minutos.", enQ: "Do you have a photo + video bundle?", enA: "Yes. The bundle includes separate photo and video teams that coordinate before the event so they never clash on key moments. Booking both together gets a 15% discount over individual pricing. Typical coverage: 8 hours with second shooter and a 3-5 minute edited video." },

  // INMOBILIARIA (4)
  { id: "inmo-multiple-properties", scope: "inmobiliaria", esQ: "Pueden fotografiar varias propiedades el mismo día?", esA: "Sí. Ofrecemos descuentos por volumen cuando son 3 o más propiedades el mismo día en zonas cercanas (Santo Domingo, Punta Cana, Santiago). Coordinamos rutas para minimizar tiempo de traslado y entregamos las galerías separadas por SKU para que sean fáciles de cargar a portales y MLS.", enQ: "Can you photograph multiple properties in one day?", enA: "Yes. We offer volume discounts for 3 or more properties on the same day in close zones (Santo Domingo, Punta Cana, Santiago). We coordinate routes to minimize transfer time and deliver galleries separated by SKU so they're easy to upload to portals and MLS." },
  { id: "inmo-coverage-area", scope: "inmobiliaria", esQ: "Qué áreas cubren para fotografía inmobiliaria?", esA: "Cubrimos toda Republica Dominicana. Sin recargo de traslado: Santo Domingo y Distrito Nacional. Con recargo flat: Punta Cana, La Romana, Casa de Campo, Santiago, Bávaro. Otras zonas (Samana, Las Terrenas, Cabarete, Jarabacoa, Constanza, Barahona) se cotizan por proyecto incluyendo traslado y, si aplica, alojamiento.", enQ: "What areas do you cover for real estate?", enA: "We cover all of the Dominican Republic. No transfer fee: Santo Domingo and Distrito Nacional. Flat fee: Punta Cana, La Romana, Casa de Campo, Santiago, Bávaro. Other zones (Samana, Las Terrenas, Cabarete, Jarabacoa, Constanza, Barahona) quoted per project including transfer and, if applicable, lodging." },
  { id: "inmo-mls-portals", scope: "inmobiliaria", esQ: "Las fotos están listas para Point2Homes, MLS y Inmobilia?", esA: "Sí. Entregamos archivos en las dimensiones y formatos que cada portal premia: 1080-1280px de ancho, formato horizontal 4:3, sin marcas de agua. Para MLS entregamos también la versión print-ready. Los nombres de archivo siguen un esquema SKU para que la carga masiva sea sencilla.", enQ: "Are photos ready for Point2Homes, MLS and Inmobilia?", enA: "Yes. We deliver files in the dimensions and formats each portal rewards: 1080-1280px wide, 4:3 horizontal, no watermarks. For MLS we also deliver a print-ready version. File names follow an SKU scheme so bulk uploads are simple." },
  { id: "inmo-empty-vs-staged", scope: "inmobiliaria", esQ: "Conviene fotografiar la propiedad vacía o amueblada?", esA: "Las propiedades amuebladas y bien presentadas convierten 40-60% más que las vacías. Si la propiedad está vacía y no hay presupuesto para staging real, ofrecemos virtual staging digital donde añadimos muebles y decoración a las fotos terminadas. Cuesta 30-40% menos que el staging físico y tarda 5-7 días.", enQ: "Empty vs staged property?", enA: "Furnished, well-presented properties convert 40-60% better than empty ones. If the property is empty and there's no budget for real staging, we offer virtual staging where we add furniture and decor to finished photos digitally. It costs 30-40% less than physical staging and takes 5-7 days." },

  // DRONE (4)
  { id: "drone-permits", scope: "drone", esQ: "Qué permisos necesitan para volar drone en RD?", esA: "El piloto debe estar certificado por el IDAC (Instituto Dominicano de Aviación Civil) y operar bajo el reglamento RAD-21. Para vuelos comerciales en zonas no restringidas no se requiere permiso adicional. Para zonas cercanas a aeropuertos, militares o de patrimonio cultural se solicita autorización previa al IDAC.", enQ: "What permits are needed to fly drone in DR?", enA: "The pilot must be IDAC-certified (Dominican Civil Aviation Institute) and operate under RAD-21 regulations. For commercial flights in non-restricted zones no additional permit is needed. For zones near airports, military or heritage sites, prior IDAC authorization is requested." },
  { id: "drone-weather-policy", scope: "drone", esQ: "Qué pasa si hay viento o lluvia el día del vuelo?", esA: "Vientos sostenidos arriba de 35 km/h o lluvia activa hacen que el vuelo no sea seguro. Monitoreamos el clima 24 horas antes y la mañana del vuelo. Si las condiciones no son aptas, reagendamos sin costo. Para proyectos con plazo crítico (pre-venta inmobiliaria con fecha de lanzamiento) tenemos cláusulas de plan B.", enQ: "What if there's wind or rain on flight day?", enA: "Sustained winds above 35 km/h or active rain make flight unsafe. We monitor weather 24 hours before and the morning of. If conditions aren't suitable we reschedule at no cost. For projects with critical deadlines (pre-sale real estate with launch date) we have plan B clauses." },
  { id: "drone-equipment", scope: "drone", esQ: "Qué drones utilizan?", esA: "DJI Mavic 3 Pro (sensor 4/3, foto 20MP, video 4K HDR) para uso general. DJI Mavic 3 Cine (codec ProRes, sensor 4/3) para producción comercial premium. Tenemos backup de batería extendido y dos drones por sesión. Para proyectos especiales (mapeo, inspección, ortomosaicos) coordinamos equipo adicional.", enQ: "What drones do you use?", enA: "DJI Mavic 3 Pro (4/3 sensor, 20MP photo, 4K HDR video) for general use. DJI Mavic 3 Cine (ProRes codec, 4/3 sensor) for premium commercial production. We carry extended battery backup and two drones per session. For special projects (mapping, inspection, orthomosaics) we coordinate additional gear." },
  { id: "drone-insurance", scope: "drone", esQ: "El piloto tiene seguro de responsabilidad civil?", esA: "Sí. Operamos con seguro de responsabilidad civil que cubre hasta US$1,000,000 por incidente. Para proyectos en obra, resorts o eventos corporativos se entrega copia del seguro al cliente o al venue como parte de los requisitos previos al vuelo. Esto es estándar en nuestra operación profesional.", enQ: "Does the pilot have liability insurance?", enA: "Yes. We operate with liability insurance covering up to US$1,000,000 per incident. For construction, resort or corporate event projects, a copy of the insurance is provided to the client or venue as part of the pre-flight requirements. This is standard in our professional operation." },

  // ESTUDIO (4)
  { id: "estudio-location", scope: "estudio", esQ: "Dónde queda el estudio?", esA: "El estudio Babula Shots está en Santo Domingo, en una ubicación privada con parqueo fácil de acceso. La dirección exacta se comparte al confirmar la reserva por temas de seguridad y privacidad de los clientes. Es un espacio profesional con varios fondos, iluminación controlada, área de cambio y wifi para los acompañantes.", enQ: "Where is the studio located?", enA: "The Babula Shots studio is in Santo Domingo, in a private location with easy parking. The exact address is shared at booking confirmation for client security and privacy. It's a professional space with multiple backdrops, controlled lighting, a change area and wifi for companions." },
  { id: "estudio-makeup", scope: "estudio", esQ: "Ofrecen servicio de maquillaje y peinado?", esA: "Sí. Tenemos una makeup artist y peinadora aliadas que vienen al estudio bajo solicitud (add-on con costo aparte). El servicio se reserva con 5 días de anticipación. Para sesiones corporativas el maquillaje es más natural; para books de modelo o sesiones editoriales se ajusta al concepto que acordemos antes.", enQ: "Do you offer makeup and hair services?", enA: "Yes. We have an allied makeup artist and hairstylist who come to the studio on request (add-on with separate cost). The service books 5 days in advance. For corporate sessions makeup is more natural; for model books or editorial sessions it's tuned to the concept we agree on beforehand." },
  { id: "estudio-backdrops", scope: "estudio", esQ: "Qué fondos tiene disponible el estudio?", esA: "Tenemos fondos de papel sin costuras (blanco, gris, negro, beige, verde y rojo), fondos de tela texturizada, ciclorama curvo blanco para cuerpo entero y un set escenográfico con paredes movibles para sets editoriales. Si necesitas un fondo específico (color, textura, marca) lo conseguimos con 7 días de anticipación.", enQ: "What backdrops are available?", enA: "We have seamless paper backdrops (white, gray, black, beige, green and red), textured fabric backdrops, a white curved cyclorama for full-body shots and a scenographic set with movable walls for editorial setups. If you need a specific backdrop (color, texture, branded) we source it with 7 days of advance notice." },
  { id: "estudio-children", scope: "estudio", esQ: "Trabajan con niños y bebés en estudio?", esA: "Sí. Tenemos experiencia con sesiones de bebés (recomendamos a partir de 2 semanas para newborn), sesiones familiares con niños, sesiones de cumpleaños y comuniones. El estudio tiene aire acondicionado controlado, área para alimentación y un set de props (peluches, mantas, sombreros) que rotamos según la edad del niño.", enQ: "Do you work with children and babies?", enA: "Yes. We have experience with baby sessions (we recommend starting at 2 weeks for newborn), family sessions with children, birthday and communion sessions. The studio has controlled AC, a feeding area and a props set (stuffed animals, blankets, hats) that we rotate based on the child's age." },
  { id: "estudio-duration", scope: "estudio", esQ: "Cuánto dura una sesión de fotos en estudio?", esA: "La duración estándar es de 60 minutos para retratos individuales, 90-120 minutos para sesiones corporativas con varios looks, 60 minutos para maternidad y familiares, 2-3 horas para newborn (con descansos para alimentar al bebé), y 2-4 horas para editoriales de moda con producción. Te confirmamos la duración exacta al cotizar y la sesión cubre desde el primer disparo hasta el último.", enQ: "How long does a studio session last?", enA: "Standard duration is 60 minutes for individual portraits, 90-120 minutes for corporate sessions with multiple looks, 60 minutes for maternity and family, 2-3 hours for newborn (with feeding breaks), and 2-4 hours for fashion editorials with production. We confirm exact duration at quote time and the session covers from first shot to last." },
  { id: "estudio-outfit-changes", scope: "estudio", esQ: "Puedo cambiarme de ropa durante la sesión?", esA: "Sí. El estudio tiene un área de cambio privada con espejo de cuerpo entero, ganchos y un vapor de plancha para que la ropa se vea perfecta. En una sesión de 60 minutos caben cómodamente 2 looks; en 90 minutos hasta 3. Recomendamos llegar 15 minutos antes con la ropa lista para optimizar el tiempo de cámara y maximizar las fotos finales.", enQ: "Can I change outfits during the session?", enA: "Yes. The studio has a private change area with full-length mirror, hangers and a garment steamer so clothes look perfect. A 60-minute session comfortably fits 2 looks; 90 minutes fits up to 3. We recommend arriving 15 minutes early with clothes ready to maximize camera time and final photos." },
  { id: "estudio-delivery", scope: "estudio", esQ: "Cómo recibo mis fotos después de la sesión?", esA: "Recibes una galería online privada con todas las fotos editadas, accesible desde tu correo y compartible por link con quien decidas. Desde la galería puedes descargar en alta resolución (para imprimir) y baja resolución (para redes sociales). Los tiempos de entrega son: retratos 5-7 días, corporativos 24-48 horas, newborn 7 días, editoriales 7-10 días.", enQ: "How do I receive my photos?", enA: "You get a private online gallery with all edited photos, accessible from your email and shareable by link with anyone you choose. From the gallery you can download in high resolution (for printing) and low resolution (for social media). Delivery times: portraits 5-7 days, corporate 24-48 hours, newborn 7 days, editorials 7-10 days." },
  { id: "estudio-makeup-included", scope: "estudio", esQ: "Tus sesiones de fotos incluyen maquillaje o peinado?", esA: "Las sesiones estándar no incluyen maquillaje o peinado, pero tenemos una makeup artist y peinadora aliadas que vienen al estudio bajo solicitud (add-on con costo aparte: RD$3,500-6,000 según servicio). El servicio se reserva con 5 días de anticipación. Para corporativos recomendamos maquillaje natural; para books de modelo o editoriales se ajusta al concepto que acordemos antes.", enQ: "Do your sessions include makeup or hair?", enA: "Standard sessions don't include makeup or hair, but we have an allied makeup artist and hairstylist who come to the studio on request (add-on with separate cost: RD$3,500-6,000 depending on service). Books with 5 days advance notice. For corporate we recommend natural makeup; for model books or editorials it's tuned to the agreed concept." },
  { id: "estudio-availability", scope: "estudio", esQ: "Cómo comprobar la disponibilidad?", esA: "Escríbenos por WhatsApp al +1 809 720 9547 con la fecha tentativa, el tipo de sesión y la cantidad de personas. Te respondemos en menos de 24 horas con disponibilidad confirmada y una propuesta detallada. El calendario del estudio se llena con 1-3 semanas de anticipación, especialmente fines de semana, así que recomendamos reservar lo antes posible.", enQ: "How do I check availability?", enA: "Message us on WhatsApp at +1 809 720 9547 with the tentative date, session type and number of people. We reply in under 24 hours with confirmed availability and a detailed proposal. The studio calendar fills up 1-3 weeks ahead, especially weekends, so we recommend booking as early as possible." },
  { id: "estudio-prices-location", scope: "estudio", esQ: "Los precios de los planes son válidos solo en Santo Domingo?", esA: "Los precios publicados aplican para sesiones en nuestro estudio en Santo Domingo. Para sesiones en otras ciudades (Santiago, Punta Cana, La Romana, Casa de Campo, Cap Cana, Bávaro y otras) sumamos un travel fee fijo que cubre transporte y, cuando aplica, una noche de hospedaje del equipo. Cotiza tu zona específica por WhatsApp y te enviamos el precio total en menos de 24 horas.", enQ: "Are the package prices valid only in Santo Domingo?", enA: "Published prices apply for sessions at our Santo Domingo studio. For sessions in other cities (Santiago, Punta Cana, La Romana, Casa de Campo, Cap Cana, Bávaro and others) we add a flat travel fee covering transport and, when applicable, one night of team lodging. Quote your specific zone via WhatsApp and we send the total price in under 24 hours." },
  { id: "global-language", scope: "global", esQ: "Atienden en inglés?", esA: "Sí. Atendemos por WhatsApp, email y en sesión en español e inglés. Para clientes internacionales (US, Canadá, Europa) coordinamos toda la comunicación pre-sesión por email en inglés y enviamos contratos bilingües si lo prefieres. El equipo de fotografía habla inglés a nivel profesional y conoce las referencias culturales de bodas y sesiones americanas, canadienses y europeas.", enQ: "Do you speak English?", enA: "Yes. We work in WhatsApp, email and on-set in Spanish and English. For international clients (US, Canada, Europe) we coordinate all pre-session communication via email in English and send bilingual contracts on request. The photo team speaks professional English and knows the cultural references of American, Canadian and European weddings and sessions." },
  { id: "global-raw-files", scope: "global", esQ: "Entregan los archivos RAW originales?", esA: "Por política no entregamos archivos RAW. Los RAW son archivos brutos sin edición que pueden dar una impresión equivocada de la calidad final del trabajo. Lo que sí entregamos: archivos JPEG editados en alta resolución, listos para imprimir hasta tamaño grande, con derechos de uso personal o comercial según el contrato. Para clientes que requieren RAW por necesidad de archivo profesional cotizamos como add-on.", enQ: "Do you deliver original RAW files?", enA: "As a policy we don't deliver RAW files. RAWs are unedited raw files that can give a wrong impression of the final work quality. What we deliver: edited JPEG files at high resolution, print-ready up to large sizes, with personal or commercial usage rights per the contract. For clients who require RAW for professional archival purposes we quote as an add-on." }
];

/* ============ HELPERS ============ */

export function servicesByNiche(niche: Niche): SharedService[] {
  return services.filter((s) => s.niche === niche);
}

export function locationsForNiche(niche: Niche): SharedLocation[] {
  return locations.filter((l) => l.niches.includes(niche));
}

export function packagesByNiche(niche: Niche): SharedPackage[] {
  return packages.filter((p) => p.niche === niche);
}

export function faqsForNiche(niche: Niche): NetworkFaq[] {
  return faqs.filter((f) => f.scope === "global" || f.scope === niche);
}
