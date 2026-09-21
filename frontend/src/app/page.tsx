import { JsonLd } from "@/components/JsonLd";
import { graph, pageSchema } from "@/lib/schema";
import { CoreBusiness } from "@/components/sections/home/CoreBusiness";
import { FactRule } from "@/components/sections/home/FactRule";
import { Hero } from "@/components/sections/home/Hero";
import { OnContract } from "@/components/sections/home/OnContract";
import { HomeCta, Quote } from "@/components/sections/home/QuoteAndCta";
import { TechSplit } from "@/components/sections/home/TechSplit";

/**
 * OnContract reads live contracts from the API. The fetch is cached and
 * revalidated hourly (see lib/api.ts), so this page is ISR, not per-request.
 */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <FactRule />
      <CoreBusiness />
      <TechSplit />
      <OnContract />
      <Quote />
      <HomeCta />
      <JsonLd data={graph(pageSchema("/") ?? [])} />
    </main>
  );
}
