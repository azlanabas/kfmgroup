import type { Metadata } from "next";
import Link from "next/link";
import { HalftoneFigure, PrintFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import { ServiceElements } from "@/components/sections/work/ServiceElements";

export const metadata: Metadata = {
  title: "What we do — KFM Group Sdn Bhd",
  description:
    "A multidisciplinary service, run as one contract: set-up and advisory, contract implementation, condition assessment, and integrated FM.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>What we do</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[18ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        A multidisciplinary service, run as one contract.
      </h1>
      <p className="mt-7 mb-0 max-w-[56ch] text-[17px] leading-7 text-text/84">
        Asset and facility management ensures the functionality of the built environment by
        integrating its people, business processes, technology, space and materials. Four core
        elements carry that work.
      </p>

      <PrintFigure
        src="/media/photos/work-services.jpeg"
        alt="KFM services in operation"
        ratio="aspect-[16/9]"
        figureClassName="mt-10"
        printClassName="max-h-[56vh]"
      />

      <ServiceElements />

      <section className="pt-[clamp(56px,7vw,104px)]">
        <HalftoneFigure
          src="/media/photos/work-site-team.jpeg"
          alt="Site team on a managed facility"
          ratio="aspect-[21/9]"
          reveal
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">
            Discuss a scope
          </Link>
          <Link href="/sectors" className="btn btn-ghost">
            See it in the field
          </Link>
        </div>
      </section>
    </main>
  );
}
