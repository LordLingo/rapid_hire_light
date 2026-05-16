/*
  Resources — Ban the Box (§80)
  ------------------------------
  A pillar reference page for the Resources hub, modeled on
  precisehire.com/resources/ban-the-box but written for Rapid Hire.

  Section rhythm (paper / paper-soft / dark gradient alternation
  matches the rest of the inner-page family — Compliance, Pricing,
  Support, About):

    01 — paper        Hero (breadcrumb + eyebrow + title + lede +
                            dual CTAs + 3-stat band)
    02 — paper-soft   Why this matters narrative
    03 — paper        Coverage tally band (auto-counted from data)
    04 — paper        Jurisdiction directory (40-row filterable table)
    05 — DARK BAND    Employer playbook (6 numbered moves)
    06 — paper        How Rapid Hire helps (4-card overlay)
    07 — paper-soft   FAQ accordion (5 items, native <details>)
    08 — paper        Keep going — companion blog posts (4-card rail)
    + CtaBanner

  The 40-row jurisdiction matrix is sourced from
  client/src/lib/banTheBoxJurisdictions.ts which carries its own
  "for reference, not legal advice" disclaimer. The visible disclaimer
  on this page repeats the same posture so it is unmissable.
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  ScrollText,
  Scale,
  CalendarCheck2,
  Megaphone,
  ClipboardList,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  JURISDICTIONS,
  STAGE_LABEL,
  SCOPE_LABEL,
  jurisdictionCounts,
  type Stage,
  type Scope,
} from "@/lib/banTheBoxJurisdictions";

const STAGE_FILTERS: { value: Stage | "all"; label: string }[] = [
  { value: "all", label: "All stages" },
  { value: "conditional-offer", label: STAGE_LABEL["conditional-offer"] },
  { value: "after-interview", label: STAGE_LABEL["after-interview"] },
  { value: "deemed-qualified", label: STAGE_LABEL["deemed-qualified"] },
  { value: "after-application", label: STAGE_LABEL["after-application"] },
];

const SCOPE_FILTERS: { value: Scope | "all"; label: string }[] = [
  { value: "all", label: "All scopes" },
  { value: "state", label: SCOPE_LABEL.state },
  { value: "city", label: SCOPE_LABEL.city },
  { value: "county", label: SCOPE_LABEL.county },
  { value: "territory", label: SCOPE_LABEL.territory },
];

const PLAYBOOK: { n: string; icon: React.ComponentType<{ className?: string }>; title: string; body: string }[] = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Audit your application — every channel.",
    body:
      "ATS templates, paper applications, third-party job boards, even franchisee handbooks. The criminal-history checkbox has to come off everywhere a candidate enters the funnel — not just on the careers page.",
  },
  {
    n: "02",
    icon: CalendarCheck2,
    title: "Move the inquiry to the right stage.",
    body:
      "Most jurisdictions allow the question only after a written conditional offer; a meaningful subset allow it after the first interview, and a few only once the candidate is deemed otherwise qualified. Configure your ATS so the inquiry is gated by stage, not by date.",
  },
  {
    n: "03",
    icon: Scale,
    title: "Run an individualized assessment.",
    body:
      "Even where you may consider a conviction, EEOC 2012 guidance and many state laws require a documented job-relatedness analysis covering nature and gravity of the offense, time elapsed, and the nature of the role.",
  },
  {
    n: "04",
    icon: ScrollText,
    title: "Layer state-specific notices on top of FCRA.",
    body:
      "California, New York City, Los Angeles County and several others require a copy of the report, an articulable-reasoning notice, and a longer cure window before any final adverse action — beyond what FCRA §615 requires on its own.",
  },
  {
    n: "05",
    icon: Megaphone,
    title: "Train hiring managers — not just HR.",
    body:
      "Most ban-the-box claims start with an off-script question on the phone screen. Document a manager script, role-play it, and audit notes or recordings quarterly so the policy lives where the conversation actually happens.",
  },
  {
    n: "06",
    icon: ShieldCheck,
    title: "Refresh policy every January and July.",
    body:
      "Fair-chance laws are amended on a rolling basis — Chicago in 2023, Chester County PA in 2025, NYC's recent Fair Chance amendments. A semi-annual review keeps policy ahead of the next legislative cycle.",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are ban-the-box laws the same as fair-chance hiring laws?",
    a:
      "They overlap but aren't identical. Ban-the-box is the timing rule — when (if ever) you may ask about prior criminal history. Fair-chance laws are the broader family that adds individualized-assessment, document-share, and notice requirements on top of the timing rule. Most modern statutes do both at once, which is why we use the labels interchangeably in everyday conversation but separately in policy.",
  },
  {
    q: "Does federal law require ban-the-box for private employers?",
    a:
      "No. Federal law (the Fair Chance Act of 2019) restricts most federal contractors and federal agencies from asking about criminal history before a conditional offer, but it does not regulate private-sector hiring more broadly. The private-employer rules on this page come from state, city, and county laws.",
  },
  {
    q: "Can I still run a background check if my state has a ban-the-box law?",
    a:
      "Yes. Ban-the-box restricts when you may ask the candidate about prior history and when a criminal-history-based decision can be reached — it does not prohibit pre-employment background checks. Rapid Hire stages criminal-history checks to fire only after the lawful inquiry stage for the candidate's work location.",
  },
  {
    q: "Do remote roles follow the candidate's state or the employer's state?",
    a:
      "Generally the candidate's primary work location, which for fully-remote roles is usually the candidate's home state. A handful of city and county ordinances also reach to candidates who would do any meaningful work within their boundary, regardless of where the employer is. We default to the most protective applicable jurisdiction for any given candidate.",
  },
  {
    q: "What is the most common ban-the-box mistake?",
    a:
      "An old criminal-history checkbox left on a paper application or a third-party job-board template. Even if the careers site is clean, a single legacy form can support a class claim. The first move on any compliance audit is to pull every channel a candidate could enter — not just the primary ATS.",
  },
];

const RELATED: { eyebrow: string; title: string; href: string }[] = [
  {
    eyebrow: "Companion guide",
    title: "EEOC ban-the-box compliance — what HR teams get wrong",
    href: "/blog/eeoc-ban-the-box-compliance",
  },
  {
    eyebrow: "Pillar guide",
    title: "Ban-the-box and fair-chance hiring — the operator's brief",
    href: "/blog/ban-the-box-fair-chance-hiring",
  },
  {
    eyebrow: "FCRA",
    title: "Adverse action letters — FCRA §615 step-by-step template",
    href: "/blog/adverse-action-letter-fcra-template",
  },
  {
    eyebrow: "State law",
    title: "California ICRAA disclosure — what changed and what didn't",
    href: "/blog/california-icraa-disclosure-requirements",
  },
];

export default function ResourcesBanTheBox() {
  const counts = jurisdictionCounts();
  const [stageFilter, setStageFilter] = React.useState<Stage | "all">("all");
  const [scopeFilter, setScopeFilter] = React.useState<Scope | "all">("all");

  const filteredJurisdictions = React.useMemo(() => {
    return JURISDICTIONS.filter((j) => {
      if (stageFilter !== "all" && j.stage !== stageFilter) return false;
      if (scopeFilter !== "all" && j.scope !== scopeFilter) return false;
      return true;
    });
  }, [stageFilter, scopeFilter]);

  useSeo({
    title:
      "Ban the Box laws by state — fair-chance hiring directory · Rapid Hire Solutions",
    description:
      "Forty private-employer ban-the-box and fair-chance jurisdictions in one filterable matrix. The compliance reference Rapid Hire's team operates from.",
    canonical: "https://www.rapidhiresolutions.com/resources/ban-the-box",
    ogType: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Ban the Box laws, decoded by jurisdiction",
      description:
        "Sixteen states, the District of Columbia, the U.S. Virgin Islands, and twenty-plus cities and counties — what each requires and when it kicks in.",
      datePublished: "2026-05-16",
      dateModified: "2026-05-16",
      author: {
        "@type": "Organization",
        name: "Rapid Hire Solutions",
      },
    },
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Compliance reference · Updated May 2026"
        title={
          <>
            Ban-the-Box laws,{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              decoded by jurisdiction.
            </span>
          </>
        }
        lede={
          "Sixteen states, the District of Columbia, the U.S. Virgin Islands, and more than twenty cities and counties now restrict when a private employer can ask a candidate about prior criminal history. This page is the single source of truth our compliance team operates from — what each jurisdiction requires, when it kicks in, and how Rapid Hire applies it to your hiring workflow automatically."
        }
        afterLede={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-[14px] font-medium text-white hover-lift-link"
            >
              Get a fair-chance ready quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/compliance/checklist"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] hover-lift-link"
            >
              24-point compliance checklist
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        }
        belowVisual={null}
        visual={
          <div className="bg-[color:var(--color-paper)] border border-border rounded-[18px] paper-shadow p-7 md:p-8">
            <p className="eyebrow text-[color:var(--color-ink-soft)]">
              National picture
            </p>
            <div className="mt-5 grid grid-cols-3 gap-x-4">
              <div className="border-r border-border pr-3">
                <p className="font-display text-[40px] md:text-[48px] leading-none text-[color:var(--color-ink)] tracking-[-0.02em]">
                  {counts.statesAndTerritories}
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  states &amp; territories
                </p>
              </div>
              <div className="border-r border-border px-3">
                <p className="font-display text-[40px] md:text-[48px] leading-none text-[color:var(--color-ink)] tracking-[-0.02em]">
                  {counts.citiesAndCounties}
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  cities &amp; counties
                </p>
              </div>
              <div className="pl-3">
                <p className="font-display text-[40px] md:text-[48px] leading-none text-[color:var(--color-ink)] tracking-[-0.02em]">
                  {counts.total}
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                  total jurisdictions
                </p>
              </div>
            </div>
            <p className="mt-6 text-[12.5px] leading-[1.6] text-[color:var(--color-ink-soft)]">
              Counts cover private-employer rules. State-only public-sector
              laws (Florida, Georgia, Indiana, Kentucky, Michigan, Nebraska,
              Ohio, Oklahoma, Tennessee, Utah, Wisconsin) are not on this
              page; we still apply them in our workflow when relevant.
            </p>
          </div>
        }
      />

      {/* 02 — Why this matters */}
      <section className="bg-[color:var(--color-paper-soft)] border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">02 — Why this matters</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.022em] text-[color:var(--color-ink)] max-w-3xl">
                The check-box is gone. The compliance burden moved to{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  timing.
                </span>
              </h2>
              <div className="mt-7 max-w-3xl space-y-5 text-[16px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                <p>
                  Ban-the-box began in Hawaii in 1998 as a single sentence:
                  do not ask about criminal history on the application.
                  Twenty-eight years later it is the most heavily-litigated
                  stage of pre-employment screening, because that simple
                  rule has grown a complicated body of timing requirements,
                  individualized-assessment requirements, document-share
                  requirements, and notice requirements that vary by
                  jurisdiction.
                </p>
                <p>
                  The federal Fair Credit Reporting Act still governs how
                  the report is delivered and how adverse action is
                  communicated. State and local fair-chance laws sit on
                  top of FCRA — they decide <em>when</em> the question may
                  be asked, <em>what</em> the employer must consider before
                  disqualifying, <em>which documents</em> have to be shared
                  with the candidate, and <em>how long</em> the candidate
                  has to respond. Get any of those wrong and the
                  FCRA-perfect adverse action letter at the end becomes
                  Exhibit A.
                </p>
                <p className="text-[14px] text-[color:var(--color-ink-muted)] italic">
                  This page is reference, not legal advice. Local rules
                  amend frequently — pair it with counsel review before
                  changing your application or interview script.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Jurisdiction directory */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">03 — Jurisdiction directory</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.022em] text-[color:var(--color-ink)] max-w-3xl">
                The 40-row matrix our compliance team operates from.
              </h2>
              <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Stage labels normalize the language each statute uses
                (e.g., "after a conditional offer of employment", "after
                the applicant has been deemed otherwise qualified"). Many
                jurisdictions add notice, document-share, or assessment
                requirements on top of the timing rule — those are linked
                from each row inside the Rapid Hire client dashboard.
              </p>

              {/* Filter chips */}
              <div className="mt-8 grid gap-y-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)] mb-2">
                    Filter by stage
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {STAGE_FILTERS.map((f) => {
                      const active = stageFilter === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setStageFilter(f.value)}
                          aria-pressed={active}
                          className={
                            "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] transition-colors " +
                            (active
                              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                              : "border-border bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)]")
                          }
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)] mb-2">
                    Filter by scope
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SCOPE_FILTERS.map((f) => {
                      const active = scopeFilter === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => setScopeFilter(f.value)}
                          aria-pressed={active}
                          className={
                            "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[13px] transition-colors " +
                            (active
                              ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)] text-white"
                              : "border-border bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)]")
                          }
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p
                aria-live="polite"
                className="mt-6 text-[13px] text-[color:var(--color-ink-muted)]"
              >
                Showing {filteredJurisdictions.length} of {JURISDICTIONS.length} jurisdictions.
              </p>

              {/* Directory table */}
              <div className="mt-4 overflow-x-auto rounded-[14px] border border-border bg-white paper-shadow">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-border bg-[color:var(--color-paper)]">
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-[12px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-medium"
                      >
                        Jurisdiction
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-[12px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-medium"
                      >
                        Scope
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-[12px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-medium"
                      >
                        When you may ask
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 text-left text-[12px] uppercase tracking-[0.12em] text-[color:var(--color-ink-muted)] font-medium"
                      >
                        Effective
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJurisdictions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-10 text-center text-[14px] text-[color:var(--color-ink-muted)]"
                        >
                          No jurisdictions match this combination of filters.{" "}
                          <button
                            type="button"
                            onClick={() => {
                              setStageFilter("all");
                              setScopeFilter("all");
                            }}
                            className="underline underline-offset-4 hover:text-[color:var(--color-accent-ink)]"
                          >
                            Clear filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredJurisdictions.map((j) => (
                        <tr
                          key={j.jurisdiction}
                          className="border-b border-border last:border-b-0 hover:bg-[color:var(--color-paper)]"
                        >
                          <td className="px-4 py-3 align-top text-[color:var(--color-ink)] font-medium">
                            {j.jurisdiction}
                          </td>
                          <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                            {SCOPE_LABEL[j.scope]}
                          </td>
                          <td className="px-4 py-3 align-top text-[color:var(--color-ink)]">
                            {STAGE_LABEL[j.stage]}
                          </td>
                          <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                            {j.effective}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Employer playbook (DARK BAND) */}
      <section
        className="relative"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-footer) 0%, var(--color-footer) 35%, var(--color-footer-soft) 100%)",
          color: "var(--color-footer-foreground)",
          colorScheme: "dark",
        }}
      >
        <div className="container py-20 md:py-28">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow text-[color:var(--color-footer-muted)]">
                04 — Employer playbook
              </p>
              <div
                className="mt-3 h-px w-12"
                style={{ background: "var(--color-footer-muted)" }}
              />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.022em] text-[color:var(--color-footer-foreground)] max-w-3xl">
                Six moves that keep your hiring funnel{" "}
                <span className="italic font-light text-[color:var(--color-accent-halo)]">
                  out of court.
                </span>
              </h2>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {PLAYBOOK.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.n} className="flex gap-5">
                      <div className="shrink-0">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full"
                          style={{
                            background: "color-mix(in oklab, var(--color-accent-halo) 18%, transparent)",
                            color: "var(--color-accent-halo)",
                          }}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                        </div>
                        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-footer-muted)]">
                          {p.n}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-display text-[20px] md:text-[22px] leading-[1.25] text-[color:var(--color-footer-foreground)]">
                          {p.title}
                        </h3>
                        <p className="mt-2.5 text-[14.5px] leading-[1.7] text-[color:var(--color-footer-muted)]">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — How Rapid Hire helps */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">05 — How Rapid Hire helps</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.022em] text-[color:var(--color-ink)] max-w-3xl">
                We do the 50-state homework.{" "}
                <span className="italic font-light text-[color:var(--color-accent-ink)]">
                  Your team just hires.
                </span>
              </h2>
              <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                Every Rapid Hire account ships with the full ban-the-box and
                fair-chance overlay applied automatically — by the candidate's
                work location, not yours. No matrices on a wiki, no quarterly
                emergency from counsel.
              </p>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Stage-gated inquiry",
                    body:
                      "Criminal-history fields stay locked in the candidate portal until the candidate's location and your role's stage permit the question.",
                  },
                  {
                    title: "Individualized assessment",
                    body:
                      "Decision matrix prompts your hiring manager through nature/gravity, time elapsed, and job-relatedness — and saves the analysis to the file.",
                  },
                  {
                    title: "State-specific notices",
                    body:
                      "California 2-day cure window, NYC Article 23-A analysis, LA County conviction-history notice — all drafted, served, and tracked.",
                  },
                  {
                    title: "Continuous monitoring overlay",
                    body:
                      "If you continuously monitor post-hire, the same fair-chance logic applies on every refresh — not just the initial check.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-[16px] border border-border bg-white paper-shadow p-6 md:p-7"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-accent)]"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-display text-[20px] leading-[1.25] text-[color:var(--color-ink)]">
                          {c.title}
                        </h3>
                        <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-[14px] font-medium text-white hover-lift-link"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/compliance/audit"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] font-medium text-[color:var(--color-ink)] hover-lift-link"
                >
                  Free 15-minute audit
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — FAQ */}
      <section className="bg-[color:var(--color-paper-soft)] border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">06 — Frequently asked</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <h2 className="font-display text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.022em] text-[color:var(--color-ink)] max-w-3xl">
                The questions counsel asks first.
              </h2>
              <p className="mt-5 max-w-3xl text-[15.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                If your scenario isn't here, our compliance team replies to
                scoped questions within one business day.
              </p>
              <div className="mt-10 divide-y divide-border border-y border-border bg-white rounded-[14px] paper-shadow">
                {FAQS.map((f) => (
                  <details
                    key={f.q}
                    className="group p-6 md:p-7"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 list-none">
                      <h3 className="font-display text-[19px] md:text-[20px] leading-[1.3] text-[color:var(--color-ink)]">
                        {f.q}
                      </h3>
                      <ChevronDown
                        aria-hidden
                        className="h-5 w-5 shrink-0 text-[color:var(--color-ink-muted)] transition-transform group-open:rotate-180"
                        style={{ transitionDuration: "180ms" }}
                      />
                    </summary>
                    <p className="mt-4 text-[15px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)] hover-lift-link"
                >
                  Talk to a compliance specialist
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07 — Keep going */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3">
              <p className="eyebrow">07 — Keep going</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-[1.7] text-[color:var(--color-ink-soft)] max-w-xs">
                Companion compliance posts that pair with this matrix.
              </p>
              <div className="mt-5">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)] hover-lift-link"
                >
                  All resources
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RELATED.map((r) => (
                  <li key={r.href}>
                    <Link
                      href={r.href}
                      className="block rounded-[16px] border border-border bg-white paper-shadow p-6 md:p-7 hover:bg-[color:var(--color-paper-soft)] transition-colors"
                    >
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
                        {r.eyebrow}
                      </p>
                      <h3 className="mt-3 font-display text-[20px] leading-[1.25] text-[color:var(--color-ink)]">
                        {r.title}
                      </h3>
                      <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--color-accent-ink)]">
                        Read article
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </p>
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
