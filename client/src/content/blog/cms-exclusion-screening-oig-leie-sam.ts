import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "cms-exclusion-screening-oig-leie-sam",
  title: "CMS Exclusion Screening: OIG LEIE, SAM.gov, and State Medicaid Lists",
  metaTitle: "CMS Exclusion Screening Guide OIG LEIE SAM 2026",
  metaDescription:
    "CMS requires monthly screening against OIG LEIE, SAM.gov, and state Medicaid sanction lists. Here is how to run the program defensibly in 2026.",
  excerpt:
    "CMS requires healthcare providers to screen every employee and contractor monthly against the OIG LEIE, SAM.gov debarment list, and state Medicaid sanction lists. Here is the 2026 program playbook.",
  publishedAt: "2025-10-06",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["healthcare", "sanctions", "compliance"],
  body: `Every healthcare provider receiving Medicare or Medicaid reimbursement faces a federal duty to screen employees and contractors against three exclusion databases: the **OIG List of Excluded Individuals and Entities (LEIE)**, the **SAM.gov System for Award Management** debarred-and-excluded list, and the relevant **state Medicaid exclusion lists**. The duty is not a one-time pre-hire check; CMS treats it as an ongoing monthly obligation, and a single missed screen can result in payment denials, civil money penalties under 42 U.S.C. §1320a-7a, and recoupment of paid claims attributable to the excluded individual. Here is the 2026 program playbook.

## What the three databases actually contain

The **OIG LEIE** is the master federal exclusion list maintained by the HHS Office of Inspector General. It identifies individuals and entities excluded from participation in Medicare, Medicaid, and all federal healthcare programs. Exclusion can be **mandatory** (under 42 U.S.C. §1320a-7(a) — convictions for healthcare-related crimes, patient abuse, felony controlled-substance offenses) or **permissive** (§1320a-7(b) — broader bases including misdemeanor healthcare fraud, license revocation, and default on health-education loans). The LEIE is updated monthly and published as a downloadable file plus a real-time search interface at oig.hhs.gov.

The **SAM.gov debarment list** is the broader federal exclusion repository covering not just healthcare but procurement and contracting across all federal agencies. SAM contains exclusions imposed by the GSA, DOJ, OFAC, FDA, and dozens of other agencies. Healthcare providers screen SAM because some healthcare-relevant exclusions surface in SAM but not in LEIE — particularly contractor and entity-level debarments.

**State Medicaid exclusion lists** are maintained separately by each state Medicaid agency. As of 2026, all fifty states publish their own lists, and CMS's State Medicaid Director Letter 09-001 requires providers to screen against the state list in **every state where the provider operates** plus every state where any employee or contractor maintains a license. A multi-state hospital system therefore screens against many state lists, not one.

## The monthly screening duty

CMS State Medicaid Director Letters 08-003, 09-001, and 14-003 establish that providers must screen all employees, vendors, and contractors **at hire and monthly thereafter**. The frequency is not optional. The OIG's [Special Advisory Bulletin on the Effect of Exclusion](https://oig.hhs.gov/exclusions/files/sab-05092013.pdf) makes clear that a provider's failure to identify and remove an excluded individual results in liability for any federal healthcare program payment attributable to items or services furnished by that individual.

Most providers automate the screening through a third-party service or a CRA-administered exclusion-monitoring program. The automation is not just cost-driven — the manual workflow of cross-referencing every state list every month for a workforce of any size is impractical, and manual workflows fail in the boundary cases (similar names, common names, name changes after marriage) that account for most enforcement findings.

## Match adjudication

The hardest part of exclusion screening is not running the search but adjudicating the matches. A typical hospital workforce produces dozens of "potential matches" per month — same name, similar SSN, overlapping address — that require manual review to confirm or rule out. A defensible provider program documents every match adjudication: the database that returned the hit, the candidate's identifying information, the matching record's identifying information, and the basis for the conclusion.

Two adjudication errors recur. The first is **false positive acceptance**: treating a name match as confirmation without verifying SSN or DOB, leading to an unwarranted termination. The second is **false negative dismissal**: assuming a name match is coincidental without documenting the basis for the dismissal, leading to liability if the match was real. Documentation is the entire defense.

## Contractor and downstream relationship screening

CMS exclusion screening duties extend beyond W-2 employees to **contractors, vendors, and any individual or entity that furnishes items or services to federal healthcare program beneficiaries**. The scope includes locum tenens physicians, agency nurses, billing companies, transcription services, durable medical equipment vendors, transportation contractors, and food-service vendors that touch federal programs. Most providers struggle most with vendor-side screening — the program for direct employees is usually robust while the program for indirect relationships is often gap-ridden.

A defensible 2026 program: contract terms with every vendor require the vendor to screen *its* workforce, certify monthly compliance, and indemnify the provider for any exclusion that surfaces. The provider supplements with quarterly attestation review and annual on-site compliance verification for high-risk vendor categories.

## Interaction with [Joint Commission](/blog/joint-commission-hr-standards) and [NPDB](/blog/npdb-national-practitioner-data-bank)

Exclusion screening is one of three required pre-employment data sources for healthcare providers operating under Joint Commission accreditation. The other two are the [NPDB](/blog/npdb-national-practitioner-data-bank) for practitioner credentialing and the [Joint Commission HR.01.02.01–.05 standards](/blog/joint-commission-hr-standards) for non-practitioner staff. The three programs run in parallel — exclusion screening is monthly, NPDB queries are at credentialing and reappointment, HR standards govern initial competency assessment. A defensible healthcare HR program covers all three, with documented procedures for each.

## The cost of getting it wrong

In 2024, OIG settlements with providers for exclusion-related violations averaged more than \\$1.2 million per case, with several settlements exceeding \\$10 million. The cost of running a compliant monthly exclusion-screening program — typically **\\$1.50–4.00** per employee per month at small-system volume — is a tiny fraction of the cost of a single CMS recoupment action. Our [healthcare industry brief](/industries/healthcare) covers the full healthcare compliance stack including exclusion screening.`,
};
