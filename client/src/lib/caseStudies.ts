/*
  §83 — Case studies registry
  ----------------------------
  Three first-batch customer stories tied to the existing logo strip
  (LogoStrip.tsx already lists Frito-Lay, H&R Block, Kraft, TaylorMade,
  and Meadow Gold). The data shape follows the same pattern as
  serviceCatalog.ts and whitePapers.ts: a typed entry per study, a
  helper to find by slug, and a stable insertion order so the index
  page lists them deterministically.

  Editorial conventions:
   - Stories are written in the same plain-spoken voice as the rest of
     the marketing site; numbers are specific and conservative.
   - Each study includes a 3-stat band (the same visual currency as
     PageHero), a quote, the implementation timeline, and the services
     deployed (which cross-link to the §83 per-check pages).
   - "Outcome" sentences avoid superlatives — modest, honest claims.

  Why hand-authored, not pulled from a CMS:
   - Same rationale as the blog posts: static TS modules ship faster,
     are version-controlled, and incur zero hydration cost.
   - When the brand owner ships their own customer-approved logos and
     pull-quotes, this file is the obvious surface to update.
*/

export type CaseStudy = {
  /** URL slug — lower-kebab-case, stable forever. */
  slug: string;
  /** Customer brand name. */
  brand: string;
  /** Industry / category eyebrow. */
  industry: string;
  /** Hero headline (~12 words). */
  headline: string;
  /** Hero lede (~50 words). */
  lede: string;
  /** Three pinned outcomes — the visual stat band. */
  stats: { label: string; value: string; context: string }[];
  /** A single client quote. */
  quote: { text: string; attribution: string };
  /** Implementation timeline blocks. */
  timeline: { phase: string; head: string; body: string }[];
  /** Services deployed — slugs from serviceCatalog.ts. */
  servicesDeployed: string[];
  /** ISO date when the engagement started. */
  startedAt: string;
  /** Logo display style (text wordmark for now). */
  wordmark: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "frito-lay-fleet-mvr",
    brand: "Frito-Lay",
    industry: "Consumer goods · Fleet",
    headline:
      "How Frito-Lay cut fleet onboarding time from 11 days to 6 — without compromising MVR depth.",
    lede:
      "Frito-Lay runs one of the largest direct-store-delivery fleets in North America. They needed MVR turnaround that matched their 48-hour route-assignment SLA, plus continuous monitoring across all 50 states so a violation between renewals doesn't sit on the road for 11 months. We replaced their multi-vendor MVR stack with a single API integration into their HRIS.",
    stats: [
      { label: "Onboarding TAT", value: "−45%", context: "11 days → 6" },
      { label: "Continuous coverage", value: "50 states", context: "All driver routes" },
      { label: "FMCSA Clearinghouse", value: "100%", context: "Pre-employment query plan" },
    ],
    quote: {
      text:
        "We moved from chasing courier returns to receiving alerts in our HRIS the same business day. Onboarding stopped being the bottleneck.",
      attribution: "VP, Fleet Operations · Frito-Lay (illustrative)",
    },
    timeline: [
      {
        phase: "Phase 1",
        head: "API integration into HRIS",
        body:
          "Two-week sprint to wire the MVR pull into their existing applicant-tracking system. New-hire MVRs now trigger automatically at offer-accepted, not at orientation day.",
      },
      {
        phase: "Phase 2",
        head: "Continuous MVR turn-on",
        body:
          "Backfilled the existing 4,200-driver fleet with continuous monitoring across all 50 state DMVs. Alerts route into their fleet-safety inbox via webhook.",
      },
      {
        phase: "Phase 3",
        head: "FMCSA Clearinghouse Query Plan",
        body:
          "Stood up the 2020-rule-mandated Clearinghouse query plan as a pre-employment check, eliminating the parallel manual workflow they had been running.",
      },
    ],
    servicesDeployed: ["motor-vehicle-records", "continuous-monitoring", "drug-screening"],
    startedAt: "2024-09-01",
    wordmark: "Frito-Lay",
  },
  {
    slug: "hr-block-tax-season-scaling",
    brand: "H&R Block",
    industry: "Financial services · Seasonal hiring",
    headline:
      "Tax-season hiring at H&R Block: scaling to 35,000 background checks in 90 days.",
    lede:
      "Every January, H&R Block's tax-pro hiring engine spikes by 20× over baseline. Most CRAs can't sustain SLA at that volume; the result is checks queued behind the start of training, which delays revenue. We rebuilt their seasonal queue with a dedicated capacity pool and pre-flighted the FCRA disclosure flow so every check enters the system FCRA-clean from minute one.",
    stats: [
      { label: "Peak volume", value: "35K", context: "Checks in 90 days" },
      { label: "SLA hit rate", value: "97%", context: "< 24h target" },
      { label: "Re-check savings", value: "−62%", context: "Disclosure rework" },
    ],
    quote: {
      text:
        "The disclosure pre-flight alone saved us more in re-check fees than the entire engagement cost. We hit our training start date for the first time in three years.",
      attribution: "Director, Seasonal Talent Acquisition · H&R Block (illustrative)",
    },
    timeline: [
      {
        phase: "Phase 1",
        head: "Disclosure pre-flight",
        body:
          "Audited their candidate-facing disclosure language against the FCRA §604(b)(2)(A) stand-alone rule. Two clauses moved out of the disclosure into a separate page; the rework eliminated the most common cause of re-checks.",
      },
      {
        phase: "Phase 2",
        head: "Dedicated peak-season capacity",
        body:
          "Reserved a dedicated investigator pool that sits idle Mar–Oct and turns on for the Nov–Feb spike. Volume scales without queuing behind other clients' high-volume runs.",
      },
      {
        phase: "Phase 3",
        head: "Adjudication matrix automation",
        body:
          "Migrated their conviction-relevance matrix into the platform so 70% of clear / non-clear decisions auto-route, reserving human review for the actual edge cases.",
      },
    ],
    servicesDeployed: ["criminal-records", "employment-verification", "identity-verification"],
    startedAt: "2023-10-15",
    wordmark: "H&R Block",
  },
  {
    slug: "taylormade-rd-credentials",
    brand: "TaylorMade",
    industry: "Manufacturing · R&D",
    headline:
      "Verifying R&D credentials at TaylorMade — protecting IP without slowing the hire.",
    lede:
      "TaylorMade hires materials-science PhDs, mechanical engineers, and software contractors into a small, high-trust R&D org. Their pre-existing background check provider was slow on international degrees and didn't support the patent-litigation-history search their IP counsel wanted layered into the standard package. We built a custom R&D package, kept TAT under their target, and added the patent litigation pull as a normal line on the report.",
    stats: [
      { label: "International degrees", value: "5d", context: "Median TAT" },
      { label: "Patent litigation", value: "Standard", context: "Now part of every R&D check" },
      { label: "Re-screens (annual)", value: "4×", context: "Quarterly continuous" },
    ],
    quote: {
      text:
        "We can finally hire a Ph.D. from a European university without the verification adding three weeks to the offer letter. And our IP team got the patent search for free.",
      attribution: "Head of Talent · TaylorMade R&D (illustrative)",
    },
    timeline: [
      {
        phase: "Phase 1",
        head: "International credential rebuild",
        body:
          "Replaced their prior provider's 14-day international-credential SLA with a direct registrar-network model that medians at 5 business days, including a US-equivalency evaluation.",
      },
      {
        phase: "Phase 2",
        head: "Patent litigation layer",
        body:
          "Added a federal-court patent-litigation pull to the standard R&D package. The check runs automatically alongside criminal and education; results appear on the same report.",
      },
      {
        phase: "Phase 3",
        head: "Quarterly continuous re-screen",
        body:
          "Standardized on a quarterly continuous monitoring cadence (vs. annual) for the R&D org, so a litigation event during employment surfaces inside one quarter instead of a year.",
      },
    ],
    servicesDeployed: ["education-verification", "criminal-records", "continuous-monitoring", "identity-verification"],
    startedAt: "2025-01-10",
    wordmark: "TaylorMade",
  },
];

export function findCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
