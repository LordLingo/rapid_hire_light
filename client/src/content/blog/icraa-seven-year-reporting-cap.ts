import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "icraa-seven-year-reporting-cap",
  title: "California ICRAA Seven-Year Cap: When the Federal Carve-Out Doesn't Help",
  metaTitle: "California ICRAA Seven-Year Reporting Cap Guide 2026",
  metaDescription:
    "California ICRAA imposes a seven-year reporting cap on adverse public records with no salary carve-out. Here is how it differs from FCRA and what to do.",
  excerpt:
    "California ICRAA caps adverse public-record reporting at seven years with no \\$75,000-salary carve-out. Here is the precise scope and the operational fix.",
  publishedAt: "2026-05-16",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["icraa", "california", "compliance"],
  body: `The federal Fair Credit Reporting Act caps the reporting of certain adverse public-record items at seven years for general consumer reports but carves out an exception for positions with annual compensation of \\$75,000 or more (15 U.S.C. §1681c(b)(3)). California's **Investigative Consumer Reporting Agencies Act (ICRAA)**, Civil Code §1786.18(a)(7), imposes a parallel seven-year cap **without** the federal salary carve-out. The mismatch is the source of frequent California litigation: an employer hiring an executive at a \\$200,000 salary tells the CRA "no time limit" — federal-FCRA-correct — and the CRA returns convictions outside the seven-year window on a California report, producing direct ICRAA exposure.

## The federal rule

FCRA §1681c(a) prohibits a consumer reporting agency from reporting:

Bankruptcies older than 10 years from the date of entry of the order. Civil suits, civil judgments, paid tax liens, and accounts placed for collection or charged to profit and loss older than 7 years. Records of arrest more than 7 years old. Any other adverse item of information that antedates the report by more than 7 years.

§1681c(b) then carves out an exception: the seven-year and ten-year limits do not apply to consumer reports used in connection with:

A credit transaction involving a principal amount of \\$150,000 or more. The underwriting of life insurance involving a face amount of \\$150,000 or more. **Employment of any individual at an annual salary of \\$75,000 or more, or that may reasonably be expected to result in such salary.**

The federal carve-out is well-known and widely operationalized in CRA workflows. Many CRAs default to "no time limit" for jobs flagged at \\$75,000+ when running reports for federal-only purposes.

## The California rule

ICRAA §1786.18(a)(7) prohibits an investigative consumer reporting agency from reporting:

> "Records of civil suits, judgments, and records of arrest, indictment, misdemeanor complaint, or conviction of a crime that, from the date of disposition, release, or parole, antedate the report by more than seven years."

The statute provides **no salary-based carve-out**. The seven-year cap applies regardless of position salary. ICRAA does carve out reports used by certain federally regulated entities (federal banking, certain healthcare), but the executive-compensation carve-out the federal FCRA provides does not exist in California law.

## Where the conflict surfaces

A national employer ordering a background check on a California-based executive at \\$200,000 salary will commonly receive a report that includes convictions older than seven years if the CRA defaults to the federal-FCRA salary carve-out. The CRA's report will be federal-FCRA-compliant for non-California positions but ICRAA-non-compliant for the California position.

Three issues follow. The CRA's act of producing the report including the older record is itself an ICRAA §1786.18(a)(7) violation. The employer's act of using the report — particularly the over-seven-year content — to make an adverse decision exposes the employer to ICRAA derivative liability. And under §1786.20, an investigative CRA must follow "reasonable procedures" to assure accuracy and compliance — a default that produces over-seven-year content for California positions does not satisfy that standard.

## The 2017 California Supreme Court guidance

The California Supreme Court's 2017 ruling in *Connor v. First Student* did not directly interpret §1786.18(a)(7) but is part of a body of California case law treating ICRAA's procedural and time-limit requirements as the controlling framework when reports include investigative content. The court rejected a constitutional vagueness challenge to ICRAA, leaving the statute fully operative.

Litigation since 2017 has consistently treated the seven-year cap as a per-violation event when over-seven-year information is included in a California report, with statutory damages of \\$10,000 per willful violation under §1786.50.

## What to do

The compliant default for a California-position background check is **seven-year scope** on the categories §1786.18(a)(7) addresses, regardless of position salary. The CRA's order entry should default to the seven-year limit when the position is California-located, and the order workflow should not allow the user to override the limit based on salary alone.

A few specific operational moves:

**CRA workflow.** Configure the CRA's California product to apply the seven-year cap by default with no salary-based override. This is the single highest-leverage operational fix.

**Order template review.** Pull the order template the employer uses for California positions and confirm it does not include "no time limit" or "executive scope" flags that the CRA would honor.

**Audit historical reports.** Run a sample audit of California reports from the past two years for over-seven-year adverse content. Reports that include such content represent residual exposure even after the workflow is fixed.

**Vendor contract.** The CRA contract should explicitly require ICRAA-compliant scoping for California positions and indemnify the employer for CRA-side violations of the seven-year cap.

## How this fits the broader California program

A defensible California background-screening program has four pillars: ICRAA-compliant disclosure (covered in our [ICRAA disclosure post](/blog/california-icraa-disclosure-requirements)), the seven-year cap (this post), the post-conditional-offer multi-factor analysis under California Fair Chance Act (covered in our [California CFCA enforcement post](/blog/california-crd-cfca-enforcement-employer-lessons)), and the AI/ADS regulatory layer (covered in our [California ADS post](/blog/california-ads-ai-employment-screening-regulations) and [California AI bias post](/blog/california-ai-algorithmic-bias-hiring-rules)). Operate all four together and the residual ICRAA exposure shrinks dramatically. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
