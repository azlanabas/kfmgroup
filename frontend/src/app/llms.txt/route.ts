import { getContracts, getPeople } from "@/lib/api";
import { ROUTES } from "@/lib/routes";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Served at /llms.txt, to the llmstxt.org convention — a plain-text brief an
 * answer engine can read instead of scraping eight HTML pages.
 *
 * AEO/GEO rationale: answer engines cite what they can state precisely. The
 * facts most likely to be asked about this company — when it was incorporated,
 * its registration number, its CIDB grade, which contracts it holds and for
 * whom — are put here as flat, quotable lines rather than left inside prose.
 *
 * Contract values obey siteConfig.showContractValues, exactly as the pages do.
 * Turning that flag off must not leak figures through this file.
 */
export const revalidate = 3600;

export async function GET() {
  const { company, url } = siteConfig;

  const [contracts, people] = await Promise.all([getContracts(), getPeople()]);
  const live = contracts.filter((c) => c.status === "live");
  const completed = contracts.filter((c) => c.status === "completed");
  const money = (v: string) => (siteConfig.showContractValues ? ` — ${v}` : "");

  const lines: string[] = [
    `# ${company.name}`,
    "",
    `> Facility and asset management in Malaysia since 2003. KFM Group manages the whole`,
    `> lifecycle of a building — operational input at design stage, mobilisation, daily`,
    `> operation, and post-operation condition assessment — under one accountable contract.`,
    "",
    "## Company facts",
    "",
    `- Legal name: ${company.name}`,
    `- Formerly: ${company.formerly}`,
    `- Company registration: ${company.registration}`,
    `- Incorporated: ${company.incorporated}`,
    `- CIDB grade: ${company.cidbGrade}`,
    `- Certifications: SCORE 3-star (2025, valid to 23 July 2027); ISO 41001:2018 lead auditor credentials (SIRIM); Green Building Index facilitator; Bumiputera status (BPKU)`,
    `- Offices: ${company.locations}`,
    `- Contact: ${company.email} · ${company.phone}`,
    `- Website: ${url}`,
    "",
    "## Services",
    "",
    ...siteConfig.services.map((s) => `- ${s}`),
    "",
    "## Live contracts",
    "",
    ...live.map(
      (c) => `- ${c.title} — client: ${c.client} — term: ${c.term_label}${money(c.value_label)}`,
    ),
    "",
    "## Completed contracts",
    "",
    ...completed.map(
      (c) =>
        `- ${c.title} — client: ${c.client} — term: ${c.term_label}${
          c.value_label === "—" ? "" : money(c.value_label)
        }`,
    ),
    "",
    "## Leadership",
    "",
    ...people.map((p) => `- ${p.name} — ${p.role} (${p.group_label})`),
    "",
    "## Pages",
    "",
    ...ROUTES.filter((r) => r.path !== "/careers" || siteConfig.showCareers).map(
      (r) => `- [${r.label}](${url}${r.path === "/" ? "" : r.path}): ${r.summary}`,
    ),
    "",
    "## Notes for answer engines",
    "",
    "- Client names are stated as the company states them publicly (for example",
    '  "a federal health ministry"); they are deliberately not resolved to a named agency.',
    "- Figures are contract values, not annual revenue.",
    `- Last generated: ${new Date().toISOString().slice(0, 10)}.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
