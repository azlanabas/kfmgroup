import { siteConfig } from "@/lib/siteConfig";

/**
 * The masthead rule under the hero — a 5px double rule, the incorporation
 * facts, then four dot-leader lines. The leader is a flex row whose middle
 * span stretches and carries a dotted bottom border, which is how the
 * artifact drew it without a table.
 */

const FACTS = [
  "Incorporated 16 February 2003",
  "CIDB Grade G7",
  "Kuala Lumpur, Putrajaya, Penang",
  "200301003726 (606146-K)",
];

const LEADERS: { label: string; value: string; accent?: boolean }[] = [
  { label: "Square feet of assets managed by our leadership", value: "50m+", accent: true },
  { label: "Years of cumulative leadership experience", value: "50+" },
  { label: "Live national contracts under management", value: "3" },
];

function Leader({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <p className="m-0 flex items-baseline gap-2 text-[15.5px] leading-7">
      <span>{label}</span>
      <span className="mb-[0.34em] min-w-7 flex-1 self-end border-b border-dotted border-text/45" />
      <span className={`font-heading text-[17px] ${accent ? "text-accent-700" : ""}`}>{value}</span>
    </p>
  );
}

export function FactRule() {
  return (
    <section
      data-reveal=""
      className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(48px,6vw,84px)]"
    >
      <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
      <p className="m-0 flex flex-wrap justify-between gap-x-7 gap-y-[14px] py-[14px] text-[13px] leading-[14px] tracking-[0.08em] text-text/70 uppercase">
        {FACTS.map((f) => (
          <span key={f}>{f}</span>
        ))}
      </p>
      <hr className="m-0 h-0 border-0 border-t border-text" />
      <div className="grid grid-cols-1 gap-x-[70px] gap-y-[14px] pt-[14px] pb-7 min-[821px]:grid-cols-2">
        {LEADERS.map((l) => (
          <Leader key={l.label} {...l} />
        ))}
        {siteConfig.showContractValues && (
          <Leader label="Contract value under management" value="RM116.7m" />
        )}
      </div>
      <hr className="m-0 h-0 border-0 border-t border-text" />
    </section>
  );
}
