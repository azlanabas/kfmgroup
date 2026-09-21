import { ROUTES, routeFor } from "./routes";
import { siteConfig } from "./siteConfig";
import type { Contract, Person } from "./types";

/**
 * JSON-LD builders.
 *
 * AEO/GEO rationale: answer engines resolve entities, not pages. A single
 * canonical `@id` for the organisation, referenced from every other node,
 * is what lets "who manages Terminal Bersepadu Gombak" resolve to this
 * company rather than to a page that happens to mention it.
 *
 * Everything emitted here is already visible on the page it accompanies —
 * no hidden claims, which is both a Google structured-data requirement and
 * the reason the markup stays trustworthy.
 */

const { url, company, addresses } = siteConfig;

export const ORG_ID = `${url}/#organization`;
export const SITE_ID = `${url}/#website`;

const abs = (path: string) => `${url}${path === "/" ? "" : path}`;

function postalAddress(a: (typeof addresses)[number]) {
  return {
    "@type": "PostalAddress",
    streetAddress: a.street,
    addressLocality: a.locality,
    addressRegion: a.region,
    postalCode: a.postcode,
    addressCountry: a.country,
  };
}

/** Organization + the offer catalogue. Emitted once, in the root layout. */
export function organizationSchema() {
  const primary = addresses.find((a) => a.primary) ?? addresses[0];

  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.name,
    alternateName: [company.shortName, company.formerly],
    url,
    logo: { "@type": "ImageObject", url: abs(company.logo), width: 902, height: 236 },
    image: abs(company.logo),
    email: company.email,
    telephone: company.phoneE164,
    faxNumber: company.fax,
    foundingDate: company.incorporatedISO,
    description:
      "Facility and asset management across Malaysia since 2003 — strategic advisory, contract implementation, condition assessment and integrated facility management.",
    address: postalAddress(primary),
    location: addresses.map((a) => ({
      "@type": "Place",
      name: a.label,
      address: postalAddress(a),
    })),
    areaServed: { "@type": "Country", name: "Malaysia" },
    knowsAbout: [
      "Facility management",
      "Asset management",
      "Integrated facility management",
      "Building condition assessment",
      "Energy management",
      "Computerised maintenance management systems",
      "Building information modelling",
      "Green Building Index certification",
    ],
    identifier: [
      {
        "@type": "PropertyValue",
        name: "Company registration (SSM)",
        value: company.registration,
      },
      { "@type": "PropertyValue", name: "CIDB grade", value: company.cidbGrade },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Facility and asset management services",
      itemListElement: siteConfig.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s, provider: { "@id": ORG_ID } },
      })),
    },
  };
}

/** WebSite node, so the site itself is an addressable entity. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url,
    name: company.name,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-MY",
  };
}

/** Per-page WebPage + breadcrumbs. */
export function pageSchema(path: string) {
  const route = routeFor(path);
  if (!route) return null;

  const crumbs =
    path === "/"
      ? [{ name: "Home", item: url }]
      : [
          { name: "Home", item: url },
          { name: route.label, item: abs(path) },
        ];

  return [
    {
      "@type": "WebPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: route.title,
      description: route.description,
      isPartOf: { "@id": SITE_ID },
      about: { "@id": ORG_ID },
      inLanguage: "en-MY",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
  ];
}

/** The people page — each director/manager as a Person tied to the org. */
export function peopleSchema(people: Person[]) {
  return people.map((p) => ({
    "@type": "Person",
    "@id": `${abs("/people")}#person-${p.id}`,
    name: p.name,
    jobTitle: p.role,
    description: p.bio.split(/\n{2,}/)[0],
    ...(p.photo_url ? { image: abs(p.photo_url) } : {}),
    worksFor: { "@id": ORG_ID },
  }));
}

/**
 * The sectors page — live contracts as Projects the organisation performs.
 * Values are omitted entirely when showContractValues is off, so the flag
 * cannot be bypassed by reading the markup.
 */
export function contractsSchema(contracts: Contract[]) {
  return contracts.map((c) => ({
    "@type": "Project",
    "@id": `${abs("/sectors")}#contract-${c.id}`,
    name: c.title,
    description: c.summary ?? c.card_note ?? undefined,
    ...(c.term_start ? { startDate: c.term_start } : {}),
    ...(c.term_end ? { endDate: c.term_end } : {}),
    agent: { "@id": ORG_ID },
    customer: { "@type": "Organization", name: c.client },
    ...(c.sector ? { keywords: c.sector } : {}),
  }));
}

/** Wraps nodes in a single @graph — one script tag per page. */
export function graph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}

export const ALL_PATHS = ROUTES.map((r) => r.path);
