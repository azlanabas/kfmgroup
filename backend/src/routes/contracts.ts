import { Router } from "express";
import { db } from "../db.ts";

export const contractsRouter = Router();

const all = db.prepare(`
  SELECT id, title, client, term_start, term_end, term_label, value_label,
         status, sector, summary, card_note, image_url, image_alt, sort_order
  FROM contracts
  ORDER BY sort_order, id
`);

const byStatus = db.prepare(`
  SELECT id, title, client, term_start, term_end, term_label, value_label,
         status, sector, summary, card_note, image_url, image_alt, sort_order
  FROM contracts
  WHERE status = ?
  ORDER BY sort_order, id
`);

/** GET /api/contracts[?status=live|completed] */
contractsRouter.get("/", (req, res) => {
  const status = req.query.status;
  if (status === undefined) return res.json(all.all());
  if (status !== "live" && status !== "completed") {
    return res.status(400).json({ error: "status must be 'live' or 'completed'" });
  }
  return res.json(byStatus.all(status));
});
