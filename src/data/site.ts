// Dane wspólne dla całej strony.
// Pozycje oznaczone TODO czekają na potwierdzenie (lista w CONTENT-TODO.md).

export const site = {
  name: 'óSemka',
  tagline: 'Wyprawy żeglarskie na stalowym jachcie',
  email: 'kontakt@osemka.info', // TODO: potwierdzić adres skrzynki
  phone: '', // TODO: numer telefonu kapitana (opcjonalnie)
  company: 'óSemka', // TODO: pełna nazwa firmy z CEIDG
  nip: '', // TODO: NIP z CEIDG
  homePort: 'Gdańsk', // TODO: potwierdzić port macierzysty
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
