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
