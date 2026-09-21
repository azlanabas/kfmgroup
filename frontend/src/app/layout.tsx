import type { Metadata, Viewport } from "next";
import { BackToTop } from "@/components/BackToTop";
import { JsonLd } from "@/components/JsonLd";
import { PrintPlates } from "@/components/PrintPlates";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const TITLE = "KFM Group Sdn Bhd — Facility & asset management";
const DESCRIPTION =
  "KFM Group has managed Malaysia's built assets since 2003 — from operational input at design stage, through mobilisation and daily operation, to post-operation condition assessment.";

export const metadata: Metadata = {
  // metadataBase makes every relative canonical/OG URL in child pages absolute.
  metadataBase: new URL(siteConfig.url),
  title: {
    default: TITLE,
    // Child pages set only their own title; the brand is appended here.
    template: "%s — KFM Group Sdn Bhd",
  },
  description: DESCRIPTION,
  applicationName: siteConfig.company.shortName,
  alternates: { canonical: "/" },
  keywords: [
    "facility management Malaysia",
    "integrated facility management",
    "asset management",
    "building condition assessment",
    "energy management",
    "CIDB G7 contractor",
    "ISO 41001",
    "Green Building Index",
    "Kuala Lumpur",
    "Putrajaya",
    "Penang",
  ],
  authors: [{ name: siteConfig.company.name, url: siteConfig.url }],
  creator: siteConfig.company.name,
  publisher: siteConfig.company.name,
  category: "Facility management",
  openGraph: {
    type: "website",
    siteName: siteConfig.company.name,
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_MY",
    images: [
      {
        url: siteConfig.company.logo,
        width: 902,
        height: 236,
        alt: siteConfig.company.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [siteConfig.company.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The page must stay pinch-zoomable — capping it is an accessibility failure.
  maximumScale: 5,
  themeColor: "#f3f2f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY">
      <body>
        {/* data-still is what the artifact's `motion: 'Restrained'` prop set;
            globals.css reads it to hold every reveal visible. */}
        <div
          data-still={siteConfig.motion === "Restrained" ? "" : undefined}
          className="min-h-screen bg-bg font-body"
        >
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <SiteNav />
          {children}
          <BackToTop />
          <SiteFooter />
        </div>
        <Reveal />
        <PrintPlates />
        <JsonLd data={graph([organizationSchema(), websiteSchema()])} />
      </body>
    </html>
  );
}
