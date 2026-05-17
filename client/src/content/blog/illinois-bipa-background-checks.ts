import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "illinois-bipa-background-checks",
  title: "Illinois BIPA and Background Checks: Where Biometrics Meet Screening",
  metaTitle: "Illinois BIPA Background Check Compliance Guide 2026",
  metaDescription:
    "Illinois BIPA imposes per-violation statutory damages on employers collecting biometric identifiers. Here is how it intersects with background screening in 2026.",
  excerpt:
    "Illinois BIPA imposes per-violation statutory damages of \\$1,000 to \\$5,000 on employers who mishandle biometric identifiers. Here is where it intersects with background screening, and how to avoid class-action exposure.",
  publishedAt: "2026-04-03",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["illinois", "compliance"],
  body: `Illinois's **Biometric Information Privacy Act (BIPA)**, 740 ILCS 14, is the most aggressive biometric-privacy law in the United States. It imposes statutory damages of **\\$1,000 per negligent violation** and **\\$5,000 per intentional or reckless violation**, plus attorneys' fees, with no requirement that the plaintiff show actual harm. The Illinois Supreme Court's *Cothron v. White Castle* ruling in 2023 confirmed that violations accrue **per scan** rather than per individual, meaning a single non-compliant fingerprint timeclock scanned daily over five years can trigger statutory damages well above \\$1 million for a single employee. Employers who run background checks on Illinois applicants need to understand exactly where BIPA touches the screening workflow, because the screening adjacencies are where most BIPA findings hit.

## What BIPA actually regulates

BIPA covers two categories of data. **Biometric identifiers** are retina scans, iris scans, fingerprints, voiceprints, and scans of hand or face geometry. **Biometric information** is any information based on biometric identifiers used to identify an individual. The statute imposes five operational duties on any private entity that collects, captures, or otherwise obtains either category:

A written **public policy** establishing retention schedules and destruction guidelines. A **written informed-consent release** signed by the subject before collection. A prohibition on **selling, leasing, trading, or otherwise profiting** from biometric data. A prohibition on **disclosing** biometric data without consent except in narrow exceptions. A duty to **store, transmit, and protect** biometric data using the reasonable standard of care within the entity's industry.

## Where background checks touch BIPA

Most background screening workflows do **not** themselves collect biometric data. Name-and-DOB criminal searches, county criminal searches, employment verifications, and education verifications are not BIPA-covered. The BIPA exposure surfaces in three adjacencies:

**Fingerprint-based screening.** Some industries — financial services, healthcare, transportation, federal contracting — require fingerprint submission for FBI or state criminal-history checks (FCRA Section 627 / 28 CFR Part 16 channeling, or state-administered Live Scan). The fingerprint capture itself is BIPA-regulated. Employers using Live Scan vendors in Illinois must obtain BIPA-compliant written consent before fingerprint capture, separate from the FCRA disclosure.

**Onboarding biometric timeclocks.** Many employers deploy fingerprint or face-geometry timeclocks at onboarding. The capture is BIPA-regulated, and the consent must be obtained before the first scan. This is the source of most BIPA class actions.

**Identity-proofing during candidate authentication.** Some CRA workflows use voice biometrics or facial-comparison identity proofing during candidate self-service. Illinois candidates must consent to the biometric capture under BIPA terms before the workflow proceeds.

## The BIPA-compliant consent

A BIPA consent must do five things. **(1) Identify** the specific purpose of collection. **(2) Identify** the specific length of time the data will be stored. **(3) Be in writing** and signed by the subject. **(4) Be obtained before collection**, not after. **(5) Be separate from other notices** — courts have looked unfavorably on consents buried in onboarding packets or commingled with FCRA disclosures.

Most employer FCRA disclosures do **not** satisfy BIPA on their own. The federal FCRA disclosure under 15 U.S.C. §1681b(b)(2)(A) addresses consumer-report consent and must be standalone — it cannot serve as a vehicle for BIPA biometric consent. Employers in Illinois who require fingerprint screening must run two separate, simultaneous consents: an FCRA disclosure and authorization for the consumer report, and a BIPA notice and consent for the biometric capture.

## Retention and destruction

BIPA §15(a) requires every covered entity to publish a written retention and destruction policy and to destroy biometric data when "the initial purpose for collecting or obtaining such identifiers or information has been satisfied or within 3 years of the individual's last interaction with the private entity, whichever occurs first." For a fingerprint captured for a one-time pre-employment screen, the initial purpose is satisfied as soon as the screen completes. Holding the fingerprint beyond that point — by the employer or its CRA — creates per-day exposure. CRA contracts with Illinois employers should specify post-screening destruction with documented timestamps.

## Vendor flow-down

If an Illinois employer's CRA captures or stores biometric data on the employer's behalf, BIPA flows down. The employer's vendor contracts must require the CRA to comply with BIPA, indemnify the employer for vendor non-compliance, and produce destruction documentation on request. Employers who use a CRA for Live Scan submission should specifically verify the CRA's BIPA-compliant consent capture and retention policy.

## Class-action exposure

Plaintiffs' firms in Illinois have built a sustained BIPA practice. The largest reported settlements include the Facebook tag-suggest case at \\$650 million and the TikTok face-print case at \\$92 million, but the more common pattern is mid-market settlements of \\$10–50 million for fingerprint timeclock cases at single-employer scale. The math runs: 500 affected employees × 1,250 work days × \\$1,000 per scan = \\$625 million theoretical exposure, settled in practice at a fraction of that number after fee-cost modeling.

## What to fix today

Three steps. First, audit every screening adjacency that captures biometric data — fingerprints, face geometry, voice — and confirm BIPA-compliant consent is in place. Second, review the [FCRA disclosure](/blog/fcra-604b-disclosure-authorization) used for Illinois candidates and ensure BIPA consent is captured separately and simultaneously. Third, document retention and destruction with a written policy and verifiable destruction timestamps. Our [Illinois JOQAA guide](/blog/illinois-joqaa-background-checks) covers the parallel state criminal-record duty. For program-build help start at [contact](/contact); pricing is on [pricing](/pricing).`,
};
