-- Własne potwierdzanie zapisu (podwójna zgoda) zamiast Brevo.
-- W bazie trzymamy tylko skrót SHA-256 tokenu z linku, nie sam token.
ALTER TABLE newsletter ADD COLUMN token_hash TEXT;
ALTER TABLE newsletter ADD COLUMN token_sent_at TEXT;
ALTER TABLE newsletter ADD COLUMN confirmed_at TEXT;
ALTER TABLE newsletter ADD COLUMN unsubscribed_at TEXT;
CREATE INDEX IF NOT EXISTS newsletter_token ON newsletter (token_hash);
