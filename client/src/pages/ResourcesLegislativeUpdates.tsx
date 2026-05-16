/*
  Resources — Legislative Updates (§81)
  -------------------------------------
  /resources/legislative-updates

  Section rhythm:
    01 — paper        Hero (eyebrow + title + lede + 4-stat band)
    02 — paper-soft   How we track this (narrative)
    03 — paper        Filter chips + chronological feed (newest first)
    04 — paper-soft   How to put updates into practice (3 cards)
    + CtaBanner
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  ScrollText,
  Filter,
  Calendar,
  MapPin,
  Tag,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  LEGISLATIVE_UPDATES,
  legislativeUpdateCounts,
  type UpdateScope,
  type UpdateCategory,
} from "@/lib/legislativeUpdates";

const SCOPE_FILTERS: ("All" | UpdateScope)[] = [
  "All",
  "Federal",
  "State",
  "Municipal",
];
const CATEGORY_FILTERS: ("All" | UpdateCategory)[] = [
  "All",
  "FCRA",
  "Ban-the-Box / Fair Chance",
  "Cannabis",
  "Pay Transparency",
  "Identity Verification",
  "Driving Records",
  "AI / Algorithmic Hiring",
];

const PRACTICE_CARDS = [
  {
    eyebrow: "Inventory",
    title: "Map every workflow each update touches.",
    body: "Most updates apply to one or two specific points in the requisition-to-onboarding flow. Mapping which step is affected (job posting, disclosure, screening order, adverse-action) keeps the change scoped and prevents wholesale rewrites.",
  },
  {
    eyebrow: "Cadence",
    title: "Refresh policies on a fixed quarterly window.",
    body: "Pegging policy reviews to a calendar (last Thursday of each quarter is what we recommend) keeps you ahead of effective dates without ad-hoc fire drills. Every update in this feed lists an effective date so it slots cleanly into a quarterly review.",
  },
  {
    eyebrow: "Vendor stack",
    title: "Loop in your screening partner before the effective date.",
    body: "If you’re a Rapid Hire client, send the citation; we’ll confirm whether your screening package, disclosure pack, or adjudication matrix needs a change. Most updates need nothing more than a state-overlay tweak in the requisition workflow.",
  },
];

export default function ResourcesLegislativeUpdates() {
  const [scopeFilter, setScopeFilter] = React.useState<typeof SCOPE_FILTERS[number]>(
    "All",
  );
  const [categoryFilter, setCategoryFilter] = React.useState<
    typeof CATEGORY_FILTERS[number]
  >("All");

  const counts = legislativeUpdateCounts();

  const filtered = React.useMemo(() => {
    return LEGISLATIVE_UPDATES.filter((u) => {
      if (scopeFilter !== "All" && u.scope !== scopeFilter) return false;
      if (categoryFilter !== "All" && u.category !== categoryFilter) return false;
      return true;
    });
  }, [scopeFilter, categoryFilter]);

  useSeo({
    title: "Legislative Updates — employment screening law tracker",
    description:
      "A working feed of federal, state, and municipal updates that affect background-check programs — with effective dates, citations, and practical employer actions.",
    canonical:
      "https://www.rapidhiresolutions.com/resources/legislative-updates",
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · Living feed"
        title="Legislative updates."
        lede="A tracker for the federal, state, and municipal laws that actually change how employer screening programs run. Each entry has a citation, an effective date, and the concrete action a hiring team should take."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#feed"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Open the feed
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/white-papers"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Read the white papers
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-2 gap-px bg-[color:var(--color-ink)]/10 sm:grid-cols-4">
            <Stat label="Tracked updates" value={`${counts.total}`} />
            <Stat label="Effective now" value={`${counts.effective}`} />
            <Stat label="In active review" value={`${counts.pending}`} />
            <Stat label="State + municipal" value={`${counts.state + counts.municipal}`} />
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            Every entry is anchored to a public statute or regulator action.
          </p>
        }
      />

      {/* 02 — How we track this */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — How we track</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-4">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The change set that actually changes your workflow.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Hundreds of bills touch employment law in any given year.
                Most are noise. The feed below is curated to the changes
                that actually flow into a screening program — disclosure
                wording, lookback windows, adverse-action timing,
                cannabis treatment, AI-hiring notice, pay transparency.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                For each update we list the citation, scope, category,
                effective date, status, and the specific employer action.
                The action column is the part to copy into your next
                quarterly policy review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Feed */}
      <section id="feed" className="scroll-mt-24 bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Feed</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Newest first. Filter by scope or category. Every entry is
                source-anchored.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              {/* Filter bar */}
              <div className="flex flex-col gap-4 rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    <Filter className="h-3.5 w-3.5" />
                    Scope:
                  </span>
                  {SCOPE_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setScopeFilter(f)}
                      className={`rounded-full border px-3 py-1 text-[12px] transition ${
                        scopeFilter === f
                          ? "border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)] text-white"
                          : "border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                    <Tag className="h-3.5 w-3.5" />
                    Category:
                  </span>
                  {CATEGORY_FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setCategoryFilter(f)}
                      className={`rounded-full border px-3 py-1 text-[12px] transition ${
                        categoryFilter === f
                          ? "border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)] text-white"
                          : "border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-[12px] text-[color:var(--color-ink-soft)]">
                Showing {filtered.length} of {LEGISLATIVE_UPDATES.length} updates.
              </p>

              <ol className="mt-3 space-y-4">
                {filtered.map((u) => (
                  <li
                    key={u.id}
                    className="rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {u.scope} · {u.jurisdiction}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        {u.category}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(u.effectiveDate).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span
                        className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          u.status === "Effective"
                            ? "bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]"
                            : u.status === "Signed, not yet effective"
                            ? "bg-amber-500/10 text-amber-700"
                            : "bg-[color:var(--color-ink)]/10 text-[color:var(--color-ink-soft)]"
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                      {u.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {u.summary}
                    </p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                          Citation
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[color:var(--color-ink)]">
                          <ScrollText className="h-3.5 w-3.5" />
                          {u.citation}
                        </p>
                      </div>
                      <div className="rounded-md border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-3">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                          Employer action
                        </p>
                        <p className="mt-1 text-[13px] leading-snug text-[color:var(--color-ink-soft)]">
                          {u.employerAction}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Practice cards */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Put updates into practice</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRACTICE_CARDS.map((c) => (
                <div
                  key={c.eyebrow}
                  className="rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-brand-blue)]">
                    {c.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </SiteShell>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[color:var(--color-paper)] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-2 font-display text-[32px] leading-tight text-[color:var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}
