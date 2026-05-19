/**
 * Pure, side-effect-free helpers for the /blog index filter stack.
 *
 * The index now combines three independent filters over the same
 * `listPosts()` source: date range (existing), tag (new), and text search
 * (new). Keeping these as pure functions lets the React page stay thin and
 * lets the vitest spec assert behavior without a DOM.
 *
 * All matchers are case-insensitive; tag is exact (lower-kebab-case);
 * query matches against title, excerpt, and tags so a reader who types
 * "fair chance" or "fcra" or "marijuana" finds the right cluster.
 */
import type { BlogPost } from "./blog";

/**
 * Return posts that carry `tag`, or every post when `tag` is null/empty.
 * Tag values are guaranteed lower-kebab-case by the registry test suite.
 */
export function filterByTag(
  posts: BlogPost[],
  tag: string | null | undefined,
): BlogPost[] {
  if (!tag) return posts;
  const needle = tag.trim();
  if (!needle) return posts;
  return posts.filter((p) => p.tags.includes(needle));
}

/**
 * Return posts whose title, excerpt, or any tag (formatted as
 * "Lower Kebab Case" or in its raw slug form) contains `query`.
 * Empty or whitespace-only queries are treated as "no filter".
 *
 * The matcher is case-insensitive and matches anywhere in the field so a
 * reader can type a partial word ("compl", "drug", "i9", "k-12") and
 * still hit the cluster.
 */
export function filterByQuery(
  posts: BlogPost[],
  query: string | null | undefined,
): BlogPost[] {
  if (!query) return posts;
  const needle = query.trim().toLowerCase();
  if (!needle) return posts;
  return posts.filter((p) => {
    if (p.title.toLowerCase().includes(needle)) return true;
    if (p.excerpt.toLowerCase().includes(needle)) return true;
    for (const t of p.tags) {
      if (t.toLowerCase().includes(needle)) return true;
      // Also match the human-readable form ("fair chance" rather than
      // "fair-chance") so a reader's natural query terms hit the tag.
      if (t.replace(/-/g, " ").toLowerCase().includes(needle)) return true;
    }
    return false;
  });
}

/**
 * Build a human-readable result-count label that adapts to the active
 * filter stack. Examples:
 *   formatResultCount(120, 120, null, null) -> "Showing 120 articles"
 *   formatResultCount(8, 120, "healthcare", "fcra") ->
 *     'Showing 8 of 120 articles in healthcare matching "fcra"'
 *   formatResultCount(0, 120, "k12-education", null) ->
 *     "No articles in k12-education yet."
 */
export function formatResultCount(
  visible: number,
  total: number,
  tag: string | null | undefined,
  query: string | null | undefined,
): string {
  const trimmedQuery = query?.trim() ?? "";
  const trimmedTag = tag?.trim() ?? "";
  const hasTag = trimmedTag.length > 0;
  const hasQuery = trimmedQuery.length > 0;

  if (visible === 0) {
    if (hasTag && hasQuery) {
      return `No articles in ${trimmedTag} match "${trimmedQuery}".`;
    }
    if (hasTag) return `No articles in ${trimmedTag} yet.`;
    if (hasQuery) return `No articles match "${trimmedQuery}".`;
    return "No articles.";
  }

  const noun = visible === 1 ? "article" : "articles";
  const scopeBits: string[] = [];
  if (hasTag) scopeBits.push(`in ${trimmedTag}`);
  if (hasQuery) scopeBits.push(`matching "${trimmedQuery}"`);

  if (!hasTag && !hasQuery) {
    return `Showing ${visible} ${noun}`;
  }

  // When any filter is active we surface the "x of total" framing so the
  // reader keeps the size of the corpus in view.
  const lead = visible === total
    ? `Showing all ${visible} ${noun}`
    : `Showing ${visible} of ${total} ${noun}`;
  return `${lead} ${scopeBits.join(" ")}`;
}

/**
 * §147 — sort keys for the blog index sort dropdown. `"newest"` is the
 * default and matches the original index order; the other three give
 * the reader real control without us needing real analytics yet.
 */
export type BlogSortKey = "newest" | "oldest" | "alphabetical" | "depth";

export const DEFAULT_BLOG_SORT: BlogSortKey = "newest";

/**
 * §147 — ordered list of sort options surfaced in the dropdown. Order
 * is the order pinned by vitest so the UI can iterate without losing
 * the canonical ordering.
 */
export const BLOG_SORT_OPTIONS: readonly { value: BlogSortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "alphabetical", label: "A – Z" },
  { value: "depth", label: "Longest reads first" },
];

/**
 * §147 — non-mutating sort over a BlogPost[] keyed by BlogSortKey.
 *
 * - `newest` / `oldest` sort by `date` (ISO yyyy-mm-dd, lexicographic
 *   ordering is safe).
 * - `alphabetical` sorts by lowercased title for case-insensitive A–Z.
 * - `depth` sorts by `readingMinutes` (longest first); ties broken by
 *   newer date so the rank feels stable.
 */
export function sortPosts(
  posts: BlogPost[],
  key: BlogSortKey = DEFAULT_BLOG_SORT,
): BlogPost[] {
  const out = posts.slice();
  switch (key) {
    case "newest":
      out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      break;
    case "oldest":
      out.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
      break;
    case "alphabetical":
      out.sort((a, b) =>
        a.title.toLocaleLowerCase().localeCompare(b.title.toLocaleLowerCase()),
      );
      break;
    case "depth":
      out.sort((a, b) => {
        const diff = b.readingMinutes - a.readingMinutes;
        if (diff !== 0) return diff;
        return b.publishedAt.localeCompare(a.publishedAt);
      });
      break;
  }
  return out;
}

/**
 * §149 — Page size for the /blog grid. Matches the existing 12-card
 * rhythm so a default unfiltered page lands one screen tall on desktop.
 */
export const BLOG_POSTS_PER_PAGE = 12 as const;

/** §149 — Return shape for `paginatePosts`. */
export type BlogPagination = {
  /** The slice of posts visible on `page`. */
  posts: BlogPost[];
  /** The clamped, 1-indexed page actually returned. */
  page: number;
  /** Total page count across the full filtered+sorted set. */
  totalPages: number;
  /** Total post count across the full filtered+sorted set. */
  total: number;
  /** 1-indexed inclusive index of the first post on this page. */
  firstIndex: number;
  /** 1-indexed inclusive index of the last post on this page. */
  lastIndex: number;
};

/**
 * §149 — 1-indexed page slice with safe clamping.
 *
 * - `page` < 1 or non-finite clamps to 1.
 * - `page` > totalPages clamps to the last page so a deep link survives
 *   the corpus shrinking.
 * - Empty corpus returns `{ posts: [], page: 1, totalPages: 1, total: 0,
 *   firstIndex: 0, lastIndex: 0 }` so the UI can render an empty state
 *   without divide-by-zero issues.
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number,
  perPage: number = BLOG_POSTS_PER_PAGE,
): BlogPagination {
  const total = posts.length;
  const size = Math.max(1, Math.trunc(perPage));
  if (total === 0) {
    return {
      posts: [],
      page: 1,
      totalPages: 1,
      total: 0,
      firstIndex: 0,
      lastIndex: 0,
    };
  }
  const totalPages = Math.max(1, Math.ceil(total / size));
  const safe = Number.isFinite(page) ? Math.trunc(page) : 1;
  const clamped = Math.min(Math.max(1, safe), totalPages);
  const start = (clamped - 1) * size;
  const end = Math.min(start + size, total);
  return {
    posts: posts.slice(start, end),
    page: clamped,
    totalPages,
    total,
    firstIndex: start + 1,
    lastIndex: end,
  };
}

/**
 * §149 — Build a compact pager window of page-number slots with
 * sentinel `"…"` entries for collapsed ranges. The window always
 * surfaces the first and last page, the current page, and the current
 * page ±1, with ellipses in between when there is a gap > 1.
 *
 * Examples (current page = X, total = Y):
 *   buildPagerWindow(1, 5)  -> [1, 2, 3, 4, 5]
 *   buildPagerWindow(1, 10) -> [1, 2, 3, "…", 10]
 *   buildPagerWindow(5, 10) -> [1, "…", 4, 5, 6, "…", 10]
 *   buildPagerWindow(10, 10) -> [1, "…", 8, 9, 10]
 *   buildPagerWindow(7, 7)  -> [1, 2, 3, 4, 5, 6, 7]
 */
export function buildPagerWindow(
  current: number,
  totalPages: number,
): Array<number | "\u2026"> {
  if (totalPages <= 1) return [1];
  const safe = Math.min(Math.max(1, Math.trunc(current) || 1), totalPages);
  // For <=7 pages, render the full strip so the pager doesn't collapse
  // unnecessarily on small corpora.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, safe, safe - 1, safe + 1]);
  const ordered = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const out: Array<number | "\u2026"> = [];
  for (let i = 0; i < ordered.length; i++) {
    out.push(ordered[i]);
    const next = ordered[i + 1];
    if (next !== undefined && next - ordered[i] > 1) {
      out.push("\u2026");
    }
  }
  return out;
}

/**
 * Read-only shape of the index's URL-synced filter state. Each field is
 * independently nullable so we can drop unset params from the URL.
 */
export type BlogIndexFilters = {
  tag: string | null;
  query: string | null;
  sort: BlogSortKey;
  /** §149 — 1-indexed current page; 1 (the default) is suppressed from the URL. */
  page: number;
};

/**
 * Parse the index filter state from a URLSearchParams-compatible string
 * (e.g. `window.location.search`). Unknown params are ignored.
 */
export function parseFiltersFromSearch(search: string): BlogIndexFilters {
  const params = new URLSearchParams(search);
  const rawTag = params.get("tag");
  const rawQuery = params.get("q");
  const rawSort = params.get("sort");
  const tag = rawTag && rawTag.trim() ? rawTag.trim() : null;
  const query = rawQuery && rawQuery.trim() ? rawQuery.trim() : null;
  const sort: BlogSortKey = isBlogSortKey(rawSort)
    ? rawSort
    : DEFAULT_BLOG_SORT;
  const page = parsePageFromSearch(search);
  return { tag, query, sort, page };
}

/**
 * §149 — Parse the 1-indexed `page` param. Non-numeric, zero, negative,
 * and missing values fall back to 1 so deep links survive bad input.
 */
export function parsePageFromSearch(search: string): number {
  const raw = new URLSearchParams(search).get("page");
  if (!raw) return 1;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
}

/** Type-guard used by parseFiltersFromSearch to reject unknown sort keys. */
export function isBlogSortKey(value: unknown): value is BlogSortKey {
  return (
    value === "newest" ||
    value === "oldest" ||
    value === "alphabetical" ||
    value === "depth"
  );
}

/**
 * Serialize the filter state back into a query-string fragment (without
 * the leading "?"). Empty filters are dropped so the canonical URL stays
 * `/blog` rather than `/blog?tag=&q=`.
 *
 * Caller is responsible for prepending "?" and combining with other
 * params (like `range=`) — this helper keeps the contract narrow so the
 * vitest spec can pin it.
 */
export function buildFiltersSearch(filters: BlogIndexFilters): string {
  const params = new URLSearchParams();
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.query) params.set("q", filters.query);
  if (filters.sort && filters.sort !== DEFAULT_BLOG_SORT) {
    params.set("sort", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(Math.trunc(filters.page)));
  }
  return params.toString();
}

/**
 * Human-readable label for a sort key. Mirrors BLOG_SORT_OPTIONS so the
 * dropdown and the result-count line stay in sync, and so the
 * formatResultCount() helper can surface the active sort without
 * needing to re-derive it.
 */
export function blogSortLabel(key: BlogSortKey): string {
  const found = BLOG_SORT_OPTIONS.find((o) => o.value === key);
  return found ? found.label : BLOG_SORT_OPTIONS[0].label;
}

/**
 * §149 — Pager-aware page-range suffix. Appended to the existing
 * formatResultCount() output so paginated pages disclose their slice
 * without making the unpaginated case noisier. Caller is responsible
 * for joining (" · ") so the spec can pin both halves independently.
 *
 *   formatPageRange({ page: 1, totalPages: 1, ... })  -> ""
 *   formatPageRange({ page: 2, totalPages: 10, firstIndex: 13, lastIndex: 24 })
 *     -> "showing 13–24 · page 2 of 10"
 */
export function formatPageRange(p: BlogPagination): string {
  if (p.totalPages <= 1 || p.total === 0) return "";
  return `showing ${p.firstIndex}\u2013${p.lastIndex} \u00b7 page ${p.page} of ${p.totalPages}`;
}
