# Babula Shots Parent Rebuild — Brief vs. Stan Wykonania

## 1. Architektura i Hosting

| Wymóg | Status | Notatka |
|---|---|---|
| Repo `git@github.com:fotografosantodomingo/babulashotsrd.com.git` | ⏳ Push pending | Repo istnieje (puste), kod gotowy do `git init && git push` |
| Cloudflare Pages | ✅ Done | Project `babulashotsrd` utworzony, deploy w toku |
| Hub + linki do subdomen | ✅ Done | HomePage ma `card-grid` z bezpośrednimi linkami do estudio/boda/inmo/dron + nav top ma wszystkie 4 jako external links |

## 2. Media i SEO

| Wymóg | Status | Notatka |
|---|---|---|
| Lokalne media `/public/wp-content/uploads/` | ✅ Done | 4185 plików (1.4 GB) — minus 3 oversized .mov (>25MB CF limit) |
| Identyczne ścieżki/nazwy plików | ✅ Done | `/wp-content/uploads/2024/06/foo.webp` zachowane 1:1 |
| ALT z `media.json` | ⚠️ Partial | WpContent renderuje WP HTML 1:1 (alt już jest w `<img alt="">`). Custom React komponenty (HomePage cards, etc.) NIE używają `media.json` — uzupełnię |
| JSON-LD 1:1 z `jsonld.json` | ⚠️ Partial | Nowe strony (HomePage, ContentArticle) emitują FRESH schema. Migrowane WP strony (24 keep) powinny dostać oryginalne JSON-LD. Uzupełnię |

## 3. Cloudflare Workers — Mózg

| Wymóg | Status | Notatka |
|---|---|---|
| Worker na `*://*.babulashotsrd.com/*` | ❌ Blocker | **Wymaga zone CF**. Aktualnie `babulashotsrd.com` jest na Hostinger DNS (`ns1.dns-parking.com`). Bez zone na CF Worker nie może bindować się do route `*.babulashotsrd.com/*` |
| 301 z `url-map.json` | ✅ Done (przez Pages `_redirects`) | 113 reguł w `out/_redirects`. Wykonują się na CF edge przed Pages — funkcjonalnie identyczne z Worker |
| Shared theme cookie `Domain=.babulashotsrd.com` | ❌ Blocker | Wymaga zone CF. Browser odrzuci `Set-Cookie Domain=.babulashotsrd.com` jeśli request szedł przez Hostinger DNS (cross-domain rules) |
| Hreflang | ✅ Done w meta head | Każda strona emituje `<link rel="alternate" hreflang="...">` w metadata. Worker by tylko duplikował |

**Wniosek:** Worker wymaga DNS migration. Plan zakłada migrację jako oddzielną fazę — zaprojektuję Worker code teraz, deploy po migration.

## 4. UI i System Design

| Wymóg | Status | Notatka |
|---|---|---|
| Bright/Dark spójne z subdomenami | ✅ Done | `globals.css` skopiowane z estudio (theme-aware header/footer/article) |
| Globalna nawigacja | ✅ Done | Top nav: Inicio · Estudio · Bodas · Inmobiliaria · Drone · Blog · Contacto. Linki do subdomen są external z proper rel |
| `width`/`height` na obrazach | ⚠️ Partial | WpContent renderuje `<img>` z atrybutami które WordPress dodał (większość ma). Custom `<img>` w HomePage cards NIE mają — uzupełnię |
| `loading="lazy"` | ⚠️ Partial | WP rendered images mają. Custom mają tylko niektóre. Audit + fix |

## 5. Dane Techniczne (Specs)

| Wymóg | Status | Notatka |
|---|---|---|
| Parsowanie specs z `post_content` | ⚠️ Nie aktualne dla parent | Parent nie ma "product specs" pages (1 unclassified Tortuga Bay = destination article, nie spec). Dotyczy bardziej subdomen typu inmobiliaria (specs nieruchomości) — parent jest hub'em bez detail-specs. Pomijam dla parent |

## Co teraz robię (przed DNS migration):

1. **Czekam na koniec deploy** (4180 files upload)
2. **Push do GitHub** `fotografosantodomingo/babulashotsrd.com`
3. **ALT injection z media.json** dla custom komponentów
4. **JSON-LD 1:1** dla 24 keep pages — używam zapisanych bloków z `jsonld.json` zamiast generować nowe
5. **width/height + loading lazy** audit + fix wszystkich custom `<img>`
6. **Worker code** zapisuję do `parent/worker/` — gotowy do deploy po DNS migration

## DNS migration — osobna faza

Wymaga:
1. Konto CF Pages → dodać zone `babulashotsrd.com`
2. CF wygeneruje 2 nameservery (np. `bob.ns.cloudflare.com`, `ada.ns.cloudflare.com`)
3. Login do registrar (gdzie kupiona domena, prawdopodobnie Hostinger lub Namecheap) i zmiana NS
4. Czekać 24-48h na propagację DNS globalnie
5. Po propagacji: zone aktywne → deploy Worker na `*.babulashotsrd.com/*`
6. Theme cookie + cross-domain features działają

Zero downtime jeśli zachowamy A/CNAME records 1:1 podczas migracji.
