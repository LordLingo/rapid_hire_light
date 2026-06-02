import type { BlogPost } from "@/lib/blog";

/*
  §217 — Georgia employer background-check compliance guide.

  Statutory backbone:
    - O.C.G.A. §35-3-34 (Georgia Crime Information Center disclosure of
      criminal history records to private persons/businesses; consent +
      fingerprint or name/DOB rules; "GCIC" access)
    - O.C.G.A. §35-3-34(b.1) (use of GCIC criminal history records in
      hiring; written notice + copy-to-applicant duty when an adverse
      decision is based in whole or in part on the record)
    - O.C.G.A. §42-8-60 et seq. (First Offender Act — discharge and
      exoneration; a successfully completed first-offender sentence is
      NOT a conviction and may not be used to disqualify)
    - O.C.G.A. §42-8-62.1 (sealing/restriction of first-offender records
      from public inspection on successful completion)
    - O.C.G.A. §35-3-37 (record restriction / "expungement" of arrests
      that did not lead to conviction; 2013 reform)
    - O.C.G.A. §17-10-1 / §17-3-3 / SB 288 (2020) — expanded record
      restriction and sealing for certain misdemeanor convictions
    - Georgia Executive Order (Gov. Deal, Feb. 23, 2015) — "ban the box"
      for state-agency employment: removes the conviction question from
      the initial application for executive-branch agencies (does NOT
      bind private employers)
    - FCRA 15 U.S.C. §1681b(b) / §1681m — federal disclosure,
      authorization, and adverse-action overlay that sits on top of
      Georgia law for any employer using a CRA
*/

export const post: BlogPost = {
  slug: "georgia-employer-background-check-compliance-guide",
  title:
    "Georgia employer background check compliance: GCIC access, First Offender Act, and record restriction",
  metaTitle: "Georgia Background Check Compliance Guide",
  metaDescription:
    "Georgia background checks turn on GCIC access rules (O.C.G.A. §35-3-34), the First Offender Act, and SB 288 record restriction. Here's how employers stay compliant.",
  excerpt:
    "Georgia has no private-sector ban-the-box law, but GCIC access rules, the First Offender Act, and SB 288 record restriction quietly constrain how employers can screen. A practical map.",
  publishedAt: "2026-06-02",
  readingMinutes: 6,
  author: "Rapid Hire Compliance Team",
  tags: ["georgia", "criminal-records", "fair-chance", "compliance", "state-laws"],

  body: `Georgia is often described as an employer-friendly screening state, and at the surface level that is true: there is no statewide private-sector ban-the-box statute, no salary-history ban, and no general "fair chance" mandate binding private companies. But that reputation lulls out-of-state hiring teams into a false sense of simplicity. Three distinct bodies of Georgia law — the Georgia Crime Information Center access rules under O.C.G.A. §35-3-34, the First Offender Act, and the record-restriction reforms culminating in SB 288 — quietly reshape what an employer may pull, consider, and act on. This guide maps each one and shows how they stack on top of the federal FCRA layer every employer already carries.

## GCIC access: how Georgia controls the criminal-history pull

The Georgia Crime Information Center (GCIC) is the state's central repository for criminal history record information, and O.C.G.A. §35-3-34 governs when a private person or business may obtain those records. An employer (or its consumer reporting agency) generally needs the applicant's signed consent, plus identifying information — a name and date of birth for a name-based search, or fingerprints for a fingerprint-based search, which is the more reliable of the two. Critically, O.C.G.A. §35-3-34(b.1) imposes a state-law notice duty that exists independently of the federal adverse-action sequence: when an employer makes an adverse hiring decision based in whole or in part on a GCIC criminal history record, it must notify the applicant and, on request, provide a copy of the record and disclose the specific contents relied upon. Employers running checks through a CRA should treat this as additive to — not a substitute for — the [FCRA pre-adverse and adverse-action letter sequence](/blog/adverse-action-letter-fcra-template).

## The First Offender Act: discharged cases are not convictions

The most common Georgia-specific mistake is treating a First Offender disposition as a conviction. Under O.C.G.A. §42-8-60 and following, a defendant sentenced as a first offender who successfully completes the sentence is discharged without an adjudication of guilt, and the statute is explicit that the discharge "completely exonerates" the person and is not a conviction. O.C.G.A. §42-8-62.1 further provides for restricting and sealing those records from public inspection upon successful completion. For employers this means a properly completed first-offender matter generally cannot be used as a disqualifying conviction, and an adverse decision premised on it invites liability. Because national-database aggregators frequently lag behind these state dispositions, employers should never rely on a database hit alone — a point we make in our breakdown of [county-level versus national database searches](/blog/county-vs-national-criminal-background-check).

## Record restriction and SB 288: a shrinking pool of usable records

Georgia's 2013 record-restriction reform (O.C.G.A. §35-3-37) limited public access to arrests that did not lead to conviction, and the 2020 Second Chance law, SB 288, went considerably further by allowing restriction and sealing of certain misdemeanor convictions after a waiting period. The practical effect is that the universe of lawfully usable records keeps shrinking, and a record that surfaced on a screen two years ago may now be restricted. Employers should build a refresh discipline into any program that relies on stale reports and should be cautious about adjudicating against records that may have since been sealed. Pairing each criminal-records pull with a documented job-relatedness rationale — the same targeted-screen logic the EEOC expects nationwide — keeps Georgia screening defensible; our [ban-the-box and fair-chance overview](/blog/ban-the-box-fair-chance-hiring) walks through that analysis in detail.

## Building a Georgia-compliant program

A clean Georgia workflow runs: FCRA-compliant standalone disclosure and authorization; a GCIC or county criminal-records pull through a reputable CRA; a check for First Offender and record-restriction status before any record is treated as disqualifying; a documented job-relatedness assessment; and, where an adverse decision is based on a GCIC record, the §35-3-34(b.1) notice delivered alongside the federal adverse-action letters. Public-sector and state-agency employers also carry the 2015 executive-order ban-the-box obligation that removes the conviction question from the initial application, though that order does not bind private companies. Whether you hire in metro Atlanta or across rural counties, the safest posture treats Georgia's permissive surface as a floor, not a ceiling. Our team builds and audits these programs against current statutes every day; see how we [structure compliance-grade screening](/compliance) or [tell us about your Georgia hiring footprint](/contact) and we will map the sequence to your roles.`,
};
