import type { Metadata } from "next";
import { Kicker } from "@/components/Kicker";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { CompanyFacts, Registrations } from "@/components/sections/contact/Registrations";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact — KFM Group Sdn Bhd",
  description:
    "Start with a conversation. Direct contact, corporate office, operations bases, registrations and certification.",
};

export default function ContactPage() {
  const { company } = siteConfig;

  return (
    <main className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <Kicker>Contact</Kicker>
      <h1 className="m-0 -ml-[0.035em] max-w-[15ch] font-heading text-[clamp(34px,4.6vw,62px)] leading-[1.08] tracking-[-0.02em]">
        Start with a conversation.
      </h1>

      <div className="mt-12 grid grid-cols-1 gap-x-[clamp(28px,5vw,80px)] gap-y-10 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3">
        <div data-reveal="">
          <h2 className="m-0 font-heading text-xl">Direct</h2>
          <p className="mt-3 mb-0 text-base leading-[27px]">
            <a href={`mailto:${company.email}`}>{company.email}</a>
            <br />
            <a href={company.phoneHref}>{company.phone}</a>
          </p>
        </div>
        <div data-reveal="">
          <h2 className="m-0 font-heading text-xl">Corporate office</h2>
          <p className="mt-3 mb-0 text-base leading-[27px] text-text/82">
            70-2, Jalan PJU 5/22, Encorp Strand, Pusat Perdagangan Kota Damansara PJU 5, 47810
            Petaling Jaya, Selangor Darul Ehsan
          </p>
        </div>
        <div data-reveal="">
          <h2 className="m-0 font-heading text-xl">Operations</h2>
          <p className="mt-3 mb-0 text-base leading-[27px] text-text/82">
            G-9 &amp; 1-9 Pusat Perniagaan Perdana Jaya, Jalan Permatang Rawa, 14000 Bukit Mertajam,
            Pulau Pinang
          </p>
          <p className="mt-3 mb-0 text-base leading-[27px] text-text/82">
            Terminal Bersepadu Gombak, 1 Jalan Terminal Putra, Taman Melati, 53100 Kuala Lumpur
          </p>
        </div>
      </div>

      <ContactForm />
      <Registrations />
      <CompanyFacts />
    </main>
  );
}
