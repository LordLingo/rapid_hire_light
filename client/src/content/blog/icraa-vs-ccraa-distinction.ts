import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "icraa-vs-ccraa-distinction",
  title: "ICRAA vs CCRAA: California's Two Consumer-Reporting Statutes Explained",
  metaTitle: "ICRAA vs CCRAA Difference Employer Guide 2026",
  metaDescription:
    "California has two consumer-reporting statutes — ICRAA and CCRAA. Here is the precise distinction and what employers must do under each in 2026.",
  excerpt:
    "California operates two parallel consumer-reporting statutes — ICRAA and CCRAA. Here is the precise distinction and the employer duties under each.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["icraa", "california", "compliance"],
  body: `California regulates background reports through two parallel statutes. The **Investigative Consumer Reporting Agencies Act (ICRAA)** at Civil Code §§1786 et seq. governs investigative consumer reports — the category covering criminal history, civil records, and other character/reputation/mode-of-living content. The **Consumer Credit Reporting Agencies Act (CCRAA)** at Civil Code §§1785 et seq. governs credit-bureau reports. The distinction matters because each statute imposes a separate set of disclosure, procedural, and substantive duties, and reports that include both kinds of content trigger both statutes simultaneously. Below is the 2026 employer guide to the distinction.

## What CCRAA covers

The CCRAA applies to "consumer credit reports" — defined in §1785.3(c) as written, oral, or other communication of information by a consumer credit reporting agency bearing on a consumer's credit worthiness, credit standing, or credit capacity that is used or expected to be used as a factor in establishing the consumer's eligibility for any of various consumer transactions, including employment.

Practically, the CCRAA governs the credit-bureau report — the kind of report Equifax, Experian, and TransUnion produce. It does not govern criminal-history reports, civil-records reports, or character/reputation content; those fall under ICRAA.

Key CCRAA duties for employer use:

**Authorization and notice.** §1785.20.5 requires written authorization from the consumer before a credit-bureau report can be obtained for employment purposes. The authorization must include specific contents and procedural elements.

**Report use restrictions.** California Labor Code §1024.5, enacted by AB 22 in 2011, restricts employer use of consumer credit reports to specific position categories: managerial positions, positions in the Department of Justice, sworn law-enforcement positions, positions handling cash or checks of \\$10,000 or more, signatory authority over employer financial accounts, regular access to specified personal information, and a few others. For positions outside the AB 22 enumerated categories, an employer may not obtain a credit report for employment purposes regardless of consumer consent.

**Adverse action.** §1785.20.5 imposes adverse-action procedural duties on credit-report-based employment decisions, parallel to but separate from FCRA §615 duties.

## What ICRAA covers

ICRAA applies to "investigative consumer reports" — defined in §1786.2(c), as discussed in our [ICRAA definition post](/blog/icraa-investigative-consumer-report-definition), as reports containing character, general reputation, personal characteristics, or mode-of-living information obtained through any means.

Practically, ICRAA governs the criminal-history portion of the report, the civil-records portion, the driving-records portion when used to assess fitness for the role, and reference-check content addressing character and reputation. It does not govern credit content; that falls under CCRAA.

Key ICRAA duties for employer use:

**Standalone disclosure with specific contents.** §1786.16(a)(2)(B) requires written disclosure with the CRA name and address, file-inspection rights, and request-copy rights, in standalone format.

**Free-report checkbox.** §1786.16(b)(1) requires a checkbox for the applicant to request a free copy of the investigative consumer report.

**Public-record notice.** §1786.40 requires the CRA to send notice to the consumer when public-record information is reported.

**Reporting time limits.** §1786.18(a)(7) caps adverse public-record reporting at seven years without salary-based carve-outs.

## Reports that trigger both

Many background-check products combine credit information and investigative information in a single report. Examples:

A "comprehensive employment screen" that includes a credit-bureau report plus criminal history, civil records, and verifications. A financial-services-position screen that includes credit, OFAC checks, and FINRA disclosures. An executive-level due-diligence screen that includes credit, civil litigation, criminal history, and reference content.

Each of these triggers both statutes. The compliant disclosure and authorization framework must satisfy both ICRAA's specific contents and CCRAA's specific contents. Most California-aware CRAs produce a combined disclosure form that addresses both, but employers should verify rather than assume.

## Disclosure form architecture for combined reports

A defensible combined disclosure operates under three documents (or three logical sections of a single integrated document):

The **federal FCRA §1681b(b)(2)(A) disclosure**, in standalone form, that informs the consumer that a consumer report may be obtained for employment purposes.

The **California ICRAA §1786.16 disclosure**, in standalone form, with the ICRAA-specific contents and the free-report checkbox.

The **California CCRAA §1785.20.5 disclosure and authorization** for the credit-report portion, including the AB 22 position-category certification.

Federal authorization, ICRAA authorization, and CCRAA authorization are typically combined into a single signature block but the disclosures must remain distinct.

## What goes wrong in practice

The most common failure is a single-document disclosure that tries to satisfy all three statutes through condensed language. Plaintiffs' counsel attack such forms as failing the FCRA standalone requirement, the ICRAA standalone requirement, or both. The defensible approach is three separate but contemporaneous documents/sections rather than a condensed combined.

The second-most-common failure is using a credit report for a position outside the AB 22 enumerated categories. The plaintiff need not show inaccuracy in the report — the bare fact of obtaining the credit report for a non-enumerated position is the violation under §1024.5.

## What to operationalize for 2026

Three steps. **(1) Disclosure architecture audit.** Confirm the California disclosure architecture treats FCRA, ICRAA, and CCRAA as three distinct statutes with three distinct disclosures. **(2) AB 22 position-category review.** Confirm the employer's credit-report orders are limited to AB 22-enumerated positions, with documented position-category certifications in the order workflow. **(3) Combined-report screening.** For positions where a combined credit + investigative report is needed, confirm the CRA's combined product satisfies both ICRAA and CCRAA requirements.

Our [ICRAA disclosure requirements](/blog/california-icraa-disclosure-requirements), [investigative consumer report definition](/blog/icraa-investigative-consumer-report-definition), [ICRAA penalty exposure](/blog/icraa-penalty-exposure-class-action), and [ICRAA seven-year cap](/blog/icraa-seven-year-reporting-cap) cover the related ICRAA pieces. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
