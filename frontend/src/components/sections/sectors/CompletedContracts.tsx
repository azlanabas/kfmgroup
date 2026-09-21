import { Kicker } from "@/components/Kicker";
import { siteConfig } from "@/lib/siteConfig";
import type { Contract } from "@/lib/types";

/** The `<sc-raw-table>` from the artifact, now a plain table fed by the API. */
export function CompletedContracts({ contracts }: { contracts: Contract[] }) {
  return (
    <section data-reveal="" className="pt-[clamp(56px,7vw,100px)]">
      <Kicker>Completed contracts</Kicker>
      <div className="overflow-x-auto">
        <table className="table min-w-[600px]">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Client</th>
              <th>Term</th>
              {siteConfig.showContractValues && <th>Value</th>}
            </tr>
          </thead>
          <tbody>
            {contracts.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.client}</td>
                <td>{c.term_label}</td>
                {siteConfig.showContractValues && <td>{c.value_label}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
