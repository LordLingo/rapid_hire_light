/*
  About page + nav wiring — invariants pin (§75).

  After the §75 pass, the About page is reachable from three places:
    1. The /about route in App.tsx
    2. The desktop + mobile primary nav (Header.tsx)
    3. The footer Company column (Footer.tsx)

  And the page itself carries:
    - The founding-year anchor in the hero lede ("Founded in 2011")
    - A new "Milestones" timeline section with eyebrow "06 — Milestones"
    - All seven year markers (2011, 2014, 2017, 2020, 2022, 2024, 2026)

  These pins keep a future "tighten copy" or "simplify nav" pass
  from silently regressing the §75 work.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "..", "..", "..");
const ABOUT_SRC = readFileSync(
  resolve(ROOT, "client", "src", "pages", "About.tsx"),
  "utf8",
);
const HEADER_SRC = readFileSync(
  resolve(ROOT, "client", "src", "components", "site", "Header.tsx"),
  "utf8",
);
const FOOTER_SRC = readFileSync(
  resolve(ROOT, "client", "src", "components", "site", "Footer.tsx"),
  "utf8",
);
const APP_SRC = readFileSync(
  resolve(ROOT, "client", "src", "App.tsx"),
  "utf8",
);
const VITE_SRC = readFileSync(resolve(ROOT, "vite.config.ts"), "utf8");

describe("§75 — About page is wired into the app shell", () => {
  it("/about route is registered in App.tsx", () => {
    expect(APP_SRC).toMatch(/path=\{?["']\/about["']\}?\s+component=\{About\}/);
  });

  it("About link appears in the desktop+mobile primary nav (Header.tsx)", () => {
    // Header.tsx defines a single NAV array consumed by both render
    // branches. The §75 entry must be present and route-typed.
    // §79 changed the discriminator from `type:` to `kind:` when
    // introducing the Resources group; the route-typed shape is
    // otherwise identical.
    expect(HEADER_SRC).toMatch(
      /\{\s*kind:\s*"route"\s*,\s*label:\s*"About"\s*,\s*href:\s*"\/about"\s*\}/,
    );
  });

  it("About link is present in the Footer Company column", () => {
    expect(FOOTER_SRC).toMatch(/label:\s*"About Us"\s*,\s*to:\s*"\/about"/);
  });

  it("/about is included in the static sitemap routes (vite.config.ts)", () => {
    expect(VITE_SRC).toMatch(/path:\s*"\/about"/);
  });
});

describe("§75 — About page content guarantees", () => {
  it("hero lede carries the founding-year anchor (Founded in 2011)", () => {
    expect(ABOUT_SRC).toMatch(/Founded in 2011/);
  });

  it("Milestones section eyebrow and section heading both present", () => {
    expect(ABOUT_SRC).toMatch(/eyebrow["'][^"]*>06 — Milestones/);
    expect(ABOUT_SRC).toMatch(/Fourteen years/);
  });

  it("all seven milestone years are listed in chronological order", () => {
    const years = ["2011", "2014", "2017", "2020", "2022", "2024", "2026"];
    let cursor = 0;
    for (const y of years) {
      const idx = ABOUT_SRC.indexOf(`year: "${y}"`, cursor);
      expect(idx, `expected year ${y} after position ${cursor}`).toBeGreaterThan(
        cursor === 0 ? -1 : cursor,
      );
      cursor = idx + 1;
    }
  });

  it("page still renders the four founding stats (FCRA, U.S., 24h, 12,000+)", () => {
    expect(ABOUT_SRC).toMatch(/85%\+/);
    expect(ABOUT_SRC).toMatch(/U\.S\./);
    expect(ABOUT_SRC).toMatch(/FCRA/);
    expect(ABOUT_SRC).toMatch(/12,000\+/);
  });

  it("closing CTA still links to /contact", () => {
    expect(ABOUT_SRC).toMatch(/href=\{?"\/contact"\}?/);
  });
});

describe("§77 — By the numbers ledger band (replaces removed Leadership)", () => {
  it("section eyebrow '08 — By the numbers' is present", () => {
    expect(ABOUT_SRC).toMatch(/eyebrow["'][^"]*>08 — By the numbers/);
  });

  it("section headline 'The story in numbers.' is present", () => {
    expect(ABOUT_SRC).toMatch(/The story/);
    expect(ABOUT_SRC).toMatch(/in numbers\./);
  });

  it("the BY_THE_NUMBERS array exists and contains six entries", () => {
    const blockMatch = ABOUT_SRC.match(/const BY_THE_NUMBERS = \[([\s\S]*?)\];/);
    expect(blockMatch, "BY_THE_NUMBERS array must exist").not.toBeNull();
    const entries = (blockMatch?.[1].match(/eyebrow:\s*"\d+"/g) ?? []);
    expect(entries.length).toBe(6);
  });

  it("all six headline metrics appear in the source", () => {
    expect(ABOUT_SRC).toMatch(/k:\s*"14"/);
    expect(ABOUT_SRC).toMatch(/k:\s*"24"/);
    expect(ABOUT_SRC).toMatch(/k:\s*"50"/);
    expect(ABOUT_SRC).toMatch(/k:\s*"3,200\+"/);
    expect(ABOUT_SRC).toMatch(/k:\s*"HIPAA"/);
    expect(ABOUT_SRC).toMatch(/k:\s*"<2%"/);
  });

  it("renders as a <dl> ledger so the metrics map to <dt>/<dd> for accessibility", () => {
    expect(ABOUT_SRC).toMatch(/<dl[^>]*>/);
    expect(ABOUT_SRC).toMatch(/<dt[^>]*>/);
    expect(ABOUT_SRC).toMatch(/<dd[^>]*>/);
  });

  it("the band sits BEFORE the closing CTA section", () => {
    const numbersIdx = ABOUT_SRC.indexOf("08 — By the numbers");
    const ctaIdx = ABOUT_SRC.indexOf("09 — Talk to us");
    expect(numbersIdx).toBeGreaterThan(0);
    expect(ctaIdx).toBeGreaterThan(numbersIdx);
  });

  it("closing CTA eyebrow renumbered to '09 — Talk to us'", () => {
    expect(ABOUT_SRC).toMatch(/eyebrow["'][^"]*>09 — Talk to us/);
    // anti-regression: the old §76 "08 — Talk to us" string must be gone
    expect(ABOUT_SRC).not.toMatch(/eyebrow["'][^"]*>08 — Talk to us/);
  });
});
