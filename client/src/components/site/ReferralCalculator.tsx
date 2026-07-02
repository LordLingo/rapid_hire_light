/*
  Referral earnings calculator — modeled on the pricing-page PricingCalculator
  (same editorial-calm shell: number input + quick-set chips on the left, a
  bordered totals card on the right). Instead of estimating a buyer's spend,
  it estimates a *partner's* monthly and annual revenue share for one referred
  client, using the exact stepped-tier math from @/lib/referral (traced to the
  program PDF).

  The number the partner types is the referred client's ELIGIBLE monthly Rapid
  Hire billing. The calculator resolves the tier, shows the applicable share
  percentage, and renders monthly + annual payout. The negotiable top band
  ($50,001+) has no fixed rate, so we surface a "let's talk" state rather than
  fabricate a figure.
*/
import { useMemo, useState } from "react";
import { RotateCcw, ArrowUpRight } from "lucide-react";
import {
  REFERRAL_EXAMPLES,
  DEFAULT_BILLING,
  MIN_BILLING,
  MAX_BILLING,
  clampBilling,
  computeReferral,
} from "@/lib/referral";

function fmtMoney(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

const QUICK_SET = REFERRAL_EXAMPLES.map((ex) => ({
  v: ex.billing,
  label: `${ex.name} · ${fmtMoney(ex.billing)}`,
}));

export default function ReferralCalculator() {
  const [billing, setBilling] = useState<number>(DEFAULT_BILLING);
  const est = useMemo(() => computeReferral(billing), [billing]);

  return (
    <section
      id="referral-estimate"
      className="bg-white border-y border-border scroll-mt-24"
    >
      <div className="container py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-10 gap-y-8 items-end">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow">Estimate your earnings</p>
            <div className="mt-3 hairline" />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <h2 className="font-display text-[30px] sm:text-[40px] leading-[1.08] tracking-[-0.02em] text-[color:var(--color-ink)]">
              See what a referral{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                could pay you.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.8] text-[color:var(--color-ink-soft)]">
              Enter a referred client's eligible monthly Rapid Hire billing. The
              estimate updates live using the program's revenue-share tiers.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row gap-x-10 gap-y-10">
          {/* LEFT — input */}
          <div className="w-full lg:w-[58%] min-w-0">
            <div className="rounded-[16px] border border-border bg-[color:var(--color-paper)] p-6 md:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <label htmlFor="ref-calc-billing" className="eyebrow">
                    Client's monthly RHS billing
                  </label>
                  <p className="mt-1 text-[13px] text-[color:var(--color-ink-soft)]">
                    Eligible background-check billing per month.
                  </p>
                </div>
                <div className="text-right">
                  <p className="eyebrow">Your share</p>
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-accent-ink)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-accent-ink)]">
                    <span className="size-1.5 rounded-full bg-[color:var(--color-accent-ink)]" />
                    {est.tier.rateLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setBilling((b) => clampBilling(b - 500))
                  }
                  aria-label="Decrease monthly billing by $500"
                  className="btn-press grid place-items-center size-12 shrink-0 rounded-[12px] border border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">−</span>
                </button>
                <div className="relative w-full flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-display text-[24px] text-[color:var(--color-ink-muted)]">
                    $
                  </span>
                  <input
                    id="ref-calc-billing"
                    type="number"
                    inputMode="numeric"
                    min={MIN_BILLING}
                    max={MAX_BILLING}
                    step={100}
                    value={billing}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "") return;
                      const n = Number(raw);
                      if (Number.isFinite(n)) setBilling(clampBilling(n));
                    }}
                    onBlur={(e) => setBilling(clampBilling(e.target.value))}
                    className="w-full rounded-[12px] border border-border bg-white pl-9 pr-4 py-3 font-display text-[28px] leading-none tracking-[-0.01em] text-[color:var(--color-ink)] tabular-nums focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent-ink)]/40 focus:border-[color:var(--color-accent-ink)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setBilling((b) => clampBilling(b + 500))
                  }
                  aria-label="Increase monthly billing by $500"
                  className="btn-press grid place-items-center size-12 shrink-0 rounded-[12px] border border-border bg-white text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]"
                >
                  <span aria-hidden="true" className="text-[20px] leading-none">+</span>
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                  Quick set
                </span>
                {QUICK_SET.map(({ v, label }) => {
                  const active = billing === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBilling(v)}
                      className={[
                        "btn-press rounded-full border px-3 py-1.5 text-[12px] tabular-nums transition-colors",
                        active
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                          : "border-border bg-white text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)]",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-[11.5px] text-[color:var(--color-ink-muted)]">
                  Your share rate steps up at $1K, $5K, $20K, and $50K of
                  monthly billing.
                </p>
                <button
                  type="button"
                  onClick={() => setBilling(DEFAULT_BILLING)}
                  className="btn-press inline-flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-[11.5px] text-[color:var(--color-ink-soft)] hover:border-border hover:text-[color:var(--color-accent-ink)]"
                  aria-label="Reset billing to default"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — totals */}
          <aside className="w-full lg:w-[42%] min-w-0">
            <div className="rounded-[20px] border border-[color:var(--color-accent-ink)] bg-[color:var(--color-paper)] p-7 md:p-9 paper-shadow">
              <p className="eyebrow">Your estimated payout</p>

              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="text-[14px] text-[color:var(--color-ink-soft)]">
                  Tier
                </span>
                <span className="font-display text-[20px] leading-none tracking-tight text-[color:var(--color-ink)]">
                  {est.tier.label} · {est.tier.rateLabel}
                </span>
              </div>

              <div className="mt-6 hairline" />

              {est.computable ? (
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <p className="eyebrow">Monthly</p>
                    <p className="mt-2 font-display text-[34px] leading-none tracking-[-0.02em] text-[color:var(--color-ink)] tabular-nums">
                      {fmtMoney(est.monthly)}
                    </p>
                    <p className="mt-1 text-[11.5px] text-[color:var(--color-ink-muted)]">
                      per referred client
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow">Annual</p>
                    <p className="mt-2 font-display text-[34px] leading-none tracking-[-0.02em] text-[color:var(--color-accent-ink)] tabular-nums">
                      {fmtMoney(est.annual)}
                    </p>
                    <p className="mt-1 text-[11.5px] text-[color:var(--color-ink-muted)]">
                      if they stay 12 months
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="font-display text-[26px] leading-tight tracking-tight text-[color:var(--color-ink)]">
                    Let's talk numbers.
                  </p>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    Clients billing over {fmtMoney(50000)} a month fall into our
                    negotiable band — the share is set individually and can go
                    beyond the published tiers. Reach out and we'll size it with
                    you.
                  </p>
                </div>
              )}

              <a
                href="#referral-interest"
                className="mt-8 btn-press inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-7 py-3.5 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Become a referral partner
                <ArrowUpRight className="size-4" />
              </a>

              <p className="mt-5 text-[11.5px] leading-relaxed text-[color:var(--color-ink-muted)]">
                Illustrative estimate only. Referral percentages apply to
                eligible monthly billing and exclude pass-through expenses.
                Actual payouts are governed by the full program terms and your
                signed referral agreement.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
