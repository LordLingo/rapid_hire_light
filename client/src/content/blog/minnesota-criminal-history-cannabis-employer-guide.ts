import type { BlogPost } from "@/lib/blog";

/*
  §213 — Minnesota Criminal History Employment Act + 2023 Cannabis
  Employment Protections employer guide.

  Statutory backbone:
    - Minn. Stat. §364.01–§364.10 (Criminal Offenders Rehabilitation Act,
      "CORA"; sometimes called the "Criminal History Employment Act")
    - Minn. Stat. §364.021 (ban-the-box: forbids employers from inquiring
      about, considering, or requiring disclosure of an applicant's
      criminal record until selected for an interview, or if no interview
      is conducted, until a conditional offer)
    - Minn. Stat. §364.03 (substantive use rule: cannot deny employment
      based on a conviction unless the offense directly relates to the
      position; mirrors EEOC's targeted-screen analysis)
    - Minn. Stat. §181.953 (HF 100, 2023 cannabis omnibus): private
      employers cannot refuse to hire, discipline, or discharge an
      applicant or employee solely because the person engages in or has
      engaged in the use or enjoyment of lawful consumable products
      (cannabis included as of August 1, 2023) off premises during
      non-working hours, with statute-defined safety-sensitive carve-outs
    - Minn. Stat. §181.951 (drug- and alcohol-testing in the workplace
      framework — DATWA — which interlocks with the new cannabis rules)
    - Minn. Stat. §364.06 (notice-of-rejection requirement when a
      conviction is the basis for the adverse action)
    - Minn. Stat. §299C.62 (background-check process for placements with
      vulnerable adults; carve-out from CORA's general prohibition)
*/

export const post: BlogPost = {
  slug: "minnesota-criminal-history-cannabis-employer-guide",
  title:
    "Minnesota employer guide: Criminal History Employment Act + 2023 cannabis off-duty protections",
  metaTitle:
    "Minnesota Criminal History + Cannabis Employer Guide",
  metaDescription:
    "Minnesota's Criminal History Employment Act (Minn. Stat. §364.021) and HF 100 cannabis protections (§181.953) reshaped applicant screening. Here's what changed and how to comply.",
  excerpt:
    "Minnesota's ban-the-box statute and the 2023 HF 100 cannabis omnibus reshaped applicant screening. A practical compliance map for employers hiring across the state.",
  publishedAt: "2026-06-01",
  readingMinutes: 6,
  author: "Rapid Hire Compliance Team",
  tags: ["minnesota", "ban-the-box", "marijuana", "compliance", "state-laws"],

  body: `Minnesota employers operate under one of the more restrictive criminal-history screening regimes in the Midwest, and the 2023 cannabis legalization omnibus added a parallel set of off-duty protections that catch many out-of-state hiring teams off guard. Between Minn. Stat. §364.021's ban-the-box requirement, Minn. Stat. §364.03's substantive direct-relationship test, and the new Minn. Stat. §181.953 lawful-consumable-products rule, the compliance surface looks fundamentally different than it did three years ago. This guide walks through what each statute actually requires and how to wire your screening program to land cleanly on the right side of all of them.

## The Criminal History Employment Act: ban-the-box plus a substantive use rule

The Minnesota Criminal History Employment Act — usually cited as Minn. Stat. §§364.01–364.10 and sometimes called the Criminal Offenders Rehabilitation Act (CORA) — has two distinct components that employers frequently conflate. The first is procedural. Minn. Stat. §364.021 prohibits public and private employers from inquiring into, considering, or requiring disclosure of an applicant's criminal record until the applicant has been selected for an interview, or if no interview is conducted, until a conditional offer of employment has been extended. That means the application form itself cannot ask about convictions, and the criminal-history pull from your screening vendor must be sequenced after the interview-selection or conditional-offer step.

The second component is substantive. Even after you have the conviction record in hand, Minn. Stat. §364.03 only permits an adverse decision when the offense directly relates to the position sought. The statute and the Minnesota Department of Human Rights guidance both contemplate a targeted-screen analysis closely tracking the [EEOC's three-factor framework on conviction records](/blog/eeoc-ban-the-box-compliance). Documenting that targeted-screen analysis on every adverse decision is the single most important file-the-paperwork habit for surviving a §364.10 challenge.

## What changed in 2023: HF 100 and the lawful-consumable-products rule

The 2023 cannabis omnibus (HF 100) added Minn. Stat. §181.953 in its current form, extending Minnesota's longstanding off-duty protections for "lawful consumable products" to include adult-use cannabis as of August 1, 2023. The practical impact for employers is that a positive marijuana result on a pre-employment urine screen is no longer, by itself, a lawful basis to rescind an offer for most non-safety-sensitive private-sector roles. The statute carves out genuine safety-sensitive positions — defined narrowly by reference to Minn. Stat. §181.950 — and federal-mandate roles such as DOT-regulated drivers (still governed by [49 CFR Part 40](/blog/dot-drug-testing-49-cfr-part-40)). Outside those carve-outs, employers screening for cannabis at the pre-employment stage must either drop the panel or have a fact-specific safety-sensitive justification on file. Our breakdown of the [parallel marijuana hiring landscape across other states](/blog/marijuana-drug-testing-state-laws) maps how Minnesota compares.

## Sequencing the screening program: when each pull is allowed

For most private-sector hires the legally clean sequence runs: application without conviction question → interview selection or conditional offer → criminal-history pull (county-of-residence and any judicially relevant counties, plus a national-database scan as a pointer system, never as the sole basis for an adverse decision) → targeted-screen §364.03 analysis if hits surface → individualized assessment and pre-adverse notice mirroring the [federal FCRA two-letter sequence](/blog/adverse-action-letter-fcra-template) → final adverse action only after the §364.06 notice-of-rejection has been delivered. Vulnerable-adult and §299C.62-governed placements follow a separate, fingerprint-based workflow with statutory carve-outs from the §364.021 timing rule. Healthcare and education employers should walk through our [healthcare-specific screening guide](/blog/healthcare-background-check-requirements) before assuming the general CORA timeline applies.

## Notice, recordkeeping, and what enforcement looks like

Two notice requirements drive most enforcement risk. Minn. Stat. §364.06 requires written notice to the applicant whenever a conviction is the basis for the adverse decision, identifying the specific record and explaining the applicant's right to file a grievance. Federal FCRA pre-adverse and adverse-action letters do not satisfy this state-law notice requirement; they sit alongside it. The Minnesota Department of Human Rights handles complaints under §364.10, and the Office of the Attorney General has enforcement authority for §181.953 cannabis-protection claims. Damages can include lost wages, statutory penalties, and attorney's fees, so the cost of getting the sequence wrong is meaningful. Employers building or auditing a Minnesota-compliant program should pair the procedural sequence above with the substantive [adjudication matrix our compliance team builds for clients](/services/adjudication) and a documented retention policy keeping every targeted-screen worksheet, individualized-assessment record, and §364.06 notice for at least four years. If you'd like a walk-through of how this plays out in your specific role mix, [our team can map it for your hiring footprint](/contact).`,
};
