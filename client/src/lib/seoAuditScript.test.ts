/*
  §102 — `pnpm seo:audit` invariants.

  The script grades a raw HTML page on the same heuristics the in-Manus
  auditor cares about. We exercise it with a synthetic "perfect" shell
  to assert the scoring contract, and with a "broken" shell to assert
  that the script actually penalises the bad signals.

  We import directly from the .mjs source so the test moves in lockstep
  with the script and any future scoring changes are caught immediately.
*/
import { describe, it, expect } from "vitest";
// @ts-expect-error — .mjs file imported as raw module
import { summarize, grade, WEIGHTS } from "../../../scripts/seo_audit.mjs";

const PERFECT = `<!doctype html>
<html lang="en">
  <head>
    <title>Rapid Hire Solutions — Background Checks That Ship Fast</title>
    <meta name="description" content="FCRA-certified background screening built for high-volume hiring. 85%+ of checks complete in under 24 hours, with U.S.-based support every step." />
    <meta name="keywords" content="background check services, FCRA-certified background screening, employment background checks, pre-employment screening, criminal background check, continuous monitoring" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:title" content="Rapid Hire Solutions — Background Checks That Ship Fast" />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://rapidhire-8y99zzzx.manus.space/" />
  </head>
  <body>
    <h1>Rapid Hire Solutions — FCRA-certified background checks</h1>
    <a href="/services">Services</a>
    <a href="/industries">Industries</a>
    <a href="/integrations">Integrations</a>
    <a href="/pricing">Pricing</a>
    <a href="/blog">Blog</a>
    <a href="/about">About</a>
  </body>
</html>`;

const BROKEN = `<!doctype html>
<html>
  <head>
    <title>Hi</title>
  </head>
  <body><div id="root"></div></body>
</html>`;

describe("§102 — seo_audit.mjs", () => {
  it("declares a non-empty WEIGHTS map", () => {
    expect(WEIGHTS).toBeTypeOf("object");
    expect(Object.keys(WEIGHTS).length).toBeGreaterThan(5);
    for (const v of Object.values(WEIGHTS)) {
      expect(typeof v).toBe("number");
      expect(v).toBeGreaterThan(0);
    }
  });

  it("scores a well-formed shell at 100/100", () => {
    const summary = summarize(PERFECT);
    const result = grade(summary);
    expect(result.score).toBe(100);
    expect(result.findings.every((f: { ok: boolean }) => f.ok)).toBe(true);
  });

  it("penalises a broken shell to under 50/100 with specific failures", () => {
    const summary = summarize(BROKEN);
    const result = grade(summary);
    expect(result.score).toBeLessThan(50);
    const failingChecks = result.findings
      .filter((f: { ok: boolean }) => !f.ok)
      .map((f: { check: string }) => f.check);
    // Title is too short
    expect(failingChecks).toContain("titleLength");
    // No description
    expect(failingChecks).toContain("description");
    // No keywords
    expect(failingChecks).toContain("keywords");
    // No H1
    expect(failingChecks).toContain("singleH1");
    // No canonical
    expect(failingChecks).toContain("canonical");
    // No html lang
    expect(failingChecks).toContain("htmlLang");
  });

  it("summarize() correctly counts unique internal links", () => {
    const html = `<a href="/a">A</a><a href="/a">A again</a><a href="/b">B</a><a href="https://x.com">ext</a><a href="#anchor">a</a>`;
    const s = summarize(html);
    // /a (deduped) and /b only — external + anchor excluded.
    expect(s.internalLinkCount).toBe(2);
  });

  it("summarize() correctly parses the keywords meta into an array", () => {
    const html = `<meta name="keywords" content="a, b ,  c, d" />`;
    const s = summarize(html);
    expect(s.keywords).toEqual(["a", "b", "c", "d"]);
  });

  it("summarize() detects multiple H1s", () => {
    const html = `<h1>One</h1><h1>Two</h1><h1>Three</h1>`;
    const s = summarize(html);
    expect(s.h1Count).toBe(3);
  });
});
