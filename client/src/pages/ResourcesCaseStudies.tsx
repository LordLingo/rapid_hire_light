/*
  Resources — Enterprise Case Studies (§201)
  -------------------------------------------
  /resources/case-studies

  Section rhythm (mirrors /resources/white-papers and the rest of the
  Resources hub):
    01 — paper        Hero (eyebrow + title + lede + 3-stat band)
    02 — paper-soft   Why we publish these (narrative)
    03 — paper        Case-study library (long-form cards, one per study)
    04 — paper-soft   How to use them (3 cards)
    + CtaBanner

  Each case-study card shows:
    - industry eyebrow + headline result
    - The Problem / What Was Broken / Why They Switched / Results narrative
    - 4-row metrics table (Legacy / Rapid Hire / Improvement)
    - pull-quote testimonial with role + company attribution

  Source content: customer-supplied document, captured from
  https://manus.im/share/file/36b81ce1-1886-4270-909d-4fb003f20828
*/
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  Quote,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  CASE_STUDY_RESOURCES,
  type CaseStudyResource,
} from "@/lib/caseStudyResources";

const USE_CARDS = [
  {
    eyebrow: "Procurement reviews",
    title: "Drop the metrics straight into your business case.",
    body: "Each study lists a 4-row Legacy-vs-Rapid-Hire metrics table built from the team that ran the program. Lift it into your RFP response, savings model, or board memo without reformatting.",
  },
  {
    eyebrow: "Buyer education",
    title: "Show stakeholders what “good” looks like.",
    body: "Hiring managers, ops leaders, and compliance counsels rarely see what a modern screening program actually changes. Forward the relevant study so they walk into the next meeting with the same baseline.",
  },
  {
    eyebrow: "Reference calls",
    title: "Pre-read for on-the-record references.",
    body: "We make on-the-record reference introductions for shortlist evaluations. Reading the matching industry case study first means you get straight to the high-signal questions on the call.",
  },
];

const HERO_STATS = [
  { label: "Industries covered", value: `${CASE_STUDY_RESOURCES.length}` },
  { label: "Median TAT (Rapid Hire)", value: "<8h" },
  { label: "Report accuracy rate", value: "99.9%" },
];

export default function ResourcesCaseStudies() {
  useSeo({
    title: "Enterprise Case Studies — Rapid Hire Solutions",
    description:
      "Three enterprise case studies — high-volume industrial staffing, nationwide last-mile delivery, and multi-state healthcare credentialing. Outcomes, metrics, and the story behind each switch.",
    canonical: "https://www.rapidhiresolutions.com/resources/case-studies",
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · Case Studies"
        title={
          <>
            Real stories.{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              Unmatched speed.
            </span>{" "}
            Complete accuracy.
          </>
        }
        lede="The following case studies illustrate how high-volume staffing and enterprise recruiting teams transitioned from slow, bureaucratic legacy background check providers to the Rapid Hire SPA Standard — gaining speed, saving money, and achieving absolute compliance."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#case-studies"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Read the case studies
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/customers"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Named customer stories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            {HERO_STATS.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Industry-anonymized.
            </span>{" "}
            Named-customer references with full attribution live on{" "}
            <Link href="/customers" className="underline underline-offset-2 hover:text-[color:var(--color-ink)]">
              the Customers page
            </Link>
            .
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
                The story behind the switch, not the marketing version.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Most background-check case studies are a quote, a logo, and
                a vague claim about time saved. Ours walk through what was
                broken at the legacy vendor, what the team needed in a
                replacement, and the metrics that changed once they
                migrated. Each study was written with the program owner
                who ran it.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                The companies are described by industry rather than name
                because the operational details — turnaround windows,
                error-rate thresholds, candidate-experience notes —
                are more useful as anonymous references than as branded
                marketing assets. If you want named-customer references
                with attribution, those live on{" "}
                <Link
                  href="/customers"
                  className="underline underline-offset-2 hover:text-[color:var(--color-ink)]"
                >
                  the Customers page
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Case study library */}
      <section
        id="case-studies"
        className="scroll-mt-24 bg-[color:var(--color-paper)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — Case studies</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Three industries. Three different problems. Same
                underlying pattern: legacy vendor SLA breakage, recruiter
                drag, candidate drop-off. Pick the one closest to your
                program.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-12">
              {CASE_STUDY_RESOURCES.map((c, i) => (
                <CaseStudyCard
                  key={c.slug}
                  study={c}
                  number={String(i + 1).padStart(2, "0")}
                />
              ))}

              {/*
                §202 — Request a Demo CTA.
                Sits immediately under the three case-study cards so the
                demo ask lands while the proof is still in the reader's
                eyeline. Uses the canonical /get-a-quote route (§111)
                with a source tag so sales can attribute leads back to
                this page.
              */}
              <div
                data-testid="case-studies-demo-cta"
                className="reveal-on-scroll relative overflow-hidden rounded-[20px] border border-[color:var(--color-brand-blue)]/25 bg-[color:var(--color-ink)] p-8 md:p-10 paper-shadow text-white"
                style={{ colorScheme: "dark" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(closest-side, var(--color-brand-blue), transparent 70%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-6 right-6 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-accent-halo) 60%, transparent) 25%, color-mix(in oklch, var(--color-accent-halo) 60%, transparent) 75%, transparent)",
                  }}
                />
                <div className="relative grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-12 md:col-span-8">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-accent-halo)]">
                      See it on your own data
                    </p>
                    <h3 className="mt-3 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.01em] text-white">
                      Want results like these for{" "}
                      <span className="italic font-light text-[color:var(--color-accent-halo)]">
                        your team?
                      </span>
                    </h3>
                    <p className="mt-4 max-w-xl text-[15.5px] leading-[1.7] text-white/75">
                      Book a 20-minute walkthrough with a U.S.-based,
                      FCRA-accredited specialist. We&apos;ll model your
                      volume against the SPA Standard, run a sample
                      report against your current vendor, and show you
                      the exact savings line you&apos;d see in month one.
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-4 flex md:justify-end">
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <Link
                        href="/get-a-quote?source=resources-case-studies&note=Interested+in+a+demo"
                        data-testid="case-studies-demo-cta-primary"
                        className="btn-press inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[color:var(--color-ink)] shadow-sm hover:bg-[color:var(--color-accent-halo)] hover:text-[color:var(--color-ink)] transition"
                      >
                        Request a Demo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        href="/customers"
                        className="text-[12px] uppercase tracking-[0.14em] text-white/60 hover:text-white transition"
                      >
                        Or read named-customer stories
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
              {USE_CARDS.map((u) => (
                <div
                  key={u.eyebrow}
                  className="rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-brand-blue)]">
                    {u.eyebrow}
                  </p>
                  <h3 className="mt-2 font-display text-[20px] leading-tight text-[color:var(--color-ink)]">
                    {u.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                    {u.body}
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

function CaseStudyCard({
  study,
  number,
}: {
  study: CaseStudyResource;
  number: string;
}) {
  return (
    <article
      data-testid={`case-study-${study.slug}`}
      className="rounded-[16px] border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-6 md:p-10 paper-shadow"
    >
      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        <span className="font-medium text-[color:var(--color-ink)]">
          Case Study {number}
        </span>
        <span aria-hidden>·</span>
        <span className="rounded-full bg-[color:var(--color-brand-blue)]/10 px-2.5 py-0.5 text-[color:var(--color-brand-blue)]">
          {study.industry}
        </span>
      </div>

      <h3 className="mt-4 font-display text-[24px] md:text-[30px] leading-[1.15] tracking-[-0.01em] text-[color:var(--color-ink)]">
        {study.headline}
      </h3>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
        <div className="lg:col-span-7 space-y-5">
          <Para label="The Problem">{study.problem}</Para>
          <Para label="What Was Broken">{study.whatWasBroken}</Para>
          <Para label="Why They Switched">{study.whySwitched}</Para>
        </div>

        <div className="lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
            The Results
          </p>
          <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
            {study.resultsLede}
          </p>
          <div className="mt-5 overflow-hidden rounded-md border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)]">
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr className="bg-[color:var(--color-paper-soft)]">
                  <th className="border-b border-[color:var(--color-ink)]/10 px-3 py-2 text-left font-medium uppercase tracking-[0.12em] text-[10px] text-[color:var(--color-ink-soft)]">
                    Metric
                  </th>
                  <th className="border-b border-[color:var(--color-ink)]/10 px-3 py-2 text-left font-medium uppercase tracking-[0.12em] text-[10px] text-[color:var(--color-ink-soft)]">
                    Legacy
                  </th>
                  <th className="border-b border-[color:var(--color-ink)]/10 px-3 py-2 text-left font-medium uppercase tracking-[0.12em] text-[10px] text-[color:var(--color-ink-soft)]">
                    Rapid Hire
                  </th>
                  <th className="border-b border-[color:var(--color-ink)]/10 px-3 py-2 text-left font-medium uppercase tracking-[0.12em] text-[10px] text-[color:var(--color-brand-blue)]">
                    Δ
                  </th>
                </tr>
              </thead>
              <tbody>
                {study.metrics.map((m) => (
                  <tr key={m.metric} className="align-top">
                    <td className="border-b border-[color:var(--color-ink)]/5 px-3 py-2.5 text-[color:var(--color-ink)] font-medium">
                      {m.metric}
                    </td>
                    <td className="border-b border-[color:var(--color-ink)]/5 px-3 py-2.5 text-[color:var(--color-ink-soft)]">
                      {m.legacy}
                    </td>
                    <td className="border-b border-[color:var(--color-ink)]/5 px-3 py-2.5 text-[color:var(--color-ink)]">
                      {m.rapid}
                    </td>
                    <td className="border-b border-[color:var(--color-ink)]/5 px-3 py-2.5 text-[color:var(--color-brand-blue)] font-medium">
                      {m.improvement}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <figure className="mt-8 rounded-md border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6">
        <Quote
          aria-hidden
          className="h-4 w-4 text-[color:var(--color-brand-blue)]"
        />
        <blockquote className="mt-2 text-[15.5px] leading-[1.7] text-[color:var(--color-ink)] italic">
          &ldquo;{study.quote}&rdquo;
        </blockquote>
        <figcaption className="mt-3 text-[12.5px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
          — {study.quoteAttribution}
        </figcaption>
      </figure>
    </article>
  );
}

function Para({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-2 text-[14.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
        {children}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  // §187 — baseline alignment helper used across resource pages.
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
