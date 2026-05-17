/*
  §83 — glossary.ts
  ------------------
  Authoritative A–Z definition list for the background-screening
  industry, used by /resources/glossary. Each entry is intentionally
  written in plain English first and includes a citation hook to a
  governing rule, statute, or our own deeper resource where one
  exists. The list is a "first-edition" of 36 terms covering the
  vocabulary that shows up across our white papers, blog, services,
  and compliance pages — designed to be expanded over time without
  schema changes.
*/
export type GlossaryEntry = {
  /** Stable kebab-case id used as URL hash + testid suffix */
  id: string;
  /** Term shown in the heading */
  term: string;
  /** Optional alternate spellings/abbreviations rendered in light grey */
  aka?: ReadonlyArray<string>;
  /** Long-form definition (1–3 sentences). */
  definition: string;
  /** Optional pointer to a governing rule + a deeper internal resource. */
  see?: { label: string; href: string };
};

export const GLOSSARY: ReadonlyArray<GlossaryEntry> = [
  {
    id: "adverse-action",
    term: "Adverse Action",
    aka: ["Pre-adverse / final adverse action"],
    definition:
      "A two-step process required by the FCRA when an employer decides not to hire (or terminates) a candidate based even partly on information in a consumer report. The pre-adverse step gives the candidate a copy of the report and a Summary of Rights; the final step is sent only after a reasonable waiting window.",
    see: { label: "FCRA Compliance Toolkit", href: "/resources/white-papers" },
  },
  {
    id: "ats",
    term: "ATS",
    aka: ["Applicant Tracking System"],
    definition:
      "Software where requisitions, candidate pipelines, and hiring statuses live. Modern background-check platforms integrate with the ATS so screens are launched and statuses written back without leaving the recruiter's main tool.",
    see: { label: "Integrations directory", href: "/integrations" },
  },
  {
    id: "ban-the-box",
    term: "Ban-the-Box",
    aka: ["Fair Chance hiring"],
    definition:
      "A rule that prohibits employers from asking about criminal history on the initial job application. Now law in 37+ states and 150+ cities, with details that vary on conditional-offer timing, conviction-only vs. arrest-history scope, and individualized-assessment requirements.",
    see: { label: "Ban-the-Box state directory", href: "/resources/ban-the-box-laws" },
  },
  {
    id: "baa",
    term: "BAA",
    aka: ["HIPAA Business Associate Agreement"],
    definition:
      "A contract required when a vendor handles Protected Health Information on behalf of a covered entity. We sign BAAs on request for healthcare clients before any screening involves clinical staff.",
  },
  {
    id: "cdlis",
    term: "CDLIS",
    aka: ["Commercial Driver's License Information System"],
    definition:
      "A federally administered database that holds CDL records for every commercial driver in the United States. Pulled as part of any DOT-aligned MVR program.",
    see: { label: "Motor Vehicle Records", href: "/services/motor-vehicle-records" },
  },
  {
    id: "consumer-report",
    term: "Consumer Report",
    definition:
      "Defined by the FCRA at 15 U.S.C. §1681a(d)(1), this is any communication of information about a consumer's character, general reputation, personal characteristics, or mode of living that is used or expected to be used for an employment purpose. Background checks are consumer reports.",
  },
  {
    id: "consortium",
    term: "Consortium (DOT)",
    aka: ["Random testing consortium"],
    definition:
      "A federally-required random drug-and-alcohol testing pool administered to 49 CFR Part 40, into which DOT-regulated drivers are enrolled. Selections are randomized and unannounced.",
    see: { label: "Drug & Alcohol Screening", href: "/services/drug-screening" },
  },
  {
    id: "continuous-monitoring",
    term: "Continuous Criminal Monitoring",
    aka: ["Post-hire monitoring", "Infinity screening"],
    definition:
      "An always-on layer that re-screens a current employee against criminal-record sources and alerts the employer when a new triggering event occurs. Especially common in healthcare, transportation, and gig marketplaces.",
    see: { label: "Continuous Monitoring", href: "/services/continuous-monitoring" },
  },
  {
    id: "cra",
    term: "CRA",
    aka: ["Consumer Reporting Agency"],
    definition:
      "Any company that compiles consumer reports for an employment-purpose user. Rapid Hire Solutions is a CRA under FCRA §1681e.",
  },
  {
    id: "dispute",
    term: "Dispute (Re-investigation)",
    definition:
      "A candidate's right under FCRA §1681i to challenge information in a consumer report. The CRA must complete a reasonable re-investigation within 30 days and report the corrected outcome to the consumer and the requesting employer.",
  },
  {
    id: "dqf",
    term: "DQF",
    aka: ["Driver Qualification File"],
    definition:
      "The file required by 49 CFR §391.51 that a motor carrier must maintain for every driver, containing the application, MVR, employment-history check, medical certificate, and (where applicable) drug-and-alcohol records.",
  },
  {
    id: "esign",
    term: "E-SIGN",
    aka: ["Electronic Signatures in Global and National Commerce Act"],
    definition:
      "The federal law that gives electronic signatures and records the same legal effect as their paper counterparts. Our candidate-side disclosure-and-authorization flow is ESIGN-compliant.",
  },
  {
    id: "fcra",
    term: "FCRA",
    aka: ["Fair Credit Reporting Act"],
    definition:
      "The federal statute (15 U.S.C. §§1681 et seq.) that governs how consumer reports — including background checks — may be obtained, used, and disputed. The FCRA imposes disclosure, authorization, adverse-action, accuracy, and dispute obligations on both employers and CRAs.",
    see: { label: "FCRA white papers", href: "/resources/white-papers" },
  },
  {
    id: "fmcsa-clearinghouse",
    term: "FMCSA Clearinghouse",
    definition:
      "A federal database (49 CFR §382.701) where DOT-regulated employers must report and query drug-and-alcohol testing results for CDL drivers. Pre-employment queries are required for every new commercial driver.",
  },
  {
    id: "fingerprint-check",
    term: "Fingerprint-based Check",
    aka: ["Live Scan / FBI Channeler"],
    definition:
      "A criminal history check run against the FBI's national fingerprint database, often coordinated through state-certified Live Scan operators or FBI Channelers. Mandated for many K-12, healthcare, and licensed-professional roles.",
  },
  {
    id: "i9",
    term: "I-9 / E-Verify",
    definition:
      "Form I-9 verifies a worker's authorization to work in the United States; E-Verify electronically confirms the I-9 against DHS and SSA records. Required at hire, separate from a background check.",
  },
  {
    id: "icraa",
    term: "ICRAA",
    aka: ["California Investigative Consumer Reporting Agencies Act"],
    definition:
      "California's stricter analogue to the FCRA, with notice-and-disclosure requirements that exceed the federal floor. Applies whenever a consumer report is procured for a California employee or applicant.",
  },
  {
    id: "individualized-assessment",
    term: "Individualized Assessment",
    definition:
      "An EEOC-recommended step (per the 2012 EEOC Guidance) where an employer considers whether a candidate's specific criminal record is job-related given the role, the time elapsed, and the candidate's circumstances — rather than applying a blanket bar.",
  },
  {
    id: "mro",
    term: "MRO",
    aka: ["Medical Review Officer"],
    definition:
      "A licensed physician who reviews and verifies positive drug-test results before they are reported to the employer. MRO review is mandatory under DOT 49 CFR Part 40 and is best practice for non-DOT testing.",
  },
  {
    id: "mvr",
    term: "MVR",
    aka: ["Motor Vehicle Record"],
    definition:
      "An official driving-history record issued by a state DMV, showing license status, violations, suspensions, and (depending on state) accident history.",
    see: { label: "Motor Vehicle Records", href: "/services/motor-vehicle-records" },
  },
  {
    id: "nbi",
    term: "National Criminal Database",
    aka: ["NCD", "National Criminal Locator"],
    definition:
      "A consolidated multi-state criminal-records database used to surface possible name matches for confirmation at the county or state level. Treated as a pointer, not a primary source — every hit is confirmed at the originating jurisdiction before reporting.",
  },
  {
    id: "npdb",
    term: "NPDB",
    aka: ["National Practitioner Data Bank"],
    definition:
      "A federal repository of medical malpractice payments and adverse licensure/clinical-privileges actions. Required reading for any healthcare credentialing decision; queried by hospital credentialing offices.",
  },
  {
    id: "oig-leie",
    term: "OIG-LEIE",
    aka: ["List of Excluded Individuals/Entities"],
    definition:
      "The HHS Office of Inspector General's database of individuals and entities excluded from participation in federal healthcare programs. Hiring or contracting an excluded person can trigger civil monetary penalties and CMS reimbursement clawbacks.",
    see: { label: "Healthcare sanctions", href: "/services/healthcare-sanctions" },
  },
  {
    id: "ofac",
    term: "OFAC",
    aka: ["Office of Foreign Assets Control"],
    definition:
      "The U.S. Treasury office that publishes the Specially Designated Nationals (SDN) list. Global sanctions screening for fiduciary roles checks against OFAC plus EU Consolidated, UN, and HM Treasury lists.",
  },
  {
    id: "pbsa",
    term: "PBSA",
    aka: ["Professional Background Screening Association"],
    definition:
      "The trade association for U.S. background-screening firms. PBSA accreditation requires independent audit against a 58-clause standard covering data security, privacy, accuracy, dispute resolution, and consumer protection.",
  },
  {
    id: "permissible-purpose",
    term: "Permissible Purpose",
    definition:
      "The specific FCRA-defined justifications (15 U.S.C. §1681b) under which a CRA may furnish a consumer report. Employment is a permissible purpose only with the candidate's written authorization.",
  },
  {
    id: "primary-source",
    term: "Primary Source Verification",
    definition:
      "Verification of a credential, employment, or education record by contacting the issuing authority directly — the state board, the registrar, or the employer of record — rather than relying on an aggregator.",
  },
  {
    id: "reasonable-procedures",
    term: "Reasonable Procedures (FCRA §1681e)",
    definition:
      "The FCRA's accuracy mandate: CRAs must follow reasonable procedures to assure maximum possible accuracy of the information in a consumer report. The standard is process-based, not result-based — but the courts will examine the process when accuracy fails.",
  },
  {
    id: "right-to-cure",
    term: "Right to Cure",
    aka: ["Pre-adverse waiting window"],
    definition:
      "The window between the pre-adverse and final adverse action notices during which a candidate may dispute the report or supply context. The FCRA does not specify a minimum, but a 5-business-day window is the de facto standard.",
  },
  {
    id: "soc2",
    term: "SOC 2 Type II",
    definition:
      "An AICPA assurance report on a service organization's controls relevant to security, availability, processing integrity, confidentiality, and privacy — measured over a multi-month observation window. Distinct from a Type I report, which is a point-in-time design assessment.",
  },
  {
    id: "ssn-trace",
    term: "SSN Trace",
    aka: ["Address-history trace"],
    definition:
      "A search that returns the names and addresses associated with a Social Security Number. Used to expand the criminal-records search jurisdictions and is not itself a criminal record.",
  },
  {
    id: "summary-of-rights",
    term: "Summary of Rights",
    definition:
      "The CFPB-published consumer disclosure (formerly issued by the FTC) that must accompany a consumer report under the FCRA at the disclosure-and-authorization stage and at the pre-adverse stage.",
  },
  {
    id: "tat",
    term: "TAT",
    aka: ["Turnaround Time"],
    definition:
      "The elapsed time from candidate consent to final report. Industry typical TAT for standard packages is 1–3 business days; the slow tail is driven by court closures, school registrars, and a few international jurisdictions.",
    see: { label: "Hiring velocity benchmarks", href: "/resources/benchmarks" },
  },
  {
    id: "u4",
    term: "U4 (Form U4)",
    aka: ["Uniform Application for Securities Industry Registration"],
    definition:
      "The FINRA registration form used to onboard a securities-industry representative. Disclosures on the U4 — and CRD/IARD disciplinary history — sit alongside the criminal-record check on a fiduciary-grade screen.",
  },
  {
    id: "verification",
    term: "Verification (Employment / Education)",
    definition:
      "Confirmation of employment dates, titles, eligibility for rehire, and (where the school permits) education attendance and credentials, contacted directly with the employer of record or the registrar.",
    see: { label: "Employment verification", href: "/services/employment-verification" },
  },
  {
    id: "yellow-flag",
    term: "Yellow-flag (Adjudication)",
    definition:
      "A configurable status — between green (cleared) and red (disqualifying) — that returns the report to a human reviewer for individualized assessment. Used in modern adjudication matrices to avoid blanket bars under the EEOC 2012 Guidance.",
  },
];
