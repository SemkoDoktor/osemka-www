import type { Env } from '../../../lib/forms';
import { handleLead } from '../../../lib/handlers/lead';

// POST /api/lead/ – zapytanie od firmy
export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handleLead(request, env);
