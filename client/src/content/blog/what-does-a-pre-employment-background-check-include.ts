import type { BlogPost } from "@/lib/blog";

/*
  §222 — What a pre-employment background check actually includes.

  Educational / top-of-funnel SEO post. Maps the standard components of an
  employment background check and the role-based logic that determines which
  searches belong in a given package.

  Compliance touchpoints (kept accurate, not over-cited):
    - FCRA 15 U.S.C. §1681b(b) — standalone disclosure + written
      authorization before any consumer report is pulled
    - FCRA 15 U.S.C. §1681c — seven-year reporting cap on most non-conviction
      items for roles paying under $75,000
    - FCRA 15 U.S.C. §1681e(b) / §1681k — accuracy duty and the source
      verification standard for adverse public-record information
    - Credit checks for employment are restricted/banned in several states
      (e.g., CA, IL, WA, NY) and permitted only for specific role types
    - Drug screening legality and scope vary by state and by safety-sensitive
      role classification

  Internal links point to the existing compliance cluster so this top-funnel
  post passes authority down to the conversion pages.
*/

export const post: BlogPost = {
  slug: "what-does-a-pre-employment-background-check-include",
  title:
    "What does a pre-employment background check actually include?",
  metaTitle: "What's in a Pre-Employment Background Check?",
  metaDescription:
    "There is no single universal background check. It's a stack of searches — identity, criminal, verifications, and role-based add-ons — assembled to the job. Here's what each one covers.",
  excerpt:
    "Most people picture a background check as one search. It isn't. It's a stack of components — identity trace, criminal records, verifications, and role-specific add-ons — assembled to fit the job. Here's exactly what each piece checks, and how to know which ones you actually need.",
  publishedAt: "2026-06-08",
  readingMinutes: 7,
  author: "Rapid Hire Compliance Team",
  tags: ["background-checks", "hiring", "criminal-records", "verifications", "compliance"],

  body: `Ask ten hiring managers what a "background check" includes and you will get ten different answers — because there is no single, universal background check. What people call a background check is really a *stack* of independent searches, assembled to fit a specific role. A warehouse hire and a CFO hire both get "a background check," but the two reports look nothing alike. Understanding the components — and which ones a given job actually requires — is how you screen thoroughly without overpaying for searches you don't need or, worse, skipping ones you do. Here is what each piece checks.

## The foundation: identity and SSN trace

Almost every check starts with a Social Security number trace. It is not a criminal search — it's the step that confirms you're screening the right person and reveals the names, aliases, and address history tied to that SSN. That address history is what tells a screener *which jurisdictions to search*. Skip it, and a criminal search aimed only at where someone lives today will miss records in the three counties they lived in over the past decade. The trace is cheap, fast, and the spine the rest of the report is built on.

## The core: criminal history searches

This is what most people mean by a background check, and it is itself several searches:

- **County criminal search** — the source of truth, pulled directly from the courthouse where charges are filed and tried.
- **Statewide repository search** — broader reach within a state, though completeness varies by state.
- **National criminal database search** — a fast, wide net across many jurisdictions, but it's aggregated *pointer data* with real coverage gaps, not a definitive answer. We break down exactly why in [county vs. national criminal checks](/blog/county-vs-national-criminal-background-check).
- **Federal criminal search** — covers offenses prosecuted in federal court (fraud, trafficking, large-scale financial crime) that never appear in county records.
- **Sex-offender registry search** — a standard national registry check, often mandatory for roles involving vulnerable populations.

The right mix here is driven by where the candidate has lived and what the role demands, not by a one-size package.

## The proof: verifications

Verifications confirm the candidate is who they say they are on paper:

- **Employment verification** — confirms past employers, titles, and dates, catching inflated or invented work history.
- **Education verification** — confirms degrees, institutions, and graduation dates against the school or registrar.
- **Professional license verification** — confirms active, unrestricted licenses (nursing, CPA, CDL, contractor, and similar) directly with the issuing board.

These take longer than a database search because they require contacting a real source, and they are where a surprising share of résumé fraud surfaces.

## The role-based add-ons

Beyond the core, certain roles trigger specialized searches:

- **Motor vehicle record (MVR)** — essential for any driving role; pulls license status and violation history from the state DMV.
- **Credit check** — used only for finance-handling or fiduciary roles, and even then restricted or banned outright in several states, so it is never a default.
- **Drug screening** — scope and legality vary by state and by whether the role is safety-sensitive.
- **Healthcare sanctions / OIG exclusion** and **global watchlist / sanctions** — required for healthcare, finance, and roles with regulatory exposure.

The principle is simple: add the searches the role genuinely justifies, and leave the rest out.

## What the law layers on top

No matter which components you select, federal law wraps the whole process. Before any report is pulled, the FCRA requires a standalone written disclosure and the candidate's signed authorization (15 U.S.C. §1681b(b)) — a step employers get wrong constantly, and one we detail in our [disclosure and authorization guide](/blog/fcra-604b-disclosure-authorization). The FCRA also caps most non-conviction items at seven years for roles under $75,000 (§1681c) and requires that adverse public-record information be accurate and verified at its source. On top of the federal floor, state and local rules — including ban-the-box and fair-chance sequencing covered in [our overview](/blog/ban-the-box-fair-chance-hiring), and state-specific limits like those in our [Texas compliance guide](/blog/texas-employer-background-check-compliance-guide) — change *when* you can ask about history and *what* you can act on.

A good provider does not just run searches; it assembles the right stack for each role and keeps the compliance steps automated so nothing slips. That is how Rapid Hire Solutions builds screening packages — matched to the job, compliant by default, and fast. See how we [structure compliance-grade screening](/compliance), or [tell us about the roles you're hiring for](/contact) and we will map the exact components you need.`,
};
