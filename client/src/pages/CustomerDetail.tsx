/*
  §83 — /customers/:slug case study detail
  -----------------------------------------
  Renders one CaseStudy entry from caseStudies.ts. Uses the same section
  rhythm as ServiceDetail (PageHero → outcome stats → quote → timeline →
  services-deployed cross-link → CtaBanner) so the marketing site reads
  as one coherent body of work.

  If a slug is missing we 404 cleanly with a back-link to /customers.
*/
import { Link, useRoute } from "wouter";
import { ArrowRight, ChevronRight, Quote } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { findCaseStudyBySlug } from "@/lib/caseStudies";
import { findServiceBySlug } from "@/lib/serviceCatalog";
import { useSeo } from "@/hooks/useSeo";

export default function CustomerDetail() {
  const [, params] = useRoute("/customers/:slug");
  const slug = params?.slug ?? "";
  const study = findCaseStudyBySlug(slug);

  useSeo({
    title: study
      ? `${study.brand} — Customer Story — Rapid Hire Solutions`
      : "Customer story not found — Rapid Hire Solutions",
    description: study?.lede ?? "Customer case study.",
    canonical: `https://www.rapidhiresolutions.com/customers/${slug}`,
    ogType: "article",
    jsonLd: study
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: study.headline,
          description: study.lede,
          author: { "@type": "Organization", name: "Rapid Hire Solutions" },
          publisher: { "@type": "Organization", name: "Rapid Hire Solutions" },
          datePublished: study.startedAt,
          mainEntityOfPage: `https://www.rapidhiresolutions.com/customers/${slug}`,
        }
      : undefined,
  });

  if (!study) {
    return (
      <SiteShell>
        <PageHero
          eyebrow="Customers"
          title="Customer story not found"
          lede="The case study you're looking for isn't published. Browse the index."
        />
        <section className="container py-16">
          <Link
            href="/customers"
            className="inline-flex items-center gap-2 text-[color:var(--color-brand-blue)] hover:underline"
          >
            <ChevronRight className="rotate-180 h-4 w-4" />
            Back to all customers
          </Link>
        </section>
      </SiteShell>
    );
  }

  // Resolve services-deployed slugs to their catalog entries for cross-links.
  const services = study.servicesDeployed
    .map((s) => findServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <SiteShell>
      <PageHero
        eyebrow={`Customer story · ${study.industry}`}
        title={study.headline}
        lede={study.lede}
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact?topic=references"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Request a reference call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              All customer stories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            {study.stats.map((s) => (
              <div key={s.label} className="bg-[color:var(--color-paper)] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                  {s.value}
                </p>
                <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                  {s.context}
                </p>
              </div>
            ))}
          </div>
        }
      />

      {/* Breadcrumb */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container -mt-6 pb-4 text-[12px] text-[color:var(--color-ink-soft)]">
          <Link href="/customers" className="hover:underline">
            Customers
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[color:var(--color-ink)]">{study.brand}</span>
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="mx-auto h-7 w-7 text-[color:var(--color-accent-ink)]" />
            <blockquote className="mt-6 font-display text-[24px] sm:text-[30px] md:text-[36px] leading-[1.2] tracking-[-0.01em] text-[color:var(--color-ink)]">
              "{study.quote.text}"
            </blockquote>
            <p className="mt-6 text-[13px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
              {study.quote.attribution}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">Timeline</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                How the engagement actually rolled out.
              </h2>
              <ol className="mt-8 max-w-3xl divide-y divide-border">
                {study.timeline.map((p) => (
                  <li key={p.phase} className="py-6 grid grid-cols-12 gap-x-6">
                    <div className="col-span-12 sm:col-span-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                        {p.phase}
                      </p>
                      <p className="mt-2 font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                        {p.head}
                      </p>
                    </div>
                    <p className="col-span-12 sm:col-span-9 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {p.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Services deployed */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">Services deployed</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The exact checks running on every {study.brand} hire.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl">
                {services.map((s) => (
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
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}
