/*
  §218 — Regression specs for the staffing LP pure helpers.

  These pin the behaviors the marketing/legal review depends on:
    - the savings widget never invents a figure beyond the visitor's own
      inputs and the (capped, clamped) assumed per-check saving;
    - non-finite / negative inputs can never render NaN or negative dollars;
    - UTM/gclid capture reads only the canonical keys, persists, and merges
      with the right precedence;
    - the conversion hook is side-effect-safe when gtag is absent.
*/
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  UTM_PARAM_KEYS,
  TRACKING_STORAGE_KEY,
  DEFAULT_ASSUMED_SAVING_PER_CHECK,
  GOOGLE_ADS_CONVERSION_SEND_TO,
  computeStaffingSavings,
  formatUsd,
  readTrackingParams,
  mergeTrackingParams,
  persistTrackingParams,
  loadTrackingParams,
  fireLeadConversion,
} from "./staffingLp";

describe("§218 computeStaffingSavings", () => {
  it("multiplies the assumed per-check saving by monthly volume", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 100,
      currentCostPerCheck: 35,
      assumedSavingPerCheck: 5,
    });
    expect(r.monthlySaving).toBe(500);
    expect(r.annualSaving).toBe(6000);
    expect(r.newCostPerCheck).toBe(30);
    expect(r.currentMonthly).toBe(3500);
  });

  it("defaults the assumed saving to the exported constant", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 10,
      currentCostPerCheck: 40,
    });
    expect(r.assumedSavingPerCheck).toBe(DEFAULT_ASSUMED_SAVING_PER_CHECK);
    expect(r.monthlySaving).toBe(10 * DEFAULT_ASSUMED_SAVING_PER_CHECK);
  });

  it("caps the per-check saving at the current cost (never negative cost)", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 50,
      currentCostPerCheck: 3,
      assumedSavingPerCheck: 999,
    });
    expect(r.assumedSavingPerCheck).toBe(3);
    expect(r.newCostPerCheck).toBe(0);
    expect(r.monthlySaving).toBe(150);
  });

  it("clamps non-finite / negative inputs to 0 (never NaN)", () => {
    const r = computeStaffingSavings({
      checksPerMonth: Number.NaN,
      currentCostPerCheck: -10,
      assumedSavingPerCheck: -5,
    });
    expect(r.checksPerMonth).toBe(0);
    expect(r.currentCostPerCheck).toBe(0);
    expect(r.monthlySaving).toBe(0);
    expect(r.annualSaving).toBe(0);
    expect(Number.isNaN(r.monthlySaving)).toBe(false);
  });

  it("floors fractional check counts", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 10.9,
      currentCostPerCheck: 20,
      assumedSavingPerCheck: 2,
    });
    expect(r.checksPerMonth).toBe(10);
    expect(r.monthlySaving).toBe(20);
  });
});

describe("§218 formatUsd", () => {
  it("renders whole-dollar USD without cents", () => {
    expect(formatUsd(6000)).toBe("$6,000");
    expect(formatUsd(0)).toBe("$0");
  });
  it("never throws on non-finite input", () => {
    expect(formatUsd(Number.NaN)).toBe("$0");
  });
});

describe("§218 tracking params", () => {
  it("exposes the canonical hidden-field keys in order", () => {
    expect(UTM_PARAM_KEYS).toEqual([
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "gclid",
    ]);
  });

  it("reads only canonical keys and trims, dropping empties", () => {
    const got = readTrackingParams(
      "?utm_source=google&utm_medium=cpc&gclid=abc123&utm_term=%20&foo=bar",
    );
    expect(got).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      gclid: "abc123",
    });
  });

  it("handles a search string without leading ?", () => {
    expect(readTrackingParams("utm_campaign=spring")).toEqual({
      utm_campaign: "spring",
    });
  });

  it("merges with incoming non-empty values winning over the cache", () => {
    const merged = mergeTrackingParams(
      { utm_source: "old", utm_medium: "email" },
      { utm_source: "google", gclid: "xyz" },
    );
    expect(merged).toEqual({
      utm_source: "google",
      utm_medium: "email",
      gclid: "xyz",
    });
  });

  it("ignores empty incoming values during merge (keeps cache)", () => {
    const merged = mergeTrackingParams(
      { utm_source: "google" },
      { utm_source: "  " },
    );
    expect(merged).toEqual({ utm_source: "google" });
  });
});

describe("§218 sessionStorage persistence", () => {
  // Node has no global sessionStorage; stub a minimal in-memory shim so we
  // exercise the real persist/load round-trip (the lib guards on
  // `typeof sessionStorage === 'undefined'`).
  beforeEach(() => {
    let store: Record<string, string> = {};
    vi.stubGlobal("sessionStorage", {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
      clear: () => {
        store = {};
      },
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("round-trips through persist/load", () => {
    persistTrackingParams({ utm_source: "google", gclid: "g1" });
    expect(loadTrackingParams()).toEqual({ utm_source: "google", gclid: "g1" });
    expect(sessionStorage.getItem(TRACKING_STORAGE_KEY)).toBeTruthy();
  });

  it("returns {} when nothing is stored", () => {
    expect(loadTrackingParams()).toEqual({});
  });

  it("returns {} on corrupt stored JSON", () => {
    sessionStorage.setItem(TRACKING_STORAGE_KEY, "{not json");
    expect(loadTrackingParams()).toEqual({});
  });
});

describe("§218 fireLeadConversion", () => {
  // vitest runs in a node environment with no `window`; stub a minimal one
  // (mirrors the established pattern in contactShrmAttribution.test.ts).
  let fakeWindow: { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  beforeEach(() => {
    fakeWindow = {};
    vi.stubGlobal("window", fakeWindow);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pushes a dataLayer event and is safe without gtag", () => {
    expect(() => fireLeadConversion({ form: "staffing_lp" })).not.toThrow();
    expect(Array.isArray(fakeWindow.dataLayer)).toBe(true);
    expect(fakeWindow.dataLayer?.[0]).toMatchObject({
      event: "staffing_lp_lead_submit",
      form: "staffing_lp",
    });
  });

  it("calls gtag conversion with the placeholder send_to when present", () => {
    const gtag = vi.fn();
    fakeWindow.gtag = gtag;
    fireLeadConversion({ company: "Acme" });
    expect(gtag).toHaveBeenCalledWith(
      "event",
      "conversion",
      expect.objectContaining({ send_to: GOOGLE_ADS_CONVERSION_SEND_TO, company: "Acme" }),
    );
  });
});
