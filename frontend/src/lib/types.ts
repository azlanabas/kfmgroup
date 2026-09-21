/** Shapes served by the Express backend. Mirrors backend/migrations/001_init.sql. */

export type Contract = {
  id: number;
  title: string;
  client: string;
  /** ISO date, or null where the artifact recorded none. */
  term_start: string | null;
  term_end: string | null;
  /** The term as it is set on the page, e.g. "1 Nov 2017 — 31 Dec 2018". */
  term_label: string;
  /** "RM 36,051,575.20", "RM 127,500 per month", or "—" where withheld. */
  value_label: string;
  /** 'live' drives Home cards + Sectors blocks; 'completed' drives the table. */
  status: "live" | "completed";
  /** Sector heading for a live row; null on completed rows. */
  sector: string | null;
  /** Long copy for the Sectors block. */
  summary: string | null;
  /** Short line under the Home card heading. */
  card_note: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
};

export type Person = {
  id: number;
  name: string;
  role: string;
  /** Paragraphs separated by a blank line. */
  bio: string;
  /** 'Directors and shareholders' | 'Management' */
  group_label: string;
  photo_url: string | null;
  sort_order: number;
};

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export type ContactResult = { ok: true; id: number } | { ok: false; error: string };
