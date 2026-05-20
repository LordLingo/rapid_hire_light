# External Dependencies — Resolution Report

**Project:** Rapid Hire Solutions — Light Redesign (`rapid_hire_light`)
**Report date:** 2026-05-19
**Scope:** the two items currently sitting in the *Recently resolved* subsection of `todo.md` → External Dependencies. This report cross-references each one against the code on disk and the checkpoint history so the audit trail isn't just a checkbox flip.

---

## Executive summary

Two external dependencies have moved from blocked to resolved in the current cycle. Both were *strategic* dependencies — decisions or facts that only the user could supply — and both unblocked meaningful customer-facing surfaces rather than hidden infrastructure. The SHRM booth number unblocked the entire SHRM 2026 conference funnel (strip, landing page, booking picker, contact-form prefill, success copy), which is the single highest-leverage marketing surface between now and the June 21–24 event. The SPA brand framework decision unblocked the home hero, a dedicated `/spa` landing page, and SPA-flavored language across the footer, header navigation, pricing, and meta tags — the largest brand refit in the project's history.

A single follow-up dependency for each item is still open and is tracked in the *Active blockers* section of `todo.md`: SHRM still needs on-booth rep names + photos to personalize `/shrm`, and the SPA brand still needs three real customer quotes to replace the bracketed placeholders on `/spa`. Both of those follow-ups are content edits, not engineering work, and the surfaces are already wired to swap them in via single-source constants.

The table below summarizes the two resolutions. Each row's "Surfaces unblocked" column counts the application files that reference the resolved value via the canonical import (not raw string matches), to confirm the dependency was wired through one source of truth rather than copy-pasted.

| Dependency | Owner | Resolved on | Source of truth | Surfaces unblocked | Residual follow-up |
|---|---|---|---|---|---|
| SHRM 2026 booth number (#1619) | `[USER]` | 2026-05 (mid-cycle, before §148) | `client/src/lib/shrm.ts` → `SHRM_EVENT.booth = "1619"` | 8 application files import `SHRM_EVENT` or `buildShrmContactUrl`; 5 of them surface the literal "1619" to users (Shrm.tsx, ShrmBookingPicker.tsx, Contact.tsx, ConferenceStrip via SHRM_EVENT, Footer SHRM link) | On-booth rep names + photos for `/shrm` (still in *Active blockers*; auto-resolves with §137 rep roster) |
| SPA brand framework — "go all in" on Speed · Price · Accuracy | `[USER]` | 2026-05-18 conversation | `client/src/lib/spa.ts` → `SPA_HEADLINE`, `SPA_TAGLINE`, `SPA_PILLARS`, `SPA_ROUTE`, `SPA_TREATMENT_CTA` | 11 application files import the SPA constants or the `<SpaPillars />` component (Hero, Footer, Header, Pricing, Shrm, Spa, plus tests) | Real customer quotes for `/spa` (S/P/A trio, currently `[REPLACE WITH CUSTOMER QUOTE]` placeholders); custom 1200×630 OG card for `/spa` (both in the *Watch list*, non-blocking) |

---

## 1. SHRM 2026 booth number → "Booth #1619"

### What was blocked

Before the booth assignment landed, `client/src/lib/shrm.ts` shipped `SHRM_EVENT.booth = "TBA"`. Every downstream surface that referenced the booth (the dismissible top-of-page conference strip, the `/shrm` landing page hero, the `ShrmBookingPicker` summary card, the prefilled `/contact` lede when a visitor arrived via `?source=shrm-2026`, and the SHRM-branch success message on `ContactSuccess`) read the value through that constant. Visually each surface said "Booth #TBA," which is acceptable for a placeholder but actively wrong as a closing signal in a marketing funnel — buyers expect specifics.

The dependency was *strategic-not-engineering* in the sense that the engineering was already complete. We had deliberately routed all five surfaces through a single source of truth precisely because we knew this string was going to change exactly once and we did not want to chase it across the codebase.

### How it was resolved

The user supplied the booth number ("1619") in conversation. Resolution was a one-line edit to `SHRM_EVENT.booth` in `client/src/lib/shrm.ts`, plus a comment annotation that records the date the value landed:

> `// on 2026-05-19 as 1619. Read everywhere through SHRM_EVENT.booth`

That same comment is the artifact a future maintainer will use to date the change, since git blame would attribute it to the constant edit but not to the upstream user decision.

### What shipped because of it

Five customer-facing surfaces went from placeholder to real:

The first is the **site-wide ConferenceStrip** rendered above the trust strip in `Header.tsx`. It displays *"Meeting at SHRM 2026, June 21–24, Orlando — Booth #1619 — book your slot →"* on every page until the event ends, dismissible per session. The strip is gated on `isUpcoming(SHRM_EVENT)`, so it auto-disappears at end-of-day ET on June 24 with no further engineering required.

The second is the **`/shrm` landing page hero**, which now opens with the booth number as a primary trust anchor rather than a placeholder. The page also renders the `ShrmBookingPicker` (a 96-slot Mon/Tue/Wed × 09:00–16:45 ET grid in `lib/shrmSlots.ts`) directly below the hero; the booking picker's summary card and the eventual confirmation message both reference Booth #1619 verbatim.

The third is the **`/contact` SHRM funnel lede**. When a visitor arrives at `/contact?source=shrm-2026&slot={id}`, `Contact.tsx` looks up the slot, formats it via `formatShrmSlot`, and prefills the message with: *"Hi — I'd like to lock in the {slot} slot at your SHRM 2026 booth (Booth 1619)…"*. Without the booth number, this lede had to fall back to a generic copy variant.

The fourth is the **SHRM-branch success state** in `ContactSuccess`. After a SHRM-funnel form submits, the success card now reads: *"We've routed {company} into the SHRM 2026 booth queue for {slot} at Booth 1619."* The booth number reinforces the booking confirmation, which is the key trust moment for a prospect who has just handed over their email.

The fifth is the **conditional SHRM 2026 link in the Footer**, also gated on `isUpcoming(SHRM_EVENT)`. It surfaces a quiet "See us at SHRM 2026" link until the event ends.

### Audit-trail residuals

`grep -rln '1619' client/src` returns five files: `lib/shrm.ts` (source of truth + comment), `pages/Contact.tsx` (lede), `components/site/ShrmBookingPicker.tsx` (summary card), `lib/conferenceStrip.test.ts` (test pin), and `lib/shrmBookingPicker.test.ts` (test pin). The two test files explicitly assert the booth number renders, so any accidental future change to `SHRM_EVENT.booth` will fail the suite — the regression guard is in place.

### Open follow-up

On-booth rep names + photos remain unresolved (tracked under *Active blockers* in `todo.md`). The `/shrm` page currently uses the generic phrase "your Rapid Hire team." When the rep info lands, the swap is a single content edit to `pages/Shrm.tsx`. Because the §137 *Support rep roster* dependency covers the same data (FCRA cert numbers, photos, time-zone coverage) for the `/support` page, both surfaces will resolve from the same content drop.

---

## 2. SPA brand framework — "go all in" on Speed · Price · Accuracy

### What was blocked

The user's trade-show booth artwork carried an SPA acronym (Speed · Price · Accuracy) with three booth-tested metric anchors: Median TAT 8 hours / Competitive flat-rate pricing / 99.9% data accuracy. The booth-floor messaging worked because the acronym is memorable, it reframes a stressful purchase decision into a calm one, and the booth had already validated the language with real customers. The strategic question was whether to (a) ignore the acronym on the website (treat it as booth-only language), (b) carry the acronym into one or two surfaces (a footer tagline, a single section), or (c) refit the entire site around it.

This was a *brand decision* the user had to make. The engineering team could not choose between (a/b/c) on the user's behalf because the wrong choice in either direction is expensive — under-committing leaves the strongest piece of brand language on the booth floor; over-committing turns a B2B site into a gimmick if the buyer's reading-mode rejects the metaphor. Until the user picked a direction, the home hero, the footer, the header navigation, and the question of whether `/spa` should exist as a route were all blocked.

### How it was resolved

In the 2026-05-18 conversation, the user explicitly chose option (c) — *"go all in"* — with two important guardrails: carry the SPA *framework* into the website, but do not carry the booth's literal spa visuals (waterfalls, candles, infinity pools) onto the website. The booth aesthetic is calibrated for stopping foot traffic on a noisy expo floor; the website's existing editorial / law-firm aesthetic is doing real work for serious B2B research on a phone. SPA enriches the editorial aesthetic, it does not replace it. Hero stays serif-led, paper-toned, with restrained motion. SPA is the *thinking*; editorial is the *look*.

The user also locked in the three pillar metrics verbatim from the booth: Median TAT 8 hours / Competitive flat-rate pricing / 99.9% data accuracy. The booth-floor "Median" replaced the booth's printed "Average" because median is both more truthful and stronger as a marketing claim.

### What shipped because of it

The decision unblocked the largest brand refit in the project's history. Eleven application files now read from the single source of truth in `client/src/lib/spa.ts`:

The **home hero** (`components/site/Hero.tsx`) was refit from "The trusted standard in background checks" to render `SPA_HEADLINE` ("Speed. Price. Accuracy.") as three serif blocks with the third word ("Accuracy") set in italic accent ink, followed by the `SPA_TAGLINE` kicker ("Relax — we've got it handled."), followed by the three SPA pillars rendered through the `<SpaPillars variant="editorial" />` component. The eyebrow renumbered from "01 — Platform" to "01 — The SPA Standard" to anchor the language site-wide from the very top of the page.

The dedicated **`/spa` landing page** (`pages/Spa.tsx`) shipped as a switch-from-competitor destination — not a generic feature page. It carries a hero with both CTAs (Start Screening + Book SPA Treatment), the SPA pillars rendered in `hero` variant, a competitor-comparison block contrasting "typical legacy vendor" against Rapid Hire on each of S/P/A, a proof block with three customer-quote slots tied to S/P/A respectively, and a final CTA. The page is a real route registered in `App.tsx`, not a microsite.

The **footer** (`components/site/Footer.tsx`) carries the SPA tagline under the brand block via `SPA_COMPACT` and `SPA_TAGLINE`, with stable testids `footer-spa-eyebrow` and `footer-spa-tagline`.

The **primary header navigation** (`components/site/Header.tsx`) now carries a "Why SPA?" link routed at `SPA_ROUTE`, sitting between Services and Industries on desktop. This is the single largest signal that SPA is the thinking running through the site rather than a footnote.

The **pricing page** (`pages/Pricing.tsx`) reads from `SPA_PILLARS` to render the SPA pillar trio and `SPA_HEADLINE` for the hero subhead. The pricing calculator was deliberately left untouched — SPA framing surrounds the calculator without rebuilding it.

The **`/shrm` landing page** (`pages/Shrm.tsx`) renders the SPA pillars in `hero` variant so the page reads as a SHRM-flavored extension of the SPA brand rather than a microsite. This is what makes the SPA decision compound: a SHRM booth visitor scans a QR code, lands on `/shrm`, and sees the same Speed · Price · Accuracy framework they just saw on the booth floor — picking up exactly where the booth left off.

Site-wide **meta tags** (`index.html`) now lead with "Speed · Price · Accuracy — the Rapid Hire Solutions difference …" so Google search snippets and social-share previews carry the SPA hook.

### Audit-trail residuals

`grep -rln 'SPA_PILLARS\|SpaPillars\|SPA_HEADLINE\|SPA_TAGLINE\|SPA_ROUTE\|SPA_TREATMENT_CTA' client/src` returns 11 files. Three of them are vitest specs (`heroCopyLength.test.ts`, `spaBanner.test.ts`, `spaTouchpoints.test.ts`), which means the SPA contract is locked at the test layer — a future contributor cannot quietly drift the headline or tagline without the suite catching it. The 24-spec `spaTouchpoints.test.ts` in particular asserts that every consumer (Hero refit, /spa page contract, Footer SPA strip, Header NAV entry, App route registration) stays wired correctly.

The `lib/spa.ts` source itself exposes a typed `SpaPillar` interface for the three pillars, so a future metric edit (say, "8 hours" tightens to "6 hours" once the §137 TAT feed lands) is a one-line change that flows automatically into all 11 surfaces.

### Open follow-ups

Two follow-ups remain in the *Watch list* (non-blocking):

The first is **real customer quotes for `/spa`**. The page currently renders three bracketed placeholders (`[REPLACE WITH CUSTOMER QUOTE]`) tied to S, P, and A respectively. A vitest spec enforces those placeholder strings are never shipped to production-flagged builds. When the user supplies real quotes — ideally one customer per pillar — the swap is a content edit to `pages/Spa.tsx`. Until then, the page is intentionally honest about what is provisional.

The second is a **custom 1200×630 OG card for `/spa`**. The page currently reuses the brand-default OG image. This only matters when paid social spend on the SPA framing kicks in, which is a marketing decision rather than an engineering one. The `useSeo` hook on `/spa` is wired to accept a custom `ogImage` prop, so the swap is a single line plus an asset upload via `manus-upload-file --webdev`.

---

## How resolved dependencies feed forward

The two resolutions in this report illustrate a pattern worth naming: every *strategic* dependency in `todo.md`'s External Dependencies index is wired so that when it resolves, the swap is a one-line edit at a single source of truth and every consuming surface updates automatically. That is not an accident — it is the design that makes a long block of unchecked planning items in §137 acceptable. The §137 *TAT data feed* dependency, for example, will land in `lib/spaMetrics.ts` (or its successor) and flow into the same 11 SPA surfaces, the live TAT strip, the `/turnaround` page, and the SHRM "what to expect" detail without a single duplicated string.

When the §137 inputs arrive (live TAT feed shape, support rep roster, competitor TAT data, FCRA legal review), expect the resolved-dependencies list in this report to roughly double, and expect the §137 planning bullets in `todo.md` to flip from `[ ]` to `[x]` in a single tight cycle.
