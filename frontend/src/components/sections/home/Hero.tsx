import Link from "next/link";
import { PrintFigure } from "@/components/Figures";
import { PlateHeadline } from "@/components/PlateText";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-end gap-[clamp(28px,5vw,80px)] px-[var(--edge)] pt-[clamp(44px,7vw,104px)] min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div>
        <h1 className="m-0 -ml-[0.035em] font-heading text-[clamp(40px,5.4vw,74px)] leading-[1.07] tracking-[-0.022em]">
          <PlateHeadline>The whole lifecycle</PlateHeadline>
          <PlateHeadline>of a building,</PlateHeadline>
          <PlateHeadline>held by one team.</PlateHeadline>
        </h1>
        <p className="mt-9 mb-0 max-w-[54ch] text-[17px] leading-7 text-text/82">
          KFM Group has managed Malaysia&rsquo;s built assets since 2003 — from operational input at
          design stage, through mobilisation and daily operation, to post-operation condition
          assessment. One team, one accountable record, measured against performance.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">
            Speak to our team
          </Link>
          <Link href="/work" className="btn btn-ghost">
            What we do
          </Link>
        </div>
      </div>
      <PrintFigure
        src="/media/photos/hero-technicians.jpeg"
        alt="KFM technicians on site at a managed facility"
        ratio="aspect-[3/4]"
        priority
        sizes="(max-width: 820px) 100vw, 480px"
      />
    </section>
  );
}
