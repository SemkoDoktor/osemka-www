# óSemka – strona www.osemka.info

Wyprawy żeglarskie na stalowym jachcie óSemka. Astro (strona statyczna) + Cloudflare Pages Functions (formularze) + D1 (baza).

Dokumenty projektu (produkty, symulacja, go-to-market, architektura) są w OneDrive: `8ka-www2026/src/_projekt/`.

## Praca lokalna

```sh
npm install
npm run dev                 # podgląd strony: http://localhost:4321
```

Formularze z bazą danych lokalnie:

```sh
npm run build
npx wrangler d1 migrations apply osemka --local
npx wrangler pages dev dist --port 8788   # http://127.0.0.1:8788
```

## Struktura

| Folder | Zawartość |
|---|---|
| `src/pages/` | podstrony |
| `src/components/` | mapa Pętli, ramka jachtu, wykaz etapów, formularze |
| `src/content/etapy/` | etapy wyprawy (jeden plik = jeden etap) |
| `src/data/site.ts` | dane firmy i jachtu |
| `functions/api/` | backend formularzy: `/api/lead/`, `/api/kontakt/`, `/api/newsletter/` |
| `migrations/` | schemat bazy D1 |
| `CONTENT-TODO.md` | treści do potwierdzenia przed publikacją |

## Publikacja

Każdy push do gałęzi `main` na GitHubie publikuje stronę przez Cloudflare Pages. Inne gałęzie dostają podgląd pod osobnym adresem.

Ustawienia projektu w Cloudflare Pages:
- Build command: `npm run build`
- Build output: `dist`
- Zmienne: z `wrangler.toml`; sekret `BREVO_API_KEY` ustawiany w panelu.
- Powiązanie D1: `DB` → baza `osemka`.

## Zdarzenia Google Analytics (dataLayer)

`newsletter_signup`, `b2b_lead`, `contact_submit` – wysyłane po udanym wysłaniu formularza.
