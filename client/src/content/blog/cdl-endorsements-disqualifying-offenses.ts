import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "cdl-endorsements-disqualifying-offenses",
  title: "CDL Endorsements and Disqualifying Offenses Under 49 CFR §383.51",
  metaTitle: "CDL Disqualifying Offenses Guide 49 CFR 383.51",
  metaDescription:
    "49 CFR §383.51 lists the offenses that disqualify a CDL holder from operating CMVs. The 2026 carrier guide to triggers, durations, and endorsements.",
  excerpt:
    "Federal regulation 49 CFR §383.51 lists the offenses that disqualify a CDL holder from operating commercial motor vehicles. Here is the 2026 carrier guide to disqualification triggers, durations, and how endorsements layer on additional screening.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["transportation", "dot", "compliance"],
  body: `Every motor carrier hiring CDL drivers operates against the federal disqualification matrix at [49 CFR §383.51](/blog/dot-driver-background-checks-mvr). The regulation lists offenses that automatically bar a CDL holder from operating a commercial motor vehicle, the duration of each disqualification, and the specific endorsement-related rules that layer on top. Understanding the matrix is essential — a hiring manager who misreads §383.51 either rejects a qualified driver unnecessarily or hires a disqualified driver in violation of federal law. Here is the 2026 carrier guide.

## The structure of §383.51

The disqualification matrix is organized into four tables. **Table 1** covers major offenses: DUI/DWI in any vehicle (CMV or personal), refusal of testing, leaving the scene of a crash, using a CMV in commission of a felony, and similar serious violations. **Table 2** covers serious traffic violations: excessive speeding (15 mph or more over the limit), reckless driving, improper lane change, and following too closely. **Table 3** covers railroad-highway grade crossing violations. **Table 4** covers out-of-service order violations.

Each table specifies a disqualification duration. A first-offense major violation under Table 1 disqualifies the driver from operating a CMV for **one year** (or three years if the offense involved haz-mat transport). A second offense disqualifies for life, with a possible reinstatement after ten years for some offense categories. The mathematical structure is unforgiving: a driver with two qualifying Table 1 offenses is permanently disqualified from CDL operations regardless of carrier preference.

## How disqualifications surface in screening

The §383.51 disqualification surfaces through three screening data sources. The **MVR** shows traffic convictions including the underlying offense codes; an experienced reviewer can map state offense codes to §383.51 categories. The **[PSP report](/blog/fmcsa-psp-pre-employment-screening-program)** shows roadside inspection violations including out-of-service orders that trigger Table 4 disqualifications. And the **state DMV record** shows administrative actions including license suspensions and revocations.

A typical adjudication error: reviewing only the MVR and missing a §383.51-relevant disposition that is recorded only in the state administrative file. Carriers should pull both the conviction MVR and the state CDL status report (sometimes called a "complete driving record" or "lifetime MVR" depending on the state) for any candidate where §383.51 exposure is plausible.

## Endorsement-specific screening adds

Beyond the §383.51 baseline, four CDL endorsements trigger additional screening obligations. **Hazardous materials (H endorsement)** requires a TSA Threat Assessment under [49 CFR §1572](https://www.tsa.gov/for-industry/hazmat-endorsement) — a federal background check that screens for terrorism-related offenses, espionage, and certain felony convictions during the prior seven years. The H endorsement assessment is **separate** from the carrier's own pre-employment screening and is not satisfied by a §391.51 driver-qualification file alone.

The **passenger (P) endorsement**, **school bus (S) endorsement**, and **tank vehicle (N) endorsement** do not trigger TSA screening but each adds skills-test requirements. The P and S endorsements, in particular, are often paired with state-level criminal-record screening for offenses against children — Pennsylvania's Child Protective Services Law disqualifications, for example, layer on top of §383.51 for any school-bus driver.

## Reciprocity and out-of-state convictions

A common carrier mistake is treating §383.51 as a state-by-state disqualification. It is not. The Commercial Motor Vehicle Safety Act and the State Procedures for Commercial Driver's License Tests at [49 CFR §384](https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-384) require each state to give full faith and credit to disqualifying convictions imposed by any other state. Practical effect: a Maryland CDL holder convicted of DUI in Virginia is disqualified in **all** states regardless of which state appears on the license, and the carrier hiring that driver has constructive notice of the disqualification.

The defensible carrier hiring practice: pull MVRs from every state of licensure during the prior three years, not just the current state of issuance. The CDLIS (Commercial Driver's License Information System) federal database centralizes this data, and most CRAs pull CDLIS by default when they pull a CDL MVR.

## Red flags that warrant follow-up

When the §383.51 review surfaces a borderline case — a Table 2 second offense within three years, an out-of-service order with unclear duration, a TSA Threat Assessment denial that the candidate is appealing — the right answer is rarely an immediate hiring withdrawal. The right answer is a documented [individualized assessment](/blog/eeoc-arrest-conviction-employer-guidance) under EEOC guidance, paired with confirmation of the disqualification status with the state CDL section. The §383.51 framework is federal but the underlying conviction data is administered at the state level, and surface readings sometimes misrepresent the actual disqualification window.

## The 2026 enforcement environment

FMCSA's 2026 enforcement priorities include more aggressive review of carriers that hire drivers with §383.51 disqualifications visible in CDLIS. The agency's New Entrant Safety Audit and biennial compliance review programs both check the carrier's DQ files against the federal data — and a §383.51 violation that the carrier should have caught is one of the most aggressively cited findings. A defensible hiring program in 2026 reads §383.51 carefully, queries CDLIS for every candidate, and documents the §383.51 review in the DQ file for FMCSA audit purposes. Our [transportation industry brief](/industries/transportation) covers the full CDL hiring stack including the §383.51 review.`,
};
