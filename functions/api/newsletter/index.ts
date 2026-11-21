import { type Env, json, readForm, isEmail, brevoDoubleOptIn } from '../../../lib/forms';

const CONSENT = 'Chcę dostawać newsletter óSemki. Zgodę mogę wycofać w każdej chwili.';

// POST /api/newsletter/ – zapis do „Dziennika pokładowego” (podwójna zgoda przez Brevo)
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { get, isBot } = await readForm(request);
  if (isBot) return json({ ok: true });

  const email = get('email', 254).toLowerCase();
  if (!isEmail(email) || get('zgoda') !== 'on') {
    return json({ ok: false, error: 'Podaj poprawny e-mail i zaznacz zgodę.' }, 400);
  }

  const referer = request.headers.get('referer') ?? '';
  await env.DB.prepare(
    'INSERT INTO newsletter (email, zrodlo, consent_text) VALUES (?, ?, ?) ON CONFLICT(email) DO NOTHING',
  ).bind(email, referer.slice(0, 300), CONSENT).run();

  await brevoDoubleOptIn(env, email);

  return json({ ok: true });
};
