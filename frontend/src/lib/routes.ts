/**
 * The eight routes, in navigation order, with the metadata each one needs for
 * SEO. Single source for the nav, the sitemap, llms.txt and the breadcrumb
 * JSON-LD — so a new page cannot be added to the site and forgotten by the
 * sitemap.
 */

export type RouteDef = {
  path: string;
  /** Nav label. */
  label: string;
  /** <title>, without the brand suffix. */
  title: string;
  description: string;
  /** Sitemap hints. */
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** One line for llms.txt. */
  summary: string;
  /** False for pages gated behind a siteConfig flag. */
  alwaysListed?: boolean;
};

export const ROUTES: RouteDef[] = [
  {
    path: "/",
    label: "Home",
    title: "Facility & asset management in Malaysia",
    description:
      "KFM Group has managed Malaysia's built assets since 2003 — from operational input at design stage, through mobilisation and daily operation, to post-operation condition assessment.",
    priority: 1.0,
    changeFrequency: "monthly",
    summary:
      "Overview: the whole lifecycle of a building held by one team. Headline figures, the four core service elements, the technology base, and the contracts running now.",
  },
  {
    path: "/about",
    label: "About",
    title: "About — incorporated in 2003 to hold buildings to account",
    description:
      "KFM Group Sdn Bhd, formerly Ikhtiar Maintenance, was incorporated in February 2003. Our vision, six value propositions, and the professional credentials held in-house.",
    priority: 0.8,
    changeFrequency: "yearly",
    summary:
      "Company history from 2003, the sustainability vision, six value propositions, and professional/engineering credentials.",
  },
  {
    path: "/work",
    label: "What we do",
    title: "What we do — a multidisciplinary service, run as one contract",
    description:
      "Four core elements: facility management set-up and advisory, contract implementation and administration, condition assessment and audits, and integrated FM with project and construction management.",
    priority: 0.9,
    changeFrequency: "yearly",
    summary:
      "The four service elements in detail, each split into new-construction and existing-building work, or award and in-operation phases.",
  },
  {
    path: "/tech",
    label: "Technology",
    title: "Technology & sustainability — instrumented buildings, humane operations",
    description:
      "CMMS, energy management with certified energy managers, BIM carried from construction into operation, and robotics. Low carbon taken as a daily operating decision.",
    priority: 0.8,
    changeFrequency: "yearly",
    summary:
      "Four technology capabilities — CMMS, energy management, BIM, robotics — and the low-carbon / Green Building Index commitment.",
  },
  {
    path: "/sectors",
    label: "Sectors",
    title: "Sectors — where the contracts run",
    description:
      "Healthcare across nine public clinics in Pulau Pinang, Terminal Bersepadu Gombak, Istana Melawati in Putrajaya, and commercial and office portfolios.",
    priority: 0.9,
    changeFrequency: "monthly",
    summary:
      "Live contracts by sector — healthcare, transport terminals, government and royal buildings, commercial and offices — plus completed contracts and the directors' project history.",
  },
  {
    path: "/people",
    label: "People",
    title: "Our people — fifty years of judgement, on call",
    description:
      "The directors, shareholders and management behind KFM Group, with more than fifty years of combined experience across facility, asset and project management.",
    priority: 0.7,
    changeFrequency: "monthly",
    summary: "Three executive directors and five management staff, with biographies.",
  },
  {
    path: "/careers",
    label: "Careers",
    title: "Careers — the building runs because someone turned up",
    description:
      "Facility management is a shift-work business. The disciplines KFM Group hires — engineers, technicians, planners, surveyors — and how to send a CV.",
    priority: 0.6,
    changeFrequency: "monthly",
    summary: "The disciplines KFM hires and how to apply. No vacancies advertised at present.",
    alwaysListed: false,
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact — start with a conversation",
    description:
      "Corporate office in Petaling Jaya, operations in Bukit Mertajam and Terminal Bersepadu Gombak. CIDB Grade G7, SCORE 3-star, Bumiputera status, ISO 41001 credentials.",
    priority: 0.9,
    changeFrequency: "yearly",
    summary:
      "Direct contact details, three office addresses, an enquiry form, registrations and certification, and company registration facts.",
  },
];

export function routeFor(path: string): RouteDef | undefined {
  return ROUTES.find((r) => r.path === path);
}
