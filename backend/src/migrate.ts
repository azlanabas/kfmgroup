import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, DB_PATH } from "./db.ts";

/**
 * Runs every .sql file in ../migrations in name order, each inside its own
 * transaction, and records the filename in schema_migrations so a second run
 * is a no-op. Deliberately dumb — there is no down-migration, because the
 * content in this database is seeded from a file and can be rebuilt.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS = path.resolve(here, "..", "migrations");

db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  filename   TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const applied = new Set(
  db
    .prepare("SELECT filename FROM schema_migrations")
    .all()
    .map((r) => (r as { filename: string }).filename),
);

const files = fs
  .readdirSync(MIGRATIONS)
  .filter((f) => f.endsWith(".sql"))
  .sort();

let ran = 0;
for (const file of files) {
  if (applied.has(file)) continue;
  const sql = fs.readFileSync(path.join(MIGRATIONS, file), "utf8");
  db.exec("BEGIN");
  try {
    db.exec(sql);
    db.prepare("INSERT INTO schema_migrations (filename) VALUES (?)").run(file);
    db.exec("COMMIT");
    console.log(`applied ${file}`);
    ran++;
  } catch (err) {
    db.exec("ROLLBACK");
    console.error(`FAILED ${file}:`, err);
    process.exit(1);
  }
}

console.log(`migrate: ${ran} applied, ${files.length - ran} already present → ${DB_PATH}`);
