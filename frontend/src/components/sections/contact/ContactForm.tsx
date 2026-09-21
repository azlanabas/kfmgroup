"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type FormState } from "@/app/contact/actions";
import { Kicker } from "@/components/Kicker";

const INITIAL: FormState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? "Sending…" : "Send enquiry"}
    </button>
  );
}

/**
 * The site's only write path. Posts through a Server Action, which calls the
 * Express API — the browser never sees API_BASE.
 */
export function ContactForm() {
  const [state, action] = useActionState(submitContact, INITIAL);

  return (
    <section data-reveal="" className="pt-[clamp(56px,7vw,96px)]">
      <Kicker className="mb-5">Send an enquiry</Kicker>
      <form action={action} className="grid max-w-[640px] gap-4">
        <div className="field">
          <label htmlFor="name">Your name</label>
          <input id="name" name="name" className="input" required maxLength={200} />
        </div>
        <div className="grid grid-cols-1 gap-4 min-[821px]:grid-cols-2">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" required maxLength={320} />
          </div>
          <div className="field">
            <label htmlFor="company">Organisation (optional)</label>
            <input id="company" name="company" className="input" maxLength={200} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">What do you need held, and for how long?</label>
          <textarea id="message" name="message" className="input" required maxLength={5000} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <SubmitButton />
          {state.status !== "idle" && (
            <p
              role="status"
              className={`m-0 text-sm ${state.status === "ok" ? "text-accent-700" : "text-accent-2-700"}`}
            >
              {state.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
