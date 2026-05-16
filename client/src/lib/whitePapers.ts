/**
 * §81 — White papers library.
 *
 * Each entry is a long-form article presented as a white paper. The body lives
 * in the entry itself (so the page renders without external assets); a future
 * pass can swap to gated PDFs.
 *
 * Used by: /resources/white-papers
 */

export type WhitePaperTopic =
  | "Compliance"
  | "Operations"
  | "Industry"
  | "Candidate Experience";

export interface WhitePaper {
  id: string;
  slug: string;
  title: string;
  topic: WhitePaperTopic;
  audience: string;
  publishedAt: string; // ISO
  readMinutes: number;
  summary: string;
  highlights: string[];
}

export const WHITE_PAPERS: WhitePaper[] = [
  {
    id: "wp-fcra-fundamentals",
    slug: "fcra-fundamentals-for-employers",
    title: "FCRA Fundamentals: A Field Manual for Employer Screening Programs",
    topic: "Compliance",
    audience: "Talent Acquisition leads, Compliance officers",
    publishedAt: "2026-04-30",
    readMinutes: 16,
    summary:
      "A practitioner-oriented walkthrough of the Fair Credit Reporting Act as it actually shows up in employment-screening workflows: standalone disclosure, written authorization, certification language, the pre- and post-adverse-action sequence, dispute handling, and the recordkeeping cadence that survives an FTC inquiry.",
    highlights: [
      "Standalone disclosure language that has held up in plaintiff-side challenges",
      "A full pre-adverse to final-adverse runbook with day counts",
      "Recordkeeping retention matrix tied to 15 U.S.C. § 1681 and state retention rules",
      "What changes when ICRAA, NYCRA, or Maine's Fair Chance Act layer over the federal floor",
    ],
  },
  {
    id: "wp-healthcare-onboarding",
    slug: "healthcare-onboarding-best-practices",
    title: "Healthcare Onboarding: Building a 14-Day Hire Window That Survives Audits",
    topic: "Industry",
    audience: "Healthcare HR, Credentialing teams",
    publishedAt: "2026-04-15",
    readMinutes: 14,
    summary:
      "Healthcare hiring sits at the intersection of FCRA, OIG/SAM exclusion checks, state nursing-board rules, and Joint Commission standards. This paper documents the dual-track design that lets you run a 14-day onboarding cycle without surfacing as a finding in your next CMS or TJC audit.",
    highlights: [
      "OIG LEIE + SAM.gov + state-specific exclusion check sequencing",
      "Sanction-monitoring vs. annual-rescreening tradeoffs for clinical roles",
      "Practical accommodations for traveling-clinician programs",
      "Adverse-action handling without disrupting credential start dates",
    ],
  },
  {
    id: "wp-continuous-monitoring",
    slug: "continuous-monitoring-business-case",
    title: "The Quiet Math: Building the Business Case for Continuous Monitoring",
    topic: "Operations",
    audience: "VP People, Risk officers, Procurement",
    publishedAt: "2026-03-25",
    readMinutes: 12,
    summary:
      "Continuous monitoring sounds like an upsell until you do the unit-economics work. This paper builds a defensible model that compares annual-rescreening cost, incident-cost-avoided, and turnover-recovery against the cost of a continuous program — and shows where it stops paying back.",
    highlights: [
      "Cost-of-an-incident framework with three real (anonymized) loss profiles",
      "When continuous monitoring is overkill: roles, geographies, and contract clauses",
      "FCRA-grade notice and authorization design for ongoing monitoring",
      "Procurement checklist for evaluating monitoring providers",
    ],
  },
  {
    id: "wp-candidate-experience",
    slug: "candidate-experience-during-screening",
    title: "Candidate Experience During the Black Box Week",
    topic: "Candidate Experience",
    audience: "Talent Acquisition, Recruiting Operations",
    publishedAt: "2026-03-05",
    readMinutes: 11,
    summary:
      "Most candidates judge an employer brand on what happens between offer and start date — and most of that window is a screening process the candidate cannot see. This paper documents the communication patterns, status surfacing, and accommodation defaults that move offer-to-start NPS twenty points without slowing the operation.",
    highlights: [
      "Three status-surfacing models (silent, milestoned, real-time) and their cost/benefit",
      "Candidate-facing language that does not violate FCRA pre-adverse rules",
      "Accommodations and identity-document flexibility for global hires",
      "Survey instruments that produce actionable signal in 5 questions",
    ],
  },
  {
    id: "wp-multi-state-employer",
    slug: "multi-state-employer-screening-framework",
    title: "The Multi-State Employer Screening Framework",
    topic: "Compliance",
    audience: "Multi-state HR, In-house counsel",
    publishedAt: "2026-02-18",
    readMinutes: 18,
    summary:
      "If your workforce sits in more than three states, your screening program is probably out of date in at least one of them. This paper presents a framework for harmonizing state-specific addenda, withdrawal-state escalation procedures, and the centralized policy that keeps the whole thing auditable.",
    highlights: [
      "State-by-state addenda decision tree (which states require their own form)",
      "Disclosure-language matrix for the seven states with strict standalone rules",
      "Recurring update cadence: who reads what statute when",
      "An audit-ready policy outline you can adopt verbatim",
    ],
  },
  {
    id: "wp-driving-records-program",
    slug: "driving-records-program-design",
    title: "Driving Records Program Design for Non-CDL Workforces",
    topic: "Operations",
    audience: "Operations leaders, Field Services managers",
    publishedAt: "2026-01-29",
    readMinutes: 13,
    summary:
      "DOT/CDL programs get all the attention; non-CDL driving programs (sales reps, field techs, delivery contractors) carry as much liability and far less guidance. This paper outlines the policy, MVR cadence, and incident-response design that keeps your insurance carrier comfortable.",
    highlights: [
      "MVR pull cadence by role tier and state",
      "Insurance-carrier conversations that earn renewal credits",
      "DPPA-compliant authorization language",
      "Continuous-MVR programs vs. annual pulls: real-cost comparison",
    ],
  },
  {
    id: "wp-adjudication-matrix",
    slug: "building-a-defensible-adjudication-matrix",
    title: "Building a Defensible Adjudication Matrix Without Disparate Impact",
    topic: "Compliance",
    audience: "Compliance officers, Talent Acquisition leads, In-house counsel",
    publishedAt: "2026-05-12",
    readMinutes: 17,
    summary:
      "Adjudication is where most screening programs quietly create liability — a single hard-coded rule (\"any felony in the last 7 years = no\") can produce the disparate-impact pattern the EEOC has been suing on for fifteen years. This paper walks through the role-banded, evidence-based adjudication matrix that survives an EEOC audit and the individualized-assessment workflow that keeps adverse actions clean.",
    highlights: [
      "Role-banded matrix design (general staff vs. cash-handling vs. patient-facing vs. fiduciary)",
      "Applying EEOC's 2012 Green-factor guidance to specific offense codes",
      "Individualized-assessment template with prompts, evidence list, and approver routing",
      "Annual disparate-impact review: data pull, four-fifths analysis, documentation cadence",
    ],
  },
  {
    id: "wp-staffing-agency-screening",
    slug: "staffing-agency-screening-program-design",
    title: "Staffing-Agency Screening: Running 2,000 Hires a Month Without a Compliance Failure",
    topic: "Industry",
    audience: "Staffing-agency owners, Branch managers, Compliance officers",
    publishedAt: "2026-04-22",
    readMinutes: 15,
    summary:
      "High-volume staffing has a structural compliance problem: every branch is its own hiring entity, every client wants a different screening package, and every disclosure form has to land before day one. This paper documents the three-tier program design that lets a staffing operator run 2,000 placements a month with consistent disclosures, client-specific add-ons, and a single audit trail.",
    highlights: [
      "Branch-level disclosure templates that survive multi-state placements",
      "Client-specific add-on routing without breaking the master order",
      "Co-employment liability and how the screening trail allocates it",
      "Same-day-start exception handling: what to skip, what to never skip",
    ],
  },
  {
    id: "wp-international-screening",
    slug: "international-screening-for-us-employers",
    title: "International Screening for U.S. Employers: GDPR, Local Statutes, and the Quiet Land-Mines",
    topic: "Compliance",
    audience: "Global Talent Acquisition, In-house counsel, People Operations",
    publishedAt: "2026-04-08",
    readMinutes: 19,
    summary:
      "A U.S. screening program designed against the FCRA does not survive its first hire in Frankfurt, São Paulo, or Bangalore. This paper documents the cross-border framework — GDPR Article 6 lawful-basis selection, country-specific criminal-record availability, and the candidate-consent language that holds up under both U.S. and EU law — for employers building a global workforce.",
    highlights: [
      "GDPR Article 6 lawful-basis decision tree for employment screening",
      "Country availability matrix: where criminal records are public, restricted, or unavailable",
      "Translated consent language for the 12 most-screened jurisdictions",
      "Vendor-network design: when to use a global CRA vs. local partners",
    ],
  },
  {
    id: "wp-drug-testing-program",
    slug: "post-legalization-drug-testing-program-design",
    title: "Drug Testing After Legalization: A Program Design for the Post-Marijuana-Reform Era",
    topic: "Operations",
    audience: "Safety officers, HR leadership, Operations managers",
    publishedAt: "2026-03-18",
    readMinutes: 14,
    summary:
      "Twenty-four states have now passed off-duty cannabis-use protections, and the legal landscape has shifted faster than most drug-testing programs have updated. This paper documents the post-legalization redesign: which panels still make sense, which roles retain pre-employment testing, how reasonable-suspicion procedures need to change, and how to keep DOT-regulated populations isolated from the rest of the program.",
    highlights: [
      "State-by-state off-duty-use protection matrix (24 states + DC)",
      "Safety-sensitive carve-outs that survive a New York or California challenge",
      "5-panel vs. 10-panel vs. expanded-opiate panel: cost-benefit by role",
      "DOT firewall design: keeping FMCSA programs untouched by state cannabis laws",
    ],
  },
  {
    id: "wp-financial-services-screening",
    slug: "financial-services-screening-fingerprinting-and-finra",
    title: "Financial-Services Screening: FINRA Form U4, Fingerprinting, and the 90-Day Window",
    topic: "Industry",
    audience: "Broker-dealer compliance, Bank HR, Credit-union HR",
    publishedAt: "2026-02-26",
    readMinutes: 13,
    summary:
      "Banks, broker-dealers, and credit unions live under a stack of overlapping regulations — Section 19 of the FDI Act, FINRA Rule 3110(e), the Fair Credit Reporting Act, and state banking-department rules — that creates a 90-day fingerprint-and-disclose window most generic screening programs miss. This paper documents the financial-services-grade workflow: U4 disclosure mapping, FBI fingerprint card routing, and the consent-order check that keeps an institution out of an OCC enforcement action.",
    highlights: [
      "Form U4 question-by-question disclosure mapping against the screening report",
      "FBI fingerprint card vs. live-scan: timing, cost, and adjudication speed",
      "FDIC Section 19 written-consent process for covered offenses",
      "Consent-order and enforcement-action check sources (OCC, FDIC, NCUA, state DFIs)",
    ],
  },
  {
    id: "wp-ai-in-screening",
    slug: "ai-in-employment-screening-governance",
    title: "AI in Employment Screening: A Governance Framework for the EEOC's Coming Enforcement",
    topic: "Compliance",
    audience: "Chief People Officers, Compliance officers, Procurement",
    publishedAt: "2026-02-04",
    readMinutes: 16,
    summary:
      "Vendors are racing to bolt LLMs onto the screening pipeline — automated court-record summarization, AI-assisted adjudication recommendations, sentiment-scored verifications. The EEOC's May 2023 technical-assistance document and New York City's Local Law 144 are early signals of what enforcement will look like. This paper documents the vendor-evaluation, internal-governance, and bias-audit framework an employer needs before any AI touches a screening decision.",
    highlights: [
      "Vendor questionnaire: 22 questions every AI screening vendor should answer in writing",
      "Internal governance committee charter, meeting cadence, and escalation paths",
      "Bias-audit specification aligned to NYC Local Law 144 and the proposed EU AI Act",
      "Adjudication rule: where AI may recommend, where humans must decide alone",
    ],
  },
  {
    id: "wp-gig-and-1099-screening",
    slug: "gig-and-1099-contractor-screening",
    title: "Gig-Worker and 1099 Contractor Screening: Independent-Contractor Rules Without the Employment Trap",
    topic: "Operations",
    audience: "Marketplace operators, Procurement, Compliance officers",
    publishedAt: "2026-01-15",
    readMinutes: 12,
    summary:
      "Marketplaces and gig platforms screen the way employers do — but the moment they over-control the work product, the IRS, the DOL, and California's AB-5 reclassify their contractors as employees. This paper documents the contractor-grade screening program: which checks are defensible (and which suggest control), how the trust-and-safety brand survives a single bad actor, and how the consent flow stays clear of W-2-style language.",
    highlights: [
      "Defensible vs. control-suggesting checks under the IRS 20-factor test",
      "Trust-and-safety incident-response runbook for marketplace operators",
      "AB-5, California PAGA, and the multi-factor reclassification risk",
      "Contractor consent and disclosure language that does not read as employment offer",
    ],
  },
  {
    id: "wp-merger-acquisition-rescreen",
    slug: "mergers-acquisitions-workforce-rescreen",
    title: "M&A Workforce Rescreen: Closing-Day Diligence Without Day-One Disruption",
    topic: "Operations",
    audience: "M&A integration leads, Chief Human Resources Officers, Outside counsel",
    publishedAt: "2025-12-19",
    readMinutes: 14,
    summary:
      "Acquired workforces arrive with screening histories of unknown depth, unknown quality, and unknown legal standing — and the acquiring company inherits every gap on day one. This paper documents the closing-window rescreen design: who has to be touched, who can wait, what the FCRA requires when the acquirer is technically a new CRA-permissible-purpose holder, and how to avoid the 'we screened everyone again the day after close' lawsuit.",
    highlights: [
      "Tiered rescreen scope: critical-roles, regulated-roles, and the long-tail population",
      "FCRA permissible-purpose analysis when the legal entity changes",
      "Communication plan: what the acquired employees see, hear, and sign",
      "Adverse-action handling for findings on existing employees post-close",
    ],
  },
  {
    id: "wp-retail-qsr-loss-prevention",
    slug: "retail-and-qsr-loss-prevention-screening",
    title: "Retail and QSR Screening: Loss Prevention Without Losing Your Hourly Pipeline",
    topic: "Industry",
    audience: "Retail HR, QSR franchise operators, Loss-prevention leadership",
    publishedAt: "2025-12-02",
    readMinutes: 12,
    summary:
      "Hourly retail and QSR hiring is a volume game where every extra day of screening turnaround costs a real percentage of the candidate funnel. This paper documents the loss-prevention-grade program that keeps shrink defensible, holds turnaround under 24 hours for 80% of orders, and uses a tiered package design so the cashier track does not get held up by the assistant-manager track.",
    highlights: [
      "Tiered package design: cashier vs. shift-lead vs. assistant-manager",
      "Conditional county-search routing to keep median turnaround under 24h",
      "Theft-offense adjudication that does not collapse into per-se exclusion",
      "Franchise-vs-corporate compliance handoff and the disclosure trap to avoid",
    ],
  },
  {
    id: "wp-candidate-data-privacy",
    slug: "candidate-data-privacy-and-retention",
    title: "Candidate Data Privacy and Retention: Building a Program That Survives a CCPA Subject Request",
    topic: "Compliance",
    audience: "Privacy officers, HR leadership, Information Security",
    publishedAt: "2025-11-24",
    readMinutes: 13,
    summary:
      "The California CPRA, Colorado's CPA, Virginia's VCDPA, and the FTC's renewed FCRA enforcement have converged on the same operational question: how long are you keeping candidate screening data, why, and can you produce, correct, or delete it on a 45-day clock? This paper documents the retention-and-disposal program — by data type, by jurisdiction, and by lawful-basis — that lets an HR organization respond to a subject access request without a fire drill.",
    highlights: [
      "Retention matrix by data type (disclosure, consent, report, dispute, adverse action)",
      "State-by-state retention floor and ceiling for screening records",
      "Subject access request workflow: 45-day clock, identity verification, exceptions",
      "Data-disposal certifications and the vendor-side audit you actually need",
    ],
  },
];

export function whitePaperCounts() {
  const topics = new Map<WhitePaperTopic, number>();
  WHITE_PAPERS.forEach((w) => topics.set(w.topic, (topics.get(w.topic) ?? 0) + 1));
  return {
    total: WHITE_PAPERS.length,
    totalReadMinutes: WHITE_PAPERS.reduce((sum, w) => sum + w.readMinutes, 0),
    topics,
  };
}
