import type { Metadata } from "next";
import { AboutDetail } from "@/components/sections/about/AboutDetail";
import { AboutIntro } from "@/components/sections/about/AboutIntro";

export const metadata: Metadata = {
  title: "About — KFM Group Sdn Bhd",
  description:
    "Incorporated in 2003 to hold buildings to account. KFM Group's history, vision, value propositions and competencies.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[1240px] px-[var(--edge)] pt-[clamp(44px,6vw,92px)]">
      <AboutIntro />
      <AboutDetail />
    </main>
  );
}
