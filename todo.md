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
- [ ] Replace placeholder phone `(888) 555-0142` with real `(888) 445-3047` everywhere (UI labels, `tel:` hrefs, JSON-LD telephone, og-image SVG, vitest specs)
- [ ] Replace placeholder support email `support@rapidhiresolutions.com` with real `info@rapidhiresolutions.com` everywhere (mailto:, UI text, JSON-LD email, vitest specs)
- [ ] Add new sales / quote email `sales@rapidhiresolutions.com` to "Get a Quote" + sales-oriented CTAs and JSON-LD ContactPoint(sales)
- [ ] Remove all references to `candidates@rapidhiresolutions.com` (Support page, Contact page, JSON-LD ContactPoint, FAQ answers, footer/header) — re-route candidate flows to the structured form + phone + info@ fallback
- [ ] Update relevant vitest specs and shared JSON (support-status.json) to reflect the new numbers/emails
- [ ] Browser QA across Home, Services, Pricing, Integrations, Contact, Support, blog OG image; vitest green; save checkpoint and deliver

## 33. Real contact info sweep (placeholders → live values)
- [x] Replace placeholder phone `(888) 555-0142` / `+18885550142` with real `(888) 445-3047` / `+18884453047` across Support page constants, Contact page details, ContactCallCard hero footer
- [x] Replace placeholder support email `support@rapidhiresolutions.com` with `info@rapidhiresolutions.com` site-wide
- [x] Add new sales email `sales@rapidhiresolutions.com` to the Contact page details and to the Support page email rail; surface it as a separate "Quotes & new accounts" line
- [x] Remove retired `candidates@rapidhiresolutions.com` everywhere; rewire candidate FAQ to phone + on-page candidate inquiry form, and re-anchor the candidate-card "two doors" CTAs to call + form
- [x] Update Support JSON-LD `contactPoint[]` block: drop `candidate care`, add `sales`, keep `customer support` on `info@`
- [x] Refactor `CandidateContactForm`: drop required `candidateEmail` prop, replace with optional `fallbackEmail`; update Support page caller
- [x] Add `client/src/lib/contactInfo.test.ts` vitest spec that pins the new phone/email values and bans the retired placeholders
- [x] Vitest green (91/91), TS/LSP clean, browser QA on /support and /contact, save checkpoint, deliver
