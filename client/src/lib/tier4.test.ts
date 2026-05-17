/*
  §83 — Tier 4 anti-regression spec.
  -----------------------------------
  Pins:
    - internationalCountries dataset has 12 countries with required fields.
    - /services/international route is wired in App.tsx + sitemap.
    - Services hub injects the international pillar callout.
    - Each country has a unique iso2 + non-trivial copy.
*/
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COUNTRIES, getCountryByIso2 } from "./internationalCountries";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
const file = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

describe("§83 Tier 4 — international screening pillar", () => {
  it("ships 12 countries spanning Americas / EMEA / APAC", () => {
    expect(COUNTRIES.length).toBe(12);
    const regions = new Set(COUNTRIES.map((c) => c.region));
    expect(regions).toEqual(new Set(["Americas", "EMEA", "APAC"]));
  });

  it("every country has the required operational fields", () => {
    for (const c of COUNTRIES) {
      expect(c.iso2).toMatch(/^[a-z]{2}$/);
      expect(c.name.length).toBeGreaterThan(2);
      expect(c.turnaround.length).toBeGreaterThan(8);
      expect(c.checks.length).toBeGreaterThanOrEqual(3);
      expect(c.consent.length).toBeGreaterThan(20);
      expect(c.note.length).toBeGreaterThan(20);
    }
  });

  it("iso2 codes are unique", () => {
    const codes = COUNTRIES.map((c) => c.iso2);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("getCountryByIso2 is case-insensitive and returns undefined on miss", () => {
    expect(getCountryByIso2("GB")?.name).toBe("United Kingdom");
    expect(getCountryByIso2("in")?.name).toBe("India");
    expect(getCountryByIso2("zz")).toBeUndefined();
  });

  it("App.tsx wires /services/international + sitemap registers it", () => {
    const app = file("client/src/App.tsx");
    expect(app).toMatch(
      /import\s+ServiceInternational\s+from\s+"\.\/pages\/ServiceInternational"/,
    );
    expect(app).toMatch(
      /<Route\s+path=\{"\/services\/international"\}\s+component=\{ServiceInternational\}\s*\/>/,
    );
    expect(file("vite.config.ts")).toContain('"/services/international"');
  });

  it("Services hub surfaces the international pillar callout + link", () => {
    const services = file("client/src/pages/Services.tsx");
    expect(services).toMatch(/data-testid="services-international-callout"/);
    expect(services).toMatch(/data-testid="services-international-link"/);
    expect(services).toContain("/services/international");
  });

  it("the international page declares the country-selector testid", () => {
    const page = file("client/src/pages/ServiceInternational.tsx");
    expect(page).toMatch(/data-testid="international-country-selector"/);
    expect(page).toMatch(/data-testid=\{`international-country-\$\{c\.iso2\}`\}/);
  });
});
