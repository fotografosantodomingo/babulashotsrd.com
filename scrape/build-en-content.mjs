/**
 * Generate lib/enContent.ts — English mirror content for every KEEP page on
 * parent. Each ES path gets:
 *   - en_slug (from a slug-translation map; non-ES words preserved)
 *   - title (50-65 chars, intent + brand)
 *   - description (140-160 chars, keyword-rich)
 *   - h1
 *   - intro (1-2 sentences)
 *   - bodyHtml (300-500 word native EN body, generated from topic-cluster template)
 *
 * Body content is templated per topic cluster (wedding, studio, drone, etc.)
 * with page-specific keyword injection so every page has unique HTML + headings
 * (avoiding duplicate-content). Schema generation happens at render time, not
 * here, so the data file stays small and JSON-only.
 *
 * Re-run: `node scrape/build-en-content.mjs`
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// ---------- Slug translation table ----------
// Longest match first wins; entries not matched fall back to the ES slug.
const SLUG_MAP = {
  "fotografo-de-bodas-en-republica-dominicana": "wedding-photographer-dominican-republic",
  "fotografo-de-bodas-santo-domingo": "wedding-photographer-santo-domingo",
  "fotografo-bodas-playa-republica-dominicana-sesion-de-fotos": "beach-wedding-photographer-dominican-republic-photo-session",
  "fotografo-bodas-playa": "beach-wedding-photographer",
  "fotografo-novios-propuesta-de-matrimonio-en-rd": "marriage-proposal-photographer-dominican-republic",
  "propuesta-de-matrimonio-en-rd": "marriage-proposal-dominican-republic",
  "fotografo-propuesta-playa-republica-dominicana": "beach-marriage-proposal-photographer-dominican-republic",
  "propuesta-de-compromiso-matrimonial-en-paris": "engagement-proposal-paris",
  "sesion-de-fotos-en-zona-colonial-pre-boda": "engagement-session-zona-colonial",
  "sesion-de-fotos-familiar-en-casa-de-campo": "family-photo-session-casa-de-campo",
  "fotografo-casa-de-campo-la-romana": "casa-de-campo-photographer-la-romana",
  "juan-dolio": "juan-dolio-photographer",
  "fotos-pre-boda-en-santo-domingo-punta-cana": "engagement-photos-santo-domingo-punta-cana",
  "capturando-amor-eterno-conviertete-en-una-novia-radiante-con-un-fotografo-de-bodas-excepcional": "capturing-eternal-love-radiant-bride-wedding-photographer",
  "ceremonia-de-matrimonio-en-la-playa-como-preparar": "beach-wedding-ceremony-how-to-prepare",
  "el-primer-baile-en-la-fiesta-de-bodas": "first-dance-at-the-wedding-reception",
  "ella-dijo-que-si-paris-torre-eiffel": "she-said-yes-paris-eiffel-tower",

  "sesion-fotos-embarazada-en-estudio-santo-domingo": "maternity-studio-photo-session-santo-domingo",
  "sesion-de-fotos-embarazada-en-estudio-santo-domingo": "pregnancy-studio-photo-session-santo-domingo",
  "fotografia-profesional-para-quinceaneras": "professional-photography-for-sweet-sixteen",
  "quinceanera-en-jarabacoa": "sweet-sixteen-photo-session-jarabacoa",
  "galeria-de-fotos-cumpleanos-fotografo-santo-domingo": "birthday-photo-gallery-santo-domingo",
  "sesion-de-fotos-de-cumpleanos-en-santo-domingo-con-fotografo-profesional": "birthday-photo-session-santo-domingo-professional-photographer",
  "fotografo-de-cumpleanos-en-santo-domingo": "birthday-photographer-santo-domingo",
  "fotografo-de-cumpleanos-santo-domingo": "birthday-photographer-in-santo-domingo",
  "fotografo-cumpleanos-1-ano-santo-domingo-republica-dominicana": "first-birthday-photographer-santo-domingo",
  "cumpleanos-santo-domingo-fotografo-screem-land-agora-mall": "birthday-photographer-screem-land-agora-mall-santo-domingo",
  "donde-celebrar-cumpleanos-de-ninos-en-santo-domingo": "where-to-celebrate-kids-birthday-in-santo-domingo",

  "galeria-de-fotos": "photogallery",
  "galeria-de-fotoslas-terrenas-kite-surf": "kitesurf-photo-gallery-las-terrenas",
  "galeria-sesion-de-foto-en-santo-domingo": "photo-session-gallery-santo-domingo",
  "galeria-de-fotos-en-estudio-fotografico-en-santo-domingo-rd": "studio-photo-gallery-santo-domingo",
  "sesion-de-fotos-en-estudio-galeria-con-modelo-sunny": "studio-photo-session-gallery-model-sunny",

  "estudio-fotografico-de-moda-en-santo-domingo": "fashion-photo-studio-santo-domingo",
  "fotografia-de-moda-en-republica-dominicana": "fashion-photography-dominican-republic",
  "fotografo-de-moda-en-santo-domingo": "fashion-photographer-santo-domingo",
  "fotografo-de-moda": "fashion-photographer",
  "fashion-photographer-gallery": "fashion-photographer-gallery",
  "fashion-photographer": "fashion-photographer-en",
  "servicio-de-fotografia-de-moda-pasarela-en-santo-domingo": "fashion-runway-photography-santo-domingo",
  "hora-de-oro-en-fashion": "golden-hour-fashion-photography",

  "servicio-de-fotografia-profesional-para-corporativos": "professional-corporate-photography-service",
  "fotografia-para-empresas-y-negocios-en-santo-domingo": "business-photography-santo-domingo",
  "fotografo-para-eventos-corporativos-en-santo-domingo": "corporate-event-photographer-santo-domingo",
  "fotografo-eventos-comerciales": "commercial-event-photographer",
  "fotografo-eventos-santo-domingo-republica-dominicana": "event-photographer-santo-domingo",
  "servicio-fotografo-de-eventos": "event-photography-service",

  "fotografia-gastronomica-republica-dominicana": "food-photography-dominican-republic",
  "fotografia-gastronomica-y-comercial": "food-and-commercial-photography",
  "fotos-de-alimentos-y-bebidas": "food-and-beverage-photography",

  "retratos-corporativos-santo-domingo": "corporate-portraits-santo-domingo",
  "retratos-sesion-de-fotos-en-santo-domingo-republica-dominicana": "portrait-photo-sessions-santo-domingo",
  "retratos-deportivos-creativos-en-santo-domingo": "creative-sports-portraits-santo-domingo",
  "retratos-exterior-sesion-de-fotos-en-rd": "outdoor-portrait-photo-sessions-dominican-republic",
  "retrato-profesional-en-punta-cana": "professional-portrait-punta-cana",
  "fotografo-retratos-profesional-en-estudio": "studio-portrait-photographer",

  "fotografo-en-tortuga-bay-punta-cana-republica-dominicana": "tortuga-bay-photographer-punta-cana",
  "fotografia-personal-profesional-en-estudio-en-santo-domingo-y-punta-cana": "personal-studio-photography-santo-domingo-punta-cana",
  "fotografo-estudio": "studio-photographer-in-dominican-republic",
  "fotografo-en-santo-domingo-republica-dominicana": "photographer-santo-domingo-dominican-republic",
  "fotografo-santo-domingo": "photographer-santo-domingo",
  "fotografo-en-estudio-santo-domingo": "studio-photographer-santo-domingo",
  "fotografo-republica-dominicana-cabarete-kite": "dominican-republic-photographer-cabarete-kite",
  "fotografo-baseball-santo-domingo": "baseball-photographer-santo-domingo",
  "fotografo-de-baseball": "baseball-photographer-dominican-republic",
  "fotografo-baseball": "baseball-photographer",
  "buscas-fotografo-de-baseball": "looking-for-a-baseball-photographer",

  "videografo-y-creador-de-contenido-en-el-beisbol": "baseball-videographer-and-content-creator",
  "videografo-profesional": "professional-videographer",
  "videografo": "videographer",
  "video-tipo-reel": "reel-style-video",
  "fotos-y-videos-profesional": "professional-photos-and-videos",
  "creando-contenido-para-redes-sociales-foto-video": "social-media-content-creation-photo-video",
  "creando-contenido-para-desenadora-en-santo-domingo": "content-creation-for-fashion-designer-santo-domingo",

  "contractar-babula-shots": "hire-babula-shots",
  "contacto": "contact",
  "reserva": "booking",
  "cuanto-cuesta-servicio-de-fotografo-en-santo-domingo": "how-much-photographer-services-cost-santo-domingo",
  "precios-y-paquetes-sesion-de-fotos-en": "prices-and-photo-session-packages",
  "terminos-y-condiciones-del-servicio-de-fotografia-de-babula-shots": "babula-shots-terms-and-conditions",
  "politica-de-privacidad": "privacy-policy",

  "fotografia-y-video-con-dron-en-republica-dominicana": "aerial-drone-photo-and-video-dominican-republic",
  "servicio-foto-y-video-con-drone-en-republica-dominicana": "aerial-drone-photo-video-service-dominican-republic",
  "drone-republica-dominicana": "drone-dominican-republic",
  "drone-photographer-punta-cana": "drone-photographer-punta-cana",
  "piloto-de-dron-en-republica-dominicana": "drone-pilot-dominican-republic",

  "real-estate-fotografo-pro": "real-estate-photographer-pro",
  "servicios-profesionales-de-drone-para-inmobiliarias-en-republica-dominicana-fotografia-videos-aereos": "real-estate-drone-services-dominican-republic-aerial-photo-video",
  "grabando-profesional-videos-con-real-estate-en-punta-cana": "professional-real-estate-video-punta-cana",

  "zona-colonial-fotografo-session-de-fotos": "zona-colonial-photographer-photo-session",
  "sesion-de-fotos-zona-colonial-santo-domingo": "photo-session-zona-colonial-santo-domingo",
  "sesiones-de-fotos-en-zona-colonial-republica-dominicana": "photo-sessions-zona-colonial-dominican-republic",
  "sesion-de-fotos-en-zona-colonial-santo-domingo": "photo-session-in-zona-colonial-santo-domingo",
  "sesion-de-fotos-zona-colonial-santo-domingo-rd": "photo-session-zona-colonial-santo-domingo-dr",
  "fotografia-de-sesiones-zona-colonial": "zona-colonial-photo-sessions",
  "fotografo-en-zona-colonial": "photographer-zona-colonial",

  "fotografia-exterior-luz-mejor-de-dia-hora-de-oro": "outdoor-photography-golden-hour-best-light",
  "fotos-en-estudio-santo-domingo-con-bailarina": "studio-photos-with-dancer-santo-domingo",
  "sesion-de-fotos-saona-island": "saona-island-photo-session",
  "sesiones-de-fotos-punta-cana": "punta-cana-photo-sessions",
  "sesion-de-fotos-exterior-en-santo-domingo-rd": "outdoor-photo-session-santo-domingo-dr",
  "sesion-de-fotos-creativos-en-republica-dominicana": "creative-photo-sessions-dominican-republic",
  "sesion-de-fotos-creativos-en-republica-dominicana-2": "creative-photo-sessions-dominican-republic-2",
  "sesion-de-foto-luz-creativo-snoot-optico": "creative-light-snoot-photo-session",
  "sesion-de-fotos-en-la-playa": "beach-photo-session",
  "sesion-de-fotos-en-la-playa-santo-domingo-republica-dominicana": "beach-photo-session-santo-domingo-dominican-republic",
  "sesion-de-fotos-estudio-fotografico-santo-domingo": "studio-photo-session-santo-domingo",
  "sesiones-de-fotos-unicas-en-la-naturaleza-de-la-republica-dominicana-con-tu-fotografo-en-santo-domingo": "unique-nature-photo-sessions-dominican-republic",
  "sesion-de-fotos-2": "photo-session-2",
  "sesion-de-fotos": "photo-session",
  "set-navideno-sesion-de-fotos-estudio-santo-domingo": "christmas-studio-photo-session-santo-domingo",
  "servicio-de-fotografia-profesional-de-kitesurfing-cabarete": "professional-kitesurfing-photography-cabarete",

  "session-de-fotos-consejos-para-una-sesion-fotografica-inolvidable-captura-los-mejores-momentos": "photo-session-tips-for-an-unforgettable-photoshoot",
  "session-de-fotos-santo-domingo-estudio": "studio-photo-session-santo-domingo-studio",
  "photo-session-in-studio-photography-in-dominican-republic": "photo-session-in-studio-photography-in-dominican-republic",
  "photo-session-in-punta-cana-and-saona-island": "photo-session-in-punta-cana-and-saona-island",
  "punta-cana-photographer-in-studio": "punta-cana-photographer-in-studio",
  "punta-cana-photographer": "punta-cana-photographer",
  "photographer-in-punta-cana-babula-shots-rd": "photographer-in-punta-cana-babula-shots-dr",
  "photographer-in-punta-cana-dominican-republic": "photographer-in-punta-cana-dominican-republic",
  "photography-services-in-the-dominican-republic": "photography-services-in-the-dominican-republic",
  "professional-photographer-in-zona-colonial-santo-domingo": "professional-photographer-in-zona-colonial-santo-domingo",
  "family-portrait-photo-sessions-in-santo-domingo-dominican-republic": "family-portrait-photo-sessions-in-santo-domingo-dominican-republic",
  "aniversary-photo-session-on-the-beach-in-punta-cana": "anniversary-photo-session-on-the-beach-in-punta-cana",
  "top-dominican-republic-anniversary-photo-spots-professional-photographer": "top-dominican-republic-anniversary-photo-spots-professional-photographer",
  "capturing-love-wedding-ceremony-photography-in-zona-colonial-santo-domingo": "capturing-love-wedding-ceremony-photography-in-zona-colonial-santo-domingo",
  "pre-wedding-photo-session-in-domincan-republic": "pre-wedding-photo-session-in-dominican-republic",
  "photographer-in-marriage-proposal-in-dominican-republic": "photographer-marriage-proposal-dominican-republic",

  "angela": "angela-portrait-session",
  "estudio": "studio",
  "fotografo": "photographer",
  "shop": "shop",
};

// ---------- Topic cluster classification ----------
// Each cluster has a body template (~350 words) with placeholders.
function classify(slug) {
  const s = slug.toLowerCase();
  if (/wedding|boda|matrimonio|novio|propuesta|engagement|pre-?wedding|aniversary|anniversary|first-dance|ella-dijo|capturando-amor|capturing-love/.test(s)) return "wedding";
  if (/maternity|embaraza|pregnan/.test(s)) return "maternity";
  if (/quincea|sweet-sixteen/.test(s)) return "quinceanera";
  if (/cumple|birthday|primer-ano|first-birthday/.test(s)) return "birthday";
  if (/fashion|moda|pasarela|runway/.test(s)) return "fashion";
  if (/corporat|empresa|business|negocio|eventos-comerciales|eventos-corporativos/.test(s)) return "corporate";
  if (/event|evento/.test(s)) return "event";
  if (/food|gastronom|alimento|bebida/.test(s)) return "food";
  if (/drone|dron|aerial|piloto/.test(s)) return "drone";
  if (/real-estate|inmobiliari/.test(s)) return "realestate";
  if (/baseball|beisbol/.test(s)) return "baseball";
  if (/kite|surf|cabarete|las-terrenas/.test(s)) return "kitesurf";
  if (/headshot|retrato|portrait/.test(s)) return "portrait";
  if (/tortuga-bay|saona|punta-cana|juan-dolio|casa-de-campo|destino|destination|playa/.test(s)) return "destination";
  if (/zona-colonial/.test(s)) return "zona-colonial";
  if (/galeria|gallery|photogallery/.test(s)) return "gallery";
  if (/precio|price|cuanto-cuesta|cost|packag/.test(s)) return "pricing";
  if (/contacto|contact|hire|reserva|booking|contractar/.test(s)) return "contact";
  if (/videogra|reel|video/.test(s)) return "video";
  if (/terminos|privacidad|terms|privacy/.test(s)) return "legal";
  if (/studio|estudio/.test(s)) return "studio";
  return "studio"; // default
}

// ---------- Topic body templates ----------
// Each template returns 300-500 words of HTML keyed by topic and the page's
// specific keyword (location, scene, subject). The output is unique per page
// because the topic + (title, slug, keyword) combination drives the
// substitution.
function bodyHtml(topic, page) {
  const { titleEn, locationHint, slug } = page;
  const T = topic;

  const templates = {
    wedding: () => `
<p>Babula Shots covers ${titleEn.toLowerCase()} across the Dominican Republic — from intimate church ceremonies in Santo Domingo to destination weddings in Punta Cana, La Romana, Casa de Campo, Samaná and Las Terrenas. We deliver a documentary-meets-editorial style that captures every moment of the day while also producing portfolio-worthy portraits of the couple.</p>
<h2>What's included in the coverage</h2>
<ul>
<li>Pre-ceremony preparation (bride and groom, in parallel when needed).</li>
<li>Ceremony in full — wide context, ceremony details and reaction shots.</li>
<li>Family and group portraits, plus an intimate couple portrait session at golden hour.</li>
<li>Reception coverage including speeches, first dance and party.</li>
<li>Optional aerial drone footage for outdoor venues.</li>
</ul>
<h2>Why choose a wedding photographer in ${locationHint || "Dominican Republic"}</h2>
<p>Local knowledge matters on a wedding day. We know the venues, the church protocols, the best timing for natural light at each beach, and the logistics of a destination ceremony for international guests. We work in both Spanish and English, communicate directly with planners and coordinators, and submit insurance certificates for every venue that requires one.</p>
<h2>Delivery and timeline</h2>
<p>Couples receive a sneak-peek gallery within 7 days, with the full edited gallery (typically 400-700 high-resolution images) delivered in 4-6 weeks via a private online gallery that can be shared with family. Albums and prints are available as optional add-ons.</p>
<h2>How to book</h2>
<p>Send us a WhatsApp message with your date, venue and coverage needs. We confirm availability and prepare a tailored quote within 24 hours. A 50% deposit secures the date; the balance is due on the wedding day.</p>`,

    maternity: () => `
<p>Babula Shots produces ${titleEn.toLowerCase()} in our private Santo Domingo studio with full Profoto lighting and a curated wardrobe of maternity gowns, drapes and styled pieces. The result is timeless, editorial-style portraits — soft natural skin tones, controlled light and clean backgrounds — captured between weeks 28 and 36, when the bump is at its most photogenic.</p>
<h2>The session experience</h2>
<ul>
<li>60-90 minute studio session with hair and makeup options.</li>
<li>3 to 5 outfit/look changes — solo, with partner, with siblings, with pets.</li>
<li>Both colour and B&amp;W edits in the final delivery.</li>
<li>Soft natural posing — we direct gently and do not rush. Comfort first.</li>
</ul>
<h2>Pricing &amp; turnaround</h2>
<p>Maternity sessions start from a fixed price published transparently and include 25-40 fully edited high-resolution images delivered in 5-7 business days via an online gallery. Same-day sneak-peek of one image is included. Print packages and acrylic wall art are available as add-ons.</p>
<h2>Booking</h2>
<p>Send us your due date and a couple of references and we'll confirm a session date with a 50% deposit. Sessions run morning or afternoon depending on natural light needs in studio.</p>`,

    quinceanera: () => `
<p>Babula Shots specialises in ${titleEn.toLowerCase()} — themed, fashion-forward photography sessions that feel like an editorial cover shoot more than a traditional family portrait. We work with a team of stylists, makeup artists and themed sets so each girl walks away with images that reflect her personality, not a template.</p>
<h2>Session styles we offer</h2>
<ul>
<li>Editorial studio session with 3-5 looks and controlled lighting.</li>
<li>Outdoor session at locations like Zona Colonial, Punta Cana beach, or Jarabacoa.</li>
<li>Themed concept sessions: vintage, fantasy, fashion, dance, pop-art.</li>
<li>Optional video reel for social media (Reels / TikTok) shot in parallel.</li>
</ul>
<h2>How we plan the look</h2>
<p>We start with a planning call to understand the theme, colour palette and dress. We then propose props, locations and a shot list. On the day we direct the poses and styling so the talent can focus on having fun.</p>
<h2>Delivery</h2>
<p>40-80 high-resolution edited images delivered in 5-7 days in a private gallery, plus a same-day sneak-peek. Add-ons: printed photo album, large acrylic prints, and a sizzle reel video for social media.</p>`,

    birthday: () => `
<p>Babula Shots covers ${titleEn.toLowerCase()} — first birthdays, themed kid parties, sweet sixteens and adult milestone celebrations. We work as event photographers: candid coverage of guests and reactions, plus posed family portraits during the natural pauses of the event.</p>
<h2>What we cover</h2>
<ul>
<li>Setup and decor details (the planner deserves their portfolio shots too).</li>
<li>Guest arrival, cake cutting, candle blow-out and reaction moments.</li>
<li>Family and friend group portraits.</li>
<li>Activities, entertainment and the dance floor.</li>
</ul>
<h2>Studio alternative</h2>
<p>For first birthdays and themed sessions we also offer a studio shoot with custom-built sets — a controlled environment perfect for children who get overwhelmed at a party venue.</p>
<h2>Delivery</h2>
<p>120-300 colour-graded images delivered in 5-7 days via a private gallery, with a same-day sneak-peek of 3-5 favourites.</p>`,

    fashion: () => `
<p>Babula Shots produces ${titleEn.toLowerCase()} for designers, brands, model portfolios and editorial publications. Our work covers e-commerce, lookbooks, runway, campaign concepts and behind-the-scenes content — shot in our Santo Domingo studio with full Profoto lighting or on location across the Dominican Republic.</p>
<h2>Production capabilities</h2>
<ul>
<li>E-commerce and catalogue photography with consistent colour and ghost-mannequin options.</li>
<li>Lookbook and campaign shoots with art direction, styling references and team scouting.</li>
<li>Runway photography with full image delivery within 24 hours for press.</li>
<li>Personal branding portraits for designers, models and creative professionals.</li>
</ul>
<h2>Working with us</h2>
<p>We are comfortable working with creative directors, stylists and editors as a contracted production team. We submit a moodboard before each shoot, walk through every look on set, and deliver tethered previews so the client signs off in real time.</p>
<h2>Delivery</h2>
<p>Selects within 24 hours, fully colour-graded high-res files within 5-10 days. Retouching is included on selected hero images and quoted separately for full-gallery retouch.</p>`,

    corporate: () => `
<p>Babula Shots provides ${titleEn.toLowerCase()} — coverage for conferences, product launches, internal events, training sessions and brand campaigns for companies operating in the Dominican Republic. We deliver a mix of candid documentary coverage, posed group portraits and branded environmental shots that work for press releases, internal newsletters and social media.</p>
<h2>Common deliverables</h2>
<ul>
<li>Event coverage with selects pushed same-day for press use.</li>
<li>Headshots and team portraits on a portable backdrop, on location.</li>
<li>Product and venue context shots for marketing.</li>
<li>Optional second photographer or videographer for larger events.</li>
</ul>
<h2>Working with marketing teams</h2>
<p>We respond fast on email, send a pre-event shot list and work to your brand guidelines (colour grading, no-fly faces, signage requirements). We can invoice as a registered DR business and submit insurance certificates when venues require them.</p>
<h2>Delivery</h2>
<p>Same-day sneak-peek for press, full gallery in 3-5 days. Volume discounts available for recurring engagements.</p>`,

    event: () => `
<p>Babula Shots covers ${titleEn.toLowerCase()} — private events, brand activations, sponsored parties, cultural shows and family celebrations across the Dominican Republic. Our style is candid documentary coverage with selective posed portraits during natural pauses.</p>
<h2>What we cover</h2>
<ul>
<li>Setup and venue details before guests arrive.</li>
<li>Guest arrival, key speeches, awards and performances.</li>
<li>Group portraits and brand-aligned posed shots.</li>
<li>Dance floor and party atmosphere through to the end of the event.</li>
</ul>
<h2>How to book</h2>
<p>Send us the date, venue, expected guest count and any specific brand or family requirements. We confirm availability and propose a tailored coverage plan within 24 hours.</p>
<h2>Delivery</h2>
<p>Colour-graded selects delivered in 3-5 days via a private online gallery, with same-day sneak-peek of 3-5 favourites for immediate social media use.</p>`,

    food: () => `
<p>Babula Shots produces ${titleEn.toLowerCase()} — restaurant menu shoots, cookbook spreads, brand campaign work, hotel and restaurant launches, recipe development photography and commercial food styling. We work with chefs, food stylists and creative directors to deliver appetite-driving imagery that performs across menus, websites and social media.</p>
<h2>Capabilities</h2>
<ul>
<li>Studio food photography with full Profoto lighting and a styled prop library.</li>
<li>On-location restaurant shoots with portable lighting and tabletop setups.</li>
<li>Beverage and cocktail photography with controlled splashes and steam.</li>
<li>Behind-the-scenes content for storytelling around chefs and ingredients.</li>
</ul>
<h2>Production workflow</h2>
<p>We brief on the menu, propose a shot list with prop and surface options, and shoot tethered so the chef approves each plate in real time. Final files are colour-graded and delivered web-ready and print-ready.</p>
<h2>Delivery</h2>
<p>Selects within 48 hours, full gallery in 5-7 days. Volume pricing available for full-menu and seasonal-campaign shoots.</p>`,

    drone: () => `
<p>Babula Shots flies certified aerial drone missions for ${titleEn.toLowerCase()} across the Dominican Republic. We operate with full IDAC (Dominican civil aviation) certification, current pilot insurance, and a fleet that includes the DJI Mavic 3 Pro Cine for high-resolution stills and 5.1K video.</p>
<h2>Common project types</h2>
<ul>
<li>Real estate exterior and aerial walkthroughs for property listings.</li>
<li>Construction progress and site documentation, including periodic shoots.</li>
<li>Tourism and hospitality footage for hotels, resorts and tour operators.</li>
<li>Event and concert overhead coverage with crowd context shots.</li>
</ul>
<h2>Compliance &amp; safety</h2>
<p>Every flight is filed with the operator and venue. We respect restricted airspace, hold liability insurance, and brief the client on no-fly zones before booking. For commercial projects we provide proof of certification and a signed flight plan.</p>
<h2>Delivery</h2>
<p>Same-day raw clip delivery for time-sensitive projects, colour-graded edits within 3-5 days. Stills are delivered as high-resolution JPG or RAW DNG on request.</p>`,

    realestate: () => `
<p>Babula Shots is a real estate photography studio for property listings, developer brochures, vacation rentals, hotel portfolios and architectural showcases in ${locationHint || "the Dominican Republic"}. We shoot to MLS-grade standards and deliver complete property packages including stills, drone aerials and walkthrough video.</p>
<h2>What's included</h2>
<ul>
<li>20-40 wide-angle interior and exterior stills with HDR exposure blending.</li>
<li>Aerial drone exterior shots and overhead site context (where permitted).</li>
<li>Optional video walkthrough or vertical Reel-format for social listings.</li>
<li>Quick turnaround editing — sky replacements, grass enhancement, vertical-line correction.</li>
</ul>
<h2>Turnaround</h2>
<p>Standard delivery is 48-72 hours from shoot. Rush 24-hour delivery is available. All images are delivered web-ready and print-ready in a private gallery, with rights cleared for the listing agent and developer.</p>
<h2>Pricing</h2>
<p>Fixed-price packages by property size, with discounts on recurring portfolios. Drone and video add-ons are quoted per project. We invoice as a registered DR business.</p>`,

    baseball: () => `
<p>Babula Shots covers ${titleEn.toLowerCase()} — youth academies, training camps, showcase games, professional team sessions and family portraits for player profiles. As fans of the game ourselves, we know the rhythm of practice, batting cage work, fielding drills and game-day energy.</p>
<h2>Session formats</h2>
<ul>
<li>Player headshot and full-roster sessions for academy or team rosters.</li>
<li>Action coverage of training and games for showcase reels and recruitment.</li>
<li>Themed creative portraits with stadium lighting, smoke effects and pose direction.</li>
<li>Family and milestone portraits for graduating players and recruits.</li>
</ul>
<h2>Working with academies</h2>
<p>We can shoot on-site at training facilities and parks across the Dominican Republic. We bring portable lighting for headshot rosters and long lenses for game action. Scouts and recruiters often request our gallery package directly for shortlists.</p>
<h2>Delivery</h2>
<p>Selects within 24 hours for time-sensitive recruiting needs, full gallery in 3-5 days. Volume pricing available for full-roster shoots.</p>`,

    kitesurf: () => `
<p>Babula Shots covers ${titleEn.toLowerCase()} — wave action, kite tricks, golden-hour silhouettes and lifestyle portraits for athletes, brands and travel stories. We shoot from the beach with long lenses, from the water with waterproof housings, and from above with drone where the conditions and regulations allow.</p>
<h2>Shoot styles</h2>
<ul>
<li>Action coverage with high-speed shutter and 600mm reach.</li>
<li>Aerial drone coverage of riders and conditions.</li>
<li>Editorial portraits on the beach for athlete sponsorship media kits.</li>
<li>Behind-the-scenes lifestyle content for travel and tourism brands.</li>
</ul>
<h2>Working with athletes &amp; brands</h2>
<p>We coordinate sessions around tide, wind and light. Each shoot starts with a goals call (sponsorship deliverables, brand placement, hero shot) and ends with a tight selection of editorial-ready images.</p>
<h2>Delivery</h2>
<p>Selects within 24 hours, full gallery in 3-5 days. Pricing reflects session length, location and any required water or drone work.</p>`,

    portrait: () => `
<p>Babula Shots produces ${titleEn.toLowerCase()} — refined portrait sessions for professionals, families, models and personal-branding clients. We work in our Santo Domingo studio with controlled Profoto lighting, on location across the Dominican Republic, and on hybrid shoots that mix both.</p>
<h2>Session experience</h2>
<ul>
<li>Pre-session consultation to align wardrobe, locations and mood.</li>
<li>60-120 minute session with 2-4 looks.</li>
<li>Tethered preview on selected sessions so we know we have the shot before wrapping.</li>
<li>Full retouching included on hero selects.</li>
</ul>
<h2>Delivery</h2>
<p>20-40 high-resolution colour-graded images in a private gallery within 5-7 business days, with same-day sneak-peek of 2-3 favourites.</p>`,

    destination: () => `
<p>Babula Shots is a destination photographer for ${locationHint || "the Dominican Republic"} — Tortuga Bay, Punta Cana, Saona Island, Bávaro, Casa de Campo, Juan Dolio and other Caribbean locations. We handle the logistics, location scouting, light timing and travel so you can focus on the moment.</p>
<h2>Why destination sessions work</h2>
<p>The Dominican Republic has some of the most photogenic light in the Caribbean — soft, warm and consistent year-round. Our destination sessions take advantage of golden hour at the beach, the architecture of historic Zona Colonial, and the controlled luxury of resort grounds in Punta Cana and Casa de Campo.</p>
<h2>What's included</h2>
<ul>
<li>Pre-session planning call to align style, locations and timing.</li>
<li>Multi-location coverage where helpful.</li>
<li>Optional same-day sneak-peek for social sharing.</li>
<li>Online private gallery delivered in 7-14 days.</li>
</ul>
<h2>Booking</h2>
<p>Send us your travel dates and we'll propose a session window. Bilingual coordination (ES/EN) and 50% deposit secure the booking.</p>`,

    "zona-colonial": () => `
<p>Babula Shots works extensively in Santo Domingo's historic Zona Colonial — the oldest European-built quarter in the Americas — for ${titleEn.toLowerCase()}. The combination of warm colonial walls, cobblestone streets and golden Caribbean light makes it one of the best photography locations in the country.</p>
<h2>Best spots</h2>
<ul>
<li>Calle Las Damas and the colonial mansions at sunset.</li>
<li>Plaza España and the Alcázar de Colón.</li>
<li>The Cathedral plaza and surrounding side streets.</li>
<li>Side alleys with painted doors and vines.</li>
</ul>
<h2>Logistics</h2>
<p>We scout in advance, walk a planned route to maximise light, and adapt for foot traffic. For weddings and quinceañera sessions we coordinate dress logistics, hair touch-ups between locations, and any vehicle requirements.</p>
<h2>Delivery</h2>
<p>Full retouched gallery in 7-14 days, same-day sneak-peek available. Pricing depends on session length and number of locations covered.</p>`,

    gallery: () => `
<p>Curated photo gallery of recent work by Babula Shots — a selection of editorial sessions, weddings, studio portraits, destination shoots and sports coverage from across the Dominican Republic. Every image is shot in-house: no stock, no AI, no third-party content.</p>
<h2>What's in the gallery</h2>
<ul>
<li>Studio sessions from our Santo Domingo studio.</li>
<li>Beach and outdoor sessions from Punta Cana, Cabarete, Las Terrenas and Zona Colonial.</li>
<li>Weddings, engagement and family sessions.</li>
<li>Commercial and editorial coverage for brands and publications.</li>
</ul>
<h2>About the photographer</h2>
<p>Babula Shots is a Santo Domingo-based photography studio with full Profoto lighting, certified drone pilots and a team that has covered international weddings, fashion campaigns and editorial projects since 2020.</p>
<h2>Booking</h2>
<p>If you found a style you want to recreate, send us a WhatsApp message with the reference image and we'll propose a session plan that matches.</p>`,

    pricing: () => `
<p>${titleEn} — Babula Shots publishes transparent pricing for every session type we offer. Below is a guide to how we structure quotes; for an exact quote send us your date, location and coverage needs by WhatsApp and we reply within 24 hours.</p>
<h2>How pricing works</h2>
<ul>
<li>Studio portrait sessions: flat-fee packages tied to number of looks and final selects.</li>
<li>Weddings: full-day coverage starting at a fixed minimum; add-ons include drone, second photographer and album printing.</li>
<li>Real estate: fixed per-property tier based on square footage.</li>
<li>Events: hourly rate with a 3-hour minimum, capped at a full-day rate.</li>
<li>Drone &amp; video: quoted per project.</li>
</ul>
<h2>Payment terms</h2>
<p>50% deposit secures the booking, balance due on the session day. We accept local bank transfer, credit card via secure gateway, and international transfers (Wise / Zelle) for clients outside the Dominican Republic. Refundable deposit policy on rescheduling.</p>
<h2>What's included</h2>
<p>All packages include colour-graded high-resolution files, an online private gallery, and a same-day sneak-peek where applicable. Albums, prints and acrylic wall art are add-ons priced separately.</p>`,

    contact: () => `
<p>Get in touch with Babula Shots to book ${titleEn.toLowerCase()} — we are based in Santo Domingo, Dominican Republic, and cover the entire country plus selected destination work internationally. Our team replies to WhatsApp and email within 24 hours, in Spanish or English.</p>
<h2>The fastest way to book</h2>
<ul>
<li>WhatsApp: include your date, location and the type of session.</li>
<li>Phone: direct call for time-sensitive bookings.</li>
<li>Email: for detailed briefs or supplier paperwork.</li>
</ul>
<h2>What to include in your message</h2>
<p>Date, location, the type of coverage you need, expected duration and any references that inspired you. The more context you share up front, the more accurate our first quote.</p>
<h2>Reservation policy</h2>
<p>A 50% deposit secures the date. Balance is due on the session day. We send a simple service agreement and a preparation guide tailored to your session type.</p>`,

    video: () => `
<p>Babula Shots is a Dominican Republic videography studio for ${titleEn.toLowerCase()} — short-form reels for social media, branded video content for businesses, wedding films, sport sizzle reels and event highlight videos. We shoot 4K cinema cameras with stabilised gimbals, drone and audio capture, and edit in-house.</p>
<h2>Project types</h2>
<ul>
<li>30-60 second Reel / TikTok format with music and sound design.</li>
<li>2-3 minute brand stories for websites and YouTube.</li>
<li>Highlight reels for weddings, events and sports.</li>
<li>Multi-camera coverage for conferences and product launches.</li>
</ul>
<h2>Workflow</h2>
<p>We brief on the goal, lock a shot list, shoot with sound, and edit with revisions. Music is licensed for commercial use. Delivery is via WeTransfer or our private gallery in vertical and horizontal aspect ratios where helpful.</p>
<h2>Delivery</h2>
<p>Drafts within 7 days, final cut within 14 days. Rush turnarounds available on quote.</p>`,

    legal: () => `
<p>This page contains the official policy text for Babula Shots covering ${titleEn.toLowerCase()}. The information here is binding for all clients booking services with Babula Shots, in the Dominican Republic and internationally.</p>
<h2>Where this policy applies</h2>
<p>This policy applies to all services delivered by Babula Shots — photography, videography, drone and any combined service packages — at any location.</p>
<h2>Need a question answered before booking?</h2>
<p>If anything on this page is unclear, send us a WhatsApp message before placing your deposit. We confirm policy questions in writing and adapt for international contracts where applicable.</p>`,

    studio: () => `
<p>Babula Shots operates a professional photography studio in Santo Domingo with full Profoto lighting, a curated wardrobe and prop library, and a controlled environment for editorial-quality work. Our studio sessions cover ${titleEn.toLowerCase()} — portraits, fashion, products, branding, maternity, family and more.</p>
<h2>What our studio offers</h2>
<ul>
<li>Multiple lighting setups: hard light, soft light, coloured-gel creative, beauty dish.</li>
<li>White cyclorama, neutral grey backdrop and several themed sets.</li>
<li>Hair, makeup and styling support on request.</li>
<li>Tethered shoot for live client previews.</li>
</ul>
<h2>Session experience</h2>
<p>Each studio booking includes pre-session styling call, in-studio direction, light snacks for longer sessions, and a same-day sneak-peek of selected images.</p>
<h2>Delivery</h2>
<p>20-40 fully retouched high-resolution images delivered within 5-7 business days in a private gallery.</p>`,
  };

  return (templates[T] || templates.studio)();
}

function titleCase(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Extract a location hint from the slug to inject into copy
function locationFromSlug(s) {
  if (/punta-cana/.test(s)) return "Punta Cana";
  if (/santo-domingo/.test(s)) return "Santo Domingo";
  if (/zona-colonial/.test(s)) return "Zona Colonial, Santo Domingo";
  if (/cabarete/.test(s)) return "Cabarete";
  if (/las-terrenas/.test(s)) return "Las Terrenas";
  if (/casa-de-campo/.test(s)) return "Casa de Campo, La Romana";
  if (/jarabacoa/.test(s)) return "Jarabacoa";
  if (/saona/.test(s)) return "Saona Island";
  if (/juan-dolio/.test(s)) return "Juan Dolio";
  if (/tortuga-bay/.test(s)) return "Tortuga Bay, Punta Cana";
  if (/paris/.test(s)) return "Paris";
  return "Dominican Republic";
}

// Title humanisation
function titleEnFromSlug(en) {
  // Convert kebab-case → Title Case + smart abbreviations
  return en
    .split("-")
    .map((w) => {
      if (w === "rd" || w === "dr") return "DR";
      if (w === "rd-en") return "DR";
      if (w === "en") return "EN";
      return titleCase(w);
    })
    .join(" ");
}

// Final title polishing
function buildTitle(enSlug, topic, location) {
  const base = titleEnFromSlug(enSlug);
  const brand = " | Babula Shots";
  const maxLen = 60 - brand.length;
  if (base.length <= maxLen) return base + brand;
  return base.slice(0, maxLen - 1).trim() + "…" + brand;
}

function buildDescription(topic, location, h1) {
  const map = {
    wedding: `Wedding photographer in ${location} — full-day coverage, second shooter, drone option, editorial style. Bilingual ES/EN. Book Babula Shots today.`,
    maternity: `Studio maternity photography in ${location} — Profoto lighting, curated wardrobe, edited delivery in 5-7 days. Book your session with Babula Shots.`,
    quinceanera: `Sweet sixteen / quinceañera photography in ${location} — editorial themed sessions, styling and locations. Bilingual studio Babula Shots.`,
    birthday: `Birthday photographer in ${location} — first birthdays, themed parties and studio sessions. Same-day sneak-peek. Book Babula Shots.`,
    fashion: `Fashion photographer in ${location} — runway, lookbook, editorial and e-commerce coverage with full studio lighting. Babula Shots, bilingual ES/EN.`,
    corporate: `Corporate event photographer in ${location} — conferences, product launches, team portraits, brand events. Babula Shots delivers in 3-5 days.`,
    event: `Event photographer in ${location} — private celebrations, brand activations and cultural events. Same-day sneak-peek. Book Babula Shots.`,
    food: `Food photographer in ${location} — menu, cookbook, restaurant and beverage shoots with full studio and on-location capability. Babula Shots.`,
    drone: `Certified drone pilot in ${location} — DJI Mavic 3 Pro, IDAC compliant, real estate, tourism and event coverage. Babula Shots aerial team.`,
    realestate: `Real estate photographer in ${location} — MLS-grade interiors, drone aerials, walkthrough video. 48-72h turnaround. Babula Shots real estate.`,
    baseball: `Baseball photographer in ${location} — academy headshots, action coverage, showcase reels. Bilingual Babula Shots team.`,
    kitesurf: `Kitesurf photographer in ${location} — long-lens action, drone, water and beach editorial. Babula Shots Caribbean coverage.`,
    portrait: `Portrait photographer in ${location} — editorial studio sessions and on-location portraits. Profoto lighting. Babula Shots studio.`,
    destination: `Destination photographer in ${location} — beach, resort and historical-location sessions. Bilingual coordination. Babula Shots.`,
    "zona-colonial": `Photographer in Zona Colonial Santo Domingo — colonial-architecture sessions for weddings, portraits and pre-boda. Babula Shots.`,
    gallery: `Babula Shots photo gallery — selected studio sessions, weddings, sports and destination work from the Dominican Republic.`,
    pricing: `Photography pricing in ${location} — transparent flat-fee packages for studio, weddings, real estate, drone and events. Babula Shots.`,
    contact: `Contact Babula Shots — bilingual studio in ${location} replying in 24h on WhatsApp. Photo, video and drone services across the Dominican Republic.`,
    video: `Videographer in ${location} — Reels, brand stories, wedding films and event highlights. Babula Shots cinema-grade workflow.`,
    legal: `Babula Shots — policy page covering service terms and conditions for clients in the Dominican Republic and abroad.`,
    studio: `Studio photographer in ${location} — Profoto lighting, prop and wardrobe library, retouched delivery in 5-7 days. Babula Shots.`
  };
  let d = map[topic] || map.studio;
  if (d.length > 160) d = d.slice(0, 157) + "...";
  return d;
}

async function main() {
  const urlMap = JSON.parse(await readFile(`${root}/scrape/raw/url-map.json`, "utf8"));
  const pages = JSON.parse(await readFile(`${root}/scrape/raw/all-pages-original.json`, "utf8"));
  const posts = JSON.parse(await readFile(`${root}/scrape/raw/all-posts-original.json`, "utf8"));
  const allByPath = {};
  for (const p of [...pages, ...posts]) {
    const path = new URL(p.link).pathname;
    allByPath[path] = p;
  }
  // Build EN content for every keep path that has scraped data
  const out = {};
  for (const path of urlMap.keep) {
    const slug = path.replace(/^\/|\/$/g, "");
    if (!slug) continue; // skip "/"
    const p = allByPath[path];
    if (!p) continue;
    const enSlug = SLUG_MAP[slug] || slug;
    const topic = classify(slug);
    const location = locationFromSlug(slug);
    const titleEn = titleEnFromSlug(enSlug);
    const title = buildTitle(enSlug, topic, location);
    const description = buildDescription(topic, location, titleEn);
    const h1 = titleEn;
    const intro = `Native English page for ${titleEn} — by Babula Shots, photographer in ${location}.`;
    const body = bodyHtml(topic, { titleEn, locationHint: location, slug }).trim();
    out[path] = {
      esPath: path,
      enPath: `/en/${enSlug}/`,
      enSlug,
      topic,
      location,
      title,
      description,
      h1,
      intro,
      bodyHtml: body
    };
  }

  // Emit TypeScript file
  const ts = [
    "// AUTO-GENERATED by scrape/build-en-content.mjs — do not edit by hand.",
    "// Re-run that script after changing the slug map or topic templates.",
    "",
    "export type EnContent = {",
    "  esPath: string;",
    "  enPath: string;",
    "  enSlug: string;",
    "  topic: string;",
    "  location: string;",
    "  title: string;",
    "  description: string;",
    "  h1: string;",
    "  intro: string;",
    "  bodyHtml: string;",
    "};",
    "",
    `export const EN_CONTENT: Record<string, EnContent> = ${JSON.stringify(out, null, 2)};`,
    "",
    "export const EN_TO_ES: Record<string, string> = Object.fromEntries(",
    "  Object.values(EN_CONTENT).map((e) => [e.enPath, e.esPath])",
    ");",
    "",
    "export function getEnContent(esPath: string): EnContent | undefined {",
    "  return EN_CONTENT[esPath];",
    "}",
    "",
    "export function getEnContentByEnSlug(enSlug: string): EnContent | undefined {",
    "  return Object.values(EN_CONTENT).find((e) => e.enSlug === enSlug);",
    "}",
    ""
  ].join("\n");

  await writeFile(`${root}/lib/enContent.ts`, ts);
  console.log(`Wrote lib/enContent.ts — ${Object.keys(out).length} EN pages`);
}

main().catch((e) => { console.error(e); process.exit(1); });
