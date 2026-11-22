// Wspólne narzędzia dla funkcji formularzy (Cloudflare Pages Functions).

import { type MailEnv, sendMail, layout, escapeHtml } from './mail';

export interface Env extends MailEnv {
  DB: D1Database;
  SITE_URL: string;
  OWNER_EMAIL: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

/** Czyta formularz, przycina pola i odrzuca boty (ukryte pole „website”). */
export async function readForm(request: Request) {
  const fd = await request.formData();
  const get = (name: string, max = 500) => String(fd.get(name) ?? '').trim().slice(0, max);
  const isBot = get('website') !== '';
  return { get, isBot };
}

export const isEmail = (v: string) => EMAIL_RE.test(v) && v.length <= 254;

/** Powiadomienie dla kapitana o nowym zgłoszeniu. „Odpowiedz” trafia do nadawcy formularza. */
export async function notifyOwner(env: Env, subject: string, lines: Record<string, string>) {
  const rows = Object.entries(lines)
    .map(([k, v]) => `<p style="margin:0 0 10px"><strong>${escapeHtml(k)}:</strong><br>${escapeHtml(v || '–').replace(/\n/g, '<br>')}</p>`)
    .join('');
  await sendMail(env, {
    to: env.OWNER_EMAIL,
    subject,
    replyTo: lines['E-mail'] && isEmail(lines['E-mail']) ? lines['E-mail'] : undefined,
    html: layout(subject, rows),
  });
}
