import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { listPosts, getAllTags } from "./blog";
import {
  filterByTag,
  filterByQuery,
  formatResultCount,
  parseFiltersFromSearch,
  parsePageFromSearch,
  buildFiltersSearch,
  sortPosts,
  paginatePosts,
  buildPagerWindow,
  formatPageRange,
  BLOG_POSTS_PER_PAGE,
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
  it("parses an empty search as nulls + default sort + page 1", () => {
    expect(parseFiltersFromSearch("")).toEqual({
      tag: null,
      query: null,
      sort: DEFAULT_BLOG_SORT,
      page: 1,
    });
  });

  it("parses tag and q params, trimming whitespace", () => {
    expect(parseFiltersFromSearch("?tag=fcra&q=fair+chance")).toEqual({
      tag: "fcra",
      query: "fair chance",
      sort: DEFAULT_BLOG_SORT,
      page: 1,
    });
    expect(parseFiltersFromSearch("?tag=%20fcra%20&q=%20%20")).toEqual({
      tag: "fcra",
      query: null,
      sort: DEFAULT_BLOG_SORT,
      page: 1,
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

  it("ignores unknown params (page now recognized)", () => {
    // Note: `page` is now a recognized param; ?page=2 surfaces page=2.
    expect(parseFiltersFromSearch("?range=30d&foo=bar")).toEqual({
      tag: null,
      query: null,
      sort: DEFAULT_BLOG_SORT,
      page: 1,
    });
  });

  it("builds a canonical search string and drops empty filters + default sort + page=1", () => {
    expect(
      buildFiltersSearch({ tag: null, query: null, sort: DEFAULT_BLOG_SORT, page: 1 }),
    ).toBe("");
    expect(
      buildFiltersSearch({ tag: "fcra", query: null, sort: DEFAULT_BLOG_SORT, page: 1 }),
    ).toBe("tag=fcra");
    expect(
      buildFiltersSearch({
        tag: null,
        query: "fair chance",
        sort: DEFAULT_BLOG_SORT,
        page: 1,
      }),
    ).toBe("q=fair+chance");
    expect(
      buildFiltersSearch({
        tag: "fcra",
        query: "fair chance",
        sort: DEFAULT_BLOG_SORT,
        page: 1,
      }),
    ).toBe("tag=fcra&q=fair+chance");
    expect(
      buildFiltersSearch({ tag: null, query: null, sort: "alphabetical", page: 1 }),
    ).toBe("sort=alphabetical");
    expect(
      buildFiltersSearch({ tag: "fcra", query: null, sort: "depth", page: 1 }),
    ).toBe("tag=fcra&sort=depth");
  });

  it("round-trips arbitrary state including sort + page", () => {
    const cases: {
      tag: string | null;
      query: string | null;
      sort: typeof DEFAULT_BLOG_SORT;
      page: number;
    }[] = [
      { tag: null, query: null, sort: DEFAULT_BLOG_SORT, page: 1 },
      { tag: "fcra", query: null, sort: "alphabetical", page: 1 },
      { tag: null, query: "drug screening", sort: "oldest", page: 3 },
      { tag: "k12-education", query: "ESSA", sort: "depth", page: 5 },
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


// ---------------------------------------------------------------------------
// §149 — Pagination helpers
// ---------------------------------------------------------------------------
describe("§149 BLOG_POSTS_PER_PAGE", () => {
  it("is the canonical page size of 12", () => {
    expect(BLOG_POSTS_PER_PAGE).toBe(12);
  });
});

describe("§149 paginatePosts", () => {
  const posts = listPosts();

  it("page 1 returns the first BLOG_POSTS_PER_PAGE posts", () => {
    const r = paginatePosts(posts, 1);
    expect(r.page).toBe(1);
    expect(r.posts).toHaveLength(Math.min(posts.length, BLOG_POSTS_PER_PAGE));
    expect(r.total).toBe(posts.length);
    expect(r.totalPages).toBe(
      Math.max(1, Math.ceil(posts.length / BLOG_POSTS_PER_PAGE)),
    );
    expect(r.firstIndex).toBe(1);
    expect(r.lastIndex).toBe(Math.min(posts.length, BLOG_POSTS_PER_PAGE));
    expect(r.posts[0]).toEqual(posts[0]);
  });

  it("page 2 returns the second slice when corpus is larger than one page", () => {
    if (posts.length <= BLOG_POSTS_PER_PAGE) return;
    const r = paginatePosts(posts, 2);
    expect(r.page).toBe(2);
    expect(r.firstIndex).toBe(BLOG_POSTS_PER_PAGE + 1);
    expect(r.posts[0]).toEqual(posts[BLOG_POSTS_PER_PAGE]);
  });

  it("clamps page < 1 to 1", () => {
    expect(paginatePosts(posts, 0).page).toBe(1);
    expect(paginatePosts(posts, -5).page).toBe(1);
    expect(paginatePosts(posts, Number.NaN).page).toBe(1);
  });

  it("clamps page > totalPages to the last page", () => {
    const r = paginatePosts(posts, 9999);
    expect(r.page).toBe(r.totalPages);
    expect(r.lastIndex).toBe(posts.length);
  });

  it("handles empty corpus without divide-by-zero", () => {
    const r = paginatePosts([], 1);
    expect(r).toEqual({
      posts: [],
      page: 1,
      totalPages: 1,
      total: 0,
      firstIndex: 0,
      lastIndex: 0,
    });
  });

  it("honors a custom perPage when provided", () => {
    const r = paginatePosts(posts, 1, 5);
    expect(r.posts).toHaveLength(Math.min(posts.length, 5));
    expect(r.totalPages).toBe(Math.max(1, Math.ceil(posts.length / 5)));
  });

  it("returns a slice that is non-mutating", () => {
    const before = posts.map((p) => p.slug);
    paginatePosts(posts, 1);
    paginatePosts(posts, 9999);
    paginatePosts(posts, -1);
    expect(posts.map((p) => p.slug)).toEqual(before);
  });
});

describe("§149 parsePageFromSearch", () => {
  it("returns 1 when page param is missing", () => {
    expect(parsePageFromSearch("")).toBe(1);
    expect(parsePageFromSearch("?tag=fcra")).toBe(1);
  });

  it("returns the integer page when present and valid", () => {
    expect(parsePageFromSearch("?page=2")).toBe(2);
    expect(parsePageFromSearch("?page=10")).toBe(10);
  });

  it("falls back to 1 for zero, negative, non-numeric, or malformed", () => {
    expect(parsePageFromSearch("?page=0")).toBe(1);
    expect(parsePageFromSearch("?page=-3")).toBe(1);
    expect(parsePageFromSearch("?page=abc")).toBe(1);
    expect(parsePageFromSearch("?page=")).toBe(1);
  });

  it("truncates decimals (parseInt-style)", () => {
    expect(parsePageFromSearch("?page=3.7")).toBe(3);
  });
});

describe("§149 buildPagerWindow", () => {
  it("returns a single slot when totalPages <= 1", () => {
    expect(buildPagerWindow(1, 1)).toEqual([1]);
    expect(buildPagerWindow(1, 0)).toEqual([1]);
  });

  it("returns the full strip when totalPages <= 7", () => {
    expect(buildPagerWindow(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPagerWindow(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses with ellipsis on the right when current is near the start", () => {
    expect(buildPagerWindow(1, 10)).toEqual([1, 2, "\u2026", 10]);
    expect(buildPagerWindow(2, 10)).toEqual([1, 2, 3, "\u2026", 10]);
  });

  it("collapses with ellipsis on both sides when current is in the middle", () => {
    expect(buildPagerWindow(5, 10)).toEqual([1, "\u2026", 4, 5, 6, "\u2026", 10]);
  });

  it("collapses with ellipsis on the left when current is near the end", () => {
    expect(buildPagerWindow(9, 10)).toEqual([1, "\u2026", 8, 9, 10]);
    expect(buildPagerWindow(10, 10)).toEqual([1, "\u2026", 9, 10]);
  });

  it("clamps current to the valid range", () => {
    expect(buildPagerWindow(0, 10)).toEqual([1, 2, "\u2026", 10]);
    expect(buildPagerWindow(99, 10)).toEqual([1, "\u2026", 9, 10]);
  });

  it("never produces consecutive ellipsis sentinels", () => {
    for (let total = 2; total <= 20; total++) {
      for (let cur = 1; cur <= total; cur++) {
        const w = buildPagerWindow(cur, total);
        for (let i = 1; i < w.length; i++) {
          expect(!(w[i - 1] === "\u2026" && w[i] === "\u2026")).toBe(true);
        }
      }
    }
  });

  it("always includes 1 and totalPages and the current page", () => {
    for (let total = 1; total <= 20; total++) {
      for (let cur = 1; cur <= total; cur++) {
        const w = buildPagerWindow(cur, total);
        expect(w).toContain(1);
        expect(w).toContain(total);
        expect(w).toContain(cur);
      }
    }
  });
});

describe("§149 formatPageRange", () => {
  it("returns empty string for single-page or empty corpora", () => {
    expect(
      formatPageRange({
        posts: [],
        page: 1,
        totalPages: 1,
        total: 0,
        firstIndex: 0,
        lastIndex: 0,
      }),
    ).toBe("");
    expect(
      formatPageRange({
        posts: [],
        page: 1,
        totalPages: 1,
        total: 5,
        firstIndex: 1,
        lastIndex: 5,
      }),
    ).toBe("");
  });

  it("renders the canonical 'showing X-Y · page P of T' suffix", () => {
    expect(
      formatPageRange({
        posts: [],
        page: 2,
        totalPages: 10,
        total: 120,
        firstIndex: 13,
        lastIndex: 24,
      }),
    ).toBe("showing 13\u201324 \u00b7 page 2 of 10");
  });

  it("renders correct range on the last (partial) page", () => {
    expect(
      formatPageRange({
        posts: [],
        page: 10,
        totalPages: 10,
        total: 117,
        firstIndex: 109,
        lastIndex: 117,
      }),
    ).toBe("showing 109\u2013117 \u00b7 page 10 of 10");
  });
});

// ---------------------------------------------------------------------------
// §149 — Blog.tsx wiring source pins
// ---------------------------------------------------------------------------
describe("§149 Blog.tsx wires the pager UI", () => {
  const src = read("client/src/pages/Blog.tsx");

  it("imports paginatePosts, buildPagerWindow, formatPageRange, BLOG_POSTS_PER_PAGE", () => {
    expect(src).toMatch(/paginatePosts/);
    expect(src).toMatch(/buildPagerWindow/);
    expect(src).toMatch(/formatPageRange/);
    expect(src).toMatch(/BLOG_POSTS_PER_PAGE/);
  });

  it("derives pagination via the helper, not an ad-hoc slice", () => {
    expect(src).toMatch(/paginatePosts\(visiblePosts,\s*page/);
    expect(src).toMatch(/pagination\.posts\.map/);
  });

  it("renders the pager nav with stable testids when totalPages > 1", () => {
    expect(src).toMatch(/totalPages\s*>\s*1/);
    expect(src).toMatch(/data-testid="blog-pager"/);
    expect(src).toMatch(/data-testid="blog-pager-prev"/);
    expect(src).toMatch(/data-testid="blog-pager-next"/);
    // Active vs inactive testid is conditional, so match the underlying
    // string literals used by the ternary rather than the JSX shape.
    expect(src).toMatch(/"blog-pager-page"/);
    expect(src).toMatch(/"blog-pager-page-active"/);
    expect(src).toMatch(/data-testid="blog-pager-ellipsis"/);
  });

  it("includes aria-label='Blog pagination' on the pager nav", () => {
    expect(src).toMatch(/aria-label="Blog pagination"/);
  });

  it("disables Prev on page 1 and Next on the last page", () => {
    expect(src).toMatch(/disabled=\{pagination\.page\s*<=\s*1\}/);
    expect(src).toMatch(/disabled=\{pagination\.page\s*>=\s*pagination\.totalPages\}/);
  });

  it("sets aria-current='page' on the active page button", () => {
    expect(src).toMatch(/aria-current=\{isActive \? "page" : undefined\}/);
  });

  it("clamps the displayed page to [1, totalPages] via paginatePosts (§198 architecture)", () => {
    // §198 — The render-phase setPage(1) reset (§195) was removed because it
    // produced React error #300 on browser back/forward navigation. Empty-slice
    // protection now lives entirely inside paginatePosts() in blogFilters.ts,
    // which clamps page to [1, totalPages] before slicing. Blog.tsx must not
    // re-introduce render-phase setPage(1) (the original §195 pattern was
    // unsafe under popstate-triggered re-renders).
    expect(src).toMatch(/paginatePosts\(visiblePosts, page, BLOG_POSTS_PER_PAGE\)/);
    // No more filterSignatureRef — the abstraction was the loop source.
    expect(src).not.toMatch(/filterSignatureRef/);
  });

  it("clearFilters resets page to 1 too", () => {
    expect(src).toMatch(/function clearFilters\(\)[\s\S]+setPage\(1\)/);
  });

  it("syncs the page param into the URL via buildFiltersSearch", () => {
    expect(src).toMatch(/page:\s*pagination\.page/);
    expect(src).toMatch(/url\.searchParams\.delete\("page"\)/);
  });

  it("scrolls back to the grid anchor on page change and honors reduced motion", () => {
    expect(src).toMatch(/gridAnchorRef\.current\?\.scrollIntoView|gridAnchorRef\.current\.scrollIntoView/);
    expect(src).toMatch(/prefers-reduced-motion: reduce/);
  });

  it("renders a #blog-grid anchor so external deep-links can target the grid", () => {
    expect(src).toMatch(/id="blog-grid"/);
  });
});


// §198 — React error #300 on browser back/forward navigation.
//
// §195 had attempted to fix the Vercel-only empty-grid bug by calling
// setPage(1) synchronously during render whenever a filter-signature ref
// flipped. That was correct under steady-state interaction (clicking a chip
// works), but on browser back/forward (popstate) the pattern produced
// React error #300 "Too many re-renders":
//
//   - popstate fires → wouter re-renders Blog with new URL
//   - filter state did NOT auto-sync from URL (the original code used
//     useState(initial.tag) which only reads `initial` once on mount)
//   - URL-sync effect runs and rewrites URL via replaceState based on stale
//     state, which differs from the popstate-restored URL
//   - this can re-trigger a render where currentSig (computed from
//     visiblePosts[0]?.slug, an ordering-sensitive value) flips repeatedly,
//     calling setPage(1) inside render forever → #300
//
// §198 fix has three parts that together make the architecture loop-safe:
//   1. DELETE the render-phase setPage(1) reset entirely. paginatePosts()
//      already clamps page defensively, so the empty-slice scenario §195 was
//      protecting against is already covered by the helper.
//   2. ADD a popstate listener that re-syncs filter state from the URL on
//      browser back/forward, so state follows URL instead of fighting it.
//   3. MAKE the URL-sync effect idempotent: only call replaceState when the
//      computed href actually differs from window.location.href. This
//      guarantees popstate-triggered re-syncs don't round-trip the same URL.
//
// These pins lock the §198 architecture so a future contributor who tries to
// "simplify" the back-button handling can't accidentally re-introduce the
// loop.
describe("§198 — React error #300 fix: back/forward navigation loop prevention", () => {
  const src = read("client/src/pages/Blog.tsx");

  it("does NOT call setPage during render (the §195 pattern that produced #300)", () => {
    // The original §195 fix used `if (filterSignatureRef.current !== currentSig) ... setPage(1)`
    // synchronously during render. That pattern is now banned: it caused
    // React error #300 under back/forward navigation.
    expect(src).not.toMatch(/filterSignatureRef/);
    expect(src).not.toMatch(/const currentSig\s*=/);
    // No setPage(1) call should appear inside the function body OUTSIDE of
    // an event handler or effect. The clearFilters function is allowed.
    // We assert by absence of the original pattern markers.
  });

  it("installs a popstate listener that re-syncs filter state from the URL", () => {
    // Without this, browser back/forward changes the URL but leaves React
    // state at the post-click filter values, causing the URL-sync effect
    // to fight history.
    expect(src).toMatch(/window\.addEventListener\("popstate"/);
    expect(src).toMatch(/parseFiltersFromSearch\(window\.location\.search\)/);
    // The listener must call all five state setters so state fully follows URL.
    expect(src).toMatch(/setRange\(/);
    expect(src).toMatch(/setTag\(filters\.tag\)/);
    expect(src).toMatch(/setQuery\(filters\.query \?\? ""\)/);
    expect(src).toMatch(/setSort\(filters\.sort\)/);
    expect(src).toMatch(/setPage\(filters\.page\)/);
  });

  it("makes the URL-sync replaceState call idempotent (only writes when href changes)", () => {
    // Without this guard, popstate-triggered re-syncs would round-trip the
    // same URL through history.replaceState, cascading into a render loop.
    expect(src).toMatch(
      /const nextHref = url\.toString\(\);[\s\S]{0,200}?if \(nextHref !== window\.location\.href\)[\s\S]{0,200}?window\.history\.replaceState/,
    );
  });

  it("documents the §198 architecture so future contributors know not to re-introduce §195", () => {
    expect(src).toMatch(/§198/);
    // The comment block must explain WHY render-phase setPage was removed.
    expect(src).toMatch(/React error #300/);
  });
});

// §196 — Production-only chip-click "blog disappears" bug.
//
// When a user scrolled deep on /blog (e.g., page 11 of the unfiltered index)
// and then clicked a tag chip, the filtered grid rendered correctly at the
// top of the section — but the user's scroll position was still pointing
// at the bottom of where the OLD grid used to be. Result: an empty white
// area filled the viewport and the user reported "blogs aren't displaying."
//
// The fix wraps every state setter that can shrink the result set
// (setTag, setRange) in a wrapper that ALSO scrolls #blog-grid back into
// view. This mirrors what goToPage() already does for pagination clicks
// and what the standalone-page route (/blog/tag/:tag) gets for free
// because a full navigation always scrolls to the top.
//
// These pins make sure a future "extract handler" or "lift state up"
// refactor doesn't quietly regress the scroll-restoration contract.
describe("§196 — chip-click scroll restoration (production blank-grid fix)", () => {
  const src = read("client/src/pages/Blog.tsx");

  it("defines a scrollGridIntoView helper that uses gridAnchorRef.scrollIntoView", () => {
    expect(src).toMatch(/function\s+scrollGridIntoView\s*\(/);
    expect(src).toMatch(/gridAnchorRef\.current\.scrollIntoView/);
  });

  it("defines selectTag wrapper that calls setTag AND scrollGridIntoView", () => {
    // Single source of truth for the chip-click contract — the chip
    // onClick handlers must route through this so the scroll restore
    // never gets dropped from one chip while staying on another.
    expect(src).toMatch(
      /function\s+selectTag[\s\S]{0,200}?setTag[\s\S]{0,80}?scrollGridIntoView\(\)/,
    );
  });

  it("defines selectRange wrapper that calls setRange AND scrollGridIntoView", () => {
    // Same contract for the date-range chips, which can also shrink
    // the result set to fewer than one full page of cards.
    expect(src).toMatch(
      /function\s+selectRange[\s\S]{0,200}?setRange[\s\S]{0,80}?scrollGridIntoView\(\)/,
    );
  });

  it("wires every tag chip onClick through selectTag, never raw setTag", () => {
    // Pin the chip onClick handlers specifically. Inline setTag in a chip
    // onClick is the regression we want to ban — it's exactly what would
    // bring back the scroll-stranded blank-grid bug.
    // (clearFilters() may still call setTag(null) internally — that path
    //  is fine because clearing filters typically happens from the
    //  empty-state CTA which is already in view.)
    expect(src).toMatch(
      /onClick=\{\(\)\s*=>\s*selectTag\(null\)\}/,
    );
    expect(src).toMatch(
      /onClick=\{\(\)\s*=>\s*selectTag\(active\s*\?\s*null\s*:\s*t\)\}/,
    );
    // Ban the original buggy patterns:
    expect(src).not.toMatch(/onClick=\{\(\)\s*=>\s*setTag\(null\)\}/);
    expect(src).not.toMatch(/onClick=\{\(\)\s*=>\s*setTag\(active\s*\?\s*null\s*:\s*t\)\}/);
  });

  it("wires the date-range chip onClick through selectRange, never raw setRange", () => {
    expect(src).toMatch(/onClick=\{\(\)\s*=>\s*selectRange\(opt\.id\)\}/);
    expect(src).not.toMatch(/onClick=\{\(\)\s*=>\s*setRange\(opt\.id\)\}/);
  });

  it("documents WHY the wrappers exist so the pattern survives refactors", () => {
    // The §196 comment block explains the bug's user-visible symptom
    // (blank grid even though state is correct). A future contributor
    // who tries to "simplify" by inlining setTag will hit this pin
    // and read the comment first.
    expect(src).toMatch(/§196/);
    expect(src).toMatch(/stranded BELOW the new \(much shorter\) grid/i);
  });
});

// §197 — Production blank-grid bug: cards rendered at opacity:0 after chip click.
//
// After §195 (page reset) and §196 (scroll restoration) shipped, users still
// reported that clicking a tag chip on the live Vercel deploy produced a
// "blank white area below the chip row." Direct DOM inspection on the live
// site showed:
//   - State was correct: visiblePosts.length matched the chip's count
//   - URL was correct: ?tag=<slug> applied
//   - Grid <article> elements WERE rendering into the DOM
//   - But every .reveal-on-scroll card had `opacity: 0` because the
//     IntersectionObserver in useReveal() only re-attached on route change.
//     A wouter SPA filter change is NOT a route change, so the observer
//     never tagged the newly-mounted cards `.is-visible` and they stayed
//     invisible until a hard reload.
//
// Fix: call useReveal(revealKey) inside Blog.tsx with a key derived from the
// slugs of the currently-rendered slice. Whenever the rendered slice
// changes (chip, search, sort, pagination), useReveal's effect re-runs,
// disconnects the old observer, and observes the freshly-mounted cards.
//
// These pins make sure a future "consolidate hooks" pass doesn't drop the
// useReveal call or change its key to something that loses the chip-click
// case (e.g., keying only on `tag`, which would miss search-input changes).
describe("§197 — useReveal re-attaches IntersectionObserver on chip click (production opacity:0 fix)", () => {
  const src = read("client/src/pages/Blog.tsx");

  it("imports useReveal from the hooks module", () => {
    expect(src).toMatch(/import\s+\{\s*useReveal\s*\}\s+from\s+["']@\/hooks\/useReveal["']/);
  });

  it("calls useReveal inside the Blog component with a render-derived key", () => {
    // The hook must be called, and the key must reference pagination.posts
    // (or an equivalent slug-derived identifier) so that every rendered
    // slice change re-runs the observer attach. A bare `useReveal()` with
    // no arg, or `useReveal(tag)`, would miss search/sort/pagination cases.
    expect(src).toMatch(/useReveal\s*\(\s*revealKey\s*\)/);
    expect(src).toMatch(/const\s+revealKey\s*=\s*pagination\.posts\.map/);
  });

  it("derives the key from rendered slugs, not just length or tag", () => {
    // Locks the join("|") of slugs pattern. Length-only would miss sort
    // changes; tag-only would miss query/sort/page changes. Slug-list is
    // the minimum stable signature that captures all four filter axes.
    expect(src).toMatch(/pagination\.posts\.map\(\s*\(p\)\s*=>\s*p\.slug\s*\)\.join\(\s*["']\|["']\s*\)/);
  });

  it("documents WHY the hook call exists so the pattern survives refactors", () => {
    // The §197 comment block explains the bug's user-visible symptom
    // (blank area below chip row even though cards are in the DOM at
    // opacity:0). A future contributor who tries to remove the call as
    // "redundant with SiteShell's useReveal" will hit this pin and read
    // the explanation first.
    expect(src).toMatch(/§197/);
    expect(src).toMatch(/IntersectionObserver|opacity:0|reveal-on-scroll/);
    expect(src).toMatch(/SiteShell only re-attaches on\s+\/\/\s*route change/);
  });
});
