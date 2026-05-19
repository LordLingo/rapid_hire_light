/*
  §139 — SHRM 2026 Annual Conference promotion

  Single source of truth for everything related to Rapid Hire's
  presence at SHRM Annual 2026 (Orlando, June 21-24). Every consumer
  imports from here so:

    - the announcement strip, /shrm landing page, useSeo metadata,
      footer link, and any future email / social copy all reference
      the same canonical event details
    - vitest specs can pin those strings
    - when the event ends, every surface auto-hides via the same
      isUpcoming() check (no need to chase down individual references)
    - when data lands (real booth number, real rep names, real
      calendar tool), only this module changes

  The /shrm page is intentionally a SHRM-flavored extension of the
  SPA brand, not a separate microsite — booth visitors who scan a QR
  code already saw the SPA framing on the booth, so the page picks up
  there rather than re-introducing the brand.
*/

export type ShrmEvent = {
  /** Human-readable event name (used in headlines and meta). */
  name: string;
  /** ISO 8601 start date (inclusive) — first day of expo. */
  startIso: string;
  /** ISO 8601 end date (inclusive) — last day of expo. */
  endIso: string;
  /** Compact human date range for in-copy use (e.g. "June 21-24, 2026"). */
  dateRange: string;
  /** Year suffix used in titles, slugs, and analytics. */
  year: number;
  /** City the event is held in (used in hero + meta + strip copy). */
  city: string;
  /** Convention center / venue. */
  venue: string;
  /**
   * Booth number on the SHRM 2026 expo floor. Confirmed by the user
   * on 2026-05-19 as 1619. Read everywhere through SHRM_EVENT.booth
   * so this stays the single source of truth.
   */
  booth: string;
};

/**
 * Canonical event details. Locked by shrm.test.ts.
 *
 * Source: SHRM official site. Annual 2026 runs June 21-24 at the
 * Orange County Convention Center in Orlando, FL.
 */
export const SHRM_EVENT: ShrmEvent = {
  name: "SHRM 2026 Annual Conference & Expo",
  startIso: "2026-06-21",
  endIso: "2026-06-24",
  dateRange: "June 21-24, 2026",
  year: 2026,
  city: "Orlando, FL",
  venue: "Orange County Convention Center",
  booth: "1619",
} as const;

/**
 * Canonical route for the dedicated SHRM landing page.
 */
export const SHRM_ROUTE = "/shrm" as const;

/**
 * Aliases that route to the same Shrm page. /shrm-2026 is for emails
 * + ads where the year is meaningful; /booth is for the printed booth
 * signage where attendees will type the URL on their phone.
 */
export const SHRM_ALIASES = ["/shrm-2026", "/booth"] as const;

/**
 * Auto-filled subject line on the /contact form when a SHRM CTA is
 * clicked. Lets the user immediately tell from form submissions which
 * came from SHRM traffic.
 */
export const SHRM_MEETING_SUBJECT =
  "SHRM 2026 — request meeting" as const;

/**
 * The hero headline on /shrm. Picks up the SPA framing rather than
 * re-introducing the brand — visitors who scan the booth's QR code
 * have already seen "Speed · Price · Accuracy" on the booth artwork
 * and the page should feel like a natural continuation.
 */
export const SHRM_HEADLINE =
  "Meet us at SHRM 2026." as const;

/**
 * Hero kicker tagline on /shrm. Reinforces the SPA framing while
 * making the event the proximate reason to engage.
 */
export const SHRM_TAGLINE =
  "Step into the SPA — Speed, Price, Accuracy — at the largest HR conference of the year." as const;

/**
 * One-line copy used by the site-wide ConferenceStrip above the
 * certification strip. Designed to read in a single glance: who, when,
 * where, action.
 */
export const SHRM_STRIP_COPY = `Meeting at SHRM 2026, ${SHRM_EVENT.dateRange}, ${SHRM_EVENT.city} · Booth ${SHRM_EVENT.booth} — Book your slot →` as const;

/**
 * Returns true if `now` is on or before the last day of the conference.
 * Used to auto-hide the announcement strip and the /shrm page CTAs
 * after the event ends.
 *
 * The cutoff is end-of-day Eastern Time on the conference's last day,
 * approximated as 23:59:59 UTC of (endIso + 1 day) to keep things
 * simple — being a few hours late on the auto-hide is fine.
 *
 * @param now Optional override for testing. Defaults to current Date.
 */
export function isUpcoming(now: Date = new Date()): boolean {
  // Cutoff = end of the day after the conference ends, UTC.
  // For SHRM 2026 (ends June 24) this means strip hides starting
  // June 25 UTC. Good enough — a few hours late is fine.
  const end = new Date(SHRM_EVENT.endIso + "T23:59:59Z");
  // Add 24 hours of grace so US/ET times don't flip mid-day on the last day.
  const cutoff = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  return now.getTime() <= cutoff.getTime();
}

/**
 * sessionStorage key used by ConferenceStrip to persist a user's
 * dismissal across re-renders within the session. Cleared
 * automatically when the browser tab closes (which is correct behavior
 * — a returning visitor should see the strip again).
 */
export const SHRM_STRIP_DISMISSED_KEY = "rh:shrm-2026-strip-dismissed" as const;

/**
 * sessionStorage key used to persist UTM attribution params captured
 * on /shrm. Read by Contact.tsx and appended to the message body so
 * the user gets to see which channel produced each booked meeting,
 * without needing a real analytics platform.
 */
export const SHRM_UTM_KEY = "rh:shrm-2026-utm" as const;

/**
 * Builds the /contact URL for a SHRM CTA, with subject pre-filled.
 * Used by the strip, the /shrm page CTAs, and the new §148 booking
 * picker (which passes the selected slot id through to Contact.tsx so
 * the prefilled message + Formspree payload carry the requested time).
 */
export function buildShrmContactUrl(options?: { slotId?: string }): string {
  const params = new URLSearchParams({
    subject: SHRM_MEETING_SUBJECT,
    source: "shrm-2026",
  });
  if (options?.slotId) params.set("slot", options.slotId);
  return `/contact?${params.toString()}`;
}
