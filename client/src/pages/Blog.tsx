/*
  Editorial Calm — Blog index
  - PageHero with eyebrow "09 — Blog" + italic accent.
  - Topics-by-depth section: every tag rendered as a depth-ranked badge
    that still links to the dedicated /blog/tag/{slug} page (preserves
    every existing SEO surface).
  - Live filter row (search input + category pills) over the same
    listPosts() source, URL-synced via ?tag=…&q=…&range=…
  - Grid of post cards.
  - On-page SEO: dynamic title, meta description, canonical, Blog JSON-LD.
*/
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Search as SearchIcon, X as XIcon } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
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
} from "@/lib/blogFilters";

type DateRange = "all" | "90d" | "30d";

function parseInitialRange(): DateRange {
  if (typeof window === "undefined") return "all";
  const v = new URLSearchParams(window.location.search).get("range");
  return v === "30d" || v === "90d" ? v : "all";
}

function parseInitialFilters() {
  if (typeof window === "undefined") return { tag: null, query: null };
  return parseFiltersFromSearch(window.location.search);
}

export default function Blog() {
  const allPosts = useMemo(() => listPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const yearArchives = useMemo(() => listPostYears(), []);

  // Date-range facet (existing). Initial value is read from the
  // `?range=` query param so links remain shareable.
  const [range, setRange] = useState<DateRange>(parseInitialRange);

  // New category + search filter state, URL-synced via ?tag=&q=.
  const initial = useMemo(parseInitialFilters, []);
  const [tag, setTag] = useState<string | null>(initial.tag);
  const [query, setQuery] = useState<string>(initial.query ?? "");

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
    return out;
  }, [allPosts, range, tag, query]);

  // Keep the URL in sync with every filter change so deep links work and
  // the browser back button restores filter state.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (range === "all") url.searchParams.delete("range");
    else url.searchParams.set("range", range);
    const filtersSearch = buildFiltersSearch({ tag, query: query.trim() || null });
    url.searchParams.delete("tag");
    url.searchParams.delete("q");
    if (filtersSearch) {
      const params = new URLSearchParams(filtersSearch);
      params.forEach((v, k) => url.searchParams.set(k, v));
    }
    window.history.replaceState(null, "", url.toString());
  }, [range, tag, query]);

  function clearFilters() {
    setTag(null);
    setQuery("");
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
  const resultCountLabel = formatResultCount(
    visiblePosts.length,
    allPosts.length,
    activeFilterLabel,
    query.trim() || null,
  );

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

      {/* Topics by depth — a one-glance overview of every cluster, sorted
          by post count. Each pill links to the dedicated /blog/tag/{slug}
          page so we keep that SEO surface intact. */}
      <section
        className="bg-[color:var(--color-paper)] border-y border-border"
        aria-labelledby="topics-by-depth-heading"
      >
        <div className="container py-14 md:py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="eyebrow">Topics by depth</p>
              <h2
                id="topics-by-depth-heading"
                className="mt-3 font-display tracking-[-0.02em] text-[28px] sm:text-[34px] md:text-[40px] leading-[1.08] text-[color:var(--color-ink)]"
              >
                Where the editorial weight sits.
              </h2>
            </div>
            <p className="max-w-md text-[14.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
              {tagsByDepth.length} active topics, sorted by post count. The
              clusters at the top are where we have the deepest, most cross-linked
              coverage — a useful place to start when researching a workflow.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {tagsByDepth.map(({ tag: t, count }) => (
              <li key={t}>
                <Link
                  href={`/blog/tag/${t}`}
                  aria-label={`${formatTag(t)} — ${count} ${count === 1 ? "article" : "articles"}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-1.5 text-[13.5px] tracking-tight text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-ink)] transition-colors"
                >
                  <span>{formatTag(t)}</span>
                  <span
                    aria-hidden="true"
                    className="text-[12px] font-medium tabular-nums text-[color:var(--color-ink-muted)] group-hover:text-[color:var(--color-accent-ink)]"
                  >
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {yearArchives.length > 1 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] tracking-wider uppercase text-[color:var(--color-ink-muted)]">
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
          )}
        </div>
      </section>

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

            {/* Search input */}
            <div className="relative max-w-2xl">
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
                onClick={() => setTag(null)}
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
                    onClick={() => setTag(active ? null : t)}
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
                    onClick={() => setRange(opt.id)}
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
            <div className="grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-16">
              {visiblePosts.map((p, i) => (
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
          )}
        </div>
      </section>
    </SiteShell>
  );
}
