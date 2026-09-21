"use server";

import { postContact } from "@/lib/api";

export type FormState = { status: "idle" | "ok" | "error"; message: string };

/**
 * The contact form's only path to the backend. It runs on the Next server, so
 * the browser posts to Next and Next posts to Express — the API stays private,
 * which is the whole reason api.ts is server-only.
 */
export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();

  const result = await postContact({
    name: read("name"),
    email: read("email"),
    company: read("company") || undefined,
    message: read("message"),
  });

  return result.ok
    ? { status: "ok", message: "Thank you — your enquiry has reached the operations team." }
    : { status: "error", message: result.error };
}
