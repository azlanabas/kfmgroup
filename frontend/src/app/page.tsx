import { CoreBusiness } from "@/components/sections/home/CoreBusiness";
import { FactRule } from "@/components/sections/home/FactRule";
import { Hero } from "@/components/sections/home/Hero";
import { OnContract } from "@/components/sections/home/OnContract";
import { HomeCta, Quote } from "@/components/sections/home/QuoteAndCta";
import { TechSplit } from "@/components/sections/home/TechSplit";

/** OnContract reads live contracts from the API on every request. */
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FactRule />
      <CoreBusiness />
      <TechSplit />
      <OnContract />
      <Quote />
      <HomeCta />
    </main>
  );
}
