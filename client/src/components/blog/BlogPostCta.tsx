/**
 * BlogPostCta — universal closing CTA for every /blog/{slug} detail page.
 *
 * Looks up the right archetype via matchArchetype(post) and renders:
 *   - eyebrow pill
 *   - headline + supporting body
 *   - primary CTA (filled brand-accent button) with attribution params
 *   - optional secondary CTA (low-emphasis link)
 *
 * Stable testids: blog-cta, blog-cta-eyebrow, blog-cta-headline,
 * blog-cta-body, blog-cta-primary, blog-cta-secondary. Root carries
 * data-archetype="{id}" so tests + analytics can target each archetype.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { matchArchetype } from "@/lib/blogCta";

export type BlogPostCtaProps = {
  post: Pick<BlogPost, "slug" | "tags" | "title">;
};

export function BlogPostCta({ post }: BlogPostCtaProps) {
  const archetype = matchArchetype(post);
  const primaryHref = archetype.primary.hrefBuilder(post as BlogPost, archetype.id);

  return (
    <aside
      data-testid="blog-cta"
      data-archetype={archetype.id}
      className="mt-14 rounded-[20px] border border-border bg-[color:var(--color-paper-soft)] p-8 md:p-10"
    >
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p
            data-testid="blog-cta-eyebrow"
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-accent-ink)]"
          >
            {archetype.eyebrow}
          </p>
          <h2
            data-testid="blog-cta-headline"
            className="mt-3 font-display text-[28px] leading-tight text-[color:var(--color-ink)] md:text-[32px]"
          >
            {archetype.headline}
          </h2>
          {archetype.body && (
            <p
              data-testid="blog-cta-body"
              className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-[color:var(--color-ink-muted)]"
            >
              {archetype.body}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-stretch md:gap-2">
          <Link
            href={primaryHref}
            data-testid="blog-cta-primary"
            data-archetype-primary={archetype.id}
            className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-accent-ink)] px-6 py-3 text-[14px] font-medium text-white hover:bg-[color:var(--color-accent-ink-strong)]"
          >
            {archetype.primary.label}
            <ArrowUpRight className="size-4" />
          </Link>
          {archetype.secondary && (
            <Link
              href={archetype.secondary.href}
              data-testid="blog-cta-secondary"
              className="inline-flex items-center justify-center gap-1 text-[13px] font-medium text-[color:var(--color-accent-ink)] hover:underline md:justify-start"
            >
              {archetype.secondary.label}
              <ArrowUpRight className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

export default BlogPostCta;
