import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "small-business-cra-vs-free-public-record-search",
  title: "Small Business CRA vs Free Public Record Search: When to Use Each",
  metaTitle: "CRA vs Free Public Record Search Small Business",
  metaDescription:
    "Free public-record portals look like an SMB shortcut but are a legal trap for hiring. Here is when to use a CRA and the FCRA line that separates them.",
  excerpt:
    "Free public-record portals look like a small business shortcut. They are a legal trap for hiring decisions. Here is when to use a CRA, when public-record search is acceptable, and the FCRA line that separates the two.",
  publishedAt: "2026-05-17",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["small-business", "fcra", "compliance"],
  body: `Every founder running a small business eventually asks the same cost-saving question: do I really need to pay a Consumer Reporting Agency, or can I just Google the candidate and check their county courthouse website myself? The legal answer is unambiguous, the practical answer is almost as clear, and the difference between the two costs less than most founders assume. Here is the line.

## What the FCRA actually says

The Fair Credit Reporting Act regulates **consumer reports** — defined at [15 U.S.C. §1681a(d)](/blog/fcra-compliance-guide) as any communication of information bearing on a consumer's character, reputation, or personal characteristics, *prepared by a consumer reporting agency*, that is used or expected to be used for an enumerated purpose including employment. The "prepared by a CRA" element is what shifts a search from regulated to unregulated. A free Google search of a candidate's name is not a consumer report — Google is not a CRA. A pull of public records from a free state-court website is not a consumer report — the courthouse is not a CRA either. A search aggregated by Spokeo, Intelius, or BeenVerified that is *bundled and sold for employment screening* almost certainly *is* a consumer report regardless of how the vendor markets itself, and the [FTC has been clear on this since the 2012 Spokeo settlement](https://www.ftc.gov/news-events/news/press-releases/2012/06/spokeo-pay-800000-settle-ftc-charges-company-allegedly-marketed).

So the question for small businesses is not whether public records are accessible for free — they often are — but whether the *purpose* of the search and the *channel* used to compile it triggers FCRA jurisdiction.

## When a free public-record search is genuinely fine

A founder doing genuine personal due diligence — searching a candidate's name on Google, viewing publicly accessible court calendars, reviewing publicly posted disciplinary actions — is not running a consumer report. The activity is not regulated by the FCRA. What changes the analysis is *intent and scope*. If the search is part of a documented hiring program with predictable steps applied to every candidate, regulators (and plaintiffs' attorneys) will read it as employment screening regardless of whether you used a CRA.

In practice, the only safely unregulated public-record search is **one-off, supplementary, undocumented review** — looking at a candidate's LinkedIn after the formal screening process is complete, for example, or verifying a publicly known certification. It is not a substitute for the formal background check.

## Why public-record search alone is a hiring trap

Even setting FCRA exposure aside, a small business that relies on free public-record search faces three operational risks. **Records are scattered**: criminal records live at the county level in nearly every U.S. state, meaning a defensible criminal history search requires checking dozens of jurisdictions, not one. **Identifiers are weak**: most public-record portals match on name only, which produces both false positives (someone else with the same name has a record) and false negatives (the candidate's record is filed under a slight variant). **Disposition is missing**: many county portals show charges but not dispositions, which means a small business reading those records out of context can deny employment based on an arrest that never resulted in a conviction — exactly the [EEOC violation](/blog/eeoc-arrest-conviction-employer-guidance) the agency has been litigating for two decades.

A CRA solves all three. SSN trace gives you the candidate's prior addresses across the country. Multi-jurisdictional searches scope the criminal search to the right courts. Identity match logic suppresses common-name false positives. Adjudication logic reads dispositions correctly.

## The honest cost comparison

The cost gap between DIY public-record search and CRA-administered screening at small business volume is smaller than founders expect. A well-run CRA package for a small business hire — SSN trace, national criminal, sex offender registry, county criminal — runs **\\$22–35** per check at sub-50/month volume. That includes FCRA-compliant disclosure and authorization paperwork, dispute handling, and adverse-action workflow. See the [SMB pricing breakdown](/blog/small-business-background-check-pricing) for what each component costs separately.

Compare that to the founder's own time: a defensible DIY criminal search across the candidate's last three counties of residence is at least an hour of work per candidate, and it does not produce a defensible record under the FCRA at any time cost. At any plausible founder hourly rate, the CRA is cheaper. Once you factor in the FCRA litigation exposure of running an undocumented program, the comparison stops being close.

## The right line to draw

The defensible small business pattern: use a CRA for **every formal hiring decision**, every time, with consistent packages by role family. Use free public-record search for **personal awareness only** — checking a candidate's professional licensing status, reviewing public news about a former employer, validating a publicly listed credential. Never use free public-record search as the basis for a hiring withdrawal. The legal line and the practical line are in the same place. Our [services overview](/services) covers what a CRA-administered package actually looks like.`,
};
