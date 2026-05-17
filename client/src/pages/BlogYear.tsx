/*
  Editorial Calm — Blog year-in-review hub

  Routes from `/blog/year/:year` and shows all posts published in that year,
  grouped by quarter. Two purposes:

  1. SEO — gives Google two strong, indexable hub pages (one per active year)
     that surface the editorial cadence, with internal links into every post.
  2. Reader UX — visitors who want to scan "what did this team publish in
     2025?" can do so without paging through the index.

  We treat the year as a stable, time-bound archive: canonical URL is
  /blog/year/<year>, JSON-LD emits a CollectionPage with ItemList of articles,
  and the page links back to /blog so it doesn't become a navigation cul-de-sac.
*/
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
import {
  formatPublishedDate,
  groupPostsByQuarter,
  listPostsByYear,
  listPostYears,
} from "@/lib/blog";

export default function BlogYear() {
  const params = useParams<{ year: string }>();
  const yearStr = params?.year ?? "";
  const year = Number(yearStr);
  const validYear = /^\d{4}$/.test(yearStr) && !Number.isNaN(year);
  const posts = useMemo(
    () => (validYear ? listPostsByYear(year) : []),
    [validYear, year],
  );
  const knownYears = useMemo(() => listPostYears(), []);
  const known = validYear && knownYears.includes(year);
  const groups = useMemo(() => groupPostsByQuarter(posts), [posts]);

  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/year/${yearStr}`
      : `/blog/year/${yearStr}`;

  useSeo({
    title: known
      ? `${year} in review — Blog | Rapid Hire Solutions`
      : "Year not found — Blog | Rapid Hire Solutions",
    description: known
      ? `Every article we published on background screening, FCRA compliance, and the hiring workflow in ${year}, grouped by quarter.`
      : "The requested year archive could not be found. Browse all articles from the Rapid Hire Solutions blog.",
    canonical,
    ogType: "website",
    jsonLd: known
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${year} blog archive — Rapid Hire Solutions`,
          url: canonical,
          isPartOf: { "@type": "Blog", name: "Rapid Hire Solutions Blog" },
          mainEntity: {
            "@type": "ItemList",
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            numberOfItems: posts.length,
            itemListElement: posts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/blog/${p.slug}`,
              name: p.title,
            })),
          },
        }
      : undefined,
  });

  if (!known) {
    return (
      <SiteShell>
        <PageHero
          eyebrow="Archive"
          title="Year not found"
          lede="That year archive does not exist. Browse all articles from the blog instead."
        />
        <section className="bg-[color:var(--color-paper)] py-12">
          <div className="container">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--color-accent-ink)]"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Year in review"
        title={`${year} in review`}
        lede={`Every article we published in ${year} on background screening, FCRA compliance, and the hiring workflow — grouped by quarter so the editorial cadence reads at a glance.`}
      />

      <section className="bg-[color:var(--color-paper)] py-12 md:py-16">
        <div className="container">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--color-accent-ink)]"
          >
            <ArrowLeft className="size-4" />
            Back to all articles
          </Link>

          {/* Year switcher: lets crawlers (and humans) reach the other archives. */}
          {knownYears.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {knownYears.map((y) => (
                <Link
                  key={y}
                  href={`/blog/year/${y}`}
                  className={[
                    "rounded-full border px-3 py-1 text-[13px] tracking-wider",
                    y === year
                      ? "border-[color:var(--color-accent-ink)] bg-[color:var(--color-accent-ink)] text-[color:var(--color-paper)]"
                      : "border-[color:var(--color-ink-muted)]/30 text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent-ink)]",
                  ].join(" ")}
                >
                  {y}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 space-y-16">
            {groups
              .filter((g) => g.posts.length > 0)
              .map((g) => (
                <div key={g.quarter}>
                  <p className="eyebrow">{g.label}</p>
                  <div className="mt-3 hairline" />
                  <ul className="mt-6 divide-y divide-[color:var(--color-ink-muted)]/15">
                    {g.posts.map((p) => (
                      <li key={p.slug} className="py-5">
                        <Link
                          href={`/blog/${p.slug}`}
                          className="group flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between"
                        >
                          <div className="md:max-w-3xl">
                            <p className="eyebrow text-[11.5px]">
                              {p.tags[0]?.replace(/-/g, " ")}
                            </p>
                            <h2 className="mt-2 font-display tracking-[-0.02em] text-[22px] sm:text-[26px] leading-[1.15] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)] transition-colors">
                              {p.title}
                            </h2>
                          </div>
                          <p className="flex items-center gap-2 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)] md:shrink-0">
                            <span>{formatPublishedDate(p.publishedAt)}</span>
                            <span aria-hidden="true" className="text-[color:var(--color-ink-muted)]/50">·</span>
                            <span aria-label={`${p.readingMinutes} minute read`}>{p.readingMinutes} min</span>
                            <ArrowUpRight className="size-4 text-[color:var(--color-accent-ink)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          <p className="mt-12 text-[14px] text-[color:var(--color-ink-muted)]">
            {posts.length} article{posts.length === 1 ? "" : "s"} published in {year}.
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
