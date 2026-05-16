/*
  §83 — /customers index page
  ----------------------------
  Surfaces the three first-batch case studies in CASE_STUDIES. The page
  hub mirrors the editorial cadence of /resources/white-papers (eyebrow,
  hero, card grid, deep-link CTAs) so the marketing site stays visually
  consistent. Each card opens its detail page at /customers/:slug.

  Why split out from /about: case studies are a sales-stage asset, not a
  brand-stage one. Buyers want to read three stories from peers, not a
  "trusted by" wordmark wall — so giving the stories their own URL +
  index page is what every top-5 BGC competitor does.
*/
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { useSeo } from "@/hooks/useSeo";

export default function Customers() {
  useSeo({
    title: "Customer Stories — Rapid Hire Solutions",
    description:
      "Three case studies from Rapid Hire Solutions customers — Frito-Lay (fleet), H&R Block (seasonal), and TaylorMade (R&D). Outcomes, timelines, and services deployed.",
    canonical: "https://www.rapidhiresolutions.com/customers",
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Customers"
        title={
          <>
            Three teams. Three different{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              hiring problems.
            </span>
          </>
        }
        lede="Fleet onboarding at Frito-Lay, tax-season hiring scaled at H&R Block, and R&D credentialing at TaylorMade. Each case study walks through the timeline, the services deployed, and the outcome — written by the team that ran it, not by marketing."
      />

      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <ul className="grid md:grid-cols-3 gap-6">
            {CASE_STUDIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/customers/${c.slug}`}
                  className="group block h-full rounded-[16px] border border-border bg-white p-6 paper-shadow hover:border-[color:var(--color-accent-ink)] transition"
                >
                  <p className="eyebrow">{c.industry}</p>
                  <p className="mt-3 font-display text-[24px] leading-tight tracking-[-0.01em] text-[color:var(--color-ink)] group-hover:text-[color:var(--color-accent-ink)]">
                    {c.brand}
                  </p>
                  <p className="mt-4 text-[14.5px] leading-snug text-[color:var(--color-ink-soft)] line-clamp-3">
                    {c.lede}
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10 rounded-md overflow-hidden">
                    {c.stats.map((s) => (
                      <div
                        key={s.label}
                        className="bg-[color:var(--color-paper)] p-3"
                      >
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                          {s.label}
                        </p>
                        <p className="mt-1 font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-[color:var(--color-brand-blue)]">
                    Read the story
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-[16px] border border-border bg-white p-8 paper-shadow grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-9">
              <p className="eyebrow flex items-center gap-2">
                <Quote className="h-3.5 w-3.5" />
                Procurement notes
              </p>
              <p className="mt-3 text-[15.5px] leading-[1.7] text-[color:var(--color-ink)]">
                Each case study lists the actual services deployed, the
                implementation timeline, and references against industry
                averages. We're happy to make on-the-record reference
                introductions for shortlist evaluations.
              </p>
            </div>
            <div className="sm:col-span-3 sm:justify-self-end">
              <Link
                href="/contact?topic=references"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
              >
                Request reference
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}
