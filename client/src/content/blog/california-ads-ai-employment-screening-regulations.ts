import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "california-ads-ai-employment-screening-regulations",
  title:
    "California's New AI Hiring Rules: What the CRD Automated-Decision Regulations Mean for Background Checks",
  metaTitle: "California AI Hiring Regulations 2026",
  metaDescription:
    "California's CRD Automated-Decision Systems regulations took effect October 1, 2025. Here is what they require and how they intersect with background-check workflows in 2026.",
  excerpt:
    "California's CRD Automated-Decision Systems regulations took effect October 1, 2025. Any employer using AI-assisted resume screening, predictive assessments, or automated background-check adjudication is now squarely inside the rule's scope.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["california", "compliance", "ai"],
  body: `California's Civil Rights Department (CRD) finalized its **Automated-Decision Systems (ADS) regulations** on June 30, 2025, with an effective date of **October 1, 2025**. The rules — codified at 2 CCR §11008 and §11070 et seq. — sweep AI-assisted hiring tools into the existing FEHA anti-discrimination framework. For employers using AI to screen resumes, score assessments, adjudicate background checks, or rank candidates, the regulations are now the operating reality in California.

This guide walks through what the rules actually require in 2026 and where they intersect with the background-screening workflow.

## What counts as an "Automated-Decision System"

The CRD's definition is broad. An ADS is "a computational process that makes a decision or facilitates human decision making regarding an employment benefit." That sweeps in resume parsers, video-interview scoring tools, gamified assessments, predictive attrition models, and — directly relevant to background checks — any algorithmic adjudication or scoring layer that flags or filters criminal records, employment gaps, or verification failures. The regulation explicitly lists "analyzing applicant or employee data from third parties" as an example, which captures most modern background-check matching engines.

What is *not* an ADS: word processing, spreadsheets, calculators, basic data storage. Most everything else hiring-adjacent is potentially in scope.

## The four operative rules

First, **§11070(f)** makes it unlawful to use an ADS in a way that discriminates against applicants on a FEHA-protected basis. This sounds like restating existing law, but the regulations also state that *evidence — or the lack thereof — of anti-bias testing or proactive efforts to avoid discrimination is relevant to any claim or defense*. In practice, the absence of bias-audit documentation has now been moved into the discrimination case.

Second, the recordkeeping period for personnel records and ADS data has been **extended from two years to four years**. ADS data includes any data used in or resulting from an ADS, plus any data used to train or customize the ADS for the employer. For an employer using a CRA's AI matching tool, that means four-year retention of every input and output of the model.

Third, "agent" liability has been **expanded to cover third-party vendors** that perform employer-facing FEHA-regulated functions. CRAs, AI hiring vendors, and assessment vendors can now be named alongside the employer in a FEHA action — and employers are pulled into renegotiating CRA contracts to ensure indemnification, audit rights, and bias-testing disclosures are in place.

Fourth, the rules address criminal-record use specifically. An ADS that uses criminal history must do so in compliance with the [California Fair Chance Act](/blog/california-icraa-disclosure-requirements) — meaning conviction-history use must come *after* the conditional offer, and the individualized assessment cannot be fully delegated to the algorithm.

## Where this intersects background checks

Three workflow points matter. The first is the **adjudication matrix**. If your ATS or CRA portal has a rule that auto-disqualifies applicants whose criminal record contains a particular felony class, that rule is an ADS under the regulation. It needs to live inside the Fair Chance Act's individualized-assessment framework, which means a human must apply the three-factor test (nature/gravity, time elapsed, nature of the job) before adverse action — see our [adverse action letter template](/blog/adverse-action-letter-fcra-template) for the procedural overlay. The second is **AI-assisted verification**. Any AI tool that scores employment-history matches against an employer-provided list is an ADS, and its training data is now subject to four-year retention. The third is **predictive risk scoring**. Any tool that converts a background report into a numeric "risk score" used in hiring is an ADS and is presumptively scrutinized under §11070(f).

## What employers should do now

Build a four-step program. First, inventory every AI-assisted tool in the hiring stack — ATS, CRA, assessments, video interviews — and classify each as ADS or non-ADS. Second, get bias-audit documentation from each ADS vendor; the lack of documentation is now an evidentiary problem. Third, extend personnel record retention to four years across all systems, including CRA portals. Fourth, route any criminal-record adjudication through a human reviewer per §11070(f) and the Fair Chance Act.

Pick a CRA that publishes its bias-audit posture, exposes a human-in-the-loop adjudication option, and supports four-year data retention. For our take on California-aware background screening see [our compliance overview](/compliance) and the [California state guide](/resources/background-checks-by-state).`,
};
