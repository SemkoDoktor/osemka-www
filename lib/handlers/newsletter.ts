import { type Env, json, readForm, isEmail } from '../forms';
import { sendMail, layout, button } from '../mail';

const CONSENT = 'Chcę dostawać newsletter óSemki. Zgodę mogę wycofać w każdej chwili.';
const TOKEN_DAYS = 7;       // ważność linku potwierdzającego
const RESEND_MINUTES = 10;  // nie wysyłamy ponownie częściej (ochrona przed nadużyciem)

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

type Row = { confirmed_at: string | null; unsubscribed_at: string | null; token_sent_at: string | null };

// POST /api/newsletter/ – zapis do „Dziennika pokładowego” z podwójną zgodą.
// Odpowiedź jest zawsze taka sama, żeby formularz nie zdradzał, kto już jest na liście.
export async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  const { get, isBot } = await readForm(request);
  if (isBot) return json({ ok: true });

  const email = get('email', 254).toLowerCase();
  if (!isEmail(email) || get('zgoda') !== 'on') {
    return json({ ok: false, error: 'Podaj poprawny e-mail i zaznacz zgodę.' }, 400);
  }

  const row = await env.DB.prepare('SELECT confirmed_at, unsubscribed_at, token_sent_at FROM newsletter WHERE email = ?')
    .bind(email).first<Row>();

  if (row?.confirmed_at && !row.unsubscribed_at) return json({ ok: true });
  if (row?.token_sent_at && Date.parse(row.token_sent_at + 'Z') > Date.now() - RESEND_MINUTES * 60_000) {
    return json({ ok: true });
  }

  const token = newToken();
  const hash = await sha256(token);
  const referer = (request.headers.get('referer') ?? '').slice(0, 300);

  await env.DB.prepare(
    `INSERT INTO newsletter (email, zrodlo, consent_text, token_hash, token_sent_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(email) DO UPDATE SET token_hash = excluded.token_hash, token_sent_at = excluded.token_sent_at,
       consent_text = excluded.consent_text, zrodlo = excluded.zrodlo, unsubscribed_at = NULL, confirmed_at = NULL`,
  ).bind(email, referer, CONSENT, hash).run();

  // Link prowadzi na stronę z przyciskiem (POST), bo skanery poczty (np. Safe Links)
  // otwierają linki same i potwierdzałyby zapis bez udziału człowieka.
  const link = `${env.SITE_URL}/newsletter/potwierdz/?t=${token}`;
  await sendMail(env, {
    to: email,
    subject: 'Potwierdź zapis do Dziennika pokładowego',
    html: layout(
      'Potwierdź zapis',
      `<p>Ktoś (pewnie Ty) zapisał ten adres do Dziennika pokładowego óSemki: raz w miesiącu nowe etapy wyprawy, relacje z rejsów i pierwszeństwo zapisów.</p>
       ${button(link, 'Potwierdzam zapis')}
       <p style="font-size:14px;color:#55656e">Link działa przez ${TOKEN_DAYS} dni. Jeśli to nie Ty, zignoruj tę wiadomość: bez kliknięcia nie wyślemy niczego więcej.</p>`,
    ),
  });

  return json({ ok: true });
}

// POST /api/newsletter/potwierdz/ – przycisk „Potwierdzam” na stronie /newsletter/potwierdz/
export async function handleConfirm(request: Request, env: Env): Promise<Response> {
  const fd = await request.formData();
  const token = String(fd.get('t') ?? '');
  const go = (path: string) => Response.redirect(`${env.SITE_URL}${path}`, 302);
  if (token.length < 20 || token.length > 64) return go('/newsletter/link-niewazny/');

  const hash = await sha256(token);
  const res = await env.DB.prepare(
    `UPDATE newsletter SET confirmed_at = datetime('now'), token_hash = NULL
     WHERE token_hash = ? AND token_sent_at > datetime('now', ?)`,
  ).bind(hash, `-${TOKEN_DAYS} days`).run();

  return go(res.meta.changes ? '/newsletter/potwierdzony/' : '/newsletter/link-niewazny/');
}
