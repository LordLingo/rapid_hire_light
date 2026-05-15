import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "california-icraa-disclosure-requirements",
  title: "California ICRAA Disclosure Requirements for Background Checks",
  metaTitle: "California ICRAA Background Check Disclosure",
  metaDescription:
    "California's ICRAA layers a strict disclosure regime on top of federal FCRA. Here is what California-applicant background checks must include, and the mistakes driving lawsuits.",
  excerpt:
    "If you run background checks on a single California applicant, you are subject to ICRAA. The state's investigative consumer reporting statute is stricter than the federal FCRA on disclosure, and the failure modes are surprisingly consistent.",
  publishedAt: "2026-05-08",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["california", "compliance", "icraa"],
  body: `California's Investigative Consumer Reporting Agencies Act (ICRAA), codified at California Civil Code §1786 et seq., is one of the strictest state-level background check statutes in the country. If a single one of your applicants lives in California, ICRAA applies to that file even if your headquarters is in Texas and your CRA is in Florida. This guide walks through what ICRAA actually requires of employers in 2026, where it diverges from the federal Fair Credit Reporting Act, and the failure modes that drive nearly every California-venued class action.

## What ICRAA covers

ICRAA regulates **investigative consumer reports**, defined as reports containing information on a consumer's character, general reputation, personal characteristics, or mode of living. Most employment background checks — criminal history, employment verification, education verification — fall inside it. California courts have consistently read ICRAA's scope as broad, particularly after the 2018 *Connor v. First Student* decision held that ICRAA and the parallel CCRAA can both apply to the same report.

The practical consequence: when in doubt, treat it as an investigative consumer report.

## The standalone disclosure requirement

ICRAA §1786.16(a)(2)(B) requires the employer's pre-investigation disclosure to be on a **clear and conspicuous standalone document**, in the same way the federal FCRA does, but California courts have read "standalone" more strictly. The disclosure cannot be combined with the authorization on the same document in some readings, cannot include a release of liability, cannot include extraneous state-law notices, and cannot include the application form. Several federal courts in the Ninth Circuit have held that even a single sentence of unrelated content in the disclosure violates ICRAA's standalone requirement.

The defensible practice is a one-page document, in plain English, containing only:

- A statement that an investigative consumer report may be obtained
- The permissible purposes for which the report will be used
- A summary of the consumer's right to inspect their file under §1786.22
- A box the applicant can check to receive a free copy of the report
- The name, address, and phone number of the CRA preparing the report

That last item — the CRA's contact information — is a California-specific requirement and is often missing from generic federal-FCRA-only disclosure forms. Its absence is a textbook ICRAA violation.

## The free-report checkbox

This is the most distinctive ICRAA requirement and the one most often missed. The disclosure must include a check box the applicant can mark to receive a free copy of the report at the same time the employer receives it (Civil Code §1786.16(b)(1)). If the box is checked, the CRA must mail the report to the applicant within three business days of providing it to the employer.

A disclosure that does not contain the checkbox — or contains it in a way the average applicant cannot reasonably notice — is non-compliant. Several class actions have turned on whether a checkbox was conspicuous enough.

## The authorization

The applicant must sign a written authorization permitting the procurement of the report. ICRAA does not require the authorization and disclosure to be on separate pages, but the safer practice is two distinct signed documents because some federal courts have read the standalone requirement as forbidding the authorization from sharing a page with the disclosure. Belt-and-suspenders.

## When the report comes back

If the report contains "public record" information that may have an adverse effect on the applicant, ICRAA §1786.40 requires the employer to provide the applicant with a copy of the report and the name and address of the CRA at the time the adverse decision is being considered — even if the applicant did not check the free-report box. This is in addition to the federal FCRA pre-adverse-action notice and is often skipped by employers who rely on a single national workflow.

For the broader pre-adverse and adverse-action workflow, our [FCRA compliance guide](/blog/fcra-compliance-guide) walks through the federal sequence; California layers ICRAA's notice on top.

## Where employers go wrong

Three failure modes account for the bulk of ICRAA cases we see.

The first is the **bundled disclosure** — disclosure stitched onto an application form, an offer letter, or a release of claims. This is also a federal FCRA violation, but California's standalone reading is stricter and the statutory damages are higher.

The second is the **missing free-report checkbox**. A disclosure compliant under federal FCRA can fail ICRAA on this single item. Audit every California applicant disclosure for the checkbox specifically.

The third is **incorrect or stale CRA contact information** — a name, address, or phone number for the CRA that no longer matches the actual provider. When you switch background check vendors, the disclosure has to switch with you. This is administrative and easy to miss.

## What the right CRA does for you

A reputable CRA serving California employers builds the ICRAA-compliant disclosure into the request flow, asserts the free-report obligation in the workflow, and provides a California-specific summary of rights. We do that by default for every California applicant. See our [services page](/services) or [request a quote](/contact) for what California-compliant screening costs at your hiring volume.

ICRAA is one of the strictest state regimes, but it is also one of the most predictable: the requirements are written down, the case law is mature, and the failure modes are knowable. Audit your disclosure once, build the checkbox in, and California stops being a class-action risk.`,
};
