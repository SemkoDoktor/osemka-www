// Stare adresy WordPressa z osemka.info (?p=123, ?cat=6, ?page_id=660, ?paged=2).
// Do czasu migracji archiwum (Faza 3) prowadzą na stronę główną przekierowaniem tymczasowym (302).
// Po migracji podmienimy to na mapę: stary ID → nowy adres, z przekierowaniem stałym (301).
const LEGACY_PARAMS = ['p', 'cat', 'page_id', 'paged', 'author', 'tag', 'm', 's'];

export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  if (url.pathname === '/' && LEGACY_PARAMS.some((k) => url.searchParams.has(k))) {
    return Response.redirect(new URL('/', url).toString(), 302);
  }
  if (url.pathname.startsWith('/wp-') || url.pathname === '/feed/' || url.pathname === '/xmlrpc.php') {
    return Response.redirect(new URL('/', url).toString(), 302);
  }
  return next();
};
