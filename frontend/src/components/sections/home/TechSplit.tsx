import Link from "next/link";
import { PrintFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";

const CAPABILITIES = [
  {
    title: "CMMS",
    body: "Computerised maintenance management — asset register, work orders, planned maintenance.",
  },
  {
    title: "Energy management",
    body: "Metering, power quality and harmonic analysis, certified energy managers.",
  },
  { title: "BIM", body: "Model-linked asset data carried from construction into operation." },
  { title: "Robotics", body: "Automated cleaning and inspection where repetition beats judgement." },
];

export function TechSplit() {
  return (
    <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-[clamp(28px,5vw,88px)] px-[var(--edge)] pt-[clamp(56px,7vw,110px)] min-[821px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div data-reveal="">
        <Kicker>Technology as the base</Kicker>
        <h2 className="m-0 font-heading text-[clamp(26px,3vw,38px)] leading-[1.14] tracking-[-0.015em]">
          People do the work. The system remembers it.
        </h2>
        <p className="mt-6 mb-0 max-w-[48ch] text-base leading-7 text-text/80">
          Every asset carries a record: what it is, when it was touched, what it consumes and what it
          will cost next. Four capabilities keep that record honest.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-9 gap-y-5 min-[821px]:grid-cols-2">
          {CAPABILITIES.map((c) => (
            <div key={c.title}>
              <div className="font-heading text-lg">{c.title}</div>
              <div className="text-sm leading-[22px] text-text/72">{c.body}</div>
            </div>
          ))}
        </div>
        <Link href="/tech" className="btn btn-ghost mt-7">
          Technology &amp; sustainability
        </Link>
      </div>
      <PrintFigure
        src="/media/photos/plant-room.jpeg"
        alt="Plant room under KFM management"
        ratio="aspect-[4/3]"
      />
    </section>
  );
}
