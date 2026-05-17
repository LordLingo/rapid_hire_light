/*
  §99 — Home keywords-meta invariants.

  Some SEO auditors flag pages that have no <meta name="keywords"> tag.
  Modern Google ignores the tag, but the cost of supplying it is zero, so
  we do, both in the static SPA shell (so the warning never triggers even
  before hydration) and via useSeo on Home (so the curated set survives
  client-side route changes).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SHELL = readFileSync(
  resolve(__dirname, "..", "..", "index.html"),
  "utf8",
);
const HOME_SRC = readFileSync(
  resolve(__dirname, "..", "pages", "Home.tsx"),
  "utf8",
);
const HOOK_SRC = readFileSync(
  resolve(__dirname, "..", "hooks", "useSeo.ts"),
  "utf8",
);

describe("§99 — SPA shell keywords meta", () => {
  it("ships a non-empty <meta name=\"keywords\"> in client/index.html", () => {
    expect(SHELL).toMatch(/<meta\s+name="keywords"\s+content="[^"]+"/);
  });

  it("includes the four anchor topics that match Home's H1/H2 surface", () => {
    expect(SHELL).toMatch(/background check services/);
    expect(SHELL).toMatch(/FCRA-certified background screening/);
    expect(SHELL).toMatch(/employment background checks/);
    expect(SHELL).toMatch(/pre-employment screening/);
  });
});

describe("§99 — Home.tsx keyword wiring", () => {
  it("imports useSeo from the hook module", () => {
    expect(HOME_SRC).toMatch(/from\s+"@\/hooks\/useSeo"/);
  });

  it("calls useSeo with a keywords array of at least 6 entries", () => {
    // The arg literal lives between `useSeo({` and the matching `})`.
    const start = HOME_SRC.indexOf("useSeo({");
    expect(start).toBeGreaterThan(-1);
    const slice = HOME_SRC.slice(start, HOME_SRC.indexOf("});", start) + 3);
    const keywordsMatch = slice.match(/keywords:\s*\[([\s\S]*?)\]/);
    expect(keywordsMatch).not.toBeNull();
    const items = (keywordsMatch as RegExpMatchArray)[1]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    expect(items.length).toBeGreaterThanOrEqual(6);
  });

  it("includes background check services as the lead keyword", () => {
    expect(HOME_SRC).toMatch(/"background check services"/);
  });
});

describe("§99 — useSeo hook supports keywords", () => {
  it("declares keywords in the SeoOptions type", () => {
    expect(HOOK_SRC).toMatch(/keywords\?:\s*string\s*\|\s*string\[\]/);
  });

  it("writes a meta name=\"keywords\" tag and restores on unmount", () => {
    expect(HOOK_SRC).toMatch(/setMeta\("keywords"/);
    expect(HOOK_SRC).toMatch(/keywordsRestore/);
  });
});
