/*
  Resources — Background Checks by State (§81)
  --------------------------------------------
  Directory hub for /resources/background-checks-by-state.

  Section rhythm:
    01 — paper        Hero (eyebrow + title + lede + national-stat band)
    02 — paper-soft   Why a state guide exists (narrative)
    03 — paper        13 pillar-state cards (grid, links to detail pages)
    04 — paper-soft   Full 50-state directory (alphabetical, region-grouped)
    05 — paper        FAQ accordion
    + CtaBanner
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  ChevronDown,
  MapPin,
  ScrollText,
  Scale,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  STATE_MATRIX,
  STATE_REGIONS,
  statesByRegion,
  highlightStates,
  stateMatrixCounts,
} from "@/lib/stateBackgroundCheckMatrix";

const PILLAR_SLUGS = new Set([
  "california",
  "texas",
  "new-york",
  "florida",
  "illinois",
  "pennsylvania",
  "ohio",
  "georgia",
  "north-carolina",
  "michigan",
  "new-jersey",
  "virginia",
  "washington",
]);

const FAQS: { q: string; a: string }[] = [
  {
    q: "Do federal FCRA rules cover everything I need?",
    a: "No. The FCRA is a floor, not a ceiling. Twenty-plus states have their own consumer-reporting acts, ban-the-box statutes, salary-history rules, or cannabis-employment protections that layer over the federal rules. Multi-state employers commonly need to maintain state addenda and per-state hiring playbooks.",
  },
  {
    q: "How often do these state laws change?",
    a: "Faster than most policies are reviewed. Cannabis-employment law alone has shifted in 14 states since 2021, and pay-scale and AI-hiring rules continue to roll out. We track every meaningful change in the legislative-updates feed and refresh state guides accordingly.",
  },
  {
    q: "Which 13 states get a deep guide right now?",
    a: "California, Texas, New York, Florida, Illinois, Pennsylvania, Ohio, Georgia, North Carolina, Michigan, New Jersey, Virginia, and Washington — the highest-volume employer footprints in the country. Other states are in the directory below with the core compliance facts; deep guides are added based on demand.",
  },
];

export default function ResourcesBackgroundChecksByState() {
  const [openFaqIdx, setOpenFaqIdx] = React.useState<number | null>(null);
  const counts = stateMatrixCounts();
  const pillars = highlightStates();

  useSeo({
    title: "Background Checks by State — 50-state employer guide",
    description:
      "A 50-state directory of US background-check compliance for employers — FCRA layering, ban-the-box scope, salary-history rules, and cannabis posture per state.",
    canonical:
      "https://www.rapidhiresolutions.com/resources/background-checks-by-state",
  });

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · 50-state directory"
        title="Background checks, state by state."
        lede="A working reference for hiring teams who operate across more than one US state. Each row anchors to its named statute, and the thirteen highest-volume states have their own deep guide."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#directory"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Jump to the directory
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/resources/marijuana-laws"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
            >
              Cannabis-laws matrix
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div className="grid grid-cols-3 gap-px bg-[color:var(--color-ink)]/10">
            <Stat
              label="States with private-sector ban-the-box"
              value={`${counts.btbAnyPrivate}`}
              context="Statewide rules covering private employers, before city overrides."
            />
            <Stat
              label="States with cannabis protections"
              value={`${counts.cannabisProtections}`}
              context="Off-duty use, lawful-product, or pre-employment limits."
            />
            <Stat
              label="States with salary-history bans"
              value={`${counts.salaryHistoryBan}`}
              context="Statutory bars on asking about prior pay during hiring."
            />
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            Always confirm against the current statute before publishing employment policy.
          </p>
        }
      />

      {/* 02 — Why this exists */}
      <section className="bg-[color:var(--color-paper-soft)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — Why a state guide</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-4">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                The federal FCRA is a floor, not a finished policy.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                Run the same disclosure form in every state and you’ll be out
                of compliance in roughly twenty of them. California’s ICRAA,
                Illinois’s JOQAA, New York’s Article 23-A balancing test, and
                a growing list of cannabis-employment statutes each impose
                state-specific obligations on top of 15 U.S.C. § 1681.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                This directory is the working reference our screeners use
                when they help clients design multi-state programs. Each row
                cites the named statute. The thirteen highest-volume
                employer states have their own deep guide; the rest are
                covered in the table below with the core facts surfaced.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Pillar state cards */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4 reveal-on-scroll">
            <div>
              <p className="eyebrow">03 — Pillar guides</p>
              <div className="mt-3 hairline" />
              <h2 className="mt-6 font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                Thirteen states with deep guides.
              </h2>
            </div>
            <p className="max-w-md text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
              Highest-volume employer footprints. Each guide includes
              statute citations, hiring-flow steps, and a per-state
              statute reference table.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((s) => (
              <Link
                key={s.slug}
                href={`/resources/background-checks-by-state/${s.slug}`}
                className="group relative block rounded-xl border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-5 transition hover:border-[color:var(--color-brand-blue)]/40 hover:bg-[color:var(--color-paper-soft)]"
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
                    {s.abbr} · {s.region}
                  </p>
                  <ChevronRight className="h-4 w-4 text-[color:var(--color-ink-soft)] transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 font-display text-[22px] leading-tight text-[color:var(--color-ink)]">
                  {s.name}
                </p>
                <ul className="mt-4 space-y-1 text-[12px] text-[color:var(--color-ink-soft)]">
                  <li className="flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5" />
                    Ban-the-box: {s.banTheBox}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <ScrollText className="h-3.5 w-3.5" />
                    Cannabis: {s.marijuanaProtections}
                  </li>
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — Full directory */}
      <section
        id="directory"
        className="scroll-mt-24 bg-[color:var(--color-paper-soft)]"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Full directory</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Grouped by Census region. {STATE_MATRIX.length} states +
                DC. Pillar states link to deep guides; others show core
                compliance facts here.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-12">
              {STATE_REGIONS.map((region) => {
                const rows = statesByRegion(region);
                return (
                  <div key={region}>
                    <h3 className="flex items-center gap-2 font-display text-[20px] tracking-[-0.01em] text-[color:var(--color-ink)]">
                      <MapPin className="h-4 w-4 text-[color:var(--color-brand-blue)]" />
                      {region}
                      <span className="text-[12px] font-normal text-[color:var(--color-ink-soft)]">
                        ({rows.length})
                      </span>
                    </h3>
                    <div className="mt-5 overflow-hidden rounded-lg border border-[color:var(--color-ink)]/10">
                      <table className="w-full text-left text-[14px]">
                        <thead className="bg-[color:var(--color-paper)] text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                          <tr>
                            <th className="px-4 py-3">State</th>
                            <th className="px-4 py-3">Ban-the-box</th>
                            <th className="px-4 py-3">Cannabis</th>
                            <th className="px-4 py-3">Salary-history</th>
                            <th className="px-4 py-3 text-right">Guide</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)]">
                          {rows.map((s) => {
                            const isPillar = PILLAR_SLUGS.has(s.slug);
                            return (
                              <tr key={s.slug}>
                                <td className="px-4 py-3 align-top">
                                  <span className="font-medium text-[color:var(--color-ink)]">
                                    {s.name}
                                  </span>
                                  <span className="ml-2 text-[11px] uppercase tracking-[0.14em] text-[color:var(--color-ink-soft)]">
                                    {s.abbr}
                                  </span>
                                </td>
                                <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                                  {s.banTheBox}
                                </td>
                                <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                                  {s.marijuanaProtections}
                                </td>
                                <td className="px-4 py-3 align-top text-[color:var(--color-ink-soft)]">
                                  {s.salaryHistoryBan ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-3 align-top text-right">
                                  {isPillar ? (
                                    <Link
                                      href={`/resources/background-checks-by-state/${s.slug}`}
                                      className="inline-flex items-center gap-1 text-[13px] font-medium text-[color:var(--color-brand-blue)] hover:underline"
                                    >
                                      Open
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    </Link>
                                  ) : (
                                    <span className="text-[12px] text-[color:var(--color-ink-soft)]">
                                      Reference row
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 05 — FAQ */}
      <section className="bg-[color:var(--color-paper)]">
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — Frequently asked</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-3">
              {FAQS.map((pair, idx) => (
                <details
                  key={idx}
                  open={openFaqIdx === idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
                  }}
                  className="group rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper-soft)] p-5"
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

      <CtaBanner />
    </SiteShell>
  );
}

function Stat({
  label,
  value,
  context,
}: {
  label: string;
  value: string;
  context: string;
}) {
  return (
    <div className="bg-[color:var(--color-paper)] p-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-ink-soft)]">
        {label}
      </p>
      <p className="mt-2 font-display text-[32px] leading-tight text-[color:var(--color-ink)]">
        {value}
      </p>
      <p className="mt-2 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
        {context}
      </p>
    </div>
  );
}
