import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "small-business-first-background-check",
  title: "Running Your First Background Check: A Small Business Step-by-Step",
  metaTitle: "Small Business First Background Check Guide",
  metaDescription:
    "Step-by-step for small business owners running their first background check: vendor selection, disclosure, authorization, adjudication, adverse action.",
  excerpt:
    "Hiring your first or second employee and never run a background check before? This step-by-step walks through vendor selection, disclosure, authorization, ordering the check, adjudicating findings, and the FCRA adverse-action sequence.",
  publishedAt: "2026-02-04",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["small-business", "hiring", "compliance"],
  body: `When a small business runs its first background check, the workflow is usually invented from scratch under time pressure: a candidate has been offered the job, the founder remembers they should probably "do a background check," and forty-eight hours later a poorly-templated PDF is in the candidate's inbox. The result is one of two outcomes — the check produces clean results and the gap goes unnoticed, or it produces an actionable result and the FCRA paperwork falls apart at the moment it matters most. Building the workflow correctly the first time costs almost nothing extra and produces a repeatable program. Here is what that looks like.

## Step 1: Pick the right vendor

The first decision is the most consequential. A small business should hire a **Consumer Reporting Agency (CRA)** that is FCRA-registered and ideally PBSA-accredited. CRAs handle the disclosure-and-authorization paperwork, run searches across appropriate jurisdictions, return a structured consumer report, and supply the FCRA Summary of Rights as required by [15 U.S.C. §1681g(c)(1)](/blog/fcra-compliance-guide). What you do *not* want is a public-record aggregator portal that delivers raw search hits with no compliance scaffolding — those tools may be useful for personal due diligence but are not consumer reports under the FCRA, and using them as a hiring screen is itself an FCRA violation in most courts.

Ask the vendor directly: are you a CRA under the FCRA, are you PBSA-accredited, and is FCRA Summary of Rights delivery automated? If any answer is unclear, walk away.

## Step 2: Build a clean disclosure and authorization

Before the candidate signs anything, prepare two documents. The **disclosure** is a one-page document that does only one thing: tell the candidate that a consumer report will be obtained for employment purposes. The disclosure cannot include a liability waiver, an at-will statement, or an arbitration clause — that constitutes a "bundled disclosure" violation that has driven dozens of [class actions against small businesses](/blog/small-business-fcra-compliance-traps).

The **authorization** is a separate signature collecting the candidate's written permission. Authorization should identify the categories of consumer report that may be obtained (criminal, employment verification, education, MVR, drug screen) — being broad here is acceptable; being narrow may force you to repaper later if the role expands. Most CRAs supply both documents as part of the candidate intake flow.

## Step 3: Get a conditional offer first

A small but consequential ordering question: **do not** run the background check before extending a conditional offer of employment. In jurisdictions with [ban-the-box laws](/blog/ban-the-box-fair-chance-hiring) — which by 2026 covers most of the country at the state or city level — pre-offer criminal inquiries are illegal regardless of the FCRA framework. Even outside those jurisdictions, post-offer screening is the EEOC-recommended practice and aligns with the [individualized assessment](/blog/eeoc-arrest-conviction-employer-guidance) standard the agency expects.

Make a conditional offer. State explicitly that the offer is contingent on a satisfactory background check. Then run the check.

## Step 4: Order the right package

For most small business hires, a defensible package is **SSN trace + national criminal database + sex offender registry + county criminal at the candidate's most recent address**. Add employment verification (most recent employer) for any role with material trust dimension. Add education verification for any role requiring a credentialed degree. Add MVR if the role involves driving on company business. Avoid ordering checks unrelated to the role's actual duties — a credit report on a non-finance role, for example, can independently violate state law in California, Connecticut, Hawaii, Illinois, Maryland, Nevada, Oregon, Vermont, Washington, and Washington D.C.

Our [services overview](/services) walks through what each component covers; the [pricing calculator](/pricing) models real cost.

## Step 5: Adjudicate the result

When the report returns, the small business has to make a hiring decision. If the report is clean, finalize the offer. If the report contains findings, conduct an [individualized assessment](/blog/eeoc-arrest-conviction-employer-guidance): consider the nature and gravity of the offense, the time elapsed, and the relevance to the specific job duties. **Document the assessment in writing**, even if it is two paragraphs in a Google Doc. Documentation is the difference between a defensible decision and a Title VII/Civil Rights complaint that goes to litigation.

## Step 6: Run the FCRA adverse-action sequence if needed

If the assessment leads to a hiring withdrawal, the FCRA requires a two-step process. Send a **pre-adverse action notice** with a copy of the consumer report and the FCRA Summary of Rights. Wait at least seven business days. If the candidate does not dispute or successfully resolve the issue, send a **final adverse-action notice** identifying the CRA, restating the candidate's right to dispute, and providing required disclosures. Our [adverse-action letter template](/blog/adverse-action-letter-fcra-template) is a working draft you can adapt.

That is the complete first-check workflow. Six steps, a few hours of front-loaded setup, and you have a repeatable program that survives candidate disputes and regulatory scrutiny.`,
};
