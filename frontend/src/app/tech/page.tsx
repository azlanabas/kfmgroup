import { JsonLd } from "@/components/JsonLd";
import { graph, pageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import { PrintFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import { PlateNumeral } from "@/components/PlateText";

export const metadata: Metadata = {
  alternates: { canonical: "/tech" },
  title: "Technology & sustainability — KFM Group Sdn Bhd",
  description:
    "Instrumented buildings, humane operations: CMMS, energy management, BIM and robotics, with low carbon taken as a daily operating decision.",
};

const CAPABILITIES = [
  {
    n: "01",
    title: "CMMS",
    body: "A computerised maintenance management system holds the asset register, planned maintenance calendar and every work order raised against it. Response times, rectification and backlog are reported from the same source the technicians work from, so performance data is a by-product of the job rather than a separate exercise.",
  },
  {
    n: "02",
    title: "Energy management",
    body: "Registered and certified energy managers run metering, consumption baselining and verification, with power quality and harmonic study, analysis and mitigation where supply quality is degrading plant. Efficiency measures are proposed with the payback stated.",
  },
  {
    n: "03",
    title: "BIM",
    body: "Building information models carry asset data out of construction and into operation, so the handover is a working register rather than a box of drawings. Where we are engaged at design stage, the operational requirement is written into the model from the beginning.",
  },
  {
    n: "04",
    title: "Robotics",
    body: "Automation takes the repetitive passes — floor cleaning on large public concourses, routine inspection rounds — and returns the hours to work that needs judgement. The intent is fewer tedious shifts, not fewer people.",
  },
];

export default function TechPage() {
  return (
    <main id="main" className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>Technology &amp; sustainability</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[17ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        Instrumented buildings, humane operations.
      </h1>
      <p className="mt-7 mb-0 max-w-[56ch] text-[17px] leading-7 text-text/84">
        Technology earns its place when it makes the work visible — to the technician holding the
        spanner, and to the owner reading the report at the end of the quarter.
      </p>

      <div className="grid grid-cols-1 gap-[clamp(32px,4vw,64px)] pt-[clamp(44px,5vw,80px)] min-[821px]:grid-cols-2">
        {CAPABILITIES.map((c) => (
          <section key={c.n} data-reveal="">
            <PlateNumeral className="mb-4 text-[40px]">{c.n}</PlateNumeral>
            <h2 className="m-0 font-heading text-2xl">{c.title}</h2>
            <p className="mt-3 mb-0 text-[15.5px] leading-[26px] text-text/80">{c.body}</p>
          </section>
        ))}
      </div>

      <section data-reveal="" className="pt-[clamp(56px,7vw,104px)]">
        <PrintFigure
          src="/media/photos/tech-technicians.jpeg"
          alt="Technicians working on building services"
          ratio="aspect-[21/9]"
          reveal={false}
        />
      </section>

      <section className="grid grid-cols-1 items-center gap-[clamp(28px,5vw,80px)] pt-[clamp(56px,7vw,104px)] min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div data-reveal="">
          <h2 className="m-0 max-w-[20ch] font-heading text-[clamp(24px,2.8vw,34px)] leading-[1.15] tracking-[-0.015em]">
            Low carbon is an operating decision, taken daily
          </h2>
          <p className="mt-5 mb-0 max-w-[52ch] text-base leading-7 text-text/82">
            Green, sustainable, low-carbon and energy-efficient measures are incorporated into every
            service line, referenced to the United Nations Sustainable Development Goals and to
            national energy-efficiency initiatives. Our facilitators hold Green Building Index
            credentials and have developed assessment modules for energy efficiency and low-carbon
            tools.
          </p>
          <p className="mt-5 mb-0 max-w-[52ch] text-base leading-7 text-text/82">
            Our leadership delivered the high-performance green building retrofit of the Prime
            Minister&rsquo;s Office complex, Bangunan Perdana Putra — a twenty-year concession to
            bring the building to GBI platinum certification.
          </p>
        </div>
        <PrintFigure
          src="/media/photos/tech-energy-plant.jpeg"
          alt="Energy and plant systems under management"
          ratio="aspect-square"
        />
      </section>
      <JsonLd data={graph(pageSchema("/tech") ?? [])} />
    </main>
  );
}
