import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "sam-gov-exclusion-check-workflow",
  title: "SAM.gov Exclusion Check Workflow: A Federal Contractor Playbook",
  metaTitle: "SAM.gov Exclusion Check Workflow Guide 2026",
  metaDescription:
    "SAM.gov is the federal exclusion list for procurement and healthcare contractors. Here is the workflow, FAR §52.209-6 duty, and 2026 audit posture.",
  excerpt:
    "SAM.gov is the federal exclusion repository for procurement, contracting, and healthcare. This is the workflow, the FAR clauses that govern it, and the audit posture that survives scrutiny.",
  publishedAt: "2026-05-15",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["sanctions", "compliance"],
  body: `**SAM.gov** — the System for Award Management — is the federal government's master exclusion list for entities and individuals barred from receiving federal contracts, grants, or assistance. Federal contractors are required to screen against it under FAR §52.209-6 ("Protecting the Government's Interests When Subcontracting With Contractors Debarred, Suspended, or Proposed for Debarment"). Healthcare providers are required to screen against it under CMS State Medicaid Director Letter 09-001 because exclusions imposed by HHS, FDA, OFAC, and DOJ surface in SAM even when they do not appear in the OIG LEIE. The mechanics of the SAM.gov check are simple. Defensible documentation of the check is where most programs break.

## What SAM.gov actually contains

The SAM.gov exclusion record is a consolidation of several federal lists, including the GSA debarment list, the OIG LEIE (with overlap), OFAC's Specially Designated Nationals (SDN) list, the FDA debarment list, the EPA debarment list, the HUD Limited Denial of Participation list, and dozens of agency-specific records. Each record carries the **Cause and Treatment Code (CT Code)**, **agency**, **exclusion type**, **effective date**, and (where applicable) **termination date**. The CT codes are the diagnostic field — a "TT" code signals a terrorism-related exclusion under OFAC, while "WW" signals a Buy American Act violation, and the response from the contractor differs significantly between the two.

## When the screening duty triggers

There are three trigger points contractors miss most often:

The first is **at proposal**. A prime contractor proposing on a federal contract with a value above the simplified acquisition threshold must certify under FAR §52.209-5 that the contractor and any of its principals are not on the SAM exclusion list. The certification is sworn at proposal submission, not at award.

The second is **at first-tier subcontract**. FAR §52.209-6 requires the prime to screen any first-tier subcontractor with a subcontract value of \\$35,000 or more **before award** and to maintain documentation of the screen. The prime cannot delegate this duty downstream.

The third is **at modification or option exercise**. Each modification that incrementally funds a contract above the original ceiling can re-trigger the screen. A clean check at original award does not insulate the contractor from a finding if a subcontractor is added to SAM mid-performance and the contractor exercises an option without re-screening.

## The workflow

A defensible workflow has six steps. **(1) Pre-award screen** of the contractor and all named principals using SAM.gov's free search. **(2) Capture** of the SAM record number and the date/time of the search as a contemporaneous PDF or screenshot. **(3) Subcontractor screen** before any first-tier subcontract issuance, with the same capture. **(4) Monthly re-screen** during contract performance against all subcontractors and named principals. The monthly cadence is not in the FAR — it is the OIG and DCAA expectation when a CMS or DCAA audit lands. **(5) Match adjudication** with documentation of identifier fields and basis for the conclusion. **(6) Annual program review** to confirm the workflow remains active after staff turnover.

Most government contractors automate steps 2–4 through a vendor that ingests the SAM bulk extract daily, normalizes the identifier fields, and pushes hits into a contractor-of-record workflow tool.

## The audit posture that survives scrutiny

DCAA and OIG auditors do not test whether a contractor *runs* SAM.gov searches — they test whether the contractor can **prove** it ran them on the right dates against the right entities with the right adjudication. The three audit failure modes:

The first is **bare-search documentation**. The contractor produces an emailed text confirmation that "no record found" but cannot produce the contemporaneous identifier fields used or the date/time of the search. This is treated as no documentation.

The second is **missing principals**. The screen covered the entity but not the named principals — the CEO, CFO, and beneficial owners — even though FAR §52.209-5 requires both. Auditors look for the specific principal names captured in the search log, not just the entity DUNS/UEI.

The third is **stale screens**. The screen was run at award but never re-run during performance. The contractor's only defense is the contract clause and a documented program; if the program was paused mid-performance during a staffing transition, the contractor is exposed for everything that happened during the gap.

## Cost and tooling

SAM.gov itself is free. The cost of a defensible program is staff time and audit-grade documentation infrastructure. Most contractors with five or more first-tier subcontractors find that an automated sanctions-monitoring service pays for itself within twelve months relative to the cost of staff time and audit-defense exposure. Our [healthcare exclusion playbook](/blog/cms-exclusion-screening-oig-leie-sam) and [state Medicaid map](/blog/state-medicaid-exclusion-lists-by-state) cover the parallel obligations on the healthcare side, and our [services](/services) and [pricing](/pricing) pages cover the bundled SAM/LEIE/state monitoring product. For a workflow conversation start at [contact](/contact).`,
};
