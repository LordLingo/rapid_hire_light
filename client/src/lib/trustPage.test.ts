/*
  §67 — /trust dedicated trust & verification page

  Source-pinning vitest specs that lock in:
    - the page module exists and is registered under /trust in App.tsx
    - the hero eyebrow, italic-accented title fragment, and CTAs
    - the badge trio band markup with the three certification badges
    - the three per-badge sections (SOC 2 / PBSA / FCRA), each carrying the
      scope · cadence · verify detail blocks
    - the procurement attestation-pack block + closing dark CTA band
    - the Footer link to /trust in the COMPANY column
    - useSeo title text

  These tests intentionally read raw source strings rather than rendering the
  component so they catch regressions even without DOM emulation.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const trust = readFileSync(
  resolve(__dirname, "../pages/Trust.tsx"),
  "utf8",
);
const app = readFileSync(
  resolve(__dirname, "../App.tsx"),
  "utf8",
);
const footer = readFileSync(
  resolve(__dirname, "../components/site/Footer.tsx"),
  "utf8",
);

describe("/trust page exists & is wired", () => {
  it("imports Trust into App.tsx", () => {
    expect(app).toMatch(/import\s+Trust\s+from\s+"\.\/pages\/Trust";/);
  });

  it("registers the /trust route in App.tsx", () => {
    expect(app).toMatch(/<Route\s+path=\{"\/trust"\}\s+component=\{Trust\}\s*\/>/);
  });

  it("uses SiteShell + PageHero + useSeo", () => {
    expect(trust).toMatch(/from\s+"@\/components\/site\/SiteShell"/);
    expect(trust).toMatch(/from\s+"@\/components\/site\/PageHero"/);
    expect(trust).toMatch(/from\s+"@\/hooks\/useSeo"/);
  });
});

describe("hero", () => {
  it("uses the standardised eyebrow pattern", () => {
    expect(trust).toMatch(/eyebrow="00 — Trust & verification"/);
  });

  it("renders the italic-accented title fragment about verifiability", () => {
    expect(trust).toMatch(
      /The badges on our pricing page are[\s\S]*?italic font-light[\s\S]*?verifiable\./,
    );
  });

  it("primary CTA jumps to the attestation-pack anchor", () => {
    expect(trust).toMatch(/data-testid="trust-cta-pack"/);
    expect(trust).toMatch(/href="#attestation-pack"/);
    expect(trust).toMatch(/Request the attestation pack/);
  });

  it("secondary hero CTA exposes the compliance phone number", () => {
    expect(trust).toMatch(/data-testid="trust-cta-phone"/);
    expect(trust).toMatch(/\+18667735486/);
    expect(trust).toMatch(/\(866\) 773-5486/);
  });

  it("right-rail visual is a verification card with the compliance email", () => {
    expect(trust).toMatch(/data-testid="trust-verify-card"/);
    expect(trust).toMatch(/data-testid="trust-verify-card-email"/);
    expect(trust).toMatch(/compliance@rapidhiresolutions\.com/);
  });
});

describe("badge trio band", () => {
  it("renders the three badges in order: soc2 → pbsa → fcra", () => {
    expect(trust).toMatch(/data-testid="trust-trio"/);
    const soc2 = trust.indexOf('data-testid={`trust-trio-badge-${b.slug}`}');
    expect(soc2).toBeGreaterThan(0);
    // Verify the BADGES array preserves the three slugs in the right order.
    const badgesArr = trust.match(/const BADGES:[\s\S]*?\];/)?.[0] ?? "";
    expect(badgesArr).toBeTruthy();
    const i1 = badgesArr.indexOf('slug: "soc2"');
    const i2 = badgesArr.indexOf('slug: "pbsa"');
    const i3 = badgesArr.indexOf('slug: "fcra"');
    expect(i1).toBeGreaterThan(-1);
    expect(i2).toBeGreaterThan(i1);
    expect(i3).toBeGreaterThan(i2);
  });

  it("uses the three uploaded /static/ badge assets", () => {
    // §189: migrated from /manus-storage/ to /static/ so the assets ship
    // with the Vercel build instead of relying on a Manus-only host route.
    expect(trust).toMatch(/\/static\/badge-soc2-type2\.webp/);
    expect(trust).toMatch(/\/static\/badge-pbsa-member\.webp/);
    expect(trust).toMatch(/\/static\/badge-fcra-aligned\.webp/);
  });
});

describe("per-badge detail sections (scope · cadence · verify)", () => {
  it("renders a detail section for each of the three badges", () => {
    for (const slug of ["soc2", "pbsa", "fcra"]) {
      expect(trust).toMatch(new RegExp(`id={badge\\.slug}`));
      expect(trust).toMatch(new RegExp(`trust-section-\\$\\{badge\\.slug\\}`));
      // Sanity: each slug appears in the BADGES array.
      expect(trust).toMatch(new RegExp(`slug: "${slug}"`));
    }
  });

  it("each badge has scope, cadence, and verify copy", () => {
    const badgesArr = trust.match(/const BADGES:[\s\S]*?\];/)?.[0] ?? "";
    expect(badgesArr).toBeTruthy();
    const matches = badgesArr.match(/scope:\s*"/g) ?? [];
    expect(matches.length).toBe(3);
    const cadences = badgesArr.match(/cadence:\s*"/g) ?? [];
    expect(cadences.length).toBe(3);
    const verifies = badgesArr.match(/verify:\s*"/g) ?? [];
    expect(verifies.length).toBe(3);
  });

  it("renders a labelled three-column detail grid in BadgeSection", () => {
    expect(trust).toMatch(/\["Scope", badge\.scope, "scope"\]/);
    expect(trust).toMatch(/\["Cadence", badge\.cadence, "cadence"\]/);
    expect(trust).toMatch(/\["How to verify", badge\.verify, "verify"\]/);
  });

  it("middle (PBSA) section uses the dark band, others stay on warm paper", () => {
    const badgesArr = trust.match(/const BADGES:[\s\S]*?\];/)?.[0] ?? "";
    // Pull each badge object as a chunk and check its `dark:` flag.
    const chunks = badgesArr.split(/\{\s*slug:/).slice(1);
    expect(chunks.length).toBe(3);
    const flags = chunks.map((c) => /dark:\s*true/.test(c));
    expect(flags).toEqual([false, true, false]);
  });
});

describe("procurement attestation-pack block", () => {
  it("anchors at #attestation-pack and exposes mailto + /contact CTAs", () => {
    expect(trust).toMatch(/id="attestation-pack"/);
    expect(trust).toMatch(/data-testid="trust-pack"/);
    expect(trust).toMatch(/data-testid="trust-pack-email"/);
    expect(trust).toMatch(/data-testid="trust-pack-talk"/);
    expect(trust).toMatch(
      /mailto:\$\{COMPLIANCE_EMAIL\}\?subject=Attestation%20pack%20request/,
    );
    // And confirm the constant resolves to the rapidhiresolutions.com address.
    expect(trust).toMatch(
      /COMPLIANCE_EMAIL\s*=\s*"compliance@rapidhiresolutions\.com"/,
    );
  });
});

describe("closing dark CTA band", () => {
  it("renders a dark band linking to /compliance/audit and back to /compliance", () => {
    expect(trust).toMatch(/data-testid="trust-closing"/);
    expect(trust).toMatch(/data-testid="trust-closing-cta-audit"/);
    expect(trust).toMatch(/href="\/compliance\/audit"/);
    expect(trust).toMatch(/data-testid="trust-closing-cta-back"/);
    expect(trust).toMatch(/href="\/compliance"/);
    expect(trust).toMatch(/var\(--color-footer\)/);
  });
});

describe("footer surfaces /trust", () => {
  it("Footer COMPANY column lists Trust & verification → /trust", () => {
    expect(footer).toMatch(/label:\s*"Trust & verification",\s*to:\s*"\/trust"/);
  });
});

describe("SEO", () => {
  it("useSeo title mentions Trust & verification + Rapid Hire Solutions", () => {
    expect(trust).toMatch(
      /title:\s*"Trust & verification — Rapid Hire Solutions"/,
    );
  });
});
