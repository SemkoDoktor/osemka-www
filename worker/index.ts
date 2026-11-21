// Cloudflare Worker: obsługuje /api/* (formularze), resztę serwuje z plików strony (dist/).
import { type Env, json } from '../lib/forms';
import { handleLead } from './lead';
import { handleKontakt } from './kontakt';
import { handleNewsletter } from './newsletter';

type Handler = (request: Request, env: Env) => Promise<Response>;

const routes: Record<string, Handler> = {
  '/api/lead/': handleLead,
  '/api/kontakt/': handleKontakt,
  '/api/newsletter/': handleNewsletter,
};

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
      const handler = routes[path];
      if (!handler) return json({ ok: false, error: 'Nie ma takiego adresu.' }, 404);
      if (request.method !== 'POST') return json({ ok: false, error: 'Dozwolona tylko metoda POST.' }, 405);
      try {
        return await handler(request, env);
      } catch (err) {
        console.error('form error', path, err);
        return json({ ok: false, error: 'Błąd serwera. Spróbuj ponownie za chwilę.' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env & { ASSETS: Fetcher }>;
