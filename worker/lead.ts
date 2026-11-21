import { type Env, json, readForm, isEmail, notifyOwner } from '../lib/forms';

// POST /api/lead/ – zapytanie od firmy (Produkt B)
export async function handleLead(request: Request, env: Env): Promise<Response> {
  const { get, isBot } = await readForm(request);
  if (isBot) return json({ ok: true });

  const data = {
    imie: get('imie', 120),
    firma: get('firma', 160),
    email: get('email', 254),
    telefon: get('telefon', 40),
    rola: get('rola', 80),
    termin: get('termin', 80),
    cel: get('cel', 3000),
    zrodlo: get('zrodlo', 80),
  };
  if (!data.imie || !data.firma || !isEmail(data.email) || get('zgoda') !== 'on') {
    return json({ ok: false, error: 'Uzupełnij imię, firmę, poprawny e-mail i zgodę.' }, 400);
  }

  await env.DB.prepare(
    `INSERT INTO leads_b2b (imie, firma, email, telefon, rola, termin, cel, zrodlo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(data.imie, data.firma, data.email, data.telefon, data.rola, data.termin, data.cel, data.zrodlo).run();

  await notifyOwner(env, `Zapytanie od firmy: ${data.firma}`, {
    'Imię i nazwisko': data.imie,
    Firma: data.firma,
    'E-mail': data.email,
    Telefon: data.telefon,
    Rola: data.rola,
    Termin: data.termin,
    Cel: data.cel,
  });

  return json({ ok: true });
}
