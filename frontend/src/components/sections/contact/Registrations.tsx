import { Kicker } from "@/components/Kicker";
import { siteConfig } from "@/lib/siteConfig";

const CERTS = [
  {
    title: "CIDB Grade G7",
    body: "Registered contractor, certificate of registration and certificate of government procurement.",
  },
  {
    title: "SCORE 3-star, 2025",
    body: "Rated by CIDB and SME Corp for “good management and technical capabilities, compliance to best practices and good project management”. Valid until 23 July 2027.",
  },
  {
    title: "Bumiputera status",
    body: "BPKU Bumiputera standard work contractor certificate; Ministry of Finance company and Bumiputera company registration declarations.",
  },
  {
    title: "ISO certification",
    body: "Certified through CARE Certification International, with ISO 41001:2018 lead auditor credentials held in-house.",
  },
  {
    title: "Professional bodies",
    body: "Board of Engineers Malaysia, Institute of Engineers Malaysia, Malaysian Energy Professional Association, Malaysian Association of Facility Management.",
  },
  {
    title: "Green credentials",
    body: "Green Building Index facilitator; registered energy manager (ST) and certified energy managers.",
  },
];

export function Registrations() {
  return (
    <section data-reveal="" className="pt-[clamp(56px,7vw,96px)]">
      <Kicker className="mb-5">Registrations &amp; certification</Kicker>
      <div className="grid grid-cols-1 gap-x-[clamp(28px,5vw,80px)] gap-y-7 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3">
        {CERTS.map((c) => (
          <div key={c.title}>
            <h3 className="m-0 font-heading text-[19px]">{c.title}</h3>
            <p className="mt-2 mb-0 text-[15px] leading-[25px] text-text/80">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CompanyFacts() {
  const { company } = siteConfig;
  const FACTS = [
    ["Company", company.name],
    ["Registration", company.registration],
    ["Incorporated", company.incorporated],
    ["Formerly", company.formerly],
    ["CIDB grade", company.cidbGrade],
    ["Fax", company.fax],
  ];

  return (
    <section data-reveal="" className="pt-[clamp(56px,7vw,96px)]">
      <hr className="m-0 h-[5px] border-0 border-t-2 border-b border-text" />
      <dl className="m-0 grid grid-cols-1 gap-x-12 gap-y-5 pt-6 text-[15.5px] leading-6 min-[821px]:grid-cols-2 min-[1101px]:grid-cols-3">
        {FACTS.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11.5px] tracking-[0.08em] text-text/62 uppercase">{label}</dt>
            <dd className="mt-1.5 mb-0 ml-0">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
