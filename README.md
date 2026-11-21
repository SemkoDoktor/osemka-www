# óSemka – strona www.osemka.info

Wyprawy żeglarskie na stalowym jachcie óSemka. Astro (strona statyczna) + Cloudflare Worker (formularze /api/*) + D1 (baza).

Dokumenty projektu (produkty, symulacja, go-to-market, architektura) są w OneDrive: `8ka-www2026/src/_projekt/`.

## Praca lokalna

```sh
npm install
npm run dev                 # podgląd strony: http://localhost:4321
```

Formularze z bazą danych lokalnie:

```sh
npx wrangler d1 migrations apply osemka --local
npx wrangler dev --port 8788   # buduje stronę i uruchamia Workera: http://127.0.0.1:8788
```

## Struktura

| Folder | Zawartość |
|---|---|
| `src/pages/` | podstrony |
| `src/components/` | mapa Pętli, ramka jachtu, wykaz etapów, formularze |
| `src/content/etapy/` | etapy wyprawy (jeden plik = jeden etap) |
| `src/data/site.ts` | dane firmy i jachtu |
| `worker/` | Cloudflare Worker: formularze `/api/lead/`, `/api/kontakt/`, `/api/newsletter/` |
| `lib/forms.ts` | walidacja, zapis, wysyłka maili (Brevo) |
| `migrations/` | schemat bazy D1 |
| `CONTENT-TODO.md` | treści do potwierdzenia przed publikacją |

## Publikacja

Projekt Cloudflare Workers `osemka-www` jest połączony z repozytorium GitHub. Każdy push do `main` uruchamia budowę (`npm run build` z `wrangler.toml`) i `npx wrangler deploy`.

- Baza D1 `osemka` (region EEUR), powiązanie `DB`. Zmiany schematu: nowy plik w `migrations/`, potem `npx wrangler d1 migrations apply osemka --remote`.
- Sekret: `npx wrangler secret put BREVO_API_KEY`.

## Zdarzenia Google Analytics (dataLayer)

`newsletter_signup`, `b2b_lead`, `contact_submit` – wysyłane po udanym wysłaniu formularza.
