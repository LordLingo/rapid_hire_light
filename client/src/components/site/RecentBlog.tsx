/*
  Recent from the blog — homepage rail.
  Surfaces the 3 newest posts (by publishedAt desc, then by lastmod desc as
  tiebreaker) so non-blog visitors get a hint of editorial cadence and the
  topical-cluster strength reads from the front door. Uses Updated <date> pill
  when lastmod is meaningfully newer than publishedAt.
*/
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import {
  formatPublishedDate,
  getPostLastmod,
  isRecentlyUpdated,
  listPosts,
} from "@/lib/blog";

export default function RecentBlog() {
  const recent = listPosts().slice(0, 3);
  if (recent.length === 0) return null;
  return (
    <section className="bg-[color:var(--color-paper)] py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4 lg:col-span-3">
            <p className="eyebrow">From the blog</p>
            <div className="mt-3 hairline" />
            <h2 className="mt-6 font-display tracking-[-0.02em] text-[34px] leading-[1.05] text-[color:var(--color-ink)]">
              Recently published.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-[color:var(--color-ink-muted)]">
              Background screening, FCRA compliance, and the hiring workflow — in plain
              language, written for the people who actually run the program.
            </p>
            <div className="mt-6">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-[13px] uppercase tracking-wider text-[color:var(--color-accent-ink)]"
                aria-label="Browse all blog posts"
              >
                Browse all articles
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
          <ul className="col-span-12 grid grid-cols-1 gap-6 md:col-span-8 md:grid-cols-3 lg:col-span-9">
            {recent.map((p) => (
              <li
                key={p.slug}
                className="group flex flex-col rounded-[18px] border border-[color:var(--color-ink-muted)]/15 bg-white/60 p-6 transition-colors hover:border-[color:var(--color-accent-ink)]/40"
              >
                <Link
                  href={`/blog/${p.slug}`}
                  className="flex h-full flex-col"
                  aria-label={p.title}
                >
                  <p className="eyebrow text-[11px]">
                    {p.tags[0]?.replace(/-/g, " ")}
                  </p>
                  <h3 className="mt-3 font-display text-[20px] leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                    {p.title}
                  </h3>
                  <div className="mt-auto pt-6">
                    <div className="hairline" />
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      <span>{formatPublishedDate(p.publishedAt)}</span>
                      <span aria-hidden="true" className="text-[color:var(--color-ink-muted)]/50">·</span>
                      <span aria-label={`${p.readingMinutes} minute read`}>{p.readingMinutes} min</span>
                      {isRecentlyUpdated(p) && (
                        <span
                          className="ml-1 inline-flex items-center rounded-full border border-[color:var(--color-accent-ink)]/30 bg-[color:var(--color-accent-ink)]/8 px-2 py-0.5 text-[10px] tracking-wider text-[color:var(--color-accent-ink)]"
                          aria-label={`Updated ${formatPublishedDate(getPostLastmod(p.slug))}`}
                        >
                          Updated {formatPublishedDate(getPostLastmod(p.slug))}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
