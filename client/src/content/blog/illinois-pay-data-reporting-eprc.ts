import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "illinois-pay-data-reporting-eprc",
  title: "Illinois Equal Pay Registration Certificate: 2026 Filing Guide",
  metaTitle: "Illinois EPRC Pay Data Reporting Filing Guide 2026",
  metaDescription:
    "Illinois EPRC requires pay data reporting by sex and race for employers with 100+ employees. Here is the 2026 filing process, deadlines, and audit posture.",
  excerpt:
    "Illinois EPRC requires every employer with 100+ Illinois employees to file pay data by sex and race on a two-year cycle. Here is the 2026 filing process and the audit posture that survives scrutiny.",
  publishedAt: "2026-04-08",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["illinois", "compliance"],
  body: `Illinois SB 1480, signed in 2021, did two things. It made conviction record a protected characteristic under the Illinois Human Rights Act, and it created the **Equal Pay Registration Certificate (EPRC)** — a mandatory pay-data filing for employers with 100 or more employees in Illinois. The EPRC sits adjacent to background screening rather than inside it, but it lives in the same compliance architecture and the same Illinois Department of Labor enforcement docket. Below is the 2026 filing playbook.

## Who must file

Every private employer that, on the EPRC application date, employs **100 or more employees in Illinois** must obtain and maintain an EPRC. The threshold is calculated by counting all employees whose primary work location is in Illinois on the relevant counting date. Out-of-state employers with fewer than 100 Illinois employees are not required to file. Employers in scope must apply for an initial certificate and recertify every **two years**.

Illinois Department of Labor (IDOL) maintains the application portal. The application requires three pieces.

## The three-part filing

**Part one — the EEO-1 Component 1 report.** The employer submits its most recently filed federal EEO-1 Component 1 report for the establishments that include Illinois employees. The federal report classifies employees by job category, race/ethnicity, and sex. Illinois uses this as the foundation for its pay analysis.

**Part two — wage records.** The employer submits a list of all employees during the applicable EEO-1 reporting year, broken out by job category, sex (binary), and race/ethnicity, along with the **total wages paid** during the reporting year for each employee as defined by Section 235 of the Internal Revenue Code. This is the core data set IDOL uses for pay-equity analysis. The wage records must be submitted in the format IDOL specifies.

**Part three — the equal-pay compliance statement.** A signed statement from a corporate officer attesting that:

The employer is in compliance with the IEPA, Title VII, the Equal Pay Act of 1963, and the IHRA. The average compensation for female and minority employees is not consistently below the average for male and non-minority employees within each major job category, accounting for length of service, requirements of specific jobs, experience, skill, effort, responsibility, working conditions, education, training, ability, performance, and seniority. The employer does not restrict employees of one sex to certain job classifications. Wages and benefits are determined without regard to sex.

The compliance statement is signed under penalty of perjury. False statements expose the signing officer to perjury liability and the employer to substantial civil penalties.

## Filing deadlines

Initial EPRC applications were rolled out on a phased schedule from 2022 through 2024. Most in-scope Illinois employers now operate on the two-year recertification cycle. The recertification due date is two years from the prior certificate's issuance, and IDOL sends notice approximately 90 days before the deadline. Late filing produces a \\$2,500 penalty per violation, escalating to \\$10,000 per violation for ongoing non-compliance.

## Public disclosure and FOIA exposure

EPRC submission data is subject to FOIA exposure with redactions. The wage records themselves are exempt from disclosure under IDOL guidance, but **aggregate statistics** derived from the data set — average compensation by job category, sex, and race — are public. Some advocacy organizations have filed FOIA requests for aggregate compensation statistics by employer industry, and IDOL has produced data sets that allow comparison across employers in the same NAICS segment.

This is the indirect enforcement pressure the EPRC creates. An employer whose EPRC data shows persistent compensation gaps within job categories that cannot be explained by the IEPA's enumerated factors becomes a candidate for IDOL audit and IDHR pay-equity charges by individual claimants.

## How this touches background screening

The EPRC does not directly require background-screening data. The connection is operational: most CRAs running employment verifications collect compensation data as a standard field, and Illinois's salary-history ban (covered in our [Illinois salary-history guide](/blog/illinois-salary-history-ban-employer-guide)) constrains how that data can be used. Employers running EPRC compliance simultaneously with verification workflows need to ensure compensation data captured during verification is not relied on in offer-setting, and that the EPRC data submission is built from payroll records rather than from the verification-derived data.

## Audit posture

IDOL conducts EPRC audits on a risk-prioritized basis. The audit selection drivers include FOIA-derived complaints, Title VII charges filed by EEOC against the employer, IDHR conviction-record charges (because they trigger broader compliance review), and random selection. The audit reviews the wage records submitted, the signed compliance statement, and the employer's underlying pay-setting documentation.

The two failure modes IDOL flags most often: **wage-record mismatches** between the EPRC submission and the employer's payroll system, suggesting the EPRC data was constructed rather than extracted; and **unsupported compliance statements** where the signed attestation is not backed by a documented internal pay-equity audit. A defensible 2026 program runs an internal pay-equity audit before the compliance statement is signed and retains the audit documentation as the audit-defense backbone.

## How to operationalize

Three steps. First, **calendar the recertification** date in the corporate compliance calendar 120 days out. Second, **build the data extract** from payroll and HRIS rather than from CRA verification data. Third, **run an internal pay-equity audit** with documented methodology before the corporate officer signs the compliance statement. Our [Illinois salary-history guide](/blog/illinois-salary-history-ban-employer-guide), [JOQAA guide](/blog/illinois-joqaa-background-checks), and [federal EEO-1 reporting guide](/blog/eeoc-eeo1-component-1-reporting) cover the connected pieces. Pricing for the relevant CRA package is on [pricing](/pricing); program-build conversations start at [contact](/contact).`,
};
