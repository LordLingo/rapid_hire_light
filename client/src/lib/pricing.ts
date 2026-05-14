/**
 * Pricing calculator — pure domain model.
 *
 * Lifted out of `components/site/PricingCalculator.tsx` so the math is:
 *   1. Trivially unit-testable (no React, no DOM).
 *   2. Reusable on the server for /contact lead-summary generation if needed.
 *   3. Stable enough to ship behind URL-shared estimate links.
 *
 * Conventions:
 *   - "list" prices are pre-discount (sum of base + add-ons).
 *   - "net" prices are post-volume-discount per check.
 *   - Money is in USD floats; rounding is presentation-only and lives in
 *     the formatter helpers, not the math.
 */

// ---------- Constants ----------

/** Base SSN trace + nationwide criminal — Starter base, in USD per check. */
export const BASE_PER_CHECK = 24;

/** Hard ceiling we accept from any input source (URL, LS, manual entry). */
export const MAX_HIRES = 10000;

/** Floor we accept from any input source. */
export const MIN_HIRES = 1;

/** Defaults the calculator falls back to when no LS / URL state is present. */
export const DEFAULT_HIRES = 40;
export const DEFAULT_PACKAGE: PackageId = "standard";

export type Addon = { id: string; label: string; price: number };

export const ADDONS: Addon[] = [
  { id: "county", label: "Additional county criminal (per jurisdiction)", price: 8 },
  { id: "federal", label: "Federal criminal", price: 10 },
  { id: "mvr", label: "Motor Vehicle Report (MVR)", price: 9 },
  { id: "drug5", label: "Drug screen — 5 panel", price: 38 },
  { id: "education", label: "Education verification", price: 14 },
  { id: "employment", label: "Employment verification (per employer)", price: 14 },
  { id: "intl", label: "International criminal", price: 55 },
  { id: "credit", label: "Credit report (FCRA)", price: 16 },
  { id: "social", label: "Social media screening", price: 12 },
  { id: "monitoring", label: "Continuous monitoring (annualized)", price: 6 },
];

/** Set of valid add-on ids — used for fast URL/LS validation. */
export const ADDON_IDS: ReadonlySet<string> = new Set(ADDONS.map((a) => a.id));

export type PackageId = "basic" | "standard" | "comprehensive";

export const PACKAGES: {
  id: PackageId;
  label: string;
  sub: string;
  addons: string[];
}[] = [
  {
    id: "basic",
    label: "Basic",
    sub: "Identity + nationwide criminal",
    addons: [],
  },
  {
    id: "standard",
    label: "Standard",
    sub: "Adds county + employment + education",
    addons: ["county", "employment", "education"],
  },
  {
    id: "comprehensive",
    label: "Comprehensive",
    sub: "Adds federal, MVR, drug, monitoring",
    addons: ["county", "federal", "employment", "education", "mvr", "drug5", "monitoring"],
  },
];

export const PACKAGE_IDS: ReadonlySet<PackageId> = new Set(
  PACKAGES.map((p) => p.id),
);

// ---------- Math ----------

/**
 * Tiered volume discount applied to per-check total.
 * Returns the discount as a fraction (0–1).
 *
 * Thresholds are inclusive on the lower bound: at exactly 50/mo you get -5%,
 * at 49/mo you get 0%. This matches the on-page chip labels and the marketing
 * copy ("kick in at 50, 100, 200, 500").
 */
export function volumeDiscount(hiresPerMonth: number): number {
  if (hiresPerMonth >= 500) return 0.22;
  if (hiresPerMonth >= 200) return 0.16;
  if (hiresPerMonth >= 100) return 0.1;
  if (hiresPerMonth >= 50) return 0.05;
  return 0;
}

export type Estimate = {
  /** Pre-discount per-check (base + add-ons). */
  perCheckList: number;
  /** Post-discount per-check. */
  perCheckNet: number;
  /** monthly = perCheckNet * hires */
  monthly: number;
  /** annual = monthly * 12 */
  annual: number;
  /** Discount as a percentage (e.g. 16 for 16%). */
  discountPct: number;
  /** Marketing-friendly tier label ("Starter" below 50, "Volume" otherwise). */
  tier: "Starter" | "Volume";
  hires: number;
  selected: string[];
};

/**
 * Pure computation: given hires/mo + selected add-on ids, return the full
 * estimate. Unknown add-on ids are ignored (safe to feed straight from URL).
 */
export function computeEstimate(
  hires: number,
  selected: string[],
): Estimate {
  const addonTotal = selected.reduce((sum, id) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price ?? 0);
  }, 0);
  const list = BASE_PER_CHECK + addonTotal;
  const d = volumeDiscount(hires);
  const net = list * (1 - d);
  const m = net * hires;
  return {
    perCheckList: list,
    perCheckNet: net,
    monthly: m,
    annual: m * 12,
    discountPct: d * 100,
    tier: hires < 50 ? "Starter" : "Volume",
    hires,
    selected,
  };
}

// ---------- Input clamping & normalization ----------

/** Clamp + round any incoming hires value (URL string, LS number, manual entry). */
export function clampHires(input: unknown): number {
  const n = typeof input === "string" ? Number(input) : (input as number);
  if (!Number.isFinite(n)) return DEFAULT_HIRES;
  return Math.max(MIN_HIRES, Math.min(MAX_HIRES, Math.round(n)));
}

/** Validate a package id, returning null for unknown values (manual edits). */
export function normalizePackage(input: unknown): PackageId | null {
  if (typeof input !== "string") return null;
  return PACKAGE_IDS.has(input as PackageId) ? (input as PackageId) : null;
}

/** Filter to known add-on ids and dedupe. */
export function normalizeAddons(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of input) {
    if (typeof id !== "string") continue;
    if (!ADDON_IDS.has(id)) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

// ---------- URL serialization ----------

/**
 * Read calculator state from a URL query string.
 *
 * Recognized params:
 *   - `v`   — monthly hires (positive integer, clamped to [1, 10_000])
 *   - `pkg` — one of `basic | standard | comprehensive`
 *   - `adds` — comma-separated add-on ids; unknown ids are dropped silently
 *
 * Returns `null` when no calculator-related params are present, so callers
 * can cleanly fall back to localStorage / defaults.
 */
export function parseEstimateFromQuery(
  search: string,
): { hires: number; pkg: PackageId | null; selected: string[] } | null {
  const params = new URLSearchParams(search);
  if (!params.has("v") && !params.has("pkg") && !params.has("adds")) return null;

  const hires = params.has("v") ? clampHires(params.get("v")) : DEFAULT_HIRES;
  const pkg = params.has("pkg") ? normalizePackage(params.get("pkg")) : null;
  const adds = params.has("adds")
    ? normalizeAddons((params.get("adds") ?? "").split(",").filter(Boolean))
    : pkg
    ? PACKAGES.find((p) => p.id === pkg)!.addons
    : [];
  return { hires, pkg, selected: adds };
}

/**
 * Returns true when the supplied state is byte-for-byte equal to the
 * application defaults. Used by URL sync to suppress params on a clean
 * default state (so a freshly reset calculator yields a tidy `/pricing` URL
 * instead of `/pricing?v=40&pkg=standard&adds=...`).
 */
export function isDefaultState(state: {
  hires: number;
  pkg: PackageId | null;
  selected: string[];
}): boolean {
  if (state.hires !== DEFAULT_HIRES) return false;
  if (state.pkg !== DEFAULT_PACKAGE) return false;
  const defaults = PACKAGES.find((p) => p.id === DEFAULT_PACKAGE)!.addons;
  if (state.selected.length !== defaults.length) return false;
  // order-insensitive compare — add-ons are toggled in arbitrary order
  const a = [...state.selected].sort();
  const b = [...defaults].sort();
  return a.every((id, i) => id === b[i]);
}

/**
 * Build a query string fragment (no leading `?`) representing the current
 * estimate. Only emits the keys we actually care about (omits empty `adds`)
 * so the URL stays tidy. When `state` matches `isDefaultState`, returns an
 * empty string so callers can render a paramless URL.
 */
export function buildEstimateQuery(state: {
  hires: number;
  pkg: PackageId | null;
  selected: string[];
}): string {
  if (isDefaultState(state)) return "";
  const params = new URLSearchParams();
  params.set("v", String(state.hires));
  if (state.pkg) params.set("pkg", state.pkg);
  if (state.selected.length > 0) params.set("adds", state.selected.join(","));
  return params.toString();
}
