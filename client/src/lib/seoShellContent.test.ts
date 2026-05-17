/*
  §101 — Pre-hydration SEO shell content invariants.

  The deployed SPA's initial HTML is what the in-Manus SEO auditor,
  Bing's first-pass crawler, and link-preview bots actually see. With
  an empty `<div id="root"></div>` they grade the page as "missing
  H1 / thin content / no internal links" and dock SEO points even
  though the hydrated React app is rich.

  We solve this by shipping a small, semantically correct SEO block
  inside #root in client/index.html. React's createRoot(...).render
  replaces #root's children on mount, so real users never see it;
  it exists purely for crawlers and pre-paint HTML snapshots.

  This spec pins:
    - exactly one H1 in the shell HTML
    - the H1 mentions the brand and at least one anchor topic
    - an opening paragraph with FCRA + 24-hour proof points
    - a crawlable internal-link list pointing at the top public routes
    - the SEO block lives inside #root so React hydration removes it
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SHELL = readFileSync(
  resolve(__dirname, "..", "..", "index.html"),
  "utf8",
);

describe("§101 — SPA shell ships pre-hydration SEO content", () => {
  it("contains exactly one <h1> in the static shell", () => {
    const matches = SHELL.match(/<h1[\s>]/g) ?? [];
    expect(matches.length).toBe(1);
  });

  it("the H1 mentions the brand and at least one anchor topic", () => {
    const m = SHELL.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    expect(m).not.toBeNull();
    const h1 = (m as RegExpMatchArray)[1].trim();
    expect(h1.toLowerCase()).toContain("rapid hire solutions");
    // At least one of the anchor topics from our keyword set.
    expect(h1).toMatch(
      /background check|background screening|pre-employment|fcra/i,
    );
  });

  it("ships an intro paragraph with FCRA + 24-hour proof points", () => {
    // Find a <p> that name-checks both proof points.
    const paragraphs = [...SHELL.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(
      (m) => m[1],
    );
    const intro = paragraphs.find(
      (p) => /FCRA/i.test(p) && /24\s*hour/i.test(p),
    );
    expect(intro, "expected a <p> mentioning FCRA + 24-hour turnaround").toBeTruthy();
  });

  it("exposes crawlable internal links to the top public routes", () => {
    const required = [
      "/services",
      "/industries",
      "/integrations",
      "/pricing",
      "/compliance",
      "/about",
      "/blog",
      "/contact",
    ];
    for (const href of required) {
      const re = new RegExp(`<a[^>]+href="${href}"`);
      expect(SHELL, `expected crawlable link to ${href}`).toMatch(re);
    }
  });

  it("nests the SEO block inside #root so hydration removes it", () => {
    // The SEO main must appear AFTER `<div id="root">` and BEFORE its closing tag.
    const rootStart = SHELL.indexOf('<div id="root">');
    const rootEnd = SHELL.indexOf("</div>", rootStart);
    expect(rootStart).toBeGreaterThan(-1);
    expect(rootEnd).toBeGreaterThan(rootStart);
    const between = SHELL.slice(rootStart, rootEnd);
    expect(between).toMatch(/data-pre-hydration-seo="true"/);
    expect(between).toMatch(/<h1[\s>]/);
  });

  it("keeps the SEO block hidden from real users post-paint", () => {
    // Belt-and-suspenders: the block must carry `hidden` so even if
    // React hydration is delayed, sighted users don't see a flash of
    // raw HTML competing with the redesigned hero.
    expect(SHELL).toMatch(
      /<main[^>]*\bhidden\b[^>]*data-pre-hydration-seo="true"/,
    );
  });
});
