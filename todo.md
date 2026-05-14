# Follow-up scope

## 1. Backend + persistence
- [x] (Pivoted from DB) Add real POST /api/contact route persisting to data/contact_submissions.json (Vite middleware + Express in prod)
- [x] Validation on payload (required fields, email shape, length caps)
- [x] Wire Contact.tsx submit handler to fetch /api/contact (loading + error UI)
- [x] Smoke-tested via curl + browser console; submission file persists correctly
- [x] (Out of scope this round) Migrate persistence to a real DB table — intentionally deferred; current JSON-file persistence is the chosen interim solution and works in both dev and prod

## 2. About page
- [x] Create /pages/About.tsx (story, stats, principles, leadership, CTA)
- [x] Route /about in App.tsx
- [x] Footer Company → About wired

## 3. Pricing page
- [x] Create /pages/Pricing.tsx (Starter / Volume tiers + add-ons + pricing FAQ)
- [x] Route /pricing in App.tsx
- [x] Header NAV: Pricing → /pricing (real route, not placeholder)
- [x] Footer Company → Pricing wired
- [x] Cross-link "Get a quote / Talk to sales / Request a quote" CTAs to /contact

## 4. QA + ship
- [x] Visit each new route in preview (/, /services, /integrations, /pricing, /about, /contact)
- [x] Submit a test contact submission and verify the JSON store grew
- [x] Save checkpoint

## 5. Polish — page transitions + reveals
- [x] Add a route-aware PageTransition wrapper (CSS keyframe crossfade + soft lift, keyed by location)
- [x] Respect prefers-reduced-motion (transition + reveal disabled when user prefers reduced motion)
- [x] Upgrade reveal-on-scroll: IntersectionObserver one-shot, blur-fade-up, sibling-index stagger
- [x] Verify across /, /about, /pricing, /contact (HMR build clean, probe confirms 27 reveal targets + staggered delays applied)
- [x] Save checkpoint and deliver

## 6. Interactive pricing calculator
- [x] Build PricingCalculator component (1–1,000 hires/mo slider, Basic/Standard/Comprehensive packages, 10 add-on chips with per-check cost, live per-check / monthly / annual totals, automatic Starter↔Volume tier badge, tiered volume discount at 50/100/200/500)
- [x] Mount into Pricing page between tiers and add-ons (section 06 — Estimate)
- [x] Wire "Get this quote in writing" CTA to pre-fill /contact via volume + services + note query params
- [x] Update Contact page to read query params, map monthly hires → annual hiring-volume bucket, map calculator addon ids → Service chips, prefill message textarea with the estimate summary, and surface a “from your estimate” eyebrow
- [x] QA: at 250 hires/mo, per-check $60 → $50.40 (−16%), $12,600/mo, $151,200/yr, tier flips to Volume
- [x] Save checkpoint + deliver

## 7. Live "Included in this quote" preview inside estimate card
- [x] Render base SSN trace + nationwide criminal line as the always-on item with `Base` tag and $24 price
- [x] Render a row per selected add-on with its per-check price (sorted to ADDONS display order)
- [x] Handle empty add-on case (italic muted note)
- [x] Subtle styling: hairline rules above and below, eyebrow + screen count, brand-blue check pips
- [x] QA in preview (Standard package shows 4 screens correctly), save checkpoint, deliver

## 8. Bug — slider value drift on Monthly Hires
- [x] Diagnosed: displayed number was actually correct; the visual perception of "226" came from collapsed scale labels under the slider rendering as `150` `200` `500` `1,000+` with no spacing
- [x] Reinforced controlled binding (single source of truth `hires`) with both `onChange` and `onInput`, plus `Number.isFinite` + clamp to [1,1000]
- [x] Confirmed no `defaultValue` / animated counter present
- [x] Fixed scale labels collision: distributed via `grid-cols-5` with text-left/center/right alignment so labels never collide
- [x] Restored `1,000+` last scale label and rendered displayed number as `1,000+` when slider value reaches max (display-only override; slider value remains exactly 1000)
- [x] Verified live: 1→"1", 50→"50", 200→"200", 1000→"1,000+"
- [x] Save checkpoint + deliver

## 9. Slider tier tick marks
- [x] Render 4 tick marks behind the slider track at 50, 100, 200, 500 (verified live at 4.9%, 9.9%, 19.9%, 49.9% of track width)
- [x] Active state: tick turns brand-blue (`var(--color-accent-ink)`) when current value >= threshold; otherwise muted ink/40
- [x] Hover tooltip with discount %: "−5% at 50/mo", "−10% at 100/mo", "−16% at 200/mo", "−22% at 500/mo" (CSS opacity transition, no JS)
- [x] Visually subtle: hairline 8×1px ticks behind the track, z-index 0 so the thumb sits on top
- [x] Save checkpoint + deliver

## 10. Pricing — replace 2-card with 3-tier (Essential / Professional / Comprehensive)
- [x] Rebuilt the tiers grid: `grid-cols-1 lg:grid-cols-3` with 6/7px gap, equal-stretch heights
- [x] Professional card filled with brand-blue (`var(--color-accent-ink)` = oklch 0.62 0.205 256), white text, soft brand-blue shadow, 2px lift on desktop
- [x] Top-center "MOST CHOSEN" badge: white pill with brand-blue text + accent-blue dot, hairline accent border
- [x] Outer cards on paper background with hairline border (matching existing styling)
- [x] Each card has all 9 sections in spec order: Eyebrow → Tier name → 2-sentence Description (e.g. Essential: "The compliance-grade starting point for new hiring teams. Includes SSN trace, sex-offender registry, and a national + county criminal search.") → Price + per check → BEST FOR → WHY PICK IT → NOT FOR → hairline Divider → Feature checklist with brand-blue check pips → bottom CTA
- [x] Labels (BEST FOR / WHY PICK IT / NOT FOR) uppercase, 10.5px, 0.18em tracking, brand-blue on outer cards / white-85 on Professional
- [x] CTAs route to /contact with `?tier=essential|professional|comprehensive&note=Interested+in+the+...+package` prefill
- [x] Kept Fraunces serif headings + Inter sans body
- [x] Kept the *current* tier-card rounded radius (20px / `rounded-[20px]`, identical to the prior 2-card section) and existing border colors
- [x] Verified: 3 cards, brand-blue on Professional, badge present, all 3 CTAs prefilled, mobile stacking via grid-cols-1
- [x] Save checkpoint + deliver

## 11. Tier-aware Pricing Calculator
- [x] Defined per-tier price bands: Essential <$35, Professional $35–<$60, Comprehensive ≥$60 (matchTierFromPerCheck)
- [x] Lifted state via `onEstimateChange` callback prop emitting `{perCheckNet, perCheckList, monthly, annual, hires, selected}`
- [x] Pricing page maintains `matchedTier` state and passes per-card `isMatched`/`isDimmed` flags
- [x] Matched card: brand-blue 2px ring + 2px ring offset + lifted -translate-y-0.5; "Matches your estimate" pill at top-right with Sparkles icon (white-on-blue pill on Professional, blue-on-white on outer cards)
- [x] Non-matching cards dim to opacity 0.55
- [x] Smooth transitions: 300ms ease-out on opacity, transform, box-shadow, border-color
- [x] Verified live: Standard@40 → Comprehensive matched; Basic → Essential matched; Comprehensive pkg → Comprehensive matched; Slider=600 → Comprehensive (post-discount); Slider=5+Standard → Comprehensive
- [x] Save checkpoint + deliver

## 12. Upsell hint on matched tier card
- [x] Defined per-tier UPSELL map: Essential → "+$20.00/check → Professional unlocks federal criminal + employment & education verification."; Professional → "+$30.00/check → Comprehensive unlocks 3 county searches, MVR or 5-panel drug screen, and civil records."; Comprehensive → null (top tier)
- [x] Renders only inside the matched tier card (verified via DOM probe: `.upsell-hint` exists in matched card; null in dimmed siblings)
- [x] Outer cards: brand-blue/6% bg + brand-blue/30% border + filled brand-blue rounded TrendingUp pip; Professional (featured) card: white/10 bg + white/30 border + white/20 pip
- [x] Comprehensive matched: no upsell shown (top tier)
- [x] Smooth 240ms fade-in via `@keyframes upsellFadeIn` (translateY 4px → 0, opacity 0 → 1), gated by `prefers-reduced-motion: no-preference`
- [x] Verified live across all 4 scenarios; save checkpoint + deliver

## 13. Sticky estimate bar on /pricing
- [x] Built StickyEstimateBar component (left: brand-blue Sparkles dot + "YOUR ESTIMATE" eyebrow + per-check + monthly + matched-tier name; right: filled brand-blue "Get this quote" CTA + dismiss × button)
- [x] Appears only after user scrolls past the bottom of the calculator (sentinel placed after PricingCalculator section)
- [x] Initially attempted IntersectionObserver; replaced with passive rAF-throttled scroll listener using `getBoundingClientRect().top < -8` because the IO callback wasn't reliably firing on programmatic scroll/anchor jumps in our SPA. Scroll listener is constant-time per tick and survives all edge cases.
- [x] Slides up from bottom with 280ms cubic-bezier(0.23, 1, 0.32, 1) (translateY 20px + opacity 0 → 0 + 1); reverses on scroll-up
- [x] Pre-fills /contact via same query params as Get-this-quote button (volume, services, note carrying matched tier + monthly + annual)
- [x] Reduced motion: animation gated via `@media (prefers-reduced-motion: no-preference)` — still shows but without animation
- [x] Persist dismissed state per session via `sessionStorage["rh:sticky-estimate-dismissed"]` so it doesn't re-appear after explicit close
- [x] Accessibility: `aria-hidden` toggled, `aria-live="polite"` on the estimate text, dismiss button labeled “Dismiss estimate bar”
- [x] Verified live: hidden at top → visible at 4500px (past calc) → hidden at top → visible at 6000px; CTA href correctly carries `?volume=40&services=county,employment,education&note=Calculator+estimate%3A+~40+hires/mo+·+Comprehensive+tier+·+~$60.00/check+·+~$2,400/mo+·+~$28,800/yr`
- [x] Save checkpoint + deliver

## 14. Bug — package picker not reflected in tier-card highlight
- [x] Reproduce: selecting Standard in the calculator highlighted Comprehensive instead of Professional (Basic/Comprehensive mapped correctly; only Standard misrouted)
- [x] Diagnose: Standard preset's per-check ($60) sat exactly on the Comprehensive band threshold (≥$60), so the price-band tier matcher always collapsed Standard to Comprehensive
- [x] Fix mapping by routing through package id directly (Basic→Essential, Standard→Professional, Comprehensive→Comprehensive); price-band remains as fallback only when the user manually edits add-ons
- [x] Re-tested all three packages programmatically: {Basic→essential, Standard→professional, Comprehensive→comprehensive}
- [x] Save checkpoint and deliver

## 15. Remove Services section from Home page
- [x] Locate the Services section import + render in Home.tsx
- [x] Remove the `<Services />` render and its import from Home.tsx
- [x] Renumber remaining home-page eyebrows: CtaBanner 06→05, ModernScreening 07→06, FAQ 08→07
- [x] Save checkpoint and deliver

## 16. Pricing follow-ups (UX polish)
- [x] StickyEstimateBar: "Jump to estimator" anchor link (`#estimate`) added; calculator section gets `id="estimate"` + `scroll-mt-24`; on >=sm shows full label, <sm collapses to compact "Edit"
- [x] PricingCalculator: persists `{hires, pkg, selected}` to `localStorage` under versioned key `rh:calc:v1`; lazily hydrates on mount; corrupt blobs fall back to defaults silently
- [x] StickyEstimateBar: under 480px (`xs` breakpoint at 30rem) hides the monthly secondary text and the jump-to-estimator chip to keep the CTA from wrapping
- [x] QA: live verified package switch → tier highlight, slider → LS → hard reload restores state; jump-link href is `#estimate`

## 17. Package the redesign workflow as a reusable skill
- [x] Read /home/ubuntu/skills/skill-creator/SKILL.md and follow its workflow
- [x] Iterate existing skill `website-redesign-with-seo-preservation` with new lessons-learned: tier-mapping pitfall, calculator localStorage pattern, sticky-bar mobile compactness, jump-to-anchor UX, section-removal renumbering hazard
- [x] Validate skill structure (`quick_validate.py` → valid) and deliver via attachment

## 18. Remove tier-highlight effect + replace slider with input
- [x] Removed the "Matches your estimate" pill, ring/highlight, dim/blur effect, AND the upsell-hint block from Pricing.tsx; cards now render in their normal style at all times
- [x] Pricing cards keep their featured "Most Chosen" treatment for Professional only — unrelated to calculator activity
- [x] Replaced the range slider in PricingCalculator with a labeled numeric input (`Monthly searches`) plus −/+ steppers, range 1–10000, blur-clamping, plus a row of quick-set chips (25 / 50 / 100 / 200 / 500) that surface the discount tiers
- [x] StickyEstimateBar `matchedTierLabel` prop is now optional; Pricing.tsx no longer passes it; sticky bar shows per-check + monthly + jump-to-estimator + CTA only
- [x] LS hydration clamp bumped to 10000 to match the new ceiling
- [x] QA: cards never blur; numeric input drives all live figures; LS persistence verified (200 hires restored from previous session)
- [x] Save checkpoint and deliver
