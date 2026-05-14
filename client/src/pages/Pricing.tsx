/*
  Editorial Calm — Pricing page
  Layout:
   - PageHero with eyebrow "Pricing".
   - Two-tier pricing cards (Starter / Volume) on hairline grid, no boxy shadows.
   - "What's included" comparison list.
   - Add-ons row (chips).
   - FAQ short strip.
   - Closing CTA → /contact.
*/
import { Link } from "wouter";
import { ArrowUpRight, Check } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";

const TIERS = [
  {
    eyebrow: "01 — Starter",
    name: "Starter",
    price: "$24",
    unit: "per check, billed monthly",
    blurb:
      "For teams hiring fewer than 50 people a year. No platform fee, no minimums — just per-check pricing on the screens you actually run.",
    cta: "Request a quote",
    features: [
      "SSN trace + nationwide criminal database",
      "County criminal search (1 jurisdiction)",
      "FCRA-compliant disclosures + e-sign",
      "Mobile candidate experience",
      "U.S.-based support, same-day response",
    ],
  },
  {
    eyebrow: "02 — Volume",
    name: "Volume",
    price: "Custom",
    unit: "per-check pricing scales with hiring volume",
    blurb:
      "For teams hiring 50+ a year, or running multi-jurisdiction, drug, MVR, education, or international screens. Includes ATS integration + dedicated CSM.",
    cta: "Talk to sales",
    featured: true,
    features: [
      "Everything in Starter",
      "Unlimited county / federal jurisdictions",
      "Drug & health (12,000+ collection sites)",
      "Motor Vehicle Reports (all 50 states)",
      "Education + employment verification",
      "Native ATS / HRIS integrations",
      "Dedicated Customer Success Manager",
    ],
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

      {/* Tiers */}
      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-10 gap-y-10">
            {TIERS.map((t) => (
              <article
                key={t.name}
                className={[
                  "reveal-on-scroll col-span-12 lg:col-span-6 rounded-[20px] border p-8 md:p-10",
                  t.featured
                    ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-paper)]"
                    : "border-border bg-white",
                ].join(" ")}
              >
                <p className="eyebrow">{t.eyebrow}</p>
                <h3 className="mt-4 font-display text-[36px] md:text-[44px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
                  {t.name}
                </h3>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-[44px] md:text-[56px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)]">
                    {t.price}
                  </span>
                  <span className="text-[13px] text-[color:var(--color-ink-muted)] uppercase tracking-wider">
                    {t.unit}
                  </span>
                </div>
                <p className="mt-6 text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)] max-w-prose">
                  {t.blurb}
                </p>

                <ul className="mt-8 space-y-3.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-[3px] grid place-items-center size-5 shrink-0 rounded-full border border-border text-[color:var(--color-accent-ink)]">
                        <Check className="size-3" strokeWidth={2} />
                      </span>
                      <span className="text-[14.5px] leading-[1.6] text-[color:var(--color-ink)]">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Link
                    href="/contact"
                    className={[
                      "btn-press inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-medium",
                      t.featured
                        ? "bg-[color:var(--color-accent-ink)] text-white hover:bg-[color:var(--color-accent-ink-strong)]"
                        : "border border-[color:var(--color-ink)] text-[color:var(--color-ink)] hover:bg-[color:var(--color-accent-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-white",
                    ].join(" ")}
                  >
                    {t.cta}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — Add-ons</p>
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
              <p className="eyebrow">07 — Pricing FAQ</p>
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
              <p className="eyebrow">08 — Get a quote</p>
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
    </SiteShell>
  );
}
