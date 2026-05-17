import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "icraa-penalty-exposure-class-action",
  title: "ICRAA Penalty Exposure and Class Actions: The 2026 Reality",
  metaTitle: "ICRAA Penalty Class Action Exposure Guide 2026",
  metaDescription:
    "California ICRAA imposes \\$10,000 per-violation statutory damages with class certification widely available. Here is the 2026 exposure map for employers.",
  excerpt:
    "California ICRAA imposes \\$10,000 per-violation statutory damages with class certification widely available. Here is the exposure math and the defenses that work in 2026.",
  publishedAt: "2026-05-15",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["icraa", "california", "compliance"],
  body: `California's **Investigative Consumer Reporting Agencies Act (ICRAA)**, Civil Code §1786.50, sets statutory damages at the greater of actual damages or **\\$10,000** per violation, plus punitive damages and attorneys' fees. The federal FCRA's per-violation ceiling, by contrast, runs from \\$100 to \\$1,000 for negligent violations. ICRAA also lacks the FCRA's \\$1,000-per-violation ceiling for willful violations. The math turns ICRAA into the highest-stakes private right of action in U.S. background-screening compliance, and California's class-certification rules make the per-violation exposure scale fast. Below is the 2026 reality.

## The statutory damages

§1786.50 provides two damage tracks. **Actual damages** sustained by the consumer, plus reasonable attorneys' fees, are recoverable in any negligent or willful violation. **Statutory damages** of "not less than \\$100 and not more than \\$5,000 for each violation" or, for willful violations, **\\$10,000 per violation**, are available without proof of actual harm.

The "without proof of actual harm" piece is what drives litigation. The plaintiff need not show any damage from the violation. The fact of the procedural lapse — a non-compliant disclosure form, a missing free-report checkbox, a misformatted public-record notice — is enough to trigger statutory damages.

Class certification under Code of Civil Procedure §382 is widely available because the violations are typically employer-wide and form-based. A non-compliant disclosure used on every California applicant produces a class numbering in the thousands without dispute over commonality.

## The math

Take an employer with 5,000 California applicants per year over a four-year statute of limitations period. Assume the employer's standard background-check disclosure form is non-compliant in two ways — a federal FCRA-style standalone disclosure that omits the ICRAA-specific contents, and no free-report checkbox.

Two willful-violation findings × \\$10,000 per violation × 20,000 applicants = \\$400 million theoretical exposure. The actual settlement values rarely approach the theoretical maximum, but the *credible threat* of a nine-figure trial verdict is what drives settlement values into the eight-figure range.

The Parsonage v. Walmart litigation — covered in our [Parsonage post](/blog/california-icraa-parsonage-walmart-10k-penalty) — settled at \\$10 million in 2019 on similar fact patterns at meaningfully smaller class size.

## What "willful" means in this context

§1786.50 caps damages at \\$5,000 per violation for non-willful violations and at \\$10,000 per willful violation. The court has held that willfulness includes both intentional violations and reckless disregard of statutory requirements.

The plaintiffs' bar generally argues that any standard form-based violation is willful because the employer's failure to update the form after California-specific guidance was published constitutes reckless disregard. Courts have varied in their willingness to accept this argument, but enough have to keep willfulness as a credible factor in settlement valuation.

## Common violation patterns

The ICRAA class-action docket clusters around five recurring violations:

**Disclosure form non-compliance.** The standalone-disclosure rule, the ICRAA-specific contents (CRA name and address, file-inspection rights, request-copy rights), and the formatting separation from FCRA disclosures.

**Missing free-report checkbox.** §1786.16(b)(1) requires a checkbox option. Forms that say "you may request a copy" without the checkbox are non-compliant.

**Public-record-update notice failures.** §1786.40 requires the CRA to send the consumer notice when public-record information is reported. CRAs sometimes lapse on this; employers may face derivative liability.

**Reporting time-limit violations.** §1786.18(a)(7) limits adverse public-record reporting to seven years without the federal FCRA's \\$75,000+ salary carve-out. Reports exceeding seven years on California applicants are independently actionable.

**Authorization scope mismatches.** Authorization forms that grant the employer rights beyond what ICRAA permits — or fail to grant rights ICRAA requires — produce derivative claims.

## Defenses that work

Three defenses succeed at the class-certification or summary-judgment stage in some cases:

**Bona fide error defense.** §1786.50(c) provides a bona fide error defense if the violation was unintentional and resulted from a bona fide error notwithstanding the maintenance of procedures reasonably adapted to avoid such error. The defense requires documented compliance procedures, training, and a paper trail showing the procedures were maintained. Defendants without the underlying compliance infrastructure cannot raise the defense effectively.

**Standing/Article III.** A subset of cases have been removed to federal court and dismissed on Article III standing grounds where the violation is purely procedural and the plaintiff cannot show concrete injury. The Spokeo v. Robins line of cases is the leading authority. California state-court forums do not impose the same standing requirement, so plaintiffs typically remand to state court.

**Class certification challenges.** Employers who can show that violations were not uniform across the class — for example, varying disclosure forms across jurisdictions or business units — can defeat class certification on commonality grounds. This works for some defendants and not others depending on the variance in actual practice.

## What to fix today

Three steps. **(1) Disclosure form audit.** Pull the California disclosure currently in use. Confirm it includes the ICRAA-specific contents, the standalone format, and the free-report checkbox. **(2) Reporting time-limit confirmation.** Confirm the CRA is applying ICRAA's seven-year cap to all California reports without salary-based carve-outs. **(3) CRA contract review.** Review the CRA contract for ICRAA-specific compliance representations and indemnity.

Our [ICRAA disclosure requirements](/blog/california-icraa-disclosure-requirements), [Parsonage class-action exposure](/blog/california-icraa-parsonage-walmart-10k-penalty), and [investigative consumer report definition](/blog/icraa-investigative-consumer-report-definition) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
