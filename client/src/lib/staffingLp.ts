/*
  §218 — Pure helpers for the standalone staffing Google Ads landing page
  (/lp/staffing).

  Everything in this module is framework-free and side-effect-light so it
  can be unit-tested without a DOM or network. Two responsibilities:

    1. Savings-calculator math (computeStaffingSavings) — the COST SAVINGS
       widget multiplies a per-check delta by monthly volume. IMPORTANT:
       per the brief we must NOT invent a turnaround/accuracy/savings
       figure. The savings widget therefore takes the user's OWN inputs
       ([checks per month] + [current avg cost per check]) and a single
       assumed per-check saving that is surfaced in the UI as an editable /
       clearly-bracketed assumption, never a hard claim. The default
       assumed delta is exported as a named constant so a reviewer can see
       exactly what drives the number and the test can pin it.

    2. Marketing attribution capture (UTM_PARAM_KEYS, readTrackingParams,
       persistTrackingParams, loadTrackingParams) — Google Ads appends
       utm_* + gclid to the landing URL. We read them on mount, persist
       to sessionStorage so they survive an in-SPA navigation, and inject
       them into hidden form fields at submit time.
*/

/** The hidden tracking fields the lead form carries, in canonical order. */
export const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "gclid",
] as const;

export type TrackingParamKey = (typeof UTM_PARAM_KEYS)[number];
export type TrackingParams = Partial<Record<TrackingParamKey, string>>;

/** sessionStorage key under which captured tracking params are cached. */
export const TRACKING_STORAGE_KEY = "rh:lp:staffing:tracking:v1" as const;

/**
 * Default assumed per-check saving (USD) used to seed the savings widget.
 *
 * This is a *user-editable assumption surfaced in the UI*, NOT a verified
 * Rapid Hire claim. The brief forbids inventing savings figures, so the LP
 * renders this value behind an explicit "assumed savings per check
 * [EDITABLE]" control and frames the output as an estimate the visitor
 * controls. Centralizing the default here keeps the copy, the widget, and
 * the regression test pinned to one number.
 */
export const DEFAULT_ASSUMED_SAVING_PER_CHECK = 5 as const;

export interface SavingsInput {
  /** Checks the staffing firm runs per month. */
  readonly checksPerMonth: number;
  /** Their current average cost per check (USD). */
  readonly currentCostPerCheck: number;
  /**
   * Assumed saving per check (USD). Defaults to
   * DEFAULT_ASSUMED_SAVING_PER_CHECK; the widget lets the visitor change it
   * so the output is always their own assumption, never our claim.
   */
  readonly assumedSavingPerCheck?: number;
}

export interface SavingsResult {
  readonly checksPerMonth: number;
  readonly currentCostPerCheck: number;
  readonly assumedSavingPerCheck: number;
  /** New per-check cost after the assumed saving, floored at $0. */
  readonly newCostPerCheck: number;
  /** Current monthly spend = checks * currentCostPerCheck. */
  readonly currentMonthly: number;
  /** Estimated monthly saving = checks * effective per-check saving. */
  readonly monthlySaving: number;
  /** Estimated annual saving = 12 * monthlySaving. */
  readonly annualSaving: number;
}

function safeNonNegative(n: number): number {
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * Compute estimated savings from the visitor's own inputs. Pure + total:
 * non-finite or negative inputs are clamped to 0 so the widget can never
 * render NaN/-$ values. The per-check saving is capped at the current cost
 * (you can't save more than you currently pay), which also guarantees
 * newCostPerCheck >= 0.
 */
export function computeStaffingSavings(input: SavingsInput): SavingsResult {
  const checksPerMonth = Math.floor(safeNonNegative(input.checksPerMonth));
  const currentCostPerCheck = safeNonNegative(input.currentCostPerCheck);
  const rawSaving = safeNonNegative(
    input.assumedSavingPerCheck ?? DEFAULT_ASSUMED_SAVING_PER_CHECK,
  );
  // Can't save more per check than the current cost.
  const effectiveSaving = Math.min(rawSaving, currentCostPerCheck);
  const newCostPerCheck = Math.max(0, currentCostPerCheck - effectiveSaving);
  const currentMonthly = checksPerMonth * currentCostPerCheck;
  const monthlySaving = checksPerMonth * effectiveSaving;
  const annualSaving = 12 * monthlySaving;
  return {
    checksPerMonth,
    currentCostPerCheck,
    assumedSavingPerCheck: effectiveSaving,
    newCostPerCheck,
    currentMonthly,
    monthlySaving,
    annualSaving,
  };
}

/** Format a number as whole-dollar USD (no cents) for the widget output. */
export function formatUsd(n: number): string {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/**
 * Read the tracking params from a URL query string (e.g.
 * `?utm_source=google&gclid=abc`). Only the canonical UTM_PARAM_KEYS are
 * returned; empty values are dropped. Pure — accepts the raw search string
 * so it can be tested without `window`.
 */
export function readTrackingParams(search: string): TrackingParams {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const out: TrackingParams = {};
  for (const key of UTM_PARAM_KEYS) {
    const raw = params.get(key);
    if (raw && raw.trim().length > 0) {
      out[key] = raw.trim();
    }
  }
  return out;
}

/**
 * Merge two tracking-param maps, preferring NON-empty values from the
 * `incoming` map (a fresh URL read) over the `existing` cache. This means
 * a Google Ads landing URL always overrides a stale cached value, but an
 * in-SPA navigation that drops the query string falls back to the cache.
 */
export function mergeTrackingParams(
  existing: TrackingParams,
  incoming: TrackingParams,
): TrackingParams {
  const out: TrackingParams = { ...existing };
  for (const key of UTM_PARAM_KEYS) {
    const v = incoming[key];
    if (v && v.trim().length > 0) out[key] = v.trim();
  }
  return out;
}

/** Persist tracking params to sessionStorage (no-op outside the browser). */
export function persistTrackingParams(params: TrackingParams): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(params));
  } catch {
    /* storage full / disabled — attribution is best-effort, never fatal */
  }
}

/** Load previously-persisted tracking params; {} if none / unavailable. */
export function loadTrackingParams(): TrackingParams {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: TrackingParams = {};
    for (const key of UTM_PARAM_KEYS) {
      const v = (parsed as Record<string, unknown>)[key];
      if (typeof v === "string" && v.trim().length > 0) out[key] = v.trim();
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Fire a Google Ads conversion + a generic dataLayer form-submit event.
 *
 * This is intentionally a *placeholder hook*: the real conversion
 * label/ID is supplied by the marketing team and dropped into
 * GOOGLE_ADS_CONVERSION_SEND_TO before launch. Until then the function
 * pushes a `form_submit` event to `window.dataLayer` (which GTM picks up)
 * and calls `gtag('event', 'conversion', …)` only if `gtag` is present, so
 * it is safe to call in dev/test where neither global exists.
 */
export const GOOGLE_ADS_CONVERSION_SEND_TO = "AW-CONVERSION_ID/CONVERSION_LABEL" as const;

export function fireLeadConversion(meta?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  // Generic dataLayer event — GTM-friendly, always pushed.
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "staffing_lp_lead_submit", ...(meta ?? {}) });
  // Google Ads conversion — only if gtag is wired up (placeholder send_to).
  if (typeof w.gtag === "function") {
    w.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      ...(meta ?? {}),
    });
  }
}
