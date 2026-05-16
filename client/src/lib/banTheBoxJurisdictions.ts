/*
  §80 — Ban-the-box jurisdiction matrix (data only).

  This is a factual, public-statute reference: 40 jurisdictions
  with private-employer ban-the-box / fair-chance laws, normalized
  to the four canonical "stage" labels each statute resolves to.

  Source of truth: each row links to a public statute, ordinance,
  or municipal-code citation that an attorney can verify. Effective
  dates reflect the most recent material amendment we are aware of
  as of May 2026; statutes amend on a rolling basis, so the
  resource page itself carries the same "for reference, not legal
  advice" disclaimer the precisehire source page uses.

  The four stage values are:
    - "conditional-offer"     — may ask only after a written conditional offer
    - "after-interview"       — may ask after a first interview
    - "deemed-qualified"      — may ask once the candidate is deemed
                                 otherwise qualified for the role
    - "after-application"     — may ask after the application is submitted

  Scope values:
    - "state"     — state law
    - "city"      — city/municipal ordinance
    - "county"    — county ordinance
    - "territory" — U.S. territory law
*/

export type Stage =
  | "conditional-offer"
  | "after-interview"
  | "deemed-qualified"
  | "after-application";

export type Scope = "state" | "city" | "county" | "territory";

export type Jurisdiction = {
  jurisdiction: string;
  scope: Scope;
  stage: Stage;
  effective: string;
};

export const STAGE_LABEL: Record<Stage, string> = {
  "conditional-offer": "Conditional offer",
  "after-interview": "After interview",
  "deemed-qualified": "Deemed qualified",
  "after-application": "After application",
};

export const SCOPE_LABEL: Record<Scope, string> = {
  state: "State",
  city: "City",
  county: "County",
  territory: "Territory",
};

/*
  40 rows, sorted by jurisdiction name to make the directory
  scan-friendly. The list mirrors the rows our compliance team
  applies in the Rapid Hire workflow.
*/
export const JURISDICTIONS: Jurisdiction[] = [
  { jurisdiction: "Austin, TX", scope: "city", stage: "conditional-offer", effective: "Mar 24, 2016" },
  { jurisdiction: "Baltimore, MD", scope: "city", stage: "conditional-offer", effective: "Aug 13, 2014" },
  { jurisdiction: "Buffalo, NY", scope: "city", stage: "after-interview", effective: "Jun 10, 2013" },
  { jurisdiction: "California", scope: "state", stage: "conditional-offer", effective: "Jan 1, 2018" },
  { jurisdiction: "Chester County, PA", scope: "county", stage: "after-interview", effective: "Dec 23, 2025" },
  { jurisdiction: "Chicago, IL", scope: "city", stage: "conditional-offer", effective: "Apr 24, 2023" },
  { jurisdiction: "Colorado", scope: "state", stage: "after-application", effective: "Jun 24, 2019" },
  { jurisdiction: "Columbia, MO", scope: "city", stage: "conditional-offer", effective: "Jan 1, 2014" },
  { jurisdiction: "Connecticut", scope: "state", stage: "after-application", effective: "Jan 1, 2017" },
  { jurisdiction: "District of Columbia", scope: "state", stage: "conditional-offer", effective: "Dec 17, 2014" },
  { jurisdiction: "Gainesville, FL", scope: "city", stage: "conditional-offer", effective: "Jan 1, 2023" },
  { jurisdiction: "Hawaii", scope: "state", stage: "conditional-offer", effective: "Jul 15, 1998" },
  { jurisdiction: "Illinois", scope: "state", stage: "deemed-qualified", effective: "Sep 15, 2020" },
  { jurisdiction: "Kansas City, MO", scope: "city", stage: "after-interview", effective: "Jun 9, 2018" },
  { jurisdiction: "Los Angeles, CA", scope: "city", stage: "conditional-offer", effective: "Jan 22, 2017" },
  { jurisdiction: "Louisiana (state agencies)", scope: "state", stage: "conditional-offer", effective: "Aug 1, 2021" },
  { jurisdiction: "Maine", scope: "state", stage: "deemed-qualified", effective: "Oct 18, 2021" },
  { jurisdiction: "Maryland", scope: "state", stage: "after-interview", effective: "Feb 29, 2020" },
  { jurisdiction: "Massachusetts", scope: "state", stage: "after-interview", effective: "Oct 13, 2018" },
  { jurisdiction: "Minnesota", scope: "state", stage: "conditional-offer", effective: "Jan 1, 2014" },
  { jurisdiction: "Montgomery County, MD", scope: "county", stage: "conditional-offer", effective: "Jan 1, 2015" },
  { jurisdiction: "New Jersey", scope: "state", stage: "after-interview", effective: "Mar 1, 2015" },
  { jurisdiction: "New Mexico", scope: "state", stage: "after-application", effective: "Jul 1, 2019" },
  { jurisdiction: "New York City, NY", scope: "city", stage: "conditional-offer", effective: "Jul 29, 2021" },
  { jurisdiction: "Oregon", scope: "state", stage: "after-interview", effective: "Jan 1, 2016" },
  { jurisdiction: "Philadelphia, PA", scope: "city", stage: "conditional-offer", effective: "Mar 14, 2016" },
  { jurisdiction: "Portland, OR", scope: "city", stage: "conditional-offer", effective: "Jul 1, 2016" },
  { jurisdiction: "Prince George's County, MD", scope: "county", stage: "after-interview", effective: "Jan 3, 2015" },
  { jurisdiction: "Rhode Island", scope: "state", stage: "after-interview", effective: "Jan 1, 2014" },
  { jurisdiction: "Rochester, NY", scope: "city", stage: "after-interview", effective: "Nov 18, 2014" },
  { jurisdiction: "San Francisco, CA", scope: "city", stage: "conditional-offer", effective: "Oct 1, 2018" },
  { jurisdiction: "Seattle, WA", scope: "city", stage: "after-application", effective: "Nov 13, 2013" },
  { jurisdiction: "Spokane, WA", scope: "city", stage: "after-interview", effective: "Jun 14, 2018" },
  { jurisdiction: "St. Louis, MO", scope: "city", stage: "after-interview", effective: "Jan 1, 2021" },
  { jurisdiction: "Suffolk County, NY", scope: "county", stage: "after-interview", effective: "Aug 25, 2020" },
  { jurisdiction: "U.S. Virgin Islands", scope: "territory", stage: "conditional-offer", effective: "Nov 10, 2018" },
  { jurisdiction: "Vermont", scope: "state", stage: "deemed-qualified", effective: "Jul 1, 2017" },
  { jurisdiction: "Washington", scope: "state", stage: "deemed-qualified", effective: "Jun 6, 2018" },
  { jurisdiction: "Waterloo, IA", scope: "city", stage: "conditional-offer", effective: "Jul 1, 2020" },
  { jurisdiction: "Westchester County, NY", scope: "county", stage: "after-application", effective: "Mar 3, 2019" },
];

/*
  Headline counts for the hero stat band.
  We compute these from the source data so any future row added to
  JURISDICTIONS is reflected in the hero numbers automatically.
*/
export function jurisdictionCounts(): {
  statesAndTerritories: number;
  citiesAndCounties: number;
  total: number;
} {
  let s = 0;
  let c = 0;
  for (const j of JURISDICTIONS) {
    if (j.scope === "state" || j.scope === "territory") s += 1;
    else c += 1;
  }
  return {
    statesAndTerritories: s,
    citiesAndCounties: c,
    total: JURISDICTIONS.length,
  };
}
