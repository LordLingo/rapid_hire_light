/*
  §139 — vitest pin: SHRM 2026 conference rollout.

  Locks the SHRM event constants, the dismissible site-wide
  ConferenceStrip, the dedicated /shrm landing page, and the touchpoints
  that wire them in (Header.tsx, App.tsx, Footer.tsx). Every assertion
  reads source files directly; no React rendering required.

  Pinned facts:
    - lib/shrm.ts exports SHRM_EVENT (with year=2026, ISO dates, dateRange,
      city, venue, booth fields), SHRM_ROUTE = "/shrm",
      SHRM_STRIP_DISMISSED_KEY (sessionStorage key), and isUpcoming()
      helper that returns true mid-event and false long after the
      end date.
    - ConferenceStrip.tsx renders the strip with stable testids:
      conference-strip / conference-strip-link / conference-strip-dismiss,
      links to SHRM_ROUTE, and the dismiss button has an aria-label.
    - Shrm.tsx imports SHRM_EVENT + buildShrmContactUrl and surfaces the
      booth/event metadata.
    - Header.tsx mounts <ConferenceStrip /> above the trust strip.
    - App.tsx registers /shrm + the SHRM_ALIASES routes to the Shrm page.
    - Footer.tsx surfaces a "SHRM 2026 →" link under Portals (gated by
      isUpcoming).
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  SHRM_EVENT,
  SHRM_ROUTE,
  SHRM_ALIASES,
  SHRM_STRIP_DISMISSED_KEY,
  SHRM_HEADLINE,
  SHRM_TAGLINE,
  SHRM_MEETING_SUBJECT,
  buildShrmContactUrl,
  isUpcoming,
} from "./shrm";

const CLIENT_SRC = path.resolve(__dirname, "..");
const read = (rel: string) =>
  fs.readFileSync(path.resolve(CLIENT_SRC, rel), "utf8");

const STRIP_SRC = read("components/site/ConferenceStrip.tsx");
const SHRM_PAGE_SRC = read("pages/Shrm.tsx");
const HEADER_SRC = read("components/site/Header.tsx");
const APP_SRC = read("App.tsx");
const FOOTER_SRC = read("components/site/Footer.tsx");

describe("§139 — SHRM event constants (lib/shrm.ts)", () => {
  it("locks SHRM_EVENT.year to 2026", () => {
    expect(SHRM_EVENT.year).toBe(2026);
  });

  it("locks ISO start/end dates to June 21-24, 2026", () => {
    expect(SHRM_EVENT.startIso).toBe("2026-06-21");
    expect(SHRM_EVENT.endIso).toBe("2026-06-24");
  });

  it("has city + venue + dateRange + booth fields populated", () => {
    expect(SHRM_EVENT.city.length).toBeGreaterThan(0);
    expect(SHRM_EVENT.venue.length).toBeGreaterThan(0);
    expect(SHRM_EVENT.dateRange).toMatch(/2026/);
    // Booth may be a literal "TBA" until the user supplies the real number;
    // we just lock that the field is non-empty.
    expect(SHRM_EVENT.booth.length).toBeGreaterThan(0);
  });

  it("locks SHRM_ROUTE to /shrm", () => {
    expect(SHRM_ROUTE).toBe("/shrm");
  });

  it("exposes the printed-signage and email aliases /shrm-2026 + /booth", () => {
    expect(SHRM_ALIASES).toContain("/shrm-2026");
    expect(SHRM_ALIASES).toContain("/booth");
  });

  it("has stable copy strings (headline/tagline/meeting subject)", () => {
    expect(SHRM_HEADLINE.length).toBeGreaterThan(0);
    expect(SHRM_TAGLINE.length).toBeGreaterThan(0);
    expect(SHRM_MEETING_SUBJECT).toMatch(/SHRM/);
  });

  it("uses a stable sessionStorage key for the dismiss state", () => {
    expect(SHRM_STRIP_DISMISSED_KEY).toMatch(/shrm-2026/);
  });
});

describe("§139 — isUpcoming() helper", () => {
  it("returns true at the start of the conference window", () => {
    expect(isUpcoming(new Date("2026-06-21T13:00:00Z"))).toBe(true);
  });

  it("returns true on the last day of the conference", () => {
    expect(isUpcoming(new Date("2026-06-24T13:00:00Z"))).toBe(true);
  });

  it("returns false long after the conference ends", () => {
    expect(isUpcoming(new Date("2026-12-01T00:00:00Z"))).toBe(false);
  });

  it("returns true well before the conference starts", () => {
    // A pre-event timestamp: helper should still surface the strip.
    expect(isUpcoming(new Date("2026-01-15T00:00:00Z"))).toBe(true);
  });
});

describe("§139 — buildShrmContactUrl()", () => {
  it("produces a /contact URL with the SHRM subject + source params", () => {
    const url = buildShrmContactUrl();
    expect(url.startsWith("/contact?")).toBe(true);
    expect(url).toMatch(/subject=SHRM\+2026/);
    expect(url).toMatch(/source=shrm-2026/);
  });
});

describe("§139 — ConferenceStrip.tsx", () => {
  it("imports SHRM_ROUTE, SHRM_EVENT, SHRM_STRIP_DISMISSED_KEY, isUpcoming", () => {
    expect(STRIP_SRC).toMatch(
      /import\s*\{[\s\S]*?SHRM_EVENT[\s\S]*?SHRM_ROUTE[\s\S]*?SHRM_STRIP_DISMISSED_KEY[\s\S]*?isUpcoming[\s\S]*?\}\s*from\s+["']@\/lib\/shrm["']/,
    );
  });

  it("exposes data-testid='conference-strip' on the root element", () => {
    expect(STRIP_SRC).toMatch(/data-testid=["']conference-strip["']/);
  });

  it("the strip Link has data-testid='conference-strip-link' and routes to SHRM_ROUTE", () => {
    expect(STRIP_SRC).toMatch(/data-testid=["']conference-strip-link["']/);
    expect(STRIP_SRC).toMatch(/href=\{SHRM_ROUTE\}/);
  });

  it("the dismiss button has data-testid='conference-strip-dismiss' and an aria-label", () => {
    expect(STRIP_SRC).toMatch(/data-testid=["']conference-strip-dismiss["']/);
    expect(STRIP_SRC).toMatch(/aria-label=["']Dismiss SHRM 2026 announcement["']/);
  });

  it("returns null when not visible (avoids hydration flash + post-event hide)", () => {
    expect(STRIP_SRC).toMatch(/if \(!visible\) return null;/);
  });

  it("calls sessionStorage.setItem on dismiss with SHRM_STRIP_DISMISSED_KEY", () => {
    expect(STRIP_SRC).toMatch(
      /window\.sessionStorage\.setItem\(\s*SHRM_STRIP_DISMISSED_KEY\s*,/,
    );
  });
});

describe("§139 — /shrm landing page (Shrm.tsx)", () => {
  it("imports SHRM_EVENT and buildShrmContactUrl from lib/shrm", () => {
    expect(SHRM_PAGE_SRC).toMatch(
      /import\s*\{[\s\S]*?SHRM_EVENT[\s\S]*?buildShrmContactUrl[\s\S]*?\}\s*from\s+["']@\/lib\/shrm["']/,
    );
  });

  it("surfaces the dateRange, city, and booth from SHRM_EVENT", () => {
    expect(SHRM_PAGE_SRC).toMatch(/SHRM_EVENT\.dateRange/);
    expect(SHRM_PAGE_SRC).toMatch(/SHRM_EVENT\.city/);
    expect(SHRM_PAGE_SRC).toMatch(/SHRM_EVENT\.booth/);
  });

  it("has stable testids for hero + final CTA", () => {
    expect(SHRM_PAGE_SRC).toMatch(/data-testid=["']shrm-hero["']/);
    expect(SHRM_PAGE_SRC).toMatch(/data-testid=["']shrm-final-cta["']/);
  });

  it("includes a post-event fallback notice (auto-shows after isUpcoming becomes false)", () => {
    expect(SHRM_PAGE_SRC).toMatch(/data-testid=["']shrm-past-event-notice["']/);
  });
});

describe("§139 — Header.tsx mounts ConferenceStrip", () => {
  it("imports the ConferenceStrip component", () => {
    // Accept either the relative ./ConferenceStrip path or the
    // @/components/site/ConferenceStrip alias path — both compile to
    // the same module.
    expect(HEADER_SRC).toMatch(
      /import\s+ConferenceStrip\s+from\s+["'](?:\.\/ConferenceStrip|@\/components\/site\/ConferenceStrip)["']/,
    );
  });

  it("renders <ConferenceStrip /> inside the header", () => {
    expect(HEADER_SRC).toMatch(/<ConferenceStrip\s*\/>/);
  });
});

describe("§139 — App.tsx registers SHRM routes", () => {
  it("imports the Shrm page component", () => {
    expect(APP_SRC).toMatch(
      /import\s+Shrm\s+from\s+["']\.\/pages\/Shrm["']/,
    );
  });

  it("registers /shrm to Shrm", () => {
    expect(APP_SRC).toMatch(
      /<Route\s+path=\{?["']\/shrm["']\}?\s+component=\{Shrm\}\s*\/>/,
    );
  });

  it("registers /shrm-2026 alias to Shrm", () => {
    expect(APP_SRC).toMatch(
      /<Route\s+path=\{?["']\/shrm-2026["']\}?\s+component=\{Shrm\}\s*\/>/,
    );
  });

  it("registers /booth alias to Shrm", () => {
    expect(APP_SRC).toMatch(
      /<Route\s+path=\{?["']\/booth["']\}?\s+component=\{Shrm\}\s*\/>/,
    );
  });
});

describe("§139 — Footer.tsx surfaces a conditional SHRM link", () => {
  it("imports isUpcoming + SHRM_ROUTE + SHRM_EVENT from lib/shrm", () => {
    expect(FOOTER_SRC).toMatch(
      /import\s*\{[\s\S]*?SHRM_EVENT[\s\S]*?SHRM_ROUTE[\s\S]*?isUpcoming[\s\S]*?\}\s*from\s+["']@\/lib\/shrm["']/,
    );
  });

  it("guards the SHRM link with isUpcoming() so it auto-hides post-event", () => {
    expect(FOOTER_SRC).toMatch(/isUpcoming\(\)/);
  });

  it("emits a 'SHRM 2026 →' label that uses SHRM_EVENT.year", () => {
    // The label is built via a template literal: SHRM ${SHRM_EVENT.year} →
    expect(FOOTER_SRC).toMatch(/SHRM \$\{SHRM_EVENT\.year\} →/);
  });
});
