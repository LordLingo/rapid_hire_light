import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "fmcsa-drug-alcohol-clearinghouse",
  title: "FMCSA Drug and Alcohol Clearinghouse: Carrier Query and Reporting Duty",
  metaTitle: "FMCSA Drug Alcohol Clearinghouse Carrier Guide 2026",
  metaDescription:
    "FMCSA's Drug and Alcohol Clearinghouse requires every motor carrier to query and report on CDL driver violations. Here is the 2026 query, report, and audit playbook.",
  excerpt:
    "FMCSA's Drug and Alcohol Clearinghouse requires every motor carrier to query and report on CDL driver violations. Here is what is in the database, when to query, and how to handle a hit.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["dot", "transportation", "compliance"],
  body: `Since January 2020, every motor carrier hiring CDL drivers has been required to query and report through the **FMCSA Commercial Driver's License Drug and Alcohol Clearinghouse**. Established under [49 CFR Part 382 Subpart G](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-382/subpart-G), the Clearinghouse is the federal repository for DOT-regulated drug and alcohol violations involving CDL drivers — and the federal duty to query at hire, query annually, and report violations is one of the most aggressively audited carrier compliance obligations in 2026.

## What the Clearinghouse contains

The Clearinghouse captures four categories of records on CDL drivers:

- **Verified positive drug tests** — DOT-regulated tests conducted under [49 CFR Part 40](/blog/dot-drug-testing-49-cfr-part-40) and verified positive by a Medical Review Officer
- **Alcohol confirmation tests** at 0.04 BAC or higher
- **Refusals to test** — under §40.191 (drug) or §40.261 (alcohol), including failure to appear, leaving the testing site, and adulteration of a specimen
- **Actual knowledge** of on-duty drug or alcohol use as defined at [§382.107](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-382)

Each record identifies the driver, the type of violation, the date, the employer, and the [Substance Abuse Professional (SAP)](/blog/return-to-duty-dot-drivers-post-violation) status if the driver has begun the [return-to-duty](/blog/return-to-duty-dot-drivers-post-violation) process. The records are durable — a driver who tested positive in 2020 has a record that surfaces in any 2026 carrier query, regardless of intervening employment.

## The carrier query duty

Carriers are required to perform two types of Clearinghouse queries:

- A **pre-employment query** before hiring any CDL driver, at the time of conditional offer
- An **annual query** for every CDL driver in the carrier's fleet, on a calendar-year basis

The pre-employment query is a **full query** — it returns the full content of any Clearinghouse record on the driver. The annual query can be a **limited query** — it returns only whether information exists on the driver. If a limited query returns "information exists," the carrier must follow up within 24 hours with a full query.

Both query types require the driver's **electronic consent** through the Clearinghouse portal. The driver creates a Clearinghouse account, links it to their CDL, and provides specific consent for each carrier query. A driver who refuses consent cannot lawfully be hired or retained as a CDL driver — refusal is functionally a disqualification because the carrier cannot satisfy its query duty.

## The carrier reporting duty

When a carrier learns of a qualifying drug or alcohol violation by one of its drivers, the carrier must report the violation to the Clearinghouse **within three business days**. The reporting carrier identifies the driver, the violation type, the date, and the relevant testing program details. Reports are automated through the Clearinghouse portal and integrated with most carrier compliance management software.

A carrier that fails to report a qualifying violation within the three-day window is in violation of [§382.705](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-382). The violation is on the carrier's compliance record and is one of the most common audit findings in FMCSA New Entrant Safety Audits and biennial compliance reviews.

## How a Clearinghouse hit affects hiring

A pre-employment query that returns a Clearinghouse record means the prospective driver has at least one prior DOT drug or alcohol violation. The carrier's response depends on the **status of the driver's [Return-to-Duty (RTD) process](/blog/return-to-duty-dot-drivers-post-violation)**:

- If the driver has not initiated the RTD process, the carrier cannot lawfully employ the driver in a safety-sensitive function
- If the driver has begun RTD but has not completed it, the driver is **prohibited** from operating a CMV
- If the driver has completed RTD, the carrier may employ the driver but must implement the SAP-mandated follow-up testing program

The Clearinghouse record persists indefinitely — there is no automatic expiration of historic violations. A driver with a 2020 positive test who completed RTD in 2021 still appears in a 2026 query, with the record reflecting the completed RTD status.

## Integration with the §391.23 prior-employer investigation

The Clearinghouse query supplements but does not replace the [§391.23 prior-employer investigation](/blog/dot-driver-background-checks-mvr) that carriers must conduct on every new CDL driver. Under §391.23, the carrier must contact each of the driver's DOT-regulated employers from the prior three years and request the driver's drug and alcohol testing history. Pre-Clearinghouse, this was the only way to learn about prior violations; post-Clearinghouse, both data sources are required, and the carrier reconciles any inconsistencies.

A common reconciliation issue: a prior carrier reports a positive test through §391.23 but the violation is not yet in the Clearinghouse, or vice versa. The carrier should resolve the inconsistency through direct contact with the prior carrier and document the reconciliation in the [Driver Qualification (DQ) file](/blog/driver-qualification-file-checklist).

## Cost and operational integration

Clearinghouse queries cost **\\$1.25 per query** as of 2026. The annual query is typically scheduled through the carrier's compliance management software at a calendar-year cadence. The pre-employment query is integrated into the standard CDL hiring workflow alongside the [PSP report](/blog/fmcsa-psp-pre-employment-screening-program), [MVR](/blog/dot-driver-background-checks-mvr), and §391.23 prior-employer investigation.

A defensible 2026 carrier program: pre-employment query at conditional offer, annual query on a documented calendar-year schedule, three-business-day reporting of any qualifying violation, and complete documentation of every query and report in the DQ file. The query infrastructure is straightforward; the audit defense lives in the documentation. Our [transportation industry brief](/industries/transportation) covers the full DOT compliance stack including Clearinghouse integration.`,
};
