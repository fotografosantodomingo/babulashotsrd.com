// Auto-build ES ↔ EN mirror map from the generated EN_CONTENT table.
// Manual overrides (homepage, etc.) merge on top.
import { EN_CONTENT } from "@/lib/enContent";

const MANUAL_ES_TO_EN: Record<string, string> = {
  "/": "/en/",
  // KILL_SLUGS paths — no parent EN mirror (slug collides with subdomain
  // canonical). Route to the estudio subdomain EN hub.
  "/sesion-de-fotos/": "https://estudio.babulashotsrd.com/en/",
  "/session-de-fotos-santo-domingo-estudio/": "https://estudio.babulashotsrd.com/en/",
  "/estudio/": "https://estudio.babulashotsrd.com/en/"
};

const ES_TO_EN: Record<string, string> = {
  ...MANUAL_ES_TO_EN,
  ...Object.fromEntries(Object.values(EN_CONTENT).map((c) => [c.esPath, c.enPath]))
};

const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ES_TO_EN).map(([es, en]) => [en, es])
);

export function getEnMirror(esPath: string): string {
  return ES_TO_EN[esPath] ?? "/en/";
}

export function getEsMirror(enPath: string): string {
  return EN_TO_ES[enPath] ?? "/";
}
