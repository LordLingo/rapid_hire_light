/*
  Blog post on-page TOC — invariants pin (§47).

  Two layers of coverage:
    1. Logic — `slugify` and `getHeadings` exported from PostBody
       must produce stable, deduplicated, URL-safe ids.
    2. Markup — PostBody must stamp every H2 with the matching id;
       PostToc must render a sticky <nav> with brand-blue active
       indicator, IntersectionObserver wiring, and the < 3 headings
       short-circuit.

  Pinning the markup keeps a future markdown refactor from silently
  dropping the H2 ids (which would break every blog post anchor).
*/
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { slugify, getHeadings } from "../components/site/PostBody";

const POST_BODY_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "PostBody.tsx"
);
const POST_BODY_SRC = readFileSync(POST_BODY_PATH, "utf8");

const POST_TOC_PATH = resolve(
  __dirname,
  "..",
  "components",
  "site",
  "PostToc.tsx"
);
const POST_TOC_SRC = readFileSync(POST_TOC_PATH, "utf8");

const BLOG_POST_PATH = resolve(
  __dirname,
  "..",
  "pages",
  "BlogPost.tsx"
);
const BLOG_POST_SRC = readFileSync(BLOG_POST_PATH, "utf8");

describe("slugify — §47 helper logic", () => {
  it("lowercases, trims, and converts spaces to hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("  Spaces Around  ")).toBe("spaces-around");
  });

  it("strips punctuation and accents", () => {
    expect(slugify("Why FCRA matters!")).toBe("why-fcra-matters");
    expect(slugify("Café résumé")).toBe("cafe-resume");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("hello---world")).toBe("hello-world");
    expect(slugify("a  b  c")).toBe("a-b-c");
  });
});

describe("getHeadings — §47 H2 extraction", () => {
  it("returns only H2 headings in order", () => {
    const md = "## First\nbody\n\n### Sub\n\n## Second\n\n### Sub2";
    const out = getHeadings(md);
    expect(out).toEqual([
      { id: "first", text: "First" },
      { id: "second", text: "Second" },
    ]);
  });

  it("dedupes identical heading text by suffixing -2, -3, ...", () => {
    const md = "## Same\n\n## Same\n\n## Same";
    const out = getHeadings(md);
    expect(out).toEqual([
      { id: "same", text: "Same" },
      { id: "same-2", text: "Same" },
      { id: "same-3", text: "Same" },
    ]);
  });

  it("returns empty array for posts with no H2 headings", () => {
    expect(getHeadings("Just a paragraph.\n\nAnother one.")).toEqual([]);
  });
});

describe("PostBody.tsx — §47 H2 ids", () => {
  it("stamps every rendered H2 with an id derived from slugify", () => {
    // The render branch must compute an id and set it on the <h2>.
    expect(POST_BODY_SRC).toMatch(/const base = slugify\(b\.text\)/);
    expect(POST_BODY_SRC).toMatch(/<h2[\s\S]*?id=\{id\}/);
  });

  it("uses the same dedupe pattern as getHeadings (lockstep)", () => {
    // Both code paths must use a Map<string, number> to track count.
    const renderHasMap = /slugCounts = new Map<string, number>\(\)/.test(
      POST_BODY_SRC
    );
    expect(renderHasMap).toBe(true);
    // And both must build the suffixed id the same way.
    expect(POST_BODY_SRC).toMatch(/count === 1 \? base : `\$\{base\}-\$\{count\}`/);
  });
});

describe("PostToc.tsx — §47 markup + behavior", () => {
  it("renders a sticky labelled nav for the on-page TOC", () => {
    expect(POST_TOC_SRC).toMatch(/<nav[\s\S]*?aria-label="On this page"/);
    expect(POST_TOC_SRC).toMatch(/sticky top-28/);
    expect(POST_TOC_SRC).toMatch(/data-testid="post-toc"/);
  });

  it("hides the TOC on mobile (< lg) and inside posts with fewer than 3 headings", () => {
    // Hidden below lg breakpoint to keep the reading column uncrowded.
    expect(POST_TOC_SRC).toMatch(/hidden lg:block/);
    // Short-circuit pin: posts with < 3 H2 headings don't earn a TOC.
    expect(POST_TOC_SRC).toMatch(/if \(headings\.length < 3\) return null/);
  });

  it("uses IntersectionObserver with a top offset matching the sticky header height", () => {
    // The rootMargin must shape the trigger zone so the active heading
    // flips when its title crosses just under the sticky header.
    expect(POST_TOC_SRC).toMatch(/IntersectionObserver/);
    expect(POST_TOC_SRC).toMatch(/rootMargin: "-80px 0px -60% 0px"/);
  });

  it("renders the active TOC item with a brand-blue 2px LEFT-EDGE rail (vertical layout)", () => {
    // Active marker pin: brand-blue, 2px wide, on the left edge.
    // We use a left-edge rail in the TOC (not an underline) because
    // the list is stacked vertically.
    expect(POST_TOC_SRC).toMatch(
      /w-\[2px\][^"]*bg-\[color:var\(--color-accent-ink\)\]/
    );
    // Active link bumps to medium weight + ink color.
    expect(POST_TOC_SRC).toMatch(
      /font-medium text-\[color:var\(--color-ink\)\]/
    );
  });

  it("sets aria-current='location' on the active TOC link (the WAI-ARIA value for current location within an environment)", () => {
    expect(POST_TOC_SRC).toMatch(
      /aria-current=\{active \? "location" : undefined\}/
    );
  });
});

describe("BlogPost.tsx — §47 wiring", () => {
  it("imports PostToc and getHeadings, and threads headings into the left rail", () => {
    expect(BLOG_POST_SRC).toMatch(/import PostToc from "@\/components\/site\/PostToc"/);
    expect(BLOG_POST_SRC).toMatch(/getHeadings/);
    expect(BLOG_POST_SRC).toMatch(/<PostToc headings=\{headings\}/);
  });

  it("memoizes the headings derivation so it doesn't re-parse on every render", () => {
    expect(BLOG_POST_SRC).toMatch(/useMemo\(\(\) => getHeadings\(post\.body\)/);
  });

  it("anti-regression: the previously-empty lg:col-span-3 placeholder is no longer empty", () => {
    // The old version had `<div className="hidden lg:block lg:col-span-3" />`
    // (self-closing, empty). The new version must NOT be self-closing.
    expect(BLOG_POST_SRC).not.toMatch(
      /<div className="hidden lg:block lg:col-span-3" \/>/
    );
  });
});
