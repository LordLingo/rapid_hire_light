import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "adverse-action-letter-fcra-template",
  title: "The FCRA Adverse Action Letter: What It Must Say and When",
  metaTitle: "FCRA Adverse Action Letter: What It Must Say",
  metaDescription:
    "The FCRA two-step adverse action sequence is the most-litigated part of screening. Here is what each notice must contain, when to send it, and the failure modes that drive suits.",
  excerpt:
    "Adverse action notices are the most-litigated artifact in employment screening. Get the language wrong, the timing wrong, or the bundling wrong, and a $30 background check turns into a six-figure exposure.",
  publishedAt: "2026-01-08",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["fcra", "adverse-action", "compliance", "criminal-records"],
  body: `The adverse action workflow is the most-litigated artifact in employment background screening. The Fair Credit Reporting Act prescribes a two-step sequence: pause hiring, send a specific notice, wait a specific period, then send a second specific notice. A single missed element exposes the employer to statutory damages.

This guide walks through what each notice must contain, when to send it, and the failure modes that drive most enforcement actions.

## The trigger: when adverse action is "based in whole or in part" on a report

Under 15 U.S.C. §1681b(b)(3)(A), the obligation to send a pre-adverse action notice is triggered when an employer intends to take adverse action based **in whole or in part** on a consumer report. Adverse action in employment includes a refusal to hire, a refusal to promote, a reassignment to a less favorable role, or a termination.

The phrase "in whole or in part" matters. If the report is one factor among several, the obligation still attaches. The conservative posture is: if the report's contents informed the decision in any way, send the pre-adverse action notice.

## Step 1: The pre-adverse action notice

The pre-adverse action notice must be sent **before** the final decision is communicated to the candidate. Its purpose is procedural: to give the candidate a meaningful opportunity to dispute the report's accuracy or contextualize its contents. The notice must include three specific items:

- A copy of the consumer report (the actual report, not a summary)
- A copy of the FTC/CFPB *Summary of Your Rights Under the Fair Credit Reporting Act*
- A statement of the candidate's right to dispute the accuracy of the report directly with the consumer reporting agency

The FCRA does not specify a waiting period between the pre-adverse notice and the final notice, but courts and the CFPB have consistently treated **five business days** as the floor of reasonableness. Employers operating in jurisdictions with state fair-chance laws (notably California, New York City, Illinois) face longer required waiting periods. The defensible practice is to standardize on the longest applicable waiting period.

For more on the broader FCRA framework, our [FCRA compliance guide](/blog/fcra-compliance-guide) walks through the full lifecycle.

## Step 2: The final adverse action notice

After the waiting period, if the employer still intends to take adverse action, the final adverse action notice closes the workflow. Under 15 U.S.C. §1681m(a), the final notice must contain:

- A statement that the adverse action is being taken
- The name, address, and telephone number of the consumer reporting agency that prepared the report (including a toll-free number for nationwide CRAs)
- A statement that the CRA did not make the decision and is unable to provide reasons for it
- The candidate's right to obtain, free of charge, a copy of the report from the CRA within 60 days
- The candidate's right to dispute the accuracy or completeness of the report directly with the CRA

This notice is the legal close-out. It must be sent in writing — email is acceptable; verbal notice is not — and the employer must retain a copy in the candidate file along with the dated pre-adverse notice and the report.

## State-law overlays

California's ICRAA (see our [California ICRAA disclosure](/blog/california-icraa-disclosure-requirements) post) requires that a copy of any "public record" information that may have an adverse effect be provided to the candidate when the employer is considering the adverse decision. New York City's Fair Chance Act requires a written *targeted assessment* explaining why the specific record informs the specific decision, with a 5-business-day window for response. Illinois requires a similar targeted assessment.

For multi-state employers, the operational answer is to standardize on the strictest applicable rule: do the targeted assessment, do the longer waiting period, document everything in writing, and the federal floor is satisfied as a side effect.

## The four failure modes that drive most cases

Across the FCRA class actions we track, four patterns dominate.

**Bundling the pre-adverse and final adverse notices on the same day.** This is the textbook violation and shows up in almost every complaint. The pause is substantive due process, not a courtesy.

**Omitting the FCRA Summary of Rights.** The summary must be included with the pre-adverse notice. Sending the report alone is insufficient, even if the employer references the summary by URL.

**Missing or stale CRA contact information on the final notice.** The candidate has the right to obtain the report from the CRA; if the CRA's name, address, or phone number is wrong, the right is illusory.

**Treating verbal communication as notice.** Some hiring managers, in good faith, communicate the adverse decision by phone before the written final notice goes out. The written notice is the legal artifact, and it must precede the operational decision being communicated.

## What good workflow looks like

A defensible workflow is templated, dated, and bundled with the report at request time. The CRA's portal generates the pre-adverse notice when the report flags a potentially adverse finding. The waiting period is calendar-tracked. The final notice fires automatically after the waiting period if the employer confirms the decision.

See our [services page](/services) for the full screening workflow or [contact us](/contact) to talk through your sequence.`,
};
