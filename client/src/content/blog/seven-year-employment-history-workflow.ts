import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "seven-year-employment-history-workflow",
  title: "Seven-Year Employment History Verification: A Workflow That Actually Closes",
  metaTitle: "Seven-Year Employment History Verification Workflow 2026",
  metaDescription:
    "Seven-year employment history verification stalls without a defined workflow. Here is the 2026 process that actually closes — including unreachable-employer fallbacks.",
  excerpt:
    "Seven-year employment history verification stalls more often than any other check. Here is the 2026 workflow that actually closes — including the unreachable-employer fallback chain.",
  publishedAt: "2026-02-12",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["verification", "compliance"],
  body: `Seven-year employment history verification is the screening check most likely to stall a requisition. The candidate provides a list of employers; the CRA contacts each one; some confirm dates and titles within hours; some never respond; some respond with an "I cannot confirm or deny" stance dictated by the prior employer's HR policy; one or two come back with discrepancies the candidate didn't anticipate. Without a defined workflow, the screen sits in "in progress" status while recruiters chase status updates and candidates wonder why the offer process has stalled. Below is the 2026 workflow that actually closes.

## Why employment verification stalls

Three structural reasons.

**Prior-employer policy.** Many large employers adopt a verification-of-employment (VOE) policy that confirms only dates of employment and last position held. Some refuse to confirm anything without a signed release. Some route VOEs to a third-party verifier (The Work Number, equityview) that produces faster confirmations but only for employers participating in the platform.

**Out-of-business or merged.** A non-trivial share of employers in a 7-year history have closed, merged, been acquired, or been renamed. The records may live in a successor company's HR archive, or may be effectively unreachable.

**International components.** Employment verifications outside the U.S. require different process — language, time zone, data-protection regimes, and regulatory frameworks (GDPR, PIPEDA, others) that limit what verifiers can do without explicit candidate consent.

## The four-tier verification cascade

A defensive workflow operates a four-tier cascade for each prior employer.

### Tier 1: third-party verifier

Check whether the prior employer participates in The Work Number, equityview, or a similar verifier. If yes, run the verification through the platform. Turnaround is typically minutes to hours, and the result is treated as authoritative.

### Tier 2: HR direct

For prior employers not on a third-party platform, route the verification to the HR department of record using the contact information on file. Expectation: 1–3 business days for response. Common verifications: dates of employment, position held, eligibility for rehire (where the prior employer's policy permits).

### Tier 3: supervisor reference

Where HR direct stalls or refuses to confirm, supplement with a supervisor-named reference if the candidate has provided one. The supervisor reference is more typically scope-limited to job-performance content rather than VOE-type content, but the supervisor confirmation can satisfy the verification of dates and position when combined with secondary evidence.

### Tier 4: documentary

Where Tiers 1–3 fail, move to documentary verification: W-2s, pay stubs, tax records, or similar artifacts the candidate can provide. Documentary verification is treated as a fallback rather than a primary path because it requires candidate cooperation and produces less standardized records.

## The unreachable-employer protocol

Some prior employers in a 7-year history will not be verifiable through any of the four tiers — the company has dissolved, the records are not retrievable, the candidate has lost the W-2s. The defensive practice is to document the unreachable status and continue.

Three documentation elements: **(1)** the verification attempts made (Tier 1 lookup result, Tier 2 outreach attempts, Tier 3 supervisor reference status, Tier 4 documentary request status); **(2)** the candidate's representation as to the employment, with date ranges and position; **(3)** the resolution decision (proceed without verification, require supplementary evidence, treat as a discrepancy).

Treating an unreachable employer as a per-se disqualification is rarely appropriate. Federal Title VII disparate-impact analysis can apply if the employer's "must verify all 7 years" rule produces protected-class disparate effects, and EEOC guidance on the parallel issue with criminal-history "must verify" rules is broadly applicable. The defensive practice is to evaluate gaps individually rather than apply a blanket disqualification.

## What "discrepancy" really means

A discrepancy in employment verification is when the candidate's stated employment differs from the verification result. Common discrepancy types:

**Date discrepancy** — candidate stated "Jan 2018 – June 2022", prior employer confirms "Feb 2018 – April 2022". Whether this matters depends on the magnitude (a 1–2 month variance is common and rarely material) and the underlying reason (calendar vs fiscal year confusion, on-leave periods, exit-process timing).

**Title discrepancy** — candidate stated "Senior Software Engineer", prior employer confirms "Software Engineer" or "Software Engineer III". Title differences within a job family are common and rarely material; differences across job families warrant investigation.

**Status discrepancy** — candidate stated "left voluntarily", prior employer confirms "terminated for cause" or refuses to comment. This is the most material discrepancy category and warrants direct discussion with the candidate before any adverse decision.

The defensive practice is to flag discrepancies for review rather than auto-decision. A material discrepancy is the basis for a candidate conversation; a minor discrepancy can be documented and closed.

## The workflow's SLA

A defensive program targets a 5-business-day median for completion of seven-year employment verification, with a 95th-percentile of 10 business days. Cases beyond 10 business days are escalated to operations management for resolution decisions (proceed without verification, require additional documentation, decline).

Volumes scale with hire volume: a 1,000-hires-per-year employer with average 3 prior employers per candidate runs ~3,000 employment verifications per year. Workflow automation pays back fast at this scale.

Our [education verification process](/blog/education-verification-process), [how to run a background check on an employee](/blog/how-to-run-a-background-check-on-an-employee), and [hiring funnel screening SLA design](/blog/hiring-funnel-screening-sla-design) cover the connected pieces. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
