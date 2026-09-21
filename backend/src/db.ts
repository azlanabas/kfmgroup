import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The single SQLite handle.
 *
 * Driver is the built-in `node:sqlite` (verified on Node v26.5.0, 2026-09-22)
 * — no native dependency, nothing to compile, so better-sqlite3 is not needed.
 *
 * The file lives at the PROJECT root, ../../data/kfm.db, not under backend/ —
 * owner decision 2026-09-22: the database belongs to the app, not to the
 * service that happens to open it. Override with DB_PATH.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB = path.resolve(here, "..", "..", "data", "kfm.db");

export const DB_PATH = process.env.DB_PATH ?? DEFAULT_DB;

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

// WAL keeps the reads the site does off the writer's back; foreign_keys is
// off by default in SQLite and has to be asked for per connection.
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");
