import { Kicker } from "@/components/Kicker";

const SUSTAINABILITY = [
  "Driven by global and government trends, KFM aligns itself to the United Nations Sustainable Development Goals alongside the nation's own sustainability and energy-efficiency initiatives.",
  "Green, sustainable, low-carbon and energy-efficient measures are incorporated across every service line, priming on the interests of stakeholders and of the people who occupy the building.",
  "Leadership carries more than 50 years of combined experience across facility, asset and project management and public transport terminal operation, covering some 50 million square feet of assets.",
];

const VALUE_PROPS = [
  {
    n: "01",
    title: "Performance reporting and benchmarking",
    body: "Peak efficiency through operational mastery and eco-conscious strategies, giving clients a clear view of the project's operational performance.",
  },
  {
    n: "02",
    title: "Operation management",
    body: "Exceptional responsiveness and high standards in facility operations, aligning daily tactical workflows with the client's vision for long-term success.",
  },
  {
    n: "03",
    title: "Asset life-cycle management",
    body: "Optimum utilisation and maintenance strategy, based on an improved effective lifespan for the asset.",
  },
  {
    n: "04",
    title: "Customer relations",
    body: "Alignment with and support of the client's corporate objectives, deliverables, goals and targets.",
  },
  {
    n: "05",
    title: "Sustainable operational excellence, competency education and training",
    body: "Strengthens operational performance while developing the team's capabilities to sustain results, improving the core productivity of human capital.",
  },
  {
    n: "06",
    title: "Economic profitability",
    body: "Improved management and control over operating cost and capital expenditure.",
  },
];

const CREDENTIALS = [
  "Professional and graduate engineers registered with the Board of Engineers Malaysia and the Institute of Engineers Malaysia",
  "Registered Energy Manager (ST), certified energy managers and facilitators",
  "Professional member, Malaysian Energy Professional Association",
  "Member, Malaysian Association of Facility Management",
  "Green Building Index facilitator; module development for energy efficiency and low-carbon assessment tools",
  "ISO 41001:2018 lead auditor credentials (SIRIM); certified facility management executive (CIDB)",
  "Power quality and harmonic study, analysis and mitigation",
];

export function AboutDetail() {
  return (
    <>
      <section data-reveal="" className="pt-[clamp(56px,7vw,104px)]">
        <h2 className="m-0 max-w-[22ch] font-heading text-[clamp(24px,2.8vw,34px)] leading-[1.15] tracking-[-0.015em]">
          Aligned to the sustainability agenda, not adjacent to it
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-x-[clamp(24px,3vw,56px)] gap-y-7 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3">
          {SUSTAINABILITY.map((p, i) => (
            <p key={i} className="m-0 hyphens-auto text-justify text-[15.5px] leading-[26px] text-text/80">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="pt-[clamp(56px,7vw,104px)]">
        <Kicker>Value propositions</Kicker>
        <div className="grid grid-cols-1 gap-x-[clamp(28px,5vw,96px)] gap-y-8 min-[821px]:grid-cols-2">
          {VALUE_PROPS.map((v) => (
            <div key={v.n} data-reveal="">
              <div className="font-heading text-[13px] tracking-[0.1em] text-accent-700">{v.n}</div>
              <h3 className="mt-1.5 mb-0 font-heading text-xl">{v.title}</h3>
              <p className="mt-2 mb-0 text-[15.5px] leading-[26px] text-text/78">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-[clamp(56px,7vw,104px)]">
        <Kicker>Expertise &amp; competencies</Kicker>
        <div className="grid grid-cols-1 gap-[clamp(24px,4vw,72px)] min-[821px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <p data-reveal="" className="m-0 text-[17px] leading-7 text-text/84">
            Subject matter experts in their respective fields deliver the full range of facility
            management services, for asset owners ranging from multinational corporations and
            government departments to retail outlets and business parks.
          </p>
          <ul data-reveal="" className="m-0 grid list-none gap-3.5 p-0">
            {CREDENTIALS.map((c) => (
              <li key={c} className="text-[15.5px] leading-6">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
