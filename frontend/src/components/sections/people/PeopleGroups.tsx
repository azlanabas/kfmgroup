import { HalftoneFigure } from "@/components/Figures";
import { Kicker } from "@/components/Kicker";
import type { Person } from "@/lib/types";

/** seed-data.ts joins paragraphs with a blank line. */
function paragraphs(bio: string) {
  return bio.split(/\n{2,}/).filter(Boolean);
}

/**
 * Directors get a wide 4fr/8fr row with a 240px portrait; management sits in
 * a two-up grid with a 200px portrait. One person in the seed has no
 * portrait, so the figure is conditional in both.
 */
export function Directors({ people }: { people: Person[] }) {
  return (
    <section className="pt-[clamp(44px,5vw,80px)]">
      <Kicker className="mb-6">Directors and shareholders</Kicker>
      <div className="grid gap-12">
        {people.map((p) => (
          <article
            key={p.id}
            data-reveal=""
            className="grid grid-cols-1 gap-[clamp(16px,3vw,56px)] min-[821px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
          >
            <div>
              {p.photo_url && (
                <HalftoneFigure
                  src={p.photo_url}
                  alt={p.name}
                  ratio="aspect-[4/5]"
                  className="mb-4 max-w-[240px]"
                />
              )}
              <h2 className="m-0 font-heading text-[26px] leading-[1.15]">{p.name}</h2>
              <p className="mt-2 mb-0 text-sm tracking-[0.06em] text-accent-700 uppercase">
                {p.role}
              </p>
            </div>
            <div>
              {paragraphs(p.bio).map((para, i) => (
                <p
                  key={i}
                  className={`${i === 0 ? "mt-0" : "mt-4"} mb-0 text-[15.5px] leading-[26px] text-text/82`}
                >
                  {para}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Management({ people }: { people: Person[] }) {
  return (
    <section className="pt-[clamp(56px,7vw,100px)]">
      <Kicker className="mb-6">Management</Kicker>
      <div className="grid grid-cols-1 gap-x-[clamp(28px,5vw,88px)] gap-y-10 min-[821px]:grid-cols-2">
        {people.map((p) => (
          <article key={p.id} data-reveal="">
            {p.photo_url && (
              <HalftoneFigure
                src={p.photo_url}
                alt={p.name}
                ratio="aspect-[4/5]"
                className="mb-4 max-w-[200px]"
              />
            )}
            <h3 className="m-0 font-heading text-[22px]">{p.name}</h3>
            <p className="mt-1.5 mb-0 text-[13.5px] tracking-[0.06em] text-accent-700 uppercase">
              {p.role}
            </p>
            {paragraphs(p.bio).map((para, i) => (
              <p key={i} className="mt-3 mb-0 text-[15px] leading-[25px] text-text/80">
                {para}
              </p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
