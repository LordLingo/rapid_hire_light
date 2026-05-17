/*
  §83 — RoiCalculator
  --------------------
  A bad-hire / time-to-hire ROI estimator that complements PricingCalculator
  on /pricing. PricingCalculator answers "what will I spend?" — RoiCalculator
  answers "what does that spend save me?".

  Inputs (all client-side, no submission):
    - Hires per year
    - Avg time-to-hire today (days)
    - Avg fully-loaded annual cost per role ($)
    - Bad-hire rate today (%)

  Math (transparent — three lines, all rendered):

    Time-to-hire savings   = hires × max(0, currentTAT − 6) × dailyHoldingCost
                             where dailyHoldingCost = annualCost / 220 working days
                             and 6 days is our typical day-1 onboarding TAT
                             after wiring the ATS integration.

    Bad-hire reduction     = hires × badHireRate × replacementCost × 0.30
                             where replacementCost = annualCost × 0.50 (SHRM)
                             and 0.30 is the empirical reduction we see when
                             a real adjudication matrix and continuous monitor
                             replace ad-hoc decisions.

    Total                  = sum of the two.

  We render the math literally so buyers can sanity-check it and we
  intentionally use conservative multipliers (0.5 SHRM lower-bound,
  not the McKinsey 2× upper-bound).

  No PII collected; no form submission; no server round-trip. The CTA at
  the bottom is a Link to /contact?topic=roi.
*/
import { useMemo, useState } from "react";
import { ArrowRight, Calculator } from "lucide-react";
import { Link } from "wouter";

const WORKING_DAYS_PER_YEAR = 220;
const TARGET_TAT_DAYS = 6; // post-integration day-1 TAT
const SHRM_REPLACEMENT_FRACTION = 0.5; // 50% of annual loaded cost
const REDUCTION_FACTOR = 0.3; // 30% bad-hire reduction

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function RoiCalculator() {
  const [hires, setHires] = useState(150);
  const [tatDays, setTatDays] = useState(14);
  const [annualCost, setAnnualCost] = useState(85_000);
  const [badHireRatePct, setBadHireRatePct] = useState(8);

  const calc = useMemo(() => {
    const dailyHoldingCost = annualCost / WORKING_DAYS_PER_YEAR;
    const tatGain = Math.max(0, tatDays - TARGET_TAT_DAYS);
    const tatSavings = hires * tatGain * dailyHoldingCost;

    const replacementCost = annualCost * SHRM_REPLACEMENT_FRACTION;
    const badHireRate = badHireRatePct / 100;
    const badHireSavings =
      hires * badHireRate * replacementCost * REDUCTION_FACTOR;

    return {
      dailyHoldingCost,
      tatGain,
      tatSavings,
      replacementCost,
      badHireSavings,
      total: tatSavings + badHireSavings,
    };
  }, [hires, tatDays, annualCost, badHireRatePct]);

  return (
    <section
      id="roi"
      data-testid="roi-calculator"
      className="bg-[color:var(--color-paper-soft)]"
    >
      <div className="container py-20 md:py-24">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
            <p className="eyebrow flex items-center gap-2">
              <Calculator className="h-3.5 w-3.5" />
              ROI · Bad-hire + TAT
            </p>
            <h2 className="mt-4 font-display text-[28px] sm:text-[34px] md:text-[40px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
              What does the screening{" "}
              <span className="italic font-light text-[color:var(--color-accent-ink)]">
                save you?
              </span>
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.75] text-[color:var(--color-ink-soft)]">
              The pricing calculator above answers "what will I spend?". This
              one answers "what does that spend save me?" — by combining the
              time-to-hire savings from a faster TAT with the bad-hire
              reduction from a real adjudication matrix.
            </p>
            <p className="mt-4 text-[12.5px] text-[color:var(--color-ink-muted)] leading-snug">
              We use SHRM's lower-bound replacement cost (50% of annual
              loaded cost) and a 30% bad-hire reduction multiplier — both
              deliberately conservative.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 reveal-on-scroll">
            <div className="rounded-[16px] border border-border bg-white p-6 md:p-8 paper-shadow">
              {/* Inputs */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Field
                  label="Hires per year"
                  value={hires}
                  min={10}
                  max={5000}
                  step={10}
                  onChange={setHires}
                  hint="Including replacements and net-new headcount."
                />
                <Field
                  label="Time-to-hire today (days)"
                  value={tatDays}
                  min={1}
                  max={60}
                  step={1}
                  onChange={setTatDays}
                  hint="From offer-accepted to candidate cleared to start."
                />
                <Field
                  label="Avg loaded cost per role ($/yr)"
                  value={annualCost}
                  min={30000}
                  max={300000}
                  step={5000}
                  onChange={setAnnualCost}
                  hint="Salary + benefits + employer taxes + footprint."
                  format="usd"
                />
                <Field
                  label="Bad-hire rate today (%)"
                  value={badHireRatePct}
                  min={0}
                  max={30}
                  step={1}
                  onChange={setBadHireRatePct}
                  hint="Hires you'd undo within 12 months if you could."
                />
              </div>

              {/* Math output */}
              <div className="mt-8 rounded-[12px] border border-border bg-[color:var(--color-paper-soft)] p-5">
                <p className="eyebrow">The math, line by line</p>
                <ul className="mt-3 space-y-2 text-[13.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                  <li>
                    Daily holding cost ={" "}
                    <span className="font-mono text-[color:var(--color-ink)]">
                      {fmtUSD(calc.dailyHoldingCost)}/day
                    </span>{" "}
                    (annual cost ÷ {WORKING_DAYS_PER_YEAR} working days)
                  </li>
                  <li>
                    TAT savings = {hires} × {calc.tatGain}d ×{" "}
                    {fmtUSD(calc.dailyHoldingCost)}/d ={" "}
                    <span className="font-mono text-[color:var(--color-ink)]">
                      {fmtUSD(calc.tatSavings)}
                    </span>
                  </li>
                  <li>
                    Bad-hire savings = {hires} × {badHireRatePct}% ×{" "}
                    {fmtUSD(calc.replacementCost)} × {REDUCTION_FACTOR * 100}% ={" "}
                    <span className="font-mono text-[color:var(--color-ink)]">
                      {fmtUSD(calc.badHireSavings)}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Total */}
              <div className="mt-6 grid sm:grid-cols-12 gap-6 items-end">
                <div className="sm:col-span-7">
                  <p className="eyebrow">Estimated annual savings</p>
                  <p
                    className="mt-2 font-display text-[44px] sm:text-[56px] md:text-[64px] leading-none tracking-[-0.02em] text-[color:var(--color-accent-ink)]"
                    data-testid="roi-total"
                  >
                    {fmtUSD(calc.total)}
                  </p>
                  <p className="mt-2 text-[12px] text-[color:var(--color-ink-muted)]">
                    Estimate only · figures depend on your specific role mix +
                    current screening provider.
                  </p>
                </div>
                <div className="sm:col-span-5 sm:justify-self-end">
                  <Link
                    href="/contact?topic=roi"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-6 py-3.5 text-sm font-medium text-white hover:opacity-95 transition"
                  >
                    Get a tailored estimate
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  min,
  max,
  step,
  onChange,
  hint,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  hint: string;
  format?: "usd";
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[color:var(--color-ink)]">
        {label}
      </span>
      <div className="mt-2 flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[color:var(--color-brand-blue)]"
        />
        <span className="font-mono text-[14px] tabular-nums text-[color:var(--color-ink)] min-w-[5.5rem] text-right">
          {format === "usd"
            ? fmtUSD(value)
            : value.toLocaleString("en-US")}
        </span>
      </div>
      <span className="mt-1 block text-[11.5px] text-[color:var(--color-ink-muted)]">
        {hint}
      </span>
    </label>
  );
}
