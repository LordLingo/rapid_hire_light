/*
  §220 — Structure pins for the staffing landing page (StaffingLanding.tsx)
  and its route registration. These are source-text assertions (no React
  render) that lock the page's key ingredients so a future refactor can't
  silently break the campaign destination:

    - /lp/staffing route is registered in App.tsx pointing at StaffingLanding
    - the page exists and imports the shared form + tracking plumbing
    - lead form posts to the Formspree endpoint and renders hidden tracking
      fields + a honeypot
    - the success panel uses the §216 scroll-into-view pattern
    - NO invented marketing stats: every headline metric stays a bracketed
      [PLACEHOLDER]; this test fails if a bare percentage/number claim leaks
      into visible copy (CSS values inside style/className are ignored)
*/

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PAGE = resolve(__dirname, "../pages/StaffingLanding.tsx");
const APP = resolve(__dirname, "../App.tsx");

function read(p: string): string {
  return readFileSync(p, "utf8");
}

describe("§220 StaffingLanding — route registration", () => {
  it("registers /lp/staffing → StaffingLanding in App.tsx", () => {
    const app = read(APP);
    expect(app).toContain('import StaffingLanding from "./pages/StaffingLanding"');
    expect(app).toMatch(
      /<Route\s+path=\{"\/lp\/staffing"\}\s+component=\{StaffingLanding\}\s*\/>/,
    );
  });
});

describe("§220 StaffingLanding — page wiring", () => {
  const src = read(PAGE);

  it("uses the shared SEO + reveal hooks", () => {
    expect(src).toContain('from "@/hooks/useSeo"');
    expect(src).toContain('from "@/hooks/useReveal"');
  });

  it("reuses the shared form + tracking libs", () => {
    expect(src).toContain('from "@/lib/formValidation"');
    expect(src).toContain('from "@/lib/hubspotForm"');
    expect(src).toContain('from "@/lib/staffingLp"');
  });

  it("posts the lead form to the shared Formspree endpoint constant", () => {
    // §159: the form id must come from @/lib/formspree, never a literal here.
    expect(src).toContain('from "@/lib/formspree"');
    expect(src).toContain("FORMSPREE_ENDPOINT");
    expect(src).not.toContain("formspree.io/f/");
  });

  it("renders hidden tracking fields + a honeypot", () => {
    expect(src).toContain("data-tracking-field");
    expect(src).toContain('name="company_website"'); // honeypot
  });

  it("fires the lead conversion hook on successful submit", () => {
    expect(src).toContain("fireLeadConversion()");
  });

  it("scrolls the success panel into view after submit (§216 pattern)", () => {
    expect(src).toContain('data-testid="lp-success"');
    expect(src).toMatch(/successRef\.current\?\.scrollIntoView\(/);
  });

  it("shows the pre-launch placeholder reviewer banner", () => {
    expect(src).toContain('data-testid="lp-placeholder-banner"');
  });

  it("uses the custom generated hero asset via a deploy-safe absolute CDN URL", () => {
    // §221: must be an absolute https CDN URL, NOT a /manus-storage/* signed-redirect
    // path (that endpoint 404s on the published static build).
    expect(src).toMatch(/HERO_IMG\s*=\s*"https:\/\/files\.manuscdn\.com\//);
    expect(src).not.toContain("/manus-storage/staffing-hero");
  });
});

describe("§222 StaffingLanding — persistent Request a Demo sticky CTA", () => {
  const src = read(PAGE);

  it("renders a single persistent DemoCtaBar (no leftover mobile-only bar)", () => {
    expect(src).toContain("function DemoCtaBar()");
    expect(src).toContain("<DemoCtaBar />");
    expect(src).toContain('data-testid="lp-demo-cta"');
    // exactly one rendered instance of the bar (no leftover duplicate bar)
    expect(src.match(/<DemoCtaBar \/>/g)?.length).toBe(1);
  });

  it("labels the CTA 'Request a Demo' and links it to the #lead form", () => {
    expect(src).toMatch(/Request a Demo/);
    expect(src).toMatch(/href="#lead"/);
  });

  it("is fixed, spans all breakpoints, and toggles visibility on scroll", () => {
    // fixed bottom bar, NOT gated behind lg:hidden (must show on desktop too)
    expect(src).toMatch(/fixed bottom-0 inset-x-0 z-40/);
    expect(src).not.toMatch(/lg:hidden fixed bottom-0/);
    // visibility is state-driven and accessibility-aware
    expect(src).toContain("aria-hidden={!show}");
    expect(src).toContain('getElementById("lead")');
  });

  it("respects reduced-motion on the slide transition", () => {
    expect(src).toContain("motion-reduce:transition-none");
  });
});

describe("§220 StaffingLanding — no invented stats", () => {
  const src = read(PAGE);

  // Strip out CSS-ish contexts where percentages/numbers are legitimate
  // (inline style backgrounds/gradients, Tailwind opacity like /70, arbitrary
  // values like [color:...], size utilities). What remains is visible copy.
  function visibleText(s: string): string {
    return (
      s
        // remove style={{ ... }} blocks
        .replace(/style=\{\{[\s\S]*?\}\}/g, " ")
        // remove className="..." values
        .replace(/className=("[^"]*"|\{`[\s\S]*?`\})/g, " ")
        // remove import/asset URL/path strings (CDN hero assets + any storage paths)
        .replace(/["'`][^"'`]*files\.manuscdn\.com[^"'`]*["'`]/g, " ")
        .replace(/["'`][^"'`]*manus-storage[^"'`]*["'`]/g, " ")
    );
  }

  it("contains bracketed placeholders, not hard-coded headline stats", () => {
    expect(src).toContain("[XX]");
    expect(src).toMatch(/\[XX\]%/);
  });

  it("has no bare 'NN% accuracy/faster/reduction' style claims in copy", () => {
    const text = visibleText(src);
    // Catch claims like "98% accuracy", "40% faster", "99.9% ..."
    const bad = text.match(/\b\d{2,3}(\.\d+)?%\s*(accuracy|faster|reduction|of)\b/gi);
    expect(bad).toBeNull();
  });
});
