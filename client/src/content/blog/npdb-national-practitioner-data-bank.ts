import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "npdb-national-practitioner-data-bank",
  title: "NPDB Queries and Reports: A Hospital Practitioner Screening Guide",
  metaTitle: "NPDB National Practitioner Data Bank Guide 2026",
  metaDescription:
    "The National Practitioner Data Bank captures malpractice payments and adverse actions on US healthcare practitioners. Here is the 2026 hospital query and report duty playbook.",
  excerpt:
    "The National Practitioner Data Bank captures malpractice payments and adverse actions on every US healthcare practitioner. Here is what hospitals must query, when, and how to handle results that surface adverse history.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["healthcare", "verification", "compliance"],
  body: `The **National Practitioner Data Bank (NPDB)** is the federal repository that aggregates malpractice payments, adverse licensure actions, adverse hospital-privilege actions, and federal exclusions affecting US healthcare practitioners. Established by the Health Care Quality Improvement Act of 1986 (42 U.S.C. §11101 et seq.) and operated by HHS, NPDB serves as the master record that hospitals must query when credentialing or reappointing any licensed practitioner. The query duty is federal, the underlying reports are mandatory, and a hospital that fails to query at the required intervals faces both Joint Commission findings and CMS validation deficiencies. Here is the 2026 query and report playbook.

## The federal query duty

Hospitals are required to query NPDB **at three points** for every applicable practitioner:

- At **initial credentialing**, before granting privileges
- Every **two years** at reappointment, regardless of any intervening review
- At the time of **any clinical privilege decision** outside the regular reappointment cycle (granting new privileges, expanding scope, taking summary suspension action)

The duty applies to "physicians, dentists, and other healthcare practitioners" as defined in 42 C.F.R. §60.3 — a broad category that includes physicians, dentists, podiatrists, advanced practice registered nurses, physician assistants, and several allied health professions where state law requires hospital privileging. The query is performed through the [NPDB Insight](https://www.npdb.hrsa.gov/) federal portal using the practitioner's identifying information.

A hospital that does not query at the required intervals is in violation of both the Health Care Quality Improvement Act and Joint Commission MS standards. The violation is not curable by retroactive query — the duty is contemporaneous to the credentialing decision.

## What NPDB reports cover

The data bank captures four report categories. **Medical malpractice payments**: any payment made on behalf of a practitioner to satisfy a medical malpractice claim or judgment, regardless of how minimal. **Adverse licensure actions**: state medical board, dental board, and other licensing-board actions including license revocation, suspension, surrender, and any limitation on the practitioner's license. **Adverse clinical privilege actions**: hospital actions taken against a practitioner that exceed thirty days, including denial, revocation, suspension, restriction, and termination. **Adverse professional society actions**: actions taken by professional societies that affect the practitioner's membership. The data bank also captures DEA actions, Medicare/Medicaid exclusions (which cross-reference to the [OIG LEIE](/blog/cms-exclusion-screening-oig-leie-sam)), and judgments under specified federal healthcare programs.

The granularity is deep. A 1996 \\$5,000 nuisance malpractice settlement is in the data bank thirty years later, and the hospital reviewing the record sees the same data that any other querying entity sees.

## Hospital reporting duties

Hospitals are also **reporters** to NPDB, not just queriers. The reporting duty (42 C.F.R. §60.12) requires hospitals to report:

- Adverse clinical privilege actions taken against a physician or dentist that adversely affect privileges for more than thirty days
- A physician or dentist's voluntary surrender of clinical privileges while under investigation, in lieu of investigation, or in return for not conducting an investigation
- Any decision by the hospital to deny, revoke, restrict, suspend, or terminate clinical privileges of a physician or dentist as a result of the practitioner's professional competence or conduct

The reporting duty triggers in fifteen days from the action. A hospital that fails to report can lose immunity under the Health Care Quality Improvement Act for its peer review activities.

## How NPDB results surface in screening

NPDB results return as a formal report identifying matched records. A clean record returns "no information on file"; otherwise, the full report content surfaces for each match.

Adjudicating an NPDB hit requires care. The data bank captures **adverse actions and payments**, not necessarily adverse outcomes. A nuisance settlement on a defended malpractice claim appears on the bank but tells the credentialing committee almost nothing about clinical competence. A pattern of multiple settlements over a short period across similar clinical scenarios is a red flag the credentials committee should investigate. The adjudication standard is **whether the practitioner is competent and ethical to perform the requested privileges**, not whether the practitioner has an entirely clean record.

The credentialing committee's adjudication should be documented in the credentialing file: the report content, the committee's analysis, the practitioner's response if any, the committee's recommendation, and the board's decision. A surveyor reviewing the credentialing file sees the entire reasoning chain.

## NPDB self-queries

Practitioners can run **self-queries** to see what is on file, and several state medical boards now require self-queries as part of license renewal. Hospitals can ask candidates to provide a current self-query at the time of application, which speeds the credentialing committee's work and gives the practitioner an opportunity to provide context on adverse reports before they hit the formal review.

A self-query is not a substitute for the hospital's own query. The hospital must query directly under its own facility identifier, and the self-query merely accelerates the practitioner's response to anything the hospital query surfaces.

## Cost and integration

NPDB queries cost \\$2.50 each as of 2026. The **Continuous Query Service** subscription (\\$3.25 per practitioner per year) provides automated notifications of new reports — how most large hospital systems satisfy the "any clinical privilege decision" duty efficiently.

A defensible 2026 program: NPDB query at initial credentialing, Continuous Query Service enrollment, formal NPDB query at every reappointment, and prompt reporting of qualifying adverse action. Our [healthcare industry brief](/industries/healthcare) covers the full stack.`,
};
