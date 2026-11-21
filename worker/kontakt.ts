import { type Env, json, readForm, isEmail, notifyOwner } from '../lib/forms';

// POST /api/kontakt/ – formularz kontaktowy
export async function handleKontakt(request: Request, env: Env): Promise<Response> {
  const { get, isBot } = await readForm(request);
  if (isBot) return json({ ok: true });

  const imie = get('imie', 120);
  const email = get('email', 254);
  const temat = get('temat', 80);
  const tresc = get('tresc', 5000);
  if (!imie || !isEmail(email) || !tresc || get('zgoda') !== 'on') {
    return json({ ok: false, error: 'Uzupełnij imię, poprawny e-mail, wiadomość i zgodę.' }, 400);
  }

  await env.DB.prepare('INSERT INTO messages (imie, email, temat, tresc) VALUES (?, ?, ?, ?)')
    .bind(imie, email, temat, tresc).run();

  await notifyOwner(env, `Wiadomość ze strony: ${temat}`, { Imię: imie, 'E-mail': email, Temat: temat, Wiadomość: tresc });

  return json({ ok: true });
}
