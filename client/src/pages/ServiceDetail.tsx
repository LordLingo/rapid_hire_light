/*
  §83 — Service Detail Page (/services/:slug)
  --------------------------------------------
  Dynamic page rendering one ServiceDetail entry from
  client/src/lib/serviceCatalog.ts. Modeled on the §81 ResourcesStatePage
  pattern: PageHero → narrative sections → resource cross-links → CtaBanner.

  Section rhythm:
    01 — paper        Hero (breadcrumb + eyebrow + title + lede + 3-stat band)
    02 — paper-soft   What's included (bullet list)
    03 — paper        What this catches / does NOT catch (two-column honesty)
    04 — paper-soft   Compliance considerations
    05 — paper        Industries we run this in (chips → /industries deep links)
    06 — paper-soft   Related reading (blog posts) + Sibling services
    07 — paper        FAQ accordion (2 items)
    + CtaBanner

  The detail page is the link target the §83 footer/blog/calculator
  re-points use; if a slug is missing, we 404 cleanly with a back-link to
  the /services hub.
*/
import * as React from "react";
import { Link, useRoute } from "wouter";
import { ArrowRight, ChevronRight, Check, X, ScrollText } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  findServiceBySlug,
  SERVICE_CATALOG,
} from "@/lib/serviceCatalog";
import { getPostBySlug } from "@/lib/blog";

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:slug");
  const slug = params?.slug ?? "";
  const service = findServiceBySlug(slug);

  useSeo({
    title: service
      ? `${service.title} — Rapid Hire Solutions`
      : "Service not found — Rapid Hire Solutions",
    description: service?.summary ?? "Background check service detail.",
    canonical: `https://www.rapidhiresolutions.com/services/${slug}`,
    ogType: "article",
    jsonLd: service
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.summary,
          provider: {
            "@type": "Organization",
            name: "Rapid Hire Solutions",
            url: "https://www.rapidhiresolutions.com",
          },
          areaServed: { "@type": "Country", name: "United States" },
          mainEntityOfPage: `https://www.rapidhiresolutions.com/services/${slug}`,
        }
      : undefined,
  });

  if (!service) {
    return (
      <SiteShell>
        <PageHero
          eyebrow="Services · Detail"
          title="Service not found"
          lede="The service you’re looking for isn’t published. Browse all services or return to the catalog hub."
        />
        <section className="container py-16">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[color:var(--color-brand-blue)] hover:underline"
          >
            <ChevronRight className="rotate-180 h-4 w-4" />
            Back to all services
          </Link>
        </section>
      </SiteShell>
    );
  }

  const Icon = service.icon;

  // Resolve related blog posts to (slug, title) pairs that are actually
  // present in the registry — defensive against slug typos.
  const relatedPosts = service.relatedBlogSlugs
    .map((s) => ({ slug: s, post: getPostBySlug(s) }))
    .filter((x) => x.post)
    .map((x) => ({ slug: x.slug, title: x.post!.title, excerpt: x.post!.excerpt }));

  // Resolve related services likewise.
  const relatedServices = service.relatedServiceSlugs
    .map((s) => findServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Pricing-calculator deep link (only when the service maps to an addon).
  const calcUrl = service.pricingAddonId
    ? `/pricing?adds=${service.pricingAddonId}#estimate`
    : "/pricing#estimate";

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow={`Services · ${service.tag}`}
        belowEyebrow={
          service.heroImage ? (
            // §118 — framing moves to a .hover-zoom-image
            // container so the image scales gently inside the rounded
            // clip on hover. Gated by prefers-reduced-motion.
            <div
              data-testid={`service-hero-image-frame-${service.slug}`}
              className="hover-zoom-image mt-5 w-full max-w-[260px] aspect-square rounded-2xl border border-border bg-white p-2 paper-shadow"
            >
              <img
                src={service.heroImage.url}
                alt={service.heroImage.alt}
                loading="lazy"
                decoding="async"
                data-testid={`service-hero-image-${service.slug}`}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
          ) : null
        }
        title={
          <>
            {service.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              {service.title.split(" ").slice(-1)[0]}.
            </span>
          </>
        }
        lede={service.hero}
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={`/contact?service=${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Talk to a screener
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={calcUrl}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              See in package pricing
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                SLA
              </p>
              <p className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                {service.sla}
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Median turnaround
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Price band
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                {service.priceBand}
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Relative to package
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5 flex flex-col items-start">
              <span className="grid place-items-center size-10 rounded-full border border-border text-[color:var(--color-accent-ink)]">
                <Icon className="size-4" strokeWidth={1.5} />
              </span>
              <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Topic
              </p>
              <p className="mt-1 font-display text-[16px] capitalize leading-tight text-[color:var(--color-ink)]">
                {service.topic.replace("-", " ")}
              </p>
            </div>
          </div>
        }
      />

      {/* Breadcrumb chip */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container -mt-6 pb-4 text-[12px] text-[color:var(--color-ink-soft)]">
          <Link href="/services" className="hover:underline">
            Services
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[color:var(--color-ink)]">{service.shortTitle}</span>
        </div>
      </section>

      {/* 02 — WHAT'S INCLUDED */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — What's included</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Every piece of the {service.shortTitle.toLowerCase()} report.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-3xl">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[15px] leading-snug text-[color:var(--color-ink-soft)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--color-accent-ink)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — CATCHES / DOES NOT CATCH (honesty cards) */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Honest about scope</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                What this check catches — and what it doesn't.
              </h2>
              <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-4xl">
                <div className="rounded-[14px] border border-border bg-white p-6">
                  <p className="eyebrow">What this catches</p>
                  <ul className="mt-4 space-y-2">
                    {service.catches.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[14px] leading-snug text-[color:var(--color-ink)]">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[14px] border border-border bg-[color:var(--color-paper-soft)] p-6">
                  <p className="eyebrow">What it does NOT catch</p>
                  <ul className="mt-4 space-y-2">
                    {service.doesNotCatch.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-[color:var(--color-ink-soft)]" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — COMPLIANCE */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Compliance</p>
              <div className="mt-3 hairline" />
              <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-[color:var(--color-ink-soft)]">
                <ScrollText className="h-4 w-4" />
                Reference, not legal advice
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The federal and state rules that govern this check.
              </h2>
              <ul className="mt-8 max-w-3xl space-y-3 text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                {service.compliance.map((c) => (
                  <li key={c} className="border-l-2 border-[color:var(--color-accent-ink)]/40 pl-4">
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href="/compliance"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
              >
                See the full compliance framework
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — INDUSTRIES */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Industries</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Where this check is mandatory or near-universal.
              </h2>
              <div className="mt-6 flex flex-wrap gap-2 max-w-3xl">
                {service.industries.map((ind) => (
                  <Link
                    key={ind}
                    href="/industries"
                    className="inline-flex items-center rounded-full border border-border bg-white px-4 py-1.5 text-[13px] text-[color:var(--color-ink)] hover:border-[color:var(--color-accent-ink)] hover:text-[color:var(--color-accent-ink)] transition"
                  >
                    {ind}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — RELATED READING + SIBLING SERVICES */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-12">
            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <p className="eyebrow">06 — Read deeper</p>
              <h3 className="mt-3 font-display text-[24px] leading-tight text-[color:var(--color-ink)]">
                Related from the blog
              </h3>
              <ul className="mt-6 space-y-4">
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/blog/${p.slug}`}
                        className="group block rounded-[12px] border border-border bg-white p-5 hover:border-[color:var(--color-accent-ink)] transition"
                      >
                        <p className="font-display text-[18px] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                          {p.title}
                        </p>
                        <p className="mt-2 text-[13.5px] leading-snug text-[color:var(--color-ink-soft)] line-clamp-2">
                          {p.excerpt}
                        </p>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-[14px] text-[color:var(--color-ink-soft)]">
                    No related posts yet — see the{" "}
                    <Link href="/blog" className="underline">
                      full blog
                    </Link>
                    .
                  </li>
                )}
              </ul>
            </div>

            <div className="col-span-12 lg:col-span-6 reveal-on-scroll">
              <p className="eyebrow">Often paired with</p>
              <h3 className="mt-3 font-display text-[24px] leading-tight text-[color:var(--color-ink)]">
                Other services teams run alongside
              </h3>
              <ul className="mt-6 grid gap-3">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex items-center justify-between rounded-[12px] border border-border bg-white p-5 hover:border-[color:var(--color-accent-ink)] transition"
                    >
                      <div>
                        <p className="font-display text-[17px] leading-tight text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                          {s.title}
                        </p>
                        <p className="mt-1 text-[12.5px] text-[color:var(--color-ink-soft)]">
                          {s.sla}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-accent-ink)]" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/services"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
              >
                See all {SERVICE_CATALOG.length} services
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — FAQ */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">07 — FAQ</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="max-w-3xl divide-y divide-border">
                {service.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group py-5"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                      <span className="font-display text-[18px] leading-tight text-[color:var(--color-ink)]">
                        {f.q}
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-[color:var(--color-ink-soft)] transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}
