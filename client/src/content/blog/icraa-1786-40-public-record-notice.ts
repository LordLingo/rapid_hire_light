import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "icraa-1786-40-public-record-notice",
  title: "ICRAA §1786.40 Public-Record Notice: A Compliance Walkthrough",
  metaTitle: "ICRAA 1786.40 Public Record Notice Compliance Guide 2026",
  metaDescription:
    "California ICRAA §1786.40 requires CRAs to send public-record notices to consumers. Here is the 2026 employer and CRA compliance walkthrough.",
  excerpt:
    "California ICRAA §1786.40 requires CRAs to send public-record notices to consumers when public-record information is reported. Here is the 2026 walkthrough.",
  publishedAt: "2026-03-12",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["icraa", "california", "compliance"],
  body: `California's **Investigative Consumer Reporting Agencies Act §1786.40** imposes a procedural duty that has produced quiet but consistent litigation since the late 2010s. The statute requires a CRA reporting public-record information for employment purposes to send the consumer a notice, at the same time the public-record information is reported, that informs the consumer of the report and identifies the report's recipient. The duty falls on the CRA primarily, but the employer carries derivative exposure when the CRA's notice fails. Below is the 2026 walkthrough.

## What §1786.40 requires

The statute reads, in relevant part:

> "Whenever a public record is being reported by an investigative consumer reporting agency for employment purposes, the agency shall, at the time the public record information is reported to the user of the report, notify the consumer of the fact that public record information is being reported, and the name and address of the recipient of the report."

The duty has three pieces. First, it applies whenever **public-record information** is reported — criminal records, civil litigation, judgments, liens, and similar publicly recorded items. It does not apply to non-public-record content (employment verifications confirmed by prior employers, education verifications, drug test results).

Second, the notice must be sent **at the time** the public-record information is reported to the employer, not after. Notices sent days later have been challenged as untimely.

Third, the notice must include both the **fact** of the public-record reporting and the **identity** (name and address) of the recipient employer. Notices that say "your background check has been completed" without identifying the recipient are non-compliant.

## How CRAs operate the duty

Most established California-aware CRAs operate §1786.40 notices as an automated email or postal-mail trigger that fires when the report is delivered to the employer. The trigger pulls the consumer's contact information from the application data submitted at order time, generates a notice that identifies the public-record content categories and the employer, and sends it to the consumer.

The operational failure modes:

**Stale or wrong consumer contact data.** If the application captured the consumer's email incorrectly, the notice does not arrive. The CRA's duty is satisfied if the notice was sent to the address provided; the employer's exposure depends on whether the consumer actually received it and whether the employer's data feed is accurate.

**Notice content gaps.** Notices that describe "background check completed" without identifying the public-record content category or the recipient employer fall short of §1786.40's content requirements.

**Timing drift.** Notices that fire on a daily batch rather than at report-delivery time can drift one to two days past the §1786.40 "at the time" requirement.

**Excluded report types.** CRAs sometimes exclude certain report types (re-screens, ongoing monitoring) from the §1786.40 notice trigger. The exclusion is only valid if the report does not include public-record information.

## Employer derivative exposure

The CRA's primary duty does not insulate the employer entirely. The employer is subject to derivative liability under several theories:

**Vendor selection.** Employers selecting a CRA without §1786.40 capability — or operating a CRA's process in a way that bypasses the §1786.40 trigger — have been held responsible for the resulting non-compliance. The case law supports an employer duty to exercise reasonable care in CRA selection.

**Application-data accuracy.** Employers who capture inaccurate consumer contact information through the application process and pass it to the CRA produce notice failures even when the CRA's process is otherwise compliant. Misdirected notices have been treated as the employer's responsibility under some readings.

**Authorization scope.** Some plaintiffs argue that the §1786.16 disclosure and authorization should reference the §1786.40 notice as part of the consumer's notice rights. The argument has not been universally successful but produces additional litigation cost.

## What an employer should verify

Three operational checks. **(1)** Confirm the CRA sends §1786.40 notices for all California public-record-containing reports, including ongoing monitoring and rescreens. **(2)** Confirm the notice content includes the public-record content category, the recipient employer's name and address, and the consumer's rights to inspect and dispute the report. **(3)** Confirm the notice timing is at report delivery, not on a delayed batch.

Most established CRAs can produce documentation showing the notice was sent (timestamp, recipient address, content). Employers should obtain this documentation periodically as part of CRA oversight.

## Interaction with FCRA pre-adverse action

§1786.40 is independent of the FCRA pre-adverse-action notice under 15 U.S.C. §1681b(b)(3). Both must be satisfied. The §1786.40 notice goes to the consumer when the public-record information is reported to the employer. The FCRA pre-adverse-action notice goes to the consumer when the employer is considering adverse action based on the report. Notices that try to combine the two functions usually fail one or both. The compliant practice is to send §1786.40 notice as a CRA-driven event at report delivery and the FCRA pre-adverse-action notice as an employer-driven event at adverse-decision time.

## Documentation

The defensible §1786.40 file includes the CRA's notice send log (recipient, timestamp, content), the employer's CRA contract requiring §1786.40 compliance, and the employer's audit of CRA notice operations. Programs that produce this documentation survive ICRAA scrutiny on §1786.40 questions. Programs that have never confirmed CRA notice operations are exposed to settlement-driving discovery.

Our [ICRAA disclosure requirements](/blog/california-icraa-disclosure-requirements), [investigative consumer report definition](/blog/icraa-investigative-consumer-report-definition), and [ICRAA seven-year cap](/blog/icraa-seven-year-reporting-cap) cover the connected pieces. For program-build help start at [contact](/contact); pricing for the relevant CRA package is on [pricing](/pricing).`,
};
