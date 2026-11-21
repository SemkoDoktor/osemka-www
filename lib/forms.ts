// Wspólne narzędzia dla funkcji formularzy (Cloudflare Pages Functions).

export interface Env {
  DB: D1Database;
  SITE_URL: string;
  OWNER_EMAIL: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
  BREVO_DOI_TEMPLATE_ID?: string;
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

/** Wysyła mail transakcyjny przez Brevo. Bez klucza API po prostu nic nie robi. */
export async function notifyOwner(env: Env, subject: string, lines: Record<string, string>) {
  if (!env.BREVO_API_KEY) return;
  const html = Object.entries(lines)
    .map(([k, v]) => `<p><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v || '–')}</p>`)
    .join('');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Strona óSemka', email: env.OWNER_EMAIL },
      to: [{ email: env.OWNER_EMAIL }],
      replyTo: lines['E-mail'] ? { email: lines['E-mail'] } : undefined,
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) console.error('Brevo smtp error', res.status, await res.text());
}

/** Zapis z podwójną zgodą: Brevo wysyła mail z linkiem potwierdzającym. */
export async function brevoDoubleOptIn(env: Env, email: string) {
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID || !env.BREVO_DOI_TEMPLATE_ID) return;
  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      includeListIds: [Number(env.BREVO_LIST_ID)],
      templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl: `${env.SITE_URL}/newsletter/potwierdzony/`,
    }),
  });
  if (!res.ok) console.error('Brevo DOI error', res.status, await res.text());
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
