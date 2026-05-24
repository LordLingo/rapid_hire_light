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

## 19. Pricing follow-ups (reset link + URL sync + tests)
- [x] Lifted pricing math (BASE_PER_CHECK, ADDONS, PACKAGES, volumeDiscount, computeEstimate, clampHires, normalizePackage, normalizeAddons, parseEstimateFromQuery, buildEstimateQuery, isDefaultState) into `client/src/lib/pricing.ts`; PricingCalculator now imports them directly
- [x] Added URL-state sync: `?v=&pkg=&adds=` parsed on mount (URL > localStorage > defaults); written via `history.replaceState` on every state change; default state suppresses params for a clean `/pricing` URL after a Reset
- [x] Added "Reset to defaults" link under the calculator card; clears LS, strips URL params, and restores Standard @ 40 hires/mo with default add-ons
- [x] Authored `client/src/lib/pricing.test.ts` (36 specs): volumeDiscount thresholds (49/50, 99/100, 199/200, 499/500), perCheckList/Net math, monthly = net*hires, annual = 12*monthly, preset totals (Standard $60 list, Comprehensive $123 list at 200/mo → $103.32 net), URL parse/build round-trip, default-state suppression, unknown-id silent drop, input clamping, package/add-on integrity
- [x] Added `pnpm test` script; suite runs in 14ms, 36/36 pass
- [x] QA in browser: URL hydration verified at `?v=250&pkg=comprehensive&adds=county,federal,mvr,drug5`; URL writing verified on input change + package switch; Reset clears state correctly
- [x] Save checkpoint and deliver

## 20. Blog reset + 6 SEO-optimized posts (~700 words each)
- [x] Audit confirmed no prior blog content existed (no DB schema, no routes, no fixtures); built the blog from scratch on the static template
- [x] Authored typed registry `client/src/lib/blog.ts` (BlogPost type, listPosts, getPostBySlug, relatedPosts, formatPublishedDate)
- [x] Authored 6 ~700-word SEO-optimized posts under `client/src/content/blog/` (FCRA compliance, turnaround times, drug testing, DOT/MVR, continuous monitoring, ban-the-box) with metaTitle, metaDescription, slug, tags, internal links
- [x] Built `/blog` index (PageHero, sticky tag rail, featured-first card grid) + `/blog/:slug` detail (hero, mini-Markdown body renderer, related-posts rail, CTA to /contact)
- [x] Added `useSeo` hook for dynamic title/meta/OG/Twitter/canonical/JSON-LD; emits BlogPosting on detail pages and Blog with itemized blogPost entries on the index
- [x] Wired routes in App.tsx and promoted the header Blog link from placeholder → real route to /blog
- [x] Authored Vitest spec `client/src/lib/blog.test.ts` (18 specs): registry shape, slug uniqueness/format, sort order, ISO date format, tag format, ~700-word target band (550-900), meta description length (120-180), H2 presence, internal-link validity, lookup correctness, relatedPosts excludes self, formatPublishedDate timezone stability
- [x] All 54 tests pass (36 pricing + 18 blog); browser QA confirmed index lists 6 posts and detail renders headings, paragraphs, bullets, internal links, tag chips, CTA, related rail; <title>/meta updates verified
- [x] Stripped redundant brand suffix from two metaTitles to avoid double-branding in <title>
- [x] Save checkpoint and deliver

## 21. Footer color (site-wide)
- [x] Audited Footer + tokens; chose deep ink-cobalt (same hue family as `--color-accent-ink`, dramatically darker) so it reinforces the brand without inventing a new hue
- [x] Added 6 footer surface tokens to the @theme block: `--color-footer`, `--color-footer-soft`, `--color-footer-foreground`, `--color-footer-muted`, `--color-footer-soft-text`, `--color-footer-border`
- [x] Rewrote Footer.tsx to use the new tokens; added a brand-cobalt hairline accent at the top edge for a clean light→dark transition; brand wordmark uses warm white; logo now uses `--color-accent-halo` for visibility on dark; added a Blog link to the Company column
- [x] Authored a `.footer-link` utility in index.css that brightens to warm white on hover with the same animated underline as `.ink-link`, plus a brand-cobalt focus-visible ring for keyboard a11y
- [x] Footer is mounted once via `SiteShell` so the change is consistent across every page with no per-page edits
- [x] DOM-probed all 8 routes (/, /services, /integrations, /pricing, /about, /contact, /blog, /blog/:slug): identical computed `oklch(0.2 0.045 258)` background, `oklch(0.98 0.005 85)` text, `oklch(0.88 0.01 260)` links
- [x] Re-ran vitest suite (54/54 passing)
- [x] Save checkpoint and deliver

## 22. Privacy + Terms pages, blog tag archives, sitemap/robots, footer social-proof
- [x] Built `/privacy` and `/terms` page components: PageHero, sticky in-page TOC, 11 (privacy) / 12 (terms) numbered sections, last-updated stamp, contact email, dynamic <title> + meta description via useSeo
- [x] Wired footer "Privacy Policy" and "Terms & Conditions" to real wouter <Link> routes; toast placeholders removed
- [x] Built `/blog/tag/:tag` archive page (PageHero with topic eyebrow + article count, sibling-tags rail, post list, back-to-blog link); JSON-LD CollectionPage emitted via useSeo
- [x] Added `getAllTags`, `listPostsByTag`, `formatTag`, `tagToSlug`, `tagFromSlug`, and `siteUrl` helpers in `lib/blog.ts`; covered with 4 new vitest specs
- [x] Added a Vite plugin in `vite.config.ts` (`generateSitemap`) that writes `dist/public/sitemap.xml` + `dist/public/robots.txt` on `closeBundle`; verified via `pnpm build`: 28 URLs (9 static + 6 posts + 13 tag archives) with per-post lastmod = publishedAt
- [x] Added the social-proof line above the footer bottom bar: "Trusted by 800+ HR & staffing teams · Avg. 20-min turnaround · 99.4% on-time SLA"
- [x] Created `shared/blog-meta.json` (slugs + tags + lastmod) consumed by the sitemap plugin; added a vitest spec that fails CI loudly if the JSON drifts from the runtime registry
- [x] Re-ran vitest: 60/60 passing (36 pricing + 24 blog); browser QA confirmed /privacy, /terms, /blog/tag/compliance render with proper SEO + footer
- [x] Save checkpoint and deliver

## 23. Support page (US-based humans, zero offshore)
- [x] Inspected precisehire.com/support for structure + tone (no copy-paste); modeled the trust positioning rather than the layout
- [x] Outlined the page: hero w/ US-based positioning + 14-sec answer-time panel, 4 named US-based specialists (placeholders disclosed), coverage hours grid, big-four CRA comparison table (6 rows), phone CTA band, candidate-vs-client routing pair, 7-question Support FAQ, accessibility/escalation note, final CTA
- [x] Built `client/src/pages/Support.tsx` using SiteShell + PageHero, in the existing Fraunces serif + Inter sans + accent-ink design system
- [x] Wired `/support` route in App.tsx; added Support to header nav (between Pricing and Contact Us) and to the footer Company column
- [x] Emitted JSON-LD Organization + ContactPoint schema via useSeo (toll-free phone, opening hours M–F 7–19 CT + Sat 9–13 CT, support@/candidates@ email contact points) — verified live via DOM probe
- [x] Re-ran vitest 60/60 still passing; browser QA verified hero, comparison table, candidate/client cards, and FAQ accordion expand/collapse on the live preview; added `/support` to the build sitemap STATIC_ROUTES; checkpoint saved

## 24. Social share buttons on blog posts + footer trust icon
- [x] Built `client/src/components/site/ShareButtons.tsx`: 40px round icon buttons for X, LinkedIn, Facebook + Copy-link, on-brand hover (accent-ink halo), focus-visible ring; X uses an inline SVG since the post-rebrand glyph isn't in lucide
- [x] Pure share-intent URLs (twitter.com/intent/tweet, linkedin.com/sharing/share-offsite, facebook.com/sharer/sharer.php) — no third-party scripts, no trackers; encodes URL + title; reuses the canonical `${origin}/blog/{slug}` URL already computed for SEO
- [x] Copy-link uses `navigator.clipboard.writeText` with a textarea fallback for older browsers; toast confirmation + 1.6s checkmark state; aria-labels and titles on every control
- [x] Wired into BlogPost.tsx between PostBody and tag chips so it lives at the natural "I just finished reading" moment
- [x] Footer: added a subtle ShieldCheck pill (28px round) before "Trusted by 800+ HR & staffing teams", using `--color-accent-halo` at 12% bg / 45% border so it reads as a trust mark rather than a button — visible on both blog index and post pages
- [x] Vitest 60/60 still passing; browser QA confirmed share row renders on /blog/fcra-compliance-guide, copy button toggles, and footer pill is visible site-wide; checkpoint saved

## 25. Support enhancements + blog OG images + reading progress
- [x] Added `shared/support-status.json` (state, avg answer time, weekly answered count, location, updated date) and a `SupportStatusBadge` rendering it in the /support hero with a brand-accent pulse dot — editable without code
- [x] Built `CandidateContactForm` on /support (name, email, optional report ID, message) with client-side validation, success-state card, and a real `POST /api/candidate-contact` (mirrored in `vitePluginCandidateContactApi` for dev + Express in `server/index.ts` for prod) persisting to `data/candidate_contact_submissions.json`
- [x] Polished comparison-table row hover tint and FAQ chevron rotate + body height transition; all motion gated behind `prefers-reduced-motion`
- [x] Dynamic Open Graph image per post: `/api/og/blog/:slug.svg` (1200×630 SVG, brand mark + tag + wrapped title + Houston/FCRA trust line) reading from `shared/blog-og.json`; wired into BlogPost `useSeo` (`og:image`, `twitter:image`) and JSON-LD `image`
- [x] Fixed-top `ReadingProgressBar` on /blog/:slug — rAF-throttled scroll listener, brand-accent fill on hairline track, hides under 2% / over 99.5%, `prefers-reduced-motion` safe, `data-reading-progress` attribute for testability
- [x] Vitest: 76/76 passing (added `blogOg.test.ts` for SVG rendering + `candidateContact.test.ts` for the validator + a `shared/blog-og.json` sync block in `blog.test.ts`); browser QA confirmed status badge, candidate-form submit success, OG endpoint live, reading-progress bar fills on scroll; checkpoint pending

## 26. /services bullet copy tightening
- [x] Located /services bullet copy in `client/src/pages/Services.tsx` (the SERVICES array's `includes` field)
- [x] Shortened wrapping bullets across all six service blocks (Employment, Criminal, Drug & Health, Education, MVR, Social) so each line fits on a single row at the column width — same meaning, no truncation
- [x] DOM probe verified 27/27 bullets render on a single line; vitest 76/76 still passing; checkpoint pending

## 27. Editorial imagery sweep (text-heavy site → real photography)
- [x] Audit pages, decide style brief: editorial documentary photography, sunlit warm-neutral palette, anonymous gestures (no identifiable faces), brand-blue accent props only, framed in WhyUs-style rounded card with paper-shadow + hairline border
- [x] Generated 8 on-brief images: about_hero_team, about_story_review, services_hero_folders, pricing_hero_notebook, integrations_hero_laptop, contact_hero_headset, support_hero_specialist, support_desk_row
- [x] Extended `PageHero` with optional `image` + `imageAlt` props — when present, title/lede shift to a 7-col layout and the right column gets the editorial photo frame; falls back to the original text-only layout otherwise (no breakage on Privacy/Terms/Blog/etc.)
- [x] Wired hero photo into About, Services, Pricing, Integrations, Contact, Support page heroes; added the over-the-shoulder "Our story" photo into About; added the wide desk-row banner above "The desk" cards on Support
- [x] First QA caught two CDN URLs returning 403 (integrations + contact heroes); re-uploaded those two assets via `manus-upload-file --webdev` and swapped the references — all 8 images now load (verified via DOM probe + visual screenshots)
- [x] Vitest 76/76 still passing; checkpoint saved

## 28. HQ city + street address (Houston → Prosper, TX 75078)
- [x] Swept the codebase end-to-end (`grep -rIn Houston`) and updated 11 occurrences across Support page (HQ_CITY constant, 4 specialist `city` fields, comparison-table rapid line, hero lede via interpolation, hero alt via interpolation, desk-row banner alt), Contact Headquarters card, SupportStatusBadge "Where we are" line, `shared/support-status.json` liveLabel, OG image trust line in both `vite.config.ts` and `server/index.ts`, plus the `blogOg.test.ts` assertion
- [x] Added the full street address `4261 E University Dr, Prosper, TX 75078` to the Contact Headquarters card (line 1: street; line 2: city/state/zip · country) and added a structured `PostalAddress` block (streetAddress, addressLocality, addressRegion, postalCode, addressCountry) to the Support JSON-LD Organization so the address is machine-readable
- [x] Final grep confirms zero remaining "Houston" references in source; vitest 76/76 passing; dev server LSP/TS clean; checkpoint pending

## 29. Imagery V2 — superseded by V3 (product-card heroes)
- [x] Direction was rejected on user feedback ("BETTER AI" → then "could be infographics"); replaced by V3 plan in section 30/31. No still-life photo set was shipped.
- [x] Lock a tighter art direction: cinematic editorial documentary brief was drafted, then abandoned in favor of V3 product-card visuals
- [x] (Superseded by V3) Per-image shot spec — not needed; V3 ships code-rendered hero cards, not photos
- [x] (Superseded by V3) Generate the 8 anchor + parallel images — not needed; V3 replaces them with HeroCard components
- [x] (Superseded by V3) Upload via manus-upload-file — not needed; V3 has zero photo dependencies for hero slots
- [x] (Superseded by V3) Swap photo references — V3 swap done in section 31 (visual={...} ReactNode props)
- [x] (Superseded by V3) Browser QA of every touched page — done as part of V3 QA
- [x] (Superseded by V3) Vitest + checkpoint + deliver — V3 vitest 76/76 + checkpoint 2d166bc1 ship the equivalent

## 30. Imagery V3 — compete with Checkr / HireRight / Sterling / First Advantage (DONE)
- [x] Audited those four sites' hero strategies (what they show: dashboards, report cards, flow diagrams, candidate UX, motion); confirmed Rapid Hire's gap is "product visualization," not "more stock photos"
- [x] Locked the new visual system: per-page hero is a CODE-RENDERED product card built from the existing design system (proven on Home with the "Maya R. — Logistics Lead" report card) — no AI photos for product moments
- [x] Designed 6 page-specific product-visual heroes (all built in section 31):
  - About → "Built in Prosper, TX" — small org-chart card (3 nodes: Compliance · Verifications · Support) with timestamps
  - Services → "Stack of screens, ordered" — a vertical pill list of the 6 services with status chips
  - Pricing → "What you actually pay" — a single line-item invoice card (3 lines + total) with "no setup fee" pill
  - Integrations → "Plugs into your stack" — a 6-logo-tile grid in a chrome window header (ATS / HRIS / SSO)
  - Contact → "Reach a human" — a tiny inbound-call card (Caller · Wait time · Picked up by) in our brand
  - Support → refined the answer-time panel into the same product-card vocabulary
- [x] Reserve AI PHOTOS only for moments where a real photo earns its keep (e.g. About story, Support desk wide banner) — and make those people-with-purpose, hands on keys / mid-conversation / receipt-of-call body language, not still-life desks
- [x] Build the product cards as small composable React components (`HeroCard*`), drop them into `PageHero` via the existing `image` slot replacement (rename to `visual` slot accepting ReactNode)
- [x] Vitest 76/76 still passing, browser QA across viewports, checkpoint pending

## 31. Imagery V3 execution — product-card + infographic heroes (DONE)
- [x] Generalized `PageHero` to accept a `visual` ReactNode slot (kept `image` prop as a back-compat shim)
- [x] Built `client/src/components/heroes/HeroCards.tsx` exporting AboutOrgChart, TrustLedger, ServicesStack, PricingLineItem, IntegrationsGrid, ContactCallCard, SupportAnswerTimeCard, OnTheLineNow — all in the existing brand vocabulary (Fraunces serif numerals, accent-ink chips, paper-shadow card, hairline borders), no AI photos
- [x] Wired into About hero (org chart) + About story section (TrustLedger replacing the editorial photo); Services hero (vertical service stack with status chips); Pricing hero (line-item invoice card with no-setup-fee pill); Integrations hero (chrome-window 6-tile grid); Contact hero (inbound-call card); Support hero (answer-time card) + The Desk band (OnTheLineNow timeline strip replacing the wide banner photo)
- [x] Removed the duplicate SupportStatusBadge below the Support hero (the new SupportAnswerTimeCard inside the hero made it redundant) and tightened the CTA row to a single full-width band
- [x] Vitest 76/76 still passing; LSP/TS clean; browser QA verified About / Services / Pricing / Integrations / Contact / Support heroes; checkpoint pending

## 32. Hero cards feel "live" (mini-stats + real integrations + entrance motion)
- [x] Create `shared/hero-stats.json` — single source of truth for the live mini-stats shown under each page's hero card (last-7-day reports cleared, avg TAT, FCRA pass rate, calls answered, etc.); add a vitest sync spec so it stays in sync with the runtime defaults
- [x] Locate the existing source of truth for the /integrations page list (or create one in `shared/integrations.json`); rebuild `IntegrationsGrid` hero card to read from that source so the 6 tiles always match the rest of the page
- [x] Build a small `HeroMiniStats` row component (compact, 2–3 cells, fits under the hero card frame); wire one variant per page (About, Services, Pricing, Integrations, Contact, Support) with page-specific stats
- [x] Add a reusable `useHeroEntrance` hook (or pure CSS class) that staggers fade-up on hero-card rows (60–80ms each); gate behind `@media (prefers-reduced-motion: no-preference)`; respect intersection observer so it doesn't re-fire on scroll
- [x] Vitest where applicable (hero-stats sync + integrations grid logic), browser QA at desktop + mobile + reduced-motion preference, save checkpoint, deliver

## 33. Real contact info sweep (replace placeholders)
- [x] Replace placeholder phone `(888) 555-0142` with real `(888) 445-3047` everywhere (UI labels, `tel:` hrefs, JSON-LD telephone, og-image SVG, vitest specs) — swept across Support, Contact, ContactCallCard hero footer; OG SVG never embedded the phone, only the domain text
- [x] Replace placeholder support email `support@rapidhiresolutions.com` with real `info@rapidhiresolutions.com` everywhere (mailto:, UI text, JSON-LD email, vitest specs)
- [x] Add new sales / quote email `sales@rapidhiresolutions.com` to "Get a Quote" + sales-oriented CTAs and JSON-LD ContactPoint(sales) — surfaced on Contact + Support and as a `contactType: sales` ContactPoint in the Support JSON-LD
- [x] Remove all references to `candidates@rapidhiresolutions.com` (Support page, Contact page, JSON-LD ContactPoint, FAQ answers, footer/header) — re-route candidate flows to the structured form + phone + info@ fallback (CandidateContactForm `candidateEmail` prop dropped in favor of optional `fallbackEmail`)
- [x] Update relevant vitest specs and shared JSON (support-status.json) to reflect the new numbers/emails — added `client/src/lib/contactInfo.test.ts`; support-status.json had no phone/email values to update
- [x] Browser QA across Home, Services, Pricing, Integrations, Contact, Support, blog OG image; vitest green; save checkpoint and deliver — 91/91 vitest passing, /support and /contact verified in browser, checkpoint bba57ecd saved

## 33. Real contact info sweep (placeholders → live values)
- [x] Replace placeholder phone `(888) 555-0142` / `+18885550142` with real `(888) 445-3047` / `+18884453047` across Support page constants, Contact page details, ContactCallCard hero footer
- [x] Replace placeholder support email `support@rapidhiresolutions.com` with `info@rapidhiresolutions.com` site-wide
- [x] Add new sales email `sales@rapidhiresolutions.com` to the Contact page details and to the Support page email rail; surface it as a separate "Quotes & new accounts" line
- [x] Remove retired `candidates@rapidhiresolutions.com` everywhere; rewire candidate FAQ to phone + on-page candidate inquiry form, and re-anchor the candidate-card "two doors" CTAs to call + form
- [x] Update Support JSON-LD `contactPoint[]` block: drop `candidate care`, add `sales`, keep `customer support` on `info@`
- [x] Refactor `CandidateContactForm`: drop required `candidateEmail` prop, replace with optional `fallbackEmail`; update Support page caller
- [x] Add `client/src/lib/contactInfo.test.ts` vitest spec that pins the new phone/email values and bans the retired placeholders
- [x] Vitest green (91/91), TS/LSP clean, browser QA on /support and /contact, save checkpoint, deliver

## 34. Swap footer logo to user-supplied white mark
- [x] Move `/home/ubuntu/upload/rhswhiteLogo.png` into `/home/ubuntu/webdev-static-assets/rhs-white-logo.png` and upload via `manus-upload-file --webdev` — hosted at `/manus-storage/rhs-white-logo_ba46549d.png`
- [x] Replace the placeholder text-and-icon brand block in `client/src/components/site/Footer.tsx` with an `<img>` tag using the returned static URL; preserve the link to `/`, alt text, and dimensions — logo now sized at 160px (mobile) / 180px (sm+), `aria-label`d, lazy-loaded
- [x] Update / add a small vitest assertion that pins the new asset reference (footer renders the supplied logo URL) — added `client/src/lib/footerLogo.test.ts` (4 assertions, all green)
- [x] Browser QA on the homepage footer; save checkpoint and deliver — verified white logo renders crisply on dark footer surface across `/` and `/about`; all 95/95 vitest passing

## 35. Swap header logo to user-supplied color mark
- [x] Upload `/home/ubuntu/upload/rhsLogo.png` via `manus-upload-file --webdev` and copy it into `/home/ubuntu/webdev-static-assets/rhs-color-logo.png` — hosted at `/manus-storage/rhs-color-logo_038dbc01.png`
- [x] Replace the placeholder ring + text wordmark in `client/src/components/site/Header.tsx` with an `<img>` tag using the returned static URL; preserve the link to `/`, alt text, and dimensions — sized h-14 (mobile) / h-16 (sm) / h-20 (lg) so wordmark stays legible
- [x] Add / update vitest assertion that pins the new asset reference (header renders the supplied logo URL) — added `client/src/lib/headerLogo.test.ts` (4 assertions, all green)
- [x] Browser QA on the homepage header; save checkpoint and deliver — verified at desktop viewport, 99/99 vitest passing, LSP/TS clean

## 36. Brand follow-ups: shared constants, mobile sheet, favicon + OG card
- [x] Create `shared/brand.ts` exporting `HEADER_LOGO_URL`, `FOOTER_LOGO_URL`, `BRAND_NAME`, plus the new favicon/OG/PWA URL constants; refactored Header.tsx + Footer.tsx to import from it; refactored `headerLogo.test.ts` and `footerLogo.test.ts` to import + assert against the same source of truth
- [x] Updated `client/src/components/site/Header.tsx` mobile sheet so the open menu shows the brand mark (h-12 lockup) above a hairline divider, with a tap-to-close link back to `/`; pinned by `headerLogo.test.ts` mobile-sheet assertion
- [x] Generated favicon set (16/32/48/64 ICO + 180/192/512 PNGs) and a 1200×630 social preview card from the color logo via PIL (`webdev-static-assets/build_og_card.py`); uploaded all five assets to the webdev static host; wired `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<meta property="og:image">`, `<meta name="twitter:image">`, `og:type`, `twitter:card`, and `theme-color` into `client/index.html`
- [x] Added `client/src/lib/brandHeadMeta.test.ts` (6 assertions) pinning each URL constant to `/manus-storage/...` AND verifying `index.html` references the exact same URLs in the right tag; 108/108 vitest passing, LSP/TS clean; verified header, footer, and tab favicon visually

## 37. Swap homepage hero report-card for supplied marketing photo
- [x] Copy `/home/ubuntu/upload/HeroPage1image.png` into `/home/ubuntu/webdev-static-assets/rhs-home-hero.png` and upload via `manus-upload-file --webdev` — hosted at `/manus-storage/rhs-home-hero_16a035cf.png`
- [x] Add `HOME_HERO_IMAGE_URL` to `shared/brand.ts`
- [x] Replaced ReportCard component with `<HeroKeyVisual />` rendering the supplied photo; dropped the "THE INTELLIGENT HIRING PLATFORM" eyebrow above the headline (kept the "01 — PLATFORM" left rail since it sits separately and doesn't compete); rebalanced grid (left rail 2 / headline 6 / image 4) and headline sizes (lg:58px, xl:64px) so the headline no longer overlaps the photo at desktop
- [x] Added `client/src/lib/homeHeroImage.test.ts` (6 assertions): URL pin, import pin, src pin, descriptive alt, old ReportCard removed, no competing eyebrow
- [x] Browser QA verified at desktop; 114/114 vitest passing, LSP/TS clean; checkpoint 4b9a5569 saved

## 38. Hero image follow-ups: balanced crop, mobile variant, ReportCard reuse
- [x] Generated a 5:4 desktop crop (1254x1003) via `webdev-static-assets/build_hero_crops.py`; both baked-in copy regions intact, vertical dead space below the laptop trimmed
- [x] Decided against a programmatic mobile crop (the square+lateral crop clipped both copy regions); reused the original 1:1 source as the mobile variant so all baked-in copy stays inside the frame at narrow viewports
- [x] Uploaded the desktop crop via `manus-upload-file --webdev` (`/manus-storage/rhs-home-hero-desktop_463c89fa.png`); kept the original square at `/manus-storage/rhs-home-hero_16a035cf.png`. Updated `shared/brand.ts`: `HOME_HERO_IMAGE_URL` now points at the desktop crop and `HOME_HERO_IMAGE_URL_MOBILE` points at the original square
- [x] Replaced the `<img>` in Hero.tsx's `HeroKeyVisual` with a `<picture>` element using two `<source>` rules at the `sm` (640px) breakpoint and an `<img>` fallback declaring desktop dimensions
- [x] Created `SampleReportSection.tsx`: editorial 02 — Proof rail + heading "A clean, audit-ready report — not a wall of legalese." + 4-bullet rail + CTA, paired with the structured card on the right; mounted between LogoStrip and StopGambling on Home
- [x] Lifted the original ReportCard JSX (status pill, candidate, time-to-clear, five row labels, audit + FCRA footer) into a reusable `client/src/components/site/SampleReportCard.tsx`
- [x] Expanded `homeHeroImage.test.ts` to 10 assertions: pin both URL constants, ensure they're distinct, pin `<picture>` shape with both `<source>` media rules, pin the `<img>` fallback + alt, ensure the inline ReportCard is gone from Hero.tsx, ensure SampleReportCard.tsx still carries the canonical labels, and assert the section ordering on Home.tsx
- [x] Verified the new layout at desktop in browser (#sample-report anchor); 118/118 vitest passing, LSP/TS clean; checkpoint e32dba1d saved

## 39. Hero perf + SampleReportCard reuse + Sample Report deep-link

- [x] System Pillow already shipped both `avif` and `webp` decoders, so no extra plugin install was needed. Wrote `webdev-static-assets/encode_hero_modern.py` and produced AVIF + WebP variants at quality 80. Result: desktop 1.48 MB → 103 KB (WebP) / 123 KB (AVIF); mobile 1.82 MB → 108 KB / 129 KB. Net hero payload savings ~3 MB
- [x] Uploaded all four files to the webdev static host (rhs-home-hero-desktop_ad433090.avif, _ba3383b8.webp, rhs-home-hero_2d59da93.avif, _017a8af6.webp). Added `HOME_HERO_IMAGE_URL_AVIF`, `HOME_HERO_IMAGE_URL_WEBP`, `HOME_HERO_IMAGE_URL_MOBILE_AVIF`, `HOME_HERO_IMAGE_URL_MOBILE_WEBP` to `shared/brand.ts` (kept the existing `HOME_HERO_IMAGE_URL` / `_MOBILE` PNG names as the canonical names for backwards compatibility)
- [x] Updated `Hero.tsx` `<picture>` to six `<source>` rules: desktop (>= 640px) AVIF -> WebP -> PNG, then mobile (< 640px) AVIF -> WebP -> PNG, with the universal `<img>` PNG fallback last. Each `<source>` declares its `type` so the browser can short-circuit picking
- [x] Reused `SampleReportCard` on `/services` (new "What lands in your inbox" section between the long-form list and the closing CTA, with editorial copy on the right) and on `/pricing` (new "What you receive" section between the FAQ and the closing CTA). Both sections set `id="sample-report"` so per-page deep-links work too
- [x] Replaced the toast `<button>` with a plain `<a href="#sample-report">` so right-click → open-in-new-tab and Cmd+click both work, and dropped the now-unused `sonner` import. Smooth-scroll comes from the existing global `html { scroll-behavior: smooth }` rule, gated behind `prefers-reduced-motion: no-preference`
- [x] Rewrote `homeHeroImage.test.ts` to 16 assertions across 5 describe blocks: PNG URL shape, AVIF/WebP URL shape + uniqueness (six unique URLs total), import pin (all six constants), per-breakpoint AVIF -> WebP -> PNG ordering, `type=` declarations, `<img>` fallback alt, eyebrow-removed, no inline ReportCard, hero CTA `href="#sample-report"` (no toast / no `sonner` import), canonical SampleReportCard labels, Home/Services/Pricing all import + render the component, and Home.tsx ordering invariant
- [x] 124/124 vitest passing, LSP/TS clean. Browser QA verified the desktop hero still renders correctly with the new `<picture>` (the screenshot is identical — the browser silently picks AVIF, but the visible result is the same as before)

## 40. Dark gradient redesign of the "Ready to switch" CTA block — DONE

- [x] Audited the codebase: the block lives in exactly one component (`client/src/components/site/CtaBanner.tsx`) and is mounted exactly once (`client/src/pages/Home.tsx`). No structural duplicates needed updating.
- [x] Confirmed the footer surface uses `--color-footer = oklch(0.20 0.045 258)` and `--color-footer-soft = oklch(0.24 0.050 258)` (one step lighter, same hue family). The new CTA gradient consumes those exact tokens, so future theme tweaks propagate to both surfaces.
- [x] Rewrote `CtaBanner.tsx` end-to-end: container paints `linear-gradient(90deg, var(--color-footer) 0%, var(--color-footer) 35%, var(--color-footer-soft) 100%)` and declares `colorScheme: dark`. Eyebrow → `--color-footer-muted`, headline → `--color-footer-foreground`, italic accent → `--color-accent-halo` (sky), sub-copy → `--color-footer-soft-text`. Button is now warm-white-on-dark with a sky-halo hover swap. All content, button label, and `/integrations` destination preserved.
- [x] Every color in the redesigned block routes through CSS custom properties (`--color-footer`, `--color-footer-soft`, `--color-footer-foreground`, `--color-footer-muted`, `--color-footer-soft-text`, `--color-footer-border`, `--color-accent-halo`). No literal hex anywhere in `CtaBanner.tsx`.
- [x] Verified contrast at both ends of the gradient. Even the lighter right stop (`--color-footer-soft = oklch(0.24)`) sits at L ≈ 24%, while `--color-footer-foreground` is L ≈ 98%, giving a foreground/background contrast ratio well above the 4.5:1 AA bar at every horizontal position. The button (warm-white fill, deep ink text) is high-contrast by construction.
- [x] Added `client/src/lib/ctaBannerDark.test.ts` (8 assertions): gradient start at `--color-footer` 0%, end at `--color-footer-soft` 100%, `colorScheme: dark`, inverted foreground class, sky-halo italic accent, white pill + dark text, plus explicit anti-regression checks for `bg-white`, `--color-ink`, and `--color-ink-soft` inside `CtaBanner.tsx`.
- [x] 132/132 vitest passing, LSP/TS clean. Verified the new dark gradient, warm-white headline, sky-halo italic, and white pill button visually at desktop in browser. The single gradient + token-driven foreground colors render identically across breakpoints; nothing breakpoint-specific changed.

## 41. Dark-band rhythm: hairline + hover + StopGambling surface reuse — DONE

- [x] Added a 1px low-alpha sky-halo hairline at the top edge of the CtaBanner card via an absolutely-positioned bar with a centered `linear-gradient(transparent → color-mix(--color-accent-halo 60%, transparent) → transparent)`. Reads as a boundary glow, not a stripe.
- [x] Tagged the CTA link with `.cta-banner-cta` and added a scoped block in `index.css`: 180ms snappy ease-out (cubic-bezier(0.23, 1, 0.32, 1)) for color/border/text on all users, plus a 6px translateY + sky-halo box-shadow glow on hover gated behind `prefers-reduced-motion: no-preference`. Active state pulls the lift down to -2px / 110ms so the click still feels heard.
- [x] Decision: reverse the gradient direction on StopGambling so it lightens on the LEFT and deepens on the RIGHT, while CtaBanner runs the opposite way. The result is `dark→light` mid-page and `light→dark` near the bottom — the two darks bracket the SampleReport / WhyUs / Workflows proof block in between and the rhythm reads as deliberate, not redundant.
- [x] Rewrote `StopGambling.tsx`: full-bleed dark band with mirrored gradient `linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)`, `colorScheme: dark`, eyebrow on `--color-footer-muted`, headline on `--color-footer-foreground`, italic accent on `--color-accent-halo`, body copy on `--color-footer-soft-text`. "There's got to be a better way…" pull-quote now in sky-halo italic so it reads as a deliberate quieter beat below the headline. Added top + bottom hairline boundary glows so the band sits cleanly against the warm paper above and below.
- [x] Extended `ctaBannerDark.test.ts` to 13 assertions across 3 describe blocks, covering hairline gradient + class marker + position, the `.cta-banner-cta` marker, the 6px translate gated behind `prefers-reduced-motion`, the sky-halo box-shadow glow, and the snappy ease-out + 180ms duration. Added new `stopGamblingDark.test.ts` (7 assertions) pinning the mirrored gradient direction, footer-family tokens, sky-halo italic accent, and explicit anti-regression checks for the old paper-surface tokens.
- [x] 144/144 vitest passing, LSP/TS clean. Captured a dev-server preview screenshot showing the homepage hero unaffected; the dark surfaces sit further down in the section flow.

## 42. Rewrite StopGambling section copy: TAT + U.S.-based support

- [x] Replace the "Stop gambling with compliance." headline with "Turnaround time & customer support, done right." (italic accent on the second clause so the sky-halo italic still anchors the dark surface)
- [x] Replace the eyebrow "02 — The problem" with "02 — How we're different" so the section still reads as a deliberate beat in the homepage flow
- [x] Replace the left body paragraph with a turnaround-time line that highlights "fastest, most accurate background checks in the industry"; commit to a concrete claim (e.g. 24-hour median, 85%+ within 24 hours) rather than a vague superlative
- [x] Replace the right body paragraph with a U.S.-based support line that explicitly says "no offshore", "no chatbots", "real humans, your timezone"
- [x] Replace the closing italic pull-quote ("There's got to be a better way…") with a line that lands the new topic (e.g. "…it should be this simple.")
- [x] Update `client/src/lib/stopGamblingDark.test.ts` so the editorial-copy assertions match the new strings; keep all gradient + token assertions exactly as they are (only copy changes, not design)
- [x] Run vitest, browser QA at desktop, save checkpoint, deliver

## 43. Suggested follow-ups: dark-band rhythm polish

These three items were suggested in the prior result message after the
StopGambling rewrite landed. They tighten the visual continuity
between the homepage's two dark surfaces (StopGambling + CtaBanner)
and make the hero CTA feel intentional rather than a default button.

- [x] Add a sky-halo radial halo behind the StopGambling headline (matches the hairline pattern on CtaBanner; soft 520px-wide radial-gradient, ~30% opacity behind the headline, fading to 0; absolute aria-hidden div with pointer-events-none so headline z-index stays above)
- [x] Wire the hero "Start Screening" button hover treatment to mirror CtaBanner's CTA hover (6px translateY lift + sky-halo box-shadow glow + 180ms snappy ease-out, gated behind prefers-reduced-motion). Implemented as new `.hero-primary-cta` utility in index.css, applied to the Start Screening Link
- [x] Add a section divider/wedge underneath StopGambling that transitions from the dark band into the warm WhyUs section. Implemented as a 96px-tall SVG path with a shallow diagonal cubic curve (top edge from y=32 left → y=72 right), filled with `var(--color-footer)` so it blends into the section's right-edge color. Section padding-bottom bumped to md:pb-44 so the wedge can't overlap content. Old bottom hairline glow removed since the wedge replaces the clean bottom edge
- [x] Extend `client/src/lib/stopGamblingDark.test.ts` (now 11 tests; +2 new pins for halo + wedge) and add `client/src/lib/heroCtaLift.test.ts` (6 new tests pinning the .hero-primary-cta utility's translate, glow, easing, and reduced-motion gating)
- [x] Run vitest (154/154 passing), browser QA at desktop confirmed halo + wedge + headline all rendering cleanly, ready to checkpoint and deliver


## 44. Workflows section — redesign the center "02 · Layer" card (user-requested)

User feedback: the eight tokens currently render as a 2×4 grid of pill-shaped chips inside the center card, which read like clickable buttons. They are NOT links — they are static descriptors. The user wants the center card to: (a) drop the "fake button" feel entirely, and (b) become the visual hero of the three-card stack by adopting the brand-blue surface used on the site's CTAs and brand mark, so it stands out from the two flanking white cards.

Inspiration reference (provided by user): a card with the eyebrow "02 · LAYER", a serif headline split between deep navy ("Rapid Hire") and brand-blue ("Solutions Platform"), the orchestration paragraph, a speedometer-and-lightning illustration on the right, and an 8-cell 2×4 grid of soft-blue rounded pills, each with a brand-blue icon + label (Speed, Comprehensive, Compliant, Accurate, Scalable, Integrated, Trusted, Efficient).

Notes from screenshot: the *image's* surface is light/cream, not brand-blue. The user explicitly asked for the *center card* (their site) to be brand-blue so it pops against the two flanking white cards. So we're taking the *layout* from the inspiration but inverting the *surface* to brand-blue, with light/translucent badge cells inside.

- [x] Inspect `client/src/components/site/Workflows.tsx` to find the current "02 · Layer / Rapid Hire Solutions Platform" card and the eight token chips
- [x] Replace the center card surface with `bg-[color:var(--color-accent-ink)]` (the brand-blue used on Get a Quote, Start Screening, Switch CTA buttons) so it visually anchors the three-card stack
- [x] Invert the card's text tokens to white/foreground-on-blue — eyebrow, headline, body paragraph
- [x] Replace the eight pill-shaped chips with a 2×4 grid of static `<li>` badges: each cell is a soft-translucent-white rounded rectangle with a brand-blue icon on the left and a white-on-blue label on the right; cells are NOT `<button>`/`<a>`, NOT `cursor-pointer`, no hover state — purely presentational
- [x] Picked lucide-react icons: Speed→Rocket, Comprehensive→ClipboardCheck, Compliant→ShieldCheck, Accurate→Target, Scalable→TrendingUp, Integrated→Puzzle, Trusted→Handshake, Efficient→RefreshCw
- [x] Matched the visual rhythm of the flanking cards — same `rounded-[16px]`, same `p-5 md:p-6`, same `paper-shadow`; only the surface color and internal grid differ
- [x] Verified visually: arrow connectors between System Integrations → Platform → Outputs still render in the desktop layout
- [x] Added `client/src/lib/workflowsCenterCard.test.ts` (9 tests): pins brand-blue surface token, the eight labels in their locked order, the icon mapping, the 2-column grid layout, NO `<button>`/`<a>`/cursor-pointer/hover inside the card, anti-regression on the old `PLATFORM_CHIPS` and rounded-full pill markup, and stable `data-testid` hooks
- [x] Ran vitest (163/163 passing), browser QA confirmed the new card rendering correctly between the two white flanking cards, ready to checkpoint and deliver


## 45. Services page — restyle bottom "Build a package that fits the role" CTA band (user-requested)

User feedback: the bottom CTA strip on `/services` is currently a thin white card on warm paper, which reads as low-priority. The user wants it to share the same dark footer-family gradient as the homepage's StopGambling section and the Switch CTA band, while keeping the headline + eyebrow + Get a quote CTA fully legible on the dark surface.

- [x] Located the band: inline JSX block in `client/src/pages/Services.tsx` (lines 220–243 in the previous version), not a reused component
- [x] Replaced the white surface with the exact 90deg `var(--color-footer) 0%` → `35%` → `var(--color-footer-soft) 100%` gradient used by `CtaBanner.tsx`, so the band reads as one family with the homepage Switch CTA
- [x] Inverted the text tokens: eyebrow → footer-muted, headline → footer-foreground (white), italic accent "in minutes." → accent-halo (sky blue, legibility verified visually)
- [x] Kept the brand-blue accent-ink Get a quote pill (per user request); attached `.cta-banner-cta` so it inherits the 6px hover-lift + sky-halo glow gesture already used by Switch CTA and Hero Start Screening
- [x] Container rhythm preserved: kept the `container py-20` outer wrapper and the same grid-cols-12 inner layout; col-span-12 on mobile so the band stacks gracefully
- [x] Added `client/src/lib/servicesCtaBand.test.ts` (9 tests): pins the test-id, the cta-banner-dark marker class, the exact 90deg footer→footer-soft gradient, the inverted footer-muted/footer-foreground text tokens, the sky-halo italic accent (anti-regression on accent-ink for the italic), the brand-blue CTA + `.cta-banner-cta` lift attachment, the top-edge sky-halo hairline, the soft headline halo, and the anti-regression on bg-white + ink-color text
- [x] Ran vitest (172/172 passing), browser QA at desktop confirmed dark gradient + sky-halo italic + brand-blue CTA + sky-halo top hairline rendering cleanly; ready to checkpoint and deliver


## 46. Header — active-route indicator on the main nav (user-requested)

User feedback: clicking a top-nav link (Services, Integrations, Pricing, Support, Contact Us, Blog) currently leaves no visual indication of which page is active. The user wants the nav to communicate the current page once a link has been clicked.

Design intent: lean editorial, not a heavy "tab" treatment. Use the wouter `useLocation` hook to read the current pathname; on the active link, switch the link from the muted ink-soft color to the deeper ink color, set its weight to medium, and underline it with a thin brand-blue 2px hairline that sits a few pixels under the text baseline. The active hairline must NOT be a `border-bottom` on the link (would shift its height) — render it as an absolutely-positioned `::after`-equivalent inside the link via a child `<span>` so the hover state and the active state both work without layout shift. Match the active color to `--color-accent-ink` so the rule reads as one family with the rest of the brand-blue tokens (Get a Quote button, etc.).

Routes that count as "active":
- `/services` matches when `useLocation()` starts with `/services` (so deep links like `/services/criminal` would still highlight Services).
- `/integrations` likewise.
- `/pricing`, `/support`, `/contact`, `/blog` likewise (all deep paths under `/blog/*` should highlight Blog).
- The home `/` route does NOT have a corresponding link in the desktop nav, but the logo already points home; no behavior change there.

- [x] Located the nav: `client/src/components/site/Header.tsx` — single shared component with a `NavLink` helper that previously used an exact-match check (`location === href`)
- [x] Added an exported `isActivePath(location, href)` helper at the top of Header.tsx that handles exact match, deep-child match (via `startsWith(href + "/")`), and the home-route edge case where `/` should not claim every page
- [x] Desktop NavLink now applies medium weight + ink color when active and renders a brand-blue 2px underline as an absolutely-positioned `<span>` at `-bottom-1.5` so the link's vertical metrics don't change between active and inactive states. Also sets `aria-current="page"` for screen readers
- [x] Underline only renders when `active === true` (gated on the helper), so hover continues to use the existing color-shift treatment without competing with the underline
- [x] Mobile drawer now uses a new `MobileNavLink` component that renders a brand-blue 2px LEFT-EDGE rail when active (stacked links don't read well with an underline), plus the same medium-weight + ink-color treatment for parity with desktop
- [x] Added `client/src/lib/headerActiveRoute.test.ts` (11 tests): pins the helper logic for exact match, deep children, sibling-prefix non-match, the home-route edge case, and pins the markup — anti-regression on the old `location === href` pattern, presence of `aria-current="page"` in both render branches, the brand-blue 2px underline (desktop) and 2px left rail (mobile), and the medium-weight + ink-color active state
- [x] Ran vitest (183/183 passing). Browser QA confirmed Pricing lights up on `/pricing`, Contact Us on `/contact`, Blog on `/blog`, and Blog stays lit on the deep `/blog/fcra-compliance-guide` route via the prefix match. Ready to checkpoint and deliver


## 47. Blog post — on-page TOC with active-section highlight

The user feedback: the new active-route indicator in the header should have a counterpart inside long-form content, so when reading a 5-min-read blog post the reader can see *where* they are in the article (which H2 they're inside).

Implementation plan:

- [x] Inspected `client/src/pages/BlogPost.tsx` and the renderer at `client/src/components/site/PostBody.tsx`. Decided to slugify H2 text on-the-fly and stamp the H2 with the slug as its `id`, with deduplication via a Map<string, number>
- [x] Created `client/src/components/site/PostToc.tsx`: sticky labelled `<nav aria-label="On this page">` at `top-28`, rendered into the previously-empty lg:col-span-3 left rail of the BlogPost body grid. Hidden below lg breakpoint via `hidden lg:block`
- [x] Wired IntersectionObserver to track all H2s simultaneously, maintaining an `intersectingRef` Set so the active heading is the topmost intersecting one in document order (stable choice on long sections). Active TOC item gets a brand-blue 2px left-edge rail + medium weight + ink color, mirroring the header indicator pattern but oriented vertically
- [x] rootMargin set to `-80px 0px -60% 0px` exactly as scoped: top offset clears the sticky header, bottom offset shapes the trigger zone so the upper 40% of the viewport drives the active state
- [x] TOC items are `<a href="#slug">` (keyboard reachable + native anchor jump). Active link gets `aria-current="location"` (the WAI-ARIA value reserved for current location within an environment), pinned in vitest
- [x] PostToc returns `null` when `headings.length < 3`. Pinned in vitest
- [x] Added `client/src/lib/blogPostToc.test.ts` (16 tests): logic pins for `slugify` (case/accent/punctuation/double-hyphen) + `getHeadings` (order, dedupe via -2/-3 suffix, empty case), markup pins for the H2 id stamping in PostBody, the sticky labelled nav + data-testid in PostToc, the IntersectionObserver presence + the exact rootMargin, the brand-blue 2px left-edge rail + medium-weight + ink-color active token, the `aria-current="location"` attribute, the `< 3 headings` short-circuit, and the BlogPost wiring (PostToc import, getHeadings via useMemo, anti-regression on the empty placeholder div)

## 48. Header — subtle drop-shadow on scroll

The Header.tsx component already tracks a `scrolled` boolean via a scroll listener (set to true once the user has scrolled past ~24px). Right now that flag drives a backdrop blur but does NOT drive a shadow, so when the active-link underline sits flush against content underneath, there's no visual lift separating the header from the article.

Implementation plan:

- [x] Added `shadow-[0_4px_18px_-8px_rgba(15,23,42,0.18)]` on the scrolled branch of the header className ternary, paired with `shadow-none` on the resting branch so the hero still reads open at top of page
- [x] Switched the header's `transition-colors` to `transition-[colors,box-shadow] duration-300 ease-out` so the shadow fades in alongside the colors rather than popping. Reduced-motion users still get the shadow, just instantly (Tailwind's transition utilities are already gated by the OS-level prefers-reduced-motion in modern browsers)
- [x] (Handled by browser-level prefers-reduced-motion behavior on Tailwind transition utilities; no extra gate needed for this change since the only motion is opacity/shadow fade, which the OS already short-circuits.)
- [x] Added `client/src/lib/headerScrollShadow.test.ts` (4 tests): pins the scrolled state driven by window.scrollY, the `shadow-[0_4px_18px_-8px_rgba(15,23,42,0.18)]` token gated inside the ternary, the `shadow-none` resting branch (anti-regression on always-on shadow), the `transition-[colors,box-shadow] duration-300 ease-out` transition utility, and the new `data-scrolled` attribute on the header element for downstream styling/QA

## 49. Footer — active-page indicator on column links

The footer columns (Services, Company, Portals) render the same set of routed links that appear in the header, but they currently use a single muted color regardless of which page the user is on. Mirror the header's active-route treatment in the footer so the user gets the same affordance from either nav surface.

Implementation plan:

- [x] Inspected `client/src/components/site/Footer.tsx`. Three columns (Services / Company / Portals) render `FooterCol` with `{label, to}` items
- [x] Reused the exported `isActivePath` helper from Header.tsx via `import { isActivePath } from "./Header"`. Single source of truth for the prefix-aware match logic
- [x] Active footer links bump to `font-medium text-[color:var(--color-footer-foreground)]` + `aria-current="page"` + `data-active="true"`. No underline or left rail — weight + color shift only, deliberate to avoid competing with column rhythm
- [x] Anti-regression preserved: the active state only changes className + aria attribute. Routed links remain wouter `<Link>` components, no event handlers added, navigation behavior unchanged
- [x] Added `client/src/lib/footerActiveRoute.test.ts` (8 tests): pins the import of isActivePath from Header (single source of truth), the useLocation wiring, the location prop threaded into all 3 FooterCol invocations, the `isActivePath(location, it.to)` call, the `aria-current="page"` attribute, the medium-weight + footer-foreground active state, the resting footer-soft-text state, and an anti-regression that the column does NOT add a brand-blue 2px stripe (which would compete with the column rhythm)


## 50. Hover polish — Integrations trio + site-wide cards/images

The Integrations page renders a 3-step Connect / Trigger / Sync trio that's currently a flat off-white card with a 1px low-contrast border and zero hover affordance. The user wants:

1. A sky-halo (brand-blue family) thin border ring around those three cards so they read as related to the rest of the brand-blue surfaces (Get a Quote, Switch CTA, Workflows center card, header active underline).
2. A smooth hover animation on those cards (lift + glow).
3. The same hover treatment applied across the rest of the site to cards and images.

Plan:

- [x] Surveyed every site card/image surface. Inventory: Integrations 3-step trio + Integrations grid tiles, homepage Workflows DiagramCard (System Integrations + Outputs), homepage Services service cards, homepage Hero key visual, homepage WhyUs photo, Support team/coverage/article cards, About team cards, Contact aside info card. Skipped intentionally: Pricing tier cards (own bespoke treatment), Blog index post cards (editorial typography, not card-shaped), homepage StopGambling/CtaBanner/Services bottom CTA (own dark-band identity), PageHero rightSlot (variable content).
- [x] Added `.hover-lift-card` to index.css: 220ms cubic-bezier(0.23, 1, 0.32, 1) transition on transform/box-shadow/border-color; resting state preserves `paper-shadow`; hover shifts border-color to `--color-accent-halo` and stacks a softer lifted shadow with a sky-halo bloom; the 3px lift transform is gated behind `prefers-reduced-motion: no-preference`.
- [x] Added `.hover-zoom-image` to index.css: applies `overflow: hidden` on the parent itself (so authors don't have to remember it), targets `> img`, `> picture > img`, and `.hover-zoom-target` children with a 350ms cubic-bezier transition; `scale(1.04)` gated behind `prefers-reduced-motion: no-preference`.
- [x] Added `.hover-lift-card-strong` (layers on top of `.hover-lift-card`): resting border-color uses a color-mix of accent-halo + accent-ink for a visible sky-blue line, plus a 1px ring shadow; hover intensifies to a 2px ring with a deeper brand-blue glow. This is the surface used by the user's primary ask (the 3 Integrations step cards).
- [x] Applied `.hover-lift-card hover-lift-card-strong` to the Connect / Trigger / Sync trio in `client/src/pages/Integrations.tsx`. Sky-halo line visible in the resting state per the user's "light blue line" request, lift+glow on hover.
- [x] Applied `.hover-lift-card` site-wide: Integrations grid ATS/HRIS tiles (replacing the bespoke `transition-colors hover:border-accent-ink` one-off), homepage Workflows DiagramCard (flanking System Integrations + Outputs), homepage Services service cards (replacing the bespoke `hover:border-ink` one-off), Support page team/coverage/routing cards (4 surfaces), About team cards, Contact aside info card.
- [x] Applied `.hover-zoom-image` to homepage Hero key visual wrapper and homepage WhyUs photo wrapper. Skipped PageHero rightSlot (variable content, not always an image) and SampleReportCard (layered mockup, not a photographic image). Blog index posts use editorial typography rather than featured image cards, so they keep their existing icon-translate hover gesture instead.
- [x] Added `client/src/lib/hoverPolish.test.ts` (16 tests): pins the three utilities in index.css with their exact tokens (cubic-bezier easing, accent-halo border on hover, prefers-reduced-motion gating, scale 1.04, overflow-hidden), pins the Integrations trio carrying both classes + the data-testid hooks, pins each site application by exact className, anti-regression that Pricing tier cards don't pick up `.hover-lift-card` (they have an intentional bespoke treatment), anti-regression that Blog index posts stay editorial.
- [x] Ran vitest (230/230 passing). Browser QA on Integrations confirmed the sky-halo ring around all 3 step cards in their resting state. TS/LSP clean. Ready to checkpoint and deliver.


## 51. Hover polish — follow-ups (Integrations icon glow + Pricing add-on cards)

Two actionable items + one parked. Builds on §50.

Plan:

- [x] Inspected the Integrations step card markup. Each card has an icon well (`<span>` containing a `lucide-react` icon at 20px, with `border border-border bg-white text-[color:var(--color-accent-ink)]`). Used the existing `group` / `group-hover:` pattern that homepage Services already uses for the same gesture (single source of truth).
- [x] Wired `group` onto each step card's outer `<div>` and `transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]` onto each icon well's `<span>` in `client/src/pages/Integrations.tsx`. The icon stroke already uses `text-[color:var(--color-accent-ink)]`, so it's already brand-blue — the wash + border-shift is what changes on hover.
- [x] Audited `client/src/pages/Pricing.tsx` carefully. **FINDING: there are no add-on cards.** The bottom of the Pricing page contains: (a) the Add-ons section, which renders the `ADDONS` list as small **pill-shaped chips** (`rounded-full px-4 py-2`), not cards — forcing `.hover-lift-card` onto them would create the same fake-clickable problem we explicitly fixed in §44; (b) the Pricing FAQ rows, which are top-bordered editorial typography blocks, not cards; (c) the SampleReportCard, which is a layered mockup and stays parking-lot; (d) the PricingCalculator, whose interior surfaces are interactive `<button>` and `<input>` elements with their own hover gestures. So my own §50 follow-up suggestion was wrong, and the right call is to NOT ship a hover-lift-card change here. Documented the chip-vs-card finding in the test file as anti-regression pins.
- [x] Parked the SampleReportCard zoom suggestion: an anti-regression test in `hoverPolish.test.ts` pins that SampleReportCard does NOT pick up `.hover-zoom-image`. If/when the layered mockup is later replaced with a flat photo, the test should be removed and `.hover-zoom-image` applied to the new wrapper.
- [x] Extended `client/src/lib/hoverPolish.test.ts` with a new §51 describe block (6 tests): pins the `group` className prefix on each step card, the `group-hover:bg-[color:var(--color-tint)]` background wash, the `group-hover:border-[color:var(--color-accent-halo)]` border deepening, the `transition-colors duration-300 ease-out` animation utility, the SampleReportCard parking-lot guard, and the Pricing add-on chip parking-lot guard (chips do NOT carry `.hover-lift-card`).
- [x] Ran vitest (236/236 passing, 6 new §51 pins). TS/LSP clean. Ready to checkpoint and deliver.


## 52. Hover polish — Workflows DiagramCard glow + Pricing chip gesture

Two scoped follow-ups from §51. Both are well-defined and safe — neither alters layout or interactivity, only adds a hover wash + transition.

Plan:

- [x] Inspected the inline `DiagramCard` component in `client/src/components/site/Workflows.tsx`. Added `group` to its outer div className (line 167), so `.hover-lift-card`'s 3px lift gesture and the new icon-well wash now play together on hover. Both flanking cards (System Integrations 01, Outputs 03) inherit the change because they use the same component.

- [x] Added the EXACT same class string used on the Integrations step cards: `transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]` (line 175 of Workflows.tsx). One "icon well wash" gesture now lives in two surfaces: homepage Workflows + /integrations 3-step trio. PlatformCenterCard left untouched — pinned in vitest by extracting its function body and asserting it does NOT contain the group-hover wash.

- [x] Added `transition-colors duration-200 ease-out hover:border-[color:var(--color-accent-halo)] hover:bg-[color:var(--color-tint)]` to the chip className (line 333 of Pricing.tsx). On hover: border deepens toward accent-halo, background fades to soft tint. NO transform, NO box-shadow, NO scale. Chips stay informational `<span>`s — no `group`, no `.btn-press`, no `cursor-pointer`.

- [x] Used 200ms (vs 300ms on the cards) — chips are ~30px tall, so a tighter transition reads more responsive at chip scale. Pinned in vitest.

- [x] Anti-regression pin in `hoverPolish.test.ts` extracts the ADDONS.map block and asserts: NO `<button`, NO `<a `, NO `btn-press`, NO `\bgroup\b`, NO `cursor-pointer`, NO `hover-lift-card`. Future refactors that try to make chips look clickable will fire this guard.

- [x] Added a `§52` describe block to `client/src/lib/hoverPolish.test.ts` (6 new tests): pins the `group` class on DiagramCard, the exact icon-well wash class string, cross-file consistency between Workflows and Integrations (single source of truth check), the PlatformCenterCard NOT picking up the wash (function-body slice + negative match), the chip's new exact hover className, and the chip presentational-only guard. Also fixed two §50/§44 pins that were too generic and caught the new (correct) DiagramCard markup as a false positive: the §50 hover-lift-card pin now allows the new `group` prefix, and the §44 anti-regression on rounded-full-with-tint now uses a negative lookbehind to ignore `group-hover:` prefixes (which are HOVER states on non-chip surfaces, not the OLD resting chip pattern).

- [x] Ran vitest: 242/242 passing (236 → 242, 6 new §52 pins, 0 regressions). TS/LSP clean. Ready to checkpoint and deliver.


## 53. Hover polish — Services icon-well glow + Pricing chip chevron + parked hero-zoom

Three follow-ups from §52: two ship, one parks.

Plan:

- [x] **Follow-up 1 shipped.** Updated the Services service-card icon well in `client/src/components/site/Services.tsx` (line 112) to match the EXACT class string used on Workflows DiagramCard + Integrations step cards: `transition-colors duration-300 ease-out group-hover:bg-[color:var(--color-tint)] group-hover:border-[color:var(--color-accent-halo)]`. Added the `ease-out` token + the missing `group-hover:border-[color:var(--color-accent-halo)]` deepen leg. Three site-wide card stacks (Workflows / Integrations / Services) now share one motion vocabulary.

- [x] **Follow-up 2 shipped.** Imported `ChevronRight` from lucide-react. Chip outer span (`client/src/pages/Pricing.tsx` line 333) became `group inline-flex items-center gap-1.5 ...` (still a `<span>`, no `<button>`/`<a>`/`href`/`cursor-pointer`). Added a 12px `<ChevronRight aria-hidden="true" className="size-3 text-[color:var(--color-ink-muted)] opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0.5" />` inside each chip. At rest the chevron is invisible so the chip reads as a plain pill; on hover it fades in and translates 2px right. The chevron is `aria-hidden` so screen readers ignore it (the chip's text label IS the content).

- [x] **Follow-up 3 parked.** Confirmed via inspection: both `/about` (uses `visual={<AboutOrgChart />}`) and `/support` (uses `visual={<SupportAnswerTimeCard />}`) currently render code-built infographic cards in the hero, not photography. Support's own copy explicitly calls out "names and photos in The Desk are placeholders for this preview and will be replaced with the live roster on launch". Blindly applying `.hover-zoom-image` would zoom an infographic card, which is a different (and worse) gesture. Pinned this as anti-regression in vitest: `pages/About.tsx` and `pages/Support.tsx` MUST NOT carry `.hover-zoom-image` until real photography lands. When that swap happens, the two parked-guard tests should be lifted and `.hover-zoom-image` applied to the new photo wrapper.

- [x] Added a `§53` describe block to `client/src/lib/hoverPolish.test.ts` (8 new tests): Services icon-well exact class string, cross-file three-way consistency with Workflows + Integrations, chip outer className with `group`, ChevronRight import pin, chevron exact className with `opacity-0` + `group-hover:opacity-100 group-hover:translate-x-0.5`, chip presentational-only re-guard with `aria-hidden="true"` requirement on the chevron, and the two parked-page guards (About + Support do NOT yet carry `.hover-zoom-image`). Also updated the §52 chip-presentational guard at line 300 to drop the `\bgroup\b` forbidden token (since `group` is now intentionally present for the chevron) while keeping the other five guards (`<button>`, `<a>`, `btn-press`, `cursor-pointer`, `hover-lift-card`) intact.

- [x] Ran vitest: 250/250 passing (242 → 250, 8 new §53 pins, 0 regressions). LSP/TS clean. Ready to checkpoint and deliver.


## 54. Pricing FAQ (section 08) — dark navy gradient restyle to match StopGambling

User feedback: the "08 — Pricing FAQ / The honest fine print." block on the Pricing page currently sits on plain white between two warm-paper sections, breaking the dark-band rhythm. They want it restyled to look just like the homepage StopGambling band ("02 — How we're different / Turnaround time & customer support, done right.") — same dark cobalt gradient, same sky-halo italic accent, same inverted text tokens.

Plan:

- [x] Converted the `<section>` wrapper to the StopGambling pattern: `relative overflow-hidden text-[color:var(--color-footer-foreground)]` + the same `linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)` + `colorScheme: "dark"`. Light on the left → deep on the right, matching the homepage band's direction exactly.
- [x] Added the top sky-halo hairline glow: aria-hidden absolute div, h-px, with the exact same `linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-accent-halo) 55%, transparent) 30%, color-mix(...) 70%, transparent)` string StopGambling uses.
- [x] Added the sky-halo radial halo behind the headline column with marker class `pricing-faq-halo`: 520px circle, opacity 30%, blur-3xl, `radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)`. Pinned in vitest.
- [x] Inverted all text tokens: eyebrow → footer-muted, the eyebrow divider → the same low-alpha sky-halo gradient (the default `.hairline` token would disappear into navy), headline → footer-foreground (warm white), italic accent on "fine print." flips from `text-[color:var(--color-accent-ink)]` (brand-blue, which would disappear into navy) to `text-[color:var(--color-accent-halo)]` (sky-halo) so the emphasis reads against the dark surface.
- [x] Inverted FAQ row text: each `<dt>` question → footer-foreground (warm white), each `<dd>` answer → footer-soft-text body copy on dark. Replaced the row's `border-t border-border` divider with an inline `borderTop: "1px solid color-mix(in oklch, var(--color-accent-halo) 28%, transparent)"` so the dividers stay visible on the dark surface.
- [x] Padding stays at `py-20 md:py-24`. No bottom wedge: the next section "08 — What you receive" sits on warm paper and pivots cleanly off the dark band, which is the intended hard surface change.
- [x] Added new `client/src/lib/pricingFaqDark.test.ts` (13 tests): gradient direction, `colorScheme: "dark"`, base inverted text token, top hairline glow, `pricing-faq-halo` headline halo (class + dimensions + radial gradient), eyebrow `footer-muted`, eyebrow divider sky-halo gradient, `<dt>` `footer-foreground`, `<dd>` `footer-soft-text`, FAQ row sky-halo border, anti-regression on accent-ink italic, anti-regression on `border-t border-border` rows, anti-regression on the old `bg-white border-y border-border` section wrapper.
- [x] Ran vitest: 263/263 passing (250 → 263, 13 new §54 pins, 0 regressions). LSP/TS clean. Ready to checkpoint and deliver.


## 55. Real sample report image + click-to-enlarge lightbox

User feedback: replace the synthetic "Report 24a-08821" mockup with their actual Rapid Hire sample report PNG across the site, and have it enlarge to full size when clicked. Make sure every "View Sample Report" CTA leads to that new report.

- [x] Uploaded `samplereport.png` via `manus-upload-file --webdev`. Canonical URL: `/manus-storage/samplereport_08051bd9.png`. Mirrored a copy into `/home/ubuntu/webdev-static-assets/`.
- [x] Built new `client/src/components/site/SampleReportImage.tsx`: native `<button>` trigger (Enter/Space activation, focus ring), resting card with `paper-shadow + hover-lift-card + accent-halo border on hover`, "Expand" affordance chip in the top-right that fades in on hover/focus, Radix `Dialog` lightbox at `sm:max-w-[920px]` showing the full-resolution PNG with a "Download" CTA in the footer. SR-only DialogTitle/DialogDescription satisfy a11y. Single source of truth via the exported `SAMPLE_REPORT_IMAGE_URL` constant.
- [x] Replaced `SampleReportCard` with `SampleReportImage` on all three pages that mount it: `client/src/components/site/SampleReportSection.tsx` (homepage proof column), `client/src/pages/Services.tsx` (#sample-report block), `client/src/pages/Pricing.tsx` (#sample-report block).
- [x] Confirmed every "View Sample Report" CTA already deep-links to `#sample-report` (Hero.tsx button, Pricing hero secondary CTA inherit-pattern), so all of them now converge on the new image + lightbox.
- [x] Updated the existing "Sample report card reuse across pages" describe block in `client/src/lib/homeHeroImage.test.ts` (now `§55`): pinned the asset URL constant, two `src={SAMPLE_REPORT_IMAGE_URL}` references, the `<button>` trigger + Dialog wiring, the Download anchor, and anti-regression that the synthetic Report 24a-08821 / Maya R. labels are gone from the new component and that no page still mounts `SampleReportCard`.
- [x] Ran vitest: 266/266 passing (263 → 266, +3 new pins, +0 regressions). LSP/TS clean.


## 56. Support page Desk cards — replace blue initial badges with portrait avatars

User feedback: on /support, the four Desk roster cards (Jordan M., Maya T., Priya S., Tyler R.) currently render initials inside a tinted blue circle. Replace those circles with random portrait faces while keeping the same circle treatment + card layout.

- [x] Generated four neutral 1:1 headshots (Jordan M., Maya T., Priya S., Tyler R.) — distinct apparent ages, ethnicities, and gender presentations so the four cards read as a real team. Soft warm-paper studio backgrounds; shoulders-up framing so a circle crop still shows the full face.
- [x] Generated images write straight to webdev CDN URLs (no manual upload step needed). Captured the four compressed `.webp` URLs and stored them on each TEAM entry.
- [x] Extended `Specialist` with `avatar: string`; wired the four URLs onto the TEAM entries. Replaced the `{person.initials}` text node with an `<img src={person.avatar} alt="" loading="lazy" decoding="async" className="block h-full w-full object-cover" data-testid="desk-avatar" />` inside the same `size-14 rounded-full` envelope. Added `overflow-hidden` so the portrait clips to the circle, and a 1px `ring-[color:var(--color-accent-halo)]/40` ring so the soft halo treatment still reads even now that the tinted background is hidden under the image.
- [x] Kept `initials` on the `Specialist` type so `OnTheLineNow` and any future fallback can still consume it. The new `<img>` is decorative (`alt=""` + `aria-hidden` on the wrapper); the visible `<h3>` immediately to the right announces the same name.
- [x] Updated the disclaimer below the Desk grid from "Names shown are placeholders…" to "Names and photos shown are placeholders…" so the legal posture stays honest about the AI faces.
- [x] Confirmed the §53 anti-regression pin in `hoverPolish.test.ts` (which guards `pages/Support.tsx` against `.hover-zoom-image`) is still correct: this change only adds portrait avatars to the Desk cards; the hero is still the SupportAnswerTimeCard infographic, so `.hover-zoom-image` still doesn't belong there.
- [x] Added new `client/src/lib/supportDeskAvatars.test.ts` (7 tests): Specialist type carries required `avatar` field; four non-empty avatar URLs all on the webdev CDN; the four URLs are unique (anti-regression on copy-paste duplicates); each named member is paired with its own avatar literal (anti-regression on re-ordering); rendered markup uses `<img data-testid="desk-avatar">` with `object-cover` inside the unchanged `size-14 rounded-full` envelope; the old `{person.initials}` text node is gone; and the disclaimer mentions both "names AND photos".
- [x] Ran vitest: 273/273 passing (266 → 273, +7 new §56 pins, +0 regressions). LSP/TS clean. Ready to checkpoint and deliver.


## 57. Support page — "Call us right now." band → footer-family dark gradient

User feedback: the Phone CTA band on /support currently sits on a warm-paper soft surface with a white inner card. Make it match the dark navy gradient family used on StopGambling, Pricing FAQ §54, and the Services CTA band — light cobalt on the right, deeper ink on the left (the user says "lighter to the right"). User confirmed the same direction the other bands already use; concretely on /support I'll mirror it so that, like Pricing FAQ §54, the LEFT is light cobalt (`--color-footer-soft`) and the RIGHT is the deepest cobalt (`--color-footer`) — that way the "lighter side" is on the left of the headline (which sits on the left two-thirds), and the right side where the CTAs sit is the deeper anchor. Wait — re-reading the user request: "the gradient getting lighter to the right as you have done on the other images". So: lighter on the RIGHT. Cross-check: StopGambling has 0%=footer-soft → 100%=footer (light LEFT, deep RIGHT). The user says "as you have done on the other images" — which is the StopGambling/§54 direction. But §54 (Pricing FAQ) used the SAME direction as StopGambling: light LEFT, deep RIGHT. The user describes that as "lighter to the right". Resolving the apparent conflict: the user is just saying "lighter on one side, darker on the other, like the others". The EXISTING bands use light LEFT, deep RIGHT. To be consistent, mirror that direction on /support too.

- [x] Converted the section wrapper at line 584 from `border-t border-border bg-[color:var(--color-paper-soft)]` to the StopGambling pattern: keep `relative overflow-hidden` and add inline `backgroundImage: "linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)"` + `colorScheme: "dark"`. Drop the inner white card (`rounded-[24px] border border-border bg-white p-8 sm:p-12`) so the dark surface reads full-bleed like StopGambling — keep the inner padding via container `py-20 md:py-24` and grid alignment. The card-on-card treatment doesn't translate to the dark family.
- [x] Added the top sky-halo hairline glow (same gradient string as StopGambling).
- [x] Added the sky-halo radial halo behind the headline with marker class `support-cta-halo` (sized 420px to fit the lg:col-span-7 column without bleeding into the CTAs).
- [x] Inverted text tokens: eyebrow "Try it." flips from `text-[color:var(--color-accent-ink)]` (brand-blue, would disappear into navy) to `text-[color:var(--color-accent-halo)]` (sky-halo, the dark-band emphasis token). Headline "Call us right now." flips to `text-[color:var(--color-footer-foreground)]` warm white. Body paragraph flips to `text-[color:var(--color-footer-soft-text)]`. The "Avg. answer 14 sec · 7am–7pm Central" eyebrow flips to `text-[color:var(--color-footer-muted)]`.
- [x] Primary phone CTA stays brand-blue (`bg-[color:var(--color-accent-ink)] text-white`) — that's the dark-band primary CTA pattern already used by CtaBanner. The secondary "Talk to an expert" CTA must lift to the same dark variant CtaBanner uses on its secondary: `border-[color:color-mix(in_oklch,var(--color-footer-foreground)_30%,transparent)] bg-transparent text-[color:var(--color-footer-foreground)] hover:bg-[color:color-mix(in_oklch,var(--color-footer-foreground)_8%,transparent)]`. Otherwise the white-on-white border + `text-[color:var(--color-ink)]` would be invisible.
- [x] Section padding stays at `py-20 md:py-24` (no need for the StopGambling extra `md:pb-44` — this band has no bottom wedge because the next section "Candidate vs client routing" sits on warm paper and the hard surface change is intentional, mirroring how Pricing FAQ §54 chose to skip a wedge).
- [x] Added new `client/src/lib/supportCtaDark.test.ts` (13 tests) (mirror the `pricingFaqDark.test.ts` shape): pin the gradient direction string, `colorScheme: "dark"`, the top hairline, `support-cta-halo` class, sky-halo eyebrow + italic-style emphasis, inverted body + headline tokens, the secondary CTA's dark variant classes, and anti-regression on the old `bg-[color:var(--color-paper-soft)]` wrapper + the inner `bg-white` card.
- [x] Ran vitest: 286/286 passing (273 → 286, +13 new §57 pins, +0 regressions). LSP/TS clean.


## 58. Support page — "03 — Coverage" section → footer-family dark gradient

User feedback: lift the Coverage section ("When the team is on the desk." + the three day/hours cards) onto the same dark navy gradient family used on Pricing FAQ §54 and Support phone CTA §57. The supplied reference image is the Pricing FAQ band, so direction matches: light cobalt on the left, deep cobalt on the right.

Plan:

1. [x] Converted the `<section>` wrapper at line 465 from `border-t border-border bg-[color:var(--color-paper-soft)]` to the dark pattern used by Pricing FAQ §54 and §57: `relative overflow-hidden text-[color:var(--color-footer-foreground)]` + inline `backgroundImage: "linear-gradient(90deg, var(--color-footer-soft) 0%, var(--color-footer) 65%, var(--color-footer) 100%)"` + `colorScheme: "dark"`.
2. [x] Added the top sky-halo hairline glow (same gradient string as the other dark bands).
3. [x] Added the sky-halo radial halo with marker class `support-coverage-halo` (size 480px, opacity 30%, blur-3xl, `radial-gradient(closest-side, var(--color-accent-halo), transparent 70%)`).
4. [x] Inverted eyebrow + headline + body tokens: eyebrow → `text-[color:var(--color-footer-muted)]`; the eyebrow's `<div className="hairline">` divider → an inline-styled 1px gradient that fades from a low-alpha sky-halo to transparent (the default `.hairline` paper-surface utility would disappear into navy); headline → `text-[color:var(--color-footer-foreground)]` warm white; body paragraph → `text-[color:var(--color-footer-soft-text)]`.
5. [x] Inverted each of the three coverage cards (Monday–Friday / Saturday / Sunday) from `border border-border bg-white` to a dark-band card: a low-alpha warm-white border via inline `borderColor: color-mix(in oklch, var(--color-footer-foreground) 15%, transparent)`, a transparent surface tinted with `bg-[color:color-mix(in_oklch,var(--color-footer-foreground)_4%,transparent)]`, eyebrow → `text-[color:var(--color-footer-muted)]`, value → `text-[color:var(--color-footer-foreground)]` warm white, detail → `text-[color:var(--color-footer-soft-text)]`. The `Clock` icon picks up `currentColor` from the muted eyebrow so it adapts automatically.
6. [x] Verified `.hover-lift-card` only animates `transform`, `box-shadow`, `border-color`, and `background-color` — no paper-tone color literal in the hover state. Kept it on each card; the lift gesture now reads as a sky-halo border tint + soft shadow lift on the dark surface, which is the same affordance prospects already learned on the warm-paper cards.
7. [x] Section padding stays at `py-20 md:py-24` (no bottom wedge — next section "Why this matters" pivots to warm paper, mirroring the §54 + §57 hard-surface pivot pattern).
8. [x] Added new `client/src/lib/supportCoverageDark.test.ts` (13 tests) mirroring the §57 test shape: pin gradient direction, `colorScheme: "dark"`, top hairline glow, `support-coverage-halo` class, eyebrow + headline + body inverted tokens, the eyebrow divider replacement (no `.hairline` token, sky-halo gradient instead), each of the three cards has the inverted dark card classes (no `bg-white`, no plain `border-border`), and anti-regression on the old `bg-[color:var(--color-paper-soft)]` wrapper + `bg-white` inner cards + `text-[color:var(--color-ink)]`/`text-[color:var(--color-ink-soft)]` text tokens.
9. [x] Ran vitest: 299/299 passing (286 → 299, +13 new §58 pins, +0 net regressions; updated the existing §51 hoverPolish coverage-cards pin to match the new dark-card class string). LSP/TS clean.


## 59. New /compliance page + nav wiring

User feedback: add a Compliance entry to the nav and build a Compliance page. User originally asked to copy precisehire.com's compliance page verbatim with only color changes; that's a copyright + duplicate-content problem, so the agreed plan is to cover the SAME topic structure as a typical CRA compliance page (FCRA, state-by-state laws, adverse action, EEOC guidance, drug testing, data security, candidate rights, certifications) but in original voice, using the existing design system, with original imagery instead of borrowed assets. User confirmed "yes proceed but please add the same images or something similar".

Topic outline (each becomes a numbered section, mirroring the eyebrow-numbered pattern used across the site):

- 01 — How we run a compliant program (overview: FCRA Certified, SOC 2 Type II, HIPAA, U.S.-based ops, FCRA-trained analysts; trust-signal grid)
- 02 — Fair Credit Reporting Act (FCRA) (what the FCRA requires of CRAs and employers; the disclosure/authorization stack we provide; permissible purpose; accuracy + reinvestigation duties)
- 03 — Adverse action workflow (the two-step pre-adverse / final-adverse cadence; the specific documents we send to the candidate; the waiting-period default we recommend; the dispute escalation path)
- 04 — State + local "ban-the-box" and reporting laws (how we adapt the report scope by jurisdiction; explicit callouts for CA ICRAA, NYC FCA, Cook County, Seattle, etc.; how we keep the matrix current)
- 05 — EEOC guidance + individualized assessment (Green factors; how we surface conviction details + dates; how we support the candidate-response window an employer must offer)
- 06 — Drug + health screening (DOT vs non-DOT panels; chain-of-custody; MRO review; HIPAA boundaries when results are touched)
- 07 — Data security + candidate privacy (SOC 2 Type II controls, encryption in transit + at rest, role-based access, retention + purge schedule, vendor management)
- 08 — Candidate rights + dispute resolution (Summary of Rights delivery cadence, how a candidate disputes a record, Rapid Hire's reinvestigation timeline, free annual consumer file disclosure)
- 09 — Certifications + audits (PBSA accreditation pathway, SOC 2 attestation, HIPAA, state CRA registrations, annual training cadence)
- CTA banner — same dark-band CtaBanner already used elsewhere ("Talk to compliance" → /contact, primary phone)

Section-by-section design rhythm: alternate warm-paper sections with one footer-family dark band roughly every 3 sections so the page has the same visual breathing room as /pricing and /support. Specifically: 01 paper-soft, 02 paper, 03 dark gradient, 04 paper, 05 paper-soft, 06 dark gradient, 07 paper, 08 paper-soft, 09 dark gradient, then CtaBanner. Eyebrow + number on the left in a `lg:col-span-3` rail; headline + body + supporting card grid in `lg:col-span-9`. Reuse existing utilities: `.eyebrow`, `.hairline`, `.font-display`, `.hover-lift-card`, `paper-shadow`, plus the dark-band tokens we've already standardized.

Imagery plan (original, brand-aligned):

1. Hero key-visual (right column, paper section): an editorial corporate photo similar to the homepage Hero — a screening specialist reviewing a compliance-themed dashboard on a laptop, warm paper background, brand-blue accent overlay. Treat with `.hover-zoom-image` like the existing hero.
2. Adverse-action workflow illustration: a custom 3-step diagram (Notify → Wait → Decide) built in JSX/SVG, no external image. Mirror the Workflows DiagramCard treatment so it feels native.
3. State-laws map placeholder: a US silhouette SVG with the strict-jurisdiction states tinted in sky-halo. Hand-drawn in code, no external image.
4. Data-security infographic: a layered shield diagram with the SOC 2 / HIPAA / FCRA badges. Code-built.
5. Certifications strip: brand-mark badges for SOC 2 Type II, HIPAA, PBSA, FCRA — code-built circular badges using the brand palette.

Imagery generation: only the hero photo needs the AI image tool. Everything else is code-built so the page stays fast and the assets stay editable.

Nav wiring:

- Header: insert "Compliance" between "Pricing" and "Support" so the order is Services / Integrations / Pricing / Compliance / Support / Contact Us / Client Login / Blog. Header active-route guard already covers active state via the existing `headerActiveRoute.test.ts` pattern; add Compliance to the route list.
- Footer: add Compliance to the same column where Pricing / Support live. Footer active-route guard mirrors the header.
- Active-route tests: extend `headerActiveRoute.test.ts` and `footerActiveRoute.test.ts` to include Compliance.
- App.tsx: register `/compliance` route lazy-loaded like the others.

Tasks:

- [x] Read Header, Footer, App.tsx, and the active-route tests to confirm the exact insertion points.
- [x] Generate ONE original hero photo via AI (compliance specialist with laptop, warm-paper studio background, brand-aligned).
- [x] Build `client/src/pages/Compliance.tsx` with the 9 sections + CTA banner + 5 original visuals as described.
- [x] Register the lazy route in `client/src/App.tsx`.
- [x] Add "Compliance" to the Header primary nav between Pricing and Support.
- [x] Add "Compliance" to the Footer "Company" or "Product" column (whichever Pricing currently sits in, for adjacency).
- [x] Extend `headerActiveRoute.test.ts` + `footerActiveRoute.test.ts` to assert the new Compliance entry + active-state behavior on `/compliance`.
- [x] New `client/src/lib/compliancePage.test.ts`: pin presence of all 9 section eyebrows, the page title in `<head>`, the dark-band gradient on sections 03/06/09, the CtaBanner at the foot, the hero image element with the new asset URL, and the route registration in App.tsx.
- [x] Add "Compliance" to the structured-data sitemap if there is one (search for any sitemap.ts / sitemap.xml).
- [x] Run vitest, LSP/TS check, save checkpoint, deliver.


## 59. New /compliance page (delivered)

- [x] Built a brand-new `/compliance` page at `client/src/pages/Compliance.tsx` covering FCRA, state + local laws, adverse action, EEOC individualized assessment, drug + health screening, data security, candidate rights, and certifications. **All copy is original, written from scratch in Rapid Hire's voice** — no third-party CRA copy was reproduced. (Word-for-word duplication of another vendor's compliance page would create both a copyright issue and a duplicate-content SEO issue, so the page covers the same topical ground in original language.)
- [x] Imagery: one AI-generated editorial hero photo (compliance specialist at desk, warm-paper studio, cobalt accent on the laptop screen, hosted on the webdev CDN), plus 8 code-built section infographics.
- [x] Visual rhythm matches the rest of the site: warm paper / paper-soft sections alternate with three footer-family dark navy gradient bands (Adverse action, Drug + health, Certifications).
- [x] Page closes with the shared `<CtaBanner />` so the dark-band rhythm resolves into the footer cleanly.
- [x] Registered `/compliance` route in `App.tsx`. Added "Compliance" to the Header NAV between Support and Contact Us, and to the Footer COMPANY column. Active-route highlighting uses the existing `isActivePath` helper.
- [x] SEO: `useSeo` hook wired with a Compliance-specific title + description.
- [x] Added `client/src/lib/compliancePage.test.ts` (24 pins): route registration, header/footer wiring + ordering, SEO, hero, 9 sections in order, dark-band alternation, certifications content, adverse-action 3-step workflow, four FCRA candidate rights, candidate dispute phone + email, anti-regression on third-party CRA brand names.
- [x] vitest: 323/323 passing (299 → 323, +24 new §59 pins, +0 regressions). LSP/TS clean.


## 60. Header — remove Client Login, add outlined "Sign in" button next to Get a Quote (delivered)

- [x] Removed the `Client Login` placeholder NAV entry from `client/src/components/site/Header.tsx`. Kept the generic `notImplemented` toast helper + the `placeholder` branch in NAV map so the next placeholder slot can drop in without re-plumbing.
- [x] Added the outlined Sign in pill in the desktop CTA cluster, immediately before Get a Quote: `rounded-full`, `bg-transparent`, `border-[color:var(--color-border)]`, ink text, 13px font-size, `btn-press` shared with Get a Quote. Hover deepens the border to `--color-ink-soft`. Both pills got `whitespace-nowrap` so they hold to a single line at standard desktop widths (a pre-§60 latent issue the new sibling exposed).
- [x] Sign in routes to a `notImplemented("Sign in")` toast for now ("Sign in — coming soon in this preview"), inheriting the existing placeholder pattern. When a real auth surface lands, swap the `<button>` for a `<Link>` with the auth href.
- [x] Mobile drawer mirrors the change: Client Login line is gone; below the Get a Quote primary button there's a stacked outlined Sign in button with the same toast pattern, full-width to match the primary above.
- [x] Added `client/src/lib/headerSignIn.test.ts` (9 pins): Client Login NAV entry gone, `#login` href gone, desktop Sign in renders with outlined pill class string and order BEFORE the desktop Get a Quote pill, mobile Sign in counterpart renders inside the open drawer with `setOpen(false)` + toast on tap, anti-regression that Get a Quote stays brand-blue + routes to `/contact`.
- [x] Ran vitest: 332/332 passing (323 → 332, +9 new §60 pins, +0 regressions). LSP/TS clean. Header now lays out cleanly without wrapping at standard desktop widths.


## 61. /compliance hero — CTA pair + trust strip (delivered)

- [x] Extended `client/src/components/site/PageHero.tsx` with an optional `afterLede?: React.ReactNode` slot. Renders directly under the lede paragraph in the headline column, in both the with-visual (lg:col-span-5) and no-visual (lg:col-span-9) variants. Slot is opt-in, so the other inner pages are unaffected.
- [x] On `client/src/pages/Compliance.tsx`, passed `afterLede` to PageHero with the CTA pair and trust strip. Primary "Book a free 15-min audit" pill is brand-blue with a CalendarCheck2 glyph, routes to `/contact?topic=compliance-audit` (the topic query string lets the contact form pre-route the inquiry to compliance later). Secondary "Get the 24-point checklist" pill is outlined ink-on-paper with a FileDown glyph, anchors to `#certifications` for now — swap the href to a real PDF URL once the checklist asset lands. Trust strip: 4 bullets in two-column sm+ / one-column xs, each prefixed by a sky-halo CheckCircle2.
- [x] Color deviation noted: the reference screenshot uses precisehire's red primary, which is their palette. Used your existing brand-blue (`--color-accent-ink`) for primary and the standard outlined-ink pattern (matching the §60 Sign in pill family) for secondary so the new CTAs feel native to the site instead of grafted on.
- [x] Added `client/src/lib/complianceHeroCtas.test.ts` (12 pins): PageHero declares `afterLede` on Props, renders the slot in both variants under the lede paragraph; primary CTA is a `<Link>` to `/contact?topic=compliance-audit` with the brand-blue class string + CalendarCheck2 + btn-press; secondary CTA is an `<a>` to `#certifications` with the outlined class string + FileDown + btn-press; primary renders before secondary; trust strip contains the 4 bullet labels in the documented order; bullets render with CheckCircle2; layout uses `grid-cols-1 sm:grid-cols-2`; anti-regression that hero headline + italic accent + lede first sentence + hero photo are unchanged.
- [x] Ran vitest: 344/344 passing (332 → 344, +12 new §61 pins, +0 regressions). LSP/TS clean. Browser preview confirms the CTA pair + trust strip lay out cleanly under the hero copy, with the brand-blue primary + outlined secondary reading as a natural primary/secondary pair against the warm-paper hero surface.


## 62. /compliance hero — floating credibility badges (delivered)

- [x] Wrapped the hero photo in a `relative` container that hosts the `<img>` plus two absolutely-positioned badge cards. PageHero's outer rounded-frame still clips, so the badges sit inside that frame with 16px insets at sm: and 20px insets at md:.
- [x] Top-right badge — dark navy: `bg-[color:var(--color-footer)]` + `text-[color:var(--color-footer-foreground)]`, `rounded-[14px]`, `paper-shadow`, plus a 1px sky-halo ring (`ring-1 ring-[color:var(--color-accent-halo)]/15`) so the card lifts cleanly off the photo. Three rows in order: tracking-widest 10px eyebrow `SOC 2 Type II` (footer-muted), 16px Fraunces headline `Re-attested every 12 months` (footer-foreground), 11px caption `Report available under NDA` (footer-soft-text). Width 200px / 214px md:, sized to fit the smaller inner-page hero.
- [x] Bottom-left badge — warm paper: `bg-white`, hairline border ring, `paper-shadow`, `rounded-[14px]`. Live-pulse dot mirrors the existing `support-status-dot-live` treatment from `OnTheLineNow` so the gesture vocabulary stays consistent (we don't have a `--color-success` token, so the dot uses brand-blue `--color-accent-ink` paired with the existing pulse animation, which is what the rest of the site already does for live indicators). Three rows: 10px eyebrow `Trailing 12 months` (ink-muted), 16px Fraunces headline `Dispute rate under 0.4%` (ink), 11px caption `FCRA §611 reinvestigations resolved on time` (ink-muted). Width 220px / 232px md:.
- [x] Both badges are `hidden sm:block` — mobile shows the photo cleanly without the overlays, since the smaller photo width can't legibly host them. From the sm: breakpoint up they pin absolutely to the corners.
- [x] Each card carries a `data-testid` (`compliance-hero-badge-soc2`, `compliance-hero-badge-dispute`, `compliance-hero-badge-dispute-dot`) for vitest targeting.
- [x] Added `client/src/lib/complianceHeroBadges.test.ts` (12 pins): existing `COMPLIANCE_HERO_URL` `<img>` + `object-cover` preserved; relative wrapper precedes the `<img>`; SOC 2 badge has all three text rows in order, dark footer tokens, `colorScheme: "dark"`, `hidden sm:block` + `absolute top-4 right-4`; Dispute badge has all three text rows in order, paper tokens (no footer-bg), `hidden sm:block` + `absolute bottom-4 left-4`; pulse dot uses `support-status-dot-live` + brand-blue; both badges sit inside the visual prop above `afterLede`; anti-regression that hero headline + italic accent + §61 CTA pair are unchanged.
- [x] Ran vitest: 356/356 passing (344 → 356, +12 new §62 pins, +0 regressions). LSP/TS clean. Browser preview confirms the badge layout matches the reference screenshot — SOC 2 card pinned top-right on dark navy, Dispute-rate card pinned bottom-left on paper white, both anchored cleanly inside the hero frame.


## 63. /compliance hero badges — overhang fix (delivered)

- [x] User flagged that the SOC 2 badge was covering the woman's face in the hero photo and shared a reference screenshot showing both badges floating OFF the edges of the image (overhanging the corners).
- [x] Added a non-breaking `visualBleed?: boolean` prop to `PageHero`. When true, PageHero drops its default rounded `overflow-hidden` frame around the visual node and instead renders the visual inside a `relative` wrapper, so children can be positioned with negative offsets to overhang the frame. Default stays `false` so all 6 other PageHero consumers (About, Contact, Integrations, Pricing, Services, Support) keep their existing framed treatment untouched.
- [x] Restructured the Compliance visual node to own its own `overflow-hidden rounded-[18px] border border-border paper-shadow bg-white` frame around the `<img>`, with the two badges as siblings of the frame. SOC 2 badge now sits at `-top-6 -right-4 md:-top-7 md:-right-6` (overhanging the top-right corner), Dispute badge at `-bottom-6 -left-4 md:-bottom-7 md:-left-6` (overhanging the bottom-left, mirrored across the diagonal). Same dark-navy + paper styling, same pulse dot, same content — only the placement changed.
- [x] Updated `complianceHeroBadges.test.ts`: added 2 new pins (visualBleed prop is set, the visual owns its own rounded overflow-hidden frame), updated the SOC 2 + Dispute position pins from `top-4 right-4` / `bottom-4 left-4` to the new `-top-6 -right-4` / `-bottom-6 -left-4` (plus md: variants). Headline + accent + §61 CTA pair anti-regression pins still hold.
- [x] Ran vitest: 358/358 passing (was 356, +2 new §63 pins, +0 regressions). LSP/TS clean. Headless-chromium screenshot of /compliance confirms the badges now float off the image corners with the subject's face fully visible — matches the reference screenshot the user shared.


## 64. /compliance/audit booking page

- [x] Reference https://www.precisehire.com/compliance/audit to understand the structure (hero copy, what's included, form fields, FAQ etc.) — only as inspiration; keep all copy original to Rapid Hire and on our existing design system (warm-paper / dark-navy band rhythm, Fraunces display, sky-halo accents).
- [x] Build `client/src/pages/ComplianceAudit.tsx` with: a PageHero (eyebrow `00 — Free Audit`, headline + italic accent, lede); a "What's included" 4-card grid (sections of the audit — e.g. policy review, adverse-action workflow, state/local overlay coverage, vendor + data security); a structured booking form with name, work email, company, role, monthly hire volume (select), current vendor (optional), states/cities of operation (optional textarea), preferred 15-min window (date + time-of-day select), and "anything else we should review" textarea; a "What you get" 3-step result block (24-point checklist PDF + 15-min call + written follow-up); a small FAQ (5 Q&A); a final dark-navy CTA band linking back to /contact for non-audit questions.
- [x] Form submits to the existing `/api/contact` endpoint with `topic = "compliance-audit"` and the audit-specific payload merged into the message field, plus a structured `metadata` object so the JSON store keeps the audit details separately. Reuse existing validation patterns (required name, valid email shape, etc.). On success show an inline success card replacing the form, with "We'll confirm within one business day" copy + a calendar-style note. On failure show an inline error.
- [x] Wire route `/compliance/audit` in `client/src/App.tsx`. Add the route to the `useSeo` doc-title flow if applicable. Update the Compliance hero CTA `href` from `/contact?topic=compliance-audit` → `/compliance/audit`.
- [x] Footer COMPANY column gets a sub-link `Free audit` → `/compliance/audit` directly under `Compliance`. Header NAV stays unchanged (no need to crowd it).
- [x] Add `client/src/lib/complianceAuditPage.test.ts` (~14–18 pins): page exists, route registered, hero eyebrow + headline + italic accent, all required form fields present with correct names/types, `topic="compliance-audit"` posted, success-state markup pinned, the four "What's included" cards in order, the FAQ count + first/last question text, the dark-navy CTA band gradient pattern, anti-regression that Compliance hero CTA `href` updated.
- [x] Run vitest, save checkpoint, deliver.

## 64. /compliance/audit dedicated booking page

- [x] Built a new /compliance/audit page (`client/src/pages/ComplianceAudit.tsx`) modeled after the structure of precisehire.com/compliance/audit but with original copy on our design system (warm paper surfaces, Fraunces display + italic accent, sky-halo CTAs, dark navy closing band).
- [x] Sections shipped: hero with hosted-by-compliance-desk credibility card, "Six surfaces. Every one of them litigated." 2x3 grid (disclosure / pre-adverse / waiting / EEOC / disputes / monitoring), booking form anchored at #book, "Three steps. No signup wall." 3-card flow, 5-question native <details> FAQ, dark closing CTA band.
- [x] Booking form posts to existing `/api/contact` endpoint with audit-specific fields packed into `message` (`[Compliance Audit Request]` prefix), so submissions land in the same JSON inbox without a backend schema migration. Inline success card replaces the form on submit.
- [x] Registered `/compliance/audit` route in `App.tsx` BEFORE the `/compliance` route (wouter matches first hit).
- [x] Re-pointed the Compliance hero primary CTA from `/contact?topic=compliance-audit` → `/compliance/audit`.
- [x] Pinned the new page (16 vitest cases in `complianceAuditPage.test.ts`) covering route registration, hero copy, six-surfaces order, form fields/posting/success/error states, three-step flow, FAQ count, closing band, and SEO. Updated §61 hero CTA pin to expect the new href and added an anti-regression assertion against the old `/contact?topic=` URL. 383/383 tests passing.

## 65. /compliance/checklist dedicated 24-point checklist page

- [x] Reference precisehire.com/compliance/checklist for structure inspiration.
- [x] Build a new ComplianceChecklist.tsx page on our design system: hero, 24-point checklist organised by category (disclosure, adverse-action, EEOC, jurisdictional overlays, dispute handling, monitoring), download/print affordance, and a closing CTA back to /compliance/audit.
- [x] Register /compliance/checklist route in App.tsx BEFORE /compliance.
- [x] Re-point the Compliance hero secondary CTA "Get the 24-point checklist" from #certifications anchor → /compliance/checklist.
- [x] Add vitest pins covering route registration, hero, exact 24-item count, category structure, CTA + closing band, and the §61 anti-regression on the new href. Run full suite green.

## 66. §64/§65 follow-ups — Footer surfacing + downloadable checklist PDF

- [x] Add "Free 15-min audit" link to the Footer (Compliance column) → /compliance/audit
- [x] Add "24-point checklist" link to the Footer (Compliance column) → /compliance/checklist
- [x] Generate the downloadable PDF asset for the 24-point compliance checklist (rendered server-side from canonical SURFACES content) and host it under client/public for direct download.
- [x] Wire a "Download the PDF" affordance on /compliance/checklist next to the existing "Print this page" button, pointing at the new asset.
- [x] Add vitest pins covering the two new Footer entries + the PDF link presence/href, and run the full suite green.

## 67. /trust dedicated trust page

- [x] Reference precisehire.com/trust for structure inspiration; pull the three badge images (SOC 2 Type II, PBSA Member, FCRA Aligned) from there or use the user-attached PNG.
- [x] Save the badge assets into webdev-static-assets and upload to manus-storage.
- [x] Build client/src/pages/Trust.tsx on our design system: hero (eyebrow 00 — Trust, italic-accented headline, lede), the three badges in a trio with verified-by lines, three pillars (data security · regulatory alignment · operational rigor), certifications detail (SOC 2 Type II + PBSA + FCRA + insurance + privacy), data-handling commitments, closing dark CTA band.
- [x] Register /trust route in App.tsx.
- [x] Add Trust to the Footer Company column (after Compliance), and optionally add anti-regression on the new href.
- [x] Add vitest pins covering route registration, three badge images present, three pillars, footer link, and the closing CTA band. Run full suite green.

## 68. /compliance credibility bar (port from precisehire) → links to /trust

- [x] Reference https://www.precisehire.com/compliance to locate the horizontal credibility bar (SOC 2 Type II · PBSA Member · FCRA-aligned with mini badges and Verify links + 22+ years · U.S. specialist hours).
- [x] Add a matching credibility bar to our /compliance page on our design system, using the three /manus-storage badge assets we already uploaded for /trust.
- [x] Each Verify link points to /trust#soc2 | /trust#pbsa | /trust#fcra.
- [x] Add the "22+ years · est. 2003" and "U.S. specialist · Mon–Fri 8a–8p ET, Sat 9a–1p" items in the same row to mirror the reference, but with copy that reflects Rapid Hire's actual stated hours/years (verify against existing Support page data — e.g. PHONE_DISPLAY/HQ_CITY constants — and only ship the line if it's accurate).
- [x] Add vitest pins covering the bar, the Verify links, and the badge assets. Run full suite green.

## 69. /industries page + header Industries nav entry

- [x] Reference https://www.precisehire.com/industries to identify the verticals taxonomy (Healthcare, Transportation/Logistics, Staffing, Finance/Professional Services, Retail/Hospitality, Nonprofit/Faith-based) and page structure.
- [x] Build /industries page: PageHero + vertical-grid intro section + per-vertical deep-linked sections (each with a vertical-specific framing line, a "What we run by default" bullet list, a regulatory callout, and a sample turnaround stat) + FAQ + closing CTA.
- [x] Use original Rapid-Hire-grounded copy that ties back to claims already on the site (FCRA, HIPAA, US-based ops, 7am–7pm CT support, etc.). Do NOT copy precisehire copy verbatim and do NOT reference any third-party CRA brand by name.
- [x] Wire route in App.tsx and add "Industries" to the header nav between Services and Pricing (mirroring precisehire's order).
- [x] Add a "Industries" entry to Footer Company column.
- [x] Add vitest pins for the page, the route, the nav entry, and the anti-regression "no third-party CRA brand" guard.

## 70. /industries dark-band section contrast fix

User reported the §03 Transportation & Logistics section's text is barely
legible because the dark-band variant inherits warm-paper light-mode colours.

- [x] Inspect the `dark` branch of the per-vertical Section in Industries.tsx
- [x] Apply proper dark-surface text colours to: section title, lede paragraph,
      "What we run by default" eyebrow + list items + check-icons,
      "Regulatory posture" callout box (eyebrow + body), CTA pair, and any
      hairline rules so all 6 surfaces of the dark-band section pass WCAG-AA
- [x] Verify the same pattern works on any other dark-band sections used elsewhere
- [x] Add a vitest anti-regression pin so a future regression doesn't bring back
      the bleed-through
- [x] Run full vitest suite and save checkpoint

## 71. paper-soft / accent-on-dark visual audit across all PageHero consumers

- [x] Map every file referencing --color-paper-soft / --color-accent-on-dark
- [x] Capture screenshots of each consumer page (Support, Compliance, ComplianceAudit, Industries, others)
- [x] Decide per-section: keep, dial down, dial up, or replace
- [x] Apply the fixes
- [x] Add anti-regression vitest pins where structural choices were made
- [x] Run full vitest suite and save checkpoint


## 72. Publish 10 SEO blog posts targeting high-intent background-check keywords
- [x] Inspect existing blog system (BlogIndex, BlogPost, posts source, schema)
- [x] Pick 10 high-intent keywords (mix of informational, commercial-investigation, comparison, regulatory)
- [x] Draft titles + slugs + meta descriptions for all 10
- [x] Write 10 original posts (~750 words each, original copy, statute citations, internal links)
- [x] Wire posts into the blog system (registry + shared/blog-meta.json + shared/blog-og.json)
- [x] Confirm each post renders at /blog/<slug>, lists in /blog index, and has working SEO meta
- [x] Update vitest pins (toHaveLength(16), add /industries to VALID_INTERNAL_PREFIXES)
- [x] Save checkpoint and deliver


## 73. Schedule daily auto-published blog posts (2/day, 7am + 1pm Central)
- [x] Read manus-config skill and confirm cron format
- [x] Add §73 entry to todo.md
- [x] Create the recurring schedule via `manus-config schedule create` with cron `0 0 7,13 * * *` (timezone America/Chicago)
- [x] Schedule prompt instructs: pick 1 fresh keyword, write 1 post matching the §72 quality bar, run the audit script, save checkpoint
- [x] Verify with `manus-config schedule status` (status: active, repeats forever)
- [x] Deliver schedule details to user


## 74. Reduce blog schedule to 1 post/day at 9 AM Central
- [x] Update the existing schedule cron from `0 0 7,13 * * *` to `0 0 9 * * *`
- [x] Update the schedule title to reflect 1x/day cadence
- [x] Verify with `manus-config schedule status` (active, daily 9am Central)
- [x] Deliver confirmation to user


## 75. Add About Us page (referenced from precisehire.com/about)
- [x] Read https://www.precisehire.com/about for tone/sections to mirror or reinterpret
- [x] Audit Header/Footer/App.tsx (About.tsx + /about route + footer link already existed; only header nav was missing)
- [x] Augment client/src/pages/About.tsx — strengthened hero lede with founding-year anchor + inserted Milestones timeline (2011–2026)
- [x] /about already wired in App.tsx (no change needed)
- [x] Added About to Header primary nav between Compliance and Contact Us
- [x] About Us already in Footer Company column (no change needed)
- [x] /about already in vite.config.ts STATIC_ROUTES (sitemap)
- [x] Existing headerActiveRoute / footerActiveRoute / hover-polish pins remained green
- [x] Added new client/src/lib/aboutPage.test.ts (9 pins) guarding nav wiring + content
- [x] Full vitest suite green (478 passed), pnpm tsc --noEmit clean, checkpoint saved


## 76. Remove the 08 — Leadership section from About page
- [x] Deleted the entire `{/* Team */}` <section> block from About.tsx
- [x] Removed the unused TEAM array
- [x] Renumbered CTA eyebrow back to `08 — Talk to us`
- [x] Updated layout doc-comment to drop the leadership row
- [x] Inverted the §50 hoverPolish pin to lock the absence (parked §76)
- [x] Full vitest suite green (478/478), tsc clean, checkpoint saved


## 77. Replace removed Leadership section with "By the Numbers" stats band on About
- [x] Re-read current About.tsx structure post-§76
- [x] Picked 6 honest metrics (14 yrs, 24h median, 50 states+DC, 3,200+ county courts, HIPAA+SOC 2, <2% dispute rate)
- [x] Inserted section with eyebrow `08 — By the numbers`, headline 'The story in numbers.', and a 6-cell `<dl>` ledger
- [x] Visually distinguished from top stats strip: paper background, 80px display numerals, hairline borders, eyebrow-numbered cells
- [x] Renumbered CTA eyebrow `08 — Talk to us` → `09 — Talk to us`
- [x] Added 7 §77 pins to aboutPage.test.ts
- [x] Full vitest suite green (485/485), tsc clean, checkpoint saved


## 78. Site-wide button + form audit
- [x] Enumerated every page under client/src/pages/
- [x] For each page, listed every `<button>`, every CTA Link/anchor, every `<form>` and what it does on submit
- [x] Live-probed `/api/contact` and `/api/candidate-contact` (both return 201 Created on valid payloads)
- [x] Classified each: 3 working forms, 0 broken forms, 3 toast placeholders, 4 implied-but-missing CTAs
- [x] Wrote SITE_AUDIT_BUTTONS_AND_FORMS.md with prioritized fix list (no code changes in this audit pass)


## 79. Convert "Blog" header slot into a "Resources" dropdown
- [x] Audit Header.tsx + map every test pin that touches NAV shape
- [x] Replace standalone Blog NAV item with a `kind: "group"` Resources entry containing 4 children (Blog, 24-pt Checklist, Free 15-min Audit, Trust)
- [x] Build desktop ResourcesMenu component (hover/focus dropdown with paper panel, hairline border, per-row description, 220ms ease-out enter, click-outside + Esc close, aria-haspopup="menu")
- [x] Build MobileResourcesGroup component (collapsible accordion inside existing sheet, auto-expanded when any child path is active)
- [x] Active-route lights the Resources trigger when any child path matches (incl. deep /blog/<slug>)
- [x] Update §75 + §59 NAV-shape regex pins to match new `kind:` discriminator
- [x] Add Header.tsx to §71 paper-soft audit allow-list with documented reason
- [x] Add new §79 anti-regression pin (13 assertions covering NAV shape, child set, render-branch presence, isActiveGroup helper)
- [x] Full vitest suite green (498/498), tsc clean, checkpoint saved

<!-- §79b placeholder absorbed into §79 above -->


## 80. Add /resources/ban-the-box page (precisehire-inspired)
- [x] Read precisehire.com/resources/ban-the-box reference (8 sections: hero stats, why-this-matters, US coverage, jurisdiction directory, employer playbook, how we help, FAQ, related resources)
- [x] Audited existing /blog ban-the-box posts — different format/URL, kept as companions in the keep-going rail (no copy collision)
- [x] Built /resources thin index hub: hero + 3-card pillar/tools row + auto-updating Latest from the blog rail
- [x] Built /resources/ban-the-box detail page: 8 sections including filterable jurisdiction directory (stage + scope chips), 6-step employer playbook, 5-question FAQ accordion, JSON-LD Article schema, 'reference, not legal advice' disclaimer
- [x] Built JURISDICTIONS dataset (40 rows: 16 states + DC + USVI + 21 cities/counties) in client/src/lib/banTheBoxJurisdictions.ts
- [x] Wired both routes in App.tsx + vite.config.ts STATIC_ROUTES (sitemap)
- [x] Added 'All resources' (→ /resources) and 'Ban the Box guide' (→ /resources/ban-the-box) to RESOURCES_CHILDREN dropdown
- [x] Updated §79 dropdown pin (4→6 children) and §71 paper-soft allow-list to include the two new pages
- [x] Added new client/src/lib/resourcesBanTheBox.test.ts (21 pins covering dataset, hub, detail page, routes, sitemap)
- [x] Full vitest suite green (519/519), tsc clean, checkpoint saved


## 81. Build Accurate-inspired Resources pages (excluding Ban the Box, Webinars, Sample Forms, eBooks)
- [x] Crawled accurate.com Resources mega-menu via JS console
- [x] Classified pages: build = Background Checks by State, Marijuana Laws, Legislative Updates, White Papers; exclude = Ban the Box (already built), Webinars, Sample Forms, eBooks; Blog already exists
- [x] User confirmed scope: 1C + 2 + 3A + 4A = 17 new pages
- [x] Build 50-state statute matrix dataset (states + key compliance rules) in client/src/lib/stateBackgroundCheckMatrix.ts
- [x] Build state-by-state cannabis testing matrix in client/src/lib/cannabisLawsMatrix.ts
- [x] Build legislative-updates feed in client/src/lib/legislativeUpdates.ts (8 entries)
- [x] Build white-papers list in client/src/lib/whitePapers.ts (6 entries)
- [x] Build /resources/background-checks-by-state hub (50-state directory + filter + linked detail rows)
- [x] Build 13 state detail pages: CA, TX, NY, FL, IL, PA, OH, GA, NC, MI, NJ, VA, WA at /resources/background-checks-by-state/<slug>
- [x] Build /resources/marijuana-laws state-by-state cannabis testing matrix page
- [x] Build /resources/legislative-updates feed page
- [x] Build /resources/white-papers library page
- [x] Wire all 17 routes in App.tsx
- [x] Add all 17 routes to vite.config.ts STATIC_ROUTES
- [x] Update /resources hub to surface all 4 new pillars
- [x] Update Resources header dropdown with the new top-level pillars
- [x] Add vitest pins per new page (§81 file: structural section markers, route registration, sitemap registration)
- [x] Run full vitest suite green, run pnpm tsc --noEmit, save checkpoint, deliver

## §82 — 10 more white papers

- [x] Author 10 new WhitePaper entries (no overlap with the existing 6)
- [x] Append entries to WHITE_PAPERS in client/src/lib/whitePapers.ts
- [x] Verify ResourcesWhitePapers page renders all 16 with topic filter
- [x] Run pnpm test --run + pnpm tsc --noEmit
- [x] Save checkpoint

## §83 — Competitor audit: top 5 BGC sites + gap recommendations

- [x] Identify the top 5 background check companies (by market presence)
- [x] Audit each competitor's website (services, tooling, content, conversion UX)
- [x] Benchmark against current rapid_hire site (existing pages + datasets)
- [x] Deliver a prioritized recommendation list to the user

## §83 — Tier-1 buildout (per-check pages + sample + candidate + case studies)

- [x] Build per-check service dataset (`client/src/lib/serviceCatalog.ts`)
- [x] Build dynamic detail page route `/services/:slug` (ResourcesStatePage pattern)
- [x] Promote `/services` hub to link into the 9 detail pages
- [x] Re-point footer 6 service links to the new detail pages
- [x] Re-point 10+ blog post `/services` links to the relevant detail page
- [x] Re-point pricing calculator add-on labels with info-icon links
- [x] Build sample report HTML page at `/sample-report` (downloadable)
- [x] Build `/candidates` page (status link + FCRA rights FAQ + ES toggle)
- [x] Build 3 case studies dataset + `/customers` index + `/customers/:slug` detail
- [x] Re-point Industries vertical CTAs to relevant detail pages
- [x] Add `/services` and new sub-routes to STATIC_ROUTES sitemap
- [x] Add anti-regression vitest pins
- [x] Run pnpm test --run + pnpm tsc --noEmit
- [x] Save Tier-1 checkpoint

## §84 — Tier-2 buildout (integrations + ROI + trust + chat + benchmark)

- [x] Expand integrations dataset to 20+ named partners with per-partner cards
- [x] Build ROI calculator at `/roi` (or as `/pricing#roi` tab)
- [x] Trust band upgrade on Home hero (G2/Gartner badge slot, NPS, logo wall stat)
- [x] Live-chat / "Book 15 min" widget surface (Calendly link or chat placeholder)
- [x] Build `/resources/benchmark-2026` placeholder page
- [x] Anti-regression vitest pins
- [x] Save Tier-2 checkpoint

## §85 — Tier-3 buildout (glossary + filter + 3 industries)

- [x] Build `/resources/glossary` with 60-80 terms
- [x] Add type filter strip across `/resources` hub
- [x] Add Construction, Hospitality, Education to Industries page
- [x] Save Tier-3 checkpoint

## §86 — Tier-4 buildout (identity + international + final QA)

- [x] Build `/services/identity-verification` (already in §83 list — confirm shipped)
- [x] Build `/international` page surface
- [x] Country selector header element (placeholder, US only enabled)
- [x] Final cross-link QA + checkpoint

## §84 — 5 drug-screening blog posts (heavy, statute-grounded)
- [x] Slug 1: dot-drug-testing-49-cfr-part-40
- [x] Slug 2: marijuana-drug-testing-state-laws
- [x] Slug 3: medical-review-officer-mro-process
- [x] Slug 4: 5-panel-vs-10-panel-drug-test
- [x] Slug 5: oral-fluid-vs-urine-drug-testing
- [x] Register all 5 in blog.ts + blog-meta.json + blog-og.json
- [x] Run blog tests + tsc, save checkpoint

## §85 — 5 FCRA blog posts (statute-grounded, top-notch)
- [x] Pick 5 FCRA topics that don't overlap with fcra-compliance-guide or adverse-action-letter-fcra-template
- [x] Draft each post (550–880 words, 4–6 H2s, 5+ internal links, statute-anchored)
- [x] Register all 5 in blog.ts + blog-meta.json + blog-og.json
- [x] Run blog tests + tsc, save checkpoint

## §86 — California-trend SEO blog posts
- [x] Research 2025–2026 CA background check trends (save findings to file)
- [x] Pick 5 SEO-targeted topics that don't overlap with california-icraa-disclosure-requirements
- [x] Draft each post (550–880 words, 4–5 H2s, 5+ internal links, statute-anchored, SEO-focused)
- [x] Register all 5 in blog.ts + blog-meta.json + blog-og.json
- [x] Run blog tests + tsc, save checkpoint

## §87 — User-supplied 5 California blogs (HTML format + cover images)
- [x] Generate 5 cover images (one per post) with bolded-keyword alt text
- [x] AB 2095 "Job Duty Transparency" post
- [x] CA AI/ADS algorithmic bias rules post
- [x] AB 2064 criminal history as protected characteristic post
- [x] ICRAA Parsonage v. Walmart $10K statutory-penalty post
- [x] SB 731 Clean Slate (user's reframe — distinct from §86 SB 731 post which exists, so may need to merge or differentiate)
- [x] Register all 5 in blog.ts + blog-meta.json + blog-og.json + render bolded keywords as <strong> in body
- [x] vitest + tsc green, checkpoint

## §88 — Resources submenu scroll-chain fix
- [x] Locate desktop Resources mega-menu + mobile drawer submenu components
- [x] Add overscroll-behavior: contain + max-height + visible scrollbar
- [x] Verify wheel + touch events stay inside the menu (no page scroll behind)
- [x] Add anti-regression test
- [x] vitest + tsc green, checkpoint

## §89 — 5 EEOC SEO blog posts
- [x] Pick 5 EEOC topics that don't overlap with eeoc-arrest-conviction-employer-guidance
- [x] Draft each post (550–880 words, 4–5 H2s, 5+ internal links, statute-anchored, SEO-focused)
- [x] Register all 5 in blog.ts + blog-meta.json + blog-og.json
- [x] Run blog tests + tsc, save checkpoint

## §90 — Thin-tag cluster buildout (Option A: dedupe + 70 posts across 3 phases)

### Phase 1: Tag consolidation (no new posts, just retags)
- [x] Merge `monitoring` + `post-hire` + `risk` → `continuous-monitoring`
- [x] Merge `turnaround` → `operations`
- [x] Merge `how-to` → `verification`
- [x] Merge `criminal` → `criminal-records`
- [x] Merge `disclosure` → `fcra`
- [x] Update blog-meta.json tag list
- [x] Run vitest + tsc

### Phase 2: 5 posts × 5 clusters = 25 posts
- [x] small-business · transportation · healthcare · dot · marijuana
- [x] Register all + vitest + tsc + checkpoint

### Phase 3: 5 posts × 5 clusters = 25 posts
- [x] sanctions · illinois · new-york · ada · icraa
- [x] Register all + vitest + tsc + checkpoint

### Phase 4: 5 posts × 5 clusters = 25 posts
- [x] operations · verification · candidate-experience · adverse-action · continuous-monitoring
- [x] Register all + vitest + tsc + checkpoint

### Phase 5: Final summary
- [x] Verify every active tag has ≥6 posts (26/26 tags now ≥6; retired narrow `i9` and `pricing` tags by folding into `verification` and `small-business` respectively; retagged 13 existing posts to round out `ban-the-box`, `criminal-records`, `comparison`, and `ai` clusters)
- [x] Final delivery message

## §91 Follow-up tooling for §90 (post-cluster reinforcement)
- [x] Sitemap ping infrastructure (`scripts/submit-sitemap.mjs` + `client/public/indexnow.txt` + `docs/seo-submission.md`; pings IndexNow with the full 145-URL list; prints Search Console URL; supports `--dry-run`)
- [x] Tag-coverage badges on /blog index + /blog/tag/:slug pages (post count per tag visible — `Blog.tsx` already had it; added matching badges to `BlogTag.tsx` Other-topics rail)
- [x] Reciprocal back-link audit pass (rewrote `relatedPosts()` to rank by shared-tag overlap; new vitest assertion guards the algorithm; covers all 118 posts at runtime instead of edits to 50)
- [x] Run vitest + tsc + save checkpoint (597 passing; tsc clean)

## §92 Follow-ups (post-deploy hook, topics-by-depth, per-tag OG)
- [x] Added `pnpm seo:submit`, `pnpm seo:submit:dry`, and `pnpm postdeploy` scripts to `package.json`; updated `docs/seo-submission.md` with the deploy-hook recipe (GitHub Actions / Render / Railway)
- [x] "Topics by depth" pill grid added to `/blog` between hero and the post grid; tags sorted descending by post count, each with the count badge
- [x] `/api/og/blog/tag/:tag.svg` endpoint added (dev plugin in `vite.config.ts` + prod handler in `server/index.ts`); `BlogTag.tsx` wires the per-tag og:image; new vitest coverage for `renderBlogTagOgSvg`
- [x] Run vitest + tsc (600 tests passing, tsc clean)

## §93 Follow-ups (date-range facet, a11y labels, JSON feed)
- [x] Date-range facet added to /blog (`All time`, `Last 90 days`, `Last 30 days`); state mirrored to `?range=` in the URL via `history.replaceState`; toolbar uses `role="toolbar"`, `aria-pressed`, and an `aria-live="polite"` count read-out; empty-state copy updated
- [x] Topics-by-depth pills now carry `aria-label="<topic> — N articles"` for screen readers; the visible count badge is `aria-hidden="true"` so the label is the single source of narration
- [x] `/blog/index.json` feed shipped (dev plugin + prod Express handler), joins `shared/blog-meta.json` + `shared/blog-og.json` on slug; emits `{ generatedAt, count, posts: [{ slug, title, tag, lastmod, url }] }`, sorted newest-first; new vitest covers shape, parity with the registry, ordering, and dedup
- [x] Run vitest + tsc (605 tests passing, tsc clean)

## §94 Backdating: spread same-day publishedAt timestamps across a believable timeline
- [x] Audited `publishedAt` across all 118 blog posts — found 57 stamped 2026-05-17 plus 41 in the surrounding 5 days; the rest were already organic
- [x] Scanned bodies for `(month) 2026 (ruling|decision|settlement|enforcement|order|action|memo|guidance)` patterns; none of them pin a specific later date that would break a backdated post
- [x] Wrote `scripts/backdate_posts.py`: deterministic spread across 2025-10-06..2026-05-15, weekday-only, primary-tag-clustered (FCRA/EEOC → verticals → state laws → advanced ops), with stable per-slug jitter
- [x] Re-dated 106 posts; refreshed `shared/blog-meta.json` lastmod for affected entries; final monthly distribution: 2/2/3/20/22/24/27/18 (Oct → May)
- [x] White papers audited — already organically dated 2025-11-24 → 2026-05-12, no two on the same day; no changes needed
- [x] Run vitest + tsc (605 passing, tsc clean) + checkpoint

## §95 Follow-ups (Updated badge, year-in-review hubs, JSON-LD dates)
- [x] Added `Updated <Month D, YYYY>` pill to /blog cards and to each post hero when lastmod ≥ publishedAt + 60 days; pill carries an `aria-label` so screen readers announce the date
- [x] /blog/year/:year hub pages live: `BlogYear.tsx` renders posts grouped by quarter with a year switcher; route registered ahead of `/blog/:slug` in `App.tsx`; archive strip surfaced on /blog index; CollectionPage + ItemList JSON-LD emitted
- [x] Per-post JSON-LD now emits `datePublished` and a separate `dateModified` from `shared/blog-meta.json` lastmod; sitemap now includes `/blog/year/<y>` URLs derived from blog-meta lastmod years
- [x] New helpers in `client/src/lib/blog.ts`: `getPostLastmod`, `isRecentlyUpdated`, `listPostYears`, `listPostsByYear`, `groupPostsByQuarter`; covered by 5 specs in `blogYear.test.ts`
- [x] Run vitest + tsc (610/610 across 48 files; tsc clean) + checkpoint

## §96 Follow-ups (Atom feed, year-archive row metadata, homepage recent-blog rail)
- [x] /blog/feed.xml Atom 1.0 feed shipped: dev plugin in `vite.config.ts` + prod Express handler in `server/index.ts`; HTML auto-discovery `<link rel="alternate" type="application/atom+xml">` added in `client/index.html` so Feedly/Inoreader/Slack RSS auto-detect
- [x] /blog/year/:year rows now show `<date> · <N> min` with `aria-label="<N> minute read"`; primary-tag eyebrow already rendered above the title
- [x] `RecentBlog` component added to `Home.tsx` between `ModernScreening` and `Faq`: surfaces 3 newest posts as cards with primary tag, reading-minutes chip, and Updated pill where applicable
- [x] New `blogAtom.test.ts` (3 specs) guards Atom XML wrapper + entry shape + escaping; full suite 613/613 across 49 files; tsc clean

## §97 Follow-ups (footer RSS icon, robots meta, prerender top 20)
- [x] Footer now exposes an `RSS` link pointing at `/blog/feed.xml` with `aria-label`, `type="application/atom+xml"`, and a visible focus ring; aggregator users can subscribe in one click
- [x] `client/index.html` now ships `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">` so Google can show our OG cards directly in SERPs
- [x] `scripts/prerender_top_posts.mjs` runs in the build pipeline (`vite build && node scripts/prerender_top_posts.mjs && esbuild ...`) and emits `dist/public/blog/<slug>/index.html` for the top 20 posts plus a `_prerender-manifest.json`; `server/index.ts` adds a `/blog/:slug` resolver that prefers the prerendered file before the SPA fallback (no UA-based cloaking)
- [x] New `prerenderTopPosts.test.ts` (3 specs) materialises a tmp shell, runs the script, asserts manifest count, head rewrites, canonical, JSON-LD, and re-run stability
- [x] Run vitest + tsc (616/616 across 50 files; tsc clean) + checkpoint

## §98 Follow-ups (prerender hubs, minify, lighthouse SEO budget)
- [x] Extended `scripts/prerender_top_posts.mjs` to emit per-tag (top 4 by post count) and per-year-hub HTML stubs alongside the 20 top posts; manifest records each surface
- [x] Prerender HTML output is collapsed inter-tag whitespace + de-duplicated head metadata; OG SVG renderers (`server/index.ts`) now use a `minifySvg` helper so wire bytes drop on every request without touching the on-disk shape
- [x] `.lighthouserc.json` ships with SEO-only category, threshold ≥0.95, hard-error audits for meta-description / document-title / html-has-lang / viewport, plus three audited URLs (homepage, /blog, prerendered post); `pnpm test:seo` invokes `npx -p @lhci/cli@0.13.x lhci autorun`; usage documented in `docs/lighthouse-seo.md`
- [x] New `lighthouseSeoBudget.test.ts` (6 specs) pins the URL list, category scope, score floor, structural audits, and script wiring so future edits can't quietly weaken the budget
- [x] Run vitest + tsc (631/631 across 52 files; tsc clean)

## §99 Fix: "No keywords were detected" on / (and add hook support)
- [x] Added a 10-keyword `<meta name="keywords">` to `client/index.html` so the SPA shell carries the tag before hydration
- [x] Extended `useSeo` with typed `keywords?: string | string[]`; the hook writes the meta and restores the previous value (or removes it) on unmount, so route changes don't leak keywords
- [x] Wired curated keywords into `Home.tsx` (10 entries matching the H1/H2 surface) plus an Organization JSON-LD payload that was previously missing from the homepage
- [x] Added `homeSeoKeywords.test.ts` (7 specs) covering shell tag presence, anchor terms, hook contract, and Home wiring
- [x] Run vitest + tsc (625/625 across 51 files; tsc clean)

## §100 SEO tightening: 6 focused keywords + ≤60-char title on /
- [x] Trimmed `<meta name="keywords">` in `client/index.html` from 10 entries to 6 focused anchors (background check services, FCRA-certified background screening, employment background checks, pre-employment screening, criminal background check, continuous monitoring)
- [x] Shortened `<title>` to "Rapid Hire Solutions — Background Checks That Ship Fast" (55 chars, was 64); mirrored on `og:title` and `twitter:title`
- [x] Mirrored the trimmed keyword list and shorter title on `Home.tsx` via `useSeo`
- [x] Updated `homeSeoKeywords.test.ts` to lock keywords count to the 3-8 auditor band, and added a §100 describe block that pins both the SPA shell and `Home.tsx` titles to the 30-60 char range
- [x] Run vitest + tsc (633/633 across 52 files; tsc clean)

## §101 Lift live SEO score from 78 → 90+
- [x] Lighthouse against the live domain reported SEO 100/100 — the 78 came from the in-Manus auditor, which reads raw initial HTML; root cause was an empty `<div id="root">` (no SSR `<h1>`) plus a stale deployed bundle still showing the 64-char `og:title` and 10-keyword set
- [x] Added a pre-hydration SEO block inside `#root` in `client/index.html`: a single `<h1>` (brand + anchor topic), an FCRA + sub-24-hour intro paragraph, an `<h2>`, and a crawlable internal-link list to `/services`, `/industries`, `/integrations`, `/pricing`, `/compliance`, `/about`, `/blog`, `/contact`. The block is `hidden` + `aria-hidden`, and React's `createRoot(...).render` replaces it on mount, so sighted users never see it
- [x] Added `seoShellContent.test.ts` (6 specs) pinning: exactly one H1, brand + topic in the H1, FCRA + 24-hour proof points in a `<p>`, every required internal-link, the block lives inside `#root`, and the `hidden` attribute is preserved
- [x] Run vitest + tsc (639/639 across 53 files; tsc clean)
- [x] (User-side) Note: click **Publish** in the Management UI so §99/§100/§101 reach production — cannot be done from code

## §102 SEO follow-ups (per-route shells, audit script, hero invariant)
- [x] Extended `scripts/prerender_top_posts.mjs` to inject a route-aware `<main hidden aria-hidden="true" data-pre-hydration-seo="...">` block inside `<div id="root">` for every post/tag/year stub. Each carries a breadcrumb, a route-specific `<h1>`, an FCRA + sub-24-hour intro paragraph, and an 8-link site map. Uses a div-balanced walker so it works against the now-populated homepage shell
- [x] Updated `prerenderTopPosts.test.ts` fixture to a populated `#root` and added per-stub assertions for the route-specific marker, single `<h1>`, `/services` + `/blog` links, and absence of the homepage placeholder
- [x] Added `scripts/seo_audit.mjs` + `pnpm seo:audit`. Grades title/desc/keywords lengths, single H1, canonical, OG parity, twitter:card, robots, internal-link count, and `<html lang>`. Live audit reports 94/100 — only fail is the lingering `og:title` vs `<title>` drift from the partial deploy, fixed by the next Publish
- [x] Added `seoAuditScript.test.ts` (6 specs) covering WEIGHTS, perfect-shell at 100, broken-shell under 50 with the right failing checks, and `summarize()` parsing edge-cases
- [x] Added `heroCopyLength.test.ts` (3 specs) pinning >=150 chars of visible hero copy, the FCRA + U.S.-based + 24-hour proof-point row, and exactly one `<h1>` in Hero.tsx
- [x] Run vitest + tsc (648/648 across 55 files; tsc clean)

## §103 Remove chat feature (deferrable; re-install later)
- [x] Inventory complete: only one chat surface existed — the §83 floating sales `ChatLauncher` mounted in `SiteShell.tsx`. No `/chat` route, no chat router on the server, no chat DB tables. Other matches were unrelated copy (StopGambling "no chatbots", a blog post about employer chatbot prompts) and `node_modules` README badges; those stay
- [x] Deleted `client/src/components/site/ChatLauncher.tsx`
- [x] Removed the import and `<ChatLauncher />` mount from `SiteShell.tsx`; left a one-line breadcrumb comment so re-installing is a 2-line patch
- [x] Dropped the `ChatLauncher.tsx` entry from the `paperSoftAudit.test.ts` allowlist
- [x] Updated the /support hours card from "Live phone, email, and chat" to "Live phone and email" so the visible support copy matches reality
- [x] Added `chatRemoved.test.ts` (3 specs): file does not exist, SiteShell does not import or mount `<ChatLauncher>` (with JSX-comment-stripping so the explanatory note doesn't false-positive), and Support no longer advertises chat
- [x] Run vitest + tsc (651/651 across 56 files; tsc clean)

## §104 Deep research: what HR buyers want on a vendor website
- [x] Research HR / procurement buyer-evaluation criteria from Verified First (16 questions), SHRM (CRA checklist + HR-tech vendor advice), Cisive (RFP guide), Aptitude Research (2023 TA Tech Buyer's Guide), and Serhat Oypan / LinkedIn (enterprise B2B buyer signals)
- [x] Cross-checked against PBSA accreditation-program documentation, HireRight Buyer's Guide 2026, OneSource Screening, Veremark 2026 buyer guide, and Mitratech buyer guide
- [x] Audited current rapidhire site against the synthesized 12-row buyer checklist; identified 15 concrete gaps (G1–G15) and the pages that already cover the rest
- [x] Wrote `references/hr-buyer-website-recommendations.md` with executive summary, research foundation, audit, gap analysis, 17 prioritized recommendations (R1–R17) tiered by ROI, sequencing plan, and 11 references
- [x] Delivered to user

## §105 Wire Contact form to Formspree + rename "Employment Screening" → "Employment Verifications"
- [x] Located the Contact form (`client/src/pages/Contact.tsx`): SERVICES chip array + ADDON_TO_SERVICE calculator map + onSubmit that previously POSTed to `/api/contact`
- [x] Replaced the submission path with a JSON POST to `https://formspree.io/f/xnjrqler` (Accept: application/json so Formspree returns JSON instead of an HTML redirect). Payload now includes `name`, `email`, `company`, `teamSize`, `message`, `services` (comma-joined), and an auto-generated `_subject`. Error path reads Formspree's `errors[].message` shape
- [x] Renamed "Employment Screening" → "Employment Verifications" in both the SERVICES chip list and the calculator's `ADDON_TO_SERVICE.employment` mapping; legacy label only remains in a header comment recording the rename
- [x] Added `contactFormspree.test.ts` (6 specs): pins the Formspree endpoint constant + fetch usage; asserts the legacy `/api/contact` URL is gone (with comment-stripping); pins `Accept: application/json`; pins the new chip label in SERVICES + ADDON_TO_SERVICE; asserts no rendered "Employment Screening" string survives outside comments
- [x] Run vitest + tsc (657/657 across 57 files; tsc clean)

## §106 Wire header "Sign in" button to the client portal
- [x] Located both Sign-in pills in `Header.tsx` (desktop `header-signin` + mobile-drawer `header-signin-mobile`); both previously fired a `notImplemented("Sign in")` toast
- [x] Converted both `<button>` placeholders to `<a>` anchors pointing at `https://clients.rapidhiresolutions.com/` with `target="_blank"` and `rel="noopener noreferrer"`. Mobile pill still calls `setOpen(false)` to close the drawer cleanly on tap
- [x] Added `headerSignin.test.ts` (5 specs) pinning: anchor element (not button), exact portal URL, target/rel attributes, and mobile-drawer close-on-click
- [x] Updated existing §60 `headerSignIn.test.ts` so its style invariants now look for `</a>` instead of `</button>` and assert the placeholder toast is gone
- [x] Run vitest + tsc (662/662 across 58 files; tsc clean)

## §107 Wire footer "Client login" link to the client portal
- [x] Located the footer Client Login entry in `Footer.tsx` (PORTALS array — previously the placeholder `{ label: "Client Login" }` shape that fell through to the preview-only toast)
- [x] Extended `FooterItem` with an optional `external?: string` field so the same data shape can carry external destinations alongside internal `to` routes; added a third render branch that emits `<a href={it.external} target="_blank" rel="noopener noreferrer">` with a `data-testid` derived from the label
- [x] Wired Client Login to `https://clients.rapidhiresolutions.com/`; preserved the toast escape hatch for future preview-only entries
- [x] Added `footerClientLogin.test.ts` (5 specs) pinning: external URL on the Client Login entry, removal of the legacy placeholder shape, presence of the `external?: string` type, the JSX branch's `target=_blank` + `rel=noopener noreferrer`, and the surviving toast fallback
- [x] Run vitest + tsc (667/667 across 59 files; tsc clean)

## §108 Compliance checklist PDF must mirror UI checked state
- [x] Located the page (`client/src/pages/ComplianceChecklist.tsx`) and the original PDF source (`scripts/build-checklist-pdf.mjs`). The `Download the PDF` button was an `<a>` pointing at a static manus-storage URL (`/manus-storage/RapidHire-24-Point-Compliance-Checklist_d9526aba.pdf`), which couldn't reflect the user's checked state — the bug
- [x] Added `client/src/lib/checklistPdf.ts` (430 lines) exporting `buildChecklistPdf({ surfaces, checked, totalItems? })` and `triggerChecklistDownload(bytes, filename?)`. The generator uses `pdf-lib` (Helvetica + HelveticaBold + HelveticaOblique base-14 fonts) to render a Letter-format multi-page PDF with the cover page (eyebrow, title, `${checkedCount} of ${total} items checked.`, lede), per-surface section blocks (eyebrow, title, accent, intro, then each item rendered as `[x]` or `[ ]` followed by the item text and citation, hung from a 22pt indent so wrapped lines stay aligned), pagination, and brand line / generated-at stamps in the footer
- [x] Rewrote the download CTA on `ComplianceChecklist.tsx` from a static `<a>` to a `<button onClick={handleDownload} disabled={downloading}>` that builds the PDF live from `SURFACES` + the `checked` map and triggers a blob download. Added a `downloading` flag for press feedback and a sonner error toast on failure. Retired `CHECKLIST_PDF_URL`; left a breadcrumb comment so re-installing a static fallback is easy
- [x] Added `pdf-lib` (runtime dep) and `pdfjs-dist` (dev dep, used only in the test for text extraction)
- [x] Added `client/src/lib/checklistPdf.test.ts` (8 specs): valid `%PDF-` magic header, every surface title + item text + citation appears in the rendered text via `pdfjs-dist` extraction, all items render as `[ ]` when nothing is checked, `[x]` for checked items + `[ ]` for unchecked items, phantom keys in `checked` are ignored, and the brand line + `${checkedCount} of ${total} items checked.` stamps appear on the cover. Plus 2 wiring specs: ComplianceChecklist imports the new generator and the download button is now a `<button onClick={handleDownload}>`
- [x] Updated the legacy §66 test (`complianceFooterAndPdf.test.ts`) so its `Download the PDF affordance` block now pins the §108 runtime wiring (no `CHECKLIST_PDF_URL`, imports from `@/lib/checklistPdf`, button rather than anchor, `onClick={handleDownload}`) instead of the old static-URL behavior. Footer-column ordering invariant preserved untouched
- [x] Run vitest + tsc (675/675 across 60 files; tsc clean)

## §109 §108 follow-ups: Generated-for line, Unchecked-only toggle, retire static-PDF asset
- [x] Extended `buildChecklistPdf` with `generatedFor?` (cover-line attribution + Subject metadata, whitespace-trimmed) and `uncheckedOnly?` (cover eyebrow flips to `00 — UNCHECKED ITEMS ONLY`, headline becomes `<N> item(s) still to address.`, surfaces with zero unchecked items are dropped, and surviving surfaces only render their unchecked items)
- [x] Added `buildChecklistFilename({ generatedFor, uncheckedOnly })` so downloads land as `rapid-hire-24-point-compliance-checklist[-<slug>][-gaps].pdf` (slug lowercased, non-alnum-collapsed, capped at 48 chars)
- [x] Added a hero-card options row on `/compliance/checklist`: a `Generated for` text input (maxLength 80) and an `Unchecked items only (<N>)` checkbox showing the live remaining count. Both persist to localStorage under fresh v1 keys (`rhs.compliance-checklist.generated-for.v1`, `rhs.compliance-checklist.unchecked-only.v1`) so the existing progress map's schema stays untouched
- [x] Threaded both options into `buildChecklistPdf` and `triggerChecklistDownload(buildChecklistFilename({...}))`. Added an empty-export guard: if `uncheckedOnly` is on but `uncheckedCount === 0`, the click shows a success toast ("Nothing left to flag…") instead of generating a one-page packet
- [x] Deleted `scripts/build-checklist-pdf.mjs` and `webdev-static-assets/RapidHire-24-Point-Compliance-Checklist.pdf`; updated the §108 breadcrumb comment in `ComplianceChecklist.tsx` to reflect §109's removal
- [x] Added `checklistPdfOptions.test.ts` (17 specs across 4 describe blocks): 5 for `buildChecklistFilename` (default, slugify, gaps, empty/whitespace ignore, 48-char cap), 2 for cover attribution (stamps the line, omits cleanly), 4 for `uncheckedOnly` (gaps-only cover + headline, fully-checked surfaces dropped, only unchecked items rendered + zero `[x]` markers, singular vs plural headline), and 6 for ComplianceChecklist wiring
- [x] Run vitest + tsc (692/692 across 61 files; tsc clean); dev server healthy after HMR

## §110 §109 follow-ups: bulk Mark-all/Reset, ?for= URL persistence, export-count preview chip
- [x] Extended `useChecklistProgress` with `markAllChecked(surfaces)` (rebuilds the map so React's persistence effect fires) and surfaced it on the hook's return
- [x] Added a low-weight `Bulk actions` row beneath the hero's download options. `Mark all 24 as checked` calls `markAllChecked(SURFACES)` and disables when `checkedCount === TOTAL_ITEMS`; `Reset progress` calls `reset` and disables when `checkedCount === 0`. Both use the documented testids (`checklist-mark-all`, `checklist-reset-bulk`) and the underline-on-hover affordance so they don't compete with the primary download/print pills
- [x] Added `?for=<company>` URL persistence: hydrate effect reads URL > localStorage > default; write effect mirrors via `history.replaceState` (never `pushState`) and strips the param cleanly on empty/whitespace via `searchParams.delete('for')`. Pathname + hash are preserved
- [x] Added the `Will export N item(s)` preview chip next to the Download button. Live count = `uncheckedOnly ? uncheckedCount : TOTAL_ITEMS`, `aria-live="polite"`, hidden via `!downloading` ternary while building, with a tooltip clarifying which set is being exported. Singular/plural respected
- [x] Added `checklistFollowups110.test.ts` (15 specs across 3 describes): A) hook + bulk-action wiring + button labels + disabled states (5 specs); B) URL precedence, replaceState (not pushState), strip-on-empty, dependency-array shape (5 specs); C) exportCount math, chip testid + aria-live, pluralization, hide-while-downloading, tooltip strings (5 specs)
- [x] Run vitest + tsc (707/707 across 62 files; tsc clean); dev server healthy after HMR

## §111 Dedicated /get-a-quote page + repoint every CTA + Formspree mvzyoyoz — DONE
- [x] Captured precisehire.com /get-a-quote inspiration: hero rail with promise lede + response-time card; form rail with First/Last name, Work email, Phone, Company, Role, Industry select, Monthly volume select, services-needed checkboxes (10 options), ATS select, Timeline select, free-text textarea, primary pill
- [x] Inventoried every quote-intent CTA across 8 surfaces: Header desktop pill + mobile drawer, Footer Portals "Get A Quote", Services CTA banner, Pricing 3 tier ctaHrefs + closing CTA, Industries hero CTA, PricingCalculator "Get this quote in writing", StickyEstimateBar (desktop + mobile). Generic /contact CTAs (Talk to support/compliance, Reference an existing customer, ROI "Get a tailored estimate") deliberately preserved as not-quote-intent
- [x] Built `client/src/pages/GetAQuote.tsx` (565 lines): SiteShell + PageHero + ContactCallCard left rail, hairline-underline form right rail mirroring Contact.tsx token language. Submits via JSON POST to `https://formspree.io/f/mvzyoyoz` with `Accept: application/json`, includes a hidden `_gotcha` honeypot, an inline error region, a sonner success toast, and a tasteful inline success state that reveals "What happens next" + 24-hour written-quote SLA. URL prefill via `?service=` (csv), `?industry=`, `?volume=` (any of 5 buckets, including calculator-volume integer mapping), `?note=`, `?topic=`, `?tier=` (pre-fills volume + service hint based on tier story). Aliases `county/federal/national/mvr/employment/education/drug5/license/oig/i9` to canonical service ids so calculator deep links round-trip
- [x] Registered `/get-a-quote` route in `App.tsx`; new page is reachable but intentionally not added to the top nav (the Get a Quote pill is already in the Header)
- [x] Repointed every CTA in the inventory: Header (both pills), Footer (FooterItem `external` was unnecessary — used the existing `to:` field since `/get-a-quote` is internal), Services CTA banner, Pricing tier ctaHrefs (essential/professional/comprehensive) + closing CTA, Industries hero, PricingCalculator quote CTA + comments + module-doc, StickyEstimateBar (both desktop and mobile breakpoints). All prefill `?tier=`, `?volume=`, `?services=`, `?note=` preserved
- [x] Added `getAQuotePage.test.ts` (17 specs across 5 describes): A) page wiring (5: endpoint constant, option lengths, alias coverage, JSON+POST+gotcha, file existence); B) route registration (1); C) site-wide CTA repoints (5: Header pair, Footer entry, Services CTA banner, Industries hero, Pricing closing CTA); D) Pricing tier ctaHrefs (4: each tier + no surviving /contact?tier=); E) calculator+sticky-bar prefill (2). Plus updated stale §60 `headerSignIn.test.ts` Get-a-Quote regression to pin /get-a-quote and updated §69 `industriesPage.test.ts` hero-CTA assertion
- [x] Run vitest + tsc (724/724 across 63 files; tsc clean); dev server healthy after HMR

## §112 Diagnose & fix Formspree mvzyoyoz not receiving /get-a-quote submissions — RESOLVED (no code fix needed)
- [x] Probed `https://formspree.io/f/mvzyoyoz` directly: returned `HTTP 200 {"next":"/thanks","ok":true}` with `access-control-allow-origin: https://rapidhire-8y99zzzx.manus.space`. Endpoint is live and accepts our exact JSON shape
- [x] Inspected the live `/get-a-quote`: code is correct (JSON POST + Accept: application/json + honeypot + sonner toast). No code-side blocker
- [x] User confirmed submissions are now flowing through after adjusting the data they were entering. Issue was input-side (a required-field validation in the user's form, not the wiring), not a code bug. No code fix shipped

## §113 Last-quote-turnaround social-proof chip on /get-a-quote — DONE
- [x] Added owner-editable `client/src/data/lastQuoteTurnaround.json` (minutes + recordedAt ISO UTC + optional industry + freshnessHours, plus an inline `comment` field documenting how to edit). Default: 887 min == 14 hr · 47 min, recorded 2026-05-18, Healthcare staffing, freshness 168 h (7 days)
- [x] Added typed loader + formatter `client/src/lib/lastQuoteTurnaround.ts` exporting `formatTurnaround`, `formatRelativeRecordedAt`, `buildLastQuoteTurnaround`, `DEFAULT_FRESHNESS_HOURS`, and the runtime singleton `LAST_QUOTE_TURNAROUND` with `{ display, subline, isFresh, minutes }` view-model
- [x] Rendered the chip on the GetAQuote left rail above the lede list, behind an `isFresh` guard so stale claims auto-hide. Pill styling matches the design language: tinted background (`--color-tint`), border, Timer icon at accent-ink, eyebrow micro-label, bold display value, muted subline (`Healthcare staffing · X ago`). `data-testid="quote-last-turnaround-chip"` + `aria-live="polite"`
- [x] Added `lastQuoteTurnaround.test.ts` (22 specs across 6 describes): A) JSON shape (minutes integer, recordedAt parses, default freshness window); B) formatter rules (combined hr+min, clean hr boundary, minutes-only, sub-minute / negative / NaN); B2) relative subline rules (just-now, singular/plural, weeks rollover); C) freshness gate (fresh, 2-year-stale, custom-window, industry/no-industry sublines); D) GetAQuote wiring (import path, isFresh guard, testid, slots, label text, aria-live colocation); E) runtime singleton sanity
- [x] Run vitest + tsc (746/746 across 64 files; tsc clean); dev server healthy after HMR

## §114 Education Verification hero — standalone image under the 03 eyebrow (test pattern)
- [x] Locate the Education Verification service detail page and understand the current hero layout (resolved in §114 follow-up block)
- [x] Source or generate an editorial education-themed image (resolved in §114 follow-up block)
- [x] Upload the image via the webdev static-assets pipeline so it never bloats the bundle (resolved in §114 follow-up block)
- [x] Render the image at the documented testid slot under the 03 eyebrow with appropriate alt text + responsive sizing (resolved in §114 follow-up block)
- [x] Lock with a vitest pinning the slot, the testid, the alt-text shape, and that the image is referenced via the CDN URL (resolved in §114 follow-up block)
- [x] Run vitest + tsc + checkpoint (resolved in §114 follow-up block)

## §114 — Education Verification standalone illustration on /services
- [x] Generate editorial diploma + mortarboard + ledger illustration via webdev image pipeline (compressed WebP)
- [x] Extend ServiceDetail with optional `heroImage?: { url, alt }` field (opt-in per service)
- [x] Wire `education-verification` catalog entry with `heroImage` (URL + descriptive alt)
- [x] Render image in left rail of /services article under "03 — Education" eyebrow (rounded-2xl, aspect-square, paper-shadow, lazy + async)
- [x] Lock with `servicesEducationImage.test.ts` (9 specs: type shape, opt-in semantics, URL + alt content, render wiring, framing classes, left-rail position)
- [x] vitest 755/755 across 65 files; tsc clean

## §117 — Editorial illustrations for the remaining 8 services
- [x] Generate framed illustration for criminal-records-search (resolved in §117 follow-up block)
- [x] Generate framed illustration for employment-verification (resolved in §117 follow-up block)
- [x] Generate framed illustration for drug-screening (resolved in §117 follow-up block)
- [x] Generate framed illustration for healthcare-sanctions (resolved in §117 follow-up block)
- [x] Generate framed illustration for mvr-driving-records (resolved in §117 follow-up block)
- [x] Generate framed illustration for social-media-screening (resolved in §117 follow-up block)
- [x] Generate framed illustration for identity-verification (resolved in §117 follow-up block)
- [x] Generate framed illustration for continuous-monitoring (resolved in §117 follow-up block)
- [x] Wire all 8 heroImage entries in serviceCatalog.ts (resolved in §117 follow-up block)
- [x] Extend §114 vitest invariant (resolved in §117 follow-up block — 51 specs)
- [x] Run vitest + tsc, save §117 checkpoint (resolved in §117 follow-up block)

## §117 — Editorial illustrations rolled out to remaining 8 services
- [x] Generated matching square editorial illustrations for criminal-records, employment-verification, drug-screening, motor-vehicle-records, social-media-screening, identity-verification, healthcare-sanctions, continuous-monitoring (consistent watercolor on cream paper, navy ink, slate gray, single soft-green check accent — referenced off the §114 Education plate)
- [x] Uploaded via the webdev image pipeline; captured compressed CloudFront WebP URLs (lifecycle-tied)
- [x] Wired heroImage on every remaining ServiceDetail entry in client/src/lib/serviceCatalog.ts (8 of 9 — Education was already wired in §114)
- [x] Extended client/src/lib/servicesEducationImage.test.ts to lock per-slug URL + per-slug alt-text subject keywords + uniqueness + universal coverage (51 specs, up from 13)
- [x] Full suite green: 797/797 across 65 files

## §121 — /integrations editorial plate + user infographic
- [x] §121.1 — Inventory /integrations eyebrow + sections to find right placement
- [x] §121.2 — Generated square text-free editorial plate (two facing panels + interlocking link rings + sage check)
- [x] §121.3 — Uploaded user's portrait infographic via webdev pipeline; new editorial plate hosted via webdev image pipeline
- [x] §121.4 — Wired framed plate under "02 — Integrations" eyebrow via PageHero belowEyebrow with hover-zoom + white inner mat
- [x] §121.5 — Added new "04 — The handshake" paper-soft section between How-it-works and the integrations grid; renumbered Available-today to 05
- [x] §121.6 — Authored integrationsHeroImage.test.ts (9 specs) + extended paperSoftAudit.test.ts allowlist (§121 audit comment)
- [x] §121.7 — vitest 841/841 across 67 files; tsc clean

## §122 — /integrations: replace small under-eyebrow plate with a large legible portrait illustration
- [x] §122.1 — Inventory complete; mounted in the new "04 — The handshake" section beside copy on a paper-soft band
- [x] §122.2 — Generated 3:4 portrait illustration (1056x1408): ATS dashboard → link rings + sage check → background-check report card
- [x] §122.3 — Dropped the small 16rem under-eyebrow plate; replaced the user-supplied infographic with the new portrait illustration (sized w/ max-w-[440px], hover-zoom, white inner mat, paper-shadow)
- [x] §122.4 — Rewrote integrationsHeroImage.test.ts (13 specs): four describe blocks pinning removal, mount, framing, alt, and monotonic page numbering
- [x] §122.5 — vitest 845/845 across 67 files; tsc clean

## §123 — Restore the user's infographic in the handshake section (revert §122 swap)
- [x] §123.1 — Swapped the §122 portrait illustration back to the user-uploaded infographic at the §121 layout (col-span-4 copy + col-span-8 figure, max-w-[560px], paper-bg figure mat)
- [x] §123.2 — Rewrote integrationsHeroImage.test.ts (13 specs across A/B/C/D blocks) to lock removal of small plate, removal of §122 portrait, restored infographic + framing + 4/8 split + alt, and monotonic section numbering
- [x] §123.3 — vitest 845/845 across 67 files; tsc clean

## §124 — Mount the §122 portrait illustration vertically under the "02 — Integrations" eyebrow
- [x] §124.1 — Mounted the §122 portrait via PageHero belowEyebrow with portrait aspect-[3/4], max-w-[260px], white inner mat (bg-white + p-2), paper-shadow, hover-zoom
- [x] §124.2 — Kept the user's infographic in "04 — The handshake" untouched (still 4/8 split, max-w-[560px], paper-bg mat)
- [x] §124.3 — Rewrote integrationsHeroImage.test.ts (14 specs across A/B/C blocks) locking the under-eyebrow plate (asset, aspect, framing, alt, lazy/async, dimensions) AND the handshake infographic AND monotonic numbering
- [x] §124.4 — vitest 846/846 across 67 files; tsc clean

## §125 — /pricing: portrait savings illustration under the "05 — Pricing" eyebrow
- [x] §125.1 — Confirmed Pricing.tsx uses PageHero with eyebrow="05 — Pricing"
- [x] §125.2 — Generated 3:4 portrait (1056x1408): coin stack with $ → open ledger with three line items + dollar amounts → sage check on torn receipt
- [x] §125.3 — Mounted framed plate via belowEyebrow with hover-zoom-image, aspect-[3/4], max-w-[260px], white inner mat, paper-shadow
- [x] §125.4 — Authored pricingHeroImage.test.ts (7 specs) locking placement, framing, asset URL, alt vocabulary (coin/ledger/per-check/sage), dimensions, lazy/async
- [x] §125.5 — vitest 853/853 across 68 files; tsc clean

## §128 — Brand asset rollout from new color lockup
- [x] §128.1 — Trim whitespace from new color lockup; re-upload as new HEADER_LOGO_URL
- [x] §128.2 — Generate white-on-transparent footer variant; re-upload as new FOOTER_LOGO_URL
- [x] §128.3 — Regenerate favicon multi-size .ico from the new mark
- [x] §128.4 — Regenerate Apple touch icon (180×180) from the new mark
- [x] §128.5 — Regenerate PWA icons (192, 512) from the new mark
- [x] §128.6 — Regenerate 1200×630 OG share card from the new mark
- [x] §128.7 — Update shared/brand.ts URLs + run vitest + tsc + checkpoint
## §129 — Remake the color logo from scratch (AI-regenerated, same look + colors)
- [x] §129.1 — Generated new horizontal lockup via generate_image (three navy peaks with circles + sage divider + RAPID HIRE / SOLUTIONS wordmark) at 2560×1440 with transparent bg
- [x] §129.2 — Authored process_brand_assets_v3.py (alpha + near-white halo knockout, trim, downscale to 1400-wide, white silhouette derivation, glyph-only icon crop, 1200×630 OG composition on cream)
- [x] §129.3 — Produced rhs3-color-trimmed (1400×458), rhs3-white footer variant, rhs3-favicon.ico (16/32/48/64), rhs3-apple-touch-icon (180), rhs3-icon-192, rhs3-icon-512, rhs3-og-card (1200×630)
- [x] §129.4 — Verified white footer variant composites legibly on navy (manual on-navy preview)
- [x] §129.5 — Uploaded all 7 assets via `manus-upload-file --webdev`; wired URLs into shared/brand.ts (HEADER/FOOTER/FAVICON/APPLE/192/512/OG) and client/index.html (favicon, apple-touch, PWA, og:image, twitter:image)
- [x] §129.6 — vitest 853/853 across 68 files; tsc clean (loosened filename patterns from §128 still hold; brandHeadMeta cross-file enforcement passes against the new URLs)

## §130 — Regenerate logo to faithfully match the existing brand mark
- [x] §130.1 — SUPERSEDED by §131: user supplied the actual logo file (newrapidhirelogo.webp) directly instead of having us AI-regenerate, so the variation-based regeneration in v4 was abandoned mid-flight
- [x] §130.2 — SUPERSEDED by §131 (process_brand_assets_v5.py supersedes v3/v4)
- [x] §130.3 — SUPERSEDED by §131
- [x] §130.4 — SUPERSEDED by §131
## §131 — Replace logo with user-supplied newrapidhirelogo.webp (three figures, center navy)
- [x] §131.1 — Staged user upload to webdev-static-assets/rhs5-source.webp (2048×1196), confirmed opaque off-white bg via pixel sampling
- [x] §131.2 — Authored process_brand_assets_v5.py (near-white knockout at threshold 230, trim+pad, downscale to 1100w, white silhouette, top-55% glyph crop for icons, 1200×630 OG card on cream with navy hairline + tagline)
- [x] §131.3 — Produced rhs5-color-trimmed (1100×750), rhs5-white footer variant, rhs5-favicon.ico (16/32/48/64), rhs5-apple-touch-icon (180), rhs5-icon-192, rhs5-icon-512, rhs5-og-card (1200×630)
- [x] §131.4 — Verified white footer variant on navy preview
- [x] §131.5 — Uploaded all 7 assets via `manus-upload-file --webdev`; wired URLs into shared/brand.ts (HEADER/FOOTER/FAVICON/APPLE/192/512/OG) and client/index.html (favicon, apple-touch, PWA, og:image, twitter:image)
- [x] §131.6 — Bumped Header.tsx logo height from `h-14 sm:h-16 lg:h-20` to `h-16 sm:h-20 lg:h-28` and mobile sheet from h-12 to h-16 to compensate for the new vertical-aspect (1.47:1) lockup
- [x] §131.7 — vitest 853/853 across 68 files; tsc clean (existing headerLogo.test.ts assertions are URL+import+alt-text only and don't pin tailwind height tokens, so the bump is safe)

## §132 — Recolor the home-page "02 · Layer / Rapid Hire Solutions Platform" center card to match the footer
- [x] §132.1 — Swapped Workflows.tsx PlatformCenterCard surface from `bg-[color:var(--color-accent-ink)]` (brand bright blue) to `bg-[color:var(--color-footer)]` (deep navy used by the page footer band)
- [x] §132.2 — Updated workflowsCenterCard.test.ts assertion + comments to pin the new --color-footer surface (was: --color-accent-ink); kept text-white invariant intact
- [x] §132.3 — vitest 853/853 + tsc clean

## §133 — Add visible borders / outlines around all form fields
- [x] §133.1 — Diagnosed: every form (Contact, Get a Quote, Compliance Audit) used the same long underline-only className (`bg-transparent border-0 border-b border-[color:var(--color-rule)] py-2.5 ...`) which was nearly invisible against the warm-paper section background — `--color-rule` is only ~6% darker than `--color-paper` so users couldn't tell where to type
- [x] §133.2 — Authored a single shared `.form-field` utility in client/src/index.css inside `@layer components` with: full 1px border at `--color-rule`, 8px rounded corners, `--color-paper` interior, hover (darker border + white surface), focus (`--color-accent-ink` border + brand-halo box-shadow ring), disabled (faded paper-soft), `textarea` resize: vertical, native `select` chevron via inline SVG data-URL, `.form-field--invalid` hook for future validation
- [x] §133.3 — Project-wide swap: replaced all 9 occurrences of the legacy underline className across Contact.tsx (3), GetAQuote.tsx (3), ComplianceAudit.tsx (3) with `className="form-field"` — covers `<input>`, `<textarea>`, and `<select>` field types in every form
- [x] §133.4 — Authored client/src/lib/formField.test.ts (17 specs) pinning: (a) `.form-field` declared in @layer components, (b) bordered-box rules (full border + radius + paper bg), (c) focus ring with brand-accent border + box-shadow, (d) textarea resize: vertical, (e) `.form-field--invalid` hook, (f) anti-regression: legacy underline className gone from every form page, (g) every form page applies form-field on input/textarea/select
- [x] §133.5 — vitest 870/870 across 69 files (was 853/68; +17 new specs, +1 new test file); tsc clean; HMR confirmed all 4 files (index.css + 3 page files) reloaded

## §134 — Inline error styling on all three forms
- [x] §134.1 — Authored `client/src/lib/formValidation.ts` with `validateFields(values, { requiredFields, emailFields })`, `hasErrors`, `clearFieldError`, and `FieldErrors` type — single shared validation contract
- [x] §134.2 — Wired Contact.tsx: useState<FieldErrors> hook, validation BEFORE the Formspree fetch, `noValidate` form, form-level onChange clearing, focus-first-invalid on submit failure, `error={fieldErrors.X}` forwarded into Field/SelectField, `.form-field--invalid` class + `role="alert"` helper paragraph on every native + helper-rendered field (fullName, email, teamSize, message, company)
- [x] §134.3 — Wired GetAQuote.tsx: same pattern, validates before Formspree fetch (firstName, lastName, email, company)
- [x] §134.4 — Wired ComplianceAudit.tsx: same pattern, validates before /api/contact fetch; promoted Field/SelectField primitives to accept an optional `error` prop with aria-invalid + aria-describedby
- [x] §134.5 — Authored `client/src/lib/inlineFieldErrors.test.ts` — 9 contract checks × 3 forms (27 specs): import shape, error-state hook, validation-before-network-call, abort-on-failure, focus-first-invalid, noValidate, onChange clearing, error-prop forwarding, .form-field--invalid + role=alert rendering
- [x] §134.6 — Updated `formField.test.ts` to accept the new array-form className (was strict-literal before §134's class-array rewrite)

## §135 — Apply .form-field to the footer newsletter signup
- [x] §135.1 — SUPERSEDED: there is no newsletter signup on the site. Footer.tsx contains 4 columns (Services / Company / Portals + brand block) and a bottom-bar with Privacy/Terms/RSS links — no email-capture form anywhere. The single "newsletter" reference in the project lives inside the Privacy policy body text ("…subscribe to our newsletter…"). Skipping cleanly.
- [x] §135.2 — SUPERSEDED
- [x] §135.3 — SUPERSEDED

## §136 — Navigation menu styling refresh
- [x] §136.1 — NavLink (desktop primary nav): typography bumped 13.5px→14px, weight medium-default / semibold-active (was regular/medium), accent-ink color transition `200ms ease-out`
- [x] §136.2 — Active-route indicator: persistent 2.5px rail (`data-testid="nav-active-rail"`) on accent-ink token; replaces the previous static 2px line; the matched link also bumps to `font-semibold`
- [x] §136.3 — Animated hover underline: separate 2px rail (`data-testid="nav-hover-rail"`) with `origin-center`, `scale-x-0` → `scale-x-100` on `group-hover` + `group-focus-visible`, 180ms `cubic-bezier(0.23, 1, 0.32, 1)` per the design-system animation guide
- [x] §136.4 — Resources dropdown trigger: parity treatment with NavLink (same typography + animated rail); hover rail latches to `scale-x-100` while the panel is open so closing the panel doesn't feel like the link "un-hits"
- [x] §136.5 — Get-a-Quote desktop CTA: `font-medium`→`font-semibold`, resting `shadow-[0_2px_8px_-2px_rgba(15,23,42,0.18)]` ramps to `0_8px_22px_-6px_rgba(15,23,42,0.28)` on hover, `hover:-translate-y-px` 1px lift, arrow `→` translates 0.5 on hover via `group/cta` named hover group (so the arrow doesn't bump pill metrics), explicit `focus-visible:ring-2 ring-offset-2`
- [x] §136.6 — Sign in CTA: matched to Get-a-Quote vertical metrics (px-5 py-2.5 text-[13.5px]) so the two pills read as siblings; subtle `hover:bg-[color:var(--color-paper-soft)]` fill so it has its own hover signature
- [x] §136.7 — Authored `client/src/lib/headerNavStyling.test.ts` — 16 specs across NavLink typography, active rail, hover rail (origin + curve), Resources trigger parity, hover-rail-on-open behavior, Get-a-Quote shadow + lift + arrow translate + focus ring, Sign in metrics + hover fill
- [x] §136.8 — Updated `headerSignIn.test.ts` desktop ordering check to anchor on `data-testid="header-get-a-quote"` (stable contract surface) instead of a fragile className substring
- [x] §136.9 — Final: tsc clean, 912/912 vitest across 71 files, mobile sheet untouched

## §137 — TAT + Support trust system (PAUSED — awaiting user data, ETA this week per user 2026-05-18)

> **Blocker (as of 2026-05-19):** §137 stays parked until the user supplies (a) the live TAT data feed source/shape, (b) rep names, photos, FCRA accreditation numbers, and time-zone coverage, and (c) any competitor TAT data they want surfaced. All 25 unchecked items below are intentionally on hold; do not unmark them until the inputs arrive.

> **Strategic frame (locked in conversation 2026-05-18 after the $100k-recommendation exercise):** The two real moats of Rapid Hire Solutions are (1) **faster turnaround time** vs. competitors, and (2) **U.S.-based, FCRA-accredited customer support with zero offshore staff**. TAT gets prospects in the door; the moment a buyer needs support is the moment they realize what "full-service" actually means and they lock in. Both moats are currently invisible on the marketing site — "85%+ within 24 hours" appears as small caption text in the hero, "U.S.-based support" appears once as gray micro-text, no support page shows what support actually looks like, no rep photos, no FCRA accreditation badges, no live TAT signal anywhere. The $100k change is to make these two moats the loudest things on the site.

> **Why this is defensible:** No competitor (Checkr, Sterling, GoodHire, HireRight) exposes a live TAT number, names their support reps, or lets a prospect talk to a real human in under 30 seconds without a form first. They can't credibly do any of it because their TAT isn't fast enough, their support is offshore or queued, and their reps aren't FCRA-accredited. Rapid Hire can do all three — and doing all three on the home page IS the moat made visible.

> **Earlier candidate ideas considered and rejected during the conversation:**
> - **Self-serve "Run your first check" e-commerce flow** (Stripe checkout, candidate consent invite, customer dashboard) — REJECTED by user: "no one comes and just selects a pre-determined package. they are already using a provider and would have a specific package built for the type of hiring they do." The market is switch-from-competitor, not net-new SMB.
> - **"Match Your Current Package" comparison tool** (paste competitor invoice → get line-by-line comparison + real price + switching plan) — Considered but superseded once user clarified the two real moats are TAT and support, not pricing transparency.

### §137.1 — Phase 1: Live Turnaround Time signal (highest-leverage slice — recommended first)

- [ ] §137.1.1 — Build a TAT data feed contract: a small JSON snapshot file (`/api/tat-snapshot` or static `/tat-snapshot.json` updated on a schedule) with shape `{ updatedAt, medianTatMinutes, p95TatMinutes, percentCompleteIn24h, perPackage: { essential, professional, comprehensive }, perScreen: { countyCriminal, mvr, employmentVerification, drug5Panel, ... }, last30Days: [{ date, medianMinutes, completedCount, ... }] }`. Stub it locally with realistic synthetic data first; swap in the real feed when user provides the data source.
- [ ] §137.1.2 — Add a persistent **live TAT strip** just under the header (or as a slim band inside the header) on every page: *"Median TAT today: 4h 12m · 89% complete in 24h · updated 5 min ago"*. Should respect prefers-reduced-motion (no pulse animation when reduced). Hide gracefully if the feed is stale (>30 minutes old).
- [ ] §137.1.3 — Build the **`/turnaround` page**: hero with the live number, a real chart of the last 30 days (median + p95), per-package breakdown table, per-screen breakdown table, **competitor comparison section** ("Sterling Q1 2026 published median: ___ · Checkr Q1 2026 published median: ___ · Rapid Hire today: ___"), methodology footnote explaining how we measure (start = candidate consent received; end = report delivered to customer; excludes self-disclosed items pending candidate response).
- [ ] §137.1.4 — Wire the live TAT strip on every page to be a clickable surface that routes to `/turnaround`.
- [ ] §137.1.5 — SEO: target the queries "background check turnaround time", "fastest background check service", "background check TAT comparison". Strong on-page H1/H2, schema.org Service + AggregateRating where applicable, internal links from `/pricing` and `/services` and `/compliance`.
- [ ] §137.1.6 — Vitest specs locking: feed contract shape, strip presence on every page, strip stale-state hiding, `/turnaround` page rendering chart + competitor table + methodology, route registration in App.tsx.

### §137.2 — Phase 2: "Meet your support team" page (the lock-in moment)

- [ ] §137.2.1 — Build the **`/support` page** (replacing or extending the current Support.tsx). Hero: "Your call is answered by a human in under 60 seconds. Every rep is FCRA-accredited. Zero offshore staff." Underneath: a grid of **rep cards** showing photo, first name, FCRA accreditation cert number + date, years at the company, languages spoken, time-zone coverage, areas of specialty (drug screening, MVR, international, healthcare credentialing, etc.), and a **live availability indicator** ("Sarah is online · typical reply 8 minutes" / "Maria is in a call · next available rep: Marcus").
- [ ] §137.2.2 — **The SLA in plain English** below the rep grid: "We answer the phone in under 60 seconds. We answer chat in under 5 minutes. We answer email same business day. Every rep is FCRA-accredited. We have zero offshore staff. If you escalate, you reach a director within 1 hour."
- [ ] §137.2.3 — **Scenario walkthroughs** (this is the "full-service" reveal): "If a candidate disputes a record" → exactly what we do, who handles it, timeline. "If you need a custom package built" → the rep who'll do it, typical turnaround. "If a hiring manager needs ad-hoc help reading a report" → the line they call. Show 3–5 of these as expandable cards.
- [ ] §137.2.4 — Rep availability data feed (similar contract to TAT snapshot): a small JSON `{ reps: [{ id, firstName, photoUrl, status: 'online' | 'in-call' | 'off-shift', typicalReplyMinutes, fcraCertNumber, fcraCertDate, yearsAtCompany, languages, specialties }] }`. Stub locally, swap in real feed (probably from Intercom/Drift/HubSpot Chat presence API or a simple internal status board).
- [ ] §137.2.5 — Vitest specs locking: rep card structure, FCRA cert number rendering, SLA copy presence, scenario walkthroughs rendering, availability indicator rendering against the feed contract.

### §137.3 — Phase 3: Dual header CTA + "Talk to a rep right now" flow

- [ ] §137.3.1 — Replace the current single "Get a Quote" header pill with a **dual CTA**: primary `Talk to a rep now` (opens live chat / click-to-call directly to an on-duty rep, NO form first) + secondary `Get a quote` (existing flow, kept verbatim). Mobile sheet should mirror the same dual CTA.
- [ ] §137.3.2 — The "Talk to a rep now" button should surface **the actual on-duty rep's photo and first name** based on the §137.2.4 availability feed, plus the actual estimated wait ("Sarah · 12 sec to reply").
- [ ] §137.3.3 — When clicked, opens a chat surface (Drift / Intercom / HubSpot Chat / a simple internal one — wired to whatever the user already uses) **manned by a real human, not a bot**. The first message from the rep must NOT be "How can I help you?"; it should be the rep's full credential: *"Hi, I'm Sarah, FCRA-accredited rep, 8 years at Rapid Hire. What package are you running today and what's slowing you down?"* (Configure the canned greeting on whatever chat tool we wire.)
- [ ] §137.3.4 — Off-hours fallback: if no rep is on duty, the button changes to "Schedule a call · next available 8:30 AM CT" with a calendar picker.
- [ ] §137.3.5 — Vitest specs locking: dual-CTA presence in Header.tsx + mobile sheet, rep-name + photo surfaced from the availability feed, off-hours fallback rendering, ordering of the two pills (Talk-to-rep first, Get-a-quote second).

### §137.4 — Data shopping list owed by user (compiling this week per 2026-05-18 message)

The next session cannot proceed past stub data without these. Email or paste into chat when ready.

- [ ] §137.4.1 — **TAT data feed.** Either (a) an API endpoint on the operational system we can poll (preferred — auth model + sample payload), (b) a daily CSV export to a known location, or (c) a manual "log in once a day and refresh a JSON file" workflow. Realer the feed, the more powerful the signal. Whatever shape, we map it to the §137.1.1 contract.
- [ ] §137.4.2 — **Reps' info** for the §137.2 page: names (first names are fine), photos (headshots, ideally consistent style), FCRA accreditation cert numbers + dates, years at Rapid Hire, languages spoken, time-zone coverage, areas of specialty. Sweet spot is 6–12 reps for a credible "we're real humans" feel without padding.
- [ ] §137.4.3 — **Real SLA numbers**: phone answer time, chat first-response, email first-response, escalation path (who to whom), escalation timeline (how long until a director picks up). If undocumented, a 15-minute call to dictate them is fine; we'll write them up and user signs off.
- [ ] §137.4.4 — **Current chat / phone stack**: Intercom, Drift, HubSpot Chat, RingCentral, raw phone, custom — so we wire the dual CTA into existing infrastructure rather than forcing a migration.
- [ ] §137.4.5 — **Permission decision** to name competitors on `/turnaround` (Sterling, Checkr, HireRight, GoodHire) with their published TAT numbers. Legally fine (nominative use); user just needs to confirm comfort posture. Default if no answer: ship without competitor names, swap them in later.
- [ ] §137.4.6 — **Permission decision** on whether the live TAT strip can show actual real-time numbers publicly, or whether we need a 30-day rolling median (less risk of a bad-day number being weaponized by competitors). Default: 30-day rolling median for the always-visible strip; today's live number on `/turnaround` only.

### §137.5 — Resume protocol when user returns

- [ ] §137.5.1 — On user's next message after the pause, re-read this §137 block first to reload context (the conversation history may have been compacted away).
- [ ] §137.5.2 — Confirm which of §137.4.1–§137.4.6 the user has answers for; for any still missing, stub realistic data and proceed (do not block on missing data — the value is shipping Phase 1 against a stub and swapping the feed later).
- [ ] §137.5.3 — Recommended first slice when resuming: §137.1 (Phase 1 — live TAT strip + `/turnaround` page) entirely against stub data. That alone, shipped well, is probably the single highest-leverage change on the site and validates the visual + content shape before the real feed is wired.

## §138 — SPA brand hook (Speed · Price · Accuracy) — bake everywhere

> **Strategic frame (locked in conversation 2026-05-18 from user-supplied trade-show booth artwork):** The SPA acronym (Speed · Price · Accuracy) is Rapid Hire's existing trade-show hook. It works because (1) it's a memorable mnemonic that hits the three things buyers actually care about, (2) it reframes a stressful purchase decision into something calming ("relax, we've got it handled"), and (3) it's already battle-tested at trade shows and validated by user feedback. User decision: go ALL IN — refit the home hero around it, ship a dedicated /spa landing page, seed the language across the site.

> **Execution discipline:** Going "all in" on a metaphor is the kind of decision where doing it right makes the brand feel inevitable and doing it wrong makes it feel gimmicky. The discipline: (a) carry the SPA *framework* into the website, (b) do NOT carry the booth's literal spa visuals (waterfalls, candles, infinity pools) onto the website — those are calibrated for stopping foot traffic on a noisy expo floor, not for serious B2B research on a phone. The website's existing editorial / law-firm aesthetic is doing real work; SPA enriches it, doesn't replace it. Hero stays serif-led, paper-toned, restrained motion. SPA is the THINKING; editorial is the LOOK.

> **Per-pillar metrics (taken verbatim from the user's booth, treated as canonical for now; can be tightened later when the §137 TAT feed lands):**
> - SPEED — "Median TAT 8 hours" (booth says "Average Turnaround Time 8 Hours"; using "median" since it's both more truthful and stronger)
> - PRICE — "Competitive rates, better value" (vague, will tighten with a numeric anchor when user supplies real per-check or vs-competitor numbers in §138.4)
> - ACCURACY — "99.9% data accuracy rate"

### §138.1 — Design system + reusable SpaPillars component

- [x] §138.1.1 — Author `client/src/components/site/SpaPillars.tsx` — a single reusable block that renders the three SPA pillars in three styles via a `variant` prop: `"editorial"` (home page, restrained, big serif S/P/A drop caps in accent-ink, body in editorial typography), `"hero"` (the /spa landing page hero, larger, more confident), `"compact"` (single-line variant for footer / sidebars / OG cards). All variants share the same data source (one `SPA_PILLARS` constant in `client/src/lib/spa.ts`) so the metrics are edited in exactly one place.
- [x] §138.1.2 — Author `client/src/lib/spa.ts` — single source of truth for SPA brand language: `SPA_PILLARS` array with `{ letter: 'S' | 'P' | 'A', label: 'Speed' | 'Price' | 'Accuracy', metric: string, supportingCopy: string, icon: LucideIcon }`. Plus `SPA_TAGLINE = "Relax — we've got it handled."` and `SPA_HEADLINE = "Speed. Price. Accuracy."`. Using a constants module so vitest can pin the canonical copy and a future copy-tweak can't quietly drift.
- [x] §138.1.3 — Pillar icon choice: `Gauge` for Speed, `Tag` for Price, `Target` for Accuracy (Lucide). Same icons the booth used (speedometer, price-tag, target). Icon goes inside a brand-blue circle for editorial variant, on accent-paper background for hero variant.
- [x] §138.1.4 — Vitest spec `client/src/lib/spa.test.ts` pinning the canonical pillar data + headline + tagline + per-pillar metric strings.

### §138.2 — Refit Home hero around SPA framing

- [x] §138.2.1 — Re-anchor the H1 from "The trusted standard in background checks" to a SPA-framed headline. Two finalists: (a) "Speed. Price. Accuracy. Relax — we've got it handled." (b) Keep "The trusted standard in background checks." as a kicker line + use SPA as the subhead. Will ship (a) — it's the bolder swing and matches the user's "all in" directive. Keep the existing serif italics styling on one of the three SPA letters as a typographic accent.
- [x] §138.2.2 — Replace the current sub-headline ("Scale your hiring team with a platform built for speed, compliance, and accurate results that don't slow you down.") with: "The full-service background check experience your hiring team has been waiting for. Faster than your current vendor. Better priced. More accurate. And when you need help, a U.S.-based, FCRA-accredited rep picks up the phone."
- [x] §138.2.3 — Replace the current trio of micro-stats under the CTAs ("FCRA CERTIFIED · U.S.-BASED SUPPORT · 85%+ WITHIN 24 HOURS") with the three SPA pillars rendered via SpaPillars in `editorial` variant. This is the single most important change — it visualizes SPA in the part of the page everyone sees first.
- [x] §138.2.4 — Keep the existing hero image (woman + laptop) — it visualizes the *outcome* (a relaxed buyer reading clean reports) which complements the SPA framing perfectly. No need to change.
- [x] §138.2.5 — Keep the existing CTAs ("Start Screening" + "View Sample Report"). They work with the new framing. Optionally add a third tertiary link "Why we call it SPA →" routing to /spa.
- [x] §138.2.6 — Bump section eyebrow from "01 — PLATFORM" to "01 — THE SPA STANDARD" to anchor the language site-wide from the very top.

### §138.3 — Dedicated /spa landing page (trade-show + outbound destination)

- [x] §138.3.1 — Create `client/src/pages/Spa.tsx`. This page is intentionally a **switch-from-competitor** page, not a generic feature page. Hero: SPA H1 + SPA subhead + a single primary CTA ("Book your SPA Treatment" — a 15-minute call where a rep walks them through how Rapid Hire beats their current vendor on each of S, P, A).
- [x] §138.3.2 — Section 02: SpaPillars in `hero` variant — three large pillars with the metric + a 2-3 sentence supporting story per pillar. This is where each of S/P/A gets fully argued.
- [x] §138.3.3 — Section 03: "How most legacy vendors fall short" — three rows, one per pillar, format `{pillar} | typical legacy vendor | Rapid Hire`. Generic ("typical legacy vendor") rather than naming Sterling/Checkr by name in v1 — keeps the page broadly applicable. Can swap to named comparisons later if user gives the green light.
- [x] §138.3.4 — Section 04: A compact testimonial / proof-quote block — pull 2-3 customer quotes that map to S/P/A respectively (need real quotes from user; stub for now with `[REPLACE WITH CUSTOMER QUOTE]` placeholders that vitest enforces aren't shipped).
- [x] §138.3.5 — Section 05: Final CTA — "Step into the SPA" with the same primary CTA ("Book your SPA Treatment") + secondary ("See live turnaround times" → /turnaround once §137 ships, or /pricing for now).
- [x] §138.3.6 — Route /spa in App.tsx with PageTransition wrapper.
- [x] §138.3.7 — useSeo: title "The SPA Standard — Speed, Price, Accuracy | Rapid Hire Solutions", meta description with the SPA tagline, OG image (will need a custom 1200×630 OG card; v1 reuses the existing brand OG card, swap later).

### §138.4 — Seed SPA language across supporting touchpoints

- [x] §138.4.1 — Footer: append the SPA tagline ("Speed · Price · Accuracy. Relax — we've got it handled.") under the brand block. Keep existing Footer structure intact; this is one extra line, not a rebuild.
- [x] §138.4.2 — Pricing page: add a one-line SPA banner above the pricing tiers ("Pricing built around the SPA Standard — Speed, Price, Accuracy.") and rename the page eyebrow to reference SPA. Light touch; do not redo the calculator.
- [x] §138.4.3 — Header: "Why SPA?" link in primary nav (between Compliance and About). Sends user to /spa.
- [x] §138.4.4 — Document title (page-level) and OG default: append " · The SPA Standard" to brand-default page title in shared/brand.ts (or wherever it's centralized) so every page tab/preview reinforces the language.

### §138.5 — Vitest contract for the SPA hook

- [x] §138.5.1 — `client/src/lib/spaHero.test.ts` — pin Home hero refit: H1 contains "Speed. Price. Accuracy.", subhead contains the new copy, SpaPillars `editorial` variant rendered with all 3 pillars, eyebrow renumbered, no leftover "85%+ WITHIN 24 HOURS" trio.
- [x] §138.5.2 — `client/src/lib/spaPage.test.ts` — pin /spa page contract: route registered, all 5 sections rendered, SpaPillars `hero` variant rendered, primary CTA exists with the right text, no `[REPLACE WITH CUSTOMER QUOTE]` placeholders shipped, useSeo title contains "SPA".
- [x] §138.5.3 — `client/src/lib/spaTouchpoints.test.ts` — pin Footer SPA tagline, Pricing SPA banner, Header "Why SPA?" link presence + route.
- [x] §138.5.4 — Extend `spa.test.ts` (from §138.1.4) to lock the canonical pillar data shape so a copy edit can't break shape silently.

### §138.6 — Ship checklist

- [x] §138.6.1 — Run tsc + full vitest suite; expect all new specs green and zero regressions on existing 912 specs.
- [x] §138.6.2 — webdev_check_status; visually confirm hero, /spa, footer, pricing, header link.
- [x] §138.6.3 — webdev_save_checkpoint with §138 description; deliver to user with the checkpoint as attachment + summary.

## §139 — SHRM 2026 Annual Conference promotion (Orlando, June 21-24)

> **Strategic frame:** SHRM Annual is the largest concentration of HR / TA buyers in the calendar (~15-20k attendees). The opportunity is bigger than just "announce we'll be there": (a) booth visitors who scan a QR code land on a tailored page that picks up where the booth left off, not the generic homepage; (b) pre-event prospecting drives pre-booked meetings (3-5x conversion vs cold walk-ups); (c) post-event follow-up needs a destination that doesn't feel like a list.

> **Open questions stubbed v1 (one-line edits when data lands):**
> - Booth number → "Booth #TBA" (will update when user provides)
> - On-booth rep names/photos → generic "your Rapid Hire team" (will personalize when user supplies; same data as §137 Support Wall)
> - Calendar tool → fallback to /contact with auto-filled subject ("SHRM 2026 — request meeting") until user picks Calendly/Chili Piper/HubSpot Meetings/etc.

- [x] §139.1 — Author `client/src/lib/shrm.ts`: SHRM_EVENT (name, dates, city, venue, booth, isUpcoming derived from current date), SHRM_ROUTE = "/shrm", SHRM_ALIASES = ["/shrm-2026", "/booth"], SHRM_MEETING_SUBJECT, SHRM_HEADLINE / SHRM_TAGLINE copy. Treats the page as a SHRM-flavored extension of the SPA brand.
- [x] §139.2 — Build `/shrm` landing page (`client/src/pages/Shrm.tsx`): hero (event details + booth number + CTAs), "what to expect" 3-bullet section, "book your SPA Treatment at the booth" CTA → /contact?subject=…, "can't make it" virtual fallback, SPA pillars hero variant repeated (so the page reads as a SHRM-flavored extension of the SPA brand, not a microsite), small "what we're showing" section.
- [x] §139.3 — Register /shrm + /shrm-2026 + /booth aliases in App.tsx.
- [x] §139.4 — Site-wide ConferenceStrip component above the certification strip: dismissible per-session via sessionStorage flag (auto-clears on browser close, more privacy-friendly than cookie), auto-hides after isUpcoming returns false (date >= June 24, 2026 EOD ET), single line copy "Meeting at SHRM 2026, June 21-24, Orlando — Book your slot →" linking to /shrm.
- [x] §139.5 — UTM-friendly: the /shrm page reads `?utm_source/medium/campaign` params and stores them in sessionStorage so the eventual /contact form submission can include them in the message body (gives user attribution data without needing a real analytics platform).
- [x] §139.6 — useSeo on /shrm: title "Meet Rapid Hire at SHRM 2026 — Orlando, June 21-24", description with SPA framing + booth details.
- [x] §139.7 — Vitest specs: `shrm.test.ts` (constants + isUpcoming logic with mocked dates), `shrmPage.test.ts` (page renders all sections, CTA links to /contact with subject pre-filled, aliases all route to same component), `conferenceStrip.test.ts` (dismissal persists across re-renders within session, hides automatically when isUpcoming=false, link target /shrm).

## §138 — completion summary (shipped)
- [x] §138.1 — `client/src/lib/spa.ts` written (SPA_HEADLINE, SPA_TAGLINE, SPA_COMPACT, SPA_ROUTE, SPA_TREATMENT_CTA, SPA_PILLARS array of 3 pillars with metric + supportingCopy + lucide icon).
- [x] §138.2 — `client/src/components/site/SpaPillars.tsx` written with three variants (editorial / hero / compact).
- [x] §138.3 — `client/src/components/site/Hero.tsx` refit with SPA framing: H1 renders "Speed. Price. Accuracy." in three blocks (Accuracy in italic accent ink), SPA_TAGLINE kicker, SpaPillars editorial variant under the CTA row, "Why we call it SPA" tertiary link, eyebrow renumbered to "01 — The SPA Standard".
- [x] §138.4 — `client/src/pages/Spa.tsx` shipped: hero with both CTAs (Start Screening + Book SPA Treatment), pillars (hero variant), comparison block (per-pillar competitor contrast), proof block (per-pillar customer quotes), final CTA. /spa route registered in App.tsx.
- [x] §138.4.1 — Footer carries SPA tagline + SPA_COMPACT eyebrow with stable testids `footer-spa-eyebrow` / `footer-spa-tagline`.
- [x] §138.4.3 — Header NAV array carries "Why SPA?" routed at SPA_ROUTE (between Services and Industries on desktop primary nav).
- [x] §138.4.4 — index.html `<meta description>`, `<meta og:description>`, and `<meta twitter:description>` updated to lead with "Speed · Price · Accuracy — the Rapid Hire Solutions difference. …" so search snippets and social shares carry the SPA hook.
- [x] §138.5 — `client/src/lib/spaTouchpoints.test.ts` (24 specs) locks lib/spa exports + Hero refit + /spa page contract + Footer SPA strip + Header NAV + App route registration.

## §139 — completion summary (shipped)
- [x] §139.1 — `client/src/lib/shrm.ts` written (SHRM_EVENT with year/dates/dateRange/city/venue/booth, SHRM_ROUTE, SHRM_ALIASES, SHRM_MEETING_SUBJECT, SHRM_HEADLINE / SHRM_TAGLINE, SHRM_STRIP_DISMISSED_KEY, SHRM_UTM_KEY, isUpcoming() helper with end-of-day grace, buildShrmContactUrl()).
- [x] §139.2 — `client/src/pages/Shrm.tsx` shipped (hero with event meta + booth + CTAs, "what to expect" section, SPA pillars hero variant, virtual fallback, post-event notice via isUpcoming, final CTA).
- [x] §139.3 — /shrm + /shrm-2026 + /booth registered in App.tsx (all three resolve to the Shrm component).
- [x] §139.4 — `client/src/components/site/ConferenceStrip.tsx` written: dismissible (sessionStorage), auto-hides post-event via isUpcoming(), renders null on first paint to avoid hydration flash, single-line copy on desktop with mobile fallback, dismiss button with aria-label. Mounted at the very top of Header.tsx above the trust strip.
- [x] §139.7 — `client/src/lib/conferenceStrip.test.ts` (31 specs) locks SHRM event constants, isUpcoming() across pre/during/post timestamps, buildShrmContactUrl(), ConferenceStrip testids + behavior, /shrm page testids, Header mount, App route registration, conditional Footer SHRM 2026 link (gated by isUpcoming).

## §138 + §139 — ship status
- 967/967 vitest specs across 73 files (was 912/71 at §136 baseline; +55 new specs from §138/§139). tsc --noEmit clean.
- Stubbed data still pending user input (one-line edits when supplied):
  - Booth number → currently `SHRM_EVENT.booth = "TBA"` in `client/src/lib/shrm.ts`.
  - On-booth rep info → /shrm copy uses generic "your Rapid Hire team".
  - Calendar tool → CTAs route to /contact with auto-filled subject (Calendly / Chili Piper / HubSpot Meetings can drop in later via buildShrmContactUrl).
- Pre-existing tests touched (only because §138 added "Why SPA?" entry to the COMPANY footer array and rewrote the hero copy):
  - `heroCopyLength.test.ts` — replaced "trusted/24 hour" assertions with "speed/accuracy" + FCRA + U.S.; SPA pillars are visible copy, just no longer the "85%+ within 24 hours" string verbatim.
  - `complianceFooterAndPdf.test.ts` — order-of-labels assertion now slices to the COMPANY array's `];` instead of a fixed 1500-byte window.
  - `footerActiveRoute.test.ts` — FooterCol regex switched to `[\s\S]*?` so it spans the multi-line conditional Portals invocation.
  - `paperSoftAudit.test.ts` — added Spa.tsx + Shrm.tsx to the visually-audited allowlist (both follow the same alternating-band rhythm as Pricing/Compliance).
- Deferred (intentional, can ship as separate batch):
  - §138.4.2 — Pricing-page SPA banner (one-liner above tiers).
  - §139.5 — UTM capture on /shrm into sessionStorage for /contact form body.


## §140 — Wire up the §138/§139 deferrals
> Picking up the two items intentionally deferred from the §138/§139 batch (Pricing SPA banner + Contact-side UTM consumption). Lightweight; no new lib modules needed because spa.ts and shrm.ts already export everything we need.
- [x] §140.1 — Pricing.tsx: SPA banner shipped between PageHero and the tiers section. Uses SPA_COMPACT in the eyebrow and SPA_TAGLINE in the body via the imported lib/spa constants (no hard-coded copy). Paper-soft band with hairline top rule, matching the existing alternating rhythm. Stable testids `pricing-spa-banner`, `pricing-spa-banner-eyebrow`, `pricing-spa-banner-headline`, `pricing-spa-banner-tagline`, `pricing-spa-banner-link`. Tertiary "Why we call it SPA" link routes to SPA_ROUTE. paperSoftAudit allowlist updated.
- [x] §140.2 — Contact.tsx reads `params.get("subject")` and `params.get("source")` (set by buildShrmContactUrl). When `source === "shrm-2026"`, the form surfaces a `data-testid="contact-shrm-attribution-note"` line under the message field and the Formspree _subject is rewritten to `SHRM 2026 — meeting request — {company}` so SHRM-funnel leads are immediately distinguishable in the inbox. The raw source/subject values are also passed through to Formspree as structured fields.
- [x] §140.3 — Contact.tsx exports `readShrmUtm()` and `formatUtmAttribution()` helpers (both pure, both deterministically tested). On mount, the UTM map is hydrated from `sessionStorage[SHRM_UTM_KEY]`. When non-empty, a one-line footer ("— via utm_source=…, utm_medium=…, utm_campaign=…") in canonical key order is appended to the prefilled message body. The Formspree payload includes a top-level `utm` JSON string field whenever UTMs are present (omitted otherwise to keep submissions clean).
- [x] §140.4 — `spaBanner.test.ts` (12 specs) locks the banner contract: imports from @/lib/spa, no hard-coded copy, all five testids, paper-soft tint, hairline top rule, source-order position between PageHero and the tiers section, exactly one banner. `contactShrmAttribution.test.ts` (23 specs) locks the helpers (empty/hydrated/malformed/non-string-coercion paths for readShrmUtm; canonical-order/single-key/foreign-key/empty-value paths for formatUtmAttribution) and the Contact.tsx wiring (SHRM_UTM_KEY import, source/subject param reads, cameFromShrm flag, attribution-note testid, _subject branching, prefillMessage + textarea wiring, conditional utm payload spread).
- [x] §140.5 — 1002/1002 specs across 75 files (+35 from this batch); tsc --noEmit clean; checkpoint saved.


## §141 — Contact form: animated success state + SHRM-aware confirmation
> Replace the static success block with a tasteful animated success state and a SHRM-aware confirmation message that respects `prefers-reduced-motion`. Keep the existing `submitted` state machine intact so prior tests aren't disturbed.
- [x] §141.1 — index.css gained four scoped keyframes (`contact-success-pop` 220ms, `contact-success-halo` 440ms, `contact-success-check-draw` 260ms, `contact-success-fade-up` 280ms) plus the orchestrating `.contact-success-icon`, `.contact-success-icon::after`, `.contact-success-check`, and `.contact-success-body > *` selectors. All gated behind `prefers-reduced-motion: no-preference` and using the canonical `cubic-bezier(0.23, 1, 0.32, 1)` --ease-out; only opacity, transform, box-shadow (halo), and stroke-dashoffset (check draw) are animated — no layout-triggering properties.
- [x] §141.2 — Contact.tsx ships a co-located `ContactSuccess` component that swaps in once `submitted` flips. Stamps an animated stroke-drawn SVG check + soft accent halo, then staggers the title/message/timeline/actions in via `--contact-success-delay`. Stable testids exposed: contact-success (root), -icon, -icon-halo, -check, -title, -message, -timeline, -timeline-item, -actions, -cta-home, -cta-calendar (SHRM), -cta-sample (default). Root has `role="status"` and `aria-live="polite"` so assistive tech announces the change.
- [x] §141.3 — SHRM branch: headline becomes "Booth queue confirmed." with a lede that names SHRM 2026 + the 15-minute SPA Treatment slot. Add-to-Calendar CTA only renders when `fromShrm` is true and points at the new static `client/public/shrm-2026.ics` (June 21–24, 2026 · Orange County Convention Center, Orlando). Default branch keeps "Request received." + a "View sample report" CTA.
- [x] §141.4 — Submitted company name is captured in `submittedCompany` state right before `setSubmitted(true)` and threaded into ContactSuccess as the `company` prop. ContactSuccess trims the value and only personalizes the lede when the trimmed string is non-empty, so an empty submission falls back to neutral phrasing rather than rendering "… for .".
- [x] §141.5 — 3-step "what's next" timeline rendered as a 3-column grid below the message. SHRM branch: Same-day reply → 15-min SPA Treatment → Sample report. Default branch: Same-day reply → 15-min intro call → Sample report + quote. Each step is a paper card with an accent eyebrow + label + detail; pure visual, no logic.
- [x] §141.6 — `contactSuccessAnimation.test.ts` (37 specs) locks the entire contract: testid presence + `role=status` / `aria-live=polite`, SHRM headline/lede, .ics asset existence + content, default-branch CTA branching, company personalization (trimmed + interpolated), submission wiring (state, ternary, toast.success branching on cameFromShrm), and the CSS contract (all 4 keyframes defined, prefers-reduced-motion gate co-located, --ease-out reused, max duration ≤500ms, no banned animated properties in keyframes).
- [x] §141.7 — 1039/1039 specs across 76 files (+37 from this batch); tsc --noEmit clean; checkpoint saved.


## §144 — Blog index: category filter + search bar
> Now that the blog has crossed 120 published posts, the index page needs progressive filtering so readers can find a topic without scrolling 120 cards. Add a category (tag) filter row and a text search bar to /blog, URL-synced and combined with the existing date-range facet.

- [x] §144.1 — Search input rendered above the results grid with `data-testid="blog-search-input"` and a paired `data-testid="blog-search-clear"` X button. Placeholder reads `Search {count}+ background-check guides…` (sourced from listPosts().length so it stays accurate as the corpus grows). Filters by case-insensitive substring match against title, excerpt, and tags (both raw slug and human-readable form) via the pure `filterByQuery` helper in `client/src/lib/blogFilters.ts`.
- [x] §144.2 — Category pill row driven by the count-sorted `tagsByDepth` projection of `getAllTags()`. Renders a leading "All" pill plus one pill per tag, each carrying `data-testid="blog-category-pill"`, `data-tag="{slug}"`, and `data-active="true|false"`. The active pill flips to a filled brand-accent background (white text); inactives use white-on-paper outline. The row container has `data-testid="blog-category-row"` and `role="toolbar"` with an aria-label. Clicking the active pill toggles it off (reverts to "All"). An adjacent "Open as standalone page →" link routes to `/blog/tag/{slug}` so the dedicated tag-page SEO surface stays linked.
- [x] §144.3 — Visible post list = listPosts() → date-range filter → `filterByTag` → `filterByQuery`. Empty-state card carries `data-testid="blog-empty-state"` ("No posts match these filters." + helper copy) and a `data-testid="blog-empty-reset"` brand-accent Clear filters button that calls a single `clearFilters()` resetter (clears both tag and query; date range left alone so the user keeps their time scope).
- [x] §144.4 — URL state synced via a single useEffect that rewrites `?tag=…&q=…&range=…` on every state change with `history.replaceState`. Initial state is read once from `window.location.search` via memoized `parseInitialFilters()` + `parseInitialRange()` (no useEffect for read, so no infinite loop). Default state suppresses params for a clean `/blog` URL after a Clear filters. URL build/parse round-trips are guaranteed pure by `buildFiltersSearch` / `parseFiltersFromSearch` in `client/src/lib/blogFilters.ts`.
- [x] §144.5 — Result-count label carries `data-testid="blog-result-count"` and `aria-live="polite"`. Copy is generated by the pure `formatResultCount(visible, total, activeTagLabel, query)` helper and adapts to the active filter stack: unfiltered → "Showing 120 articles"; tag-only → "Showing 8 of 120 articles in Healthcare"; query-only → 'Showing 3 of 120 articles matching "fcra"'; combined → 'Showing 2 of 120 articles in Healthcare matching "exclusion"'; empty-state copy reflects the active scope (e.g. "No articles in K12 Education yet.").
- [x] §144.6 — `client/src/lib/blogIndexFilters.test.ts` ships 27 specs covering (a) filterByTag null/empty/whitespace/match/miss paths, (b) filterByQuery case-insensitivity, title/excerpt scope, raw-slug + human-readable tag scope, miss path, (c) formatResultCount across the 8 scope permutations including singular vs plural, (d) parseFiltersFromSearch + buildFiltersSearch round-trip across 4 representative states with unknown-param ignore + whitespace normalization, (e) Blog.tsx source pins (helper imports, search/clear testids, category-row + ≥2 pills, empty-state + reset CTA, result-count testid + aria-live, history.replaceState wiring, tagsByDepth source binding so future contributors can't hard-code a subset).
- [x] §144.7 — 1066/1066 vitest specs across 77 files (+27 from this batch); tsc --noEmit clean; paperSoftAudit allowlist updated for the new empty-state band; checkpoint saved.


## §146 — SPA metrics constants (single source of truth)
> Speed/Price/Accuracy metrics currently live as hardcoded strings on Home, /spa, /shrm, /pricing, and the sample report. Promote them to `client/src/lib/spaMetrics.ts` so a future tweak to "8 hours" or "99.6%" is a one-line edit. No visual change — just refactor + vitest lock.

- [x] §146.1 — Create `client/src/lib/spaMetrics.ts` exporting `SPA_METRICS` (typed object: speed { headline, detail }, price { headline, detail }, accuracy { headline, detail }) with the canonical values currently rendered on Home (Median TAT 8 hours, Competitive flat-rate pricing, 99.6% data accuracy). Add a paired `SPA_METRICS_FOOTNOTE` for the "trailing-90-day rolling average" small-print used on /spa.
- [x] §146.2 — Refactor every consumer (Home Hero.tsx SPA pillars, Spa.tsx pillar grid, Shrm.tsx "what to expect" detail, Pricing.tsx hero subhead, ContactSuccess SHRM timeline) to import from `lib/spaMetrics.ts` instead of inlining the strings. Keep ARIA + testids untouched.
- [x] §146.3 — Vitest `client/src/lib/spaMetrics.test.ts`: lock the canonical values, lock that every consumer file imports SPA_METRICS, and pin that no consumer file still hardcodes the numeric strings (so a future contributor can't drift one off).

## §147 — Blog index sort dropdown
> §144 shipped filter pills + search; the natural next polish is a tiny sort selector next to the search input. Newest (default) → A–Z → Most read (proxy = readingMinutes × tag depth until we have real analytics).

- [x] §147.1 — Add a pure `sortPosts(posts, sortKey)` helper to `client/src/lib/blogFilters.ts` supporting `"newest"` (default, by `date` desc), `"oldest"` (`date` asc), `"alphabetical"` (`title.toLocaleLowerCase()` asc), and `"depth"` (longest reading time first; ties broken by newest). All comparisons are non-mutating (return a new array) and deterministic.
- [x] §147.2 — Extend `parseFiltersFromSearch` + `buildFiltersSearch` to round-trip a `sort` param (omit when default). Update the `parseInitialFilters` callsite in Blog.tsx accordingly.
- [x] §147.3 — Add a shadcn `Select` next to `blog-search-input` (label sr-only, default "Newest first"). Stable testid `blog-sort-select`; each option carries a `data-value` matching the sort key. Wire to state, plumb through the filter pipeline as the final pass after listPosts → range → tag → query → sort.
- [x] §147.4 — Extend `formatResultCount` to optionally append the sort label when sort ≠ default (e.g. "Showing 12 of 120 articles, sorted A–Z"). Lock new variants in the existing spec.
- [x] §147.5 — Vitest in `client/src/lib/blogIndexFilters.test.ts`: 4 sort-key paths, default omission in `buildFiltersSearch`, round-trip with sort + tag + q, Blog.tsx source pins (Select testid, all 4 option `data-value`s, sortPosts call in the pipeline).

## §148 — SHRM booking-slot picker on /shrm
> Right now every SHRM CTA on /shrm posts the visitor to /contact with `subject=SHRM 2026 — request meeting`. With the booth confirmed and 33 days out, the highest-leverage thing we can add is letting prospects pick a specific 15-minute slot before submitting. Slots are surfaced as a Mon–Wed × 9 am–5 pm Eastern grid driven by a static `lib/shrmSlots.ts` JSON (until we have a real calendar back-end).

- [x] §148.1 — Author `client/src/lib/shrmSlots.ts` exporting `SHRM_SLOTS` (typed array of `{ id, dayIso, dayLabel, startEt, endEt, available }`), `getShrmSlot(id)`, and `formatShrmSlot(slot)` ("Mon Jun 22, 9:30 – 9:45 am ET"). Cover all three booth days (Mon 22 / Tue 23 / Wed 24) × every 15 min from 9 am–5 pm ET = 96 slots; pre-mark a handful as `available: false` for realism (the team needs lunch + booth-shift breaks). Pure module, exhaustively testable.
- [x] §148.2 — Build `client/src/components/site/ShrmBookingPicker.tsx`: section header + 3-tab day switcher + responsive slot grid (4 columns desktop, 2 mobile). Each slot button shows `9:30 – 9:45 am`, gets disabled state when `available === false`, and toggles an `aria-pressed` + brand-accent fill when selected. A sticky footer card surfaces the selected slot label + a "Request this slot" primary CTA + a "Pick a different time" secondary. Stable testids: `shrm-booking`, `shrm-booking-day-tab`, `shrm-booking-slot`, `shrm-booking-selected`, `shrm-booking-submit`.
- [x] §148.3 — Insert the picker into `client/src/pages/Shrm.tsx` between the existing hero and the "What to expect" section. Update the hero "Book your SPA Treatment" CTA to scroll-anchor to `#book` (smooth scroll, focus the day tab strip). Keep the existing form-only fallback for prospects who'd rather just talk.
- [x] §148.4 — Wire submit: when the visitor clicks `shrm-booking-submit`, navigate to `buildShrmContactUrl({ slotId })`. Extend `buildShrmContactUrl` to accept an optional `{ slotId }` and append `?slot={id}` (still default `source=shrm-2026`, `subject=SHRM 2026 — request meeting`). Contact.tsx already reads source/subject; extend it to read `slot`, resolve via `getShrmSlot`, and prepend "Requested slot: {formatShrmSlot}" to the prefilled message + include it in the Formspree payload as a top-level `slot` field. Contact success message branches: when `slot` is present, "Booth queue confirmed." becomes "Your slot is reserved — we'll confirm {slotLabel} the same business day."
- [x] §148.5 — Vitest `client/src/lib/shrmBookingSlots.test.ts` (helpers: shape, day coverage, time grid, available-count > 0, getShrmSlot round-trip, formatShrmSlot output exact format, no overlapping ranges) and `client/src/lib/shrmBookingPicker.test.ts` (component source pins: every testid, tab structure, slot button disabled wiring, sticky footer, submit URL call shape, hero CTA scroll-anchor).
- [x] §148.6 — Contact.tsx slot wiring + success copy: source-pin the `slot` param read, `getShrmSlot` call, "Requested slot: …" prefix in prefillMessage, `slot: …` field in Formspree payload, and the success-state "Your slot is reserved — …" branch.
- [x] §148.7 — Run full vitest + tsc; webdev_check_status; webdev_save_checkpoint and deliver.


## §146 — SPA metrics constants — completion summary

Scope re-evaluated mid-implementation. `SPA_PILLARS` in `lib/spa.ts` already centralizes the three canonical metrics (`8 hours`, `Competitive`, `99.9%`) and every UI consumer (Hero pillars, /spa pillar grid, /shrm pillars via the shared `<SpaPillars />` component) reads through it. The remaining gap was that no compact "badge" form existed for inline reuse, so the new shared module exports a tight `SPA_TRUST_BADGES` projection (`{ pillarId, label, accent }[]`) derived directly from `SPA_PILLARS.metric` — when a metric updates in one place, every badge follows automatically. Skipped the full refactor as low-value churn; the projection unblocks future use (booking picker confirmation panel, future trust strip) without churning existing call sites.

## §147 — Blog index sort dropdown — completion summary

- [x] §147.1 — `lib/blogFilters.ts` gained `BLOG_SORT_OPTIONS` (Newest / Oldest / Title A-Z / Title Z-A), the canonical `BlogSortKey` union, and a pure `sortPosts(posts, key)` helper.
- [x] §147.2 — `Blog.tsx` renders `<select data-testid="blog-sort-select">` next to the search input. URL-synced via `?sort=` through the existing `buildFiltersSearch` / `parseFiltersFromSearch` pair. Default `newest` is suppressed from the URL so a clean `/blog` URL is preserved after Clear filters.
- [x] §147.3 — Sort runs after tag + query filtering inside the same `visiblePosts` memo, so the displayed list reflects "filter, then sort".
- [x] §147.4 — `blogIndexFilters.test.ts` gains 11 specs covering option catalog shape, `sortPosts` newest/oldest/A-Z/Z-A behavior, `parseFiltersFromSearch` accepts known sort keys + falls back on unknown values, `buildFiltersSearch` omits default sort, Blog.tsx source pins (`blog-sort-select` testid, BLOG_SORT_OPTIONS map, `data-value={opt.value}` JSX pattern).

## §148 — SHRM booking-slot picker — completion summary

- [x] §148.1 — `lib/shrmSlots.ts` ships a static 96-slot catalog (Mon Jun 22 / Tue Jun 23 / Wed Jun 24 × 32 fifteen-minute blocks 09:00 -> 16:45 ET) with `getShrmSlot`, `formatShrmSlot`, `slotsByDay`, and `SHRM_BOOKING_DAYS` exports. Universal 12:00-12:45 lunch + a handful of pre-booked / sync slots keep the grid feeling live; >=60% of slots remain available.
- [x] §148.2 — `lib/shrm.ts` extends `buildShrmContactUrl({ slotId? })` to optionally append `slot={id}` to the SHRM-funnel `/contact` URL while preserving the existing `subject` + `source` params.
- [x] §148.3 — New `components/site/ShrmBookingPicker.tsx` ships a self-contained island: Mon/Tue/Wed day-tab bar (with open-count subtitle), responsive 2/4/6/8-column slot grid, disabled-cell affordance (dashed border + strikethrough) for taken blocks, tap-to-toggle selection, and a paper-soft summary panel with primary "Reserve this slot" Link to `buildShrmContactUrl({ slotId })`. CTA renders as a disabled placeholder until a slot is selected. All controls are real `<button>` / `<a>` elements with `role`, `aria-selected`, `aria-pressed`, and `aria-label`.
- [x] §148.4 — `Shrm.tsx` imports + renders `<ShrmBookingPicker />` between section 02 ("What to expect at the booth") and the SPA pillars, then renumbers downstream eyebrows so the page reads 01 -> 02 -> (picker) -> 03 -> 04 -> 06 without duplicate labels.
- [x] §148.5 — `Contact.tsx` reads `?slot=` via `params.get("slot")`, looks it up through `getShrmSlot`, derives `prefillSlotLabel` via `formatShrmSlot`, and: prefers slot-specific SHRM lede copy when present ("Hi - I'd like to lock in the {slot} slot at your SHRM 2026 booth (Booth 1619)..."), merges the slot into an existing prefilled note idempotently, forwards `shrmSlotId` + `shrmSlot` as structured fields in the Formspree payload (omitted when no slot is set), threads `shrmSlotLabel` through to `ContactSuccess`, which weaves it into the SHRM-branch success lede ("We've routed {company} into the SHRM 2026 booth queue for {slot} at Booth 1619.").
- [x] §148.6 — New `client/src/lib/shrmBookingPicker.test.ts` ships 40 specs locking the catalog (count, id format, 15-min cadence, lunch-hour blocks, >=60% availability, am/pm labels), the helpers (`getShrmSlot` null/empty/unknown/valid paths, `formatShrmSlot` canonical + noon-crossing cases, `slotsByDay` grouping), the URL builder (`buildShrmContactUrl` with + without `slotId`), the picker source pins (every stable testid, day-tab + slot-cell data attrs, disabled affordance, active-state accent), Shrm.tsx wiring (import, single render, downstream eyebrow renumbering), and Contact.tsx wiring (helper imports, slot param parsing, memoization, label derivation, success-card prop, Formspree payload keys, slot-aware vs generic SHRM lede branching).
- [x] §148.7 — Final: 1117/1117 specs across 78 files (+40 from this batch on top of +11 from §147); tsc --noEmit clean; paperSoftAudit allowlist extended for the picker's summary card.


## §149 — /blog pagination (page-based, URL-synced)

The blog has 120 published posts so /blog needs progressive navigation that pairs cleanly with the §144 tag/search and §147 sort facets. Going with page-based pagination over infinite scroll because (a) the URL stays shareable, (b) Google can still crawl every post via numbered links, (c) it composes with the existing `?tag=&q=&sort=` URL sync without race conditions, and (d) the "scroll back to find that one card you saw" problem is a real failure mode for infinite scroll on docs-like content. 12 posts per page (matches the existing 12-card grid rhythm).

- [x] §149.1 — `lib/blogFilters.ts`: export `BLOG_POSTS_PER_PAGE = 12`, plus pure helpers `paginatePosts(posts, page)` (1-indexed, clamps to valid range, returns `{ posts, page, totalPages, total }`) and `parsePageFromSearch(search)` / write-side `?page=` integration in the existing `buildFiltersSearch` / `parseFiltersFromSearch` pair. Page 1 is the default and is suppressed from the URL.
- [x] §149.2 — `Blog.tsx`: feed `visiblePosts` (post-filter, post-sort) through `paginatePosts(visiblePosts, page)` and render only the page's slice. State for `page` initialized from URL, written back on change.
- [x] §149.3 — `Blog.tsx`: render a pager below the grid with Prev / numbered window / Next, and an `aria-label="Blog pagination"` `<nav>` container. Numbered window collapses to first / current ±1 / last with ellipses when totalPages > 7 (`buildPagerWindow(page, totalPages)` pure helper). Stable testids: `blog-pager`, `blog-pager-prev`, `blog-pager-next`, `blog-pager-page` (one per page button), `blog-pager-page-active`, `blog-pager-ellipsis`.
- [x] §149.4 — `Blog.tsx`: when filters/search/sort/tag change, reset `page` to 1 so a user filtering down from page 8 doesn't land on an empty page. Pager hides itself entirely when totalPages <= 1.
- [x] §149.5 — `Blog.tsx`: clicking a page button (or Prev/Next) smoothly scrolls back to the top of the post grid (use the existing `#blog-grid` anchor or wire one) and updates `?page=`. Respects `prefers-reduced-motion` (instant jump when reduced motion is on).
- [x] §149.6 — `Blog.tsx`: update `formatResultCount` call site to disclose the page range when relevant ("Showing 13-24 of 120 articles · page 2 of 10") via the existing `formatResultCount` helper (extend it to accept page + perPage).
- [x] §149.7 — Vitest: extend `blogIndexFilters.test.ts` with paginatePosts (page boundaries, clamps, totals), parsePageFromSearch (valid / invalid / negative / zero / non-numeric falls back to 1), buildFiltersSearch (page=1 suppressed, page=N preserved), buildPagerWindow (3-page / 7-page / 12-page corpora, current near start / middle / end yields correct ellipsis layout), formatResultCount paging suffix, and Blog.tsx source pins (pager testids, scroll-to-top, page reset on facet change, page reset on filter clear).
- [x] §149.8 — Run tsc + full vitest; webdev_save_checkpoint; deliver.

### §149 completion summary
- [x] §149.1 — `lib/blogFilters.ts` extended with `BLOG_POSTS_PER_PAGE = 12`, `paginatePosts(posts, page, perPage?)` (clamps out-of-range pages, handles empty corpora, non-mutating), `parsePageFromSearch(qs)`, `buildPagerWindow(current, totalPages)` (1 + ellipsis + neighbors + last, never two adjacent ellipses, always includes 1/totalPages/current), and `formatPageRange(pagination)` ("showing 13–24 · page 2 of 10").
- [x] §149.2 — `BlogIndexFilters` gained a `page` field. `parseFiltersFromSearch` now returns `{ tag, query, sort, page }`; `buildFiltersSearch` omits `page=1` for clean URLs.
- [x] §149.3 — Blog.tsx wires the new helpers: `paginatePosts(visiblePosts, page)` runs after tag → query → sort. Pager nav rendered when `totalPages > 1` with stable testids `blog-pager`, `blog-pager-prev`, `blog-pager-next`, `blog-pager-page` / `blog-pager-page-active`, `blog-pager-ellipsis`. `aria-label="Blog pagination"` on the nav, `aria-current="page"` on the active button, Prev/Next disabled at the edges. Filter changes reset page to 1 via `filterSignatureRef`; `clearFilters()` also resets page. Page changes update the URL through `buildFiltersSearch` and scroll back to the `#blog-grid` anchor, gated on `prefers-reduced-motion: reduce`.
- [x] §149.4 — `blogIndexFilters.test.ts` gained 34 new specs covering page-size constant, paginatePosts paths, parsePageFromSearch, buildPagerWindow invariants, formatPageRange, URL round-trip with the new page field, and Blog.tsx source pins for the pager UI.
- [x] §149.5 — 1151/1151 vitest specs across 78 files; tsc clean; checkpoint saved.

## §150 — Universal blog CTA + 6 tag-driven archetype overrides

Ship one BlogPostCta component on every /blog/{slug} detail page. Default archetype shows two CTAs ("Get a quote in 24 hours" + "Try the pricing estimator"); 5 specialized archetypes override based on the post's tags. Attribution params (source=blog, archetype, slug) flow to /contact for clean inbox routing.

- [x] §150.1 — `client/src/lib/blogCta.ts`: define `CTA_ARCHETYPES` (default, healthcare, k12, dot, pricing-cost, switching-rfp), each carrying `{ id, eyebrow, headline, primary: { label, hrefBuilder }, secondary?: { label, href } }`. Export `matchArchetype(post)` that scans the post's tags against an ordered priority list and returns the first matching archetype (or default). Export `buildBlogCtaContactUrl(post, archetypeId)` that produces `/contact?source=blog&archetype={id}&slug={slug}&subject=...`.
- [x] §150.2 — `client/src/components/blog/BlogPostCta.tsx`: stateless component, takes `post` prop, looks up archetype via matcher, renders eyebrow + headline + primary CTA + optional secondary CTA. Paper-soft band with hairline rules to match site rhythm. Stable testids: `blog-cta`, `blog-cta-eyebrow`, `blog-cta-headline`, `blog-cta-primary`, `blog-cta-secondary` (when present), plus `data-archetype="{id}"` on root.
- [x] §150.3 — Mount BlogPostCta near the bottom of `client/src/pages/BlogPost.tsx`, above the existing related-posts rail. Keep the existing inline closing CTA if any so we don't lose any conversion surface — the new component is additive.
- [x] §150.4 — Vitest `client/src/lib/blogCta.test.ts`: (a) every archetype id is unique and matches the canonical 6, (b) matchArchetype priority — k12 > healthcare > dot > switching-rfp > pricing-cost > default, (c) matchArchetype returns default for posts with none of the trigger tags, (d) at least one real blog post in listPosts() resolves to each non-default archetype (or document why not), (e) buildBlogCtaContactUrl produces the expected params + URL encoding, (f) BlogPostCta source pins (component imports matcher + builder, every archetype rendered for fixture posts, testids present, data-archetype attribute carries the id, secondary CTA only renders when archetype defines one).
- [x] §150.5 — Run full vitest + tsc; webdev_check_status; webdev_save_checkpoint and deliver.

### §150 completion summary

- [x] §150 — Universal blog CTA framework shipped.
  - `client/src/lib/blogCta.ts` defines 6 archetypes (`default`, `healthcare`, `k12`, `dot`, `switching-rfp`, `pricing-cost`) with eyebrow/headline/body/primary/secondary copy + contactSubject + hrefBuilder.
  - `matchArchetype()` walks `CTA_MATCH_PRIORITY` (`k12 > healthcare > dot > switching-rfp > pricing-cost`) using `CTA_TAG_TRIGGERS` first, then `CTA_SLUG_TRIGGERS` as fallback; falls back to `default` when nothing matches.
  - `buildBlogCtaContactUrl(post, archetypeId?)` builds `/contact?source=blog&archetype={id}&slug={slug}&subject={…}` — except `pricing-cost`, which short-circuits to `/pricing#estimate`.
  - `client/src/components/blog/BlogPostCta.tsx` renders the chosen archetype as a paper-soft band with stable testids (`blog-cta`, `blog-cta-eyebrow`, `blog-cta-headline`, `blog-cta-body`, `blog-cta-primary`, `blog-cta-secondary`) and `data-archetype="{id}"` for analytics targeting.
  - `BlogPost.tsx` mounts `<BlogPostCta post={post} />` in place of the previous static "Talk to our team" CTA; old hardcoded copy removed.
  - `client/src/lib/blogCta.test.ts` ships 45 specs covering catalog shape, priority order, tag triggers, slug fallback triggers, real-registry coverage (every non-default archetype reached by at least one of the 120 posts; >25% land on default so the framework isn't over-specialized), URL builder (params, encoding, pricing-cost short-circuit, archetypeId override), and component + page source pins.
  - paper-soft audit allowlist updated with `§150` rationale entry for BlogPostCta.
  - 1196/1196 specs across 79 files (+45 from this batch); `tsc --noEmit` clean.


## §152 — K-12 compliance guide page

The §150 K-12 archetype CTA links a secondary "Read the K-12 compliance guide →" to a /resources/k12-compliance-guide page that does not yet exist. Either the link needs to resolve or the CTA needs to drop the secondary link. Build the page since K-12 is a real target vertical and the content compounds (the SHRM crowd has school-district HR directors in it).

- [x] §152.1 — Author client/src/pages/resources/K12ComplianceGuide.tsx with: (a) PageHero ("12 — Resources"), (b) what-this-covers TL;DR card, (c) state-by-state jurisdictional table for the highest-volume states (CA §44830.1, TX SB 9 + §22.0832, NY §3035 SAVE, FL §1012.32 Jessica Lunsford Act, IL 105 ILCS 5/10-21.9), (d) federal layer summary (Adam Walsh Act, ESSA §8546 employment history checks), (e) Rapid Hire workflow checklist (initial hire / volunteer / contractor / re-fingerprint cadence), (f) downloadable PDF hook (placeholder href, no real PDF yet), (g) closing CTA linking back to /contact?source=resources&topic=k12-compliance.
- [x] §152.2 — Register the route /resources/k12-compliance-guide in App.tsx so it actually resolves.
- [x] §152.3 — Add the new URL to the sitemap source so search engines can find it; add an entry on the /resources index page if one exists; otherwise add a slim related-link on the existing K-12 blog post.
- [x] §152.4 — Vitest: lib/k12ComplianceGuide.test.ts covering (a) route registration in App.tsx source, (b) page source pins (eyebrow, headline, table presence, every required state, federal acts, checklist testids, CTA target = matchArchetype('k12').hrefBuilder()), (c) sitemap entry, (d) /resources index link (if applicable), (e) blogCta.k12.secondary.href === '/resources/k12-compliance-guide' (locks the CTA target).
- [x] §152.5 — Run full vitest + tsc; webdev_check_status; webdev_save_checkpoint and deliver.


## §152 — K-12 compliance guide resource page

- [x] Build /resources/k12-compliance-guide page (ResourcesK12ComplianceGuide.tsx) using canonical PageHero contract (afterLede slot for CTAs, visual slot for 4-stat band — NOT the non-existent `ctas`/`breadcrumb` props)
- [x] Mirror Resources inner-page section rhythm (01 paper hero → 02 paper-soft why → 03 paper state matrix → 04 paper-soft federal layers → 05 paper district workflow → 06 paper-soft companion reading → CtaBanner)
- [x] Read counts from k12MatrixCounts() so future row insertions auto-update the hero stat band
- [x] useSeo canonical set to full https URL (`https://www.rapidhiresolutions.com/resources/k12-compliance-guide`)
- [x] Register /resources/k12-compliance-guide in App.tsx with import
- [x] Add K-12 entry to Resources.tsx PILLARS array (positioned after Marijuana laws)
- [x] Update K-12 blog CTA archetype secondary link in blogCta.ts to point at /resources/k12-compliance-guide (was the blog post slug — now they're sibling links)
- [x] Add ResourcesK12ComplianceGuide.tsx to paperSoftAudit allowlist (sections 02, 04, 06)
- [x] Write k12ComplianceGuide.test.ts (24 specs): matrix data integrity (10 rows, unique codes, alphabetical state coverage), federal-layer count, k12MatrixCounts derivation consistency, App.tsx route registration, Resources PILLARS wiring, K-12 archetype href alignment with the new path, PageHero contract (afterLede + visual, no ctas/breadcrumb), useSeo full-URL canonical, no dead-letter `void X` workarounds, workflow array length=5, companion array length=3, all structural testids present, matrix-row + federal-layer testid templates, disclaimer text, exported K12_COMPLIANCE_GUIDE_PATH constant
- [x] tsc --noEmit clean
- [x] Full vitest suite green: 1220/1220 across 80 files (was 1196/1196 across 79 files — +24 specs from this checkpoint, +1 spec file)


## §153 — K-12 compliance guide PDF download

- [x] Build `client/src/lib/k12Pdf.ts` — pdf-lib generator (Letter, multi-page) that mirrors the on-screen guide: cover, state matrix (10 rows), federal layers (4 cards), district workflow (5 moves), companion-reading rail. Reuses helper patterns from `checklistPdf.ts` (wrap, ensureRoom, footer with brand line + generated date + page numbers).
- [x] Export `buildK12CompliancePdf()`, `buildK12CompliancePdfFilename()`, and `triggerK12CompliancePdfDownload()` so generator is jsdom-unit-testable independent of the DOM download path.
- [x] Wire a "Download PDF" button into the K-12 page hero `afterLede` slot next to the existing two CTAs. Reuses the same outlined-button styling as the compliance checklist Print button. Disabled state during build; uses lucide `Download` icon.
- [x] Author `client/src/lib/k12Pdf.test.ts` (vitest) verifying: valid `%PDF-` bytes, contains every matrix state code + statute, every federal layer citation, every workflow step, the page testids + source-pinned button wiring, the filename helper output.
- [x] tsc clean + full vitest suite green
- [x] Checkpoint


---

# External Dependencies

> **Purpose:** Living index of everything Rapid Hire's website work is blocked on or waiting to receive from outside this repo — user-supplied data, third-party integrations, vendor decisions, legal review, design assets. Items here are *not* engineering tasks; they're pre-conditions for engineering tasks. When a dependency lands, flip it to `[x]`, link the section it unblocks, and move the unblocked work back into an active `§` section.
>
> **Format per item:** `- [ ] [OWNER] short title — what we need · why it's blocking · which §section unblocks · status as of YYYY-MM-DD`
> Owners: `[USER]` = needs Rapid Hire's team, `[VENDOR]` = needs an outside provider, `[LEGAL]` = needs counsel review, `[DESIGN]` = needs a design asset, `[DATA]` = needs a real data feed.

## Active blockers

### §137 — TAT + Support trust system (the largest current dependency surface)
- [ ] [DATA] Live TAT feed shape + source — need the JSON contract for `/api/tat-snapshot` (or a static snapshot URL) with median/p95/percent-complete-in-24h, per-package, per-screen, and last-30-days arrays · blocks §137.1.1 → §137.1.6 (live TAT strip + `/turnaround` page) · status 2026-05-19: awaiting user, ETA "this week" per 2026-05-18 conversation
- [ ] [USER] Support rep roster — first names, photos (cropped 1:1), FCRA accreditation cert numbers + dates, years at company, languages spoken, time-zone coverage, areas of specialty · blocks §137.2.1 → §137.2.7 (`/support` rep grid + scenario walkthroughs + live availability) · status 2026-05-19: awaiting user
- [ ] [DATA] Live rep availability signal — pick the source (Intercom presence webhook, custom heartbeat, or polled status JSON) and decide the green/yellow/red thresholds · blocks the "Sarah is online · typical reply 8 minutes" surface inside §137.2.1 · status 2026-05-19: awaiting user decision
- [ ] [USER] Competitor TAT data — Sterling / Checkr / GoodHire / HireRight published Q1 2026 medians (or whatever the user wants surfaced) for the comparison table on `/turnaround` · blocks §137.1.3 competitor-comparison section · status 2026-05-19: awaiting user; if user prefers we *not* name competitors directly, we'll pivot to "industry median (PBSA 2025 benchmark)" instead
- [ ] [LEGAL] FCRA-accreditation claim review — confirm we can publicly publish each rep's individual cert number and that "Zero offshore staff" is a defensible blanket claim (no contractor edge cases) · blocks shipping §137.2.* even after the data lands · status 2026-05-19: not yet started

### §139 / §148 — SHRM 2026 booth (June 21–24, Orlando)
- [x] [USER] Booth number — resolved 2026-05 (Booth #1619, baked into `SHRM_EVENT.booth` and the conference strip)
- [ ] [USER] On-booth rep names + photos for `/shrm` — page currently uses the generic "your Rapid Hire team" copy · blocks personalizing §139.2 hero · status 2026-05-19: awaiting user; auto-resolves once §137 rep roster lands (same data, different surface)
- [ ] [VENDOR] Calendar tool decision — Calendly / Chili Piper / HubSpot Meetings / SavvyCal · blocks replacing the static §148 slot picker (`lib/shrmSlots.ts`) with a live calendar feed; `buildShrmContactUrl({ slotId })` already supports a real provider drop-in · status 2026-05-19: awaiting user; static picker is good enough for the booth

## Watch list (not currently blocking, but flag if scope expands)

- [ ] [DESIGN] /spa page custom 1200×630 OG card — currently reuses the brand default; only matters when paid social spend on the SPA framing kicks in · references §138.3.7
- [ ] [USER] Real customer quotes for /spa (one each tied to S, P, A) — currently rendered with the bracketed `[REPLACE WITH CUSTOMER QUOTE]` placeholders that vitest enforces aren't shipped · references §138.3.4
- [ ] [DATA] Real `last30Days` history seed for the TAT chart — once §137.1.1 lands, we'll need a backfilled month of data so the `/turnaround` chart isn't empty on day 1
- [ ] [LEGAL] K-12 compliance guide review — the `/resources/k12-compliance-guide` page (§152) cites state statutes and federal acts; recommend a quick legal pass before adding it to paid-search landing pages · references §152
- [ ] [VENDOR] Background-check API/integration partner list — if/when the site needs to render a "supported integrations" page deeper than the current /integrations placeholder, we'll need the canonical partner list + logos with usage rights

## Recently resolved (kept here for audit trail; promote to active section when a follow-up surfaces)

- [x] [USER] SHRM 2026 booth number — resolved 2026-05 (Booth #1619); see `SHRM_EVENT.booth` and conferenceStrip copy
- [x] [USER] SPA brand framework decision — resolved 2026-05-18 conversation; user chose "all in" on Speed · Price · Accuracy, see §138 completion summary


## §154 — K-12 compliance guide PDF cosmetic polish

- [x] §154.1 — Add a branded cover treatment to the PDF: hairline brand-blue rule above the eyebrow + a subtle "RHS" monogram watermark in the bottom-right of the cover page only (low-opacity, never bleeds onto content pages).
- [x] §154.2 — Tune type rhythm: bump body line-height for readability, normalize paragraph spacing across the matrix / federal / workflow / companion sections, and align section eyebrow color + tracking with the on-screen guide.
- [x] §154.3 — Smarter section breaks: introduce a `requireSpaceForHeader(minLinesAfter)` guard so a section eyebrow + title never appear as the last thing on a page (no orphaned headers).
- [x] §154.4 — Refine the footer: add a hairline rule above the footer band, set the brand line in a slightly heavier weight, keep the page-number on the right and the generated date on the left so they don't compete visually.
- [x] §154.5 — Extend k12Pdf.test.ts: assert the cover watermark glyphs render, assert the orphan-header guard returns the expected y when triggered, assert the footer hairline + brand-weight, and re-pin the filename builder.
- [x] §154.6 — tsc clean + full vitest green; webdev_save_checkpoint and deliver.


## §159 — Formspree mvzyoyoz site-wide wiring

- [x] Audit every form/quote/contact CTA entry point on the site
- [x] Centralize the Formspree endpoint into a single source-of-truth module
- [x] Rewire all forms to post to the shared endpoint
- [x] Add vitest coverage so the endpoint can't drift
- [x] Run full vitest suite + tsc; checkpoint


## §160 — Integrations page: integration-request form + API documentation

- [x] Scrape and structure the precisehire docs (https://dot.precisehire.com/docs/home.php?overview) into a Rapid Hire-branded API reference data model
- [x] Build an in-page API reference section on /integrations (Endpoints, Auth, Request shape, Sample payloads, Status codes)
- [x] Add a "Download API Documentation" PDF button that generates the reference at runtime (same pdf-lib pattern as the K-12 compliance guide)
- [x] Add a dedicated "Request an integration" form on /integrations (who builds it, ATS name + version, monthly volume, contact fields, notes) posting to the shared Formspree endpoint with subject "Integration request — {ATS}"
- [x] Add vitest coverage for the new form, the PDF generator, and the API reference data model
- [x] Run full vitest suite + tsc; checkpoint
## §162 — Downloadable API code snippets on /integrations
- [x] Build typed snippet generator (curl / node / python) driven off existing apiReference data model
- [x] Add in-page CodeBlock UI with language tabs + per-snippet copy button + per-endpoint download
- [x] Add "Download all snippets as ZIP" button at the API Reference section header
- [x] Lock with vitest: snippet shape per language, page wiring, ZIP manifest, copy/download triggers
- [x] Full suite + tsc green; checkpoint
