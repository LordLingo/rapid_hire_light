/*
  §220 — Unit tests for the staffing LP support lib (client/src/lib/staffingLp.ts).

  Covers the pure savings math, the UTM/gclid capture+persist+load round-trip
  (with a stubbed sessionStorage, since the vitest env is Node with no DOM),
  and the Google-Ads conversion hook's GTM-first behavior. No React rendering.
*/

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureTrackingParams,
  persistTrackingParams,
  loadTrackingParams,
  initTracking,
  computeStaffingSavings,
  formatUsd,
  fireLeadConversion,
  ILLUSTRATIVE_EFFICIENCY_FACTOR,
  GOOGLE_ADS_CONVERSION_SEND_TO,
  STAFFING_LP_TRACKING_KEY,
  TRACKING_PARAM_KEYS,
} from "./staffingLp";

/* ---- sessionStorage stub (Node test env has no DOM) -------------- */
function makeSessionStorageStub() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    _store: store,
  };
}

describe("§220 staffingLp — savings calculator", () => {
  it("computes monthly/annual savings with the illustrative factor", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 100,
      hoursPerCheck: 1,
      loadedHourlyCost: 35,
    });
    // 100 * 1 * 0.6 = 60 hrs; 60 * $35 = $2,100/mo; *12 = $25,200/yr
    expect(r.hoursSavedPerMonth).toBe(60);
    expect(r.monthlySavings).toBe(2100);
    expect(r.annualSavings).toBe(25200);
    expect(r.efficiencyFactor).toBe(ILLUSTRATIVE_EFFICIENCY_FACTOR);
  });

  it("clamps negative / NaN inputs to safe floors", () => {
    const r = computeStaffingSavings({
      checksPerMonth: -50,
      hoursPerCheck: Number.NaN,
      loadedHourlyCost: -10,
    });
    expect(r.monthlySavings).toBe(0);
    expect(r.annualSavings).toBe(0);
    expect(r.hoursSavedPerMonth).toBe(0);
  });

  it("annual is always 12x monthly", () => {
    const r = computeStaffingSavings({
      checksPerMonth: 250,
      hoursPerCheck: 1.5,
      loadedHourlyCost: 40,
    });
    expect(r.annualSavings).toBe(r.monthlySavings * 12);
  });

  it("formatUsd renders whole-dollar amounts with separators", () => {
    expect(formatUsd(2100)).toBe("$2,100");
    expect(formatUsd(25200)).toBe("$25,200");
    expect(formatUsd(0)).toBe("$0");
    expect(formatUsd(Number.NaN)).toBe("$0");
  });
});

describe("§220 staffingLp — tracking capture", () => {
  it("captures only recognized, non-empty params", () => {
    const got = captureTrackingParams(
      "?utm_source=google&utm_medium=cpc&gclid=ABC123&utm_term=&foo=bar",
    );
    expect(got).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      gclid: "ABC123",
    });
    expect(got).not.toHaveProperty("utm_term");
    expect(got).not.toHaveProperty("foo");
  });

  it("handles a search string without the leading '?'", () => {
    const got = captureTrackingParams("utm_campaign=staffing_q3");
    expect(got.utm_campaign).toBe("staffing_q3");
  });

  it("recognizes the full key set", () => {
    expect(TRACKING_PARAM_KEYS).toContain("gclid");
    expect(TRACKING_PARAM_KEYS).toContain("gbraid");
    expect(TRACKING_PARAM_KEYS).toContain("wbraid");
    expect(TRACKING_PARAM_KEYS).toContain("msclkid");
  });
});

describe("§220 staffingLp — persist/load round-trip", () => {
  beforeEach(() => {
    vi.stubGlobal("sessionStorage", makeSessionStorageStub());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("persists then loads the same params", () => {
    persistTrackingParams({ utm_source: "google", gclid: "X1" });
    expect(loadTrackingParams()).toEqual({ utm_source: "google", gclid: "X1" });
  });

  it("merges new params over prior ones without wiping attribution", () => {
    persistTrackingParams({ utm_source: "google", gclid: "X1" });
    persistTrackingParams({ utm_medium: "cpc" });
    expect(loadTrackingParams()).toEqual({
      utm_source: "google",
      gclid: "X1",
      utm_medium: "cpc",
    });
  });

  it("initTracking captures + persists + returns the merged set", () => {
    persistTrackingParams({ utm_campaign: "prior" });
    const out = initTracking("?utm_source=google&gclid=Z9");
    expect(out.utm_campaign).toBe("prior");
    expect(out.utm_source).toBe("google");
    expect(out.gclid).toBe("Z9");
  });

  it("loadTrackingParams returns {} for malformed JSON", () => {
    sessionStorage.setItem(STAFFING_LP_TRACKING_KEY, "{not json");
    expect(loadTrackingParams()).toEqual({});
  });

  it("uses the namespaced sessionStorage key", () => {
    persistTrackingParams({ gclid: "K" });
    expect(sessionStorage.getItem(STAFFING_LP_TRACKING_KEY)).toContain("gclid");
  });
});

describe("§220 staffingLp — tracking is no-op without storage", () => {
  it("does not throw and returns {} when sessionStorage is undefined", () => {
    vi.stubGlobal("sessionStorage", undefined);
    expect(() => persistTrackingParams({ gclid: "A" })).not.toThrow();
    expect(loadTrackingParams()).toEqual({});
    vi.unstubAllGlobals();
  });
});

describe("§220 staffingLp — conversion hook", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns a no-fire report when window is undefined (SSR/test)", () => {
    // window is not defined in the Node test env by default
    const report = fireLeadConversion();
    expect(report.pushedDataLayer).toBe(false);
    expect(report.firedGtag).toBe(false);
  });

  it("pushes a generate_lead dataLayer event when window exists", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { dataLayer });
    const report = fireLeadConversion();
    expect(report.pushedDataLayer).toBe(true);
    expect(report.firedGtag).toBe(false); // send-to still placeholder
    expect(dataLayer).toHaveLength(1);
    expect((dataLayer[0] as Record<string, unknown>).event).toBe("generate_lead");
    expect((dataLayer[0] as Record<string, unknown>).lead_source).toBe("staffing_lp");
  });

  it("does not fire gtag while the send-to is the empty placeholder", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { dataLayer: [], gtag });
    const report = fireLeadConversion();
    expect(report.firedGtag).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("keeps the conversion send-to a string (placeholder until owner sets it)", () => {
    expect(typeof GOOGLE_ADS_CONVERSION_SEND_TO).toBe("string");
  });
});
