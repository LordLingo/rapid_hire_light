import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "state-medicaid-exclusion-lists-by-state",
  title: "State Medicaid Exclusion Lists: A Provider's State-by-State Map",
  metaTitle: "State Medicaid Exclusion Lists Map for Providers",
  metaDescription:
    "All 50 states publish Medicaid exclusion lists, and CMS requires providers to screen against every state where they operate. Here is the 2026 map.",
  excerpt:
    "All 50 states publish Medicaid exclusion lists. CMS requires providers to screen them in every state of operation. Here is how the lists differ and why a national approach is essential.",
  publishedAt: "2026-05-15",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["sanctions", "healthcare", "compliance"],
  body: `Federal exclusion screening usually starts and ends in two places — the **OIG List of Excluded Individuals and Entities (LEIE)** and the **SAM.gov debarment list**. But CMS State Medicaid Director Letter 09-001 layers a third obligation on top: providers must screen workforce members and contractors against the **Medicaid exclusion list of every state where the provider operates**, plus every state where any employee or contractor maintains a license. As of 2026 all fifty states publish their own list, and the lists differ enough that a national hospital system or staffing firm cannot get by with the federal databases alone.

## Why state lists exist

Federal exclusions cover federal program ineligibility. State Medicaid exclusions cover state program ineligibility, and the two overlap only partially. A provider who is sanctioned by a state Medicaid agency for documentation fraud, license-board discipline, or convictions tied to controlled substances may appear on the state list but not on the federal LEIE — and vice versa. Roughly one in four state-only exclusions never make it to the federal list, according to the OIG's [Special Advisory Bulletin on the Effect of Exclusion](https://oig.hhs.gov/exclusions/files/sab-05092013.pdf).

## How the lists differ across states

States diverge on three operational dimensions. First, **publication format**. Some states publish a downloadable CSV updated monthly (Texas, Florida, New York). Some publish a search-only web page with no bulk export (Massachusetts, New Jersey). A handful require providers to register and authenticate before the list is accessible. Second, **identifier fields**. The federal LEIE includes name, NPI, address, exclusion type, and effective date. State lists vary; some omit NPI, some omit DOB, and a few publish only first/last name and a state license number, which makes adjudication harder. Third, **update cadence**. Most states update monthly, but some update quarterly and a few are irregular. The CMS expectation is monthly screening regardless of state update cadence.

## The fifty-state operational reality

A multi-state hospital system or staffing agency that treats federal screening as sufficient is exposed. Below is a representative — not exhaustive — view of how the largest state lists behave in 2026.

| State | List name | Typical update | Bulk export |
|-------|-----------|----------------|-------------|
| California | Medi-Cal Suspended and Ineligible Provider List | Monthly | CSV |
| Texas | OIG Exclusion Search | Monthly | CSV |
| Florida | AHCA Sanctioned Provider List | Monthly | CSV |
| New York | OMIG Exclusion List | Monthly | XLS |
| Illinois | HFS Provider Sanctions | Monthly | PDF/CSV |
| Pennsylvania | DHS Medicheck | Monthly | PDF |
| Ohio | ODM Provider Exclusion | Quarterly | Search only |
| Georgia | DCH Suspended Provider List | Monthly | CSV |
| Michigan | List of Sanctioned Providers | Monthly | PDF |
| North Carolina | DMA Provider Termination | Monthly | PDF |

Providers operating in fewer than five states can manage the workflow manually. Providers operating in ten or more states almost universally automate it through a CRA or a sanctions-monitoring vendor that aggregates all fifty state lists, normalizes the identifier fields, and runs daily or monthly checks against the workforce roster.

## Match adjudication is harder for state lists

State lists tend to produce more **false positives** than the federal LEIE because they often omit DOB and SSN. A nurse named "Maria Garcia" with a common license number prefix can return matches on multiple state lists that turn out to be other practitioners. A defensible adjudication workflow documents the database returning the hit, the exact identifier fields returned, and the basis for confirming or ruling out the match. False-positive acceptance — terminating a worker on a name match alone — and false-negative dismissal — assuming a name match is coincidental without documentation — are the two errors that produce litigation and CMS findings.

## Multi-state license adds a second screening trigger

CMS expects providers to screen the state list of **every state where the worker maintains a license**, not only the state of employment. A travel nurse holding active licenses in California, Nevada, and Arizona triggers screening in all three states regardless of which state she happens to be assigned to in a given month. Travel-nurse and locum-tenens vendors are the most common source of CMS findings on this point because the vendor and the placement provider often disagree about which entity owns the multi-state screening obligation. The contract language between provider and vendor should resolve this explicitly.

## How a CRA solves this

Running a fifty-state monthly check by hand is impractical above any meaningful headcount. A defensible 2026 program either uses a sanctions-monitoring service that ingests all fifty state lists or contracts with a [CRA whose healthcare package](/services) bundles federal LEIE, SAM.gov, and the relevant state Medicaid lists into a single monthly run. The CMS expectation is documentation: the provider must be able to produce, on audit, evidence of monthly screening against every applicable list with a documented adjudication for every match. Our [CMS exclusion-screening guide](/blog/cms-exclusion-screening-oig-leie-sam) and [healthcare industry brief](/industries/healthcare) walk through the program build for both small SNFs and national health systems. Pricing for the bundled monthly screen sits in the [pricing](/pricing) page.`,
};
