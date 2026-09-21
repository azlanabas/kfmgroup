import { JsonLd } from "@/components/JsonLd";
import { graph, pageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import { HalftoneFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import { CompletedContracts } from "@/components/sections/sectors/CompletedContracts";
import { SectorBlocks } from "@/components/sections/sectors/SectorBlocks";
import { getContracts } from "@/lib/api";

export const metadata: Metadata = {
  alternates: { canonical: "/sectors" },
  title: "Sectors — KFM Group Sdn Bhd",
  description:
    "Where the contracts run: healthcare, transport terminals, government and royal buildings, commercial and offices.",
};

/** Reads live and completed contracts from the API; cached, revalidated hourly. */
export const revalidate = 3600;

/**
 * Work delivered by KFM's directors in previous roles. Not contracts of the
 * company, so these stay in the page rather than in the contracts table.
 */
const DIRECTOR_PROJECTS = [
  "Prime Minister's Office complex (Bangunan Perdana Putra) — high-performance green building retrofit and comprehensive facility and asset management",
  "Integrated immigration, customs, quarantine and security complex, Bukit Kayu Hitam",
  "KD Seri Medini naval base and Pasir Gudang UPS, Johor Bahru",
  "Comprehensive facility and asset management, Albukhary complex, Alor Setar — the international university, mosque, student residences, hotel, staff apartments, dialysis medical centre, souq, orphanage and medical centre for special needs",
  "Township and facility management masterplan, Iskandar Malaysia",
  "Comprehensive facility management, Perdana Quay commercial centre, Langkawi",
  "Memorial Tun Hussein Onn, Kuala Lumpur — design and build, building works (CME)",
  "Mechanical and electrical works for interior design and build, CCM factory, Pasir Gudang, Johor",
  "Renovation works, civil and plumbing systems, Corus Hotel Kuala Lumpur",
  "Refurbishment and renovation works (CME) including interior design, Republik Building, Plaza Damansara",
  "Al Thuraya Tower 1, Wasl Business Central, Baniyas Complex and the Sheikha Latifa Building, Dubai",
];

export default async function SectorsPage() {
  const contracts = await getContracts();
  const live = contracts.filter((c) => c.status === "live");
  const completed = contracts.filter((c) => c.status === "completed");

  return (
    <main id="main" className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>Sectors</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[16ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        Where the contracts run.
      </h1>

      <SectorBlocks contracts={live} />

      {/* Commercial & offices carries no single contract row — it is the
          directors' portfolio plus ongoing refurbishment work, so it is
          narrative rather than a row in the contracts table. */}
      <section data-reveal="" className="pt-[clamp(48px,6vw,88px)]">
        <div className="grid grid-cols-1 items-start gap-[clamp(24px,4vw,72px)] min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <h2 className="m-0 font-heading text-[clamp(26px,3vw,36px)] leading-[1.14]">
              Commercial &amp; offices
            </h2>
            <p className="mt-4 mb-0 text-base leading-[27px] text-text/82">
              Integrated facility management and hotel management services for a national
              carrier&rsquo;s offices in Kelana Jaya, delivered through a corporate real-estate
              client. Refurbishment and mechanical, electrical and civil works across offices,
              factories and hospitality interiors sit alongside the FM contracts.
            </p>
            <p className="mt-4 mb-0 text-base leading-[27px] text-text/82">
              Our directors&rsquo; portfolio in this sector includes TNB Dua Sentral and Menara PjH,
              Wisma Consplant and Wisma UEP in Subang Jaya, and in the UAE, Al Thuraya Tower 1 in
              Dubai Media City, Buildings 25 and 49 in Dubai Healthcare City, Wasl Business Central,
              Baniyas Complex and the Sheikha Latifa Building.
            </p>
          </div>
          <HalftoneFigure
            src="/media/photos/commercial-building.jpeg"
            alt="Commercial building under management"
            ratio="aspect-[3/4]"
          />
        </div>
      </section>

      <CompletedContracts contracts={completed} />

      <section className="pt-[clamp(56px,7vw,100px)]">
        <Kicker>Directors&rsquo; project experience</Kicker>
        <p className="mt-0 mb-5 max-w-[58ch] text-base leading-[27px] text-text/82">
          Work delivered by KFM&rsquo;s directors in previous roles, across Malaysia and the Gulf.
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-x-12 gap-y-2.5 p-0 text-[15px] leading-6 min-[821px]:grid-cols-2">
          {DIRECTOR_PROJECTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
      <JsonLd data={graph(pageSchema("/sectors") ?? [])} />
    </main>
  );
}
