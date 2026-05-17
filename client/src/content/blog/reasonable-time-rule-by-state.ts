import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "reasonable-time-rule-by-state",
  title: "FCRA Reasonable Time by State: A Pre-Adverse-Action Reference Table",
  metaTitle: "FCRA Pre-Adverse Action Reasonable Time by State 2026",
  metaDescription:
    "FCRA's 'reasonable period' floor varies by state, with several jurisdictions imposing specific timelines. Here is the 2026 state-by-state reference table.",
  excerpt:
    "FCRA's pre-adverse-action 'reasonable period' floor varies meaningfully by state. Here is the 2026 state-by-state reference table for multi-state programs.",
  publishedAt: "2026-03-11",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["adverse-action", "fcra", "compliance"],
  body: `Federal FCRA §1681b(b)(3)(A) requires the employer to provide a "reasonable" period between pre-adverse-action notice and adverse-action notice. The federal floor — five business days — is the consensus interpretation in most circuits. State and city laws layer specific timelines on top, and the variations matter for any multi-state employer. Below is the 2026 state-by-state reference table.

## Federal floor

**Five business days from documented receipt of the pre-adverse-action notice**, with the report copy and FCRA Summary of Rights attached.

The federal floor is the floor for most states that have not enacted additional specific timing rules. Jurisdictions that have enacted additional rules apply those rules in addition to (and in the case of conflict, instead of) the federal floor.

## State-specific overlays

The following states and cities have enacted specific overlays that affect pre-adverse-action timing for criminal-history-based decisions:

### California

**California Fair Chance Act, Cal. Gov't Code §12952.** Five business days from receipt for the candidate to challenge the accuracy of the conviction information. If the candidate identifies an inaccuracy within those five days, an additional five business days must be provided for the candidate to provide additional information correcting the inaccuracy.

The Fair Chance Act also requires an individualized assessment under the eight-factor framework before any adverse decision. The five-day window is for accuracy challenges; the individualized assessment process operates separately.

### Connecticut

**Conn. Gen. Stat. §31-51i.** Specific notice content for criminal-history-based decisions. The Connecticut window is the federal-floor window unless the underlying offense triggers additional state-specific procedures.

### District of Columbia

**Fair Criminal Record Screening Amendment Act of 2014 (D.C. Law 20-185).** Notice and individualized-assessment requirements. Specific timing for the candidate's response is set at the seven-business-day window (longer than federal).

### Illinois

**Illinois Human Rights Act §103(I).** Interactive analysis required for criminal-record-based decisions. Specific timing for the interactive process is not statutorily set but the practice is at least the federal-floor window.

### Massachusetts

**Mass. Gen. Laws c. 151B §4(9C).** Defined steps and timelines for handling criminal-history-based adverse-action sequences. Specific timing for candidate response is set at the federal-floor window plus a defined extension for additional information.

### New Jersey

**Opportunity to Compete Act, N.J.S.A. 34:6B-11 et seq.** Defined requirements for criminal-history inquiries and decisions. Timing for candidate response is the federal-floor window.

### New York City

**NYC Fair Chance Act, N.Y.C. Admin. Code §8-107(11-a).** Three business days for the candidate to respond to the determination that adverse action will be based on conviction information. The three-day window is shorter than the federal floor; multi-state employers operating in NYC must apply the NYC-specific timing.

The NYC analysis also requires an Article 23-A multi-factor assessment under N.Y. Correction Law §752 et seq. Our [Article 23-A multi-factor analysis post](/blog/nyc-article-23a-multi-factor-analysis) covers the substantive analysis in depth.

### New York State

**Article 23-A.** New York Correction Law §752 et seq. operates statewide for criminal-history-based decisions. The substantive analysis is the same eight-factor framework that applies under NYC Fair Chance Act, but the timing is different in NYC vs the rest of New York State. Outside NYC, the federal-floor timing typically applies.

### Pennsylvania (Philadelphia)

**Philadelphia Fair Criminal Record Screening Standards, Phila. Code §9-3500 et seq.** Ten business days for the candidate to respond, longer than the federal floor.

### Vermont

**Vermont Fair Employment Practices Act, 21 V.S.A. §495j.** Federal-floor timing with additional substantive requirements.

### Washington

**Washington Fair Chance Act, Wash. Rev. Code §49.94.010 et seq.** Federal-floor timing with additional substantive requirements.

### Westchester County (NY)

**Westchester County Fair Chance to Work Act.** Federal-floor timing plus the multi-factor assessment requirement. Our [Westchester County Fair Chance Act post](/blog/westchester-county-fair-chance-act) covers the substantive details.

## How to operate the multi-state matrix

Three operational rules:

**Identify the role's controlling jurisdiction.** The role's location typically controls. For remote roles, the candidate's location controls; some employers also apply the employer's headquarters jurisdiction as a backup.

**Apply the longer window.** When two or more frameworks apply (federal, state, city), apply the longer of the applicable windows. A NYC role triggers federal (5 business days) and NYC (3 business days) — apply 5 business days because that is the longer window. A California role triggers federal (5 business days) and California (5 + 5 days for accuracy challenge) — operate the California flow.

**Document the controlling rule.** The requisition record should document which jurisdiction's rules control and what timing is being applied. The documentation supports both regulatory defense and litigation defense.

## What this fixes

The reference table above lets a multi-state program apply correct timing per role rather than defaulting to federal-only timing. The defaulting failure pattern is the single largest source of state-overlay non-compliance: a program operating uniformly at five federal business days misses the California ten-business-day overlay, the Philadelphia ten-business-day rule, and the California-specific accuracy-challenge extension.

The fix is jurisdiction routing in the adverse-action workflow. The CRA can supply the role-location data; the employer's HRIS holds the role's job description with location; the workflow applies the matrix above to determine the correct timing and applies the correct state-specific notice content.

Our [pre-adverse five business day clock](/blog/pre-adverse-five-business-day-clock), [individualized assessment letter template](/blog/individualized-assessment-letter-template), and [Article 23-A multi-factor analysis](/blog/nyc-article-23a-multi-factor-analysis) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
