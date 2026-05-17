/*
  §98 — Lighthouse SEO budget invariants.

  The lighthouserc + npm-script combo guards the SEO score on three
  representative URLs (homepage, blog index, prerendered post). These
  asserts make sure future edits can't quietly relax the budget or
  drop one of the audited URLs.
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT_ROOT = resolve(__dirname, "..", "..", "..");
const LHCI = JSON.parse(
  readFileSync(resolve(PROJECT_ROOT, ".lighthouserc.json"), "utf8"),
);
const PKG = JSON.parse(
  readFileSync(resolve(PROJECT_ROOT, "package.json"), "utf8"),
);

describe("§98 — Lighthouse SEO budget", () => {
  it("audits the homepage, blog index, and a prerendered post", () => {
    const urls: string[] = LHCI.ci.collect.url;
    expect(urls.some((u) => u.endsWith("/"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog"))).toBe(true);
    expect(urls.some((u) => u.includes("/blog/"))).toBe(true);
  });

  it("only enables the SEO category to keep the budget tight", () => {
    expect(LHCI.ci.collect.settings.onlyCategories).toEqual(["seo"]);
  });

  it("requires SEO score >= 0.95", () => {
    const seo = LHCI.ci.assert.assertions["categories:seo"];
    expect(Array.isArray(seo)).toBe(true);
    expect(seo[0]).toBe("error");
    expect(seo[1].minScore).toBeGreaterThanOrEqual(0.95);
  });

  it("pins the four structural audits as hard errors", () => {
    const a = LHCI.ci.assert.assertions;
    expect(a["meta-description"]).toBe("error");
    expect(a["document-title"]).toBe("error");
    expect(a["html-has-lang"]).toBe("error");
    expect(a["viewport"]).toBe("error");
  });
});

describe("§98 — pnpm test:seo wiring", () => {
  it("exposes a test:seo script that runs lhci autorun", () => {
    expect(PKG.scripts["test:seo"]).toMatch(/lhci\s+autorun/);
  });

  it("points at .lighthouserc.json explicitly", () => {
    expect(PKG.scripts["test:seo"]).toMatch(/\.lighthouserc\.json/);
  });
});
