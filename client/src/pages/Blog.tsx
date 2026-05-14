/*
  Editorial Calm — Blog index
  - PageHero with eyebrow "09 — Blog" + italic accent.
  - Grid of post cards: eyebrow tag, large display title, dateline + read time,
    excerpt, "Read article" arrow link.
  - Tag filter rail on the left so the page stays usable past 30+ posts.
  - On-page SEO: dynamic title, meta description, canonical, Blog JSON-LD.
*/
import { useMemo } from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
import {
  listPosts,
  getAllTags,
  formatPublishedDate,
  formatTag,
} from "@/lib/blog";

export default function Blog() {
  const allPosts = useMemo(() => listPosts(), []);
  const allTags = useMemo(() => getAllTags(), []);
  const visiblePosts = allPosts;

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

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-24 grid grid-cols-12 gap-x-10 gap-y-10">
          {/* Tag rail */}
          <aside className="col-span-12 lg:col-span-3 reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Topics</p>
            <div className="mt-3 hairline" />
            <ul className="mt-6 space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-[14px] tracking-tight text-[color:var(--color-ink)] font-medium"
                >
                  All articles
                  <span className="ml-2 text-[color:var(--color-ink-muted)] font-normal">
                    ({allPosts.length})
                  </span>
                </Link>
              </li>
              {allTags.map((t) => {
                const count = allPosts.filter((p) => p.tags.includes(t)).length;
                return (
                  <li key={t}>
                    <Link
                      href={`/blog/tag/${t}`}
                      className="text-[14px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors"
                    >
                      {formatTag(t)}
                      <span className="ml-2 text-[color:var(--color-ink-muted)]">
                        ({count})
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Post grid */}
          <div className="col-span-12 lg:col-span-9">
            {visiblePosts.length === 0 ? (
              <p className="text-[color:var(--color-ink-soft)]">
                No posts under this topic yet.
              </p>
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
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block"
                    >
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
                      <p className="mt-4 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                        {formatPublishedDate(p.publishedAt)} ·{" "}
                        {p.readingMinutes} min read
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
        </div>
      </section>
    </SiteShell>
  );
}
