/**
 * The artifact exposed three editor props on its `<script type="text/x-dc">`
 * block — showContractValues, showCareers and motion. There is no artifact
 * editor any more, so they live here as build-time flags. Changing one and
 * redeploying is the supported way to hide contract values or take the
 * Careers page out of the navigation.
 */
export const siteConfig = {
  /** Show the RM figures on Home, Sectors and the contracts table. */
  showContractValues: true,
  /** Show the Careers link in the navigation and serve /careers. */
  showCareers: true,
  /**
   * 'Expressive' runs the scroll-reveal animations; 'Restrained' sets
   * data-still on the shell, which the CSS reads to hold everything visible.
   */
  motion: "Expressive" as "Expressive" | "Restrained",

  /**
   * Absolute base URL. Every canonical tag, Open Graph URL, sitemap entry and
   * JSON-LD @id is built from this — owner decision 2026-09-22.
   * NEXT_PUBLIC_SITE_URL overrides it for a staging host.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kfmgroup.my").replace(/\/$/, ""),

  company: {
    name: "KFM Group Sdn Bhd",
    shortName: "KFM Group",
    registration: "200301003726 (606146-K)",
    incorporated: "16 February 2003",
    incorporatedISO: "2003-02-16",
    formerly: "Ikhtiar Maintenance (M) Sdn Bhd",
    cidbGrade: "G7",
    email: "hq.admin@kfmgroup.my",
    phone: "+603 6144 5364",
    phoneE164: "+60361445364",
    phoneHref: "tel:+60361445364",
    fax: "03 7663 1264",
    locations: "Kuala Lumpur, Putrajaya, Penang",
    logo: "/media/brand/kfm-logo.png",
  },

  /** Postal addresses, used by the contact page and the LocalBusiness JSON-LD. */
  addresses: [
    {
      label: "Corporate office",
      street: "70-2, Jalan PJU 5/22, Encorp Strand, Pusat Perdagangan Kota Damansara PJU 5",
      locality: "Petaling Jaya",
      region: "Selangor Darul Ehsan",
      postcode: "47810",
      country: "MY",
      primary: true,
    },
    {
      label: "Operations — Penang",
      street: "G-9 & 1-9 Pusat Perniagaan Perdana Jaya, Jalan Permatang Rawa",
      locality: "Bukit Mertajam",
      region: "Pulau Pinang",
      postcode: "14000",
      country: "MY",
      primary: false,
    },
    {
      label: "Operations — Terminal Bersepadu Gombak",
      street: "Terminal Bersepadu Gombak, 1 Jalan Terminal Putra, Taman Melati",
      locality: "Kuala Lumpur",
      region: "Wilayah Persekutuan",
      postcode: "53100",
      country: "MY",
      primary: false,
    },
  ],

  /** The service lines, used for the Organization JSON-LD offer catalogue. */
  services: [
    "Facility management set-up and advisory",
    "Contract implementation and administration",
    "Building, asset and facility condition assessment",
    "Integrated facility management, project and construction management",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
