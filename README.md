# óSemka – strona www.osemka.info

Wyprawy żeglarskie na stalowym jachcie óSemka. Astro (strona statyczna) + Cloudflare Pages Functions (formularze /api/*) + D1 (baza).

Dokumenty projektu (produkty, symulacja, go-to-market, architektura) są w OneDrive: `8ka-www2026/src/_projekt/`.

## Praca lokalna

```sh
npm install
npm run dev                 # podgląd strony: http://localhost:4321
```

Formularze z bazą danych lokalnie:

```sh
npx wrangler d1 migrations apply osemka --local
npm run build
npx wrangler pages dev dist --port 8788   # http://127.0.0.1:8788
```

## Struktura

| Folder | Zawartość |
|---|---|
| `src/pages/` | podstrony |
| `src/components/` | mapa Pętli, ramka jachtu, wykaz etapów, formularze |
| `src/content/etapy/` | etapy wyprawy (jeden plik = jeden etap) |
| `src/data/site.ts` | dane firmy i jachtu |
| `functions/` | Pages Functions: `/api/lead/`, `/api/kontakt/`, `/api/newsletter/`, przekierowania starych adresów (`_middleware.ts`) |
| `lib/` | logika formularzy: walidacja, zapis w D1, maile (Brevo) |
| `migrations/` | schemat bazy D1 |
| `CONTENT-TODO.md` | treści do potwierdzenia przed publikacją |

## Publikacja

Projekt **Cloudflare Pages** `osemka-www` połączony z GitHubem: każdy push do `main` publikuje stronę (build: `npm run build`, katalog: `dist`, zmienna `NODE_VERSION=24`).

Domena: `www.osemka.info` to rekord CNAME → `osemka-www.pages.dev` w DNS Conetu (DNS i poczta Microsoft 365 zostają bez zmian). `osemka.info` bez www przekierowuje (301) na `https://www.osemka.info` z serwera 82.177.129.18.

- Baza D1 `osemka` (region EEUR), powiązanie `DB` z `wrangler.toml`. Zmiany schematu: nowy plik w `migrations/`, potem `npx wrangler d1 migrations apply osemka --remote`.
- Sekret: `npx wrangler pages secret put BREVO_API_KEY --project-name osemka-www`.

## Zdarzenia Google Analytics (dataLayer)

`newsletter_signup`, `b2b_lead`, `contact_submit` – wysyłane po udanym wysłaniu formularza.
