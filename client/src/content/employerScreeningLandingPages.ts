export const EMPLOYER_LANDING_PAGE_KEYS = [
  "staffing",
  "healthcare",
  "criminal",
  "preEmployment",
] as const;

export type EmployerLandingPageKey =
  (typeof EMPLOYER_LANDING_PAGE_KEYS)[number];

export interface LandingLink {
  readonly label: string;
  readonly href: string;
}

export interface LandingContentItem {
  readonly title: string;
  readonly body: string;
}

export type LandingSectionKind =
  | "cards"
  | "steps"
  | "bullets"
  | "sample";

export interface LandingSection {
  readonly id: string;
  readonly kind: LandingSectionKind;
  readonly heading: string;
  readonly intro?: string;
  readonly body?: string;
  readonly items?: readonly LandingContentItem[];
  readonly steps?: readonly string[];
  readonly bullets?: readonly string[];
  readonly links?: readonly LandingLink[];
  readonly disclaimer?: string;
  readonly cta?: LandingLink;
  readonly columns?: 2 | 3 | 4;
}

export interface LandingFaq {
  readonly question: string;
  readonly answer: string;
}

export interface LandingDetailField {
  readonly id: string;
  readonly label: string;
  readonly messageLabel: string;
  readonly required: boolean;
  readonly type: "text" | "textarea" | "select";
  readonly options?: readonly string[];
}

export interface LandingServicesField {
  readonly label: string;
  readonly required: boolean;
  readonly type: "checkboxes" | "select";
  readonly options: readonly string[];
}

export interface EmployerLandingFormConfig {
  readonly companyLabel: string;
  readonly volumeLabel: string;
  readonly volumeOptions: readonly string[];
  readonly details: readonly LandingDetailField[];
  readonly services?: LandingServicesField;
  readonly industry?: string;
  readonly subject: string;
}

export interface LandingHeroVisual {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface EmployerScreeningLandingPageConfig {
  readonly key: EmployerLandingPageKey;
  readonly route: string;
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonical: string;
    readonly image: string;
  };
  readonly eyebrow: string;
  readonly h1: string;
  readonly subhead: string;
  readonly supporting: string;
  readonly cta: string;
  readonly caveat: string;
  readonly heroVisual: LandingHeroVisual;
  readonly form: EmployerLandingFormConfig;
  readonly sections: readonly LandingSection[];
  readonly faq: readonly LandingFaq[];
  readonly finalCta: {
    readonly heading: string;
    readonly body: string;
    readonly cta: string;
  };
}

export const REQUIRED_TIMING_QUALIFICATION =
  "Timing varies by service, jurisdiction, court access, source availability, and third-party response.";

export const EMPLOYER_LANDING_CONSENT =
  "By submitting, you agree to be contacted about Rapid Hire Solutions services. We never share your details. No sales auto-sequences — one real specialist emails you back.";

export const EMPLOYER_LANDING_VOLUME_OPTIONS = [
  "1–25 checks / month",
  "26–100 checks / month",
  "101–500 checks / month",
  "501–1,500 checks / month",
  "1,500+ checks / month",
] as const;

const SOCIAL_IMAGE =
  "https://www.rapidhiresolutions.com/static/rhs5-og-card.png";

const staffing: EmployerScreeningLandingPageConfig = {
  key: "staffing",
  route: "/lp/staffing-background-checks",
  seo: {
    title: "Background Checks for Staffing & Recruiting Firms",
    description:
      "Employer background screening for staffing and recruiting firms, with mobile candidate intake, role-based packages, workflow options, and U.S.-based support.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/staffing-background-checks",
    image: SOCIAL_IMAGE,
  },
  eyebrow: "Staffing & recruiting",
  h1: "Background Checks for Staffing & Recruiting Firms",
  subhead:
    "Move candidates to placement with flexible employer screening, transparent per-check pricing, and U.S.-based support.",
  supporting:
    "Screen direct-hire, temporary, and contract candidates through one employer workflow. Invite candidates on mobile, use role-based packages, and connect a verified ATS where supported.",
  cta: "Get Staffing Pricing",
  caveat:
    "For employers and staffing agencies only — not tenant, landlord, or personal checks. Timing varies by service, jurisdiction, court access, source availability, and third-party response.",
  heroVisual: {
    src: "/static/lp/staffing-screening-workflow.svg",
    alt: "Staffing team coordinating candidate background screening",
    width: 960,
    height: 640,
  },
  form: {
    companyLabel: "Company website or company name",
    volumeLabel: "Monthly screening volume",
    volumeOptions: EMPLOYER_LANDING_VOLUME_OPTIONS,
    industry: "Staffing & Light Industrial",
    subject: "Landing page lead — /lp/staffing-background-checks",
    details: [
      {
        id: "staffing-ats-provider",
        label: "Current ATS or screening provider (optional)",
        messageLabel: "Current ATS or screening provider",
        required: false,
        type: "text",
      },
    ],
  },
  sections: [
    {
      id: "placement-bottleneck",
      kind: "cards",
      heading: "Keep screening from becoming the placement bottleneck.",
      intro:
        "High-volume teams lose time when recruiters re-enter candidate data, chase status across systems, or rebuild packages for every role. The screening workflow should match the placement model.",
      columns: 3,
      items: [
        {
          title: "Repeated entry",
          body: "Use candidate-facing mobile intake so applicants provide their own information and authorization.",
        },
        {
          title: "Status chasing",
          body: "Keep order status visible in the screening workflow. Verified integrations can return status to the system your recruiters already use.",
        },
        {
          title: "Mixed role requirements",
          body: "Define role-based packages so a clerical placement, driver, and healthcare worker do not receive the same checks by default.",
        },
      ],
    },
    {
      id: "role-packages",
      kind: "cards",
      heading: "Start with the role, then choose the checks.",
      intro:
        "These examples are scoping guides, not fixed offers. Final packages depend on the role, work location, client requirements, and applicable law.",
      columns: 3,
      items: [
        {
          title: "General placement",
          body: "Select role-relevant criminal and identity inputs, then add employment verification when the position requires it.",
        },
        {
          title: "Driver or safety-sensitive placement",
          body: "Add motor-vehicle records and, when aligned with employer policy, an appropriate drug-testing workflow.",
        },
        {
          title: "Healthcare placement",
          body: "Consider criminal, exclusion, license, employment, and education services based on the role and care setting.",
        },
      ],
    },
    {
      id: "workflow-integrations",
      kind: "steps",
      heading: "Choose direct ordering, bulk workflow, or a verified integration.",
      body:
        "Order directly, use documented bulk workflows, or work through a current integration. The verified registry lists CATS, Erecruit, iCIMS, Greenhouse, JazzHR, Lever, and Workable as Live. Exact setup and workflow behavior depend on the selected system and account.",
      steps: [
        "Create the order and select the role package.",
        "The candidate completes mobile intake and authorization.",
        "Track status and review completed results.",
      ],
      links: [
        {
          label: "Review the integration directory",
          href: "/integrations",
        },
      ],
    },
    {
      id: "turnaround",
      kind: "bullets",
      heading: "Turnaround depends on the searches in the package.",
      body:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Electronic searches may return before manual court or direct-source verification. Do not apply a standard-check turnaround statement to employment verification.",
    },
    {
      id: "pricing",
      kind: "bullets",
      heading: "Request pricing for the screens you actually need.",
      body:
        "Request a written, itemized quote covering the selected checks, screening volume, role assumptions, jurisdictions, and any applicable third-party costs in the requested scope.",
      cta: {
        label: "Get Staffing Pricing",
        href: "#lead-form",
      },
    },
    {
      id: "sample",
      kind: "sample",
      heading: "Request a Redacted Sample",
      body:
        "Use the form to tell us which staffing package you are evaluating and request a redacted sample.",
      cta: {
        label: "Request a Redacted Sample",
        href: "#lead-form",
      },
    },
    {
      id: "compliance-workflow",
      kind: "steps",
      heading: "Keep authorization, review, and adverse action in the workflow.",
      body:
        "Before screening begins, the employer confirms permissible purpose and follows the applicable disclosure and authorization process. If report information may affect a hiring decision, the employer’s process should provide the report and rights information, allow time for a dispute or clarification, and send final notice only if the decision proceeds.",
      disclaimer:
        "Workflow tools support the employer’s process and are not legal advice or a guarantee of compliance.",
      links: [
        { label: "Review candidate rights", href: "/candidates" },
        {
          label: "Review the compliance workflow",
          href: "/compliance",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Can candidates complete the process on a phone?",
      answer:
        "Yes. The documented candidate workflow uses a mobile-friendly intake link for information and authorization.",
    },
    {
      question: "Can we order for a group of candidates?",
      answer:
        "Bulk uploads and selected ATS workflows are documented options. The exact method depends on the selected system and account configuration.",
    },
    {
      question: "Which staffing systems are supported?",
      answer:
        "The current integration registry is the source of truth. Exact ordering and status behavior should be confirmed for the selected system and account.",
    },
    {
      question: "How fast will reports finish?",
      answer:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Manual court and direct-source work can take longer than electronic searches.",
    },
    {
      question: "Do you run tenant or personal checks?",
      answer:
        "No. This page is for employer and staffing-agency screening only.",
    },
  ],
  finalCta: {
    heading: "Build a screening workflow around the roles you place.",
    body:
      "Share your volume, role mix, and current system so the team can scope services, workflow, and itemized pricing.",
    cta: "Get Staffing Pricing",
  },
};

const healthcare: EmployerScreeningLandingPageConfig = {
  key: "healthcare",
  route: "/lp/healthcare-employee-screening",
  seo: {
    title: "Healthcare Employee Background Screening",
    description:
      "Role-specific employee screening for hospitals, clinics, home health, and care teams, including exclusions, license checks, verifications, and drug testing.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/healthcare-employee-screening",
    image: SOCIAL_IMAGE,
  },
  eyebrow: "Healthcare employers",
  h1: "Healthcare Employee Background Screening",
  subhead:
    "Build role-specific screening for hospitals, clinics, home health, and care teams with a package matched to your hiring workflow.",
  supporting:
    "Select criminal, exclusion, license, drug, employment, education, and monitoring services by role rather than applying one package to every worker.",
  cta: "Build a Healthcare Package",
  caveat:
    "Compliance tools support the employer’s process; they are not legal advice or a guarantee of compliance. Timing varies by service, jurisdiction, court access, source availability, and third-party response.",
  heroVisual: {
    src: "/static/lp/healthcare-screening-workflow.svg",
    alt: "Healthcare hiring team coordinating employee screening",
    width: 960,
    height: 640,
  },
  form: {
    companyLabel: "Organization",
    volumeLabel: "Monthly hires",
    volumeOptions: EMPLOYER_LANDING_VOLUME_OPTIONS,
    industry: "Healthcare",
    subject: "Landing page lead — /lp/healthcare-employee-screening",
    details: [
      {
        id: "healthcare-facility-type",
        label: "Facility type",
        messageLabel: "Facility type",
        required: true,
        type: "select",
        options: [
          "Hospital or health system",
          "Clinic or physician group",
          "Home health or hospice",
          "Long-term care or skilled nursing",
          "Behavioral health",
          "Healthcare staffing",
          "Other healthcare employer",
        ],
      },
    ],
    services: {
      label: "Services needed",
      required: true,
      type: "checkboxes",
      options: [
        "Criminal checks",
        "OIG LEIE",
        "SAM",
        "State Medicaid exclusions",
        "Professional license verification",
        "Drug testing",
        "Employment verification",
        "Education verification",
        "Continuous monitoring",
      ],
    },
  },
  sections: [
    {
      id: "employer-types",
      kind: "cards",
      heading: "Match the screen to the care setting and role.",
      intro:
        "Hospitals, clinics, home health, long-term care, behavioral health, and healthcare staffing teams often screen different roles under different policies. Start with access, duties, payer requirements, and employer policy.",
      columns: 4,
      items: [
        {
          title: "Hospitals and health systems",
          body: "Scope packages for clinical, administrative, facilities, and support roles.",
        },
        {
          title: "Clinics and physician groups",
          body: "Select services based on licensure, patient access, and job duties.",
        },
        {
          title: "Home health and long-term care",
          body: "Account for care setting, role requirements, exclusions, and employer policy.",
        },
        {
          title: "Healthcare staffing",
          body: "Configure packages by placement type, client requirements, and jurisdiction.",
        },
      ],
    },
    {
      id: "service-matrix",
      kind: "cards",
      heading: "Build from documented healthcare screening services.",
      columns: 4,
      items: [
        {
          title: "Criminal checks",
          body: "Select national-database, county, state, or federal options according to the role and package scope.",
        },
        {
          title: "OIG LEIE",
          body: "Search the federal exclusion list for relevant individuals or entities.",
        },
        {
          title: "SAM",
          body: "Search federal exclusion and debarment records.",
        },
        {
          title: "State Medicaid",
          body: "Add state-program exclusion searches where relevant.",
        },
        {
          title: "License verification",
          body: "Verify professional-license information against the issuing source.",
        },
        {
          title: "Drug testing",
          body: "Configure the panel, collection, laboratory, and MRO-reviewed workflow that matches employer policy.",
        },
        {
          title: "Employment and education",
          body: "Verify selected history directly with the relevant source.",
        },
        {
          title: "Mobile candidate intake",
          body: "Use mobile candidate intake so candidates can provide information and authorization in the employer screening workflow.",
        },
        {
          title: "Monitoring",
          body: "Add post-hire alerts when they are part of the selected program.",
        },
      ],
      links: [
        {
          label: "Review healthcare sanctions screening",
          href: "/services/healthcare-sanctions",
        },
      ],
    },
    {
      id: "role-packages",
      kind: "cards",
      heading: "Use role examples to scope the package.",
      intro:
        "These examples are starting points, not legal requirements or fixed offers. Final services depend on the role, location, employer policy, and applicable requirements.",
      columns: 3,
      items: [
        {
          title: "Licensed clinician",
          body: "Consider criminal, exclusion, primary-source license, employment, and education services. Add drug testing when aligned with employer policy.",
        },
        {
          title: "Home health or direct-care role",
          body: "Consider criminal, exclusion, role-required verification, and an applicable drug-testing workflow.",
        },
        {
          title: "Administrative or support role",
          body: "Select role-relevant criminal and identity services, then add employment or education verification when needed.",
        },
      ],
    },
    {
      id: "exclusion-license-workflow",
      kind: "steps",
      heading: "Separate exclusion screening from license verification.",
      steps: [
        "Confirm the role, permissible purpose, and candidate authorization process.",
        "Run the selected OIG, SAM, and state Medicaid exclusion searches.",
        "Verify professional-license information against the issuing source.",
        "Route possible matches or discrepancies for employer review.",
        "Add monitoring only when it is part of the selected program.",
      ],
    },
    {
      id: "turnaround",
      kind: "bullets",
      heading: "Set timing by service, not by a universal promise.",
      body:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Electronic exclusion searches may return before license, employment, education, laboratory, or MRO work. Source-dependent services can take several business days.",
    },
    {
      id: "pricing",
      kind: "bullets",
      heading: "Scope services first, then request package pricing.",
      body:
        "Request a written, itemized quote covering the selected services, roles, volume, jurisdictions, and applicable court, laboratory, or other third-party costs.",
      cta: {
        label: "Build a Healthcare Package",
        href: "#lead-form",
      },
    },
    {
      id: "trust-compliance",
      kind: "bullets",
      heading: "Review the documented trust and candidate-rights resources.",
      body:
        "Review the Trust page for the current SOC 2 Type II, PBSA Member, and FCRA-aligned information and verification instructions.",
      disclaimer:
        "These tools support the employer’s screening process. They are not legal advice, a guarantee of compliance, or a guarantee of results.",
      links: [
        { label: "Review trust information", href: "/trust" },
        { label: "Review candidate rights", href: "/candidates" },
        {
          label: "Explore healthcare screening",
          href: "/industries/healthcare",
        },
      ],
    },
    {
      id: "sample",
      kind: "sample",
      heading: "Request a Redacted Sample",
      body:
        "Use the form to tell us which healthcare screening package you are evaluating and request a redacted sample.",
      cta: {
        label: "Request a Redacted Sample",
        href: "#lead-form",
      },
    },
  ],
  faq: [
    {
      question: "Do all healthcare checks finish the same day?",
      answer:
        "No. Timing varies by service, jurisdiction, court access, source availability, and third-party response. Manual license, employment, education, collection, laboratory, and MRO work may take longer than an electronic search.",
    },
    {
      question:
        "What is the difference between exclusion screening and license verification?",
      answer:
        "Exclusion screening searches selected federal or state exclusion sources. License verification confirms credential information with the issuing authority.",
    },
    {
      question: "Can drug testing include MRO review?",
      answer:
        "The repository documents MRO-reviewed drug-testing workflows. Panel, collection, and policy choices depend on the employer’s program.",
    },
    {
      question: "Can monitoring be added after hire?",
      answer:
        "Optional monitoring can be scoped for selected programs. Sources, cadence, and employer response procedures must be confirmed.",
    },
    {
      question: "Where can candidates review their rights?",
      answer:
        "Candidate-rights and dispute information is available on the candidate resource page.",
    },
  ],
  finalCta: {
    heading: "Build a package around the role and care setting.",
    body:
      "Share facility type, hiring volume, and required services so the team can scope workflow, timing, and itemized pricing.",
    cta: "Build a Healthcare Package",
  },
};

const criminal: EmployerScreeningLandingPageConfig = {
  key: "criminal",
  route: "/lp/employer-criminal-background-checks",
  seo: {
    title: "Criminal Background Checks for Employers",
    description:
      "Employer criminal background checks with national database, federal, state, county, and sex-offender registry options plus candidate-focused workflows.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/employer-criminal-background-checks",
    image: SOCIAL_IMAGE,
  },
  eyebrow: "Employer criminal searches",
  h1: "Criminal Background Checks for Employers",
  subhead:
    "Order federal, state, and county criminal searches through an employer-focused workflow with transparent per-check pricing.",
  supporting:
    "Use a layered employer-screening approach: a national database can help locate possible records, while source-level county, state, and federal searches confirm records within the selected scope.",
  cta: "Get Employer Pricing",
  caveat:
    "For employers only — not tenant, personal, firearm, immigration, or public-record searches. Timing varies by service, jurisdiction, court access, source availability, and third-party response.",
  heroVisual: {
    src: "/static/lp/criminal-screening-review.svg",
    alt: "Employer reviewing criminal background screening results",
    width: 960,
    height: 640,
  },
  form: {
    companyLabel: "Company",
    volumeLabel: "Monthly reports",
    volumeOptions: EMPLOYER_LANDING_VOLUME_OPTIONS,
    subject:
      "Landing page lead — /lp/employer-criminal-background-checks",
    details: [
      {
        id: "criminal-jurisdictions-roles",
        label: "Jurisdictions or roles",
        messageLabel: "Jurisdictions or roles",
        required: true,
        type: "textarea",
      },
      {
        id: "criminal-current-provider",
        label: "Current screening provider (optional)",
        messageLabel: "Current screening provider",
        required: false,
        type: "text",
      },
    ],
  },
  sections: [
    {
      id: "search-coverage",
      kind: "cards",
      heading: "Understand what each search is designed to cover.",
      columns: 3,
      items: [
        {
          title: "National database locator",
          body: "A broad multi-jurisdiction search that can identify possible records for source-level follow-up. It is not a substitute for source confirmation.",
        },
        {
          title: "County courthouse",
          body: "A source-level county search for the selected jurisdiction and reporting scope.",
        },
        {
          title: "State search",
          body: "A search of an available state repository. Coverage and access vary by state.",
        },
        {
          title: "Federal search",
          body: "A search of selected federal district court records, which are separate from county and state records.",
        },
        {
          title: "Sex-offender registry",
          body: "A separate registry component when it is included in the selected package.",
        },
      ],
      links: [
        {
          label: "Review criminal-record services",
          href: "/services/criminal-records",
        },
      ],
    },
    {
      id: "database-only",
      kind: "bullets",
      heading: "Use database results as a lead, not the whole decision.",
      body:
        "A multi-jurisdiction database can surface possible records, but coverage and update timing vary. County or other source-level confirmation helps match the record, review the source, and apply the employer’s reporting and adjudication rules.",
      bullets: [
        "Confirm the person and jurisdiction.",
        "Review the source record and disposition.",
        "Apply the employer’s reporting and adjudication process.",
        "Provide a candidate dispute path when required.",
      ],
    },
    {
      id: "package-pricing",
      kind: "cards",
      heading: "Select components by role and jurisdiction.",
      columns: 3,
      items: [
        {
          title: "Core criminal scope",
          body: "Combine a national locator with selected registry and county components.",
        },
        {
          title: "Expanded jurisdiction scope",
          body: "Add county or state searches based on role, address history, and work location.",
        },
        {
          title: "Federal option",
          body: "Add selected federal district searches when relevant to the role.",
        },
      ],
      body:
        "Request a written, itemized quote for the selected search scope, volume, jurisdictions, and applicable court-access or third-party costs.",
      cta: {
        label: "Get Employer Pricing",
        href: "#lead-form",
      },
    },
    {
      id: "ordering-workflow",
      kind: "steps",
      heading: "From employer request to review-ready report.",
      steps: [
        "Confirm permissible purpose, role, and jurisdiction.",
        "Follow the applicable disclosure and candidate-authorization process.",
        "Run the selected database and source-level searches.",
        "Review source records and possible identity matches.",
        "Apply the employer’s review, dispute, and adverse-action procedures.",
      ],
    },
    {
      id: "sample",
      kind: "sample",
      heading: "Request a Redacted Sample",
      body:
        "Use the form to tell us which criminal-search scope you are evaluating and request a redacted sample.",
      cta: {
        label: "Request a Redacted Sample",
        href: "#lead-form",
      },
    },
    {
      id: "fcra-workflow",
      kind: "steps",
      heading: "Build candidate authorization and adverse action into the process.",
      body:
        "Before screening begins, the employer confirms permissible purpose and follows the applicable disclosure and authorization process. If report information may affect the decision, the employer’s process should provide the report and rights information, allow a reasonable review or dispute opportunity, and send final notice only if the employer proceeds.",
      disclaimer:
        "Workflow support is not legal advice or a guarantee of compliance.",
      links: [
        { label: "Review candidate rights", href: "/candidates" },
        { label: "Review compliance resources", href: "/compliance" },
      ],
    },
    {
      id: "turnaround",
      kind: "bullets",
      heading: "Electronic availability does not make every report same-day.",
      body:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. A database result may arrive before the corresponding courthouse or other source record is confirmed. No completion time applies to every report.",
    },
  ],
  faq: [
    {
      question:
        "What is the difference between a national database and a county search?",
      answer:
        "A national database provides broad locator coverage. A county search reviews the selected courthouse source. A possible database record may require county or other source-level confirmation.",
    },
    {
      question:
        "Is a federal search the same as a state or county search?",
      answer:
        "No. Federal district court records are separate from state and county criminal records.",
    },
    {
      question: "Is the sex-offender registry included automatically?",
      answer:
        "It is included only when it is part of the selected package or order scope.",
    },
    {
      question: "Does the candidate need to authorize the report?",
      answer:
        "The employer should follow the applicable disclosure and authorization process before ordering an employment report.",
    },
    {
      question: "Can this form be used for tenant or personal searches?",
      answer:
        "No. This page is for employer screening only. It is not for tenant, personal, firearm, immigration, or general public-record searches.",
    },
  ],
  finalCta: {
    heading: "Choose the criminal-search scope for the roles you hire.",
    body:
      "Share report volume, roles, and jurisdictions so the team can scope search components, workflow, and current pricing.",
    cta: "Get Employer Pricing",
  },
};

const preEmployment: EmployerScreeningLandingPageConfig = {
  key: "preEmployment",
  route: "/lp/pre-employment-screening",
  seo: {
    title: "Pre-Employment Screening & Employment Verification",
    description:
      "Pre-employment screening and employment verification for employers, with mobile candidate intake, role-based services, and verified integration options.",
    canonical:
      "https://www.rapidhiresolutions.com/lp/pre-employment-screening",
    image: SOCIAL_IMAGE,
  },
  eyebrow: "Screening and verification",
  h1: "Pre-Employment Screening & Employment Verification",
  subhead:
    "Screen new hires and verify work history with flexible employer packages and transparent per-check pricing.",
  supporting:
    "Use one employer workflow to choose a broader background-screening package, standalone work-history verification, or both.",
  cta: "Build Your Screening Package",
  caveat:
    "This form is not for income, mortgage, proof-of-employment, I-9, or E-Verify requests. Timing varies by service, jurisdiction, court access, source availability, and third-party response. Manual employment verification may take several business days.",
  heroVisual: {
    src: "/static/lp/pre-employment-workflow.svg",
    alt: "Hiring team preparing a verified pre-employment screening workflow",
    width: 960,
    height: 640,
  },
  form: {
    companyLabel: "Company",
    volumeLabel: "Monthly hires",
    volumeOptions: EMPLOYER_LANDING_VOLUME_OPTIONS,
    subject: "Landing page lead — /lp/pre-employment-screening",
    details: [
      {
        id: "pre-employment-ats-provider",
        label: "Current ATS or screening provider (optional)",
        messageLabel: "Current ATS or screening provider",
        required: false,
        type: "text",
      },
    ],
    services: {
      label: "Screening or verification need",
      required: true,
      type: "select",
      options: [
        "Background screening",
        "Employment verification",
        "Both",
      ],
    },
  },
  sections: [
    {
      id: "screening-verification-selector",
      kind: "cards",
      heading: "Choose the service that matches the hiring question.",
      columns: 3,
      items: [
        {
          title: "Background screening",
          body: "Build a broader package that may include identity, criminal, or other role-relevant services.",
        },
        {
          title: "Employment verification",
          body: "Confirm selected work-history fields directly with the available source.",
        },
        {
          title: "Both",
          body: "Combine role-relevant screening with one or more employment verifications.",
        },
      ],
    },
    {
      id: "verified-fields",
      kind: "bullets",
      heading: "Confirm source-supported employment fields.",
      body:
        "The current service definition supports verification of former employer, job title, employment dates, and employment status. Source policies may limit what an employer will disclose.",
      bullets: [
        "Former employer",
        "Job title",
        "Employment dates",
        "Employment status",
      ],
      links: [
        {
          label: "Review employment-verification services",
          href: "/services/employment-verification",
        },
      ],
    },
    {
      id: "package-builder",
      kind: "cards",
      heading: "Add only the checks the role requires.",
      columns: 3,
      items: [
        {
          title: "Core background package",
          body: "Select identity and criminal components appropriate to the role and jurisdiction.",
        },
        {
          title: "Verification package",
          body: "Add one or more employment verifications for the work history being reviewed.",
        },
        {
          title: "Role add-ons",
          body: "Add education, professional license, motor-vehicle records, drug testing, or monitoring where appropriate.",
        },
      ],
      body:
        "These are scoping options, not fixed offers. Final services depend on the role, location, employer policy, and applicable requirements.",
    },
    {
      id: "candidate-workflow",
      kind: "steps",
      heading: "Keep the candidate informed from invitation through review.",
      steps: [
        "The employer initiates the request and confirms permissible purpose.",
        "The candidate completes mobile information and authorization.",
        "The selected screens and verifications are ordered.",
        "The employer reviews the completed information.",
        "Candidate dispute and adverse-action procedures remain available when applicable.",
      ],
    },
    {
      id: "turnaround",
      kind: "bullets",
      heading: "Manual employment verification follows the source’s timetable.",
      body:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Former-employer response can take several business days. Closed businesses, international employers, and third-party verifier requirements can extend the timeline. Do not apply a standard-check turnaround statement to employment verification.",
    },
    {
      id: "pricing",
      kind: "bullets",
      heading: "Price the selected screening and verification work.",
      body:
        "Request a written, itemized quote covering the selected checks, verification work, quantity, sources, jurisdictions, and applicable third-party costs.",
      cta: {
        label: "Build Your Screening Package",
        href: "#lead-form",
      },
    },
    {
      id: "integrations",
      kind: "bullets",
      heading: "Connect only through a verified current option.",
      body:
        "The current registry lists iCIMS, Greenhouse, JazzHR, Jobvite, Lever, Workable, and Workday as Live. Exact ordering, status, and setup capabilities depend on the selected system and account.",
      links: [
        {
          label: "Review the integration directory",
          href: "/integrations",
        },
      ],
    },
    {
      id: "sample",
      kind: "sample",
      heading: "Request a Redacted Sample",
      body:
        "Use the form to tell us which screening and verification services you are evaluating and request a redacted sample.",
      cta: {
        label: "Request a Redacted Sample",
        href: "#lead-form",
      },
    },
  ],
  faq: [
    {
      question:
        "What is the difference between background screening and employment verification?",
      answer:
        "Background screening can combine multiple role-relevant checks. Employment verification focuses on confirming selected work-history fields with the available source.",
    },
    {
      question: "Which employment fields can be verified?",
      answer:
        "The documented fields are former employer, job title, employment dates, and employment status. Source policies may limit the response.",
    },
    {
      question: "How long does employment verification take?",
      answer:
        "Timing varies by service, jurisdiction, court access, source availability, and third-party response. Former-employer response may take several business days.",
    },
    {
      question: "Does the candidate complete authorization?",
      answer:
        "The employer should follow the applicable disclosure and authorization process before ordering employment screening.",
    },
    {
      question:
        "Can this form handle income, mortgage, I-9, or E-Verify requests?",
      answer:
        "No. This form is not for income verification, mortgage or proof-of-employment requests, I-9, or E-Verify services.",
    },
  ],
  finalCta: {
    heading:
      "Build the screening and verification mix for your next hires.",
    body:
      "Share hiring volume, screening need, and current system so the team can scope services, timing, and itemized pricing.",
    cta: "Build Your Screening Package",
  },
};

export const EMPLOYER_SCREENING_LANDING_PAGES: Readonly<
  Record<EmployerLandingPageKey, EmployerScreeningLandingPageConfig>
> = {
  staffing,
  healthcare,
  criminal,
  preEmployment,
};
