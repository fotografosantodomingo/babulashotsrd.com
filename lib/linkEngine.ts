// ============================================================
// Shared semantic internal-linking engine (babula network).
// Pure, dependency-free — copy this file verbatim into each repo.
// A per-site adapter builds PageNode[] from that site's data; this
// scores relevance and emits the related-link mix the SEO plan wants.
// ============================================================

export type PageNode = {
  url: string;
  locale: "es" | "en";
  /** post | page | article | service | location | pillar | faq | guide | city | cluster */
  type: string;
  title: string;
  /** raw phrases/tags/keywords — tokenized + accent-stripped internally */
  keywords: string[];
  service?: string;
  location?: string;
  cluster?: string;
  excerpt?: string;
};

export type RelatedLink = { url: string; title: string; type: string; score: number };
export type RelatedOpts = { limit?: number; minScore?: number };

// Bilingual stopwords — kept short on purpose (only the highest-frequency glue words).
const STOP = new Set(
  ("de la el los las un una unos unas y o a en con por para del al lo le su sus es son " +
    "the of and to in for with your you our we is are a an on at by from this that " +
    "fotografo fotografia foto fotos photo photos photography photographer")
    .split(" ")
);

export function tokenize(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

function keywordSet(n: PageNode): Set<string> {
  const out = new Set<string>();
  for (const k of n.keywords) for (const t of tokenize(k)) out.add(t);
  for (const t of tokenize(n.title)) out.add(t);
  return out;
}

/** Relevance score of candidate `b` for target `a` (aKeys precomputed for speed). */
export function scorePair(a: PageNode, aKeys: Set<string>, b: PageNode): number {
  if (a.url === b.url || a.locale !== b.locale) return -1;
  let s = 0;
  const bKeys = keywordSet(b);
  let shared = 0;
  for (const k of bKeys) if (aKeys.has(k)) shared++;
  s += shared * 3;
  if (a.service && a.service === b.service) s += 5;
  if (a.location && a.location === b.location) s += 5;
  if (a.cluster && a.cluster === b.cluster) s += 6;
  // Mild pull toward authority/conversion pages so the mix isn't all blog↔blog.
  if (b.type === "pillar") s += 3;
  else if (b.type === "service" || b.type === "location") s += 2;
  return s;
}

/** Top related pages for `target`, highest score first. */
export function relatedFor(target: PageNode, all: PageNode[], opts: RelatedOpts = {}): RelatedLink[] {
  const limit = opts.limit ?? 6;
  const minScore = opts.minScore ?? 1;
  const aKeys = keywordSet(target);
  const scored: RelatedLink[] = [];
  for (const b of all) {
    const sc = scorePair(target, aKeys, b);
    if (sc >= minScore) scored.push({ url: b.url, title: b.title, type: b.type, score: sc });
  }
  scored.sort((x, y) => y.score - x.score || a_tiebreak(x, y));
  return scored.slice(0, limit);
}

// Stable tiebreak so builds are deterministic when scores tie.
function a_tiebreak(x: RelatedLink, y: RelatedLink): number {
  return x.url < y.url ? -1 : x.url > y.url ? 1 : 0;
}

/** Audit: inbound-link counts + orphan list under the same scoring rules. */
export function auditGraph(all: PageNode[], opts: RelatedOpts = {}) {
  const inbound = new Map<string, number>();
  for (const n of all) inbound.set(n.url, 0);
  for (const n of all) {
    for (const r of relatedFor(n, all, opts)) {
      inbound.set(r.url, (inbound.get(r.url) || 0) + 1);
    }
  }
  const orphans: string[] = [];
  const weak: string[] = [];
  for (const [url, count] of inbound) {
    if (count === 0) orphans.push(url);
    else if (count === 1) weak.push(url);
  }
  return { total: all.length, orphans, weak, inbound };
}
