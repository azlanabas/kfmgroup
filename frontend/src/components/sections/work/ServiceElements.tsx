/**
 * The four core elements, each a numbered heading against a two-column pair
 * of sub-services. Same shape four times in the artifact, so it is one array
 * and one block component here.
 */

const ELEMENTS = [
  {
    n: "01",
    title: "Facility management set-up and advisory",
    parts: [
      {
        title: "New construction",
        body: "Operational input and FM framework set-up during design stage. Green and low-carbon facilitation. Technology application recommendation.",
      },
      {
        title: "Existing buildings",
        body: "Review and preparation of FM policies and procedures, performance reporting and benchmarking, strategic facility planning and management set-up.",
      },
    ],
  },
  {
    n: "02",
    title: "Implementation and administration of the contract",
    parts: [
      {
        title: "On award",
        body: "Overall management of the FM contract: pre-requisites, mobilisation, set-up, transition and stabilisation.",
      },
      {
        title: "In operation",
        body: "Performance monitoring and reporting against the contract's own measures, for the whole of its term.",
      },
    ],
  },
  {
    n: "03",
    title: "Building, asset and facility condition assessment",
    parts: [
      {
        title: "Diagnostics",
        body: "Functionality testing, deficiency diagnostics and performance benchmarking, including post-operation performance and condition assessment.",
      },
      {
        title: "Certification",
        body: "Certification assessment, warranty management and statutory compliance across the asset register.",
      },
    ],
  },
  {
    n: "04",
    title: "Integrated FM, project and construction management",
    parts: [
      {
        title: "Building engineering services",
        body: "Mechanical. Electrical. Civil, structural and architectural. FM contract planning and administration alongside.",
      },
      {
        title: "Soft services",
        body: "Housekeeping and hygiene, landscape, pest control and waste management, delivered under the same reporting line.",
      },
    ],
  },
];

export function ServiceElements() {
  return (
    <>
      {ELEMENTS.map((el, i) => (
        <section
          key={el.n}
          data-reveal=""
          className={`grid grid-cols-1 gap-[clamp(20px,4vw,72px)] min-[821px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] ${
            i === 0 ? "pt-[clamp(48px,6vw,88px)]" : "pt-[clamp(40px,5vw,72px)]"
          }`}
        >
          <div>
            <div className="font-heading text-[13px] tracking-[0.1em] text-accent-700">{el.n}</div>
            <h2 className="mt-2 mb-0 font-heading text-[clamp(24px,2.6vw,32px)] leading-[1.16]">
              {el.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-x-10 gap-y-6 min-[821px]:grid-cols-2">
            {el.parts.map((p) => (
              <div key={p.title}>
                <h3 className="m-0 font-heading text-[17px]">{p.title}</h3>
                <p className="mt-2 mb-0 text-[15px] leading-[25px] text-text/78">{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
