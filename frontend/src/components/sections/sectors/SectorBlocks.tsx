import { HalftoneFigure } from "@/components/Figures";
import { siteConfig } from "@/lib/siteConfig";
import type { Contract } from "@/lib/types";

/**
 * One block per live contract, the photograph alternating side by index — the
 * artifact hand-wrote 5fr/7fr then 7fr/5fr down the page. The definition list
 * labels its first row "Term" or "Status" depending on whether the contract
 * has dates, which is how the artifact distinguished the Gombak row.
 */
export function SectorBlocks({ contracts }: { contracts: Contract[] }) {
  return (
    <>
      {contracts.map((c, i) => {
        const photoLeft = i % 2 === 0;
        const figure = c.image_url ? (
          <HalftoneFigure
            src={c.image_url}
            alt={c.image_alt ?? c.sector ?? c.title}
            ratio={photoLeft ? "aspect-[4/3]" : "aspect-[3/4]"}
          />
        ) : null;

        const body = (
          <div>
            <h2 className="m-0 font-heading text-[clamp(26px,3vw,36px)] leading-[1.14]">
              {c.sector ?? c.title}
            </h2>
            {c.summary && (
              <p className="mt-4 mb-0 text-base leading-[27px] text-text/82">{c.summary}</p>
            )}
            <dl className="mt-6 mb-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[14.5px] leading-[22px]">
              <dt className="self-center text-[11.5px] tracking-[0.06em] text-text/62 uppercase">
                {c.term_start ? "Term" : "Status"}
              </dt>
              <dd className="m-0">{c.term_label}</dd>
              <dt className="self-center text-[11.5px] tracking-[0.06em] text-text/62 uppercase">
                Client
              </dt>
              <dd className="m-0">{c.client}</dd>
            </dl>
            {siteConfig.showContractValues && c.value_label !== "—" && (
              <p className="mt-4 mb-0 font-heading text-[22px] text-accent-700">{c.value_label}</p>
            )}
          </div>
        );

        return (
          <section key={c.id} data-reveal="" className="pt-[clamp(48px,6vw,88px)]">
            <div
              className={`grid grid-cols-1 items-start gap-[clamp(24px,4vw,72px)] ${
                photoLeft
                  ? "min-[821px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                  : "min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
              }`}
            >
              {photoLeft ? (
                <>
                  {figure}
                  {body}
                </>
              ) : (
                <>
                  {body}
                  {figure}
                </>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
