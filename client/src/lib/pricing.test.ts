/**
 * Vitest specs for the pricing calculator's pure domain model.
 *
 * Why these tests exist:
 *   - The pricing math is reused by the calculator UI, the sticky bar, the
 *     /contact lead summary, and (eventually) any URL-shared estimate. A
 *     silent regression in `volumeDiscount` thresholds or `computeEstimate`
 *     would propagate everywhere.
 *   - Threshold math is the most failure-prone surface: this is exactly where
 *     the original Standard→Comprehensive misrouting bug came from, so we lock
 *     down both sides of every band (49 vs 50, 99 vs 100, etc.).
 *   - URL parsing is also worth pinning down because it's how shared estimate
 *     links survive product evolution; unknown add-on ids must drop silently
 *     so old links don't 500 future visitors.
 */
import { describe, expect, it } from "vitest";
import {
  ADDONS,
  BASE_PER_CHECK,
  DEFAULT_HIRES,
  DEFAULT_PACKAGE,
  PACKAGES,
  buildEstimateQuery,
  clampHires,
  computeEstimate,
  isDefaultState,
  normalizeAddons,
  normalizePackage,
  parseEstimateFromQuery,
  volumeDiscount,
} from "./pricing";

describe("volumeDiscount", () => {
  it("returns 0 below the first threshold", () => {
    expect(volumeDiscount(1)).toBe(0);
    expect(volumeDiscount(40)).toBe(0);
    expect(volumeDiscount(49)).toBe(0);
  });

  // The original tier-mapping bug came from a band collision; pin both sides.
  it.each([
    [50, 0.05],
    [99, 0.05],
    [100, 0.1],
    [199, 0.1],
    [200, 0.16],
    [499, 0.16],
    [500, 0.22],
    [10000, 0.22],
  ])("returns the right discount at boundary %i hires/mo", (hires, expected) => {
    expect(volumeDiscount(hires)).toBe(expected);
  });
});

describe("computeEstimate", () => {
  it("Starter base only — 40 hires/mo, no add-ons", () => {
    const e = computeEstimate(40, []);
    expect(e.perCheckList).toBe(BASE_PER_CHECK); // $24
    expect(e.perCheckNet).toBe(BASE_PER_CHECK); // no discount under 50
    expect(e.discountPct).toBe(0);
    expect(e.tier).toBe("Starter");
    expect(e.monthly).toBeCloseTo(24 * 40, 6); // $960
    expect(e.annual).toBeCloseTo(24 * 40 * 12, 6); // $11,520
  });

  it("applies the volume discount at exactly 50/mo", () => {
    const e = computeEstimate(50, []);
    expect(e.discountPct).toBe(5);
    expect(e.tier).toBe("Volume");
    // $24 list * 0.95 net = $22.80 per check
    expect(e.perCheckNet).toBeCloseTo(22.8, 6);
    expect(e.monthly).toBeCloseTo(22.8 * 50, 6); // $1,140
    expect(e.annual).toBeCloseTo(22.8 * 50 * 12, 6); // $13,680
  });

  it("annual is always exactly 12x monthly", () => {
    for (const h of [1, 25, 50, 100, 200, 500, 1234]) {
      const e = computeEstimate(h, ["county", "federal"]);
      expect(e.annual).toBeCloseTo(e.monthly * 12, 6);
    }
  });

  it("ignores unknown add-on ids silently (defensive against URL/LS drift)", () => {
    const e = computeEstimate(40, ["county", "definitely-not-a-real-addon"]);
    // base $24 + county $8 = $32, no discount under 50
    expect(e.perCheckList).toBe(32);
    expect(e.perCheckNet).toBe(32);
  });

  it("Standard preset: $24 base + county $8 + employment $14 + education $14 = $60", () => {
    const standard = PACKAGES.find((p) => p.id === "standard")!;
    const e = computeEstimate(40, standard.addons);
    expect(e.perCheckList).toBe(60);
  });

  it("Comprehensive preset: 7 add-ons stacked on the $24 base", () => {
    const comprehensive = PACKAGES.find((p) => p.id === "comprehensive")!;
    const e = computeEstimate(200, comprehensive.addons);
    // sum of: county 8 + federal 10 + employment 14 + education 14 + mvr 9 + drug5 38 + monitoring 6 = 99
    // list = 24 + 99 = 123
    expect(e.perCheckList).toBe(123);
    // 200/mo → 16% discount → 123 * 0.84
    expect(e.perCheckNet).toBeCloseTo(123 * 0.84, 6);
    expect(e.monthly).toBeCloseTo(123 * 0.84 * 200, 6);
  });

  it("does not mutate inputs", () => {
    const selected = ["county"];
    const before = [...selected];
    computeEstimate(40, selected);
    expect(selected).toEqual(before);
  });
});

describe("clampHires", () => {
  it("clamps below MIN", () => {
    expect(clampHires(0)).toBe(1);
    expect(clampHires(-9999)).toBe(1);
  });
  it("clamps above MAX", () => {
    expect(clampHires(10001)).toBe(10000);
    expect(clampHires(99999999)).toBe(10000);
  });
  it("rounds floats", () => {
    expect(clampHires(40.6)).toBe(41);
    expect(clampHires("75.2")).toBe(75);
  });
  it("falls back to default for non-finite input", () => {
    expect(clampHires("not a number")).toBe(DEFAULT_HIRES);
    expect(clampHires(NaN)).toBe(DEFAULT_HIRES);
    expect(clampHires(undefined)).toBe(DEFAULT_HIRES);
    expect(clampHires(null)).toBe(DEFAULT_HIRES);
  });
});

describe("normalizePackage", () => {
  it("accepts known package ids", () => {
    expect(normalizePackage("basic")).toBe("basic");
    expect(normalizePackage("standard")).toBe("standard");
    expect(normalizePackage("comprehensive")).toBe("comprehensive");
  });
  it("rejects unknown ids", () => {
    expect(normalizePackage("enterprise")).toBeNull();
    expect(normalizePackage("")).toBeNull();
    expect(normalizePackage(undefined)).toBeNull();
    expect(normalizePackage(null)).toBeNull();
    expect(normalizePackage(42)).toBeNull();
  });
});

describe("normalizeAddons", () => {
  it("filters unknown ids and dedupes", () => {
    const out = normalizeAddons(["county", "fake", "county", "mvr", 42, "mvr"]);
    expect(out).toEqual(["county", "mvr"]);
  });
  it("returns [] for non-array input", () => {
    expect(normalizeAddons(undefined)).toEqual([]);
    expect(normalizeAddons("county,mvr")).toEqual([]);
  });
});

describe("parseEstimateFromQuery + buildEstimateQuery", () => {
  it("returns null when no calculator params are present", () => {
    expect(parseEstimateFromQuery("")).toBeNull();
    expect(parseEstimateFromQuery("?utm_source=email")).toBeNull();
  });

  it("parses v + pkg + adds together", () => {
    const parsed = parseEstimateFromQuery(
      "?v=200&pkg=comprehensive&adds=county,federal,mvr",
    );
    expect(parsed).not.toBeNull();
    expect(parsed!.hires).toBe(200);
    expect(parsed!.pkg).toBe("comprehensive");
    expect(parsed!.selected).toEqual(["county", "federal", "mvr"]);
  });

  it("clamps out-of-range v silently", () => {
    expect(parseEstimateFromQuery("?v=999999")!.hires).toBe(10000);
    expect(parseEstimateFromQuery("?v=-5")!.hires).toBe(1);
  });

  it("falls back to package defaults for adds when only ?pkg is present", () => {
    const parsed = parseEstimateFromQuery("?pkg=standard");
    expect(parsed!.pkg).toBe("standard");
    expect(parsed!.selected).toEqual(["county", "employment", "education"]);
  });

  it("drops unknown add-on ids silently (forward-compat for shared links)", () => {
    const parsed = parseEstimateFromQuery("?v=40&adds=county,obsolete-id,mvr");
    expect(parsed!.selected).toEqual(["county", "mvr"]);
  });

  it("round-trips state through build → parse", () => {
    const state = {
      hires: 250,
      pkg: "standard" as const,
      selected: ["county", "federal", "mvr"],
    };
    const qs = buildEstimateQuery(state);
    const parsed = parseEstimateFromQuery("?" + qs);
    expect(parsed).toEqual({ ...state });
  });

  it("omits empty adds= from the built query", () => {
    const qs = buildEstimateQuery({ hires: 40, pkg: "basic", selected: [] });
    const params = new URLSearchParams(qs);
    expect(params.has("adds")).toBe(false);
    expect(params.get("v")).toBe("40");
    expect(params.get("pkg")).toBe("basic");
  });

  it("emits an empty query string for the default state (clean URL after Reset)", () => {
    const defaults = PACKAGES.find((p) => p.id === DEFAULT_PACKAGE)!.addons;
    expect(
      buildEstimateQuery({
        hires: DEFAULT_HIRES,
        pkg: DEFAULT_PACKAGE,
        selected: defaults,
      }),
    ).toBe("");
  });
});

describe("isDefaultState", () => {
  const defaultAddons = PACKAGES.find((p) => p.id === DEFAULT_PACKAGE)!.addons;

  it("returns true for the canonical defaults", () => {
    expect(
      isDefaultState({
        hires: DEFAULT_HIRES,
        pkg: DEFAULT_PACKAGE,
        selected: defaultAddons,
      }),
    ).toBe(true);
  });

  it("returns true regardless of add-on insertion order", () => {
    expect(
      isDefaultState({
        hires: DEFAULT_HIRES,
        pkg: DEFAULT_PACKAGE,
        selected: [...defaultAddons].reverse(),
      }),
    ).toBe(true);
  });

  it("returns false when any single field diverges", () => {
    expect(
      isDefaultState({
        hires: DEFAULT_HIRES + 1,
        pkg: DEFAULT_PACKAGE,
        selected: defaultAddons,
      }),
    ).toBe(false);
    expect(
      isDefaultState({
        hires: DEFAULT_HIRES,
        pkg: "basic",
        selected: defaultAddons,
      }),
    ).toBe(false);
    expect(
      isDefaultState({
        hires: DEFAULT_HIRES,
        pkg: DEFAULT_PACKAGE,
        selected: [...defaultAddons, "federal"],
      }),
    ).toBe(false);
  });
});

describe("ADDONS / PACKAGES sanity", () => {
  it("every PACKAGE.addons entry is a known ADDON id", () => {
    const known = new Set(ADDONS.map((a) => a.id));
    for (const p of PACKAGES) {
      for (const a of p.addons) {
        expect(known.has(a)).toBe(true);
      }
    }
  });
});
