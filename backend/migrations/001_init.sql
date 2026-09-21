-- KFM Group content API — initial schema.
-- Applied by `npm run migrate`, which runs every .sql file in this folder in
-- name order inside one transaction and records it in schema_migrations.

CREATE TABLE IF NOT EXISTS contracts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  client      TEXT    NOT NULL,
  -- ISO dates where the artifact stated one; NULL where it did not.
  term_start  TEXT,
  term_end    TEXT,
  -- The term exactly as it is set on the page, e.g. "1 Nov 2017 — 31 Dec 2018".
  term_label  TEXT    NOT NULL,
  -- "RM 36,051,575.20", "RM 127,500 per month", or "—" where withheld.
  value_label TEXT    NOT NULL,
  -- 'live' rows drive the Home cards and the Sectors detail blocks;
  -- 'completed' rows drive the Completed contracts table on Sectors.
  status      TEXT    NOT NULL CHECK (status IN ('live', 'completed')),
  -- Sector heading a live row sits under; NULL for completed rows.
  sector      TEXT,
  -- Long copy for the Sectors detail block; short line for the Home card.
  summary     TEXT,
  card_note   TEXT,
  image_url   TEXT,
  image_alt   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS people (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  role        TEXT    NOT NULL,
  -- Paragraphs joined by a blank line; the People page splits on it.
  bio         TEXT    NOT NULL,
  -- 'Directors and shareholders' | 'Management'
  group_label TEXT    NOT NULL,
  -- NULL for the one person the artifact carried without a portrait.
  photo_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  company    TEXT,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ip         TEXT
);

CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status, sort_order);
CREATE INDEX IF NOT EXISTS idx_people_group ON people (group_label, sort_order);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at DESC);
