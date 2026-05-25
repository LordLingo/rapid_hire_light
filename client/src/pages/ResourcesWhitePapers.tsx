/*
  Resources — White Papers (§81)
  ------------------------------
  /resources/white-papers

  Section rhythm:
    01 — paper        Hero (eyebrow + title + lede + 3-stat band)
    02 — paper-soft   Why we publish these (narrative)
    03 — paper        Library grid (filter by topic + paper cards)
    04 — paper-soft   How to use them (3 cards)
    + CtaBanner

  Each paper currently presents summary + highlights inline.
  A future pass can swap to gated PDF downloads.
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Clock,
  Users,
  CalendarDays,
  FileText,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  WHITE_PAPERS,
  whitePaperCounts,
  type WhitePaperTopic,
} from "@/lib/whitePapers";

const TOPIC_FILTERS: ("All" | WhitePaperTopic)[] = [
  "All",
  "Compliance",
  "Operations",
  "Industry",
  "Candidate Experience",
];

const USE_CARDS = [
  {
    eyebrow: "RFP responses",
    title: "Drop the citations into procurement docs.",
    body: "Each paper anchors its claims to public statutes and named regulators — so the work survives a procurement reviewer who wants to verify a footnote.",
  },
  {
    eyebrow: "Internal training",
    title: "Onboard new TA and HR staff.",
    body: "Pair a paper with a 30-minute walkthrough and you have a half-day onboarding curriculum for screening compliance, adjudication, or industry-specific programs.",
  },
  {
    eyebrow: "Policy refresh",
    title: "Cross-check your existing playbook.",
    body: "Use the highlights as a checklist. Anywhere your current policy doesn’t line up, that’s where the next quarterly review should focus.",
  },
];

export default function ResourcesWhitePapers() {
  const [topicFilter, setTopicFilter] = React.useState<typeof TOPIC_FILTERS[number]>(
    "All",
  );

  const counts = whitePaperCounts();

  const filtered = React.useMemo(() => {
    return WHITE_PAPERS.filter((w) => {
      if (topicFilter !== "All" && w.topic !== topicFilter) return false;
      return true;
    });
  }, [topicFilter]);

  useSeo({
    title: "White Papers — Rapid Hire Solutions",
    description:
      "Long-form, source-anchored references for employment-screening programs — FCRA fundamentals, healthcare onboarding, multi-state programs, and more.",
    canonical:
      "https://www.rapidhiresolutions.com/resources/white-papers",
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · Library"
        title="White papers."
        lede="Long-form references for the people who actually run hiring programs. Each paper is anchored to public statutes and named regulators, with a highlights set you can lift straight into a policy review."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#library"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Browse the library
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/legislative-updates"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Legislative updates
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <Stat label="Papers in library" value={`${counts.total}`} />
            <Stat label="Total reading time" value={`${counts.totalReadMinutes} min`} />
            <Stat label="Topics covered" value={`${counts.topics.size}`} />
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            Every paper anchors its claims to a named statute or regulator action.
          </p>
        }
      />

      {/* 02 — Why we publish */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — Why we publish</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-4">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Working references, not marketing brochures.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Most “white papers” in this industry are 4 pages of cover
                art and 1 page of actual content. Ours are written by the
                screeners, compliance leads, and operations directors
                who run the programs they describe — so they’re long,
                citation-heavy, and built to survive a procurement-team
                review.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Each paper opens with a summary and a highlights set
                that you can paste into a meeting agenda. The body
                walks through the operational specifics with named
                statutes, day counts, and adjudication patterns we’ve
                actually used in production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Library */}
      <section id="library" className="scroll-mt-24 bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Library</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Filter by topic. Each card lists summary, highlights,
                and target audience.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-4">
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  <Filter className="h-3.5 w-3.5" />
                  Topic:
                </span>
                {TOPIC_FILTERS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopicFilter(t)}
                    className={`rounded-full border px-3 py-1 text-[12px] transition ${
                      topicFilter === t
                        ? "border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)] text-white"
                        : "border-[color:var(--color-ink)]/15 bg-[color:var(--color-paper)] text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-paper-soft)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="mt-4 text-[12px] text-[color:var(--color-ink-soft)]">
                Showing {filtered.length} of {WHITE_PAPERS.length} papers.
              </p>

              <ul className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((w) => (
                  <li
                    key={w.id}
                    className="flex flex-col rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-6"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-brand-blue)]/10 px-2 py-0.5 text-[color:var(--color-brand-blue)]">
                        {w.topic}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {w.readMinutes} min
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(w.publishedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                      {w.title}
                    </h3>
                    <p className="mt-2 inline-flex items-center gap-1 text-[12px] text-[color:var(--color-ink-soft)]">
                      <Users className="h-3.5 w-3.5" />
                      {w.audience}
                    </p>
                    <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                      {w.summary}
                    </p>
                    <div className="mt-4 rounded-md border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-4">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                        Highlights
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {w.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[13px] leading-snug text-[color:var(--color-ink-soft)]"
                          >
                            <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--color-brand-blue)]" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — How to use */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — How to use them</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll grid grid-cols-1 md:grid-cols-3 gap-4">
              {USE_CARDS.map((c) => (
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
  // §187 — baseline alignment.
  return (
    <div className="flex h-full flex-col bg-[color:var(--color-paper)] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] leading-[1.3] min-h-[3.9em] text-[color:var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-auto pt-2 font-display text-[32px] leading-[1] text-[color:var(--color-ink)]">
        {value}
      </p>
    </div>
  );
}
