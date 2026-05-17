import type { BlogPost } from "@/lib/blog";

export const post: BlogPost = {
  slug: "healthcare-contractor-sanctions-screening",
  title: "Healthcare Contractor Sanctions Screening: Where Programs Break",
  metaTitle: "Healthcare Contractor Sanctions Screening 2026 Guide",
  metaDescription:
    "Healthcare contractor exclusion screening is where most CMS findings hit. Here is how to extend LEIE/SAM/state checks defensibly to vendors and locum staff.",
  excerpt:
    "Most healthcare exclusion-screening programs are tight on direct employees and full of holes on contractors and downstream vendors. This is where CMS findings actually land, and how to close the gaps.",
  publishedAt: "2025-12-29",
  readingMinutes: 5,
  author: "Rapid Hire Compliance Team",
  tags: ["sanctions", "healthcare", "compliance"],
  body: `The pattern shows up in nearly every CMS exclusion-related settlement: the provider's W-2 workforce screening was tight, well-documented, and audit-ready, but the contractor and downstream vendor program was either missing or papered over. The OIG's [Special Advisory Bulletin on the Effect of Exclusion](https://oig.hhs.gov/exclusions/files/sab-05092013.pdf) is explicit that the screening duty extends to **anyone who furnishes items or services to federal healthcare program beneficiaries** — and that scope is much wider than most compliance teams operationalize.

## What "contractor" means for screening purposes

The CMS scope sweeps in seven contractor categories that providers routinely miss:

The first is **locum tenens and travel staff**. The placement agency and the receiving provider often disagree about which entity owns the screening obligation. The contract language between provider and agency must resolve this explicitly, and the receiving provider remains liable under CMS rules regardless of what the contract says.

The second is **agency nurses and per-diem staff** placed through a staffing firm. Same issue, same fix: contract terms requiring agency screening + indemnification, plus a parallel provider-side check.

The third is **billing and revenue-cycle vendors**. A coder or claims-processor working for an outsourced vendor still touches federal program billing; the OIG treats them as in scope.

The fourth is **transcription, scribe, and remote-documentation services**, including offshore vendors. The exclusion duty does not depend on physical location.

The fifth is **durable medical equipment, infusion services, and supply vendors** that bill Medicare or Medicaid directly or through the provider.

The sixth is **transportation contractors** for non-emergency medical transport.

The seventh is **food-service and environmental-services vendors** at facilities receiving federal program reimbursement, where the contractor's staff has patient access.

## The two-layer contract model

A defensible 2026 program operates the contractor screen in two layers.

**Layer one — vendor self-screening.** Every contract with a vendor whose staff touches federal program services must require the vendor to (a) screen its workforce monthly against LEIE, SAM, and the state Medicaid lists in every state where the vendor operates or its staff is licensed; (b) certify monthly compliance in writing; (c) notify the provider within 48 hours of any confirmed match; and (d) indemnify the provider for any exclusion-related liability arising from the vendor's failure. Without these contract terms the provider is operating without contractual cover.

**Layer two — provider verification.** The provider conducts an independent screen of named contractor staff at onboarding, runs quarterly attestation reviews of vendor self-screening compliance, and conducts annual on-site compliance audits for high-risk vendor categories. The provider's own check serves as a backstop and a documentation trail when the vendor's program lapses.

## Locum tenens — the highest-risk category

Locum tenens physicians produce the most exclusion-screening findings. The reason: the placement agency, the locum, and the receiving provider all hold partial responsibility, and gaps surface easily.

A defensible locum process specifies the screening responsibility in the placement agreement. The receiving provider should require, at minimum, that the agency provides a fresh LEIE/SAM/state screen at each placement start, plus monthly screens during the placement, and that the agency notifies the provider within one business day of any potential match. The provider runs an independent check at credentialing and a backup monthly check during the placement. Documentation is held by both parties.

For multi-state locums, the screening triggers in every state where the locum holds a license, not just the state where the placement is taking place. A locum holding active licenses in California, Nevada, and Arizona must be screened against all three state Medicaid lists every month.

## Adjudication standard for contractor matches

The match adjudication standard for contractors is the same as for direct employees: documentation of the database that returned the hit, the identifier fields used, the basis for confirming or ruling out the match, and the conclusion. The contractor context complicates one piece — the provider often has weaker access to the contractor's identifier data (DOB, SSN) than for its own employees. The contract should require the vendor to furnish identifier data sufficient for adjudication.

## What CMS auditors look for

CMS auditors stress-test contractor screening through three predictable probes. First, they ask for the **complete contractor list**, including locums and downstream vendors, and compare it against the workforce screen log. A contractor present in the operational record but absent from the screening log is a finding.

Second, they ask for **vendor compliance attestations** for the most recent twelve months. Missing attestations are a finding.

Third, they ask for **at least one vendor on-site verification** for high-risk categories. The verification documents that the vendor's program is actually running, not just papered. Programs that have never conducted a single on-site verification are findings even when the attestation log is complete.

## Where to start

The cheapest fix is contract language. Add the four-prong vendor screening clause to every healthcare-related contract above a small spend threshold and amend renewal cycles to bring legacy contracts into compliance. Layer the provider-side screen on top through a CRA's [healthcare screening package](/services). Our [CMS exclusion playbook](/blog/cms-exclusion-screening-oig-leie-sam), [state Medicaid map](/blog/state-medicaid-exclusion-lists-by-state), and [LEIE monthly process](/blog/oig-leie-monthly-update-process) cover the underlying federal mechanics. For program-build help start at [contact](/contact); pricing for the monthly bundle is on [pricing](/pricing).`,
};
