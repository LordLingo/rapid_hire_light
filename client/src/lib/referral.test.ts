import { describe, it, expect } from "vitest";
import {
  REFERRAL_TIERS,
  REFERRAL_EXAMPLES,
  resolveTier,
  computeReferral,
  clampBilling,
  MAX_BILLING,
  MIN_BILLING,
} from "./referral";

describe("referral tiers", () => {
  it("matches the PDF's five billing bands and rates", () => {
    expect(REFERRAL_TIERS.map((t) => t.rateLabel)).toEqual([
      "5%",
      "7%",
      "10%",
      "12%",
      "Negotiable",
    ]);
  });

  it("resolves band boundaries to the correct tier", () => {
    expect(resolveTier(1000).rateLabel).toBe("5%");
    expect(resolveTier(1001).rateLabel).toBe("7%");
    expect(resolveTier(5000).rateLabel).toBe("7%");
    expect(resolveTier(5001).rateLabel).toBe("10%");
    expect(resolveTier(20000).rateLabel).toBe("10%");
    expect(resolveTier(20001).rateLabel).toBe("12%");
    expect(resolveTier(50000).rateLabel).toBe("12%");
    expect(resolveTier(50001).rateLabel).toBe("Negotiable");
  });
});

describe("computeReferral matches the PDF's worked examples", () => {
  it("Small: $1,000 @ 5% -> $50/mo, $600/yr", () => {
    const r = computeReferral(1000);
    expect(r.computable).toBe(true);
    expect(r.monthly).toBe(50);
    expect(r.annual).toBe(600);
  });

  it("Growing: $5,000 @ 7% -> $350/mo, $4,200/yr", () => {
    const r = computeReferral(5000);
    expect(r.monthly).toBe(350);
    expect(r.annual).toBe(4200);
  });

  it("Large: $20,000 @ 10% -> $2,000/mo, $24,000/yr", () => {
    const r = computeReferral(20000);
    expect(r.monthly).toBe(2000);
    expect(r.annual).toBe(24000);
  });

  it("every REFERRAL_EXAMPLES row is internally consistent with the tiers", () => {
    for (const ex of REFERRAL_EXAMPLES) {
      const r = computeReferral(ex.billing);
      expect(r.monthly).toBe(ex.monthly);
      expect(r.annual).toBe(ex.annual);
    }
  });

  it("negotiable band is not computable", () => {
    const r = computeReferral(75000);
    expect(r.computable).toBe(false);
    expect(r.tier.rateLabel).toBe("Negotiable");
  });
});

describe("clampBilling", () => {
  it("clamps into the supported range and rounds", () => {
    expect(clampBilling(-500)).toBe(MIN_BILLING);
    expect(clampBilling(999999)).toBe(MAX_BILLING);
    expect(clampBilling(1234.6)).toBe(1235);
  });
});
