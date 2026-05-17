/*
  Editorial Calm — Blog post detail
  - Hero: numbered eyebrow + tag, large display title, dateline + reading time.
  - Article body via PostBody (custom mini-Markdown renderer).
  - "Related articles" rail at the bottom + back link to /blog.
  - On-page SEO: dynamic title, meta description, canonical, BlogPosting JSON-LD.
*/
import { useMemo } from "react";
import { Link, useRoute } from "wouter";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import NotFound from "@/pages/NotFound";
import { useSeo } from "@/hooks/useSeo";
import { PostBody, getHeadings } from "@/components/site/PostBody";
import PostToc from "@/components/site/PostToc";
import ShareButtons from "@/components/site/ShareButtons";
import ReadingProgressBar from "@/components/site/ReadingProgressBar";
import {
  formatPublishedDate,
  getPostBySlug,
  getPostLastmod,
  isRecentlyUpdated,
  relatedPosts,
} from "@/lib/blog";

export default function BlogPost() {
  const [, params] = useRoute<{ slug: string }>("/blog/:slug");
  const slug = params?.slug ?? "";
  const post = getPostBySlug(slug);

  // Always render even when post is missing — falls through to NotFound.
  // Hooks below assume `post` exists, so we early-return.
  if (!post) {
    return <NotFound />;
  }

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${post.slug}`
      : `/blog/${post.slug}`;

  // Dynamic Open Graph image: a 1200×630 SVG card built server-side from
  // shared/blog-og.json. Falls back to the post.cover when the post explicitly
  // ships its own social image. Absolute URL is required by OG crawlers.
  const ogImage =
    post.cover ??
    (typeof window !== "undefined"
      ? `${window.location.origin}/api/og/blog/${post.slug}.svg`
      : `/api/og/blog/${post.slug}.svg`);

  // dateModified comes from shared/blog-meta.json's lastmod field, which is
  // refreshed every time a post body or metadata is touched. When it equals
  // publishedAt (the typical case), Google treats the article as un-revised;
  // when it diverges (e.g., we re-ran a registration script after editing),
  // the rich-result tester surfaces the freshness signal correctly.
  const lastmod = getPostLastmod(post.slug) || post.publishedAt;

  // BlogPosting JSON-LD with the fields Google's rich-result tester expects.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: lastmod,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "Rapid Hire Solutions",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    articleSection: post.tags[0]?.replace(/-/g, " "),
    wordCount: post.body.split(/\s+/).filter(Boolean).length,
    inLanguage: "en-US",
    image: [ogImage],
  };

  useSeo({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription,
    canonical: url,
    ogType: "article",
    image: ogImage,
    jsonLd,
  });

  const related = relatedPosts(post.slug, 3);
  // §47: derive the on-page TOC from the same parsed body that
  // PostBody renders. Memoized because the markdown body is stable
  // for the lifetime of this component but parsing isn't free.
  const headings = useMemo(() => getHeadings(post.body), [post.body]);

  return (
    <SiteShell>
      <ReadingProgressBar />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--color-paper)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.85 0.12 250 / 0.6), transparent 70%)",
          }}
        />
        <div className="container relative pt-16 md:pt-20 pb-12 md:pb-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] tracking-tight text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] transition-colors"
          >
            <ArrowLeft className="size-4" />
            All articles
          </Link>
          <div className="mt-10 grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">{post.tags[0]?.replace(/-/g, " ")}</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                {formatPublishedDate(post.publishedAt)}
                {isRecentlyUpdated(post) && (
                  <span className="ml-2 inline-flex items-center rounded-full border border-[color:var(--color-accent-ink)]/30 bg-[color:var(--color-accent-ink)]/8 px-2 py-0.5 text-[10.5px] tracking-wider text-[color:var(--color-accent-ink)]">
                    Updated {formatPublishedDate(lastmod)}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                {post.readingMinutes} min read
              </p>
              <p className="mt-1 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                {post.author}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] leading-[1.05] tracking-[-0.025em] text-[color:var(--color-ink)] max-w-4xl">
                {post.title}
              </h1>
              <p className="mt-7 max-w-2xl text-[16.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Optional hero cover image — alt text mirrors the post's primary keywords. */}
      {post.cover && (
        <section className="bg-[color:var(--color-paper)]">
          <div className="container pb-12 md:pb-16">
            <div className="reveal-on-scroll overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <img
                src={post.cover}
                alt={post.coverAlt ?? post.title}
                className="block w-full h-auto"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </section>
      )}

      {/* Body */}
      <section className="bg-white border-y border-border">
        <div className="container py-16 md:py-24 grid grid-cols-12 gap-x-10">
          {/* §47: on-page TOC occupies the previously-empty left rail
              on desktop. PostToc itself returns null for short posts
              (< 3 H2s), and is hidden on < lg breakpoints, so this
              wrapper is safe to render unconditionally. */}
          <div className="hidden lg:block lg:col-span-3">
            <PostToc headings={headings} />
          </div>
          <div className="col-span-12 lg:col-span-9 max-w-3xl">
            <PostBody markdown={post.body} />

            {/* Share */}
            <ShareButtons url={url} title={post.title} />

            {/* Tag chips */}
            <div className="mt-14 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 text-[12px] uppercase tracking-wider text-[color:var(--color-ink-muted)]"
                >
                  {t.replace(/-/g, " ")}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 border-t border-border pt-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <p className="font-display text-[22px] leading-snug text-[color:var(--color-ink)]">
                Ready to talk through your screening workflow?
              </p>
              <Link
                href="/contact"
                className="btn-press inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
              >
                Talk to our team
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[color:var(--color-paper)]">
          <div className="container py-20 md:py-24">
            <div className="grid grid-cols-12 gap-x-10 items-end">
              <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
                <p className="eyebrow">More from the team</p>
                <div className="mt-3 hairline" />
              </div>
              <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
                <h2 className="font-display text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                  Keep reading
                </h2>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-12 gap-x-8 gap-y-10">
              {related.map((p) => (
                <article
                  key={p.slug}
                  className="reveal-on-scroll col-span-12 md:col-span-4"
                >
                  <Link href={`/blog/${p.slug}`} className="group block">
                    <p className="eyebrow">{p.tags[0]?.replace(/-/g, " ")}</p>
                    <div className="mt-3 hairline" />
                    <h3 className="mt-5 font-display text-[22px] leading-snug tracking-[-0.01em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[12.5px] uppercase tracking-wider text-[color:var(--color-ink-muted)]">
                      {formatPublishedDate(p.publishedAt)} ·{" "}
                      {p.readingMinutes} min
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
