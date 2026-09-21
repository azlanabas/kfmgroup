import { HalftoneFigure, PrintFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";

const STORY = [
  "KFM Group Sdn Bhd, formerly Ikhtiar Maintenance Sdn Bhd, was incorporated in February 2003 to venture into building services nationwide, serving national and international requirements in sustainable facility management and operation.",
  "Since then the company has grown by drawing professional and technical resources from many disciplines: architects; facility, project and energy managers; mechanical, electrical and civil engineers; planners, quality and safety officers; quantity surveyors; technicians; and the support and management team behind them.",
  "The company was formed to deliver top-class facility and asset management on the understanding that sustaining net asset value requires a complete cycle — systematic approaches from design stage through to post-operational services. Service quality is manifested through an operation model run on performance-based management.",
];

export function AboutIntro() {
  return (
    <>
      <Kicker>About — formed for top class delivery</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[17ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        Incorporated in 2003 to hold buildings to account.
      </h1>

      <PrintFigure
        src="/media/photos/about-team.jpeg"
        alt="KFM Group team"
        ratio="aspect-[4/3]"
        figureClassName="mt-10"
        printClassName="max-h-[52vh]"
      />

      <div className="mt-12 grid grid-cols-1 items-start gap-[clamp(28px,5vw,80px)] min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          {STORY.map((p, i) => (
            <p key={i} className={`${i === 0 ? "mt-0" : "mt-7"} mb-0 text-[17px] leading-7 text-text/84`}>
              {p}
            </p>
          ))}
        </div>
        <PrintFigure
          src="/media/photos/about-team-site.jpeg"
          alt="KFM team at a managed site"
          ratio="aspect-[3/4]"
        />
      </div>

      <section
        data-reveal=""
        className="grid grid-cols-1 items-center gap-[clamp(24px,4vw,72px)] pt-[clamp(56px,7vw,104px)] min-[821px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
      >
        <HalftoneFigure
          src="/media/photos/about-contract-operation.jpeg"
          alt="Facility management contract in operation"
          ratio="aspect-[4/3]"
        />
        <div>
          <h2 className="m-0 max-w-[18ch] font-heading text-[clamp(24px,2.8vw,34px)] leading-[1.15] tracking-[-0.015em]">
            Our vision
          </h2>
          <p className="mt-5 mb-0 max-w-[52ch] text-base leading-7 text-text/82">
            We are committed to incorporating green, sustainable, low-carbon and energy-efficient
            design and measures in all of our services, priming on the interests of stakeholders as
            well as building occupants. Our level of service quality is manifested through the
            operation model, delivered by performance-based management.
          </p>
        </div>
      </section>
    </>
  );
}
