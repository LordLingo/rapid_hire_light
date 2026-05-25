/*
  Resources — State Background-Check Guide (§81)
  ----------------------------------------------
  Dynamic page at /resources/background-checks-by-state/:slug
  Reads per-state copy from client/src/lib/statePageContent.ts and
  the structural compliance row from client/src/lib/stateBackgroundCheckMatrix.ts.

  Section rhythm:
    01 — paper        Hero (breadcrumb + eyebrow + title + lede + 3-stat band)
    02 — paper-soft   What makes this state different
    03 — paper        FCRA layering
    04 — paper-soft   Ban-the-box / Fair Chance
    05 — paper        Cannabis & drug testing
    06 — DARK BAND    Hiring-flow checklist (5-7 steps)
    07 — paper        Statute reference table (auto-from-matrix)
    08 — paper-soft   FAQ accordion (2 items)
    09 — paper        Keep going (sibling state cards + cross-link to BCBS hub)
    + CtaBanner
*/
import * as React from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ScrollText,
  Scale,
  Leaf,
  ClipboardList,
  Building2,
  ShieldCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  STATE_PAGE_CONTENT,
  findStatePageContent,
} from "@/lib/statePageContent";
import { findStateBySlug } from "@/lib/stateBackgroundCheckMatrix";

export default function ResourcesStatePage() {
  const [, params] = useRoute("/resources/background-checks-by-state/:slug");
  const slug = params?.slug ?? "";
  const content = findStatePageContent(slug);
  const matrix = content ? findStateBySlug(content.slug) : undefined;

  useSeo({
    title: content
      ? `${content.stateName} background checks — state guide`
      : "State guide — Rapid Hire Solutions",
    description:
      content?.seoMetaDescription ??
      "State-by-state background-check guide for US employers.",
    canonical: `https://www.rapidhiresolutions.com/resources/background-checks-by-state/${slug}`,
    ogType: "article",
    jsonLd: content
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: content.heroHeadline,
          description: content.seoMetaDescription,
          author: { "@type": "Organization", name: "Rapid Hire Solutions" },
          publisher: { "@type": "Organization", name: "Rapid Hire Solutions" },
          datePublished: "2026-05-15",
          mainEntityOfPage: `https://www.rapidhiresolutions.com/resources/background-checks-by-state/${slug}`,
        }
      : undefined,
  });

  if (!content) {
    return (
      <SiteShell>
        <PageHero
          eyebrow="Resources · State guide"
          title="State guide not found"
          lede="The state guide you’re looking for isn’t published yet. Browse the directory or return to the Resources hub."
        />
        <section className="container py-16">
          <Link
            href="/resources/background-checks-by-state"
            className="inline-flex items-center gap-2 text-[color:var(--color-brand-blue)] hover:underline"
          >
            <ChevronRight className="rotate-180 h-4 w-4" />
            Back to all states
          </Link>
        </section>
      </SiteShell>
    );
  }

  // Sibling-state rail: 4 nearby pillar states (deterministic).
  const siblings = STATE_PAGE_CONTENT.filter((s) => s.slug !== content.slug).slice(
    0,
    4,
  );

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroHeadline}
        lede={content.heroLede}
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Talk to a screener
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/background-checks-by-state"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              All 50 states
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            {content.heroStats.map((stat) => (
              // §187 — baseline alignment.
              <div
                key={stat.label}
                className="flex h-full flex-col bg-[color:var(--color-paper)] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] leading-[1.3] min-h-[3.9em] text-[color:var(--color-ink-soft)]">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-[28px] leading-[1] text-[color:var(--color-ink)]">
                  {stat.value}
                </p>
                <p className="mt-auto pt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                  {stat.context}
                </p>
              </div>
            ))}
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            Last reviewed May 2026. Always confirm against your jurisdiction’s
            current statute and consult counsel for fact-specific situations.
          </p>
        }
      />

      {/* Breadcrumb chip */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container -mt-6 pb-4 text-[12px] text-[color:var(--color-ink-soft)]">
          <Link href="/resources" className="hover:underline">
            Resources
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link
            href="/resources/background-checks-by-state"
            className="hover:underline"
          >
            Background checks by state
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-[color:var(--color-ink)]">
            {content.stateName}
          </span>
        </div>
      </section>

      {/* 02 — WHAT MAKES THIS STATE DIFFERENT */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — What changes here</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The {content.stateName} angle in one paragraph.
              </h2>
              <p className="mt-6 max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {content.whatMakesDifferent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — FCRA LAYERING */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — FCRA layering</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                How state law sits on top of the federal floor.
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {content.fcraLayering.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — BAN THE BOX */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Fair Chance</p>
              <div className="mt-3 hairline" />
              <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-[color:var(--color-ink-soft)]">
                <Scale className="h-4 w-4" />
                Ban-the-box scope: {matrix?.banTheBox ?? "see body"}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Conviction-history rules in {content.stateName}.
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {content.banTheBoxBody.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <Link
                href="/resources/ban-the-box"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
              >
                Compare against the 40-jurisdiction matrix
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — CANNABIS */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Cannabis & drug testing</p>
              <div className="mt-3 hairline" />
              <p className="mt-4 inline-flex items-center gap-2 text-[12px] text-[color:var(--color-ink-soft)]">
                <Leaf className="h-4 w-4" />
                Treatment: {matrix?.marijuanaProtections ?? "see body"}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Cannabis posture and test-result handling.
              </h2>
              <div className="mt-6 max-w-3xl space-y-4 text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {content.cannabisBody.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <Link
                href="/resources/marijuana-laws"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
              >
                See the full state-by-state cannabis matrix
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — DARK BAND: HIRING-FLOW CHECKLIST */}
      <section className="relative overflow-hidden bg-[color:var(--color-ink)] text-[color:var(--color-paper)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.55 0.18 250 / 0.45), transparent 70%)",
          }}
        />
        <div className="container relative py-24 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-4 reveal-on-scroll">
              <p className="eyebrow text-[color:var(--color-paper)]/70">
                06 — Hiring-flow checklist
              </p>
              <div className="mt-3 h-px w-12 bg-[color:var(--color-paper)]/30" />
              <h2 className="mt-6 font-display text-[34px] md:text-[44px] leading-[1.05] tracking-[-0.02em]">
                What changes inside your hire workflow.
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-[1.75] text-[color:var(--color-paper)]/75">
                A practical sequence for {content.stateName} hires —
                follow these steps in order, end-to-end.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-8 lg:pl-8 reveal-on-scroll">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[color:var(--color-paper)]/10">
                {content.hiringFlowSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="bg-[color:var(--color-ink)] p-6"
                  >
                    <p className="font-display text-[28px] leading-none text-[color:var(--color-paper)]/40">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.65]">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — STATUTE REFERENCE TABLE */}
      {matrix && (
        <section className="bg-[color:var(--color-paper)]">
          <div className="container py-20 md:py-24">
            <div className="grid grid-cols-12 gap-x-8 gap-y-8">
              <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
                <p className="eyebrow">07 — Statutes at a glance</p>
                <div className="mt-3 hairline" />
              </div>
              <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
                <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                  The reference rows for {content.stateName}.
                </h2>
                <div className="mt-8 overflow-hidden rounded-lg border border-[color:var(--color-ink)]/10">
                  <dl className="divide-y divide-[color:var(--color-ink)]/10">
                    {[
                      ["Seven-year lookback", matrix.sevenYearLookback ? "Yes — non-conviction reporting capped" : "No statutory cap beyond FCRA floor"],
                      ["Ban-the-box scope", matrix.banTheBox],
                      ["Salary-history ban", matrix.salaryHistoryBan ? "Yes" : "No"],
                      ["Cannabis posture", matrix.marijuanaProtections],
                      ["Key statutes", matrix.keyStatutes.join("; ")],
                    ].map(([label, value]) => (
                      <div
                        key={label as string}
                        className="grid grid-cols-12 gap-4 px-5 py-4"
                      >
                        <dt className="col-span-12 sm:col-span-4 text-[13px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                          {label}
                        </dt>
                        <dd className="col-span-12 sm:col-span-8 text-[15px] text-[color:var(--color-ink)]">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 08 — FAQ */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">08 — Frequently asked</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-3">
              {content.faqPairs.map((pair, idx) => (
                <details
                  key={idx}
                  className="group rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-5"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                    <span className="text-[16px] font-medium leading-snug text-[color:var(--color-ink)]">
                      {pair.q}
                    </span>
                    <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-ink-soft)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                    {pair.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09 — KEEP GOING — sibling state rail */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4 reveal-on-scroll">
            <div>
              <p className="eyebrow">09 — Keep going</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-6 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Other state guides.
              </h2>
            </div>
            <Link
              href="/resources/background-checks-by-state"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-brand-blue)] hover:underline"
            >
              All 50 states
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/resources/background-checks-by-state/${s.slug}`}
                className="group block rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-5 transition hover:border-[color:var(--color-brand-blue)]/40 hover:bg-[color:var(--color-paper-soft)]"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                  {s.abbr}
                </p>
                <p className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                  {s.stateName}
                </p>
                <p className="mt-3 text-[13px] leading-snug text-[color:var(--color-ink-soft)] line-clamp-3">
                  {s.heroLede.split(". ")[0]}.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[color:var(--color-brand-blue)]">
                  Open guide
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Per-state CTA paragraph (keeps the per-state authoring intact) */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-12 gap-x-8 gap-y-6">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">10 — Talk to us</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[26px] md:text-[32px] leading-[1.15] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Hiring in {content.stateName}? Let&rsquo;s run the checks.
              </h2>
              <p className="mt-5 max-w-2xl text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                {content.ctaParagraph}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
                >
                  Talk to a screener
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper)] transition"
                >
                  See pricing
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _unused = { ScrollText, ClipboardList, Building2, ShieldCheck };
