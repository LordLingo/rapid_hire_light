import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "continuous-monitoring-lookback-policy",
  title: "Continuous Monitoring Lookback Policy: How Far Back Counts",
  metaTitle: "Continuous Monitoring Lookback Policy Design 2026",
  metaDescription:
    "Continuous monitoring programs need a defined lookback policy for actionable content. Here is the 2026 design guide aligned with FCRA, ICRAA, and state law.",
  excerpt:
    "How far back into a continuous-monitoring alert is actionable? Here is the 2026 lookback policy design guide aligned with FCRA, ICRAA, and state-law constraints.",
  publishedAt: "2026-05-14",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["continuous-monitoring", "fcra", "compliance"],
  body: `Continuous monitoring programs surface alerts on a stream of consumer-report content. Some alerts reflect events occurring after hire (a new conviction in 2025 for an employee hired in 2022); some reflect events occurring before hire that simply weren't captured in the original screen (a 2019 conviction in a jurisdiction the original screen didn't cover); some reflect old events being newly indexed by the data source. The defensible program operates a documented lookback policy that determines which alerts are actionable. Below is the 2026 design guide.

## The three time-stamp layers

Three timestamps matter for any alert:

**Event date.** The date of the underlying event — date of conviction, date of license suspension, date of MVR violation. This is the date the policy should typically anchor on.

**Disposition date.** The date a final disposition is reached on a previously-pending matter. Many criminal cases produce a citation date that is months before the conviction date, and the conviction date is the operationally relevant disposition.

**Index date.** The date the data source indexed the record. This is when the alert system saw the record, but the date is operationally irrelevant for substantive decision-making.

A defensible lookback policy anchors on event date or disposition date, not index date. Acting on alerts based on index date treats old events as if they were new, which produces compliance and fairness concerns.

## Federal FCRA constraints

FCRA §1681c imposes statutory time limits on the reporting of certain consumer-report content:

**Bankruptcies.** 10 years from the date of entry of the order for relief or the date of adjudication.

**Civil suits, civil judgments, and records of arrest.** 7 years from the date of entry, or until the governing statute of limitations expires, whichever is longer.

**Paid tax liens.** 7 years from the date of payment.

**Accounts placed for collection or charged to profit and loss.** 7 years from the date of original delinquency.

**Other adverse information.** 7 years from the date of the event giving rise to the information.

The 7-year cap does not apply to criminal convictions, credit transactions of \\$150,000+, life insurance of \\$150,000+, or employment with expected salary at \\$75,000+.

For continuous monitoring programs, the practical implication is that arrests older than 7 years are typically beyond reportable in a standard consumer report, but convictions older than 7 years may still be reportable subject to the income carve-outs.

## State-overlay constraints

Several states impose stricter lookback rules than federal FCRA:

**California ICRAA.** Cal. Civ. Code §1786.18(a)(7) imposes a 7-year cap on adverse public-record information without the federal income carve-out. Convictions older than 7 years are not reportable for California-located positions regardless of salary. Our [ICRAA seven-year reporting cap post](/blog/icraa-seven-year-reporting-cap) covers the operational implications.

**Massachusetts.** State law restricts criminal-history reporting after 5–7 years depending on the offense severity.

**New York.** Criminal-history reporting is constrained by Article 23-A and by Clean Slate Act (covered in our [New York Clean Slate Act post](/blog/new-york-clean-slate-act-employer-guide)) once eligibility for sealing is reached.

**Hawaii, Kentucky, Maryland, Montana, Nevada, New Hampshire, New Mexico, Texas, Washington.** Various restrictions on the reporting of older criminal-history information depending on the offense.

A multi-state continuous-monitoring program needs jurisdiction-specific lookback policies. The defensible practice is to apply the most restrictive applicable rule to each alert.

## What "old event newly indexed" looks like

Common scenario: an employee has a 2017 conviction in a jurisdiction the original 2018 hire screen did not cover. In 2025, the alert system indexes the 2017 record. The alert lands as if it were a new event.

The defensible response treats the 2017 event as a 2017 event — checking it against the federal FCRA 7-year cap, state-overlay caps (California ICRAA at 7 years excludes it from California positions), the original hire-screen scope, and substantive relevance to the role.

If the event is within reporting limits and substantively relevant, the §1681b(b)(3) sequence applies and the individualized-assessment process under California, NYC, or other applicable frameworks applies.

If the event is outside reporting limits, the alert is documented as outside the lookback and not acted on.

## Documenting the lookback decision

Each alert should produce a documented decision record covering: alert content, event date, applicable lookback rule (federal FCRA, state ICRAA, NYC, etc.), lookback determination (within scope or outside), substantive evaluation, and the final decision.

Programs that act on alerts without the documented record become FCRA defendants whose defense rests on partial recollection.

## Building the policy

A defensible policy reads roughly as follows:

> Alerts on events older than seven years from the alert date are presumptively outside the lookback under federal FCRA §1681c. For positions with salary at \\$75,000 or above, the presumption may be overcome on review.
>
> For California positions, events older than seven years are outside the lookback under ICRAA §1786.18(a)(7) regardless of salary.
>
> For New York positions, alerts must be evaluated against Article 23-A and Clean Slate Act eligibility before adverse action.
>
> For other state-overlay jurisdictions, applicable rules apply per the jurisdiction matrix.

Our [continuous monitoring vs annual rescreening](/blog/continuous-monitoring-vs-annual-rescreening), [post-hire criminal alerts program](/blog/post-hire-criminal-alerts-program), and [ICRAA seven-year reporting cap](/blog/icraa-seven-year-reporting-cap) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
