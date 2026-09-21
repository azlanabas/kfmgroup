import Link from "next/link";
import { Kicker } from "@/components/Kicker";

export function Quote() {
  return (
    <section className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(64px,8vw,130px)]">
      <figure data-reveal="" className="m-0">
        <blockquote className="m-0 max-w-[32ch] font-heading text-[clamp(24px,2.7vw,36px)] leading-[1.35] font-normal tracking-[-0.01em] italic">
          &ldquo;Our services are geared towards maximizing net asset value by ensuring continuous
          peak performance of the facilities and buildings.&rdquo;
        </blockquote>
        <figcaption className="mt-11 text-[15.5px] leading-7 text-text/70">
          — Expertise &amp; competencies, KFM Group corporate profile
        </figcaption>
      </figure>
    </section>
  );
}

export function HomeCta() {
  return (
    <section className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(64px,8vw,120px)]">
      <Kicker tone="accent" reveal>
        Modern solutions, infinite opportunities
      </Kicker>
      <h2
        data-reveal=""
        className="m-0 max-w-[22ch] font-heading text-[clamp(26px,3vw,38px)] leading-[1.14] tracking-[-0.015em]"
      >
        Tell us what you need held, and for how long.
      </h2>
      <p data-reveal="" className="mt-5 mb-0 max-w-[52ch] text-base leading-7 text-text/80">
        Tenders, transitions and condition assessments all start the same way — a conversation with
        the people who will actually run the contract.
      </p>
      <div data-reveal="" className="mt-7 flex flex-wrap gap-3">
        <Link href="/contact" className="btn btn-primary">
          Contact us
        </Link>
        <Link href="/people" className="btn btn-ghost">
          Meet the team
        </Link>
      </div>
    </section>
  );
}
