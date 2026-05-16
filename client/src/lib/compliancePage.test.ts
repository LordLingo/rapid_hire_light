/*
  §59 — Compliance page invariants pin.

  Three layers of coverage:
    1. Route registration in App.tsx
    2. Nav wiring in Header.tsx + Footer.tsx
    3. Compliance page structure: SEO, hero, all 9 sections, dark-band
       alternation, certifications grid, original visuals, no copy-paste
       of any third-party compliance copy.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const APP_SRC = readFileSync(
  resolve(__dirname, "..", "App.tsx"),
  "utf8"
);
const HEADER_SRC = readFileSync(
  resolve(__dirname, "..", "components", "site", "Header.tsx"),
  "utf8"
);
const FOOTER_SRC = readFileSync(
  resolve(__dirname, "..", "components", "site", "Footer.tsx"),
  "utf8"
);
const PAGE_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Compliance.tsx"),
  "utf8"
);

describe("§59 — /compliance route registration", () => {
  it("imports the Compliance page in App.tsx", () => {
    expect(APP_SRC).toMatch(/import Compliance from "\.\/pages\/Compliance"/);
  });

  it("registers the /compliance route", () => {
    expect(APP_SRC).toMatch(
      /<Route path=\{"\/compliance"\} component=\{Compliance\} \/>/
    );
  });
});

describe("§59 — Header nav wiring", () => {
  it("includes a Compliance NAV entry pointing at /compliance", () => {
    // §79 changed the discriminator from `type:` to `kind:` when
    // introducing the Resources group; the route-typed shape is
    // otherwise identical.
    expect(HEADER_SRC).toMatch(
      /\{\s*kind:\s*"route"\s*,\s*label:\s*"Compliance"\s*,\s*href:\s*"\/compliance"\s*\}/
    );
  });

  it("places Compliance between Support and Contact Us in the NAV order", () => {
    const supportIdx = HEADER_SRC.indexOf('label: "Support"');
    const complianceIdx = HEADER_SRC.indexOf('label: "Compliance"');
    const contactIdx = HEADER_SRC.indexOf('label: "Contact Us"');
    expect(supportIdx).toBeGreaterThan(-1);
    expect(complianceIdx).toBeGreaterThan(supportIdx);
    expect(contactIdx).toBeGreaterThan(complianceIdx);
  });
});

describe("§59 — Footer wiring", () => {
  it("includes Compliance in the COMPANY column", () => {
    expect(FOOTER_SRC).toMatch(
      /\{\s*label:\s*"Compliance",\s*to:\s*"\/compliance"\s*\}/
    );
  });
});

describe("§59 — Compliance page SEO + hero", () => {
  it("uses the useSeo helper with a Compliance-specific title", () => {
    expect(PAGE_SRC).toMatch(/useSeo\(\{/);
    expect(PAGE_SRC).toMatch(/title:\s*"Compliance/);
  });

  it("renders PageHero with the 00 — Compliance eyebrow", () => {
    expect(PAGE_SRC).toMatch(/eyebrow="00 — Compliance"/);
  });

  it("renders an editorial hero image (not a code-built infographic) via PageHero `visual`", () => {
    expect(PAGE_SRC).toMatch(/COMPLIANCE_HERO_URL/);
    expect(PAGE_SRC).toMatch(/visual=\{[\s\S]*?<img\s/);
  });

  it("hero image source is hosted on the webdev CDN (not a local public/ asset)", () => {
    expect(PAGE_SRC).toMatch(
      /COMPLIANCE_HERO_URL\s*=\s*"https:\/\/[^"]*cloudfront\.net\/[^"]+\.webp"/
    );
  });
});

describe("§59 — page structure: 9 sections in correct order", () => {
  const expectedIds = [
    "overview",
    "fcra",
    "adverse-action",
    "state-local",
    "eeoc",
    "drug-health",
    "data-security",
    "candidate-rights",
    "certifications",
  ];

  it("renders all 9 section ids in order", () => {
    let cursor = 0;
    for (const id of expectedIds) {
      const idx = PAGE_SRC.indexOf(`id="${id}"`, cursor);
      expect(
        idx,
        `expected section id="${id}" after cursor ${cursor}`
      ).toBeGreaterThan(-1);
      cursor = idx;
    }
  });

  it("renders the matching numbered eyebrows", () => {
    const eyebrows = [
      '01 — Overview',
      '02 — FCRA',
      '03 — Adverse action',
      '04 — State + local',
      '05 — EEOC',
      '06 — Drug + health',
      '07 — Data security',
      '08 — Candidate rights',
      '09 — Certifications',
    ];
    for (const e of eyebrows) {
      expect(PAGE_SRC).toContain(e);
    }
  });
});

describe("§59 — alternating warm-paper / dark-band rhythm", () => {
  it("uses the footer-family dark gradient string (centralized in the Section component)", () => {
    // The gradient is declared once inside the shared <Section> component;
    // the alternation count is enforced by surface="dark" props instead.
    expect(PAGE_SRC).toMatch(
      /linear-gradient\(90deg, var\(--color-footer-soft\) 0%, var\(--color-footer\) 65%, var\(--color-footer\) 100%\)/
    );
  });

  it("opts at least three sections into the dark surface variant", () => {
    const matches = PAGE_SRC.match(/surface="dark"/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(3);
  });

  it("marks dark sections with the compliance-section-dark class for cross-file pinning", () => {
    const marker = PAGE_SRC.match(/markerClass="compliance-section-dark"/g) ?? [];
    expect(marker.length).toBeGreaterThanOrEqual(3);
  });

  it("dark sections invert the eyebrow to footer-muted", () => {
    expect(PAGE_SRC).toMatch(
      /eyebrow text-\[color:var\(--color-footer-muted\)\]/
    );
  });

  it("uses the sky-halo italic accent (not brand-blue) on dark band headlines", () => {
    expect(PAGE_SRC).toMatch(
      /italic font-light text-\[color:var\(--color-accent-halo\)\]/
    );
  });
});

describe("§59 — certifications + audits content", () => {
  it("names SOC 2 Type II, HIPAA, FCRA training, and the PBSA pathway", () => {
    expect(PAGE_SRC).toContain("SOC 2 Type II");
    expect(PAGE_SRC).toContain("HIPAA");
    expect(PAGE_SRC).toContain("FCRA training");
    expect(PAGE_SRC).toContain("PBSA pathway");
  });

  it("the certifications dark band ends with a compliance contact CTA pointing at /contact", () => {
    expect(PAGE_SRC).toMatch(/href="\/contact"/);
    expect(PAGE_SRC).toContain("Talk to compliance");
  });
});

describe("§59 — adverse action 3-step workflow", () => {
  it("declares all three named steps", () => {
    expect(PAGE_SRC).toContain("Pre-adverse notice");
    expect(PAGE_SRC).toContain("Reasonable waiting window");
    expect(PAGE_SRC).toContain("Final action notice");
  });

  it("frames adverse action as a two-step cadence with a real waiting window", () => {
    expect(PAGE_SRC).toMatch(/two-step (adverse action|cadence)/i);
  });
});

describe("§59 — candidate rights surface", () => {
  it("calls out the four standing FCRA rights", () => {
    expect(PAGE_SRC).toContain("Right to a copy of the report");
    expect(PAGE_SRC).toContain("Right to dispute");
    expect(PAGE_SRC).toContain(
      "Right to an updated report after reinvestigation"
    );
    expect(PAGE_SRC).toContain(
      "Right to receive the federal Summary of Rights"
    );
  });

  it("offers a direct phone + email line for candidate disputes", () => {
    expect(PAGE_SRC).toMatch(/href="tel:\+18884453047"/);
    expect(PAGE_SRC).toMatch(/href="mailto:info@rapidhiresolutions\.com"/);
  });
});

describe("§59 — anti-regression: original copy, not a paste", () => {
  it("does not reference any third-party CRA brand by name in the page copy", () => {
    // Guard against future copy/paste from a competitor compliance page.
    expect(PAGE_SRC).not.toMatch(/PreciseHire|Precise Hire|precisehire/i);
    expect(PAGE_SRC).not.toMatch(/Checkr|Sterling|GoodHire|HireRight/i);
  });

  it("ends with the shared CtaBanner so the dark-band rhythm closes cleanly", () => {
    expect(PAGE_SRC).toMatch(/import CtaBanner from "@\/components\/site\/CtaBanner"/);
    expect(PAGE_SRC).toMatch(/<CtaBanner \/>/);
  });
});
