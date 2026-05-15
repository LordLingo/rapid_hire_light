/*
  §61 — Compliance hero CTA pair + 4-bullet trust strip (delivered).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const COMPLIANCE_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Compliance.tsx"),
  "utf8"
);
const PAGE_HERO_SRC = readFileSync(
  resolve(__dirname, "..", "components", "site", "PageHero.tsx"),
  "utf8"
);

describe("§61 — PageHero gains an afterLede slot", () => {
  it("declares the afterLede prop on the Props type", () => {
    expect(PAGE_HERO_SRC).toMatch(/afterLede\?:\s*React\.ReactNode/);
  });

  it("renders afterLede directly below the lede paragraph (with-visual variant)", () => {
    // Locate the with-visual headline column and confirm afterLede sits AFTER the lede paragraph
    // and BEFORE the column's closing </div>.
    const block = PAGE_HERO_SRC.match(
      /lg:col-span-5 reveal-on-scroll[\s\S]*?<\/div>\s*<div className="col-span-12 lg:col-span-4">/
    );
    expect(block).toBeTruthy();
    expect(block![0]).toContain("{lede}");
    expect(block![0]).toContain("data-testid=\"page-hero-after-lede\"");
    expect(block![0].indexOf("{lede}")).toBeLessThan(
      block![0].indexOf("data-testid=\"page-hero-after-lede\"")
    );
  });

  it("renders afterLede in the no-visual variant too (kept for parity)", () => {
    expect(PAGE_HERO_SRC.match(/data-testid="page-hero-after-lede"/g)?.length).toBe(2);
  });
});

describe("§61 — Compliance hero CTA pair", () => {
  it("primary CTA \"Book a free 15-min audit\" is a brand-blue Link to the dedicated /compliance/audit booking page", () => {
    // §64: re-pointed from /contact?topic=compliance-audit to /compliance/audit.
    expect(COMPLIANCE_SRC).toMatch(/data-testid="compliance-cta-audit"/);
    const block = COMPLIANCE_SRC.match(
      /<Link[\s\S]*?data-testid="compliance-cta-audit"[\s\S]*?Book a free 15-min audit/
    );
    expect(block).toBeTruthy();
    const text = block![0];
    expect(text).toMatch(/href="\/compliance\/audit"/);
    // Anti-regression: the old /contact target must NOT come back.
    expect(text).not.toMatch(/href="\/contact\?topic=compliance-audit"/);
    expect(text).toMatch(/bg-\[color:var\(--color-accent-ink\)\]/);
    expect(text).toMatch(/text-white/);
    expect(text).toMatch(/CalendarCheck2/);
    expect(text).toMatch(/btn-press/);
  });

  it("secondary CTA \"Get the 24-point checklist\" is an outlined wouter Link to /compliance/checklist", () => {
    // §65: re-pointed from in-page #certifications anchor to the dedicated
    // /compliance/checklist page. The element type also changed from <a> to
    // <Link> (wouter) for SPA-style navigation.
    expect(COMPLIANCE_SRC).toMatch(/data-testid="compliance-cta-checklist"/);
    const block = COMPLIANCE_SRC.match(
      /<Link[\s\S]*?data-testid="compliance-cta-checklist"[\s\S]*?Get the 24-point checklist/
    );
    expect(block).toBeTruthy();
    const text = block![0];
    expect(text).toMatch(/href="\/compliance\/checklist"/);
    // Anti-regression: the old #certifications anchor must NOT come back.
    expect(text).not.toMatch(/href="#certifications"/);
    expect(text).toMatch(/bg-transparent/);
    expect(text).toMatch(/border-\[color:var\(--color-border\)\]/);
    expect(text).toMatch(/text-\[color:var\(--color-ink\)\]/);
    expect(text).toMatch(/FileDown/);
    expect(text).toMatch(/btn-press/);
  });

  it("primary CTA renders BEFORE the secondary CTA", () => {
    const primary = COMPLIANCE_SRC.indexOf('data-testid="compliance-cta-audit"');
    const secondary = COMPLIANCE_SRC.indexOf('data-testid="compliance-cta-checklist"');
    expect(primary).toBeGreaterThan(-1);
    expect(secondary).toBeGreaterThan(primary);
  });
});

describe("§61 — Compliance hero 4-bullet trust strip", () => {
  it("renders four trust bullets in the documented order", () => {
    const block = COMPLIANCE_SRC.match(
      /data-testid="compliance-trust-strip"[\s\S]*?<\/ul>/
    );
    expect(block).toBeTruthy();
    const text = block![0];
    const labels = [
      "FCRA §§604, 611, 613, 615 workflow",
      "EEOC 2012 individualized assessment",
      "35+ state & city overlays tracked",
      "SOC 2 Type II + HIPAA aligned",
    ];
    let cursor = 0;
    for (const label of labels) {
      const idx = text.indexOf(label, cursor);
      expect(idx, `expected to find "${label}" after cursor ${cursor}`).toBeGreaterThan(-1);
      cursor = idx + label.length;
    }
  });

  it("each bullet is prefixed by a CheckCircle2 icon", () => {
    const block = COMPLIANCE_SRC.match(
      /data-testid="compliance-trust-strip"[\s\S]*?<\/ul>/
    )!;
    expect(block[0]).toMatch(/<CheckCircle2/);
    expect(block[0]).toMatch(/text-\[color:var\(--color-accent-ink\)\]/);
  });

  it("trust strip lays out as two columns on sm+ and one column on xs", () => {
    const block = COMPLIANCE_SRC.match(
      /data-testid="compliance-trust-strip"[\s\S]*?>/
    )!;
    expect(block[0]).toMatch(/grid-cols-1 sm:grid-cols-2/);
  });
});

describe("§61 — anti-regression: existing hero copy unchanged", () => {
  it("retains the headline italic phrase", () => {
    expect(COMPLIANCE_SRC).toMatch(/Compliance is the product,/);
    expect(COMPLIANCE_SRC).toMatch(/not the disclaimer\./);
  });

  it("retains the original lede first sentence", () => {
    expect(COMPLIANCE_SRC).toContain(
      "Every screen Rapid Hire Solutions runs is governed by the same standards"
    );
  });

  it("retains the hero photo on the right column", () => {
    expect(COMPLIANCE_SRC).toMatch(/COMPLIANCE_HERO_URL/);
    expect(COMPLIANCE_SRC).toMatch(/object-cover/);
  });
});
