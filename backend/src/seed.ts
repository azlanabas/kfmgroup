import { db, DB_PATH } from "./db.ts";
import { CONTRACTS, PEOPLE } from "./seed-data.ts";

/**
 * Replaces the contracts and people tables from seed-data.ts.
 *
 * contact_submissions is NEVER touched — it holds real enquiries and is the
 * only table this app writes to at runtime. Re-running the seed is the
 * supported way to publish a content edit.
 */

const contract = db.prepare(`
  INSERT INTO contracts
    (title, client, term_start, term_end, term_label, value_label,
     status, sector, summary, card_note, image_url, image_alt, sort_order)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const person = db.prepare(`
  INSERT INTO people (name, role, bio, group_label, photo_url, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

db.exec("BEGIN");
try {
  db.exec("DELETE FROM contracts");
  db.exec("DELETE FROM people");
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('contracts','people')");

  for (const c of CONTRACTS) {
    contract.run(
      c.title,
      c.client,
      c.term_start,
      c.term_end,
      c.term_label,
      c.value_label,
      c.status,
      c.sector,
      c.summary,
      c.card_note,
      c.image_url,
      c.image_alt,
      c.sort_order,
    );
  }
  for (const p of PEOPLE) {
    person.run(p.name, p.role, p.bio, p.group_label, p.photo_url, p.sort_order);
  }

  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  console.error("seed FAILED:", err);
  process.exit(1);
}

const counts = db
  .prepare(
    `SELECT (SELECT COUNT(*) FROM contracts) AS contracts,
            (SELECT COUNT(*) FROM people) AS people,
            (SELECT COUNT(*) FROM contact_submissions) AS submissions`,
  )
  .get();

console.log(`seed → ${DB_PATH}`);
console.log(counts);
