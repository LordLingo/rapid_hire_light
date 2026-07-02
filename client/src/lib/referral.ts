/*
  Referral Partner Program — revenue-share math.

  Source of truth: RHSBackgroundChecksReferralPartnerProgram.pdf.
  Marketing/source notes mirrored in marketing/referral-program-source-notes.md.

  Model (from the PDF's "Monthly revenue share" table). The partner earns a
  percentage of the *eligible* monthly Rapid Hire billing for each referred
  client. The percentage is a stepped tier based on that monthly billing:

    Up to $1,000        → 5%
    $1,001 – $5,000     → 7%
    $5,001 – $20,000    → 10%
    $20,001 – $50,000   → 12%
    $50,001+            → Negotiable (no fixed %)

  Paid net 15 calendar days after Rapid Hire receives payment from the
  referred client. Percentages exclude pass-through expenses (court fees,
  third-party verification fees, state fees, communications). This module
  computes an ILLUSTRATIVE estimate only — actual payouts are governed by the
  full program terms and the signed referral agreement.
*/

export type ReferralTier = {
  id: string;
  /** Human label for the billing band. */
  label: string;
  /** Inclusive lower bound of eligible monthly billing (USD). */
  min: number;
  /** Inclusive upper bound, or null for the open-ended top band. */
  max: number | null;
  /** Fixed partner share as a fraction (0.05 = 5%), or null when negotiable. */
  rate: number | null;
  /** Display string for the share column ("5%", "Negotiable"). */
  rateLabel: string;
};

export const REFERRAL_TIERS: ReferralTier[] = [
  { id: "t1", label: "Up to $1,000", min: 0, max: 1000, rate: 0.05, rateLabel: "5%" },
  { id: "t2", label: "$1,001 – $5,000", min: 1001, max: 5000, rate: 0.07, rateLabel: "7%" },
  { id: "t3", label: "$5,001 – $20,000", min: 5001, max: 20000, rate: 0.1, rateLabel: "10%" },
  { id: "t4", label: "$20,001 – $50,000", min: 20001, max: 50000, rate: 0.12, rateLabel: "12%" },
  { id: "t5", label: "$50,001+", min: 50001, max: null, rate: null, rateLabel: "Negotiable" },
];

/** Worked examples straight from the PDF's three cards. */
export type ReferralExample = {
  id: string;
  name: string;
  billing: number;
  shareLabel: string;
  monthly: number;
  annual: number;
};

export const REFERRAL_EXAMPLES: ReferralExample[] = [
  { id: "small", name: "Small", billing: 1000, shareLabel: "5% share", monthly: 50, annual: 600 },
  { id: "growing", name: "Growing", billing: 5000, shareLabel: "7% share", monthly: 350, annual: 4200 },
  { id: "large", name: "Large", billing: 20000, shareLabel: "10% share", monthly: 2000, annual: 24000 },
];

export const MIN_BILLING = 0;
export const MAX_BILLING = 100000;
export const DEFAULT_BILLING = 5000;

/** Clamp arbitrary user input into the supported billing range as an integer. */
export function clampBilling(n: number | string): number {
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return DEFAULT_BILLING;
  return Math.min(MAX_BILLING, Math.max(MIN_BILLING, Math.round(num)));
}

/** Resolve which tier a given eligible monthly billing falls into. */
export function resolveTier(billing: number): ReferralTier {
  const b = clampBilling(billing);
  for (const t of REFERRAL_TIERS) {
    if (t.max === null) {
      if (b >= t.min) return t;
    } else if (b >= t.min && b <= t.max) {
      return t;
    }
  }
  // Fallback should never hit, but keep the type total.
  return REFERRAL_TIERS[0];
}

export type ReferralEstimate = {
  billing: number;
  tier: ReferralTier;
  /** True when the tier has a fixed rate we can compute against. */
  computable: boolean;
  monthly: number;
  annual: number;
};

/**
 * Compute the illustrative referral payout for a single referred client at a
 * given eligible monthly billing figure. For the negotiable top band we
 * cannot compute a fixed number, so `computable` is false and monthly/annual
 * are 0 — the UI surfaces a "let's talk" state instead of a dollar figure.
 */
export function computeReferral(billing: number): ReferralEstimate {
  const b = clampBilling(billing);
  const tier = resolveTier(b);
  if (tier.rate === null) {
    return { billing: b, tier, computable: false, monthly: 0, annual: 0 };
  }
  const monthly = Math.round(b * tier.rate);
  return { billing: b, tier, computable: true, monthly, annual: monthly * 12 };
}
