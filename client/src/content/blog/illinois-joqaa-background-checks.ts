import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "illinois-joqaa-background-checks",
  title:
    "Illinois JOQAA: A 2026 Background Check Compliance Guide for Employers",
  metaTitle: "Illinois JOQAA Background Check Guide 2026",
  metaDescription:
    "Illinois' Job Opportunities for Qualified Applicants Act (820 ILCS 75) governs when employers can ask about criminal history. The 2026 compliance playbook.",
  excerpt:
    "Illinois' Job Opportunities for Qualified Applicants Act sets the timing rule for when an employer can ask about criminal history, and a 2021 amendment to the Illinois Human Rights Act adds a federal-style multi-factor analysis on top. Here is the 2026 compliance playbook.",
  publishedAt: "2026-04-07",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["illinois", "fair-chance", "compliance"],
  body: `Illinois has two overlapping fair-chance statutes that together create one of the more demanding hiring regimes in the Midwest. The first is the **Job Opportunities for Qualified Applicants Act (JOQAA)**, codified at 820 ILCS 75, which governs **when** an employer is allowed to ask about criminal history. The second is the 2021 amendment to the **Illinois Human Rights Act (IHRA)** at 775 ILCS 5/2-103.1, which governs **how** an employer is allowed to use a conviction record once it has one. Compliance teams that focus on JOQAA's timing rule and miss the IHRA's substantive analysis end up violating Illinois law even when the front-end paperwork looks clean.

This guide walks through what each statute requires in 2026, where the two laws interact, and how to wire compliance into a hiring workflow that does not depend on individual hiring managers remembering the rules.

## What JOQAA actually prohibits

JOQAA applies to private employers with 15 or more employees and to all employment agencies operating in Illinois. The core rule is straightforward: the employer cannot inquire into, consider, or require disclosure of an applicant's criminal record until **either** the applicant has been determined qualified for the position and notified that they have been selected for an interview, **or** — if there is no interview — a conditional offer of employment has been extended. That includes the application form, screening calls, recruiter database queries, third-party assessment vendors, and any informal Google search a hiring manager runs from a personal device.

The statute carves out narrow exceptions for positions that legally require an employer to exclude candidates with certain criminal histories (for example, financial roles regulated under federal banking law, or positions covered by occupational-licensing statutes that bar certain offenses). The exception is read narrowly. If the position is "trustworthy" or "fiduciary" in a generic sense, that is not a JOQAA exemption. The Illinois Department of Labor enforces the statute, with civil penalties that escalate from \\$500 for a first violation to \\$1,500 for repeat violations within a five-year window. Multiple violations at the same workplace are counted separately.

For the federal layer that operates in parallel, our [EEOC ban-the-box compliance guide](/blog/eeoc-ban-the-box-compliance) explains the EEOC's 2012 Enforcement Guidance and its individualized-assessment expectation.

## The 2021 IHRA amendment

The piece most employers miss is the 2021 amendment to the Illinois Human Rights Act, which makes use of a conviction record an unlawful civil-rights violation **unless** the employer first conducts a multi-factor analysis. The factors track the EEOC's 2012 Guidance closely: the bearing of the conviction on the candidate's fitness for the specific position, the time elapsed since the offense, the nature and gravity of the offense, the candidate's age at the time, evidence of rehabilitation, and the public-policy interest in second-chance hiring. The analysis is required to be **documented in writing** and kept in the candidate's file before any adverse decision is communicated.

In practice, the IHRA layer means that a JOQAA-compliant timing rule alone is not enough. An employer that legally orders a background check after the conditional offer can still violate Illinois law if it relies on the conviction without performing and documenting the multi-factor analysis. A blanket "no felonies in the last seven years" cutoff, common in legacy ATS rules, fails the IHRA analysis on its face. For deeper context on the timing/substance split, our piece on [ban-the-box and fair-chance hiring](/blog/ban-the-box-fair-chance-hiring) walks through how the same dynamic plays out in other states.

## The notice and consultation requirements

If the IHRA analysis comes out against the candidate, the employer is required to send a written **preliminary notice** that identifies the specific conviction(s) being relied on, includes a copy of the consumer report, and explains the candidate's right to respond. The employer must then give the candidate at least **five business days** to respond with evidence of inaccuracy, evidence of rehabilitation, or context the employer should weigh. Only after the response window closes — and only after a documented final review — may the employer issue a final adverse-action notice.

This Illinois timing layers on top of the federal FCRA pre-adverse-action and final adverse-action sequence. Combining them on the same day is the textbook violation. Our [adverse-action letter template guide](/blog/adverse-action-letter-fcra-template) walks through the FCRA timing and shows where the Illinois five-day window has to be inserted.

## What we recommend for 2026

Audit every Illinois candidate touchpoint for criminal-history questions and remove them from anything that runs before the qualification or conditional-offer milestone. Build the IHRA multi-factor analysis into the adverse-action workflow as a required field, not an optional one. Standardize on a five-business-day Illinois preliminary-notice response window and treat it as additive to, not coterminous with, the FCRA pre-adverse-action waiting period. Train hiring managers, in writing, once a year, on the difference between the JOQAA timing rule and the IHRA substantive analysis — they are different statutes, with different agencies enforcing them, and that is where employers get sued.

Rapid Hire's Illinois workflow ships with the IHRA multi-factor analysis prompt and the preliminary-notice template wired into the same lane as the candidate report. To see how it fits your process, [view pricing](/pricing) or [talk to a specialist](/contact).`,
};
