import type { BlogPost } from "@/lib/blog";

/*
  §220 — Texas employer background-check compliance guide.

  Statutory backbone:
    - Tex. Gov't Code ch. 411, subch. F (§§411.081 et seq.) — Texas
      Department of Public Safety (DPS) Crime Records Service; the
      Computerized Criminal History (CCH) system and the Fingerprint-based
      Applicant Clearinghouse of Texas (FACT) program for authorized
      employers/licensing entities
    - Tex. Gov't Code §411.084 / §411.087 — restrictions on dissemination
      and secondary use of CCH criminal history record information
    - Tex. Gov't Code §411.135 — public's right to obtain conviction and
      deferred-adjudication CCH records (DPS public site)
    - Tex. Bus. & Com. Code ch. 20 — Texas regulation of consumer reporting
      agencies; §20.05 seven-year reporting limit on certain adverse items
      for reports tied to jobs paying under $75,000
    - Tex. Gov't Code ch. 411, subch. E-1 (§411.0716 et seq.) / Tex. Gov't
      Code §552.142 + §411.0851 — order of nondisclosure of criminal history
      (record sealing); an employer generally may not be denied a license or
      employment based on a sealed/nondisclosed record
    - Tex. Lab. Code §21.051 — Texas Commission on Human Rights Act
      (employment discrimination; disparate-impact overlay mirroring Title VII)
    - Tex. Civ. Prac. & Rem. Code ch. 142 — negligent-hiring cause of action
      and the §142.002 limited liability protection for employers who hire
      people with criminal records
    - FCRA 15 U.S.C. §1681b(b) / §1681m — federal disclosure, authorization,
      and adverse-action overlay that sits on top of Texas law

  NOTE: Texas has no statewide private-sector ban-the-box law; Austin's
  Fair Chance Hiring Ordinance (Austin City Code ch. 4-15) is the notable
  municipal exception, applying to private employers with 15+ employees
  inside Austin city limits.
*/

export const post: BlogPost = {
  slug: "texas-employer-background-check-compliance-guide",
  title:
    "Texas employer background check compliance: DPS records, the seven-year rule, and Austin's Fair Chance ordinance",
  metaTitle: "Texas Background Check Compliance Guide",
  metaDescription:
    "Texas background checks turn on DPS records access, the chapter 20 seven-year reporting cap, nondisclosure orders, and Austin's Fair Chance ordinance. A compliance map.",
  excerpt:
    "Texas is widely seen as employer-friendly, but DPS access rules, the chapter 20 seven-year reporting cap, record-sealing orders, and Austin's Fair Chance ordinance quietly constrain how you can screen. A practical map.",
  publishedAt: "2026-06-03",
  readingMinutes: 6,
  author: "Rapid Hire Compliance Team",
  tags: ["texas", "criminal-records", "fair-chance", "compliance", "state-laws"],

  body: `Texas enjoys a reputation as one of the most employer-friendly states in the country, and at the headline level the reputation holds: there is no statewide private-sector ban-the-box statute, no salary-history ban binding private companies, and no general fair-chance mandate at the state level. Yet that permissive surface masks four distinct constraints that reshape how Texas employers may obtain, retain, and act on criminal-history information — the Department of Public Safety access rules under Chapter 411 of the Government Code, the Chapter 20 seven-year reporting cap on consumer reports, the growing pool of records sealed by orders of nondisclosure, and Austin's municipal Fair Chance Hiring Ordinance. Layered on top sits the federal FCRA, which every employer using a consumer reporting agency already carries. This guide maps each one.

## DPS Crime Records: how Texas controls the criminal-history pull

The Texas Department of Public Safety (DPS) maintains the state's Computerized Criminal History (CCH) system through its Crime Records Service, governed by Subchapter F of Chapter 411 of the Government Code. Members of the public can obtain conviction and deferred-adjudication records through the DPS public site under Government Code §411.135, but employers in regulated sectors more often access the fingerprint-based Applicant Clearinghouse of Texas (FACT) program, which requires statutory or regulatory authorization tied to a specific license or role. Government Code §§411.084 and 411.087 sharply restrict secondary dissemination of CCH data — an authorized recipient generally cannot pass the record to a third party or reuse it outside the purpose for which access was granted. Employers running checks through a CRA should treat these state rules as additive to, not a replacement for, the [FCRA disclosure and authorization sequence](/blog/fcra-604b-disclosure-authorization) that governs every consumer report.

## The seven-year rule: Texas's own reporting cap

Texas does not simply mirror the federal FCRA; it adds its own consumer-reporting limits through Chapter 20 of the Business and Commerce Code. Under §20.05, a consumer reporting agency generally may not report records of arrest, indictment, or conviction of a crime that predate the report by more than seven years when the report is used in connection with a job paying less than $75,000 annually. This is narrower than many employers assume and frequently stricter than the underlying FCRA, which caps non-conviction items at seven years but does not cap convictions for higher-paying roles. The practical takeaway is that Texas employers cannot rely on a national database dump alone; they must confirm their CRA is applying the correct lookback, a point we develop in our breakdown of [county-level versus national database searches](/blog/county-vs-national-criminal-background-check).

## Orders of nondisclosure: a shrinking pool of usable records

Texas has steadily expanded its record-sealing regime through orders of nondisclosure, codified across Subchapter E-1 of Chapter 411 and reinforced by Government Code §552.142. When a court grants an order of nondisclosure, the record is sealed from public release, and the statute provides that the person may lawfully deny the underlying arrest or offense in most employment contexts. Because national aggregators routinely lag behind these sealing orders, a record that surfaced on a screen two years ago may now be legally off-limits, and adjudicating against it invites liability. Employers should build a refresh discipline into any program that relies on older reports and should pair every criminal-records pull with a documented job-relatedness rationale — the same targeted-screen logic the EEOC expects nationwide and that we walk through in our [ban-the-box and fair-chance overview](/blog/ban-the-box-fair-chance-hiring).

## Austin's Fair Chance ordinance and negligent-hiring protection

The most consequential Texas-specific trap for multistate employers is municipal. Austin's Fair Chance Hiring Ordinance (City Code chapter 4-15) applies to private employers with at least fifteen employees inside Austin city limits and prohibits asking about criminal history on the initial application or before a conditional offer, along with an individualized-assessment duty before withdrawing an offer over a record. No other Texas city imposes an equivalent private-sector mandate, so a single statewide policy will either over-comply everywhere or violate the ordinance in Austin. On the other side of the ledger, Texas actually encourages second-chance hiring: Civil Practice and Remedies Code §142.002 limits an employer's negligent-hiring exposure for hiring a person with a criminal record, provided the offense was unrelated to the role. The Texas Commission on Human Rights Act (Labor Code §21.051) adds a disparate-impact overlay that mirrors Title VII.

A defensible Texas program therefore runs FCRA-compliant standalone disclosure and authorization, a DPS or county criminal-records pull through a reputable CRA applying the Chapter 20 seven-year cap, a check for nondisclosure-order status before any record is treated as disqualifying, a documented job-relatedness assessment, and Austin-specific sequencing for roles within city limits. Our team builds and audits these programs against current statutes every day; see how we [structure compliance-grade screening](/compliance) or [tell us about your Texas hiring footprint](/contact) and we will map the sequence to your roles.`,
};
