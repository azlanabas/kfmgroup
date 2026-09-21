/**
 * The uppercase section label that opens almost every block on the site.
 * Two tones in the artifact: muted ink (the default) and accent-700, which
 * the home page's closing call-to-action uses.
 */
export function Kicker({
  children,
  tone = "muted",
  reveal = false,
  className = "",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent";
  reveal?: boolean;
  className?: string;
}) {
  const colour = tone === "accent" ? "text-accent-700" : "text-text/70";
  return (
    <span
      data-reveal={reveal ? "" : undefined}
      className={`mb-[18px] block text-[13px] leading-[14px] tracking-[0.08em] uppercase ${colour} ${className}`}
    >
      {children}
    </span>
  );
}
