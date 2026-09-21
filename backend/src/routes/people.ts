import { Router } from "express";
import { db } from "../db.ts";

export const peopleRouter = Router();

const all = db.prepare(`
  SELECT id, name, role, bio, group_label, photo_url, sort_order
  FROM people
  ORDER BY sort_order, id
`);

/** GET /api/people — directors and shareholders, then management. */
peopleRouter.get("/", (_req, res) => {
  res.json(all.all());
});
