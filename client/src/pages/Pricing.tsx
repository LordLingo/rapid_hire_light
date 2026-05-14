/*
  Editorial Calm — Pricing page
  Layout:
   - PageHero with eyebrow "Pricing".
   - Three-tier pricing cards (Essential / Professional / Comprehensive) on hairline grid, no boxy shadows.
     Middle Professional card filled with brand-blue + "MOST CHOSEN" badge.
   - Pricing calculator.
   - Add-ons row (chips).
   - FAQ short strip.
   - Closing CTA → /contact.
*/
import { useCallback, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Check } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import PricingCalculator from "@/components/site/PricingCalculator";
import type { CalculatorEstimate } from "@/components/site/PricingCalculator";
import StickyEstimateBar from "@/components/site/StickyEstimateBar";

type TierId = "essential" | "professional" | "comprehensive";
type Tier = {
  id: TierId;
  eyebrow: string;
  name: string;
  price: string;
  unit: string;
  blurb: string;
  bestFor: string;
  whyPickIt: string;
  notFor: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
};

// Tier-matching highlight effect was removed per user feedback (the dim/blur on
// non-matched cards made the surrounding tiers unreadable). Cards now render in
// their normal, fully-readable state regardless of calculator activity. The
// sticky estimate bar at the bottom still surfaces the live per-check + monthly
// figures while the calculator is in use.

const TIERS: Tier[] = [
  {
    id: "essential",
    eyebrow: "01 — Essential",
    name: "Essential",
    price: "$24.95",
    unit: "per check",
    blurb:
      "The compliance-grade starting point for new hiring teams. Includes SSN trace, sex-offender registry, and a national + county criminal search.",
    bestFor: "Single hires. Small teams running 1–10 checks a month.",
    whyPickIt:
      "Compliance-grade floor at the lowest defensible price. Pay per check, no contract.",
    notFor:
      "Roles requiring federal criminal, multi-county, MVR, or drug screening.",
    features: [
      "SSN trace & address history",
      "National criminal database + SOR",
      "1 county criminal search",
      "Global watchlist (OFAC)",
    ],
    cta: "Get an Essential quote",
    ctaHref: "/contact?tier=essential&note=Interested+in+the+Essential+package",
  },
  {
    id: "professional",
    eyebrow: "02 — Professional",
    name: "Professional",
    price: "$44.95",
    unit: "per check",
    blurb:
      "The package most employers actually need. Adds federal criminal, employment, and education verification on top of Essential.",
    bestFor:
      "Most employers. 10–100 checks a month across mixed roles.",
    whyPickIt:
      "Adds federal criminal, employment & education verification — the package that actually matches what HR teams need 80% of the time.",
    notFor:
      "DOT, healthcare credentialing, or executive roles needing 3+ employment checks.",
    features: [
      "Everything in Essential",
      "1 employment verification",
      "1 education verification",
      "7-year address history search",
      "Federal criminal search",
    ],
    cta: "Get a Professional quote",
    ctaHref: "/contact?tier=professional&note=Interested+in+the+Professional+package",
    featured: true,
  },
  {
    id: "comprehensive",
    eyebrow: "03 — Comprehensive",
    name: "Comprehensive",
    price: "$74.95",
    unit: "per check",
    blurb:
      "Built for regulated and high-trust roles. Includes multi-county, multi-verification, and DOT-ready add-ons.",
    bestFor:
      "Regulated industries. Healthcare, transportation, finance, executive hires.",
    whyPickIt:
      "Multi-county, multi-verification, MVR or 5-panel drug screen included. DOT-ready.",
    notFor:
      "Volume hiring at >250/month — talk to us about a Custom Volume contract instead.",
    features: [
      "Everything in Professional",
      "Up to 3 county criminal searches",
      "Up to 3 employment verifications",
      "MVR or 5-panel drug screen",
      "Civil records search",
    ],
    cta: "Get a Comprehensive quote",
    ctaHref: "/contact?tier=comprehensive&note=Interested+in+the+Comprehensive+package",
  },
];

const ADDONS = [
  "International criminal",
  "Healthcare sanctions",
  "Credit (FCRA)",
  "Social media screening",
  "Continuous monitoring",
  "I-9 / E-Verify",
];

const PRICING_FAQ = [
  {
    q: "Are there platform fees or minimums?",
    a: "No. You only pay for the screens you run. No seat licenses, no monthly minimums, no setup fees.",
  },
  {
    q: "How is per-check pricing determined?",
    a: "Volume tier pricing scales with monthly check count and the mix of services you run. We'll send a written quote inside one business day.",
  },
  {
    q: "Do you pass through court fees?",
    a: "Yes — court access fees and third-party costs (drug labs, MVR, international) are passed through at cost and itemized on every invoice.",
  },
];

export default function Pricing() {
  const [estimate, setEstimate] = useState<CalculatorEstimate | null>(null);
  const calculatorEndRef = useRef<HTMLDivElement | null>(null);
  const handleEstimate = useCallback((e: CalculatorEstimate) => {
    setEstimate(e);
  }, []);

  return (
    <SiteShell>
      <PageHero
        eyebrow="05 — Pricing"
        title={
          <>
            Pay only for the{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              screens
            </span>{" "}
            you run.
          </>
        }
        lede="No platform fees, no seat licenses, no minimums. Per-check pricing that scales with your hiring volume — and a written quote inside one business day."
      />

      {/* Tiers — 3 cards: Essential / Professional (MOST CHOSEN) / Comprehensive */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-7 items-stretch">
            {TIERS.map((t) => {
              const isFeatured = !!t.featured;
              const labelClass = isFeatured
                ? "text-[10.5px] font-medium uppercase tracking-[0.18em] text-white/85"
                : "text-[10.5px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent-ink)]";
              const dividerClass = isFeatured
                ? "my-7 h-px bg-white/20"
                : "my-7 h-px bg-border";
              return (
                <article
                  key={t.name}
                  data-tier-id={t.id}
                  className={[
                    "reveal-on-scroll relative flex flex-col rounded-[20px] border p-8 md:p-9",
                    "transition-[opacity,transform,box-shadow,border-color] duration-300 ease-out",
                    isFeatured
                      ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white shadow-[0_24px_60px_-30px_rgba(37,99,235,0.45)] lg:scale-[1.02] lg:-mt-2"
                      : "border-border bg-[color:var(--color-paper)] text-[color:var(--color-ink)]",
                  ].join(" ")}
                >
                  {isFeatured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent-ink)] shadow-sm border border-[color:var(--color-accent-ink)]/20">
                      <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                      Most Chosen
                    </span>
                  )}
                  <p className={isFeatured ? "text-[10.5px] font-medium uppercase tracking-[0.2em] text-white/70" : "eyebrow"}>{t.eyebrow}</p>
                  <h3 className={[
                    "mt-4 font-display text-[34px] md:text-[40px] leading-none tracking-[-0.02em]",
                    isFeatured ? "text-white" : "text-[color:var(--color-ink)]",
                  ].join(" ")}>
                    {t.name}
                  </h3>
                  <p className={[
                    "mt-4 text-[14.5px] leading-[1.6] max-w-prose",
                    isFeatured ? "text-white/85" : "text-[color:var(--color-ink-soft)]",
                  ].join(" ")}>
                    {t.blurb}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className={[
                      "font-display text-[40px] md:text-[48px] leading-none tracking-[-0.02em]",
                      isFeatured ? "text-white" : "text-[color:var(--color-ink)]",
                    ].join(" ")}>
                      {t.price}
                    </span>
                    <span className={[
                      "text-[12px] uppercase tracking-wider",
                      isFeatured ? "text-white/70" : "text-[color:var(--color-ink-muted)]",
                    ].join(" ")}>
                      {t.unit}
                    </span>
                  </div>

                  <div className="mt-7 space-y-4">
                    <div>
                      <p className={labelClass}>Best for</p>
                      <p className={[
                        "mt-1.5 text-[13.5px] leading-[1.6]",
                        isFeatured ? "text-white" : "text-[color:var(--color-ink)]",
                      ].join(" ")}>
                        {t.bestFor}
                      </p>
                    </div>
                    <div>
                      <p className={labelClass}>Why pick it</p>
                      <p className={[
                        "mt-1.5 text-[13.5px] leading-[1.65]",
                        isFeatured ? "text-white/95" : "text-[color:var(--color-ink-soft)]",
                      ].join(" ")}>
                        {t.whyPickIt}
                      </p>
                    </div>
                    <div>
                      <p className={labelClass}>Not for</p>
                      <p className={[
                        "mt-1.5 text-[13.5px] leading-[1.6]",
                        isFeatured ? "text-white/85" : "text-[color:var(--color-ink-muted)]",
                      ].join(" ")}>
                        {t.notFor}
                      </p>
                    </div>
                  </div>

                  <div className={dividerClass} />

                  <ul className="space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <span className={[
                          "mt-[3px] grid place-items-center size-5 shrink-0 rounded-full",
                          isFeatured
                            ? "bg-white/15 text-white"
                            : "border border-border text-[color:var(--color-accent-ink)]",
                        ].join(" ")}>
                          <Check className="size-3" strokeWidth={2.25} />
                        </span>
                        <span className={[
                          "text-[14px] leading-[1.6]",
                          isFeatured ? "text-white" : "text-[color:var(--color-ink)]",
                        ].join(" ")}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-9">
                    <Link
                      href={t.ctaHref}
                      className={[
                        "btn-press inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[13.5px] font-medium",
                        isFeatured
                          ? "bg-white text-[color:var(--color-accent-ink)] hover:bg-white/90"
                          : "border border-[color:var(--color-ink)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-white",
                      ].join(" ")}
                    >
                      {t.cta}
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <PricingCalculator onEstimateChange={handleEstimate} />
      {/* Sentinel — when this scrolls out of view above the viewport, the sticky
          estimate bar appears at the bottom of the screen with the live numbers. */}
      <div ref={calculatorEndRef} aria-hidden="true" className="h-px w-full" />

      {/* Add-ons */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">07 — Add-ons</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Stack only what you{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  need.
                </span>
              </h2>
              <p className="mt-6 max-w-2xl text-[16px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                Every plan can be extended with role-specific or
                jurisdiction-specific add-ons. Add or remove anytime — pricing
                is per check, no commitments.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {ADDONS.map((a) => (
                  <span
                    key={a}
                    className="text-[13px] rounded-full border border-border bg-white px-4 py-2 text-[color:var(--color-ink)]"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">08 — Pricing FAQ</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The honest{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  fine print.
                </span>
              </h2>
            </div>
          </div>

          <dl className="mt-12 grid grid-cols-12 gap-x-10 gap-y-8">
            {PRICING_FAQ.map((row) => (
              <div
                key={row.q}
                className="reveal-on-scroll col-span-12 md:col-span-4 border-t border-border pt-6"
              >
                <dt className="font-display text-[20px] leading-snug text-[color:var(--color-ink)]">
                  {row.q}
                </dt>
                <dd className="mt-3 text-[14.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                  {row.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="reveal-on-scroll grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 md:col-span-8">
              <p className="eyebrow">09 — Get a quote</p>
              <h3 className="mt-4 font-display text-[34px] sm:text-[44px] md:text-[52px] leading-[1.05] tracking-[-0.02em] text-[color:var(--color-ink)]">
                We&apos;ll send your written quote inside one business day.
              </h3>
            </div>
            <div className="col-span-12 md:col-span-4 md:text-right">
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Request a quote
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky estimate mini-bar — anchored to bottom, only after user scrolls past the calculator. */}
      <StickyEstimateBar
        estimate={estimate}
        sentinelRef={calculatorEndRef}
      />
    </SiteShell>
  );
}
