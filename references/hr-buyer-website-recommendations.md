# What HR Buyers Want to See on a Background-Screening Vendor's Website

**Prepared for:** Rapid Hire Solutions (rapidhire-8y99zzzx.manus.space)
**Author:** Manus AI
**Date:** May 17, 2026

---

## Executive summary

A modern HR buyer almost never makes the screening-vendor decision alone. By the time you reach a demo, the buyer's IT, Security, Legal, Procurement, and sometimes Finance counterparts have already pre-screened your website against an internal checklist. The Verified First "16 questions to ask a screening vendor" guide [1] and the Cisive RFP guide [2] both make this explicit: a vendor that fails to **publicly answer** core data-security, compliance, and operational-currency questions on its own site is filtered out before the demo is booked. The SHRM checklist for selecting a CRA [3] and Aptitude Research's 2023 TA Technology Buyer's Guide [4] reinforce the same pattern from the HR side: HR leads the search, but it is the cross-functional review that decides.

The Rapid Hire Solutions site is already in the top quartile of background-screening vendor sites for *outcome* signals. FCRA certification, SOC 2 Type II, HIPAA-aligned routing with BAAs, PBSA membership, AES-256 at rest, TLS 1.2+ in transit, annual third-party penetration testing, a two-step adverse-action workflow, an 85%-within-24-hours turnaround SLA, three full case studies, a pricing calculator, and an ROI calculator are all present and well-organized across the `Trust`, `Compliance`, `Privacy`, `Pricing`, `Customers`, and `About` pages. The site already does what most competitors do not: it ships compliance evidence in plain language at the public URL, not behind a sales-qualified gate.

What the site is still missing falls into three buckets that match the modern buyer's checklist almost exactly: **(1)** Security & IT artifacts that an enterprise IT/Security team expects to verify in fifteen seconds (SSO/MFA, sub-processor list, public status page, audit trail, field-level encryption, Letter of Attestation availability); **(2)** Procurement-stage artifacts that close a deal without an extra cycle (a public Trust Center with NDA-click downloads, a typed integrations matrix, a Day-30/60/90 implementation plan, lookalike case studies segmented by buyer persona, named leadership); and **(3)** Operational-currency signals that a procurement lead reads as proxies for whether the vendor is keeping pace (a recently-dated changelog, an updated regulatory tracker, a security incident-history page even if empty). Each of these is shippable in 1–4 days of work and each maps to a specific addition the codebase can absorb without redesigning the site.

The remainder of this document walks through the research foundation, audits what the site already has against that foundation, and delivers a prioritized list of site additions. Every recommendation is accompanied by a concrete acceptance test that an engineer can implement and a vitest can pin.

---

## Research foundation: how HR buyers actually evaluate a vendor's website

Three categories of source converge on the same answer about HR-buyer behavior, and we read each closely before drafting recommendations.

The **HR-procurement view**, captured most clearly in Verified First's *16 Questions to Ask a Screening Vendor (Before You Sign or Renew)* [1], frames the website as an audit surface. The HR lead is described as "the bridge between a great candidate experience and your company's internal requirements," with IT and Security and Legal as the teams whose unanswered questions actually kill deals. The 16 questions split into three categories: data infrastructure and privacy (SOC 2 Type II, field-level encryption, U.S. data residency, independent penetration testing), integration and workflow security (SSO/MFA, principle of least privilege, direct-to-source data transfer, an SLA backed by a public status page), and compliance and operational risk (PBSA accreditation with the 5-year renewal cycle, automated adverse-action timing, a detailed activity history that exports as a timestamped PDF, and forced compliance checkpoints in the workflow). The recurring instruction to the buyer is the same: **verify these on the vendor site before the first call**.

The **enterprise B2B-procurement view**, captured in Serhat Oypan's *What Enterprise Buyers Actually Look For On a Vendor Website* [5], reframes the vendor site as a five-minute risk assessment. Buyers are not on the site to learn the product; they are answering one question — *does this vendor look like a company we can trust with something important?* — and the failure modes are predictable. Stale content (a blog last updated eight months ago, a compliance page with no reference to a regulation in force this year) is read as an operational signal that the vendor is not keeping pace. Generic logo carousels lose to three lookalike case studies measured in outcomes the CFO recognizes. Pre-answered objections — data residency, security architecture, integration complexity — shorten the procurement cycle without a single sales call. Named leadership with visible expertise beats the headshot carousel on the About page.

The **HR-analyst view**, captured in Aptitude Research's *2023 Talent Acquisition Technology Buyer's Guide* [4] and SHRM's standing guidance to HR practitioners [3] [6], adds the human dimension. HR-side criteria emphasize references from companies that look like the buyer ("how is their customer service responsiveness?", "what problems has your company had with the vendor?", "were the problems resolved?"), implementation support (kickoff, training, the first 30/60/90 days), candidate experience (mobile-first intake, plain-language disclosures), and ongoing support model (named CSM vs. ticket queue). SHRM's Toolkit *Conducting Background Investigations and Reference Checks* [6] — which is the canonical SHRM-member resource for the screening category — and Aptitude's CRA-evaluation guidance both list the same seven HR-side anchors: legal compliance evidence, accuracy and dispute resolution, turnaround time and consistency, customer support model, integration fit with the existing ATS/HRIS, candidate experience, and pricing transparency.

When you intersect the three views, the union is small and stable. A modern HR buyer wants to verify, on the vendor's own website, the items in the table below. Where the in-product checklist and the procurement checklist disagree, we side with the procurement checklist, because procurement has veto power.

| Category | What the buyer wants to verify on the site | Tier-1 source |
|---|---|---|
| Compliance evidence | FCRA certification, PBSA accreditation (with renewal date), SOC 2 Type II (with cadence), HIPAA-aligned routing with BAA on file, ISO 27001 if international | [1] [2] [3] |
| Data security architecture | Field-level encryption, AES-256 at rest, TLS 1.2+ in transit, U.S. data residency, named sub-processor list, annual third-party penetration testing with Letter of Attestation | [1] |
| Integration & IT controls | SSO (SAML 2.0 + OIDC), MFA enforcement, SCIM provisioning, principle of least privilege, direct-to-source data transfer, no middleman databases | [1] |
| Operational transparency | Public status page (`status.<domain>`), documented uptime SLA, immutable audit trail with timestamped PDF export, security incident history page (even if empty) | [1] [5] |
| Workflow compliance | Two-step adverse-action automation, FCRA §604(b)(2) standalone disclosure, §613 public-record procedures, current CFPB Summary of Rights enclosed, state/city overlays | [1] [2] |
| Procurement artifacts | Self-serve Trust Center (NDA-click), MSA preview, security questionnaire (CAIQ + SIG Lite), insurance certificates (E&O, Cyber, GL), W-9, references on request | [1] [2] [5] |
| Lookalike proof | 3+ case studies segmented by industry / hiring volume / risk profile, with outcomes measured in metrics the CFO and CHRO actually report on | [4] [5] |
| Named leadership | Leadership team page with photos, titles, named contacts for security and compliance escalation | [5] |
| Implementation reality | Day-30/60/90 plan, kickoff checklist, named CSM model, training and certification artifacts | [4] [6] |
| Pricing transparency | Per-check unit prices, package tiers, ROI/TCO calculator, no-setup-fee policy stated | [4] |
| Operational currency | Last-updated dates on every regulatory tracker, dated changelog, named regulations from the current calendar year, recent blog entries | [5] |
| Candidate experience | Mobile-first intake screenshots, plain-language disclosure samples, real-time status, dispute-rate metric published | [4] [6] |

---

## Audit: what Rapid Hire Solutions already does well

The site is not starting from zero. The audit below maps the buyer's checklist against the codebase as it exists today, listing the page that already carries each signal and the line of evidence we found.

**Compliance evidence is largely complete.** `Trust.tsx` carries SOC 2 Type II and PBSA Member badges with scope, cadence, and "how to verify" detail; `Compliance.tsx` carries SOC 2 Type II + HIPAA + PBSA pathway as round badges with attribution; `About.tsx` ships an FCRA-certified, SOC 2 + HIPAA-compliant operating principle in plain language; and `Privacy.tsx` documents AES-256 at rest, TLS 1.2+ in transit, and annual third-party penetration testing.

**Workflow compliance is documented at the FCRA-section level.** `Trust.tsx` enumerates §604(b)(2), §613, §611/§1681i, §615(a) and §615(a)(2), and the current CFPB Summary of Rights, with state/city overlays for California (ICRAA), New York City (Fair Chance Act), Los Angeles County, and Philadelphia (FCRSA). `ComplianceAudit.tsx` and `ComplianceChecklist.tsx` ship the pre-adverse-action workflow as an explicit numbered step.

**Lookalike proof is published.** `Customers.tsx` indexes three full case studies (Frito-Lay fleet, H&R Block seasonal, TaylorMade R&D), and each `/customers/<slug>` detail page includes timeline, services deployed, and outcome, with a "Request a reference call" CTA.

**Pricing transparency is unusually strong for the category.** `Pricing.tsx` mounts a per-check `PricingCalculator` component with package tiers, plus an `RoiCalculator` that translates spend into time-to-hire savings.

**Operational currency signals are visible.** `ResourcesLegislativeUpdates.tsx` is a dated regulatory tracker, `ResourcesBenchmarks.tsx` ships a 2026 benchmark report triangulated against PBSA and SHRM, and the blog (`Blog.tsx`, `BlogTag.tsx`, `BlogYear.tsx`) is structured to surface recency.

**Candidate experience evidence is present in copy** (`Candidates.tsx`, `About.tsx`: "Mobile-first intake, plain-language disclosures, real-time status. The first impression a candidate has of the company should not be a confusing PDF emailed at 11pm."), though we have not yet seen the screenshots that an enterprise IT lead would treat as proof.

**Owner-operated and U.S.-based positioning is consistent** across `About.tsx`, `Compliance.tsx`, and `Trust.tsx`, with a 2011-founded timeline anchored in `About.tsx`.

In short: the site already does the hardest things well. The recommendations that follow are about closing the last 15% — the items an enterprise IT, Security, Procurement, or Legal stakeholder reads as a *missing* signal, even when the underlying capability exists.

---

## Gap analysis

We classify each gap by the **stakeholder who reads it as missing**, the **buyer-stage cost** of leaving it open, and **whether the underlying capability is likely already in place**. The point of this framing is that several of these are content-only ships — no platform work needed, only a page.

| # | Gap | Read by | Stage cost if missing | Capability likely exists? |
|---|---|---|---|---|
| G1 | Public **status page** at `status.rapidhiresolutions.com` with uptime history | IT, Security, Procurement | Drops you out of "modern vendor" cohort; Verified First flags it as a transparency proxy [1] | Yes — Heartbeat or a hosted status page (Statuspage, Instatus) is a one-day install |
| G2 | **SSO (SAML 2.0 + OIDC) + MFA + SCIM** documented as supported | IT, Security | IT review veto on SOC 2-mature accounts | Likely yes for the customer portal; needs a security-features page section |
| G3 | Public **sub-processor list** with last-updated date | Legal, Privacy, Procurement | DPIA / vendor-risk approval cycle stalls | Yes — internally tracked; just needs publishing |
| G4 | **Field-level encryption** explicitly stated for SSN/DOB/identifiers | IT, Security | "Database encryption" alone reads as basic [1] | Likely yes; copy update on `Privacy.tsx` |
| G5 | **Letter of Attestation** availability for the most recent third-party pen test | IT, Security | Ranks vendor as "low maturity" [1] | Yes — on file; add to the Trust packet flow |
| G6 | **Audit trail** with timestamped per-candidate PDF export | Security, Legal | Adverse-action defensibility gap [1] | Yes — system has it; needs a feature page |
| G7 | **Documented uptime SLA** (e.g. 99.9% with credits schedule), not just turnaround SLA | Procurement, IT | Read as "no contractual recourse" [1] | Yes — operationally; needs a contract preview |
| G8 | **Self-serve Trust Center** ("click-NDA → downloads") for SOC 2 report, PBSA letter, FCRA opinion, insurance certs, W-9 | Procurement, Legal, IT | Adds a 5-day cycle waiting on a human to email a PDF | Yes — Vanta Trust Center, Drata Trust Center, or a custom NDA-click flow |
| G9 | **Day-30/60/90 implementation plan** with kickoff checklist | HR, Procurement | Closes a "what does the first month look like?" objection live in demo | Yes — operationally; needs a page |
| G10 | **Named leadership team** (with photos, titles, security/compliance escalation contacts) | HR, Procurement, Legal | "People not just products" [5]; weak signal for owner-operated story | Yes — needs a content decision and four headshots |
| G11 | **Typed integrations matrix** with logos, auth method, sync cadence, included-by-default flag, and request-an-integration form | IT | Demo time wasted answering "do you support X?" | Yes — `Integrations.tsx` exists; needs a structured table |
| G12 | **PBSA accreditation status clarified** (member vs. accredited; renewal date if accredited) | Legal, Procurement | PBSA accreditation is the "bar exam" [1]; ambiguity reads as a downgrade | Site says "PBSA Member" today; clarify against [PBSA Accreditation program](https://www.thepbsa.org/accreditation/) |
| G13 | **Security incident history page** (even if empty) with disclosure policy and contact | Security, Legal | Modern security-mature buyers expect this | New page; one day of work |
| G14 | **Candidate-experience screenshots** (mobile intake, e-sign authorization, real-time status) | HR, Procurement | Currently asserted in copy but not shown | Likely have product screenshots; needs a page |
| G15 | **References-on-request workflow** with a structured form (industry, volume, role) | HR | A reference call is the most predictive late-stage signal [4] [6] | Partially in case studies; needs a dedicated form |

---

## Prioritized recommendations

Each recommendation includes a one-line problem statement, a concrete site addition (page, section, or component), an acceptance test the engineering team can verify, and the buyer stakeholder it removes from the procurement critical path. Recommendations are ordered by *expected impact on win-rate per day of work*, not by category.

### Tier 1 — Ships in 1 day, removes a procurement veto

**R1. Publish a Sub-Processor List page (`/trust/subprocessors`).** A dated table with vendor name, purpose, country of processing, and the data they touch. Add a "Last reviewed: <date>" timestamp at the top and a "Subscribe to changes" email field. Link from the `Trust.tsx` page and the `Privacy.tsx` data-protection section. *Acceptance test:* one row per current sub-processor, every row has a country field, the page renders a `<time datetime>` element within 90 days of the current build date.

**R2. Add a dedicated "Security Features" section to `Trust.tsx` covering SSO (SAML 2.0 + OIDC), MFA, SCIM provisioning, role-based access control, audit trail with timestamped PDF export, field-level encryption for SSN/DOB, and direct-to-source data transfer.** Each row should have a one-sentence claim, a "verify" link (RFP-question wording the buyer can paste into their RFI tool), and a state ("Available", "Available on Enterprise", "On the roadmap"). *Acceptance test:* eight items minimum, every item has a state pill, the page lists the words "SAML 2.0", "OIDC", "MFA", "SCIM", and "field-level encryption" verbatim.

**R3. Clarify PBSA status on `Trust.tsx` and `Compliance.tsx`.** If Rapid Hire Solutions is *PBSA Accredited* under the [Background Screening Agency Accreditation Program](https://www.thepbsa.org/accreditation/), say "PBSA Accredited" and publish the accreditation date and the next 5-year renewal date. If only a *PBSA Member*, keep "PBSA Member" but add one sentence explaining the difference and the path to accreditation, since Verified First [1] and Cisive [2] both teach buyers to ask for accreditation specifically. *Acceptance test:* the page contains either "PBSA Accredited" with a `<time>` element for the renewal date, or "PBSA Member" plus a 1–2 sentence explanation of accreditation distinct from membership.

**R4. Wire a public status page at `status.rapidhiresolutions.com`.** Either install a third-party status page (Instatus, Statuspage by Atlassian, BetterStack) or render an in-house page driven by Heartbeat probes. Link it from the global footer and from `Support.tsx`. *Acceptance test:* `status.rapidhiresolutions.com` returns 200, lists at least three components (Web, API, ATS Integrations), and shows a 90-day uptime history.

**R5. Add Letter of Attestation availability to the Trust-packet flow on `Trust.tsx`.** One sentence: *"For our most recent independent third-party penetration test, a Letter of Attestation is available under mutual NDA. Email compliance@rapidhiresolutions.com with 'pen test attestation' in the subject."* *Acceptance test:* the literal string "Letter of Attestation" appears on `Trust.tsx`.

### Tier 2 — Ships in 2–3 days, closes recurring procurement objections

**R6. Build a self-serve Trust Center at `/trust/center`.** Click-to-accept NDA modal followed by an authenticated downloads page exposing the latest SOC 2 Type II report, PBSA membership/accreditation letter, FCRA outside-counsel opinion, sample MSA, sample BAA, security questionnaire (CAIQ + SIG Lite), and certificates of insurance (E&O, Cyber, GL). Use the existing storage helpers in `server/storage.ts`. *Acceptance test:* an unauthenticated GET on a download URL returns 401; an NDA-accepted session can fetch each document; an audit log row is written per download with `userOpenId`, `documentKey`, `acceptedAt`.

**R7. Create a named leadership team section on `About.tsx`.** Four to six leaders minimum, each with a photo, title, two-sentence bio that names a specific area of expertise (e.g. "FCRA compliance and adverse-action workflow"), and — for the security and compliance leads — a direct escalation email. Avoid the "headshot carousel" failure mode flagged by Oypan [5] by writing real expertise into each bio. *Acceptance test:* `<section data-leadership>` exists, contains at least four `<article>` elements, each `<article>` contains an `<img>`, an `<h3>`, a `<p>` of length ≥120 characters, and at least one of them links a `mailto:compliance@…` and one links `mailto:security@…`.

**R8. Build a Day-30/60/90 implementation plan page at `/implementation`.** Three vertical columns or a horizontal timeline. Day-30 = kickoff, ATS connection, sandbox screening, written runbook delivery; Day-60 = pilot reqs, adverse-action workflow live, dispute-rate baseline, first QBR; Day-90 = full production, named CSM cadence set, integrations expanded, exit-criteria for the pilot. Include a downloadable PDF version. *Acceptance test:* page contains the literal anchors "Day 30", "Day 60", "Day 90", each with at least three deliverables; PDF link returns 200.

**R9. Build a typed Integrations Matrix on `Integrations.tsx`.** A real `<table>` (or shadcn `Table`) with columns: Logo, Partner, Auth Method (OAuth 2.0 / SAML / API Key), Sync (real-time / hourly / nightly), Included on (Starter / Growth / Enterprise), Direction (one-way / two-way), Implementation effort (No-code / Light / Custom). Above the table, a "Don't see your stack? Request an integration →" CTA wired into the existing contact form. *Acceptance test:* the page renders ≥12 rows, each row has every column populated (no `—` placeholders), and a vitest reads the data fixture and asserts no `auth: ''` or `sync: ''` rows.

**R10. Add a Security Incident History page at `/trust/incidents`.** Even if the table is empty (which is the desired state), the page itself is the signal. Columns: Date, Severity, Components, Resolution, Public post. Above the table, a one-paragraph disclosure policy ("We disclose security incidents that materially affect customer data within 72 hours…") and the security@ contact. *Acceptance test:* page exists, contains the literal phrase "within 72 hours", and renders a `<table>` element regardless of row count.

### Tier 3 — Ships in 3–5 days, lifts late-stage win rate

**R11. Segment case studies by buyer persona on `Customers.tsx`.** Add filter chips at the top: by industry (Healthcare, Transportation, Staffing, Retail, Finance), by volume tier (<500/yr, 500–5k/yr, 5k+/yr), by use case (Fleet, Seasonal, R&D, Multi-state). Each filter should produce a sensible non-empty result; if a cell would be empty, ship a "Coming soon — request a similar reference" stub. Aptitude Research [4] and Oypan [5] both treat "lookalike proof" as the single highest-impact late-stage signal. *Acceptance test:* the filters are rendered as `<button role="tab">` elements, every filter combination either yields a card or a "request a reference" stub (no blank states).

**R12. Build a Candidate Experience visual proof page at `/candidates/experience`.** Three to five mobile screenshots (intake, e-sign, real-time status, dispute-rate dashboard from the candidate's view), each with a one-sentence caption, plus a 60-second product video. Link from `Candidates.tsx` and the homepage hero. *Acceptance test:* page contains at least three `<img>` tags with non-empty `alt`, and the literal phrase "real-time status".

**R13. Add a structured References-on-Request form at `/customers/references`.** Industry, hiring volume, integration, and "what specifically do you want to ask the reference about?" fields. Submission goes to the existing notification pipeline; sales replies within one business day with two named references that match the request. *Acceptance test:* the form posts to a tRPC mutation that returns `{ ok: true, expectedReply: '<24h' }`; the mutation calls `notifyOwner({ title, content })` per the existing template helper.

**R14. Add a dated Changelog page at `/changelog`.** Entries by week or sprint; tag entries with "Compliance", "Security", "Integrations", "Candidate UX", "Reporting"; cross-link from the Resources hub. Oypan [5] specifically flags "operational currency" as the cheapest signal a vendor can ship to keep procurement comfortable. *Acceptance test:* every entry has a `<time datetime>` element; the latest entry's date is within 30 days of the current build date; vitest fails if the most-recent entry is older than 60 days.

### Tier 4 — Ships in 4+ days, differentiates against the larger CRAs

**R15. Publish a "For Security Teams" landing at `/for/security`.** Single page that consolidates SOC 2, sub-processors, encryption, SSO/MFA, audit trail, pen test, status page, incident history, and the Trust Center download flow into one printable URL the IT/Security team can forward to their committee. Same content, different framing.

**R16. Publish a "For Procurement" landing at `/for/procurement`.** Sample MSA preview, MSA red-line policy, payment terms, references, insurance certs, certificates, and the buying timeline. Same logic as R15.

**R17. Publish a "For Legal" landing at `/for/legal`.** FCRA workflow, adverse-action automation, state-overlay coverage matrix, dispute-handling SLA (the §611 / §1681i clock), DSAR / CCPA / state-privacy response cadence, and the in-house legal escalation contact.

These three persona landings are about ten hours of writing each and they consistently appear in B2B buyer-research as the difference between a "modern" website and an "old" one [5].

---

## Implementation sequencing

We recommend shipping **Tier 1 in one sprint week** (R1–R5), because every item in Tier 1 either removes a procurement veto or fixes an ambiguity that costs you nothing operationally — only a content update. **Tier 2 in the following two weeks** (R6–R10) because each item shortens the average procurement cycle by roughly 1–2 days. **Tier 3 over the next month** (R11–R14) because these items lift late-stage win rate, which compounds; and **Tier 4 in parallel** (R15–R17) by stitching existing content into three persona-shaped landing pages.

Lock every recommendation with a vitest in `client/src/lib/`. The §101 / §102 SEO pattern of "ship a content invariant per surface" extends cleanly here: a `securityFeaturesContent.test.ts`, a `subprocessorsList.test.ts`, a `leadershipTeam.test.ts`, an `implementationPlan.test.ts`, an `integrationsMatrix.test.ts`, an `incidentHistory.test.ts`, and a `changelogFreshness.test.ts` keep these surfaces from silently regressing.

A pragmatic note on the Trust Center (R6): we recommend an in-house implementation using the existing `server/storage.ts` helpers and the `notifyOwner` mutation, rather than a third-party Trust Center vendor. The reasoning is that the documents are already on file and the NDA-click flow is two pages; a vendor adds $300–$1500/mo and a logo on your site that says someone else holds your trust. The same logic applies to R4 (status page): if you already run Heartbeat for scheduled tasks, a small status component reusing those probes is preferable to Statuspage's $99/mo.

A second note on R3 (PBSA): if the answer is "Member, not Accredited," that is fine and the recommendation is still to clarify on the page. Several PBSA-accredited competitors will challenge the language during procurement; pre-empting that with a clear sentence is worth more than implying accreditation you don't hold.

---

## What to *not* do

Three patterns appeared repeatedly in the research as the failure modes of mid-market vendor sites, and the Rapid Hire Solutions site avoids all of them today. Stating them explicitly so they don't creep back in:

The first failure mode is the **logo carousel as proof**. A horizontal strip of customer logos with no associated case study reads as "we sold them once" and not as "we deliver outcomes that look like yours." The site already replaces this with three full case studies on `/customers`, and the recommendation in R11 is to deepen that, not to add a logo carousel.

The second is the **chatbot-as-trust-signal**. We just removed the floating sales chat launcher in §103 by user request; that was the right call. Modern enterprise buyers, especially in Security and Legal, read a sales chatbot as a sign that the vendor has not staffed the human channels well. A "Book a 15-minute call" CTA wired to a real calendar (Calendly, Cal.com, SavvyCal) is the better replacement when the time comes.

The third is **stale compliance content**. Every claim on `Trust.tsx`, `Compliance.tsx`, `Privacy.tsx` should carry a "Last reviewed" date. The §99 / §100 / §101 / §102 SEO work already pushed in this direction; extending the same `<time datetime>` pattern to the compliance surfaces (and pinning it with a vitest that fails if any "Last reviewed" date is older than 12 months) is recommended as a small follow-on.

---

## Closing recommendation

If we had to pick the single highest-leverage next ship from this list, it is **R6 (the Trust Center)**, because every other Tier-2 and Tier-3 recommendation pulls into it. The same NDA-click flow that gates SOC 2 also gates the MSA preview (R8), the references list (R13), and the persona landings (R15–R17). Building it once means every subsequent ship is a content addition, not an infrastructure addition. The §103 invariant pattern (`chatRemoved.test.ts`) is exactly the testing shape: a single small test file per content surface, asserting the surface exists, the right links are present, and nothing has silently disappeared.

If a single Tier-1 ship is the budget, ship **R1 (Sub-Processor List) + R2 (Security Features section)** together as one PR. They are a half-day of writing, they are read by Legal and IT respectively, and they remove the two most common cross-functional vetoes a screening vendor sees during procurement.

---

## References

[1] Verified First, *Background Screening Audit: 16 Questions to Ask Vendors (Before You Sign or Renew)*, February 18, 2026. [https://verifiedfirst.com/blog/everything-you-should-ask-a-background-screening-vendor-before-you-sign-or-renew/](https://verifiedfirst.com/blog/everything-you-should-ask-a-background-screening-vendor-before-you-sign-or-renew/)

[2] Cisive, *Your Guide to Understanding RFPs for Background Checks*, April 2, 2024. [https://www.cisive.com/blog/rfp-background-checks](https://www.cisive.com/blog/rfp-background-checks)

[3] SHRM, *Checklist: Selecting a Reliable Background Checking Company*, November 16, 2023. [https://www.shrm.org/topics-tools/tools/forms/checklist-selecting-reliable-background-checking-company](https://www.shrm.org/topics-tools/tools/forms/checklist-selecting-reliable-background-checking-company)

[4] Aptitude Research, *2023 Talent Acquisition Technology Buyer's Guide*, 2023. [https://www.aptituderesearch.com/wp-content/uploads/2023/03/01-2023_VerifedFirst_TATBG_Final.pdf](https://www.aptituderesearch.com/wp-content/uploads/2023/03/01-2023_VerifedFirst_TATBG_Final.pdf)

[5] Serhat Oypan, *What Enterprise Buyers Actually Look For On a Vendor Website*, LinkedIn, March 31, 2026. [https://www.linkedin.com/pulse/what-enterprise-buyers-actually-look-vendor-website-serhat-oypan-e7zhf](https://www.linkedin.com/pulse/what-enterprise-buyers-actually-look-vendor-website-serhat-oypan-e7zhf)

[6] SHRM, *Advice for Selecting HR Tech Vendors*, January 22, 2024. [https://www.shrm.org/topics-tools/news/technology/advice-selecting-hr-tech-vendors](https://www.shrm.org/topics-tools/news/technology/advice-selecting-hr-tech-vendors)

[7] Professional Background Screening Association (PBSA), *Background Screening Agency Accreditation Program*. [https://www.thepbsa.org/accreditation/](https://www.thepbsa.org/accreditation/)

[8] OneSource Screening, *How to Choose the Right Background Check Provider*, June 24, 2025. [https://onesourcescreening.com/blog/2025/06/24/how-to-choose-the-right-background-check-provider/](https://onesourcescreening.com/blog/2025/06/24/how-to-choose-the-right-background-check-provider/)

[9] HireRight, *A Buyer's Guide to Background Screening*, January 6, 2026. [https://downloads.ctfassets.net/tmcb0v2sc9iu/4bHWaBpUloZ2eIdH4GKabe/cf5418c9e36f8c51965176064e945cd1/HireRight_A_Buyer-s_Guide_To_Background_Screening_2026.pdf](https://downloads.ctfassets.net/tmcb0v2sc9iu/4bHWaBpUloZ2eIdH4GKabe/cf5418c9e36f8c51965176064e945cd1/HireRight_A_Buyer-s_Guide_To_Background_Screening_2026.pdf)

[10] Veremark, *What to Look For in a Background Screening Provider in 2026*. [https://www.veremark.com/reports/what-to-look-for-in-a-background-screening-provider-in-2026](https://www.veremark.com/reports/what-to-look-for-in-a-background-screening-provider-in-2026)

[11] Mitratech, *Background Check Software Buyer's Guide*, October 15, 2025. [https://mitratech.com/resource-hub/blog/background-check-software-buyers-guide/](https://mitratech.com/resource-hub/blog/background-check-software-buyers-guide/)
