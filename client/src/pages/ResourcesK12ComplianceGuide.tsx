/*
  Resources — K-12 Compliance Guide (§152)
  ----------------------------------------
  /resources/k12-compliance-guide

  Section rhythm (matches ResourcesMarijuanaLaws.tsx / ResourcesBanTheBox.tsx):

    01 — paper        Hero (eyebrow + title + lede + afterLede CTAs + 4-stat visual)
    02 — paper-soft   Why K-12 screening is its own discipline (narrative)
    03 — paper        State matrix (10 highest-volume states)
    04 — paper-soft   Federal layers (Adam Walsh, ESSA §8546, FCRA, Title VII)
    05 — paper        District workflow checklist (5 numbered moves)
    06 — paper-soft   Companion reading (blog + resource rail)
    + CtaBanner

  Data: client/src/lib/k12ComplianceMatrix.ts (10-state matrix + 4 federal
  layers + derived counts). The hero stat band reads from k12MatrixCounts()
  so future row insertions auto-update.

  Disclaimer posture: explicit "reference, not legal advice" callouts match
  the Ban the Box + Marijuana Laws pages.
*/
import * as React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ChevronRight,
  Download,
  Fingerprint,
  Layers,
  ScrollText,
  Repeat,
  Users,
  ShieldCheck,
} from "lucide-react";
import SiteShell from "@/components/site/SiteShell";
import PageHero from "@/components/site/PageHero";
import CtaBanner from "@/components/site/CtaBanner";
import { useSeo } from "@/hooks/useSeo";
import {
  K12_COMPLIANCE_MATRIX,
  K12_FEDERAL_LAYERS,
  k12MatrixCounts,
} from "@/lib/k12ComplianceMatrix";
import {
  buildK12CompliancePdf,
  buildK12CompliancePdfFilename,
  triggerK12CompliancePdfDownload,
} from "@/lib/k12Pdf";

const WORKFLOW: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}[] = [
  {
    n: "01",
    icon: Fingerprint,
    title: "Confirm the print-and-clearance trigger.",
    body:
      "Identify whether the role is certificated, classified, or contractor; cross-reference state statute to confirm whether FBI/CHRI prints, state-only prints, or a name-based check applies. Document the citation in the offer file so a future audit isn't a scramble.",
  },
  {
    n: "02",
    icon: Users,
    title: "Decide volunteer + contractor scope.",
    body:
      "Several states (FL, PA, CA) extend statutory screening to volunteers and on-campus contractors; others leave it to board policy. Set the threshold once and pipe it into your visitor-management and procurement workflows so a substitute teacher and an HVAC vendor don't get treated the same way.",
  },
  {
    n: "03",
    icon: Layers,
    title: "Apply the tier framework, not just the result.",
    body:
      "FL §1012.32, TX SB 9, and a handful of other states enumerate statutory permanent-bar offenses separately from discretionary review tiers. Build the matrix into your adjudication SOP so a hit on a Tier-1 statute is auto-flagged for re-verification, not silently waived.",
  },
  {
    n: "04",
    icon: Repeat,
    title: "Set the re-fingerprint cadence in writing.",
    body:
      "PA (5 years), FL (5 years), OH (5 years aligned to license renewal), TX + MI (continuous rap-back subscription). Record the cadence in your HRIS and tie it to license-renewal reminders so a 5-year window doesn't lapse during a hiring freeze.",
  },
  {
    n: "05",
    icon: ScrollText,
    title: "Layer FCRA + ESSA §8546 on top.",
    body:
      "Even when state law is satisfied, the federal stack still applies: FCRA disclosure + standalone authorization + pre-adverse-action sequence whenever a CRA assembles the report, plus ESSA §8546 employment-history verification before any federally funded LEA finalizes a hire.",
  },
];

const COMPANION_POSTS: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}[] = [
  {
    eyebrow: "Blog",
    title: "K-12 school employee background-check requirements",
    body:
      "The longer-form companion piece covering the same statutes and how Rapid Hire's intake flow handles each one without an HR director having to remember it.",
    href: "/blog/k12-school-employee-background-check-requirements",
  },
  {
    eyebrow: "Resource",
    title: "Background checks by state",
    body:
      "Every state's lookback window, FCRA-7-year posture, and ban-the-box scope — the broader directory K-12 districts also pull from for non-instructional hires.",
    href: "/resources/background-checks-by-state",
  },
  {
    eyebrow: "Resource",
    title: "Legislative updates",
    body:
      "Living feed for the federal, state, and municipal changes that touch K-12 hiring — including SAVE Act amendments and Jessica Lunsford Act expansions.",
    href: "/resources/legislative-updates",
  },
];

export default function ResourcesK12ComplianceGuide() {
  useSeo({
    title:
      "K-12 Compliance Guide — fingerprint, statute & federal-layer reference",
    description:
      "State-by-state K-12 employment screening reference for school-district HR — fingerprint mandates, re-print cadence, statutory tier handling, and the federal layer (Adam Walsh, ESSA §8546, FCRA, Title VII).",
    canonical:
      "https://www.rapidhiresolutions.com/resources/k12-compliance-guide",
  });

  const counts = k12MatrixCounts();

  /*
    §153 — Click-to-download PDF export. The PDF is generated at click
    time from the same K12_COMPLIANCE_MATRIX / K12_FEDERAL_LAYERS source
    of truth the page renders, so the export cannot drift from the on-
    screen guide. The button sits in the hero `afterLede` slot next to
    the existing two CTAs and uses the same outlined-button styling as
    the Compliance Checklist page's Print/Download controls.
  */
  const [downloadingPdf, setDownloadingPdf] = React.useState(false);
  const handleDownloadPdf = React.useCallback(async () => {
    if (downloadingPdf) return;
    setDownloadingPdf(true);
    try {
      const bytes = await buildK12CompliancePdf();
      triggerK12CompliancePdfDownload(bytes, buildK12CompliancePdfFilename());
    } catch (err) {
      // Keep the failure visible in dev tools; the button re-enables so
      // the user can retry. We deliberately don't pull in the toast
      // system here because the Resources surface doesn't already use it.
      console.error("k12 compliance guide pdf failed", err);
    } finally {
      setDownloadingPdf(false);
    }
  }, [downloadingPdf]);

  return (
    <SiteShell>
      {/* 01 — HERO */}
      <PageHero
        eyebrow="Resources · Vertical guide"
        title="K-12 hiring is its own discipline."
        lede="A school-district HR director navigates five layers at once — state statute, federal floor, license-renewal cadence, volunteer scope, and FCRA. This page maps each layer for the ten states that account for the majority of K-12 employment, with statute citations you can hand to counsel."
        afterLede={
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contact?source=resources&topic=k12-compliance"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95 transition"
              data-testid="k12-guide-cta-primary"
            >
              Schedule a district consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              data-testid="k12-guide-cta-download"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 bg-transparent px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-paper-soft)] disabled:opacity-60 disabled:cursor-progress"
            >
              <Download
                aria-hidden
                className="h-4 w-4 text-[color:var(--color-brand-blue)]"
              />
              {downloadingPdf ? "Building your PDF…" : "Download PDF"}
            </button>
            <Link
              href="/blog/k12-school-employee-background-check-requirements"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-ink)]/15 px-5 py-2.5 text-sm font-medium text-[color:var(--color-ink)] hover:bg-[color:var(--color-paper-soft)] transition"
              data-testid="k12-guide-cta-secondary"
            >
              Read the companion blog post
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        }
        visual={
          <div
            className="grid grid-cols-2 gap-px bg-[color:var(--color-ink)]/10 sm:grid-cols-4"
            data-testid="k12-guide-stats"
          >
            <Stat label="States covered" value={`${counts.states}`} />
            <Stat
              label="Require fingerprint"
              value={`${counts.fingerprintRequiredStates}`}
            />
            <Stat
              label="Continuous rap-back"
              value={`${counts.rapBackStates}`}
            />
            <Stat
              label="Statutory tier states"
              value={`${counts.tieredBarStates}`}
              highlight
            />
          </div>
        }
        belowVisual={
          <p className="mt-4 text-[12px] leading-snug text-[color:var(--color-ink-soft)]">
            <span className="font-medium text-[color:var(--color-ink)]">
              Reference, not legal advice.
            </span>{" "}
            K-12 statutes change; verify with district counsel before updating policy.
          </p>
        }
      />

      {/* 02 — Why this is its own discipline */}
      <section
        className="bg-[color:var(--color-paper-soft)]"
        data-testid="k12-guide-why"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">02 — Why this matters</p>
              <div className="mt-3 hairline" />
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll space-y-4">
              <h2 className="font-display text-[28px] md:text-[36px] leading-[1.1] tracking-[-0.02em] text-[color:var(--color-ink)]">
                State-mandated, statute-tiered, recurring — and not the same job twice.
              </h2>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                A general employment background check answers one question:{" "}
                <em>can we hire this candidate?</em> A K-12 employment
                background check answers four — does state statute require
                fingerprint-based FBI/CHRI, does this offense sit on a
                statutory permanent-bar tier, does the cadence for re-prints
                fall during this candidate's contract, and does the federal
                floor add an obligation state law doesn't mention.
              </p>
              <p className="max-w-3xl text-[17px] leading-[1.75] text-[color:var(--color-ink-soft)]">
                The state matrix below summarises the ten states that together
                cover roughly 58% of public K-12 employment. The federal-layer
                cards directly underneath capture the obligations that apply
                nationally regardless of which state you're hiring in. Every
                row is sourced to a statute citation, but this page is
                reference material — your district counsel still owns the
                legal posture, and we're happy to sit in on the meeting when
                it helps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — State matrix */}
      <section
        id="matrix"
        className="scroll-mt-24 bg-[color:var(--color-paper)]"
        data-testid="k12-guide-matrix"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">03 — State matrix</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Ten states, four facts each. Sorted alphabetically. Citations
                link to the primary statute so counsel can verify in one
                click.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="overflow-x-auto rounded-lg border border-[color:var(--color-ink)]/10">
                <table
                  className="w-full text-[14px]"
                  data-testid="k12-guide-matrix-table"
                >
                  <thead className="bg-[color:var(--color-paper-soft)] text-left">
                    <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:font-medium [&>th]:text-[11px] [&>th]:uppercase [&>th]:tracking-[0.14em] [&>th]:text-[color:var(--color-ink-soft)]">
                      <th>State</th>
                      <th>Fingerprint</th>
                      <th>Re-print cadence</th>
                      <th>Volunteers + contractors</th>
                      <th>Statutory tiers</th>
                      <th>Citation</th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr]:border-t [&>tr]:border-[color:var(--color-ink)]/10 [&>tr>td]:px-4 [&>tr>td]:py-4 [&>tr>td]:align-top">
                    {K12_COMPLIANCE_MATRIX.map((row) => (
                      <tr
                        key={row.code}
                        data-testid={`k12-state-row-${row.code}`}
                      >
                        <td className="font-medium text-[color:var(--color-ink)] whitespace-nowrap">
                          <span className="mr-2 text-[11px] text-[color:var(--color-ink-soft)]">
                            {row.code}
                          </span>
                          {row.state}
                        </td>
                        <td>{row.fingerprintRequired}</td>
                        <td>{row.reFingerprintCadence}</td>
                        <td>{row.volunteerCoverage}</td>
                        <td>{row.tieredOffenseHandling}</td>
                        <td className="text-[color:var(--color-ink-soft)]">
                          <div className="font-mono text-[11px]">
                            {row.statute}
                          </div>
                          <div className="mt-1 text-[12px] leading-relaxed">
                            {row.notes}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[12px] text-[color:var(--color-ink-soft)]">
                For reference, not legal advice. Statutes change; verify with
                district counsel before updating policy. Rapid Hire Solutions
                is happy to walk through any row with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 04 — Federal layers */}
      <section
        className="bg-[color:var(--color-paper-soft)]"
        data-testid="k12-guide-federal"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">04 — Federal layers</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 inline-flex items-center gap-2 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                The floor every district sits on top of.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="grid gap-6 md:grid-cols-2">
                {K12_FEDERAL_LAYERS.map((layer) => (
                  <article
                    key={layer.id}
                    data-testid={`k12-federal-${layer.id}`}
                    className="rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6"
                  >
                    <h3 className="font-display text-[22px] leading-snug text-[color:var(--color-ink)]">
                      {layer.title}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] text-[color:var(--color-ink-soft)]">
                      {layer.citation}
                    </p>
                    <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--color-ink-soft)]">
                      {layer.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — District workflow checklist */}
      <section
        className="bg-[color:var(--color-paper)]"
        data-testid="k12-guide-workflow"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">05 — District workflow</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Five moves that close the gap between statute and HRIS.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <ol className="grid list-none gap-x-10 gap-y-10 md:grid-cols-2">
                {WORKFLOW.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li
                      key={step.n}
                      data-testid={`k12-workflow-${step.n}`}
                      className="flex gap-5"
                    >
                      <span
                        className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]"
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                          Move {step.n}
                        </div>
                        <h3 className="mt-1 font-display text-[20px] leading-snug text-[color:var(--color-ink)]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--color-ink-soft)]">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Companion reading */}
      <section
        className="bg-[color:var(--color-paper-soft)]"
        data-testid="k12-guide-companion"
      >
        <div className="container py-20 md:py-24">
          <div className="grid grid-cols-12 gap-x-8 gap-y-8">
            <div className="col-span-12 lg:col-span-3 reveal-on-scroll">
              <p className="eyebrow">06 — Keep going</p>
              <div className="mt-3 hairline" />
              <p className="mt-6 text-[14px] leading-snug text-[color:var(--color-ink-soft)]">
                Companion reading from the rest of the library.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-9 reveal-on-scroll">
              <div className="grid gap-6 md:grid-cols-3">
                {COMPANION_POSTS.map((c) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    data-testid={`k12-companion-${c.href.split("/").pop()}`}
                    className="group block rounded-lg border border-[color:var(--color-ink)]/10 bg-[color:var(--color-paper)] p-6 transition-colors hover:border-[color:var(--color-brand-blue)]/60"
                  >
                    <div className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-ink-soft)]">
                      {c.eyebrow}
                    </div>
                    <h3 className="mt-2 font-display text-[20px] leading-snug text-[color:var(--color-ink)]">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-soft)]">
                      {c.body}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-[13px] text-[color:var(--color-brand-blue)] group-hover:underline">
                      Read <ChevronRight className="h-3.5 w-3.5" />
                    </span>
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

/* Path constant so the §150 archetype lookup and any future tests can
   pin the canonical route from one place. */
export const K12_COMPLIANCE_GUIDE_PATH = "/resources/k12-compliance-guide";

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`p-5 ${
        highlight
          ? "bg-[color:var(--color-brand-blue)] text-white"
          : "bg-[color:var(--color-paper)]"
      }`}
    >
      <p
        className={`text-[11px] uppercase tracking-[0.18em] ${
          highlight ? "text-white/80" : "text-[color:var(--color-ink-soft)]"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 font-display text-[32px] leading-tight ${
          highlight ? "text-white" : "text-[color:var(--color-ink)]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-2 inline-flex items-center gap-1 text-[12px] leading-snug ${
          highlight ? "text-white/85" : "text-[color:var(--color-ink-soft)]"
        }`}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        {highlight ? "Statutory tiers" : "Statute floor"}
      </p>
    </div>
  );
}
