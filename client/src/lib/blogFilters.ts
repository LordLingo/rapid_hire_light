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
 * Read-only shape of the index's URL-synced filter state. Each field is
 * independently nullable so we can drop unset params from the URL.
 */
export type BlogIndexFilters = {
  tag: string | null;
  query: string | null;
};

/**
 * Parse the index filter state from a URLSearchParams-compatible string
 * (e.g. `window.location.search`). Unknown params are ignored.
 */
export function parseFiltersFromSearch(search: string): BlogIndexFilters {
  const params = new URLSearchParams(search);
  const rawTag = params.get("tag");
  const rawQuery = params.get("q");
  const tag = rawTag && rawTag.trim() ? rawTag.trim() : null;
  const query = rawQuery && rawQuery.trim() ? rawQuery.trim() : null;
  return { tag, query };
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
  return params.toString();
}
