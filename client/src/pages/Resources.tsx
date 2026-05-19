/*
  Resources — Hub Index (§80)
  ---------------------------
  Lightweight landing page for the Resources section. Lists the
  pillar references (Ban the Box matrix), the practitioner tools
  (24-pt checklist, 15-min audit, trust & verification), and a
  rail to the latest blog posts.

  Section rhythm:
    01 — paper        Hero
    02 — paper-soft   Pillar references (1-up large card grid)
    03 — paper        Practitioner tools (3-up grid)
    04 — paper-soft   Latest from the blog (3-up rail)
    + CtaBanner
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ScrollText,
  ClipboardList,
  CalendarCheck2,
  ShieldCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import { listPosts } from "@/lib/blog";

const PILLARS: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}[] = [
  {
    eyebrow: "Pillar reference",
    title: "Background checks by state",
    body:
      "A 50-state directory and 13 deep-dive state guides — lookback windows, ban-the-box scope, salary-history rules, cannabis treatment, and statute citations for every state.",
    href: "/resources/background-checks-by-state",
  },
  {
    eyebrow: "Pillar reference",
    title: "Ban the Box laws by jurisdiction",
    body:
      "The 40-row matrix our compliance team operates from. Sixteen states, DC, the U.S. Virgin Islands, and twenty-plus cities and counties — what each requires and when it kicks in.",
    href: "/resources/ban-the-box",
  },
  {
    eyebrow: "Pillar reference",
    title: "Marijuana laws by state",
    body:
      "State-by-state cannabis testing, off-duty protections, and safety-sensitive carve-outs — with the 2024 statute changes flagged for fast review.",
    href: "/resources/marijuana-laws",
  },
  // §152: K-12 compliance guide — vertical reference linked from the
  // K-12 blog CTA archetype and from the school-district companion post.
  {
    eyebrow: "Vertical guide",
    title: "K-12 compliance guide",
    body:
      "State-by-state K-12 employment screening reference — fingerprint mandates, re-print cadence, statutory tier handling, and the federal layer (Adam Walsh, ESSA §8546, FCRA).",
    href: "/resources/k12-compliance-guide",
  },
  {
    eyebrow: "Living feed",
    title: "Legislative updates",
    body:
      "Federal, state, and municipal updates with citations, effective dates, and the concrete employer action each one triggers.",
    href: "/resources/legislative-updates",
  },
  {
    eyebrow: "Library",
    title: "White papers",
    body:
      "Long-form, source-anchored references for compliance, operations, industry programs, and candidate experience.",
    href: "/resources/white-papers",
  },
  // §83: Annual benchmark report — same surface every top-5 BGC competitor publishes.
  {
    eyebrow: "Annual report",
    title: "Background check benchmarks 2026",
    body:
      "TAT, dispute rates, compliance findings, and YoY deltas across four sectors — anchored on the rapid-hire client base and triangulated against PBSA + SHRM.",
    href: "/resources/benchmarks",
  },
  // §83: A–Z glossary closes the long-tail "what is X" SEO gap.
  {
    eyebrow: "Glossary",
    title: "Background-check glossary",
    body:
      "A–Z definitions for the terms that show up across FCRA paperwork, DOT/healthcare/finance hiring, and procurement contracts.",
    href: "/resources/glossary",
  },
];

/* §83 — resource-type filter strip rendered above the pillar grid.
   Pure visual filter (no JS state); each pill is a fragment anchor so
   it scrolls the matching pillar to the top of the viewport. */
const RESOURCE_TYPES: { id: string; label: string; href: string }[] = [
  { id: "all", label: "All resources", href: "#pillars" },
  { id: "matrix", label: "State matrices", href: "/resources/background-checks-by-state" },
  { id: "papers", label: "White papers", href: "/resources/white-papers" },
  { id: "benchmarks", label: "Benchmarks", href: "/resources/benchmarks" },
  { id: "glossary", label: "Glossary", href: "/resources/glossary" },
  { id: "checklist", label: "Checklists", href: "/compliance/checklist" },
  { id: "updates", label: "Legislative updates", href: "/resources/legislative-updates" },
  { id: "blog", label: "Blog", href: "/blog" },
];

const TOOLS: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
}[] = [
  {
    icon: ClipboardList,
    title: "24-point compliance checklist",
    body:
      "An auditor-style scorecard that walks every pre-employment screening control your team should be able to demonstrate.",
    href: "/compliance/checklist",
  },
  {
    icon: CalendarCheck2,
    title: "Free 15-minute audit",
    body:
      "Bring your current consent forms, adverse-action letters, and ATS screen — we tell you which jurisdictions you're already aligned with and which need a fix.",
    href: "/compliance/audit",
  },
  {
    icon: ShieldCheck,
    title: "Trust &amp; verification",
    body:
      "How candidates verify a Rapid Hire request is real — and how employers verify a Rapid Hire report is authentic.",
    href: "/trust",
  },
];

export default function Resources() {
  useSeo({
    title:
      "Resources — fair-chance hiring guides and compliance tools · Rapid Hire Solutions",
    description:
      "Pillar references, compliance checklists, and field guides Rapid Hire's team uses every day. Start with the 40-row Ban the Box matrix or the free 15-minute audit.",
    canonical: "https://www.rapidhiresolutions.com/resources",
    ogType: "website",
  });

  // Pull the three most recent blog posts for the rail.
  const recentPosts = listPosts().slice(0, 3);

  return (
    <SiteShell>
      <PageHero
        eyebrow="00 — Resources"
        title={
          <>
            Field guides built from the same playbook our{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              compliance team uses.
            </span>
          </>
        }
        lede={
          "Pillar references, practitioner tools, and the latest from our blog. Start with the matrix below, send your team the 24-point checklist, or book a free 15-minute audit if you'd rather have us read your current setup back to you."
        }
      />

      {/* §83 — Resource type filter strip */}
      <section
        id="resource-types"
        data-testid="resources-type-filter"
        className="bg-[color:var(--color-paper)]"
      >
        <div className="container py-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
              Browse by type
            </p>
            {RESOURCE_TYPES.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                data-testid={`resources-type-${t.id}`}
                className="inline-flex items-center rounded-full border border-border bg-white px-4 py-1.5 text-[12.5px] font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-tint)] hover:border-[color:var(--color-accent-halo)] transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — Pillar references */}
      <section id="pillars" className="bg-[color:var(--color-paper-soft)] border-y border-border scroll-mt-24">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">02 — Pillar references</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-xs">
                Long-form, deeply-linked references that stay current as
                statutes amend.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 gap-6">
              {PILLARS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block rounded-[18px] border border-border bg-white paper-shadow p-7 md:p-9 hover:bg-[color:var(--color-paper)] transition-colors"
                >
                  <div className="flex items-start gap-5">
                    <div className="shrink-0">
                      <ScrollText
                        className="h-7 w-7 text-[color:var(--color-accent)]"
                        aria-hidden
                      />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                        {p.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-[26px] md:text-[30px] leading-[1.18] tracking-[-0.015em] text-[color:var(--color-ink)] max-w-2xl">
                        {p.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                        {p.body}
                      </p>
                      <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                        Open the matrix
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Practitioner tools */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">03 — Practitioner tools</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-xs">
                Short-form tools the team can put to work the same morning
                they read them.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="block rounded-[16px] border border-border bg-white paper-shadow p-6 md:p-7 hover:bg-[color:var(--color-paper-soft)] transition-colors"
                  >
                    <Icon
                      className="h-6 w-6 text-[color:var(--color-accent)]"
                      aria-hidden
                    />
                    <h3 className="mt-5 font-display text-[20px] leading-[1.25] text-[color:var(--color-ink)]">
                      {t.title}
                    </h3>
                    <p
                      className="mt-3 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]"
                      // We allow our author-controlled body to render inline
                      // entities (& as &amp;). React already escapes, so this
                      // is safe — but to stay consistent with how the rest of
                      // the site authors copy, we keep the literal text.
                    >
                      {t.body.replace(/&amp;/g, "&")}
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                      Open
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 04 — From the blog */}
      <section className="bg-[color:var(--color-paper-soft)] border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">04 — From the blog</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-xs">
                The most recent posts. New writing lands daily.
              </p>
              <div className="mt-5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)] hover-lift-link"
                >
                  All posts
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-[16px] border border-border bg-white paper-shadow p-6 md:p-7 hover:bg-[color:var(--color-paper)] transition-colors"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                    {p.tags?.[0] ?? "Article"}
                  </p>
                  <h3 className="mt-3 font-display text-[19px] leading-[1.3] text-[color:var(--color-ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                    {p.metaDescription}
                  </p>
                  <p className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                    Read article
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}
