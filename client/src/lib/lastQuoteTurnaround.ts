/**
 * lastQuoteTurnaround
 * --------------------------------------------------------------------------
 * Owner-editable social-proof signal for the /get-a-quote hero.
 *
 * Source of truth: client/src/data/lastQuoteTurnaround.json. Edit that file
 * (commit + redeploy) to update the chip; no code change needed.
 *
 * Contract:
 *   - `minutes`        integer >= 0; the most recent measured turnaround
 *   - `recordedAt`     ISO 8601 UTC timestamp; when the measurement was taken
 *   - `industry`       optional descriptor shown in the subline
 *   - `freshnessHours` optional, defaults to 168 (7 days). Older than this,
 *                      the chip auto-hides so we never publish a stale claim.
 *
 * formatTurnaround(887)  ->  "14 hr · 47 min"
 * formatTurnaround(45)   ->  "45 min"
 * formatTurnaround(120)  ->  "2 hr"
 * formatTurnaround(0)    ->  "Under a minute"
 */
import raw from "../data/lastQuoteTurnaround.json";

export type LastQuoteTurnaroundSource = {
  minutes: number;
  recordedAt: string;
  industry?: string;
  freshnessHours?: number;
};

export type LastQuoteTurnaround = {
  /** Pre-formatted display string, e.g. "14 hr · 47 min" or "45 min". */
  display: string;
  /** Pre-formatted subline, e.g. "Healthcare staffing · 2 days ago". */
  subline: string;
  /** True when the recordedAt is within freshnessHours of now. */
  isFresh: boolean;
  /** Echo of the raw minutes for callers that want to do their own math. */
  minutes: number;
};

/** Default freshness window — older claims auto-hide. */
export const DEFAULT_FRESHNESS_HOURS = 168;

/** Format a minute count as "Xh · Ym" / "Xh" / "Ym" / "Under a minute". */
export function formatTurnaround(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes < 0) return "—";
  if (minutes < 1) return "Under a minute";
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const hrs = Math.floor(m / 60);
  const mins = m % 60;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr · ${mins} min`;
}

/** Render "X minutes/hours/days ago" relative to a fixed `now` (UTC ms). */
export function formatRelativeRecordedAt(
  recordedAt: string,
  now: number = Date.now(),
): string {
  const ts = Date.parse(recordedAt);
  if (!Number.isFinite(ts)) return "recently";
  const deltaMs = Math.max(0, now - ts);
  const mins = Math.floor(deltaMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 14) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
}

/** Build the chip view-model from a raw source (for tests + runtime). */
export function buildLastQuoteTurnaround(
  source: LastQuoteTurnaroundSource,
  now: number = Date.now(),
): LastQuoteTurnaround {
  const freshnessHours =
    typeof source.freshnessHours === "number" && source.freshnessHours > 0
      ? source.freshnessHours
      : DEFAULT_FRESHNESS_HOURS;
  const ts = Date.parse(source.recordedAt);
  const isFresh =
    Number.isFinite(ts) && now - ts <= freshnessHours * 60 * 60 * 1000;
  const display = formatTurnaround(source.minutes);
  const rel = formatRelativeRecordedAt(source.recordedAt, now);
  const subline = source.industry
    ? `${source.industry} · ${rel}`
    : `Recorded ${rel}`;
  return { display, subline, isFresh, minutes: source.minutes };
}

/**
 * Runtime-resolved chip value built from the JSON data file at module load.
 * Callers can read this directly in components: if `isFresh` is false, hide.
 */
export const LAST_QUOTE_TURNAROUND: LastQuoteTurnaround =
  buildLastQuoteTurnaround(raw as LastQuoteTurnaroundSource);
