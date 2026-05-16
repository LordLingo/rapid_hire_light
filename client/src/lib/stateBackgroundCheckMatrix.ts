/**
 * §81 — 50-state employment-screening statute matrix.
 *
 * Reference dataset, not legal advice. Every row is anchored to a public statute
 * citation; cite the named statutes when validating in production. State laws
 * change; clients should re-verify before publishing employment policies.
 *
 * Used by:
 *   - /resources/background-checks-by-state (hub directory)
 *   - /resources/background-checks-by-state/<slug> (per-state detail pages)
 *
 * Schema:
 *   slug              — URL slug (kebab-case state name)
 *   name              — Display name
 *   abbr              — USPS two-letter code
 *   region            — Census region (used for grouping in hub UI)
 *   highlight         — true for the 13 pillar-detail states (CA TX NY FL IL PA OH GA NC MI NJ VA WA)
 *   sevenYearLookback — true if state caps non-conviction reporting at FCRA 7-year window
 *   banTheBox         — Public-employer | Private-employer | None
 *   salaryHistoryBan  — true | false (for hiring-flow context)
 *   marijuanaProtections — None | Off-duty use | Lawful-use protections | Recreational pre-employment limits
 *   keyStatutes       — Array of statutes that anchor the page citations
 */

export type StateRegion = "Northeast" | "Midwest" | "South" | "West";
export type BanTheBoxScope = "Public" | "Private" | "Public + Private" | "None";
export type MarijuanaTreatment =
  | "None"
  | "Off-duty use"
  | "Lawful-use protections"
  | "Pre-employment limits";

export interface StateRecord {
  slug: string;
  name: string;
  abbr: string;
  region: StateRegion;
  highlight: boolean;
  sevenYearLookback: boolean;
  banTheBox: BanTheBoxScope;
  salaryHistoryBan: boolean;
  marijuanaProtections: MarijuanaTreatment;
  keyStatutes: string[];
}

export const STATE_MATRIX: StateRecord[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Ala. Code § 11-80-15"] },
  { slug: "alaska", name: "Alaska", abbr: "AK", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Alaska Stat. § 12.62.160"] },
  { slug: "arizona", name: "Arizona", abbr: "AZ", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "Off-duty use", keyStatutes: ["AMMA A.R.S. § 36-2813"] },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Ark. Code Ann. § 21-15-101"] },
  { slug: "california", name: "California", abbr: "CA", region: "West", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Lawful-use protections", keyStatutes: ["Cal. Lab. Code § 432.7", "Cal. Civ. Code § 1786 (ICRAA)", "Cal. Gov. Code § 12952 (Fair Chance)", "AB 2188 (off-duty cannabis, 2024)"] },
  { slug: "colorado", name: "Colorado", abbr: "CO", region: "West", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "None", keyStatutes: ["Colo. Rev. Stat. § 8-2-130 (Chance to Compete)", "C.R.S. § 8-2-113"] },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", region: "Northeast", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Lawful-use protections", keyStatutes: ["Conn. Gen. Stat. § 31-51i", "Conn. Gen. Stat. § 21a-422a (Cannabis Adult Use)"] },
  { slug: "delaware", name: "Delaware", abbr: "DE", region: "South", highlight: false, sevenYearLookback: true, banTheBox: "Public", salaryHistoryBan: true, marijuanaProtections: "None", keyStatutes: ["19 Del. C. § 711"] },
  { slug: "florida", name: "Florida", abbr: "FL", region: "South", highlight: true, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Fla. Stat. § 435.04 (Level 2 screening)", "Fla. Stat. § 760.50 (HIV)"] },
  { slug: "georgia", name: "Georgia", abbr: "GA", region: "South", highlight: true, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["O.C.G.A. § 35-3-34", "O.C.G.A. § 35-3-37 (record restriction)"] },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", region: "West", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Pre-employment limits", keyStatutes: ["Haw. Rev. Stat. § 378-2.5"] },
  { slug: "idaho", name: "Idaho", abbr: "ID", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Idaho Code § 67-3008"] },
  { slug: "illinois", name: "Illinois", abbr: "IL", region: "Midwest", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Lawful-use protections", keyStatutes: ["820 ILCS 75 (Job Opportunities for Qualified Applicants Act)", "820 ILCS 55/10 (RTPA)", "410 ILCS 705 (Cannabis Reg. & Tax Act)"] },
  { slug: "indiana", name: "Indiana", abbr: "IN", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Ind. Code § 24-4-18-6"] },
  { slug: "iowa", name: "Iowa", abbr: "IA", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Iowa Code § 692.17"] },
  { slug: "kansas", name: "Kansas", abbr: "KS", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["K.S.A. § 22-4710"] },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", region: "South", highlight: false, sevenYearLookback: true, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["KRS § 367.310"] },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: true, marijuanaProtections: "None", keyStatutes: ["La. R.S. § 23:291.2 (BTB public)"] },
  { slug: "maine", name: "Maine", abbr: "ME", region: "Northeast", highlight: false, sevenYearLookback: false, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["5 M.R.S. § 4604", "26 M.R.S. § 628-A"] },
  { slug: "maryland", name: "Maryland", abbr: "MD", region: "South", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["Md. Code Ann. Lab. & Empl. § 3-1502 (Fair Chance Act)", "Md. Code Ann. Cts. & Jud. Proc. § 10-101"] },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", region: "Northeast", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["Mass. Gen. Laws ch. 151B § 4(9½)", "Mass. CORI § 6"] },
  { slug: "michigan", name: "Michigan", abbr: "MI", region: "Midwest", highlight: true, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "Off-duty use", keyStatutes: ["MCL § 37.2205a", "MRTMA Initiated Law 1 of 2018"] },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", region: "Midwest", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["Minn. Stat. § 364.021", "Minn. Stat. § 181.953 (drug & cannabis testing)"] },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Miss. Code Ann. § 45-27-12"] },
  { slug: "missouri", name: "Missouri", abbr: "MO", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "Lawful-use protections", keyStatutes: ["Mo. Rev. Stat. § 195.815", "Mo. Const. art. XIV § 2"] },
  { slug: "montana", name: "Montana", abbr: "MT", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Mont. Code Ann. § 39-2-208"] },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Neb. Rev. Stat. § 48-202"] },
  { slug: "nevada", name: "Nevada", abbr: "NV", region: "West", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Pre-employment limits", keyStatutes: ["Nev. Rev. Stat. § 613.530 (AB 132)", "NRS § 178A.205"] },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", region: "Northeast", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["N.H. Rev. Stat. § 651:5"] },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", region: "Northeast", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Lawful-use protections", keyStatutes: ["N.J.S.A. § 34:6B-11 (Opportunity to Compete)", "N.J.S.A. § 24:6I-52 (CREAMM Act)"] },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", region: "West", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: false, marijuanaProtections: "Off-duty use", keyStatutes: ["NMSA § 28-2-1 (Criminal Offender Employment Act)"] },
  { slug: "new-york", name: "New York", abbr: "NY", region: "Northeast", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Lawful-use protections", keyStatutes: ["N.Y. Correction Law Art. 23-A", "NYC Admin. Code § 8-107(11)(a) (Fair Chance Act)", "N.Y. Lab. Law § 201-d", "N.Y. Lab. Law § 201-i (Marijuana)"] },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", region: "South", highlight: true, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["N.C. Gen. Stat. § 14-208.6 (sex offender)", "N.C. Gen. Stat. § 95-25 (wage)"] },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["N.D.C.C. § 12-60-24"] },
  { slug: "ohio", name: "Ohio", abbr: "OH", region: "Midwest", highlight: true, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Ohio Rev. Code § 2953.32 (sealing)", "Ohio Rev. Code § 109.572 (BCI&I)"] },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "Pre-employment limits", keyStatutes: ["63 Okla. Stat. § 427.8 (Unity Act)"] },
  { slug: "oregon", name: "Oregon", abbr: "OR", region: "West", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Pre-employment limits", keyStatutes: ["ORS § 659A.360 (BTB)", "ORS § 659A.357"] },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", region: "Northeast", highlight: true, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["18 Pa. C.S. § 9125 (CHRIA)", "Phila. Fair Criminal Records Screening Std. § 9-3404"] },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", region: "Northeast", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["R.I. Gen. Laws § 28-5-7", "R.I. Gen. Laws § 21-28.6-7"] },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["S.C. Code Ann. § 17-22-950"] },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["S.D. Codified Laws § 23-5-12"] },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Tenn. Code Ann. § 8-50-112"] },
  { slug: "texas", name: "Texas", abbr: "TX", region: "South", highlight: true, sevenYearLookback: true, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Tex. Bus. & Com. Code § 20.05", "Tex. Gov't Code § 411.122 (DPS)"] },
  { slug: "utah", name: "Utah", abbr: "UT", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Utah Code § 34-52-201"] },
  { slug: "vermont", name: "Vermont", abbr: "VT", region: "Northeast", highlight: false, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Off-duty use", keyStatutes: ["21 V.S.A. § 495j", "18 V.S.A. § 4230b"] },
  { slug: "virginia", name: "Virginia", abbr: "VA", region: "South", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: false, marijuanaProtections: "Lawful-use protections", keyStatutes: ["Va. Code § 19.2-389.3 (simple-possession sealing)", "Va. Code § 4.1-1109"] },
  { slug: "washington", name: "Washington", abbr: "WA", region: "West", highlight: true, sevenYearLookback: true, banTheBox: "Public + Private", salaryHistoryBan: true, marijuanaProtections: "Pre-employment limits", keyStatutes: ["RCW § 49.94 (Fair Chance Act)", "RCW § 19.182 (state FCRA)", "RCW § 49.44.240 (cannabis testing, 2024)"] },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", region: "South", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["W. Va. Code § 15-2-24"] },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", region: "Midwest", highlight: false, sevenYearLookback: false, banTheBox: "Public", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Wis. Stat. § 111.335 (FEA)"] },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", region: "West", highlight: false, sevenYearLookback: false, banTheBox: "None", salaryHistoryBan: false, marijuanaProtections: "None", keyStatutes: ["Wyo. Stat. § 7-13-1502"] },
];

export const STATE_REGIONS: StateRegion[] = ["Northeast", "Midwest", "South", "West"];

export function findStateBySlug(slug: string): StateRecord | undefined {
  return STATE_MATRIX.find((s) => s.slug === slug);
}

export function highlightStates(): StateRecord[] {
  return STATE_MATRIX.filter((s) => s.highlight);
}

export function statesByRegion(region: StateRegion): StateRecord[] {
  return STATE_MATRIX.filter((s) => s.region === region);
}

export function stateMatrixCounts() {
  return {
    total: STATE_MATRIX.length,
    sevenYearStates: STATE_MATRIX.filter((s) => s.sevenYearLookback).length,
    btbAnyPrivate: STATE_MATRIX.filter((s) => s.banTheBox === "Public + Private").length,
    btbAnyScope: STATE_MATRIX.filter((s) => s.banTheBox !== "None").length,
    salaryHistoryBan: STATE_MATRIX.filter((s) => s.salaryHistoryBan).length,
    cannabisProtections: STATE_MATRIX.filter((s) => s.marijuanaProtections !== "None").length,
  };
}
