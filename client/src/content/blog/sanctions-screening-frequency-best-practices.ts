import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "sanctions-screening-frequency-best-practices",
  title: "Sanctions Screening Frequency: Monthly, Quarterly, or Continuous?",
  metaTitle: "Sanctions Screening Frequency Best Practices 2026",
  metaDescription:
    "CMS expects monthly sanctions screening but the right cadence depends on workforce volatility, contractor scope, and audit posture. Here is how to decide.",
  excerpt:
    "Monthly screening is the CMS floor, but the right cadence depends on workforce volatility, contractor scope, and the audit posture you want to defend. Here is how the cadence actually maps to risk.",
  publishedAt: "2026-02-09",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["sanctions", "continuous-monitoring", "compliance"],
  body: `CMS State Medicaid Director Letter 09-001 set the **monthly screening expectation** for healthcare provider sanctions checks. The OIG's [Special Advisory Bulletin on the Effect of Exclusion](https://oig.hhs.gov/exclusions/files/sab-05092013.pdf) reinforces it. But the actual right cadence for any given provider depends on three variables CMS does not pin down: workforce volatility, contractor scope, and the audit posture the provider wants to defend. A small primary-care practice with stable staffing runs a different program than a national health system absorbing 3,000 contractors a quarter. Below is the framework that maps cadence to risk in 2026.

## The three cadence options

**Monthly batch screening** is the CMS floor. The workforce roster is matched against the OIG LEIE, SAM.gov, and applicable state Medicaid lists once per calendar month, typically within five business days of the LEIE monthly update. This is the cadence most small and mid-size providers run. It is defensible if documentation is clean.

**Quarterly screening** does not satisfy CMS expectations on its own. Some providers historically ran on a quarterly cadence and were caught short during CMS audits. Quarterly is acceptable only as a *supplement* — for example, an additional quarterly contractor on-site verification on top of monthly batch screening of the operational roster.

**Continuous (or daily) screening** ingests sanctions-list updates as they are published and runs the workforce roster against deltas every day. This catches new exclusions within 24 hours of posting rather than within 30 days. It is the emerging standard at large provider organizations, particularly those with high contractor turnover, multi-state operations, or recent CMS findings.

## When monthly is enough

Monthly is sufficient for providers who satisfy all four of the following criteria. First, **stable workforce** — minimal monthly turnover, few new hires, and a contractor population in single digits. Second, **single-state operations** — no out-of-state licensing exposure beyond the state of operation. Third, **direct-employee dominance** — minimal use of locums, agency staff, or downstream vendors. Fourth, **low historical findings exposure** — no prior CMS settlements or audit corrective action plans.

A small physician practice or a single-site outpatient clinic typically meets these criteria. The monthly batch run, properly documented, is defensible at audit.

## When monthly is not enough

Monthly leaves audit gaps for providers who satisfy any one of the following. **Volatile workforce** — high turnover, weekly new hires, daily contractor flow. The monthly cadence means a new hire onboarded on day 2 of the month and a new exclusion posted on day 6 are not matched until the next month's run, leaving 24+ days of exposure. **Multi-state operations** — every additional state Medicaid list compounds the screening surface, and a monthly batch on twelve state lists is materially riskier than a daily delta check on the same lists. **Heavy contractor scope** — the failure mode in most CMS settlements is contractor screening, and monthly cadence on a high-volume contractor population produces predictable gaps. **Recent findings posture** — a provider operating under a CMS corrective action plan or self-disclosure settlement is held to a higher cadence by the settlement terms, often weekly or daily.

## The continuous-screening case

Continuous screening is operationally simpler than it sounds. A sanctions-monitoring service ingests the LEIE bulk extract, the SAM.gov daily delta feed, and the publishing cadence of every state Medicaid list. The service maintains a hash of the provider's workforce roster (refreshed weekly or daily from the HRIS) and runs the deltas against it as they come in. A confirmed match triggers an alert within 24–48 hours of the upstream listing.

The cost difference between monthly batch and continuous screening at typical mid-market volumes is **\\$0.50–\\$2.00** per workforce member per month — small enough that the cost-benefit math turns on audit posture and findings exposure, not on price. Most providers operating under a CMS corrective action plan or planning a major workforce expansion conclude continuous is the right move.

## The contractor and locum overlay

Cadence on direct employees is rarely the audit-finding driver. Cadence on contractors and locums is. A defensible 2026 program operates a higher cadence on contractors than on direct employees because contractor populations turn over faster and identifier data is weaker. A common pattern: monthly batch on direct employees + weekly delta on contractors + on-placement screen for every locum + monthly attestation review of vendor self-screening. Our [healthcare contractor playbook](/blog/healthcare-contractor-sanctions-screening) walks through the contractor-specific cadence design.

## Documentation is the audit defense

Cadence matters less than documentation. A monthly batch program with airtight documentation outperforms a continuous program with sloppy logs at audit. The minimum documentation for any cadence: the database queried, the version date, the identifier fields used, the candidate identifier, the basis for the conclusion, and the reviewer's name. The cadence determines how often the documentation is generated; the quality determines whether it survives CMS scrutiny.

## How to decide

Pick the cadence that matches workforce volatility plus audit posture, then automate it. Most providers with more than 250 workforce members and any meaningful contractor scope land on continuous or daily. Providers below that threshold default to monthly batch with quarterly contractor on-site verification. Either way, the program runs through a CRA-administered service or a sanctions-monitoring vendor — the cost of running it manually exceeds the cost of automating it within a few months. Our [CMS exclusion playbook](/blog/cms-exclusion-screening-oig-leie-sam), [LEIE monthly process](/blog/oig-leie-monthly-update-process), and [SAM workflow](/blog/sam-gov-exclusion-check-workflow) cover the underlying mechanics. Start a program-build conversation at [contact](/contact); pricing is on [pricing](/pricing).`,
};
