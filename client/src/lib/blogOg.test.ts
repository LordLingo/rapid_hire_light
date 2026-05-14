/*
  Spec for the dynamic Open Graph image renderer used by
  /api/og/blog/:slug.svg.

  We import the pure helpers from vite.config.ts (which exports `wrapTitleForOg`
  and `renderBlogOgSvg` on top of its plugin factories) so the same code path
  the dev plugin uses is exercised under test. The production server in
  server/index.ts duplicates these functions verbatim; the JSON-sync test
  in blog.test.ts already locks in title parity.
*/
import { describe, it, expect } from "vitest";
import { wrapTitleForOg, renderBlogOgSvg } from "../../../vite.config";

describe("wrapTitleForOg", () => {
  it("keeps a single short title on one line", () => {
    expect(wrapTitleForOg("Short title", 28, 4)).toEqual(["Short title"]);
  });

  it("wraps long titles onto multiple lines under maxChars", () => {
    const title = "Background Check Compliance: A Complete FCRA Guide for Employers";
    const lines = wrapTitleForOg(title, 28, 4);
    expect(lines.length).toBeLessThanOrEqual(4);
    for (const ln of lines) expect(ln.length).toBeLessThanOrEqual(28 + 1); // +1 for ellipsis
  });

  it("ellipsizes when the title overflows maxLines", () => {
    const long = Array.from({ length: 40 }, (_, i) => `word${i}`).join(" ");
    const lines = wrapTitleForOg(long, 20, 2);
    expect(lines).toHaveLength(2);
    expect(lines[lines.length - 1].endsWith("…")).toBe(true);
  });
});

describe("renderBlogOgSvg", () => {
  const entry = {
    slug: "fcra-compliance-guide",
    title: "Background Check Compliance: A Complete FCRA Guide for Employers",
    tag: "compliance",
  };
  const svg = renderBlogOgSvg(entry);

  it("emits a 1200x630 SVG", () => {
    expect(svg).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(svg).toContain('viewBox="0 0 1200 630"');
    expect(svg).toContain('width="1200"');
    expect(svg).toContain('height="630"');
  });

  it("renders the brand mark, the tag, and a Prosper, TX trust line", () => {
    expect(svg).toContain("RAPID HIRE SOLUTIONS");
    expect(svg).toContain("COMPLIANCE");
    expect(svg).toContain("Prosper, TX");
    expect(svg).toContain("rapidhiresolutions.com");
  });

  it("escapes HTML-unsafe characters in the title", () => {
    const ampersand = renderBlogOgSvg({
      slug: "x",
      title: "A & B < C > \"quoted\" title",
      tag: "ops",
    });
    expect(ampersand).toContain("&amp;");
    expect(ampersand).toContain("&lt;");
    expect(ampersand).toContain("&gt;");
    expect(ampersand).toContain("&quot;");
    // No raw ampersand left over from our own escaping pipeline.
    expect(ampersand).not.toMatch(/[^&]&[^a-z#]/);
  });
});
