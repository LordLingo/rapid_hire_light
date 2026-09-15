import type { LandingFaq } from "@/content/employerScreeningLandingPages";
import type { EmployerLeadFormPageConfig } from "@/lib/employerLandingForms";

export const INDUSTRY_COMPANY_SLUGS = [
  "cleaning-companies",
  "moving-companies",
] as const;

export type IndustryCompanySlug = (typeof INDUSTRY_COMPANY_SLUGS)[number];

export interface IndustryCompanyPageConfig {
  readonly kind: "cleaning" | "moving";
  readonly slug: IndustryCompanySlug;
  readonly name: string;
  readonly route: `/industries/${IndustryCompanySlug}`;
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonical: string;
    readonly image: string;
    readonly keywords: readonly string[];
  };
  readonly eyebrow: string;
  readonly h1: string;
  readonly subhead: string;
  readonly qualification: string;
  readonly primaryCta: string;
  readonly secondaryCta: string;
  readonly illustration: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
  };
  readonly formConfig: EmployerLeadFormPageConfig;
  readonly faq: readonly LandingFaq[];
}

const SOCIAL_IMAGE =
  "https://www.rapidhiresolutions.com/static/rhs5-og-card.png";

const VOLUME_OPTIONS = [
  "1–10 employees or hires",
  "11–25 employees or hires",
  "26–100 employees or hires",
  "101–500 employees or hires",
  "500+ employees or hires",
] as const;

const CLEANING_SERVICES = [
  "Identity / SSN trace where appropriate",
  "County criminal searches",
  "Multi-jurisdictional criminal database search",
  "Federal criminal search",
  "Sex offender registry search",
  "Employment verification",
  "Motor Vehicle Records (MVR)",
  "Drug screening",
  "Continuous monitoring",
] as const;

const MOVING_SERVICES = [
  "Identity / SSN trace where appropriate",
  "County criminal searches",
  "Multi-jurisdictional criminal database search",
  "Federal criminal search",
  "Employment verification",
  "Motor Vehicle Records (MVR)",
  "Drug screening",
  "Continuous monitoring",
] as const;

export const CLEANING_COMPANY_FAQ: readonly LandingFaq[] = [
  {
    question: "Should a cleaning company background check every employee?",
    answer:
      "A cleaning company should define screening by the duties, access, work location, customer commitments, and applicable law for each role. A residential cleaner, commercial crew leader, office coordinator, and driver may not need identical packages. Employers should document a consistent, job-related process rather than assume one universal package fits every worker.",
  },
  {
    question:
      "What background checks are commonly considered for residential cleaners?",
    answer:
      "Depending on the position, employers may consider identity inputs, appropriate county-level criminal searches, a broader criminal database used as a pointer, federal criminal searches, sex offender registry searches where appropriate and legally permissible, and employment verification. The final scope should reflect the role, jurisdiction, and level of access to customers' homes.",
  },
  {
    question: "Should cleaning-company drivers receive MVR checks?",
    answer:
      "When driving a company vehicle or routinely traveling between customer locations is an essential duty, a Motor Vehicle Record can help an employer review license status and relevant driving history. The employer should define the driving criteria in advance and apply them consistently under applicable law.",
  },
  {
    question: "Can screening packages differ by role?",
    answer:
      "Yes. A role-specific structure lets a cleaning company align checks with actual responsibilities. Drivers may warrant MVR screening, supervisors may have added access responsibilities, and specialty crews may need checks driven by a facility or customer contract. Rapid Hire can help organize those packages without treating every position the same.",
  },
  {
    question:
      "How should a cleaning company handle criminal-history information?",
    answer:
      "Employers should evaluate screening information according to the Fair Credit Reporting Act, applicable state and local requirements, and their documented hiring policies. Decisions should consider job relevance and any required individualized assessment. This page provides general information, not legal advice.",
  },
  {
    question: "Can Rapid Hire support multi-location cleaning companies?",
    answer:
      "Rapid Hire can help structure repeatable packages for different roles, branches, and service environments. The employer remains responsible for identifying the positions, locations, customer commitments, and policies that shape each package.",
  },
  {
    question: "Can screening requirements vary by customer contract?",
    answer:
      "Yes. Property managers, healthcare facilities, schools, government contractors, and other customers may set their own access or screening terms. Those requirements are not universal, so they should be reviewed contract by contract and translated into a documented package for the affected roles.",
  },
] as const;

export const MOVING_COMPANY_FAQ: readonly LandingFaq[] = [
  {
    question: "What background checks are commonly used for movers?",
    answer:
      "Depending on the role, a moving company may consider identity inputs, role-appropriate county and broader criminal searches, employment verification, and driving-record checks for employees who operate company vehicles. The package should follow the person's actual duties, locations, and applicable law.",
  },
  {
    question:
      "Should every moving-company employee receive the same package?",
    answer:
      "No. Movers, helpers, crew leaders, drivers, warehouse employees, and dispatch staff carry different responsibilities. A role-based screening matrix helps the employer apply relevant checks consistently without ordering driving or regulated-role components for positions that do not need them.",
  },
  {
    question: "Do moving-company drivers need MVR checks?",
    answer:
      "An MVR is commonly considered when driving is an essential job duty because it can confirm license status and report relevant driving history. The scope and decision criteria should be tied to the role, vehicle, jurisdiction, insurance requirements, and documented employer policy.",
  },
  {
    question: "Does every mover fall under DOT regulations?",
    answer:
      "No. DOT and FMCSA applicability depends on the employee's duties, vehicle, operating authority, jurisdiction, and operating circumstances. A non-regulated moving driver is not automatically a DOT driver. Employers should determine the applicable requirements for each operation and seek qualified legal or compliance guidance when needed.",
  },
  {
    question: "Can Rapid Hire screen seasonal moving crews?",
    answer:
      "Rapid Hire can help a moving company define repeatable packages and a consistent invitation workflow for seasonal or surge hiring. Turnaround still varies by service, jurisdiction, court access, source availability, and third-party response.",
  },
  {
    question: "Can we use different packages for drivers and helpers?",
    answer:
      "Yes. A helper package can focus on the checks relevant to home access and property handling, while a driver package can add MVR, license-status, or drug-screening components when appropriate. Regulated-driver requirements should be scoped separately when they apply.",
  },
  {
    question: "Can Rapid Hire support multiple branches?",
    answer:
      "Rapid Hire can help organize consistent role packages across branches while accounting for different locations, customer requirements, and job duties. That gives operations leaders a common process without assuming every jurisdiction is identical.",
  },
  {
    question: "Can driver monitoring continue after hire?",
    answer:
      "Continuous monitoring is available as a screening component and may be considered for appropriate driving roles. Its use, notices, authorization, review process, and employment decisions should follow applicable law and the employer's documented policy.",
  },
] as const;

const cleaningFormConfig: EmployerLeadFormPageConfig = {
  route: "/industries/cleaning-companies",
  seo: {
    title: "Background Checks for Cleaning Companies",
    canonical:
      "https://www.rapidhiresolutions.com/industries/cleaning-companies",
  },
  cta: "Build My Screening Package",
  form: {
    companyLabel: "Company",
    volumeLabel: "Number of employees or monthly hires",
    volumeOptions: VOLUME_OPTIONS,
    industry: "cleaning_companies",
    subject: "Industry lead — cleaning companies",
    details: [
      {
        id: "cleaning-locations",
        label: "Locations / branches",
        messageLabel: "Locations / branches",
        required: true,
        type: "text",
      },
      {
        id: "cleaning-roles",
        label: "Primary roles being screened",
        messageLabel: "Primary roles being screened",
        required: true,
        type: "text",
      },
      {
        id: "cleaning-notes",
        label: "Additional notes (optional)",
        messageLabel: "Additional notes",
        required: false,
        type: "textarea",
      },
    ],
    services: {
      label: "Services needed",
      required: true,
      type: "checkboxes",
      options: CLEANING_SERVICES,
    },
  },
};

const movingFormConfig: EmployerLeadFormPageConfig = {
  route: "/industries/moving-companies",
  seo: {
    title: "Background Checks for Moving Companies",
    canonical:
      "https://www.rapidhiresolutions.com/industries/moving-companies",
  },
  cta: "Build My Moving Company Package",
  form: {
    companyLabel: "Company",
    volumeLabel: "Number of employees or monthly hires",
    volumeOptions: VOLUME_OPTIONS,
    industry: "moving_companies",
    subject: "Industry lead — moving companies",
    details: [
      {
        id: "moving-locations",
        label: "Locations / branches",
        messageLabel: "Locations / branches",
        required: true,
        type: "text",
      },
      {
        id: "moving-roles",
        label: "Primary roles being screened",
        messageLabel: "Primary roles being screened",
        required: true,
        type: "text",
      },
      {
        id: "moving-notes",
        label: "Additional notes (optional)",
        messageLabel: "Additional notes",
        required: false,
        type: "textarea",
      },
    ],
    services: {
      label: "Services needed",
      required: true,
      type: "checkboxes",
      options: MOVING_SERVICES,
    },
  },
};

export const INDUSTRY_COMPANY_PAGES: Readonly<
  Record<IndustryCompanySlug, IndustryCompanyPageConfig>
> = {
  "cleaning-companies": {
    kind: "cleaning",
    slug: "cleaning-companies",
    name: "Cleaning Companies",
    route: "/industries/cleaning-companies",
    seo: {
      title: "Background Checks for Cleaning Companies | Rapid Hire Solutions",
      description:
        "Build a faster, role-specific employee screening program for residential and commercial cleaning teams, including criminal checks, MVRs, employment verification and more.",
      canonical:
        "https://www.rapidhiresolutions.com/industries/cleaning-companies",
      image: SOCIAL_IMAGE,
      keywords: [
        "background checks for cleaning companies",
        "background checks for house cleaners",
        "employee screening for cleaning companies",
        "janitorial employee background checks",
        "residential cleaning employee screening",
      ],
    },
    eyebrow: "BACKGROUND CHECKS FOR CLEANING COMPANIES",
    h1: "Hire Cleaning Staff You Can Confidently Send Into a Customer’s Home.",
    subhead:
      "Your employees may work inside homes, offices, healthcare facilities, schools, and other spaces where customers expect trust from the moment the door opens. Rapid Hire helps cleaning companies build practical screening programs without turning hiring into a bottleneck.",
    qualification:
      "Screening requirements vary by role, location, customer contract, and applicable law.",
    primaryCta: "Build My Screening Package",
    secondaryCta: "Get a Custom Quote",
    illustration: {
      src: "/static/industries/cleaning-companies.svg",
      alt: "Editorial scene of a uniformed cleaning professional, property key, access badge, and completed screening checklist",
      width: 800,
      height: 640,
    },
    formConfig: cleaningFormConfig,
    faq: CLEANING_COMPANY_FAQ,
  },
  "moving-companies": {
    kind: "moving",
    slug: "moving-companies",
    name: "Moving Companies",
    route: "/industries/moving-companies",
    seo: {
      title: "Background Checks for Moving Companies | Rapid Hire Solutions",
      description:
        "Screen movers, drivers, crew leaders and storage staff with role-specific background checks built for residential and commercial moving companies.",
      canonical:
        "https://www.rapidhiresolutions.com/industries/moving-companies",
      image: SOCIAL_IMAGE,
      keywords: [
        "background checks for moving companies",
        "background checks for movers",
        "moving company employee background checks",
        "moving company driver background checks",
        "household goods moving background checks",
      ],
    },
    eyebrow: "BACKGROUND CHECKS FOR MOVING COMPANIES",
    h1: "Screen the People Customers Trust With Everything They Own.",
    subhead:
      "Moving crews enter homes, handle valuable property, operate vehicles, and represent your company during one of the most stressful days your customer will experience. Rapid Hire helps moving companies build role-specific screening programs without unnecessarily slowing down hiring.",
    qualification:
      "Screening and driver requirements depend on the employee’s duties, vehicle type, operating authority, jurisdiction, and applicable law.",
    primaryCta: "Build My Moving Company Package",
    secondaryCta: "Get a Custom Quote",
    illustration: {
      src: "/static/industries/moving-companies.svg",
      alt: "Editorial scene of a residential moving crew, box truck, household boxes, driver credential, and screening checklist",
      width: 800,
      height: 640,
    },
    formConfig: movingFormConfig,
    faq: MOVING_COMPANY_FAQ,
  },
};

export function getIndustryCompanyPage(
  slug: string,
): IndustryCompanyPageConfig | undefined {
  return INDUSTRY_COMPANY_PAGES[slug as IndustryCompanySlug];
}

export function buildIndustryCompanyStructuredData(
  config: IndustryCompanyPageConfig,
): Record<string, unknown>[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Industries",
          item: "https://www.rapidhiresolutions.com/industries",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: config.name,
          item: config.seo.canonical,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: config.seo.title.replace(" | Rapid Hire Solutions", ""),
      description: config.seo.description,
      url: config.seo.canonical,
      provider: {
        "@type": "Organization",
        name: "Rapid Hire Solutions",
        url: "https://www.rapidhiresolutions.com",
      },
      areaServed: "US",
      audience: {
        "@type": "BusinessAudience",
        audienceType: config.name,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}
