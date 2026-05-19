import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { listPosts, getAllTags } from "./blog";
import {
  filterByTag,
  filterByQuery,
  formatResultCount,
  parseFiltersFromSearch,
  buildFiltersSearch,
  sortPosts,
  BLOG_SORT_OPTIONS,
  DEFAULT_BLOG_SORT,
  blogSortLabel,
  isBlogSortKey,
} from "./blogFilters";

const ROOT = resolve(__dirname, "..", "..", "..");

function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("blogFilters.filterByTag", () => {
  const posts = listPosts();

  it("returns the full list when tag is null/undefined/empty/whitespace", () => {
    expect(filterByTag(posts, null)).toHaveLength(posts.length);
    expect(filterByTag(posts, undefined)).toHaveLength(posts.length);
    expect(filterByTag(posts, "")).toHaveLength(posts.length);
    expect(filterByTag(posts, "   ")).toHaveLength(posts.length);
  });

  it("returns only posts that carry the requested tag", () => {
    const tag = "fcra";
    const filtered = filterByTag(posts, tag);
    expect(filtered.length).toBeGreaterThan(0);
    for (const p of filtered) expect(p.tags).toContain(tag);
  });

  it("returns an empty array when no post carries the tag", () => {
    expect(filterByTag(posts, "nonexistent-tag-xyz")).toHaveLength(0);
  });
});

describe("blogFilters.filterByQuery", () => {
  const posts = listPosts();

  it("returns the full list when query is empty/whitespace/null", () => {
    expect(filterByQuery(posts, null)).toHaveLength(posts.length);
    expect(filterByQuery(posts, "")).toHaveLength(posts.length);
    expect(filterByQuery(posts, "   ")).toHaveLength(posts.length);
  });

  it("matches case-insensitively against the title", () => {
    const hit = filterByQuery(posts, "FCRA");
    expect(hit.length).toBeGreaterThan(0);
    const hitLower = filterByQuery(posts, "fcra");
    expect(hitLower.length).toBe(hit.length);
  });

  it("matches against the excerpt", () => {
    const target = posts.find((p) => /background/i.test(p.excerpt));
    expect(target).toBeDefined();
    const hits = filterByQuery(posts, "background");
    expect(hits.some((p) => p.slug === target!.slug)).toBe(true);
  });

  it("matches against tags in raw slug form (fair-chance)", () => {
    const hits = filterByQuery(posts, "fair-chance");
    expect(hits.length).toBeGreaterThan(0);
    for (const p of hits) {
      const inTitleOrExcerpt =
        p.title.toLowerCase().includes("fair-chance") ||
        p.excerpt.toLowerCase().includes("fair-chance");
      const inTag = p.tags.some((t) => t.includes("fair-chance"));
      expect(inTitleOrExcerpt || inTag).toBe(true);
    }
  });

  it("matches against tags in human-readable form (fair chance)", () => {
    const hits = filterByQuery(posts, "fair chance");
    expect(hits.length).toBeGreaterThan(0);
  });

  it("returns an empty array when nothing matches", () => {
    expect(
      filterByQuery(posts, "zxqwvbnmplkjhgfedasrtyuio-no-match"),
    ).toHaveLength(0);
  });
});

describe("blogFilters.formatResultCount", () => {
  it("renders the unfiltered all-articles label", () => {
    expect(formatResultCount(120, 120, null, null)).toBe(
      "Showing 120 articles",
    );
  });

  it("uses singular when count is 1", () => {
    expect(formatResultCount(1, 120, null, null)).toBe("Showing 1 article");
  });

  it("renders tag-only scoping", () => {
    expect(formatResultCount(8, 120, "Healthcare", null)).toBe(
      "Showing 8 of 120 articles in Healthcare",
    );
  });

  it("renders query-only scoping with the quoted needle", () => {
    expect(formatResultCount(3, 120, null, "fcra")).toBe(
      'Showing 3 of 120 articles matching "fcra"',
    );
  });

  it("renders combined tag + query scoping", () => {
    expect(formatResultCount(2, 120, "Healthcare", "exclusion")).toBe(
      'Showing 2 of 120 articles in Healthcare matching "exclusion"',
    );
  });

  it("renders an empty-state copy with the active filter context", () => {
    expect(formatResultCount(0, 120, "K12 Education", null)).toBe(
      "No articles in K12 Education yet.",
    );
    expect(formatResultCount(0, 120, null, "zzzz")).toBe(
      'No articles match "zzzz".',
    );
    expect(formatResultCount(0, 120, "Healthcare", "zzzz")).toBe(
      'No articles in Healthcare match "zzzz".',
    );
  });
});

describe("blogFilters URL round-trip", () => {
  it("parses an empty search as nulls + default sort", () => {
    expect(parseFiltersFromSearch("")).toEqual({
      tag: null,
      query: null,
      sort: DEFAULT_BLOG_SORT,
    });
  });

  it("parses tag and q params, trimming whitespace", () => {
    expect(parseFiltersFromSearch("?tag=fcra&q=fair+chance")).toEqual({
      tag: "fcra",
      query: "fair chance",
      sort: DEFAULT_BLOG_SORT,
    });
    expect(parseFiltersFromSearch("?tag=%20fcra%20&q=%20%20")).toEqual({
      tag: "fcra",
      query: null,
      sort: DEFAULT_BLOG_SORT,
    });
  });

  it("parses a known sort param and ignores unknown", () => {
    expect(parseFiltersFromSearch("?sort=alphabetical").sort).toBe(
      "alphabetical",
    );
    expect(parseFiltersFromSearch("?sort=depth").sort).toBe("depth");
    expect(parseFiltersFromSearch("?sort=bogus").sort).toBe(
      DEFAULT_BLOG_SORT,
    );
  });

  it("ignores unknown params", () => {
    expect(parseFiltersFromSearch("?range=30d&page=2")).toEqual({
      tag: null,
      query: null,
      sort: DEFAULT_BLOG_SORT,
    });
  });

  it("builds a canonical search string and drops empty filters + default sort", () => {
    expect(
      buildFiltersSearch({ tag: null, query: null, sort: DEFAULT_BLOG_SORT }),
    ).toBe("");
    expect(
      buildFiltersSearch({ tag: "fcra", query: null, sort: DEFAULT_BLOG_SORT }),
    ).toBe("tag=fcra");
    expect(
      buildFiltersSearch({
        tag: null,
        query: "fair chance",
        sort: DEFAULT_BLOG_SORT,
      }),
    ).toBe("q=fair+chance");
    expect(
      buildFiltersSearch({
        tag: "fcra",
        query: "fair chance",
        sort: DEFAULT_BLOG_SORT,
      }),
    ).toBe("tag=fcra&q=fair+chance");
    expect(
      buildFiltersSearch({ tag: null, query: null, sort: "alphabetical" }),
    ).toBe("sort=alphabetical");
    expect(
      buildFiltersSearch({ tag: "fcra", query: null, sort: "depth" }),
    ).toBe("tag=fcra&sort=depth");
  });

  it("round-trips arbitrary state including sort", () => {
    const cases: {
      tag: string | null;
      query: string | null;
      sort: typeof DEFAULT_BLOG_SORT;
    }[] = [
      { tag: null, query: null, sort: DEFAULT_BLOG_SORT },
      { tag: "fcra", query: null, sort: "alphabetical" },
      { tag: null, query: "drug screening", sort: "oldest" },
      { tag: "k12-education", query: "ESSA", sort: "depth" },
    ];
    for (const c of cases) {
      const qs = buildFiltersSearch(c);
      const round = parseFiltersFromSearch(qs ? "?" + qs : "");
      expect(round).toEqual(c);
    }
  });
});

describe("§147 sortPosts", () => {
  const posts = listPosts();

  it("returns a non-mutating copy", () => {
    const before = posts.map((p) => p.slug);
    const sorted = sortPosts(posts, "alphabetical");
    // Source array unchanged.
    expect(posts.map((p) => p.slug)).toEqual(before);
    // Same set of slugs, just possibly reordered.
    expect(sorted.length).toBe(posts.length);
    expect(new Set(sorted.map((p) => p.slug))).toEqual(
      new Set(before),
    );
  });

  it("sorts newest first by publishedAt descending", () => {
    const sorted = sortPosts(posts, "newest");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].publishedAt >= sorted[i].publishedAt).toBe(true);
    }
  });

  it("sorts oldest first by publishedAt ascending", () => {
    const sorted = sortPosts(posts, "oldest");
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].publishedAt <= sorted[i].publishedAt).toBe(true);
    }
  });

  it("sorts alphabetically case-insensitively", () => {
    const sorted = sortPosts(posts, "alphabetical");
    for (let i = 1; i < sorted.length; i++) {
      const a = sorted[i - 1].title.toLocaleLowerCase();
      const b = sorted[i].title.toLocaleLowerCase();
      expect(a.localeCompare(b) <= 0).toBe(true);
    }
  });

  it("sorts by readingMinutes desc, ties broken newest first", () => {
    const sorted = sortPosts(posts, "depth");
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (prev.readingMinutes === cur.readingMinutes) {
        expect(prev.publishedAt >= cur.publishedAt).toBe(true);
      } else {
        expect(prev.readingMinutes >= cur.readingMinutes).toBe(true);
      }
    }
  });

  it("defaults to newest when called without a key", () => {
    const a = sortPosts(posts);
    const b = sortPosts(posts, "newest");
    expect(a.map((p) => p.slug)).toEqual(b.map((p) => p.slug));
  });
});

describe("§147 sort metadata", () => {
  it("exposes exactly four ordered options", () => {
    expect(BLOG_SORT_OPTIONS.map((o) => o.value)).toEqual([
      "newest",
      "oldest",
      "alphabetical",
      "depth",
    ]);
  });

  it("isBlogSortKey accepts the four canonical values and rejects others", () => {
    expect(isBlogSortKey("newest")).toBe(true);
    expect(isBlogSortKey("oldest")).toBe(true);
    expect(isBlogSortKey("alphabetical")).toBe(true);
    expect(isBlogSortKey("depth")).toBe(true);
    expect(isBlogSortKey("foo")).toBe(false);
    expect(isBlogSortKey(null)).toBe(false);
    expect(isBlogSortKey(undefined)).toBe(false);
  });

  it("blogSortLabel returns the option label for known keys", () => {
    expect(blogSortLabel("newest")).toBe("Newest first");
    expect(blogSortLabel("oldest")).toBe("Oldest first");
    expect(blogSortLabel("alphabetical")).toBe("A – Z");
    expect(blogSortLabel("depth")).toBe("Longest reads first");
  });
});

// ---------------------------------------------------------------------------
// Blog.tsx wiring — pin the testids + wiring so a future refactor can't
// silently drop the filter UI.
// ---------------------------------------------------------------------------
describe("Blog.tsx wires the new filter stack", () => {
  const src = read("client/src/pages/Blog.tsx");

  it("imports the filter helpers from @/lib/blogFilters", () => {
    expect(src).toMatch(
      /from\s+["']@\/lib\/blogFilters["']/,
    );
    expect(src).toMatch(/filterByTag/);
    expect(src).toMatch(/filterByQuery/);
    expect(src).toMatch(/formatResultCount/);
    expect(src).toMatch(/parseFiltersFromSearch/);
    expect(src).toMatch(/buildFiltersSearch/);
    expect(src).toMatch(/sortPosts/);
    expect(src).toMatch(/BLOG_SORT_OPTIONS/);
  });

  it("renders the search input + clear button with stable testids", () => {
    expect(src).toMatch(/data-testid="blog-search-input"/);
    expect(src).toMatch(/data-testid="blog-search-clear"/);
  });

  it("renders the category pill row with stable testids", () => {
    expect(src).toMatch(/data-testid="blog-category-row"/);
    // At least two pills (All + every getAllTags() entry) — pin the testid
    // attribute presence; the runtime pill count is asserted by getAllTags().
    expect(src.match(/data-testid="blog-category-pill"/g)?.length ?? 0).toBeGreaterThanOrEqual(2);
    expect(src).toMatch(/data-tag="all"/);
  });

  it("renders the empty-state with a reset CTA", () => {
    expect(src).toMatch(/data-testid="blog-empty-state"/);
    expect(src).toMatch(/data-testid="blog-empty-reset"/);
    expect(src).toMatch(/Clear filters/);
  });

  it("renders the result-count label", () => {
    expect(src).toMatch(/data-testid="blog-result-count"/);
    expect(src).toMatch(/aria-live="polite"/);
  });

  it("syncs filter state to the URL via history.replaceState", () => {
    // The useEffect that rewrites the URL must be present and read tag,
    // query and sort state so a future refactor can't drop one silently.
    expect(src).toMatch(/history\.replaceState/);
    expect(src).toMatch(/buildFiltersSearch\(/);
    expect(src).toMatch(/tag,\s*\n?\s*query/);
    expect(src).toMatch(/\bsort\b/);
  });

  it("renders the sort dropdown wired to BLOG_SORT_OPTIONS", () => {
    expect(src).toMatch(/data-testid="blog-sort-select"/);
    // The dropdown must iterate over BLOG_SORT_OPTIONS (not a local copy)
    // so future option edits flow through automatically.
    expect(src).toMatch(/BLOG_SORT_OPTIONS\.map/);
    expect(src).toMatch(/data-value=\{opt\.value\}/);
    // The sort pass must be the final transform in the pipeline so the
    // visible list respects the chosen order.
    expect(src).toMatch(/sortPosts\(out, sort\)/);
  });

  it("exposes every getAllTags() entry as a pill (data-tag attribute)", () => {
    // We can't render the React tree here without a DOM, but we can pin
    // that the source uses tagsByDepth (the count-sorted projection of
    // getAllTags) as the pill list source so future contributors don't
    // accidentally hard-code a subset.
    expect(src).toMatch(/tagsByDepth\.map\(\(\{ tag: t, count \}\) =>/);
    expect(getAllTags().length).toBeGreaterThan(10);
  });
});
