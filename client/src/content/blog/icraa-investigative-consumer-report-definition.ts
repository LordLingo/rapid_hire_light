import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "icraa-investigative-consumer-report-definition",
  title: "ICRAA Investigative Consumer Report: What It Actually Covers",
  metaTitle: "ICRAA Investigative Consumer Report Definition Guide",
  metaDescription:
    "California ICRAA covers investigative consumer reports — broader than the FCRA equivalent. Here is what the definition catches and what it leaves out.",
  excerpt:
    "California ICRAA covers investigative consumer reports — a category broader than the FCRA equivalent. Here is what the definition actually catches and what it leaves out.",
  publishedAt: "2026-03-13",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["icraa", "california", "compliance"],
  body: `California's **Investigative Consumer Reporting Agencies Act (ICRAA)**, codified at Civil Code §§1786 et seq., regulates a category of background reports that California defines more broadly than the equivalent federal FCRA category. The mismatch between the two definitions is what produces most California ICRAA litigation. Employers operating in California who calibrate their compliance to the FCRA definition of "investigative consumer report" miss reports that are FCRA-ordinary but ICRAA-investigative, and the resulting per-violation statutory damages add up quickly. Below is the 2026 employer guide to what ICRAA actually covers.

## The two-statute architecture

California operates two parallel consumer-reporting statutes. The **Consumer Credit Reporting Agencies Act (CCRAA)**, Civil Code §§1785 et seq., covers credit-bureau reports. The **ICRAA**, Civil Code §§1786 et seq., covers what the statute calls "investigative consumer reports." Reports that include both credit and non-credit information may be subject to both statutes simultaneously.

The federal FCRA is narrower in two respects relevant to investigative content. First, the FCRA definition of "investigative consumer report" requires personal interviews with neighbors, friends, or associates concerning character, general reputation, or mode of living. Second, the FCRA-investigative procedural requirements apply to a narrow subset of consumer reports.

ICRAA's definition is materially broader.

## The ICRAA definition

ICRAA Civil Code §1786.2(c) defines an "investigative consumer report" as:

> "a consumer report in which information on a consumer's character, general reputation, personal characteristics, or mode of living is obtained through any means."

Compare to the FCRA Section 603(e) definition:

> "a consumer report or portion thereof in which information on a consumer's character, general reputation, personal characteristics, or mode of living is obtained through personal interviews with neighbors, friends, or associates of the consumer reported on or with others with whom he is acquainted or who may have knowledge concerning any such items of information."

Two differences matter. **(1) ICRAA omits the "personal interview" qualifier.** Information obtained "through any means" is sufficient. **(2) ICRAA expressly includes character and reputation information** rather than constraining it to interview-derived content.

## What this catches

The "any means" phrasing pulls many ordinary background-screening report contents into ICRAA scope:

**Criminal history reports** — the conviction record speaks to character. ICRAA-investigative.

**Civil court records** — judgments and litigation history speak to character and mode of living. ICRAA-investigative.

**Driving records** — driving history speaks to mode of living for some position categories. ICRAA-investigative for those categories.

**Education and employment verifications** — these are factual confirmations, generally not character-or-reputation reports, and so generally outside ICRAA-investigative scope.

**Credit reports** — these are credit-bureau reports under CCRAA, not ICRAA, but are subject to a parallel California statute.

**Reference checks involving character or reputation discussion** — ICRAA-investigative.

## Why the breadth matters for compliance

ICRAA imposes more stringent procedural requirements than the FCRA on investigative reports. The most operationally significant differences:

**Standalone disclosure with detailed contents.** ICRAA §1786.16(a)(2)(B) requires a written disclosure that identifies the consumer reporting agency by name and address, summarizes the consumer's right to inspect the file, and notifies the consumer of the right to request a copy of the report. The disclosure must be standalone — not bundled with the FCRA disclosure or other onboarding materials.

**Free-report checkbox.** §1786.16(b)(1) requires the disclosure to include a box the applicant can check to request a free copy of the investigative consumer report. Federal FCRA does not require this.

**Public-record-update notice.** §1786.40 requires the CRA to notify the subject in writing of public-record information at the same time the information is reported to the user, with the recipient's name and address.

**Reporting time limits.** §1786.18(a)(7) limits civil suits, civil judgments, paid tax liens, and accounts placed for collection or charged to profit and loss to **seven years**, with no carve-out for high-salary positions. The federal FCRA carves out positions with annual salary over \\$75,000.

## Where employers go wrong

Three patterns produce ICRAA litigation.

The first is **assuming FCRA disclosure suffices**. An employer using a single FCRA disclosure form for California positions, without the additional ICRAA-specific contents and standalone formatting, exposes itself to per-violation statutory damages of \\$10,000 plus actual damages, attorneys' fees, and punitive damages. The Parsonage v. Walmart line of cases (covered in our [ICRAA Parsonage post](/blog/california-icraa-parsonage-walmart-10k-penalty)) crystallized this exposure.

The second is **omitting the free-report checkbox** even when the rest of the disclosure is ICRAA-aware. The checkbox is a specific procedural requirement, not a general practice; its absence is independently actionable.

The third is **using salary-based seven-year carve-outs**. Employers using federal FCRA carve-out logic (no time limit on convictions for positions over \\$75,000) on California reports run into the ICRAA seven-year cap, which applies regardless of salary.

## Operationalizing the breadth

A defensible 2026 California program treats every background-screening report with character, reputation, or mode-of-living content as ICRAA-investigative, applies the full ICRAA disclosure and procedural framework to those reports, and uses CRAs that produce ICRAA-compliant disclosures and reports as the default. The federal FCRA framework is the floor; ICRAA is the layer that California adds on top.

Our [ICRAA disclosure requirements](/blog/california-icraa-disclosure-requirements), [ICRAA Parsonage class-action exposure](/blog/california-icraa-parsonage-walmart-10k-penalty), and [federal FCRA Section 604(b)](/blog/fcra-604b-disclosure-authorization) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
