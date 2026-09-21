/**
 * Emits a JSON-LD block. Server-rendered into the HTML so crawlers and answer
 * engines see it without executing JavaScript — which is the whole point;
 * several AI crawlers do not run JS at all.
 *
 * The payload is our own data, never user input, so the standard
 * dangerouslySetInnerHTML caveat does not apply. `<` is still escaped as a
 * defensive measure against a future field containing markup that would close
 * the script tag early.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
