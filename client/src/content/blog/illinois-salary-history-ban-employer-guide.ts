import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "illinois-salary-history-ban-employer-guide",
  title: "Illinois Salary History Ban: An Employer Guide to the IEPA",
  metaTitle: "Illinois Salary History Ban Employer Guide IEPA 2026",
  metaDescription:
    "Illinois banned salary-history inquiries in 2019 and added pay-data reporting in 2021. Here is how the rules apply to background checks and onboarding in 2026.",
  excerpt:
    "Illinois prohibits salary-history inquiries and requires equal-pay registration certificates for employers above 100 employees. Here is how the rules touch background screening and onboarding.",
  publishedAt: "2026-05-15",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["illinois", "compliance"],
  body: `Illinois has run a two-stage tightening of its **Equal Pay Act of 2003 (IEPA)**. Public Act 101-0177, effective September 29, 2019, banned employer inquiries into an applicant's wage or salary history. SB 1480, signed in 2021 and operative through 2024–2026 implementation, layered on a mandatory **Equal Pay Registration Certificate** for employers with 100 or more employees, plus race/ethnicity reporting tied to EEO-1 filings. The two pieces together change the lawful boundaries of background screening and onboarding for Illinois employers.

## The salary-history prohibition

The IEPA, as amended, makes it unlawful for an employer or its agent to:

Screen an applicant **based on** their wage or salary history. **Require** disclosure of wage or salary history as a condition of being considered for employment, being interviewed, continuing in consideration, being offered employment, being offered compensation, or being employed. **Request or require** wage or salary history from the applicant or their current/former employer. **Seek** wage or salary history through a public source.

The statute carries a private right of action. Damages include lost wages, special damages up to \\$10,000, compensatory damages, attorneys' fees, and injunctive relief. The Illinois Department of Labor enforces it administratively in parallel.

## How this hits employment verifications

Employment verifications run by CRAs typically confirm dates of employment, position(s) held, eligibility for rehire, and — historically — compensation. The IEPA effectively bars compensation collection for Illinois positions through this channel. CRAs operating in Illinois have updated their employment-verification scripts to omit compensation fields by default and to flag any explicit employer request for compensation as outside the standard scope. Employers who want compensation data for non-Illinois positions need to specify the jurisdiction-specific scope at order time, because a verification request that captures compensation across multiple states can sweep in Illinois positions inadvertently.

The most common compliance failure: an employer orders a "standard" verification package on a national candidate without jurisdiction-specific scoping, the CRA returns compensation data on the Illinois portion of the work history, and the employer has now obtained data the IEPA bars. The fix is contract-level: the employer's CRA agreement should specify "compensation excluded for Illinois positions" as a default behavior.

## Voluntary disclosure carve-out

The statute permits compensation discussion when the **applicant voluntarily discloses** their salary history without prompting and the employer does not rely on the disclosure in setting compensation. This carve-out is narrow. Plaintiff-side litigation has scrutinized whether the disclosure was actually unprompted and whether the employer relied on the disclosure in offer-setting. The defensive practice is to avoid soliciting or recording any compensation data even when the candidate offers it, and to document the offer-setting rationale on factors other than disclosed history.

## Pay-range disclosure (PA 102-1024)

Illinois layered on a **pay-range disclosure requirement** in 2025. Employers with 15+ employees must include the wage or salary range and a general benefits description in any job posting for a position that will be physically performed in Illinois or that reports to a supervisor located in Illinois. The pay-range duty is separate from the salary-history ban but lives in the same operational space — both pull compensation discussion out of the applicant-driven inquiry stage and into the employer-published posting.

## The Equal Pay Registration Certificate

SB 1480 added the EPRC requirement for employers with 100+ employees in Illinois. The certificate filing requires employers to submit pay data by sex and race/ethnicity, similar in structure to the federal EEO-1 Component 2 filing. The Illinois Department of Labor uses the data to investigate pay-equity complaints and publishes aggregate statistics. EPRC certificates run on a two-year recertification cycle, and failure to file produces statutory penalties starting at \\$2,500 and escalating to \\$10,000 per violation.

The EPRC does not directly intersect with background screening, but it lives in the same compliance architecture as the salary-history ban and the pay-range disclosure rule. Employers building a 2026 Illinois compliance program should treat the three pieces together rather than as siloed obligations.

## How to operationalize

Three operational fixes for 2026:

The first is an **application-form audit**. Remove every reference to salary history, expected salary, and current/most-recent compensation from the Illinois job application. Include a state-specific application variant that excludes these fields when an applicant indicates Illinois-based work.

The second is a **verification-scope review**. Confirm with the CRA that compensation is excluded by default for Illinois positions. Build a documented test that pulls a sample verification report and confirms compensation fields are absent.

The third is a **posting-template upgrade**. Job posting templates for Illinois roles must include the pay range and benefits summary. Audit current postings for compliance and standardize the template across the ATS.

## Interaction with FCRA and JOQAA

The IEPA sits alongside but does not override federal FCRA duties or the [Illinois JOQAA](/blog/illinois-joqaa-background-checks) conviction-record analysis. A defensible Illinois screening program runs the FCRA pre-adverse-action and JOQAA-compliant individualized assessment processes regardless of the salary-history workflow. Our [BIPA guide](/blog/illinois-bipa-background-checks) covers the parallel biometric duty. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
