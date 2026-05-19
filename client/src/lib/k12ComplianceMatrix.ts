/*
  K-12 employment-screening compliance matrix (§152)
  --------------------------------------------------
  Reference-only summary of state-mandated background-check obligations for
  K-12 public school district employees, plus a small set of federal layers
  that apply nationally. Not legal advice — every district should validate
  its own posture with counsel before changing process.

  Each row captures the four facts a school-district HR director needs at
  a glance:
    - fingerprintRequired:  Does the state require fingerprint-based FBI/CHRI?
    - reFingerprintCadence: How often (if at all) does state law require re-prints?
    - volunteerCoverage:    Does the same standard apply to volunteers + contractors?
    - tieredOffenseHandling: Are there statutory permanent-bar offense tiers vs.
                              discretionary review tiers? (e.g. FL Jessica Lunsford Act)
    - statute:              Primary statute / act citation.
    - notes:                Anything unusual — re-prints during transfer, rap-back
                              subscriptions, ESSA §8546 lookback obligations, etc.

  States are picked by combined K-12 employment headcount and population (CA,
  TX, NY, FL, IL, PA, OH, GA, NC, MI) — together they cover ~58% of the
  national public K-12 workforce.
*/

export interface K12StateRow {
  /** Two-letter postal code. */
  code: string;
  /** Full state name. */
  state: string;
  /** Does state law require fingerprint-based FBI/CHRI for all certificated employees? */
  fingerprintRequired: "Required" | "Required for some roles" | "Not required";
  /** Recurring re-print cadence required by state law (or "On hire only"). */
  reFingerprintCadence: string;
  /** Whether the same standard extends to volunteers + contractors. */
  volunteerCoverage: "Yes" | "Partial" | "Local discretion";
  /** Does the state codify offense tiers with statutory permanent bars? */
  tieredOffenseHandling: "Yes" | "No";
  /** Primary statute citation. */
  statute: string;
  /** Any operational nuance worth surfacing. */
  notes: string;
}

export const K12_COMPLIANCE_MATRIX: readonly K12StateRow[] = [
  {
    code: "CA",
    state: "California",
    fingerprintRequired: "Required",
    reFingerprintCadence: "On hire + on transfer between districts",
    volunteerCoverage: "Yes",
    tieredOffenseHandling: "Yes",
    statute: "Cal. Ed. Code §44830.1 + §45122.1",
    notes:
      "Statutory permanent bars for serious/violent felonies; CDE Commission on Teacher Credentialing also runs parallel character-and-fitness review on credential applicants.",
  },
  {
    code: "TX",
    state: "Texas",
    fingerprintRequired: "Required",
    reFingerprintCadence: "Continuous via DPS rap-back subscription",
    volunteerCoverage: "Partial",
    tieredOffenseHandling: "Yes",
    statute: "Tex. Ed. Code §22.0832 + §22.085 (SB 9)",
    notes:
      "TX DPS subscribes districts to ongoing FBI rap-back so arrests post-hire generate an alert without an annual re-print cycle. SB 9 expanded coverage to contractors with direct student contact.",
  },
  {
    code: "NY",
    state: "New York",
    fingerprintRequired: "Required",
    reFingerprintCadence: "On hire + when moving to a covered role",
    volunteerCoverage: "Local discretion",
    tieredOffenseHandling: "No",
    statute: "NY Ed. Law §§3035 + 3004-b (SAVE Act)",
    notes:
      "SAVE Act vests Commissioner of Education with conditional-approval review; districts cannot make a permanent-hire decision until NYSED clears the candidate's print results.",
  },
  {
    code: "FL",
    state: "Florida",
    fingerprintRequired: "Required",
    reFingerprintCadence: "Every 5 years (Jessica Lunsford Act re-screen)",
    volunteerCoverage: "Yes",
    tieredOffenseHandling: "Yes",
    statute: "Fla. Stat. §1012.32 + §1012.467 (Jessica Lunsford Act)",
    notes:
      "Level 2 screening (state + FDLE + FBI prints) required for all instructional + non-instructional employees AND contractors with on-campus access. Statute enumerates 50+ permanent-bar offenses.",
  },
  {
    code: "IL",
    state: "Illinois",
    fingerprintRequired: "Required",
    reFingerprintCadence: "On hire only",
    volunteerCoverage: "Partial",
    tieredOffenseHandling: "Yes",
    statute: "105 ILCS 5/10-21.9 + 5/21B-80",
    notes:
      "Statutory bar for enumerated sex offenses + drug-trafficking convictions; ISBE also maintains an investigator-driven re-review docket for licensed educators.",
  },
  {
    code: "PA",
    state: "Pennsylvania",
    fingerprintRequired: "Required",
    reFingerprintCadence: "Every 5 years (Act 153 of 2014)",
    volunteerCoverage: "Yes",
    tieredOffenseHandling: "Yes",
    statute: "23 Pa. C.S. §6344 + Act 153 of 2014",
    notes:
      "Three-clearance stack: PA State Police criminal record, PA Child Abuse History, and FBI fingerprint — all three required and all three on a 5-year re-clearance cadence.",
  },
  {
    code: "OH",
    state: "Ohio",
    fingerprintRequired: "Required",
    reFingerprintCadence: "Every 5 years (BCI + FBI re-prints)",
    volunteerCoverage: "Local discretion",
    tieredOffenseHandling: "Yes",
    statute: "Ohio Rev. Code §3319.39 + §3319.391",
    notes:
      "BCI + FBI prints required for every district employee with student contact; statute lists 30+ permanent-bar offenses. Re-print cycle aligned with educator license renewal.",
  },
  {
    code: "GA",
    state: "Georgia",
    fingerprintRequired: "Required",
    reFingerprintCadence: "On hire only",
    volunteerCoverage: "Local discretion",
    tieredOffenseHandling: "Yes",
    statute: "O.C.G.A. §20-2-211.1",
    notes:
      "PSC (Professional Standards Commission) maintains parallel ethics docket that can act on post-hire conduct without a new fingerprint event.",
  },
  {
    code: "NC",
    state: "North Carolina",
    fingerprintRequired: "Required for some roles",
    reFingerprintCadence: "On hire only",
    volunteerCoverage: "Local discretion",
    tieredOffenseHandling: "No",
    statute: "N.C. Gen. Stat. §115C-332",
    notes:
      "Statute requires criminal-history check (not specifically fingerprint) for licensed personnel; districts may impose fingerprint requirements via board policy.",
  },
  {
    code: "MI",
    state: "Michigan",
    fingerprintRequired: "Required",
    reFingerprintCadence: "Continuous via MSP rap-back subscription",
    volunteerCoverage: "Partial",
    tieredOffenseHandling: "Yes",
    statute: "Mich. Comp. Laws §380.1230 + §380.1230d",
    notes:
      "Statutory permanent bars for listed offenses; MSP rap-back surfaces post-hire arrests automatically. Substitute teachers and contractors with regular contact also covered.",
  },
] as const;

/** Federal layers that apply nationally regardless of state law. */
export interface FederalLayer {
  id: string;
  title: string;
  citation: string;
  body: string;
}

export const K12_FEDERAL_LAYERS: readonly FederalLayer[] = [
  {
    id: "adam-walsh",
    title: "Adam Walsh Child Protection and Safety Act",
    citation: "42 U.S.C. §16901 et seq. (2006)",
    body:
      "Federal sex-offender registry coordination + statutory minimum screening for federally funded child-care programs. Sets a national floor every district sits on top of.",
  },
  {
    id: "essa-8546",
    title: "ESSA §8546 — Employment-history verification",
    citation: "20 U.S.C. §7926",
    body:
      "Prohibits federally funded LEAs from assisting employees who have engaged in sexual misconduct with a minor to obtain a new position — requires districts to verify the candidate's prior employment doesn't carry an unresolved disciplinary finding before hire.",
  },
  {
    id: "fcra",
    title: "Fair Credit Reporting Act (FCRA)",
    citation: "15 U.S.C. §1681 et seq.",
    body:
      "When a district uses a third-party CRA (like Rapid Hire) to assemble the background report, the federal disclosure + standalone authorization + pre-adverse-action + adverse-action sequence applies in addition to any state statute.",
  },
  {
    id: "title-vii",
    title: "Title VII disparate-impact framework",
    citation: "EEOC Enforcement Guidance, 2012",
    body:
      "Even where state statute permits or requires consideration of a conviction, the EEOC expects individualized assessment covering the nature of the offense, time elapsed, and the nature of the role before a decision becomes adverse.",
  },
] as const;

/** Lightweight derived counts used by the page hero / coverage card. */
export function k12MatrixCounts(): {
  states: number;
  fingerprintRequiredStates: number;
  rapBackStates: number;
  tieredBarStates: number;
} {
  return {
    states: K12_COMPLIANCE_MATRIX.length,
    fingerprintRequiredStates: K12_COMPLIANCE_MATRIX.filter(
      (r) => r.fingerprintRequired === "Required",
    ).length,
    rapBackStates: K12_COMPLIANCE_MATRIX.filter((r) =>
      /rap-back|continuous/i.test(r.reFingerprintCadence),
    ).length,
    tieredBarStates: K12_COMPLIANCE_MATRIX.filter(
      (r) => r.tieredOffenseHandling === "Yes",
    ).length,
  };
}
