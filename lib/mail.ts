// Wysyłka maili przez Microsoft 365 (Graph API, uprawnienie aplikacji Mail.Send
// ograniczone w Exchange Online do jednej skrzynki: MAIL_FROM).
// Bez MS_CLIENT_SECRET nic nie wysyłamy, tylko logujemy (lokalnie i przed konfiguracją).

export interface MailEnv {
  MS_TENANT_ID?: string;
  MS_CLIENT_ID?: string;
  MS_CLIENT_SECRET?: string;
  MAIL_FROM?: string;
}

export interface Mail {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

let cached: { token: string; expires: number } | null = null;

async function graphToken(env: Required<MailEnv>): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const res = await fetch(`https://login.microsoftonline.com/${env.MS_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.MS_CLIENT_ID,
      client_secret: env.MS_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default',
    }),
  });
  if (!res.ok) throw new Error(`Entra token ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

/** Wysyła jeden mail. Zwraca true, jeśli Graph przyjął wiadomość. Błędy tylko loguje. */
export async function sendMail(env: MailEnv, mail: Mail): Promise<boolean> {
  const { MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MAIL_FROM } = env;
  if (!MS_TENANT_ID || !MS_CLIENT_ID || !MS_CLIENT_SECRET || !MAIL_FROM) {
    console.log('[mail] brak konfiguracji M365, pomijam:', mail.subject, '→', mail.to);
    return false;
  }
  try {
    const token = await graphToken({ MS_TENANT_ID, MS_CLIENT_ID, MS_CLIENT_SECRET, MAIL_FROM });
    const res = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(MAIL_FROM)}/sendMail`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        message: {
          subject: mail.subject,
          body: { contentType: 'HTML', content: mail.html },
          toRecipients: [{ emailAddress: { address: mail.to } }],
          replyTo: mail.replyTo ? [{ emailAddress: { address: mail.replyTo } }] : [],
        },
        saveToSentItems: false,
      }),
    });
    if (res.status !== 202) {
      console.error('[mail] Graph sendMail', res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('[mail] błąd wysyłki', e);
    return false;
  }
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/** Prosty, czytelny szablon w kolorach strony (granat, magenta, biel morza). */
export function layout(title: string, inner: string): string {
  return `<!doctype html><html lang="pl"><body style="margin:0;background:#f6f8f7;padding:24px 12px;font-family:Georgia,serif;color:#15273f">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border-top:4px solid #15273f">
<tr><td style="padding:28px 28px 8px;font-family:Arial,sans-serif;font-weight:800;font-size:20px;letter-spacing:-0.01em">óSemka</td></tr>
<tr><td style="padding:0 28px 28px;font-size:17px;line-height:1.55">
<h1 style="font-family:Arial,sans-serif;font-size:24px;line-height:1.2;margin:12px 0 16px">${escapeHtml(title)}</h1>
${inner}
</td></tr></table>
<p style="max-width:560px;margin:16px auto 0;font-family:Arial,sans-serif;font-size:12px;color:#55656e;text-align:center">óSemka · wyprawy żeglarskie · www.osemka.info</p>
</body></html>`;
}

export function button(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="display:inline-block;background:#a1185a;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-weight:700;padding:12px 22px">${escapeHtml(label)}</a></p>`;
}
