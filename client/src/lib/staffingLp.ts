/*
  §220 — Staffing Google Ads landing page (v2) support lib.

  Pure, unit-testable helpers for the standalone /lp/staffing landing page:

    - computeStaffingSavings() : the savings-calculator math. Frames the
      output explicitly as an ILLUSTRATION, not a quote. No invented
      market numbers live here — the caller supplies inputs and the only
      embedded constant is a clearly-labeled illustrative assumption that
      a reviewer can change in one place.

    - captureTrackingParams() / persistTrackingParams() / loadTrackingParams()
      : read UTM + gclid/fbclid params off a query string and persist them
      to sessionStorage so they survive in-SPA navigation and land in the
      lead form's hidden fields. Guarded for non-browser (test/SSR) envs.

    - fireLeadConversion() : the Google Ads conversion-tracking hook. It is
      a NO-OP placeholder until the owner supplies a real conversion
      send-to (ID/label). It pushes a `dataLayer` event (GTM-friendly) and,
      if gtag + a real send-to are present, fires the gtag conversion. It
      never throws.

  Keeping all of this in a lib (not inline in the page) means the math and
  the tracking contract are pinned by vitest without rendering React.
*/

/** sessionStorage key under which captured ad-tracking params are stashed. */
export const STAFFING_LP_TRACKING_KEY = "rh:lp:staffing:tracking";

/**
 * Google Ads conversion send-to target, in the gtag format
 * "AW-XXXXXXXXX/XXXXXXXXXXXXXXXXXX".
 *
 * PLACEHOLDER — intentionally empty. While empty, fireLeadConversion()
 * still pushes the GTM dataLayer event (so a GTM-based setup works without
 * code changes) but skips the direct gtag() conversion call. Replace with
 * the real value once the owner provides their Google Ads conversion
 * ID + label. The §220 test pins that this constant stays a string so a
 * future edit can't silently change its type.
 */
export const GOOGLE_ADS_CONVERSION_SEND_TO = "" as const;

/** The set of query params we capture for paid-search attribution. */
export const TRACKING_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
] as const;

export type TrackingParamKey = (typeof TRACKING_PARAM_KEYS)[number];
export type TrackingParams = Partial<Record<TrackingParamKey, string>>;

/**
 * Parse a query string (e.g. window.location.search) and return only the
 * recognized tracking params that are present and non-empty. Pure.
 */
export function captureTrackingParams(search: string): TrackingParams {
  const out: TrackingParams = {};
  const qs = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  for (const key of TRACKING_PARAM_KEYS) {
    const v = qs.get(key);
    if (v && v.trim().length > 0) {
      out[key] = v.trim();
    }
  }
  return out;
}

/**
 * Persist captured tracking params to sessionStorage, MERGING with any
 * previously stored values so a later in-SPA navigation that drops the
 * query string doesn't wipe the original attribution. No-op (and never
 * throws) when sessionStorage is unavailable.
 */
export function persistTrackingParams(params: TrackingParams): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const prior = loadTrackingParams();
    const merged: TrackingParams = { ...prior, ...params };
    sessionStorage.setItem(STAFFING_LP_TRACKING_KEY, JSON.stringify(merged));
  } catch {
    /* storage disabled / quota — attribution is best-effort, never fatal */
  }
}

/**
 * Read previously-persisted tracking params from sessionStorage. Returns
 * an empty object when nothing is stored or storage is unavailable. Never
 * throws on malformed JSON.
 */
export function loadTrackingParams(): TrackingParams {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STAFFING_LP_TRACKING_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: TrackingParams = {};
    for (const key of TRACKING_PARAM_KEYS) {
      const v = (parsed as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim().length > 0) out[key] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Convenience for the page mount: capture from the current query string,
 * persist (merged), and return the effective merged set to seed the
 * hidden form fields. Safe in non-browser envs.
 */
export function initTracking(search: string): TrackingParams {
  const captured = captureTrackingParams(search);
  persistTrackingParams(captured);
  return loadTrackingParams();
}

/* ------------------------------------------------------------------ */
/* Savings calculator                                                  */
/* ------------------------------------------------------------------ */

export interface StaffingSavingsInput {
  /** Background checks run per month. */
  readonly checksPerMonth: number;
  /**
   * Hours of recruiter/coordinator time currently spent chasing a single
   * background check to completion (follow-ups, status calls, re-keying).
   */
  readonly hoursPerCheck: number;
  /** Fully-loaded hourly cost of the staff doing that chasing, in USD. */
  readonly loadedHourlyCost: number;
}

export interface StaffingSavingsResult {
  /** Hours of coordination time reclaimed per month. */
  readonly hoursSavedPerMonth: number;
  /** Estimated dollar value reclaimed per month (USD, rounded). */
  readonly monthlySavings: number;
  /** Estimated dollar value reclaimed per year (USD, rounded). */
  readonly annualSavings: number;
  /** The efficiency factor applied (0..1), exposed for transparency. */
  readonly efficiencyFactor: number;
}

/**
 * Illustrative coordination-time reduction factor. This is the ONE
 * assumption baked into the calculator and it is deliberately labeled so a
 * reviewer can change it (or the UI copy) before launch. It is NOT a
 * performance claim about turnaround time — it only models how much of the
 * MANUAL CHASING time a faster, status-transparent process can remove.
 * Framed in the UI as "illustrative," never as a guarantee.
 */
export const ILLUSTRATIVE_EFFICIENCY_FACTOR = 0.6;

/** Clamp helper. */
function clampNum(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/**
 * Compute an ILLUSTRATIVE monthly/annual coordination-cost saving from
 * running screens through a faster, status-transparent process. Pure and
 * deterministic. Negative/NaN inputs are clamped to sane floors so the UI
 * can bind sliders directly without guarding.
 */
export function computeStaffingSavings(
  input: StaffingSavingsInput,
): StaffingSavingsResult {
  const checks = clampNum(Math.round(input.checksPerMonth), 0, 100000);
  const hours = clampNum(input.hoursPerCheck, 0, 40);
  const cost = clampNum(input.loadedHourlyCost, 0, 1000);
  const factor = ILLUSTRATIVE_EFFICIENCY_FACTOR;

  const hoursSavedPerMonth = checks * hours * factor;
  const monthlySavings = Math.round(hoursSavedPerMonth * cost);
  const annualSavings = monthlySavings * 12;

  return {
    hoursSavedPerMonth: Math.round(hoursSavedPerMonth * 10) / 10,
    monthlySavings,
    annualSavings,
    efficiencyFactor: factor,
  };
}

/** Format a whole-dollar USD amount with thousands separators, no cents. */
export function formatUsd(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  return `$${safe.toLocaleString("en-US")}`;
}

/* ------------------------------------------------------------------ */
/* Conversion tracking hook                                            */
/* ------------------------------------------------------------------ */

/**
 * Fire a lead conversion. GTM-first: always pushes a `generate_lead`
 * event onto window.dataLayer (so a GTM container can trigger the Google
 * Ads conversion tag with zero code changes). If a real
 * GOOGLE_ADS_CONVERSION_SEND_TO is configured AND a global gtag() exists,
 * it also fires the direct gtag conversion. Never throws; safe in SSR/test.
 *
 * Returns a small report describing what it did, which the §220 tests
 * assert against without needing a real analytics environment.
 */
export interface LeadConversionReport {
  readonly pushedDataLayer: boolean;
  readonly firedGtag: boolean;
}

export function fireLeadConversion(detail?: {
  value?: number;
  currency?: string;
}): LeadConversionReport {
  const report = { pushedDataLayer: false, firedGtag: false };
  if (typeof window === "undefined") return report;

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  // GTM-friendly dataLayer push — works even when send-to is still a
  // placeholder, so the conversion can be wired entirely in GTM.
  try {
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "generate_lead",
      lead_source: "staffing_lp",
      value: detail?.value,
      currency: detail?.currency ?? "USD",
    });
    report.pushedDataLayer = true;
  } catch {
    /* never block the form on analytics */
  }

  // Direct gtag conversion — only when a real send-to is configured.
  try {
    if (GOOGLE_ADS_CONVERSION_SEND_TO && typeof w.gtag === "function") {
      w.gtag("event", "conversion", {
        send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
        value: detail?.value,
        currency: detail?.currency ?? "USD",
      });
      report.firedGtag = true;
    }
  } catch {
    /* never block the form on analytics */
  }

  return report;
}
