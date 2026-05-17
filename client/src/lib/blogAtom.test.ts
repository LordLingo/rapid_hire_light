import { describe, expect, it } from "vitest";
import { buildBlogAtomFeed } from "../../../vite.config";

describe("blog Atom feed", () => {
  it("emits a valid Atom 1.0 wrapper with self + alternate links", () => {
    const xml = buildBlogAtomFeed("https://example.com");
    expect(xml.startsWith("<?xml")).toBe(true);
    expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<link href="https://example.com/blog" rel="alternate" type="text/html"/>');
    expect(xml).toContain('<link href="https://example.com/blog/feed.xml" rel="self" type="application/atom+xml"/>');
    expect(xml).toContain("</feed>");
  });

  it("includes entries with absolute URLs and Atom-compliant updated dates", () => {
    const xml = buildBlogAtomFeed("https://example.com");
    const entryMatches = xml.match(/<entry>/g) ?? [];
    expect(entryMatches.length).toBeGreaterThan(0);
    expect(entryMatches.length).toBeLessThanOrEqual(50);
    // Every entry should have an absolute link and a UTC-Z updated stamp.
    const updatedStamps = xml.match(/<updated>([^<]+)<\/updated>/g) ?? [];
    expect(updatedStamps.length).toBeGreaterThan(0);
    for (const u of updatedStamps) {
      expect(/T\d{2}:\d{2}:\d{2}/.test(u)).toBe(true);
    }
    // Every entry's link must start with the supplied origin.
    const linkMatches = xml.match(/<link href="([^"]+)"\/>/g) ?? [];
    for (const l of linkMatches) {
      expect(l).toContain("https://example.com");
    }
  });

  it("XML-escapes title content so ampersands and angle brackets are safe", () => {
    const xml = buildBlogAtomFeed("https://example.com");
    // The corpus may legitimately contain & in titles; if so, it must be encoded.
    // No raw '&' should appear inside a <title>...</title> element.
    const titleBlocks = xml.match(/<title>[\s\S]*?<\/title>/g) ?? [];
    for (const tb of titleBlocks) {
      const inner = tb.slice(7, -8);
      // Permitted XML entities only: &amp; &lt; &gt; &quot; &apos;
      const stripped = inner
        .replace(/&amp;/g, "")
        .replace(/&lt;/g, "")
        .replace(/&gt;/g, "")
        .replace(/&quot;/g, "")
        .replace(/&apos;/g, "");
      expect(stripped.includes("&")).toBe(false);
      expect(stripped.includes("<")).toBe(false);
      expect(stripped.includes(">")).toBe(false);
    }
  });
});
