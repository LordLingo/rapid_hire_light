import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "joint-employer-adverse-action",
  title: "Joint Employer Adverse Action: Mapping the FCRA Duties",
  metaTitle: "Joint Employer FCRA Adverse Action Duties Guide 2026",
  metaDescription:
    "Joint-employer arrangements expand FCRA adverse-action duties to multiple entities. Here is the 2026 mapping of who owes which duty in 2026.",
  excerpt:
    "Joint-employer arrangements multiply FCRA adverse-action exposure across two or more entities. Here is the 2026 mapping of who owes which duty.",
  publishedAt: "2026-03-09",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["adverse-action", "fcra", "compliance"],
  body: `Joint-employer arrangements — franchise systems, MSP/contractor staffing, certain managed-services arrangements — make multiple entities co-employers of the same workforce. Under FCRA, each joint employer that is a user of consumer reports has independent §1681b(b)(3) adverse-action duties. The mapping of duties across the joint-employer entities determines whether the program closes cleanly or generates dual-defendant litigation. Below is the 2026 mapping.

## What "joint employer" means under FCRA

Federal FCRA does not directly define joint employer. The relevant analysis borrows from Title VII, ADA, NLRA, and state employment-law joint-employer doctrines. The common test asks whether two entities each have control over essential terms of the employee's work — hiring, firing, supervision, direction, scheduling, compensation, conditions.

Several arrangements commonly produce joint-employer status: franchise systems (recent NLRB decisions have produced more nuanced analysis), staffing firm placements (end client is typically a joint employer for supervision; staffing firm is the employer of record), MSP/VMS arrangements (multiple entities may all be joint employers), and PEO arrangements (both entities typically joint employers under federal law).

Each arrangement has its own joint-employer analysis. The FCRA-user analysis layers on top.

## When each entity is an FCRA user

A joint-employer entity is an FCRA user with respect to a consumer report if:

It obtained the report directly from the CRA. It received the report from another FCRA user with explicit permission to use it for an employment decision. It uses the report to make an employment decision about the candidate.

A joint-employer entity that does not see the report and does not use it for a decision is not necessarily an FCRA user, even though it is a joint employer for other purposes. The FCRA-user analysis is narrower than the joint-employer analysis.

In the most common joint-employer fact patterns, the entity that controls the screening decision (typically the entity initiating the offer) is the FCRA-user. Other joint employers may receive a binary placement-or-no-placement signal without becoming FCRA users.

## The duty mapping

Three categories of FCRA duty matter:

### Duty 1: Permissible purpose

Each FCRA user must have permissible purpose to receive the report under §1681b. Joint-employer status does not by itself create permissible purpose. The user must independently satisfy a permissible-purpose category — typically §1681b(a)(3)(B) (employment purposes) — based on a specific employment relationship with the candidate.

Operational rule: only the joint-employer entity that has a specific employment relationship with the candidate at the time of the report should receive the report. Other joint employers that don't have that specific relationship should not be FCRA users.

### Duty 2: Pre-adverse-action notice and dispute window

Each FCRA user that takes adverse action based on the report must run the §1681b(b)(3)(A) sequence — pre-adverse-action notice, report copy, FCRA Summary of Rights, dispute window — independently.

In joint-employer arrangements where two entities both take adverse action (a franchise system where both the franchisor and franchisee decline a placement), both entities must run the sequence. This is the failure pattern with the highest litigation exposure.

The defensible practice is to allocate the adverse-action role to a single entity by contract. The other joint employer takes "no action" — neither approving nor denying — and lets the assigned entity's decision control. This avoids dual sequences while preserving the underlying employment decision.

### Duty 3: Final adverse-action notice

The §1681b(b)(3)(B) final adverse-action notice issues from the FCRA-user that took the adverse action. The notice contains the CRA contact information, the consumer's right to dispute under §1681i, and the consumer's right to a free report copy.

In joint-employer arrangements, only the FCRA-user that took the documented adverse action should send the final notice. Other joint employers that participated in the arrangement but did not take the documented adverse action should not issue the notice.

## State-overlay layering

Joint-employer arrangements layer state-overlay timing and content on top of the federal duties. Three operational rules:

**Apply the role-location framework.** California, NYC, Illinois, and other state-specific overlays apply based on the role's location regardless of joint-employer geography. A NYC-located placement triggers NYC Fair Chance Act regardless of where the staffing firm or franchisor is headquartered.

**Apply the longer-window rule.** Where two or more state overlays could apply (e.g., a remote role with the candidate in California and the end client in NYC), apply the more favorable framework for the candidate. This typically means California's eight-factor analysis with five-plus-five-day windows.

**Document the controlling rule.** The requisition record should document which jurisdiction's rules controlled the analysis.

## The contract clause that resolves most issues

A joint-employer contract clause that allocates FCRA duties cleanly typically includes:

A primary FCRA-user designation — one entity is identified as the entity that orders the report, receives it, and runs the sequence. Other entities receive only binary signals. A non-FCRA-user representation — the other joint employers represent that they will not request, use, or rely on the report content. An indemnity for FCRA exposure — the primary entity indemnifies the others for FCRA claims arising from the primary's process. A state-overlay allocation — the primary entity is responsible for applying state-specific overlays.

The clause makes the FCRA exposure predictable. Without it, joint-employer FCRA exposure tends to fall on whichever entity has the deepest pockets when a class action surfaces.

Our [contingent workforce screening operations](/blog/contingent-workforce-screening-operations), [adverse action for contingent workers](/blog/adverse-action-contingent-workers), and [adverse action letter template](/blog/adverse-action-letter-fcra-template) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
