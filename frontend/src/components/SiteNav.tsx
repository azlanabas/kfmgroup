"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

/**
 * The sticky masthead. The artifact held `menu: 'work' | 'sectors' | null` in
 * DCLogic state and opened each panel on mouse-enter; that is reproduced here
 * with local state. The panels are positioned against the <nav>, which is
 * `relative`, so `left: var(--edge)` lines them up with the page gutter — the
 * same trick the artifact used (the trigger spans are `position: static`).
 */

const WORK_MENU = [
  {
    title: "Facility management set-up & advisory",
    body: "Strategic planning, FM framework at design stage, green facilitation.",
  },
  {
    title: "Contract implementation & administration",
    body: "Mobilisation, transition, stabilisation, performance reporting.",
  },
  {
    title: "Condition assessment & audits",
    body: "Functionality testing, deficiency diagnostics, benchmarking.",
  },
  {
    title: "Integrated FM, project & construction",
    body: "Mechanical, electrical, civil, housekeeping, landscape, waste.",
  },
];

const SECTORS_MENU = [
  { title: "Healthcare", body: "Nine public clinics, Pulau Pinang" },
  { title: "Transport terminals", body: "Terminal Bersepadu Gombak" },
  { title: "Government & royal", body: "Istana Melawati, Putrajaya" },
  { title: "Commercial & offices", body: "Corporate portfolios, towers" },
];

const PANEL =
  "absolute top-full left-[var(--edge)] bg-bg shadow-lg grid grid-cols-2 animate-kfm-press z-50";
const PANEL_ITEM =
  "block cursor-pointer transition-[color,transform] duration-[180ms] hover:text-accent-700 hover:translate-x-[3px]";

export function SiteNav() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<"work" | "sectors" | null>(null);
  const closeMenu = () => setMenu(null);
  const current = (href: string) => (pathname === href ? "page" : undefined);

  return (
    <header className="sticky top-0 z-40 bg-bg">
      <nav className="nav relative mx-auto flex max-w-[1240px] items-baseline gap-[28px] px-[var(--edge)] py-4">
        <Link
          href="/"
          className="nav-brand mr-auto flex cursor-pointer items-center gap-3 transition-opacity duration-[180ms] hover:opacity-65"
          onClick={closeMenu}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/brand/kfm-logo.png"
            alt="KFM Group Sdn Bhd"
            className="block h-[38px] w-auto mix-blend-multiply"
          />
          <span className="text-[11.5px] tracking-[0.14em] text-accent-700 uppercase">
            Facility &amp; asset management
          </span>
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-[26px] gap-y-2">
          <Link href="/about" aria-current={current("/about")} className="cursor-pointer text-sm">
            About
          </Link>

          <span
            className="static -mb-[18px] inline-block pb-[18px]"
            onMouseEnter={() => setMenu("work")}
            onMouseLeave={closeMenu}
          >
            <Link href="/work" aria-current={current("/work")} className="cursor-pointer text-sm">
              What we do
            </Link>
            {menu === "work" && (
              <div
                className={`${PANEL} w-[min(680px,calc(100%-2*var(--edge)))] gap-x-9 gap-y-5 px-7 pt-7 pb-6`}
                onMouseEnter={() => setMenu("work")}
              >
                {WORK_MENU.map((item) => (
                  <Link key={item.title} href="/work" className={PANEL_ITEM} onClick={closeMenu}>
                    <span className="block font-heading text-[17px] leading-6">{item.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-5 text-text/70">
                      {item.body}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </span>

          <Link href="/tech" aria-current={current("/tech")} className="cursor-pointer text-sm">
            Technology
          </Link>

          <span
            className="static -mb-[18px] inline-block pb-[18px]"
            onMouseEnter={() => setMenu("sectors")}
            onMouseLeave={closeMenu}
          >
            <Link
              href="/sectors"
              aria-current={current("/sectors")}
              className="cursor-pointer text-sm"
            >
              Sectors
            </Link>
            {menu === "sectors" && (
              <div
                className={`${PANEL} w-[min(560px,calc(100%-2*var(--edge)))] gap-x-9 gap-y-[18px] p-7`}
                onMouseEnter={() => setMenu("sectors")}
              >
                {SECTORS_MENU.map((item) => (
                  <Link key={item.title} href="/sectors" className={PANEL_ITEM} onClick={closeMenu}>
                    <span className="block font-heading text-[17px]">{item.title}</span>
                    <span className="block font-body text-[13px] text-text/70">{item.body}</span>
                  </Link>
                ))}
              </div>
            )}
          </span>

          <Link href="/people" aria-current={current("/people")} className="cursor-pointer text-sm">
            People
          </Link>

          {siteConfig.showCareers && (
            <Link
              href="/careers"
              aria-current={current("/careers")}
              className="cursor-pointer text-sm"
            >
              Careers
            </Link>
          )}

          <Link
            href="/contact"
            className="btn btn-primary min-h-[34px] whitespace-nowrap"
            onClick={closeMenu}
          >
            Contact us
          </Link>
        </div>
      </nav>
      <div className="h-px origin-left animate-kfm-draw bg-text/14" />
    </header>
  );
}
