-- Zapytania od firm (Produkt B „Wachta Zarządu”)
CREATE TABLE IF NOT EXISTS leads_b2b (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  imie TEXT NOT NULL,
  firma TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT,
  rola TEXT,
  termin TEXT,
  cel TEXT,
  zrodlo TEXT,
  status TEXT NOT NULL DEFAULT 'nowy'
);

-- Wiadomości z formularza kontaktowego
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  imie TEXT NOT NULL,
  email TEXT NOT NULL,
  temat TEXT,
  tresc TEXT NOT NULL
);

-- Zapisy do newslettera (zgoda + potwierdzenie przez Brevo, podwójna zgoda)
CREATE TABLE IF NOT EXISTS newsletter (
  email TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  zrodlo TEXT,
  consent_text TEXT NOT NULL
);
