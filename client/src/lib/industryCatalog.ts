/*
  §83 — industryCatalog.ts
  -------------------------
  Single-source dataset for /industries (the hub) AND every
  /industries/:slug detail page. The 6 existing verticals on the hub
  page are extracted verbatim so nothing visible regresses on /industries;
  3 new verticals (gig/1099, manufacturing, education) are appended
  to close the competitor gap (each top-5 BGC publishes 8–10 vertical
  micro-sites, we previously had 6 anchors on a single page).

  Detail pages consume `intro`, `defaults`, `regulatory`, `stats`,
  plus three new long-form fields: `posture`, `whenToUse`, and
  `relatedChecks` (list of /services/:slug links).
*/
export type IndustrySlug =
  | "healthcare"
  | "transportation"
  | "staffing"
  | "finance"
  | "retail"
  | "nonprofit"
  | "gig-1099"
  | "manufacturing"
  | "education";

export type Industry = {
  slug: IndustrySlug;
  n: string;
  name: string;
  iconKey:
    | "HeartPulse"
    | "Truck"
    | "Users"
    | "Landmark"
    | "ShoppingBag"
    | "Building2"
    | "Zap"
    | "Factory"
    | "GraduationCap";
  accent: string;
  blurb: string;
  intro: string;
  defaults: ReadonlyArray<string>;
  regulatory: { label: string; body: string };
  stats: ReadonlyArray<{ value: string; label: string; sub: string }>;
  /** Long-form copy — only used on the detail page. */
  posture: string;
  whenToUse: string;
  relatedChecks: ReadonlyArray<{ slug: string; label: string }>;
  dark: boolean;
};

export const INDUSTRIES: ReadonlyArray<Industry> = [
  {
    slug: "healthcare",
    n: "02",
    name: "Healthcare",
    iconKey: "HeartPulse",
    accent: "license-grade",
    blurb:
      "Sanctions monitoring, license verification, and 7-panel drug testing for hospitals, clinics, and home-health agencies.",
    intro:
      "Hospitals, clinics, home-health, and behavioral-health providers face the longest list of regulators in any sector we serve. Hiring a nurse, a tech, or a contractor without continuous sanctions and license monitoring is not just slow — it puts CMS reimbursement at risk and exposes the facility to negligent-hiring claims.",
    defaults: [
      "Criminal records (county, statewide, federal as triggered)",
      "OIG / SAM / state Medicaid sanctions monitoring (continuous)",
      "Primary-source license verification (NPDB-aware)",
      "Drug screen (5- or 10-panel) with MRO review",
      "Education + employment verification",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "HIPAA-aligned data envelope on every record, BAA available on request. Sanctions checks run against OIG-LEIE and SAM exclusions on intake plus a recurring monthly sweep. License verifications go to the state board, not a third-party aggregator.",
    },
    stats: [
      { value: "<24 hrs", label: "Median TAT", sub: "primary-source license verification" },
      { value: "Monthly", label: "Sanctions sweep", sub: "OIG-LEIE + SAM, automatic" },
      { value: "BAA", label: "On request", sub: "HIPAA Business Associate Agreement" },
    ],
    posture:
      "Healthcare is our highest-stakes vertical. Every record is wrapped in a HIPAA-aligned data envelope; the sanctions sweep is automated against OIG-LEIE, SAM, and state Medicaid lists; license verification calls the issuing state board directly rather than scraping an aggregator. CMS conditions of participation, the False Claims Act, and state nurse-practice acts all sit downstream of these decisions — we are not interested in shortcuts that put a hospital's reimbursement at risk.",
    whenToUse:
      "Use this package when you are hiring or contracting any role that bills into Medicare, Medicaid, or a commercial payer — clinical and non-clinical alike. The OIG/SAM sweep is the single most-cited finding in CMS audits, and a missed exclusion can claw back six figures of payments.",
    relatedChecks: [
      { slug: "/services/healthcare-sanctions", label: "Healthcare sanctions" },
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/drug-screening", label: "Drug screening" },
      { slug: "/services/continuous-monitoring", label: "Continuous monitoring" },
    ],
    dark: false,
  },
  {
    slug: "transportation",
    n: "03",
    name: "Transportation & Logistics",
    iconKey: "Truck",
    accent: "DOT-aligned",
    blurb:
      "DOT-aligned MVRs, CDLIS pulls, drug-and-alcohol consortium, and continuous license monitoring for fleets of any size.",
    intro:
      "Fleets live and die by the MVR. We run DOT-aligned driver qualification files (DQF) end to end — pre-employment screen, drug-and-alcohol consortium enrollment, CDLIS where applicable, and continuous license monitoring so a CDL revocation does not become a Monday-morning surprise.",
    defaults: [
      "Motor Vehicle Records (single-state or 50-state)",
      "CDLIS pull where the driver holds a CDL",
      "DOT 49 CFR Part 40 drug & alcohol consortium",
      "Criminal records (county + federal)",
      "Continuous license monitoring (real-time alerts)",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "DQF assembled to 49 CFR §391.51, drug & alcohol program administered to 49 CFR Part 40, FMCSA Clearinghouse queries available on request. We never short-circuit the consortium step to win a turnaround claim.",
    },
    stats: [
      { value: "1 hr", label: "Median MVR", sub: "single-state, business hours" },
      { value: "24/7", label: "License alerts", sub: "real-time CDL status changes" },
      { value: "Part 40", label: "Drug program", sub: "DOT-compliant by default" },
    ],
    posture:
      "DQF assembled to 49 CFR §391.51 with the artefacts ordered as the rule lists them; drug & alcohol program administered to 49 CFR Part 40 with a TPA available on request. We will run an FMCSA Clearinghouse pre-employment query for any candidate operating in interstate commerce.",
    whenToUse:
      "Use this package for any safety-sensitive driver under DOT jurisdiction — long-haul, regional, last-mile, and the increasingly common gig-fleet drivers who fall under DOT when they cross a state line. The continuous license-monitoring layer is what keeps a Monday revocation from becoming a Tuesday liability.",
    relatedChecks: [
      { slug: "/services/motor-vehicle-records", label: "Motor vehicle records" },
      { slug: "/services/drug-screening", label: "Drug screening" },
      { slug: "/services/continuous-monitoring", label: "Continuous monitoring" },
      { slug: "/services/criminal-records", label: "Criminal records" },
    ],
    dark: true,
  },
  {
    slug: "staffing",
    n: "04",
    name: "Staffing Agencies",
    iconKey: "Users",
    accent: "high-volume",
    blurb:
      "High-volume packages, candidate self-checkout, and ATS integrations built for agencies that place hundreds per week.",
    intro:
      "When you place hundreds of workers a week, screening is the throughput bottleneck — or it isn't, depending on whether your CRA can match your inbound velocity. Our staffing posture is built around candidate self-checkout, ATS handshakes, and a U.S.-based desk that can absorb a Monday-morning surge without the queue leaving Central Time.",
    defaults: [
      "Tiered packages (light-industrial → professional)",
      "Candidate self-checkout (mobile-first invite link)",
      "ATS integration (Bullhorn, Avionté, JobDiva, more)",
      "Criminal records + employment verification",
      "Drug screen (eCup or lab) when the placement requires it",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Adverse-action letters issued automatically with the federal Summary of Rights, configurable per-state overlays for the 35+ jurisdictions that go beyond the FCRA. Two-step adverse-action by default — pre-adverse, waiting window, final notice.",
    },
    stats: [
      { value: "85%+", label: "Cleared in 24h", sub: "across the desk, last 30 days" },
      { value: "12+", label: "ATS handshakes", sub: "live integrations + custom" },
      { value: "0.4%", label: "Dispute rate", sub: "trailing 12 months" },
    ],
    posture:
      "Staffing posture is built for velocity, not bespoke packages. Candidate self-checkout drops the cost of a hand-off to roughly the cost of a text message; ATS handshakes write status back to Bullhorn / Avionté / JobDiva so your recruiter doesn't have to switch tabs to know whether the candidate cleared.",
    whenToUse:
      "Use this package if you are placing more than ~50 workers a month and/or your recruiter team is splitting time between the ATS and a separate CRA portal. The cost-per-hire compression comes from removing the manual hand-off, not from any single check being cheaper.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/employment-verification", label: "Employment verification" },
      { slug: "/services/drug-screening", label: "Drug screening" },
      { slug: "/services/identity-verification", label: "Identity verification" },
    ],
    dark: false,
  },
  {
    slug: "finance",
    n: "05",
    name: "Finance & Professional Services",
    iconKey: "Landmark",
    accent: "fiduciary-grade",
    blurb:
      "Credit, education, and global sanctions screening for FINRA-regulated and fiduciary roles.",
    intro:
      "FINRA-regulated firms, CPAs, RIAs, and law firms hire into roles where a missed credit issue or an undisclosed civil judgment can become a regulatory exam finding. The screening package is heavier than retail by design — and the chain of custody on every artefact has to hold up to outside counsel review.",
    defaults: [
      "Criminal records (county, statewide, federal)",
      "FCRA-permissible credit report (consent-aware)",
      "Education verification (primary-source, international as needed)",
      "Global sanctions (OFAC, UN, EU, HM Treasury)",
      "Employment verification with detailed reason-for-separation",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Credit reports run only with documented permissible purpose under 15 U.S.C. §1681b. Global sanctions screening covers OFAC SDN, EU Consolidated, UN, and HM Treasury lists with monthly re-screen available for fiduciary roles.",
    },
    stats: [
      { value: "<48 hrs", label: "Median TAT", sub: "with credit + global sanctions" },
      { value: "200+", label: "Country coverage", sub: "international verifications" },
      { value: "Monthly", label: "Re-screen", sub: "optional fiduciary monitoring" },
    ],
    posture:
      "Permissible-purpose paper-trail on every credit pull, dual-source verification on every employment record, and a chain-of-custody log designed to be exhibit-ready. FINRA U4 lookbacks and FDIC §19 disqualification screening are layered on by default for the firms that need them.",
    whenToUse:
      "Use this package for any FINRA-registered representative, FDIC-regulated bank role, RIA, CPA, or fiduciary role with discretionary authority over client funds. The credit pull requires permissible purpose under 15 U.S.C. §1681b — we will not run it without one on file.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/employment-verification", label: "Employment verification" },
      { slug: "/services/education-verification", label: "Education verification" },
      { slug: "/services/identity-verification", label: "Identity verification" },
    ],
    dark: true,
  },
  {
    slug: "retail",
    n: "06",
    name: "Retail & Hospitality",
    iconKey: "ShoppingBag",
    accent: "same-day",
    blurb:
      "Fast, low-cost packages built for high-turnover environments — most reports back the same day.",
    intro:
      "High-turnover environments win or lose on time-to-badge. The retail and hospitality posture is deliberately the opposite of the finance package — slim, fast, mobile-first, with a unit price that respects the margin you actually run, and a candidate flow that does not lose people on day one to a clunky portal.",
    defaults: [
      "National criminal database + matched county",
      "Sex-offender registry (50-state)",
      "Optional employment verification",
      "Mobile candidate self-checkout (text-message invite)",
      "Bulk invite via CSV or ATS handshake",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "FCRA-compliant by default, with state-and-local overlays applied automatically based on the candidate address. Adverse-action letters mailed and emailed; ban-the-box and salary-history rules tracked per jurisdiction.",
    },
    stats: [
      { value: "Same-day", label: "Most reports", sub: "candidate self-checkout, business hours" },
      { value: "35+", label: "State overlays", sub: "ban-the-box, salary history, etc." },
      { value: "Mobile-first", label: "Invite flow", sub: "no portal login required" },
    ],
    posture:
      "The retail posture is throughput-first. Mobile-first invite flow drops the candidate-portal abandonment rate; state-and-local overlays apply automatically based on candidate address; loss-prevention add-ons (sex-offender registry deep search, social-media scan for client-facing roles) sit one toggle away.",
    whenToUse:
      "Use this package for high-turnover, hourly, customer-facing roles in retail, QSR, hospitality, and grocery. The economics work because you are buying speed and FCRA-compliant adverse-action automation, not a bespoke package.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/social-media-screening", label: "Social media screening" },
      { slug: "/services/identity-verification", label: "Identity verification" },
      { slug: "/services/drug-screening", label: "Drug screening" },
    ],
    dark: false,
  },
  {
    slug: "nonprofit",
    n: "07",
    name: "Nonprofit & Faith-based",
    iconKey: "Building2",
    accent: "child-safety-first",
    blurb:
      "Volunteer-friendly pricing, sex-offender screening, and child-safety packages used by churches, schools, and youth orgs.",
    intro:
      "Churches, schools, youth programs, and volunteer organisations hire into trust-heavy roles on volunteer-grade budgets. The package we run here is designed for that reality — the same child-safety rigor a daycare would buy, with a unit price that does not punish a 200-volunteer ministry for doing the right thing.",
    defaults: [
      "Criminal records (county + national database)",
      "Sex-offender registry (50-state, deep search)",
      "Optional motor-vehicle record for driving volunteers",
      "Education or credential verification (clergy, teachers)",
      "Volunteer / employee tier with separate pricing",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "FCRA-aligned even when the candidate is a volunteer, because most state child-safety statutes incorporate FCRA disclosure language by reference. Adverse-action letters sent on every disqualifying record, no exceptions.",
    },
    stats: [
      { value: "<24 hrs", label: "Median TAT", sub: "volunteer package, business hours" },
      { value: "50-state", label: "Sex-offender", sub: "deep search included" },
      { value: "Volunteer", label: "Pricing tier", sub: "separate from employee tier" },
    ],
    posture:
      "FCRA-aligned even when the candidate is technically a volunteer, because most state child-safety statutes incorporate FCRA disclosure language by reference. The volunteer pricing tier is genuinely separate (not a discount on the employee tier), priced at unit cost recovery for ministries and youth orgs.",
    whenToUse:
      "Use this package for any role with unsupervised access to minors, vulnerable adults, or organizational funds, paid or volunteer. The deep-search sex-offender registry hits that surface name variants and historical addresses — the cheap aggregators don't.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/motor-vehicle-records", label: "Motor vehicle records" },
      { slug: "/services/education-verification", label: "Education verification" },
      { slug: "/services/identity-verification", label: "Identity verification" },
    ],
    dark: true,
  },
  // §83: NEW vertical — gig/1099 platforms.
  {
    slug: "gig-1099",
    n: "08",
    name: "Gig & 1099 Platforms",
    iconKey: "Zap",
    accent: "marketplace-grade",
    blurb:
      "Identity-first onboarding, continuous monitoring, and FCRA-aligned independent-contractor screening for marketplaces.",
    intro:
      "Two-sided marketplaces and gig platforms have the hardest screening problem in the industry: high volume, mobile-first onboarding, an independent-contractor relationship that complicates the consent path, and a brand that lives or dies on what happens after the rider gets in the car. Our gig posture is built around identity-first onboarding and continuous monitoring rather than one-shot intake.",
    defaults: [
      "Identity verification (document + selfie, biometric match)",
      "National criminal database + jurisdictional county confirmation",
      "Sex-offender registry (50-state, real-time)",
      "MVR for driving roles, with continuous license monitoring",
      "Continuous criminal monitoring (post-onboard)",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "FCRA disclosure-and-authorization runs even though the worker is a 1099 contractor, because the FCRA applies whenever a consumer report is procured for employment purposes — a definition that has been read broadly by the FTC. State independent-contractor classification rules (CA AB-5, NY's revised classification framework) are tracked separately on /resources/legislative-updates.",
    },
    stats: [
      { value: "<10 min", label: "Median onboard", sub: "identity + criminal database" },
      { value: "24/7", label: "Continuous", sub: "post-onboard criminal + MVR alerts" },
      { value: "Mobile-first", label: "Consent flow", sub: "fully ESIGN-compliant" },
    ],
    posture:
      "Marketplaces win on activation funnel. We optimize for the candidate clearing intake on a phone in under 10 minutes — the document + selfie biometric match, the national criminal database hit, the MVR pre-pull — then we shift the rest of the workload to continuous monitoring so the platform never has to re-onboard an active worker.",
    whenToUse:
      "Use this package if you operate a marketplace where workers are 1099, the onboarding funnel is mobile-only, and a single missed risk event in the field can become a national news cycle. The continuous monitoring layer is the differentiator — one-shot screening at intake leaves the platform exposed for the entire tenure.",
    relatedChecks: [
      { slug: "/services/identity-verification", label: "Identity verification" },
      { slug: "/services/continuous-monitoring", label: "Continuous monitoring" },
      { slug: "/services/motor-vehicle-records", label: "Motor vehicle records" },
      { slug: "/services/criminal-records", label: "Criminal records" },
    ],
    dark: false,
  },
  // §83: NEW vertical — manufacturing & industrial.
  {
    slug: "manufacturing",
    n: "09",
    name: "Manufacturing & Industrial",
    iconKey: "Factory",
    accent: "OSHA-aware",
    blurb:
      "Safety-sensitive screening, drug & alcohol programs, and credential verification for plants, warehouses, and industrial operators.",
    intro:
      "Plant floors, warehouses, and industrial operators hire into safety-sensitive roles where a missed past incident or an undisclosed substance issue does not just become a personnel problem — it becomes an OSHA recordable. The manufacturing posture is built around documented safety-sensitive designation, structured drug-and-alcohol programs, and credential verification for the certifications the role legitimately requires.",
    defaults: [
      "Criminal records (county + federal, weighted by safety-sensitivity)",
      "Drug screen (5- or 10-panel) with MRO review",
      "DOT-aligned testing for any role under 49 CFR Part 40",
      "Credential verification (forklift, OSHA 10/30, welding, electrical)",
      "Employment verification with reason-for-separation",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Safety-sensitive role designations documented in the requisition so the drug-screen + criminal weighting can be defended in EEOC review. State cannabis off-duty protections honored except where a federal contract or a safety-sensitive carve-out applies — the carve-out is documented per state on /resources/marijuana-laws.",
    },
    stats: [
      { value: "<48 hrs", label: "Median TAT", sub: "with safety-sensitive package" },
      { value: "OSHA-aware", label: "Credential checks", sub: "10/30, forklift, welding, more" },
      { value: "Carve-outs", label: "Documented", sub: "cannabis safety-sensitive scoping" },
    ],
    posture:
      "OSHA-aware credential verification (forklift, OSHA 10/30, welding tickets, electrical journeyman) calls the issuing authority directly when one exists; for vendor-issued certs we capture the cert number and issue date so the requisition file is audit-ready. Safety-sensitive role designation is captured in the requisition so the drug-screen weighting can be defended.",
    whenToUse:
      "Use this package for any role with regular operation of forklifts, presses, conveyors, or vehicles, or any role with regular access to a regulated chemical or controlled-substance environment. Safety-sensitive designation is what unlocks the drug-test scoping; it has to be documented before the requisition opens.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/drug-screening", label: "Drug screening" },
      { slug: "/services/motor-vehicle-records", label: "Motor vehicle records" },
      { slug: "/services/employment-verification", label: "Employment verification" },
    ],
    dark: true,
  },
  // §83: NEW vertical — education (K-12 + higher-ed).
  {
    slug: "education",
    n: "10",
    name: "Education (K-12 + Higher Ed)",
    iconKey: "GraduationCap",
    accent: "child-safety-first",
    blurb:
      "Fingerprint-aware screening, sex-offender registry deep search, and credential verification for districts, colleges, and after-school programs.",
    intro:
      "Schools, districts, and higher-ed institutions hire into roles with the highest trust-load in the labor market — unsupervised access to minors and vulnerable young adults — under one of the most fragmented compliance environments. State teacher-certification rules, fingerprint requirements (Live Scan, FBI Channeler), and post-Adam Walsh sex-offender registry obligations vary by jurisdiction. The education posture handles all three at once.",
    defaults: [
      "Criminal records (county + statewide + federal)",
      "Sex-offender registry (50-state, deep search with name variants)",
      "Fingerprint-based criminal history (Live Scan / FBI Channeler where required)",
      "Education verification (primary-source) + license verification",
      "Continuous criminal monitoring for current employees",
    ],
    regulatory: {
      label: "Regulatory posture",
      body:
        "Fingerprint-based checks coordinated through certified Live Scan operators or the FBI's Channeler program in jurisdictions that mandate them. Title IX awareness on candidate consent language. Annual re-screen available for districts that operate under state-mandated continuous-screening rules.",
    },
    stats: [
      { value: "Live Scan", label: "Where required", sub: "fingerprint coordination" },
      { value: "Annual", label: "Re-screen", sub: "current-employee monitoring" },
      { value: "Title IX", label: "Aware", sub: "candidate-side disclosure language" },
    ],
    posture:
      "Fingerprint requirements are not optional in the states that mandate them — we coordinate the Live Scan or FBI Channeler appointment as part of the candidate workflow, not as an afterthought. Annual re-screening for current employees is the layer most districts realize they need only after a state-board audit; we make it cheap to add up front.",
    whenToUse:
      "Use this package for any role with regular contact with K-12 students, any higher-ed role with student-life supervision, and after-school / club / sports staff including unpaid coaches. The fingerprint requirement is mandatory in roughly half of US states for K-12 — the table at /resources/background-checks-by-state has the breakdown.",
    relatedChecks: [
      { slug: "/services/criminal-records", label: "Criminal records" },
      { slug: "/services/education-verification", label: "Education verification" },
      { slug: "/services/identity-verification", label: "Identity verification" },
      { slug: "/services/continuous-monitoring", label: "Continuous monitoring" },
    ],
    dark: false,
  },
];

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
