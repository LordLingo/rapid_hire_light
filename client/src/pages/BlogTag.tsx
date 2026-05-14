/*
  Editorial Calm — Blog tag archive
  Renders all posts that carry a single tag. Same card grid as the index
  for layout continuity. Routes here from `/blog/tag/:tag`.

  - SEO: dynamic <title>, meta description, canonical, and a CollectionPage
    + ItemList JSON-LD blob so the archive can be indexed as a structured
    collection of articles.
  - 404-style fallback when the tag is unknown so direct hits to a stale
    archive URL still resolve cleanly inside the SiteShell (no router 404
    flash).
*/
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import { useSeo } from "@/hooks/useSeo";
import {
  formatPublishedDate,
  formatTag,
  getAllTags,
  listPostsByTag,
} from "@/lib/blog";

export default function BlogTag() {
  const params = useParams<{ tag: string }>();
  const tag = (params?.tag ?? "").toLowerCase();
  const posts = useMemo(() => listPostsByTag(tag), [tag]);
  const known = useMemo(() => getAllTags().includes(tag), [tag]);
  const human = formatTag(tag || "Topic");
  const canonical =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/tag/${tag}`
      : `/blog/tag/${tag}`;

  useSeo({
    title: known
      ? `${human} — Blog | Rapid Hire Solutions`
      : "Topic not found — Blog | Rapid Hire Solutions",
    description: known
      ? `Articles tagged ${human} from the Rapid Hire Solutions team — practical guides on background screening, FCRA compliance, and the hiring workflow.`
      : "The requested topic could not be found. Browse all articles from the Rapid Hire Solutions blog.",
    canonical,
    ogType: "website",
    jsonLd: known
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${human} — Rapid Hire Solutions Blog`,
          url: canonical,
          mainEntity: {
            "@type": "ItemList",
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
          eyebrow="Blog — Topic"
          title={
            <>
              That topic{" "}
              <span className="italic font-normal text-[color:var(--color-accent-ink)]">
                doesn&apos;t exist.
              </span>
            </>
          }
          lede="The requested topic isn't part of the Rapid Hire Solutions blog. Browse every article from the index instead."
        />
        <section className="bg-white border-y border-border">
          <div className="container py-20 md:py-24">
            <Link
              href="/blog"
              className="ink-link inline-flex items-center gap-1.5 text-[14px]"
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
        eyebrow={`Topic — ${human}`}
        title={
          <>
            Writing tagged{" "}
            <span className="italic font-normal text-[color:var(--color-accent-ink)]">
              {human.toLowerCase()}.
            </span>
          </>
        }
        lede={`${posts.length} ${posts.length === 1 ? "article" : "articles"} from the Rapid Hire Solutions team on ${human.toLowerCase()} — practical, jurisdiction-aware writing for HR and operations teams.`}
      />

      <section className="bg-white border-y border-border">
        <div className="container py-20 md:py-24 grid grid-cols-12 gap-x-10 gap-y-10">
          <aside className="col-span-12 lg:col-span-3 reveal-on-scroll lg:sticky lg:top-28 lg:self-start">
            <Link
              href="/blog"
              className="ink-link inline-flex items-center gap-1.5 text-[14px]"
            >
              <ArrowLeft className="size-4" />
              Back to all articles
            </Link>
            <p className="mt-10 eyebrow">Other topics</p>
            <div className="mt-3 hairline" />
            <ul className="mt-6 space-y-2">
              {getAllTags()
                .filter((t) => t !== tag)
                .map((t) => (
                  <li key={t}>
                    <Link
                      href={`/blog/tag/${t}`}
                      className="text-[14px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors"
                    >
                      {formatTag(t)}
                    </Link>
                  </li>
                ))}
            </ul>
          </aside>

          <div className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-12 gap-x-8 gap-y-12 md:gap-y-16">
              {posts.map((p, i) => (
                <article
                  key={p.slug}
                  className={[
                    "reveal-on-scroll col-span-12",
                    i === 0 ? "md:col-span-12" : "md:col-span-6",
                  ].join(" ")}
                >
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <p className="eyebrow">
                      {p.tags[0]?.replace(/-/g, " ")}
                    </p>
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
                        i === 0 ? "text-[17px] max-w-3xl" : "text-[15.5px]",
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
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
