import { Router } from "express";
import { db } from "../db.ts";

export const contactRouter = Router();

const insert = db.prepare(`
  INSERT INTO contact_submissions (name, email, company, message, ip)
  VALUES (?, ?, ?, ?, ?)
`);

const LIMITS = { name: 200, email: 320, company: 200, message: 5000 } as const;

/** Deliberately permissive — enough structure to be an address, no more. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** POST /api/contact — the site's only write path. */
contactRouter.post("/", (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const company = clean(body.company, LIMITS.company);
  const message = clean(body.message, LIMITS.message);

  if (!name) return res.status(400).json({ ok: false, error: "Please give us a name." });
  if (!EMAIL.test(email)) {
    return res.status(400).json({ ok: false, error: "That email address does not look right." });
  }
  if (message.length < 10) {
    return res.status(400).json({ ok: false, error: "Please tell us a little more." });
  }

  try {
    const { lastInsertRowid } = insert.run(
      name,
      email,
      company || null,
      message,
      req.ip ?? null,
    );
    return res.status(201).json({ ok: true, id: Number(lastInsertRowid) });
  } catch (err) {
    console.error("contact insert failed:", err);
    return res.status(500).json({ ok: false, error: "We could not record that. Please try again." });
  }
});
