import Link from "next/link";
import { HalftoneFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import { getContracts } from "@/lib/api";
import { siteConfig } from "@/lib/siteConfig";

const DELAYS = ["0.05s", "0.12s", "0.19s"];

/** The three live contracts, read from the API. */
export async function OnContract() {
  const live = (await getContracts()).filter((c) => c.status === "live");

  return (
    <section className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(56px,7vw,110px)]">
      <Kicker reveal>On contract now</Kicker>
      <div className="grid grid-cols-1 gap-x-[clamp(24px,3vw,56px)] gap-y-9 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3">
        {live.map((c, i) => (
          <article key={c.id} data-reveal="" style={{ animationDelay: DELAYS[i % DELAYS.length] }}>
            {c.image_url && (
              <HalftoneFigure
                as="div"
                src={c.image_url}
                alt={c.image_alt ?? c.title}
                ratio="aspect-[4/3]"
                className="mb-[18px]"
              />
            )}
            <h3 className="m-0 font-heading text-xl leading-[26px]">{c.title}</h3>
            {c.card_note && (
              <p className="mt-2.5 mb-0 text-[14.5px] leading-6 text-text/75">{c.card_note}</p>
            )}
            {siteConfig.showContractValues && (
              <p className="mt-2.5 mb-0 font-heading text-base text-accent-700">{c.value_label}</p>
            )}
          </article>
        ))}
      </div>
      <Link href="/sectors" className="btn btn-ghost mt-9">
        See the work by sector
      </Link>
    </section>
  );
}
