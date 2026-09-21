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

  company: {
    name: "KFM Group Sdn Bhd",
    registration: "200301003726 (606146-K)",
    incorporated: "16 February 2003",
    formerly: "Ikhtiar Maintenance (M) Sdn Bhd",
    cidbGrade: "G7",
    email: "hq.admin@kfmgroup.my",
    phone: "+603 6144 5364",
    phoneHref: "tel:+60361445364",
    fax: "03 7663 1264",
    locations: "Kuala Lumpur, Putrajaya, Penang",
  },
} as const;

export type SiteConfig = typeof siteConfig;
