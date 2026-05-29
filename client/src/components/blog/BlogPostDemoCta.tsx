/**
 * BlogPostDemoCta — universal "Request a Demo" CTA rendered at the very
 * bottom of every /blog/{slug} detail page, AFTER the archetype-tuned
 * BlogPostCta (see ./BlogPostCta.tsx).
 *
 * Why a second CTA?
 *   - The archetype CTA is tuned for *research-mode* readers (default
 *     archetype = "Get a quote in 24 hours", healthcare = "Talk to a
 *     specialist", etc.). It serves the reader who landed on the post
 *     looking for an answer.
 *   - This second CTA targets *higher-intent* readers — the ones who
 *     finished the article AND scrolled past the archetype CTA without
 *     converting. For them, "Request a Demo" is the right ask: they want
 *     to see the product in action before committing.
 *   - Visual differentiation (dark ink card vs. paper-soft archetype card)
 *     prevents the two CTAs from reading as duplicate noise.
 *
 * Stable testids:
 *   - blog-demo-cta (root)
 *   - blog-demo-cta-headline
 *   - blog-demo-cta-primary
 *   - blog-demo-cta-secondary
 *
 * Attribution: the primary CTA href carries
 *   ?source=blog-demo-cta&slug={slug}&note=Interested+in+a+demo
 * so the /get-a-quote inbox routing can immediately tag the lead as a
 * "demo from blog" inquiry, distinct from the archetype CTA traffic.
 */
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog";

export type BlogPostDemoCtaProps = {
  post: Pick<BlogPost, "slug" | "title">;
};

/**
 * Build the canonical /get-a-quote href for the demo CTA. Pure function
 * so the regression spec can pin it without rendering React.
 */
export function buildBlogDemoHref(slug: string): string {
  const params = new URLSearchParams({
    source: "blog-demo-cta",
    slug,
    note: "Interested in a demo",
  });
  return `/get-a-quote?${params.toString()}`;
}

export function BlogPostDemoCta({ post }: BlogPostDemoCtaProps) {
  const primaryHref = buildBlogDemoHref(post.slug);

  return (
    <aside
      data-testid="blog-demo-cta"
      className="relative mt-10 overflow-hidden rounded-[20px] bg-[color:var(--color-ink)] p-8 md:p-10"
    >
      {/* Brand-blue halo glow in the upper-right — same treatment used in
          the §202 Resources Case Studies CTA so the two dark CTAs read
          as a deliberate brand pattern, not one-off styling. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-[320px] w-[320px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.62 0.205 256 / 0.55), transparent 70%)",
        }}
      />
      {/* Sky-halo top hairline echoing the footer treatment. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.85 0.12 250 / 0.5), transparent)",
        }}
      />

      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:oklch(0.85_0.12_250)]">
            Ready to switch?
          </p>
          <h2
            data-testid="blog-demo-cta-headline"
            className="mt-3 font-display text-[28px] leading-tight text-white md:text-[34px]"
          >
            Ready to see Rapid Hire in action?
          </h2>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-white/75">
            Book a 20-minute walkthrough of the candidate experience, the
            adjudication console, and the integrations your ATS already
            supports. No deck, just the product.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 md:flex-col md:items-stretch md:gap-3">
          <Link
            href={primaryHref}
            data-testid="blog-demo-cta-primary"
            className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14.5px] font-semibold text-[color:var(--color-ink)] hover:bg-white/90"
          >
            Request a Demo
            <ArrowUpRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            data-testid="blog-demo-cta-secondary"
            className="inline-flex items-center justify-center gap-1 text-[13px] font-medium text-white/70 hover:text-white md:justify-start"
          >
            Get a written quote instead
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default BlogPostDemoCta;
