import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "hiring-funnel-screening-sla-design",
  title: "Hiring Funnel Screening SLAs: How to Set Times That Hold",
  metaTitle: "Hiring Funnel Screening SLA Design Guide 2026",
  metaDescription:
    "A defensible screening SLA needs realistic medians, defined exception paths, and explicit FCRA coordination. Here is how to build one that holds in 2026.",
  excerpt:
    "Screening SLAs that compress hiring without breaking FCRA timing live in a narrow band. Here is how to set medians, exception paths, and fail-safe escalation.",
  publishedAt: "2026-02-23",
  readingMinutes: 5,
  author: "Rapid Hire Operations Team",
  tags: ["operations", "candidate-experience", "compliance"],
  body: `Most operations teams set their background-screening SLA the wrong way. They look at the vendor's quoted average turnaround, subtract a buffer, and publish the resulting number to the recruiter org and the candidate-facing portal. The promise lands cleanly in the 80th-percentile case, lands in court in the 99th-percentile case, and produces a steady stream of recruiter escalations everywhere in between. Below is the SLA design that holds — including the parts that compress the funnel without breaking FCRA timing.

## Three SLA layers

A hiring funnel SLA has three layers, not one. **Layer 1: vendor production SLA** — how long the CRA needs to deliver a result. **Layer 2: internal handoff SLA** — how long the employer needs to clear the result and update the requisition. **Layer 3: candidate-facing SLA** — what the candidate experiences end-to-end. A defensible program calibrates all three independently and ties the candidate-facing number to actual measured performance, not vendor marketing.

## Vendor production SLA

The CRA's quoted production time depends on report scope and jurisdiction. For a typical SMB screen — federal/state criminal in two jurisdictions, sex-offender registry, SSN trace, MVR — the production median runs 24–48 hours, with a 95th-percentile tail of 5–7 business days driven by court delays in slow jurisdictions. For more complex scopes — multi-state criminal, education and employment verifications, professional license, civil-records search — medians shift to 3–5 business days with tails up to 10 business days.

Two operational rules. **(1)** Build vendor SLAs around 95th-percentile performance, not median. **(2)** Define which jurisdictions and which report types are excluded from the SLA at vendor selection. The vendor's SLA almost always carves out "court delays beyond CRA control"; the carve-out covers a meaningful share of actual escalations.

## Internal handoff SLA

The internal piece is where employer-side process delay accumulates. Three sub-SLAs:

**Adverse-content review.** Result lands with adverse content (criminal hit, license discrepancy, MVR issue). The employer's adverse-content review must complete within a window that allows pre-adverse-action notice and the FCRA-required dispute window without the requisition timing out. Typical SLA: 1 business day from result to adverse-content review decision.

**Escalation path.** Adverse-content reviews that require legal or compliance input (California Fair Chance Act multi-factor analysis, NYC Article 23-A analysis, ADA direct-threat consideration) need an escalation SLA with named owners. Typical SLA: 3 business days from review-required flag to escalation outcome.

**Documentation.** The result, the review, and the decision must be documented in the requisition record before the offer-or-decline communication. Typical SLA: same business day as the decision.

## Candidate-facing SLA

The candidate-facing SLA is what the candidate experiences. Three components:

**Initial-result delivery.** The candidate sees confirmation that the screen has been ordered, status updates as the screen progresses, and the final result. The SLA here is operational: the candidate sees status updates within 24 hours of any state change.

**Pre-adverse-action timing.** The candidate receives the pre-adverse-action notice with the report and Summary of Rights, with a clear deadline for dispute submissions. FCRA requires "a reasonable opportunity"; the consensus floor is **5 business days**, and California Civil Code §1786.22 read alongside §1786.16 has been interpreted to require a similar window.

**Adverse-action notice.** The candidate receives the adverse-action notice promptly after the dispute window closes without a successful dispute, with all FCRA-required contents.

The candidate-facing SLA should commit to the higher of: vendor production median + internal handoff median, or 7 business days. Below 7 days the program risks compressing the FCRA dispute window in a way courts have called insufficient.

## The exception path

Every SLA needs an exception path. The four most common:

**Court delay.** The CRA cannot complete a court check because the court system is offline, the court charges per-record fees the CRA must collect, or the court requires manual retrieval. Typical resolution: candidate notification, vendor escalation, alternative-jurisdiction supplementation.

**Missing data.** SSN trace returns multiple addresses or unrelated SSN history. Typical resolution: candidate verification request, fresh SSN trace, documentation of resolution.

**Disputed report.** Candidate disputes the report content during pre-adverse-action window. Typical resolution: vendor reinvestigation under FCRA §1681i, hold on adverse decision pending reinvestigation outcome.

**Reasonable accommodation.** Candidate requests reasonable accommodation under ADA related to a screen result (medical-history follow-up, disability documentation). Typical resolution: ADA interactive process under our [ADA interactive accommodation process](/blog/ada-interactive-accommodation-process).

Each exception has a defined owner, a defined resolution path, and a defined time-out behavior if the path stalls.

## Measuring and revising

The defensive operations team measures three KPIs monthly: vendor-production median and 95th-percentile, internal-handoff median, candidate-facing median. Drift in any of the three triggers a workflow review. Drift in the 95th-percentile is the most common signal of brewing class-action risk because outlier candidates are the ones most likely to file.

Our [continuous monitoring vs annual rescreening](/blog/continuous-monitoring-vs-annual-rescreening), [adverse action letter template](/blog/adverse-action-letter-fcra-template), and [bulk rescreen workflow](/blog/bulk-rescreen-workflow-design) cover the connected pieces. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
