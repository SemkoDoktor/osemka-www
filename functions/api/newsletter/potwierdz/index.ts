import type { Env } from '../../../../lib/forms';
import { handleConfirm } from '../../../../lib/handlers/newsletter';

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => handleConfirm(request, env);
