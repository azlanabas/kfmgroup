/**
 * Every contract and person on the site, transcribed from "KFM Group.html"
 * (the Claude Artifact this project was ported from) on 2026-09-22. This file
 * is the editable source of the site's content: change a row, re-run
 * `npm run seed`, redeploy. There is no admin UI — owner decision #6.
 *
 * Client names are kept as the artifact worded them ("A federal health
 * ministry"), not resolved to the actual agency.
 */

export type ContractSeed = {
  title: string;
  client: string;
  term_start: string | null;
  term_end: string | null;
  term_label: string;
  value_label: string;
  status: "live" | "completed";
  sector: string | null;
  summary: string | null;
  card_note: string | null;
  image_url: string | null;
  image_alt: string | null;
  sort_order: number;
};

export type PersonSeed = {
  name: string;
  role: string;
  bio: string;
  group_label: string;
  photo_url: string | null;
  sort_order: number;
};

export const CONTRACTS: ContractSeed[] = [
  {
    title: "Clinic support services, nine public health clinics",
    client: "A federal health ministry",
    term_start: "2022-09-01",
    term_end: "2027-08-31",
    term_label: "1 September 2022 — 31 August 2027, ongoing",
    value_label: "RM 36,051,575.20",
    status: "live",
    sector: "Healthcare",
    summary:
      "Clinic support services across nine public health clinics in Pulau Pinang for a federal health ministry — Seberang Jaya, Jalan Perak, Jalan Angsana, Bayan Baru, Tasek Gelugor, Penaga, Kepala Batas, Sungai Dua and Butterworth. Clinical environments do not close, so the work is planned around the session list.",
    card_note: "Pulau Pinang, for a federal health ministry. September 2022 to August 2027.",
    image_url: "/media/photos/clinic-penang.jpeg",
    image_alt: "Public health clinic, Pulau Pinang",
    sort_order: 10,
  },
  {
    title: "Integrated FM, Terminal Bersepadu Gombak",
    client: "The terminal operator",
    term_start: null,
    term_end: null,
    term_label: "Ongoing",
    value_label: "RM 50,414,328.00",
    status: "live",
    sector: "Transport terminals",
    summary:
      "Integrated facilities management for Terminal Bersepadu Gombak, a public transport interchange running long operating hours under heavy passenger load. Our leadership's experience in public transport terminal operation sits behind the contract.",
    card_note: "Kuala Lumpur, for the terminal operator. Ongoing.",
    image_url: "/media/photos/terminal-gombak.jpeg",
    image_alt: "Terminal Bersepadu Gombak concourse",
    sort_order: 20,
  },
  {
    title: "Integrated FM, Istana Melawati",
    client: "A federal public works authority",
    term_start: "2026-08-17",
    term_end: "2029-08-16",
    term_label: "17 August 2026 — 16 August 2029",
    value_label: "RM 30,240,000.00",
    status: "live",
    sector: "Government & royal buildings",
    summary:
      "Integrated facilities management for Istana Melawati, Putrajaya, for a federal public works authority. Earlier work in this sector includes facilities management of Masjid Putra, Putrajaya, and of a federal youth and sports ministry's Putrajaya premises.",
    card_note: "Putrajaya, for a federal public works authority. 2026 to 2029.",
    image_url: "/media/photos/istana-melawati.jpeg",
    image_alt: "Istana Melawati, Putrajaya",
    sort_order: 30,
  },
  {
    title: "Integrated facility management services, a national carrier's offices, Kelana Jaya",
    client: "A corporate real-estate client",
    term_start: "2017-11-01",
    term_end: "2018-12-31",
    term_label: "1 Nov 2017 — 31 Dec 2018",
    value_label: "RM 127,500 per month",
    status: "completed",
    sector: null,
    summary: null,
    card_note: null,
    image_url: null,
    image_alt: null,
    sort_order: 40,
  },
  {
    title: "Hotel management services, the same offices",
    client: "A corporate real-estate client",
    term_start: "2017-11-01",
    term_end: "2018-12-31",
    term_label: "1 Nov 2017 — 31 Dec 2018",
    value_label: "RM 52,500 per month",
    status: "completed",
    sector: null,
    summary: null,
    card_note: null,
    image_url: null,
    image_alt: null,
    sort_order: 50,
  },
  {
    title: "Facilities management, Masjid Putra, Putrajaya",
    client: "Federal",
    term_start: "2021-02-01",
    term_end: "2022-01-31",
    term_label: "1 Feb 2021 — 31 Jan 2022",
    value_label: "—",
    status: "completed",
    sector: null,
    summary: null,
    card_note: null,
    image_url: null,
    image_alt: null,
    sort_order: 60,
  },
  {
    title: "Facilities management, a federal youth and sports ministry and the DCA, Putrajaya",
    client: "Federal",
    term_start: null,
    term_end: null,
    term_label: "—",
    value_label: "—",
    status: "completed",
    sector: null,
    summary: null,
    card_note: null,
    image_url: null,
    image_alt: null,
    sort_order: 70,
  },
];

const DIRECTORS = "Directors and shareholders";
const MANAGEMENT = "Management";

export const PEOPLE: PersonSeed[] = [
  {
    name: "Fardan Abdul Majeed",
    role: "Executive Director",
    bio: "Co-founder of KFM Holdings Sdn Bhd, a provider of integrated facilities management, green technology and sustainability services in Malaysia and the United Arab Emirates. He was instrumental in the acquisition of Operon Middle East, an asset management business in the MENA region, and in securing a twenty-year concession from the Government of Malaysia to transform the Prime Minister's Office into a GBI platinum-certified building.\n\nIn December 2015 he sold his stake in KFM to UEM Edgenta Berhad in a transaction valued at RM128 million, with outstanding contracts then worth more than RM700 million. He graduated with distinction in business administration from the Royal Melbourne Institute of Technology.",
    group_label: DIRECTORS,
    photo_url: "/media/portraits/fardan-abdul-majeed.png",
    sort_order: 10,
  },
  {
    name: "Aznul Abdullah",
    role: "Executive Director",
    bio: "Group Chief Executive Officer of Bayo Pay (M) Sdn Bhd and a board member of Danainfra Nasional Berhad. Previously Head of Project Finance Advisory and Director of Investment Banking at Kuwait Finance House (M) Bhd, advising government and concessionaires on project structuring and fund raising for infrastructure and concession projects.\n\nHe spent several years in London with an international advisory firm across transport infrastructure, regulated utilities, power generation, schools and healthcare. A full member of CPA Australia with over sixteen years in audit and financial advisory, he holds a Bachelor of Commerce in Accounting from the University of New South Wales.",
    group_label: DIRECTORS,
    photo_url: "/media/portraits/aznul-abdullah.png",
    sort_order: 20,
  },
  {
    name: "Shahridan Sharif",
    role: "Executive Director",
    bio: "A mechanical engineering graduate of Rensselaer, he began as a project engineer at PETRONAS and spent twenty years with two project management consultancies. He has managed infrastructure projects including the Putrajaya development and Iskandar development in Johor, and is a certified Professional Project Manager and registered practising engineer.",
    group_label: DIRECTORS,
    photo_url: "/media/portraits/shahridan-sharif.jpeg",
    sort_order: 30,
  },
  {
    name: "Nasharullizam Bin Kharay",
    role: "General Manager",
    bio: "Over eighteen years in facilities management across Malaysia and Qatar, covering technical operations, consultancy, business development and tender management. A Certified Healthcare Facility Manager from the International Islamic University Malaysia, professionally trained in electrical equipment and installation technology.",
    group_label: MANAGEMENT,
    photo_url: "/media/portraits/nasharullizam-kharay.jpeg",
    sort_order: 40,
  },
  {
    name: "Meor Safuan Aiman Bin Meor Shaharom",
    role: "Head of Facility Management Operation",
    bio: "A Master's in Facility Management with distinction, certified Facility Management Executive (CIDB) and ISO 41001:2018 lead auditor (SIRIM). Eleven years across the full spectrum of facilities management, with early experience in construction as a certified safety and health officer.",
    group_label: MANAGEMENT,
    photo_url: "/media/portraits/meor-safuan-aiman.png",
    sort_order: 50,
  },
  {
    name: "Azlan Abas",
    role: "Solutions Architect",
    bio: "Over 30 years in Mechanical Engineering and Software Engineering from Western Michigan University across Malaysia, Singapore, Indonesia covering Facility Management and Engineering Consultancy. An Asian Certified Professional Engineer, Professional Engineer with Practicing Certificate, Project Management Professional, Google Certified Cloud Engineer, Certified Energy Auditor, LEED AP (BD&C).",
    group_label: MANAGEMENT,
    // The artifact carried no portrait for this entry.
    photo_url: null,
    sort_order: 60,
  },
  {
    name: "Yusro Khamuna binti Yusoff",
    role: "General Manager, Human Resources & Administration",
    bio: "A Bachelor of Science in Business Administration from West Virginia University, with over twenty years in administration management across healthcare, facilities management, energy, property development, construction and agriculture.",
    group_label: MANAGEMENT,
    photo_url: "/media/portraits/yusro-khamuna.png",
    sort_order: 70,
  },
  {
    name: "Ramli Ishak",
    role: "Finance & Human Resource Manager",
    bio: "Over twenty-five years in finance, accounting and human resource management across food and beverage, oil and gas and manufacturing — setting up departments, ensuring regulatory compliance, and running payroll, benefits and employee relations.",
    group_label: MANAGEMENT,
    photo_url: "/media/portraits/ramli-ishak.png",
    sort_order: 80,
  },
];
