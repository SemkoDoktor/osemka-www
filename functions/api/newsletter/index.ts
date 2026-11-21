import type { Env } from '../../../lib/forms';
import { handleNewsletter } from '../../../lib/handlers/newsletter';

// POST /api/newsletter/ – zapis do newslettera (podwójna zgoda)
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handleNewsletter(request, env);
