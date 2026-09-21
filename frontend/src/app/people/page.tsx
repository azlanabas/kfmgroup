import { JsonLd } from "@/components/JsonLd";
import { graph, pageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import { Kicker } from "@/components/Kicker";
import { Directors, Management } from "@/components/sections/people/PeopleGroups";
import { getPeople } from "@/lib/api";

export const metadata: Metadata = {
  alternates: { canonical: "/people" },
  title: "Our people — KFM Group Sdn Bhd",
  description: "Fifty years of judgement, on call. KFM Group's directors, shareholders and management.",
};

/** Reads people from the API; cached, revalidated hourly. */
export const revalidate = 3600;

export default async function PeoplePage() {
  const people = await getPeople();
  const directors = people.filter((p) => p.group_label === "Directors and shareholders");
  const management = people.filter((p) => p.group_label === "Management");

  return (
    <main id="main" className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>Our people</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[17ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        Fifty years of judgement, on call.
      </h1>
      <Directors people={directors} />
      <Management people={management} />
      <JsonLd data={graph(pageSchema("/people") ?? [])} />
    </main>
  );
}
