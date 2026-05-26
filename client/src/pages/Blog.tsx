/*
  Editorial Calm — Blog index
  - PageHero with eyebrow "09 — Blog" + italic accent.
  - Slim year-archives utility strip directly below the hero so the
    /blog/year/{y} routes keep a discoverable entry point without
    duplicating the interactive tag pill row below.
  - Live filter row (search input + sort dropdown + category pills +
    date-range chips) over the same listPosts() source, URL-synced via
    ?tag=…&q=…&sort=…&page=…&range=… Each pill still carries an
    "Open as standalone page →" affordance to /blog/tag/{slug} so the
    dedicated SEO surfaces remain crawlable.
  - Grid of post cards + pager.
  - On-page SEO: dynamic title, meta description, canonical, Blog JSON-LD.
*/
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search as SearchIcon, X as XIcon } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
import { useReveal } from "@/hooks/useReveal";
import {
  listPosts,
  getAllTags,
  formatPublishedDate,
  formatTag,
  isRecentlyUpdated,
  getPostLastmod,
  listPostYears,
} from "@/lib/blog";
import {
  filterByTag,
  filterByQuery,
  formatResultCount,
  parseFiltersFromSearch,
  buildFiltersSearch,
  sortPosts,
  paginatePosts,
  buildPagerWindow,
  formatPageRange,
  BLOG_POSTS_PER_PAGE,
  BLOG_SORT_OPTIONS,
  DEFAULT_BLOG_SORT,
  blogSortLabel,
  type BlogSortKey,
} from "@/lib/blogFilters";

type DateRange = "all" | "90d" | "30d";

function parseInitialRange(): DateRange {
  if (typeof window === "undefined") return "all";
  const v = new URLSearchParams(window.location.search).get("range");
  return v === "30d" || v === "90d" ? v : "all";
}

function parseInitialFilters() {
  if (typeof window === "undefined")
    return { tag: null, query: null, sort: DEFAULT_BLOG_SORT, page: 1 };
  return parseFiltersFromSearch(window.location.search);
}

export default function Blog() {
  const allPosts = useMemo(() => listPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const yearArchives = useMemo(() => listPostYears(), []);

  // Date-range facet (existing). Initial value is read from the
  // `?range=` query param so links remain shareable.
  const [range, setRange] = useState<DateRange>(parseInitialRange);

  // New category + search + sort filter state, URL-synced via ?tag=&q=&sort=&page=.
  const initial = useMemo(parseInitialFilters, []);
  const [tag, setTag] = useState<string | null>(initial.tag);
  const [query, setQuery] = useState<string>(initial.query ?? "");
  const [sort, setSort] = useState<BlogSortKey>(initial.sort);
  const [page, setPage] = useState<number>(initial.page);
  // Anchor we scroll to when a page button is clicked.
  const gridAnchorRef = useRef<HTMLDivElement | null>(null);

  // Tag counts — drive the category pill row + the topics-by-depth grid.
  const tagsByDepth = useMemo(() => {
    return allTags
      .map((t) => ({ tag: t, count: allPosts.filter((p) => p.tags.includes(t)).length }))
      .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.tag.localeCompare(b.tag)));
  }, [allTags, allPosts]);

  // Combined filter stack: range × tag × query, in that order so the
  // count-of-total label always reflects the corpus the reader is
  // currently scoped to.
  const visiblePosts = useMemo(() => {
    let out = allPosts;
    if (range !== "all") {
      const days = range === "30d" ? 30 : 90;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      out = out.filter((p) => {
        const t = Date.parse(p.publishedAt);
        return Number.isFinite(t) && t >= cutoff;
      });
    }
    out = filterByTag(out, tag);
    out = filterByQuery(out, query);
    out = sortPosts(out, sort);
    return out;
  }, [allPosts, range, tag, query, sort]);

  // §195 — Reset page during render whenever the filter set changes,
  // so the pagination memo below NEVER runs against a stale page index.
  //
  // The previous approach used a useEffect that called setPage(1) AFTER
  // the filter change had already rendered. Under React 18's automatic
  // batching in Vercel's production build, the intermediate render where
  // `page` was still the old value (and pointed past the end of the
  // newly-filtered set) would briefly show an empty grid because
  // paginatePosts() would return an empty slice. The standalone-page
  // route worked because it bypassed this state by mounting fresh.
  //
  // The pattern below is the React docs' recommended fix for race
  // conditions like this — derive the next page synchronously during
  // render and call the setter inside the same render pass. React
  // discards the partial render and re-runs with the corrected state
  // before committing to the DOM, so users never see the stale slice.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const filterSignatureRef = useRef<string>("");
  const currentSig = `${visiblePosts.length}:${visiblePosts[0]?.slug ?? ""}:${sort}`;
  if (filterSignatureRef.current === "") {
    filterSignatureRef.current = currentSig;
  } else if (filterSignatureRef.current !== currentSig) {
    filterSignatureRef.current = currentSig;
    if (page !== 1) {
      setPage(1);
    }
  }

  // §149 — page-aware slice of the filtered+sorted result set.
  // §195 — `page` is guaranteed safe by the synchronous reset above; the
  // helper still clamps defensively for deep-link edge cases.
  const pagination = useMemo(
    () => paginatePosts(visiblePosts, page, BLOG_POSTS_PER_PAGE),
    [visiblePosts, page],
  );

  // §197 — Re-run the IntersectionObserver-driven reveal-on-scroll system
  // every time the rendered card set changes (chip click, search, sort,
  // pagination). Without this, newly-mounted .reveal-on-scroll cards stay at
  // opacity:0 forever because the observer in SiteShell only re-attaches on
  // route change. Keying on the slugs of the rendered slice (not just
  // visiblePosts.length) ensures we also handle sort changes that keep the
  // count constant. The user-visible symptom this fixes was "clicking a tag
  // chip leaves the area below the chip row blank" — the cards were
  // rendering, but invisible because the observer never tagged them
  // .is-visible. See client/src/hooks/useReveal.ts for the observer impl.
  const revealKey = pagination.posts.map((p) => p.slug).join("|");
  useReveal(revealKey);

  // Keep the URL in sync with every filter change so deep links work and
  // the browser back button restores filter state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (range === "all") url.searchParams.delete("range");
    else url.searchParams.set("range", range);
    const filtersSearch = buildFiltersSearch({
      tag,
      query: query.trim() || null,
      sort,
      page: pagination.page,
    });
    url.searchParams.delete("tag");
    url.searchParams.delete("q");
    url.searchParams.delete("sort");
    url.searchParams.delete("page");
    if (filtersSearch) {
      const params = new URLSearchParams(filtersSearch);
      params.forEach((v, k) => url.searchParams.set(k, v));
    }
    window.history.replaceState(null, "", url.toString());
  }, [range, tag, query, sort, pagination.page]);

  function clearFilters() {
    setTag(null);
    setQuery("");
    setSort(DEFAULT_BLOG_SORT);
    setPage(1);
  }

  function goToPage(nextPage: number) {
    setPage(nextPage);
    scrollGridIntoView();
  }

  // §196 — Scroll the grid anchor into view whenever a filter change shrinks
  // the result set. Without this, a user who has scrolled down on, say,
  // page 11 of the unfiltered index and then clicks a tag chip ends up
  // stranded BELOW the new (much shorter) grid — the cards have re-rendered
  // at the top of the section, but the viewport is still pointed at empty
  // whitespace where page 11 used to be. Visually indistinguishable from a
  // "blog isn't displaying" bug, which is exactly how it was reported.
  // The standalone-page route bypasses this because it triggers a full
  // navigation, which scrolls to the top.
  function scrollGridIntoView() {
    if (typeof window === "undefined" || !gridAnchorRef.current) return;
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gridAnchorRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  // §196 — Wrapper for setTag that also scrolls the user back to the grid
  // so a smaller filtered set is never rendered "above" the user's
  // current scroll position. Used by every chip click — keeps Blog.tsx
  // the single source of truth for the chip-click contract.
  function selectTag(nextTag: string | null) {
    setTag(nextTag);
    scrollGridIntoView();
  }

  // §196 — Same idea for the date-range chips: changing range can shrink
  // the corpus to fewer than one page of cards, which would otherwise
  // leave the user stranded below the grid.
  function selectRange(nextRange: DateRange) {
    setRange(nextRange);
    scrollGridIntoView();
  }

  // ItemList JSON-LD helps Google understand the index as a structured
  // collection of articles — improves the chance of rich-result eligibility.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Rapid Hire Solutions — Blog",
    description:
      "Background screening insights, FCRA compliance, and hiring workflow guides for HR and operations teams.",
    blogPost: allPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.publishedAt,
      url: `/blog/${p.slug}`,
      description: p.metaDescription,
    })),
  };

  useSeo({
    title: "Blog — Background Screening & FCRA Insights",
    description:
      "Practical guides to background screening, FCRA compliance, drug testing, MVR, and continuous monitoring — written by the Rapid Hire Solutions team.",
    ogType: "website",
    jsonLd,
  });

  const activeFilterLabel = tag ? formatTag(tag) : null;
  const baseResultCount = formatResultCount(
    visiblePosts.length,
    allPosts.length,
    activeFilterLabel,
    query.trim() || null,
  );
  const sortedSuffix =
    sort !== DEFAULT_BLOG_SORT && visiblePosts.length > 0
      ? `, sorted ${blogSortLabel(sort).toLowerCase()}`
      : "";
  const pageSuffix = formatPageRange(pagination);
  const resultCountLabel = pageSuffix
    ? `${baseResultCount}${sortedSuffix} \u00b7 ${pageSuffix}`
    : `${baseResultCount}${sortedSuffix}`;
  const pagerWindow = buildPagerWindow(pagination.page, pagination.totalPages);

  return (
    <SiteShell>
      <PageHero
        eyebrow="09 — Blog"
        title={
          <>
            Field notes from the{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              screening
            </span>{" "}
            floor.
          </>
        }
        lede="Practical, jurisdiction-aware writing on background checks, FCRA compliance, drug screening, MVR/DOT, and the hiring workflow that surrounds them — by the Rapid Hire Solutions team."
      />

      {yearArchives.length > 1 && (
        <section
          className="bg-white border-b border-border"
          aria-label="Year archives"
          data-testid="blog-year-archives"
        >
          <div className="container flex flex-wrap items-center gap-x-3 gap-y-2 py-3 text-[12.5px] tracking-wider uppercase text-[color:var(--color-ink-muted)]">
            <span className="font-medium">Archives</span>
            {yearArchives.map((y) => {
              const count = allPosts.filter((p) => p.publishedAt.startsWith(`${y}-`)).length;
              return (
                <Link
                  key={y}
                  href={`/blog/year/${y}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-[12.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-ink)] transition-colors"
                  aria-label={`${y} archive — ${count} ${count === 1 ? "article" : "articles"}`}
                >
                  <span className="font-medium tabular-nums">{y}</span>
                  <span aria-hidden="true" className="text-[color:var(--color-ink-muted)]">
                    ({count})
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-24">
          {/* New filter bar: search input + category pill row. Both wired
              to URL state and combined with the existing date-range facet. */}
          <div
            data-testid="blog-filters"
            className="mb-12 flex flex-col gap-6"
            aria-label="Filter articles"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="eyebrow !mt-0">Find an article</p>
              <p
                data-testid="blog-result-count"
                aria-live="polite"
                className="text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
              >
                {resultCountLabel}
              </p>
            </div>

              {/* Search input + sort dropdown sit side-by-side on wide screens. */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-2xl">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-ink-muted)]"
              />
              <input
                data-testid="blog-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${allPosts.length}+ background-check guides…`}
                aria-label="Search articles by keyword"
                className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-12 text-[15px] leading-[1.4] tracking-tight text-[color:var(--color-ink)] placeholder:text-[color:var(--color-ink-muted)] focus:outline-none focus:border-[color:var(--color-accent-ink)] focus:ring-2 focus:ring-[color:var(--color-accent-ink)]/20 transition-colors"
              />
              {query && (
                <button
                  type="button"
                  data-testid="blog-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full border border-transparent text-[color:var(--color-ink-muted)] hover:border-border hover:text-[color:var(--color-ink)] transition-colors"
                >
                  <XIcon className="size-3.5" />
                </button>
              )}
            </div>
            <div className="sm:w-56">
              <label htmlFor="blog-sort" className="sr-only">Sort articles</label>
              <select
                id="blog-sort"
                data-testid="blog-sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value as BlogSortKey)}
                aria-label="Sort articles"
                className="w-full rounded-full border border-border bg-white py-3 pl-5 pr-9 text-[14.5px] leading-[1.4] tracking-tight text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-accent-ink)] focus:ring-2 focus:ring-[color:var(--color-accent-ink)]/20 transition-colors appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%23667085' stroke-width='1.5'><path d='M3 4.5l3 3 3-3'/></svg>\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 14px center",
                  backgroundSize: "12px 12px",
                }}
              >
                {BLOG_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} data-value={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            </div>

            {/* Category pill row */}
            <div
              role="toolbar"
              data-testid="blog-category-row"
              aria-label="Filter articles by category"
              className="flex flex-wrap items-center gap-2"
            >
              <button
                key="__all__"
                type="button"
                data-testid="blog-category-pill"
                data-tag="all"
                data-active={tag === null ? "true" : "false"}
                onClick={() => selectTag(null)}
                aria-pressed={tag === null}
                className={[
                  "rounded-full border px-3.5 py-1.5 text-[13px] tracking-tight transition-colors",
                  tag === null
                    ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                    : "border-border bg-white text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                ].join(" ")}
              >
                All
                <span
                  aria-hidden="true"
                  className={
                    tag === null
                      ? "ml-1.5 text-[12px] tabular-nums text-white/70"
                      : "ml-1.5 text-[12px] tabular-nums text-[color:var(--color-ink-muted)]"
                  }
                >
                  {allPosts.length}
                </span>
              </button>
              {tagsByDepth.map(({ tag: t, count }) => {
                const active = tag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    data-testid="blog-category-pill"
                    data-tag={t}
                    data-active={active ? "true" : "false"}
                    onClick={() => selectTag(active ? null : t)}
                    aria-pressed={active}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-[13px] tracking-tight transition-colors",
                      active
                        ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                        : "border-border bg-white text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                    ].join(" ")}
                  >
                    {formatTag(t)}
                    <span
                      aria-hidden="true"
                      className={
                        active
                          ? "ml-1.5 text-[12px] tabular-nums text-white/70"
                          : "ml-1.5 text-[12px] tabular-nums text-[color:var(--color-ink-muted)]"
                      }
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
              {tag !== null && (
                <Link
                  href={`/blog/tag/${tag}`}
                  className="ml-1 inline-flex items-center gap-1 text-[12.5px] tracking-tight text-[color:var(--color-accent-ink)] hover:underline"
                >
                  Open as standalone page
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
            </div>

            {/* Date-range facet (existing) */}
            <div
              role="toolbar"
              aria-label="Filter articles by date"
              className="flex flex-wrap items-center gap-3"
            >
              <p className="eyebrow !mt-0 mr-1">Show</p>
              {(
                [
                  { id: "all" as const, label: "All time" },
                  { id: "90d" as const, label: "Last 90 days" },
                  { id: "30d" as const, label: "Last 30 days" },
                ]
              ).map((opt) => {
                const active = range === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectRange(opt.id)}
                    aria-pressed={active}
                    className={[
                      "rounded-full border px-3.5 py-1.5 text-[13.5px] tracking-tight transition-colors",
                      active
                        ? "border-[color:var(--color-accent-ink)] text-[color:var(--color-accent-ink)] bg-white"
                        : "border-border text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]",
                    ].join(" ")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {visiblePosts.length === 0 ? (
            <div data-testid="blog-empty-state" className="rounded-2xl border border-border bg-[color:var(--color-paper-soft)] p-10 text-center">
              <p className="font-display text-[22px] sm:text-[26px] leading-[1.2] text-[color:var(--color-ink)]">
                No posts match these filters.
              </p>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                Try a shorter search term or pick a different category. The full
                archive of {allPosts.length} articles is one click away.
              </p>
              <button
                type="button"
                data-testid="blog-empty-reset"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] px-4 py-2 text-[14px] font-medium tracking-tight text-white hover:opacity-90 transition-opacity"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
            <div ref={gridAnchorRef} id="blog-grid" aria-hidden="true" />
            <div className="grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-16">
              {pagination.posts.map((p, i) => (
                <article
                  key={p.slug}
                  className={[
                    "reveal-on-scroll col-span-12",
                    i === 0 ? "md:col-span-12" : "md:col-span-6",
                  ].join(" ")}
                >
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <p className="eyebrow">{p.tags[0]?.replace(/-/g, " ")}</p>
                    <div className="mt-3 hairline" />
                    <h2
                      className={[
                        "mt-5 font-display tracking-[-0.02em] leading-[1.08] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)] transition-colors",
                        i === 0
                          ? "text-[36px] sm:text-[44px] md:text-[56px]"
                          : "text-[26px] sm:text-[30px]",
                      ].join(" ")}
                    >
                      {p.title}
                    </h2>
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      <span>{formatPublishedDate(p.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{p.readingMinutes} min read</span>
                      {isRecentlyUpdated(p) && (
                        <span
                          className="inline-flex items-center rounded-full border border-[color:var(--color-accent-ink)]/30 bg-[color:var(--color-accent-ink)]/8 px-2 py-0.5 text-[10.5px] tracking-wider text-[color:var(--color-accent-ink)]"
                          title={`Last updated ${formatPublishedDate(getPostLastmod(p.slug))}`}
                          aria-label={`Updated ${formatPublishedDate(getPostLastmod(p.slug))}`}
                        >
                          Updated
                        </span>
                      )}
                    </p>
                    <p
                      className={[
                        "mt-5 leading-[1.7] text-[color:var(--color-ink-soft)]",
                        i === 0
                          ? "text-[17px] max-w-3xl"
                          : "text-[15.5px]",
                      ].join(" ")}
                    >
                      {p.excerpt}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                      Read article
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
            {pagination.totalPages > 1 && (
              <nav
                data-testid="blog-pager"
                aria-label="Blog pagination"
                className="mt-16 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  data-testid="blog-pager-prev"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  aria-label="Previous page"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-[color:var(--color-ink-soft)]"
                >
                  <ChevronLeft className="size-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                {pagerWindow.map((slot, idx) => {
                  if (slot === "\u2026") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        data-testid="blog-pager-ellipsis"
                        aria-hidden="true"
                        className="px-2 text-[14px] text-[color:var(--color-ink-muted)]"
                      >
                        …
                      </span>
                    );
                  }
                  const isActive = slot === pagination.page;
                  return (
                    <button
                      key={`page-${slot}`}
                      type="button"
                      data-testid={isActive ? "blog-pager-page-active" : "blog-pager-page"}
                      data-page={slot}
                      onClick={() => goToPage(slot)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={isActive ? `Page ${slot}, current page` : `Go to page ${slot}`}
                      className={[
                        "min-w-[2.5rem] rounded-full border px-3.5 py-2 text-[13.5px] tabular-nums tracking-tight transition-colors",
                        isActive
                          ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-white"
                          : "border-border bg-white text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)]",
                      ].join(" ")}
                    >
                      {slot}
                    </button>
                  );
                })}
                <button
                  type="button"
                  data-testid="blog-pager-next"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  aria-label="Next page"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-4 py-2 text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-[color:var(--color-ink-soft)]"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </nav>
            )}
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
