/*
  §218 — Structural invariants for the standalone staffing Google Ads
  landing page (/lp/staffing).

  Lock-in surface:
    A) The page module exists and is wired to /lp/staffing in App.tsx
       (imported + registered).
    B) The page is decoupled from the marketing-site chrome: it does NOT
       render SiteShell / the global Header / Footer (a paid LP must keep
       the visitor on one decision).
    C) It does NOT reuse the homepage "spa" hero metaphor.
    D) The lead form posts to the shared sales Formspree inbox, fires the
       conversion hook, carries hidden UTM/gclid fields, and uses a honeypot.
    E) §215 guard holds here too — no `_cc` field (recipients live in the
       Formspree dashboard; duplicating them breaks SendGrid).
    F) All quantitative brand claims are bracketed [PLACEHOLDER] tokens — no
       invented turnaround/accuracy/savings/client-count numbers.
    G) A mobile sticky CTA + the savings calculator wiring are present.

  Scans raw source with block/line/JSX comments stripped so explanatory
  breadcrumbs don't false-positive.
*/
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../../..");
function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");
}

const LP_RAW = read("client/src/pages/StaffingLanding.tsx");
const LP = stripComments(LP_RAW);
const APP = stripComments(read("client/src/App.tsx"));

describe("§218 — route registration", () => {
  it("App.tsx imports StaffingLanding", () => {
    expect(APP).toMatch(
      /import\s+StaffingLanding\s+from\s+["']\.\/pages\/StaffingLanding["']/,
    );
  });

  it("App.tsx registers the /lp/staffing route", () => {
    expect(APP).toMatch(
      /<Route\s+path=\{?["']\/lp\/staffing["']\}?\s+component=\{StaffingLanding\}\s*\/>/,
    );
  });
});

describe("§218 — decoupled from marketing-site chrome", () => {
  it("does NOT import or render SiteShell", () => {
    expect(LP).not.toMatch(/SiteShell/);
  });

  it("does NOT render the global site Header/Footer components", () => {
    // The LP ships its own LpHeader/LpFooter; it must not pull the shared
    // site chrome that exists to keep visitors browsing.
    expect(LP).not.toMatch(/from\s+["']@\/components\/site\/Header["']/);
    expect(LP).not.toMatch(/from\s+["']@\/components\/site\/Footer["']/);
  });

  it("renders its own minimal header + footer + mobile sticky CTA", () => {
    expect(LP).toMatch(/function LpHeader\(/);
    expect(LP).toMatch(/function LpFooter\(/);
    expect(LP).toMatch(/function MobileStickyCta\(/);
  });

  it("does NOT reuse the homepage spa hero metaphor", () => {
    expect(LP).not.toMatch(/\bspa\b/i);
  });
});

describe("§218 — lead form plumbing", () => {
  it("posts to the shared sales Formspree endpoint", () => {
    expect(LP).toMatch(/FORMSPREE_ENDPOINT/);
  });

  it("submits via JSON fetch with Accept: application/json", () => {
    expect(LP).toMatch(/Accept["']?\s*:\s*["']application\/json["']/);
  });

  it("fires the Google Ads conversion hook on success", () => {
    expect(LP).toMatch(/fireLeadConversion\(/);
  });

  it("submits to HubSpot in parallel", () => {
    expect(LP).toMatch(/submitToHubspot\(/);
  });

  it("carries hidden utm_*/gclid fields via UTM_PARAM_KEYS", () => {
    expect(LP).toMatch(/UTM_PARAM_KEYS\.map/);
    expect(LP).toMatch(/type="hidden"/);
  });

  it("includes a honeypot field", () => {
    expect(LP).toMatch(/name="_gotcha"/);
  });

  it("§215 — does NOT include a _cc field or hard-coded partner emails", () => {
    expect(LP).not.toMatch(/_cc/);
    expect(LP).not.toMatch(/mark@precisehire\.com/);
    expect(LP).not.toMatch(/arthur@brangoholdings\.com/);
    expect(LP).not.toMatch(/sbratcher@exactbackgroundchecks\.com/);
  });

  it("scrolls the success panel into view after submit", () => {
    expect(LP).toMatch(/scrollIntoView/);
    expect(LP).toMatch(/data-testid="staffing-lp-success"/);
  });
});

describe("§218 — no invented statistics (placeholder policy)", () => {
  it("uses bracketed placeholder tokens for headline metrics", () => {
    expect(LP).toMatch(/\[XX\]%/);
    expect(LP).toMatch(/\[PLACEHOLDER/);
  });

  it("does not hard-code a percentage turnaround/accuracy claim in visible copy", () => {
    // Guard against a stray invented stat in TEXT content. CSS percent
    // values (gradient stops like `at 18% -10%`, opacity `/40`) are not
    // marketing claims, so we strip style/className attributes and the
    // radial-gradient background string before scanning. Any surviving
    // digit-% token must be inside a bracketed [PLACEHOLDER].
    const withoutStyles = LP
      .replace(/style=\{\{[\s\S]*?\}\}/g, "")
      .replace(/className="[^"]*"/g, "")
      .replace(/background:[\s\S]*?,/g, "")
      .replace(/\[[^\]]*\]/g, ""); // drop bracketed placeholders like [XX]%
    const percentClaims = withoutStyles.match(/\b\d{1,3}%/g) ?? [];
    expect(percentClaims).toEqual([]);
  });
});

describe("§218 — savings calculator wiring", () => {
  it("imports the pure calculator + uses computeStaffingSavings", () => {
    expect(LP).toMatch(/computeStaffingSavings/);
    expect(LP).toMatch(/from\s+["']@\/lib\/staffingLp["']/);
  });

  it("renders monthly + annual saving outputs", () => {
    expect(LP).toMatch(/data-testid="staffing-lp-monthly-saving"/);
    expect(LP).toMatch(/data-testid="staffing-lp-annual-saving"/);
  });
});
