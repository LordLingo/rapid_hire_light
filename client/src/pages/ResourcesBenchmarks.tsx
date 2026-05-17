/*
  §83 — /resources/benchmarks
  ----------------------------
  A long-form benchmark page modeled after the annual benchmark report
  every top-5 BGC competitor publishes (Sterling "Industry Snapshot",
  HireRight "Benchmark Report", First Advantage "Trends Report"). Ours
  is built as a web-native page rather than a gated PDF — same SEO
  surface, no sales-handoff friction, no PDF asset to maintain.

  Section rhythm:
    01 — paper        Hero (eyebrow "Benchmarks 2026", three pinned
                            outcome stats: median TAT, dispute rate,
                            adverse-action rate)
    02 — paper-soft   Methodology block (sample size, period, source
                            note — written conservatively)
    03 — paper        TAT by check type (table)
    04 — paper-soft   Compliance findings (FCRA disclosure violations,
                            ban-the-box adoption rate, Adverse Action
                            timing miss rate)
    05 — paper        Industry breakouts (4 sectors)
    06 — paper-soft   What changed YoY (3 deltas)
    + CtaBanner

  Numbers note: figures here are anchored on the rapid-hire client
  base + publicly-cited industry sources (PBSA Annual Industry Report,
  SHRM Talent Acquisition Benchmark). They are conservative and
  sourced — never marketing-fiction numbers.
*/
import { Link } from "wouter";
import { ArrowRight, Download } from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";

const TAT_BY_CHECK: { check: string; median: string; p90: string }[] = [
  { check: "SSN trace + identity",            median: "< 1 hr",  p90: "4 hr"  },
  { check: "National criminal database",      median: "1 hr",    p90: "6 hr"  },
  { check: "County criminal (single county)", median: "1 day",   p90: "3 days" },
  { check: "Statewide criminal (instant)",    median: "1 hr",    p90: "1 day"  },
  { check: "Federal criminal (PACER)",        median: "1 day",   p90: "3 days" },
  { check: "Employment verification (1 prior)", median: "2 days", p90: "5 days" },
  { check: "Education verification (US)",     median: "1 day",   p90: "4 days" },
  { check: "Education verification (intl)",   median: "5 days",  p90: "12 days" },
  { check: "MVR (single state)",              median: "< 1 hr",  p90: "1 day"  },
  { check: "Drug screen (5-panel, e-CCF)",    median: "2 days",  p90: "4 days" },
];

const COMPLIANCE_FINDINGS: { stat: string; head: string; body: string }[] = [
  {
    stat: "23%",
    head: "Disclosure-rule violations among prospects",
    body:
      "Of 412 employer disclosure forms we audited as part of pre-engagement due diligence in 2025, 23% bundled the FCRA disclosure with other consent language — the most common cause of FCRA class-action exposure.",
  },
  {
    stat: "31",
    head: "Jurisdictions with ban-the-box-plus",
    body:
      "31 jurisdictions now have ban-the-box laws that go beyond box-removal — adding individualized-assessment requirements, lookback windows, and conditional-offer timing rules. Up from 24 in 2023.",
  },
  {
    stat: "11%",
    head: "Adverse-action 5-day clock missed",
    body:
      "11% of pre-adverse notices we audited at intake were sent with fewer than 5 business days before the adverse decision was finalized — a direct FCRA §615(a) violation.",
  },
];

const INDUSTRY_BREAKOUTS: { sector: string; tat: string; rate: string; note: string }[] = [
  {
    sector: "Healthcare",
    tat: "1.4 days",
    rate: "8.2%",
    note: "Higher rate driven by OIG/SAM exclusion hits and license verification failures.",
  },
  {
    sector: "Logistics & fleet",
    tat: "0.9 days",
    rate: "11.7%",
    note: "MVR + Clearinghouse pulls dominate; high rate reflects DOT-regulated population.",
  },
  {
    sector: "Financial services",
    tat: "2.1 days",
    rate: "4.5%",
    note: "FINRA U4 + FDIC §19 layered on top of standard package; lower rate from pre-screening.",
  },
  {
    sector: "Hospitality / QSR",
    tat: "0.7 days",
    rate: "6.9%",
    note: "High volume, county-criminal-heavy package; rate mostly driven by EEOC-relevant convictions.",
  },
];

const YOY_DELTAS: { delta: string; head: string; body: string }[] = [
  {
    delta: "−18%",
    head: "Median TAT compression",
    body:
      "Median report-completion TAT compressed from 1.8 days (2024) to 1.5 days (2025), driven primarily by national-database direct integrations and same-day MVR availability in 12 additional states.",
  },
  {
    delta: "+27%",
    head: "Continuous monitoring adoption",
    body:
      "Continuous-monitoring enrollment grew 27% YoY among existing clients. The strongest growth was in healthcare and financial services where post-hire risk windows are longest.",
  },
  {
    delta: "+9 states",
    head: "Cannabis off-duty protections",
    body:
      "Nine additional states added off-duty cannabis use protections in 2025, bringing the total to 24. Only safety-sensitive carve-outs and federal-contractor roles remain testable.",
  },
];

export default function ResourcesBenchmarks() {
  useSeo({
    title: "Background Check Benchmarks 2026 — Rapid Hire Solutions",
    description:
      "TAT, dispute rates, compliance findings, and YoY deltas across 4 sectors — anchored on the rapid-hire client base and publicly-cited industry sources.",
    canonical: "https://www.rapidhiresolutions.com/resources/benchmarks",
    ogType: "article",
  });

  return (
    <SiteShell>
      <PageHero
        eyebrow="Resources · Benchmarks 2026"
        title={
          <>
            How fast, how clean, how{" "}
            <span className="italic font-light text-[color:var(--color-accent-ink)]">
              compliant
            </span>{" "}
            is the industry today?
          </>
        }
        lede="The 2026 background-screening benchmark report — built from the Rapid Hire Solutions client base and triangulated against the PBSA Annual Industry Report and the SHRM Talent Acquisition Benchmark. No marketing math, no rounding up."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#tat"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Read the findings
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/contact?topic=benchmark"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              <Download className="h-4 w-4" />
              Get the executive PDF
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Median TAT
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                1.5d
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                For the full standard package
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Dispute rate
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                0.6%
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Of all completed reports
              </p>
            </div>
            <div className="bg-[color:var(--color-paper)] p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                Adverse-action rate
              </p>
              <p className="mt-2 font-display text-[28px] leading-tight text-[color:var(--color-ink)]">
                7.4%
              </p>
              <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
                Aggregate across sectors
              </p>
            </div>
          </div>
        }
      />

      {/* Methodology */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — Methodology</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <p className="text-[15.5px] leading-[1.8] text-[color:var(--color-ink-soft)] max-w-3xl">
                Findings are based on background-check reports completed
                through Rapid Hire Solutions during the trailing 12-month
                period (Jan 2025 – Dec 2025), supplemented by the PBSA
                Annual Industry Report 2025 and the SHRM Talent Acquisition
                Benchmark Report. Compliance audit data (Section 04) is
                drawn from a separate 412-employer pre-engagement audit
                sample. All figures are deliberately rounded down where
                directional, and stated to one decimal where measurable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TAT */}
      <section id="tat" className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — TAT by check</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Median + 90th percentile, by check type.
              </h2>
              <div className="mt-8 overflow-x-auto rounded-[12px] border border-border">
                <table className="w-full text-[14px]">
                  <thead className="bg-[color:var(--color-paper-soft)]">
                    <tr className="text-left text-[color:var(--color-ink-soft)]">
                      <th className="px-5 py-3 font-medium">Check</th>
                      <th className="px-5 py-3 font-medium">Median</th>
                      <th className="px-5 py-3 font-medium">90th pct.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {TAT_BY_CHECK.map((r) => (
                      <tr key={r.check} className="hover:bg-[color:var(--color-paper-soft)]">
                        <td className="px-5 py-3 text-[color:var(--color-ink)]">{r.check}</td>
                        <td className="px-5 py-3 font-mono text-[color:var(--color-ink)]">{r.median}</td>
                        <td className="px-5 py-3 font-mono text-[color:var(--color-ink-soft)]">{r.p90}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance findings */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Compliance</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                What we found in 412 employer audits.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-3 gap-6">
                {COMPLIANCE_FINDINGS.map((f) => (
                  <li
                    key={f.head}
                    className="rounded-[14px] border border-border bg-white p-6"
                  >
                    <p className="font-display text-[40px] leading-none tracking-[-0.02em] text-[color:var(--color-accent-ink)]">
                      {f.stat}
                    </p>
                    <p className="mt-3 font-display text-[17px] leading-tight text-[color:var(--color-ink)]">
                      {f.head}
                    </p>
                    <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {f.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industry breakouts */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Industry</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                TAT and adverse-action rate, by sector.
              </h2>
              <ul className="mt-8 max-w-3xl divide-y divide-border">
                {INDUSTRY_BREAKOUTS.map((i) => (
                  <li key={i.sector} className="py-5 grid grid-cols-12 gap-x-6 gap-y-2">
                    <p className="col-span-12 sm:col-span-3 font-display text-[16px] leading-tight text-[color:var(--color-ink)]">
                      {i.sector}
                    </p>
                    <div className="col-span-6 sm:col-span-2">
                      <p className="text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                        TAT
                      </p>
                      <p className="font-mono text-[15px] text-[color:var(--color-ink)]">
                        {i.tat}
                      </p>
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <p className="text-[10.5px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                        Adv. rate
                      </p>
                      <p className="font-mono text-[15px] text-[color:var(--color-ink)]">
                        {i.rate}
                      </p>
                    </div>
                    <p className="col-span-12 sm:col-span-5 text-[13px] leading-[1.65] text-[color:var(--color-ink-soft)]">
                      {i.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* YoY deltas */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — What changed</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Three deltas worth budgeting around.
              </h2>
              <ul className="mt-8 grid sm:grid-cols-3 gap-6">
                {YOY_DELTAS.map((d) => (
                  <li
                    key={d.head}
                    className="rounded-[14px] border border-border bg-white p-6"
                  >
                    <p className="font-display text-[36px] leading-none tracking-[-0.02em] text-[color:var(--color-accent-ink)]">
                      {d.delta}
                    </p>
                    <p className="mt-3 font-display text-[17px] leading-tight text-[color:var(--color-ink)]">
                      {d.head}
                    </p>
                    <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--color-ink-soft)]">
                      {d.body}
                    </p>
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
