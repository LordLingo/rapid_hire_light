# RHS Referral Partner Program — source notes (from PDF)

## Headline
- Eyebrow: "Rapid Hire Referral Partner"
- Title: "Refer Once, Earn Monthly"
- Sub: "Add new clients via your custom referral partner form. When your client orders background checks, you receive a revenue percentage of eligible monthly RHS billing."

## Monthly revenue share table (tiers)
Affiliate payment is based on eligible monthly Rapid Hire billing for each referred client.

| Monthly RHS billing | Partner share |
|---|---|
| Up to $1,000 | 5% |
| $1,001 – $5,000 | 7% |
| $5,001 – $20,000 | 10% |
| $20,001 – $50,000 | 12% |
| $50,001+ | Negotiable |

Paid net 15 calendar days after Rapid Hire receives payment from the referred client.

## Example client sizes (the three cards)
- **Small:** $1,000 billing, 5% share → **$50/mo** ($600/yr)
- **Growing:** $5,000 billing, 7% share → **$350/mo** ($4,200/yr)
- **Large:** $20,000 billing, 10% share → **$2,000/mo** ($24,000/yr)

## Why partners like this model
Your referral can keep paying month after month. The larger the client and the more hiring they do, the more the monthly revenue share can add up. Rapid Hire contracts directly with the client, services the account day to day, and pays the partner after the client pays us.

## How it works (3 steps)
1. **Register** — Complete referral information form and W-9.
2. **Share** — Use your custom referral partner form/link.
3. **Earn** — Client orders RHS services. Partner gets paid.

## No account babysitting
Rapid Hire handles day-to-day client questions, support, billing workflow, and account service. No further intervention is required from the referral partner.

## Who can qualify
Referring accounts may be individuals or entities. Examples include HR consulting firms, temporary employment agencies, investigation agencies, insurance agencies, and other trusted business advisors.
Rapid Hire has full discretion in granting, revoking, or refusing affiliate registration and may discontinue the program at any time.

## Clean handoff
Because of state and federal requirements, Rapid Hire contracts directly with the client. Partners receive marketing materials and may request approval to use RHS logos, service marks, and copyrighted materials.

## Program terms, exclusions, and limitations
- **Eligible billing:** Referral percentages exclude Rapid Hire pass-through expenses, including county courthouse fees, third-party verification fees, state fees, communications, and related costs.
- **Existing contacts:** No referral fee applies where the client contacted Rapid Hire directly before the referral was provided.
- **Timing:** Referrals older than 180 days with no signed contract may expire, unless extended by Rapid Hire at its discretion upon affiliate request.
- **Client acceptance:** Rapid Hire may refuse a client at its sole discretion.
- **Referral records:** Client referral forms must be submitted in writing by regular mail or email and must be dated. If multiple affiliates refer the same client, the first referral received by Rapid Hire receives the fee.
- **Partner ID:** The affiliate is responsible for providing the correct affiliate registration number. A referral form without the proper registration number may not be compensated.
- **Program changes:** Rapid Hire may change referral fee percentages in writing within a 30-day period. Rules are governed by current prevailing program terms, which may change without notice.

Footer: "Summary only. Referral payments and eligibility are governed by the full program terms. Contact Rapid Hire Solutions to register and receive your custom referral partner form."


---

## IMPLEMENTATION STATUS (in progress)

Files created:
- client/src/lib/referral.ts — tier math (REFERRAL_TIERS, REFERRAL_EXAMPLES, computeReferral, resolveTier, clampBilling). Tiers: 5%/7%/10%/12%/Negotiable at $1K/$5K/$20K/$50K bands.
- client/src/lib/referral.test.ts — 8 tests, all PASS.
- client/src/pages/Referral.tsx — standalone page (hero, why, tier table+examples, how-it-works+3 support cards, calculator, lead form -> Formspree FORMSPREE_ENDPOINT mvzyoyoz with _subject "New referral-partner inquiry — {company}" + source "referral-partner-program", program terms fine print).
- client/src/components/site/ReferralCalculator.tsx — earnings calc modeled on PricingCalculator.

Route: /referral registered in App.tsx (§221 comment). INTENTIONALLY NOT in Header/Footer nav (verified grep: no referral refs). 
Hero image (webdev asset, persists): https://d2xsxph8kpxj0f.cloudfront.net/310419663030097116/8y99ZZZXXUWxvnE7c5sDkk/referral-hero-portrait-kuthHSix6w7dfBXegtTBRA.webp

SITEMAP DECISION: vite.config.ts STATIC_ROUTES list does NOT include /lp/staffing or /spa (private LPs are excluded from sitemap). So /referral must ALSO be excluded — do NOT add it to STATIC_ROUTES. This keeps it private/shareable-only. No action needed on sitemap.

Promo copy file already delivered: marketing/texas-guide-promo.md (unrelated prior task).

REMAINING TODO:
- Write a page-level test (referralPage / render smoke or lib assertion) mirroring staffing pattern.
- Run full test suite + tsc --noEmit.
- webdev_check_status / visually verify.
- webdev_save_checkpoint and deliver.
