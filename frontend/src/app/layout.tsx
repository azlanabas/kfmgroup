import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { PrintPlates } from "@/components/PrintPlates";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: "KFM Group Sdn Bhd — Facility & asset management",
  description:
    "KFM Group has managed Malaysia's built assets since 2003 — from operational input at design stage, through mobilisation and daily operation, to post-operation condition assessment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* data-still is what the artifact's `motion: 'Restrained'` prop set;
            globals.css reads it to hold every reveal visible. */}
        <div
          data-still={siteConfig.motion === "Restrained" ? "" : undefined}
          className="min-h-screen bg-bg font-body"
        >
          <SiteNav />
          {children}
          <BackToTop />
          <SiteFooter />
        </div>
        <Reveal />
        <PrintPlates />
      </body>
    </html>
  );
}
