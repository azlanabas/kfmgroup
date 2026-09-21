import { JsonLd } from "@/components/JsonLd";
import { graph, pageSchema } from "@/lib/schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HalftoneFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers — KFM Group Sdn Bhd",
  description:
    "Facility management is a shift-work business. The disciplines KFM Group hires, and how to send a CV.",
};

const DISCIPLINES = [
  "Facility, project and energy managers",
  "Mechanical, electrical and civil engineers",
  "Technicians and maintenance crew",
  "Planners, quality and safety officers",
  "Quantity surveyors",
  "Support and management team",
];

export default function CareersPage() {
  // showCareers hides the nav link; the route itself 404s to match.
  if (!siteConfig.showCareers) notFound();

  return (
    <main id="main" className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>Careers</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[16ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        The building runs because someone turned up.
      </h1>
      <div className="mt-11 grid grid-cols-1 items-start gap-[clamp(28px,5vw,80px)] min-[821px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <p className="m-0 text-[17px] leading-7 text-text/84">
            Facility management is a shift-work business. Clinics open at seven, terminals never
            close, and the people who keep them running are the reason a contract holds. We staff for
            that reality: competency education and training are written into our value propositions,
            not bolted on at appraisal time.
          </p>
          <p className="mt-6 mb-0 text-[17px] leading-7 text-text/84">
            Technology is there to remove the tedious parts of the job — the paperwork, the second
            trip for a part, the repetitive cleaning pass — so that skilled hours go to skilled work.
          </p>

          <h2 className="mt-10 mb-0 font-heading text-2xl">Disciplines we hire</h2>
          <ul className="mt-4 grid list-none grid-cols-1 gap-x-10 gap-y-2.5 p-0 text-[15.5px] leading-6 min-[821px]:grid-cols-2">
            {DISCIPLINES.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>

          <h2 className="mt-10 mb-0 font-heading text-2xl">Applying</h2>
          <p className="mt-3.5 mb-0 max-w-[52ch] text-base leading-[27px] text-text/82">
            We are not advertising vacancies at the moment. Send a CV to{" "}
            <a href={`mailto:${siteConfig.company.email}`}>{siteConfig.company.email}</a> stating
            your discipline and preferred location, and it will reach the operations team directly.
          </p>
        </div>
        <HalftoneFigure
          src="/media/photos/careers-crew.jpeg"
          alt="KFM crew at work on site"
          ratio="aspect-[3/4]"
          reveal
        />
      </div>
      <JsonLd data={graph(pageSchema("/careers") ?? [])} />
    </main>
  );
}
