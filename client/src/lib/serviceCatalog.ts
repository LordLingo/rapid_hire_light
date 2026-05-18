/*
  §83 — Service catalog
  ---------------------
  Per-check service detail dataset feeding both the /services hub and the
  dynamic /services/:slug detail pages.

  Why a single source of truth:
   - The pricing calculator add-ons (lib/pricing.ts) and the homepage
     <Services /> section both reference these checks. Centralizing the
     copy here keeps SLA, included-items, FCRA notes, and add-on price
     anchors consistent across all four surfaces.
   - The dynamic ResourcesStatePage pattern (§81) was the model: same
     "find by slug" helper plus an iterable list for index pages.

  Editorial conventions (mirror the white-paper voice from §82):
   - SLA strings are short and scan-able ("Avg. 18h", "85% < 24h").
   - "what's included" bullets are crisp; never marketing fluff.
   - "what this catches / what this does NOT catch" is explicit so
     buyers can self-qualify before talking to sales — the same honest
     posture as the existing /services page.
   - Cross-links return string slugs; the consumer composes the full
     URL (so internal-link audits stay simple).

  Pricing band notes:
   - "priceBand" is qualitative, not quote-binding. Real pricing lives in
     /pricing and the calculator. We name the add-on id from
     ADDONS in lib/pricing.ts so the detail page can deep-link to the
     calculator with that add-on pre-selected.
*/

import {
  Gavel,
  BriefcaseBusiness,
  GraduationCap,
  FlaskConical,
  Car,
  Globe,
  ShieldCheck,
  HeartPulse,
  Activity,
  type LucideIcon,
} from "lucide-react";

export type ServiceTopic =
  | "criminal"
  | "verifications"
  | "drug"
  | "driving"
  | "social"
  | "identity"
  | "healthcare"
  | "monitoring";

export type ServiceDetail = {
  /** kebab-case URL slug under /services/<slug>. */
  slug: string;
  /** Internal id; matches lib/pricing.ts ADDONS where applicable so the
   *  detail page can deep-link the calculator (`/pricing?adds=<addonId>`). */
  pricingAddonId?: string;
  /** Display name used in headings, footer, blog cross-links. */
  title: string;
  /** Short label used on cards / nav. */
  shortTitle: string;
  /** One-line tag for hub cards (eyebrow style). */
  tag: string;
  /** Icon from lucide for the hub card and detail hero. */
  icon: LucideIcon;
  topic: ServiceTopic;
  /** ~22-30 word lede for the hub card and the meta description. */
  summary: string;
  /** ~60-90 word hero lede for the detail page (rich). */
  hero: string;
  /** SLA chip — "85% < 24h" / "Avg. 18h" / "Instant in 47 states". */
  sla: string;
  /** Per-check price band ("$$" / "$$$") — qualitative for buyers. */
  priceBand: "$" | "$$" | "$$$";
  /** Detail-page bullet list of what's included in the check. */
  includes: string[];
  /** Honest "what this catches" list. */
  catches: string[];
  /** Honest "what this does NOT catch" list — the trust posture. */
  doesNotCatch: string[];
  /** FCRA / EEOC / industry-specific compliance bullets. */
  compliance: string[];
  /** Industries where this check is mandatory or near-universal. */
  industries: string[];
  /** Slugs of related blog posts in /content/blog/. */
  relatedBlogSlugs: string[];
  /** Slugs of sibling services to recommend. */
  relatedServiceSlugs: string[];
  /** A 14-21 word FAQ Q&A pair pinned to the bottom of the detail page. */
  faqs: { q: string; a: string }[];
  /**
   * §114 — optional standalone editorial illustration rendered in the
   * left rail of the /services hub article (under the icon + tag
   * pill). Opt-in per service; entries without `heroImage` render the
   * existing icon-only left rail unchanged.
   *
   * `url` MUST be the manus webdev static-asset CloudFront URL
   * returned by `manus-upload-file --webdev` / `generate_image`.
   * `alt` is required and must be descriptive (no "image of …" filler).
   */
  heroImage?: { url: string; alt: string };
};

export const SERVICE_CATALOG: ServiceDetail[] = [
  {
    slug: "criminal-records",
    pricingAddonId: "county",
    title: "Criminal Records Check",
    shortTitle: "Criminal Records",
    tag: "01 — Criminal",
    icon: Gavel,
    topic: "criminal",
    summary:
      "Comprehensive criminal background checks with federal, state, and county criminal history searches across all U.S. jurisdictions. Our criminal record search services deliver fast, accurate results with built-in adverse action workflows to support compliance and help employers make confident hiring decisions.",
    hero:
      "A real criminal background check is a layered search — nationwide database for breadth, county courthouse for depth, federal docket for white-collar matters, and the sex-offender registry as a separate national pull. We run all four by default on every Standard package and surface the supporting court records in the report so your adjudicator can see the source, not just the flag.",
    sla: "85% complete < 24h",
    priceBand: "$$",
    includes: [
      "Nationwide criminal database search",
      "County criminal courthouse search (7 years)",
      "Federal criminal — all 94 districts",
      "National sex-offender registry",
      "OFAC and Interpol watch list",
      "Pre-adverse and adverse action workflow",
    ],
    catches: [
      "Felony and misdemeanor convictions on file at the courthouse",
      "Pending criminal cases (where state law allows reporting)",
      "Federal indictments and convictions across all 94 districts",
      "Active warrants surfaced through the nationwide database",
      "Sex-offender registry hits across all 50 states",
    ],
    doesNotCatch: [
      "Sealed or expunged records — by law, these are not reportable",
      "Arrests over 7 years old (FCRA §605 reporting limit; some states stricter)",
      "Juvenile records in most states",
      "Convictions in jurisdictions outside the candidate's address history",
      "Non-conviction records in states with ban-the-box / Fair Chance limits",
    ],
    compliance: [
      "FCRA §604 permissible-purpose disclosure required before initiation",
      "Pre-adverse action 5-day waiting period before final decision",
      "EEOC individualized assessment when conviction is the basis for denial",
      "California ICRAA, NYC FCA, and 14 other state/local Fair Chance overlays",
      "Ban-the-box compliance — no criminal questions until conditional offer in 37 states",
    ],
    industries: ["Healthcare", "Financial services", "Retail", "Manufacturing", "Hospitality"],
    relatedBlogSlugs: [
      "fcra-compliance-guide",
      "county-vs-national-criminal-background-check",
      "adverse-action-letter-fcra-template",
      "california-icraa-disclosure-requirements",
    ],
    relatedServiceSlugs: ["identity-verification", "employment-verification", "continuous-monitoring"],
    faqs: [
      {
        q: "Do I need a county search if I run a nationwide database?",
        a: "Yes. Nationwide databases miss roughly 5–8% of court records that only live in county courthouses. The two layered together is the industry standard.",
      },
      {
        q: "How far back can I report criminal records?",
        a: "FCRA limits non-conviction records to 7 years; convictions have no federal time limit but several states (CA, NY, MA) cap at 7 years.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-criminal-records-2uAmRc3MqvTidrc5QCJaxt.webp",
      alt: "Editorial illustration of a manila courthouse case file folder tied with a thin navy ribbon resting on an open county-court ledger, with a small brass gavel across the corner — representing layered county, federal, and nationwide criminal record searches.",
    },
  },
  {
    slug: "employment-verification",
    pricingAddonId: "employment",
    title: "Employment Verification",
    shortTitle: "Employment Verification",
    tag: "02 — Employment",
    icon: BriefcaseBusiness,
    topic: "verifications",
    summary:
      "Comprehensive employment verification services that confirm previous employers, job titles, dates of employment, and employment history directly from the source. Our employment verification background checks help identify gaps in work history, reduce hiring risk, and provide employers with fast, accurate information instead of relying on outdated databases.",
    hero:
      "Employment verification is one of the fastest signal-rich checks in the report — a candidate's claimed work history measured against what the prior employer's HR or payroll system actually says. We verify directly with the source (HR, third-party verifier like The Work Number, or written confirmation), surface gaps for candidate explanation, and flag titles that drift more than one level above what the employer confirms.",
    sla: "Avg. 18h turnaround",
    priceBand: "$$",
    includes: [
      "Up to 7 years or 3 most recent employers",
      "Job title, dates of employment, and employment status",
      "Reason for leaving (where the employer discloses)",
      "Salary verification (where legally permitted)",
      "Gap analysis with candidate prompts to explain >30-day gaps",
      "Up to 5 reference interviews (optional add-on)",
    ],
    catches: [
      "Title inflation beyond what the employer confirms",
      "Date discrepancies of 30+ days",
      "Unreported terminations or non-rehire flags",
      "Employment-history gaps that the candidate did not disclose",
    ],
    doesNotCatch: [
      "Performance details the prior employer is not willing to disclose",
      "Reasons for leaving in jurisdictions where reference policies prohibit it",
      "Salary in the 23 states / cities with salary-history bans",
      "Self-employment or 1099 work without a verifiable counter-party",
    ],
    compliance: [
      "FCRA §613 reporting accuracy obligation",
      "State salary-history bans (CA, MA, NY, IL, CO, WA, +18 more)",
      "California ICRAA written-disclosure requirement for investigative reports",
      "EU GDPR + UK DPA when verifying EMEA-based employment history",
    ],
    industries: ["Financial services", "Technology", "Healthcare", "Staffing"],
    relatedBlogSlugs: [
      "fcra-compliance-guide",
      "education-verification-process",
    ],
    relatedServiceSlugs: ["education-verification", "identity-verification", "criminal-records"],
    faqs: [
      {
        q: "Can you verify an employer that has gone out of business?",
        a: "Yes — through W-2 records, payroll records, or signed prior-employer affidavits. Median TAT is 3–4 business days for closed-business cases.",
      },
      {
        q: "Do you verify international employment?",
        a: "Yes. We have direct verifier networks in 200+ countries; international TAT is typically 3–7 business days depending on country.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-employment-verification-3vF5yaK2E2QH7Ma63tzwfY.webp",
      alt: "Editorial illustration of a folded employment-history résumé sheet beside a vintage rotary desk telephone with a soft green check mark — representing direct verbal verification of prior employment with each former employer's HR.",
    },
  },
  {
    slug: "education-verification",
    pricingAddonId: "education",
    title: "Education Verification",
    shortTitle: "Education Verification",
    tag: "03 — Education",
    icon: GraduationCap,
    topic: "verifications",
    summary:
      "Direct education verification of degrees, diplomas, technical certifications, and professional credentials to help employers confirm applicant qualifications with confidence. Our education verification services validate graduation status, attendance dates, earned degrees, and specialized certifications directly with schools and institutions. We also provide foreign credential evaluations for international hires, ensuring fast, accurate education verification background checks that reduce hiring risk and support confident hiring decisions.",
    hero:
      "Roughly 40% of resumes have at least one inaccuracy in the education section, and the gap between 'attended' and 'graduated' is the single most common one. We verify degree, major, dates of attendance, and graduation status directly with the registrar — through the National Student Clearinghouse where available and direct-to-institution where it isn't — and run a foreign-credential evaluation for international degrees.",
    sla: "Avg. 2 business days",
    priceBand: "$",
    includes: [
      "Degree, major, and graduation date",
      "Vocational and technical certifications",
      "Foreign-credential evaluation (US-equivalency)",
      "Direct National Student Clearinghouse query where available",
      "Honors / GPA verification (where the institution discloses)",
    ],
    catches: [
      "Claimed degrees that were never awarded",
      "Date drift between resume and registrar",
      "Diploma-mill credentials (cross-checked against unaccredited list)",
      "Major / minor inflation beyond what the institution confirms",
    ],
    doesNotCatch: [
      "Coursework completed without a credential awarded",
      "GPA where the school does not disclose to third parties",
      "Specific class transcripts (separate FERPA-consented request)",
      "Industry certifications that aren't a degree (covered under professional license check)",
    ],
    compliance: [
      "FERPA written candidate consent required for direct registrar verification",
      "International data-protection (GDPR / PIPEDA) where the institution is abroad",
      "FCRA §613 reporting accuracy obligation",
    ],
    industries: ["Healthcare", "Technology", "Education", "Financial services"],
    relatedBlogSlugs: ["education-verification-process", "fcra-compliance-guide"],
    relatedServiceSlugs: ["employment-verification", "healthcare-sanctions", "identity-verification"],
    faqs: [
      {
        q: "Do you verify online degrees?",
        a: "Yes, when the institution is regionally accredited. We flag unaccredited / diploma-mill credentials so adjudicators can apply their own policy.",
      },
      {
        q: "What's the TAT for an international degree?",
        a: "Typically 5–10 business days, depending on country. We provide a US-equivalency evaluation alongside the verification.",
      },
    ],
    // §114 — first service to opt in to the standalone left-rail
    // illustration. Editorial diploma + mortarboard + ledger study,
    // generated via the webdev image pipeline (compressed WebP).
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-education-verification-eLf9rJEMmN4Suu6ZZ3rCb9.webp",
      alt: "Editorial illustration of a rolled diploma tied with a green ribbon resting on a navy mortarboard cap, beside an open registrar ledger with a single check mark — representing direct registrar verification of degrees and credentials.",
    },
  },
  {
    slug: "drug-screening",
    pricingAddonId: "drug5",
    title: "Drug & Health Screening",
    shortTitle: "Drug Screening",
    tag: "04 — Drug & Health",
    icon: FlaskConical,
    topic: "drug",
    summary:
      "Reliable drug testing services with 5-panel, 10-panel, and 12-panel drug screens plus occupational health testing available through 12,000+ collection sites nationwide. Our employment drug testing solutions provide fast, accurate, MRO-reviewed results to help employers maintain compliance and make safer hiring decisions.",
    hero:
      "A modern drug-screening program is more than a 5-panel cup. It is a panel-design decision (which substances), a specimen-type decision (urine / hair / oral fluid), a state-law overlay (cannabis legalization changes the math in 24 states), and an MRO review to convert lab results into legally defensible adjudication. We run all four together and document each step in the report.",
    sla: "Negative results in 24h",
    priceBand: "$$",
    includes: [
      "5-, 10-, or 12-panel urine drug tests",
      "Hair (90-day window), oral fluid (3-day window), ETG alcohol",
      "Occupational health (TB, vision, audiogram)",
      "DOT and non-DOT testing programs",
      "MRO-reviewed electronic results",
      "12,000+ collection sites nationwide",
    ],
    catches: [
      "All five DOT panels (THC, cocaine, opiates, amphetamines, PCP)",
      "Synthetic opioids on the 10-panel (oxycodone, hydrocodone, fentanyl)",
      "Benzodiazepines, barbiturates, methadone on the 12-panel",
      "Adulteration / dilution attempts via specimen validity testing",
    ],
    doesNotCatch: [
      "THC use in jurisdictions where you've opted out of THC testing per state law",
      "Use older than the specimen-window (urine ~3 days, hair ~90 days, oral ~24h)",
      "Off-label prescription use that the MRO accepts as legitimate",
      "Alcohol consumption longer than the ETG ~80-hour window",
    ],
    compliance: [
      "DOT/FMCSA part-49 §382 program requirements for safety-sensitive positions",
      "Cannabis legalization overlays in 24 states (NY, NJ, CA, NV, MA, CT, RI, +17 more)",
      "ADA reasonable-accommodation analysis for prescription medications",
      "MRO review per HHS-mandated Substance Abuse and Mental Health Services Administration guidelines",
    ],
    industries: ["Transportation", "Healthcare", "Manufacturing", "Construction", "Logistics"],
    relatedBlogSlugs: ["pre-employment-drug-testing", "dot-driver-background-checks-mvr"],
    relatedServiceSlugs: ["motor-vehicle-records", "criminal-records", "continuous-monitoring"],
    faqs: [
      {
        q: "Can I test for THC in a state that has legalized cannabis?",
        a: "It depends. DOT-regulated and safety-sensitive positions can; for most other roles, NY/NJ/CA and 7 other states restrict pre-employment THC testing.",
      },
      {
        q: "What's the difference between a 5-panel and 10-panel test?",
        a: "A 5-panel covers the SAMHSA-5 (THC, cocaine, opiates, amphetamines, PCP). A 10-panel adds benzos, barbiturates, methaqualone, methadone, and propoxyphene.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-drug-screening-CXbWDQnxTXdT4XRfe6msbM.webp",
      alt: "Editorial illustration of a clean clinical specimen vial with a navy cap beside a folded chain-of-custody form with a soft green check mark and a clipboard — representing MRO-reviewed 5-, 10-, and 12-panel drug and occupational health screening.",
    },
  },
  {
    slug: "motor-vehicle-records",
    pricingAddonId: "mvr",
    title: "Motor Vehicle Records (MVR)",
    shortTitle: "Motor Vehicle Records",
    tag: "05 — MVR",
    icon: Car,
    topic: "driving",
    summary:
      "Comprehensive MVR background checks and motor vehicle record searches with real-time driving records across all 50 states for employees in driving-related roles. Our MVR monitoring services help fleet managers and employers track driver activity, reduce risk, and maintain safer, more compliant operations.",
    hero:
      "Motor vehicle records are the lowest-friction, fastest-return check in the catalog. We pull a 3-, 5-, or 7-year driving history directly from each state's DMV, surface license status / class / endorsements, list every violation and accident on file, and run a CDL Clearinghouse query for FMCSA-regulated drivers. For fleet operators we layer continuous monitoring so violations between hire-date and renewal don't slip past you.",
    sla: "Instant in 47 states",
    priceBand: "$",
    includes: [
      "3-, 5-, or 7-year driving history",
      "License status, class, endorsements, and restrictions",
      "Violations, accidents, suspensions, and DUIs",
      "CDL Clearinghouse query (FMCSA)",
      "Continuous MVR monitoring (optional)",
      "Multi-state pull when candidate has lived in multiple states",
    ],
    catches: [
      "DUI / DWI convictions on the driving record",
      "License suspensions, revocations, and restrictions",
      "Moving violations (speeding, reckless, careless)",
      "At-fault accidents on file at DMV",
      "CDL drug & alcohol violations via the FMCSA Clearinghouse",
    ],
    doesNotCatch: [
      "Out-of-state violations that haven't reciprocated to the resident state",
      "Parking and equipment violations (typically excluded by DMV)",
      "Violations dropped or pleaded down before reaching DMV",
      "Driving conduct in countries outside the U.S.",
    ],
    compliance: [
      "DPPA (Driver's Privacy Protection Act) permissible-purpose required",
      "FMCSA part-391.23 pre-employment investigation requirement for CDL drivers",
      "FMCSA Clearinghouse Query Plan rule (mandatory for CDL hires since 2020)",
      "California ICRAA and NY FCRA layered consent requirements",
    ],
    industries: ["Transportation", "Logistics", "Construction", "Field services", "Sales (outside reps)"],
    relatedBlogSlugs: ["background-check-turnaround-times", "dot-driver-background-checks-mvr"],
    relatedServiceSlugs: ["drug-screening", "continuous-monitoring", "criminal-records"],
    faqs: [
      {
        q: "Do I need MVR for non-CDL drivers?",
        a: "Yes if driving is incidental to the role and your insurance carrier requires it — most do for any role that drives a company vehicle or personal vehicle on company business.",
      },
      {
        q: "What's the difference between a 3-year and 7-year MVR?",
        a: "Look-back window. 3 years is most common for non-CDL hires; 7 years for CDL and high-risk roles. State law may require a specific minimum.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-motor-vehicle-records-RUm8ra2GQECJsKnC9pHzkb.webp",
      alt: "Editorial illustration of a state-issued driver's license card overlapping a folded MVR abstract sheet with a small set of car keys on a navy keyring — representing real-time DMV driving-record pulls and CDL Clearinghouse queries.",
    },
  },
  {
    slug: "social-media-screening",
    pricingAddonId: "social",
    title: "Social Media Screening",
    shortTitle: "Social Media",
    tag: "06 — Social",
    icon: Globe,
    topic: "social",
    summary:
      "Professional social media background screening designed to help employers identify potential risks through publicly available online activity. Our social media screening services are FCRA-compliant and include human review, customizable screening categories, and filtering of protected-class information before hiring decisions are made.",
    hero:
      "Social media screening is the most-misunderstood check on the menu. Done right, it is FCRA-compliant: a third-party CRA reviews public posts only, flags only the categories you opt in to, filters out protected-class data (race, religion, national origin, sexual orientation, etc.) before the report ever reaches you, and surfaces an evidence packet so the adjudicator sees the source, not just an opaque score. We do not run AI-only adjudication; every flag is human-reviewed.",
    sla: "Avg. 2 business days",
    priceBand: "$",
    includes: [
      "Public posts across the major platforms",
      "Hate speech and illegal-activity flags",
      "Configurable category opt-ins (violence, drugs, sexually explicit, etc.)",
      "Protected-class data filtered before adjudicator review",
      "Human-reviewed evidence packets with screenshots",
    ],
    catches: [
      "Public posts containing hate speech or threats",
      "Documented illegal-activity content (drugs, weapons trafficking)",
      "Workplace-violence indicators on public profiles",
      "Sexually explicit content on accounts you've opted to flag",
    ],
    doesNotCatch: [
      "Private / locked / friends-only content (we do not impersonate or scrape)",
      "Protected-class characteristics (filtered out by design)",
      "Off-platform conduct without a public corroborating post",
      "Content older than the look-back window you configure",
    ],
    compliance: [
      "FCRA §607 maximum-possible-accuracy requirement",
      "EEOC Title VII protected-class filtering before adjudication",
      "California ICRAA + Investigative Consumer Reporting Act consent",
      "GDPR / CPRA data-minimization for EU/CA candidates",
    ],
    industries: ["Education", "Healthcare", "Government", "Public-facing brands"],
    relatedBlogSlugs: ["fcra-compliance-guide"],
    relatedServiceSlugs: ["criminal-records", "identity-verification", "continuous-monitoring"],
    faqs: [
      {
        q: "Is social media screening legal?",
        a: "Yes, when run by an FCRA-regulated CRA with category opt-ins, protected-class filtering, and written candidate disclosure. DIY screening by a hiring manager is what creates EEOC risk.",
      },
      {
        q: "Can you screen private accounts?",
        a: "No. We only review public-facing content. Reputable CRAs do not impersonate, scrape, or attempt to bypass platform privacy settings.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-social-media-screening-dAnaZhXHGGSwkMpDsDQSn2.webp",
      alt: "Editorial illustration of a smartphone showing an abstract feed and a speech-bubble icon, beside a printed report sheet with a soft green check mark and a small magnifying glass — representing FCRA-compliant, human-reviewed screening of public online behavior.",
    },
  },
  {
    slug: "identity-verification",
    title: "Identity Verification",
    shortTitle: "Identity",
    tag: "07 — Identity",
    icon: ShieldCheck,
    topic: "identity",
    summary:
      "Advanced identity verification services using document validation, biometric authentication, and SSN trace searches to help confirm applicant identity with confidence. Our identity verification background checks create a strong foundation for accurate screening, reducing fraud risk and supporting more reliable hiring decisions.",
    hero:
      "Identity verification is the foundation every downstream check depends on. If the SSN trace turns up a name that does not match the candidate, every subsequent criminal, employment, and education check is searching the wrong person. We run SSN trace, address-history reconciliation, government-ID document authentication, and (optionally) a biometric face-match against the ID, all before a single county court is queried.",
    sla: "Real-time decision",
    priceBand: "$",
    includes: [
      "SSN trace + name reconciliation",
      "Address history reconciliation (7 years)",
      "Government-ID document authentication",
      "Biometric face-match against the ID (optional)",
      "Knowledge-based authentication fallback",
      "E-Verify and SSA verification (where applicable)",
    ],
    catches: [
      "SSN-name mismatches that would route subsequent checks to the wrong record",
      "Synthetic-identity flags (mismatched age + SSN + address pattern)",
      "Document-authenticity failures (forged DL, expired ID, altered passport)",
      "Address gaps that need a county-court layered search",
    ],
    doesNotCatch: [
      "Stolen identities where the imposter holds matching real documents (rare)",
      "International candidates without a U.S. SSN footprint (use international ID instead)",
      "Recent identity changes (legal name change) until the SSA records catch up",
    ],
    compliance: [
      "FCRA §605A active-duty alert and §605B identity-theft processes",
      "USCIS E-Verify Memorandum of Understanding",
      "SOC 2 Type II controls for biometric data handling",
      "GDPR / CPRA biometric consent requirements",
    ],
    industries: ["Financial services", "Healthcare", "Gig economy", "Marketplaces"],
    relatedBlogSlugs: ["fcra-compliance-guide", "county-vs-national-criminal-background-check"],
    relatedServiceSlugs: ["criminal-records", "employment-verification", "education-verification"],
    faqs: [
      {
        q: "Do I need identity verification if I'm running other checks?",
        a: "Yes. Without identity verification, every other check searches a name + DOB + SSN combination — if that combination is wrong, the check is meaningless.",
      },
      {
        q: "Is biometric face-match required?",
        a: "No, it's optional. SSN trace + document authentication is the floor; biometric is recommended for fully-remote hire flows where no in-person handoff exists.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-identity-verification-gxEzshkVdHAh2LTkgF2c8k.webp",
      alt: "Editorial illustration of a navy passport booklet beside a fingerprint card showing a single loop pattern, with a small navy shield holding a soft green check mark — representing SSN trace, document authentication, and biometric identity assurance as the foundation layer.",
    },
  },
  {
    slug: "healthcare-sanctions",
    title: "Healthcare Sanctions & Exclusion Screening",
    shortTitle: "Healthcare Sanctions",
    tag: "08 — Healthcare",
    icon: HeartPulse,
    topic: "healthcare",
    summary:
      "Comprehensive healthcare exclusion screening with checks against OIG LEIE, SAM, and all 50-state Medicaid exclusion databases for employees working in healthcare and federally funded programs. Our exclusion screening services help employers maintain compliance, reduce risk, and ensure qualified candidates meet healthcare hiring requirements.",
    hero:
      "Hiring an excluded individual into a Medicare- or Medicaid-billing role triggers civil monetary penalties of up to $10,000 per item or service furnished, plus mandatory restitution. The OIG LEIE, SAM.gov debarment list, and each of the 50 state Medicaid exclusion lists must all be checked at hire and re-checked monthly thereafter. We run all 52 lists at hire and continuously monitor for the duration of employment.",
    sla: "Real-time on hire, monthly continuous",
    priceBand: "$",
    includes: [
      "OIG LEIE (List of Excluded Individuals/Entities)",
      "SAM.gov (System for Award Management) debarments",
      "All 50 state Medicaid exclusion lists",
      "Monthly continuous re-screen for the duration of employment",
      "FDA Debarment List (for pharma / clinical research)",
      "Professional license verification (RN, MD, LPN, PA, etc.)",
    ],
    catches: [
      "Federal exclusions from Medicare / Medicaid billing",
      "State Medicaid program exclusions",
      "Federal debarments from federal contracts",
      "Mid-employment license suspensions or revocations (continuous mode)",
      "Disciplinary actions filed by state medical / nursing boards",
    ],
    doesNotCatch: [
      "Pending investigations that have not yet resulted in an exclusion",
      "Professional misconduct in jurisdictions outside the U.S.",
      "Exclusions imposed by private insurers (not on government lists)",
    ],
    compliance: [
      "OIG Special Advisory Bulletin requires monthly re-screen",
      "CMS 42 CFR §1001 mandatory exclusion timeline rules",
      "Joint Commission and CARF accreditation continuous-monitoring requirements",
      "State Medicaid agency contract terms (vary by state)",
    ],
    industries: ["Healthcare", "Pharmaceutical", "Clinical research", "Long-term care", "Home health"],
    relatedBlogSlugs: ["healthcare-background-check-requirements"],
    relatedServiceSlugs: ["continuous-monitoring", "drug-screening", "criminal-records"],
    faqs: [
      {
        q: "How often should I re-check OIG / SAM exclusions?",
        a: "Monthly. The OIG Special Advisory Bulletin is explicit on this; quarterly is the minimum that has survived enforcement scrutiny.",
      },
      {
        q: "Do I need to check all 50 state Medicaid lists?",
        a: "If you bill Medicaid in any state, yes. Most CMP enforcement actions in the last 5 years cite state-list misses, not federal.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-healthcare-sanctions-ii2ZZMvnAEHkbksuZtR5GR.webp",
      alt: "Editorial illustration of a folded healthcare credential certificate marked with a caduceus symbol beside a clipboard register with a soft green check mark and a small navy shield — representing OIG LEIE, SAM.gov, and 50-state Medicaid exclusion screening for healthcare hires.",
    },
  },
  {
    slug: "continuous-monitoring",
    pricingAddonId: "monitoring",
    title: "Continuous Monitoring",
    shortTitle: "Continuous Monitoring",
    tag: "09 — Monitoring",
    icon: Activity,
    topic: "monitoring",
    summary:
      "Proactive continuous monitoring services that provide ongoing post-hire screening across criminal records, MVR monitoring, and exclusion databases. Our continuous background monitoring helps employers receive timely alerts on reportable changes, reducing risk and ensuring important events are identified quickly instead of waiting for annual rescreening.",
    hero:
      "Annual rescreens are a relic of the era when criminal court records were paper. Today, the same data feeds we use at hire are queryable continuously — and a real-time monitoring feed catches a license suspension, a DUI, or an OIG exclusion within days, not 11 months later. We run continuous monitoring as a thin annualized add-on across every package, and route alerts to the adjudicator your team already uses.",
    sla: "Alerts within 48h of source-record update",
    priceBand: "$",
    includes: [
      "Continuous criminal monitoring (court-record feeds)",
      "Continuous MVR monitoring (DMV feeds)",
      "OIG / SAM / state Medicaid exclusion monitoring",
      "Professional license suspension monitoring",
      "Configurable alert routing (HRIS, email, Slack)",
      "Annual full re-screen as a complement, not a replacement",
    ],
    catches: [
      "Post-hire criminal arrests and convictions",
      "License suspensions and revocations",
      "Mid-employment OIG / SAM exclusions",
      "DMV violations on file (for CDL and fleet drivers)",
    ],
    doesNotCatch: [
      "Events in jurisdictions whose court records do not update electronically",
      "Off-record conduct that hasn't reached a court or licensing body",
      "Self-reported events the employee did not disclose",
    ],
    compliance: [
      "FCRA §613 reporting accuracy on each alert",
      "Pre-adverse / adverse action workflow on every actionable alert",
      "EEOC individualized assessment per alert (not bulk action)",
      "California ICRAA continuous-consent requirements",
    ],
    industries: ["Healthcare", "Transportation", "Financial services", "Education", "Gig economy"],
    relatedBlogSlugs: ["continuous-employee-monitoring", "healthcare-background-check-requirements"],
    relatedServiceSlugs: ["criminal-records", "motor-vehicle-records", "healthcare-sanctions"],
    faqs: [
      {
        q: "Does continuous monitoring replace annual rescreens?",
        a: "Not entirely. Continuous catches court-of-record events; annual rescreens catch credential gaps and address-history changes that don't trigger an alert.",
      },
      {
        q: "How are alerts routed?",
        a: "Configurable per client. Most teams route into their HRIS via webhook; some use Slack / Teams; email is the default fallback.",
      },
    ],
    // §117 — editorial illustration to match §114 Education treatment.
    heroImage: {
      url: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/services-continuous-monitoring-9CaUDydXJGB2HM3b9vQtgS.webp",
      alt: "Editorial illustration of a round analog desk clock with a radar-style ping ring beside a printed monitoring dashboard sheet with a rising waveform and a soft green check mark — representing always-on post-hire monitoring across criminal, MVR, and exclusion data feeds.",
    },
  },
];

export const SERVICE_SLUGS: ReadonlySet<string> = new Set(
  SERVICE_CATALOG.map((s) => s.slug),
);

export function findServiceBySlug(slug: string): ServiceDetail | undefined {
  return SERVICE_CATALOG.find((s) => s.slug === slug);
}

export function findServicesByTopic(topic: ServiceTopic): ServiceDetail[] {
  return SERVICE_CATALOG.filter((s) => s.topic === topic);
}
