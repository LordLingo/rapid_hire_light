import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "county-vs-national-criminal-background-check",
  title: "County vs National Criminal Background Check: Which One You Actually Need",
  metaTitle: "County vs National Criminal Background Check",
  metaDescription:
    "County criminal searches and national criminal databases are not interchangeable. Here is what each one actually covers, where they fail, and how to combine them defensibly.",
  excerpt:
    "Half the background check disputes we see come from employers misunderstanding what a 'national' criminal search actually covers. The honest answer is: not as much as the name implies.",
  publishedAt: "2026-05-05",
  readingMinutes: 4,
  author: "Rapid Hire Compliance Team",
  tags: ["criminal", "compliance", "comparison"],
  body: `If you run any volume of background checks, you have probably been quoted both a "national criminal search" and a "county criminal search" — and probably wondered why one report contains both, or why the cheaper package only contains one. The two products solve overlapping but distinct problems, and combining them correctly is the difference between a defensible criminal screen and one that misses real records.

## What a national criminal database actually is

A national criminal database is, in plain terms, a third-party aggregation of state-supplied data. It is not the FBI's NCIC; that database is restricted to law enforcement and a handful of statutorily authorized non-criminal-justice uses, and a private CRA cannot pull from it. What CRAs call a "national" search is a commercial database that vacuums in records from state administrative offices, departments of corrections, sex-offender registries, and a long tail of municipal sources, then de-duplicates and indexes them.

The strength of these databases is breadth and speed. A national search runs in seconds and surfaces records from jurisdictions a candidate never disclosed and you might never have thought to query. The weakness is that **the data is only as fresh as the last sync** with each contributing source, and the quality of those syncs varies wildly. Some Texas counties contribute weekly. Some upload quarterly. Some never contribute at all.

For an honest national-search read, expect to find serious offenses (felonies, sex offenses, federal cases) reliably and lower-level offenses inconsistently.

## What a county criminal search actually is

A county criminal search is a name-and-DOB query against a specific county courthouse's records, run either online (where the county has an electronic system) or by a court runner physically pulling the file. The result is the canonical record. There is no aggregation lag. There is no missing source. If the courthouse has a record matching the candidate, the search returns it.

The strength of county is **accuracy and freshness**. The weakness is scope: county searches only cover the counties you query. A candidate who lived in three counties over seven years requires three separate searches, each priced separately and each adding to turnaround time.

## Why the FCRA cares about the difference

Under 15 U.S.C. §1681e(b), CRAs must follow "reasonable procedures to assure maximum possible accuracy" of the information they report. Courts have repeatedly held that reporting a national-database hit without source verification — particularly a hit that becomes the basis for an adverse hiring decision — falls short of that standard. The fix is not to abandon national databases. It is to use them correctly: as a *pointer* that flags potential records, which the CRA then verifies at the county source before reporting to the employer.

This is why most reputable screening providers, including Rapid Hire, run national + county as a paired workflow rather than as alternatives. The national search points; the county verifies. The employer never sees an unverified database hit.

## How to combine them defensibly

The defensible pattern looks like this. Run a national criminal database search to flag potentially relevant counties beyond the ones the candidate disclosed. Run a primary-source county criminal search in every county where the candidate has lived in the past seven years (the FCRA's general lookback period for non-conviction information under §1681c). When the national database surfaces a hit in a county you did not already plan to search, add that county and verify the hit at the source before the report ships.

Three additional layers strengthen the workflow:

- A federal criminal search via PACER for federal offenses (which county courts do not see)
- A multi-state sex offender registry check, which is point-in-time and run separately
- A statewide search where state-level court systems exist (the New York OCA, the California Superior Court statewide index, etc.)

Stack those four — national + county + federal + sex offender — and you have what most compliance teams treat as a complete criminal screen. See our [services page](/services) for the full menu.

## Where employers go wrong

The two patterns we see fail are at opposite extremes. The first is the *national-only* trap, usually driven by price: an employer buys a $15 national search package and acts on a database hit without verification, then receives a §1681e(b) demand letter when the hit turns out to belong to a different person with the same name. The second is the *county-only* trap: an employer queries the candidate's current county, gets a clean result, and misses a serious offense from a county the candidate did not disclose.

Neither extreme is defensible. Both are common.

For a clean read on what your role actually needs, see [pricing](/pricing) for our packages or [talk to a specialist](/contact) about a custom criminal-search build.`,
};
