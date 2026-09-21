import { siteConfig } from "@/lib/siteConfig";

export function SiteFooter() {
  const { company } = siteConfig;
  return (
    <footer className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(64px,8vw,120px)] pb-14">
      <hr className="m-0 mb-7 h-0 border-0 border-t border-text/18" />
      <p className="m-0 mb-7 max-w-[56ch] text-base leading-[27px] text-text/82">
        We provide strategic advisory and project management solutions designed to maximise asset
        value and ensure business continuity for our corporate partners.
      </p>
      <div className="flex flex-wrap justify-between gap-6 text-[13.5px] leading-6 text-text/70">
        <span>
          {company.name} · {company.registration}
        </span>
        <span>{company.locations}</span>
        <span>
          <a href={`mailto:${company.email}`}>{company.email}</a> ·{" "}
          <a href={company.phoneHref}>{company.phone}</a>
        </span>
      </div>
    </footer>
  );
}
