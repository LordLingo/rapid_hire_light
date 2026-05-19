/*
  §138 — vitest pin: SPA brand hook (Speed · Price · Accuracy) site-wide rollout.

  Locks the canonical SPA strings and the touchpoints that wire them into
  the public site so a future copy-edit or refactor doesn't quietly drop
  one of the surfaces. Every assertion reads source files directly; no
  React rendering is required.

  Pinned facts:
    - lib/spa.ts exports SPA_HEADLINE, SPA_TAGLINE, SPA_COMPACT, SPA_ROUTE,
      SPA_TREATMENT_CTA, and a 3-pillar SPA_PILLARS array (S/P/A in order).
    - Hero.tsx imports SpaPillars + SPA_ROUTE/SPA_TAGLINE and renders the
      "Why we call it SPA" link to SPA_ROUTE.
    - /spa landing page (Spa.tsx) renders the hero variant of SpaPillars
      and has a primary CTA to /contact.
    - Footer.tsx surfaces SPA_TAGLINE + SPA_COMPACT eyebrow with stable
      data-testids, and includes "Why SPA?" routed at SPA_ROUTE in the
      Company column.
    - Header.tsx NAV array carries a "Why SPA?" entry at SPA_ROUTE so the
      hook is reachable from the global desktop nav.
    - App.tsx registers the /spa route to the Spa page component.
*/
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  SPA_HEADLINE,
  SPA_TAGLINE,
  SPA_COMPACT,
  SPA_ROUTE,
  SPA_PILLARS,
  SPA_TREATMENT_CTA,
} from "./spa";

const CLIENT_SRC = path.resolve(__dirname, "..");
const read = (rel: string) =>
  fs.readFileSync(path.resolve(CLIENT_SRC, rel), "utf8");

const HERO_SRC = read("components/site/Hero.tsx");
const SPA_PAGE_SRC = read("pages/Spa.tsx");
const FOOTER_SRC = read("components/site/Footer.tsx");
const HEADER_SRC = read("components/site/Header.tsx");
const APP_SRC = read("App.tsx");

describe("§138 — SPA brand hook constants (lib/spa.ts)", () => {
  it("locks the canonical SPA_HEADLINE", () => {
    expect(SPA_HEADLINE).toBe("Speed. Price. Accuracy.");
  });

  it("locks the canonical SPA_TAGLINE", () => {
    expect(SPA_TAGLINE).toBe("Relax — we've got it handled.");
  });

  it("locks the compact SPA_COMPACT eyebrow form", () => {
    expect(SPA_COMPACT).toBe("Speed · Price · Accuracy.");
  });

  it("locks SPA_ROUTE to /spa", () => {
    expect(SPA_ROUTE).toBe("/spa");
  });

  it("locks SPA_TREATMENT_CTA wording", () => {
    expect(SPA_TREATMENT_CTA).toBe("Book your SPA Treatment");
  });

  it("exports exactly three pillars in S/P/A order", () => {
    expect(SPA_PILLARS).toHaveLength(3);
    expect(SPA_PILLARS.map((p) => p.letter)).toEqual(["S", "P", "A"]);
    expect(SPA_PILLARS.map((p) => p.label)).toEqual([
      "Speed",
      "Price",
      "Accuracy",
    ]);
  });

  it("each pillar has a non-empty metric, supportingCopy, and icon", () => {
    for (const pillar of SPA_PILLARS) {
      expect(pillar.metric.length).toBeGreaterThan(0);
      expect(pillar.supportingCopy.length).toBeGreaterThan(20);
      expect(pillar.icon).toBeDefined();
    }
  });
});

describe("§138 — Hero.tsx integrates SPA framing", () => {
  it("imports SpaPillars from the site components folder", () => {
    expect(HERO_SRC).toMatch(/import\s+SpaPillars\s+from\s+["']\.\/SpaPillars["']/);
  });

  it("imports SPA_ROUTE and SPA_TAGLINE from lib/spa", () => {
    expect(HERO_SRC).toMatch(
      /import\s*\{[^}]*SPA_ROUTE[^}]*\}\s*from\s+["']@\/lib\/spa["']/,
    );
    expect(HERO_SRC).toMatch(
      /import\s*\{[^}]*SPA_TAGLINE[^}]*\}\s*from\s+["']@\/lib\/spa["']/,
    );
  });

  it("renders SpaPillars in the editorial variant inside the hero", () => {
    expect(HERO_SRC).toMatch(/<SpaPillars[^>]+variant=["']editorial["']/);
  });

  it("includes a 'Why we call it SPA' link pointing at SPA_ROUTE", () => {
    expect(HERO_SRC).toMatch(/Why we call it SPA/);
    expect(HERO_SRC).toMatch(/href=\{SPA_ROUTE\}/);
  });
});

describe("§138 — /spa landing page (Spa.tsx)", () => {
  it("imports SpaPillars from the @/ alias", () => {
    expect(SPA_PAGE_SRC).toMatch(
      /import\s+SpaPillars\s+from\s+["']@\/components\/site\/SpaPillars["']/,
    );
  });

  it("imports SPA_HEADLINE + SPA_TAGLINE from lib/spa", () => {
    expect(SPA_PAGE_SRC).toMatch(
      /import\s*\{[\s\S]*?SPA_HEADLINE[\s\S]*?\}\s*from\s+["']@\/lib\/spa["']/,
    );
    expect(SPA_PAGE_SRC).toMatch(
      /import\s*\{[\s\S]*?SPA_TAGLINE[\s\S]*?\}\s*from\s+["']@\/lib\/spa["']/,
    );
  });

  it("renders the hero variant of SpaPillars", () => {
    expect(SPA_PAGE_SRC).toMatch(/<SpaPillars[^>]+variant=["']hero["']/);
  });

  it("has a primary CTA pointing to /contact", () => {
    expect(SPA_PAGE_SRC).toMatch(
      /data-testid=["']spa-hero-primary-cta["'][\s\S]{0,400}?\/contact|href=["']\/contact["'][\s\S]{0,400}?spa-hero-primary-cta/,
    );
  });

  it("has a final CTA with the spa-final-cta testid", () => {
    expect(SPA_PAGE_SRC).toMatch(/data-testid=["']spa-final-cta["']/);
  });
});

describe("§138 — Footer.tsx carries SPA tagline + Why SPA link", () => {
  it("imports SPA_COMPACT, SPA_ROUTE, SPA_TAGLINE from lib/spa", () => {
    expect(FOOTER_SRC).toMatch(
      /import\s*\{[\s\S]*?SPA_COMPACT[\s\S]*?SPA_ROUTE[\s\S]*?SPA_TAGLINE[\s\S]*?\}\s*from\s+["']@\/lib\/spa["']/,
    );
  });

  it("renders the SPA eyebrow with data-testid='footer-spa-eyebrow'", () => {
    expect(FOOTER_SRC).toMatch(/data-testid=["']footer-spa-eyebrow["']/);
    expect(FOOTER_SRC).toMatch(/\{SPA_COMPACT\}/);
  });

  it("renders the SPA tagline with data-testid='footer-spa-tagline'", () => {
    expect(FOOTER_SRC).toMatch(/data-testid=["']footer-spa-tagline["']/);
    expect(FOOTER_SRC).toMatch(/\{SPA_TAGLINE\}/);
  });

  it("includes 'Why SPA?' entry routed at SPA_ROUTE in the Company column", () => {
    expect(FOOTER_SRC).toMatch(
      /label:\s*["']Why SPA\?["'],\s*to:\s*SPA_ROUTE/,
    );
  });
});

describe("§138 — Header.tsx NAV exposes 'Why SPA?'", () => {
  it("imports SPA_ROUTE from lib/spa", () => {
    expect(HEADER_SRC).toMatch(
      /import\s*\{[\s\S]*?SPA_ROUTE[\s\S]*?\}\s*from\s+["']@\/lib\/spa["']/,
    );
  });

  it("registers a 'Why SPA?' route entry in the NAV array", () => {
    expect(HEADER_SRC).toMatch(
      /label:\s*["']Why SPA\?["'],\s*href:\s*SPA_ROUTE/,
    );
  });
});

describe("§138 — App.tsx registers the /spa route", () => {
  it("imports the Spa page component", () => {
    expect(APP_SRC).toMatch(
      /import\s+Spa\s+from\s+["']\.\/pages\/Spa["']/,
    );
  });

  it("registers <Route path=\"/spa\" component={Spa} />", () => {
    expect(APP_SRC).toMatch(
      /<Route\s+path=\{?["']\/spa["']\}?\s+component=\{Spa\}\s*\/>/,
    );
  });
});
