import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fcra-613-public-record-reporting",
  title:
    "FCRA §613: How Public Records Get Reported on a Background Check",
  metaTitle: "FCRA 613 Public Record Reporting Guide",
  metaDescription:
    "FCRA §613 governs how a CRA reports adverse public-record information for employment. Here is the 2026 guide to the contemporaneous-notice and strict-procedures rules.",
  excerpt:
    "When a background check report includes a criminal record, civil judgment, or arrest, FCRA §613 imposes specific procedural rules on the consumer reporting agency. Here is the 2026 guide to the two compliance paths and the seven-year non-conviction limit.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["fcra", "compliance", "criminal-records"],
  body: `When a background check report includes adverse public-record information — a criminal record, a civil judgment, an arrest, a tax lien — **FCRA §613** (15 U.S.C. §1681k) imposes a procedural duty on the consumer reporting agency that does not apply to other report content. The CRA must either notify the consumer that the information is being reported (and to whom), or maintain "strict procedures" to ensure the information is complete and up to date. Most employment CRAs operate under a hybrid: they send §613 notices for the highest-impact records and rely on strict procedures for the rest.

The rule matters to employers because the CRA's §613 posture affects what shows up on the report, when the candidate sees it, and how disputes get resolved. This guide walks through what §613 actually requires, the seven-year non-conviction limit at §605, and how the two interact.

## The two §613 compliance paths

§613 gives a CRA two options when reporting public-record information likely to have an adverse effect on the consumer's ability to obtain employment. **Path A** is contemporaneous notice: at the time the report is furnished to the employer, the CRA notifies the consumer that public-record information is being reported and provides the name and address of the recipient. **Path B** is strict procedures: the CRA maintains procedures designed to ensure that the public-record information is "complete and up to date." For criminal-conviction reporting specifically, §613(a)(2) requires that any conviction reported reflect the current status (i.e., not a conviction that has been reversed, sealed, expunged, or vacated).

In practice, Path A produces a copy of the consumer report (or an equivalent notice) sent to the candidate at the same moment the employer sees it. Path B requires the CRA to verify the public-record information against a primary source — typically a recent county-court visit or a county-court electronic record — within a defined freshness window. Most employment CRAs default to Path B because it produces a faster turnaround and avoids candidate confusion. Our [criminal records detail page](/services/criminal-records) describes how primary-source verification works in the field.

## The seven-year non-conviction limit at §605

§613 governs **how** public records are reported. **§605** (15 U.S.C. §1681c) governs **what** can be reported in the first place. For employment-purpose reports involving an annual salary under \\$75,000, §605(a) prohibits a CRA from reporting:

- Bankruptcies older than 10 years
- Civil suits, civil judgments, and records of arrest older than seven years
- Paid tax liens older than seven years
- Accounts placed for collection or charged to profit and loss older than seven years
- Any other adverse item of information older than seven years

The seven-year window for **arrests** is the most consequential limit for employment screening. A non-conviction record (an arrest that did not lead to a conviction, a dismissed charge, a no-bill grand jury return) drops off after seven years. A conviction record has **no FCRA expiration** at any salary level under federal law, though state law often imposes its own limit. Some states (California, Massachusetts, New York, Hawaii, others) impose a seven-year conviction window of their own; the CRA must apply the more protective rule. For state-by-state coverage see our [state matrix](/resources/background-checks-by-state).

## What candidates can do about errors

If a §613 report contains a record the candidate believes is inaccurate, incomplete, or expired, the candidate can dispute the item under §611 (15 U.S.C. §1681i). The CRA must complete a reinvestigation within 30 days, contact the original source of the information, and either correct the record or confirm it. Our companion guide to the [§611 reinvestigation duty](/blog/fcra-611-dispute-reinvestigation) walks through the dispute mechanics. While a dispute is pending, the candidate can ask the employer to delay the hiring decision; under FCRA §604(b)(3), the candidate also has the pre-adverse-action window to raise the dispute before any employment decision becomes final.

## What we recommend for 2026

Pick a CRA that maintains §613 Path B procedures with primary-source verification at the county level — not a "national criminal database" that aggregates from multiple sources without confirmation. Confirm in writing that any criminal record on a report has been verified at the originating court within the freshness window your CRA discloses. Apply the seven-year arrest limit at §605 even when state law would allow longer reporting; the cost of being more protective than the law requires is low, and the litigation risk of misreporting an old arrest is high. For pricing on a §613-compliant primary-source program, see our [pricing calculator](/pricing).

Talk to our [compliance team](/contact) for a §613 procedure audit.`,
};
