// Dane wspólne dla całej strony.
// Dane potwierdzone 2026-11-21 (lista w CONTENT-TODO.md).

export const site = {
  name: 'óSemka',
  tagline: 'Wyprawy żeglarskie na stalowym jachcie',
  email: 'kapitan@osemka.info',
  phone: '', // bez telefonu na stronie
  company: 'óSemka Semko Doktór', // nazwa z CEIDG
  nip: '529-146-55-73',
  homePort: 'Hel',
  // Google Analytics 4: identyfikator pomiaru (strumień 16392022514).
  // Skrypt Google ładuje się dopiero po zgodzie w banerze. Pusty = brak skryptów Google.
  ga4Id: 'G-XHGXQ8NWFT',
  // Search Console: kod z metatagu weryfikacyjnego (tylko gdy nie weryfikujemy przez DNS).
  gscVerification: '',
};

export const yacht = {
  name: 'óSemka',
  design: 'Bruce Roberts 434',
  year: 1997,
  hull: 'stal',
  loa: '13,4 m',
  beam: '4,1 m',
  draught: '2,0 m',
  airDraught: '17 m',
  displacement: '16 t',
  engine: 'Ford Lehmann, 60 KM',
  berthsGuests: 6,
};

export const nav = [
  { href: '/wyprawy/', label: 'Wyprawy' },
  { href: '/dla-firm/', label: 'Dla firm' },
  { href: '/jacht/', label: 'Jacht' },
  { href: '/kapitan/', label: 'Kapitan' },
  { href: '/kontakt/', label: 'Kontakt' },
];
