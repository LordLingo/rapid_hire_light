import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fcra-611-dispute-reinvestigation",
  title:
    "FCRA §611 Reinvestigation: How Background Check Disputes Get Resolved",
  metaTitle: "FCRA 611 Dispute Reinvestigation Guide",
  metaDescription:
    "FCRA §611 gives candidates a 30-day reinvestigation right when they dispute a CRA file. Here is the 2026 employer playbook for the reinvestigation flow and the hold-decision rule.",
  excerpt:
    "When a candidate disputes a record on a background check, FCRA §611 imposes a 30-day reinvestigation duty on the CRA — and a procedural duty on the employer to hold the hiring decision. Here is the 2026 playbook for both sides.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["fcra", "compliance", "candidate-experience"],
  body: `When a candidate identifies a record on a background check that they believe is inaccurate, incomplete, or no longer reportable, **FCRA §611** (15 U.S.C. §1681i) is the statutory mechanism that resolves the dispute. The section imposes a 30-day reinvestigation duty on the consumer reporting agency, a notification duty on the original source ("furnisher") under §623, and an implicit procedural duty on the employer to hold the hiring decision while the reinvestigation runs. This guide walks through how §611 actually works in 2026 and what employers should do at each step.

## The 30-day reinvestigation clock

§611(a)(1) requires the CRA, on receipt of a consumer dispute, to conduct a reasonable reinvestigation free of charge to determine whether the disputed information is inaccurate. The reinvestigation must complete within **30 days** of the dispute notice (extended to 45 days if the consumer provides additional supporting information during the reinvestigation period). During the reinvestigation, the CRA must:

1. Forward the dispute and any supporting documents to the original furnisher within 5 business days under §611(a)(2)
2. Consider all relevant information the consumer submits under §611(a)(4)
3. Either correct, delete, or verify the disputed item under §611(a)(5)(A)
4. Notify the consumer of the outcome within 5 business days of the reinvestigation's completion under §611(a)(6)

If the reinvestigation results in a deletion or correction, the CRA must furnish a corrected report to anyone who received the original report within the past two years for employment purposes (or six months for any other purpose) at no charge to the consumer. For how the disputed file gets to the consumer in the first place, see our companion guide on the [§609 consumer file disclosure](/blog/fcra-609-consumer-file-disclosure).

## The furnisher's parallel duty under §623

§623 (15 U.S.C. §1681s-2) imposes a parallel duty on the entity that originally provided the disputed information to the CRA — the courthouse, the prior employer, the school, the credit issuer. Once the CRA forwards a dispute to the furnisher, §623(b) requires the furnisher to:

- Conduct its own investigation of the disputed information
- Review all information the CRA forwards
- Report the results back to the CRA
- If the information is inaccurate, notify all CRAs to which the furnisher reported the same information

The §623 furnisher duty is private-right-of-action enforceable: a consumer who can show a furnisher failed to investigate a §611-forwarded dispute can sue the furnisher directly under §616. This is one of the FCRA's most under-used provisions, and one of the most important — the furnisher is often the only party that can correct the underlying record.

## What employers should do during a §611 dispute

The employer's posture during a §611 reinvestigation should be procedural and consistent. When a candidate raises a dispute during the pre-adverse-action window (the five business days between the §604(b)(3) pre-adverse-action notice and the §615 final notice — see our [adverse action letter template](/blog/adverse-action-letter-fcra-template)), the employer should put the hiring decision on hold pending the CRA's reinvestigation outcome.

Three procedural facts matter. First, the FCRA does not technically require the employer to wait — but waiting is the safe posture, and several state laws (California, Massachusetts, others) impose state-law duties that are stricter than the federal floor. Second, the employer should not re-run the report during the dispute window; doing so creates a second pre-adverse-action obligation if the new report is also adverse. Third, the employer should document the candidate's dispute, the hold decision, and the CRA's eventual outcome in the candidate file — this paper trail is the single best §616 willfulness defense.

If the CRA's reinvestigation deletes or corrects the disputed item, the employer typically retracts the pre-adverse-action notice and re-evaluates based on the corrected record. If the reinvestigation verifies the disputed item, the employer can finalize adverse action under §615 with a fresh certified-mail notice and a fresh five-day clock. For the §615 notice mechanics see the same template guide above.

## The "frivolous or irrelevant" exception

§611(a)(3) lets the CRA terminate a reinvestigation it reasonably determines is **frivolous or irrelevant**, provided the CRA notifies the consumer within five business days and identifies what additional information would let the dispute proceed. This exception is narrow. Courts have consistently held that a dispute supported by any documentary evidence (a court order showing dismissal, a final judgment showing reversal, an expungement order) is not frivolous. CRAs that rely on the §611(a)(3) exception too aggressively are the ones that end up in willfulness litigation.

## What we recommend for 2026

Build a §611-aware pre-adverse-action workflow. The moment a candidate references a dispute, file, reinvestigation, or §609 disclosure, the system should auto-hold the hiring decision and route the case to a compliance reviewer. Pick a CRA that publishes its 30-day reinvestigation SLA, exposes a candidate-facing dispute portal, and contacts furnishers within the §611(a)(2) five-business-day window. For our take on candidate-experience tooling, see [our candidate page](/candidates) and [request a quote](/contact).`,
};
