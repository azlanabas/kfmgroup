import "server-only";
import type { Contract, ContactPayload, ContactResult, Person } from "./types";

/**
 * The only door to the Express backend. Every caller here runs on the Next
 * server — Server Components for the reads, a Server Action for the contact
 * POST — so the browser never holds API_BASE and never talks to the API
 * directly.
 *
 * Failures are NOT swallowed: a read that cannot reach the backend throws
 * with the URL it tried, so a dead API surfaces as an error page rather than
 * as a page that quietly renders no contracts.
 */
const API_BASE = process.env.API_BASE ?? "http://127.0.0.1:4000";

/**
 * Contracts and people only change when someone edits seed-data.ts and re-runs
 * `npm run seed`, so the reads are cached and revalidated hourly rather than
 * fetched per request (owner decision, 2026-09-22). The pages that use them
 * become ISR instead of force-dynamic, which is what takes the API off the
 * critical path of a page load.
 *
 * ⚠️ A re-seed does NOT appear immediately — it lands at the next
 * revalidation, or on the next deploy. To publish sooner, lower this or call
 * revalidateTag('kfm-content').
 */
const REVALIDATE_SECONDS = 3600;

async function getJson<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS, tags: ["kfm-content"] } });
  } catch (cause) {
    throw new Error(`KFM API unreachable at ${url} — is the backend running?`, { cause });
  }
  if (!res.ok) {
    throw new Error(`KFM API ${res.status} ${res.statusText} for ${url}`);
  }
  return (await res.json()) as T;
}

export function getContracts(): Promise<Contract[]> {
  return getJson<Contract[]>("/api/contracts");
}

export function getPeople(): Promise<Person[]> {
  return getJson<Person[]>("/api/people");
}

export async function postContact(payload: ContactPayload): Promise<ContactResult> {
  const url = `${API_BASE}/api/contact`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "We could not reach the server. Please email us directly." };
  }
  const body = (await res.json().catch(() => null)) as ContactResult | null;
  if (!res.ok || !body) {
    return { ok: false, error: body && "error" in body ? body.error : "Something went wrong. Please try again." };
  }
  return body;
}
