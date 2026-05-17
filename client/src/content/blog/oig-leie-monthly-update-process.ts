import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "oig-leie-monthly-update-process",
  title: "OIG LEIE Monthly Update Process: Inside the Federal Exclusion List",
  metaTitle: "OIG LEIE Monthly Update Process for Providers",
  metaDescription:
    "The OIG LEIE updates monthly. Here is how new exclusions are added, why old ones drop off, and how providers should run the monthly check defensibly.",
  excerpt:
    "The OIG LEIE updates on a fixed monthly cadence — but the data behind those updates flows through a process providers rarely see. Here is the inside view, and how to run a defensible monthly check.",
  publishedAt: "2026-01-12",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["sanctions", "healthcare", "compliance"],
  body: `The HHS Office of Inspector General publishes the **List of Excluded Individuals and Entities (LEIE)** as a downloadable file refreshed on or near the **fifth business day of every month**. The file is the master federal exclusion record for healthcare program participation, and CMS expects providers to screen against the most current version of it monthly. Most provider compliance officers know the cadence. Far fewer understand how the file is built — and that ignorance is what produces the boundary failures CMS auditors flag.

## How exclusions get on the LEIE

An OIG exclusion follows one of two paths. **Mandatory exclusions** under 42 U.S.C. §1320a-7(a) are triggered by four convictions: program-related crimes, patient abuse or neglect, felony healthcare-related fraud, and felony controlled-substance offenses. The minimum mandatory exclusion period is five years. The conviction is the trigger, and OIG must impose the exclusion once notice is received from the conviction court, the U.S. Attorney's Office, or the relevant state prosecutor.

**Permissive exclusions** under §1320a-7(b) cover the broader and more discretionary set: misdemeanor healthcare fraud, license revocation or suspension by a state licensing authority, exclusion from another federal or state healthcare program, default on health-education-loan obligations, and dozens of other bases. Permissive exclusions can run shorter than the mandatory five-year floor and require an OIG case file with documented findings.

In both paths, the exclusion runs through OIG's **Office of Counsel to the Inspector General (OCIG)** for adjudication, then to the LEIE production team for posting on the next monthly cycle. The lag between conviction and listing is typically 60–120 days.

## What the monthly file contains

The monthly LEIE bulk extract is published as a CSV with the following fields: **last name, first name, middle name, business name, general category, specialty, NPI, exclusion type (mandatory or permissive), exclusion authority (the statute subsection), exclusion date, last reinstatement date, address, city, state, ZIP**. There is also a "Reinstatement Update" file that documents the prior month's reinstatements and removals.

The reinstatement file matters more than most providers realize. An individual who completes the exclusion period and successfully petitions for reinstatement comes off the list — but only if reinstatement was actually granted. The OIG does not auto-reinstate. An excluded provider who simply waits out the exclusion period without filing a reinstatement application stays on the list forever. Programs that do not pull the reinstatement file alongside the main extract miss the corner case where a former employee successfully reinstates and is now eligible to rehire.

## How to run the monthly check

A defensible monthly LEIE check has four components. **(1) Pull the current file** from oig.hhs.gov within five business days of publication. **(2) Match the workforce roster** against name, DOB, and SSN where available. **(3) Adjudicate every potential match** — false positives are common because the LEIE often does not include DOB or SSN, leaving name as the only matching field. **(4) Document** the database, version date, identifier fields, candidate identifier, match reasoning, and conclusion.

Two failure modes recur. The first is **stale-file matching**: a program that pulls the file once and reuses the cached copy for several months until the next pull, missing every exclusion added in the interval. CMS recoupment letters from 2024 cite this gap repeatedly. The second is **incomplete roster**: the program screens W-2 employees but not contractors, locum tenens, or downstream vendor staff. CMS treats every individual or entity furnishing items or services to federal program beneficiaries as in scope.

## What happens when a hit lands

A confirmed LEIE match obligates the provider to take immediate action. The excluded individual must be removed from any role that touches federal program billing — patient care, claim coding, claim submission, supervision of program-funded services. The provider must also self-report any payments already made to or on behalf of the excluded individual under the **Self-Disclosure Protocol**. The OIG's [Special Advisory Bulletin](https://oig.hhs.gov/exclusions/files/sab-05092013.pdf) is explicit: continuing to employ a known excluded individual exposes the provider to civil money penalties of up to \\$10,000 per item or service, plus treble damages, plus assessment.

Self-disclosure of an exclusion-related issue typically reduces the multiplier the OIG demands at settlement. Many compliance officers underestimate this benefit and try to remediate without disclosing, which converts a manageable settlement into a much larger one when the issue surfaces through a contractor audit.

## How a CRA fits in

The monthly LEIE check is one of three federal screens — the other two are SAM.gov and the relevant state Medicaid lists. Most providers either run all three through a sanctions-monitoring service or fold them into a CRA's [healthcare screening package](/services) so the monthly run, the documentation, and the audit log live in one place. Our [CMS exclusion playbook](/blog/cms-exclusion-screening-oig-leie-sam), [state list map](/blog/state-medicaid-exclusion-lists-by-state), and [SAM.gov workflow](/blog/sam-gov-exclusion-check-workflow) walk through the parallel screens. Pricing is on [pricing](/pricing) and program-build conversations start at [contact](/contact).`,
};
