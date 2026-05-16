/**
 * §81 — Legislative & regulatory updates feed.
 *
 * Each entry is a short, source-anchored summary of a real statute or regulator
 * action affecting employment screening. Reference content, not legal advice.
 * Keep newest-first.
 *
 * Used by: /resources/legislative-updates
 */

export type UpdateScope = "Federal" | "State" | "Municipal";
export type UpdateCategory =
  | "FCRA"
  | "Ban-the-Box / Fair Chance"
  | "Cannabis"
  | "Pay Transparency"
  | "Identity Verification"
  | "Driving Records"
  | "AI / Algorithmic Hiring";
export type UpdateStatus = "Effective" | "Signed, not yet effective" | "Pending" | "Proposed";

export interface LegislativeUpdate {
  id: string;
  jurisdiction: string;
  scope: UpdateScope;
  category: UpdateCategory;
  title: string;
  summary: string;
  citation: string;
  effectiveDate: string;
  status: UpdateStatus;
  employerAction: string;
}

export const LEGISLATIVE_UPDATES: LegislativeUpdate[] = [
  {
    id: "ny-roa-2026",
    jurisdiction: "New York",
    scope: "State",
    category: "AI / Algorithmic Hiring",
    title: "New York Senate Bill S5641 — automated employment decision tools",
    summary:
      "Builds on NYC Local Law 144 by extending bias-audit and notice requirements statewide for any tool that materially assists screening, ranking, or hiring decisions. Requires annual independent audit and candidate-facing notice of automated tool use.",
    citation: "N.Y. Senate Bill S5641-A (2025-2026 session)",
    effectiveDate: "2026-07-01",
    status: "Signed, not yet effective",
    employerAction:
      "Inventory every AI/ML scoring or ranking layer in your ATS or vendor stack; commission a bias audit before July 1; add candidate notice language to job postings.",
  },
  {
    id: "ca-fcra-amendment-2026",
    jurisdiction: "California",
    scope: "State",
    category: "FCRA",
    title: "California ICRAA — expanded disclosure and dispute timelines",
    summary:
      "Amendments tighten the standalone-disclosure rule and shorten the consumer's reinvestigation window from 30 days to 21 days, with a five-business-day employer obligation to forward disputes to the CRA.",
    citation: "Cal. Civ. Code § 1786.20 (as amended by AB 1340, 2025)",
    effectiveDate: "2026-01-01",
    status: "Effective",
    employerAction:
      "Update standalone disclosure form; revise candidate authorization language; train recruiters on the 5-day dispute-forwarding obligation.",
  },
  {
    id: "wa-cannabis-2024",
    jurisdiction: "Washington",
    scope: "State",
    category: "Cannabis",
    title: "RCW 49.44.240 — pre-employment cannabis testing limits",
    summary:
      "Bars employers from making hiring decisions based on a pre-employment drug test that detects only non-psychoactive cannabis metabolites. Federally regulated safety-sensitive roles and certain law-enforcement positions are carved out.",
    citation: "RCW § 49.44.240",
    effectiveDate: "2024-01-01",
    status: "Effective",
    employerAction:
      "Reclassify roles as safety-sensitive under federal law where applicable; update Washington-state job postings to remove disqualifying language; coordinate with TPA on test-panel options.",
  },
  {
    id: "ca-ab2188-2024",
    jurisdiction: "California",
    scope: "State",
    category: "Cannabis",
    title: "California AB 2188 / SB 700 — off-duty cannabis protections",
    summary:
      "Adds cannabis to the lawful-products statute and bars adverse action based on off-duty use detected through metabolite testing. Construction trades, federally mandated testing, and contractors with federal funding are carved out.",
    citation: "Cal. Gov. Code § 12954; Cal. Lab. Code § 432.7(j)",
    effectiveDate: "2024-01-01",
    status: "Effective",
    employerAction:
      "Switch to impairment-based testing where feasible; document each safety-sensitive carve-out; retrain hiring managers on lawful-use defense.",
  },
  {
    id: "il-pay-trans-2025",
    jurisdiction: "Illinois",
    scope: "State",
    category: "Pay Transparency",
    title: "Illinois HB 3129 — pay-scale and benefits disclosure in postings",
    summary:
      "Employers with 15+ workers in Illinois must include pay scale and a general description of benefits in every job posting (including third-party listings). Employers must also keep records of postings and pay-scale rationale for five years.",
    citation: "820 ILCS 112/10 (Equal Pay Act amendments)",
    effectiveDate: "2025-01-01",
    status: "Effective",
    employerAction:
      "Update ATS posting templates with pay-scale fields; audit recruiter agency contracts; build a posting archive that survives five years.",
  },
  {
    id: "fed-eeoc-ai-2024",
    jurisdiction: "Federal",
    scope: "Federal",
    category: "AI / Algorithmic Hiring",
    title: "EEOC strategic enforcement plan — algorithmic hiring focus",
    summary:
      "EEOC's 2024-2028 plan elevates algorithmic-hiring discrimination as a priority. Expect more Section 707 pattern-or-practice charges and broader subpoena practice into vendor models and training data.",
    citation: "EEOC SEP FY 2024-2028 (89 Fed. Reg. 3,070)",
    effectiveDate: "2024-01-17",
    status: "Effective",
    employerAction:
      "Get vendor representations on training-data demographics; require model-card disclosures; preserve hiring-tool data for at least one full charge cycle.",
  },
  {
    id: "nj-creamm-wire-2025",
    jurisdiction: "New Jersey",
    scope: "State",
    category: "Cannabis",
    title: "New Jersey CRC — Workplace Impairment Recognition Expert (WIRE) regulations",
    summary:
      "Final WIRE certification rules govern the impairment-based determination that pairs with metabolite testing under CREAMM. Until WIRE programs are stood up, New Jersey employers may use existing reasonable-suspicion procedures.",
    citation: "N.J.A.C. 17:30B; CREAMM Act § 18 (N.J.S.A. § 24:6I-52)",
    effectiveDate: "2025-04-01",
    status: "Effective",
    employerAction:
      "Document a written reasonable-suspicion protocol; designate trained supervisors; sequence cannabis-test results with WIRE certification before any adverse action.",
  },
  {
    id: "nyc-ll144-2024",
    jurisdiction: "New York City",
    scope: "Municipal",
    category: "AI / Algorithmic Hiring",
    title: "NYC Local Law 144 — AEDT bias audits in force",
    summary:
      "NYC employers using automated employment decision tools must publish a third-party bias audit no older than one year and provide ten business days' notice to candidates before the tool is used. DCWP enforcement is now active with penalties of $500-$1,500 per violation per day.",
    citation: "NYC Admin. Code §§ 20-870 to 20-874",
    effectiveDate: "2023-07-05",
    status: "Effective",
    employerAction:
      "Refresh audit annually; post the audit summary on a candidate-accessible page; build candidate-notice into application flow.",
  },
];

export function legislativeUpdateCounts() {
  const cats = new Map<UpdateCategory, number>();
  LEGISLATIVE_UPDATES.forEach((u) => cats.set(u.category, (cats.get(u.category) ?? 0) + 1));
  return {
    total: LEGISLATIVE_UPDATES.length,
    federal: LEGISLATIVE_UPDATES.filter((u) => u.scope === "Federal").length,
    state: LEGISLATIVE_UPDATES.filter((u) => u.scope === "State").length,
    municipal: LEGISLATIVE_UPDATES.filter((u) => u.scope === "Municipal").length,
    effective: LEGISLATIVE_UPDATES.filter((u) => u.status === "Effective").length,
    pending: LEGISLATIVE_UPDATES.filter((u) => u.status !== "Effective").length,
    byCategory: cats,
  };
}
