/**
 * Mirrors the project's media library into public/ so Next can serve it.
 *
 * The source of truth is ../media at the project root (owner decision,
 * 2026-09-22) — shared between frontend and backend and versioned there.
 * Next only serves files under public/, so predev and prebuild copy the tree
 * to public/media, which is gitignored as generated output. Runs on every
 * dev/build start, so adding a photograph to ../media is enough.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(here, "..", "..", "media");
const DEST = path.resolve(here, "..", "public", "media");

if (!fs.existsSync(SRC)) {
  console.error(`sync-media: no media library at ${SRC}`);
  process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(SRC, DEST, { recursive: true });

const count = fs.readdirSync(DEST, { recursive: true }).filter((f) => path.extname(String(f))).length;
console.log(`sync-media: ${count} files → public/media`);
