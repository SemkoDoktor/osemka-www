import type { Env } from '../../../lib/forms';
import { handleKontakt } from '../../../lib/handlers/kontakt';

// POST /api/kontakt/ – formularz kontaktowy
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handleKontakt(request, env);
