/*
  §68 — /compliance credibility bar (port from precisehire.com/compliance)

  Source-pinning vitest specs. The credibility bar lives directly under the
  Compliance hero, before the §01 Overview Section, and links each Verify
  link to the matching per-badge anchor on /trust (built in §67).

  These specs intentionally read raw source so a regression that re-orders
  the items, breaks a Verify link, or restores the precisehire-only
  "22+ years · est. 2003" / "8a–8p ET" copy will fail loudly.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const compliance = readFileSync(
  resolve(__dirname, "../pages/Compliance.tsx"),
  "utf8",
);

describe("§68 — credibility bar mounted between hero and §01", () => {
  it("renders the ComplianceCredibilityBar component immediately after PageHero close", () => {
    // The bar must sit between the hero closing `/>` and the §01 Section.
    const heroClose = compliance.indexOf("eyebrow=\"01 — Overview\"");
    expect(heroClose).toBeGreaterThan(0);
    const barTag = compliance.indexOf("<ComplianceCredibilityBar />");
    expect(barTag).toBeGreaterThan(0);
    expect(barTag).toBeLessThan(heroClose);
    // And the bar's component definition must exist.
    expect(compliance).toMatch(/function\s+ComplianceCredibilityBar\(\)\s*\{/);
  });

  it("uses a labelled <section> with the right testid + aria-label", () => {
    expect(compliance).toMatch(/data-testid="compliance-credibility-bar"/);
    expect(compliance).toMatch(
      /aria-label="Independent attestations and U\.S\. specialist support"/,
    );
  });
});

describe("§68 — three certification badges (soc2 → pbsa → fcra)", () => {
  it("declares CRED_BADGES in the right order with the /trust slug → /manus-storage badge mapping", () => {
    const arr = compliance.match(/const CRED_BADGES:[\s\S]*?\];/)?.[0] ?? "";
    expect(arr).toBeTruthy();
    const i1 = arr.indexOf('slug: "soc2"');
    const i2 = arr.indexOf('slug: "pbsa"');
    const i3 = arr.indexOf('slug: "fcra"');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(i3).toBeGreaterThan(i2);
    // Each slug must map to its uploaded /manus-storage badge image.
    expect(arr).toMatch(/\/manus-storage\/badge-soc2-type2_36054675\.webp/);
    expect(arr).toMatch(/\/manus-storage\/badge-pbsa-member_4f368a83\.webp/);
    expect(arr).toMatch(/\/manus-storage\/badge-fcra-aligned_359d4dc8\.webp/);
  });

  it("renders one badge item per CRED_BADGES entry with the parametric testid", () => {
    expect(compliance).toMatch(
      /data-testid=\{`compliance-cred-badge-\$\{b\.slug\}`\}/,
    );
  });

  it("exposes the right human-readable badge titles + captions", () => {
    expect(compliance).toMatch(/title:\s*"SOC 2 Type II"/);
    expect(compliance).toMatch(/caption:\s*"Attested annually"/);
    expect(compliance).toMatch(/title:\s*"PBSA Member"/);
    expect(compliance).toMatch(/caption:\s*"In good standing"/);
    expect(compliance).toMatch(/title:\s*"FCRA-aligned"/);
    expect(compliance).toMatch(/caption:\s*"15 U\.S\.C\. §1681 workflow"/);
  });
});

describe("§68 — Verify links jump to /trust#<slug>", () => {
  it("each badge's Verify is a wouter Link to the matching /trust anchor", () => {
    expect(compliance).toMatch(
      /<Link\s+href=\{`\/trust#\$\{b\.slug\}`\}/,
    );
    expect(compliance).toMatch(
      /data-testid=\{`compliance-cred-verify-\$\{b\.slug\}`\}/,
    );
  });

  it("the link text is the literal word 'Verify'", () => {
    // The interpolated <Link>...Verify</Link> markup must contain the word.
    const linkBlock =
      compliance.match(/data-testid=\{`compliance-cred-verify-\$\{b\.slug\}`\}[\s\S]{0,400}<\/Link>/)?.[0] ??
      "";
    expect(linkBlock).toBeTruthy();
    expect(linkBlock).toMatch(/>\s*Verify\s*</);
  });
});

describe("§68 — items 4 & 5 use Rapid-Hire-truthful copy (not precisehire's)", () => {
  it("item 4 is the 800+ teams scale-proof line, NOT '22+ years · est. 2003'", () => {
    expect(compliance).toMatch(/data-testid="compliance-cred-scale"/);
    expect(compliance).toMatch(/800\+\s*HR\s*&amp;\s*staffing\s+teams/);
    expect(compliance).toMatch(/99\.4%\s+on-time/);
    // Anti-regression: the precisehire-only "22+ years" / "est. 2003" claim
    // must not appear anywhere on the page (we don't publish a founding
    // year on the rest of the site).
    expect(compliance).not.toMatch(/22\+\s*years/);
    expect(compliance).not.toMatch(/est\.\s*2003/);
  });

  it("item 5 is U.S. specialist Mon–Fri 7am–7pm CT · Sat on-call (matches Support.tsx)", () => {
    expect(compliance).toMatch(/data-testid="compliance-cred-hours"/);
    expect(compliance).toMatch(/U\.S\.\s+specialist/);
    expect(compliance).toMatch(/Mon–Fri\s+7am–7pm\s+CT/);
    expect(compliance).toMatch(/Sat\s+on-call/);
    // Anti-regression: the precisehire-only "8a–8p ET, Sat 9a–1p" hours
    // must not appear anywhere on the page.
    expect(compliance).not.toMatch(/8a–8p\s+ET/);
    expect(compliance).not.toMatch(/Sat\s+9a–1p/);
  });

  it("item 4 uses ShieldCheck and item 5 uses Phone (lucide icons already imported)", () => {
    // Pull the bar component body so we can scan icon usage in scope.
    const fnIdx = compliance.indexOf("function ComplianceCredibilityBar");
    const nextFnIdx = compliance.indexOf("function TrustGrid", fnIdx);
    const body = compliance.slice(fnIdx, nextFnIdx);
    expect(body).toMatch(/<ShieldCheck\b/);
    expect(body).toMatch(/<Phone\b/);
  });
});
