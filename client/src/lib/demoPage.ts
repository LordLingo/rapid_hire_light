/*
  /demo page config. Single source of truth for the booking link so a
  swap touches only this file (pinned by demoPage.test.ts).

  DEMO_BOOKING_URL — Mark Lingo's public booking page (Google Calendar
  appointment schedule). While it is empty, every "Pick a time" button
  falls back to calling the U.S.-based support line instead.
*/

export const DEMO_BOOKING_URL = "";

export const DEMO_PHONE_DISPLAY = "888-445-3047";
export const DEMO_PHONE_TEL = "tel:+18884453047";

export type DemoBookingCta = {
  href: string;
  label: string;
  external: boolean;
};

/** Resolve the booking button from the configured URL (pure, testable). */
export function resolveDemoBookingCta(url: string = DEMO_BOOKING_URL): DemoBookingCta {
  const clean = url.trim();
  if (/^https:\/\//i.test(clean)) {
    return { href: clean, label: "Pick a Time on Mark's Calendar", external: true };
  }
  return {
    href: DEMO_PHONE_TEL,
    label: `Call ${DEMO_PHONE_DISPLAY} to Book`,
    external: false,
  };
}
