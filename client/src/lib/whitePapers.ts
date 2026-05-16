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
