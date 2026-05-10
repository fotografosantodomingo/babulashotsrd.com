// Minimal {slug, name} extracts of WP categories + tags, importable from
// client components (no node:fs). Adds an EN translation per category/tag —
// `nameEn` is used when the page lang is "en".
import categoriesJson from "@/scrape/raw/categories.json";
import tagsJson from "@/scrape/raw/tags.json";

type TaxRow = { slug: string; name: string; nameEn?: string };

// Category EN labels — hand-translated to avoid Spanish leaking into EN pages.
const CATEGORY_EN: Record<string, string> = {
  "aniversary-boda-pre-boda": "Anniversary, Wedding, Pre-wedding",
  "contenido-profesional": "Professional content",
  "happy-b-day": "Birthdays",
  "fotografo-de-deportes": "Sports photography",
  "estudio-santo-domingoo": "Santo Domingo studio",
  "eventos": "Events",
  "fashion": "Fashion (Santo Domingo)",
  "fotografia-exterior": "Outdoor photography",
  "session-de-fotos": "Photo sessions",
  "uncategorized": "Uncategorised"
};

// Tag EN labels — translate the most common ones. Anything not present falls
// back to the original (mostly slug-shaped tags that read OK in EN).
// IMPORTANT: every tag containing Spanish words must be translated so EN
// pages don't render Spanish-only labels in the footer chip list.
const TAG_EN: Record<string, string> = {
  "contenido-profesional": "Professional content",
  "contenido-en-el-beisbol": "Baseball content",
  "creando-contenido-para-redes": "Content creation for social media",
  "cinematografico": "Cinematic",
  "boda-playa": "Beach wedding",
  "boda-punta-cana": "Punta Cana wedding",
  "boda-rd": "Wedding DR",
  "birthday-protographer-santo-domingo": "Birthday photographer Santo Domingo",
  "beach-couple-photography": "Beach couple photography",
  "beach-photo-session-punta-cana": "Beach photo session Punta Cana",
  "caribbean-photographer": "Caribbean photographer",
  "couple-photo-session": "Couple photo session",
  "fotografia": "Photography",
  "fotografo": "Photographer",
  "fotografo-bodas": "Wedding photographer",
  "fotografo-santo-domingo": "Photographer Santo Domingo",
  "fotografia-de-bodas": "Wedding photography",
  "boda": "Wedding",
  "bodas": "Weddings",
  "pre-boda": "Pre-wedding / engagement",
  "estudio": "Studio",
  "sesion-de-fotos": "Photo session",
  "punta-cana": "Punta Cana",
  "santo-domingo": "Santo Domingo",
  "zona-colonial": "Zona Colonial",
  "las-terrenas": "Las Terrenas",
  "cabarete": "Cabarete",
  "casa-de-campo": "Casa de Campo",
  "alimentos-y-bebidas": "Food and beverage",
  "cumpleanos": "Birthday",
  "quinceanera": "Sweet sixteen",
  "embarazo": "Maternity",
  "retrato": "Portrait",
  "retratos": "Portraits",
  "fashion-photographer": "Fashion photographer",
  "wedding": "Wedding",
  "wedding-photographer": "Wedding photographer",
  "anniversary-session": "Anniversary session",
  "engagement-session": "Engagement session",
  "destination-wedding": "Destination wedding",
  "beach": "Beach",
  "drone": "Drone",
  "real-estate": "Real estate",
  "inmobiliaria": "Real estate",
  "baseball": "Baseball",
  "beisbol": "Baseball",
  "video": "Video",
  "reel": "Reel",
  "videografo": "Videographer",
  "eventos": "Events",
  "eventos-corporativos": "Corporate events",
  "corporate": "Corporate",
  "corporate-portraits": "Corporate portraits",
  "headshots": "Headshots",
  "moda": "Fashion",
  "comida": "Food",
  "producto": "Product",
  "republica-dominicana": "Dominican Republic"
};

export const categories: TaxRow[] = (categoriesJson as TaxRow[]).map((c) => ({
  slug: c.slug,
  name: c.name,
  nameEn: CATEGORY_EN[c.slug] ?? c.name
}));

export const tags: TaxRow[] = (tagsJson as TaxRow[]).map((t) => ({
  slug: t.slug,
  name: t.name,
  nameEn: TAG_EN[t.slug] ?? t.name
}));
