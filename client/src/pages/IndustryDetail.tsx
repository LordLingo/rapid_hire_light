/*
  §83 — /industries/:slug detail page
  ------------------------------------
  Detail page for one of nine verticals (six existing + three new).
  Templated off ServiceDetail's structure for consistency: hero with
  eyebrow + lede + stat strip; "When to use this package" block;
  "Default checks we run" check list; "Regulatory posture" callout;
  "Related individual checks" cross-link card grid; closing CTA.

  Section rhythm:
    01 — paper        Hero
    02 — paper-soft   When to use this package
    03 — paper        Default checks we run
    04 — paper-soft   Regulatory posture (callout)
    05 — paper        Related individual checks
    + CtaBanner
*/
import { useRoute, Link } from "wouter";
import { useEffect } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Truck,
  Users,
  Landmark,
  ShoppingBag,
  Building2,
  Zap,
  Factory,
  GraduationCap,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import NotFound from "@/pages/NotFound";
import { useSeo } from "@/hooks/useSeo";
import { getIndustryBySlug, type Industry } from "@/lib/industryCatalog";

const ICON_MAP: Record<Industry["iconKey"], React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Truck,
  Users,
  Landmark,
  ShoppingBag,
  Building2,
  Zap,
  Factory,
  GraduationCap,
};

export default function IndustryDetail() {
  const [, params] = useRoute("/industries/:slug");
  const slug = params?.slug ?? "";
  const industry = getIndustryBySlug(slug);

  useSeo({
    title: industry
      ? `${industry.name} — Background Check Packages | Rapid Hire`
      : "Industries — Rapid Hire Solutions",
    description:
      industry?.blurb ?? "Industry-specific background check packages.",
    canonical: industry
      ? `https://www.rapidhiresolutions.com/industries/${industry.slug}`
      : "https://www.rapidhiresolutions.com/industries",
    ogType: "article",
  });

  // Scroll to top on slug change so the page reads from its hero.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!industry) {
    return <NotFound />;
  }

  const Icon = ICON_MAP[industry.iconKey];

  return (
    <SiteShell>
      <PageHero
        eyebrow={`Industries · ${industry.name}`}
        belowEyebrow={
          industry.heroImage ? (
            <div
              data-testid={`industry-detail-image-${industry.slug}`}
              className="hover-zoom-image mt-6 aspect-square w-full max-w-[16rem] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-[0_1px_2px_rgba(16,42,75,0.08),0_8px_24px_-12px_rgba(16,42,75,0.18)]"
            >
              <img
                src={industry.heroImage.url}
                alt={industry.heroImage.alt}
                loading="lazy"
                decoding="async"
                className="block h-full w-full rounded-xl object-cover"
              />
            </div>
          ) : undefined
        }
        title={
          <>
            <span className="block">{industry.name}</span>
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              {industry.accent}
            </span>{" "}
            screening, by default.
          </>
        }
        lede={industry.intro}
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact?topic=industry"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Get a tailored quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Browse all services
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            {industry.stats.map((s) => (
              <div key={s.label} className="bg-[color:var(--color-paper)] p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-[24px] leading-tight text-[color:var(--color-ink)]">
                  {s.value}
                </p>
                <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        }
      />

      {/* When to use */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                02 — When to use
              </p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Who this package is for.
              </h2>
              <p className="mt-6 max-w-3xl text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                {industry.whenToUse}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Default checks */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — What we run</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Default checks for the package.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-4 max-w-3xl">
                {industry.defaults.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-3 rounded-[12px] border border-border bg-white p-5"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[color:var(--color-accent-ink)]" />
                    <span className="text-[14px] leading-[1.65] text-[color:var(--color-ink)]">
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory posture callout */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" />
                04 — Posture
              </p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                {industry.regulatory.label}.
              </h2>
              <p className="mt-6 max-w-3xl text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                {industry.regulatory.body}
              </p>
              <p className="mt-6 max-w-3xl text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)]">
                {industry.posture}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related checks */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Components</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The individual checks behind this package.
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {industry.relatedChecks.map((c) => (
                  <Link
                    key={c.slug}
                    href={c.slug}
                    className="group flex items-center justify-between rounded-[12px] border border-border bg-white p-5 hover:border-[color:var(--color-accent-halo)] hover:bg-[color:var(--color-tint)] transition-colors"
                  >
                    <span className="font-display text-[16px] text-[color:var(--color-ink)]">
                      {c.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[color:var(--color-ink-soft)] group-hover:text-[color:var(--color-accent-ink)] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
