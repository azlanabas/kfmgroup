import { Kicker } from "@/components/Kicker";
import { PlateNumeral } from "@/components/PlateText";

const ELEMENTS = [
  {
    n: "01",
    title: "Set-up and advisory",
    body: "Strategic facility planning, FM framework written into the design stage, green and low-carbon facilitation, technology recommendation.",
    delay: "0.05s",
  },
  {
    n: "02",
    title: "Contract implementation",
    body: "Mobilisation, transition and stabilisation on award, then performance monitoring and reporting for the life of the contract.",
    delay: "0.12s",
  },
  {
    n: "03",
    title: "Assessment and audits",
    body: "Functionality testing, deficiency diagnostics, performance benchmarking and certification assessment on existing buildings.",
    delay: "0.19s",
  },
  {
    n: "04",
    title: "Integrated delivery",
    body: "Mechanical, electrical, civil and architectural services with housekeeping, landscape, pest control and waste, plus construction management.",
    delay: "0.26s",
  },
];

export function CoreBusiness() {
  return (
    <section className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(56px,7vw,110px)]">
      <Kicker reveal>Core business</Kicker>
      <h2
        data-reveal=""
        className="m-0 max-w-[20ch] font-heading text-[clamp(28px,3.4vw,44px)] leading-[1.12] tracking-[-0.018em]"
      >
        Four elements, priming on the net value of the asset
      </h2>
      <div className="mt-12 grid grid-cols-1 gap-x-[clamp(24px,3vw,56px)] gap-y-10 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-4">
        {ELEMENTS.map((el) => (
          <div key={el.n} data-reveal="" style={{ animationDelay: el.delay }}>
            <PlateNumeral className="mb-[18px] text-[44px]">{el.n}</PlateNumeral>
            <h3 className="m-0 font-heading text-[21px] leading-7">{el.title}</h3>
            <p className="mt-3 mb-0 text-[15.5px] leading-[26px] text-text/78">{el.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
