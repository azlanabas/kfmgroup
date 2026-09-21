import express from "express";
import cors from "cors";
import { db, DB_PATH } from "./db.ts";
import { contractsRouter } from "./routes/contracts.ts";
import { peopleRouter } from "./routes/people.ts";
import { contactRouter } from "./routes/contact.ts";

/**
 * KFM Group content API.
 *
 * Two processes, two ports (owner decision #3): this serves JSON only, and
 * the Next.js frontend calls it from Server Components, so the browser never
 * reaches it directly. CORS is therefore closed by default — set CORS_ORIGIN
 * if you ever do want a browser to call it.
 */

const PORT = Number(process.env.PORT ?? 4000);
const HOST = process.env.HOST ?? "127.0.0.1";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "64kb" }));

if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) }));
}

app.get("/api/health", (_req, res) => {
  try {
    const row = db.prepare("SELECT COUNT(*) AS n FROM contracts").get() as { n: number };
    res.json({ ok: true, db: DB_PATH, contracts: row.n, uptime: process.uptime() });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.use("/api/contracts", contractsRouter);
app.use("/api/people", peopleRouter);
app.use("/api/contact", contactRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

const server = app.listen(PORT, HOST, () => {
  console.log(`KFM API listening on http://${HOST}:${PORT} — db ${DB_PATH}`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
  });
}
